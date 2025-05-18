<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Broadcasting\PrivateChannel;
use App\Models\Job;

class JobPostingExpiringSoon extends BaseNotification
{
    /**
     * @var Job
     */
    protected $job;

    /**
     * @var int
     */
    protected $daysRemaining;

    /**
     * Create a new notification instance.
     *
     * @param mixed $notifiable
     * @param Job $job
     * @param int $daysRemaining
     * @param array $data
     */
    public function __construct($notifiable, Job $job, int $daysRemaining = 3, array $data = [])
    {
        parent::__construct($notifiable, $data);
        $this->job = $job;
        $this->daysRemaining = $daysRemaining;
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param mixed $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        $url = route('manager.jobs.edit', $this->job->id);
        $expiryDate = $this->job->expiry_date ? \Carbon\Carbon::parse($this->job->expiry_date)->format('d F Y') : 'Tidak tersedia';

        return (new MailMessage)
            ->subject('Lowongan Kerja Akan Segera Berakhir: ' . $this->job->title)
            ->greeting('Halo ' . $notifiable->name . ',')
            ->line('Lowongan kerja "' . $this->job->title . '" akan berakhir dalam ' . $this->daysRemaining . ' hari.')
            ->line('Tanggal berakhir: ' . $expiryDate)
            ->line('Jika Anda ingin memperpanjang lowongan ini, silakan perbaharui tanggal berakhirnya.')
            ->action('Perpanjang Lowongan', $url)
            ->line('Abaikan pesan ini jika Anda memang ingin lowongan ini berakhir.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        $url = route('manager.jobs.edit', $this->job->id);
        $expiryDate = $this->job->expiry_date ? \Carbon\Carbon::parse($this->job->expiry_date)->format('d/m/Y') : 'Tidak tersedia';

        return [
            'title' => 'Lowongan Akan Segera Berakhir',
            'message' => 'Lowongan "' . $this->job->title . '" akan berakhir pada ' . $expiryDate . ' (' . $this->daysRemaining . ' hari lagi)',
            'action_url' => $url,
            'action_text' => 'Perpanjang Lowongan',
            'job_id' => $this->job->id,
            'days_remaining' => $this->daysRemaining,
            'expiry_date' => $this->job->expiry_date,
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
