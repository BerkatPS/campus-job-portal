<?php

namespace Database\Seeders;

use App\Models\Job;
use App\Models\HiringStage;
use App\Models\JobHiringStage;
use Illuminate\Database\Seeder;

class JobHiringStageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ambil semua pekerjaan aktif
        $jobs = Job::all();
        
        if ($jobs->isEmpty()) {
            $this->command->error('No jobs found. Please run JobSeeder first.');
            return;
        }
        
        // Ambil hiring stages
        $hiringStages = HiringStage::orderBy('order_index')->get();
        
        if ($hiringStages->isEmpty()) {
            $this->command->error('No hiring stages found. Please run HiringStageSeeder first.');
            return;
        }
        
        // Buat hiring stages untuk setiap pekerjaan
        foreach ($jobs as $job) {
            // Cek apakah pekerjaan sudah memiliki hiring stages
            $existingStagesCount = JobHiringStage::where('job_id', $job->id)->count();
            
            if ($existingStagesCount > 0) {
                // Jika sudah ada, skip untuk menghindari duplikasi
                continue;
            }
            
            // Buat job hiring stages untuk setiap hiring stage
            foreach ($hiringStages as $index => $stage) {
                JobHiringStage::updateOrCreate(
                    [
                        'job_id' => $job->id,
                        'hiring_stage_id' => $stage->id,
                    ],
                    [
                        'order_index' => $index + 1,
                    ]
                );
            }
        }
        
        $this->command->info('Job hiring stages seeded successfully.');
    }
} 