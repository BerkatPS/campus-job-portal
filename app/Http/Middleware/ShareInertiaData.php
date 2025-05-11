<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ShareInertiaData
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Share auth data with all Inertia responses
        Inertia::share([
            'auth' => function () use ($request) {
                $user = Auth::user();
                return $user ? [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'role' => $user->role,
                        'avatar' => $user->avatar,
                    ],
                ] : null;
            },

            // Share latest 5 notifications with all pages
            'latestNotifications' => function () {
                if (Auth::check()) {
                    return Auth::user()->notifications()
                        ->take(5)
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
                }
                return [];
            },

            // Share unread notifications count for badge display
            'unreadNotificationsCount' => function () {
                if (Auth::check()) {
                    return Auth::user()->unreadNotifications()->count();
                }
                return 0;
            },

            // Flash messages from session
            'flash' => function () use ($request) {
                return [
                    'success' => $request->session()->get('success'),
                    'error' => $request->session()->get('error'),
                    'warning' => $request->session()->get('warning'),
                    'info' => $request->session()->get('info'),
                ];
            },
        ]);

        return $next($request);
    }
}
