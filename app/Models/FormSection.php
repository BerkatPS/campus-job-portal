<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FormSection extends Model
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
        'is_enabled',
        'order_index',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_enabled' => 'boolean',
    ];

    /**
     * Get the form fields for the form section.
     */
    public function formFields()
    {
        return $this->hasMany(FormField::class)->orderBy('order_index');
    }

    /**
     * Scope a query to only include enabled sections.
     */
    public function scopeEnabled($query)
    {
        return $query->where('is_enabled', true);
    }
}
