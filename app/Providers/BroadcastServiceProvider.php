<?php

namespace App\Providers;

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\ServiceProvider;

class BroadcastServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     */
    public function boot()
    {
        // Use both web and auth middleware to ensure proper authentication
        // web middleware provides session data, and auth ensures the user is authenticated
        Broadcast::routes(['middleware' => ['web', 'auth']]);
        
        // Register all channel authorization callbacks
        require base_path('routes/channels.php');
    }

    private function isPusherConfigured(): bool
    {
        $config = Config::get('broadcasting.connections.pusher');

        return !empty($config['key']) &&
            !empty($config['secret']) &&
            !empty($config['app_id']) &&
            !empty($config['app_id']);
    }
}
