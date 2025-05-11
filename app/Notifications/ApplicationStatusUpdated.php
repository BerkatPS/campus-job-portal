<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\DatabaseMessage;
use Illuminate\Notifications\Notification;

class ApplicationStatusUpdated extends Notification implements ShouldQueue
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
            'title' => 'Application Status Updated',
            'message' => "Status lamaran Anda untuk posisi {$this->application->job->title} telah diperbarui",
            'action_url' => route('candidate.applications.show', $this->application),
            'old_status' => $this->data['old_status'] ?? null,
            'new_status' => $this->data['new_status'] ?? null,
        ];
    }

    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'id' => $this->id,
            'type' => get_class($this),
            'data' => $this->toDatabase($notifiable),
            'created_at' => now()->toISOString(),
        ]);
    }
}
