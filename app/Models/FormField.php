<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FormField extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'form_section_id',
        'name',
        'field_type',
        'options',
        'is_required',
        'order_index',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_required' => 'boolean',
        'options' => 'array',
    ];

    /**
     * Get the form section that owns the form field.
     */
    public function formSection()
    {
        return $this->belongsTo(FormSection::class);
    }

    /**
     * Get the form responses for the form field.
     */
    public function formResponses()
    {
        return $this->hasMany(FormResponse::class);
    }
}
