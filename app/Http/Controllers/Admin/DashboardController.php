<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Job;
use App\Models\User;
use App\Models\Company;
use App\Models\JobApplication;
use App\Models\Role;
use App\Models\ApplicationStatus;

class DashboardController extends Controller
{
    public function index()
    {
        // Get statistics for the dashboard
        $totalJobs = Job::count();
        $totalCompanies = Company::count();
        $totalCandidates = User::whereHas('role', function($query) {
            $query->where('slug', 'candidate');
        })->count();
        $totalApplications = JobApplication::count();

        // Get recent jobs with additional information
        $recentJobs = Job::with(['company', 'jobApplications'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function($job) {
                return [
                    'id' => $job->id,
                    'title' => $job->title,
                    'company' => $job->company->name,
                    'company_logo' => $job->company->logo,
                    'applications' => $job->jobApplications->count(),
                    'status' => $job->is_active ? 'Active' : 'Inactive',
                    'created_at' => $job->created_at,
                    'location' => $job->location,
                    'job_type' => $job->job_type,
                ];
            });

        // Get recent companies with more details
        $recentCompanies = Company::latest()
            ->take(5)
            ->get()
            ->map(function($company) {
                return [
                    'id' => $company->id,
                    'name' => $company->name,
                    'logo' => $company->logo,
                    'industry' => $company->industry,
                    'location' => $company->address,
                    'created_at' => $company->created_at,
                    'website' => $company->website,
                    'email' => $company->email,
                ];
            });

        // Get application statistics by status
        $applicationsByStatus = ApplicationStatus::withCount('jobApplications')
            ->get()
            ->map(function($status) {
                return [
                    'name' => $status->name,
                    'value' => $status->job_applications_count,
                    'color' => $status->color,
                ];
            });

        // Get application trend data (last 6 months)
        $applicationTrend = collect(range(0, 5))->map(function($month) {
            $date = now()->subMonths($month);
            $monthName = $date->format('M');

            return [
                'month' => $monthName,
                'applications' => JobApplication::whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->count(),
                'companies' => Company::whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->count(),
                'jobs' => Job::whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->count()
            ];
        })->reverse()->values();

        // Get month-over-month percentage changes
        $lastMonthStats = $this->getLastMonthStats();
        $currentMonthStats = $this->getCurrentMonthStats();

        $percentageChanges = [
            'companies' => $this->calculatePercentageChange(
                $lastMonthStats['companies'],
                $currentMonthStats['companies']
            ),
            'jobs' => $this->calculatePercentageChange(
                $lastMonthStats['jobs'],
                $currentMonthStats['jobs']
            ),
            'candidates' => $this->calculatePercentageChange(
                $lastMonthStats['candidates'],
                $currentMonthStats['candidates']
            ),
            'applications' => $this->calculatePercentageChange(
                $lastMonthStats['applications'],
                $currentMonthStats['applications']
            ),
        ];

        // Return the dashboard view with data
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalJobs' => $totalJobs,
                'totalCompanies' => $totalCompanies,
                'totalCandidates' => $totalCandidates,
                'totalApplications' => $totalApplications,
                'percentageChanges' => $percentageChanges
            ],
            'recentJobs' => $recentJobs,
            'recentCompanies' => $recentCompanies,
            'statusData' => $applicationsByStatus,
            'applicationTrend' => $applicationTrend,
        ]);
    }

    private function getLastMonthStats()
    {
        $lastMonth = now()->subMonth();

        return [
            'companies' => Company::whereYear('created_at', $lastMonth->year)
                ->whereMonth('created_at', $lastMonth->month)
                ->count(),
            'jobs' => Job::whereYear('created_at', $lastMonth->year)
                ->whereMonth('created_at', $lastMonth->month)
                ->count(),
            'candidates' => User::whereHas('role', function($query) {
                $query->where('slug', 'candidate');
            })
                ->whereYear('created_at', $lastMonth->year)
                ->whereMonth('created_at', $lastMonth->month)
                ->count(),
            'applications' => JobApplication::whereYear('created_at', $lastMonth->year)
                ->whereMonth('created_at', $lastMonth->month)
                ->count()
        ];
    }

    private function getCurrentMonthStats()
    {
        $now = now();

        return [
            'companies' => Company::whereYear('created_at', $now->year)
                ->whereMonth('created_at', $now->month)
                ->count(),
            'jobs' => Job::whereYear('created_at', $now->year)
                ->whereMonth('created_at', $now->month)
                ->count(),
            'candidates' => User::whereHas('role', function($query) {
                $query->where('slug', 'candidate');
            })
                ->whereYear('created_at', $now->year)
                ->whereMonth('created_at', $now->month)
                ->count(),
            'applications' => JobApplication::whereYear('created_at', $now->year)
                ->whereMonth('created_at', $now->month)
                ->count()
        ];
    }

    private function calculatePercentageChange($oldValue, $newValue)
    {
        if ($oldValue == 0) {
            return $newValue > 0 ? 100 : 0;
        }

        return round((($newValue - $oldValue) / $oldValue) * 100, 1);
    }
}
