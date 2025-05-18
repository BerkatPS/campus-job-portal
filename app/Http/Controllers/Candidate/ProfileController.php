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
    public function uploadResume(Request $request)
    {
        // Debug what's being received
        \Log::info('Resume upload request received', [
            'hasFile' => $request->hasFile('resume'),
            'allFiles' => $request->allFiles(),
            'fileSize' => $request->hasFile('resume') ? $request->file('resume')->getSize() : 'No file',
            'fileType' => $request->hasFile('resume') ? $request->file('resume')->getMimeType() : 'No file',
            'fileName' => $request->hasFile('resume') ? $request->file('resume')->getClientOriginalName() : 'No file',
        ]);

        // Check if the request actually contains a file before validation
        if (!$request->hasFile('resume')) {
            \Log::error('No resume file in request');
            return response()->json([
                'errors' => ['resume' => 'Tidak ada file yang diterima']
            ], 400);
        }

        // Validate the upload with detailed error messages
        $validator = \Validator::make($request->all(), [
            'resume' => 'required|file|mimes:pdf,doc,docx|max:2048',
        ], [
            'resume.required' => 'File resume diperlukan',
            'resume.file' => 'Upload harus berupa file',
            'resume.mimes' => 'Format file harus pdf, doc, atau docx',
            'resume.max' => 'Ukuran file tidak boleh lebih dari 2MB',
        ]);

        if ($validator->fails()) {
            \Log::warning('Resume validation failed', [
                'errors' => $validator->errors()->toArray()
            ]);
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $user = Auth::user();
            
            // Get the file from the request
            $file = $request->file('resume');
            $originalName = $file->getClientOriginalName();
            
            // Check if the file was properly uploaded
            if (!$file->isValid()) {
                \Log::error('Invalid file upload');
                return response()->json([
                    'errors' => ['resume' => 'File gagal diupload, silakan coba lagi']
                ], 400);
            }
            
            // Generate a unique filename to prevent conflicts
            $sanitizedName = preg_replace('/[^a-zA-Z0-9_.-]/', '_', pathinfo($originalName, PATHINFO_FILENAME));
            $fileName = time() . '_' . uniqid() . '_' . $sanitizedName . '.' . $file->getClientOriginalExtension();
            
            // Create the storage directory if it doesn't exist
            $storagePath = 'public/resumes';
            if (!Storage::exists($storagePath)) {
                \Log::info('Creating resume storage directory');
                Storage::makeDirectory($storagePath);
            }
            
            // Delete the old resume if it exists
            if ($user->candidateProfile && $user->candidateProfile->resume) {
                try {
                    if (Storage::disk('public')->exists($user->candidateProfile->resume)) {
                        Storage::disk('public')->delete($user->candidateProfile->resume);
                        \Log::info('Old resume deleted', ['path' => $user->candidateProfile->resume]);
                    } else {
                        \Log::warning('Old resume file not found for deletion', [
                            'path' => $user->candidateProfile->resume
                        ]);
                    }
                } catch (\Exception $e) {
                    \Log::warning('Failed to delete old resume file, continuing anyway', [
                        'error' => $e->getMessage(),
                        'path' => $user->candidateProfile->resume
                    ]);
                    // We'll continue even if we couldn't delete the old file
                }
            }
            
            // Store the new resume with error handling - try two different methods
            try {
                \Log::info('Attempting to store resume file', [
                    'fileName' => $fileName,
                    'originalName' => $originalName
                ]);
                
                // First attempt: use storeAs
                $resumePath = $file->storeAs('resumes', $fileName, 'public');
                
                if (!$resumePath) {
                    \Log::warning('First storage method failed, trying alternative');
                    
                    // Second attempt: manually store the file
                    $resumePath = 'resumes/' . $fileName;
                    $success = Storage::disk('public')->put($resumePath, file_get_contents($file->getRealPath()));
                    
                    if (!$success) {
                        throw new \Exception('Failed to store the resume file with both methods');
                    }
                }
                
                \Log::info('Resume stored successfully', [
                    'path' => $resumePath,
                    'storage_exists' => Storage::disk('public')->exists($resumePath)
                ]);
            } catch (\Exception $e) {
                \Log::error('Failed to store resume', [
                    'error' => $e->getMessage(),
                    'line' => $e->getLine(),
                    'file' => $e->getFile(),
                    'originalFile' => $file->getClientOriginalName()
                ]);
                
                return response()->json([
                    'errors' => ['resume' => 'Gagal menyimpan file: ' . $e->getMessage()]
                ], 500);
            }
            
            // Update the user's profile with the new resume path and filename
            try {
                \Log::info('Updating candidate profile with resume info', [
                    'resumePath' => $resumePath,
                    'originalName' => $originalName
                ]);
                
                $user->candidateProfile()->update([
                    'resume' => $resumePath,
                    'resume_name' => $originalName
                ]);
            } catch (\Exception $e) {
                \Log::error('Failed to update candidate profile with resume', [
                    'error' => $e->getMessage(),
                    'user_id' => $user->id
                ]);
                
                // If we fail to update the database but the file was stored, delete it to avoid orphaned files
                if (isset($resumePath) && Storage::disk('public')->exists($resumePath)) {
                    Storage::disk('public')->delete($resumePath);
                }
                
                throw $e; // Rethrow to be caught by the outer try-catch
            }
            
            // Success response with more detailed information
            return response()->json([
                'success' => true,
                'message' => 'Resume berhasil diupload.',
                'path' => asset('storage/' . $resumePath),
                'file_name' => $originalName
            ]);
            
        } catch (\Exception $e) {
            \Log::error('Resume upload error: ' . $e->getMessage());
            \Log::error('File: ' . $e->getFile() . ' Line: ' . $e->getLine());
            \Log::error($e->getTraceAsString());

            // Return appropriate error response
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
