<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\Job;
use App\Models\JobApplication;
use App\Models\ApplicationStatus;
use App\Models\Event;
use App\Exports\AnalyticsExport;
use Maatwebsite\Excel\Facades\Excel;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    /**
     * Display the analytics dashboard.
     */
    public function index(Request $request)
    {
        // Get the companies managed by the current user
        $companyIds = Auth::user()->managedCompanies()->pluck('companies.id')->toArray();

        // Date ranges for filtering with validation
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        // Validate dates and set defaults if invalid
        if (!$startDate || !$this->isValidDate($startDate)) {
            $startDate = now()->subMonths(6)->format('Y-m-d');
        }

        if (!$endDate || !$this->isValidDate($endDate)) {
            $endDate = now()->format('Y-m-d');
        }

        // Ensure end date is not before start date
        if (Carbon::parse($endDate)->lt(Carbon::parse($startDate))) {
            $endDate = now()->format('Y-m-d');
            $startDate = now()->subMonths(6)->format('Y-m-d');
        }

        // Filter by company if specified with validation
        $companyId = $request->input('company_id');
        if ($companyId && !in_array($companyId, $companyIds)) {
            $companyId = null;
        }

        // Filter by job if specified with validation
        $jobId = $request->input('job_id');
        if ($jobId) {
            // Verify job belongs to managed companies
            $validJob = Job::whereIn('company_id', $companyIds)
                ->where('id', $jobId)
                ->exists();
                
            if (!$validJob) {
                $jobId = null;
            }
        }

        // Base queries with date range filter
        $jobsQuery = Job::whereIn('company_id', $companyIds)
            ->where(function($query) use ($startDate, $endDate) {
                $query->whereBetween('created_at', [$startDate, $endDate])
                    ->orWhereBetween('updated_at', [$startDate, $endDate]);
            });

        $applicationsQuery = JobApplication::whereHas('job', function($query) use ($companyIds) {
            $query->whereIn('company_id', $companyIds);
        })->whereBetween('created_at', [$startDate, $endDate]);

        $eventsQuery = Event::whereHas('job', function($query) use ($companyIds) {
            $query->whereIn('company_id', $companyIds);
        })->whereBetween('created_at', [$startDate, $endDate]);

        // Apply company filter if specified
        if ($companyId) {
            $jobsQuery->where('company_id', $companyId);
            $applicationsQuery->whereHas('job', function($query) use ($companyId) {
                $query->where('company_id', $companyId);
            });
            $eventsQuery->whereHas('job', function($query) use ($companyId) {
                $query->where('company_id', $companyId);
            });
        }

        // Apply job filter if specified
        if ($jobId) {
            $applicationsQuery->where('job_id', $jobId);
            $eventsQuery->where('job_id', $jobId);
        }

        // Get total counts
        $totalJobs = $jobsQuery->count();
        $totalApplications = $applicationsQuery->count();
        $totalEvents = $eventsQuery->count();

        // Applications by status - with caching for performance
        $cacheKey = "applications_by_status:{$companyId}:{$jobId}:{$startDate}:{$endDate}";
        $applicationsByStatus = cache()->remember($cacheKey, now()->addMinutes(5), function() use ($applicationsQuery, $companyIds, $startDate, $endDate, $companyId, $jobId) {
            return $applicationsQuery->clone()
                ->select('status_id', DB::raw('count(*) as count'))
                ->groupBy('status_id')
                ->with('status')
                ->get()
                ->map(function($item) use ($companyIds, $startDate, $endDate, $companyId, $jobId) {
                    return [
                        'status' => $item->status->name,
                        'color' => $item->status->color,
                        'count' => $item->count,
                        'percentage' => $this->calculatePercentage($item->count, $this->getTotalApplications($companyIds, $startDate, $endDate, $companyId, $jobId)),
                    ];
                });
        });

        // Applications by job
        $applicationsByJob = $applicationsQuery->clone()
            ->select('job_id', DB::raw('count(*) as count'))
            ->groupBy('job_id')
            ->with(['job', 'job.company'])
            ->get()
            ->map(function($item) use ($companyIds, $startDate, $endDate, $companyId, $jobId) {
                return [
                    'job' => $item->job->title,
                    'company' => $item->job->company->name,
                    'count' => $item->count,
                    'percentage' => $this->calculatePercentage($item->count, $this->getTotalApplications($companyIds, $startDate, $endDate, $companyId, $jobId)),
                ];
            });

        // Monthly application trend with performance optimization
        $monthlyTrend = $this->getMonthlyTrend($companyIds, $startDate, $endDate, $companyId, $jobId);

        // Application status trend over time (new chart)
        $applicationsByStatusTrend = $this->getApplicationsByStatusTrend($companyIds, $startDate, $endDate, $companyId, $jobId);

        // Conversion rates (applications to different stages)
        $conversionRates = $this->getConversionRates($companyIds, $startDate, $endDate, $companyId, $jobId);

        // Average time in each stage
        $avgTimeInStages = $this->getAverageTimeInStages($companyIds, $startDate, $endDate, $companyId, $jobId);

        // Get available companies for filtering
        $companies = Auth::user()->managedCompanies()->get()->map(function($company) {
            return [
                'id' => $company->id,
                'name' => $company->name,
            ];
        });

        // Get available jobs for filtering based on selected company
        $jobsQuery = Job::whereIn('company_id', $companyId ? [$companyId] : $companyIds)
            ->orderBy('title');
        
        // Apply date filter to jobs if dates are specified
        if ($startDate && $endDate) {
            $jobsQuery->where(function($query) use ($startDate, $endDate) {
                $query->whereBetween('created_at', [$startDate, $endDate])
                    ->orWhereBetween('updated_at', [$startDate, $endDate])
                    ->orWhere('is_active', true);
            });
        }
        
        $jobs = $jobsQuery->with('company')
            ->get()
            ->map(function($job) {
                return [
                    'id' => $job->id,
                    'title' => $job->title,
                    'company_name' => $job->company->name,
                ];
            });

        return Inertia::render('Manager/Analytics/Index', [
            'stats' => [
                'totalJobs' => $totalJobs,
                'totalApplications' => $totalApplications,
                'totalEvents' => $totalEvents,
                'applicationsByStatus' => $applicationsByStatus,
                'applicationsByJob' => $applicationsByJob,
                'monthlyTrend' => $monthlyTrend,
                'applicationsByStatusTrend' => $applicationsByStatusTrend,
                'conversionRates' => $conversionRates,
                'avgTimeInStages' => $avgTimeInStages,
            ],
            'filters' => [
                'startDate' => $startDate,
                'endDate' => $endDate,
                'companyId' => $companyId,
                'jobId' => $jobId,
            ],
            'filterOptions' => [
                'companies' => $companies,
                'jobs' => $jobs,
            ],
        ]);
    }

    /**
     * Check if a string is a valid date
     */
    private function isValidDate($date, $format = 'Y-m-d')
    {
        $d = Carbon::createFromFormat($format, $date);
        return $d && $d->format($format) === $date;
    }

    /**
     * Get application status trend over time
     */
    private function getApplicationsByStatusTrend($companyIds, $startDate, $endDate, $companyId = null, $jobId = null)
    {
        // Create a cache key for this specific set of parameters
        $cacheKey = "app_status_trend:{$companyId}:{$jobId}:{$startDate}:{$endDate}";
        
        return cache()->remember($cacheKey, now()->addMinutes(5), function() use ($companyIds, $startDate, $endDate, $companyId, $jobId) {
            // Calculate the range of dates to display
            $start = Carbon::parse($startDate);
            $end = Carbon::parse($endDate);
            
            // If the range is more than 30 days, we'll aggregate by week
            $aggregateByWeek = $end->diffInDays($start) > 30;
            
            // Get all statuses
            $statuses = ApplicationStatus::orderBy('order')->get();
            
            // Base query for applications
            $query = JobApplication::whereHas('job', function($query) use ($companyIds, $companyId) {
                $query->whereIn('company_id', $companyId ? [$companyId] : $companyIds);
            })->whereBetween('created_at', [$startDate, $endDate]);
            
            if ($jobId) {
                $query->where('job_id', $jobId);
            }
            
            // Get all applications within the date range
            $applications = $query->select('id', 'status_id', 'created_at')
                ->with('status:id,name,color')
                ->get();
            
            // Prepare result array
            $result = [];
            
            if ($aggregateByWeek) {
                // Group by week
                $period = new \DatePeriod(
                    $start->copy()->startOfWeek(),
                    new \DateInterval('P1W'),
                    $end->copy()->endOfWeek()->addDay()
                );
                
                foreach ($period as $date) {
                    $weekEnd = $date->copy()->addDays(6);
                    $weekLabel = $date->format('M d') . ' - ' . $weekEnd->format('M d');
                    
                    $dataPoint = ['date' => $weekLabel];
                    
                    foreach ($statuses as $status) {
                        $count = $applications->filter(function ($app) use ($date, $weekEnd, $status) {
                            $appDate = Carbon::parse($app->created_at);
                            return $app->status_id == $status->id && 
                                   $appDate->greaterThanOrEqualTo($date) && 
                                   $appDate->lessThanOrEqualTo($weekEnd);
                        })->count();
                        
                        $dataPoint[$status->name] = $count;
                    }
                    
                    $result[] = $dataPoint;
                }
            } else {
                // Group by day
                $period = new \DatePeriod(
                    $start,
                    new \DateInterval('P1D'),
                    $end->addDay()
                );
                
                foreach ($period as $date) {
                    $dayLabel = $date->format('M d');
                    
                    $dataPoint = ['date' => $dayLabel];
                    
                    foreach ($statuses as $status) {
                        $count = $applications->filter(function ($app) use ($date, $status) {
                            return $app->status_id == $status->id && 
                                   Carbon::parse($app->created_at)->format('Y-m-d') == $date->format('Y-m-d');
                        })->count();
                        
                        $dataPoint[$status->name] = $count;
                    }
                    
                    $result[] = $dataPoint;
                }
            }
            
            return $result;
        });
    }

    /**
     * Calculate percentage of part to whole
     */
    private function calculatePercentage($part, $whole)
    {
        if ($whole == 0) return 0;
        return round(($part / $whole) * 100, 1);
    }

    /**
     * Get total applications for reference
     */
    private function getTotalApplications($companyIds, $startDate, $endDate, $companyId = null, $jobId = null)
    {
        $query = JobApplication::whereHas('job', function($query) use ($companyIds, $companyId) {
            $query->whereIn('company_id', $companyId ? [$companyId] : $companyIds);
        })->whereBetween('created_at', [$startDate, $endDate]);

        if ($jobId) {
            $query->where('job_id', $jobId);
        }

        return $query->count();
    }

    /**
     * Get monthly application trend
     */
    private function getMonthlyTrend($companyIds, $startDate, $endDate, $companyId = null, $jobId = null)
    {
        $start = \Carbon\Carbon::parse($startDate)->startOfMonth();
        $end = \Carbon\Carbon::parse($endDate)->endOfMonth();
        $months = [];

        for ($month = $start; $month->lte($end); $month->addMonth()) {
            $monthStart = $month->copy()->startOfMonth();
            $monthEnd = $month->copy()->endOfMonth();

            // Jobs query
            $jobsQuery = Job::whereIn('company_id', $companyId ? [$companyId] : $companyIds)
                ->whereBetween('created_at', [$monthStart, $monthEnd]);

            // Applications query
            $applicationsQuery = JobApplication::whereHas('job', function($query) use ($companyIds, $companyId) {
                $query->whereIn('company_id', $companyId ? [$companyId] : $companyIds);
            })->whereBetween('created_at', [$monthStart, $monthEnd]);

            if ($jobId) {
                $applicationsQuery->where('job_id', $jobId);
            }

            $months[] = [
                'month' => $month->format('M Y'),
                'jobs' => $jobsQuery->count(),
                'applications' => $applicationsQuery->count(),
            ];
        }

        return $months;
    }

    /**
     * Get conversion rates between application stages
     */
    private function getConversionRates($companyIds, $startDate, $endDate, $companyId = null, $jobId = null)
    {
        // Get the statuses in order
        $statuses = ApplicationStatus::orderBy('order')->get();

        $query = JobApplication::whereHas('job', function($query) use ($companyIds, $companyId) {
            $query->whereIn('company_id', $companyId ? [$companyId] : $companyIds);
        })->whereBetween('created_at', [$startDate, $endDate]);

        if ($jobId) {
            $query->where('job_id', $jobId);
        }

        $totalApplications = $query->count();
        $conversions = [];

        foreach ($statuses as $index => $status) {
            $countInStatus = $query->clone()->where('status_id', $status->id)->count();

            $conversions[] = [
                'status' => $status->name,
                'color' => $status->color,
                'count' => $countInStatus,
                'percentage' => $this->calculatePercentage($countInStatus, $totalApplications),
                'conversion_rate' => $index > 0 && isset($conversions[$index-1]['count']) && $conversions[$index-1]['count'] > 0
                    ? $this->calculatePercentage($countInStatus, $conversions[$index-1]['count'])
                    : 0,
            ];
        }

        return $conversions;
    }

    /**
     * Get average time applications spend in each stage
     */
    private function getAverageTimeInStages($companyIds, $startDate, $endDate, $companyId = null, $jobId = null)
    {
        // This would require additional database schema for tracking stage history with timestamps
        // For now, we'll return a placeholder with some estimated data

        // Get the hiring stages
        $stages = \App\Models\HiringStage::orderBy('order_index')->get();

        return $stages->map(function($stage) {
            // In a real implementation, we would calculate actual average times from the database
            return [
                'stage' => $stage->name,
                'color' => $stage->color,
                'average_days' => rand(1, 7), // Placeholder for real data
            ];
        });
    }

    /**
     * Get daily application trend for a specific job
     */
    private function getDailyTrend($jobId)
    {
        // Define the date range (last 30 days)
        $startDate = now()->subDays(30)->startOfDay();
        $endDate = now()->endOfDay();

        // Get all applications for this job in the last 30 days
        $applications = JobApplication::where('job_id', $jobId)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->get();

        // Group by day
        $dailyData = [];
        for ($day = $startDate->copy(); $day->lte($endDate); $day->addDay()) {
            $date = $day->format('Y-m-d');
            $count = $applications->filter(function($application) use ($date) {
                return $application->created_at->format('Y-m-d') === $date;
            })->count();

            $dailyData[] = [
                'date' => $day->format('M d'),
                'count' => $count,
            ];
        }

        return $dailyData;
    }

    /**
     * Get conversion funnel for a specific job
     */
    private function getJobConversionFunnel($jobId)
    {
        // Get the job's hiring stages in order
        $job = Job::with(['hiringStages' => function($query) {
            $query->orderBy('job_hiring_stages.order_index');
        }])->findOrFail($jobId);

        $stages = $job->hiringStages;

        // Get all applications for this job
        $totalApplications = JobApplication::where('job_id', $jobId)->count();

        $funnel = [];

        foreach ($stages as $index => $stage) {
            $applicationsInStage = JobApplication::where('job_id', $jobId)
                ->where('current_stage_id', $stage->id)
                ->count();

            $funnel[] = [
                'stage' => $stage->name,
                'color' => $stage->color,
                'count' => $applicationsInStage,
                'percentage' => $this->calculatePercentage($applicationsInStage, $totalApplications),
                'conversion_rate' => $index > 0 && isset($funnel[$index-1]['count']) && $funnel[$index-1]['count'] > 0
                    ? $this->calculatePercentage($applicationsInStage, $funnel[$index-1]['count'])
                    : 0,
            ];
        }

        return $funnel;
    }
}
