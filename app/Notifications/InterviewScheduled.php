<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Broadcasting\PrivateChannel;
use App\Models\Event;
use App\Models\JobApplication;

class InterviewScheduled extends BaseNotification
{
    /**
     * @var Event
     */
    protected $event;

    /**
     * @var JobApplication
     */
    protected $application;

    /**
     * Create a new notification instance.
     *
     * @param mixed $notifiable The user receiving the notification
     * @param Event $event The interview event
     * @param JobApplication $application The job application
     * @param array $data Additional data
     */
    public function __construct($notifiable, Event $event, JobApplication $application, array $data = [])
    {
        parent::__construct($notifiable, $data);
        $this->event = $event;
        $this->application = $application;
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param mixed $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        $url = route('candidate.events.show', $this->event->id);
        $job = $this->application->job;
        $company = $job->company;
        
        // Format the date and time
        $interviewDate = \Carbon\Carbon::parse($this->event->start_time)->format('l, d F Y');
        $interviewTime = \Carbon\Carbon::parse($this->event->start_time)->format('H:i') . ' - ' .
                         \Carbon\Carbon::parse($this->event->end_time)->format('H:i');

        return (new MailMessage)
            ->subject('Interview Dijadwalkan: ' . $job->title)
            ->greeting('Halo ' . $notifiable->name . ',')
            ->line('Anda telah dijadwalkan untuk interview untuk posisi ' . $job->title . ' di ' . $company->name . '.')
            ->line('Detail Interview:')
            ->line('Tanggal: ' . $interviewDate)
            ->line('Waktu: ' . $interviewTime)
            ->line('Lokasi: ' . $this->event->location)
            ->line('Deskripsi: ' . $this->event->description)
            ->action('Lihat Detail Interview', $url)
            ->line('Mohon konfirmasi kehadiran Anda melalui link di atas.')
            ->line('Terima kasih dan semoga sukses!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        $url = route('candidate.events.show', $this->event->id);
        $job = $this->application->job;
        $company = $job->company;
        
        $interviewDate = \Carbon\Carbon::parse($this->event->start_time)->format('d M Y');
        $interviewTime = \Carbon\Carbon::parse($this->event->start_time)->format('H:i');
        
        return [
            'title' => 'Interview Dijadwalkan',
            'message' => 'Interview untuk posisi ' . $job->title . ' di ' . $company->name . ' telah dijadwalkan pada ' . $interviewDate . ' pukul ' . $interviewTime,
            'action_url' => $url,
            'action_text' => 'Lihat Detail',
            'event_id' => $this->event->id,
            'application_id' => $this->application->id,
            'job_id' => $job->id,
            'company_id' => $company->id,
            'start_time' => $this->event->start_time,
        ];
    }

    /**
     * Get the broadcastable representation of the notification.
     *
     * @param mixed $notifiable
     * @return BroadcastMessage
     */
        public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'id' => $this->id,
            'type' => get_class($this),
            'data' => $this->toArray($notifiable),
            'created_at' => now()->toISOString(),
            'read_at' => null,
        ]);
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @param mixed $notifiable
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn($notifiable)
    {
        return new PrivateChannel('App.Models.User.' . $notifiable->id);
    }
}
