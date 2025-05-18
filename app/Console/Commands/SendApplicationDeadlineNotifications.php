<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\NotificationService;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class SendApplicationDeadlineNotifications extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'notifications:application-deadlines';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send notifications for job applications with approaching deadlines';

    /**
     * @var NotificationService
     */
    protected $notificationService;

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(NotificationService $notificationService)
    {
        parent::__construct();
        $this->notificationService = $notificationService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $timestamp = Carbon::now()->format('Y-m-d H:i:s');
        $this->info("[{$timestamp}] Sending application deadline notifications...");
        Log::info("Starting application deadline notification process");
        
        $this->notificationService->sendApplicationDeadlineReminders();
        
        $this->info("[{$timestamp}] Application deadline notifications sent successfully");
        Log::info("Application deadline notification process completed");
        
        return 0;
    }
}
