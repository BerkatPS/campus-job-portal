<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Broadcasting\PrivateChannel;
use App\Models\JobApplication;
use App\Models\User;

class CandidateWithdrawal extends BaseNotification
{
    /**
     * @var JobApplication
     */
    protected $application;

    /**
     * @var User
     */
    protected $candidate;

    /**
     * Create a new notification instance.
     *
     * @param mixed $notifiable The user (manager) receiving the notification
     * @param JobApplication $application The job application that was withdrawn
     * @param User $candidate The candidate who withdrew
     * @param array $data Additional data
     */
    public function __construct($notifiable, JobApplication $application, User $candidate, array $data = [])
    {
        parent::__construct($notifiable, $data);
        $this->application = $application;
        $this->candidate = $candidate;
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param mixed $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        $job = $this->application->job;
        $url = route('manager.applications.show', $this->application->id);

        return (new MailMessage)
            ->subject('Penarikan Lamaran: ' . $job->title)
            ->greeting('Halo ' . $notifiable->name . ',')
            ->line($this->candidate->name . ' telah menarik lamaran untuk posisi ' . $job->title . '.')
            ->line('Alasan penarikan: ' . ($this->application->withdrawal_reason ?? 'Tidak disebutkan'))
            ->action('Lihat Detail Lamaran', $url)
            ->line('Anda dapat melihat detail lebih lanjut dengan mengklik tombol di atas.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        $job = $this->application->job;
        $url = route('manager.applications.show', $this->application->id);

        return [
            'title' => 'Penarikan Lamaran',
            'message' => $this->candidate->name . ' telah menarik lamaran untuk posisi ' . $job->title,
            'action_url' => $url,
            'action_text' => 'Lihat Detail',
            'application_id' => $this->application->id,
            'job_id' => $job->id,
            'candidate_id' => $this->candidate->id,
            'withdrawal_reason' => $this->application->withdrawal_reason ?? null,
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
            'data' => $this->toDatabase($notifiable),
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

    public function toDatabase($notifiable)
    {
        // TODO: Implement toDatabase() method.
    }
}
