<?php

namespace App\Listeners;

use Illuminate\Notifications\Events\NotificationSent;
use Illuminate\Support\Facades\Log;

class LogNotification
{
    /**
     * Handle the event.
     *
     * @param  NotificationSent  $event
     * @return void
     */
    public function handle(NotificationSent $event)
    {
        $notificationType = class_basename($event->notification);

        Log::info("Notification sent: {$notificationType}", [
            'channel' => $event->channel,
            'notifiable_id' => $event->notifiable->id ?? null,
            'notifiable_type' => get_class($event->notifiable),
        ]);
    }
}
