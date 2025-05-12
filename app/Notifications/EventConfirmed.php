<?php

namespace App\Notifications;

class EventConfirmed extends BaseNotification
{
    public function toDatabase($notifiable)
    {
        return [
            'title' => 'Konfirmasi Kehadiran Diterima',
            'message' => "Kandidat {$this->data['candidate_name']} telah mengkonfirmasi kehadiran untuk {$this->notifiable->type} pada {$this->notifiable->start_time->format('d M Y H:i')}",
            'action_url' => route('manager.events.show', $this->notifiable->id),
            'event_id' => $this->notifiable->id,
            'job_id' => $this->notifiable->job_id,
            'job_title' => $this->notifiable->job->title,
            'job_application_id' => $this->notifiable->job_application_id,
            'company_name' => $this->notifiable->job->company->name,
            'event_type' => $this->notifiable->type,
            'start_time' => $this->notifiable->start_time->toISOString(),
            'candidate_id' => $this->data['candidate_id'] ?? null,
            'candidate_name' => $this->data['candidate_name'] ?? null,
        ];
    }
}
