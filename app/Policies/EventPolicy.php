<?php

namespace App\Policies;

use App\Models\Event;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class EventPolicy
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
    public function view(User $user, Event $event): bool
    {
        // Admin can view any event
        if ($user->isAdmin()) {
            return true;
        }

        // Managers can view events for their companies
        if ($user->isManager()) {
            $managedCompanyIds = $user->managedCompanies()->pluck('companies.id')->toArray();

            return $event->job()
                ->whereIn('company_id', $managedCompanyIds)
                ->exists();
        }

        // Candidates can view events related to their applications
        if ($user->isCandidate()) {
            if ($event->jobApplication && $event->jobApplication->user_id === $user->id) {
                return true;
            }

            // Check if user is in attendees
            return is_array($event->attendees) && in_array($user->id, $event->attendees);
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // Only admin and managers can create events
        return $user->isAdmin() || $user->isManager();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Event $event): bool
    {
        // Admin can update any event
        if ($user->isAdmin()) {
            return true;
        }

        // Managers can update events for their companies
        if ($user->isManager()) {
            $managedCompanyIds = $user->managedCompanies()->pluck('companies.id')->toArray();

            return $event->job()
                ->whereIn('company_id', $managedCompanyIds)
                ->exists();
        }

        // The creator can update their own event
        return $event->user_id === $user->id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Event $event): bool
    {
        // Same as update policy
        return $this->update($user, $event);
    }

    /**
     * Determine whether the user can update event status.
     */
    public function updateStatus(User $user, Event $event): bool
    {
        // Same as update policy
        return $this->update($user, $event);
    }
}
