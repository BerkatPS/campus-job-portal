<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // Test scheduler (runs every 5 seconds)
        $schedule->command('notifications:test-scheduler')
            ->everyFiveSeconds();

        // Scheduler heartbeat (runs every 5 seconds)
        $schedule->command('scheduler:heartbeat')
            ->everyFiveSeconds();

        // Clean up expired job posts
        $schedule->command('jobs:cleanup-expired')->daily();

        // Send email reminders for upcoming interviews
        $schedule->command('events:send-reminders')->hourly();

        // Generate weekly reports for admins
        $schedule->command('reports:generate-weekly')->weekly()->mondays()->at('9:00');

        $schedule->command('notifications:job-recommendations')
            ->twiceWeekly(1, 4, '9:00');

        // Kirim pengingat kelengkapan profil sekali seminggu (Selasa)
        $schedule->command('notifications:profile-completion-reminders')
            ->everyFiveSeconds();

        // Kirim pengingat interview setiap jam
        $schedule->command('notifications:interview-reminders')
            ->hourly();

        // Kirim pengingat konfirmasi kehadiran setiap 4 jam
        $schedule->command('notifications:event-response-reminders')
            ->everyThreeMinutes();

        // Hapus notifikasi lama sekali seminggu
        $schedule->command('notifications:clean')
            ->weekly();

        // Update status lowongan yang sudah melewati batas waktu (daily)
        $schedule->command('jobs:update-expired-status')
            ->dailyAt('00:01');

        // Kirim notifikasi lowongan akan berakhir (setiap hari jam 8 pagi)
        $schedule->command('notifications:job-expiry')
            ->dailyAt('08:00');

        // Kirim pengingat tenggat waktu aplikasi (setiap 12 jam)
        $schedule->command('notifications:application-deadlines')
            ->twiceDaily(9, 21);
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
