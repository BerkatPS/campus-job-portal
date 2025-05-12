<?php

namespace App\Notifications;

class JobMatchesYourProfile extends BaseNotification
{
    public function toDatabase($notifiable)
    {
        return [
            'title' => 'Lowongan yang Cocok dengan Profil Anda',
            'message' => "Kami menemukan lowongan '{$this->notifiable->title}' yang sesuai dengan keterampilan dan pengalaman Anda",
            'action_url' => route('jobs.show', $this->notifiable->id),
            'job_id' => $this->notifiable->id,
            'job_title' => $this->notifiable->title,
            'company_name' => $this->notifiable->company->name,
            'skills_matched' => $this->data['skills_matched'] ?? [],
            'match_percentage' => $this->data['match_percentage'] ?? null,
        ];
    }
}
