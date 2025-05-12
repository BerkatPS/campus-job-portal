<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\NotificationService;

class SendInterviewReminders extends Command
{
    protected $signature = 'notifications:interview-reminders';
    protected $description = 'Send reminders to candidates about upcoming interviews';

    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        parent::__construct();
        $this->notificationService = $notificationService;
    }

    public function handle()
    {
        $this->info('Sending interview reminders...');
        $this->notificationService->sendInterviewReminders();
        $this->info('Interview reminders sent successfully.');
    }
}
