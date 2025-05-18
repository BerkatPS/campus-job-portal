<?php

namespace App\Notifications;

use App\Models\Event;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Carbon\Carbon;

class InterviewInvitation extends Notification implements ShouldQueue
{
    use Queueable;

    protected $event;

    /**
     * Create a new notification instance.
     */
    public function __construct(Event $event)
    {
        $this->event = $event;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database', 'broadcast'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $url = route('candidate.events.show', $this->event->id);
        
        $mailMessage = (new MailMessage)
            ->subject('Undangan Wawancara: ' . $this->event->title)
            ->greeting('Halo ' . $notifiable->name . ',')
            ->line('Anda telah diundang untuk mengikuti wawancara untuk posisi berikut:')
            ->line($this->event->title)
            ->line('Detail Wawancara:')
            ->line('Tanggal: ' . Carbon::parse($this->event->start_time)->format('d F Y'))
            ->line('Waktu: ' . Carbon::parse($this->event->start_time)->format('H:i') . ' - ' . Carbon::parse($this->event->end_time)->format('H:i'))
            ->line('Lokasi: ' . $this->event->location);
            
        if ($this->event->meeting_link) {
            $mailMessage->line('Link Meeting: ' . $this->event->meeting_link);
        }
        
        $mailMessage->action('Lihat Detail Wawancara', $url)
            ->line('Silakan konfirmasi kehadiran Anda melalui halaman detail wawancara.');
            
        // Add calendar attachment
        $icsContents = $this->generateIcsContent();
        if ($icsContents) {
            $mailMessage->attachData($icsContents, 'wawancara.ics', [
                'mime' => 'text/calendar',
            ]);
        }
        
        return $mailMessage;
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'id' => $this->event->id,
            'type' => 'interview_invitation',
            'title' => $this->event->title,
            'message' => 'Anda diundang untuk wawancara pada ' . Carbon::parse($this->event->start_time)->format('d F Y H:i'),
            'time' => $this->event->start_time,
            'link' => route('candidate.events.show', $this->event->id),
        ];
    }
    
    /**
     * Generate ICS content for calendar invitation
     */
    private function generateIcsContent()
    {
        try {
            $job = $this->event->job;
            $location = $this->event->location;
            
            // If it's an online meeting, add the meeting link
            if ($this->event->meeting_link) {
                $location .= ' - ' . $this->event->meeting_link;
            }
            
            $description = "Wawancara untuk posisi {$job->title} di {$job->company->name}.\n\n";
            if ($this->event->notes) {
                $description .= "Catatan: {$this->event->notes}\n\n";
            }
            
            if ($this->event->meeting_link) {
                $description .= "Link Meeting: {$this->event->meeting_link}\n\n";
            }
            
            $description .= "Untuk informasi lebih lanjut, silakan login ke portal lowongan kerja kampus.";
            
            $startTime = Carbon::parse($this->event->start_time)->format('Ymd\THis\Z');
            $endTime = Carbon::parse($this->event->end_time)->format('Ymd\THis\Z');
            $now = Carbon::now()->format('Ymd\THis\Z');
            
            $ics = "BEGIN:VCALENDAR\r\n";
            $ics .= "VERSION:2.0\r\n";
            $ics .= "PRODID:-//Campus Job Portal//Interview Scheduler//ID\r\n";
            $ics .= "CALSCALE:GREGORIAN\r\n";
            $ics .= "METHOD:REQUEST\r\n";
            $ics .= "BEGIN:VEVENT\r\n";
            $ics .= "DTSTART:" . $startTime . "\r\n";
            $ics .= "DTEND:" . $endTime . "\r\n";
            $ics .= "DTSTAMP:" . $now . "\r\n";
            $ics .= "ORGANIZER;CN=" . config('app.name') . ":mailto:noreply@" . config('app.domain', 'example.com') . "\r\n";
            $ics .= "UID:" . md5($this->event->id . $startTime . $endTime) . "@" . config('app.domain', 'example.com') . "\r\n";
            $ics .= "SUMMARY:" . $this->event->title . "\r\n";
            $ics .= "DESCRIPTION:" . str_replace("\n", "\\n", $description) . "\r\n";
            $ics .= "LOCATION:" . $location . "\r\n";
            $ics .= "STATUS:CONFIRMED\r\n";
            $ics .= "SEQUENCE:0\r\n";
            $ics .= "BEGIN:VALARM\r\n";
            $ics .= "TRIGGER:-PT1H\r\n";
            $ics .= "ACTION:DISPLAY\r\n";
            $ics .= "DESCRIPTION:Reminder\r\n";
            $ics .= "END:VALARM\r\n";
            $ics .= "END:VEVENT\r\n";
            $ics .= "END:VCALENDAR\r\n";
            
            return $ics;
        } catch (\Exception $e) {
            \Log::error('Error generating ICS content: ' . $e->getMessage());
            return null;
        }
    }
}
