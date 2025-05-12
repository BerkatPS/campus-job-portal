<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\BroadcastMessage;

class JobDeadlineApproaching extends BaseNotification
{
    public function toDatabase($notifiable)
    {
        return [
            'title' => 'Deadline Lowongan Mendekat',
            'message' => "Lowongan '{$this->notifiable->title}' akan berakhir dalam {$this->data['days_remaining']} hari",
            'action_url' => route('jobs.show', $this->notifiable->id),
            'job_id' => $this->notifiable->id,
            'job_title' => $this->notifiable->title,
            'company_name' => $this->notifiable->company->name,
            'submission_deadline' => $this->notifiable->submission_deadline,
            'days_remaining' => $this->data['days_remaining'],
        ];
    }
}
