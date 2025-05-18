<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Broadcasting\PrivateChannel;

class ForumTopicReplied extends BaseNotification
{
    /**
     * @var object
     */
    protected $topic;

    /**
     * @var object
     */
    protected $reply;

    /**
     * Create a new notification instance.
     *
     * @param mixed $notifiable
     * @param object $topic
     * @param object $reply
     * @param array $data
     */
    public function __construct($notifiable, $topic, $reply, array $data = [])
    {
        parent::__construct($notifiable, $data);
        $this->topic = $topic;
        $this->reply = $reply;
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param mixed $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        $url = route('public.forum.topic', $this->topic->id);

        return (new MailMessage)
            ->subject('Ada balasan baru di topik Anda')
            ->greeting('Halo ' . $notifiable->name . '!')
            ->line('Ada balasan baru di topik forum Anda "' . $this->topic->title . '".')
            ->line('Dari: ' . $this->reply->user->name)
            ->action('Lihat Balasan', $url)
            ->line('Terima kasih telah menggunakan aplikasi kami!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        $url = route('public.forum.topic', $this->topic->id);

        return [
            'title' => 'Ada Balasan Baru di Topik Anda',
            'message' => '@' . $this->reply->user->name . ' membalas topik Anda "' . $this->topic->title . '"',
            'action_url' => $url,
            'action_text' => 'Lihat Balasan',
            'topic_id' => $this->topic->id,
            'reply_id' => $this->reply->id,
            'reply_user_id' => $this->reply->user->id,
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
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('App.Models.User.' . $this->notifiable->id);
    }

    public function toDatabase($notifiable)
    {
        return $this->toArray($notifiable);
    }
}
