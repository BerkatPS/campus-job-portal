<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
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
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Password::defaults()],
            'nim' => ['required', 'string', 'max:20', 'unique:users'],
            'phone' => ['required', 'string', 'max:20'],
            'address' => ['required', 'string', 'max:255'],
            'date_of_birth' => ['required', 'date'],
            'education' => ['required', 'string', 'max:255'],
            'experience' => ['nullable', 'string'],
            'skills' => ['nullable', 'string'],
            'linkedin' => ['nullable', 'string', 'max:255', 'url'],
            'website' => ['nullable', 'string', 'max:255', 'url'],
            'twitter' => ['nullable', 'string', 'max:255', 'url'],
            'github' => ['nullable', 'string', 'max:255', 'url'],
            'resume' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:2048'],
            'profile_picture' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama lengkap wajib diisi',
            'email.required' => 'Email wajib diisi',
            'email.email' => 'Format email tidak valid',
            'email.unique' => 'Email sudah terdaftar',
            'password.required' => 'Password wajib diisi',
            'password.confirmed' => 'Konfirmasi password tidak sesuai',
            'nim.required' => 'NIM wajib diisi',
            'nim.unique' => 'NIM sudah terdaftar',
            'phone.required' => 'Nomor telepon wajib diisi',
            'address.required' => 'Alamat wajib diisi',
            'date_of_birth.required' => 'Tanggal lahir wajib diisi',
            'education.required' => 'Pendidikan terakhir wajib diisi',
            'linkedin.url' => 'Format URL LinkedIn tidak valid',
            'website.url' => 'Format URL website tidak valid',
            'twitter.url' => 'Format URL Twitter tidak valid',
            'github.url' => 'Format URL GitHub tidak valid',
            'resume.mimes' => 'File resume harus dalam format PDF, DOC, atau DOCX',
            'resume.max' => 'Ukuran file resume maksimal 2MB',
            'profile_picture.mimes' => 'Foto profil harus dalam format JPEG, PNG, JPG, atau GIF',
            'profile_picture.max' => 'Ukuran foto profil maksimal 2MB',
        ];
    }
} 