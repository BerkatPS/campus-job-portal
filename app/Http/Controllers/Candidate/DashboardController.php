<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use App\Models\Job;
use App\Models\JobApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the candidate dashboard.
     */
    public function index()
    {
        // Get user data
        $user = Auth::user();
        $user->load('candidateProfile');

        // Get counts for dashboard stats
        $applicationsCount = JobApplication::where('user_id', Auth::id())->count();

        $pendingApplicationsCount = JobApplication::where('user_id', Auth::id())
            ->whereHas('status', function($query) {
                $query->where('slug', 'pending');
            })
            ->count();

        $interviewsCount = JobApplication::where('user_id', Auth::id())
            ->whereHas('events', function($query) {
                $query->where('type', 'interview')
                    ->where('start_time', '>=', now());
            })
            ->count();

        // Get recent applications
        $recentApplications = JobApplication::where('user_id', Auth::id())
            ->with(['job.company', 'status', 'currentStage'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function($application) {
                return [
                    'id' => $application->id,
                    'job' => [
                        'id' => $application->job->id,
                        'title' => $application->job->title,
                        'company' => [
                            'name' => $application->job->company->name,
                            'logo' => $application->job->company->logo ? asset('storage/' . $application->job->company->logo) : null,
                        ],
                    ],
                    'status' => [
                        'name' => $application->status->name,
                        'color' => $application->status->color,
                    ],
                    'current_stage' => $application->currentStage ? [
                        'name' => $application->currentStage->name,
                        'color' => $application->currentStage->color,
                    ] : null,
                    'created_at' => $application->created_at->format('M d, Y'),
                ];
            });

        // Get recommended jobs
        $recommendedJobs = Job::with('company')
            ->where('is_active', true)
            ->where('submission_deadline', '>=', now())
            ->latest()
            ->take(5)
            ->get()
            ->map(function($job) {
                return [
                    'id' => $job->id,
                    'title' => $job->title,
                    'company' => [
                        'name' => $job->company->name,
                        'logo' => $job->company->logo ? asset('storage/' . $job->company->logo) : null,
                    ],
                    'location' => $job->location,
                    'job_type' => $job->job_type,
                    'experience_level' => $job->experience_level,
                    'submission_deadline' => $job->submission_deadline->format('M d, Y'),
                ];
            });

        // Get upcoming interviews/events
        $upcomingEvents = Auth::user()->jobApplications()
            ->with(['job', 'events' => function($query) {
                $query->where('start_time', '>=', now())
                    ->orderBy('start_time');
            }])
            ->whereHas('events', function($query) {
                $query->where('start_time', '>=', now());
            })
            ->get()
            ->pluck('events')
            ->flatten()
            ->take(5)
            ->map(function($event) {
                return [
                    'id' => $event->id,
                    'title' => $event->title,
                    'job_title' => $event->job->title,
                    'company_name' => $event->job->company->name,
                    'start_time' => $event->start_time->format('M d, Y h:i A'),
                    'location' => $event->location,
                    'meeting_link' => $event->meeting_link,
                    'type' => $event->type,
                ];
            });

        // Hitung persentase kelengkapan profil
        $profileFields = [
            $user->avatar,
            $user->candidateProfile->phone,
            $user->candidateProfile->date_of_birth,
            $user->candidateProfile->address,
            $user->candidateProfile->education,
            $user->candidateProfile->experience,
            $user->candidateProfile->skills,
            $user->candidateProfile->resume,
            $user->candidateProfile->linkedin,
            $user->candidateProfile->website
        ];
        
        $filledFields = array_filter($profileFields, function($field) {
            return !is_null($field) && $field !== '';
        });
        
        $profileCompletionPercentage = count($filledFields) / count($profileFields) * 100;
        
        // Dapatkan item yang belum lengkap
        $missingItems = [];
        if (!$user->avatar) $missingItems[] = 'Foto Profil';
        if (!$user->candidateProfile->phone) $missingItems[] = 'Nomor Telepon';
        if (!$user->candidateProfile->date_of_birth) $missingItems[] = 'Tanggal Lahir';
        if (!$user->candidateProfile->address) $missingItems[] = 'Alamat';
        if (!$user->candidateProfile->education) $missingItems[] = 'Pendidikan';
        if (!$user->candidateProfile->experience) $missingItems[] = 'Pengalaman';
        if (!$user->candidateProfile->skills) $missingItems[] = 'Keterampilan';
        if (!$user->candidateProfile->resume) $missingItems[] = 'Resume';
        if (!$user->candidateProfile->linkedin) $missingItems[] = 'LinkedIn';
        if (!$user->candidateProfile->website) $missingItems[] = 'Website';

        return Inertia::render('Candidate/Dashboard', [
            'stats' => [
                'applications' => $applicationsCount,
                'pending_applications' => $pendingApplicationsCount,
                'interviews' => $interviewsCount,
            ],
            'recentApplications' => $recentApplications,
            'recommendedJobs' => $recommendedJobs,
            'upcomingEvents' => $upcomingEvents,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'nim' => $user->nim,
                'avatar' => $user->avatar ? asset('storage/' . $user->avatar) : null,
            ],
            'profile' => [
                'date_of_birth' => $user->candidateProfile->date_of_birth ? $user->candidateProfile->date_of_birth->format('Y-m-d') : null,
                'phone' => $user->candidateProfile->phone,
                'address' => $user->candidateProfile->address,
                'education' => $user->candidateProfile->education,
                'experience' => $user->candidateProfile->experience,
                'skills' => $user->candidateProfile->skills,
                'linkedin' => $user->candidateProfile->linkedin,
                'website' => $user->candidateProfile->website,
                'twitter' => $user->candidateProfile->twitter,
                'github' => $user->candidateProfile->github,
                'resume' => $user->candidateProfile->resume ? asset('storage/' . $user->candidateProfile->resume) : null,
            ],
            'resumeCompleteness' => [
                'percentage' => round($profileCompletionPercentage),
                'missingItems' => $missingItems,
            ],
        ]);
    }
}
