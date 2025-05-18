<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class SchedulerHeartbeat extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'scheduler:heartbeat';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Simple command to verify scheduler is running properly';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }
    
    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $timestamp = Carbon::now()->format('Y-m-d H:i:s');
        $message = "[{$timestamp}] SCHEDULER HEARTBEAT - The scheduler is running correctly";
        
        $this->info($message);
        Log::channel('daily')->info($message);
        
        // Create a specific log file for scheduler heartbeats
        $logPath = storage_path('logs/scheduler-heartbeat.log');
        file_put_contents($logPath, $message . PHP_EOL, FILE_APPEND);
        
        return 0;
    }
}
