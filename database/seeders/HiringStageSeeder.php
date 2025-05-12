<?php

namespace Database\Seeders;

use App\Models\HiringStage;
use Illuminate\Database\Seeder;

class HiringStageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $stages = [
            [
                'name' => 'Tinjauan Aplikasi',
                'slug' => 'application-review',
                'description' => 'Tinjauan awal aplikasi',
                'color' => '#818cf8', // Indigo
                'order_index' => 1,
                'is_default' => true,
            ],
            [
                'name' => 'Screening Telepon',
                'slug' => 'phone-screening',
                'description' => 'Wawancara telepon singkat untuk menilai kualifikasi dasar',
                'color' => '#f59e0b', // Amber
                'order_index' => 2,
                'is_default' => true,
            ],
            [
                'name' => 'Wawancara Pertama',
                'slug' => 'first-interview',
                'description' => 'Wawancara tatap muka atau video awal',
                'color' => '#0ea5e9', // Sky
                'order_index' => 3,
                'is_default' => true,
            ],
            [
                'name' => 'Penilaian Teknis',
                'slug' => 'technical-assessment',
                'description' => 'Penilaian atau tes keterampilan teknis',
                'color' => '#6366f1', // Indigo
                'order_index' => 4,
                'is_default' => true,
            ],
            [
                'name' => 'Wawancara Kedua',
                'slug' => 'second-interview',
                'description' => 'Wawancara lanjutan dengan tim atau manajemen',
                'color' => '#0284c7', // Sky
                'order_index' => 5,
                'is_default' => true,
            ],
            [
                'name' => 'Pemeriksaan Referensi',
                'slug' => 'reference-check',
                'description' => 'Verifikasi referensi',
                'color' => '#7c3aed', // Violet
                'order_index' => 6,
                'is_default' => true,
            ],
            [
                'name' => 'Penawaran Kerja',
                'slug' => 'job-offer',
                'description' => 'Memberikan penawaran kerja formal',
                'color' => '#10b981', // Green
                'order_index' => 7,
                'is_default' => true,
            ],
            [
                'name' => 'Orientasi',
                'slug' => 'onboarding',
                'description' => 'Proses orientasi untuk karyawan baru',
                'color' => '#8b5cf6', // Purple
                'order_index' => 8,
                'is_default' => true,
            ],
        ];

        foreach ($stages as $stage) {
            HiringStage::updateOrCreate(
                ['slug' => $stage['slug']],
                $stage
            );
        }
    }
}
