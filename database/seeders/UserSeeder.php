<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use App\Models\CandidateProfile;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get role IDs
        $adminRole = Role::where('slug', 'admin')->first();
        $managerRole = Role::where('slug', 'manager')->first();
        $candidateRole = Role::where('slug', 'candidate')->first();

        if (!$adminRole || !$managerRole || !$candidateRole) {
            $this->command->error('Required roles not found. Please run RoleSeeder first.');
            return;
        }

        // Create admin user
        User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'role_id' => $adminRole->id,
                'email_verified_at' => now(),
                'is_active' => true,
            ]
        );

        // Create sample manager users
        for ($i = 1; $i <= 3; $i++) {
            User::updateOrCreate(
                ['email' => "manager{$i}@example.com"],
                [
                    'name' => "Manager User {$i}",
                    'password' => Hash::make('password'),
                    'role_id' => $managerRole->id,
                    'email_verified_at' => now(),
                    'is_active' => true,
                ]
            );
        }

        // Create sample candidate users with NIM
        for ($i = 1; $i <= 10; $i++) {
            $nim = "1000{$i}2023"; // Example format: 10001202, 10002202, etc.
            $email = "candidate{$i}@example.com";
            
            $user = User::updateOrCreate(
                ['email' => $email],
                [
                    'name' => "Candidate User {$i}",
                    'nim' => $nim,
                    'password' => Hash::make('password'),
                    'role_id' => $candidateRole->id,
                    'email_verified_at' => now(),
                    'is_active' => true,
                ]
            );

            // Create or update candidate profile for each candidate
            CandidateProfile::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'date_of_birth' => now()->subYears(rand(20, 30))->format('Y-m-d'),
                    'phone' => '08' . rand(100000000, 999999999),
                    'address' => 'Sample Address ' . $i,
                    'education' => 'Bachelor of Computer Science',
                    'skills' => 'PHP, Laravel, JavaScript, React',
                    'linkedin' => 'https://linkedin.com/in/candidate' . $i,
                    'github' => 'https://github.com/candidate' . $i,
                ]
            );
        }
    }
}
