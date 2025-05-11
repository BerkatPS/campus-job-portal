<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

class NIMVerificationService
{
    /**
     * Verifikasi apakah NIM valid untuk kampus ini
     */
    public function verifyNIM(string $nim): bool
    {
        // Log untuk debugging
        Log::info("Verifying NIM: {$nim}");

        // Pattern yang lebih ketat untuk format NIM: YYCC.NNNN
        $pattern = '/^\d{2}\d{2}\.\d{4}$/';

        // Validasi pola
        if (!preg_match($pattern, $nim)) {
            Log::info("NIM {$nim} does not match pattern {$pattern}");
            return false;
        }

        // Ekstrak komponen NIM
        $yearCode = substr($nim, 0, 2); // Tahun registrasi
        $countryCode = substr($nim, 2, 2); // Kode negara
        $registrationNumber = substr($nim, 5, 4); // Nomor registrasi

        Log::info("NIM components - Year: {$yearCode}, Country: {$countryCode}, RegNum: {$registrationNumber}");

        // Pastikan nomor registrasi bukan '0000' (Nomor registrasi yang tidak valid)
        if ((int)$registrationNumber === 0) {
            Log::info("Registration number is invalid: 0000");
            return false;
        }

        // Cek jika kode negara sesuai dengan kode negara universitas
        if ($countryCode !== '01') { // Kode negara harus '01'
            Log::info("Country code {$countryCode} is not valid (should be 01)");
            return false;
        }

        // Cek jika tahun registrasi valid
        if (!$this->isValidYear($yearCode)) {
            Log::info("Year code {$yearCode} is not valid");
            return false;
        }

        Log::info("NIM {$nim} is valid");
        return true;
    }

    /**
     * Cek jika NIM milik universitas kita berdasarkan kode negara
     */
    public function belongsToUniversity(string $nim): bool
    {
        // Validasi format NIM terlebih dahulu
        $pattern = '/^\d{2}\d{2}\.\d{4}$/';
        if (!preg_match($pattern, $nim)) {
            Log::info("NIM {$nim} - belongsToUniversity: format invalid");
            return false;
        }

        // Ekstrak kode negara (digit ketiga dan keempat)
        $countryCode = substr($nim, 2, 2);
        Log::info("NIM {$nim} - belongsToUniversity: country code is {$countryCode}");

        // Cek jika kode negara sesuai dengan kode universitas (misalnya '01' untuk Indonesia)
        $result = $countryCode === '01';
        Log::info("NIM {$nim} - belongsToUniversity: result is " . ($result ? 'true' : 'false'));
        return $result;
    }

    /**
     * Cek jika tahun registrasi valid (misalnya, hanya mahasiswa dari tahun 2020 dan ke atas)
     */
    public function isValidYear(string $yearCode): bool
    {
        $currentYear = (int)date('y'); // Ambil dua digit tahun sekarang
        $minYear = 20; // Tahun minimal untuk registrasi yang valid (misalnya '20' untuk tahun 2020)

        // Log for debugging
        Log::info("Year validation - Input: {$yearCode}, Current: {$currentYear}, Min: {$minYear}");

        // Jika tahun registrasi lebih kecil dari tahun minimal, tolak registrasi
        $result = (int)$yearCode >= $minYear;
        Log::info("Year validation result: " . ($result ? 'valid' : 'invalid'));
        return $result;
    }

    /**
     * Cek apakah mahasiswa dengan NIM ini adalah seorang lulusan
     */
    public function isGraduate(string $nim): bool
    {
        // Validasi format NIM terlebih dahulu
        $pattern = '/^\d{2}\d{2}\.\d{4}$/';
        if (!preg_match($pattern, $nim)) {
            Log::info("NIM {$nim} - isGraduate: format invalid");
            return false;
        }

        // Ekstrak tahun dari NIM (bagian YY)
        $yearCode = substr($nim, 0, 2);
        $currentYear = (int)date('y');

        Log::info("Graduate check - NIM year: {$yearCode}, Current year: {$currentYear}");

        // Anggap lulusan adalah mahasiswa yang tahun registrasinya lebih kecil atau sama dengan tahun sekarang
        $result = (int)$yearCode <= $currentYear;
        Log::info("Graduate check result: " . ($result ? 'is graduate' : 'not graduate'));
        return $result;
    }


    /**
     * Ambil kode negara dari NIM
     */
    public function getCountryCode(string $nim): ?string
    {
        // Validasi format NIM terlebih dahulu
        $pattern = '/^\d{2}\d{2}\.\d{4}$/';
        if (!preg_match($pattern, $nim)) {
            return null;
        }

        return substr($nim, 2, 2);
    }

    /**
     * Ambil tahun registrasi dari NIM
     */
    public function getRegistrationYear(string $nim): ?string
    {
        // Validasi format NIM terlebih dahulu
        $pattern = '/^\d{2}\d{2}\.\d{4}$/';
        if (!preg_match($pattern, $nim)) {
            return null;
        }

        $yearCode = substr($nim, 0, 2);
        return '20' . $yearCode;
    }

    /**
     * Ambil detail mahasiswa dari NIM
     */
    public function getStudentDetails(string $nim): ?array
    {
        // Validasi format NIM terlebih dahulu
        $pattern = '/^\d{2}\d{2}\.\d{4}$/';
        if (!preg_match($pattern, $nim)) {
            return null;
        }

        // Parse komponen NIM
        $yearCode = substr($nim, 0, 2);
        $countryCode = substr($nim, 2, 2);
        $registrationNumber = substr($nim, 5, 4);

        return [
            'registrationYear' => '20' . $yearCode,
            'countryCode' => $countryCode,
            'registrationNumber' => $registrationNumber,
            'fullNIM' => $nim
        ];
    }
}
