<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            // Level 1: Basic configuration
            RoleSeeder::class,

            // Level 2: Users dan aplikasi dasar
            UserSeeder::class,
            CompanySeeder::class,
            ApplicationStatusSeeder::class,
            HiringStageSeeder::class,
            CategorySeeder::class,
            CandidateProfileSeeder::class,

            // Level 3: Form builder
            FormSectionSeeder::class,
            FormFieldSeeder::class,

            // Level 4: Job dan aplikasi lanjutan
            JobSeeder::class,
            JobHiringStageSeeder::class,
            JobApplicationSeeder::class,
            ApplicationStageHistorySeeder::class,
            FormResponseSeeder::class,
            EventSeeder::class,

            // Level 5: Forum
            ForumCategoriesSeeder::class,
            ForumTopicsSeeder::class,
            ForumPostsSeeder::class,
            ForumLikesSeeder::class,

            NotificationsTableSeeder::class
        ]);
    }
}
