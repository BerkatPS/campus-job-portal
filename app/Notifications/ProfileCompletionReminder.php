<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Broadcasting\PrivateChannel;
use App\Notifications\BaseNotification;

class ProfileCompletionReminder extends BaseNotification
{
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
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        $missingItems = $this->data['missing_items'] ?? [];
        $missingItemsText = count($missingItems) > 0 ? implode(', ', $missingItems) : 'beberapa item';
        $url = route('candidate.profile.edit');

        return (new MailMessage)
            ->subject('Lengkapi Profil Anda')
            ->greeting('Halo ' . $notifiable->name . ',')
            ->line("Profil Anda masih belum lengkap ({$this->data['percentage']}%).")
            ->line("Lengkapi {$missingItemsText} untuk meningkatkan peluang mendapatkan pekerjaan.")
            ->action('Lengkapi Profil', $url)
            ->line('Tim rekrutmen akan lebih tertarik pada profil yang lengkap dan terperinci.');
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
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('App.Models.User.' . $this->notifiable->id);
    }

    /**
     * Get the database representation of the notification.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function toDatabase($notifiable)
    {
        $missingItems = $this->data['missing_items'] ?? [];
        $missingItemsText = count($missingItems) > 0 ? implode(', ', $missingItems) : 'beberapa item';
        $percentage = $this->data['percentage'] ?? 0;

        return [
            'title' => 'Lengkapi Profil Anda',
            'message' => "Profilmu masih belum lengkap ({$percentage}%). Lengkapi {$missingItemsText} untuk meningkatkan peluang mendapatkan pekerjaan.",
            'action_url' => route('candidate.profile.edit'),
            'action_text' => 'Lengkapi Profil',
            'icon' => 'user-circle',
            'color' => 'warning',
            'percentage' => $percentage,
            'missing_items' => $missingItems,
        ];
    }
}
