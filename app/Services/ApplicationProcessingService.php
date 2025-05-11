<?php

namespace App\Services;

use App\Models\JobApplication;
use App\Models\ApplicationStatus;
use App\Models\HiringStage;
use App\Events\ApplicationStatusChanged;
use Illuminate\Support\Facades\Storage;

class ApplicationProcessingService
{
    /**
     * Process a new application
     */
    public function processNewApplication(JobApplication $application): void
    {
        // Set initial status
        $newStatus = ApplicationStatus::where('slug', 'new')->firstOrFail();
        $application->status_id = $newStatus->id;

        // Set initial stage
        $firstStage = $application->job->hiringStages()
            ->orderBy('job_hiring_stages.order_index')
            ->first();

        if ($firstStage) {
            $application->current_stage_id = $firstStage->id;

            // Record stage history
            $application->stageHistory()->create([
                'hiring_stage_id' => $firstStage->id,
                'user_id' => $application->user_id,
                'notes' => 'Application submitted',
            ]);
        }

        $application->save();

        // Process resume if available
        if ($application->resume) {
            // Queue resume processing job
            dispatch(new \App\Jobs\ProcessResume($application));
        }

        // Fire application created event
        event(new \App\Events\ApplicationCreated($application));
    }

    /**
     * Update application status
     */
    public function updateStatus(JobApplication $application, int $statusId, int $updatedById): bool
    {
        $oldStatusId = $application->status_id;

        if ($oldStatusId == $statusId) {
            return false;
        }

        $application->status_id = $statusId;
        $application->save();

        // Fire status changed event
        event(new ApplicationStatusChanged($application, $oldStatusId, $updatedById));

        return true;
    }

    /**
     * Update application stage
     */
    public function updateStage(JobApplication $application, int $stageId, ?string $notes, int $updatedById): bool
    {
        $oldStageId = $application->current_stage_id;

        if ($oldStageId == $stageId) {
            return false;
        }

        $application->current_stage_id = $stageId;
        $application->save();

        // Record stage history
        $application->stageHistory()->create([
            'hiring_stage_id' => $stageId,
            'user_id' => $updatedById,
            'notes' => $notes,
        ]);

        return true;
    }

    /**
     * Withdraw application
     */
    public function withdrawApplication(JobApplication $application): bool
    {
        // Get withdrawn status
        $withdrawnStatus = ApplicationStatus::where('slug', 'withdrawn')->first();

        if (!$withdrawnStatus) {
            return false;
        }

        $application->status_id = $withdrawnStatus->id;
        $application->save();

        return true;
    }

    /**
     * Get application statistics for a job
     */
    public function getJobApplicationStats(int $jobId): array
    {
        $applications = JobApplication::where('job_id', $jobId)->get();

        $totalCount = $applications->count();
        $byStatus = [];
        $byStage = [];

        foreach ($applications as $application) {
            // Group by status
            $statusId = $application->status_id;
            if (!isset($byStatus[$statusId])) {
                $byStatus[$statusId] = 0;
            }
            $byStatus[$statusId]++;

            // Group by stage
            if ($application->current_stage_id) {
                $stageId = $application->current_stage_id;
                if (!isset($byStage[$stageId])) {
                    $byStage[$stageId] = 0;
                }
                $byStage[$stageId]++;
            }
        }

        return [
            'total' => $totalCount,
            'by_status' => $byStatus,
            'by_stage' => $byStage,
        ];
    }
}
