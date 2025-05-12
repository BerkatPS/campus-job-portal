<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\BroadcastMessage;

class JobCreated extends BaseNotification
{
    public function toDatabase($notifiable)
    {
        return [
            'title' => 'Lowongan Pekerjaan Baru',
            'message' => "Lowongan pekerjaan baru '{$this->notifiable->title}' telah dipublikasikan",
            'action_url' => route('jobs.show', $this->notifiable->id),
            'job_id' => $this->notifiable->id,
            'job_title' => $this->notifiable->title,
            'company_name' => $this->notifiable->company->name,
            'created_by' => $this->data['created_by'] ?? null,
            'created_by_name' => $this->data['created_by_name'] ?? null,
        ];
    }
}
