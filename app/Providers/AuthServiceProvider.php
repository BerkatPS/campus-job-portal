<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\User;
use App\Models\Company;
use App\Models\Job;
use App\Models\JobApplication;
use App\Models\Event;
use App\Policies\UserPolicy;
use App\Policies\CompanyPolicy;
use App\Policies\JobPolicy;
use App\Policies\ApplicationPolicy;
use App\Policies\EventPolicy;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        User::class => UserPolicy::class,
        Company::class => CompanyPolicy::class,
        Job::class => JobPolicy::class,
        JobApplication::class => ApplicationPolicy::class,
        Event::class => EventPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        // Define gates for roles
        Gate::define('admin', function (User $user) {
            return $user->isAdmin();
        });

        Gate::define('manager', function (User $user) {
            return $user->isManager();
        });

        Gate::define('candidate', function (User $user) {
            return $user->isCandidate();
        });

        // Grant all abilities to admins
        Gate::before(function (User $user, $ability) {
            if ($user->isAdmin() && !in_array($ability, ['updateRole', 'toggleActive', 'delete'])) {
                return true;
            }
        });
    }
}
