<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use App\Models\ResumeEnhancement;
use App\Models\ResumeVersion;
use App\Services\ResumeEnhancerService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Str;

class ResumeEnhancerController extends Controller
{
    protected $enhancerService;

    public function __construct(ResumeEnhancerService $enhancerService)
    {
        $this->enhancerService = $enhancerService;
    }

    /**
     * Display the resume enhancer dashboard.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $user = Auth::user();

        // Get the user's resume versions with the most recent first
        $resumeVersions = $user->resumeVersions()
            ->orderBy('created_at', 'desc')
            ->get();

        // Get recent enhancements
        $recentEnhancements = $user->resumeEnhancements()
            ->with('resumeVersion')
            ->where('status', 'completed')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        // Get current resume version if exists
        $currentVersion = $user->currentResumeVersion;

        return Inertia::render('Candidate/ResumeEnhancer/Index', [
            'resumeVersions' => $resumeVersions,
            'recentEnhancements' => $recentEnhancements,
            'currentVersion' => $currentVersion,
        ]);
    }

    /**
     * Show the form for creating a new resume version.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        return Inertia::render('Candidate/ResumeEnhancer/Create');
    }

    /**
     * Store a newly created resume version in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'version_name' => 'required|string|max:255',
            'content' => 'required|string',
            'resume_file' => 'nullable|file|mimes:pdf,doc,docx|max:2048',
            'set_as_current' => 'nullable|boolean',
        ]);

        $filePath = null;
        $mimeType = null;

        // Handle file upload if present
        if ($request->hasFile('resume_file')) {
            $file = $request->file('resume_file');
            $filePath = $file->store('resumes', 'public');
            $mimeType = $file->getMimeType();
        }

        // Create new resume version
        $resumeVersion = ResumeVersion::create([
            'user_id' => Auth::id(),
            'version_name' => $request->version_name,
            'content' => $request->content,
            'file_path' => $filePath,
            'mime_type' => $mimeType,
            'is_current' => $request->set_as_current ?? false,
        ]);

        // If set as current, update other versions
        if ($request->set_as_current) {
            $resumeVersion->setAsCurrent();
        }

        return redirect()->route('candidate.resume-enhancer.show', $resumeVersion->id)
            ->with('success', 'Versi resume berhasil dibuat.');
    }

    /**
     * Display the specified resume version.
     *
     * @param  \App\Models\ResumeVersion  $resumeVersion
     * @return \Inertia\Response
     */
    public function show(ResumeVersion $resumeVersion)
    {
        // Ensure the resume version belongs to the authenticated user
        if ($resumeVersion->user_id !== Auth::id()) {
            abort(403);
        }

        // Get enhancements for this version
        $enhancements = $resumeVersion->enhancements()
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Candidate/ResumeEnhancer/Show', [
            'resumeVersion' => $resumeVersion,
            'enhancements' => $enhancements,
        ]);
    }

    /**
     * Show the form for editing the specified resume version.
     *
     * @param  \App\Models\ResumeVersion  $resumeVersion
     * @return \Inertia\Response
     */
    public function edit(ResumeVersion $resumeVersion)
    {
        // Ensure the resume version belongs to the authenticated user
        if ($resumeVersion->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('Candidate/ResumeEnhancer/Edit', [
            'resumeVersion' => $resumeVersion,
        ]);
    }

    /**
     * Update the specified resume version in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ResumeVersion  $resumeVersion
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, ResumeVersion $resumeVersion)
    {
        // Ensure the resume version belongs to the authenticated user
        if ($resumeVersion->user_id !== Auth::id()) {
            abort(403);
        }

        $request->validate([
            'version_name' => 'nullable|string|max:255',
            'content' => 'nullable|string',
            'resume_file' => 'nullable|file|mimes:pdf,doc,docx|max:2048',
            'set_as_current' => 'nullable|boolean',
        ]);

        // Handle file upload if present
        if ($request->hasFile('resume_file')) {
            // Delete old file if exists
            if ($resumeVersion->file_path) {
                Storage::disk('public')->delete($resumeVersion->file_path);
            }

            $file = $request->file('resume_file');
            $filePath = $file->store('resumes', 'public');
            $mimeType = $file->getMimeType();

            $resumeVersion->file_path = $filePath;
            $resumeVersion->mime_type = $mimeType;
        }

        // Ensure version_name is not null
        $resumeVersion->version_name = $request->version_name ?? $resumeVersion->version_name ?? 'Resume ' . now()->format('d M Y H:i');
        $resumeVersion->content = $request->content ?? $resumeVersion->content ?? '';
        $resumeVersion->save();

        // If set as current, update other versions
        if ($request->set_as_current) {
            $resumeVersion->setAsCurrent();
        }

        return redirect()->route('candidate.resume-enhancer.show', $resumeVersion->id)
            ->with('success', 'Versi resume berhasil diperbarui.');
    }

    /**
     * Remove the specified resume version from storage.
     *
     * @param  \App\Models\ResumeVersion  $resumeVersion
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(ResumeVersion $resumeVersion)
    {
        // Ensure the resume version belongs to the authenticated user
        if ($resumeVersion->user_id !== Auth::id()) {
            abort(403);
        }

        // Delete associated file if exists
        if ($resumeVersion->file_path) {
            Storage::disk('public')->delete($resumeVersion->file_path);
        }

        $resumeVersion->delete();

        return redirect()->route('candidate.resume-enhancer.index')
            ->with('success', 'Versi resume berhasil dihapus.');
    }

    /**
     * Enhance the specified resume version using OpenRouter with DeepSeek model.
     *
     * @param  \App\Models\ResumeVersion  $resumeVersion
     * @return \Illuminate\Http\RedirectResponse
     */
    public function enhance(ResumeVersion $resumeVersion)
    {
        // Ensure the resume version belongs to the authenticated user
        if ($resumeVersion->user_id !== Auth::id()) {
            abort(403);
        }

        try {
            // Process resume with OpenRouter service
            $enhancement = $this->enhancerService->enhanceResume($resumeVersion);

            $message = 'Peningkatan resume berhasil dilakukan.';

            if ($enhancement->status === 'failed') {
                $message = 'Terjadi kesalahan saat meningkatkan resume. Silakan coba lagi nanti.';
                return redirect()->route('candidate.resume-enhancer.show', $resumeVersion->id)
                    ->with('error', $message);
            }

            return redirect()->route('candidate.resume-enhancer.enhancement', $enhancement->id)
                ->with('success', $message);

        } catch (\Exception $e) {
            Log::error('Resume enhancement failed: ' . $e->getMessage(), [
                'user_id' => Auth::id(),
                'resume_version_id' => $resumeVersion->id,
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->route('candidate.resume-enhancer.show', $resumeVersion->id)
                ->with('error', 'Terjadi kesalahan saat meningkatkan resume: ' . $e->getMessage());
        }
    }

    /**
     * Show the specified enhancement.
     *
     * @param  \App\Models\ResumeEnhancement  $enhancement
     * @return \Inertia\Response
     */
    public function showEnhancement(ResumeEnhancement $enhancement)
    {
        // Ensure the enhancement belongs to the authenticated user
        if ($enhancement->user_id !== Auth::id()) {
            abort(403);
        }

        // Load related resume version
        $enhancement->load('resumeVersion');

        // Ensure enhancement has a status
        if (!$enhancement->status) {
            $enhancement->status = 'completed';
            $enhancement->save();
        }

        // Handle the case where the enhancement is still processing
        if ($enhancement->status === 'processing') {
            // Check if it's been processing for more than 5 minutes
            $processingStarted = Carbon::parse($enhancement->created_at);
            $timeElapsed = now()->diffInMinutes($processingStarted);

            if ($timeElapsed > 5) {
                // Mark as failed if processing took too long
                $enhancement->update([
                    'status' => 'failed',
                    'overall_feedback' => 'Analisis timed out. Silakan coba lagi nanti.',
                    'processed_at' => now(),
                ]);
            }
        }

        return Inertia::render('Candidate/ResumeEnhancer/Enhancement', [
            'enhancement' => $enhancement
        ]);
    }

    /**
     * Apply enhancement suggestions to create a new resume version.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ResumeEnhancement  $enhancement
     * @return \Illuminate\Http\RedirectResponse
     */
    public function applyEnhancement(Request $request, ResumeEnhancement $enhancement)
    {
        // Ensure the enhancement belongs to the authenticated user
        if ($enhancement->user_id !== Auth::id()) {
            abort(403);
        }

        $request->validate([
            'version_name' => 'required|string|max:255',
            'set_as_current' => 'nullable|boolean',
        ]);

        try {
            // Create new resume version with enhanced content
            $newVersion = ResumeVersion::create([
                'user_id' => Auth::id(),
                'version_name' => $request->version_name,
                'content' => $enhancement->enhanced_content,
                'file_path' => null,
                'mime_type' => null,
                'is_current' => $request->set_as_current ?? false,
            ]);

            // If set as current, update other versions
            if ($request->set_as_current) {
                $newVersion->setAsCurrent();
            }

            return redirect()->route('candidate.resume-enhancer.show', $newVersion->id)
                ->with('success', 'Versi resume yang disempurnakan berhasil dibuat.');

        } catch (\Exception $e) {
            Log::error('Apply enhanced resume failed: ' . $e->getMessage(), [
                'user_id' => Auth::id(),
                'enhancement_id' => $enhancement->id,
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->back()
                ->with('error', 'Gagal membuat versi resume baru: ' . $e->getMessage());
        }
    }

    /**
     * Import resume from candidate profile.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function importFromProfile()
    {
        $user = Auth::user();
        $profile = $user->candidateProfile;

        if (!$profile || !$profile->resume) {
            return redirect()->route('candidate.resume-enhancer.index')
                ->with('error', 'Tidak ada resume yang ditemukan di profil Anda.');
        }

        try {
            // Get file path
            $filePath = $profile->resume;
            $fullPath = Storage::disk('public')->path($filePath);
            $content = 'Konten resume diambil dari berkas profil. Harap edit ini untuk menyertakan teks resume Anda yang sebenarnya untuk analisis AI.';

            // Try to extract text content if it's a PDF
            if (Str::endsWith($filePath, '.pdf') && file_exists($fullPath)) {
                try {
                    // Basic content extraction from PDF if a PDF parser is available
                    // This is a placeholder - you'd need to implement actual PDF text extraction
                    $content = "Konten dari PDF resume Anda akan ditampilkan di sini.\n\nHarap edit dengan konten resume yang sebenarnya untuk mendapatkan hasil analisis terbaik dari AI.";
                } catch (\Exception $e) {
                    Log::warning('Failed to extract PDF content: ' . $e->getMessage());
                }
            }

            // Create new resume version
            $resumeVersion = ResumeVersion::create([
                'user_id' => $user->id,
                'version_name' => 'Resume dari Profil ' . now()->format('d M Y'),
                'content' => $content,
                'file_path' => $filePath,
                'mime_type' => null,
                'is_current' => false,
            ]);

            return redirect()->route('candidate.resume-enhancer.edit', $resumeVersion->id)
                ->with('success', 'Resume diambil dari profil. Harap tinjau dan edit konten sebelum disempurnakan.');

        } catch (\Exception $e) {
            Log::error('Failed to import profile resume: ' . $e->getMessage(), [
                'user_id' => Auth::id(),
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->route('candidate.resume-enhancer.index')
                ->with('error', 'Gagal mengimpor resume dari profil: ' . $e->getMessage());
        }
    }

    /**
     * Retry a failed enhancement.
     *
     * @param  \App\Models\ResumeEnhancement  $enhancement
     * @return \Illuminate\Http\RedirectResponse
     */
    public function retryEnhancement(ResumeEnhancement $enhancement)
    {
        // Ensure the enhancement belongs to the authenticated user
        if ($enhancement->user_id !== Auth::id()) {
            abort(403);
        }

        try {
            // Get the resume version
            $resumeVersion = $enhancement->resumeVersion;

            if (!$resumeVersion) {
                return redirect()->route('candidate.resume-enhancer.index')
                    ->with('error', 'Versi resume tidak ditemukan.');
            }

            // Delete the failed enhancement
            $enhancement->delete();

            // Create a new enhancement
            $newEnhancement = $this->enhancerService->enhanceResume($resumeVersion);

            return redirect()->route('candidate.resume-enhancer.enhancement', $newEnhancement->id)
                ->with('success', 'Analisis resume sedang diproses ulang.');

        } catch (\Exception $e) {
            Log::error('Retry enhancement failed: ' . $e->getMessage(), [
                'user_id' => Auth::id(),
                'enhancement_id' => $enhancement->id,
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->back()
                ->with('error', 'Gagal mencoba ulang analisis: ' . $e->getMessage());
        }
    }

    /**
     * Sets the specified resume version as the current one.
     *
     * @param  \App\Models\ResumeVersion  $resumeVersion
     * @return \Illuminate\Http\RedirectResponse
     */
    public function setAsCurrent(ResumeVersion $resumeVersion)
    {
        // Ensure the resume version belongs to the authenticated user
        if ($resumeVersion->user_id !== Auth::id()) {
            abort(403);
        }

        // Set as current (this will update other versions)
        $resumeVersion->is_current = true;
        $resumeVersion->save();

        // Update other versions to not be current
        $otherVersions = ResumeVersion::where('user_id', Auth::id())
            ->where('id', '!=', $resumeVersion->id)
            ->update(['is_current' => false]);

        return redirect()->route('candidate.resume-enhancer.show', $resumeVersion->id)
            ->with('success', 'Resume ini telah ditetapkan sebagai resume aktif di profil Anda.');
    }
}
