<?php

namespace App\Services;

use App\Models\Event;
use App\Models\JobApplication;
use App\Models\User;
use App\Events\InterviewScheduled;
use Carbon\Carbon;

class EventSchedulingService
{
    /**
     * Schedule an interview
     */
    public function scheduleInterview(array $data, int $createdBy): Event
    {
        $event = new Event();
        $event->title = $data['title'];
        $event->description = $data['description'] ?? null;
        $event->start_time = Carbon::parse($data['start_time']);
        $event->end_time = Carbon::parse($data['end_time']);
        $event->location = $data['location'] ?? null;
        $event->meeting_link = $data['meeting_link'] ?? null;
        $event->type = $data['type'] ?? 'Interview';
        $event->status = 'Scheduled';
        $event->user_id = $createdBy;

        if (isset($data['job_id'])) {
            $event->job_id = $data['job_id'];
        }

        if (isset($data['job_application_id'])) {
            $event->job_application_id = $data['job_application_id'];
        }

        // Store attendees
        if (isset($data['attendees']) && is_array($data['attendees'])) {
            $event->attendees = $data['attendees'];
        }

        $event->save();

        // Fire event scheduled event
        event(new InterviewScheduled($event));

        return $event;
    }

    /**
     * Update event status
     */
    public function updateEventStatus(Event $event, string $status): bool
    {
        if (!in_array($status, ['Scheduled', 'Completed', 'Cancelled', 'Rescheduled'])) {
            return false;
        }

        $event->status = $status;
        $event->save();

        return true;
    }

    /**
     * Get upcoming events for a user
     */
    public function getUpcomingEventsForUser(User $user, int $limit = 5): array
    {
        $events = [];

        if ($user->isCandidate()) {
            // Get events for candidate's applications
            $applicationIds = $user->jobApplications()->pluck('id')->toArray();

            $events = Event::whereIn('job_application_id', $applicationIds)
                ->where('start_time', '>=', now())
                ->where('status', '!=', 'Cancelled')
                ->orderBy('start_time')
                ->limit($limit)
                ->get();

        } elseif ($user->isManager() || $user->isAdmin()) {
            // Get events for manager's companies or all for admin
            $query = Event::where('start_time', '>=', now())
                ->where('status', '!=', 'Cancelled');

            if ($user->isManager()) {
                $companyIds = $user->managedCompanies()->pluck('companies.id')->toArray();
                $query->whereHas('job', function($q) use ($companyIds) {
                    $q->whereIn('company_id', $companyIds);
                });
            }

            $events = $query->orderBy('start_time')
                ->limit($limit)
                ->get();
        }

        return $events->toArray();
    }

    /**
     * Check for scheduling conflicts
     */
    public function hasSchedulingConflict(Carbon $startTime, Carbon $endTime, array $attendees): bool
    {
        return Event::where(function($query) use ($startTime, $endTime) {
            $query->whereBetween('start_time', [$startTime, $endTime])
                ->orWhereBetween('end_time', [$startTime, $endTime])
                ->orWhere(function($q) use ($startTime, $endTime) {
                    $q->where('start_time', '<=', $startTime)
                        ->where('end_time', '>=', $endTime);
                });
        })
            ->where('status', '!=', 'Cancelled')
            ->where(function($query) use ($attendees) {
                foreach ($attendees as $attendeeId) {
                    $query->orWhereJsonContains('attendees', $attendeeId);
                }
            })->exists();
    }

    /**
     * Generate calendar for a time period
     */
    public function generateCalendar(Carbon $startDate, Carbon $endDate, ?array $companyIds = null): array
    {
        $query = Event::whereBetween('start_time', [$startDate, $endDate])
            ->orWhereBetween('end_time', [$startDate, $endDate]);

        // Filter by companies if provided
        if ($companyIds) {
            $query->whereHas('job', function($q) use ($companyIds) {
                $q->whereIn('company_id', $companyIds);
            });
        }

        $events = $query->with(['jobApplication.user', 'job.company'])
            ->get()
            ->map(function($event) {
                return [
                    'id' => $event->id,
                    'title' => $event->title,
                    'start' => $event->start_time->toIso8601String(),
                    'end' => $event->end_time->toIso8601String(),
                    'allDay' => false,
                    'status' => $event->status,
                    'type' => $event->type,
                    'candidate' => $event->jobApplication ? [
                        'id' => $event->jobApplication->user->id,
                        'name' => $event->jobApplication->user->name,
                    ] : null,
                    'job' => $event->job ? [
                        'id' => $event->job->id,
                        'title' => $event->job->title,
                        'company' => [
                            'id' => $event->job->company->id,
                            'name' => $event->job->company->name,
                        ]
                    ] : null,
                    'location' => $event->location,
                    'meeting_link' => $event->meeting_link,
                    'className' => $this->getEventClassName($event),
                ];
            })
            ->toArray();

        return $events;
    }

    /**
     * Get CSS class for event based on status and type
     */
    private function getEventClassName(Event $event): string
    {
        $className = '';

        // Status-based classes
        switch ($event->status) {
            case 'Scheduled':
                $className = 'bg-blue-500';
                break;
            case 'Completed':
                $className = 'bg-green-500';
                break;
            case 'Cancelled':
                $className = 'bg-red-500';
                break;
            case 'Rescheduled':
                $className = 'bg-orange-500';
                break;
            default:
                $className = 'bg-gray-500';
        }

        return $className;
    }
}
