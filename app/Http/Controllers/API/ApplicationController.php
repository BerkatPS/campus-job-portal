<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Job;
use App\Models\JobApplication;
use App\Models\ApplicationStatus;
use App\Models\FormResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ApplicationController extends Controller
{
    /**
     * Get a list of user's applications.
     */
    public function index(Request $request)
    {
        // Query to get the user's applications
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
        $perPage = $request->filled('per_page') ? $request->per_page : 10;
        $applications = $query->paginate($perPage);

        // Transform application data
        $applications->through(function ($application) {
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
                        'start_time' => $event->start_time->format('Y-m-d H:i:s'),
                        'type' => $event->type,
                    ];
                }),
                'created_at' => $application->created_at->format('Y-m-d'),
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

        return response()->json([
            'applications' => $applications,
            'filter_options' => [
                'statuses' => $statusOptions,
            ],
        ]);
    }

    /**
     * Get application details.
     */
    public function show(JobApplication $application)
    {
        // Ensure user owns this application
        if ($application->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $application->load([
            'job.company',
            'status',
            'currentStage',
            'stageHistory.hiringStage',
            'formResponses.formField.formSection',
            'events' => function($query) {
                $query->orderBy('start_time');
            }
        ]);

        return response()->json([
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
                'created_at' => $application->created_at->format('Y-m-d'),
                'form_responses' => $application->formResponses->groupBy(function($response) {
                    return $response->formField->formSection->id;
                })->map(function($responses, $sectionId) {
                    $section = $responses->first()->formField->formSection;
                    return [
                        'id' => $section->id,
                        'name' => $section->name,
                        'responses' => $responses->map(function($response) {
                            return [
                                'id' => $response->id,
                                'field' => [
                                    'id' => $response->formField->id,
                                    'name' => $response->formField->name,
                                    'field_type' => $response->formField->field_type,
                                ],
                                'value' => $response->response_value,
                            ];
                        }),
                    ];
                })->values(),
                'stage_history' => $application->stageHistory->map(function($history) {
                    return [
                        'id' => $history->id,
                        'stage' => [
                            'name' => $history->hiringStage->name,
                            'color' => $history->hiringStage->color,
                        ],
                        'created_at' => $history->created_at->format('Y-m-d'),
                    ];
                }),
                'events' => $application->events->map(function($event) {
                    return [
                        'id' => $event->id,
                        'title' => $event->title,
                        'description' => $event->description,
                        'start_time' => $event->start_time->format('Y-m-d H:i:s'),
                        'end_time' => $event->end_time->format('Y-m-d H:i:s'),
                        'location' => $event->location,
                        'meeting_link' => $event->meeting_link,
                        'type' => $event->type,
                        'status' => $event->status,
                    ];
                }),
            ],
        ]);
    }

    /**
     * Apply for a job.
     */
    public function apply(Request $request)
    {
        $request->validate([
            'job_id' => 'required|exists:jobs,id',
            'cover_letter' => 'nullable|string',
            'resume' => 'nullable|file|mimes:pdf,doc,docx|max:2048',
            'responses' => 'nullable|array',
        ]);

        // Get the job
        $job = Job::findOrFail($request->job_id);

        // Check if job is active and accepting applications
        if (!$job->is_active || $job->submission_deadline < now()) {
            return response()->json(['error' => 'This job is no longer accepting applications.'], 422);
        }

        // Check if user already applied
        $alreadyApplied = JobApplication::where('user_id', Auth::id())
            ->where('job_id', $job->id)
            ->exists();

        if ($alreadyApplied) {
            return response()->json(['error' => 'You have already applied for this job.'], 422);
        }

        // Get the initial status
        $initialStatus = ApplicationStatus::where('slug', 'pending')->first();

        // Get the job's first hiring stage
        $firstStage = $job->hiringStages()->orderBy('job_hiring_stages.order_index')->first();

        // Handle resume upload
        $resumePath = null;
        if ($request->hasFile('resume')) {
            $resumePath = $request->file('resume')->store('resumes', 'public');
        }

        // Create application
        $application = JobApplication::create([
            'job_id' => $request->job_id,
            'user_id' => Auth::id(),
            'status_id' => $initialStatus->id,
            'current_stage_id' => $firstStage?->id,
            'cover_letter' => $request->cover_letter,
            'resume' => $resumePath,
        ]);

        // Store form responses
        if ($request->has('responses')) {
            foreach ($request->responses as $fieldId => $response) {
                FormResponse::create([
                    'job_application_id' => $application->id,
                    'form_field_id' => $fieldId,
                    'response_value' => is_array($response) ? json_encode($response) : $response,
                ]);
            }
        }

        // Record initial stage history
        if ($firstStage) {
            $application->stageHistory()->create([
                'hiring_stage_id' => $firstStage->id,
                'user_id' => Auth::id(),
                'notes' => 'Application submitted',
            ]);
        }

        return response()->json([
            'message' => 'Your application has been submitted successfully.',
            'application' => [
                'id' => $application->id,
                'job' => [
                    'id' => $job->id,
                    'title' => $job->title,
                ],
                'status' => [
                    'name' => $initialStatus->name,
                    'slug' => $initialStatus->slug,
                ],
                'created_at' => $application->created_at->format('Y-m-d'),
            ],
        ]);
    }

    /**
     * Get application form for a job.
     */
    public function getApplicationForm(Job $job)
    {
        // Check if job is active and accepting applications
        if (!$job->is_active || $job->submission_deadline < now()) {
            return response()->json(['error' => 'This job is no longer accepting applications.'], 422);
        }

        // Check if user already applied
        $alreadyApplied = JobApplication::where('user_id', Auth::id())
            ->where('job_id', $job->id)
            ->exists();

        if ($alreadyApplied) {
            return response()->json(['error' => 'You have already applied for this job.'], 422);
        }

        // Get form sections and fields
        $formSections = $job->company->formSections ?? \App\Models\FormSection::enabled()->with('formFields')->orderBy('order_index')->get();

        return response()->json([
            'job' => [
                'id' => $job->id,
                'title' => $job->title,
                'company' => [
                    'name' => $job->company->name,
                ],
                'submission_deadline' => $job->submission_deadline->format('Y-m-d'),
            ],
            'form_sections' => $formSections->map(function($section) {
                return [
                    'id' => $section->id,
                    'name' => $section->name,
                    'description' => $section->description,
                    'fields' => $section->formFields->map(function($field) {
                        return [
                            'id' => $field->id,
                            'name' => $field->name,
                            'field_type' => $field->field_type,
                            'options' => $field->options,
                            'is_required' => $field->is_required,
                        ];
                    }),
                ];
            }),
        ]);
    }
}
