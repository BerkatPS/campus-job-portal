<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use App\Models\CompanyReview;
use App\Models\JobApplication;
use App\Services\CompanyReviewService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CompanyReviewController extends Controller
{
    protected $reviewService;

    public function __construct(CompanyReviewService $reviewService)
    {
        $this->reviewService = $reviewService;
        // Middleware should be defined in routes instead of controllers in Laravel 12
    }

    /**
     * Show the form for creating a new review for a job application.
     */
    public function create(Request $request, $jobApplicationId)
    {
        $user = Auth::user();

        // Validate if application exists and belongs to user
        $jobApplication = JobApplication::with(['job.company'])
            ->where('id', $jobApplicationId)
            ->where('user_id', $user->id)
            ->firstOrFail();

        // Check if user can review this application
        if (!$this->reviewService->isEligibleForReview($jobApplicationId, $user->id)) {
            return redirect()->route('candidate.applications.index')
                ->with('error', 'You have already submitted a review for this application or it is not eligible for review.');
        }

        return Inertia::render('Candidate/Reviews/Create', [
            'jobApplication' => $jobApplication,
            'company' => $jobApplication->job->company,
        ]);
    }

    /**
     * Store a newly created review.
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        // Validate the input
        $validated = $request->validate([
            'job_application_id' => 'required|exists:job_applications,id',
            'rating' => 'required|numeric|min:1|max:5',
            'review_text' => 'required|string|min:10|max:1000',
            'rating_categories' => 'required|array',
            'is_anonymous' => 'boolean',
        ]);

        try {
            // Create review via service
            $review = $this->reviewService->createReview($validated, $user);

            return redirect()->route('candidate.applications.index')
                ->with('success', 'Terima kasih! Ulasan Anda telah berhasil dikirim.');

        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Show the form for editing a review.
     */
    public function edit(CompanyReview $review)
    {
        $user = Auth::user();

        // Check if the review belongs to the user
        if ($review->user_id !== $user->id) {
            return redirect()->route('candidate.applications.index')
                ->with('error', 'You are not authorized to edit this review.');
        }

        $jobApplication = $review->jobApplication;

        return Inertia::render('Candidate/Reviews/Edit', [
            'review' => $review,
            'jobApplication' => $jobApplication,
            'company' => $jobApplication->job->company,
        ]);
    }

    /**
     * Update the specified review.
     */
    public function update(Request $request, CompanyReview $review)
    {
        $user = Auth::user();

        // Check if the review belongs to the user
        if ($review->user_id !== $user->id) {
            return redirect()->route('candidate.applications.index')
                ->with('error', 'You are not authorized to update this review.');
        }

        // Validate the input
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'review_text' => 'nullable|string|max:1000',
            'rating_categories' => 'nullable|array',
            'is_anonymous' => 'boolean',
        ]);

        try {
            // Update review via service
            $this->reviewService->updateReview($review, $validated, $user);

            return redirect()->route('candidate.applications.index')
                ->with('success', 'Your review has been updated successfully.');

        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Show a specific review.
     */
    public function show(CompanyReview $review)
    {
        $user = Auth::user();

        // Check if the review belongs to the user
        if ($review->user_id !== $user->id) {
            return redirect()->route('candidate.applications.index')
                ->with('error', 'You are not authorized to view this review.');
        }

        return Inertia::render('Candidate/Reviews/Show', [
            'review' => $review->load(['company', 'jobApplication.job']),
        ]);
    }

    /**
     * Delete the specified review.
     */
    public function destroy(CompanyReview $review)
    {
        $user = Auth::user();

        try {
            // Delete review via service
            $this->reviewService->deleteReview($review, $user);

            return redirect()->route('candidate.applications.index')
                ->with('success', 'Your review has been deleted successfully.');

        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
