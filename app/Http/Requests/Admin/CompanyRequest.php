<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class CompanyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->role->slug === 'admin';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // 2MB max
            'website' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'industry' => 'nullable|string|max:100',
            'is_active' => 'nullable|boolean',
            'managers' => 'nullable|array',
            'managers.*' => 'exists:users,id',
            'primary_manager' => 'nullable|exists:users,id',
        ];

        return $rules;
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'name' => 'company name',
            'logo' => 'company logo',
            'is_active' => 'active status',
            'managers.*' => 'manager',
            'primary_manager' => 'primary manager',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama perusahaan wajib diisi',
            'name.max' => 'Nama perusahaan tidak boleh lebih dari 255 karakter',
            'logo.image' => 'Logo harus berupa file gambar',
            'logo.mimes' => 'Logo harus berformat: jpeg, png, jpg, atau gif',
            'logo.max' => 'Ukuran logo tidak boleh lebih dari 2MB',
            'email.email' => 'Format email tidak valid',
            'email.max' => 'Email tidak boleh lebih dari 255 karakter',
            'website.max' => 'Website tidak boleh lebih dari 255 karakter',
            'address.max' => 'Alamat tidak boleh lebih dari 255 karakter',
            'phone.max' => 'Nomor telepon tidak boleh lebih dari 20 karakter',
            'industry.max' => 'Industri tidak boleh lebih dari 100 karakter',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_active' => $this->boolean('is_active'),
        ]);
    }
}
