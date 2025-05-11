<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class NotificationController extends Controller
{
    /**
     * Display the notifications page
     *
     * @return \Inertia\Response
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

        return Inertia::render('Candidate/Notifications', [
            'notifications' => $notifications,
            'unreadCount' => $unreadCount,
        ]);
    }

    /**
     * Mark a notification as read
     *
     * @param string $notification
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
     */
    public function markAsRead($notification)
    {
        $user = Auth::user();
        $notificationModel = $user->notifications()->find($notification);

        if ($notificationModel) {
            $notificationModel->markAsRead();

            if (request()->wantsJson()) {
                return response()->json(['success' => true]);
            }

            return redirect()->back()->with('success', 'Notifikasi telah ditandai sebagai dibaca.');
        }

        if (request()->wantsJson()) {
            return response()->json(['success' => false], 404);
        }

        return redirect()->back()->with('error', 'Notifikasi tidak ditemukan.');
    }

    /**
     * Mark all notifications as read
     *
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
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
     *
     * @param string $notification
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
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
            return response()->json(['success' => false], 404);
        }

        return redirect()->back()->with('error', 'Notifikasi tidak ditemukan.');
    }

    /**
     * Get the number of unread notifications
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUnreadCount()
    {
        $unreadCount = Auth::user()->unreadNotifications()->count();
        return response()->json(['unreadCount' => $unreadCount]);
    }

    /**
     * Get the latest notifications
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
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
                    'created_at' => $notification->created_at,
                ];
            });

        return response()->json($notifications);
    }
}
