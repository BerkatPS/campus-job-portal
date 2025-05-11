<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Job;
use App\Models\HiringStage;
use App\Models\JobHiringStage;
use Illuminate\Database\Seeder;

class JobSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all companies
        $companies = Company::all();

        // Get default hiring stages
        $hiringStages = HiringStage::where('is_default', true)->orderBy('order_index')->get();

        // Sample job titles and descriptions (20 jobs with Indonesian locations)
        $jobs = [
            [
                'title' => 'Software Engineer',
                'description' => 'Kami mencari Software Engineer yang terampil untuk bergabung dengan tim pengembangan kami.',
                'requirements' => "- Gelar Sarjana di bidang Ilmu Komputer atau bidang terkait\n- Pengalaman 2+ tahun dalam pengembangan web\n- Kemampuan dalam PHP, Laravel, JavaScript\n- Pengalaman dengan framework front-end seperti React atau Vue.js\n- Keterampilan dalam memecahkan masalah",
                'responsibilities' => "- Mengembangkan dan memelihara aplikasi web\n- Menulis kode yang bersih, efisien, dan terdokumentasi dengan baik\n- Berkolaborasi dengan tim lintas fungsi\n- Berpartisipasi dalam review kode\n- Memecahkan masalah dan melakukan debugging aplikasi",
                'benefits' => "- Gaji yang kompetitif\n- Asuransi kesehatan\n- Jam kerja fleksibel\n- Kesempatan pengembangan profesional\n- Lingkungan kantor yang modern",
                'location' => 'Jakarta',
                'job_type' => 'Full-time',
                'experience_level' => '2-4 tahun',
                'salary_min' => 50000,
                'salary_max' => 80000,
                'is_salary_visible' => true,
                'vacancies' => 2,
            ],
            [
                'title' => 'UI/UX Designer',
                'description' => 'Kami mencari UI/UX Designer kreatif untuk menciptakan pengalaman pengguna yang luar biasa.',
                'requirements' => "- Gelar Sarjana di bidang Desain, HCI, atau bidang terkait\n- Pengalaman 3+ tahun dalam desain UI/UX\n- Kemampuan dalam alat desain seperti Figma, Sketch, Adobe XD\n- Portofolio yang menunjukkan keterampilan desain\n- Pemahaman tentang prinsip desain yang berfokus pada pengguna",
                'responsibilities' => "- Membuat desain yang berfokus pada pengguna\n- Mengembangkan wireframe, prototipe, dan alur pengguna\n- Melakukan riset dan pengujian pengguna\n- Berkolaborasi dengan pengembang dan manajer produk\n- Tetap terupdate dengan tren desain terbaru",
                'benefits' => "- Gaji yang kompetitif\n- Asuransi kesehatan\n- Jam kerja fleksibel\n- Lingkungan kerja yang kreatif\n- Anggaran untuk pengembangan profesional",
                'location' => 'Bandung',
                'job_type' => 'Full-time',
                'experience_level' => '3-5 tahun',
                'salary_min' => 60000,
                'salary_max' => 90000,
                'is_salary_visible' => true,
                'vacancies' => 1,
            ],
            [
                'title' => 'Data Analyst',
                'description' => 'Bergabunglah dengan tim analitik kami sebagai Data Analyst untuk membantu kami membuat keputusan berbasis data.',
                'requirements' => "- Gelar Sarjana di bidang Statistik, Matematika, atau bidang terkait\n- Pengalaman 1+ tahun dalam analisis data\n- Kemampuan dalam SQL, Excel, dan alat visualisasi data\n- Pengalaman dengan Python atau R\n- Keterampilan analitis dan pemecahan masalah yang kuat",
                'responsibilities' => "- Menganalisis data dan mengidentifikasi tren\n- Membuat dan memelihara dashboard\n- Menghasilkan laporan dan wawasan\n- Mendukung keputusan bisnis dengan data\n- Berkolaborasi dengan tim lintas fungsi",
                'benefits' => "- Gaji yang kompetitif\n- Asuransi kesehatan dan gigi\n- 401(k) matching\n- Kesempatan untuk terus belajar\n- Jadwal kerja fleksibel",
                'location' => 'Surabaya',
                'job_type' => 'Full-time',
                'experience_level' => '1-3 tahun',
                'salary_min' => 45000,
                'salary_max' => 70000,
                'is_salary_visible' => false,
                'vacancies' => 1,
            ],
            [
                'title' => 'Marketing Manager',
                'description' => 'Pimpin upaya pemasaran kami untuk meningkatkan kesadaran merek dan akuisisi pelanggan.',
                'requirements' => "- Gelar Sarjana di bidang Pemasaran, Bisnis, atau bidang terkait\n- Pengalaman 5+ tahun dalam pemasaran\n- Pengalaman dengan saluran pemasaran digital\n- Keterampilan manajemen proyek yang kuat\n- Komunikasi tertulis dan lisan yang sangat baik",
                'responsibilities' => "- Mengembangkan dan menerapkan strategi pemasaran\n- Mengelola kampanye pemasaran dan anggaran\n- Menganalisis kinerja kampanye\n- Memimpin tim profesional pemasaran\n- Berkolaborasi dengan tim penjualan dan produk",
                'benefits' => "- Gaji yang kompetitif\n- Paket tunjangan komprehensif\n- Bonus kinerja\n- Pengembangan profesional\n- Pengaturan kerja yang fleksibel",
                'location' => 'Yogyakarta',
                'job_type' => 'Full-time',
                'experience_level' => '5-7 tahun',
                'salary_min' => 80000,
                'salary_max' => 120000,
                'is_salary_visible' => true,
                'vacancies' => 1,
            ],
            [
                'title' => 'Customer Support Specialist',
                'description' => 'Bergabunglah dengan tim dukungan pelanggan kami untuk memberikan layanan terbaik kepada pelanggan kami.',
                'requirements' => "- Ijazah SMA atau setara\n- Pengalaman 1+ tahun dalam layanan pelanggan\n- Keterampilan komunikasi yang sangat baik\n- Kemampuan memecahkan masalah\n- Kesabaran dan empati",
                'responsibilities' => "- Menanggapi pertanyaan pelanggan melalui email, telepon, dan chat\n- Memecahkan masalah dan memberikan solusi\n- Meningkatkan masalah kompleks kepada tim terkait\n- Mempertahankan kepuasan pelanggan\n- Mencatat interaksi pelanggan",
                'benefits' => "- Tarif per jam yang kompetitif\n- Asuransi kesehatan\n- Cuti berbayar\n- Diskon karyawan\n- Pengembangan profesional",
                'location' => 'Bali',
                'job_type' => 'Part-time',
                'experience_level' => '0-2 tahun',
                'salary_min' => 30000,
                'salary_max' => 40000,
                'is_salary_visible' => false,
                'vacancies' => 3,
            ],
            [
                'title' => 'Backend Developer',
                'description' => 'Bergabunglah dengan tim pengembangan kami sebagai Backend Developer untuk membantu kami membangun sistem server yang kuat.',
                'requirements' => "- Gelar Sarjana di bidang Ilmu Komputer atau bidang terkait\n- Pengalaman 3+ tahun dalam pengembangan backend\n- Keahlian dalam Node.js, Python, atau Ruby\n- Pemahaman yang kuat tentang basis data (SQL dan NoSQL)\n- Pengalaman dengan platform cloud seperti AWS atau Azure",
                'responsibilities' => "- Mengembangkan logika server-side dan API\n- Memelihara dan mengoptimalkan infrastruktur backend\n- Berkolaborasi dengan pengembang frontend\n- Memecahkan masalah dan debugging masalah server\n- Menulis kode yang bersih dan dapat diskalakan",
                'benefits' => "- Gaji yang kompetitif\n- Asuransi kesehatan\n- Cuti berbayar\n- Opsi kerja remote\n- Kesempatan untuk berkembang dalam karier",
                'location' => 'Jakarta',
                'job_type' => 'Full-time',
                'experience_level' => '3-5 tahun',
                'salary_min' => 70000,
                'salary_max' => 100000,
                'is_salary_visible' => true,
                'vacancies' => 2,
            ],
            [
                'title' => 'HR Manager',
                'description' => 'Pimpin departemen HR dan kelola semua aspek hubungan karyawan.',
                'requirements' => "- Gelar Sarjana di bidang Sumber Daya Manusia atau bidang terkait\n- Pengalaman 5+ tahun dalam sumber daya manusia\n- Pengetahuan yang kuat tentang hukum ketenagakerjaan dan kebijakan HR\n- Keterampilan kepemimpinan dan komunikasi yang sangat baik\n- Kemampuan untuk menyelesaikan konflik dan mengelola hubungan karyawan",
                'responsibilities' => "- Mengawasi rekrutmen dan pengisian posisi\n- Mengelola hubungan karyawan dan menyelesaikan konflik\n- Mengembangkan dan menerapkan kebijakan HR\n- Memantau dan memastikan kepatuhan terhadap hukum ketenagakerjaan\n- Memimpin inisiatif HR dan program pelatihan",
                'benefits' => "- Gaji yang kompetitif\n- Asuransi kesehatan\n- Bonus kinerja\n- Keseimbangan kerja-hidup\n- Kesempatan pengembangan profesional",
                'location' => 'Medan',
                'job_type' => 'Full-time',
                'experience_level' => '5-7 tahun',
                'salary_min' => 90000,
                'salary_max' => 130000,
                'is_salary_visible' => true,
                'vacancies' => 1,
            ],
            [
                'title' => 'Project Manager',
                'description' => 'Lead project teams to ensure successful project delivery.',
                'requirements' => "- Bachelor’s degree in Business, Engineering, or related field\n- 4+ years of experience in project management\n- Strong leadership and communication skills\n- Proficiency in project management tools\n- Ability to manage multiple projects simultaneously",
                'responsibilities' => "- Develop project plans and schedules\n- Lead project teams and assign tasks\n- Ensure project deadlines are met\n- Communicate with stakeholders and report on progress\n- Resolve project issues and risks",
                'benefits' => "- Competitive salary\n- Health and dental insurance\n- Retirement plan\n- Work-life balance\n- Leadership development opportunities",
                'location' => 'Surabaya',
                'job_type' => 'Full-time',
                'experience_level' => '4-6 tahun',
                'salary_min' => 85000,
                'salary_max' => 120000,
                'is_salary_visible' => true,
                'vacancies' => 1,
            ],
            // Add more jobs here...
        ];

        // Create jobs for each company and assign hiring stages
        foreach ($companies as $company) {
            // Each company gets a subset of jobs
            $companyJobs = array_slice($jobs, 0, rand(1, count($jobs)));

            foreach ($companyJobs as $jobData) {
                // Create job
                $job = Job::create(array_merge($jobData, [
                    'company_id' => $company->id,
                    'submission_deadline' => now()->addDays(rand(14, 30))->format('Y-m-d'),
                    'is_active' => true,
                ]));

                // Assign hiring stages to job
                foreach ($hiringStages as $index => $stage) {
                    JobHiringStage::create([
                        'job_id' => $job->id,
                        'hiring_stage_id' => $stage->id,
                        'order_index' => $index + 1,
                    ]);
                }
            }

            // Remove used jobs so next company gets different ones
            $jobs = array_diff_key($jobs, array_flip(array_keys($companyJobs)));

            // If we've used all jobs, reset the array
            if (empty($jobs)) {
                $allJobs = $jobs;
                $jobs = $allJobs;
            }
        }
    }
}
