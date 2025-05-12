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
            $this->command->error('Peran manager tidak ditemukan. Harap jalankan RoleSeeder terlebih dahulu.');
            return;
        }

        // Get manager users
        $managerUsers = User::where('role_id', $managerRole->id)->get();

        if ($managerUsers->isEmpty()) {
            $this->command->error('Tidak ada pengguna manager yang ditemukan. Harap jalankan UserSeeder terlebih dahulu.');
            return;
        }

        // Sample companies
        $companies = [
            [
                'name' => 'Inovasi Teknologi Indonesia',
                'description' => 'Perusahaan teknologi terkemuka yang mengkhususkan diri dalam solusi inovatif.',
                'website' => 'https://inovasitech.co.id',
                'address' => 'Jl. Teknologi No. 123, Jakarta Selatan',
                'phone' => '021-5551234',
                'email' => 'info@inovasitech.co.id',
                'industry' => 'Teknologi',
                'is_active' => true,
            ],
            [
                'name' => 'Grup Finansial Global',
                'description' => 'Perusahaan jasa keuangan yang menyediakan solusi perbankan dan investasi.',
                'website' => 'https://globalfinansial.co.id',
                'address' => 'Jl. Sudirman No. 456, Jakarta Pusat',
                'phone' => '021-5559876',
                'email' => 'info@globalfinansial.co.id',
                'industry' => 'Keuangan',
                'is_active' => true,
            ],
            [
                'name' => 'Kreasi Desain Indonesia',
                'description' => 'Agensi kreatif yang mengkhususkan diri dalam desain grafis dan branding.',
                'website' => 'https://kreasidesain.co.id',
                'address' => 'Jl. Kreatif No. 789, Bandung',
                'phone' => '022-5554567',
                'email' => 'info@kreasidesain.co.id',
                'industry' => 'Desain',
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
