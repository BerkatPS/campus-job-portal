<?php

namespace App\Notifications;

use App\Notifications\BaseNotification;

class ApplicationDeadlineReminder extends BaseNotification
{
    public function toDatabase($notifiable)
    {
        return [
            'title' => 'Tenggat Lamaran Mendekat',
            'message' => "Tenggat waktu lamaran untuk posisi {$this->notifiable->job->title} akan berakhir dalam {$this->data['days_remaining']} hari",
            'action_url' => route('candidate.jobs.show', $this->notifiable->job_id),
            'job_id' => $this->notifiable->job_id,
            'job_title' => $this->notifiable->job->title,
            'company_name' => $this->notifiable->job->company->name,
            'days_remaining' => $this->data['days_remaining'],
        ];
    }
}
