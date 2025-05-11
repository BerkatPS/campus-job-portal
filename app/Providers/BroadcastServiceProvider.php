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
        Broadcast::routes();
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
