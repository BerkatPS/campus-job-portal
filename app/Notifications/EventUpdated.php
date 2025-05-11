<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class EventUpdated extends Notification implements ShouldQueue
{
    use Queueable;

    protected $event;
    protected $data;

    public function __construct($event, $data = [])
    {
        $this->event = $event;
        $this->data = $data;
    }

    public function via($notifiable)
    {
        return ['database', 'broadcast'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'title' => 'Jadwal Diperbarui: ' . $this->event->title,
            'message' => "Jadwal {$this->event->type} Anda untuk posisi {$this->event->job->title} telah diperbarui",
            'action_url' => route('candidate.events.show', $this->event),
            'event_id' => $this->event->id,
            'job_id' => $this->event->job_id,
            'job_title' => $this->event->job->title,
            'company_name' => $this->event->job->company->name,
            'event_type' => $this->event->type,
            'start_time' => $this->event->start_time->toISOString(),
            'location' => $this->event->location,
            'meeting_link' => $this->event->meeting_link,
            'old_data' => $this->data['old_data'] ?? null,
            'updated_by' => $this->data['updated_by'] ?? null,
            'updated_by_name' => $this->data['updated_by_name'] ?? null,
        ];
    }

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
}
