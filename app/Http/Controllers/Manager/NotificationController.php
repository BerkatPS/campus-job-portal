<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class NotificationController extends Controller
{
    /**
     * Display the notifications page
     */
    public function index()
    {
        $user = Auth::user();

        $notifications = $user->notifications()
            ->orderBy('created_at', 'desc')
            ->paginate(15)
            ->through(function ($notification) {
                return [
                    'id' => $notification->id,
                    'type' => $notification->type,
                    'data' => $notification->data,
                    'read_at' => $notification->read_at,
                    'created_at' => $notification->created_at,
                ];
            });

        $unreadCount = $user->unreadNotifications()->count();

        return Inertia::render('Manager/Notifications', [
            'notifications' => $notifications,
            'unreadCount' => $unreadCount,
        ]);
    }

    /**
     * Get latest notifications (API endpoint)
     */
    public function getLatest(Request $request)
    {
        $limit = $request->input('limit', 5);

        $notifications = Auth::user()->notifications()
            ->take($limit)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'type' => $notification->type,
                    'data' => $notification->data,
                    'read_at' => $notification->read_at,
                    'created_at' => $notification->created_at->toISOString(),
                ];
            });

        $unreadCount = Auth::user()->unreadNotifications()->count();

        return response()->json([
            'notifications' => $notifications,
            'unreadCount' => $unreadCount,
        ]);
    }

    /**
     * Mark a notification as read
     */
    public function markAsRead($notification)
    {
        $user = Auth::user();
        $notificationModel = $user->notifications()->find($notification);

        if ($notificationModel) {
            $notificationModel->markAsRead();

            // Return JSON for API endpoints
            if (request()->wantsJson()) {
                return response()->json(['success' => true]);
            }

            return redirect()->back()->with('success', 'Notifikasi telah ditandai sebagai dibaca.');
        }

        if (request()->wantsJson()) {
            return response()->json(['error' => 'Notification not found'], 404);
        }

        return redirect()->back()->with('error', 'Notifikasi tidak ditemukan.');
    }

    /**
     * Mark all notifications as read
     */
    public function markAllAsRead()
    {
        Auth::user()->unreadNotifications->markAsRead();

        if (request()->wantsJson()) {
            return response()->json(['success' => true]);
        }

        return redirect()->back()->with('success', 'Semua notifikasi telah ditandai sebagai dibaca.');
    }

    /**
     * Delete a notification
     */
    public function destroy($notification)
    {
        $user = Auth::user();
        $notificationModel = $user->notifications()->find($notification);

        if ($notificationModel) {
            $notificationModel->delete();

            if (request()->wantsJson()) {
                return response()->json(['success' => true]);
            }

            return redirect()->back()->with('success', 'Notifikasi telah dihapus.');
        }

        if (request()->wantsJson()) {
            return response()->json(['error' => 'Notification not found'], 404);
        }

        return redirect()->back()->with('error', 'Notifikasi tidak ditemukan.');
    }
}
