<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\CompanyManager;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class CompanySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get manager role ID
        $managerRole = Role::where('slug', 'manager')->first();
        
        if (!$managerRole) {
            $this->command->error('Manager role not found. Please run RoleSeeder first.');
            return;
        }

        // Get manager users
        $managerUsers = User::where('role_id', $managerRole->id)->get();
        
        if ($managerUsers->isEmpty()) {
            $this->command->error('No manager users found. Please run UserSeeder first.');
            return;
        }

        // Sample companies
        $companies = [
            [
                'name' => 'Tech Innovations Inc.',
                'description' => 'A leading technology company specializing in innovative solutions.',
                'website' => 'https://techinnovations.example.com',
                'address' => '123 Tech Boulevard, Silicon Valley',
                'phone' => '555-123-4567',
                'email' => 'info@techinnovations.example.com',
                'industry' => 'Technology',
                'is_active' => true,
            ],
            [
                'name' => 'Global Finance Group',
                'description' => 'A financial services company providing banking and investment solutions.',
                'website' => 'https://globalfinance.example.com',
                'address' => '456 Finance Street, New York',
                'phone' => '555-987-6543',
                'email' => 'info@globalfinance.example.com',
                'industry' => 'Finance',
                'is_active' => true,
            ],
            [
                'name' => 'Creative Designs Ltd.',
                'description' => 'A creative agency specializing in graphic design and branding.',
                'website' => 'https://creativedesigns.example.com',
                'address' => '789 Creative Avenue, London',
                'phone' => '555-456-7890',
                'email' => 'info@creativedesigns.example.com',
                'industry' => 'Design',
                'is_active' => true,
            ],
        ];

        // Create companies and assign managers
        foreach ($companies as $index => $companyData) {
            $company = Company::updateOrCreate(
                ['name' => $companyData['name']],
                $companyData
            );

            // Assign manager to company (assuming we have enough managers)
            if (isset($managerUsers[$index])) {
                CompanyManager::updateOrCreate(
                    [
                        'company_id' => $company->id,
                        'user_id' => $managerUsers[$index]->id,
                    ],
                    [
                        'is_primary' => true,
                    ]
                );
            }
        }
    }
}
