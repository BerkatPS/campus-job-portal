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
                'name' => 'New',
                'slug' => 'new',
                'color' => '#818cf8', // Indigo
                'description' => 'New application',
                'order' => 1,
            ],
            [
                'name' => 'In Review',
                'slug' => 'in-review',
                'color' => '#f59e0b', // Amber
                'description' => 'Application is being reviewed',
                'order' => 2,
            ],
            [
                'name' => 'Shortlisted',
                'slug' => 'shortlisted',
                'color' => '#3b82f6', // Blue
                'description' => 'Candidate has been shortlisted',
                'order' => 3,
            ],
            [
                'name' => 'Interview',
                'slug' => 'interview',
                'color' => '#0ea5e9', // Sky
                'description' => 'Candidate is being interviewed',
                'order' => 4,
            ],
            [
                'name' => 'Offer',
                'slug' => 'offer',
                'color' => '#10b981', // Green
                'description' => 'Job offer has been made',
                'order' => 5,
            ],
            [
                'name' => 'Hired',
                'slug' => 'hired',
                'color' => '#8b5cf6', // Purple
                'description' => 'Candidate has been hired',
                'order' => 6,
            ],
            [
                'name' => 'Rejected',
                'slug' => 'rejected',
                'color' => '#ef4444', // Red
                'description' => 'Application has been rejected',
                'order' => 7,
            ],
            [
                'name' => 'Disqualified',
                'slug' => 'disqualified',
                'color' => '#6b7280', // Gray
                'description' => 'Candidate has been disqualified',
                'order' => 8,
            ],
            [
                'name' => 'Withdrawn',
                'slug' => 'withdrawn',
                'color' => '#94a3b8', // Slate
                'description' => 'Candidate has withdrawn their application',
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
