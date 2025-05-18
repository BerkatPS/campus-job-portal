<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\JobApplication;
use App\Models\Event;
use Illuminate\Support\Facades\Config;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

// User-specific notification channel
Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    // Log detailed authorization information for debugging
    \Log::debug("Channel auth request for App.Models.User.{$id}");
    \Log::debug("Current user: {$user->id}, Requested channel: {$id}");
    \Log::debug("Request data: " . json_encode(request()->all()));
    
    // Always return true to ensure notifications work during development
    return (int) $user->id === (int) $id;
});

// For manager message notifications
Broadcast::channel('manager.messages.{id}', function ($user, $id) {
    \Log::debug("Manager messages channel auth request for {$id} from user {$user->id}");
    return (int) $user->id === (int) $id;
});

// For candidate message notifications
Broadcast::channel('candidate.messages.{id}', function ($user, $id) {
    \Log::debug("Candidate messages channel auth request for {$id} from user {$user->id}");
    return (int) $user->id === (int) $id;
});

// User private channel for messages
Broadcast::channel('user.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});

// Company notifications channel
Broadcast::channel('company.{companyId}', function ($user, $companyId) {
    // Admins can listen to all company channels
    if ($user->isAdmin()) {
        return true;
    }

    // Managers can only listen to their companies
    if ($user->isManager()) {
        return $user->managedCompanies()->where('companies.id', $companyId)->exists();
    }

    return false;
});

// Application notifications channel
Broadcast::channel('application.{applicationId}', function ($user, $applicationId) {
    $application = JobApplication::find($applicationId);
    
    if (!$application) {
        return false;
    }
    
    // Allow the candidate who applied to listen
    if ($user->id === $application->user_id) {
        return true;
    }
    
    // Allow managers of the company to listen
    if ($user->isManager()) {
        return $user->managedCompanies()->where('companies.id', $application->job->company_id)->exists();
    }
    
    // Allow admins to listen to all applications
    return $user->isAdmin();
});

// Event notifications channel
Broadcast::channel('event.{eventId}', function ($user, $eventId) {
    $event = Event::find($eventId);

    if (!$event) {
        return false;
    }

    // Admins can listen to all event channels
    if ($user->isAdmin()) {
        return true;
    }

    // Managers can only listen to events for their companies
    if ($user->isManager()) {
        $companyIds = $user->managedCompanies()->pluck('companies.id')->toArray();
        return $event->job && in_array($event->job->company_id, $companyIds);
    }

    // Candidates can only listen to events for their applications
    if ($user->isCandidate()) {
        if ($event->jobApplication && $event->jobApplication->user_id === $user->id) {
            return true;
        }

        // Or if they're in the attendees list
        return is_array($event->attendees) && in_array($user->id, $event->attendees);
    }

    return false;
});
