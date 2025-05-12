<?php

namespace App\Notifications;

use App\Notifications\BaseNotification;

class EventResponseNeeded extends BaseNotification
{
    public function toDatabase($notifiable)
    {
        return [
            'title' => 'Konfirmasi Kehadiran Diperlukan',
            'message' => "Mohon konfirmasi kehadiran Anda untuk {$this->notifiable->type} pada {$this->notifiable->start_time->format('d M Y H:i')} untuk posisi {$this->notifiable->job->title}",
            'action_url' => route('candidate.events.show', $this->notifiable->id),
            'event_id' => $this->notifiable->id,
            'job_id' => $this->notifiable->job_id,
            'job_title' => $this->notifiable->job->title,
            'event_type' => $this->notifiable->type,
            'start_time' => $this->notifiable->start_time->toISOString(),
            'due_by' => $this->data['due_by'] ?? null,
        ];
    }
}
