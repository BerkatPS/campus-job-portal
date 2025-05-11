<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Broadcasting\PrivateChannel;

abstract class BaseNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * @var mixed
     */
    protected $notifiable;

    /**
     * @var array
     */
    protected $data;

    /**
     * Create a new notification instance.
     *
     * @param mixed $notifiable
     * @param array $data
     */
    public function __construct($notifiable, array $data = [])
    {
        $this->notifiable = $notifiable;
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
        return ['database', 'broadcast'];
    }

    /**
     * Get the type of the notification for database storage.
     *
     * @return string
     */
    public function getType()
    {
        return class_basename($this);
    }

    /**
     * Get the notification's broadcast name.
     *
     * @return string
     */
    public function broadcastAs()
    {
        return $this->getType();
    }

    /**
     * Get the broadcast channel name.
     *
     * @return string|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('App.Models.User.' . $this->notifiable->id);
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
            'type' => $this->getType(),
            'data' => $this->toArray($notifiable)
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

    /**
     * Get the database representation of the notification.
     *
     * @param mixed $notifiable
     * @return array
     */
    abstract public function toDatabase($notifiable);
}
