<?php

namespace App\Notifications;

use App\Models\JobApplication;
use Illuminate\Notifications\Messages\MailMessage;

class NewJobApplication extends BaseNotification
{
    /**
     * Create a new notification instance.
     */
    public function __construct(JobApplication $application, array $data = [])
    {
        $this->notifiable = $application;
        $this->data = $data;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via($notifiable)
    {
        return ['mail', 'database', 'broadcast'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail($notifiable)
    {
        $application = $this->notifiable;

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
     */
    public function toDatabase($notifiable)
    {
        $application = $this->notifiable;

        return [
            'type' => 'new_job_application',
            'application_id' => $application->id,
            'job_id' => $application->job_id,
            'job_title' => $application->job->title,
            'company_name' => $application->job->company->name,
            'candidate_name' => $application->user->name,
            'candidate_email' => $application->user->email,
            'message' => "Lamaran baru untuk posisi {$application->job->title} dari {$application->user->name}",
            'url' => url('/manager/applications/' . $application->id),
            'created_at' => $application->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
