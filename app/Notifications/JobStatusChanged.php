<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\BroadcastMessage;

class JobStatusChanged extends BaseNotification
{
    public function toDatabase($notifiable)
    {
        return [
            'title' => 'Status Lowongan Diperbarui',
            'message' => "Status lowongan '{$this->notifiable->title}' telah diubah dari {$this->data['old_status']} menjadi {$this->data['new_status']}",
            'action_url' => route('jobs.show', $this->notifiable->id),
            'job_id' => $this->notifiable->id,
            'job_title' => $this->notifiable->title,
            'company_name' => $this->notifiable->company->name,
            'old_status' => $this->data['old_status'],
            'new_status' => $this->data['new_status'],
            'updated_by' => $this->data['updated_by'] ?? null,
            'updated_by_name' => $this->data['updated_by_name'] ?? null,
        ];
    }
}
