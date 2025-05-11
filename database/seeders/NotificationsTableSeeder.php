<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\Job;
use App\Models\JobApplication;
use App\Models\HiringStage;
use App\Models\Company;
use App\Models\Role;
use Carbon\Carbon;

class NotificationsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get IDs for relations
        $userIds = User::pluck('id')->toArray();
        $jobIds = Job::pluck('id')->toArray() ?: [null];
        $jobApplicationIds = JobApplication::pluck('id')->toArray() ?: [null];
        $hiringStageIds = HiringStage::pluck('id')->toArray() ?: [null];
        $companyIds = Company::pluck('id')->toArray() ?: [null];

        // Get role IDs
        $adminRoleId = Role::where('slug', 'admin')->first()->id ?? null;
        $managerRoleId = Role::where('slug', 'manager')->first()->id ?? null;
        $candidateRoleId = Role::where('slug', 'candidate')->first()->id ?? null;

        // Get users by role
        $adminIds = User::where('role_id', $adminRoleId)->pluck('id')->toArray() ?: [];
        $managerIds = User::where('role_id', $managerRoleId)->pluck('id')->toArray() ?: [];
        $candidateIds = User::where('role_id', $candidateRoleId)->pluck('id')->toArray() ?: [];

        // Define notification types by role
        $adminNotificationTypes = [
            'App\Notifications\NewCompanyRegistration',
            'App\Notifications\JobApprovalRequest',
            'App\Notifications\PlatformStatistics',
            'App\Notifications\UserReported',
            'App\Notifications\SystemAlert',
        ];

        $managerNotificationTypes = [
            'App\Notifications\NewJobApplication',
            'App\Notifications\CandidateWithdrawal',
            'App\Notifications\InterviewConfirmed',
            'App\Notifications\InterviewCancelled',
            'App\Notifications\JobApplicationUpdated',
            'App\Notifications\JobPostingExpiringSoon',
        ];

        $candidateNotificationTypes = [
            'App\Notifications\ApplicationStatusChanged',
            'App\Notifications\InterviewScheduled',
            'App\Notifications\JobOfferSent',
            'App\Notifications\NewJobPosted',
            'App\Notifications\ApplicationStageChanged',
            'App\Notifications\ApplicationViewed',
        ];

        $sharedNotificationTypes = [
            'App\Notifications\ForumMentioned',
            'App\Notifications\ForumTopicReplied',
            'App\Notifications\WelcomeNotification',
            'App\Notifications\ProfileCompletionReminder',
        ];

        // Create notifications for each user role
        $notifications = [];

        // Admin notifications
        foreach ($adminIds as $adminId) {
            $notifications = array_merge(
                $notifications,
                $this->createNotificationsForUser(
                    $adminId,
                    array_merge($adminNotificationTypes, $sharedNotificationTypes),
                    10,
                    $jobIds,
                    $jobApplicationIds,
                    $hiringStageIds,
                    $companyIds,
                    $userIds
                )
            );
        }

        // Manager notifications
        foreach ($managerIds as $managerId) {
            $notifications = array_merge(
                $notifications,
                $this->createNotificationsForUser(
                    $managerId,
                    array_merge($managerNotificationTypes, $sharedNotificationTypes),
                    20,
                    $jobIds,
                    $jobApplicationIds,
                    $hiringStageIds,
                    $companyIds,
                    $userIds
                )
            );
        }

        // Candidate notifications
        foreach ($candidateIds as $candidateId) {
            $notifications = array_merge(
                $notifications,
                $this->createNotificationsForUser(
                    $candidateId,
                    array_merge($candidateNotificationTypes, $sharedNotificationTypes),
                    15,
                    $jobIds,
                    $jobApplicationIds,
                    $hiringStageIds,
                    $companyIds,
                    $userIds
                )
            );
        }

        // Insert all notifications
        DB::table('notifications')->insert($notifications);
    }

    /**
     * Create a set of notifications for a specific user
     */
    private function createNotificationsForUser(
        $userId,
        $notificationTypes,
        $count,
        $jobIds,
        $jobApplicationIds,
        $hiringStageIds,
        $companyIds,
        $userIds
    ): array {
        $notifications = [];

        for ($i = 0; $i < $count; $i++) {
            $notificationType = $notificationTypes[array_rand($notificationTypes)];
            $createdAt = Carbon::now()->subDays(rand(0, 30))->subHours(rand(0, 24));

            // Determine if notification has been read (70% chance of being read)
            $readAt = rand(0, 100) < 70 ?
                Carbon::parse($createdAt)->addHours(rand(1, 48)) :
                null;

            // Create different data payloads based on notification type
            $data = $this->generateNotificationData(
                $notificationType,
                $userId,
                $jobIds,
                $jobApplicationIds,
                $hiringStageIds,
                $companyIds,
                $userIds
            );

            $notifications[] = [
                'id' => Str::uuid()->toString(),
                'type' => $notificationType,
                'notifiable_type' => 'App\Models\User',
                'notifiable_id' => $userId,
                'data' => json_encode($data),
                'read_at' => $readAt,
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
            ];
        }

        return $notifications;
    }

    /**
     * Generate appropriate notification data based on notification type
     */
    private function generateNotificationData($type, $userId, $jobIds, $jobApplicationIds, $hiringStageIds, $companyIds, $userIds = []): array
    {
        switch ($type) {
            // Admin notifications
            case 'App\Notifications\NewCompanyRegistration':
                $companyId = $companyIds[array_rand($companyIds)];
                return [
                    'title' => 'New Company Registration',
                    'message' => 'A new company has registered and is awaiting approval.',
                    'company_id' => $companyId,
                    'action_url' => "/admin/companies/$companyId",
                    'action_text' => 'Review Company',
                ];

            case 'App\Notifications\JobApprovalRequest':
                $jobId = $jobIds[array_rand($jobIds)];
                return [
                    'title' => 'Job Approval Request',
                    'message' => 'A new job posting requires your approval.',
                    'job_id' => $jobId,
                    'action_url' => "/admin/jobs/$jobId",
                    'action_text' => 'Review Job',
                ];

            case 'App\Notifications\PlatformStatistics':
                return [
                    'title' => 'Weekly Platform Statistics',
                    'message' => 'Your weekly platform activity report is ready.',
                    'stats' => [
                        'new_users' => rand(10, 50),
                        'new_jobs' => rand(5, 20),
                        'new_applications' => rand(20, 100),
                    ],
                    'action_url' => "/admin/dashboard",
                    'action_text' => 'View Dashboard',
                ];

            case 'App\Notifications\UserReported':
                $reportedUserId = $userIds[array_rand($userIds)];
                return [
                    'title' => 'User Reported',
                    'message' => 'A user has been reported for inappropriate behavior.',
                    'reported_user_id' => $reportedUserId,
                    'action_url' => "/admin/users/$reportedUserId",
                    'action_text' => 'Review Report',
                ];

            case 'App\Notifications\SystemAlert':
                $alertTypes = ['High Server Load', 'Database Performance Issue', 'Error Rate Spike', 'Security Alert'];
                $alertType = $alertTypes[array_rand($alertTypes)];
                return [
                    'title' => "System Alert: $alertType",
                    'message' => "The system has detected an issue that requires attention: $alertType.",
                    'alert_type' => strtolower(str_replace(' ', '_', $alertType)),
                    'alert_level' => ['info', 'warning', 'error'][array_rand([0, 1, 2])],
                    'action_url' => "/admin/system-status",
                    'action_text' => 'View System Status',
                ];

            // Manager notifications
            case 'App\Notifications\NewJobApplication':
                $jobId = $jobIds[array_rand($jobIds)];
                $jobApplicationId = $jobApplicationIds[array_rand($jobApplicationIds)];
                return [
                    'title' => 'New Job Application Received',
                    'message' => 'A new candidate has applied for your job posting.',
                    'job_id' => $jobId,
                    'job_application_id' => $jobApplicationId,
                    'action_url' => "/manager/applications/$jobApplicationId",
                    'action_text' => 'Review Application',
                ];

            case 'App\Notifications\CandidateWithdrawal':
                $jobApplicationId = $jobApplicationIds[array_rand($jobApplicationIds)];
                return [
                    'title' => 'Candidate Withdrew Application',
                    'message' => 'A candidate has withdrawn their application.',
                    'job_application_id' => $jobApplicationId,
                    'action_url' => "/manager/applications/$jobApplicationId",
                    'action_text' => 'View Details',
                ];

            case 'App\Notifications\InterviewConfirmed':
                $jobApplicationId = $jobApplicationIds[array_rand($jobApplicationIds)];
                $interviewDate = Carbon::now()->addDays(rand(1, 14))->format('Y-m-d H:i:s');
                return [
                    'title' => 'Interview Confirmed',
                    'message' => 'A candidate has confirmed their interview schedule.',
                    'interview_date' => $interviewDate,
                    'job_application_id' => $jobApplicationId,
                    'action_url' => "/manager/calendar",
                    'action_text' => 'View Calendar',
                ];

            case 'App\Notifications\InterviewCancelled':
                $jobApplicationId = $jobApplicationIds[array_rand($jobApplicationIds)];
                return [
                    'title' => 'Interview Cancelled',
                    'message' => 'A candidate has cancelled their scheduled interview.',
                    'job_application_id' => $jobApplicationId,
                    'action_url' => "/manager/applications/$jobApplicationId",
                    'action_text' => 'Reschedule',
                ];

            case 'App\Notifications\JobApplicationUpdated':
                $jobApplicationId = $jobApplicationIds[array_rand($jobApplicationIds)];
                return [
                    'title' => 'Application Updated',
                    'message' => 'A candidate has updated their job application.',
                    'job_application_id' => $jobApplicationId,
                    'action_url' => "/manager/applications/$jobApplicationId",
                    'action_text' => 'View Updates',
                ];

            case 'App\Notifications\JobPostingExpiringSoon':
                $jobId = $jobIds[array_rand($jobIds)];
                $daysRemaining = rand(1, 5);
                return [
                    'title' => 'Job Posting Expiring Soon',
                    'message' => "Your job posting will expire in $daysRemaining days.",
                    'job_id' => $jobId,
                    'days_remaining' => $daysRemaining,
                    'action_url' => "/manager/jobs/$jobId/edit",
                    'action_text' => 'Extend Posting',
                ];

            // Candidate notifications
            case 'App\Notifications\ApplicationStatusChanged':
                $jobApplicationId = $jobApplicationIds[array_rand($jobApplicationIds)];
                $statuses = ['pending', 'under_review', 'shortlisted', 'rejected', 'hired'];
                $status = $statuses[array_rand($statuses)];
                return [
                    'title' => 'Application Status Updated',
                    'message' => "Your application status has been changed to " . ucwords(str_replace('_', ' ', $status)),
                    'status' => $status,
                    'job_application_id' => $jobApplicationId,
                    'action_url' => "/candidate/applications/$jobApplicationId",
                    'action_text' => 'View Application',
                ];

            case 'App\Notifications\InterviewScheduled':
                $jobApplicationId = $jobApplicationIds[array_rand($jobApplicationIds)];
                $interviewDate = Carbon::now()->addDays(rand(1, 14))->format('Y-m-d H:i:s');
                return [
                    'title' => 'Interview Scheduled',
                    'message' => 'An interview has been scheduled for your job application.',
                    'interview_date' => $interviewDate,
                    'job_application_id' => $jobApplicationId,
                    'action_url' => "/candidate/events",
                    'meeting_link' => rand(0, 1) ? 'https://meet.google.com/' . Str::random(10) : null,
                    'action_text' => 'View Schedule',
                ];

            case 'App\Notifications\JobOfferSent':
                $jobApplicationId = $jobApplicationIds[array_rand($jobApplicationIds)];
                return [
                    'title' => 'Job Offer Received',
                    'message' => 'Congratulations! You have received a job offer.',
                    'job_application_id' => $jobApplicationId,
                    'action_url' => "/candidate/applications/$jobApplicationId",
                    'expires_at' => Carbon::now()->addDays(7)->format('Y-m-d'),
                    'action_text' => 'View Offer',
                ];

            case 'App\Notifications\NewJobPosted':
                $jobId = $jobIds[array_rand($jobIds)];
                $companyId = $companyIds[array_rand($companyIds)];
                return [
                    'title' => 'New Job Posted',
                    'message' => 'A new job matching your profile has been posted.',
                    'job_id' => $jobId,
                    'company_id' => $companyId,
                    'action_url' => "/candidate/jobs/$jobId",
                    'action_text' => 'View Job',
                ];

            case 'App\Notifications\ApplicationStageChanged':
                $jobApplicationId = $jobApplicationIds[array_rand($jobApplicationIds)];
                $hiringStageId = $hiringStageIds[array_rand($hiringStageIds)];
                $stages = ['Applied', 'Resume Screening', 'Phone Interview', 'Technical Test', 'On-site Interview', 'Final Decision'];
                $stageName = $stages[array_rand($stages)];
                return [
                    'title' => 'Application Stage Updated',
                    'message' => "Your application has moved to the $stageName stage.",
                    'job_application_id' => $jobApplicationId,
                    'hiring_stage_id' => $hiringStageId,
                    'stage_name' => $stageName,
                    'action_url' => "/candidate/applications/$jobApplicationId",
                    'action_text' => 'View Details',
                ];

            case 'App\Notifications\ApplicationViewed':
                $jobApplicationId = $jobApplicationIds[array_rand($jobApplicationIds)];
                return [
                    'title' => 'Application Viewed',
                    'message' => 'A hiring manager has viewed your application.',
                    'job_application_id' => $jobApplicationId,
                    'viewed_at' => Carbon::now()->subHours(rand(1, 24))->format('Y-m-d H:i:s'),
                    'action_url' => "/candidate/applications/$jobApplicationId",
                    'action_text' => 'View Application',
                ];

            // Shared notifications
            case 'App\Notifications\ForumMentioned':
                $forumPostId = rand(1, 100);
                $forumTopicId = rand(1, 30);
                $mentionedBy = !empty($userIds) ? $userIds[array_rand($userIds)] : $userId;
                return [
                    'title' => 'You were mentioned in a forum post',
                    'message' => 'Someone mentioned you in a forum discussion.',
                    'forum_post_id' => $forumPostId,
                    'forum_topic_id' => $forumTopicId,
                    'mentioned_by' => $mentionedBy,
                    'action_url' => "/forum/topik/$forumTopicId?post=$forumPostId",
                    'action_text' => 'View Post',
                ];

            case 'App\Notifications\ForumTopicReplied':
                $forumTopicId = rand(1, 30);
                $forumPostId = rand(1, 100);
                $repliedBy = !empty($userIds) ? $userIds[array_rand($userIds)] : $userId;
                return [
                    'title' => 'New Reply to Your Topic',
                    'message' => 'Someone replied to a forum topic you created or participated in.',
                    'forum_topic_id' => $forumTopicId,
                    'forum_post_id' => $forumPostId,
                    'replied_by' => $repliedBy,
                    'action_url' => "/forum/topik/$forumTopicId?post=$forumPostId",
                    'action_text' => 'View Reply',
                ];

            case 'App\Notifications\WelcomeNotification':
                return [
                    'title' => 'Welcome to Campus Job Portal',
                    'message' => 'Thank you for joining our platform. Complete your profile to get started.',
                    'action_url' => '/profile/edit',
                    'action_text' => 'Complete Profile',
                ];

            case 'App\Notifications\ProfileCompletionReminder':
                $completionPercentage = rand(10, 90);
                return [
                    'title' => 'Complete Your Profile',
                    'message' => "Your profile is $completionPercentage% complete. Finish setting up your profile to improve your chances of success.",
                    'completion_percentage' => $completionPercentage,
                    'action_url' => '/profile/edit',
                    'action_text' => 'Complete Profile',
                ];

            default:
                return [
                    'title' => 'System Notification',
                    'message' => 'You have a new notification.',
                    'action_url' => '/notifications',
                    'action_text' => 'View Details',
                ];
        }
    }
}
