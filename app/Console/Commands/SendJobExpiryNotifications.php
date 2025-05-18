<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Job;
use App\Models\User;
use App\Notifications\JobPostingExpiringSoon;
use Carbon\Carbon;

class SendJobExpiryNotifications extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'notifications:job-expiry';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send notifications for job postings that are about to expire';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Checking for jobs about to expire...');
        
        // Jobs expiring in the next 3 days
        $expiryDate = Carbon::now()->addDays(3)->endOfDay();
        
        $jobs = Job::where('status', 'active')
            ->where('expiry_date', '<=', $expiryDate)
            ->where('expiry_notification_sent', false)
            ->get();
            
        $jobsCount = $jobs->count();
        $this->info("Found {$jobsCount} jobs that will expire soon");
        
        foreach ($jobs as $job) {
            $manager = $job->manager;
            
            if ($manager) {
                $daysRemaining = Carbon::now()->diffInDays(Carbon::parse($job->expiry_date), false);
                $manager->notify(new JobPostingExpiringSoon($manager, $job, $daysRemaining));
                
                // Mark as notification sent
                $job->expiry_notification_sent = true;
                $job->save();
                
                $this->info("Sent expiry notification for job: {$job->title} to {$manager->name}");
            }
        }
        
        $this->info('Job expiry notification check completed');
        
        return 0;
    }
}
