<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user() ? array_merge($request->user()->toArray(), [
                    'has_resume' => $request->user()->candidateProfile && 
                        ($request->user()->candidateProfile->resume || $request->user()->candidateProfile->resume_name)
                ]) : null,
                'unreadNotificationsCount' => $request->user()
                    ? $request->user()->unreadNotifications()->count()
                    : 0,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            // Add CSRF token to prevent 419 errors
            'csrf_token' => csrf_token(),
            // Add the application URL for API requests
            'appUrl' => config('app.url'),
            // Add session information
            'session' => [
                'status' => fn () => $request->session()->get('status'),
            ],
            // Add latestNotifications and unreadMessagesCount
            'latestNotifications' => $request->user() 
                ? $request->user()->notifications()->latest()->take(5)->get() 
                : [],
            'unreadMessagesCount' => $request->user() && method_exists($request->user(), 'getUnreadMessagesCount')
                ? $request->user()->getUnreadMessagesCount()
                : 0,
        ]);
    }
}
