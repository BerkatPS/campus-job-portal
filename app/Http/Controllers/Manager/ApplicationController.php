<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Models\JobApplication;
use App\Models\ApplicationStatus;
use App\Models\HiringStage;
use App\Models\Job;
use App\Models\Event;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\JobApplicationsExport;

class ApplicationController extends Controller
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Display a listing of applications.
     */
    public function index(Request $request): \Inertia\Response
    {
        // Get manager's companies
        $companyIds = Auth::user()->managedCompanies()->pluck('companies.id')->toArray();

        // Base query
        $query = JobApplication::with(['job.company', 'user', 'currentStage', 'status'])
            ->whereHas('job', function ($q) use ($companyIds) {
                $q->whereIn('company_id', $companyIds);
            })
            ->orderBy('created_at', 'desc');

        // Apply filters
        if ($request->has('status') && $request->status) {
            $query->withStatus($request->status);
        }

        if ($request->has('stage') && $request->stage) {
            $query->atStage($request->stage);
        }

        if ($request->has('job_id') && $request->job_id) {
            $query->where('job_id', $request->job_id);
        }

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->whereHas('user', function ($q2) use ($search) {
                    $q2->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('nim', 'like', "%{$search}%");
                })
                    ->orWhereHas('job', function ($q2) use ($search) {
                        $q2->where('title', 'like', "%{$search}%");
                    });
            });
        }

        // Show favorites if requested
        if ($request->has('favorites') && $request->favorites) {
            $query->favorites();
        }

        $applications = $query->paginate(15);

        // Get filter options
        $statuses = ApplicationStatus::orderBy('order')->get();
        $stages = HiringStage::orderBy('order_index')->get();
        $jobs = Job::whereIn('company_id', $companyIds)->get(['id', 'title']);

        return Inertia::render('Manager/Applications/Index', [
            'applications' => $applications,
            'filters' => [
                'statuses' => $statuses,
                'stages' => $stages,
                'jobs' => $jobs,
            ],
            'search' => $request->search,
            'selectedFilters' => $request->only(['status', 'stage', 'job_id', 'favorites']),
        ]);
    }

    public function show(JobApplication $application)
    {
        // Load relationships
        $application->load([
            'job.company',
            'job.category',
            'user.candidateProfile',
            'currentStage',
            'status',
            'stageHistory.hiringStage',
            'stageHistory.user',
            'formResponses.formField',
        ]);

        // Get available statuses and stages for this job
        $statuses = ApplicationStatus::orderBy('order')->get();
        $stages = $application->job->hiringStages()->orderBy('job_hiring_stages.order_index')->get();

        // Get events related to this application
        $events = Event::where('job_application_id', $application->id)
            ->orderBy('start_time')
            ->get()
            ->map(function($event) {
                return [
                    'id' => $event->id,
                    'title' => $event->title,
                    'description' => $event->description,
                    'start_time' => $event->start_time,
                    'end_time' => $event->end_time,
                    'location' => $event->location,
                    'meeting_link' => $event->meeting_link,
                    'type' => $event->type,
                    'status' => $event->status,
                ];
            });

        return Inertia::render('Manager/Applications/Show', [
            'application' => [
                'id' => $application->id,
                'job' => [
                    'id' => $application->job->id,
                    'title' => $application->job->title,
                    'location' => $application->job->location,
                    'job_type' => $application->job->job_type,
                    'experience_level' => $application->job->experience_level,
                    'submission_deadline' => $application->job->submission_deadline,
                    'vacancies' => $application->job->vacancies,
                    'is_salary_visible' => $application->job->is_salary_visible,
                    'salary_min' => $application->job->salary_min,
                    'salary_max' => $application->job->salary_max,
                    'category' => $application->job->category ? [
                        'id' => $application->job->category->id,
                        'name' => $application->job->category->name,
                    ] : null,
                    'company' => [
                        'id' => $application->job->company->id,
                        'name' => $application->job->company->name,
                        'logo' => $application->job->company->logo ? asset('storage/' . $application->job->company->logo) : null,
                    ],
                ],
                'user' => [
                    'id' => $application->user->id,
                    'name' => $application->user->name,
                    'email' => $application->user->email,
                    'nim' => $application->user->nim,
                    'avatar' => $application->user->avatar ? asset('storage/' . $application->user->avatar) : null,
                    'profile' => $application->user->candidateProfile ? [
                        'phone' => $application->user->candidateProfile->phone,
                        'address' => $application->user->candidateProfile->address,
                        'education' => $application->user->candidateProfile->education,
                        'experience' => $application->user->candidateProfile->experience,
                        'skills' => $application->user->candidateProfile->skills,
                        'linkedin' => $application->user->candidateProfile->linkedin,
                        'github' => $application->user->candidateProfile->github,
                        'website' => $application->user->candidateProfile->website,
                    ] : null,
                ],
                'current_stage' => $application->currentStage ? [
                    'id' => $application->currentStage->id,
                    'name' => $application->currentStage->name,
                    'color' => $application->currentStage->color,
                ] : null,
                'status' => [
                    'id' => $application->status->id,
                    'name' => $application->status->name,
                    'color' => $application->status->color,
                ],
                'cover_letter' => $application->cover_letter,
                'resume' => $application->resume,
                'resume_url' => $application->resume ? asset('storage/' . $application->resume) : null,
                'notes' => $application->notes,
                'is_favorite' => $application->is_favorite,
                'created_at' => $application->created_at,
                'stage_history' => $application->stageHistory->map(function ($history) {
                    return [
                        'id' => $history->id,
                        'stage' => [
                            'id' => $history->hiringStage->id,
                            'name' => $history->hiringStage->name,
                            'color' => $history->hiringStage->color,
                        ],
                        'user' => $history->user ? [
                            'id' => $history->user->id,
                            'name' => $history->user->name,
                        ] : null,
                        'notes' => $history->notes,
                        'created_at' => $history->created_at,
                    ];
                }),
                'form_responses' => $application->formResponses->map(function ($response) {
                    return [
                        'id' => $response->id,
                        'field' => [
                            'id' => $response->formField->id,
                            'name' => $response->formField->name,
                            'field_type' => $response->formField->field_type,
                        ],
                        'response_value' => $response->formField->field_type === 'file'
                            ? asset('storage/' . $response->response_value)
                            : $response->response_value,
                    ];
                }),
            ],
            'statuses' => $statuses,
            'stages' => $stages->map(function ($stage) {
                return [
                    'id' => $stage->id,
                    'name' => $stage->name,
                    'color' => $stage->color,
                    'description' => $stage->description,
                ];
            }),
            'events' => $events,
        ]);
    }

    /**
     * Update the application status.
     */
    public function updateStatus(Request $request, JobApplication $application)
    {
        $request->validate([
            'status_id' => 'required|exists:application_statuses,id',
        ]);

        // Check if user has access to this application
        if (!$this->hasAccessToApplication($application)) {
            return back()->with('error', 'You do not have permission to update this application.');
        }

        $oldStatus = $application->status;
        $application->update(['status_id' => $request->status_id]);
        $newStatus = $application->fresh()->status;

        try {
            // Send notification to candidate
            $this->notificationService->sendNotification(
                $application->user,
                \App\Notifications\ApplicationStatusUpdated::class,
                $application,
                [
                    'old_status' => $oldStatus->name,
                    'new_status' => $newStatus->name,
                ]
            );
        } catch (\Exception $e) {
            // Log error but don't fail the request
            \Log::error('Failed to send application status notification: ' . $e->getMessage());
        }

        return back()->with('success', 'Application status updated successfully.');
    }




    /**
     * Update the application stage.
     */
    /**
     * Update the application stage.
     */
    public function updateStage(Request $request, JobApplication $application)
    {
        $request->validate([
            'stage_id' => 'required|exists:hiring_stages,id',
            'notes' => 'nullable|string',
        ]);

        // Check if user has access to this application
        if (!$this->hasAccessToApplication($application)) {
            return back()->with('error', 'Anda tidak memiliki akses ke aplikasi ini.');
        }

        $oldStage = $application->currentStage;

        // Update current stage
        $application->update([
            'current_stage_id' => $request->stage_id,
        ]);

        // Add to stage history
        $application->stageHistory()->create([
            'hiring_stage_id' => $request->stage_id,
            'user_id' => Auth::id(),
            'notes' => $request->notes,
        ]);

        // Get new stage information
        $newStage = HiringStage::find($request->stage_id);

        try {
            // Notify candidate about stage update using a non-queued notification
            // Avoid queue system temporarily if it's causing issues
            $notificationData = [
                'old_stage' => $oldStage ? $oldStage->name : 'Initial',
                'new_stage' => $newStage->name,
                'notes' => $request->notes,
            ];

            // Option 1: Use notification without queue
            $application->user->notify(new \App\Notifications\ApplicationStageUpdated($application, $notificationData));

            // Option 2: Alternative approach - store notification directly in database
            // This can be used as fallback if the notification system is having issues
            /*
            \Illuminate\Support\Facades\DB::table('notifications')->insert([
                'id' => \Illuminate\Support\Str::uuid()->toString(),
                'type' => 'App\Notifications\ApplicationStageUpdated',
                'notifiable_type' => 'App\Models\User',
                'notifiable_id' => $application->user->id,
                'data' => json_encode([
                    'job_application_id' => $application->id,
                    'job_id' => $application->job_id,
                    'job_title' => $application->job->title,
                    'company_name' => $application->job->company->name,
                    'old_stage' => $notificationData['old_stage'],
                    'new_stage' => $notificationData['new_stage'],
                    'notes' => $notificationData['notes'] ?? null,
                    'updated_by' => Auth::id(),
                    'type' => 'stage_updated'
                ]),
                'read_at' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            */

            return back()->with('success', 'Tahap lamaran berhasil diperbarui.');
        } catch (\Exception $e) {
            // Log error for debugging but still return success to user
            \Illuminate\Support\Facades\Log::error('Error sending notification: ' . $e->getMessage());
            return back()->with('success', 'Tahap lamaran berhasil diperbarui, tetapi notifikasi tidak terkirim.');
        }
    }


    /**
     * Toggle favorite status.
     */
    public function toggleFavorite(JobApplication $application)
    {
        $application->update([
            'is_favorite' => !$application->is_favorite,
        ]);

        $application->user->notify(new \App\Notifications\ApplicationFavorited($application, [
            'updated_by' => Auth::id(),
            'updated_by_name' => Auth::user()->name,
        ]));

        return back()->with('success', 'Status favorit berhasil diperbarui.');
    }

    /**
     * Update application notes.
     */
    public function updateNotes(Request $request, JobApplication $application)
    {
        $request->validate([
            'notes' => 'nullable|string',
        ]);

        $application->update([
            'notes' => $request->notes,
        ]);

        $application->user->notify(new \App\Notifications\ApplicationNoteAdded($application, [
            'added_by' => Auth::id(),
            'added_by_name' => Auth::user()->name,
        ]));

        return back()->with('success', 'Catatan berhasil diperbarui.');
    }

    /**
     * Export applications to Excel/CSV.
     */
    public function export(Request $request)
    {
        // Get manager's companies
        $companyIds = Auth::user()->managedCompanies()->pluck('companies.id')->toArray();

        // Base query for applications
        $query = JobApplication::with(['job.company', 'user', 'currentStage', 'status'])
            ->whereHas('job', function ($q) use ($companyIds) {
                $q->whereIn('company_id', $companyIds);
            });

        // Apply filters
        if ($request->has('status') && $request->status) {
            $query->withStatus($request->status);
        }

        if ($request->has('job_id') && $request->job_id) {
            $query->where('job_id', $request->job_id);
        }

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->whereHas('user', function ($q2) use ($search) {
                    $q2->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                })
                    ->orWhereHas('job', function ($q2) use ($search) {
                        $q2->where('title', 'like', "%{$search}%");
                    });
            });
        }

        // Get all applications
        $applications = $query->get();

        // Export the data
        return Excel::download(new JobApplicationsExport($applications), 'job_applications.csv');
    }

    /**
     * Show Kanban board view of applications.
     */
    public function kanbanView(Request $request)
    {
        // Get manager's companies
        $companyIds = Auth::user()->managedCompanies()->pluck('companies.id')->toArray();

        // Get job if specified
        $job = null;
        if ($request->has('job_id') && $request->job_id) {
            $job = Job::whereIn('company_id', $companyIds)
                ->where('id', $request->job_id)
                ->first();
        }

        // Get hiring stages
        $stages = $job
            ? $job->hiringStages()->orderBy('job_hiring_stages.order_index')->get()
            : HiringStage::orderBy('order_index')->get();

        // Base query for applications
        $query = JobApplication::with(['job.company', 'user', 'status'])
            ->whereHas('job', function ($q) use ($companyIds) {
                $q->whereIn('company_id', $companyIds);
            });

        // Filter by job if specified
        if ($job) {
            $query->where('job_id', $job->id);
        }

        // Apply search filter if provided
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->whereHas('user', function ($q2) use ($search) {
                    $q2->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('nim', 'like', "%{$search}%");
                })
                    ->orWhereHas('job', function ($q2) use ($search) {
                        $q2->where('title', 'like', "%{$search}%");
                    });
            });
        }

        // Get all applications
        $applications = $query->get();

        // Group applications by stage
        $columns = $stages->map(function ($stage) use ($applications) {
            return [
                'id' => $stage->id,
                'name' => $stage->name,
                'color' => $stage->color,
                'applications' => $applications->where('current_stage_id', $stage->id)
                    ->map(function ($application) {
                        return [
                            'id' => $application->id,
                            'job' => [
                                'id' => $application->job->id,
                                'title' => $application->job->title,
                                'company' => [
                                    'name' => $application->job->company->name,
                                ]
                            ],
                            'user' => [
                                'id' => $application->user->id,
                                'name' => $application->user->name,
                                'avatar' => $application->user->avatar ? asset('storage/' . $application->user->avatar) : null,
                            ],
                            'status' => [
                                'id' => $application->status->id,
                                'name' => $application->status->name,
                                'color' => $application->status->color,
                            ],
                            'is_favorite' => $application->is_favorite,
                            'created_at' => $application->created_at,
                        ];
                    })->values(),
            ];
        });

        // Get available jobs for filter
        $jobs = Job::whereIn('company_id', $companyIds)->get(['id', 'title']);

        return Inertia::render('Manager/Applications/KanbanView', [
            'columns' => $columns,
            'jobs' => $jobs,
            'currentJob' => $job ? [
                'id' => $job->id,
                'title' => $job->title,
            ] : null,
            'search' => $request->search,
        ]);
    }

    /**
     * Accept an application.
     */
    public function accept(JobApplication $application)
    {
        // Check if user has access to this application
        if (!$this->hasAccessToApplication($application)) {
            return back()->with('error', 'Anda tidak memiliki akses ke aplikasi ini.');
        }

        // Get accepted status
        $acceptedStatus = ApplicationStatus::where('slug', 'hired')->first();

        // Check if accepted status exists, if not use the first available status or create one
        if (!$acceptedStatus) {
            // Try to find any completed/approved status as alternative
            $acceptedStatus = ApplicationStatus::where('slug', 'accepted')
                ->orWhere('slug', 'approved')
                ->orWhere('slug', 'completed')
                ->orWhere('name', 'like', '%diterima%')
                ->orWhere('name', 'like', '%accepted%')
                ->first();

            // If still no status found, create one
            if (!$acceptedStatus) {
                $acceptedStatus = ApplicationStatus::create([
                    'name' => 'Diterima',
                    'slug' => 'hired',
                    'color' => 'green',
                    'description' => 'Pelamar diterima',
                    'order' => 99
                ]);
            }
        }

        // Update application status
        $application->update([
            'status_id' => $acceptedStatus->id,
        ]);

        // Add to stage history
        $application->stageHistory()->create([
            'hiring_stage_id' => $application->current_stage_id,
            'user_id' => Auth::id(),
            'notes' => 'Lamaran diterima',
        ]);

        return back()->with('success', 'Lamaran berhasil diterima.');
    }

    /**
     * Reject an application.
     */
    public function reject(Request $request, JobApplication $application)
    {
        // Check if user has access to this application
        if (!$this->hasAccessToApplication($application)) {
            return back()->with('error', 'Anda tidak memiliki akses ke aplikasi ini.');
        }

        // Get rejected status
        $rejectedStatus = ApplicationStatus::where('slug', 'rejected')->first();

        // Check if rejected status exists, if not use the first available status or create one
        if (!$rejectedStatus) {
            // Try to find any rejected/declined status as alternative
            $rejectedStatus = ApplicationStatus::where('slug', 'declined')
                ->orWhere('slug', 'failed')
                ->orWhere('name', 'like', '%ditolak%')
                ->orWhere('name', 'like', '%rejected%')
                ->first();

            // If still no status found, create one
            if (!$rejectedStatus) {
                $rejectedStatus = ApplicationStatus::create([
                    'name' => 'Ditolak',
                    'slug' => 'rejected',
                    'color' => 'red',
                    'description' => 'Pelamar ditolak',
                    'order' => 100
                ]);
            }
        }

        // Update application status
        $application->update([
            'status_id' => $rejectedStatus->id,
        ]);

        // Add note if provided
        $notes = $request->input('reason', 'Lamaran ditolak');

        // Add to stage history
        $application->stageHistory()->create([
            'hiring_stage_id' => $application->current_stage_id,
            'user_id' => Auth::id(),
            'notes' => $notes,
        ]);

        return back()->with('success', 'Lamaran berhasil ditolak.');
    }

    /**
     * Download CV for an application.
     */
    public function downloadCV(JobApplication $application)
    {
        // Check if user has access to this application
        if (!$this->hasAccessToApplication($application)) {
            return back()->with('error', 'Anda tidak memiliki akses ke aplikasi ini.');
        }

        // Check if resume exists
        if (!$application->resume) {
            return back()->with('error', 'CV tidak ditemukan.');
        }

        // Get the file path
        $filePath = storage_path('app/public/' . $application->resume);

        // Check if file exists
        if (!file_exists($filePath)) {
            return back()->with('error', 'File CV tidak ditemukan.');
        }

        // Return file download
        return response()->download($filePath);
    }


    /**
     * Check if user has access to the application.
     */
    private function hasAccessToApplication(JobApplication $application)
    {
        $userCompanies = Auth::user()->managedCompanies()->pluck('id');
        return $application->job()->whereIn('company_id', $userCompanies)->exists();
    }
}
