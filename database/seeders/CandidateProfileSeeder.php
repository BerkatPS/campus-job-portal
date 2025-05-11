<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use App\Models\CandidateProfile;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class CandidateProfileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('id_ID');
        
        // Ambil kandidat role
        $candidateRole = Role::where('slug', 'candidate')->first();
        
        if (!$candidateRole) {
            $this->command->error('Candidate role not found. Please run RoleSeeder first.');
            return;
        }
        
        // Ambil semua user dengan role candidate
        $candidates = User::where('role_id', $candidateRole->id)->get();
        
        if ($candidates->isEmpty()) {
            $this->command->error('No candidate users found. Please run UserSeeder first.');
            return;
        }
        
        // Jurusan pendidikan
        $educationMajors = [
            'Teknik Informatika',
            'Sistem Informasi',
            'Ilmu Komputer',
            'Teknik Elektro',
            'Teknik Mesin',
            'Manajemen',
            'Akuntansi',
            'Ilmu Komunikasi',
            'Desain Komunikasi Visual',
            'Psikologi'
        ];
        
        // Universitas
        $universities = [
            'Universitas Indonesia',
            'Institut Teknologi Bandung',
            'Universitas Gadjah Mada',
            'Institut Teknologi Sepuluh Nopember',
            'Universitas Diponegoro',
            'Universitas Padjadjaran',
            'Universitas Brawijaya',
            'Universitas Airlangga',
            'Universitas Bina Nusantara',
            'Telkom University'
        ];
        
        // Skills berdasarkan kategori
        $skillsByCategory = [
            'Teknik' => [
                'Java', 'Python', 'C++', 'JavaScript', 'PHP', 'Ruby', 'Swift', 'Kotlin',
                'React', 'Angular', 'Vue.js', 'Node.js', 'Laravel', 'Django', 'Spring Boot',
                'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQL Server',
                'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Git', 'CI/CD'
            ],
            'Desain' => [
                'Adobe Photoshop', 'Adobe Illustrator', 'Adobe XD', 'Figma', 'Sketch',
                'UI/UX Design', 'Graphic Design', 'Motion Graphics', 'Video Editing',
                'After Effects', 'Premiere Pro', 'Blender', 'Typography', 'Brand Identity'
            ],
            'Bisnis' => [
                'Microsoft Excel', 'Microsoft PowerPoint', 'Project Management', 'SCRUM',
                'Digital Marketing', 'SEO', 'SEM', 'Content Marketing', 'Email Marketing',
                'Social Media Marketing', 'Data Analysis', 'Business Development',
                'Financial Analysis', 'Sales', 'Customer Relationship Management'
            ]
        ];
        
        foreach ($candidates as $candidate) {
            // Pilih kategori skill secara acak
            $categoryKey = array_rand($skillsByCategory);
            $skills = $skillsByCategory[$categoryKey];
            
            // Pilih 3-7 skill acak dari kategori terpilih
            $skillCount = rand(3, 7);
            $selectedSkills = [];
            for ($i = 0; $i < $skillCount; $i++) {
                $skillIndex = array_rand($skills);
                $selectedSkills[] = $skills[$skillIndex];
                unset($skills[$skillIndex]);
                if (empty($skills)) break;
            }
            
            // Buat string skills
            $skillsString = implode(', ', $selectedSkills);
            
            // Pilih universitas dan jurusan secara acak
            $university = $universities[array_rand($universities)];
            $major = $educationMajors[array_rand($educationMajors)];
            
            // Format pendidikan
            $education = "S1 {$major}, {$university}, " . rand(2018, 2023);
            
            // Buat atau perbarui profile kandidat
            CandidateProfile::updateOrCreate(
                [
                    'user_id' => $candidate->id
                ],
                [
                    'date_of_birth' => $faker->dateTimeBetween('-30 years', '-20 years')->format('Y-m-d'),
                    'phone' => '08' . $faker->numberBetween(100000000, 999999999),
                    'address' => $faker->address,
                    'education' => $education,
                    'experience' => rand(0, 1) ? $faker->paragraph(rand(2, 4)) : null,
                    'skills' => $skillsString,
                    'linkedin' => 'https://linkedin.com/in/' . strtolower(str_replace(' ', '-', $candidate->name)),
                    'website' => rand(0, 1) ? 'https://' . strtolower(str_replace(' ', '', $candidate->name)) . '.com' : null,
                    'twitter' => rand(0, 1) ? 'https://twitter.com/' . strtolower(str_replace(' ', '', $candidate->name)) : null,
                    'github' => rand(0, 1) ? 'https://github.com/' . strtolower(str_replace(' ', '', $candidate->name)) : null,
                    'resume' => null, // Bisa diisi dengan path file jika diperlukan
                    'profile_picture' => null, // Bisa diisi dengan path file jika diperlukan
                ]
            );
        }
        
        $this->command->info('Candidate profiles seeded successfully.');
    }
} 