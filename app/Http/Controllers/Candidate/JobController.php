<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use App\Models\Job;
use App\Models\Company;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class JobController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // First, update job statuses that have passed their deadline
        $this->updateExpiredJobs();

        // Query to get active jobs from active companies that haven't expired
        $query = Job::with(['company' => function($query) {
            $query->where('is_active', true);
        }])
            ->whereHas('company', function($query) {
                $query->where('is_active', true);
            })
            ->where(function($query) {
                $query->where('status', 'active')
                    ->orWhere(function($q) {
                        $q->where('is_active', true)
                            ->whereNull('status');
                    });
            })
            ->where('submission_deadline', '>=', now());

        // Apply filters
        if ($request->filled('company')) {
            $query->where('company_id', $request->company);
        }

        if ($request->filled('job_type')) {
            $query->where('job_type', $request->job_type);
        }

        if ($request->filled('location')) {
            $query->where('location', 'like', "%{$request->location}%");
        }

        if ($request->filled('experience_level')) {
            $query->where('experience_level', $request->experience_level);
        }

        // Special filter for expired jobs (only if explicitly requested)
        if ($request->filled('status') && $request->status === 'expired') {
            $query->where(function($q) {
                $q->where('submission_deadline', '<', now())
                    ->orWhere(function($subQuery) {
                        $subQuery->where('status', 'closed')
                            ->orWhere('is_active', false);
                    });
            });
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhereHas('company', function($sq) use ($search) {
                        $sq->where('name', 'like', "%{$search}%")
                            ->where('is_active', true);
                    });
            });
        }

        // Order results
        if ($request->filled('sort') && $request->filled('direction')) {
            if ($request->sort === 'company') {
                $query->join('companies', 'jobs.company_id', '=', 'companies.id')
                    ->where('companies.is_active', true)
                    ->orderBy('companies.name', $request->direction)
                    ->select('jobs.*');
            } else {
                $query->orderBy($request->sort, $request->direction);
            }
        } else {
            $query->latest();
        }

        // Paginate results
        $jobs = $query->paginate(12)
            ->through(function ($job) {
                // Calculate job status more accurately
                $status = $this->determineJobStatus($job);

                // Calculate days remaining until deadline
                $daysRemaining = null;
                if ($job->submission_deadline >= now()) {
                    $daysRemaining = now()->diffInDays($job->submission_deadline);
                }

                return [
                    'id' => $job->id,
                    'title' => $job->title,
                    'company' => [
                        'id' => $job->company->id,
                        'name' => $job->company->name,
                        'logo' => $job->company->logo ? asset('storage/' . $job->company->logo) : null,
                    ],
                    'location' => $job->location,
                    'job_type' => $job->job_type,
                    'experience_level' => $job->experience_level,
                    'salary_min' => $job->is_salary_visible ? $job->salary_min : null,
                    'salary_max' => $job->is_salary_visible ? $job->salary_max : null,
                    'submission_deadline' => $job->submission_deadline->format('M d, Y'),
                    'days_remaining' => $daysRemaining,
                    'status' => $status,
                    'created_at' => $job->created_at->format('M d, Y'),
                    'has_applied' => Auth::user()->jobApplications()->where('job_id', $job->id)->exists(),
                ];
            });

        // Generate filter options - only include active companies and jobs
        $filterOptions = $this->generateFilterOptions();

        return Inertia::render('Candidate/Jobs/Index', [
            'jobs' => $jobs,
            'filters' => [
                'search' => $request->search ?? '',
                'company' => $request->company ?? null,
                'job_type' => $request->job_type ?? null,
                'location' => $request->location ?? null,
                'experience_level' => $request->experience_level ?? null,
                'status' => $request->status ?? 'active',
                'sort' => $request->sort ?? 'created_at',
                'direction' => $request->direction ?? 'desc',
            ],
            'filterOptions' => $filterOptions,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Job $job)
    {
        // Update expired jobs first to ensure accurate status
        $this->updateExpiredJobs();

        // Check if job's company is active
        if (!$job->company || !$job->company->is_active) {
            abort(404, 'This job listing is not available');
        }

        // Check if job is in draft status or past deadline (without special access)
        if ($job->status === 'draft' || (!$job->is_active && $job->status !== 'active')) {
            abort(404, 'This job listing is not available');
        }

        // Check if job has passed deadline
        if ($job->submission_deadline < now() && $job->status !== 'closed') {
            // Update job status to closed if past deadline
            $job->update([
                'status' => 'closed',
                'is_active' => false
            ]);
        }

        $job->load('company');

        $hasApplied = Auth::user()->jobApplications()->where('job_id', $job->id)->exists();

        // Calculate job status more accurately
        $status = $this->determineJobStatus($job);

        // Calculate days remaining until deadline
        $daysRemaining = null;
        if ($job->submission_deadline >= now()) {
            $daysRemaining = now()->diffInDays($job->submission_deadline);
        }

        return Inertia::render('Candidate/Jobs/Show', [
            'job' => [
                'id' => $job->id,
                'title' => $job->title,
                'description' => $job->description,
                'requirements' => $job->requirements,
                'responsibilities' => $job->responsibilities,
                'benefits' => $job->benefits,
                'company' => [
                    'id' => $job->company->id,
                    'name' => $job->company->name,
                    'logo' => $job->company->logo ? asset('storage/' . $job->company->logo) : null,
                    'website' => $job->company->website,
                ],
                'location' => $job->location,
                'job_type' => $job->job_type,
                'experience_level' => $job->experience_level,
                'salary_min' => $job->is_salary_visible ? $job->salary_min : null,
                'salary_max' => $job->is_salary_visible ? $job->salary_max : null,
                'vacancies' => $job->vacancies,
                'submission_deadline' => $job->submission_deadline->format('M d, Y'),
                'days_remaining' => $daysRemaining,
                'status' => $status,
                'is_active' => $job->is_active && $job->submission_deadline >= now(),
                'is_expired' => $job->submission_deadline < now(),
                'created_at' => $job->created_at->format('M d, Y'),
                'has_applied' => $hasApplied,
                'can_apply' => !$hasApplied && $job->is_active && $job->submission_deadline >= now() && $job->company->is_active,
            ],
        ]);
    }

    /**
     * Update jobs that have passed their deadline to closed status
     */
    private function updateExpiredJobs()
    {
        Job::where('submission_deadline', '<', now())
            ->where(function($query) {
                $query->where('status', 'active')
                    ->orWhere('is_active', true);
            })
            ->update([
                'status' => 'closed',
                'is_active' => false
            ]);
    }

    /**
     * Helper method to determine job status accurately
     */
    private function determineJobStatus($job)
    {
        // If job deadline has passed, it's expired regardless of other status
        if ($job->submission_deadline < now()) {
            return 'expired';
        }

        // Check other status conditions
        if ($job->status === 'active' || ($job->is_active === true && (!$job->status || $job->status === ''))) {
            return 'active';
        } else if ($job->status === 'draft') {
            return 'draft';
        } else if ($job->status === 'closed' || $job->is_active === false) {
            return 'closed';
        }

        // Default fallback (should rarely reach here)
        return $job->is_active ? 'active' : 'closed';
    }

    /**
     * Generate filter options for the jobs listing
     */
    private function generateFilterOptions()
    {
        // Update expired jobs before generating filter options
        $this->updateExpiredJobs();

        // Get active companies
        $companyOptions = Company::where('is_active', true)
            ->orderBy('name')
            ->get()
            ->map(function($company) {
                return [
                    'id' => $company->id,
                    'name' => $company->name,
                ];
            });

        // Get job types from active jobs
        $jobTypeOptions = Job::select('job_type')
            ->where(function($query) {
                $query->where('status', 'active')
                    ->orWhere(function($q) {
                        $q->where('is_active', true)
                            ->whereNull('status');
                    });
            })
            ->where('submission_deadline', '>=', now())
            ->whereHas('company', function($query) {
                $query->where('is_active', true);
            })
            ->distinct()
            ->pluck('job_type')
            ->map(function($type) {
                return [
                    'value' => $type,
                    'label' => $type,
                ];
            });

        // Get experience levels from active jobs
        $experienceLevelOptions = Job::select('experience_level')
            ->where(function($query) {
                $query->where('status', 'active')
                    ->orWhere(function($q) {
                        $q->where('is_active', true)
                            ->whereNull('status');
                    });
            })
            ->where('submission_deadline', '>=', now())
            ->whereNotNull('experience_level')
            ->whereHas('company', function($query) {
                $query->where('is_active', true);
            })
            ->distinct()
            ->pluck('experience_level')
            ->map(function($level) {
                return [
                    'value' => $level,
                    'label' => $level,
                ];
            });

        // Get locations from active jobs
        $locationOptions = Job::select('location')
            ->where(function($query) {
                $query->where('status', 'active')
                    ->orWhere(function($q) {
                        $q->where('is_active', true)
                            ->whereNull('status');
                    });
            })
            ->where('submission_deadline', '>=', now())
            ->whereHas('company', function($query) {
                $query->where('is_active', true);
            })
            ->distinct()
            ->pluck('location')
            ->map(function($location) {
                return [
                    'value' => $location,
                    'label' => $location,
                ];
            });

        // Status filter options
        $statusOptions = [
            ['value' => 'active', 'label' => 'Active'],
            ['value' => 'expired', 'label' => 'Expired'],
        ];

        return [
            'companies' => $companyOptions,
            'jobTypes' => $jobTypeOptions,
            'experienceLevels' => $experienceLevelOptions,
            'locations' => $locationOptions,
            'statuses' => $statusOptions,
        ];
    }
}
