<?php

namespace Database\Seeders;

use App\Models\JobApplication;
use App\Models\User;
use App\Models\Role;
use App\Models\Event;
use Illuminate\Database\Seeder;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ambil aplikasi pekerjaan
        $applications = JobApplication::all();
        
        if ($applications->isEmpty()) {
            $this->command->error('No job applications found. Please run JobApplicationSeeder first.');
            return;
        }
        
        // Ambil user dengan role manager (yang akan membuat event)
        $managerRole = Role::where('slug', 'manager')->first();
        
        if (!$managerRole) {
            $this->command->error('Manager role not found. Please run RoleSeeder first.');
            return;
        }
        
        $managers = User::where('role_id', $managerRole->id)->get();
        
        if ($managers->isEmpty()) {
            $this->command->error('No manager users found. Please run UserSeeder first.');
            return;
        }
        
        // Jenis-jenis acara/event
        $eventTypes = [
            'Interview' => [
                'title' => [
                    'Wawancara Tahap #',
                    'Technical Interview',
                    'HR Interview',
                    'Final Interview',
                    'Team Introduction'
                ],
                'description' => [
                    'Wawancara untuk mengenal kandidat lebih lanjut dan menilai kesesuaian dengan posisi yang dilamar.',
                    'Silakan siapkan CV terbaru dan portfolio jika ada. Wawancara akan berlangsung sekitar 45-60 menit.',
                    'Wawancara untuk menilai kemampuan teknis dan pengalaman kandidat terkait posisi yang dilamar.',
                    'Wawancara dengan tim HR untuk membahas kebijakan perusahaan, kompensasi, dan benefit.'
                ]
            ],
            'Test' => [
                'title' => [
                    'Technical Assessment',
                    'Coding Test',
                    'Design Challenge',
                    'Case Study Presentation',
                    'Skills Assessment'
                ],
                'description' => [
                    'Tes teknis untuk menilai kemampuan kandidat terkait posisi yang dilamar.',
                    'Tes coding untuk menilai kemampuan pemrograman dan problem solving.',
                    'Design challenge untuk menilai kemampuan desain dan kreativitas.',
                    'Presentasi studi kasus untuk menilai kemampuan analisis dan komunikasi.'
                ]
            ],
            'Onboarding' => [
                'title' => [
                    'Onboarding Session',
                    'Company Introduction',
                    'Team Meeting',
                    'Training Session',
                    'Welcome Meeting'
                ],
                'description' => [
                    'Sesi onboarding untuk memperkenalkan perusahaan, tim, dan project.',
                    'Pertemuan dengan tim untuk membahas proses kerja dan ekspektasi.',
                    'Sesi pengenalan dengan berbagai departemen di perusahaan.',
                    'Training untuk tools dan teknologi yang digunakan di perusahaan.'
                ]
            ]
        ];
        
        // Status event
        $eventStatuses = ['scheduled', 'completed', 'cancelled', 'rescheduled'];
        
        // Lokasi
        $locations = [
            'Kantor Pusat', 
            'Kantor Cabang', 
            'Virtual (Zoom)', 
            'Virtual (Google Meet)', 
            'Virtual (Microsoft Teams)'
        ];
        
        // Link meeting untuk event virtual
        $meetingLinks = [
            'Zoom' => 'https://zoom.us/j/',
            'Google Meet' => 'https://meet.google.com/',
            'Microsoft Teams' => 'https://teams.microsoft.com/l/meetup-join/'
        ];
        
        // Buat event untuk sebagian aplikasi (60%)
        $applicationsForEvents = $applications->random(intval($applications->count() * 0.6));
        
        foreach ($applicationsForEvents as $application) {
            // Tentukan jenis event
            $eventTypeKey = array_rand($eventTypes);
            $eventType = $eventTypes[$eventTypeKey];
            
            // Jumlah event untuk aplikasi ini (1-3)
            $eventCount = rand(1, 3);
            
            for ($i = 0; $i < $eventCount; $i++) {
                // Pilih manager yang membuat event
                $manager = $managers->random();
                
                // Tentukan judul dan deskripsi
                $titleIndex = array_rand($eventType['title']);
                $title = str_replace('#', ($i + 1), $eventType['title'][$titleIndex]);
                
                $descriptionIndex = array_rand($eventType['description']);
                $description = $eventType['description'][$descriptionIndex];
                
                // Tentukan status event
                $status = $eventStatuses[array_rand($eventStatuses)];
                
                // Tentukan lokasi
                $location = $locations[array_rand($locations)];
                
                // Tentukan link meeting jika virtual
                $meetingLink = null;
                if (strpos($location, 'Virtual') !== false) {
                    $platform = explode('(', str_replace(')', '', $location))[1];
                    $meetingLink = $meetingLinks[$platform] . substr(md5(rand()), 0, 10);
                }
                
                // Tentukan waktu mulai (1-14 hari ke depan, jam kerja 9-17)
                $startTime = now()->addDays(rand(1, 14))
                                ->setHour(rand(9, 16))
                                ->setMinute(rand(0, 1) ? 0 : 30)
                                ->setSecond(0);
                
                // Tentukan waktu selesai (30-90 menit setelah waktu mulai)
                $durationMinutes = [30, 45, 60, 90][array_rand([30, 45, 60, 90])];
                $endTime = (clone $startTime)->addMinutes($durationMinutes);
                
                // Buat array attendees (aplikasi user dan beberapa manager)
                $attendees = [
                    ['id' => $application->user_id, 'type' => 'candidate'], 
                    ['id' => $manager->id, 'type' => 'manager']
                ];
                
                // Terkadang tambahkan manager lain sebagai attendee
                if (rand(0, 1) && $managers->count() > 1) {
                    $otherManagers = $managers->reject(function ($m) use ($manager) {
                        return $m->id === $manager->id;
                    })->random(min(rand(1, 2), $managers->count() - 1));
                    
                    foreach ($otherManagers as $otherManager) {
                        $attendees[] = ['id' => $otherManager->id, 'type' => 'manager'];
                    }
                }
                
                // Buat event
                Event::updateOrCreate(
                    [
                        'job_application_id' => $application->id,
                        'start_time' => $startTime,
                        'end_time' => $endTime
                    ],
                    [
                        'title' => $title,
                        'description' => $description,
                        'job_id' => $application->job_id,
                        'user_id' => $manager->id,
                        'location' => $location,
                        'meeting_link' => $meetingLink,
                        'type' => $eventTypeKey,
                        'status' => $status,
                        'attendees' => json_encode($attendees)
                    ]
                );
            }
        }
        
        $this->command->info('Events seeded successfully.');
    }
} 