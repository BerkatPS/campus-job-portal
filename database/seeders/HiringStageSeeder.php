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
                'name' => 'Application Review',
                'slug' => 'application-review',
                'description' => 'Initial review of application',
                'color' => '#818cf8', // Indigo
                'order_index' => 1,
                'is_default' => true,
            ],
            [
                'name' => 'Phone Screening',
                'slug' => 'phone-screening',
                'description' => 'Brief phone interview to assess basic qualifications',
                'color' => '#f59e0b', // Amber
                'order_index' => 2,
                'is_default' => true,
            ],
            [
                'name' => 'First Interview',
                'slug' => 'first-interview',
                'description' => 'Initial face-to-face or video interview',
                'color' => '#0ea5e9', // Sky
                'order_index' => 3,
                'is_default' => true,
            ],
            [
                'name' => 'Technical Assessment',
                'slug' => 'technical-assessment',
                'description' => 'Technical skills assessment or test',
                'color' => '#6366f1', // Indigo
                'order_index' => 4,
                'is_default' => true,
            ],
            [
                'name' => 'Second Interview',
                'slug' => 'second-interview',
                'description' => 'Follow-up interview with team or management',
                'color' => '#0284c7', // Sky
                'order_index' => 5,
                'is_default' => true,
            ],
            [
                'name' => 'Reference Check',
                'slug' => 'reference-check',
                'description' => 'Verification of references',
                'color' => '#7c3aed', // Violet
                'order_index' => 6,
                'is_default' => true,
            ],
            [
                'name' => 'Job Offer',
                'slug' => 'job-offer',
                'description' => 'Extending a formal job offer',
                'color' => '#10b981', // Green
                'order_index' => 7,
                'is_default' => true,
            ],
            [
                'name' => 'Onboarding',
                'slug' => 'onboarding',
                'description' => 'Onboarding process for new hires',
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
