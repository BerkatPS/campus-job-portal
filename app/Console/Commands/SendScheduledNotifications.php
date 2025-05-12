<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\NotificationService;

class SendScheduledNotifications extends Command
{
    protected $signature = 'notifications:scheduled';
    protected $description = 'Send scheduled notifications';

    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        parent::__construct();
        $this->notificationService = $notificationService;
    }

    public function handle()
    {
        $this->info('Sending job deadline notifications...');
        $this->notificationService->sendJobDeadlineNotifications();


        $this->info('All scheduled notifications sent successfully.');
    }
}
