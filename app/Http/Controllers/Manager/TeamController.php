<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\User;

class TeamController extends Controller
{
    /**
     * Display a listing of the team members.
     */
    public function index()
    {
        // Get the companies managed by the user
        $companies = Auth::user()->managedCompanies;

        // Get all managers for these companies
        $teamMembers = collect();

        foreach ($companies as $company) {
            $members = $company->managers()
                ->with('role')
                ->get()
                ->map(function($user) use ($company) {
                    $companyManager = $company->companyManagers()
                        ->where('user_id', $user->id)
                        ->first();

                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'avatar' => $user->avatar ? asset('storage/' . $user->avatar) : null,
                        'role' => $user->role ? [
                            'id' => $user->role->id,
                            'name' => $user->role->name,
                        ] : null,
                        'company' => [
                            'id' => $company->id,
                            'name' => $company->name,
                            'logo' => $company->logo ? asset('storage/' . $company->logo) : null,
                        ],
                        'is_primary' => $companyManager ? $companyManager->is_primary : false,
                        'is_current_user' => $user->id === Auth::id(),
                    ];
                });

            $teamMembers = $teamMembers->concat($members);
        }

        // Remove duplicates based on user ID
        $teamMembers = $teamMembers->unique('id')->values();

        return Inertia::render('Manager/Team/Index', [
            'teamMembers' => $teamMembers,
            'companies' => $companies->map(function($company) {
                return [
                    'id' => $company->id,
                    'name' => $company->name,
                    'logo' => $company->logo ? asset('storage/' . $company->logo) : null,
                ];
            }),
        ]);
    }

    /**
     * Display the specified team member.
     */
    public function show($id)
    {
        // Get the user
        $user = User::with('role')->findOrFail($id);

        // Check if the user is a manager of any company managed by the current user
        $companies = Auth::user()->managedCompanies;
        $isTeamMember = false;
        $managedCompanies = collect();

        foreach ($companies as $company) {
            if ($company->managers->contains($user->id)) {
                $isTeamMember = true;
                $managedCompanies->push([
                    'id' => $company->id,
                    'name' => $company->name,
                    'logo' => $company->logo ? asset('storage/' . $company->logo) : null,
                    'is_primary' => $company->companyManagers()
                            ->where('user_id', $user->id)
                            ->first()
                            ->is_primary ?? false,
                ]);
            }
        }

        if (!$isTeamMember) {
            abort(403, 'Unauthorized action.');
        }

        return Inertia::render('Manager/Team/Show', [
            'teamMember' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar ? asset('storage/' . $user->avatar) : null,
                'role' => $user->role ? [
                    'id' => $user->role->id,
                    'name' => $user->role->name,
                ] : null,
                'is_current_user' => $user->id === Auth::id(),
                'companies' => $managedCompanies,
            ],
        ]);
    }

    /**
     * Show the form for editing the specified user's role in the team.
     */
    public function edit($id)
    {
        // This is typically for adjusting role or permissions within the team
        // Since this is more appropriate for admin functionality, we'll keep it simple

        // Get the user
        $user = User::with('role')->findOrFail($id);

        // Check if the user is a manager of any company managed by the current user
        $companies = Auth::user()->managedCompanies;
        $isTeamMember = false;
        $managedCompanies = collect();

        foreach ($companies as $company) {
            if ($company->managers->contains($user->id)) {
                $isTeamMember = true;
                $managedCompanies->push([
                    'id' => $company->id,
                    'name' => $company->name,
                    'logo' => $company->logo ? asset('storage/' . $company->logo) : null,
                    'is_primary' => $company->companyManagers()
                            ->where('user_id', $user->id)
                            ->first()
                            ->is_primary ?? false,
                ]);
            }
        }

        if (!$isTeamMember) {
            abort(403, 'Unauthorized action.');
        }

        return Inertia::render('Manager/Team/Edit', [
            'teamMember' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar ? asset('storage/' . $user->avatar) : null,
                'role' => $user->role ? [
                    'id' => $user->role->id,
                    'name' => $user->role->name,
                ] : null,
                'companies' => $managedCompanies,
            ],
        ]);
    }

    /**
     * Update the specified team member's status.
     */
    public function updatePrimaryStatus(Request $request, $userId, $companyId)
    {
        // Validate the request
        $request->validate([
            'is_primary' => 'required|boolean',
        ]);

        // Check if current user manages this company
        $company = Auth::user()->managedCompanies()->findOrFail($companyId);

        // Check if the target user is a manager of this company
        $companyManager = $company->companyManagers()
            ->where('user_id', $userId)
            ->first();

        if (!$companyManager) {
            abort(403, 'Unauthorized action.');
        }

        // If setting as primary, unset other primary managers
        if ($request->is_primary) {
            $company->companyManagers()
                ->where('is_primary', true)
                ->update(['is_primary' => false]);
        }

        // Update the status
        $companyManager->update([
            'is_primary' => $request->is_primary,
        ]);

        return redirect()->route('manager.team.index')
            ->with('success', 'Team member status updated successfully.');
    }
}
