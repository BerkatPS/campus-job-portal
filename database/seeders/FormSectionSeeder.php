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
                'name' => 'Basic Information',
                'description' => 'Basic personal information of the candidate',
                'is_enabled' => true,
                'order_index' => 1,
            ],
            [
                'name' => 'Contact Details',
                'description' => 'Contact information of the candidate',
                'is_enabled' => true,
                'order_index' => 2,
            ],
            [
                'name' => 'Education & Experience',
                'description' => 'Educational background and work experience',
                'is_enabled' => true,
                'order_index' => 3,
            ],
            [
                'name' => 'Skills & Qualifications',
                'description' => 'Skills, certifications, and qualifications',
                'is_enabled' => true,
                'order_index' => 4,
            ],
            [
                'name' => 'Questions',
                'description' => 'Additional questions for the candidate',
                'is_enabled' => true,
                'order_index' => 5,
            ],
        ];

        foreach ($sections as $section) {
            FormSection::create($section);
        }
    }
}
