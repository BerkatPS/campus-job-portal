<?php

namespace App\Providers;

use Illuminate\Broadcasting\BroadcastManager;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Illuminate\Support\Facades\Session;
use Illuminate\Auth\Access\Gate as GateImplementation;
use Illuminate\Support\Facades\Gate;
use Illuminate\Contracts\Foundation\Application;


class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(Gate::class, function (Application $app) {
            return new GateImplementation(
                $app,
                function () use ($app) {
                    return call_user_func($app->make('auth')->userResolver());
                }
            );
        });

    }



    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Set default string length for MySQL versions < 5.7.7
        Schema::defaultStringLength(191);

        // Share flash messages with all Inertia responses
        Inertia::share([
            'flash' => function () {
                return [
                    'success' => Session::get('success'),
                    'error' => Session::get('error'),
                    'warning' => Session::get('warning'),
                    'info' => Session::get('info'),
                ];
            },
        ]);

        // Share auth with all Inertia responses
        Inertia::share([
            'auth' => function () {
                return [
                    'user' => auth()->user() ? [
                        'id' => auth()->user()->id,
                        'name' => auth()->user()->name,
                        'email' => auth()->user()->email,
                        'role' => auth()->user()->role->name,
                        'role_slug' => auth()->user()->role->slug,
                        'avatar' => auth()->user()->avatar
                            ? asset('storage/' . auth()->user()->avatar)
                            : null,
                    ] : null,
                ];
            },
        ]);
    }
}
