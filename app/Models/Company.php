<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'logo',
        'website',
        'address',
        'phone',
        'email',
        'industry',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Get the jobs for the company.
     */
    public function jobs()
    {
        return $this->hasMany(Job::class);
    }

    /**
     * Get the company manager records for the company.
     */
    public function companyManagers()
    {
        return $this->hasMany(CompanyManager::class);
    }

    /**
     * Get the managers for the company.
     */
    public function managers()
    {
        return $this->belongsToMany(User::class, 'company_managers')
            ->withPivot('is_primary')
            ->withTimestamps();
    }

    /**
     * Get the primary manager for the company.
     */
    public function primaryManager()
    {
        return $this->belongsToMany(User::class, 'company_managers')
            ->wherePivot('is_primary', true)
            ->first();
    }

    /**
     * Get the active jobs for the company.
     */
    public function activeJobs()
    {
        return $this->jobs()->where('is_active', true);
    }
}
