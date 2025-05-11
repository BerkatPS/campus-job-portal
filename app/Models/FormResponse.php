<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FormResponse extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'job_application_id',
        'form_field_id',
        'response_value',
    ];

    /**
     * Get the job application that owns the form response.
     */
    public function jobApplication()
    {
        return $this->belongsTo(JobApplication::class);
    }

    /**
     * Get the form field that owns the form response.
     */
    public function formField()
    {
        return $this->belongsTo(FormField::class);
    }
}
