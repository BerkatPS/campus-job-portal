<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ForumPost extends Model
{
    use HasFactory, SoftDeletes;
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'content',
        'forum_topic_id',
        'user_id',
        'is_solution',
        'is_first_post',
    ];
    
    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_solution' => 'boolean',
        'is_first_post' => 'boolean',
    ];
    
    /**
     * Get the topic that owns the post.
     */
    public function topic()
    {
        return $this->belongsTo(ForumTopic::class, 'forum_topic_id');
    }
    
    /**
     * Get the user that owns the post.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    /**
     * Get the likes for the post.
     */
    public function likes()
    {
        return $this->hasMany(ForumLike::class, 'forum_post_id');
    }
    
    /**
     * Determine if the post is liked by a specific user.
     */
    public function isLikedBy(User $user)
    {
        return $this->likes()->where('user_id', $user->id)->exists();
    }
}
