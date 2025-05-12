<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\BroadcastMessage;
use App\Notifications\BaseNotification;

class ProfileCompletionReminder extends BaseNotification
{
    public function toDatabase($notifiable)
    {
        $missingItems = $this->data['missing_items'] ?? [];
        $missingItemsText = count($missingItems) > 0 ? implode(', ', $missingItems) : 'beberapa item';

        return [
            'title' => 'Lengkapi Profil Anda',
            'message' => "Profilmu masih belum lengkap ({$this->data['percentage']}%). Lengkapi {$missingItemsText} untuk meningkatkan peluang mendapatkan pekerjaan.",
            'action_url' => route('candidate.profile.edit'),
            'percentage' => $this->data['percentage'],
            'missing_items' => $missingItems,
        ];
    }
}
