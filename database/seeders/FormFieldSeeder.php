<?php

namespace Database\Seeders;

use App\Models\FormField;
use App\Models\FormSection;
use Illuminate\Database\Seeder;

class FormFieldSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get section IDs
        $basicSection = FormSection::where('name', 'Basic Information')->first();
        $contactSection = FormSection::where('name', 'Contact Details')->first();
        $educationSection = FormSection::where('name', 'Education & Experience')->first();
        $skillsSection = FormSection::where('name', 'Skills & Qualifications')->first();
        $questionsSection = FormSection::where('name', 'Questions')->first();

        // Basic Information fields
        $basicFields = [
            [
                'name' => 'First Name',
                'field_type' => 'text',
                'is_required' => true,
                'order_index' => 1,
            ],
            [
                'name' => 'Last Name',
                'field_type' => 'text',
                'is_required' => true,
                'order_index' => 2,
            ],
            [
                'name' => 'Email',
                'field_type' => 'email',
                'is_required' => true,
                'order_index' => 3,
            ],
            [
                'name' => 'Gender',
                'field_type' => 'select',
                'options' => json_encode(['Male', 'Female', 'Prefer not to say']),
                'is_required' => false,
                'order_index' => 4,
            ],
            [
                'name' => 'Date of Birth',
                'field_type' => 'date',
                'is_required' => true,
                'order_index' => 5,
            ],
        ];

        // Contact Details fields
        $contactFields = [
            [
                'name' => 'Phone',
                'field_type' => 'text',
                'is_required' => true,
                'order_index' => 1,
            ],
            [
                'name' => 'Address',
                'field_type' => 'textarea',
                'is_required' => false,
                'order_index' => 2,
            ],
            [
                'name' => 'LinkedIn',
                'field_type' => 'text',
                'is_required' => false,
                'order_index' => 3,
            ],
            [
                'name' => 'Twitter',
                'field_type' => 'text',
                'is_required' => false,
                'order_index' => 4,
            ],
        ];

        // Education & Experience fields
        $educationFields = [
            [
                'name' => 'Highest Education',
                'field_type' => 'select',
                'options' => json_encode(['High School', 'Associate Degree', 'Bachelor\'s Degree', 'Master\'s Degree', 'PhD', 'Other']),
                'is_required' => true,
                'order_index' => 1,
            ],
            [
                'name' => 'University/Institution',
                'field_type' => 'text',
                'is_required' => true,
                'order_index' => 2,
            ],
            [
                'name' => 'Field of Study',
                'field_type' => 'text',
                'is_required' => true,
                'order_index' => 3,
            ],
            [
                'name' => 'Work Experience',
                'field_type' => 'textarea',
                'is_required' => false,
                'order_index' => 4,
            ],
        ];

        // Skills & Qualifications fields
        $skillsFields = [
            [
                'name' => 'Skills',
                'field_type' => 'textarea',
                'is_required' => true,
                'order_index' => 1,
            ],
            [
                'name' => 'Certifications',
                'field_type' => 'textarea',
                'is_required' => false,
                'order_index' => 2,
            ],
            [
                'name' => 'Resume',
                'field_type' => 'file',
                'is_required' => true,
                'order_index' => 3,
            ],
        ];

        // Additional Questions fields
        $questionsFields = [
            [
                'name' => 'Why do you want to work with us?',
                'field_type' => 'textarea',
                'is_required' => true,
                'order_index' => 1,
            ],
            [
                'name' => 'What is your notice period?',
                'field_type' => 'text',
                'is_required' => true,
                'order_index' => 2,
            ],
            [
                'name' => 'Salary Expectations',
                'field_type' => 'text',
                'is_required' => true,
                'order_index' => 3,
            ],
        ];

        // Create fields for each section
        foreach ($basicFields as $field) {
            FormField::create(array_merge($field, ['form_section_id' => $basicSection->id]));
        }

        foreach ($contactFields as $field) {
            FormField::create(array_merge($field, ['form_section_id' => $contactSection->id]));
        }

        foreach ($educationFields as $field) {
            FormField::create(array_merge($field, ['form_section_id' => $educationSection->id]));
        }

        foreach ($skillsFields as $field) {
            FormField::create(array_merge($field, ['form_section_id' => $skillsSection->id]));
        }

        foreach ($questionsFields as $field) {
            FormField::create(array_merge($field, ['form_section_id' => $questionsSection->id]));
        }
    }
}
