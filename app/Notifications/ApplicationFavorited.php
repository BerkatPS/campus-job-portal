<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\BroadcastMessage;

class ApplicationFavorited extends BaseNotification
{
    public function toDatabase($notifiable)
    {
        $message = $this->notifiable->is_favorite ?
            "Lamaran Anda untuk posisi {$this->notifiable->job->title} telah ditandai sebagai favorit" :
            "Lamaran Anda untuk posisi {$this->notifiable->job->title} tidak lagi ditandai sebagai favorit";

        return [
            'title' => 'Status Favorit Diperbarui',
            'message' => $message,
            'action_url' => route('candidate.applications.show', $this->notifiable),
            'job_id' => $this->notifiable->job_id,
            'job_title' => $this->notifiable->job->title,
            'company_name' => $this->notifiable->job->company->name,
            'is_favorite' => $this->notifiable->is_favorite,
            'updated_by' => $this->data['updated_by'] ?? null,
            'updated_by_name' => $this->data['updated_by_name'] ?? null,
        ];
    }
}
