<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\User;
use App\Http\Requests\Admin\CompanyRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class CompanyController extends Controller
{
    /**
     * Display a listing of the companies.
     */
    public function index(Request $request)
    {
        $query = Company::query();

        // Apply search filter
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('industry', 'like', "%{$search}%");
            });
        }

        // Apply active filter
        if ($request->has('is_active') && $request->is_active !== null) {
            $query->where('is_active', $request->is_active === 'true' || $request->is_active === '1');
        }

        // Apply industry filter
        if ($request->has('industry') && $request->industry) {
            $query->where('industry', $request->industry);
        }

        // Sort
        $sortBy = $request->sort_by ?? 'created_at';
        $sortOrder = $request->sort_order ?? 'desc';
        $query->orderBy($sortBy, $sortOrder);

        $companies = $query->paginate(10)->through(function ($company) {
            return [
                'id' => $company->id,
                'name' => $company->name,
                'description' => $company->description,
                'logo' => $company->logo ? asset('storage/' . $company->logo) : null,
                'website' => $company->website,
                'address' => $company->address,
                'phone' => $company->phone,
                'email' => $company->email,
                'industry' => $company->industry,
                'is_active' => $company->is_active,
                'created_at' => $company->created_at->format('Y-m-d'),
                'updated_at' => $company->updated_at->format('Y-m-d'),
            ];
        });

        // Get unique industries for filter
        $industries = Company::distinct()->pluck('industry')->filter()->values();

        return Inertia::render('Admin/Companies/Index', [
            'companies' => $companies,
            'filters' => $request->only(['search', 'is_active', 'industry']),
            'industries' => $industries,
            'sorting' => [
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
            ],
        ]);
    }

    /**
     * Show the form for creating a new company.
     */
    public function create()
    {
        // Get unique industries for dropdown
        $industries = Company::distinct()->pluck('industry')->filter()->values();

        return Inertia::render('Admin/Companies/Create', [
            'industries' => $industries
        ]);
    }

    /**
     * Store a newly created company in storage.
     */
    public function store(CompanyRequest $request)
    {
        // Log request details for debugging
        \Log::info('Company creation request', [
            'hasFile' => $request->hasFile('logo'),
            'allFiles' => $request->allFiles(),
            'request_data' => $request->except(['logo'])
        ]);

        try {
            $data = $request->validated();

            // Handle logo upload
            if ($request->hasFile('logo') && $request->file('logo')->isValid()) {
                try {
                    // Log file details for debugging
                    \Log::info('Logo upload details:', [
                        'original_name' => $request->file('logo')->getClientOriginalName(),
                        'size' => $request->file('logo')->getSize(),
                        'mime' => $request->file('logo')->getMimeType()
                    ]);

                    // Store the logo file
                    $logoPath = $request->file('logo')->store('company_logos', 'public');

                    // Verify file was stored successfully
                    if (!$logoPath) {
                        throw new \Exception('Failed to store logo file');
                    }

                    $data['logo'] = $logoPath;
                    \Log::info('Logo saved successfully at: ' . $logoPath);

                } catch (\Exception $e) {
                    \Log::error('Logo upload failed: ' . $e->getMessage());
                    \Log::error($e->getTraceAsString());

                    return redirect()->back()
                        ->with('error', 'Gagal mengupload logo: ' . $e->getMessage())
                        ->withInput();
                }
            } else if ($request->hasFile('logo') && !$request->file('logo')->isValid()) {
                \Log::error('Invalid logo file uploaded');
                return redirect()->back()
                    ->with('error', 'File logo tidak valid')
                    ->withInput();
            }

            // Create the company
            $company = Company::create($data);
            \Log::info('Company created successfully with ID: ' . $company->id);

            return redirect()->route('admin.companies.index')
                ->with('success', 'Perusahaan berhasil dibuat.');

        } catch (\Exception $e) {
            \Log::error('Company creation failed: ' . $e->getMessage());
            \Log::error($e->getTraceAsString());

            return redirect()->back()
                ->with('error', 'Gagal membuat perusahaan: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Display the specified company.
     */
    public function show(Company $company)
    {
        // Load related data
        $company->load(['managers', 'jobs' => function($query) {
            $query->orderBy('created_at', 'desc');
        }]);

        // Get company managers
        $managers = $company->companyManagers()
            ->with(['user', 'user.role'])
            ->get()
            ->map(function($manager) {
                return [
                    'id' => $manager->id,
                    'user_id' => $manager->user_id,
                    'is_primary' => $manager->is_primary,
                    'user' => [
                        'id' => $manager->user->id,
                        'name' => $manager->user->name,
                        'email' => $manager->user->email,
                        'avatar' => $manager->user->avatar ? asset('storage/' . $manager->user->avatar) : null,
                        'is_active' => $manager->user->is_active,
                        'role' => $manager->user->role ? [
                            'id' => $manager->user->role->id,
                            'name' => $manager->user->role->name,
                        ] : null,
                    ],
                    'created_at' => $manager->created_at->format('Y-m-d'),
                ];
            });

        // Get all jobs
        $jobs = $company->jobs->map(function($job) {
            return [
                'id' => $job->id,
                'title' => $job->title,
                'location' => $job->location,
                'job_type' => $job->job_type,
                'experience_level' => $job->experience_level,
                'status' => $job->status,
                'is_active' => $job->is_active,
                'applications_count' => $job->jobApplications()->count(),
                'submission_deadline' => $job->submission_deadline->format('Y-m-d'),
                'created_at' => $job->created_at->format('Y-m-d'),
                'category' => $job->category ? [
                    'id' => $job->category->id,
                    'name' => $job->category->name,
                ] : null,
            ];
        });

        // Get job statistics
        $jobStats = [
            'total' => $company->jobs()->count(),
            'active' => $company->jobs()->where(function($query) {
                $query->where('is_active', true)->orWhere('status', 'active');
            })->count(),
            'draft' => $company->jobs()->where('status', 'draft')->count(),
            'closed' => $company->jobs()->where(function($query) {
                $query->where('is_active', false)->orWhere('status', 'closed');
            })->count(),
        ];

        // Get application statistics
        $applicationStats = [
            'total' => $company->jobs()->withCount(['jobApplications'])->get()->sum('job_applications_count'),
            'pending' => $company->jobs()->withCount(['jobApplications' => function($query) {
                $query->whereHas('status', function($q) {
                    $q->where('slug', 'pending');
                });
            }])->get()->sum('job_applications_count'),
            'accepted' => $company->jobs()->withCount(['jobApplications' => function($query) {
                $query->whereHas('status', function($q) {
                    $q->where('slug', 'accepted');
                });
            }])->get()->sum('job_applications_count'),
            'rejected' => $company->jobs()->withCount(['jobApplications' => function($query) {
                $query->whereHas('status', function($q) {
                    $q->where('slug', 'rejected');
                });
            }])->get()->sum('job_applications_count'),
        ];

        return Inertia::render('Admin/Companies/Show', [
            'company' => [
                'id' => $company->id,
                'name' => $company->name,
                'description' => $company->description,
                'logo' => $company->logo ? asset('storage/' . $company->logo) : null,
                'website' => $company->website,
                'address' => $company->address,
                'phone' => $company->phone,
                'email' => $company->email,
                'industry' => $company->industry,
                'is_active' => $company->is_active,
                'created_at' => $company->created_at->format('Y-m-d'),
                'updated_at' => $company->updated_at->format('Y-m-d'),
                'managers_count' => $managers->count(),
            ],
            'managers' => $managers,
            'jobs' => $jobs,
            'stats' => [
                'jobs' => $jobStats,
                'applications' => $applicationStats,
            ],
        ]);
    }

    /**
     * Show the form for editing the specified company.
     */
    public function edit(Company $company)
    {
        // Get unique industries for dropdown
        $industries = Company::distinct()->pluck('industry')->filter()->values();

        return Inertia::render('Admin/Companies/Edit', [
            'company' => [
                'id' => $company->id,
                'name' => $company->name,
                'description' => $company->description,
                'logo' => $company->logo ? asset('storage/' . $company->logo) : null,
                'website' => $company->website,
                'address' => $company->address,
                'phone' => $company->phone,
                'email' => $company->email,
                'industry' => $company->industry,
                'is_active' => $company->is_active,
                'created_at' => $company->created_at->format('Y-m-d'),
                'updated_at' => $company->updated_at->format('Y-m-d'),
            ],
            'industries' => $industries
        ]);
    }

    /**
     * Update the specified company in storage.
     */
    public function update(CompanyRequest $request, Company $company)
    {
        // Log request details for debugging
        \Log::info('Company update request', [
            'company_id' => $company->id,
            'hasFile' => $request->hasFile('logo'),
            'allFiles' => $request->allFiles(),
            'request_data' => $request->except(['logo'])
        ]);

        try {
            $data = $request->validated();

            // Handle logo upload
            if ($request->hasFile('logo') && $request->file('logo')->isValid()) {
                try {
                    // Log file details for debugging
                    \Log::info('Logo update details:', [
                        'original_name' => $request->file('logo')->getClientOriginalName(),
                        'size' => $request->file('logo')->getSize(),
                        'mime' => $request->file('logo')->getMimeType()
                    ]);

                    // Delete old logo if it exists
                    if ($company->logo) {
                        Storage::disk('public')->delete($company->logo);
                        \Log::info('Old logo deleted: ' . $company->logo);
                    }

                    // Store the new logo file
                    $logoPath = $request->file('logo')->store('company_logos', 'public');

                    // Verify file was stored successfully
                    if (!$logoPath) {
                        throw new \Exception('Failed to store logo file');
                    }

                    $data['logo'] = $logoPath;
                    \Log::info('New logo saved successfully at: ' . $logoPath);

                } catch (\Exception $e) {
                    \Log::error('Logo update failed: ' . $e->getMessage());
                    \Log::error($e->getTraceAsString());

                    return redirect()->back()
                        ->with('error', 'Gagal mengupload logo baru: ' . $e->getMessage())
                        ->withInput();
                }
            } else if ($request->hasFile('logo') && !$request->file('logo')->isValid()) {
                \Log::error('Invalid logo file uploaded for update');
                return redirect()->back()
                    ->with('error', 'File logo tidak valid')
                    ->withInput();
            }

            // Update the company
            $company->update($data);
            \Log::info('Company updated successfully: ' . $company->id);

            return redirect()->route('admin.companies.index')
                ->with('success', 'Perusahaan berhasil diperbarui.');

        } catch (\Exception $e) {
            \Log::error('Company update failed: ' . $e->getMessage());
            \Log::error($e->getTraceAsString());

            return redirect()->back()
                ->with('error', 'Gagal memperbarui perusahaan: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Remove the specified company from storage.
     */
    public function destroy(Company $company)
    {
        try {
            // Check if company has jobs
            if ($company->jobs()->exists()) {
                return back()->with('error', 'Tidak dapat menghapus perusahaan yang memiliki lowongan pekerjaan.');
            }

            // Delete logo if it exists
            if ($company->logo) {
                $logoDeleted = Storage::disk('public')->delete($company->logo);
                \Log::info('Company logo deletion: ' . ($logoDeleted ? 'successful' : 'failed') . ' - ' . $company->logo);
            }

            $company->delete();
            \Log::info('Company deleted successfully: ' . $company->id);

            return redirect()->route('admin.companies.index')
                ->with('success', 'Perusahaan berhasil dihapus.');

        } catch (\Exception $e) {
            \Log::error('Company deletion failed: ' . $e->getMessage());
            \Log::error($e->getTraceAsString());

            return back()->with('error', 'Gagal menghapus perusahaan: ' . $e->getMessage());
        }
    }

    /**
     * Toggle the active status of the company.
     */
    public function toggleActive(Company $company)
    {
        try {
            $company->update([
                'is_active' => !$company->is_active,
            ]);

            \Log::info('Company status toggled: ID ' . $company->id . ' is now ' . ($company->is_active ? 'active' : 'inactive'));

            return back()->with('success', 'Status perusahaan berhasil diperbarui.');

        } catch (\Exception $e) {
            \Log::error('Company status toggle failed: ' . $e->getMessage());
            \Log::error($e->getTraceAsString());

            return back()->with('error', 'Gagal memperbarui status perusahaan: ' . $e->getMessage());
        }
    }

    /**
     * Show the form for managing company managers.
     */
    public function manageManagers(Company $company)
    {
        $company->load('managers');

        // Get all users with manager role
        $managers = User::whereHas('role', function($query) {
            $query->where('slug', 'manager');
        })->get();

        return Inertia::render('Admin/Companies/ManageManagers', [
            'company' => [
                'id' => $company->id,
                'name' => $company->name,
                'logo' => $company->logo ? asset('storage/' . $company->logo) : null,
            ],
            'managers' => $managers->map(function($manager) {
                return [
                    'id' => $manager->id,
                    'name' => $manager->name,
                    'email' => $manager->email,
                    'avatar' => $manager->avatar ? asset('storage/' . $manager->avatar) : null,
                ];
            }),
            'company_managers' => $company->managers->pluck('id'),
            'primary_manager' => $company->managers()
                ->wherePivot('is_primary', true)
                ->first()
                ?->id,
        ]);
    }

    /**
     * Update company managers.
     */
    public function updateManagers(Request $request, Company $company)
    {
        try {
            $request->validate([
                'managers' => 'required|array',
                'managers.*' => 'exists:users,id',
                'primary_manager' => 'nullable|exists:users,id',
            ]);

            // Prepare manager data with primary flag
            $managers = collect($request->managers)->mapWithKeys(function($managerId) use ($request) {
                return [$managerId => ['is_primary' => $managerId == $request->primary_manager]];
            })->toArray();

            // Sync managers
            $company->managers()->sync($managers);
            \Log::info('Company managers updated: ID ' . $company->id . ', Managers: ' . implode(', ', array_keys($managers)));

            return back()->with('success', 'Manajer perusahaan berhasil diperbarui.');

        } catch (\Exception $e) {
            \Log::error('Company managers update failed: ' . $e->getMessage());
            \Log::error($e->getTraceAsString());

            return back()->with('error', 'Gagal memperbarui manajer perusahaan: ' . $e->getMessage());
        }
    }
}
