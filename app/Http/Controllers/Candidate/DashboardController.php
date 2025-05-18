<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Job;
use App\Models\JobApplication;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the candidate dashboard with comprehensive analytics and personalized data.
     */
    public function index()
    {
        // Get user data
        $user = Auth::user();
        $user->load('candidateProfile');

        // Get counts for dashboard stats
        $totalApplicationsCount = JobApplication::where('user_id', Auth::id())->count();

        $activeApplicationsCount = JobApplication::where('user_id', Auth::id())
            ->whereHas('status', function($query) {
                $query->whereNotIn('slug', ['rejected', 'accepted', 'hired', 'withdrawn']);
            })
            ->count();

        $completedApplicationsCount = JobApplication::where('user_id', Auth::id())
            ->whereHas('status', function($query) {
                $query->whereIn('slug', ['rejected', 'accepted', 'hired', 'withdrawn']);
            })
            ->count();

        // Get application success rate
        $acceptedApplicationsCount = JobApplication::where('user_id', Auth::id())
            ->whereHas('status', function($query) {
                $query->where('slug', 'accepted')->orWhere('slug', 'hired');
            })
            ->count();

        $successRate = $completedApplicationsCount > 0
            ? round(($acceptedApplicationsCount / $completedApplicationsCount) * 100)
            : 0;

        // Get monthly application statistics (last 6 months)
        $monthlyApplications = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $count = JobApplication::where('user_id', Auth::id())
                ->whereYear('created_at', $month->year)
                ->whereMonth('created_at', $month->month)
                ->count();

            $monthlyApplications[] = [
                'month' => $month->format('M'),
                'count' => $count
            ];
        }

        // Get applications by status
        $applicationsByStatus = JobApplication::where('user_id', Auth::id())
            ->selectRaw('status_id, count(*) as count')
            ->groupBy('status_id')
            ->with('status')
            ->get()
            ->map(function($item) {
                return [
                    'status' => $item->status->name,
                    'color' => $item->status->color,
                    'count' => $item->count,
                ];
            });

        // Get recent applications with enhanced data
        $recentApplications = JobApplication::where('user_id', Auth::id())
            ->with(['job.company', 'status', 'events' => function($query) {
                $query->where('start_time', '>=', now())
                    ->orderBy('start_time')
                    ->limit(1);
            }])
            ->latest()
            ->take(5)
            ->get()
            ->map(function($application) {
                $nextEvent = $application->events->first();

                return [
                    'id' => $application->id,
                    'job' => [
                        'id' => $application->job->id,
                        'title' => $application->job->title,
                        'location' => $application->job->location,
                        'company' => [
                            'id' => $application->job->company->id,
                            'name' => $application->job->company->name,
                            'logo_url' => $application->job->company->logo ? asset('storage/' . $application->job->company->logo) : null,
                        ],
                    ],
                    'status' => $application->status->name,
                    'status_color' => $application->status->color,
                    'date_applied_formatted' => $application->created_at->diffForHumans(),
                    'next_event' => $nextEvent ? [
                        'type' => $nextEvent->type,
                        'date_formatted' => $nextEvent->start_time->format('d M Y, H:i'),
                    ] : null,
                ];
            });

        // Get recommended jobs with enhanced matching
        $recommendations = Job::with(['company', 'applications' => function($query) {
            $query->where('user_id', Auth::id());
        }])
            ->where('is_active', true)
            ->where('submission_deadline', '>=', now())

            // Add personalization logic for job matching
            ->when($user->candidateProfile->skills, function($query) use ($user) {
                $skills = explode(',', $user->candidateProfile->skills);
                foreach ($skills as $skill) {
                    $query->orWhere('description', 'like', '%'.trim($skill).'%')
                        ->orWhere('requirements', 'like', '%'.trim($skill).'%');
                }
            })

            ->latest()
            ->take(5)
            ->get()
            ->map(function($job) {
                // Calculate if already applied
                $alreadyApplied = $job->applications->count() > 0;

                return [
                    'id' => $job->id,
                    'title' => $job->title,
                    'company' => [
                        'id' => $job->company->id,
                        'name' => $job->company->name,
                        'logo_url' => $job->company->logo ? asset('storage/' . $job->company->logo) : null,
                    ],
                    'location' => $job->location,
                    'salary_formatted' => $job->is_salary_visible ? 'Rp ' . number_format($job->salary_min) . ' - Rp ' . number_format($job->salary_max) : 'Tidak ditampilkan',
                    'deadline_formatted' => $job->submission_deadline->format('d M Y'),
                    'days_remaining' => now()->diffInDays($job->submission_deadline, false),
                    'match_percentage' => rand(70, 95), // Simple random matching for demo purposes
                ];
            })
            ->filter(function($job) {
                return $job['days_remaining'] >= 0; // Filter out expired jobs
            });

        // Get upcoming events (fully structured)
        $upcomingEventsData = Event::whereHas('jobApplication', function($query) {
            $query->where('user_id', Auth::id());
        })
            ->with(['jobApplication.job.company'])
            ->where('start_time', '>=', now())
            ->orderBy('start_time')
            ->take(5)
            ->get()
            ->map(function($event) {
                return [
                    'id' => $event->id,
                    'title' => $event->title ?? $event->type,
                    'type' => $event->type,
                    'date_formatted' => $event->start_time->format('d M Y, H:i'),
                    'days_until' => now()->diffInDays($event->start_time, false),
                    'job' => [
                        'title' => $event->jobApplication->job->title,
                        'company' => [
                            'name' => $event->jobApplication->job->company->name
                        ]
                    ]
                ];
            });

        // Calculate profile completion percentage
        $profileFields = [
            'avatar' => ['value' => $user->avatar, 'weight' => 5],
            'phone' => ['value' => $user->candidateProfile->phone, 'weight' => 10],
            'date_of_birth' => ['value' => $user->candidateProfile->date_of_birth, 'weight' => 5],
            'address' => ['value' => $user->candidateProfile->address, 'weight' => 5],
            'education' => ['value' => $user->candidateProfile->education, 'weight' => 20],
            'experience' => ['value' => $user->candidateProfile->experience, 'weight' => 20],
            'skills' => ['value' => $user->candidateProfile->skills, 'weight' => 20],
            'resume' => ['value' => $user->candidateProfile->resume, 'weight' => 15],
        ];

        $totalWeight = array_sum(array_column($profileFields, 'weight'));
        $completedWeight = 0;

        foreach ($profileFields as $field => $data) {
            if (!empty($data['value'])) {
                $completedWeight += $data['weight'];
            }
        }

        $profileCompletionPercentage = $totalWeight > 0 ? ($completedWeight / $totalWeight) * 100 : 0;

        return Inertia::render('Candidate/Dashboard', [
            'stats' => [
                'totalApplications' => $totalApplicationsCount,
                'activeApplications' => $activeApplicationsCount,
                'completedApplications' => $completedApplicationsCount,
                'successRate' => $successRate,
                'applicationsByStatus' => $applicationsByStatus,
                'monthlyApplications' => $monthlyApplications,
            ],
            'applications' => $recentApplications,
            'recommendations' => $recommendations,
            'upcomingEvents' => $upcomingEventsData,
            'upcomingEventsCount' => count($upcomingEventsData),
            'profileCompleteness' => round($profileCompletionPercentage),
        ]);
    }

    /**
     * Get user-friendly label for profile fields
     */
    private function getFieldLabel($field)
    {
        $labels = [
            'avatar' => 'Foto Profil',
            'phone' => 'Nomor Telepon',
            'date_of_birth' => 'Tanggal Lahir',
            'address' => 'Alamat',
            'education' => 'Pendidikan',
            'experience' => 'Pengalaman',
            'skills' => 'Keterampilan',
            'resume' => 'Resume',
            'linkedin' => 'LinkedIn',
            'website' => 'Website',
            'twitter' => 'Twitter',
            'github' => 'GitHub',
        ];

        return $labels[$field] ?? ucfirst($field);
    }
}
