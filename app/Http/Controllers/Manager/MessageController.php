<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use App\Models\Role;
use App\Notifications\NewMessageNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MessageController extends Controller
{
    /**
     * Display a listing of the conversations.
     */
    public function index(Request $request)
    {
        $manager = Auth::user();
        $perPage = $request->input('per_page', 10);
        $query = $request->input('query', '');
        $filter = $request->input('filter', 'all');
        
        $conversations = Conversation::with(['candidate', 'job'])
            ->where('manager_id', $manager->id)
            ->when($query, function ($q) use ($query) {
                return $q->whereHas('candidate', function ($subQ) use ($query) {
                    $subQ->where('name', 'like', "%{$query}%");
                })->orWhereHas('job', function ($subQ) use ($query) {
                    $subQ->where('title', 'like', "%{$query}%");
                })->orWhere('subject', 'like', "%{$query}%");
            })
            ->when($filter === 'archived', function ($q) {
                return $q->where('is_archived', true);
            })
            ->when($filter === 'unread', function ($q) use ($manager) {
                return $q->whereHas('messages', function ($subQ) use ($manager) {
                    $subQ->where('receiver_id', $manager->id)
                        ->where('is_read', false);
                });
            })
            ->when($filter === 'unarchived', function ($q) {
                return $q->where('is_archived', false);
            })
            ->orderBy('last_message_at', 'desc')
            ->paginate($perPage);
            
        // Add unread count for each conversation
        $conversations->getCollection()->transform(function ($conversation) use ($manager) {
            $conversation->unread_count = $conversation->unreadMessagesCount($manager->id);
            return $conversation;
        });
        
        return Inertia::render('Manager/Messages/Index', [
            'conversations' => $conversations,
            'filters' => [
                'query' => $query,
                'filter' => $filter,
            ],
        ]);
    }

    /**
     * Display the conversation and its messages.
     */
    public function show($messageId)
    {
        $manager = Auth::user();
        
        // Primeiro, encontramos a mensagem pelo ID
        $message = Message::findOrFail($messageId);
        
        // Em seguida, carregamos a conversa relacionada
        $conversation = $message->conversation;
        
        if (!$conversation) {
            abort(404, 'Conversation not found');
        }
        
        // Check if manager is part of this conversation
        if ($conversation->manager_id !== $manager->id) {
            abort(403, 'Unauthorized access to conversation');
        }
        
        // Mark messages as read
        Message::where('conversation_id', $conversation->id)
            ->where('receiver_id', $manager->id)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);
        
        $conversation->load([
            'candidate', 
            'job',
            'messages' => function ($query) {
                $query->with('sender')->latest()->limit(50);
            }
        ]);
        
        // We want messages in chronological order
        $conversation->messages = $conversation->messages->sortBy('created_at')->values();
        
        // Get possible other candidates for transferring conversation
        $candidateRole = Role::where('slug', 'candidate')->first();
        $candidates = User::where('role_id', $candidateRole->id)
            ->select('id', 'name', 'email')
            ->orderBy('name')
            ->get();
            
        return Inertia::render('Manager/Messages/Show', [
            'conversation' => $conversation,
            'candidates' => $candidates,
        ]);
    }

    /**
     * Start a new conversation with a candidate.
     */
    public function create()
    {
        $manager = Auth::user();
        
        // Get company IDs that the manager manages
        $companyIds = $manager->managedCompanies()->pluck('companies.id')->toArray();
        
        // Get candidates who have applied to jobs in companies managed by this manager
        $candidateRole = Role::where('slug', 'candidate')->first();
        $candidates = User::where('role_id', $candidateRole->id)
            ->select('users.id', 'users.name', 'users.email')
            ->join('job_applications', 'users.id', '=', 'job_applications.user_id')
            ->join('jobs', 'job_applications.job_id', '=', 'jobs.id')
            ->whereIn('jobs.company_id', $companyIds)
            ->distinct()
            ->orderBy('users.name')
            ->get();
            
        // Get jobs from managed companies
        $jobs = $manager->managedCompanies()
            ->with(['jobs' => function($query) {
                $query->select('id', 'title', 'company_id');
            }])
            ->get()
            ->pluck('jobs')
            ->flatten()
            ->values();
            
        return Inertia::render('Manager/Messages/Create', [
            'candidates' => $candidates,
            'jobs' => $jobs,
        ]);
    }

    /**
     * Store a new conversation.
     */
    public function store(Request $request)
    {
        $manager = Auth::user();
        
        $validated = $request->validate([
            'candidate_id' => 'required|exists:users,id',
            'job_id' => 'nullable|exists:jobs,id',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
            'attachment' => 'nullable|file|max:10240', // 10MB max
        ]);
        
        // Check if conversation already exists
        $conversation = Conversation::where('candidate_id', $validated['candidate_id'])
            ->where('manager_id', $manager->id)
            ->when(isset($validated['job_id']), function ($query) use ($validated) {
                return $query->where('job_id', $validated['job_id']);
            })
            ->first();
            
        // If no conversation exists, create one
        if (!$conversation) {
            $conversation = Conversation::create([
                'candidate_id' => $validated['candidate_id'],
                'manager_id' => $manager->id,
                'job_id' => $validated['job_id'] ?? null,
                'subject' => $validated['subject'],
                'last_message_at' => now(),
            ]);
        } else {
            // Update last_message_at for existing conversation
            $conversation->update([
                'last_message_at' => now(),
                'is_archived' => false,
            ]);
        }
        
        // Handle attachment if present
        $attachmentPath = null;
        if ($request->hasFile('attachment')) {
            $attachmentPath = $request->file('attachment')->store('message-attachments', 'public');
        }
        
        // Create message
        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $manager->id,
            'receiver_id' => $validated['candidate_id'],
            'body' => $validated['message'],
            'attachment' => $attachmentPath,
        ]);
        
        // Notify candidate
        $candidate = User::find($validated['candidate_id']);
        $candidate->notify(new NewMessageNotification($message));
        
        return redirect()->route('manager.messages.show', $conversation->id)
            ->with('success', 'Message sent successfully');
    }

    /**
     * Send a reply message to the conversation.
     */
    public function reply(Request $request, Conversation $conversation)
    {
        $manager = Auth::user();
        
        // Check if manager is part of this conversation
        if ($conversation->manager_id !== $manager->id) {
            abort(403, 'Unauthorized access to conversation');
        }
        
        $validated = $request->validate([
            'message' => 'required|string',
            'attachment' => 'nullable|file|max:10240', // 10MB max
        ]);
        
        // Handle attachment if present
        $attachmentPath = null;
        if ($request->hasFile('attachment')) {
            $attachmentPath = $request->file('attachment')->store('message-attachments', 'public');
        }
        
        // Create message
        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $manager->id,
            'receiver_id' => $conversation->candidate_id,
            'body' => $validated['message'],
            'attachment' => $attachmentPath,
        ]);
        
        // Update conversation last_message_at
        $conversation->update([
            'last_message_at' => now(),
            'is_archived' => false,
        ]);
        
        // Notify candidate
        $candidate = User::find($conversation->candidate_id);
        $candidate->notify(new NewMessageNotification($message));
        
        return back()->with('success', 'Reply sent successfully');
    }

    /**
     * Toggle archive status of the conversation.
     */
    public function toggleArchive(Conversation $conversation)
    {
        $manager = Auth::user();
        
        // Check if manager is part of this conversation
        if ($conversation->manager_id !== $manager->id) {
            abort(403, 'Unauthorized access to conversation');
        }
        
        $conversation->update([
            'is_archived' => !$conversation->is_archived,
        ]);
        
        return back()->with('success', 
            $conversation->is_archived ? 'Conversation archived' : 'Conversation unarchived'
        );
    }

    /**
     * Download attachment.
     */
    public function downloadAttachment(Message $message)
    {
        $user = Auth::user();
        
        // Check if user is part of this conversation
        if ($message->conversation->manager_id !== $user->id && 
            $message->conversation->candidate_id !== $user->id) {
            abort(403, 'Unauthorized access to attachment');
        }
        
        if (!$message->attachment) {
            abort(404, 'No attachment found');
        }
        
        return Storage::disk('public')->download($message->attachment);
    }

    /**
     * Create a new message from application panel.
     */
    public function createFromApplication(Request $request, $applicationId)
    {
        $manager = Auth::user();
        
        // Get application data
        $application = \App\Models\JobApplication::with(['user', 'job'])
            ->findOrFail($applicationId);
            
        // Check if manager has access to this application
        $companyIds = $manager->managedCompanies()->pluck('companies.id')->toArray();
        if (!in_array($application->job->company_id, $companyIds)) {
            abort(403, 'Anda tidak memiliki akses ke lamaran ini.');
        }
        
        // Get company jobs
        $jobs = $manager->managedCompanies()
            ->with(['jobs' => function($query) {
                $query->select('id', 'title', 'company_id');
            }])
            ->get()
            ->pluck('jobs')
            ->flatten()
            ->values();
            
        // Provide template messages for different purposes
        $templates = [
            [
                'id' => 'interview',
                'name' => 'Undangan Wawancara',
                'subject' => 'Undangan Wawancara untuk ' . $application->job->title,
                'message' => "Halo " . $application->user->name . ",\n\nKami senang untuk mengundang Anda mengikuti wawancara untuk posisi " . $application->job->title . ". \n\nMohon konfirmasi ketersediaan Anda untuk jadwal berikut:\nTanggal: [TANGGAL]\nWaktu: [WAKTU]\nLokasi/Link: [LOKASI/LINK]\n\nTerima kasih,\n" . $manager->name
            ],
            [
                'id' => 'rejection',
                'name' => 'Pemberitahuan Penolakan',
                'subject' => 'Update Aplikasi untuk ' . $application->job->title,
                'message' => "Halo " . $application->user->name . ",\n\nTerima kasih telah melamar untuk posisi " . $application->job->title . ".\n\nSetelah peninjauan yang cermat terhadap semua lamaran, kami memutuskan untuk melanjutkan dengan kandidat lain yang kualifikasinya lebih sesuai dengan kebutuhan kami saat ini.\n\nKami menghargai minat Anda pada perusahaan kami dan mendorong Anda untuk melamar posisi lain di masa mendatang.\n\nTerima kasih,\n" . $manager->name
            ],
            [
                'id' => 'follow_up',
                'name' => 'Pertanyaan Lanjutan',
                'subject' => 'Pertanyaan Lanjutan untuk ' . $application->job->title,
                'message' => "Halo " . $application->user->name . ",\n\nTerima kasih atas lamaran Anda untuk posisi " . $application->job->title . ".\n\nKami memiliki beberapa pertanyaan tambahan mengenai pengalaman Anda:\n\n1. [PERTANYAAN 1]\n2. [PERTANYAAN 2]\n\nMohon berikan tanggapan Anda sesegera mungkin.\n\nTerima kasih,\n" . $manager->name
            ],
            [
                'id' => 'offer',
                'name' => 'Tawaran Kerja',
                'subject' => 'Tawaran Kerja untuk posisi ' . $application->job->title,
                'message' => "Halo " . $application->user->name . ",\n\nKami dengan senang hati menawarkan Anda posisi " . $application->job->title . " di perusahaan kami.\n\nDetail lengkap penawaran:\n- Gaji: [GAJI]\n- Tanggal Mulai: [TANGGAL MULAI]\n- Benefit: [BENEFIT]\n\nMohon konfirmasi penerimaan tawaran ini dalam 7 hari kerja.\n\nSelamat,\n" . $manager->name
            ],
        ];
        
        return Inertia::render('Manager/Messages/CreateFromApplication', [
            'application' => [
                'id' => $application->id,
                'job' => [
                    'id' => $application->job->id,
                    'title' => $application->job->title,
                ],
                'candidate' => [
                    'id' => $application->user->id,
                    'name' => $application->user->name,
                    'email' => $application->user->email,
                ],
            ],
            'jobs' => $jobs,
            'templates' => $templates,
        ]);
    }

    /**
     * Store message from application panel
     */
    public function storeFromApplication(Request $request)
    {
        $manager = Auth::user();
        
        $validated = $request->validate([
            'candidate_id' => 'required|exists:users,id',
            'job_id' => 'required|exists:jobs,id',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
            'attachment' => 'nullable|file|max:10240', // 10MB max
            'schedule_interview' => 'nullable|boolean',
            'interview_date' => 'nullable|required_if:schedule_interview,true|date',
            'interview_time' => 'nullable|required_if:schedule_interview,true',
            'interview_location' => 'nullable|required_if:schedule_interview,true|string',
            'interview_type' => 'nullable|string|in:online,offline',
            'interview_link' => 'nullable|string',
        ]);
        
        // Check if job is managed by this manager
        $managedJobs = $manager->managedCompanies()
            ->with('jobs')
            ->get()
            ->pluck('jobs')
            ->flatten()
            ->pluck('id')
            ->toArray();
            
        if (!in_array($validated['job_id'], $managedJobs)) {
            return back()->with('error', 'Anda tidak memiliki akses ke pekerjaan ini.');
        }
        
        // Check if conversation already exists
        $conversation = Conversation::where('candidate_id', $validated['candidate_id'])
            ->where('manager_id', $manager->id)
            ->where('job_id', $validated['job_id'])
            ->first();
            
        // If no conversation exists, create one
        if (!$conversation) {
            $conversation = Conversation::create([
                'candidate_id' => $validated['candidate_id'],
                'manager_id' => $manager->id,
                'job_id' => $validated['job_id'],
                'subject' => $validated['subject'],
                'last_message_at' => now(),
            ]);
        } else {
            // Update last_message_at for existing conversation
            $conversation->update([
                'last_message_at' => now(),
                'is_archived' => false,
            ]);
        }
        
        // Handle attachment if present
        $attachmentPath = null;
        if ($request->hasFile('attachment')) {
            $attachmentPath = $request->file('attachment')->store('message-attachments', 'public');
        }
        
        // Create message
        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $manager->id,
            'receiver_id' => $validated['candidate_id'],
            'body' => $validated['message'],
            'attachment' => $attachmentPath,
        ]);

        // Handle interview scheduling if requested
        if ($request->schedule_interview) {
            $interviewDate = $validated['interview_date'];
            $interviewTime = $validated['interview_time'];
            
            // Combine date and time
            $startTime = \Carbon\Carbon::parse("$interviewDate $interviewTime");
            $endTime = (clone $startTime)->addHour(); // Default to 1 hour
            
            // Create an event for the interview
            $event = \App\Models\Event::create([
                'title' => 'Wawancara: ' . \App\Models\Job::find($validated['job_id'])->title,
                'description' => "Wawancara untuk posisi " . \App\Models\Job::find($validated['job_id'])->title,
                'start_time' => $startTime,
                'end_time' => $endTime,
                'location' => $validated['interview_location'],
                'meeting_link' => $validated['interview_link'] ?? null,
                'type' => $validated['interview_type'] ?? 'offline',
                'status' => 'scheduled',
                'user_id' => $validated['candidate_id'],
                'job_id' => $validated['job_id'],
                'job_application_id' => $request->input('application_id'),
                'created_by' => $manager->id,
            ]);
            
            // Send calendar invitation to candidate
            $user = \App\Models\User::find($validated['candidate_id']);
            $user->notify(new \App\Notifications\InterviewInvitation($event));
        }
        
        // Send push notification
        try {
            $user = \App\Models\User::find($validated['candidate_id']);
            $user->notify(new NewMessageNotification($message));
        } catch (\Exception $e) {
            \Log::error('Failed to send message notification: ' . $e->getMessage());
        }
        
        if ($request->has('from_application') && $request->from_application) {
            $applicationId = $request->input('application_id');
            return redirect()->route('manager.applications.show', $applicationId)
                ->with('success', 'Pesan berhasil dikirim kepada kandidat.');
        }
        
        return redirect()->route('manager.messages.show', $conversation)
            ->with('success', 'Pesan berhasil dikirim.');
    }
    
    /**
     * Check if a date string is valid for calendar event
     */
    private function isValidDate($date) {
        if (empty($date)) {
            return false;
        }
        
        try {
            $dt = new \DateTime($date);
            return $dt && $dt->format('Y-m-d H:i:s') !== false;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Get analytics data for message responses
     */
    public function analytics()
    {
        $manager = Auth::user();
        
        // Get companies managed by this manager
        $companyIds = $manager->managedCompanies()->pluck('companies.id')->toArray();
        
        // Get conversations where this manager is the sender
        $conversations = Conversation::where('manager_id', $manager->id)
            ->whereIn('job_id', function($query) use ($companyIds) {
                $query->select('id')
                    ->from('jobs')
                    ->whereIn('company_id', $companyIds);
            })
            ->with(['messages', 'candidate', 'job'])
            ->get();
            
        // Calculate response times
        $responseStats = [
            'total_conversations' => $conversations->count(),
            'responded_conversations' => 0,
            'average_response_time' => 0,
            'response_rate' => 0,
            'response_time_distribution' => [
                'under_hour' => 0,
                'under_day' => 0,
                'under_week' => 0,
                'over_week' => 0,
            ],
            'monthly_stats' => [],
        ];
        
        $totalResponseTime = 0;
        $responseTimes = [];
        
        foreach ($conversations as $conversation) {
            $messages = $conversation->messages->sortBy('created_at')->values();
            $candidateResponses = 0;
            
            for ($i = 0; $i < count($messages); $i++) {
                // Skip if we're at the last message or if current message is not from manager
                if ($i == count($messages) - 1 || $messages[$i]->sender_id != $manager->id) {
                    continue;
                }
                
                $managerMessage = $messages[$i];
                
                // Look for next response from candidate
                for ($j = $i + 1; $j < count($messages); $j++) {
                    if ($messages[$j]->sender_id == $conversation->candidate_id) {
                        $candidateMessage = $messages[$j];
                        $responseTime = $candidateMessage->created_at->diffInMinutes($managerMessage->created_at);
                        $totalResponseTime += $responseTime;
                        $responseTimes[] = $responseTime;
                        $candidateResponses++;
                        
                        // Categorize response time
                        if ($responseTime < 60) { // Under 1 hour
                            $responseStats['response_time_distribution']['under_hour']++;
                        } elseif ($responseTime < 1440) { // Under 1 day (24 hours)
                            $responseStats['response_time_distribution']['under_day']++;
                        } elseif ($responseTime < 10080) { // Under 1 week
                            $responseStats['response_time_distribution']['under_week']++;
                        } else { // Over 1 week
                            $responseStats['response_time_distribution']['over_week']++;
                        }
                        
                        break;
                    }
                }
            }
            
            if ($candidateResponses > 0) {
                $responseStats['responded_conversations']++;
            }
        }
        
        // Calculate average response time in minutes
        if (count($responseTimes) > 0) {
            $responseStats['average_response_time'] = round($totalResponseTime / count($responseTimes));
        }
        
        // Calculate response rate
        if ($responseStats['total_conversations'] > 0) {
            $responseStats['response_rate'] = round(($responseStats['responded_conversations'] / $responseStats['total_conversations']) * 100);
        }
        
        // Calculate monthly stats for the last 6 months
        $startDate = \Carbon\Carbon::now()->subMonths(5)->startOfMonth();
        $endDate = \Carbon\Carbon::now()->endOfMonth();
        $monthlyStats = [];
        
        for ($date = $startDate; $date->lte($endDate); $date->addMonth()) {
            $monthStart = clone $date;
            $monthEnd = clone $date;
            $monthEnd->endOfMonth();
            
            $monthName = $monthStart->format('M Y');
            $monthMessages = Message::where('sender_id', $manager->id)
                ->whereHas('conversation', function($query) use ($manager) {
                    $query->where('manager_id', $manager->id);
                })
                ->whereBetween('created_at', [$monthStart, $monthEnd])
                ->count();
                
            $monthlyStats[] = [
                'month' => $monthName,
                'count' => $monthMessages,
            ];
        }
        
        $responseStats['monthly_stats'] = $monthlyStats;
        
        return Inertia::render('Manager/Messages/Analytics', [
            'analytics' => $responseStats,
        ]);
    }

    /**
     * Get recent messages for the navbar indicator
     */
    public function recent()
    {
        $manager = Auth::user();
        
        $messages = Message::where('recipient_id', $manager->id)
            ->with(['sender:id,name,profile_photo_url', 'job:id,title'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function($message) {
                return [
                    'id' => $message->id,
                    'conversation_id' => $message->conversation_id,
                    'sender' => [
                        'id' => $message->sender->id,
                        'name' => $message->sender->name,
                        'avatar' => $message->sender->profile_photo_url
                    ],
                    'message' => $message->message,
                    'is_read' => $message->is_read,
                    'created_at' => $message->created_at,
                    'job' => $message->job ? [
                        'id' => $message->job->id,
                        'title' => $message->job->title
                    ] : null
                ];
            });
        
        $unreadCount = Message::where('recipient_id', $manager->id)
            ->where('is_read', false)
            ->count();
            
        return response()->json([
            'messages' => $messages,
            'unread_count' => $unreadCount
        ]);
    }

    /**
     * Mark a message as read
     */
    public function markAsRead(Message $message)
    {
        // Check if the user has access to this message
        if ($message->recipient_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        
        $message->is_read = true;
        $message->save();
        
        return response()->json(['success' => true]);
    }
}
