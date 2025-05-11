<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileUploadService
{
    /**
     * Upload a file to storage
     */
    public function uploadFile(UploadedFile $file, string $directory, ?string $filename = null): string
    {
        if (!$filename) {
            $extension = $file->getClientOriginalExtension();
            $filename = Str::uuid() . '.' . $extension;
        }

        $path = $file->storeAs($directory, $filename, 'public');

        return $path;
    }

    /**
     * Delete a file from storage
     */
    public function deleteFile(string $path): bool
    {
        if (Storage::disk('public')->exists($path)) {
            return Storage::disk('public')->delete($path);
        }

        return false;
    }

    /**
     * Upload a resume file
     */
    public function uploadResume(UploadedFile $file, int $userId): string
    {
        $extension = $file->getClientOriginalExtension();
        $filename = "resume_user_{$userId}_" . time() . '.' . $extension;

        return $this->uploadFile($file, 'resumes', $filename);
    }

    /**
     * Upload a company logo
     */
    public function uploadCompanyLogo(UploadedFile $file, int $companyId): string
    {
        $extension = $file->getClientOriginalExtension();
        $filename = "logo_company_{$companyId}_" . time() . '.' . $extension;

        return $this->uploadFile($file, 'company_logos', $filename);
    }

    /**
     * Upload a user avatar
     */
    public function uploadUserAvatar(UploadedFile $file, int $userId): string
    {
        $extension = $file->getClientOriginalExtension();
        $filename = "avatar_user_{$userId}_" . time() . '.' . $extension;

        return $this->uploadFile($file, 'user_avatars', $filename);
    }

    /**
     * Upload a form file response
     */
    public function uploadFormFile(UploadedFile $file, int $applicationId, int $fieldId): string
    {
        $extension = $file->getClientOriginalExtension();
        $filename = "app_{$applicationId}_field_{$fieldId}_" . time() . '.' . $extension;

        return $this->uploadFile($file, 'form_uploads', $filename);
    }

    /**
     * Get mime type friendly name
     */
    public function getMimeTypeName(string $mimeType): string
    {
        $mimeTypes = [
            'application/pdf' => 'PDF',
            'application/msword' => 'Word Document',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => 'Word Document',
            'image/jpeg' => 'JPEG Image',
            'image/png' => 'PNG Image',
            'text/plain' => 'Text Document',
        ];

        return $mimeTypes[$mimeType] ?? $mimeType;
    }
}
