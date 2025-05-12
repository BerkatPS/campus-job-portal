<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\NotificationService;

class SendEventResponseReminders extends Command
{
    protected $signature = 'notifications:event-response-reminders';
    protected $description = 'Send reminders to candidates to confirm their attendance at events';

    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        parent::__construct();
        $this->notificationService = $notificationService;
    }

    public function handle()
    {
        $this->info('Sending event response reminders...');
        $this->notificationService->sendEventResponseReminders();
        $this->info('Event response reminders sent successfully.');
    }
}
