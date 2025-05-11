<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class JobRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user()->isAdmin();
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
            'company_id' => 'required|exists:companies,id',
            'description' => 'required|string',
            'requirements' => 'nullable|string',
            'location' => 'required|string|max:255',
            'job_type' => 'required|in:full_time,part_time,contract,internship,freelance',
            'experience_level' => 'required|in:entry,mid,senior,executive',
            'salary_min' => 'nullable|numeric|min:0',
            'salary_max' => 'nullable|numeric|min:0|gte:salary_min',
            'is_active' => 'boolean',
            'category_id' => 'nullable|exists:categories,id',
            'submission_deadline' => 'required|date|after:today',
            'skills' => 'array',
            'skills.*' => 'string|max:50',
            'hiring_stages' => 'array',
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
    public function messages(): array
    {
        return [
            'title.required' => 'Judul pekerjaan harus diisi.',
            'company_id.required' => 'Perusahaan harus dipilih.',
            'company_id.exists' => 'Perusahaan yang dipilih tidak valid.',
            'description.required' => 'Deskripsi pekerjaan harus diisi.',
            'requirements.string' => 'Persyaratan harus berupa teks.',
            'location.required' => 'Lokasi harus diisi.',
            'job_type.required' => 'Tipe pekerjaan harus dipilih.',
            'job_type.in' => 'Tipe pekerjaan tidak valid.',
            'experience_level.required' => 'Level pengalaman harus dipilih.',
            'experience_level.in' => 'Level pengalaman tidak valid.',
            'salary_min.numeric' => 'Gaji minimum harus berupa angka.',
            'salary_min.min' => 'Gaji minimum tidak boleh negatif.',
            'salary_max.numeric' => 'Gaji maksimum harus berupa angka.',
            'salary_max.min' => 'Gaji maksimum tidak boleh negatif.',
            'salary_max.gte' => 'Gaji maksimum harus lebih besar atau sama dengan gaji minimum.',
            'category_id.exists' => 'Kategori yang dipilih tidak valid.',
            'submission_deadline.required' => 'Batas waktu pendaftaran harus diisi.',
            'submission_deadline.date' => 'Batas waktu pendaftaran harus berupa tanggal.',
            'submission_deadline.after' => 'Batas waktu pendaftaran harus setelah hari ini.',
            'skills.array' => 'Skills harus berupa array.',
            'skills.*.string' => 'Setiap skill harus berupa teks.',
            'skills.*.max' => 'Panjang skill maksimal 50 karakter.',
            'hiring_stages.array' => 'Tahapan perekrutan harus berupa array.',
            'hiring_stages.*.exists' => 'Tahapan perekrutan tidak valid.',
        ];
    }

}
