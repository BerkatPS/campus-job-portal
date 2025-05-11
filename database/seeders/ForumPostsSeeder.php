<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ForumPost;
use App\Models\ForumTopic;
use App\Models\User;
use App\Models\Role;
use Faker\Factory as Faker;

class ForumPostsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('id_ID');
        
        // Dapatkan semua topik forum
        $topics = ForumTopic::all();
        
        if ($topics->isEmpty()) {
            $this->command->error('No forum topics found. Please run ForumTopicsSeeder first.');
            return;
        }
        
        // Dapatkan kandidat role
        $candidateRole = Role::where('slug', 'candidate')->first();
        
        if (!$candidateRole) {
            $this->command->error('Candidate role not found. Please run RoleSeeder first.');
            return;
        }
        
        // Dapatkan user (kandidat)
        $users = User::where('role_id', $candidateRole->id)->take(5)->get();
        
        // Jika tidak ada user, gunakan ID yang ada di topik
        if ($users->isEmpty()) {
            $userIds = ForumTopic::select('user_id')->distinct()->pluck('user_id')->toArray();
            $users = User::whereIn('id', $userIds)->get();
            
            if ($users->isEmpty()) {
                $this->command->error('No users found for forum posts. Please run UserSeeder first.');
                return;
            }
        }
        
        // Array konten post untuk beberapa topik spesifik
        $specificPosts = [
            'peluang-magang-di-google-indonesia' => [
                [
                    'content' => "<p>Halo teman-teman! Saya ingin berbagi informasi tentang program magang di Google Indonesia. Ada beberapa posisi yang dibuka:</p>
                    <ul>
                        <li>Software Engineering Intern</li>
                        <li>UX Design Intern</li>
                        <li>Marketing Intern</li>
                        <li>Business Development Intern</li>
                    </ul>
                    <p>Persyaratan umum:</p>
                    <ul>
                        <li>Mahasiswa aktif/fresh graduate (maksimal 1 tahun)</li>
                        <li>IPK minimal 3.5</li>
                        <li>Menguasai bahasa Inggris</li>
                    </ul>
                    <p>Untuk posisi Software Engineering, diutamakan yang menguasai Java, Python, atau Go.</p>
                    <p>Pendaftaran dibuka mulai 15 Januari hingga 28 Februari 2025. Silakan kunjungi careers.google.com untuk informasi lebih lanjut.</p>"
                ],
                [
                    'content' => "<p>Terima kasih infonya! Apakah ada yang sudah pernah magang di Google Indonesia sebelumnya? Saya ingin tahu bagaimana pengalaman dan proses seleksinya.</p>"
                ],
                [
                    'content' => "<p>Saya pernah mengikuti proses seleksi tahun lalu meskipun tidak lolos sampai akhir. Prosesnya cukup panjang:</p>
                    <ol>
                        <li>Seleksi CV dan cover letter</li>
                        <li>Online assessment (coding test untuk engineer, design challenge untuk desainer)</li>
                        <li>Initial interview dengan HR</li>
                        <li>Technical interview (1-2 putaran)</li>
                        <li>Final interview</li>
                    </ol>
                    <p>Tips dari saya: persiapkan portfolio yang baik, latih problem solving, dan pelajari tentang budaya Google. Good luck!</p>"
                ]
            ],
            'template-cv-ats-friendly-untuk-fresh-graduate' => [
                [
                    'content' => "<p>Halo semuanya!</p>
                    <p>Saya ingin berbagi template CV yang ATS-friendly untuk fresh graduate. Seperti yang kita tahu, banyak perusahaan besar menggunakan Applicant Tracking System (ATS) untuk menyaring CV secara otomatis.</p>
                    <p>Berikut beberapa tips untuk membuat CV yang ATS-friendly:</p>
                    <ol>
                        <li>Gunakan format dokumen standard (.docx atau .pdf)</li>
                        <li>Hindari header, footer, atau text box</li>
                        <li>Gunakan font standard seperti Arial, Calibri, atau Times New Roman</li>
                        <li>Struktur yang jelas: Pendidikan, Pengalaman, Skills, dsb</li>
                        <li>Gunakan kata kunci yang relevan dengan posisi yang dilamar</li>
                    </ol>
                    <p>Saya sudah menyiapkan template yang bisa digunakan. Silakan download dari link berikut: <a href='#'>Download Template CV</a></p>
                    <p>Semoga bermanfaat!</p>"
                ],
                [
                    'content' => "<p>Terima kasih templatenya! Kalau boleh tahu, kata kunci apa saja yang sebaiknya dimasukkan untuk posisi di bidang IT?</p>"
                ],
                [
                    'content' => "<p>Untuk bidang IT, beberapa kata kunci yang sering dicari:</p>
                    <ul>
                        <li>Bahasa pemrograman: Java, Python, JavaScript, PHP, C++, dll</li>
                        <li>Framework: React, Angular, Vue, Laravel, Django, Spring, dll</li>
                        <li>Database: MySQL, PostgreSQL, MongoDB, Oracle</li>
                        <li>Tools: Git, Docker, Kubernetes, Jenkins</li>
                        <li>Soft skills: Problem solving, teamwork, communication</li>
                    </ul>
                    <p>Pastikan hanya mencantumkan skill yang benar-benar dikuasai, karena biasanya akan ditanyakan saat interview.</p>"
                ]
            ],
            'teknologi-yang-paling-dicari-di-industri-it-saat-ini' => [
                [
                    'content' => "<p>Hi semua!</p>
                    <p>Berdasarkan pengamatan saya di job portal dan diskusi dengan beberapa recruiter, berikut teknologi yang paling banyak dicari di industri IT saat ini:</p>
                    <ol>
                        <li><strong>AI & Machine Learning</strong> - TensorFlow, PyTorch, scikit-learn</li>
                        <li><strong>Cloud Computing</strong> - AWS, Azure, GCP (sertifikasi sangat dihargai)</li>
                        <li><strong>DevOps</strong> - Docker, Kubernetes, CI/CD, Infrastructure as Code</li>
                        <li><strong>Full-Stack Development</strong> - MERN/MEAN stack, Laravel+Vue/React</li>
                        <li><strong>Mobile Development</strong> - Flutter, React Native, Swift, Kotlin</li>
                        <li><strong>Data Science & Analytics</strong> - Python, R, SQL, Power BI, Tableau</li>
                    </ol>
                    <p>Selain hard skills, soft skills yang dicari adalah kemampuan adaptasi, komunikasi yang baik, dan problem-solving.</p>
                    <p>Ada yang punya insight lain?</p>"
                ],
                [
                    'content' => "<p>Terima kasih infonya! Saya mau tambahkan bahwa untuk fresh graduate, perusahaan biasanya lebih memperhatikan kemampuan belajar cepat dan adaptasi dibanding keahlian spesifik. Jadi jangan berkecil hati kalau belum menguasai semua teknologi yang disebutkan.</p>
                    <p>Selain itu, portofolio proyek (meskipun hanya proyek kuliah atau personal project) sangat membantu untuk menunjukkan kemampuan praktis.</p>"
                ]
            ],
        ];
        
        // Buat atau perbarui post untuk setiap topik
        foreach ($topics as $topic) {
            // Check apakah ada konten spesifik untuk topik ini
            $slugKey = null;
            foreach (array_keys($specificPosts) as $key) {
                if (strpos($topic->slug, $key) !== false) {
                    $slugKey = $key;
                    break;
                }
            }
            
            // Hapus post yang sudah ada untuk topik ini jika diperlukan
            // ForumPost::where('forum_topic_id', $topic->id)->delete();
            
            if ($slugKey) {
                // Gunakan konten spesifik jika ada
                $specificContent = $specificPosts[$slugKey];
                
                // Post pertama selalu dari pembuat topik (post utama)
                ForumPost::updateOrCreate(
                    [
                        'forum_topic_id' => $topic->id,
                        'user_id' => $topic->user_id,
                        'is_first_post' => true
                    ],
                    [
                        'content' => $specificContent[0]['content'],
                    ]
                );
                
                // Post balasan jika ada
                for ($i = 1; $i < count($specificContent); $i++) {
                    $randomUser = $users->random();
                    
                    // Generate a unique signature for each post to prevent duplicates
                    $signature = md5($topic->id . '_' . $randomUser->id . '_' . $i);
                    
                    ForumPost::updateOrCreate(
                        [
                            'forum_topic_id' => $topic->id,
                            'user_id' => $randomUser->id,
                            'is_first_post' => false,
                            'content' => $specificContent[$i]['content']
                        ],
                        []
                    );
                }
            } else {
                // Buat post utama (pertama)
                $mainPostContent = "<p>" . $faker->paragraph(rand(3, 6)) . "</p>";
                $mainPostContent .= "<p>" . $faker->paragraph(rand(2, 4)) . "</p>";
                
                // Tambahkan list jika relevan
                if (rand(0, 1)) {
                    $mainPostContent .= "<ul>";
                    for ($i = 0; $i < rand(3, 5); $i++) {
                        $mainPostContent .= "<li>" . $faker->sentence() . "</li>";
                    }
                    $mainPostContent .= "</ul>";
                }
                
                $mainPostContent .= "<p>" . $faker->paragraph(rand(1, 3)) . "</p>";
                
                ForumPost::updateOrCreate(
                    [
                        'forum_topic_id' => $topic->id,
                        'user_id' => $topic->user_id,
                        'is_first_post' => true
                    ],
                    [
                        'content' => $mainPostContent
                    ]
                );
                
                // Periksa apakah sudah ada post balasan
                $existingReplies = ForumPost::where('forum_topic_id', $topic->id)
                                          ->where('is_first_post', false)
                                          ->count();
                
                // Buat beberapa post balasan jika belum ada
                if ($existingReplies < 2) {
                    $replyCount = rand(0, 5);
                    for ($i = 0; $i < $replyCount; $i++) {
                        $randomUser = $users->random();
                        
                        // Konten balasan lebih sederhana
                        $replyContent = "<p>" . $faker->paragraph(rand(1, 3)) . "</p>";
                        if (rand(0, 1)) {
                            $replyContent .= "<p>" . $faker->paragraph(rand(1, 2)) . "</p>";
                        }
                        
                        // Generate a unique signature for each post
                        $signature = md5($topic->id . '_' . $randomUser->id . '_' . $i . '_' . time());
                        
                        ForumPost::create([
                            'forum_topic_id' => $topic->id,
                            'user_id' => $randomUser->id,
                            'content' => $replyContent,
                            'is_first_post' => false
                        ]);
                    }
                }
            }
        }
    }
}
