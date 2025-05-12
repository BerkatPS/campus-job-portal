<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Job;
use Carbon\Carbon;

class UpdateExpiredJobsStatus extends Command
{
    protected $signature = 'jobs:update-expired-status';
    protected $description = 'Update status of jobs that have passed their deadline';

    public function handle()
    {
        $this->info('Updating expired jobs...');

        $updatedCount = Job::where('submission_deadline', '<', Carbon::now())
            ->where(function($query) {
                $query->where('status', 'active')
                    ->orWhere('is_active', true);
            })
            ->update([
                'status' => 'closed',
                'is_active' => false
            ]);

        $this->info("Updated {$updatedCount} expired jobs.");
    }
}
