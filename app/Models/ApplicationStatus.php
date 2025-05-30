<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApplicationStatus extends Model
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
        'color',
        'description',
        'order',
    ];

    /**
     * Get the job applications with this status.
     */
    public function jobApplications()
    {
        return $this->hasMany(JobApplication::class, 'status_id');
    }
}
