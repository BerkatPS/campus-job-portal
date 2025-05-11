<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobHiringStage extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'job_id',
        'hiring_stage_id',
        'order_index',
    ];

    /**
     * Get the job that owns the job hiring stage.
     */
    public function job()
    {
        return $this->belongsTo(Job::class);
    }

    /**
     * Get the hiring stage that owns the job hiring stage.
     */
    public function hiringStage()
    {
        return $this->belongsTo(HiringStage::class);
    }
}
