<?php

namespace App\Notifications;

use App\Models\JobApplication;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Broadcasting\PrivateChannel;

class NewJobApplication extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * The job application instance.
     *
     * @var JobApplication
     */
    protected $application;

    /**
     * Additional data.
     * 
     * @var array
     */
    protected $data;

    /**
     * Create a new notification instance.
     *
     * @param JobApplication $application
     * @param array $data
     */
    public function __construct(JobApplication $application, array $data = [])
    {
        $this->application = $application;
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
        return ['mail', 'database', 'broadcast'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param mixed $notifiable
     * @return MailMessage
     */
    public function toMail($notifiable)
    {
        $application = $this->application;

        return (new MailMessage)
            ->subject("Lamaran Baru Diterima: {$application->job->title}")
            ->greeting("Halo {$notifiable->name},")
            ->line("Anda telah menerima lamaran baru untuk posisi {$application->job->title}.")
            ->line("Pelamar: {$application->user->name}")
            ->line("Email: {$application->user->email}")
            ->line("Diajukan pada: {$application->created_at->format('d M Y, H:i')}")
            ->action('Lihat Lamaran', url("/manager/applications/{$application->id}"))
            ->line('Silakan tinjau lamaran ini untuk proses selanjutnya.');
    }

    /**
     * Get the database representation of the notification.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function toDatabase($notifiable)
    {
        $application = $this->application;

        return [
            'title' => 'Lamaran Pekerjaan Baru',
            'application_id' => $application->id,
            'job_id' => $application->job_id,
            'job_title' => $application->job->title,
            'company_name' => $application->job->company->name,
            'candidate_name' => $application->user->name,
            'candidate_email' => $application->user->email,
            'message' => "Lamaran baru untuk posisi {$application->job->title} dari {$application->user->name}",
            'action_url' => url('/manager/applications/' . $application->id),
            'created_at' => $application->created_at->format('Y-m-d H:i:s'),
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
}
