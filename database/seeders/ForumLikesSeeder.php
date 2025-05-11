<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ForumLike;
use App\Models\ForumPost;
use App\Models\User;
use App\Models\Role;

class ForumLikesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Dapatkan semua post forum
        $posts = ForumPost::all();
        
        if ($posts->isEmpty()) {
            $this->command->error('No forum posts found. Please run ForumPostsSeeder first.');
            return;
        }
        
        // Dapatkan kandidat role
        $candidateRole = Role::where('slug', 'candidate')->first();
        
        if (!$candidateRole) {
            $this->command->error('Candidate role not found. Please run RoleSeeder first.');
            return;
        }
        
        // Dapatkan user (kandidat)
        $users = User::where('role_id', $candidateRole->id)->get();
        
        if ($users->isEmpty()) {
            $this->command->error('No candidate users found. Please run UserSeeder first.');
            return;
        }
        
        // Untuk setiap post, beberapa user akan memberikan like (random)
        foreach ($posts as $post) {
            // Skip 30% post tanpa like sama sekali
            if (rand(1, 10) <= 3) {
                continue;
            }
            
            // Berapa user yang akan memberikan like (1-5 user)
            $likeCount = rand(1, min(5, $users->count()));
            
            // Pilih random user untuk memberikan like
            $likeUsers = $users->random($likeCount);
            
            foreach ($likeUsers as $user) {
                // Skip jika user adalah pemilik post (tidak like post sendiri)
                if ($user->id === $post->user_id) {
                    continue;
                }
                
                // Buat atau perbarui like
                ForumLike::updateOrCreate([
                    'forum_post_id' => $post->id,
                    'user_id' => $user->id
                ]);
            }
        }
        
        $this->command->info('Forum likes seeded successfully.');
    }
}
