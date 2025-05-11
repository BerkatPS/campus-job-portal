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
    return (int) $user->id === (int) $id;
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

    // Admins can listen to all application channels
    if ($user->isAdmin()) {
        return true;
    }

    // Managers can only listen to applications for their companies
    if ($user->isManager()) {
        $companyIds = $user->managedCompanies()->pluck('companies.id')->toArray();
        return $application->job && in_array($application->job->company_id, $companyIds);
    }

    // Candidates can only listen to their own applications
    if ($user->isCandidate()) {
        return $application->user_id === $user->id;
    }

    return false;
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
