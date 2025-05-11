<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Job;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class JobController extends Controller
{
    /**
     * Get a list of jobs.
     */
    public function index(Request $request)
    {
        // Query to get active jobs
        $query = Job::with('company')
            ->where('is_active', true)
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

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%")
                    ->orWhereHas('company', function($q2) use ($search) {
                        $q2->where('name', 'like', "%{$search}%");
                    });
                    })
                    ->orWhereHas('hiringStages', function($q3) use ($search) {
                        $q3->where('name', 'like', "%{$search}%");
                    });
        }
        // Order results
        if ($request->filled('sort') && $request->filled('direction')) {
            if ($request->sort === 'company') {
                $query->join('companies', 'jobs.company_id', '=', 'companies.id')
                    ->orderBy('companies.name', $request->direction)
                    ->select('jobs.*');
            } else {
                $query->orderBy($request->sort, $request->direction);
            }
        } else {
            $query->latest();
        }

        // Paginate results
        $perPage = $request->filled('per_page') ? $request->per_page : 10;
        $jobs = $query->paginate($perPage);

        // Transform job data
        $jobs->through(function ($job) {
            $hasApplied = false;
            if (Auth::check()) {
                $hasApplied = Auth::user()->jobApplications()->where('job_id', $job->id)->exists();
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
                'submission_deadline' => $job->submission_deadline->format('Y-m-d'),
                'created_at' => $job->created_at->format('Y-m-d'),
                'has_applied' => $hasApplied,
            ];
        });

        // Get filter options
        $companyOptions = Company::where('is_active', true)
            ->orderBy('name')
            ->get()
            ->map(function($company) {
                return [
                    'id' => $company->id,
                    'name' => $company->name,
                ];
            });

        $jobTypeOptions = Job::select('job_type')
            ->where('is_active', true)
            ->where('submission_deadline', '>=', now())
            ->distinct()
            ->pluck('job_type');

        $experienceLevelOptions = Job::select('experience_level')
            ->where('is_active', true)
            ->where('submission_deadline', '>=', now())
            ->whereNotNull('experience_level')
            ->distinct()
            ->pluck('experience_level');

        $locationOptions = Job::select('location')
            ->where('is_active', true)
            ->where('submission_deadline', '>=', now())
            ->distinct()
            ->pluck('location');

        return response()->json([
            'jobs' => $jobs,
            'filter_options' => [
                'companies' => $companyOptions,
                'job_types' => $jobTypeOptions,
                'experience_levels' => $experienceLevelOptions,
                'locations' => $locationOptions,
            ],
        ]);
    }

    /**
     * Get job details.
     */
    public function show(Job $job)
            {
                $job->load('company');

                $hasApplied = false;
                if (Auth::check()) {
                    $hasApplied = Auth::user()->jobApplications()->where('job_id', $job->id)->exists();
                }

                return response()->json([
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
                        'submission_deadline' => $job->submission_deadline->format('Y-m-d'),
                        'is_active' => $job->is_active,
                        'created_at' => $job->created_at->format('Y-m-d'),
                        'has_applied' => $hasApplied,
                        'can_apply' => !$hasApplied && $job->is_active && $job->submission_deadline >= now(),
                    ],
                ]);
            }

    /**
     * Get recommended jobs.
     */
    public function recommended()
            {
                // Check if user is authenticated
                if (!Auth::check()) {
                    return response()->json(['error' => 'Unauthorized'], 401);
                }

                // Get recommended jobs (simple implementation for now)
                $jobs = Job::with('company')
                    ->where('is_active', true)
                    ->where('submission_deadline', '>=', now())
                    ->latest()
                    ->take(5)
                    ->get()
                    ->map(function($job) {
                        $hasApplied = Auth::user()->jobApplications()->where('job_id', $job->id)->exists();

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
                            'submission_deadline' => $job->submission_deadline->format('Y-m-d'),
                            'has_applied' => $hasApplied,
                        ];
                    });

                return response()->json([
                    'recommended_jobs' => $jobs,
                ]);
            }
}
