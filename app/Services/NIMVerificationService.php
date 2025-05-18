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

        // Pattern baru tanpa titik: 7 digit total - 2025 (tahun) + 01 (kode negara) + 3 digit (nomor registrasi)
        $pattern = '/^2025013\d{2}$/';

        // Validasi pola
        if (!preg_match($pattern, $nim)) {
            Log::info("NIM {$nim} does not match pattern {$pattern}");
            return false;
        }

        // Ekstrak komponen NIM
        $yearCode = substr($nim, 0, 4);    // Tahun registrasi (2025)
        $countryCode = substr($nim, 4, 2); // Kode negara (01)
        $registrationNumber = substr($nim, 6); // Nomor registrasi (3 digit)

        Log::info("NIM components - Year: {$yearCode}, Country: {$countryCode}, RegNum: {$registrationNumber}");

        // Pastikan nomor registrasi bukan '000' (Nomor registrasi yang tidak valid)
        if ((int)$registrationNumber === 0) {
            Log::info("Registration number is invalid: 000");
            return false;
        }

        // Cek jika kode negara sesuai dengan kode negara universitas
        if ($countryCode !== '01') { // Kode negara harus '01'
            Log::info("Country code {$countryCode} is not valid (should be 01)");
            return false;
        }

        // Cek jika tahun registrasi valid (harus 2025)
        if ($yearCode !== '2025') {
            Log::info("Year code {$yearCode} is not valid (should be 2025)");
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
        $pattern = '/^2025013\d{2}$/';
        if (!preg_match($pattern, $nim)) {
            Log::info("NIM {$nim} - belongsToUniversity: format invalid");
            return false;
        }

        // Ekstrak kode negara (digit kelima dan keenam)
        $countryCode = substr($nim, 4, 2);
        Log::info("NIM {$nim} - belongsToUniversity: country code is {$countryCode}");

        // Cek jika kode negara sesuai dengan kode universitas ('01' untuk Indonesia)
        $result = $countryCode === '01';
        Log::info("NIM {$nim} - belongsToUniversity: result is " . ($result ? 'true' : 'false'));
        return $result;
    }

    /**
     * Metode ini tidak lagi diperlukan karena tahun sudah dipastikan 2025,
     * tetapi tetap dipertahankan untuk kompatibilitas
     */
    public function isValidYear(string $yearCode): bool
    {
        // Hanya tahun 2025 yang valid
        return $yearCode === '2025';
    }

    /**
     * Cek apakah mahasiswa dengan NIM ini adalah seorang lulusan
     * Selalu mengembalikan true karena semua mahasiswa dengan tahun 2025 dianggap lulusan
     */
    public function isGraduate(string $nim): bool
    {
        // Validasi format NIM terlebih dahulu
        $pattern = '/^2025013\d{2}$/';
        if (!preg_match($pattern, $nim)) {
            Log::info("NIM {$nim} - isGraduate: format invalid");
            return false;
        }

        // Semua mahasiswa dengan tahun 2025 dianggap lulusan
        return true;
    }

    /**
     * Ambil kode negara dari NIM
     */
    public function getCountryCode(string $nim): ?string
    {
        // Validasi format NIM terlebih dahulu
        $pattern = '/^2025013\d{2}$/';
        if (!preg_match($pattern, $nim)) {
            return null;
        }

        return substr($nim, 4, 2);
    }

    /**
     * Ambil tahun registrasi dari NIM
     */
    public function getRegistrationYear(string $nim): ?string
    {
        // Validasi format NIM terlebih dahulu
        $pattern = '/^2025013\d{2}$/';
        if (!preg_match($pattern, $nim)) {
            return null;
        }

        return substr($nim, 0, 4);
    }

    /**
     * Ambil detail mahasiswa dari NIM
     */
    public function getStudentDetails(string $nim): ?array
    {
        // Validasi format NIM terlebih dahulu
        $pattern = '/^2025013\d{2}$/';
        if (!preg_match($pattern, $nim)) {
            return null;
        }

        // Parse komponen NIM
        $yearCode = substr($nim, 0, 4);
        $countryCode = substr($nim, 4, 2);
        $registrationNumber = substr($nim, 6);

        return [
            'registrationYear' => $yearCode,
            'countryCode' => $countryCode,
            'registrationNumber' => $registrationNumber,
            'fullNIM' => $nim
        ];
    }
}
