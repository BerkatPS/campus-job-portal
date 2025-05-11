<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HiringStage extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'slug',
        'description',
        'color',
        'order_index',
        'is_default',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_default' => 'boolean',
    ];

    /**
     * Get the jobs that use this hiring stage.
     */
    public function jobs()
    {
        return $this->belongsToMany(Job::class, 'job_hiring_stages')
            ->withPivot('order_index')
            ->withTimestamps();
    }

    /**
     * Get the job hiring stage records for this hiring stage.
     */
    public function jobHiringStages()
    {
        return $this->hasMany(JobHiringStage::class);
    }

    /**
     * Get the job applications at this stage.
     */
    public function jobApplications()
    {
        return $this->hasMany(JobApplication::class, 'current_stage_id');
    }

    /**
     * Get the application stage history records for this hiring stage.
     */
    public function stageHistory()
    {
        return $this->hasMany(ApplicationStageHistory::class, 'hiring_stage_id');
    }
}
