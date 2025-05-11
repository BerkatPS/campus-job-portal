<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class NotificationService
{
    /**
     * Send a notification to a user
     *
     * @param User $user
     * @param string $notificationClass
     * @param mixed $notifiable
     * @param array $data
     * @return bool
     */
    public function sendNotification(User $user, string $notificationClass, $notifiable, array $data = [])
    {
        try {
            if (!class_exists($notificationClass)) {
                Log::error("Notification class {$notificationClass} not found");
                return false;
            }

            // Create notification instance
            $notification = new $notificationClass($notifiable, $data);

            // Queue the notification for sending
            $user->notify($notification);

            Log::info("Notification queued", [
                'user_id' => $user->id,
                'notification_type' => class_basename($notificationClass)
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error("Failed to send notification: " . $e->getMessage(), [
                'user_id' => $user->id,
                'notification_type' => class_basename($notificationClass),
                'exception' => $e->getTraceAsString()
            ]);

            return false;
        }
    }


    /**
     * Send notification to company managers
     *
     * @param int $companyId
     * @param string $notificationClass
     * @param mixed $notifiable
     * @param array $data
     * @return array
     */
    public function notifyCompanyManagers(int $companyId, string $notificationClass, $notifiable, array $data = [])
    {
        // Get company managers
        $managers = User::whereHas('managedCompanies', function($query) use ($companyId) {
            $query->where('companies.id', $companyId);
        })->get();

        $results = [];
        foreach ($managers as $manager) {
            $results[$manager->id] = $this->sendNotification($manager, $notificationClass, $notifiable, $data);
        }

        return $results;
    }

    /**
     * Send notification to job applicant
     *
     * @param int $userId
     * @param string $notificationClass
     * @param mixed $notifiable
     * @param array $data
     * @return bool
     */
    public function notifyApplicant(int $userId, string $notificationClass, $notifiable, array $data = [])
    {
        $user = User::find($userId);

        if (!$user) {
            Log::error("User not found", ['user_id' => $userId]);
            return false;
        }

        return $this->sendNotification($user, $notificationClass, $notifiable, $data);
    }
}
