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
                    'title' => 'Pendaftaran Perusahaan Baru',
                    'message' => 'Perusahaan baru telah mendaftar dan menunggu persetujuan.',
                    'company_id' => $companyId,
                    'action_url' => "/admin/companies/$companyId",
                    'action_text' => 'Tinjau Perusahaan',
                ];

            case 'App\Notifications\JobApprovalRequest':
                $jobId = $jobIds[array_rand($jobIds)];
                return [
                    'title' => 'Permintaan Persetujuan Lowongan',
                    'message' => 'Lowongan kerja baru membutuhkan persetujuan Anda.',
                    'job_id' => $jobId,
                    'action_url' => "/admin/jobs/$jobId",
                    'action_text' => 'Tinjau Lowongan',
                ];

            case 'App\Notifications\PlatformStatistics':
                return [
                    'title' => 'Statistik Platform Mingguan',
                    'message' => 'Laporan aktivitas platform mingguan Anda sudah siap.',
                    'stats' => [
                        'new_users' => rand(10, 50),
                        'new_jobs' => rand(5, 20),
                        'new_applications' => rand(20, 100),
                    ],
                    'action_url' => "/admin/dashboard",
                    'action_text' => 'Lihat Dashboard',
                ];

            case 'App\Notifications\UserReported':
                $reportedUserId = $userIds[array_rand($userIds)];
                return [
                    'title' => 'Laporan Pengguna',
                    'message' => 'Seorang pengguna telah dilaporkan karena perilaku yang tidak pantas.',
                    'reported_user_id' => $reportedUserId,
                    'action_url' => "/admin/users/$reportedUserId",
                    'action_text' => 'Tinjau Laporan',
                ];

            case 'App\Notifications\SystemAlert':
                $alertTypes = ['Beban Server Tinggi', 'Masalah Performa Database', 'Lonjakan Tingkat Kesalahan', 'Peringatan Keamanan'];
                $alertType = $alertTypes[array_rand($alertTypes)];
                return [
                    'title' => "Peringatan Sistem: $alertType",
                    'message' => "Sistem telah mendeteksi masalah yang membutuhkan perhatian: $alertType.",
                    'alert_type' => strtolower(str_replace(' ', '_', $alertType)),
                    'alert_level' => ['info', 'warning', 'error'][array_rand([0, 1, 2])],
                    'action_url' => "/admin/system-status",
                    'action_text' => 'Lihat Status Sistem',
                ];

            // Manager notifications
            case 'App\Notifications\NewJobApplication':
                $jobId = $jobIds[array_rand($jobIds)];
                $jobApplicationId = $jobApplicationIds[array_rand($jobApplicationIds)];
                return [
                    'title' => 'Lamaran Kerja Baru Diterima',
                    'message' => 'Kandidat baru telah melamar untuk lowongan kerja Anda.',
                    'job_id' => $jobId,
                    'job_application_id' => $jobApplicationId,
                    'action_url' => "/manager/applications/$jobApplicationId",
                    'action_text' => 'Tinjau Lamaran',
                ];

            case 'App\Notifications\CandidateWithdrawal':
                $jobApplicationId = $jobApplicationIds[array_rand($jobApplicationIds)];
                return [
                    'title' => 'Kandidat Menarik Lamaran',
                    'message' => 'Seorang kandidat telah menarik lamaran mereka.',
                    'job_application_id' => $jobApplicationId,
                    'action_url' => "/manager/applications/$jobApplicationId",
                    'action_text' => 'Lihat Detail',
                ];

            case 'App\Notifications\InterviewConfirmed':
                $jobApplicationId = $jobApplicationIds[array_rand($jobApplicationIds)];
                $interviewDate = Carbon::now()->addDays(rand(1, 14))->format('Y-m-d H:i:s');
                return [
                    'title' => 'Wawancara Dikonfirmasi',
                    'message' => 'Seorang kandidat telah mengkonfirmasi jadwal wawancara mereka.',
                    'interview_date' => $interviewDate,
                    'job_application_id' => $jobApplicationId,
                    'action_url' => "/manager/calendar",
                    'action_text' => 'Lihat Kalender',
                ];

            case 'App\Notifications\InterviewCancelled':
                $jobApplicationId = $jobApplicationIds[array_rand($jobApplicationIds)];
                return [
                    'title' => 'Wawancara Dibatalkan',
                    'message' => 'Seorang kandidat telah membatalkan wawancara yang dijadwalkan.',
                    'job_application_id' => $jobApplicationId,
                    'action_url' => "/manager/applications/$jobApplicationId",
                    'action_text' => 'Jadwalkan Ulang',
                ];

            case 'App\Notifications\JobApplicationUpdated':
                $jobApplicationId = $jobApplicationIds[array_rand($jobApplicationIds)];
                return [
                    'title' => 'Lamaran Diperbarui',
                    'message' => 'Seorang kandidat telah memperbarui lamaran kerja mereka.',
                    'job_application_id' => $jobApplicationId,
                    'action_url' => "/manager/applications/$jobApplicationId",
                    'action_text' => 'Lihat Pembaruan',
                ];

            case 'App\Notifications\JobPostingExpiringSoon':
                $jobId = $jobIds[array_rand($jobIds)];
                $daysRemaining = rand(1, 5);
                return [
                    'title' => 'Lowongan Segera Berakhir',
                    'message' => "Lowongan kerja Anda akan berakhir dalam $daysRemaining hari.",
                    'job_id' => $jobId,
                    'days_remaining' => $daysRemaining,
                    'action_url' => "/manager/jobs/$jobId/edit",
                    'action_text' => 'Perpanjang Lowongan',
                ];

            // Candidate notifications
            case 'App\Notifications\ApplicationStatusChanged':
                $jobApplicationId = $jobApplicationIds[array_rand($jobApplicationIds)];
                $statuses = ['pending', 'under_review', 'shortlisted', 'rejected', 'hired'];
                $statusLabels = [
                    'pending' => 'Menunggu',
                    'under_review' => 'Sedang Ditinjau',
                    'shortlisted' => 'Masuk Seleksi',
                    'rejected' => 'Ditolak',
                    'hired' => 'Diterima'
                ];
                $status = $statuses[array_rand($statuses)];
                $statusLabel = $statusLabels[$status];
                return [
                    'title' => 'Status Lamaran Diperbarui',
                    'message' => "Status lamaran Anda telah diubah menjadi $statusLabel",
                    'status' => $status,
                    'job_application_id' => $jobApplicationId,
                    'action_url' => "/candidate/applications/$jobApplicationId",
                    'action_text' => 'Lihat Lamaran',
                ];

            case 'App\Notifications\InterviewScheduled':
                $jobApplicationId = $jobApplicationIds[array_rand($jobApplicationIds)];
                $interviewDate = Carbon::now()->addDays(rand(1, 14))->format('Y-m-d H:i:s');
                return [
                    'title' => 'Wawancara Dijadwalkan',
                    'message' => 'Wawancara telah dijadwalkan untuk lamaran kerja Anda.',
                    'interview_date' => $interviewDate,
                    'job_application_id' => $jobApplicationId,
                    'action_url' => "/candidate/events",
                    'meeting_link' => rand(0, 1) ? 'https://meet.google.com/' . Str::random(10) : null,
                    'action_text' => 'Lihat Jadwal',
                ];

            case 'App\Notifications\JobOfferSent':
                $jobApplicationId = $jobApplicationIds[array_rand($jobApplicationIds)];
                return [
                    'title' => 'Tawaran Pekerjaan Diterima',
                    'message' => 'Selamat! Anda telah menerima tawaran pekerjaan.',
                    'job_application_id' => $jobApplicationId,
                    'action_url' => "/candidate/applications/$jobApplicationId",
                    'expires_at' => Carbon::now()->addDays(7)->format('Y-m-d'),
                    'action_text' => 'Lihat Tawaran',
                ];

            case 'App\Notifications\NewJobPosted':
                $jobId = $jobIds[array_rand($jobIds)];
                $companyId = $companyIds[array_rand($companyIds)];
                return [
                    'title' => 'Lowongan Baru Diposting',
                    'message' => 'Lowongan baru yang sesuai dengan profil Anda telah diposting.',
                    'job_id' => $jobId,
                    'company_id' => $companyId,
                    'action_url' => "/candidate/jobs/$jobId",
                    'action_text' => 'Lihat Lowongan',
                ];

            case 'App\Notifications\ApplicationStageChanged':
                $jobApplicationId = $jobApplicationIds[array_rand($jobApplicationIds)];
                $hiringStageId = $hiringStageIds[array_rand($hiringStageIds)];
                $stages = ['Dilamar', 'Peninjauan Resume', 'Wawancara Telepon', 'Tes Teknis', 'Wawancara Tatap Muka', 'Keputusan Akhir'];
                $stageName = $stages[array_rand($stages)];
                return [
                    'title' => 'Tahap Lamaran Diperbarui',
                    'message' => "Lamaran Anda telah berpindah ke tahap $stageName.",
                    'job_application_id' => $jobApplicationId,
                    'hiring_stage_id' => $hiringStageId,
                    'stage_name' => $stageName,
                    'action_url' => "/candidate/applications/$jobApplicationId",
                    'action_text' => 'Lihat Detail',
                ];

            case 'App\Notifications\ApplicationViewed':
                $jobApplicationId = $jobApplicationIds[array_rand($jobApplicationIds)];
                return [
                    'title' => 'Lamaran Dilihat',
                    'message' => 'Manager perekrutan telah melihat lamaran Anda.',
                    'job_application_id' => $jobApplicationId,
                    'viewed_at' => Carbon::now()->subHours(rand(1, 24))->format('Y-m-d H:i:s'),
                    'action_url' => "/candidate/applications/$jobApplicationId",
                    'action_text' => 'Lihat Lamaran',
                ];

            // Shared notifications
            case 'App\Notifications\ForumMentioned':
                $forumPostId = rand(1, 100);
                $forumTopicId = rand(1, 30);
                $mentionedBy = !empty($userIds) ? $userIds[array_rand($userIds)] : $userId;
                return [
                    'title' => 'Anda disebutkan dalam postingan forum',
                    'message' => 'Seseorang menyebutkan Anda dalam diskusi forum.',
                    'forum_post_id' => $forumPostId,
                    'forum_topic_id' => $forumTopicId,
                    'mentioned_by' => $mentionedBy,
                    'action_url' => "/forum/topik/$forumTopicId?post=$forumPostId",
                    'action_text' => 'Lihat Postingan',
                ];

            case 'App\Notifications\ForumTopicReplied':
                $forumTopicId = rand(1, 30);
                $forumPostId = rand(1, 100);
                $repliedBy = !empty($userIds) ? $userIds[array_rand($userIds)] : $userId;
                return [
                    'title' => 'Balasan Baru untuk Topik Anda',
                    'message' => 'Seseorang membalas topik forum yang Anda buat atau ikuti.',
                    'forum_topic_id' => $forumTopicId,
                    'forum_post_id' => $forumPostId,
                    'replied_by' => $repliedBy,
                    'action_url' => "/forum/topik/$forumTopicId?post=$forumPostId",
                    'action_text' => 'Lihat Balasan',
                ];

            case 'App\Notifications\WelcomeNotification':
                return [
                    'title' => 'Selamat Datang di Portal Lowongan Kerja Kampus',
                    'message' => 'Terima kasih telah bergabung dengan platform kami. Lengkapi profil Anda untuk memulai.',
                    'action_url' => '/profile/edit',
                    'action_text' => 'Lengkapi Profil',
                ];

            case 'App\Notifications\ProfileCompletionReminder':
                $completionPercentage = rand(10, 90);
                return [
                    'title' => 'Lengkapi Profil Anda',
                    'message' => "Profil Anda $completionPercentage% lengkap. Selesaikan pengaturan profil Anda untuk meningkatkan peluang kesuksesan.",
                    'completion_percentage' => $completionPercentage,
                    'action_url' => '/profile/edit',
                    'action_text' => 'Lengkapi Profil',
                ];

            default:
                return [
                    'title' => 'Notifikasi Sistem',
                    'message' => 'Anda memiliki notifikasi baru.',
                    'action_url' => '/notifications',
                    'action_text' => 'Lihat Detail',
                ];
        }
    }
}
