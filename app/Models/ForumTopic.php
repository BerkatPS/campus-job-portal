<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ForumTopic extends Model
{
    use HasFactory;
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'slug',
        'forum_category_id',
        'user_id',
        'is_pinned',
        'is_locked',
        'views',
    ];
    
    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_pinned' => 'boolean',
        'is_locked' => 'boolean',
    ];
    
    /**
     * Get the category that owns the topic.
     */
    public function category()
    {
        return $this->belongsTo(ForumCategory::class, 'forum_category_id');
    }
    
    /**
     * Get the user that owns the topic.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    /**
     * Get the posts for the topic.
     */
    public function posts()
    {
        return $this->hasMany(ForumPost::class, 'forum_topic_id');
    }
    
    /**
     * Get the latest post for the topic.
     */
    public function latestPost()
    {
        return $this->hasOne(ForumPost::class, 'forum_topic_id')->latest();
    }
    
    /**
     * Get the likes through the posts.
     */
    public function likes()
    {
        return $this->hasManyThrough(ForumLike::class, ForumPost::class, 'forum_topic_id', 'forum_post_id');
    }
    
    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
