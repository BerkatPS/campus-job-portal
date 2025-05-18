<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\BroadcastMessage;
use App\Models\Job;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class JobCreated extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * The job instance.
     *
     * @var Job
     */
    protected $job;

    /**
     * Additional data.
     * 
     * @var array
     */
    protected $data;

    /**
     * Create a new notification instance.
     *
     * @param Job $job
     * @param array $data
     */
    public function __construct(Job $job, array $data = [])
    {
        $this->job = $job;
        $this->data = $data;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['database', 'broadcast'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return $this->toDatabase($notifiable);
    }

    /**
     * Get the database representation of the notification.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function toDatabase($notifiable)
    {
        return [
            'title' => 'Lowongan Pekerjaan Baru',
            'message' => "Lowongan pekerjaan baru '{$this->job->title}' telah dipublikasikan",
            'action_url' => route('jobs.show', $this->job->id),
            'job_id' => $this->job->id,
            'job_title' => $this->job->title,
            'company_name' => $this->job->company->name,
            'created_by' => $this->data['created_by'] ?? null,
            'created_by_name' => $this->data['created_by_name'] ?? null,
        ];
    }

    /**
     * Get the broadcast representation of the notification.
     *
     * @param mixed $notifiable
     * @return BroadcastMessage
     */
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
