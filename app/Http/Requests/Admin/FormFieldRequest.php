<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class FormFieldRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'field_type' => 'required|string|in:text,textarea,number,email,date,select,radio,checkbox,file',
            'options' => 'nullable|array',
            'options.*' => 'nullable|string',
            'is_required' => 'boolean',
            'order_index' => 'nullable|integer|min:0',
        ];
    }
}
