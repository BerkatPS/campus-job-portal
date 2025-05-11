<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'name' => 'Admin',
                'slug' => 'admin',
                'description' => 'Administrator role with full access',
            ],
            [
                'name' => 'Manager',
                'slug' => 'manager',
                'description' => 'Company manager role with access to company jobs and applications',
            ],
            [
                'name' => 'Candidate',
                'slug' => 'candidate',
                'description' => 'Candidate role for job seekers',
            ],
        ];

        foreach ($roles as $role) {
            Role::updateOrCreate(['slug' => $role['slug']], $role);
        }
    }
}
