<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\NotificationService;

class SendProfileCompletionReminders extends Command
{
    protected $signature = 'notifications:profile-completion-reminders';
    protected $description = 'Send reminders to candidates with incomplete profiles';

    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        parent::__construct();
        $this->notificationService = $notificationService;
    }

    public function handle()
    {
        $this->info('Sending profile completion reminders...');
        $this->notificationService->sendProfileCompletionReminders();
        $this->info('Profile completion reminders sent successfully.');
    }
}
