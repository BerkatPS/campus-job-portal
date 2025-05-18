<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class ProfileController extends Controller
{
    /**
     * Display the manager profile.
     */
    public function index()
    {
        // Get authenticated user with role
        $user = Auth::user()->load('role');

        // Get managed companies
        $companies = Auth::user()->managedCompanies()->get();

        return Inertia::render('Manager/Profile/Index', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar ? asset('storage/' . $user->avatar) : null,
                'role' => [
                    'id' => $user->role->id,
                    'name' => $user->role->name,
                ],
                'is_active' => $user->is_active,
                'created_at' => $user->created_at->format('Y-m-d'),
            ],
            'companies' => $companies->map(function($company) {
                $companyManager = $company->companyManagers()
                    ->where('user_id', Auth::id())
                    ->first();

                return [
                    'id' => $company->id,
                    'name' => $company->name,
                    'logo' => $company->logo ? asset('storage/' . $company->logo) : null,
                    'is_primary' => $companyManager ? $companyManager->is_primary : false,
                ];
            }),
        ]);
    }

    /**
     * Show the form for editing the manager profile.
     */
    public function edit()
    {
        // Get authenticated user
        $user = Auth::user();

        return Inertia::render('Manager/Profile/Edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar ? asset('storage/' . $user->avatar) : null,
            ],
        ]);
    }

    /**
     * Update the manager profile.
     */
    public function update(Request $request)
    {
        // Get authenticated user
        $user = Auth::user();

        // Validate form data
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
            'current_password' => 'nullable|required_with:password',
            'password' => 'nullable|min:8|confirmed',
        ]);

        // Prepare data for update
        $data = [
            'name' => $validated['name'],
            'email' => $validated['email'],
        ];

        // Handle password update if provided
        if (isset($validated['password']) && $validated['password']) {
            // Verify current password
            if (!Hash::check($validated['current_password'], $user->password)) {
                return back()->withErrors(['current_password' => 'The provided password does not match our records.']);
            }

            $data['password'] = Hash::make($validated['password']);
        }

        // Update user
        $user->update($data);

        return redirect()->route('manager.profile.index')
            ->with('success', 'Profile updated successfully.');
    }

    /**
     * Show the security settings page.
     */
    public function security()
    {
        return Inertia::render('Manager/Profile/Security');
    }

    /**
     * Update the security settings.
     */
    public function updateSecurity(Request $request)
    {
        // Get authenticated user
        $user = Auth::user();

        // Validate form data
        $validated = $request->validate([
            'current_password' => 'required',
            'password' => 'required|min:8|confirmed',
        ]);

        // Verify current password
        if (!Hash::check($validated['current_password'], $user->password)) {
            return back()->withErrors(['current_password' => 'The provided password does not match our records.']);
        }

        // Update password
        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()->route('manager.profile.security')
            ->with('success', 'Password updated successfully.');
    }

    /**
     * Show the notification preferences page.
     */
    public function notifications()
    {
        // Get user notification preferences
        $preferences = Auth::user()->notificationPreferences()->get();

        return Inertia::render('Manager/Profile/Notifications', [
            'preferences' => $preferences,
        ]);
    }

    /**
     * Update notification preferences.
     */
    public function updateNotifications(Request $request)
    {
        // Get authenticated user
        $user = Auth::user();

        // Validate form data
        $validated = $request->validate([
            'preferences' => 'required|array',
            'preferences.*.type' => 'required|string',
            'preferences.*.email' => 'required|boolean',
            'preferences.*.push' => 'required|boolean',
            'preferences.*.in_app' => 'required|boolean',
        ]);

        // Update preferences
        foreach ($validated['preferences'] as $pref) {
            $user->notificationPreferences()
                ->updateOrCreate(
                    ['type' => $pref['type']],
                    [
                        'email' => $pref['email'],
                        'push' => $pref['push'],
                        'in_app' => $pref['in_app'],
                    ]
                );
        }

        return redirect()->route('manager.profile.notifications')
            ->with('success', 'Notification preferences updated successfully.');
    }

    /**
     * Update manager avatar.
     */
    public function updateAvatar(Request $request)
    {
        // Get authenticated user
        $user = Auth::user();

        // Validate the avatar upload
        $validated = $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        try {
            // Delete old avatar if exists
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }

            // Upload new avatar
            $avatarPath = $request->file('avatar')->store('avatars', 'public');
            
            // Update user avatar
            $user->update(['avatar' => $avatarPath]);

            return response()->json([
                'success' => true,
                'message' => 'Avatar updated successfully',
                'avatar' => asset('storage/' . $avatarPath)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload avatar: ' . $e->getMessage()
            ], 500);
        }
    }
}
