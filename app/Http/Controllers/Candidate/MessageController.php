<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Job;
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
        $candidate = Auth::user();
        $perPage = $request->input('per_page', 10);
        $query = $request->input('query', '');
        $filter = $request->input('filter', 'all');
        
        $conversations = Conversation::with(['manager', 'job'])
            ->where('candidate_id', $candidate->id)
            ->when($query, function ($q) use ($query) {
                return $q->whereHas('manager', function ($subQ) use ($query) {
                    $subQ->where('name', 'like', "%{$query}%");
                })->orWhereHas('job', function ($subQ) use ($query) {
                    $subQ->where('title', 'like', "%{$query}%");
                })->orWhere('subject', 'like', "%{$query}%");
            })
            ->when($filter === 'archived', function ($q) {
                return $q->where('is_archived', true);
            })
            ->when($filter === 'unread', function ($q) use ($candidate) {
                return $q->whereHas('messages', function ($subQ) use ($candidate) {
                    $subQ->where('receiver_id', $candidate->id)
                        ->where('is_read', false);
                });
            })
            ->when($filter === 'unarchived', function ($q) {
                return $q->where('is_archived', false);
            })
            ->orderBy('last_message_at', 'desc')
            ->paginate($perPage);
            
        // Add unread count for each conversation
        $conversations->getCollection()->transform(function ($conversation) use ($candidate) {
            $conversation->unread_count = $conversation->unreadMessagesCount($candidate->id);
            return $conversation;
        });
        
        return Inertia::render('Candidate/Messages/Index', [
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
    public function show(Conversation $conversation)
    {
        $candidate = Auth::user();
        
        // Check if candidate is part of this conversation
        if ($conversation->candidate_id !== $candidate->id) {
            abort(403, 'Unauthorized access to conversation');
        }
        
        // Mark messages as read
        Message::where('conversation_id', $conversation->id)
            ->where('receiver_id', $candidate->id)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);
        
        $conversation->load([
            'manager', 
            'job',
            'messages' => function ($query) {
                $query->with('sender')->latest()->limit(50);
            }
        ]);
        
        // We want messages in chronological order
        $conversation->messages = $conversation->messages->sortBy('created_at')->values();
            
        return Inertia::render('Candidate/Messages/Show', [
            'conversation' => $conversation,
        ]);
    }

    /**
     * Start a new conversation with a manager.
     */
    public function create(Request $request)
    {
        $candidate = Auth::user();
        $jobId = $request->input('job_id');
        
        // Get jobs that the candidate has applied to
        $jobs = Job::select('jobs.id', 'jobs.title', 'companies.name as company_name')
            ->join('job_applications', 'jobs.id', '=', 'job_applications.job_id')
            ->join('companies', 'jobs.company_id', '=', 'companies.id')
            ->where('job_applications.user_id', $candidate->id)
            ->distinct()
            ->get();
            
        // Pre-select job if job_id is provided
        $selectedJob = null;
        $managers = collect();
        
        if ($jobId) {
            $selectedJob = Job::with('company')->findOrFail($jobId);
            
            // Get managers of the selected job's company
            $managerRole = Role::where('slug', 'manager')->first();
            $managers = User::where('role_id', $managerRole->id)
                ->select('users.id', 'users.name', 'users.email')
                ->join('company_managers', 'users.id', '=', 'company_managers.user_id')
                ->where('company_managers.company_id', $selectedJob->company_id)
                ->orderBy('users.name')
                ->get();
        }
            
        return Inertia::render('Candidate/Messages/Create', [
            'jobs' => $jobs,
            'managers' => $managers,
            'selectedJobId' => $jobId,
        ]);
    }
    
    /**
     * Get managers for a specific job.
     */
    public function getManagersForJob(Request $request)
    {
        $jobId = $request->input('job_id');
        $job = Job::findOrFail($jobId);
        
        // Get managers of the job's company
        $managerRole = Role::where('slug', 'manager')->first();
        $managers = User::where('role_id', $managerRole->id)
            ->select('users.id', 'users.name', 'users.email')
            ->join('company_managers', 'users.id', '=', 'company_managers.user_id')
            ->where('company_managers.company_id', $job->company_id)
            ->orderBy('users.name')
            ->get();
            
        return response()->json($managers);
    }

    /**
     * Store a new conversation.
     */
    public function store(Request $request)
    {
        $candidate = Auth::user();
        
        $validated = $request->validate([
            'manager_id' => 'required|exists:users,id',
            'job_id' => 'required|exists:jobs,id',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
            'attachment' => 'nullable|file|max:10240', // 10MB max
        ]);
        
        // Check if the job belongs to a company managed by the manager
        $job = Job::findOrFail($validated['job_id']);
        $isManagerOfJob = User::find($validated['manager_id'])
            ->managedCompanies()
            ->where('companies.id', $job->company_id)
            ->exists();
            
        if (!$isManagerOfJob) {
            return back()->withErrors(['manager_id' => 'The selected manager does not manage this job']);
        }
        
        // Check if conversation already exists
        $conversation = Conversation::where('candidate_id', $candidate->id)
            ->where('manager_id', $validated['manager_id'])
            ->where('job_id', $validated['job_id'])
            ->first();
            
        // If no conversation exists, create one
        if (!$conversation) {
            $conversation = Conversation::create([
                'candidate_id' => $candidate->id,
                'manager_id' => $validated['manager_id'],
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
            'sender_id' => $candidate->id,
            'receiver_id' => $validated['manager_id'],
            'body' => $validated['message'],
            'attachment' => $attachmentPath,
        ]);
        
        // Notify manager
        $manager = User::find($validated['manager_id']);
        $manager->notify(new NewMessageNotification($message));
        
        return redirect()->route('candidate.messages.show', $conversation->id)
            ->with('success', 'Message sent successfully');
    }

    /**
     * Send a reply message to the conversation.
     */
    public function reply(Request $request, Conversation $conversation)
    {
        $candidate = Auth::user();
        
        // Check if candidate is part of this conversation
        if ($conversation->candidate_id !== $candidate->id) {
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
            'sender_id' => $candidate->id,
            'receiver_id' => $conversation->manager_id,
            'body' => $validated['message'],
            'attachment' => $attachmentPath,
        ]);
        
        // Update conversation last_message_at
        $conversation->update([
            'last_message_at' => now(),
            'is_archived' => false,
        ]);
        
        // Notify manager
        $manager = User::find($conversation->manager_id);
        $manager->notify(new NewMessageNotification($message));
        
        return back()->with('success', 'Reply sent successfully');
    }

    /**
     * Toggle archive status of the conversation.
     */
    public function toggleArchive(Conversation $conversation)
    {
        $candidate = Auth::user();
        
        // Check if candidate is part of this conversation
        if ($conversation->candidate_id !== $candidate->id) {
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
}
