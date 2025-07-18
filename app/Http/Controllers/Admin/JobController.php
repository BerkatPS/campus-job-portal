<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Job;
use App\Models\Company;
use App\Models\HiringStage;
use App\Models\CompanyReview;
use App\Http\Requests\Admin\JobRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class JobController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Get filter parameters
        $search = $request->query('search');
        $categoryId = $request->query('category');
        $status = $request->query('status');

        // Start the query
        $query = Job::with(['company', 'category'])
            ->withCount('jobApplications');

        // Apply filters
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhereHas('company', function($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%");
                  })
                  ->orWhere('location', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($categoryId) {
            $query->where('category_id', $categoryId);
        }

        if ($status) {
            if ($status === 'active') {
                $query->where('is_active', true);
            } else if ($status === 'closed') {
                $query->where('is_active', false);
            }
        }

        // Apply sorting
        $sortBy = $request->query('sort') ?? 'created_at';
        $sortOrder = $request->query('sort_order') ?? 'desc';
        $query->orderBy($sortBy, $sortOrder);

        // Set per_page from request or use default
        $perPage = $request->query('per_page') ?? 10;
        
        // Get jobs with pagination
        $jobs = $query->paginate($perPage)
            ->through(function ($job) {
                return [
                    'id' => $job->id,
                    'title' => $job->title,
                    'company' => $job->company ? [
                        'id' => $job->company->id,
                        'name' => $job->company->name,
                        'logo' => $job->company->logo ? asset('storage/' . $job->company->logo) : null,
                    ] : null,
                    'category' => $job->category ? [
                        'id' => $job->category->id,
                        'name' => $job->category->name,
                    ] : null,
                    'location' => $job->location,
                    'type' => $job->type ?? $job->job_type,
                    'applications_count' => $job->job_applications_count,
                    'salary_min' => $job->salary_min,
                    'salary_max' => $job->salary_max,
                    'deadline' => $job->deadline ? $job->deadline->format('Y-m-d') : 
                                ($job->submission_deadline ? $job->submission_deadline->format('Y-m-d') : null),
                    'status' => $job->is_active ? 'active' : 'closed',
                    'created_at' => $job->created_at->format('Y-m-d'),
                ];
            });

        // Get categories for filtering
        $categories = \App\Models\Category::orderBy('name')
            ->get()
            ->map(function($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                ];
            });

        return Inertia::render('Admin/Jobs/Index', [
            'jobs' => $jobs,
            'filters' => [
                'search' => $search,
                'category' => $categoryId,
                'status' => $status
            ],
            'categories' => $categories,
            'sorting' => [
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Get all active companies
        $companies = Company::where('is_active', true)
            ->get()
            ->map(function($company) {
                return [
                    'id' => $company->id,
                    'name' => $company->name,
                ];
            });

        // Get default hiring stages
        $hiringStages = HiringStage::where('is_default', true)
            ->orderBy('order_index')
            ->get()
            ->map(function($stage) {
                return [
                    'id' => $stage->id,
                    'name' => $stage->name,
                    'order_index' => $stage->order_index,
                ];
            });

        return Inertia::render('Admin/Jobs/Create', [
            'companies' => $companies,
            'hiringStages' => $hiringStages,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(JobRequest $request)
    {
        // Create the job
        $job = Job::create($request->validated());

        // Assign hiring stages
        if ($request->has('hiring_stages')) {
            foreach ($request->hiring_stages as $index => $stageId) {
                $job->jobHiringStages()->create([
                    'hiring_stage_id' => $stageId,
                    'order_index' => $index,
                ]);
            }
        } else {
            // Use default hiring stages
            $defaultStages = HiringStage::where('is_default', true)
                ->orderBy('order_index')
                ->get();

            foreach ($defaultStages as $index => $stage) {
                $job->jobHiringStages()->create([
                    'hiring_stage_id' => $stage->id,
                    'order_index' => $index,
                ]);
            }
        }

        return redirect()->route('admin.jobs.index')->with('success', 'Job created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Job $job)
    {
        $job->load(['company', 'hiringStages']);

        return Inertia::render('Admin/Jobs/Show', [
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
                ],
                'location' => $job->location,
                'job_type' => $job->job_type,
                'experience_level' => $job->experience_level,
                'salary_min' => $job->salary_min,
                'salary_max' => $job->salary_max,
                'is_salary_visible' => $job->is_salary_visible,
                'vacancies' => $job->vacancies,
                'submission_deadline' => $job->submission_deadline->format('M d, Y'),
                'is_active' => $job->is_active,
                'created_at' => $job->created_at->format('M d, Y'),
                'hiring_stages' => $job->hiringStages->map(function($stage) {
                    return [
                        'id' => $stage->id,
                        'name' => $stage->name,
                        'order_index' => $stage->pivot->order_index,
                    ];
                }),
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Job $job)
    {
        $job->load('hiringStages');

        // Get all active companies
        $companies = Company::where('is_active', true)
            ->get()
            ->map(function($company) {
                return [
                    'id' => $company->id,
                    'name' => $company->name,
                ];
            });

        // Get all hiring stages
        $hiringStages = HiringStage::orderBy('order_index')
            ->get()
            ->map(function($stage) {
                return [
                    'id' => $stage->id,
                    'name' => $stage->name,
                    'order_index' => $stage->order_index,
                ];
            });

        return Inertia::render('Admin/Jobs/Edit', [
            'job' => [
                'id' => $job->id,
                'title' => $job->title,
                'description' => $job->description,
                'requirements' => $job->requirements,
                'responsibilities' => $job->responsibilities,
                'benefits' => $job->benefits,
                'company_id' => $job->company_id,
                'location' => $job->location,
                'job_type' => $job->job_type,
                'experience_level' => $job->experience_level,
                'salary_min' => $job->salary_min,
                'salary_max' => $job->salary_max,
                'is_salary_visible' => $job->is_salary_visible,
                'vacancies' => $job->vacancies,
                'submission_deadline' => $job->submission_deadline->format('Y-m-d'),
                'is_active' => $job->is_active,
            ],
            'companies' => $companies,
            'hiringStages' => $hiringStages,
            'selectedStages' => $job->hiringStages->sortBy('pivot.order_index')->pluck('id'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(JobRequest $request, Job $job)
    {
        // Update the job
        $job->update($request->validated());

        // Update hiring stages
        if ($request->has('hiring_stages')) {
            // Remove existing stages
            $job->jobHiringStages()->delete();

            // Add new stages
            foreach ($request->hiring_stages as $index => $stageId) {
                $job->jobHiringStages()->create([
                    'hiring_stage_id' => $stageId,
                    'order_index' => $index,
                ]);
            }
        }

        return redirect()->route('admin.jobs.index')->with('success', 'Job updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Job $job)
    {
        try {
            // Begin transaction to ensure all related data is deleted properly
            DB::beginTransaction();
            
            // Check if job has applications
            if ($job->jobApplications()->exists()) {
                // Jika ada aplikasi terkait, periksa apakah ada review terkait
                $hasReviews = CompanyReview::whereHas('jobApplication', function($query) use ($job) {
                    $query->where('job_id', $job->id);
                })->exists();
                
                if ($hasReviews) {
                    DB::rollBack();
                    return response()->json(['message' => 'Tidak dapat menghapus lowongan karena memiliki review perusahaan terkait.'], 422);
                }
                
                // Hapus semua aplikasi terkait terlebih dahulu
                // Ini aman karena kita sudah memeriksa tidak ada review terkait
                $job->jobApplications()->delete();
            }
            
            // Delete events related to this job
            $job->events()->delete();
            
            // Delete job hiring stages first to avoid foreign key constraints
            $job->jobHiringStages()->delete();
            
            // Delete the job
            $job->delete();
            
            // Commit transaction
            DB::commit();
            
            return response()->json(['message' => 'Lowongan berhasil dihapus.']);
        } catch (\Exception $e) {
            // Rollback transaction if any error occurs
            DB::rollBack();
            
            // Log the error for debugging
            Log::error('Failed to delete job: ' . $e->getMessage());
            
            return response()->json(['message' => 'Gagal menghapus lowongan: ' . $e->getMessage()], 500);
        }
    }
}
