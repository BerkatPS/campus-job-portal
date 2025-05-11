<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\Job;
use App\Models\Company;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class GenerateApplicationReport implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $company;
    protected $user;
    protected $startDate;
    protected $endDate;

    /**
     * Create a new job instance.
     */
    public function __construct(Company $company, User $user, ?string $startDate = null, ?string $endDate = null)
    {
        $this->company = $company;
        $this->user = $user;
        $this->startDate = $startDate ? Carbon::parse($startDate) : Carbon::now()->subMonth();
        $this->endDate = $endDate ? Carbon::parse($endDate) : Carbon::now();
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Get jobs for this company
        $jobs = $this->company->jobs()
            ->with(['jobApplications' => function($query) {
                $query->whereBetween('created_at', [$this->startDate, $this->endDate]);
            }, 'jobApplications.status', 'jobApplications.currentStage'])
            ->get();

        // Prepare report data
        $reportData = [
            'company' => $this->company->name,
            'generated_at' => Carbon::now()->format('Y-m-d H:i:s'),
            'period' => [
                'start' => $this->startDate->format('Y-m-d'),
                'end' => $this->endDate->format('Y-m-d'),
            ],
            'jobs' => [],
            'total_applications' => 0,
            'applications_by_status' => [],
            'applications_by_stage' => [],
        ];

        // Process each job
        foreach ($jobs as $job) {
            $applications = $job->jobApplications;
            $totalJobApplications = $applications->count();
            $reportData['total_applications'] += $totalJobApplications;

            // Get applications by status
            $jobAppsByStatus = [];
            foreach ($applications as $app) {
                $statusName = $app->status->name;
                if (!isset($jobAppsByStatus[$statusName])) {
                    $jobAppsByStatus[$statusName] = 0;
                }
                $jobAppsByStatus[$statusName]++;

                // For global status counts
                if (!isset($reportData['applications_by_status'][$statusName])) {
                    $reportData['applications_by_status'][$statusName] = 0;
                }
                $reportData['applications_by_status'][$statusName]++;

                // For stage counts (if available)
                if ($app->currentStage) {
                    $stageName = $app->currentStage->name;
                    if (!isset($reportData['applications_by_stage'][$stageName])) {
                        $reportData['applications_by_stage'][$stageName] = 0;
                    }
                    $reportData['applications_by_stage'][$stageName]++;
                }
            }

            // Add job data to report
            $reportData['jobs'][] = [
                'id' => $job->id,
                'title' => $job->title,
                'total_applications' => $totalJobApplications,
                'applications_by_status' => $jobAppsByStatus,
            ];
        }

        // Generate CSV data
        $csvData = $this->generateCSV($reportData);

        // Save the report
        $filename = "reports/company_{$this->company->id}_applications_{$this->startDate->format('Ymd')}_{$this->endDate->format('Ymd')}.csv";
        Storage::disk('public')->put($filename, $csvData);

        // Notify user that report is ready
        // In a real implementation, you would create a notification
        // that includes a link to download the report
    }

    /**
     * Generate CSV content from report data
     */
    private function generateCSV(array $reportData): string
    {
        $csv = "Application Report for {$reportData['company']}\n";
        $csv .= "Generated at: {$reportData['generated_at']}\n";
        $csv .= "Period: {$reportData['period']['start']} to {$reportData['period']['end']}\n\n";

        $csv .= "Total Applications: {$reportData['total_applications']}\n\n";

        // Applications by status
        $csv .= "Applications by Status:\n";
        foreach ($reportData['applications_by_status'] as $status => $count) {
            $csv .= "$status,$count\n";
        }
        $csv .= "\n";

        // Applications by stage
        if (!empty($reportData['applications_by_stage'])) {
            $csv .= "Applications by Stage:\n";
            foreach ($reportData['applications_by_stage'] as $stage => $count) {
                $csv .= "$stage,$count\n";
            }
            $csv .= "\n";
        }

        // Job details
        $csv .= "Job Details:\n";
        $csv .= "ID,Title,Total Applications\n";
        foreach ($reportData['jobs'] as $job) {
            $csv .= "{$job['id']},{$job['title']},{$job['total_applications']}\n";
        }

        return $csv;
    }
}
