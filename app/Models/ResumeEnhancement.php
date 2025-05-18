<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ResumeEnhancement extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'resume_version_id',
        'original_content',
        'enhanced_content',
        'enhancement_suggestions',
        'keyword_analysis',
        'format_suggestions',
        'skill_suggestions',
        'overall_feedback',
        'score',
        'status',
        'processed_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'enhancement_suggestions' => 'array',
        'keyword_analysis' => 'array',
        'format_suggestions' => 'array',
        'skill_suggestions' => 'array',
        'score' => 'integer',
        'processed_at' => 'datetime',
    ];

    /**
     * Get the user that owns the resume enhancement.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the resume version that owns the resume enhancement.
     */
    public function resumeVersion(): BelongsTo
    {
        return $this->belongsTo(ResumeVersion::class);
    }
}
