<?php

namespace App\Http\Requests\Candidate;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Job;

class ApplicationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Check if user is a candidate
        if ($this->user()->role->slug !== 'candidate') {
            return false;
        }

        // Check if job exists and is active
        $job = Job::find($this->job_id);
        if (!$job || !$job->is_active || $job->submission_deadline < now()) {
            return false;
        }

        // Check if user already applied
        $alreadyApplied = $this->user()->jobApplications()->where('job_id', $this->job_id)->exists();
        if ($alreadyApplied) {
            return false;
        }

        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'job_id' => 'required|exists:jobs,id',
            'cover_letter' => 'nullable|string',
            'resume' => 'nullable|file|mimes:pdf,doc,docx|max:2048',
            'responses' => 'nullable|array',
            'responses.*' => 'nullable',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'job_id' => 'job',
            'cover_letter' => 'cover letter',
            'responses.*' => 'response',
        ];
    }
}
