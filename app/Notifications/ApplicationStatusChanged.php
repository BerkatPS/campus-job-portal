<?php

namespace App\Notifications;

use App\Models\JobApplication;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ApplicationStatusChanged extends Notification implements ShouldQueue
{
    use Queueable;

    protected $jobApplication;
    protected $oldStatus;
    protected $newStatus;

    /**
     * Create a new notification instance.
     */
    public function __construct(JobApplication $jobApplication, $statusData)
    {
        $this->jobApplication = $jobApplication;
        
        // Handle both array and direct string parameters for backward compatibility
        if (is_array($statusData)) {
            $this->oldStatus = $statusData['old_status'] ?? '';
            $this->newStatus = $statusData['new_status'] ?? '';
        } else {
            // Support the old parameters pattern (for the direct notify call)
            $this->oldStatus = $statusData;
            // If called with the old method, the third parameter is newStatus
            $this->newStatus = func_num_args() > 2 ? func_get_arg(2) : '';
        }
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database', 'broadcast'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $url = route('candidate.applications.show', $this->jobApplication->id);
        
        $jobTitle = $this->jobApplication->job->title;
        $companyName = $this->jobApplication->job->company->name;
        
        return (new MailMessage)
            ->subject('Update Status Lamaran: ' . $jobTitle)
            ->greeting('Halo ' . $notifiable->name . ',')
            ->line('Status lamaran Anda untuk posisi ' . $jobTitle . ' di ' . $companyName . ' telah diperbarui.')
            ->line('Status Baru: ' . $this->newStatus)
            ->action('Lihat Detail Lamaran', $url)
            ->line('Terima kasih telah menggunakan portal lowongan kerja kampus kami!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'id' => $this->jobApplication->id,
            'type' => 'application_status_changed',
            'job_id' => $this->jobApplication->job_id,
            'job_title' => $this->jobApplication->job->title,
            'company_name' => $this->jobApplication->job->company->name,
            'old_status' => $this->oldStatus,
            'new_status' => $this->newStatus,
            'message' => 'Status lamaran Anda untuk ' . $this->jobApplication->job->title . ' telah berubah dari ' . $this->oldStatus . ' menjadi ' . $this->newStatus,
            'link' => route('candidate.applications.show', $this->jobApplication->id),
        ];
    }
}
