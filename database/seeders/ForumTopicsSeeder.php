<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ForumTopic;
use App\Models\ForumCategory;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Str;

class ForumTopicsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Dapatkan ID kategori
        $categories = [
            'career' => ForumCategory::where('slug', 'karir-magang')->first(),
            'tips' => ForumCategory::where('slug', 'tips-trik-wawancara')->first(),
            'cv' => ForumCategory::where('slug', 'pembuatan-cv-resume')->first(),
            'exp' => ForumCategory::where('slug', 'pengalaman-kerja')->first(),
            'tech' => ForumCategory::where('slug', 'teknologi-it')->first(),
            'business' => ForumCategory::where('slug', 'bisnis-kewirausahaan')->first(),
            'alumni' => ForumCategory::where('slug', 'alumni')->first(),
            'announcement' => ForumCategory::where('slug', 'pengumuman')->first(),
            'questions' => ForumCategory::where('slug', 'pertanyaan-umum')->first(),
        ];
        
        // Periksa apakah semua kategori ada
        $missingCategories = false;
        foreach ($categories as $key => $category) {
            if (!$category) {
                $this->command->error("Forum category for {$key} not found. Please run ForumCategoriesSeeder first.");
                $missingCategories = true;
            }
        }
        
        if ($missingCategories) {
            return;
        }
        
        // Dapatkan kandidat role
        $candidateRole = Role::where('slug', 'candidate')->first();
        
        if (!$candidateRole) {
            $this->command->error('Candidate role not found. Please run RoleSeeder first.');
            return;
        }
        
        // Dapatkan ID user (kandidat)
        $users = User::where('role_id', $candidateRole->id)->take(5)->get();
        
        // Jika tidak ada user, buat dummy user
        if ($users->isEmpty()) {
            $this->command->info('No candidate users found. Creating dummy users...');
            
            $users = collect([]);
            $users->push(User::updateOrCreate(
                ['email' => 'budi@example.com'],
                [
                    'name' => 'Budi Santoso',
                    'password' => bcrypt('password'),
                    'role_id' => $candidateRole->id,
                    'email_verified_at' => now(),
                ]
            ));
            
            $users->push(User::updateOrCreate(
                ['email' => 'dewi@example.com'],
                [
                    'name' => 'Dewi Putri',
                    'password' => bcrypt('password'),
                    'role_id' => $candidateRole->id,
                    'email_verified_at' => now(),
                ]
            ));
            
            $users->push(User::updateOrCreate(
                ['email' => 'andi@example.com'],
                [
                    'name' => 'Andi Wijaya',
                    'password' => bcrypt('password'),
                    'role_id' => $candidateRole->id,
                    'email_verified_at' => now(),
                ]
            ));
        }
        
        // Daftar topik untuk kategori karir & magang
        $careerTopics = [
            [
                'title' => 'Peluang Magang di Google Indonesia',
                'user_id' => $users[0]->id,
                'views' => rand(50, 200),
            ],
            [
                'title' => 'Cara Mendapatkan Pekerjaan Remote sebagai Fresh Graduate',
                'user_id' => $users[1]->id,
                'views' => rand(30, 150),
            ],
            [
                'title' => 'Program Karir di Startup: Untung vs Rugi',
                'user_id' => $users[2]->id,
                'views' => rand(40, 180),
            ],
        ];
        
        // Daftar topik untuk kategori tips wawancara
        $tipsTopics = [
            [
                'title' => 'Menjawab Pertanyaan "Kelemahan Anda" dalam Wawancara',
                'user_id' => $users[1]->id,
                'views' => rand(100, 300),
            ],
            [
                'title' => 'Persiapan Wawancara Teknis untuk Posisi Developer',
                'user_id' => $users[0]->id,
                'views' => rand(80, 250),
            ],
        ];
        
        // Daftar topik untuk kategori pembuatan CV
        $cvTopics = [
            [
                'title' => 'Template CV ATS-Friendly untuk Fresh Graduate',
                'user_id' => $users[2]->id,
                'views' => rand(120, 350),
            ],
            [
                'title' => 'Cara Menunjukkan Soft Skills dalam CV',
                'user_id' => $users[0]->id,
                'views' => rand(70, 200),
            ],
        ];
        
        // Daftar topik untuk kategori pengalaman kerja
        $expTopics = [
            [
                'title' => 'Pengalaman Magang di Bank Indonesia',
                'user_id' => $users[1]->id,
                'views' => rand(60, 220),
            ],
            [
                'title' => 'Hari Pertama Kerja: Apa yang Perlu Dipersiapkan',
                'user_id' => $users[2]->id,
                'views' => rand(90, 270),
            ],
        ];
        
        // Daftar topik untuk kategori teknologi
        $techTopics = [
            [
                'title' => 'Teknologi yang Paling Dicari di Industri IT Saat Ini',
                'user_id' => $users[0]->id,
                'views' => rand(110, 320),
            ],
            [
                'title' => 'Belajar AI dan Machine Learning dari Nol',
                'user_id' => $users[1]->id,
                'views' => rand(95, 280),
            ],
        ];
        
        // Daftar topik untuk kategori bisnis
        $businessTopics = [
            [
                'title' => 'Memulai Bisnis Digital dengan Modal Minim',
                'user_id' => $users[2]->id,
                'views' => rand(85, 260),
            ],
        ];
        
        // Daftar topik untuk kategori alumni
        $alumniTopics = [
            [
                'title' => 'Alumni Success Story: Dari Kampus ke CEO',
                'user_id' => $users[0]->id,
                'views' => rand(75, 230),
            ],
        ];
        
        // Daftar topik untuk kategori pengumuman
        $announcementTopics = [
            [
                'title' => 'Job Fair Virtual 2025: Panduan Lengkap',
                'user_id' => $users[1]->id,
                'views' => rand(150, 400),
            ],
        ];
        
        // Daftar topik untuk kategori pertanyaan umum
        $questionsTopics = [
            [
                'title' => 'Bagaimana Cara Mengupdate Profil di CampusJob?',
                'user_id' => $users[2]->id,
                'views' => rand(55, 190),
            ],
        ];
        
        // Fungsi untuk membuat atau memperbarui topik
        $createOrUpdateTopics = function($topics, $categoryId) {
            foreach ($topics as $topic) {
                $slug = Str::slug($topic['title']) . '-' . Str::random(5);
                ForumTopic::updateOrCreate(
                    ['title' => $topic['title'], 'user_id' => $topic['user_id']],
                    [
                        'slug' => $slug,
                        'forum_category_id' => $categoryId,
                        'views' => $topic['views'],
                        'is_pinned' => rand(0, 10) > 8, // 20% kemungkinan di-pin
                        'is_locked' => false
                    ]
                );
            }
        };
        
        // Buat atau perbarui topik untuk semua kategori
        $createOrUpdateTopics($careerTopics, $categories['career']->id);
        $createOrUpdateTopics($tipsTopics, $categories['tips']->id);
        $createOrUpdateTopics($cvTopics, $categories['cv']->id);
        $createOrUpdateTopics($expTopics, $categories['exp']->id);
        $createOrUpdateTopics($techTopics, $categories['tech']->id);
        $createOrUpdateTopics($businessTopics, $categories['business']->id);
        $createOrUpdateTopics($alumniTopics, $categories['alumni']->id);
        $createOrUpdateTopics($announcementTopics, $categories['announcement']->id);
        $createOrUpdateTopics($questionsTopics, $categories['questions']->id);
    }
}
