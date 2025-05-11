<?php

namespace App\Policies;

use App\Models\Job;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class JobPolicy
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
    public function view(User $user, Job $job): bool
    {
        // Admin can view any job
        if ($user->isAdmin()) {
            return true;
        }

        // Manager can only view jobs for companies they manage
        if ($user->isManager()) {
            return $user->managedCompanies->contains($job->company_id);
        }

        // Candidates can view active jobs
        if ($user->isCandidate()) {
            return $job->is_active && $job->submission_deadline >= now();
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // Only admin and managers can create jobs
        if ($user->isAdmin()) {
            return true;
        }

        // Managers can create jobs only for companies they manage
        if ($user->isManager() && $user->managedCompanies->count() > 0) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Job $job): bool
    {
        // Admin can update any job
        if ($user->isAdmin()) {
            return true;
        }

        // Managers can update jobs for companies they manage
        if ($user->isManager()) {
            return $user->managedCompanies->contains($job->company_id);
        }

        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Job $job): bool
    {
        // Only admin can delete jobs
        if ($user->isAdmin()) {
            return true;
        }

        // Managers with primary status can delete jobs for their companies
        if ($user->isManager()) {
            return $user->managedCompanies()
                ->wherePivot('is_primary', true)
                ->get()
                ->contains('id', $job->company_id);
        }

        return false;
    }

    /**
     * Determine whether the user can toggle job active status.
     */
    public function toggleActive(User $user, Job $job): bool
    {
        // Admin can toggle any job
        if ($user->isAdmin()) {
            return true;
        }

        // Managers can toggle jobs for companies they manage
        if ($user->isManager()) {
            return $user->managedCompanies->contains($job->company_id);
        }

        return false;
    }

    /**
     * Determine whether the user can apply for the job.
     */
    public function apply(User $user, Job $job): bool
    {
        // Only candidates can apply for jobs
        if (!$user->isCandidate()) {
            return false;
        }

        // Check if job is active and deadline hasn't passed
        if (!$job->is_active || $job->submission_deadline < now()) {
            return false;
        }

        // Check if user has already applied
        return !$job->jobApplications()->where('user_id', $user->id)->exists();
    }
}
