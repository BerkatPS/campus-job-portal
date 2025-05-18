<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class PortfolioItem extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'title',
        'description',
        'project_url',
        'repository_url',
        'thumbnail',
        'start_date',
        'end_date',
        'type',
        'is_featured',
        'display_order',
        'role',
        'organization',
        'skills',
        'achievements',
        'media_type',
        'media_url',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_featured' => 'boolean',
        'display_order' => 'integer',
        'skills' => 'array',
        'achievements' => 'array',
    ];

    /**
     * Get the user that owns the portfolio item.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the job applications that include this portfolio item.
     */
    public function jobApplications(): BelongsToMany
    {
        return $this->belongsToMany(JobApplication::class, 'job_application_portfolio')
            ->withTimestamps();
    }

    /**
     * Get the thumbnail URL.
     *
     * @return string|null
     */
    public function getThumbnailUrlAttribute()
    {
        if (!$this->thumbnail) {
            return null;
        }

        return \Storage::url($this->thumbnail);
    }

    /**
     * Get the types available for portfolio items.
     *
     * @return array
     */
    public static function getTypes(): array
    {
        return [
            'project' => 'Project',
            'work_experience' => 'Work Experience',
            'education' => 'Education',
            'volunteer' => 'Volunteer Work',
            'certification' => 'Certification',
            'publication' => 'Publication',
            'award' => 'Award/Recognition',
            'presentation' => 'Presentation',
            'creative_work' => 'Creative Work',
            'research' => 'Research',
            'open_source' => 'Open Source Contribution',
            'other' => 'Other',
        ];
    }

    /**
     * Get the media types available for portfolio items.
     *
     * @return array
     */
    public static function getMediaTypes(): array
    {
        return [
            'image' => 'Image',
            'video' => 'Video',
            'document' => 'Document',
            'website' => 'Website',
            'social_media' => 'Social Media',
            'repository' => 'Code Repository',
            'other' => 'Other',
        ];
    }
}
