<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CompanyReview extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'company_id',
        'job_application_id',
        'rating',
        'review_text',
        'rating_categories',
        'is_anonymous',
        'is_verified',
        'is_approved',
        'verified_at',
        'approved_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'rating_categories' => 'array',
        'is_anonymous' => 'boolean',
        'is_verified' => 'boolean',
        'is_approved' => 'boolean',
        'verified_at' => 'datetime',
        'approved_at' => 'datetime',
    ];

    /**
     * Get the user that wrote the review.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the company being reviewed.
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Get the job application associated with this review.
     */
    public function jobApplication(): BelongsTo
    {
        return $this->belongsTo(JobApplication::class);
    }

    /**
     * Scope a query to only include approved reviews.
     */
    public function scopeApproved($query)
    {
        return $query->where('is_approved', true);
    }

    /**
     * Get formatted date for human reading.
     */
    public function getFormattedCreatedAtAttribute()
    {
        return $this->created_at->format('d M Y');
    }

    /**
     * Get user's display name based on anonymity setting.
     */
    public function getReviewerNameAttribute()
    {
        if ($this->is_anonymous) {
            return 'Anonymous User';
        }

        return $this->user->name ?? 'Unknown User';
    }
}
