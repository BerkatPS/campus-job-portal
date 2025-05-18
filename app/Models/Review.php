<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'job_application_id',
        'rating',
        'rating_categories',
        'review_text',
        'pros',
        'cons',
        'is_anonymous',
        'is_verified',
        'is_approved',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'rating' => 'float',
        'rating_categories' => 'array',
        'is_anonymous' => 'boolean',
        'is_verified' => 'boolean',
        'is_approved' => 'boolean',
    ];

    /**
     * Get the user who wrote the review.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the job application associated with this review.
     */
    public function job_application(): BelongsTo
    {
        return $this->belongsTo(JobApplication::class);
    }

    /**
     * Get the company being reviewed (through the job application)
     */
    public function getCompanyAttribute()
    {
        return $this->job_application->job->company ?? null;
    }

    /**
     * Scope a query to only include approved reviews.
     */
    public function scopeApproved($query)
    {
        return $query->where('is_approved', true);
    }

    /**
     * Scope a query to only include reviews for a specific company.
     */
    public function scopeForCompany($query, $companyId)
    {
        return $query->whereHas('job_application.job', function ($query) use ($companyId) {
            $query->where('company_id', $companyId);
        });
    }

    /**
     * Scope a query to only include reviews by a specific user.
     */
    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }
}
