<?php

namespace App\Http\Controllers;

use App\Models\JobApplication;
use App\Models\Review;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class ReviewController extends Controller
{
    /**
     * Display a listing of the reviews from the authenticated candidate.
     */
    public function index()
    {
        $reviews = Review::with(['job_application.job.company'])
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Candidate/Reviews/Index', [
            'reviews' => $reviews
        ]);
    }

    /**
     * Show the form for creating a new review.
     */
    public function create($applicationId)
    {
        // Find the job application
        $application = JobApplication::with(['job.company', 'status'])
            ->where('id', $applicationId)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        // Check if application is completed (hired, rejected, withdrawn, or disqualified)
        $completedStatuses = ['hired', 'rejected', 'withdrawn', 'disqualified'];
        if (!in_array($application->status->slug, $completedStatuses)) {
            return redirect()->back()->with('error', 'Anda hanya dapat memberikan ulasan pada lamaran yang sudah selesai.');
        }

        // Check if review already exists
        $existingReview = Review::where('job_application_id', $applicationId)->first();
        if ($existingReview) {
            return redirect()->route('candidate.reviews.edit', $existingReview->id)
                ->with('info', 'Anda sudah pernah memberikan ulasan untuk lamaran ini. Silakan edit ulasan Anda.');
        }

        return Inertia::render('Candidate/Reviews/Create', [
            'application' => $application
        ]);
    }

    /**
     * Store a newly created review in storage.
     */
    public function store(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'job_application_id' => [
                'required',
                'integer',
                'exists:job_applications,id',
                Rule::unique('reviews', 'job_application_id')->whereNull('deleted_at')
            ],
            'rating' => 'required|numeric|min:1|max:5',
            'rating_categories' => 'sometimes|array',
            'rating_categories.work_culture' => 'nullable|numeric|min:1|max:5',
            'rating_categories.career_growth' => 'nullable|numeric|min:1|max:5',
            'rating_categories.work_life_balance' => 'nullable|numeric|min:1|max:5',
            'rating_categories.salary_benefits' => 'nullable|numeric|min:1|max:5',
            'rating_categories.management' => 'nullable|numeric|min:1|max:5',
            'review_text' => 'required|string|min:10|max:1000',
            'pros' => 'nullable|string|max:500',
            'cons' => 'nullable|string|max:500',
            'is_anonymous' => 'boolean'
        ]);

        // Verify that the job application belongs to the authenticated user
        $application = JobApplication::where('id', $validated['job_application_id'])
            ->where('user_id', Auth::id())
            ->firstOrFail();

        // Check if application is completed (hired, rejected, withdrawn, or disqualified)
        $completedStatuses = ['hired', 'rejected', 'withdrawn', 'disqualified'];
        if (!in_array($application->status->slug, $completedStatuses)) {
            return redirect()->back()->with('error', 'Anda hanya dapat memberikan ulasan pada lamaran yang sudah selesai.');
        }

        // Create the review
        $review = new Review($validated);
        $review->user_id = Auth::id();
        $review->is_verified = true; // This is a verified review from an actual applicant
        $review->save();

        // Calculate and update company rating
        $this->updateCompanyRating($application->job->company_id);

        return redirect()->route('candidate.reviews.index')
            ->with('success', 'Ulasan berhasil disimpan. Terima kasih atas masukan Anda!');
    }

    /**
     * Show the form for editing the specified review.
     */
    public function edit($id)
    {
        $review = Review::with(['job_application.job.company', 'job_application.status'])
            ->where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        return Inertia::render('Candidate/Reviews/Edit', [
            'review' => $review
        ]);
    }

    /**
     * Update the specified review in storage.
     */
    public function update(Request $request, $id)
    {
        $review = Review::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        // Validate the request
        $validated = $request->validate([
            'rating' => 'required|numeric|min:1|max:5',
            'rating_categories' => 'sometimes|array',
            'rating_categories.work_culture' => 'nullable|numeric|min:1|max:5',
            'rating_categories.career_growth' => 'nullable|numeric|min:1|max:5',
            'rating_categories.work_life_balance' => 'nullable|numeric|min:1|max:5',
            'rating_categories.salary_benefits' => 'nullable|numeric|min:1|max:5',
            'rating_categories.management' => 'nullable|numeric|min:1|max:5',
            'review_text' => 'required|string|min:10|max:1000',
            'pros' => 'nullable|string|max:500',
            'cons' => 'nullable|string|max:500',
            'is_anonymous' => 'boolean'
        ]);

        // Update the review
        $review->update($validated);

        // Calculate and update company rating
        $companyId = $review->job_application->job->company_id;
        $this->updateCompanyRating($companyId);

        return redirect()->route('candidate.reviews.index')
            ->with('success', 'Ulasan berhasil diperbarui.');
    }

    /**
     * Remove the specified review from storage.
     */
    public function destroy($id)
    {
        $review = Review::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $companyId = $review->job_application->job->company_id;

        $review->delete();

        // Calculate and update company rating
        $this->updateCompanyRating($companyId);

        return redirect()->route('candidate.reviews.index')
            ->with('success', 'Ulasan berhasil dihapus.');
    }

    /**
     * Calculate and update the company's average rating.
     */
    private function updateCompanyRating($companyId)
    {
        $company = Company::findOrFail($companyId);

        $reviewStats = Review::whereHas('job_application.job', function ($query) use ($companyId) {
                $query->where('company_id', $companyId);
            })
            ->where('is_approved', true)
            ->get();

        if ($reviewStats->count() > 0) {
            // Calculate average rating
            $overallRating = $reviewStats->avg('rating');

            // Calculate category ratings
            $categoryRatings = [
                'work_culture' => 0,
                'career_growth' => 0,
                'work_life_balance' => 0,
                'salary_benefits' => 0,
                'management' => 0,
            ];

            $categoryCount = [
                'work_culture' => 0,
                'career_growth' => 0,
                'work_life_balance' => 0,
                'salary_benefits' => 0,
                'management' => 0,
            ];

            foreach ($reviewStats as $review) {
                if (!empty($review->rating_categories)) {
                    foreach ($review->rating_categories as $category => $rating) {
                        if (isset($categoryRatings[$category]) && !empty($rating)) {
                            $categoryRatings[$category] += $rating;
                            $categoryCount[$category]++;
                        }
                    }
                }
            }

            // Calculate averages for each category
            foreach ($categoryRatings as $category => $total) {
                if ($categoryCount[$category] > 0) {
                    $categoryRatings[$category] = $total / $categoryCount[$category];
                } else {
                    $categoryRatings[$category] = null;
                }
            }

            // Calculate rating distribution
            $distribution = [
                5 => $reviewStats->where('rating', '>=', 4.5)->count(),
                4 => $reviewStats->where('rating', '>=', 3.5)->where('rating', '<', 4.5)->count(),
                3 => $reviewStats->where('rating', '>=', 2.5)->where('rating', '<', 3.5)->count(),
                2 => $reviewStats->where('rating', '>=', 1.5)->where('rating', '<', 2.5)->count(),
                1 => $reviewStats->where('rating', '<', 1.5)->count(),
            ];

            // Update company with rating data
            $company->rating_data = [
                'average_rating' => round($overallRating, 1),
                'total_reviews' => $reviewStats->count(),
                'category_ratings' => $categoryRatings,
                'distribution' => $distribution,
                'updated_at' => now()
            ];

            $company->save();
        } else {
            // No reviews, reset rating data
            $company->rating_data = null;
            $company->save();
        }
    }

    /**
     * Display reviews for a specific company
     */
    public function companyReviews($companyId)
    {
        $company = Company::findOrFail($companyId);

        $reviews = Review::with(['user', 'job_application.job'])
            ->whereHas('job_application.job', function ($query) use ($companyId) {
                $query->where('company_id', $companyId);
            })
            ->where('is_approved', true)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'reviews' => $reviews,
            'stats' => $company->rating_data ?? [
                'average_rating' => 0,
                'total_reviews' => 0,
                'category_ratings' => [],
                'distribution' => []
            ]
        ]);
    }
}
