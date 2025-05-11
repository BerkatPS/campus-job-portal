<?php

namespace Database\Seeders;

use App\Models\JobApplication;
use App\Models\FormField;
use App\Models\FormResponse;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class FormResponseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('id_ID');
        
        // Ambil semua aplikasi pekerjaan
        $applications = JobApplication::all();
        
        if ($applications->isEmpty()) {
            $this->command->error('No job applications found. Please run JobApplicationSeeder first.');
            return;
        }
        
        // Ambil semua form fields
        $formFields = FormField::all();
        
        if ($formFields->isEmpty()) {
            $this->command->error('No form fields found. Please run FormFieldSeeder first.');
            return;
        }
        
        // Buat response untuk setiap aplikasi
        foreach ($applications as $application) {
            // Untuk setiap aplikasi, isi beberapa form fields (80% dari total fields)
            $fieldsToFill = $formFields->random(intval($formFields->count() * 0.8));
            
            foreach ($fieldsToFill as $field) {
                // Generate response berdasarkan tipe field
                $response = $this->generateResponse($field, $faker);
                
                // Buat atau perbarui form response
                FormResponse::updateOrCreate(
                    [
                        'job_application_id' => $application->id,
                        'form_field_id' => $field->id
                    ],
                    [
                        'response_value' => $response
                    ]
                );
            }
        }
        
        $this->command->info('Form responses seeded successfully.');
    }
    
    /**
     * Generate response value berdasarkan tipe field
     */
    private function generateResponse($field, $faker)
    {
        switch ($field->field_type) {
            case 'text':
                return $faker->sentence;
                
            case 'textarea':
                return $faker->paragraphs(rand(1, 3), true);
                
            case 'number':
                return $faker->numberBetween(1, 100);
                
            case 'email':
                return $faker->email;
                
            case 'phone':
                return $faker->phoneNumber;
                
            case 'date':
                return $faker->date;
                
            case 'select':
            case 'radio':
                // Ambil opsi dari field dan pilih satu secara acak
                $options = json_decode($field->options, true);
                if (is_array($options) && !empty($options)) {
                    return $options[array_rand($options)];
                }
                return 'Option ' . rand(1, 3);
                
            case 'checkbox':
                // Ambil opsi dari field dan pilih beberapa secara acak
                $options = json_decode($field->options, true);
                if (is_array($options) && !empty($options)) {
                    $selectedCount = min(rand(1, 3), count($options));
                    $selectedOptions = array_rand($options, $selectedCount);
                    
                    if (!is_array($selectedOptions)) {
                        $selectedOptions = [$selectedOptions];
                    }
                    
                    $selected = [];
                    foreach ($selectedOptions as $index) {
                        $selected[] = $options[$index];
                    }
                    
                    return json_encode($selected);
                }
                return json_encode(['Option ' . rand(1, 3)]);
                
            case 'file':
                // Return dummy file path
                return 'uploads/sample/file_' . rand(1000, 9999) . '.pdf';
                
            default:
                return $faker->words(3, true);
        }
    }
} 