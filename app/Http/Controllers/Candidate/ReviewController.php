<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use App\Models\CompanyReview;
use App\Models\JobApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class ReviewController extends Controller
{
    /**
     * Display a listing of the candidate's reviews.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $reviews = CompanyReview::with(['job_application.job.company'])
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Candidate/Reviews/Index', [
            'reviews' => $reviews
        ]);
    }

    /**
     * Show the form for creating a new review.
     *
     * @param int $jobApplicationId
     * @return \Illuminate\Http\RedirectResponse
     */
    public function create($jobApplicationId)
    {
        $jobApplication = JobApplication::with(['job.company'])
            ->where('id', $jobApplicationId)
            ->where('user_id', Auth::id())
            ->where('status', 'hired')
            ->firstOrFail();

        // Check if a review already exists
        $existingReview = CompanyReview::where('job_application_id', $jobApplicationId)
            ->where('user_id', Auth::id())
            ->first();

        if ($existingReview) {
            return redirect()->route('candidate.reviews.edit', $existingReview->id)
                ->with('message', 'Anda sudah membuat ulasan untuk aplikasi kerja ini. Silakan edit ulasan Anda.');
        }

        return Inertia::render('Candidate/Reviews/Create', [
            'job_application' => $jobApplication,
        ]);
    }

    /**
     * Store a newly created review in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'job_application_id' => 'required|exists:job_applications,id',
            'rating' => 'required|numeric|min:0.5|max:5',
            'rating_categories' => 'required|array',
            'rating_categories.work_culture' => 'numeric|min:0|max:5',
            'rating_categories.career_growth' => 'numeric|min:0|max:5',
            'rating_categories.work_life_balance' => 'numeric|min:0|max:5',
            'rating_categories.salary_benefits' => 'numeric|min:0|max:5',
            'rating_categories.management' => 'numeric|min:0|max:5',
            'review_text' => 'required|string|min:10',
            'pros' => 'nullable|string',
            'cons' => 'nullable|string',
            'is_anonymous' => 'boolean'
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        // Verify job application belongs to the user and has "hired" status
        $jobApplication = JobApplication::where('id', $request->job_application_id)
            ->where('user_id', Auth::id())
            ->where('status', 'hired')
            ->firstOrFail();

        // Check if a review already exists
        $existingReview = CompanyReview::where('job_application_id', $request->job_application_id)
            ->where('user_id', Auth::id())
            ->first();

        if ($existingReview) {
            return redirect()->route('candidate.reviews.edit', $existingReview->id)
                ->with('error', 'Anda sudah membuat ulasan untuk aplikasi kerja ini.');
        }

        // Create new review
        $review = new CompanyReview();
        $review->user_id = Auth::id();
        $review->company_id = $jobApplication->job->company_id;
        $review->job_application_id = $jobApplication->id;
        $review->rating = $request->rating;
        $review->rating_categories = $request->rating_categories;
        $review->review_text = $request->review_text;
        $review->pros = $request->pros;
        $review->cons = $request->cons;
        $review->is_anonymous = $request->is_anonymous;
        $review->save();

        return redirect()->route('candidate.reviews.index')
            ->with('success', 'Ulasan berhasil disimpan. Terima kasih atas masukan Anda!');
    }

    /**
     * Show the form for editing the specified review.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function edit($id)
    {
        $review = CompanyReview::with(['job_application.job.company'])
            ->where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        return Inertia::render('Candidate/Reviews/Edit', [
            'review' => $review,
        ]);
    }

    /**
     * Update the specified review in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'rating' => 'required|numeric|min:0.5|max:5',
            'rating_categories' => 'required|array',
            'rating_categories.work_culture' => 'numeric|min:0|max:5',
            'rating_categories.career_growth' => 'numeric|min:0|max:5',
            'rating_categories.work_life_balance' => 'numeric|min:0|max:5',
            'rating_categories.salary_benefits' => 'numeric|min:0|max:5',
            'rating_categories.management' => 'numeric|min:0|max:5',
            'review_text' => 'required|string|min:10',
            'pros' => 'nullable|string',
            'cons' => 'nullable|string',
            'is_anonymous' => 'boolean'
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        // Get review and verify ownership
        $review = CompanyReview::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        // Update review
        $review->rating = $request->rating;
        $review->rating_categories = $request->rating_categories;
        $review->review_text = $request->review_text;
        $review->pros = $request->pros;
        $review->cons = $request->cons;
        $review->is_anonymous = $request->is_anonymous;
        $review->save();

        return redirect()->route('candidate.reviews.index')
            ->with('success', 'Ulasan berhasil diperbarui!');
    }

    /**
     * Remove the specified review from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        $review = CompanyReview::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $review->delete();

        return redirect()->route('candidate.reviews.index')
            ->with('success', 'Ulasan telah dihapus.');
    }
}
