<?php

namespace App\Services;

use App\Models\CompanyReview;
use App\Models\JobApplication;
use App\Models\User;
use App\Notifications\ReviewSubmitted;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CompanyReviewService
{
    /**
     * Create a new company review
     *
     * @param array $data
     * @param User $user
     * @return CompanyReview
     */
    public function createReview(array $data, User $user): CompanyReview
    {
        try {
            DB::beginTransaction();

            // Get job application to ensure it belongs to the user and has an appropriate final status
            $jobApplication = JobApplication::with(['job.company'])
                ->where('id', $data['job_application_id'])
                ->where('user_id', $user->id)
                ->whereHas('status', function($query) {
                    $query->where('slug', 'completed')
                          ->orWhere('slug', 'hired')
                          ->orWhere('slug', 'rejected')
                          ->orWhere('slug', 'disqualified');
                })
                ->firstOrFail();

            // Check if a review already exists for this application
            $existingReview = CompanyReview::where('job_application_id', $jobApplication->id)
                ->where('user_id', $user->id)
                ->first();

            if ($existingReview) {
                throw new \Exception('Anda sudah mengirimkan ulasan untuk aplikasi ini.');
            }

            // Create the review
            $review = CompanyReview::create([
                'user_id' => $user->id,
                'company_id' => $jobApplication->job->company_id,
                'job_application_id' => $jobApplication->id,
                'rating' => $data['rating'],
                'review_text' => $data['review_text'],
                'rating_categories' => $data['rating_categories'],
                'is_anonymous' => $data['is_anonymous'] ?? false,
                'is_verified' => true, // Auto-verify since it's tied to a completed application
                'is_approved' => true, // Auto-approve for simplicity
                'verified_at' => now(),
                'approved_at' => now(),
            ]);

            // Update the job application to mark that review has been submitted
            $jobApplication->update(['has_review' => true]);

            // Send notification to company managers
            $this->notifyCompanyManagers($review);

            DB::commit();
            return $review;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error creating company review: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Update an existing company review
     *
     * @param CompanyReview $review
     * @param array $data
     * @param User $user
     * @return CompanyReview
     */
    public function updateReview(CompanyReview $review, array $data, User $user): CompanyReview
    {
        try {
            DB::beginTransaction();

            // Ensure the user owns the review
            if ($review->user_id !== $user->id) {
                throw new \Exception('You are not authorized to update this review.');
            }

            // Update review data
            $review->update([
                'rating' => $data['rating'] ?? $review->rating,
                'review_text' => $data['review_text'] ?? $review->review_text,
                'rating_categories' => $data['rating_categories'] ?? $review->rating_categories,
                'is_anonymous' => $data['is_anonymous'] ?? $review->is_anonymous,
                // We don't change verification/approval status during updates
            ]);

            DB::commit();
            return $review;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating company review: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Delete a company review
     *
     * @param CompanyReview $review
     * @param User $user
     * @return bool
     */
    public function deleteReview(CompanyReview $review, User $user): bool
    {
        try {
            DB::beginTransaction();

            // Ensure the user owns the review
            if ($review->user_id !== $user->id) {
                throw new \Exception('You are not authorized to delete this review.');
            }

            // Mark the job application as not having a review
            $jobApplication = $review->jobApplication;
            $jobApplication->update(['has_review' => false]);

            // Delete the review
            $review->delete();

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error deleting company review: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Get company reviews with pagination
     *
     * @param int $companyId
     * @param int $perPage
     * @return \Illuminate\Pagination\LengthAwarePaginator
     */
    public function getCompanyReviews(int $companyId, int $perPage = 10)
    {
        return CompanyReview::with(['user'])
            ->where('company_id', $companyId)
            ->where('is_approved', true)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Check if a job application is eligible for review
     *
     * @param int $jobApplicationId
     * @param int $userId
     * @return bool
     */
    public function isEligibleForReview(int $jobApplicationId, int $userId): bool
    {
        // Ensure job application belongs to user and has a completed status
        $jobApplication = JobApplication::where('id', $jobApplicationId)
            ->where('user_id', $userId)
            ->whereHas('status', function($query) {
                $query->where('slug', 'completed')
                      ->orWhere('slug', 'hired')
                      ->orWhere('slug', 'rejected')
                      ->orWhere('slug', 'disqualified');
            })
            ->first();

        if (!$jobApplication) {
            return false;
        }

        // Check if review already exists
        $existingReview = CompanyReview::where('job_application_id', $jobApplicationId)
            ->where('user_id', $userId)
            ->first();

        return !$existingReview;
    }

    /**
     * Send notifications to company managers about new review
     *
     * @param CompanyReview $review
     * @return void
     */
    private function notifyCompanyManagers(CompanyReview $review): void
    {
        // Get company managers
        $companyManagers = $review->company->companyManagers;

        foreach ($companyManagers as $manager) {
            $user = $manager->user;
            if ($user) {
                $user->notify(new ReviewSubmitted($review));
            }
        }
    }
}
