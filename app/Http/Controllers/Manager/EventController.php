<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\JobApplication;
use App\Models\Job;
use App\Http\Requests\Manager\EventRequest;
use App\Notifications\EventCancelled;
use App\Notifications\EventScheduled;
use App\Notifications\EventStatusUpdated;
use App\Notifications\EventUpdated;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class EventController extends Controller
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Get companies managed by the current user
        $userCompanies = Auth::user()->managedCompanies()->pluck('companies.id');

        // Query to get events for jobs from managed companies
        $query = Event::whereHas('job', function($query) use ($userCompanies) {
            $query->whereIn('company_id', $userCompanies);
        })
            ->with(['job.company', 'jobApplication.user']);

        // Apply filters
        if ($request->filled('job')) {
            $query->where('job_id', $request->job);
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('date_from')) {
            $query->where('start_time', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->where('start_time', '<=', $request->date_to . ' 23:59:59');
        }

        if ($request->filled('timeframe')) {
            if ($request->timeframe === 'upcoming') {
                $query->where('start_time', '>=', now());
            } elseif ($request->timeframe === 'past') {
                $query->where('end_time', '<', now());
            } elseif ($request->timeframe === 'today') {
                $query->whereDate('start_time', now()->toDateString());
            } elseif ($request->timeframe === 'week') {
                $query->whereBetween('start_time', [
                    now()->startOfWeek(),
                    now()->endOfWeek(),
                ]);
            } elseif ($request->timeframe === 'month') {
                $query->whereMonth('start_time', now()->month)
                    ->whereYear('start_time', now()->year);
            }
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%")
                    ->orWhereHas('jobApplication.user', function($sq) use ($search) {
                        $sq->where('name', 'like', "%{$search}%");
                    });
            });
        }

        // Order results
        if ($request->filled('sort') && $request->filled('direction')) {
            $query->orderBy($request->sort, $request->direction);
        } else {
            $query->orderBy('start_time', 'asc');
        }

        // Paginate results
        $events = $query->paginate(10)
            ->through(function ($event) {
                return [
                    'id' => $event->id,
                    'title' => $event->title,
                    'job' => [
                        'id' => $event->job->id,
                        'title' => $event->job->title,
                        'company' => [
                            'id' => $event->job->company->id,
                            'name' => $event->job->company->name,
                        ],
                    ],
                    'candidate' => $event->jobApplication ? [
                        'id' => $event->jobApplication->user->id,
                        'name' => $event->jobApplication->user->name,
                        'avatar' => $event->jobApplication->user->avatar ? asset('storage/' . $event->jobApplication->user->avatar) : null,
                    ] : null,
                    'start_time' => $event->start_time->format('M d, Y h:i A'),
                    'end_time' => $event->end_time->format('M d, Y h:i A'),
                    'location' => $event->location,
                    'type' => $event->type,
                    'status' => $event->status,
                ];
            });

        // Get filter options
        $jobOptions = Auth::user()->managedCompanies()
            ->with(['jobs' => function($query) {
                $query->where('is_active', true);
            }])
            ->get()
            ->pluck('jobs')
            ->flatten()
            ->map(function($job) {
                return [
                    'id' => $job->id,
                    'title' => $job->title,
                    'company_name' => $job->company->name,
                ];
            });

        $typeOptions = [
            ['value' => 'interview', 'label' => 'Interview'],
            ['value' => 'test', 'label' => 'Test'],
            ['value' => 'meeting', 'label' => 'Meeting'],
            ['value' => 'other', 'label' => 'Other'],
        ];

        $statusOptions = [
            ['value' => 'scheduled', 'label' => 'Scheduled'],
            ['value' => 'completed', 'label' => 'Completed'],
            ['value' => 'cancelled', 'label' => 'Cancelled'],
            ['value' => 'rescheduled', 'label' => 'Rescheduled'],
        ];

        $timeframeOptions = [
            ['value' => 'upcoming', 'label' => 'Upcoming'],
            ['value' => 'past', 'label' => 'Past'],
            ['value' => 'today', 'label' => 'Today'],
            ['value' => 'week', 'label' => 'This Week'],
            ['value' => 'month', 'label' => 'This Month'],
        ];

        return Inertia::render('Manager/Events/Index', [
            'events' => $events,
            'filters' => [
                'search' => $request->search ?? '',
                'job' => $request->job ?? null,
                'type' => $request->type ?? null,
                'status' => $request->status ?? null,
                'timeframe' => $request->timeframe ?? 'upcoming',
                'date_from' => $request->date_from ?? null,
                'date_to' => $request->date_to ?? null,
                'sort' => $request->sort ?? 'start_time',
                'direction' => $request->direction ?? 'asc',
            ],
            'filterOptions' => [
                'jobs' => $jobOptions,
                'types' => $typeOptions,
                'statuses' => $statusOptions,
                'timeframes' => $timeframeOptions,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        // Get companies managed by the current user
        $userCompanies = Auth::user()->managedCompanies()->pluck('id');

        // If for a specific application
        $application = null;
        if ($request->filled('application_id')) {
            $application = JobApplication::with(['job.company', 'user'])
                ->whereHas('job', function($query) use ($userCompanies) {
                    $query->whereIn('company_id', $userCompanies);
                })
                ->findOrFail($request->application_id);
        }

        // Get jobs from managed companies
        $jobs = Auth::user()->managedCompanies()
            ->with(['jobs' => function($query) {
                $query->where('is_active', true);
            }])
            ->get()
            ->pluck('jobs')
            ->flatten()
            ->map(function($job) {
                return [
                    'id' => $job->id,
                    'title' => $job->title,
                    'company_name' => $job->company->name,
                ];
            });

        // If for a specific job
        $job = null;
        if ($request->filled('job_id')) {
            $job = Job::whereIn('company_id', $userCompanies)
                ->findOrFail($request->job_id);
        }

        // Type options
        $typeOptions = [
            ['value' => 'interview', 'label' => 'Interview'],
            ['value' => 'test', 'label' => 'Test'],
            ['value' => 'meeting', 'label' => 'Meeting'],
            ['value' => 'other', 'label' => 'Other'],
        ];

        return Inertia::render('Manager/Events/Create', [
            'application' => $application ? [
                'id' => $application->id,
                'job' => [
                    'id' => $application->job->id,
                    'title' => $application->job->title,
                ],
                'user' => [
                    'id' => $application->user->id,
                    'name' => $application->user->name,
                    'email' => $application->user->email,
                ],
                'created_at' => $application->created_at->format('Y-m-d'), // Add creation date for display
            ] : null,
            'job' => $job ? [
                'id' => $job->id,
                'title' => $job->title,
            ] : null,
            'jobs' => $jobs,
            'typeOptions' => $typeOptions,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(EventRequest $request)
    {
        // Get companies managed by the current user
        $userCompanies = Auth::user()->managedCompanies()->pluck('companies.id');

        // If job_application_id is provided but job_id is not, get job_id from the application
        if ($request->filled('job_application_id') && !$request->filled('job_id')) {
            $application = JobApplication::findOrFail($request->job_application_id);
            $request->merge(['job_id' => $application->job_id]);
        }

        // Check if job belongs to a managed company
        $job = Job::findOrFail($request->job_id);
        if (!$userCompanies->contains($job->company_id)) {
            abort(403, 'Unauthorized action.');
        }

        try {
            // Process attendees (convert from JSON string if needed)
            $attendees = null;
            if ($request->filled('attendees')) {
                if (is_string($request->attendees)) {
                    // If it's already a JSON string, use it as is
                    $attendees = $request->attendees;
                } else {
                    // If it's an array, convert to JSON
                    $attendees = json_encode($request->attendees);
                }
            }

            // Parse start and end times with Carbon to ensure correct format
            $startTime = Carbon::parse($request->start_time);
            $endTime = Carbon::parse($request->end_time);

            // Create the event
            try {
                // Create the event
                $event = Event::create([
                    'title' => $request->title,
                    'description' => $request->description,
                    'start_time' => Carbon::parse($request->start_time),
                    'end_time' => Carbon::parse($request->end_time),
                    'job_application_id' => $request->job_application_id,
                    'job_id' => $request->job_id,
                    'user_id' => Auth::id(),
                    'location' => $request->location,
                    'meeting_link' => $request->meeting_link,
                    'type' => $request->type,
                    'status' => 'scheduled',
                    'attendees' => $request->attendees,
                ]);

                // Notify candidate if event has a job application
                if ($event->jobApplication) {
                    $event->jobApplication->user->notify(new EventScheduled($event, [
                        'scheduled_by' => Auth::id(),
                        'scheduled_by_name' => Auth::user()->name,
                    ]));
                }

                return redirect()->route('manager.events.index')->with('success', 'Event created successfully.');

            } catch (\Exception $e) {
                \Log::error('Failed to create event: ' . $e->getMessage());
                return redirect()->back()->with('error', 'Failed to create event.');
            }

        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Event $event)
    {
        // Check if user has access to this event's company
        $userCompanies = Auth::user()->managedCompanies()->pluck('id');
        if (!$userCompanies->contains($event->job->company_id)) {
            abort(403, 'Unauthorized action.');
        }

        $event->load(['job.company', 'jobApplication.user', 'user']);

        return Inertia::render('Manager/Events/Show', [
            'event' => [
                'id' => $event->id,
                'title' => $event->title,
                'description' => $event->description,
                'start_time' => $event->start_time->format('Y-m-d\TH:i'),
                'end_time' => $event->end_time->format('Y-m-d\TH:i'),
                'job' => [
                    'id' => $event->job->id,
                    'title' => $event->job->title,
                    'company' => [
                        'id' => $event->job->company->id,
                        'name' => $event->job->company->name,
                    ],
                ],
                'application' => $event->jobApplication ? [
                    'id' => $event->jobApplication->id,
                    'user' => [
                        'id' => $event->jobApplication->user->id,
                        'name' => $event->jobApplication->user->name,
                        'email' => $event->jobApplication->user->email,
                        'avatar' => $event->jobApplication->user->avatar ? asset('storage/' . $event->jobApplication->user->avatar) : null,
                    ],
                ] : null,
                'location' => $event->location,
                'meeting_link' => $event->meeting_link,
                'type' => $event->type,
                'status' => $event->status,
                'attendees' => $event->attendees,
                'created_by' => [
                    'id' => $event->user->id,
                    'name' => $event->user->name,
                ],
                'created_at' => $event->created_at->format('M d, Y h:i A'),
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Event $event)
    {
        // Check if user has access to this event's company
        $userCompanies = Auth::user()->managedCompanies()->pluck('id');
        if (!$userCompanies->contains($event->job->company_id)) {
            abort(403, 'Unauthorized action.');
        }

        $event->load(['job.company', 'jobApplication.user']);

        // Type options
        $typeOptions = [
            ['value' => 'interview', 'label' => 'Interview'],
            ['value' => 'test', 'label' => 'Test'],
            ['value' => 'meeting', 'label' => 'Meeting'],
            ['value' => 'other', 'label' => 'Other'],
        ];

        // Status options
        $statusOptions = [
            ['value' => 'scheduled', 'label' => 'Scheduled'],
            ['value' => 'completed', 'label' => 'Completed'],
            ['value' => 'cancelled', 'label' => 'Cancelled'],
            ['value' => 'rescheduled', 'label' => 'Rescheduled'],
        ];

        return Inertia::render('Manager/Events/Edit', [
            'event' => [
                'id' => $event->id,
                'title' => $event->title,
                'description' => $event->description,
                'start_time' => $event->start_time->format('Y-m-d\TH:i'),
                'end_time' => $event->end_time->format('Y-m-d\TH:i'),
                'job_id' => $event->job_id,
                'job_application_id' => $event->job_application_id,
                'location' => $event->location,
                'meeting_link' => $event->meeting_link,
                'type' => $event->type,
                'status' => $event->status,
                'attendees' => $event->attendees,
            ],
            'job' => [
                'id' => $event->job->id,
                'title' => $event->job->title,
                'company_name' => $event->job->company->name,
            ],
            'application' => $event->jobApplication ? [
                'id' => $event->jobApplication->id,
                'user' => [
                    'id' => $event->jobApplication->user->id,
                    'name' => $event->jobApplication->user->name,
                ],
            ] : null,
            'typeOptions' => $typeOptions,
            'statusOptions' => $statusOptions,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(EventRequest $request, Event $event)
    {
        // Check if user has access to this event's company
        $userCompanies = Auth::user()->managedCompanies()->pluck('id');
        if (!$userCompanies->contains($event->job->company_id)) {
            abort(403, 'Unauthorized action.');
        }

        // If job has changed, ensure it belongs to a managed company
        if ($request->job_id !== $event->job_id) {
            $job = Job::findOrFail($request->job_id);
            if (!$userCompanies->contains($job->company_id)) {
                abort(403, 'Unauthorized action.');
            }

            // If application is set, ensure it belongs to the new job
            if ($request->filled('job_application_id')) {
                $application = JobApplication::findOrFail($request->job_application_id);
                if ($application->job_id !== $job->id) {
                    return back()->with('error', 'The selected application does not belong to the selected job.');
                }
            }
        }

        // Process attendees (convert from JSON string if needed)
        $attendees = null;
        if ($request->filled('attendees')) {
            if (is_string($request->attendees)) {
                // If it's already a JSON string, use it as is
                $attendees = $request->attendees;
            } else {
                // If it's an array, convert to JSON
                $attendees = json_encode($request->attendees);
            }
        }

        // Parse start and end times with Carbon to ensure correct format
        $startTime = Carbon::parse($request->start_time);
        $endTime = Carbon::parse($request->end_time);

        // Update the event
        try {
            // Save old data for notification
            $oldData = [
                'title' => $event->title,
                'start_time' => $event->start_time,
                'end_time' => $event->end_time,
                'location' => $event->location,
                'type' => $event->type,
            ];

            // Update the event
            $event->update([
                'title' => $request->title,
                'description' => $request->description,
                'start_time' => Carbon::parse($request->start_time),
                'end_time' => Carbon::parse($request->end_time),
                'job_application_id' => $request->job_application_id,
                'job_id' => $request->job_id,
                'location' => $request->location,
                'meeting_link' => $request->meeting_link,
                'type' => $request->type,
                'status' => $request->status,
                'attendees' => $request->attendees,
            ]);

            // Notify candidate about event update
            if ($event->jobApplication) {
                $event->jobApplication->user->notify(new EventUpdated($event, [
                    'old_data' => $oldData,
                    'updated_by' => Auth::id(),
                    'updated_by_name' => Auth::user()->name,
                ]));
            }

            return redirect()->route('manager.events.index')->with('success', 'Event updated successfully.');

        } catch (\Exception $e) {
            \Log::error('Failed to update event: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to update event.');
        }

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Event $event)
    {
        // Check if user has access to this event's company
        $userCompanies = Auth::user()->managedCompanies()->pluck('id');
        if (!$userCompanies->contains($event->job->company_id)) {
            abort(403, 'Unauthorized action.');
        }

        // Get cancellation reason if provided
        $reason = $request->input('reason');

        // Notify candidate about event cancellation before deleting
        if ($event->jobApplication) {
            try {
                $event->jobApplication->user->notify(new EventCancelled($event, [
                    'cancelled_by' => Auth::id(),
                    'cancelled_by_name' => Auth::user()->name,
                    'reason' => $reason,
                ]));
            } catch (\Exception $e) {
                \Log::error("Failed to send event cancellation notification: " . $e->getMessage());
            }
        }

        $event->delete();

        return redirect()->route('manager.events.index')->with('success', 'Event deleted successfully.');
    }



    /**
     * Update event status.
     */
    public function updateStatus(Request $request, Event $event)
    {
        $request->validate([
            'status' => 'required|in:scheduled,completed,cancelled,rescheduled',
        ]);

        // Check if user has access to this event's company
        $userCompanies = Auth::user()->managedCompanies()->pluck('id');
        if (!$userCompanies->contains($event->job->company_id)) {
            abort(403, 'Unauthorized action.');
        }

        // Save old status for notification
        $oldStatus = $event->status;

        // Update the event status
        $event->update([
            'status' => $request->status,
        ]);

        // Notify candidate about status update
        if ($event->jobApplication && $oldStatus !== $request->status) {
            try {
                $event->jobApplication->user->notify(new EventStatusUpdated($event, [
                    'old_status' => $oldStatus,
                    'new_status' => $request->status,
                    'updated_by' => Auth::id(),
                    'updated_by_name' => Auth::user()->name,
                ]));
            } catch (\Exception $e) {
                \Log::error("Failed to send event status notification: " . $e->getMessage());
            }
        }

        return back()->with('success', 'Event status updated successfully.');
    }




    /**
     * Display calendar view.
     */
    public function calendar(Request $request)
    {
        // Get companies managed by the current user
        $userCompanies = Auth::user()->managedCompanies()->pluck('companies.id');

        // Query to get events for the calendar
        $query = Event::whereHas('job', function($query) use ($userCompanies) {
            $query->whereIn('company_id', $userCompanies);
        })->with(['job.company', 'jobApplication.user']);

        // Apply filters if provided
        if ($request->filled('job')) {
            $query->where('job_id', $request->job);
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('start_time', [
                Carbon::parse($request->start_date)->startOfDay(),
                Carbon::parse($request->end_date)->endOfDay(),
            ]);
        }

        // Get all events for calendar
        $events = $query->get()->map(function($event) {
            return [
                'id' => $event->id,
                'title' => $event->title,
                'start' => $event->start_time->format('Y-m-d\TH:i:s'),
                'end' => $event->end_time->format('Y-m-d\TH:i:s'),
                'allDay' => false,
                'job' => [
                    'id' => $event->job->id,
                    'title' => $event->job->title,
                    'company' => [
                        'name' => $event->job->company->name,
                    ],
                ],
                'candidate' => $event->jobApplication ? [
                    'id' => $event->jobApplication->user->id,
                    'name' => $event->jobApplication->user->name,
                ] : null,
                'location' => $event->location,
                'meeting_link' => $event->meeting_link,
                'type' => $event->type,
                'status' => $event->status,
                'color' => $this->getEventColor($event->type, $event->status),
            ];
        });

        // Get filter options
        $jobOptions = Auth::user()->managedCompanies()
            ->with(['jobs' => function($query) {
                $query->where('is_active', true);
            }])
            ->get()
            ->pluck('jobs')
            ->flatten()
            ->map(function($job) {
                return [
                    'id' => $job->id,
                    'title' => $job->title,
                    'company_name' => $job->company->name,
                ];
            });

        $typeOptions = [
            ['value' => 'interview', 'label' => 'Interview'],
            ['value' => 'test', 'label' => 'Test'],
            ['value' => 'meeting', 'label' => 'Meeting'],
            ['value' => 'other', 'label' => 'Other'],
        ];

        return Inertia::render('Manager/Events/Calendar', [
            'events' => $events,
            'filters' => [
                'job' => $request->job ?? null,
                'type' => $request->type ?? null,
            ],
            'filterOptions' => [
                'jobs' => $jobOptions,
                'types' => $typeOptions,
            ],
        ]);
    }

    /**
     * Get color for event based on type and status.
     */
    private function getEventColor($type, $status)
    {
        if ($status === 'cancelled') {
            return '#9e9e9e'; // Grey for cancelled events
        }

        switch ($type) {
            case 'interview':
                return '#4caf50'; // Green for interviews
            case 'test':
                return '#ff9800'; // Orange for tests
            case 'meeting':
                return '#2196f3'; // Blue for meetings
            default:
                return '#9c27b0'; // Purple for other events
        }
    }
}
