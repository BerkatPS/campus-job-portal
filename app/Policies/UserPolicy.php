<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, User $model): bool
    {
        // Admin can view any user
        if ($user->isAdmin()) {
            return true;
        }

        // Users can view their own profile
        if ($user->id === $model->id) {
            return true;
        }

        // Managers can view candidates who applied to their company's jobs
        if ($user->isManager()) {
            $managedCompanyIds = $user->managedCompanies()->pluck('companies.id')->toArray();

            return $model->isCandidate() && $model->jobApplications()
                    ->whereHas('job', function ($query) use ($managedCompanyIds) {
                        $query->whereIn('company_id', $managedCompanyIds);
                    })
                    ->exists();
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, User $model): bool
    {
        // Admin can update any user
        if ($user->isAdmin()) {
            return true;
        }

        // Users can update their own profile
        return $user->id === $model->id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, User $model): bool
    {
        // Only admin can delete users
        if (!$user->isAdmin()) {
            return false;
        }

        // Prevent deleting oneself
        return $user->id !== $model->id;
    }

    /**
     * Determine whether the user can toggle user active status.
     */
    public function toggleActive(User $user, User $model): bool
    {
        // Only admin can toggle user active status
        if (!$user->isAdmin()) {
            return false;
        }

        // Prevent deactivating oneself
        return $user->id !== $model->id;
    }

    /**
     * Determine whether the user can update role.
     */
    public function updateRole(User $user, User $model): bool
    {
        // Only admin can update roles
        if (!$user->isAdmin()) {
            return false;
        }

        // Prevent changing own role
        return $user->id !== $model->id;
    }
}
