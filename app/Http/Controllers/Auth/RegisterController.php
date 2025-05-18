<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use App\Models\Role;
use App\Models\CandidateProfile;
use App\Services\NIMVerificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log; // Add this for debugging if needed

class RegisterController extends Controller
{
    /**
     * Menangani permintaan pendaftaran aplikasi.
     */
    public function register(RegisterRequest $request)
    {
        // Log input untuk debugging
        Log::info('Register attempt with NIM: ' . $request->nim);

        // Validasi input form already handled by RegisterRequest class

        // Verifikasi NIM menggunakan layanan verifikasi NIM
        $verificationService = app(NIMVerificationService::class);

        // Cek apakah NIM valid - dengan logging untuk debugging
        $isValidFormat = $verificationService->verifyNIM($request->nim);
        Log::info('NIM format validation result: ' . ($isValidFormat ? 'valid' : 'invalid'));

        if (!$isValidFormat) {
            return back()->withErrors(['nim' => 'Format NIM tidak valid. Format yang benar: 202501XXX']);
        }

        // Cek apakah NIM milik universitas - dengan logging
        $belongsToUniversity = $verificationService->belongsToUniversity($request->nim);
        Log::info('NIM university check result: ' . ($belongsToUniversity ? 'belongs' : 'does not belong'));

        if (!$belongsToUniversity) {
            return back()->withErrors(['nim' => 'NIM ini tidak berasal dari universitas kami. Kode universitas harus 01.']);
        }

        // Cek apakah mahasiswa adalah lulusan - dengan logging
        $isGraduate = $verificationService->isGraduate($request->nim);
        Log::info('NIM graduate check result: ' . ($isGraduate ? 'is graduate' : 'not graduate'));

        if (!$isGraduate) {
            return back()->withErrors(['nim' => 'Hanya lulusan yang dapat mendaftar. Tahun masuk harus 2025.']);
        }

        try {
            // Dapatkan peran kandidat
            $candidateRole = Role::where('slug', 'candidate')->first();

            if (!$candidateRole) {
                Log::error('Candidate role not found');
                return back()->withErrors(['message' => 'Role kandidat tidak ditemukan.']);
            }

            // Log before user creation
            Log::info('About to create user with validated NIM: ' . $request->nim);

            // Buat pengguna baru
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'nim' => $request->nim,
                'password' => Hash::make($request->password),
                'role_id' => $candidateRole->id,
                'is_active' => true,
            ]);

            // Buat profil kandidat
            CandidateProfile::create([
                'user_id' => $user->id,
                // Add any additional profile fields that were provided
                'phone' => $request->phone,
                'address' => $request->address,
                'date_of_birth' => $request->date_of_birth,
                'education' => $request->education,
                'experience' => $request->experience,
                'skills' => $request->skills,
                'linkedin' => $request->linkedin,
                'website' => $request->website,
                'twitter' => $request->twitter,
                'github' => $request->github,
            ]);

            // Login pengguna
            Auth::login($user);

            // Log successful registration
            Log::info('User registered successfully with NIM: ' . $request->nim);

            // Redirect ke dashboard kandidat
            return redirect()->route('candidate.dashboard')->with('success', 'Pendaftaran berhasil!');
        } catch (\Exception $e) {
            // Log the exception with details
            Log::error('Registration error: ' . $e->getMessage() . ' | Stack trace: ' . $e->getTraceAsString());

            return back()->withErrors([
                'message' => 'Terjadi kesalahan saat pembuatan akun. Silakan coba lagi.'
            ]);
        }
    }
}
