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
            ->weekly()->tuesdays()->at('10:00');

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
