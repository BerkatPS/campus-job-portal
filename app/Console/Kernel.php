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
