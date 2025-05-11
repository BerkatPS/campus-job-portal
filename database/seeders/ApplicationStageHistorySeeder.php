<?php

namespace Database\Seeders;

use App\Models\JobApplication;
use App\Models\HiringStage;
use App\Models\User;
use App\Models\Role;
use App\Models\ApplicationStageHistory;
use Illuminate\Database\Seeder;

class ApplicationStageHistorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ambil semua aplikasi pekerjaan
        $applications = JobApplication::all();
        
        if ($applications->isEmpty()) {
            $this->command->error('No job applications found. Please run JobApplicationSeeder first.');
            return;
        }
        
        // Ambil hiring stages
        $hiringStages = HiringStage::orderBy('order_index')->get();
        
        if ($hiringStages->isEmpty()) {
            $this->command->error('No hiring stages found. Please run HiringStageSeeder first.');
            return;
        }
        
        // Ambil user dengan role manager (yang akan mengelola aplikasi)
        $managerRole = Role::where('slug', 'manager')->first();
        
        if (!$managerRole) {
            $this->command->error('Manager role not found. Please run RoleSeeder first.');
            return;
        }
        
        $managers = User::where('role_id', $managerRole->id)->get();
        
        if ($managers->isEmpty()) {
            $this->command->error('No manager users found. Please run UserSeeder first.');
            return;
        }
        
        // Sample notes untuk histori
        $notes = [
            'Kandidat tampak memenuhi kualifikasi dasar.',
            'CV menunjukkan pengalaman yang relevan.',
            'Kandidat memiliki keterampilan teknis yang baik.',
            'Performa wawancara memuaskan.',
            'Perlu pengecekan referensi lebih lanjut.',
            'Kandidat menunjukkan antusiasme yang tinggi.',
            'Latar belakang pendidikan sangat sesuai dengan posisi.',
            'Keterampilan komunikasi perlu ditingkatkan.',
        ];
        
        // Ambil initial stage (biasanya Application Review)
        $initialStage = $hiringStages->first();
        
        // Buat histori stage untuk setiap aplikasi
        foreach ($applications as $application) {
            // Pastikan ada entri untuk stage awal
            ApplicationStageHistory::updateOrCreate(
                [
                    'job_application_id' => $application->id,
                    'hiring_stage_id' => $initialStage->id,
                ],
                [
                    'user_id' => $managers->random()->id,
                    'notes' => $notes[array_rand($notes)],
                    'created_at' => $application->created_at,
                    'updated_at' => $application->created_at,
                ]
            );
            
            // Beberapa aplikasi mungkin sudah melewati beberapa tahap
            $stageCount = rand(0, 2); // 0-2 tahap tambahan selain tahap awal
            
            if ($stageCount > 0) {
                // Ambil beberapa tahap berikutnya (setelah tahap awal)
                $nextStages = $hiringStages->where('order_index', '>', $initialStage->order_index)
                                        ->take($stageCount);
                
                // Buat timestamp untuk stage yang lebih baru
                $lastTimestamp = $application->created_at;
                
                foreach ($nextStages as $stage) {
                    // Tambah 1-3 hari dari timestamp sebelumnya
                    $daysToAdd = rand(1, 3);
                    $timestamp = (clone $lastTimestamp)->addDays($daysToAdd);
                    
                    ApplicationStageHistory::updateOrCreate(
                        [
                            'job_application_id' => $application->id,
                            'hiring_stage_id' => $stage->id,
                        ],
                        [
                            'user_id' => $managers->random()->id,
                            'notes' => $notes[array_rand($notes)],
                            'created_at' => $timestamp,
                            'updated_at' => $timestamp,
                        ]
                    );
                    
                    // Perbarui current_stage dari aplikasi jika ini adalah stage terbaru
                    $application->current_stage_id = $stage->id;
                    $application->save();
                    
                    $lastTimestamp = $timestamp;
                }
            }
        }
        
        $this->command->info('Application stage history seeded successfully.');
    }
} 