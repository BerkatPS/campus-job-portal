<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Broadcasting\PrivateChannel;

class ForumMentioned extends BaseNotification
{
    /**
     * @var object
     */
    protected $post;

    /**
     * @var object
     */
    protected $mentionedBy;

    /**
     * @var object
     */
    protected $topic;

    /**
     * Create a new notification instance.
     *
     * @param mixed $notifiable
     * @param object $post
     * @param object $mentionedBy
     * @param object $topic
     * @param array $data
     */
    public function __construct($notifiable, $post, $mentionedBy, $topic, array $data = [])
    {
        parent::__construct($notifiable, $data);
        $this->post = $post;
        $this->mentionedBy = $mentionedBy;
        $this->topic = $topic;
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
            ->subject('Anda disebut dalam forum')
            ->greeting('Halo ' . $notifiable->name . '!')
            ->line($this->mentionedBy->name . ' menyebut Anda dalam postingan forum.')
            ->line('Topik: ' . $this->topic->title)
            ->action('Lihat Diskusi', $url)
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
            'title' => 'Anda Disebut dalam Forum',
            'message' => '@' . $this->mentionedBy->name . ' menyebut Anda dalam topik "' . $this->topic->title . '"',
            'action_url' => $url,
            'action_text' => 'Lihat Diskusi',
            'topic_id' => $this->topic->id,
            'post_id' => $this->post->id,
            'user_id' => $this->mentionedBy->id,
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

    public function toDatabase($notifiable)
    {
        // TODO: Implement toDatabase() method.
    }
}
