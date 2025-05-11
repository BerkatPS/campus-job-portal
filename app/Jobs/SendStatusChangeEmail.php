<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\JobApplication;
use App\Models\ApplicationStatus;
use App\Notifications\ApplicationStatusChanged;

class SendStatusChangeEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $application;
    protected $oldStatusId;
    protected $newStatusId;

    /**
     * Create a new job instance.
     */
    public function __construct(JobApplication $application, int $oldStatusId, int $newStatusId)
    {
        $this->application = $application;
        $this->oldStatusId = $oldStatusId;
        $this->newStatusId = $newStatusId;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $oldStatus = ApplicationStatus::find($this->oldStatusId);
        $newStatus = ApplicationStatus::find($this->newStatusId);

        if (!$oldStatus || !$newStatus) {
            return;
        }

        $candidate = $this->application->user;

        $candidate->notify(new ApplicationStatusChanged(
            $this->application,
            $oldStatus->name,
            $newStatus->name
        ));
    }
}
