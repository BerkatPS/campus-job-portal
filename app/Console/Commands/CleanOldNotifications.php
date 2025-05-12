<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\NotificationService;

class CleanOldNotifications extends Command
{
    protected $signature = 'notifications:clean';
    protected $description = 'Clean old read notifications older than 30 days';

    public function handle()
    {
        $this->info('Cleaning old notifications...');

        $count = \Illuminate\Notifications\DatabaseNotification::where('read_at', '<', now()->subDays(30))
            ->delete();

        $this->info("Deleted {$count} old notifications.");
    }
}
