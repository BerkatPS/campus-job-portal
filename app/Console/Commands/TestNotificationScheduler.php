<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class TestNotificationScheduler extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'notifications:test-scheduler';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test if the notification scheduler is running properly (runs every 5 seconds)';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $timestamp = Carbon::now()->format('Y-m-d H:i:s');
        $message = "[{$timestamp}] Notification scheduler test check is running";
        
        $this->info($message);
        Log::info($message);
        
        return 0;
    }
}
