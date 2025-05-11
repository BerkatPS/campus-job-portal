<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class ApplicationStageUpdated extends Notification implements ShouldQueue
{
    use Queueable;

    protected $application;
    protected $data;

    public function __construct($application, $data = [])
    {
        $this->application = $application;
        $this->data = $data;
    }

    public function via($notifiable)
    {
        return ['database', 'broadcast'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'title' => 'Tahap Lamaran Diperbarui',
            'message' => "Tahap lamaran Anda untuk posisi {$this->application->job->title} telah diperbarui dari {$this->data['old_stage']} menjadi {$this->data['new_stage']}",
            'action_url' => route('candidate.applications.show', $this->application),
            'job_id' => $this->application->job_id,
            'job_title' => $this->application->job->title,
            'company_name' => $this->application->job->company->name,
            'old_stage' => $this->data['old_stage'] ?? null,
            'new_stage' => $this->data['new_stage'] ?? null,
            'notes' => $this->data['notes'] ?? null,
            'updated_by' => $this->data['updated_by'] ?? null,
            'updated_by_name' => $this->data['updated_by_name'] ?? null,
        ];
    }

    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'id' => $this->id,
            'type' => get_class($this),
            'data' => $this->toDatabase($notifiable),
            'created_at' => now()->toISOString(),
            'read_at' => null,
        ]);
    }
}
