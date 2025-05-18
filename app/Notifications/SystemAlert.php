<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Broadcasting\PrivateChannel;

class SystemAlert extends BaseNotification
{
    /**
     * @var string
     */
    protected $alert_title;

    /**
     * @var string
     */
    protected $alert_message;

    /**
     * @var string|null
     */
    protected $alert_level;

    /**
     * @var string|null
     */
    protected $link;

    /**
     * Create a new notification instance.
     *
     * @param mixed $notifiable
     * @param string $alert_title
     * @param string $alert_message
     * @param string|null $alert_level 'info', 'warning', 'critical'
     * @param string|null $link
     * @param array $data
     */
    public function __construct($notifiable, string $alert_title, string $alert_message, string $alert_level = 'info', string $link = null, array $data = [])
    {
        parent::__construct($notifiable, $data);
        $this->alert_title = $alert_title;
        $this->alert_message = $alert_message;
        $this->alert_level = $alert_level;
        $this->link = $link;
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param mixed $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        $mail = (new MailMessage)
            ->subject($this->alert_level === 'critical' ? 'PENTING: ' . $this->alert_title : $this->alert_title)
            ->greeting('Halo ' . $notifiable->name . ',')
            ->line($this->alert_message);
            
        if ($this->link) {
            $mail->action('Selengkapnya', $this->link);
        }
            
        return $mail->line('Terima kasih atas perhatian Anda.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            'title' => $this->alert_title,
            'message' => $this->alert_message,
            'action_url' => $this->link,
            'action_text' => $this->link ? 'Selengkapnya' : null,
            'alert_level' => $this->alert_level,
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
