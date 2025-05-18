<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Broadcasting\PrivateChannel;

class WelcomeNotification extends BaseNotification
{
    /**
     * Create a new notification instance.
     *
     * @param mixed $notifiable The user receiving the notification
     * @param array $data Additional data
     */
    public function __construct($notifiable, array $data = [])
    {
        parent::__construct($notifiable, $data);
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param mixed $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        $roleDashboard = '';
        $roleSpecificMessage = '';

        if ($notifiable->isAdmin()) {
            $roleDashboard = route('admin.dashboard');
            $roleSpecificMessage = 'Sebagai Admin, Anda memiliki akses ke semua fitur platform untuk mengelola pengguna, perusahaan, dan lowongan kerja.';
        } elseif ($notifiable->isManager()) {
            $roleDashboard = route('manager.dashboard');
            $roleSpecificMessage = 'Sebagai Manajer, Anda dapat mengelola lowongan kerja perusahaan Anda dan mengelola proses rekrutmen.';
        } else {
            $roleDashboard = route('candidate.dashboard');
            $roleSpecificMessage = 'Sebagai Kandidat, Anda dapat menemukan dan melamar pekerjaan yang sesuai dengan keahlian dan minat Anda.';
        }

        return (new MailMessage)
            ->subject('Selamat Datang di Portal Lowongan Kerja Kampus')
            ->greeting('Selamat datang, ' . $notifiable->name . '!')
            ->line('Terima kasih telah bergabung dengan Portal Lowongan Kerja Kampus, tempat terbaik untuk menemukan pekerjaan dan talenta berkualitas.')
            ->line($roleSpecificMessage)
            ->line('Berikut beberapa tips untuk memulai:')
            ->line('1. Lengkapi profil Anda untuk meningkatkan visibilitas')
            ->line('2. Jelajahi fitur-fitur yang tersedia di dasbor Anda')
            ->line('3. Hubungi kami jika Anda memiliki pertanyaan')
            ->action('Buka Dashboard', $roleDashboard)
            ->line('Kami senang Anda bergabung dengan komunitas kami!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        $roleDashboard = '';

        if ($notifiable->isAdmin()) {
            $roleDashboard = route('admin.dashboard');
        } elseif ($notifiable->isManager()) {
            $roleDashboard = route('manager.dashboard');
        } else {
            $roleDashboard = route('candidate.dashboard');
        }
        
        return [
            'title' => 'Selamat Datang!',
            'message' => 'Selamat datang di Portal Lowongan Kerja Kampus, ' . $notifiable->name . '! Jelajahi fitur-fitur yang tersedia untuk memaksimalkan pengalaman Anda.',
            'action_url' => $roleDashboard,
            'action_text' => 'Buka Dashboard',
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
