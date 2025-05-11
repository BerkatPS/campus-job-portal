<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Job;
use App\Models\JobApplication;
use App\Models\ApplicationStatus;
use App\Models\Event;

class DashboardController extends Controller
{
    /**
     * Display the manager dashboard.
     */
    public function index()
    {
        // Get the manager's companies
        $companyIds = Auth::user()->managedCompanies()->pluck('companies.id')->toArray();

        // Get active jobs count
        $activeJobsCount = Job::whereIn('company_id', $companyIds)
            ->where('is_active', true)
            ->count();

        // Get total applications count
        $totalApplicationsCount = JobApplication::whereHas('job', function($query) use ($companyIds) {
            $query->whereIn('company_id', $companyIds);
        })->count();

        // Get applications by status
        $applicationsByStatus = JobApplication::whereHas('job', function($query) use ($companyIds) {
            $query->whereIn('company_id', $companyIds);
        })
            ->selectRaw('status_id, count(*) as count')
            ->groupBy('status_id')
            ->with('status')
            ->get()
            ->map(function($item) {
                return [
                    'status' => $item->status->name,
                    'color' => $item->status->color,
                    'count' => $item->count,
                ];
            });

        // Get recent applications
        $recentApplications = JobApplication::with(['user', 'job.company', 'status'])
            ->whereHas('job', function($query) use ($companyIds) {
                $query->whereIn('company_id', $companyIds);
            })
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function($application) {
                return [
                    'id' => $application->id,
                    'user' => [
                        'name' => $application->user->name,
                    ],
                    'job' => [
                        'id' => $application->job->id,
                        'title' => $application->job->title,
                        'company' => [
                            'name' => $application->job->company->name,
                        ],
                    ],
                    'status' => [
                        'name' => $application->status->name,
                        'color' => $application->status->color,
                    ],
                    'created_at' => $application->created_at,
                ];
            });

        // Get upcoming events/interviews
        $upcomingEvents = Event::with(['jobApplication.user', 'job'])
            ->whereHas('job', function($query) use ($companyIds) {
                $query->whereIn('company_id', $companyIds);
            })
            ->where('start_time', '>=', now())
            ->orderBy('start_time')
            ->take(5)
            ->get()
            ->map(function($event) {
                return [
                    'id' => $event->id,
                    'title' => $event->title,
                    'start_time' => $event->start_time,
                    'end_time' => $event->end_time,
                    'candidate' => $event->jobApplication ? [
                        'name' => $event->jobApplication->user->name,
                    ] : null,
                    'job' => [
                        'title' => $event->job->title,
                    ],
                    'type' => $event->type,
                    'status' => $event->status,
                ];
            });

        // Get expiring jobs (within 7 days)
        $expiringJobs = Job::whereIn('company_id', $companyIds)
            ->where('is_active', true)
            ->where('submission_deadline', '>=', now())
            ->where('submission_deadline', '<=', now()->addDays(7))
            ->orderBy('submission_deadline')
            ->with('company')
            ->get()
            ->map(function($job) {
                return [
                    'id' => $job->id,
                    'title' => $job->title,
                    'company' => [
                        'name' => $job->company->name,
                    ],
                    'submission_deadline' => $job->submission_deadline,
                    'days_remaining' => now()->diffInDays($job->submission_deadline, false),
                ];
            });

        return Inertia::render('Manager/Dashboard', [
            'stats' => [
                'activeJobsCount' => $activeJobsCount,
                'totalApplicationsCount' => $totalApplicationsCount,
                'applicationsByStatus' => $applicationsByStatus,
            ],
            'recentApplications' => $recentApplications,
            'upcomingEvents' => $upcomingEvents,
            'expiringJobs' => $expiringJobs,
        ]);
    }
}
