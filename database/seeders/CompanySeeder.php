<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\CompanyManager;
use App\Models\Role;
use App\Models\User;
use Faker\Factory;
use Illuminate\Database\Seeder;

class CompanySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Factory::create('id_ID');

        // Get manager role ID
        $managerRole = Role::where('slug', 'manager')->first();

        if (!$managerRole) {
            $this->command->error('Peran manager tidak ditemukan. Harap jalankan RoleSeeder terlebih dahulu.');
            return;
        }

        // Get manager users
        $managerUsers = User::where('role_id', $managerRole->id)->get();

        if ($managerUsers->isEmpty()) {
            $this->command->error('Tidak ada pengguna manager yang ditemukan. Harap jalankan UserSeeder terlebih dahulu.');
            return;
        }

        // Define industries for more variety
        $industries = [
            'Teknologi Informasi',
            'Keuangan & Perbankan',
            'Pendidikan',
            'Kesehatan',
            'Manufaktur',
            'Retail',
            'Makanan & Minuman',
            'Transportasi & Logistik',
            'Media & Hiburan',
            'Telekomunikasi',
            'Konstruksi',
            'Pariwisata & Perhotelan',
            'Otomotif',
            'Pertambangan',
            'Agrikultur',
            'E-commerce',
            'Konsultan',
            'Farmasi',
            'Asuransi',
            'Real Estate',
            'Jasa Hukum',
            'Energi',
            'Tekstil & Fashion',
            'Perikanan',
            'Furniture',
            'Elektronik',
            'Perhiasan & Aksesoris',
            'Olahraga',
            'Consumer Goods',
            'Food & Beverages',
            'Events Services',
            'Luxury Goods & Jewelry',
            'Automotive',
            'Consumer Electronics',
            'Food Production',
            'Education Management',
            'Real Estate'
        ];

        // Define cities for more variety
        $cities = [
            'Jakarta' => ['Pusat', 'Selatan', 'Barat', 'Timur', 'Utara'],
            'Surabaya' => ['Pusat', 'Timur', 'Barat', 'Selatan', 'Utara'],
            'Bandung' => ['Pusat', 'Timur', 'Barat', 'Selatan', 'Utara'],
            'Medan' => ['Pusat', 'Timur', 'Barat', 'Selatan', 'Utara'],
            'Semarang' => ['Pusat', 'Timur', 'Barat', 'Selatan', 'Utara'],
            'Makassar' => ['Pusat', 'Timur', 'Barat', 'Selatan', 'Utara'],
            'Yogyakarta' => ['Pusat', 'Timur', 'Barat', 'Selatan', 'Utara'],
            'Palembang' => [''],
            'Denpasar' => [''],
            'Balikpapan' => [''],
            'Malang' => [''],
            'Tangerang' => ['Selatan', ''],
            'Bogor' => [''],
            'Depok' => [''],
            'Bekasi' => ['']
        ];

        // Define company name prefixes and suffixes for more realistic names
        $companyPrefixes = [
            'PT', 'CV', 'UD', 'PD', 'Koperasi', 'Yayasan', 'Perusahaan', 'Grup',
            'Global', 'Nusa', 'Indo', 'Jaya', 'Karya', 'Sentosa', 'Abadi', 'Sejahtera',
            'Maju', 'Lestari', 'Prima', 'Utama', 'Mandiri', 'Bersama', 'Sinar', 'Mega',
            'Multi', 'Trans', 'Eka', 'Tri', 'Panca', 'Sapta', 'Bumi', 'Cipta'
        ];

        $companySuffixes = [
            'Teknologi', 'Digital', 'Sistem', 'Informatika', 'Solusi', 'Konsultan', 'Indonesia',
            'Nusantara', 'Makmur', 'Group', 'Internasional', 'Global', 'Sejahtera', 'Sukses',
            'Pratama', 'Jaya', 'Persada', 'Karya', 'Sentosa', 'Abadi', 'Makmur', 'Kreasi',
            'Utama', 'Bersama', 'Gemilang', 'Mitra', 'Prima', 'Mandiri', 'Citra', 'Indah',
            'Raya', 'Perkasa', 'Agung', 'Harmoni', 'Barokah', 'Berkah', 'Buana'
        ];

        // Create predefined companies first to ensure we have some
        // recognizable companies in the database
        $predefinedCompanies = [
            [
                'name' => 'PT Inovasi Teknologi Indonesia',
                'description' => 'Perusahaan teknologi terkemuka yang mengkhususkan diri dalam solusi inovatif untuk menghadapi tantangan digital masa kini. Kami memiliki keahlian dalam pengembangan aplikasi, keamanan siber, dan transformasi digital bagi berbagai sektor usaha.',
                'website' => 'https://inovasitech.co.id',
                'address' => 'Jl. Teknologi No. 123, Jakarta Selatan, DKI Jakarta',
                'phone' => '021-5551234',
                'email' => 'info@inovasitech.co.id',
                'industry' => 'Teknologi Informasi',
                'is_active' => true,
            ],
            [
                'name' => 'PT Grup Finansial Global',
                'description' => 'Perusahaan jasa keuangan terpercaya yang menyediakan solusi perbankan dan investasi inovatif dengan jaringan internasional. Kami melayani berbagai kebutuhan finansial mulai dari perbankan pribadi, perencanaan keuangan, hingga manajemen aset untuk korporasi dan individu.',
                'website' => 'https://globalfinansial.co.id',
                'address' => 'Jl. Sudirman No. 456, Jakarta Pusat, DKI Jakarta',
                'phone' => '021-5559876',
                'email' => 'info@globalfinansial.co.id',
                'industry' => 'Keuangan & Perbankan',
                'is_active' => true,
            ],
            [
                'name' => 'PT Kreasi Desain Indonesia',
                'description' => 'Agensi kreatif yang mengkhususkan diri dalam desain grafis, brand identity, dan strategi pemasaran visual. Kami menggabungkan kreativitas dengan pemahaman yang mendalam tentang prinsip-prinsip desain untuk menciptakan solusi visual yang menarik dan efektif bagi berbagai klien dari beragam industri.',
                'website' => 'https://kreasidesain.co.id',
                'address' => 'Jl. Kreatif No. 789, Bandung, Jawa Barat',
                'phone' => '022-5554567',
                'email' => 'info@kreasidesain.co.id',
                'industry' => 'Media & Hiburan',
                'is_active' => true,
            ],
            [
                'name' => 'PT Medika Sentosa',
                'description' => 'Jaringan pelayanan kesehatan terpadu yang berfokus pada kualitas layanan dan keselamatan pasien dengan fasilitas modern. Kami memiliki jaringan rumah sakit, klinik spesialis, dan pusat kesehatan dengan tenaga medis profesional dan peralatan diagnostik terkini.',
                'website' => 'https://medikasentosa.co.id',
                'address' => 'Jl. Kesehatan No. 101, Jakarta Timur, DKI Jakarta',
                'phone' => '021-5557890',
                'email' => 'info@medikasentosa.co.id',
                'industry' => 'Kesehatan',
                'is_active' => true,
            ],
            [
                'name' => 'PT Maju Jaya Konstruksi',
                'description' => 'Perusahaan konstruksi terpercaya dengan pengalaman luas dalam proyek-proyek infrastruktur, gedung komersial, dan perumahan. Kami menggabungkan keahlian teknik sipil, manajemen proyek yang efisien, dan komitmen terhadap keselamatan kerja untuk memberikan hasil konstruksi berkualitas tinggi.',
                'website' => 'https://majujayakonstruksi.co.id',
                'address' => 'Jl. Pembangun No. 234, Surabaya, Jawa Timur',
                'phone' => '031-5556789',
                'email' => 'info@majujayakonstruksi.co.id',
                'industry' => 'Konstruksi',
                'is_active' => true,
            ],
            [
                'name' => 'PT Agro Nusantara',
                'description' => 'Perusahaan agrikultur terdepan yang mengelola perkebunan dan pengolahan hasil pertanian dengan fokus pada kesinambungan dan teknologi pertanian modern. Kami mengintegrasikan praktik pertanian berkelanjutan dengan inovasi teknologi untuk menghasilkan produk-produk berkualitas tinggi yang ramah lingkungan.',
                'website' => 'https://agronusantara.co.id',
                'address' => 'Jl. Pertanian No. 567, Medan, Sumatera Utara',
                'phone' => '061-5558765',
                'email' => 'info@agronusantara.co.id',
                'industry' => 'Agrikultur',
                'is_active' => true,
            ],
            [
                'name' => 'PT Retail Maju Indonesia',
                'description' => 'Jaringan retail modern dengan ragam produk lengkap dan pengalaman belanja nyaman di berbagai kota besar Indonesia. Kami menawarkan berbagai pilihan produk mulai dari kebutuhan sehari-hari, elektronik, fashion, hingga perabotan rumah tangga dengan pelayanan pelanggan yang ramah dan profesional.',
                'website' => 'https://retailmaju.co.id',
                'address' => 'Jl. Shopping No. 890, Tangerang, Banten',
                'phone' => '021-5552345',
                'email' => 'info@retailmaju.co.id',
                'industry' => 'Retail',
                'is_active' => true,
            ],
            [
                'name' => 'PT Edu Cendekia',
                'description' => 'Lembaga pendidikan dengan kurikulum komprehensif dan metode pembelajaran inovatif untuk mengembangkan potensi optimal siswa. Kami memadukan pendidikan karakter, pengembangan keterampilan abad ke-21, dan keunggulan akademik untuk mempersiapkan peserta didik menghadapi tantangan global.',
                'website' => 'https://educendekia.co.id',
                'address' => 'Jl. Pendidikan No. 432, Yogyakarta, DI Yogyakarta',
                'phone' => '0274-5556543',
                'email' => 'info@educendekia.co.id',
                'industry' => 'Pendidikan',
                'is_active' => true,
            ],
            [
                'name' => 'PT Logistik Cepat Indonesia',
                'description' => 'Penyedia jasa logistik dan pengiriman dengan jaringan distribusi luas yang menjangkau seluruh wilayah Indonesia. Kami menawarkan layanan pengiriman yang cepat, aman, dan dapat dilacak dengan sistem manajemen logistik terintegrasi yang didukung teknologi terkini.',
                'website' => 'https://logistikcepat.co.id',
                'address' => 'Jl. Distribusi No. 321, Makassar, Sulawesi Selatan',
                'phone' => '0411-5554321',
                'email' => 'info@logistikcepat.co.id',
                'industry' => 'Transportasi & Logistik',
                'is_active' => true,
            ],
            [
                'name' => 'PT Digital Solusi Indonesia',
                'description' => 'Perusahaan solusi digital yang menyediakan layanan pengembangan perangkat lunak, konsultasi IT, dan transformasi digital bagi korporasi dan UMKM. Kami membantu organisasi memanfaatkan kekuatan teknologi digital untuk meningkatkan efisiensi operasional, memperluas jangkauan pasar, dan meningkatkan pengalaman pelanggan.',
                'website' => 'https://digitalsolusi.co.id',
                'address' => 'Jl. Digital No. 789, Jakarta Barat, DKI Jakarta',
                'phone' => '021-5553456',
                'email' => 'info@digitalsolusi.co.id',
                'industry' => 'Teknologi Informasi',
                'is_active' => true,
            ],
        ];

        // Create predefined companies
        foreach ($predefinedCompanies as $index => $companyData) {
            $company = Company::updateOrCreate(
                ['name' => $companyData['name']],
                $companyData
            );

            // Assign manager to company (if available)
            if ($managerUsers->count() > 0) {
                $managerIndex = $index % $managerUsers->count();
                CompanyManager::updateOrCreate(
                    [
                        'company_id' => $company->id,
                        'user_id' => $managerUsers[$managerIndex]->id,
                    ],
                    [
                        'is_primary' => true,
                    ]
                );
            }
        }

        // Generate additional random companies (total 100)
        $companyCount = 100 - count($predefinedCompanies);
        $this->command->info("Generating {$companyCount} additional random companies...");

        $bar = $this->command->getOutput()->createProgressBar($companyCount);
        $bar->start();

        for ($i = 0; $i < $companyCount; $i++) {
            // Generate random company name
            $prefix = $companyPrefixes[array_rand($companyPrefixes)];
            $coreName = $faker->company;
            $useSuffix = rand(0, 1);
            $suffix = $useSuffix ? $companySuffixes[array_rand($companySuffixes)] : '';

            $name = $prefix . ' ' . $coreName . ($useSuffix ? ' ' . $suffix : '');

            // Select random city and district
            $city = array_rand($cities);
            $districts = $cities[$city];
            $district = $districts[array_rand($districts)];
            $district = !empty($district) ? $district : '';
            $location = $district ? "{$city} {$district}" : $city;

            // Generate website
            $domain = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $coreName));
            $website = "https://www.{$domain}.co.id";

            // Generate email
            $email = "info@{$domain}.co.id";

            // Select random industry
            $industry = $industries[array_rand($industries)];

            // Create the company
            $company = Company::create([
                'name' => $name,
                'description' => $faker->paragraph(rand(3, 6)),
                'logo' => null, // Logo would be set by a file upload in real scenario
                'website' => $website,
                'address' => $faker->streetAddress . ', ' . $location . ', ' . $faker->state,
                'phone' => $faker->phoneNumber,
                'email' => $email,
                'industry' => $industry,
                'is_active' => rand(0, 9) > 1, // 90% chance to be active
            ]);

            // Assign a random manager
            if ($managerUsers->count() > 0) {
                $manager = $managerUsers->random();
                CompanyManager::create([
                    'company_id' => $company->id,
                    'user_id' => $manager->id,
                    'is_primary' => true,
                ]);

                // Some companies may have additional non-primary managers
                if (rand(0, 5) === 0 && $managerUsers->count() > 1) { // 20% chance
                    $secondaryManagers = $managerUsers->where('id', '!=', $manager->id)->random(rand(1, 2));
                    foreach ($secondaryManagers as $secondaryManager) {
                        CompanyManager::create([
                            'company_id' => $company->id,
                            'user_id' => $secondaryManager->id,
                            'is_primary' => false,
                        ]);
                    }
                }
            }

            $bar->advance();
        }

        $bar->finish();
        $this->command->newLine();
        $this->command->info('Company seeding completed successfully!');
    }
}
