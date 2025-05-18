<?php

use App\Http\Controllers\Candidate\PortfolioController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\PasswordResetController;
use App\Http\Controllers\Auth\EmailVerificationController;

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\CompanyController;
use App\Http\Controllers\Admin\JobController as AdminJobController;
use App\Http\Controllers\Admin\ManagerController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\FormBuilderController;
use App\Http\Controllers\Admin\HiringStageController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\NotificationController;

use App\Http\Controllers\Manager\DashboardController as ManagerDashboardController;
use App\Http\Controllers\Manager\JobController as ManagerJobController;
use App\Http\Controllers\Manager\ApplicationController as ManagerApplicationController;
use App\Http\Controllers\Manager\EventController;
use App\Http\Controllers\Manager\NotificationController as ManagerNotificationController;
use App\Http\Controllers\Manager\ProfileController;
use App\Http\Controllers\Manager\TeamController;
use App\Http\Controllers\Manager\CompanyProfileController;
use App\Http\Controllers\Manager\AnalyticsController;

// Candidate Controllers
use App\Http\Controllers\Candidate\DashboardController as CandidateDashboardController;
use App\Http\Controllers\Candidate\JobController as CandidateJobController;
use App\Http\Controllers\Candidate\ApplicationController as CandidateApplicationController;
use App\Http\Controllers\Candidate\NotificationController as CandidateNotificationController;
use App\Http\Controllers\Candidate\ProfileController as CandidateProfileController;
use App\Http\Controllers\Candidate\CompanyReviewController;

// Public Controllers
use App\Http\Controllers\Public\JobController as PublicJobController;
use App\Http\Controllers\Public\ForumController;
use App\Http\Controllers\Public\CompanyController as PublicCompanyController;

// Home page
Route::get('/', function () {
    return Inertia::render('Public/Home');
})->name('public.home');

// Public pages
Route::get('/about', function () {
    return Inertia::render('Public/About');
})->name('public.about');

// Make sure broadcasting auth route is properly registered with web middleware
Broadcast::routes(['middleware' => ['web', 'auth']]);

Route::fallback(function () {
    return Inertia::render('Errors/404');
});

Route::get('/contact', function () {
    return Inertia::render('Public/Contact');
})->name('public.contact');

// Forum pages (public layout, mahasiswa only)
Route::middleware('auth')->group(function () {
    Route::get('/forum', [ForumController::class, 'index'])->name('public.forum.index');
    Route::get('/forum/kategori/{category}', [ForumController::class, 'category'])->name('public.forum.category');
    Route::get('/forum/topik/{topic}', [ForumController::class, 'topic'])->name('public.forum.topic');
    Route::post('/forum/topik', [ForumController::class, 'storeTopic'])->name('public.forum.store.topic');
    Route::post('/forum/postingan', [ForumController::class, 'storePost'])->name('public.forum.store.post');
    Route::post('/forum/postingan/{post}/like', [ForumController::class, 'toggleLike'])->name('public.forum.toggle.like');

    Route::get('/notifications/latest', [App\Http\Controllers\NotificationController::class, 'getLatest'])
        ->name('notifications.latest');
    Route::post('/notifications/{id}/read', [App\Http\Controllers\NotificationController::class, 'markAsRead'])
        ->name('notifications.read');
    Route::post('/notifications/mark-all-read', [App\Http\Controllers\NotificationController::class, 'markAllAsRead'])
        ->name('notifications.mark-all-read');
    Route::get('/notifications/unread-count', [App\Http\Controllers\NotificationController::class, 'getUnreadCount'])
        ->name('notifications.unread-count');
});

// Public job listings
Route::get('/jobs', [PublicJobController::class, 'index'])->name('public.jobs.index');
Route::get('/jobs/{job}', [PublicJobController::class, 'show'])->name('public.jobs.show');

// Companies pages
Route::get('/companies', [PublicCompanyController::class, 'index'])->name('public.companies.index');
Route::get('/companies/{company}', [PublicCompanyController::class, 'show'])->name('public.companies.show');

// Authentication routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [LoginController::class, 'login']);
    Route::get('/register', [LoginController::class, 'showRegistrationForm'])->name('register');
    Route::post('/register', [LoginController::class, 'register']);

    Route::get('/password/reset', [PasswordResetController::class, 'showLinkRequestForm'])->name('password.request');
    Route::post('/password/email', [PasswordResetController::class, 'sendResetLinkEmail'])->name('password.email');
    Route::get('/password/reset/{token}', [PasswordResetController::class, 'showResetForm'])->name('password.reset');
    Route::post('/password/reset', [PasswordResetController::class, 'reset'])->name('password.update');
});

Route::middleware('auth')->group(function () {
    // Logout
    Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

    // Email verification
    Route::get('/email/verify', [EmailVerificationController::class, 'show'])->name('verification.notice');
    Route::get('/email/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])->name('verification.verify');
    Route::post('/email/resend', [EmailVerificationController::class, 'resend'])->name('verification.resend');

    // Redirect based on role
    Route::get('/dashboard', function () {
        $user = auth()->user();

        if ($user->isAdmin()) {
            return redirect()->route('admin.dashboard');
        } elseif ($user->isManager()) {
            return redirect()->route('manager.dashboard');
        } else {
            return redirect()->route('candidate.dashboard');
        }
    })->name('dashboard');

    // Admin routes
    Route::middleware(['auth', \App\Http\Middleware\AdminMiddleware::class])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

        // Companies management
        Route::resource('companies', CompanyController::class);
        Route::post('/companies/{company}/toggle-active', [CompanyController::class, 'toggleActive'])->name('companies.toggle-active');
        Route::get('/companies/{company}/managers', [CompanyController::class, 'manageManagers'])->name('companies.managers');
        Route::put('/companies/{company}/managers', [CompanyController::class, 'updateManagers'])->name('companies.update-managers');

        // Jobs management
        Route::resource('jobs', AdminJobController::class);
        Route::put('/jobs/{job}/toggle-active', [AdminJobController::class, 'toggleActive'])->name('jobs.toggle-active');

        // Managers management
        Route::resource('managers', ManagerController::class);

        // Users management
        Route::resource('users', UserController::class);
        Route::put('/users/{user}/toggle-active', [UserController::class, 'toggleActive'])->name('users.toggle-active');

        // Roles management
        Route::resource('roles', RoleController::class);

        // Form builder
        Route::resource('form-builder', \App\Http\Controllers\Admin\FormBuilderController::class)->parameters([
            'form-builder' => 'formSection'
        ]);
        Route::patch('/form-builder/{formSection}/toggle', [\App\Http\Controllers\Admin\FormBuilderController::class, 'toggle'])->name('form-builder.toggle');
        Route::post('/form-builder/{formSection}/fields', [\App\Http\Controllers\Admin\FormBuilderController::class, 'storeField'])->name('form-builder.fields.store');
        Route::put('/form-builder/{formSection}/fields/{formField}', [\App\Http\Controllers\Admin\FormBuilderController::class, 'updateField'])->name('form-builder.fields.update');
        Route::delete('/form-builder/{formSection}/fields/{formField}', [\App\Http\Controllers\Admin\FormBuilderController::class, 'destroyField'])->name('form-builder.fields.destroy');
        Route::put('/form-builder/reorder', [\App\Http\Controllers\Admin\FormBuilderController::class, 'reorderSections'])->name('form-builder.reorder');
        Route::put('/form-builder/{formSection}/fields/reorder', [\App\Http\Controllers\Admin\FormBuilderController::class, 'reorderFields'])->name('form-builder.fields.reorder');

        // Form sections (existing routes)
        Route::resource('form-sections', FormBuilderController::class);
        Route::post('/form-sections/{formSection}/fields', [FormBuilderController::class, 'storeField'])->name('form-sections.fields.store');
        Route::put('/form-sections/{formSection}/fields/{formField}', [FormBuilderController::class, 'updateField'])->name('form-sections.fields.update');
        Route::delete('/form-sections/{formSection}/fields/{formField}', [FormBuilderController::class, 'destroyField'])->name('form-sections.fields.destroy');
        Route::put('/form-sections/reorder', [FormBuilderController::class, 'reorderSections'])->name('form-sections.reorder');
        Route::put('/form-sections/{formSection}/fields/reorder', [FormBuilderController::class, 'reorderFields'])->name('form-sections.fields.reorder');

        // Hiring stages
        Route::resource('hiring-stages', HiringStageController::class);
        Route::put('/hiring-stages/reorder', [HiringStageController::class, 'reorder'])->name('hiring-stages.reorder');

        // Notifications
        Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
        Route::post('/notifications/{id}/mark-as-read', [NotificationController::class, 'markAsRead'])->name('notifications.mark-as-read');
        Route::post('/notifications/mark-all-as-read', [NotificationController::class, 'markAllAsRead'])->name('notifications.mark-all-as-read');
        Route::delete('/notifications/{id}', [NotificationController::class, 'destroy'])->name('notifications.destroy');
        Route::get('/notifications/unread-count', [NotificationController::class, 'getUnreadCount'])->name('notifications.unread-count');
        Route::get('/notifications/latest', [NotificationController::class, 'getLatest'])->name('notifications.latest');
    });

    // Manager routes
    Route::middleware(['auth', \App\Http\Middleware\ManagerMiddleware::class])->prefix('manager')->name('manager.')->group(function () {
            Route::get('/dashboard', [ManagerDashboardController::class, 'index'])->name('dashboard');

            // Jobs management for manager
            Route::resource('jobs', ManagerJobController::class);
            Route::put('/jobs/{job}/toggle-active', [ManagerJobController::class, 'toggleActive'])->name('jobs.toggle-active');

            // Applications management
            Route::resource('applications', ManagerApplicationController::class);
            Route::put('/applications/{application}/accept', [ManagerApplicationController::class, 'accept'])->name('applications.accept');
            Route::put('/applications/{application}/reject', [ManagerApplicationController::class, 'reject'])->name('applications.reject');
            Route::put('/applications/{application}/status', [ManagerApplicationController::class, 'updateStatus'])->name('applications.update-status');
            Route::put('/applications/{application}/stage', [ManagerApplicationController::class, 'updateStage'])->name('applications.update-stage');
            Route::put('/applications/{application}/toggle-favorite', [ManagerApplicationController::class, 'toggleFavorite'])->name('applications.toggle-favorite');
            Route::put('/applications/{application}/notes', [ManagerApplicationController::class, 'updateNotes'])->name('applications.update-notes');
            Route::get('/applications/{application}/download-cv', [ManagerApplicationController::class, 'downloadCV'])->name('applications.download-cv');
            Route::get('/applications-kanban', [ManagerApplicationController::class, 'kanbanView'])->name('applications.kanban');
            Route::get('/applications-export', [ManagerApplicationController::class, 'export'])->name('applications.export');

            // Events/Interviews management
            Route::resource('events', EventController::class);
            Route::post('/events', [EventController::class, 'store'])->middleware(\App\Http\Middleware\ManagerMiddleware::class)->name('events.store');
            Route::put('/events/{event}/status', [EventController::class, 'updateStatus'])->name('events.update-status');
            Route::post('/events/{event}/status', [EventController::class, 'updateStatus'])->name('events.update-status-post');
            Route::get('/calendar', [EventController::class, 'calendar'])->name('calendar');

            // Profile management
            Route::get('/profile', [ProfileController::class, 'index'])->name('profile.index');
            Route::get('/profile/edit', [ProfileController::class, 'edit'])->name('profile.edit');
            Route::get('/profile/security', [ProfileController::class, 'security'])->name('profile.security');
            Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');
            Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.update-password');
            Route::post('/profile/avatar', [ProfileController::class, 'updateAvatar'])->name('profile.update-avatar');

            // Team management
            Route::get('/team', [TeamController::class, 'index'])->name('team.index');
            Route::get('/team/{id}', [TeamController::class, 'show'])->name('team.show');
            Route::get('/team/{id}/edit', [TeamController::class, 'edit'])->name('team.edit');
            Route::put('/team/{id}', [TeamController::class, 'update'])->name('team.update');

            // Company Profile management
            Route::get('/company-profile', [CompanyProfileController::class, 'index'])->name('company-profile.index');
            Route::get('/company-profile/edit', [CompanyProfileController::class, 'edit'])->name('company-profile.edit');
            Route::post('/company-profile', [CompanyProfileController::class, 'update'])->name('company-profile.update');

            // Analytics
            Route::get('/analytics', [AnalyticsController::class, 'index'])->name('analytics.index');
            Route::get('/analytics/data', [AnalyticsController::class, 'getAnalyticsData'])->name('analytics.data');
            Route::get('/analytics/export', [AnalyticsController::class, 'export'])->name('analytics.export');

            // Messages system for manager


            // Notifications
            Route::get('/notifications', [ManagerNotificationController::class, 'index'])->name('notifications.index');
            Route::post('/notifications/{notification}/mark-as-read', [ManagerNotificationController::class, 'markAsRead'])->name('notifications.mark-as-read');
            Route::post('/notifications/mark-all-as-read', [ManagerNotificationController::class, 'markAllAsRead'])->name('notifications.mark-all-as-read');
            Route::delete('/notifications/{notification}', [ManagerNotificationController::class, 'destroy'])->name('notifications.destroy');
            Route::get('/notifications/unread-count', [ManagerNotificationController::class, 'getUnreadCount'])->name('notifications.unread-count');
            Route::get('/notifications/latest', [ManagerNotificationController::class, 'getLatest'])->name('notifications.latest');
        });

    // Candidate routes
    Route::middleware(['auth', \App\Http\Middleware\CandidateMiddleware::class])->prefix('candidate')->name('candidate.')->group(function () {
        Route::get('/dashboard', [CandidateDashboardController::class, 'index'])->name('dashboard');

        // Company Review routes
        Route::get('/applications/{jobApplication}/review/create', [CompanyReviewController::class, 'create'])->name('reviews.create');
        Route::post('/reviews', [CompanyReviewController::class, 'store'])->name('reviews.store');
        Route::get('/reviews/{review}/edit', [CompanyReviewController::class, 'edit'])->name('reviews.edit');
        Route::put('/reviews/{review}', [CompanyReviewController::class, 'update'])->name('reviews.update');
        Route::get('/reviews/{review}', [CompanyReviewController::class, 'show'])->name('reviews.show');
        Route::delete('/reviews/{review}', [CompanyReviewController::class, 'destroy'])->name('reviews.destroy');

        // Other candidate routes
        // Jobs
        Route::get('/jobs', [CandidateJobController::class, 'index'])->name('jobs.index');
        Route::get('/jobs/{job}', [CandidateJobController::class, 'show'])->name('jobs.show');
        Route::get('/jobs/{job}/apply', [CandidateApplicationController::class, 'create'])->name('jobs.apply');
        Route::post('/jobs/{job}/apply', [CandidateApplicationController::class, 'store'])->name('jobs.submit-application');

        // Notifications
        Route::get('/notifications', [CandidateNotificationController::class, 'index'])->name('notifications.index');
        Route::get('/notifications/unread-count', [CandidateNotificationController::class, 'getUnreadCount'])->name('notifications.unread-count');
        Route::get('/notifications/latest', [CandidateNotificationController::class, 'getLatest'])->name('notifications.latest');
        Route::post('/notifications/{id}/read', [CandidateNotificationController::class, 'markAsRead'])->name('notifications.read');
        Route::post('/notifications/mark-all-as-read', [CandidateNotificationController::class, 'markAllAsRead'])->name('notifications.mark-all-as-read');

        // Applications
        Route::get('/applications', [CandidateApplicationController::class, 'index'])->name('applications.index');
        Route::get('/applications/{application}', [CandidateApplicationController::class, 'show'])->name('applications.show');
        Route::delete('/applications/{application}', [CandidateApplicationController::class, 'withdraw'])->name('applications.withdraw');

        // Events/Interviews for candidate
        Route::get('/events', [CandidateApplicationController::class, 'events'])->name('events.index');
        Route::get('/events/{eventId}', [CandidateApplicationController::class, 'showEvent'])->name('events.show');
        Route::post('/events/{eventId}/confirm', [CandidateApplicationController::class, 'confirmEvent'])->name('events.confirm');
        Route::post('/events/{eventId}/cancel', [CandidateApplicationController::class, 'cancelEvent'])->name('events.cancel');
        Route::post('/events/{eventId}/add-note', [CandidateApplicationController::class, 'addEventNote'])->name('events.add-note');

        // Profile
        Route::get('/profile', [CandidateProfileController::class, 'index'])->name('profile.index');
        Route::get('/profile/edit', [CandidateProfileController::class, 'edit'])->name('profile.edit');
        Route::put('/profile', [CandidateProfileController::class, 'update'])->name('profile.update');
        Route::post('/profile/resume', [CandidateProfileController::class, 'uploadResume'])->name('profile.upload-resume');

        // Portfolio routes
        Route::prefix('portfolio')->name('portfolio.')->group(function () {
            Route::get('/', [PortfolioController::class, 'index'])->name('index');
            Route::get('/create', [PortfolioController::class, 'create'])->name('create');
            Route::post('/', [PortfolioController::class, 'store'])->name('store');
            Route::get('/{portfolioItem}', [PortfolioController::class, 'show'])->name('show');
            Route::get('/{portfolioItem}/edit', [PortfolioController::class, 'edit'])->name('edit');
            Route::put('/{portfolioItem}', [PortfolioController::class, 'update'])->name('update');
            Route::delete('/{portfolioItem}', [PortfolioController::class, 'destroy'])->name('destroy');
            Route::post('/update-order', [PortfolioController::class, 'updateOrder'])->name('update-order');
            Route::post('/{portfolioItem}/toggle-featured', [PortfolioController::class, 'toggleFeatured'])->name('toggle-featured');
        });

        // Resume Enhancer routes
        Route::prefix('resume-enhancer')->name('resume-enhancer.')->group(function () {
            Route::get('/', [App\Http\Controllers\Candidate\ResumeEnhancerController::class, 'index'])->name('index');
            Route::get('/create', [App\Http\Controllers\Candidate\ResumeEnhancerController::class, 'create'])->name('create');
            Route::post('/', [App\Http\Controllers\Candidate\ResumeEnhancerController::class, 'store'])->name('store');
            Route::get('/{resumeVersion}', [App\Http\Controllers\Candidate\ResumeEnhancerController::class, 'show'])->name('show');
            Route::get('/{resumeVersion}/edit', [App\Http\Controllers\Candidate\ResumeEnhancerController::class, 'edit'])->name('edit');
            Route::put('/{resumeVersion}', [App\Http\Controllers\Candidate\ResumeEnhancerController::class, 'update'])->name('update');
            Route::delete('/{resumeVersion}', [App\Http\Controllers\Candidate\ResumeEnhancerController::class, 'destroy'])->name('destroy');
            Route::post('/{resumeVersion}/enhance', [App\Http\Controllers\Candidate\ResumeEnhancerController::class, 'enhance'])->name('enhance');
            Route::get('/enhancement/{enhancement}', [App\Http\Controllers\Candidate\ResumeEnhancerController::class, 'showEnhancement'])->name('enhancement');
            Route::post('/enhancement/{enhancement}/apply', [App\Http\Controllers\Candidate\ResumeEnhancerController::class, 'applyEnhancement'])->name('apply-enhancement');
            Route::post('/import-from-profile', [App\Http\Controllers\Candidate\ResumeEnhancerController::class, 'importFromProfile'])->name('import-from-profile');
            Route::post('/{resumeVersion}/set-as-current', [App\Http\Controllers\Candidate\ResumeEnhancerController::class, 'setAsCurrent'])->name('set-as-current');
        });

        // Add this to routes/web.php for testing
        Route::post('/debug-resume', function (Request $request) {
            return response()->json([
                'hasFile' => $request->hasFile('resume'),
                'allFiles' => $request->allFiles(),
                'all' => $request->all()
            ]);
        })->middleware('auth')->name('debug.resume');
    });
});

Route::get('/test-notification', function () {
    $user = auth()->user();

    return 'Notification sent!';
});
