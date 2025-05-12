<?php

namespace Database\Seeders;

use App\Models\FormSection;
use Illuminate\Database\Seeder;

class FormSectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sections = [
            [
                'name' => 'Informasi Dasar',
                'description' => 'Informasi pribadi dasar kandidat',
                'is_enabled' => true,
                'order_index' => 1,
            ],
            [
                'name' => 'Detail Kontak',
                'description' => 'Informasi kontak kandidat',
                'is_enabled' => true,
                'order_index' => 2,
            ],
            [
                'name' => 'Pendidikan & Pengalaman',
                'description' => 'Latar belakang pendidikan dan pengalaman kerja',
                'is_enabled' => true,
                'order_index' => 3,
            ],
            [
                'name' => 'Keterampilan & Kualifikasi',
                'description' => 'Keterampilan, sertifikasi, dan kualifikasi',
                'is_enabled' => true,
                'order_index' => 4,
            ],
            [
                'name' => 'Pertanyaan',
                'description' => 'Pertanyaan tambahan untuk kandidat',
                'is_enabled' => true,
                'order_index' => 5,
            ],
        ];

        foreach ($sections as $section) {
            FormSection::create($section);
        }
    }
}
