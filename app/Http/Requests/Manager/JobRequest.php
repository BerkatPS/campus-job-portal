<?php

namespace App\Http\Requests\Manager;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Company;

class JobRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        if ($this->user()->role_id !== 2) {
            return false;
        }

        // Get companies managed by the current user
        $userCompanies = $this->user()->managedCompanies()->pluck('id');

        // Check if user is authorized to manage this company
        $companyId = $this->company_id;
        if (!$userCompanies->contains($companyId)) {
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
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'requirements' => 'nullable|string',
            'responsibilities' => 'nullable|string',
            'benefits' => 'nullable|string',
            'company_id' => 'required|exists:companies,id',
            'location' => 'required|string|max:255',
            'job_type' => 'required|string|max:100',
            'experience_level' => 'nullable|string|max:100',
            'salary_min' => 'nullable|numeric|min:0',
            'salary_max' => 'nullable|numeric|min:0|gte:salary_min',
            'is_salary_visible' => 'nullable|boolean',
            'vacancies' => 'nullable|integer|min:1',
            'submission_deadline' => 'required|date|after_or_equal:today',
            'is_active' => 'nullable|boolean',
            'hiring_stages' => 'nullable|array',
            'hiring_stages.*' => 'exists:hiring_stages,id',
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
            'company_id' => 'company',
            'job_type' => 'job type',
            'experience_level' => 'experience level',
            'salary_min' => 'minimum salary',
            'salary_max' => 'maximum salary',
            'is_salary_visible' => 'salary visibility',
            'submission_deadline' => 'submission deadline',
            'is_active' => 'active status',
            'hiring_stages.*' => 'hiring stage',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_active' => $this->boolean('is_active'),
            'is_salary_visible' => $this->boolean('is_salary_visible'),
        ]);
    }
}
