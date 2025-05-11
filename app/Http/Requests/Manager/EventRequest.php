<?php

namespace App\Http\Requests\Manager;

use Illuminate\Foundation\Http\FormRequest;

class EventRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'job_id' => 'required|exists:jobs,id',
            'job_application_id' => 'nullable|exists:job_applications,id',
            'location' => 'nullable|string|max:255',
            'meeting_link' => 'nullable|string|max:255',
            'type' => 'required|in:interview,test,meeting,other',
            'attendees' => 'nullable|string',
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
            'job_application_id' => 'job application',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Convert attendees from JSON string to array if needed
        if ($this->has('attendees') && is_string($this->attendees)) {
            if (is_array(json_decode($this->attendees, true))) {
                $this->merge([
                    'attendees' => $this->attendees,
                ]);
            }
        }
    }
}
