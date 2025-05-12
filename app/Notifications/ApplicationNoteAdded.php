<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\BroadcastMessage;

class ApplicationNoteAdded extends BaseNotification
{
    public function toDatabase($notifiable)
    {
        return [
            'title' => 'Catatan Baru Pada Lamaran',
            'message' => "Catatan baru telah ditambahkan pada lamaran Anda untuk posisi {$this->notifiable->job->title}",
            'action_url' => route('candidate.applications.show', $this->notifiable),
            'job_id' => $this->notifiable->job_id,
            'job_title' => $this->notifiable->job->title,
            'company_name' => $this->notifiable->job->company->name,
            'added_by' => $this->data['added_by'] ?? null,
            'added_by_name' => $this->data['added_by_name'] ?? null,
        ];
    }
}
