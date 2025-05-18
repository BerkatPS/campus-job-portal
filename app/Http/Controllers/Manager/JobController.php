<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Models\Job;
use App\Models\Company;
use App\Models\HiringStage;
use App\Http\Requests\Manager\JobRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class JobController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Get companies managed by the current user
        $userCompanies = Auth::user()->managedCompanies()->pluck('id');

        $jobs = Job::whereIn('company_id', $userCompanies)
            ->with(['company', 'category'])
            ->withCount('jobApplications')
            ->latest()
            ->paginate(10)
            ->through(function ($job) {
                // Determine the correct status based on status field and is_active flag
                $status = $this->determineJobStatus($job);

                return [
                    'id' => $job->id,
                    'title' => $job->title,
                    'category' => $job->category ? [
                        'id' => $job->category->id,
                        'name' => $job->category->name,
                    ] : null,
                    'company' => [
                        'id' => $job->company->id,
                        'name' => $job->company->name,
                        'logo' => $job->company->logo ? asset('storage/' . $job->company->logo) : null,
                    ],
                    'location' => $job->location,
                    'job_type' => $job->job_type,
                    'applications_count' => $job->job_applications_count,
                    'submission_deadline' => $job->submission_deadline->format('Y-m-d'),
                    'deadline' => $job->deadline ? $job->deadline->format('Y-m-d') : null,
                    'is_active' => $job->is_active,
                    'status' => $status, // Use the determined status
                    'created_at' => $job->created_at->format('Y-m-d'),
                ];
            });

        // Get filter options
        $categories = \App\Models\Category::orderBy('name')->get();
        $companies = Auth::user()->managedCompanies()->get();
        $locations = Job::whereIn('company_id', $userCompanies)
            ->distinct('location')
            ->pluck('location')
            ->filter();

        return Inertia::render('Manager/Jobs/Index', [
            'jobs' => $jobs,
            'filters' => [
                'search' => request('search'),
                'status' => request('status'),
                'category' => request('category'),
                'location' => request('location'),
            ],
            'filterOptions' => [
                'categories' => $categories,
                'companies' => $companies,
                'locations' => $locations,
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Get companies managed by the current user
        $companies = Auth::user()->managedCompanies()->get()->map(function($company) {
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

        // Get categories for job
        $categories = \App\Models\Category::orderBy('name')->get()->map(function($category) {
            return [
                'id' => $category->id,
                'name' => $category->name,
            ];
        });

        // Get predefined skills
        $skills = [
            'PHP', 'JavaScript', 'HTML', 'CSS', 'React', 'Vue', 'Angular',
            'Laravel', 'Symfony', 'Django', 'Ruby on Rails', 'Node.js',
            'Python', 'Java', 'C#', 'C++', 'Swift', 'Kotlin', 'Go',
            'SQL', 'NoSQL', 'MongoDB', 'MySQL', 'PostgreSQL', 'Oracle',
            'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'DevOps',
            'UI/UX', 'Figma', 'Adobe XD', 'Photoshop', 'Illustrator',
            'Project Management', 'Agile', 'Scrum', 'Jira', 'Confluence'
        ];

        return Inertia::render('Manager/Jobs/Create', [
            'companies' => $companies,
            'hiringStages' => $hiringStages,
            'categories' => $categories,
            'skills' => $skills,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(JobRequest $request)
    {
        // Validasi apakah perusahaan yang dipilih memang dikelola oleh user
        $company = Company::findOrFail($request->company_id);
        if (!Auth::user()->managedCompanies->contains($company->id)) {
            return redirect()->back()->with('error', 'Anda tidak berwenang untuk memposting pekerjaan untuk perusahaan ini.');
        }

        // Ensure is_active and status are properly synchronized
        $validatedData = $request->validated();
        $validatedData = $this->synchronizeStatusAndIsActive($validatedData);

        // Membuat pekerjaan baru
        $job = Job::create($validatedData);

        // Menyimpan tahapan perekrutan
        if ($request->has('hiring_stages')) {
            foreach ($request->hiring_stages as $index => $stageId) {
                $job->jobHiringStages()->create([
                    'hiring_stage_id' => $stageId,
                    'order_index' => $index,
                ]);
            }
        } else {
            // Menggunakan tahapan perekrutan default
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

        // Notifikasi untuk manager perusahaan lainnya
        $companyManagers = $company->managers;
        foreach ($companyManagers as $manager) {
            if ($manager->id !== Auth::id()) { // Don't notify the creator
                $manager->notify(new \App\Notifications\JobCreated($job, [
                    'created_by' => Auth::id(),
                    'created_by_name' => Auth::user()->name,
                ]));
            }
        }

        // Jika job aktif/published, kirim notifikasi ke semua kandidat
        if ($validatedData['is_active']) {
            // Dapatkan semua user dengan role kandidat (role_id = 3) yang aktif
            $candidates = \App\Models\User::where('role_id', 3)
                ->where('is_active', true)
                ->get();
            
            // Kirim notifikasi ke semua kandidat
            foreach ($candidates as $candidate) {
                $candidate->notify(new \App\Notifications\JobCreated($job, [
                    'created_by' => Auth::id(),
                    'created_by_name' => Auth::user()->name,
                ]));
            }
        }

        return redirect()->route('manager.jobs.index')->with('success', 'Lowongan pekerjaan berhasil dibuat.');
    }


    /**
     * Display the specified resource.
     */
    public function show(Job $job)
    {
        // Check if user has access to this job's company
        if (!Auth::user()->managedCompanies->contains($job->company_id)) {
            abort(403, 'Unauthorized action.');
        }

        $job->load(['company', 'hiringStages', 'jobApplications' => function($query) {
            $query->with(['user', 'status', 'currentStage']);
        }]);

        // Ensure status is correctly determined
        $status = $this->determineJobStatus($job);

        return Inertia::render('Manager/Jobs/Show', [
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
                'status' => $status, // Use the determined status
                'created_at' => $job->created_at->format('M d, Y'),
                'hiring_stages' => $job->hiringStages->map(function($stage) {
                    return [
                        'id' => $stage->id,
                        'name' => $stage->name,
                        'order_index' => $stage->pivot->order_index,
                    ];
                }),
                'applications' => $job->jobApplications->map(function($application) {
                    return [
                        'id' => $application->id,
                        'user' => [
                            'id' => $application->user->id,
                            'name' => $application->user->name,
                            'email' => $application->user->email,
                            'avatar' => $application->user->avatar ? asset('storage/' . $application->user->avatar) : null,
                        ],
                        'status' => [
                            'id' => $application->status->id,
                            'name' => $application->status->name,
                            'color' => $application->status->color,
                        ],
                        'current_stage' => $application->currentStage ? [
                            'id' => $application->currentStage->id,
                            'name' => $application->currentStage->name,
                            'color' => $application->currentStage->color,
                        ] : null,
                        'created_at' => $application->created_at->format('M d, Y'),
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
        // Check if user has access to this job's company
        if (!Auth::user()->managedCompanies->contains($job->company_id)) {
            abort(403, 'Unauthorized action.');
        }

        $job->load('hiringStages');

        // Get companies managed by the current user
        $companies = Auth::user()->managedCompanies()->get()->map(function($company) {
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

        // Get categories for job
        $categories = \App\Models\Category::orderBy('name')->get()->map(function($category) {
            return [
                'id' => $category->id,
                'name' => $category->name,
            ];
        });

        // Ensure status is correctly determined
        $status = $this->determineJobStatus($job);

        return Inertia::render('Manager/Jobs/Edit', [
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
                'status' => $status, // Use the determined status
                'category_id' => $job->category_id,
                'skills' => $job->skills ?? [],
                'deadline' => $job->deadline ? $job->deadline->format('Y-m-d') : null,
            ],
            'companies' => $companies,
            'hiringStages' => $hiringStages,
            'selectedStages' => $job->hiringStages->sortBy('pivot.order_index')->pluck('id'),
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(JobRequest $request, Job $job)
    {
        // Check if user has access to this job's company
        if (!Auth::user()->managedCompanies->contains($job->company_id)) {
            abort(403, 'Unauthorized action.');
        }

        // If company is being changed, ensure user manages the new company
        if ($job->company_id !== $request->company_id) {
            if (!Auth::user()->managedCompanies->contains($request->company_id)) {
                return redirect()->back()->with('error', 'You are not authorized to assign this job to this company.');
            }
        }

        // Ensure is_active and status are properly synchronized
        $validatedData = $request->validated();
        $validatedData = $this->synchronizeStatusAndIsActive($validatedData);

        // Cek apakah status job berubah dari tidak aktif menjadi aktif
        $wasActive = $job->is_active;
        $willBeActive = $validatedData['is_active'];
        $becomingActive = !$wasActive && $willBeActive;

        // Update the job
        $job->update($validatedData);

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

        // Jika job baru saja diaktifkan, kirim notifikasi ke semua kandidat
        if ($becomingActive) {
            // Dapatkan semua user dengan role kandidat (role_id = 3) yang aktif
            $candidates = \App\Models\User::where('role_id', 3)
                ->where('is_active', true)
                ->get();
            
            // Kirim notifikasi ke semua kandidat
            foreach ($candidates as $candidate) {
                $candidate->notify(new \App\Notifications\JobCreated($job, [
                    'created_by' => Auth::id(),
                    'created_by_name' => Auth::user()->name,
                ]));
            }
        }

        return redirect()->route('manager.jobs.index')->with('success', 'Job updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Job $job)
    {
        // Check if user has access to this job's company
        if (!Auth::user()->managedCompanies->contains($job->company_id)) {
            abort(403, 'Unauthorized action.');
        }

        // Check if job has applications
        if ($job->jobApplications()->exists()) {
            return back()->with('error', 'Cannot delete job as it has applications.');
        }

        $job->delete();

        return redirect()->route('manager.jobs.index')->with('success', 'Job deleted successfully.');
    }

    /**
     * Toggle job active status.
     */
    public function toggleActive(Job $job)
    {
        // Check if user has access to this job's company
        if (!Auth::user()->managedCompanies->contains($job->company_id)) {
            abort(403, 'Unauthorized action.');
        }

        $oldStatus = $job->is_active ? 'active' : 'inactive';
        $newIsActive = !$job->is_active;
        $becomingActive = !$job->is_active && $newIsActive;

        $job->update([
            'is_active' => $newIsActive,
            'status' => $newIsActive ? 'active' : ($job->status === 'active' ? 'closed' : $job->status),
        ]);

        $newStatus = $job->is_active ? 'active' : 'inactive';

        // Notify company managers about job status change
        $companyManagers = $job->company->managers;
        foreach ($companyManagers as $manager) {
            if ($manager->id !== Auth::id()) { // Don't notify the toggler
                $manager->notify(new \App\Notifications\JobStatusChanged($job, [
                    'old_status' => $oldStatus,
                    'new_status' => $newStatus,
                    'updated_by' => Auth::id(),
                    'updated_by_name' => Auth::user()->name,
                ]));
            }
        }

        // Jika job baru saja diaktifkan, kirim notifikasi ke semua kandidat
        if ($becomingActive) {
            // Dapatkan semua user dengan role kandidat (role_id = 3) yang aktif
            $candidates = \App\Models\User::where('role_id', 3)
                ->where('is_active', true)
                ->get();
            
            // Kirim notifikasi ke semua kandidat
            foreach ($candidates as $candidate) {
                $candidate->notify(new \App\Notifications\JobCreated($job, [
                    'created_by' => Auth::id(),
                    'created_by_name' => Auth::user()->name,
                ]));
            }
        }

        return back()->with('success', $job->is_active ? 'Job activated successfully.' : 'Job deactivated successfully.');
    }

    /**
     * Helper method to determine job status from both status field and is_active flag
     */
    private function determineJobStatus($job)
    {
        if ($job->status === 'active' || ($job->is_active === true && (!$job->status || $job->status === ''))) {
            return 'active';
        } else if ($job->status === 'draft') {
            return 'draft';
        } else if ($job->status === 'closed' || ($job->status === undefined && $job->is_active === false)) {
            return 'closed';
        } else {
            return $job->is_active ? 'active' : 'closed';
        }
    }

    /**
     * Helper method to ensure is_active flag and status field are synchronized
     */
    private function synchronizeStatusAndIsActive($data)
    {
        // If status is set, ensure is_active flag matches the status
        if (isset($data['status'])) {
            $data['is_active'] = $data['status'] === 'active';
        }
        // If is_active is set but status is not, set status based on is_active
        else if (isset($data['is_active']) && !isset($data['status'])) {
            $data['status'] = $data['is_active'] ? 'active' : 'closed';
        }
        // If neither is set, default to draft
        else if (!isset($data['is_active']) && !isset($data['status'])) {
            $data['is_active'] = false;
            $data['status'] = 'draft';
        }

        return $data;
    }
}
