<?php

namespace App\Policies;

use App\Models\JobApplication;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ApplicationPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->isManager() || $user->isCandidate();
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, JobApplication $application): bool
    {
        // Admin can view any application
        if ($user->isAdmin()) {
            return true;
        }

        // Candidate can view their own applications
        if ($user->isCandidate() && $application->user_id === $user->id) {
            return true;
        }

        // Manager can view applications for jobs in their companies
        if ($user->isManager()) {
            $managedCompanyIds = $user->managedCompanies()->pluck('companies.id')->toArray();

            return $application->job()
                ->whereIn('company_id', $managedCompanyIds)
                ->exists();
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // Only candidates can create applications
        return $user->isCandidate();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, JobApplication $application): bool
    {
        // Admin can update any application
        if ($user->isAdmin()) {
            return true;
        }

        // Manager can update applications for jobs in their companies
        if ($user->isManager()) {
            $managedCompanyIds = $user->managedCompanies()->pluck('companies.id')->toArray();

            return $application->job()
                ->whereIn('company_id', $managedCompanyIds)
                ->exists();
        }

        return false;
    }

    /**
     * Determine whether the user can update application status.
     */
    public function updateStatus(User $user, JobApplication $application): bool
    {
        // Same as update policy
        return $this->update($user, $application);
    }

    /**
     * Determine whether the user can update application stage.
     */
    public function updateStage(User $user, JobApplication $application): bool
    {
        // Same as update policy
        return $this->update($user, $application);
    }

    /**
     * Determine whether the user can toggle favorite status.
     */
    public function toggleFavorite(User $user, JobApplication $application): bool
    {
        // Same as update policy
        return $this->update($user, $application);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, JobApplication $application): bool
    {
        // Admin can delete any application
        if ($user->isAdmin()) {
            return true;
        }

        // Candidate can withdraw (delete) their own application
        return $user->isCandidate() && $application->user_id === $user->id;
    }

    /**
     * Determine whether the user can add notes to the application.
     */
    public function addNotes(User $user, JobApplication $application): bool
    {
        // Same as update policy
        return $this->update($user, $application);
    }
}
