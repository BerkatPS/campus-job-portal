<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\Job;
use App\Models\Role;
use Carbon\Carbon;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class ConversationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get role IDs for managers and candidates
        $managerRole = Role::where('slug', 'manager')->first();
        $candidateRole = Role::where('slug', 'candidate')->first();

        if (!$managerRole || !$candidateRole) {
            $this->command->info('Manager or candidate roles not found. Please seed roles first.');
            return;
        }

        // Get managers and candidates based on role_id
        $managers = User::where('role_id', $managerRole->id)->get();
        $candidates = User::where('role_id', $candidateRole->id)->get();
        $jobs = Job::all();

        if ($managers->isEmpty() || $candidates->isEmpty()) {
            $this->command->info('No managers or candidates found. Please seed users first.');
            return;
        }

        if ($jobs->isEmpty()) {
            $this->command->info('No jobs found. Please seed jobs first.');
            return;
        }

        // Create sample attachments directory if it doesn't exist
        if (!Storage::exists('public/attachments')) {
            Storage::makeDirectory('public/attachments');
        }

        // Create a few sample attachments to reuse
        $sampleFiles = [
            'sample_cv.pdf' => 'application/pdf',
            'sample_portfolio.jpg' => 'image/jpeg',
            'project_description.docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];

        foreach ($sampleFiles as $fileName => $mimeType) {
            if (!Storage::exists('public/attachments/' . $fileName)) {
                // Create empty file with mime type
                $content = 'Sample content for ' . $fileName;
                Storage::put('public/attachments/' . $fileName, $content);
            }
        }

        // Message templates
        $messageTemplates = [
            'candidate' => [
                'Selamat siang, saya tertarik dengan posisi yang Anda tawarkan. Bisakah Anda memberikan informasi lebih lanjut?',
                'Terima kasih atas tawaran wawancara. Kapan waktu yang tepat untuk melakukan wawancara?',
                'Saya telah melampirkan CV terbaru saya untuk peninjauan Anda.',
                'Apakah ada keterampilan khusus yang dibutuhkan untuk posisi ini?',
                'Bagaimana proses seleksi selanjutnya setelah wawancara?',
                'Saya memiliki beberapa pertanyaan tentang deskripsi pekerjaan. Bisakah kita mendiskusikannya?',
                'Saya tertarik dengan budaya perusahaan Anda. Bisakah Anda memberi tahu lebih banyak tentang tim yang akan saya bergabung?',
                'Terima kasih atas umpan balik Anda. Saya akan melakukan perbaikan yang disarankan.',
            ],
            'manager' => [
                'Terima kasih atas minat Anda. Kami sedang mencari kandidat dengan keterampilan seperti yang Anda miliki.',
                'Bisakah kita menjadwalkan wawancara pada hari Selasa atau Rabu minggu depan?',
                'Terima kasih atas CV Anda. Tim kami akan meninjau dan menghubungi Anda segera.',
                'Posisi ini membutuhkan keahlian dalam Laravel, React, dan pengelolaan database.',
                'Setelah wawancara pertama, akan ada sesi teknis dan wawancara dengan tim.',
                'Saya akan dengan senang hati menjawab pertanyaan Anda. Silakan bertanya.',
                'Tim kami terdiri dari 5 pengembang senior dan 3 junior. Kami menggunakan metodologi Agile.',
                'Umpan balik Anda sangat dihargai. Kami akan mempertimbangkan saran Anda.',
            ]
        ];

        // Subject templates
        $subjectTemplates = [
            'Aplikasi untuk posisi {job_title}',
            'Pertanyaan tentang {job_title}',
            'Tindak lanjut wawancara - {job_title}',
            'Informasi tambahan untuk aplikasi {job_title}',
            'Jadwal wawancara untuk posisi {job_title}',
            'Diskusi tentang kualifikasi untuk {job_title}',
            'Umpan balik tentang tugas untuk {job_title}',
            'Konfirmasi kehadiran wawancara - {job_title}',
        ];

        // Create 15-20 conversations
        $conversationCount = rand(15, 20);
        $this->command->info("Creating {$conversationCount} conversations with messages...");

        for ($i = 0; $i < $conversationCount; $i++) {
            $manager = $managers->random();
            $candidate = $candidates->random();
            $job = $jobs->random();

            // Randomize timestamps within last 30 days
            $createdAt = Carbon::now()->subDays(rand(1, 30))->subHours(rand(1, 24));
            
            // Replace {job_title} placeholder in subject
            $subject = str_replace('{job_title}', $job->title, $subjectTemplates[array_rand($subjectTemplates)]);
            
            // Create conversation
            $isArchived = (rand(1, 10) > 8); // 20% chance to be archived
            
            $conversation = Conversation::create([
                'manager_id' => $manager->id,
                'candidate_id' => $candidate->id,
                'job_id' => (rand(1, 10) > 2) ? $job->id : null, // 80% chance to have job associated
                'subject' => $subject,
                'last_message_at' => $createdAt,
                'is_archived' => $isArchived,
            ]);

            // Generate 3-10 messages for each conversation
            $messageCount = rand(3, 10);
            
            for ($j = 0; $j < $messageCount; $j++) {
                // Determine sender and receiver
                $isManagerSending = $j % 2 == 1; // Alternate between candidate and manager
                $sender = $isManagerSending ? $manager : $candidate;
                $receiver = $isManagerSending ? $candidate : $manager;
                
                // Get appropriate message template
                $messageType = $isManagerSending ? 'manager' : 'candidate';
                $messageBody = $messageTemplates[$messageType][array_rand($messageTemplates[$messageType])];
                
                // Add some random variation to message
                if (rand(1, 3) == 1) {
                    $messageBody .= "\n\nDengan hormat,\n" . $sender->name;
                }
                
                // Message timestamp (increasing from conversation created date)
                $messageCreatedAt = (clone $createdAt)->addHours($j * rand(1, 5));
                
                // Decide if message is read
                $isRead = $j < $messageCount - rand(0, 2); // Last 0-2 messages might be unread
                $readAt = $isRead ? (clone $messageCreatedAt)->addMinutes(rand(5, 60)) : null;
                
                // Decide if message has attachment (20% chance)
                $attachment = null;
                if (rand(1, 5) == 1) {
                    $fileName = array_rand($sampleFiles);
                    $attachment = 'attachments/' . $fileName;
                }
                
                // Create message
                Message::create([
                    'conversation_id' => $conversation->id,
                    'sender_id' => $sender->id,
                    'receiver_id' => $receiver->id,
                    'body' => $messageBody,
                    'attachment' => $attachment,
                    'is_read' => $isRead,
                    'read_at' => $readAt,
                    'created_at' => $messageCreatedAt,
                    'updated_at' => $messageCreatedAt,
                ]);
                
                // Update conversation last_message_at to the latest message
                $conversation->update([
                    'last_message_at' => $messageCreatedAt
                ]);
            }
        }

        $this->command->info('Conversations and messages created successfully!');
    }
}
