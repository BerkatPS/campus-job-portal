<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ForumLike extends Model
{
    use HasFactory;
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'forum_post_id',
        'user_id',
    ];
    
    /**
     * Get the post that owns the like.
     */
    public function post()
    {
        return $this->belongsTo(ForumPost::class, 'forum_post_id');
    }
    
    /**
     * Get the user that owns the like.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
