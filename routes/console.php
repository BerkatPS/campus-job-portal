<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use App\Models\User;
use App\Models\Role;

/*
|--------------------------------------------------------------------------
| Console Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of your Closure based console
| commands. Each Closure is bound to a command instance allowing a
| simple approach to interacting with each command's IO methods.
|
*/

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Create default admin user
Artisan::command('campus:create-admin {name} {email} {password}', function (string $name, string $email, string $password) {
    $adminRole = Role::where('slug', 'admin')->first();

    if (!$adminRole) {
        $this->error('Admin role not found. Please run migrations and seeders first.');
        return;
    }

    $user = User::where('email', $email)->first();

    if ($user) {
        $this->error('User with this email already exists.');
        return;
    }

    $admin = User::create([
        'name' => $name,
        'email' => $email,
        'password' => bcrypt($password),
        'role_id' => $adminRole->id,
        'is_active' => true,
    ]);

    $this->info("Admin user created successfully: {$name} ({$email})");
})->purpose('Create a new admin user for the campus job portal');

// Generate application report
Artisan::command('campus:report-applications {company_id} {--start=} {--end=}', function (int $companyId, string $start = null, string $end = null) {
    $company = \App\Models\Company::find($companyId);

    if (!$company) {
        $this->error('Company not found.');
        return;
    }

    $startDate = $start ? \Carbon\Carbon::parse($start) : \Carbon\Carbon::now()->subMonth();
    $endDate = $end ? \Carbon\Carbon::parse($end) : \Carbon\Carbon::now();

    $this->info("Generating application report for {$company->name}...");
    $this->info("Period: {$startDate->format('Y-m-d')} to {$endDate->format('Y-m-d')}");

    // Dispatch job
    \App\Jobs\GenerateApplicationReport::dispatch(
        $company,
        \App\Models\User::where('email', 'admin@example.com')->first() ?? \App\Models\User::first(),
        $startDate->format('Y-m-d'),
        $endDate->format('Y-m-d')
    );

    $this->info('Report generation job dispatched. The report will be available in the storage/app/public/reports directory when complete.');
})->purpose('Generate an application report for a company');

// Clean up expired jobs
Artisan::command('campus:cleanup-expired-jobs', function () {
    $count = \App\Models\Job::where('submission_deadline', '<', now())
        ->where('is_active', true)
        ->update(['is_active' => false]);

    $this->info("{$count} expired jobs have been deactivated.");
})->purpose('Deactivate expired jobs');
