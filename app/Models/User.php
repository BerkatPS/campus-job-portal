<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class   User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'nim',
        'password',
        'role_id',
        'avatar',
        'is_active',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_active' => 'boolean',
    ];

    /**
     * Get the role that owns the user.
     */

    public function receivesBroadcastNotificationsOn()
    {
        return 'App.Models.User.' . $this->id;
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }



    /**
     * Get the candidate profile associated with the user.
     */
    public function candidateProfile()
    {
        return $this->hasOne(CandidateProfile::class);
    }

    /**
     * Get the job applications for the user.
     */
    public function jobApplications()
    {
        return $this->hasMany(JobApplication::class);
    }

    /**
     * Get the company manager records for the user.
     */
    public function companyManagers()
    {
        return $this->hasMany(CompanyManager::class);
    }

    /**
     * Get the companies managed by the user.
     */
    public function managedCompanies()
    {
        return $this->belongsToMany(Company::class, 'company_managers')
            ->select('companies.*')
            ->withPivot('is_primary')
            ->withTimestamps();
    }

    /**
     * Check if the user has the given role.
     */
    public function hasRole($role)
    {
        if (is_string($role)) {
            return $this->role->slug === $role;
        }

        return $role->id === $this->role_id;
    }

    /**
     * Check if the user is an admin.
     */
    public function isAdmin()
    {
        return $this->hasRole('admin');
    }

    /**
     * Check if the user is a manager.
     */
    public function isManager()
    {
        return $this->hasRole('manager');
    }

    /**
     * Check if the user is a candidate.
     */
    public function isCandidate()
    {
        return $this->hasRole('candidate');
    }

    /**
     * Get the events created by the user.
     */
    public function createdEvents()
    {
        return $this->hasMany(Event::class);
    }

    /**
     * Get the events where the user is an attendee.
     */
    public function attendingEvents()
    {
        return $this->belongsToMany(Event::class, 'event_attendees');
    }

    /**
     * Get the forum topics created by the user.
     */
    public function forumTopics()
    {
        return $this->hasMany(ForumTopic::class);
    }

    /**
     * Get the forum posts created by the user.
     */
    public function forumPosts()
    {
        return $this->hasMany(ForumPost::class);
    }

    /**
     * Get the forum post likes by the user.
     */
    public function forumLikes()
    {
        return $this->hasMany(ForumLike::class);
    }
}
