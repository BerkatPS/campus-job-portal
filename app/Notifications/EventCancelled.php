<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class EventCancelled extends Notification implements ShouldQueue
{
    use Queueable;

    protected $event;
    protected $data;

    /**
     * Create a new notification instance.
     *
     * @param $event
     * @param array $data
     */
    public function __construct($event, $data = [])
    {
        $this->event = $event;
        $this->data = $data;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['database', 'broadcast'];
    }

    /**
     * Get the array representation of the notification for database.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function toDatabase($notifiable)
    {
        return [
            'title' => 'Jadwal Dibatalkan: ' . $this->event->title,
            'message' => "Jadwal {$this->event->type} Anda untuk posisi {$this->event->job->title} pada {$this->event->start_time->format('d M Y H:i')} telah dibatalkan",
            'action_url' => route('candidate.applications.show', $this->event->job_application_id),
            'event_id' => $this->event->id,
            'job_id' => $this->event->job_id,
            'job_title' => $this->event->job->title,
            'job_application_id' => $this->event->job_application_id,
            'company_name' => $this->event->job->company->name,
            'event_type' => $this->event->type,
            'start_time' => $this->event->start_time->toISOString(),
            'end_time' => $this->event->end_time->toISOString(),
            'location' => $this->event->location,
            'meeting_link' => $this->event->meeting_link,
            'cancelled_by' => $this->data['cancelled_by'] ?? null,
            'cancelled_by_name' => $this->data['cancelled_by_name'] ?? null,
            'cancellation_reason' => $this->data['reason'] ?? null,
            'cancelled_at' => now()->toISOString(),
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
            'data' => $this->toDatabase($notifiable),
            'created_at' => now()->toISOString(),
            'read_at' => null,
        ]);
    }

    /**
     * Get the type of notification being broadcasted.
     *
     * @return string
     */
    public function broadcastType()
    {
        return 'event.cancelled';
    }
}
