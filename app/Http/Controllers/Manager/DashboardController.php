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
use App\Models\User;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    /**
     * Display the manager dashboard with comprehensive analytics data.
     */
    public function index()
    {
        // Get the manager's companies
        $companyIds = Auth::user()->managedCompanies()->pluck('companies.id')->toArray();

        // Get active jobs count
        $activeJobsCount = Job::whereIn('company_id', $companyIds)
            ->where('is_active', true)
            ->count();
            
        // Get total applicants count (unique users who have applied)
        $totalApplicantsCount = JobApplication::whereHas('job', function($query) use ($companyIds) {
            $query->whereIn('company_id', $companyIds);
        })
        ->distinct('user_id')
        ->count('user_id');
        
        // Get upcoming interviews count
        $upcomingInterviewsCount = Event::whereHas('job', function($query) use ($companyIds) {
            $query->whereIn('company_id', $companyIds);
        })
        ->where('start_time', '>=', now())
        ->where('start_time', '<=', now()->addDays(7))
        ->where('type', 'interview')
        ->count();
        
        // Get accepted applicants in last 30 days
        $acceptedApplicantsCount = JobApplication::whereHas('job', function($query) use ($companyIds) {
            $query->whereIn('company_id', $companyIds);
        })
        ->whereHas('status', function($query) {
            $query->where('name', 'like', '%Diterima%')->orWhere('name', 'like', '%Accepted%');
        })
        ->where('updated_at', '>=', now()->subDays(30))
        ->count();

        // Get recent applications with user details
        $recentApplications = JobApplication::with(['user', 'job', 'status'])
            ->whereHas('job', function($query) use ($companyIds) {
                $query->whereIn('company_id', $companyIds);
            })
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function($application) {
                return [
                    'id' => $application->id,
                    'candidate' => [
                        'id' => $application->user->id,
                        'name' => $application->user->name,
                        'avatar_url' => $application->user->avatar ? asset('storage/' . $application->user->avatar) : null,
                    ],
                    'job' => [
                        'id' => $application->job->id,
                        'title' => $application->job->title,
                        'location' => $application->job->location,
                    ],
                    'status' => $application->status->name,
                    'date_applied_formatted' => $application->created_at->diffForHumans(),
                ];
            });

        // Get upcoming events/interviews
        $upcomingEvents = Event::with(['jobApplication.user', 'job.company'])
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
                    'time' => $event->start_time->format('d M Y, H:i'),
                    'location' => $event->location ?: 'Online',
                    'is_online' => (bool) $event->meeting_link,
                    'candidate' => $event->jobApplication ? [
                        'id' => $event->jobApplication->user->id,
                        'name' => $event->jobApplication->user->name,
                        'avatar_url' => $event->jobApplication->user->avatar ? asset('storage/' . $event->jobApplication->user->avatar) : null,
                    ] : null,
                    'job' => [
                        'id' => $event->job->id,
                        'title' => $event->job->title,
                    ],
                    'type' => $event->type,
                ];
            });

        // Get job statuses (active jobs with application counts)
        $jobStatuses = Job::whereIn('company_id', $companyIds)
            ->where('is_active', true)
            ->with('company')
            ->withCount('applications')
            ->orderBy('submission_deadline')
            ->take(5)
            ->get()
            ->map(function($job) {
                $daysRemaining = now()->diffInDays($job->submission_deadline, false);
                
                return [
                    'id' => $job->id,
                    'title' => $job->title,
                    'company' => [
                        'name' => $job->company->name,
                        'logo_url' => $job->company->logo ? asset('storage/' . $job->company->logo) : null,
                    ],
                    'location' => $job->location,
                    'application_count' => $job->applications_count,
                    'deadline' => $job->submission_deadline->format('d M Y'),
                    'days_remaining' => $daysRemaining >= 0 ? $daysRemaining : 0,
                    'is_expiring_soon' => $daysRemaining <= 7 && $daysRemaining >= 0,
                    'is_expired' => $daysRemaining < 0,
                ];
            });

        return Inertia::render('Manager/Dashboard', [
            'stats' => [
                'total_applicants' => $totalApplicantsCount,
                'active_jobs' => $activeJobsCount,
                'upcoming_interviews' => $upcomingInterviewsCount,
                'accepted_applicants' => $acceptedApplicantsCount,
            ],
            'recent_applications' => $recentApplications,
            'upcoming_events' => $upcomingEvents,
            'job_statuses' => $jobStatuses,
        ]);
    }
}
