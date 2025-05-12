<?php

namespace Database\Seeders;

use App\Models\ApplicationStatus;
use Illuminate\Database\Seeder;

class ApplicationStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $statuses = [
            [
                'name' => 'Baru',
                'slug' => 'new',
                'color' => '#818cf8', // Indigo
                'description' => 'Aplikasi baru',
                'order' => 1,
            ],
            [
                'name' => 'Sedang Ditinjau',
                'slug' => 'in-review',
                'color' => '#f59e0b', // Amber
                'description' => 'Aplikasi sedang dalam proses peninjauan',
                'order' => 2,
            ],
            [
                'name' => 'Kandidat Terpilih',
                'slug' => 'shortlisted',
                'color' => '#3b82f6', // Blue
                'description' => 'Kandidat telah masuk daftar kandidat terpilih',
                'order' => 3,
            ],
            [
                'name' => 'Wawancara',
                'slug' => 'interview',
                'color' => '#0ea5e9', // Sky
                'description' => 'Kandidat sedang dalam proses wawancara',
                'order' => 4,
            ],
            [
                'name' => 'Penawaran',
                'slug' => 'offer',
                'color' => '#10b981', // Green
                'description' => 'Penawaran kerja telah diberikan',
                'order' => 5,
            ],
            [
                'name' => 'Diterima',
                'slug' => 'hired',
                'color' => '#8b5cf6', // Purple
                'description' => 'Kandidat telah diterima bekerja',
                'order' => 6,
            ],
            [
                'name' => 'Ditolak',
                'slug' => 'rejected',
                'color' => '#ef4444', // Red
                'description' => 'Aplikasi telah ditolak',
                'order' => 7,
            ],
            [
                'name' => 'Didiskualifikasi',
                'slug' => 'disqualified',
                'color' => '#6b7280', // Gray
                'description' => 'Kandidat telah didiskualifikasi',
                'order' => 8,
            ],
            [
                'name' => 'Mengundurkan Diri',
                'slug' => 'withdrawn',
                'color' => '#94a3b8', // Slate
                'description' => 'Kandidat telah menarik lamaran mereka',
                'order' => 9,
            ],
        ];

        foreach ($statuses as $status) {
            ApplicationStatus::updateOrCreate(
                ['slug' => $status['slug']],
                $status
            );
        }
    }
}
