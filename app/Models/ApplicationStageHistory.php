<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApplicationStageHistory extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'application_stage_history';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'job_application_id',
        'hiring_stage_id',
        'user_id',
        'notes',
    ];

    /**
     * Get the job application that owns the stage history.
     */
    public function jobApplication()
    {
        return $this->belongsTo(JobApplication::class);
    }

    /**
     * Get the hiring stage that owns the stage history.
     */
    public function hiringStage()
    {
        return $this->belongsTo(HiringStage::class);
    }

    /**
     * Get the user that updated the stage.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
