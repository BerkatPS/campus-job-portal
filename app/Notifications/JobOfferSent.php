<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Broadcasting\PrivateChannel;
use App\Models\JobApplication;

class JobOfferSent extends BaseNotification
{
    /**
     * @var JobApplication
     */
    protected $jobApplication;

    /**
     * Create a new notification instance.
     *
     * @param mixed $notifiable The user receiving the notification
     * @param JobApplication $jobApplication The job application being offered
     * @param array $data Additional data
     */
    public function __construct($notifiable, JobApplication $jobApplication, array $data = [])
    {
        parent::__construct($notifiable, $data);
        $this->jobApplication = $jobApplication;
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param mixed $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        $url = route('candidate.applications.show', $this->jobApplication->id);
        $job = $this->jobApplication->job;
        $company = $job->company;

        return (new MailMessage)
            ->subject('Tawaran Pekerjaan dari ' . $company->name)
            ->greeting('Selamat ' . $notifiable->name . '!')
            ->line('Kami senang memberitahu bahwa Anda telah diterima untuk posisi ' . $job->title . ' di ' . $company->name . '.')
            ->line('Silakan lihat detail tawaran yang telah kami siapkan untuk Anda.')
            ->action('Lihat Tawaran', $url)
            ->line('Tolong konfirmasi keputusan Anda secepatnya.')
            ->line('Selamat atas pencapaian ini!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        $job = $this->jobApplication->job;
        $company = $job->company;
        $url = route('candidate.applications.show', $this->jobApplication->id);
        
        return [
            'title' => 'Tawaran Pekerjaan Baru',
            'message' => 'Anda telah menerima tawaran untuk posisi ' . $job->title . ' di ' . $company->name,
            'action_url' => $url,
            'action_text' => 'Lihat Tawaran',
            'job_id' => $job->id,
            'company_id' => $company->id,
            'application_id' => $this->jobApplication->id,
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
