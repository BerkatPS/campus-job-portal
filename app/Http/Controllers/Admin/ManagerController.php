<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use App\Models\Company;
use App\Http\Requests\Admin\ManagerRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use App\Models\CompanyManager;

class ManagerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Get all company managers with user and company relations
        $managers = CompanyManager::with(['user', 'user.role', 'company'])
            ->latest()
            ->paginate(10)
            ->through(function ($manager) {
                return [
                    'id' => $manager->id,
                    'user_id' => $manager->user_id,
                    'company_id' => $manager->company_id,
                    'is_primary' => $manager->is_primary,
                    'created_at' => $manager->created_at->format('M d, Y'),
                    'user' => [
                        'id' => $manager->user->id,
                        'name' => $manager->user->name,
                        'email' => $manager->user->email,
                        'avatar' => $manager->user->avatar ? asset('storage/' . $manager->user->avatar) : null,
                        'is_active' => $manager->user->is_active,
                        'role_id' => $manager->user->role_id,
                        'role' => [
                            'id' => $manager->user->role->id,
                            'name' => $manager->user->role->name,
                            'slug' => $manager->user->role->slug,
                        ]
                    ],
                    'company' => [
                        'id' => $manager->company->id,
                        'name' => $manager->company->name,
                        'logo' => $manager->company->logo ? asset('storage/' . $manager->company->logo) : null,
                        'industry' => $manager->company->industry,
                    ],
                ];
            });

        // Get all companies for filtering
        $companies = Company::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        // Get all roles for filtering
        $roles = Role::orderBy('name')
            ->get(['id', 'name', 'slug']);

        return Inertia::render('Admin/Managers/Index', [
            'managers' => $managers,
            'companies' => $companies,
            'roles' => $roles,
            'filters' => request()->all(['search', 'field', 'direction'])
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
                    'is_active' => $company->is_active,
                ];
            });

        // Get admin role to exclude
        $adminRole = Role::where('slug', 'admin')->first();

        // Get all active users except admin role
        $users = User::where('is_active', true)
            ->where('role_id', '!=', $adminRole->id)
            ->orderBy('name')
            ->get()
            ->map(function($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'avatar' => $user->avatar ? asset('storage/' . $user->avatar) : null,
                    'is_active' => $user->is_active,
                    'role' => [
                        'id' => $user->role->id,
                        'name' => $user->role->name,
                        'slug' => $user->role->slug,
                    ]
                ];
            });

        return Inertia::render('Admin/Managers/Create', [
            'companies' => $companies,
            'users' => $users,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'company_id' => 'required|exists:companies,id',
            'user_id' => 'required|exists:users,id',
            'is_primary' => 'boolean',
            'update_role' => 'boolean',
        ]);

        // Check if user is already manager for this company
        $existingManager = CompanyManager::where('company_id', $request->company_id)
            ->where('user_id', $request->user_id)
            ->first();

        if ($existingManager) {
            return redirect()->back()->with('error', 'This user is already a manager for this company.');
        }

        // Check if this is a primary manager
        $isPrimary = $request->boolean('is_primary');

        // If this is a primary manager, update any existing primary managers for this company
        if ($isPrimary) {
            CompanyManager::where('company_id', $request->company_id)
                ->where('is_primary', true)
                ->update(['is_primary' => false]);
        }

        // Create the company manager
        $companyManager = CompanyManager::create([
            'company_id' => $request->company_id,
            'user_id' => $request->user_id,
            'is_primary' => $isPrimary,
        ]);

        // Get the manager role
        $managerRole = Role::where('slug', 'manager')->first();

        // Get the user
        $user = User::find($request->user_id);

        // Auto-update user's role to manager if they are not already a manager
        // or if update_role is explicitly set to true
        if ($user && ($user->role_id != $managerRole->id || $request->boolean('update_role'))) {
            $user->update([
                'role_id' => $managerRole->id
            ]);
        }

        return redirect()->route('admin.managers.index')->with('success', 'Manager assigned to company successfully.');
    }


    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        // Find company manager by ID
        $companyManager = CompanyManager::with(['user', 'user.role', 'company'])->findOrFail($id);

        // Get jobs from the company managed by this manager
        $jobs = $companyManager->company->jobs()
            ->with(['company'])
            ->get()
            ->map(function($job) {
                return [
                    'id' => $job->id,
                    'title' => $job->title,
                    'location' => $job->location,
                    'job_type' => $job->job_type,
                    'is_active' => $job->is_active,
                    'status' => $job->status,
                    'submission_deadline' => $job->submission_deadline,
                    'applications_count' => $job->applications()->count(),
                    'created_at' => $job->created_at,
                    'updated_at' => $job->updated_at,
                ];
            });

        return Inertia::render('Admin/Managers/Show', [
            'manager' => [
                'id' => $companyManager->id,
                'user_id' => $companyManager->user_id,
                'company_id' => $companyManager->company_id,
                'is_primary' => $companyManager->is_primary,
                'created_at' => $companyManager->created_at->format('M d, Y'),
            ],
            'user' => [
                'id' => $companyManager->user->id,
                'name' => $companyManager->user->name,
                'email' => $companyManager->user->email,
                'avatar' => $companyManager->user->avatar ? asset('storage/' . $companyManager->user->avatar) : null,
                'role' => [
                    'id' => $companyManager->user->role->id,
                    'name' => $companyManager->user->role->name,
                    'slug' => $companyManager->user->role->slug,
                ]
            ],
            'company' => [
                'id' => $companyManager->company->id,
                'name' => $companyManager->company->name,
                'logo' => $companyManager->company->logo ? asset('storage/' . $companyManager->company->logo) : null,
                'industry' => $companyManager->company->industry,
            ],
            'jobs' => $jobs,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        // Find company manager by ID
        $companyManager = CompanyManager::with(['user', 'user.role', 'company'])->findOrFail($id);

        // Get all active companies
        $companies = Company::where('is_active', true)
            ->get()
            ->map(function($company) {
                return [
                    'id' => $company->id,
                    'name' => $company->name,
                    'is_active' => $company->is_active,
                ];
            });

        // Get admin role to exclude
        $adminRole = Role::where('slug', 'admin')->first();

        // Get all active users except admin role
        $users = User::where('is_active', true)
            ->where('role_id', '!=', $adminRole->id)
            ->orderBy('name')
            ->get()
            ->map(function($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'avatar' => $user->avatar ? asset('storage/' . $user->avatar) : null,
                    'is_active' => $user->is_active,
                    'role' => [
                        'id' => $user->role->id,
                        'name' => $user->role->name,
                        'slug' => $user->role->slug,
                    ]
                ];
            });

        return Inertia::render('Admin/Managers/Edit', [
            'manager' => [
                'id' => $companyManager->id,
                'user_id' => $companyManager->user_id,
                'company_id' => $companyManager->company_id,
                'is_primary' => $companyManager->is_primary,
                'created_at' => $companyManager->created_at->format('M d, Y'),
            ],
            'user' => [
                'id' => $companyManager->user->id,
                'name' => $companyManager->user->name,
                'email' => $companyManager->user->email,
                'avatar' => $companyManager->user->avatar ? asset('storage/' . $companyManager->user->avatar) : null,
                'role' => [
                    'id' => $companyManager->user->role->id,
                    'name' => $companyManager->user->role->name,
                    'slug' => $companyManager->user->role->slug,
                ]
            ],
            'company' => [
                'id' => $companyManager->company->id,
                'name' => $companyManager->company->name,
                'logo' => $companyManager->company->logo ? asset('storage/' . $companyManager->company->logo) : null,
            ],
            'companies' => $companies,
            'users' => $users,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'company_id' => 'required|exists:companies,id',
            'user_id' => 'required|exists:users,id',
            'is_primary' => 'boolean',
            'update_role' => 'boolean',
        ]);

        // Find company manager by ID
        $companyManager = CompanyManager::findOrFail($id);

        // Check if we're changing the user and if the new user is already a manager for this company
        if ($companyManager->user_id != $request->user_id) {
            $existingManager = CompanyManager::where('company_id', $request->company_id)
                ->where('user_id', $request->user_id)
                ->first();

            if ($existingManager) {
                return redirect()->back()->with('error', 'This user is already a manager for this company.');
            }
        }

        // Check if this is a primary manager
        $isPrimary = $request->boolean('is_primary');

        // If this is a primary manager and the company changed or status changed to primary
        if ($isPrimary &&
            ($companyManager->company_id != $request->company_id || !$companyManager->is_primary)) {
            // Update existing primary managers to secondary
            CompanyManager::where('company_id', $request->company_id)
                ->where('is_primary', true)
                ->update(['is_primary' => false]);
        }

        // Update company manager
        $companyManager->update([
            'company_id' => $request->company_id,
            'user_id' => $request->user_id,
            'is_primary' => $isPrimary,
        ]);

        // Get the manager role
        $managerRole = Role::where('slug', 'manager')->first();

        // Get the user
        $user = User::find($request->user_id);

        // Auto-update user's role to manager if they are not already a manager
        // or if update_role is explicitly set to true
        if ($user && ($user->role_id != $managerRole->id || $request->boolean('update_role'))) {
            $user->update([
                'role_id' => $managerRole->id
            ]);
        }

        return redirect()->route('admin.managers.index')->with('success', 'Manager updated successfully.');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        // Find company manager by ID
        $companyManager = CompanyManager::findOrFail($id);

        // Remove manager association with company
        $companyManager->delete();

        return redirect()->route('admin.managers.index')->with('success', 'Manager association removed successfully.');
    }
}
