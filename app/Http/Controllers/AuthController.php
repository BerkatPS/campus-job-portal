<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        $validated = $request->validated();

        // Handle file uploads
        if ($request->hasFile('resume')) {
            $validated['resume'] = $request->file('resume')->store('resumes', 'public');
        }

        if ($request->hasFile('profile_picture')) {
            $validated['profile_picture'] = $request->file('profile_picture')->store('profile_pictures', 'public');
        }

        // Hash password
        $validated['password'] = Hash::make($validated['password']);

        // Create user
        $user = User::create($validated);

        // Assign candidate role
        $user->assignRole('candidate');

        // Create candidate profile
        $user->candidateProfile()->create([
            'education' => $validated['education'],
            'experience' => $validated['experience'] ?? null,
            'skills' => $validated['skills'] ?? null,
            'linkedin' => $validated['linkedin'] ?? null,
            'website' => $validated['website'] ?? null,
            'twitter' => $validated['twitter'] ?? null,
            'github' => $validated['github'] ?? null,
        ]);

        // Login user
        Auth::login($user);

        return response()->json([
            'message' => 'Pendaftaran berhasil',
            'user' => $user->load('candidateProfile'),
        ], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();

            return response()->json([
                'message' => 'Login berhasil',
                'user' => Auth::user()->load('candidateProfile'),
            ]);
        }

        return response()->json([
            'message' => 'Email atau password salah',
        ], 401);
    }

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Logout berhasil',
        ]);
    }
} 