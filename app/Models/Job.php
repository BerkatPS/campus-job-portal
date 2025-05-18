<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'description',
        'requirements',
        'responsibilities',
        'benefits',
        'company_id',
        'category_id',
        'location',
        'job_type',
        'experience_level',
        'salary_min',
        'salary_max',
        'is_salary_visible',
        'vacancies',
        'submission_deadline',
        'is_active',
        'status',
        'skills',
        'deadline'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'salary_min' => 'decimal:2',
        'salary_max' => 'decimal:2',
        'is_salary_visible' => 'boolean',
        'vacancies' => 'integer',
        'submission_deadline' => 'date',
        'deadline' => 'date',
        'is_active' => 'boolean',
        'skills' => 'array',
    ];

    /**
     * Get the company that owns the job.
     */
    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Get the category that the job belongs to.
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the job applications for the job.
     */
    public function jobApplications()
    {
        return $this->hasMany(JobApplication::class);
    }

    /**
     * Alias for jobApplications() - used in controllers
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function applications()
    {
        return $this->jobApplications();
    }

    /**
     * Get the hiring stages for the job.
     */
    public function hiringStages()
    {
        return $this->belongsToMany(HiringStage::class, 'job_hiring_stages')
            ->withPivot('order_index')
            ->orderBy('job_hiring_stages.order_index')
            ->withTimestamps();
    }

    /**
     * Get the job hiring stage records for the job.
     */
    public function jobHiringStages()
    {
        return $this->hasMany(JobHiringStage::class);
    }

    /**
     * Get the events for the job.
     */
    public function events()
    {
        return $this->hasMany(Event::class);
    }

    /**
     * Scope a query to only include active jobs.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true)->orWhere('status', 'active');
    }

    /**
     * Scope a query to only include jobs that are accepting applications.
     */
    public function scopeAcceptingApplications($query)
    {
        return $query->where(function($q) {
            $q->where('is_active', true)->orWhere('status', 'active');
        })->where(function($q) {
            $q->where('submission_deadline', '>=', now())
              ->orWhere('deadline', '>=', now());
        });
    }
}
