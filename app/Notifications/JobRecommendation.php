<?php

namespace App\Notifications;

use App\Notifications\BaseNotification;

class JobRecommendation extends BaseNotification
{
    public function toDatabase($notifiable)
    {
        return [
            'title' => 'Rekomendasi Lowongan Baru',
            'message' => "Kami menemukan lowongan {$this->notifiable->title} yang sesuai dengan profil Anda",
            'action_url' => route('candidate.jobs.show', $this->notifiable->id),
            'job_id' => $this->notifiable->id,
            'job_title' => $this->notifiable->title,
            'company_name' => $this->notifiable->company->name,
            'company_logo' => $this->notifiable->company->logo ? asset('storage/' . $this->notifiable->company->logo) : null,
            'location' => $this->notifiable->location,
            'job_type' => $this->notifiable->job_type,
            'deadline' => $this->notifiable->submission_deadline->format('Y-m-d'),
            'match_percentage' => $this->data['match_percentage'] ?? null,
        ];
    }
}
