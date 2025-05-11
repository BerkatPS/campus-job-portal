<?php

namespace Database\Seeders;

use App\Models\Job;
use App\Models\User;
use App\Models\Role;
use App\Models\HiringStage;
use App\Models\ApplicationStatus;
use App\Models\JobApplication;
use Illuminate\Database\Seeder;

class JobApplicationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ambil semua pekerjaan aktif
        $jobs = Job::where('is_active', true)->get();
        
        if ($jobs->isEmpty()) {
            $this->command->error('No active jobs found. Please run JobSeeder first.');
            return;
        }
        
        // Ambil user dengan role candidate
        $candidateRole = Role::where('slug', 'candidate')->first();
        
        if (!$candidateRole) {
            $this->command->error('Candidate role not found. Please run RoleSeeder first.');
            return;
        }
        
        $candidates = User::where('role_id', $candidateRole->id)->get();
        
        if ($candidates->isEmpty()) {
            $this->command->error('No candidate users found. Please run UserSeeder first.');
            return;
        }
        
        // Ambil hiring stages
        $initialStage = HiringStage::where('slug', 'application-review')->first();
        
        if (!$initialStage) {
            $this->command->error('Initial hiring stage not found. Please run HiringStageSeeder first.');
            return;
        }
        
        // Ambil application statuses
        $newStatus = ApplicationStatus::where('slug', 'new')->first();
        $inReviewStatus = ApplicationStatus::where('slug', 'in-review')->first();
        $shortlistedStatus = ApplicationStatus::where('slug', 'shortlisted')->first();
        $rejectedStatus = ApplicationStatus::where('slug', 'rejected')->first();
        
        if (!$newStatus || !$inReviewStatus || !$shortlistedStatus || !$rejectedStatus) {
            $this->command->error('Some application statuses are missing. Please run ApplicationStatusSeeder first.');
            return;
        }
        
        // Buat array dengan semua status yang ada untuk random assignment
        $statuses = [$newStatus, $inReviewStatus, $shortlistedStatus, $rejectedStatus];
        
        // Sample cover letters
        $coverLetters = [
            "Dengan surat ini, saya mengajukan lamaran untuk posisi [POSITION] di perusahaan Anda yang terhormat. Dengan latar belakang pendidikan dan pengalaman yang saya miliki, saya yakin dapat memberikan kontribusi yang berarti bagi perusahaan Anda.\n\nSaya memiliki pengalaman relevan dalam [SKILLS] dan sangat tertarik dengan visi dan misi perusahaan Anda. Saya siap bekerja dengan tim yang dinamis untuk mencapai tujuan perusahaan.\n\nTerima kasih atas perhatian Anda. Saya berharap dapat bertemu untuk wawancara lebih lanjut.",
            
            "Saya sangat tertarik dengan posisi [POSITION] yang diiklankan di portal karir Anda. Dengan gelar sarjana di bidang [FIELD] dan pengalaman [YEARS] tahun dalam industri ini, saya memiliki keterampilan yang diperlukan untuk peran ini.\n\nKemampuan saya dalam [SKILLS] akan memungkinkan saya untuk segera berkontribusi pada tim Anda. Saya sangat menghargai inovasi dan kolaborasi yang menjadi ciri perusahaan Anda.\n\nTerima kasih atas pertimbangan Anda. Saya berharap dapat mendiskusikan lebih lanjut bagaimana kualifikasi saya sesuai dengan kebutuhan perusahaan Anda.",
            
            "Saya dengan senang hati melamar untuk posisi [POSITION] di perusahaan Anda. Sebagai lulusan baru dengan semangat di bidang [FIELD], saya tertarik dengan peluang untuk memulai karir saya di perusahaan yang terkemuka di industri ini.\n\nMeskipun pengalaman profesional saya masih terbatas, saya telah mengembangkan keterampilan yang kuat dalam [SKILLS] melalui proyek-proyek akademis dan magang. Saya cepat belajar dan siap untuk menghadapi tantangan baru.\n\nSaya berharap dapat bertemu dengan Anda untuk mendiskusikan bagaimana saya dapat berkontribusi pada kesuksesan perusahaan Anda."
        ];
        
        // Buat beberapa aplikasi untuk setiap pekerjaan
        foreach ($jobs as $job) {
            // Tentukan berapa banyak kandidat yang akan melamar untuk pekerjaan ini (antara 1-5)
            $applicantCount = min(rand(1, 5), $candidates->count());
            
            // Pilih kandidat secara acak
            $jobApplicants = $candidates->random($applicantCount);
            
            foreach ($jobApplicants as $applicant) {
                // Pilih cover letter dan ganti placeholder
                $coverLetter = $coverLetters[array_rand($coverLetters)];
                $coverLetter = str_replace(
                    ['[POSITION]', '[FIELD]', '[YEARS]', '[SKILLS]'],
                    [
                        $job->title, 
                        ['Computer Science', 'Information Technology', 'Business Management'][rand(0, 2)], 
                        rand(0, 3), 
                        ['programming', 'data analysis', 'project management', 'digital marketing'][rand(0, 3)]
                    ],
                    $coverLetter
                );
                
                // Pilih status aplikasi secara acak
                $status = $statuses[array_rand($statuses)];
                
                // Buat atau perbarui aplikasi pekerjaan
                JobApplication::updateOrCreate(
                    [
                        'job_id' => $job->id,
                        'user_id' => $applicant->id
                    ],
                    [
                        'current_stage_id' => $initialStage->id,
                        'status_id' => $status->id,
                        'cover_letter' => $coverLetter,
                        'resume' => null, // Bisa diisi dengan path file jika diperlukan
                        'notes' => rand(0, 1) ? 'Kandidat memiliki potensi yang baik.' : null,
                        'is_favorite' => rand(0, 10) > 8 // 20% kemungkinan menjadi favorit
                    ]
                );
            }
        }
        
        $this->command->info('Job applications seeded successfully.');
    }
} 