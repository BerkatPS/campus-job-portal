<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Broadcasting\PrivateChannel;
use App\Models\Job;

class NewJobPosted extends BaseNotification
{
    /**
     * @var Job
     */
    protected $job;

    /**
     * Create a new notification instance.
     *
     * @param mixed $notifiable The user receiving the notification
     * @param Job $job The newly posted job
     * @param array $data Additional data
     */
    public function __construct($notifiable, Job $job, array $data = [])
    {
        parent::__construct($notifiable, $data);
        $this->job = $job;
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param mixed $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        $url = route('public.jobs.show', $this->job->id);
        $company = $this->job->company;

        return (new MailMessage)
            ->subject('Lowongan Pekerjaan Baru: ' . $this->job->title)
            ->greeting('Halo ' . $notifiable->name . ',')
            ->line('Lowongan pekerjaan baru telah dipublish yang mungkin cocok dengan profil Anda:')
            ->line('Posisi: ' . $this->job->title)
            ->line('Perusahaan: ' . $company->name)
            ->line('Lokasi: ' . $this->job->location)
            ->line(str_limit(strip_tags($this->job->description), 150))
            ->action('Lihat Lowongan', $url)
            ->line('Semoga beruntung dengan aplikasi Anda!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        $url = route('public.jobs.show', $this->job->id);
        $company = $this->job->company;
        
        return [
            'title' => 'Lowongan Pekerjaan Baru',
            'message' => $this->job->title . ' di ' . $company->name . ' - ' . $this->job->location,
            'action_url' => $url,
            'action_text' => 'Lihat Lowongan',
            'job_id' => $this->job->id,
            'company_id' => $company->id,
            'job_title' => $this->job->title,
            'company_name' => $company->name,
        ];
    }

    /**
     * Get the broadcastable representation of the notification.
     *
     * @param mixed $notifiable
     * @return BroadcastMessage
     */
        public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'id' => $this->id,
            'type' => get_class($this),
            'data' => $this->toArray($notifiable),
            'created_at' => now()->toISOString(),
            'read_at' => null,
        ]);
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @param mixed $notifiable
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn($notifiable)
    {
        return new PrivateChannel('App.Models.User.' . $notifiable->id);
    }
}
