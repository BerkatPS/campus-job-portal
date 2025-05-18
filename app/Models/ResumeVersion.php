<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ResumeVersion extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'version_name',
        'content',
        'file_path',
        'mime_type',
        'is_current',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_current' => 'boolean',
    ];

    /**
     * Get the user that owns the resume version.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the enhancements for the resume version.
     */
    public function enhancements(): HasMany
    {
        return $this->hasMany(ResumeEnhancement::class);
    }

    /**
     * Set this version as the current one and unset others
     */
    public function setAsCurrent(): void
    {
        $this->user->resumeVersions()->where('id', '!=', $this->id)
            ->update(['is_current' => false]);
        
        $this->is_current = true;
        $this->save();
    }
}
