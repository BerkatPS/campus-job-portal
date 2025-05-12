<?php

namespace App\Services;

use App\Models\Job;
use App\Models\User;
use App\Models\JobApplication;
use App\Models\Event;
use App\Notifications\JobRecommendation;
use App\Notifications\ApplicationDeadlineReminder;
use App\Notifications\ProfileCompletionReminder;
use App\Notifications\InterviewReminder;
use App\Notifications\EventResponseNeeded;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    /**
     * Send notification to a user about a specific entity
     */
    public function sendNotification($user, $notificationClass, $entity, array $data = [])
    {
        if ($user && class_exists($notificationClass)) {
            try {
                $user->notify(new $notificationClass($entity, $data));
                return true;
            } catch (\Exception $e) {
                Log::error('Failed to send notification: ' . $e->getMessage(), [
                    'user_id' => $user->id,
                    'notification_class' => $notificationClass,
                    'entity' => $entity,
                    'data' => $data
                ]);
                return false;
            }
        }
        return false;
    }

    /**
     * Send job recommendations to candidates based on profile matching
     */
    public function sendJobRecommendations()
    {
        // Get active jobs and active candidates
        $activeJobs = Job::where('is_active', true)
            ->where('submission_deadline', '>=', now())
            ->whereHas('company', function($query) {
                $query->where('is_active', true);
            })
            ->get();

        $candidates = User::whereHas('role', function($query) {
            $query->where('slug', 'candidate');
        })
            ->where('is_active', true)
            ->with('candidateProfile')
            ->get();

        foreach ($candidates as $candidate) {
            // Skip candidates with incomplete profiles
            if (!$candidate->candidateProfile || !$candidate->candidateProfile->skills) {
                continue;
            }

            $candidateSkills = explode(',', strtolower($candidate->candidateProfile->skills));
            $candidateSkills = array_map('trim', $candidateSkills);

            $recommendedJobs = [];

            foreach ($activeJobs as $job) {
                // Skip jobs the candidate has already applied to
                if (JobApplication::where('user_id', $candidate->id)
                    ->where('job_id', $job->id)
                    ->exists()) {
                    continue;
                }

                // Simple skill matching
                $jobSkills = [];
                if ($job->requirements) {
                    $jobSkills = explode(',', strtolower($job->requirements));
                    $jobSkills = array_map('trim', $jobSkills);
                }

                $matchingSkills = array_intersect($candidateSkills, $jobSkills);
                $matchPercentage = 0;

                if (count($jobSkills) > 0) {
                    $matchPercentage = (count($matchingSkills) / count($jobSkills)) * 100;
                }

                // Only recommend if there's a good match
                if ($matchPercentage >= 40) {
                    $recommendedJobs[] = [
                        'job' => $job,
                        'match_percentage' => $matchPercentage
                    ];
                }
            }

            // Sort by match percentage (highest first) and take top 3
            usort($recommendedJobs, function($a, $b) {
                return $b['match_percentage'] <=> $a['match_percentage'];
            });

            $recommendedJobs = array_slice($recommendedJobs, 0, 3);

            // Send notifications for top recommendations
            foreach ($recommendedJobs as $recommendation) {
                $job = $recommendation['job'];
                $matchPercentage = $recommendation['match_percentage'];

                $this->sendNotification(
                    $candidate,
                    JobRecommendation::class,
                    $job,
                    ['match_percentage' => round($matchPercentage)]
                );
            }
        }
    }

    /**
     * Send reminders for applications with approaching deadlines
     */
    public function sendApplicationDeadlineReminders()
    {
        // Get applications with deadlines in 2 days
        $applications = JobApplication::whereHas('job', function($query) {
            $query->where('submission_deadline', '>=', now())
                ->where('submission_deadline', '<=', now()->addDays(2));
        })
            ->with(['job', 'user'])
            ->get();

        foreach ($applications as $application) {
            $daysRemaining = now()->diffInDays($application->job->submission_deadline, false);

            $this->sendNotification(
                $application->user,
                ApplicationDeadlineReminder::class,
                $application,
                ['days_remaining' => $daysRemaining]
            );
        }
    }

    /**
     * Send reminders to candidates with incomplete profiles
     */
    public function sendProfileCompletionReminders()
    {
        $candidates = User::whereHas('role', function($query) {
            $query->where('slug', 'candidate');
        })
            ->where('is_active', true)
            ->with('candidateProfile')
            ->get();

        foreach ($candidates as $candidate) {
            // Calculate profile completeness
            $profileFields = [
                $candidate->avatar,
                $candidate->candidateProfile->phone ?? null,
                $candidate->candidateProfile->date_of_birth ?? null,
                $candidate->candidateProfile->address ?? null,
                $candidate->candidateProfile->education ?? null,
                $candidate->candidateProfile->experience ?? null,
                $candidate->candidateProfile->skills ?? null,
                $candidate->candidateProfile->resume ?? null,
                $candidate->candidateProfile->linkedin ?? null,
                $candidate->candidateProfile->website ?? null
            ];

            $filledFields = array_filter($profileFields, function($field) {
                return !is_null($field) && $field !== '';
            });

            $percentage = count($filledFields) / count($profileFields) * 100;

            // Only send reminder if profile is less than 70% complete
            if ($percentage < 70) {
                $missingItems = [];
                if (!$candidate->avatar) $missingItems[] = 'Foto Profil';
                if (!($candidate->candidateProfile->phone ?? null)) $missingItems[] = 'Nomor Telepon';
                if (!($candidate->candidateProfile->date_of_birth ?? null)) $missingItems[] = 'Tanggal Lahir';
                if (!($candidate->candidateProfile->address ?? null)) $missingItems[] = 'Alamat';
                if (!($candidate->candidateProfile->education ?? null)) $missingItems[] = 'Pendidikan';
                if (!($candidate->candidateProfile->experience ?? null)) $missingItems[] = 'Pengalaman';
                if (!($candidate->candidateProfile->skills ?? null)) $missingItems[] = 'Keterampilan';
                if (!($candidate->candidateProfile->resume ?? null)) $missingItems[] = 'Resume';
                if (!($candidate->candidateProfile->linkedin ?? null)) $missingItems[] = 'LinkedIn';
                if (!($candidate->candidateProfile->website ?? null)) $missingItems[] = 'Website';

                $this->sendNotification(
                    $candidate,
                    ProfileCompletionReminder::class,
                    $candidate,
                    [
                        'percentage' => round($percentage),
                        'missing_items' => $missingItems
                    ]
                );
            }
        }
    }

    /**
     * Send reminders for upcoming interviews/events
     */
    public function sendInterviewReminders()
    {
        // Get events happening in the next 24 hours
        $events = Event::where('status', 'scheduled')
            ->where('start_time', '>=', now())
            ->where('start_time', '<=', now()->addHours(24))
            ->with(['job', 'jobApplication.user'])
            ->get();

        foreach ($events as $event) {
            if ($event->jobApplication && $event->jobApplication->user) {
                $this->sendNotification(
                    $event->jobApplication->user,
                    InterviewReminder::class,
                    $event,
                    []
                );
            }
        }
    }

    /**
     * Send reminders for events requiring response from candidates
     */
    public function sendEventResponseReminders()
    {
        // Get events scheduled in next 3 days without confirmation
        $events = Event::where('status', 'scheduled')
            ->whereNull('confirmed_at')
            ->where('start_time', '>=', now()->addHours(24))
            ->where('start_time', '<=', now()->addDays(3))
            ->with(['job', 'jobApplication.user'])
            ->get();

        foreach ($events as $event) {
            if ($event->jobApplication && $event->jobApplication->user) {
                // Set due date for response (1 day before event or 12 hours from now, whichever is sooner)
                $dueBy = min(
                    $event->start_time->copy()->subDay(),
                    now()->addHours(12)
                );

                $this->sendNotification(
                    $event->jobApplication->user,
                    EventResponseNeeded::class,
                    $event,
                    ['due_by' => $dueBy->toISOString()]
                );
            }
        }
    }
}
