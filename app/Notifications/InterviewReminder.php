<?php

namespace App\Notifications;

use App\Notifications\BaseNotification;

class InterviewReminder extends BaseNotification
{
    public function toDatabase($notifiable)
    {
        return [
            'title' => 'Pengingat Wawancara',
            'message' => "Jangan lupa, Anda memiliki jadwal {$this->notifiable->type} untuk posisi {$this->notifiable->job->title} pada {$this->notifiable->start_time->format('d M Y H:i')}",
            'action_url' => route('candidate.events.show', $this->notifiable->id),
            'event_id' => $this->notifiable->id,
            'job_id' => $this->notifiable->job_id,
            'job_title' => $this->notifiable->job->title,
            'event_type' => $this->notifiable->type,
            'start_time' => $this->notifiable->start_time->toISOString(),
            'location' => $this->notifiable->location,
            'meeting_link' => $this->notifiable->meeting_link,
        ];
    }
}
