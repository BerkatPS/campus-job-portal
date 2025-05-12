<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use App\Models\CandidateProfile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProfileController extends Controller
{
    /**
     * Display the profile page.
     */
    public function index()
    {
        $user = Auth::user();
        $user->load('candidateProfile');

        // Get application statistics
        $stats = $this->getApplicationStats($user->id);

        return Inertia::render('Candidate/Profile/Index', [
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
                'profile_picture' => $user->candidateProfile->profile_picture ? asset('storage/' . $user->candidateProfile->profile_picture) : null,
                'stats' => $stats,
            ],
        ]);
    }

    /**
     * Display the profile edit form.
     */
    public function edit()
    {
        $user = Auth::user();
        $user->load('candidateProfile');

        return Inertia::render('Candidate/Profile/Edit', [
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
                'profile_picture' => $user->candidateProfile->profile_picture ? asset('storage/' . $user->candidateProfile->profile_picture) : null,
            ],
        ]);
    }

    /**
     * Update the user profile.
     */
    public function update(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . Auth::id(),
            'password' => 'nullable|string|min:8|confirmed',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'date_of_birth' => 'nullable|date',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'education' => 'nullable|string|max:1000',
            'experience' => 'nullable|string|max:1000',
            'skills' => 'nullable|string|max:500',
            'linkedin' => 'nullable|string|max:255|nullable',
            'website' => 'nullable|string|max:255|nullable',
            'twitter' => 'nullable|string|max:255|nullable',
            'github' => 'nullable|string|max:255|nullable',
        ]);

        try {
            $user = Auth::user();
            $oldProfile = null;
            if ($user->candidateProfile) {
                $oldProfile = clone $user->candidateProfile;
            }

            // Update user data
            $userData = [
                'name' => $request->input('name'),
                'email' => $request->input('email'),
            ];

            // Update password if provided
            if ($request->filled('password')) {
                $userData['password'] = Hash::make($request->password);
            }

            // Handle avatar upload if provided
            if ($request->hasFile('avatar') && $request->file('avatar')->isValid()) {
                // Delete old avatar if it exists
                if ($user->avatar) {
                    Storage::disk('public')->delete($user->avatar);
                }

                // Store new avatar
                $avatarPath = $request->file('avatar')->store('avatars', 'public');
                $userData['avatar'] = $avatarPath;
            }

            // Debug what's being sent to the database
            \Log::info('Updating user with data:', $userData);

            $user->update($userData);

            // Prepare profile data with explicit empty string fallbacks
            $profileData = [
                'date_of_birth' => $request->input('date_of_birth') ?: null,
                'phone' => $request->input('phone') ?: '',
                'address' => $request->input('address') ?: '',
                'education' => $request->input('education') ?: '',
                'experience' => $request->input('experience') ?: '',
                'skills' => $request->input('skills') ?: '',
                'linkedin' => $request->input('linkedin') ?: '',
                'website' => $request->input('website') ?: '',
                'twitter' => $request->input('twitter') ?: '',
                'github' => $request->input('github') ?: '',
            ];

            if ($oldProfile) {
                $changedFields = [];

                // Check for changes in important fields
                if ($oldProfile->resume != $user->candidateProfile->resume) {
                    $changedFields[] = 'resume';
                }
                if ($oldProfile->education != $user->candidateProfile->education) {
                    $changedFields[] = 'education';
                }
                if ($oldProfile->experience != $user->candidateProfile->experience) {
                    $changedFields[] = 'experience';
                }
                if ($oldProfile->skills != $user->candidateProfile->skills) {
                    $changedFields[] = 'skills';
                }

                // Notify user about profile updates
                if (!empty($changedFields)) {
                    $user->notify(new \App\Notifications\Candidate\ProfileUpdated([
                        'updated_fields' => $changedFields
                    ]));

                    // If user has active applications, notify recruiters about updated profile
                    $activeApplications = \App\Models\JobApplication::where('user_id', $user->id)
                        ->whereHas('status', function($query) {
                            $query->whereNotIn('slug', ['rejected', 'withdrawn', 'hired']);
                        })
                        ->with('job.company.managers')
                        ->get();

                    foreach ($activeApplications as $application) {
                        if ($application->job &&
                            $application->job->company &&
                            method_exists($application->job->company, 'managers') &&
                            $application->job->company->managers) {
                            foreach ($application->job->company->managers as $manager) {
                                $manager->notify(new \App\Notifications\CandidateProfileUpdated($user, [
                                    'application_id' => $application->id,
                                    'updated_fields' => $changedFields
                                ]));
                            }
                        }
                    }
                }
            }

            // Log profile data for debugging
            \Log::info('Updating profile with data:', $profileData);

            $user->candidateProfile()->update($profileData);

            // Refresh user data to get updated values
            $user->refresh();
            $user->load('candidateProfile');

            return redirect()->back()->with('success', 'Profil berhasil diperbarui.');
        } catch (\Exception $e) {
            // More detailed error logging
            \Log::error('Profile update error: ' . $e->getMessage());
            \Log::error($e->getTraceAsString());

            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    /**
     * Upload a resume file for the candidate.
     */
    /**
     * Upload a resume file for the candidate.
     */
    public function uploadResume(Request $request)
    {
        // Debug what's being received
        \Log::info('Resume upload request:', [
            'hasFile' => $request->hasFile('resume'),
            'allFiles' => $request->allFiles(),
        ]);

        // Validate the upload
        $validator = \Validator::make($request->all(), [
            'resume' => 'required|file|mimes:pdf,doc,docx|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $user = Auth::user();
            $activeApplications = \App\Models\JobApplication::where('user_id', $user->id)
                ->whereHas('status', function($query) {
                    $query->whereNotIn('slug', ['rejected', 'withdrawn', 'hired']);
                })
                ->with('job.company.managers')
                ->get();

            foreach ($activeApplications as $application) {
                if ($application->job &&
                    $application->job->company &&
                    method_exists($application->job->company, 'managers') &&
                    $application->job->company->managers) {
                    foreach ($application->job->company->managers as $manager) {
                        $manager->notify(new \App\Notifications\CandidateResumeUpdated($user, [
                            'application_id' => $application->id
                        ]));
                    }
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Resume berhasil diupload.',
                'path' => asset('storage/' . $resumePath)
            ]);
        } catch (\Exception $e) {
            \Log::error('Resume upload error: ' . $e->getMessage());
            \Log::error($e->getTraceAsString());

            return response()->json([
                'errors' => ['resume' => 'Gagal mengupload resume: ' . $e->getMessage()]
            ], 500);
        }
    }

    /**
     * Get application statistics for the user
     */
    private function getApplicationStats($userId)
    {
        // Get total applications
        $applications = \App\Models\JobApplication::where('user_id', $userId)->count();

        // Get interview count
        $interviews = \App\Models\Event::whereHas('jobApplication', function($query) use ($userId) {
            $query->where('user_id', $userId);
        })->count();

        // Get accepted application count
        $accepted = \App\Models\JobApplication::where('user_id', $userId)
            ->whereHas('status', function($query) {
                $query->where('slug', 'hired');
            })->count();

        // Calculate profile views (simulation)
        $profileViews = min($applications * 3, 100); // Simulation: each application viewed about 3 times

        return [
            'applications' => $applications,
            'interviews' => $interviews,
            'accepted' => $accepted,
            'profileViews' => $profileViews
        ];
    }
}
