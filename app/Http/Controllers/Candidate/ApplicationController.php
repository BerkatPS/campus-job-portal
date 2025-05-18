<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use App\Models\Job;
use App\Models\JobApplication;
use App\Models\ApplicationStatus;
use App\Models\FormResponse;
use App\Models\PortfolioItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ApplicationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Query untuk mendapatkan aplikasi dari user
        $query = JobApplication::where('user_id', Auth::id())
            ->with(['job.company', 'status', 'currentStage', 'events' => function($query) {
                $query->where('start_time', '>=', now())->orderBy('start_time');
            }]);

        // Apply filters
        if ($request->filled('status')) {
            $query->where('status_id', $request->status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('job', function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhereHas('company', function($sq) use ($search) {
                        $sq->where('name', 'like', "%{$search}%");
                    });
            });
        }

        // Order results
        if ($request->filled('sort') && $request->filled('direction')) {
            if ($request->sort === 'job') {
                $query->join('jobs', 'job_applications.job_id', '=', 'jobs.id')
                    ->orderBy('jobs.title', $request->direction)
                    ->select('job_applications.*');
            } elseif ($request->sort === 'company') {
                $query->join('jobs', 'job_applications.job_id', '=', 'jobs.id')
                    ->join('companies', 'jobs.company_id', '=', 'companies.id')
                    ->orderBy('companies.name', $request->direction)
                    ->select('job_applications.*');
            } else {
                $query->orderBy($request->sort, $request->direction);
            }
        } else {
            $query->latest();
        }

        // Paginate results
        $applications = $query->paginate(10)
            ->through(function ($application) {
                // Check if application has a review
                $hasReview = $application->review()->exists();
                $reviewId = $hasReview ? $application->review->id : null;
                
                // Determine if application is in final/completed stage
                $isCompleted = false;
                if (
                    ($application->status->slug === 'hired' || $application->status->slug === 'rejected') &&
                    !$application->current_stage_id // No current stage means application process is complete
                ) {
                    $isCompleted = true;
                }
                
                return [
                    'id' => $application->id,
                    'job' => [
                        'id' => $application->job->id,
                        'title' => $application->job->title,
                        'company' => [
                            'name' => $application->job->company->name,
                            'logo' => $application->job->company->logo ? asset('storage/' . $application->job->company->logo) : null,
                        ],
                    ],
                    'status' => [
                        'name' => $application->status->name,
                        'slug' => $application->status->slug,
                        'color' => $application->status->color,
                    ],
                    'current_stage' => $application->currentStage ? [
                        'name' => $application->currentStage->name,
                        'color' => $application->currentStage->color,
                    ] : null,
                    'upcoming_events' => $application->events->map(function($event) {
                        return [
                            'id' => $event->id,
                            'title' => $event->title,
                            'start_time' => $event->start_time ? $event->start_time->format('Y-m-d H:i:s') : null,
                            'type' => $event->type,
                        ];
                    }),
                    'created_at' => $application->created_at ? $application->created_at->format('Y-m-d') : null,
                    'is_completed' => $isCompleted,
                    'has_review' => $hasReview,
                    'review_id' => $reviewId,
                ];
            });

        // Get filter options
        $statusOptions = ApplicationStatus::orderBy('order')
            ->get()
            ->map(function($status) {
                return [
                    'id' => $status->id,
                    'name' => $status->name,
                    'color' => $status->color,
                ];
            });

        return Inertia::render('Candidate/Applications/Index', [
            'applications' => $applications,
            'filters' => [
                'search' => $request->search ?? '',
                'status' => $request->status ?? null,
                'sort' => $request->sort ?? 'created_at',
                'direction' => $request->direction ?? 'desc',
            ],
            'filterOptions' => [
                'statuses' => $statusOptions,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource (job application).
     */
    public function create(Job $job)
    {
        // Periksa apakah job masih aktif dan menerima aplikasi
        if (!$job->is_active || $job->submission_deadline < now()) {
            return redirect()->route('candidate.jobs.show', $job->id)
                ->with('error', 'Lowongan ini sudah tidak menerima aplikasi lagi.');
        }

        // Periksa apakah user sudah pernah melamar untuk job ini
        $alreadyApplied = JobApplication::where('user_id', Auth::id())
            ->where('job_id', $job->id)
            ->exists();

        if ($alreadyApplied) {
            return redirect()->route('candidate.jobs.show', $job->id)
                ->with('error', 'Anda sudah pernah melamar untuk lowongan ini.');
        }

        // Dapatkan profil kandidat untuk resume
        $candidateProfile = Auth::user()->candidateProfile;

        // Periksa apakah resume ada di profil
        if (!$candidateProfile || !$candidateProfile->resume) {
            return redirect()->route('candidate.profile.edit')
                ->with('error', 'Anda perlu mengunggah resume ke profil sebelum melamar pekerjaan.');
        }

        // Dapatkan portfolio items milik user untuk dipilih
        $portfolioItems = Auth::user()->portfolioItems()
            ->orderBy('is_featured', 'desc')
            ->orderBy('display_order', 'asc')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'title' => $item->title,
                    'description' => $item->description,
                    'type' => $item->type,
                    'type_label' => PortfolioItem::getTypes()[$item->type] ?? $item->type,
                    'thumbnail' => $item->thumbnail ? asset('storage/' . $item->thumbnail) : null,
                    'project_url' => $item->project_url,
                    'repository_url' => $item->repository_url,
                    'is_featured' => $item->is_featured,
                ];
            });

        return Inertia::render('Candidate/Jobs/Apply', [
            'job' => [
                'id' => $job->id,
                'title' => $job->title,
                'company' => [
                    'name' => $job->company->name,
                    'logo' => $job->company->logo ? asset('storage/' . $job->company->logo) : null,
                ],
                'location' => $job->location,
                'job_type' => $job->job_type,
                'submission_deadline' => $job->submission_deadline->format('M d, Y'),
                'days_remaining' => $job->submission_deadline->diffInDays(now()),
            ],
            'candidateProfile' => [
                'user_id' => $candidateProfile->user_id,
                'resume' => $candidateProfile->resume ? asset('storage/' . $candidateProfile->resume) : null,
                'resume_filename' => basename($candidateProfile->resume),
                'has_resume' => !empty($candidateProfile->resume),
                'last_updated' => $candidateProfile->updated_at->format('M d, Y'),
            ],
            'portfolioItems' => $portfolioItems,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Job $job)
    {
        try {
            // Log request yang masuk untuk debugging
            Log::info('Proses pengajuan aplikasi dimulai', [
                'job_id' => $job->id,
                'user_id' => Auth::id(),
                'request_data' => $request->only(['cover_letter', 'portfolio_items']),
            ]);

            // Validasi request
            $validation = $request->validate([
                'cover_letter' => 'required|string|min:10',
                'portfolio_items' => 'nullable|array',
                'portfolio_items.*' => 'exists:portfolio_items,id',
            ], [
                'cover_letter.required' => 'Cover letter wajib diisi',
                'cover_letter.min' => 'Cover letter minimal 10 karakter',
                'portfolio_items.array' => 'Portfolio harus berupa array',
                'portfolio_items.*.exists' => 'Item portfolio yang dipilih tidak valid',
            ]);

            // Periksa apakah job masih aktif dan menerima aplikasi
            if (!$job->is_active || $job->submission_deadline < now()) {
                return redirect()->back()
                    ->with('error', 'Lowongan ini sudah tidak menerima aplikasi lagi.');
            }

            // Periksa apakah user sudah pernah melamar untuk job ini
            $alreadyApplied = JobApplication::where('user_id', Auth::id())
                ->where('job_id', $job->id)
                ->exists();

            if ($alreadyApplied) {
                return redirect()->back()
                    ->with('error', 'Anda sudah pernah melamar untuk lowongan ini.');
            }

            // Dapatkan profil kandidat dan periksa resume
            $candidateProfile = Auth::user()->candidateProfile;
            if (!$candidateProfile || !$candidateProfile->resume) {
                return redirect()->route('candidate.profile.edit')
                    ->with('error', 'Anda perlu mengunggah resume ke profil sebelum melamar pekerjaan.');
            }

            // Dapatkan path resume dari profil
            $resumePath = $candidateProfile->resume;

            // Periksa apakah file resume ada di storage
            if (!Storage::disk('public')->exists($resumePath)) {
                Log::error('File resume tidak ditemukan', [
                    'resume_path' => $resumePath,
                    'user_id' => Auth::id()
                ]);
                return redirect()->route('candidate.profile.edit')
                    ->with('error', 'File resume tidak ditemukan. Silakan unggah ulang resume Anda dan coba lagi.');
            }

            // Dapatkan status awal
            $initialStatus = ApplicationStatus::where('slug', 'pending')->first();

            // Fallback jika status pending tidak ada
            if (!$initialStatus) {
                // Fallback ke status pertama
                $initialStatus = ApplicationStatus::first();

                if (!$initialStatus) {
                    // Buat status default jika tidak ada
                    $initialStatus = ApplicationStatus::create([
                        'name' => 'Pending',
                        'slug' => 'pending',
                        'color' => '#3498db',
                        'description' => 'Aplikasi sedang menunggu review',
                        'order' => 0
                    ]);
                }
            }

            // Dapatkan hiring stage pertama
            $firstStage = $job->hiringStages()->orderBy('job_hiring_stages.order_index')->first();

            // Gunakan transaction untuk memastikan semua operasi database berhasil
            DB::beginTransaction();
            try {
                // Buat aplikasi
                $application = JobApplication::create([
                    'job_id' => $job->id,
                    'user_id' => Auth::id(),
                    'status_id' => $initialStatus->id,
                    'current_stage_id' => $firstStage ? $firstStage->id : null,
                    'cover_letter' => $request->cover_letter,
                    'resume' => $resumePath,
                    'notes' => 'Aplikasi dikirim pada ' . now()->format('Y-m-d H:i:s'),
                ]);

                // Catat stage history awal jika stage ada
                if ($firstStage) {
                    $application->stageHistory()->create([
                        'hiring_stage_id' => $firstStage->id,
                        'user_id' => Auth::id(),
                        'notes' => 'Aplikasi dikirimkan',
                    ]);
                }

                // Tambahkan portfolio items yang dipilih ke aplikasi
                if ($request->has('portfolio_items') && is_array($request->portfolio_items)) {
                    // Verifikasi bahwa portfolio items tersebut milik user
                    $validPortfolioItems = PortfolioItem::where('user_id', Auth::id())
                        ->whereIn('id', $request->portfolio_items)
                        ->pluck('id')
                        ->toArray();
                    
                    $application->portfolioItems()->sync($validPortfolioItems);
                }

                // Kirim notifikasi ke manajer perusahaan jika tersedia
                if ($job->company && method_exists($job->company, 'managers') && $job->company->managers) {
                    try {
                        if (class_exists('\\App\\Notifications\\NewJobApplication')) {
                            $job->company->managers->each(function ($manager) use ($application) {
                                $manager->notify(new \App\Notifications\NewJobApplication($application));
                            });
                        }
                    } catch (\Exception $e) {
                        Log::error('Gagal mengirim notifikasi: ' . $e->getMessage());
                        // Lanjutkan proses meskipun notifikasi gagal
                    }
                }

                // Commit transaction jika semuanya berhasil
                DB::commit();

                Log::info('Aplikasi berhasil dibuat', [
                    'application_id' => $application->id,
                    'resume_path' => $resumePath,
                    'portfolio_items' => $validPortfolioItems ?? []
                ]);

                return redirect()->route('candidate.applications.index')
                    ->with('success', 'Aplikasi Anda telah berhasil dikirim.');
            } catch (\Exception $e) {
                // Rollback transaction jika ada error
                DB::rollBack();

                Log::error('Gagal menyimpan aplikasi: ' . $e->getMessage(), [
                    'job_id' => $job->id,
                    'user_id' => Auth::id(),
                    'trace' => $e->getTraceAsString()
                ]);

                return redirect()->back()
                    ->with('error', 'Terjadi kesalahan saat menyimpan aplikasi. Silakan coba lagi: ' . $e->getMessage())
                    ->withInput();
            }
        } catch (\Exception $e) {
            Log::error('Pengajuan aplikasi gagal: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->back()
                ->with('error', 'Terjadi kesalahan saat mengirim aplikasi Anda: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(JobApplication $application)
    {
        // Pastikan user memiliki aplikasi ini
        if ($application->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        $application->load([
            'job.company',
            'status',
            'currentStage',
            'stageHistory.hiringStage',
            'events' => function($query) {
                $query->orderBy('start_time');
            }
        ]);

        // Format events dengan handling tanggal yang aman
        $events = $application->events->map(function($event) {
            return [
                'id' => $event->id,
                'title' => $event->title,
                'description' => $event->description,
                'type' => $event->type,
                'start_time' => $event->start_time ? $event->start_time->format('Y-m-d H:i:s') : null,
                'end_time' => $event->end_time ? $event->end_time->format('Y-m-d H:i:s') : null,
                'location' => $event->location,
                'meeting_link' => $event->meeting_link,
                'status' => $event->status,
                'notes' => $event->notes,
            ];
        });

        // Format stage history dengan handling tanggal yang aman
        $stageHistory = $application->stageHistory->map(function($history) {
            return [
                'id' => $history->id,
                'stage' => [
                    'name' => $history->hiringStage->name,
                    'color' => $history->hiringStage->color,
                ],
                'date' => $history->created_at ? $history->created_at->format('Y-m-d') : null,
                'notes' => $history->notes,
            ];
        });

        return Inertia::render('Candidate/Applications/Show', [
            'application' => [
                'id' => $application->id,
                'job' => [
                    'id' => $application->job->id,
                    'title' => $application->job->title,
                    'company' => [
                        'name' => $application->job->company->name,
                        'logo' => $application->job->company->logo ? asset('storage/' . $application->job->company->logo) : null,
                    ],
                ],
                'status' => [
                    'name' => $application->status->name,
                    'slug' => $application->status->slug,
                    'color' => $application->status->color,
                ],
                'current_stage' => $application->currentStage ? [
                    'name' => $application->currentStage->name,
                    'color' => $application->currentStage->color,
                ] : null,
                'cover_letter' => $application->cover_letter,
                'resume' => $application->resume ? asset('storage/' . $application->resume) : null,
                'created_at' => $application->created_at->format('M d, Y'),
                'stage_history' => $stageHistory,
                'events' => $events,
            ],
        ]);
    }


    /**
     * Display the list of events for the candidate.
     */
    public function events()
    {
        // Get user data
        $user = Auth::user();
        $user->load('candidateProfile');

        // Calculate profile completion percentage
        $profileFields = [
            $user->avatar,
            $user->candidateProfile->phone ?? null,
            $user->candidateProfile->date_of_birth ?? null,
            $user->candidateProfile->address ?? null,
            $user->candidateProfile->education ?? null,
            $user->candidateProfile->experience ?? null,
            $user->candidateProfile->skills ?? null,
            $user->candidateProfile->resume ?? null,
            $user->candidateProfile->linkedin ?? null,
            $user->candidateProfile->website ?? null
        ];

        $filledFields = array_filter($profileFields, function($field) {
            return !is_null($field) && $field !== '';
        });

        $profileCompletionPercentage = count($filledFields) / count($profileFields) * 100;

        // Get incomplete profile items
        $missingItems = [];
        if (!$user->avatar) $missingItems[] = 'Profile Photo';
        if (!($user->candidateProfile->phone ?? null)) $missingItems[] = 'Phone Number';
        if (!($user->candidateProfile->date_of_birth ?? null)) $missingItems[] = 'Date of Birth';
        if (!($user->candidateProfile->address ?? null)) $missingItems[] = 'Address';
        if (!($user->candidateProfile->education ?? null)) $missingItems[] = 'Education';
        if (!($user->candidateProfile->experience ?? null)) $missingItems[] = 'Experience';
        if (!($user->candidateProfile->skills ?? null)) $missingItems[] = 'Skills';
        if (!($user->candidateProfile->resume ?? null)) $missingItems[] = 'Resume';
        if (!($user->candidateProfile->linkedin ?? null)) $missingItems[] = 'LinkedIn';
        if (!($user->candidateProfile->website ?? null)) $missingItems[] = 'Website';

        // Get events for this user's applications
        $userApplicationIds = Auth::user()->jobApplications()->pluck('id');

        $events = \App\Models\Event::whereIn('job_application_id', $userApplicationIds)
            ->with(['job', 'jobApplication'])
            ->orderBy('start_time')
            ->get()
            ->map(function($event) {
                return [
                    'id' => $event->id,
                    'title' => $event->title,
                    'description' => $event->description,
                    'type' => $event->type,
                    'start_time' => $event->start_time ? $event->start_time->format('Y-m-d H:i:s') : null,
                    'end_time' => $event->end_time ? $event->end_time->format('Y-m-d H:i:s') : null,
                    'location' => $event->location,
                    'meeting_link' => $event->meeting_link,
                    'status' => $event->status,
                    'job' => [
                        'id' => $event->job->id ?? null,
                        'title' => $event->job->title ?? 'Unknown Job',
                        'company' => [
                            'name' => $event->job->company->name ?? 'Unknown Company',
                            'logo' => $event->job->company->logo ? asset('storage/' . $event->job->company->logo) : null,
                        ],
                    ],
                    'application_id' => $event->jobApplication->id ?? null,
                ];
            });

        // Group events by upcoming and past
        $upcomingEvents = $events->filter(function($event) {
            return \Carbon\Carbon::parse($event['start_time'])->isFuture();
        })->sortBy('start_time')->values();

        $pastEvents = $events->filter(function($event) {
            return \Carbon\Carbon::parse($event['start_time'])->isPast();
        })->sortByDesc('start_time')->values();

        return Inertia::render('Candidate/Events/Index', [
            'upcomingEvents' => $upcomingEvents,
            'pastEvents' => $pastEvents,
            'profileCompleteness' => [
                'percentage' => round($profileCompletionPercentage),
                'missingItems' => $missingItems,
                'isComplete' => $profileCompletionPercentage >= 60,
            ],
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'nim' => $user->nim,
                'avatar' => $user->avatar ? asset('storage/' . $user->avatar) : null,
            ],
            'profile' => [
                'date_of_birth' => isset($user->candidateProfile->date_of_birth) ? $user->candidateProfile->date_of_birth->format('Y-m-d') : null,
                'phone' => $user->candidateProfile->phone ?? null,
                'address' => $user->candidateProfile->address ?? null,
                'education' => $user->candidateProfile->education ?? null,
                'experience' => $user->candidateProfile->experience ?? null,
                'skills' => $user->candidateProfile->skills ?? null,
                'linkedin' => $user->candidateProfile->linkedin ?? null,
                'website' => $user->candidateProfile->website ?? null,
                'twitter' => $user->candidateProfile->twitter ?? null,
                'github' => $user->candidateProfile->github ?? null,
                'resume' => $user->candidateProfile->resume ? asset('storage/' . $user->candidateProfile->resume) : null,
            ],
        ]);
    }

    /**
     * Display the specified event.
     */
    public function showEvent($eventId)
    {
        $user = Auth::user();
        $user->load('candidateProfile');

        // Calculate profile completion percentage
        $profileFields = [
            $user->avatar,
            $user->candidateProfile->phone ?? null,
            $user->candidateProfile->date_of_birth ?? null,
            $user->candidateProfile->address ?? null,
            $user->candidateProfile->education ?? null,
            $user->candidateProfile->experience ?? null,
            $user->candidateProfile->skills ?? null,
            $user->candidateProfile->resume ?? null,
            $user->candidateProfile->linkedin ?? null,
            $user->candidateProfile->website ?? null
        ];

        $filledFields = array_filter($profileFields, function($field) {
            return !is_null($field) && $field !== '';
        });

        $profileCompletionPercentage = count($filledFields) / count($profileFields) * 100;

        // If profile is not complete enough, redirect to profile page
        if ($profileCompletionPercentage < 60) {
            return redirect()->route('candidate.profile.index')
                ->with('error', 'You need to complete at least 60% of your profile to view event details.');
        }

        // Get event with related data
        try {
            $event = \App\Models\Event::with(['jobApplication.job.company', 'jobApplication.user', 'job.company'])
                ->whereHas('jobApplication', function($query) use ($user) {
                    $query->where('user_id', $user->id);
                })
                ->findOrFail($eventId);
        } catch (\Exception $e) {
            return redirect()->route('candidate.events')
                ->with('error', 'Event not found or you do not have permission to view it.');
        }

        // Get interviewers from attendees if available
        $interviewers = [];
        if ($event->attendees) {
            // Ensure we get a flat array from attendees
            $attendees = is_array($event->attendees)
                ? $event->attendees
                : (json_decode($event->attendees, true) ?? []);

            // Flatten the array if it contains nested arrays
            $interviewerIds = [];
            foreach ($attendees as $attendee) {
                if (is_array($attendee)) {
                    // If attendee is an array, get its values
                    foreach ($attendee as $id) {
                        if (is_numeric($id)) {
                            $interviewerIds[] = $id;
                        }
                    }
                } elseif (is_numeric($attendee)) {
                    // If attendee is a scalar, use it directly
                    $interviewerIds[] = $attendee;
                }
            }

            // If there are valid interviewer IDs
            if (!empty($interviewerIds)) {
                $interviewers = \App\Models\User::whereIn('id', $interviewerIds)
                    ->get()
                    ->map(function($interviewer) {
                        return [
                            'id' => $interviewer->id,
                            'name' => $interviewer->name,
                            'email' => $interviewer->email,
                            'avatar' => $interviewer->avatar ? asset('storage/' . $interviewer->avatar) : null,
                            'title' => property_exists($interviewer, 'companyManager') && $interviewer->companyManager
                                ? $interviewer->companyManager->title
                                : 'Interviewer'
                        ];
                    });
            }
        }

        return Inertia::render('Candidate/Events/Show', [
            'event' => [
                'id' => $event->id,
                'title' => $event->title,
                'description' => $event->description,
                'type' => $event->type,
                'location' => $event->location,
                'meeting_link' => $event->meeting_link,
                'start_time' => $event->start_time->format('Y-m-d H:i'),
                'end_time' => $event->end_time ? $event->end_time->format('Y-m-d H:i') : null,
                'status' => $event->status,
                'notes' => $event->notes,
                'created_at' => $event->created_at->format('Y-m-d H:i'),
                'application' => [
                    'id' => $event->jobApplication->id,
                    'job' => [
                        'id' => $event->jobApplication->job->id,
                        'title' => $event->jobApplication->job->title,
                        'company' => [
                            'id' => $event->jobApplication->job->company->id,
                            'name' => $event->jobApplication->job->company->name,
                            'logo' => $event->jobApplication->job->company->logo ?
                                asset('storage/' . $event->jobApplication->job->company->logo) : null,
                        ],
                    ],
                ],
            ],
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar ? asset('storage/' . $user->avatar) : null,
            ],
            'interviewers' => $interviewers,
        ]);
    }

    /**
     * Confirm attendance to an event.
     */
    public function confirmEvent($eventId)
    {
        $user = Auth::user();

        try {
            // Find event and ensure it belongs to the logged-in user
            $event = \App\Models\Event::whereHas('jobApplication', function($query) use ($user) {
                $query->where('user_id', $user->id);
            })->findOrFail($eventId);

            // Update event status
            $event->update([
                'status' => 'confirmed',
            ]);

            // Add notification to manager
            if ($event->job && $event->job->company) {
                if (method_exists($event->job->company, 'managers') && $event->job->company->managers) {
                    foreach ($event->job->company->managers as $manager) {
                        $manager->notify(new \App\Notifications\EventConfirmed($event, [
                            'candidate_id' => $user->id,
                            'candidate_name' => $user->name,
                        ]));
                    }
                }
            }

            return redirect()->back()->with('success', 'Your attendance has been confirmed.');
        } catch (\Exception $e) {
            Log::error('Event confirmation failed: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to confirm attendance. Please try again.');
        }
    }


    /**
     * Cancel attendance to an event.
     */
    public function cancelEvent($eventId)
    {
        $user = Auth::user();
        $reason = request('reason');

        try {
            // Find event and ensure it belongs to the logged-in user
            $event = \App\Models\Event::whereHas('jobApplication', function($query) use ($user) {
                $query->where('user_id', $user->id);
            })->findOrFail($eventId);

            // Update event status
            $event->update([
                'status' => 'canceled',
                'notes' => $reason
                    ? 'Canceled by candidate: ' . $reason
                    : 'Canceled by candidate'
            ]);

            // Add notification to manager
            if ($event->job && $event->job->company) {
                if (method_exists($event->job->company, 'managers') && $event->job->company->managers) {
                    foreach ($event->job->company->managers as $manager) {
                        $manager->notify(new \App\Notifications\EventCancelled($event, [
                            'candidate_id' => $user->id,
                            'candidate_name' => $user->name,
                            'reason' => $reason,
                        ]));
                    }
                }
            }

            return redirect()->back()->with('success', 'Event has been canceled.');
        } catch (\Exception $e) {
            Log::error('Event cancellation failed: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to cancel event. Please try again.');
        }
    }


    /**
     * Add a note to an event.
     */
    public function addEventNote($eventId)
    {
        $user = Auth::user();
        $note = request('note');

        if (empty($note)) {
            return redirect()->back()->with('error', 'Note cannot be empty.');
        }

        try {
            // Find event and ensure it belongs to the logged-in user
            $event = \App\Models\Event::whereHas('jobApplication', function($query) use ($user) {
                $query->where('user_id', $user->id);
            })->findOrFail($eventId);

            // If event already has notes, append new note
            if ($event->notes) {
                $event->notes = $event->notes . "\n\n" . date('Y-m-d H:i') . " - Candidate: " . $note;
            } else {
                $event->notes = date('Y-m-d H:i') . " - Candidate: " . $note;
            }

            $event->save();

            return redirect()->back()->with('success', 'Note added successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to add event note: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to add note. Please try again.');
        }
    }

    /**
     * Withdraw an application.
     */
    public function withdraw(JobApplication $application)
    {
        // Ensure user owns this application
        if ($application->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        try {
            // Get withdrawn status
            $withdrawnStatus = ApplicationStatus::where('slug', 'withdrawn')->first();

            if (!$withdrawnStatus) {
                // Create withdrawn status if it doesn't exist
                $withdrawnStatus = ApplicationStatus::create([
                    'name' => 'Withdrawn',
                    'slug' => 'withdrawn',
                    'color' => '#777777',
                    'description' => 'Application withdrawn by candidate',
                    'order' => 99
                ]);
            }

            // Update application status to withdrawn
            $application->update([
                'status_id' => $withdrawnStatus->id,
                'notes' => ($application->notes ? $application->notes . "\n\n" : '') .
                    "Application withdrawn by candidate on " . now()->format('d M Y H:i')
            ]);

            // Add note to stage history if available
            if ($application->currentStage) {
                $application->stageHistory()->create([
                    'hiring_stage_id' => $application->current_stage_id,
                    'user_id' => Auth::id(),
                    'notes' => 'Candidate withdrew application',
                ]);
            }

            if ($application->currentStage) {
                $application->stageHistory()->create([
                    'hiring_stage_id' => $application->current_stage_id,
                    'user_id' => Auth::id(),
                    'notes' => 'Candidate withdrew application',
                ]);
            }

            // Notify company managers about withdrawal
            if ($application->job && $application->job->company &&
                method_exists($application->job->company, 'managers') &&
                $application->job->company->managers) {
                foreach ($application->job->company->managers as $manager) {
                    $manager->notify(new \App\Notifications\ApplicationWithdrawn($application, [
                        'candidate_id' => Auth::id(),
                        'candidate_name' => Auth::user()->name,
                    ]));
                }
            }


            return redirect()->route('candidate.applications.index')
                ->with('success', 'Your application has been successfully withdrawn.');
        } catch (\Exception $e) {
            Log::error('Application withdrawal failed: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to withdraw application. Please try again.');
        }
    }
}
