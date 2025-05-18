<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class EventStatusUpdated extends Notification implements ShouldQueue
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
        $statusMessages = [
            'scheduled' => 'dijadwalkan',
            'completed' => 'selesai',
            'cancelled' => 'dibatalkan',
            'rescheduled' => 'dijadwalkan ulang',
        ];

        $oldStatusText = $statusMessages[$this->data['old_status']] ?? $this->data['old_status'];
        $newStatusText = $statusMessages[$this->data['new_status']] ?? $this->data['new_status'];

        return [
            'title' => 'Status Jadwal Diperbarui: ' . $this->event->title,
            'message' => "Status jadwal {$this->event->type} Anda untuk posisi {$this->event->job->title} telah diperbarui dari {$oldStatusText} menjadi {$newStatusText}",
            'action_url' => route('candidate.events.show', $this->event),
            'event_id' => $this->event->id,
            'job_id' => $this->event->job_id,
            'job_title' => $this->event->job->title,
            'job_application_id' => $this->event->job_application_id,
            'company_name' => $this->event->job->company->name,
            'event_type' => $this->event->type,
            'old_status' => $this->data['old_status'],
            'new_status' => $this->data['new_status'],
            'start_time' => $this->event->start_time->toISOString(),
            'end_time' => $this->event->end_time->toISOString(),
            'location' => $this->event->location,
            'meeting_link' => $this->event->meeting_link,
            'updated_by' => $this->data['updated_by'] ?? null,
            'updated_by_name' => $this->data['updated_by_name'] ?? null,
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
        return 'event.status.updated';
    }
}
