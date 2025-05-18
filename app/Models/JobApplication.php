<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobApplication extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'job_id',
        'user_id',
        'current_stage_id',
        'status_id',
        'cover_letter',
        'resume',
        'notes',
        'is_favorite',
        'has_review',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_favorite' => 'boolean',
        'has_review' => 'boolean',
    ];

    /**
     * Get the job that owns the job application.
     */
    public function job()
    {
        return $this->belongsTo(Job::class);
    }

    /**
     * Get the user that owns the job application.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the current stage of the job application.
     */
    public function currentStage()
    {
        return $this->belongsTo(HiringStage::class, 'current_stage_id');
    }

    /**
     * Get the status of the job application.
     */
    public function status()
    {
        return $this->belongsTo(ApplicationStatus::class, 'status_id');
    }

    /**
     * Get the portfolio items attached to this job application.
     */
    public function portfolioItems()
    {
        return $this->belongsToMany(PortfolioItem::class, 'job_application_portfolio')
            ->withTimestamps();
    }

    /**
     * Get the stage history for the job application.
     */
    public function stageHistory()
    {
        return $this->hasMany(ApplicationStageHistory::class);
    }

    /**
     * Get the form responses for the job application.
     */
    public function formResponses()
    {
        return $this->hasMany(FormResponse::class);
    }

    /**
     * Get the events for the job application.
     */
    public function events()
    {
        return $this->hasMany(Event::class);
    }

    /**
     * Get the review associated with this job application.
     */
    public function review()
    {
        return $this->hasOne(CompanyReview::class);
    }

    /**
     * Scope a query to only include applications with the given status.
     */
    public function scopeWithStatus($query, $status)
    {
        if (is_numeric($status)) {
            return $query->where('status_id', $status);
        }

        return $query->whereHas('status', function ($q) use ($status) {
            $q->where('slug', $status);
        });
    }

    /**
     * Scope a query to only include applications at the given stage.
     */
    public function scopeAtStage($query, $stage)
    {
        if (is_numeric($stage)) {
            return $query->where('current_stage_id', $stage);
        }

        return $query->whereHas('currentStage', function ($q) use ($stage) {
            $q->where('slug', $stage);
        });
    }

    /**
     * Scope a query to only include favorite applications.
     */
    public function scopeFavorites($query)
    {
        return $query->where('is_favorite', true);
    }
}
