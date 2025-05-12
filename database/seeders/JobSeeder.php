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

        // Sample job titles and descriptions (more than 20 jobs with Indonesian content)
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
                'salary_min' => 8000000,
                'salary_max' => 15000000,
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
                'salary_min' => 9000000,
                'salary_max' => 16000000,
                'is_salary_visible' => true,
                'vacancies' => 1,
            ],
            [
                'title' => 'Data Analyst',
                'description' => 'Bergabunglah dengan tim analitik kami sebagai Data Analyst untuk membantu kami membuat keputusan berbasis data.',
                'requirements' => "- Gelar Sarjana di bidang Statistik, Matematika, atau bidang terkait\n- Pengalaman 1+ tahun dalam analisis data\n- Kemampuan dalam SQL, Excel, dan alat visualisasi data\n- Pengalaman dengan Python atau R\n- Keterampilan analitis dan pemecahan masalah yang kuat",
                'responsibilities' => "- Menganalisis data dan mengidentifikasi tren\n- Membuat dan memelihara dashboard\n- Menghasilkan laporan dan wawasan\n- Mendukung keputusan bisnis dengan data\n- Berkolaborasi dengan tim lintas fungsi",
                'benefits' => "- Gaji yang kompetitif\n- Asuransi kesehatan dan gigi\n- Tunjangan hari raya\n- Kesempatan untuk terus belajar\n- Jadwal kerja fleksibel",
                'location' => 'Surabaya',
                'job_type' => 'Full-time',
                'experience_level' => '1-3 tahun',
                'salary_min' => 7000000,
                'salary_max' => 12000000,
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
                'salary_min' => 15000000,
                'salary_max' => 25000000,
                'is_salary_visible' => true,
                'vacancies' => 1,
            ],
            [
                'title' => 'Customer Support Specialist',
                'description' => 'Bergabunglah dengan tim dukungan pelanggan kami untuk memberikan layanan terbaik kepada pelanggan kami.',
                'requirements' => "- Ijazah SMA atau setara\n- Pengalaman 1+ tahun dalam layanan pelanggan\n- Keterampilan komunikasi yang sangat baik\n- Kemampuan memecahkan masalah\n- Kesabaran dan empati",
                'responsibilities' => "- Menanggapi pertanyaan pelanggan melalui email, telepon, dan chat\n- Memecahkan masalah dan memberikan solusi\n- Meningkatkan masalah kompleks kepada tim terkait\n- Mempertahankan kepuasan pelanggan\n- Mencatat interaksi pelanggan",
                'benefits' => "- Gaji yang kompetitif\n- Asuransi kesehatan\n- Cuti berbayar\n- Diskon karyawan\n- Pengembangan profesional",
                'location' => 'Bali',
                'job_type' => 'Part-time',
                'experience_level' => '0-2 tahun',
                'salary_min' => 3000000,
                'salary_max' => 5000000,
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
                'salary_min' => 10000000,
                'salary_max' => 18000000,
                'is_salary_visible' => true,
                'vacancies' => 2,
            ],
            [
                'title' => 'Manajer SDM',
                'description' => 'Pimpin departemen SDM dan kelola semua aspek hubungan karyawan.',
                'requirements' => "- Gelar Sarjana di bidang Sumber Daya Manusia atau bidang terkait\n- Pengalaman 5+ tahun dalam sumber daya manusia\n- Pengetahuan yang kuat tentang hukum ketenagakerjaan dan kebijakan HR\n- Keterampilan kepemimpinan dan komunikasi yang sangat baik\n- Kemampuan untuk menyelesaikan konflik dan mengelola hubungan karyawan",
                'responsibilities' => "- Mengawasi rekrutmen dan pengisian posisi\n- Mengelola hubungan karyawan dan menyelesaikan konflik\n- Mengembangkan dan menerapkan kebijakan HR\n- Memantau dan memastikan kepatuhan terhadap hukum ketenagakerjaan\n- Memimpin inisiatif HR dan program pelatihan",
                'benefits' => "- Gaji yang kompetitif\n- Asuransi kesehatan\n- Bonus kinerja\n- Keseimbangan kerja-hidup\n- Kesempatan pengembangan profesional",
                'location' => 'Medan',
                'job_type' => 'Full-time',
                'experience_level' => '5-7 tahun',
                'salary_min' => 15000000,
                'salary_max' => 25000000,
                'is_salary_visible' => true,
                'vacancies' => 1,
            ],
            [
                'title' => 'Manajer Proyek',
                'description' => 'Pimpin tim proyek untuk memastikan keberhasilan pengiriman proyek.',
                'requirements' => "- Gelar Sarjana di bidang Bisnis, Teknik, atau bidang terkait\n- Pengalaman 4+ tahun dalam manajemen proyek\n- Keterampilan kepemimpinan dan komunikasi yang kuat\n- Kemahiran dalam alat manajemen proyek\n- Kemampuan untuk mengelola beberapa proyek secara bersamaan",
                'responsibilities' => "- Mengembangkan rencana dan jadwal proyek\n- Memimpin tim proyek dan menetapkan tugas\n- Memastikan tenggat waktu proyek terpenuhi\n- Berkomunikasi dengan pemangku kepentingan dan melaporkan kemajuan\n- Menyelesaikan masalah dan risiko proyek",
                'benefits' => "- Gaji yang kompetitif\n- Asuransi kesehatan dan gigi\n- Program pensiun\n- Keseimbangan kerja-hidup\n- Kesempatan pengembangan kepemimpinan",
                'location' => 'Surabaya',
                'job_type' => 'Full-time',
                'experience_level' => '4-6 tahun',
                'salary_min' => 12000000,
                'salary_max' => 20000000,
                'is_salary_visible' => true,
                'vacancies' => 1,
            ],
            [
                'title' => 'Frontend Developer',
                'description' => 'Kami mencari Frontend Developer untuk membangun antarmuka pengguna yang menarik dan responsif.',
                'requirements' => "- Gelar Sarjana di bidang Ilmu Komputer atau setara\n- Pengalaman 2+ tahun dalam pengembangan frontend\n- Keahlian dalam HTML, CSS, dan JavaScript\n- Pengalaman dengan React, Vue.js, atau Angular\n- Pemahaman tentang desain responsif dan kompatibilitas lintas browser",
                'responsibilities' => "- Mengembangkan antarmuka pengguna yang menarik dan responsif\n- Mengimplementasikan desain UI/UX ke dalam kode\n- Mengoptimalkan aplikasi untuk kecepatan dan skalabilitas\n- Berkolaborasi dengan desainer dan pengembang backend\n- Memastikan kualitas kode dan praktik terbaik",
                'benefits' => "- Gaji kompetitif\n- Asuransi kesehatan\n- Tunjangan transportasi\n- Lingkungan kerja yang dinamis\n- Program pengembangan karir",
                'location' => 'Jakarta',
                'job_type' => 'Full-time',
                'experience_level' => '2-4 tahun',
                'salary_min' => 8000000,
                'salary_max' => 15000000,
                'is_salary_visible' => true,
                'vacancies' => 2,
            ],
            [
                'title' => 'Content Writer',
                'description' => 'Kami mencari Content Writer kreatif untuk menghasilkan konten yang menarik dan informatif untuk berbagai platform.',
                'requirements' => "- Gelar Sarjana di bidang Jurnalisme, Komunikasi, atau setara\n- Pengalaman 1+ tahun dalam penulisan konten\n- Kemampuan menulis yang sangat baik dalam Bahasa Indonesia dan Inggris\n- Pemahaman tentang SEO dan tren konten digital\n- Kreativitas dan kemampuan untuk menyampaikan ide dengan jelas",
                'responsibilities' => "- Membuat konten berkualitas tinggi untuk website, blog, dan media sosial\n- Melakukan riset dan menulis tentang berbagai topik\n- Mengedit dan memperbaiki konten yang ada\n- Mengoptimalkan konten untuk SEO\n- Berkolaborasi dengan tim pemasaran dan desain",
                'benefits' => "- Gaji yang kompetitif\n- Tunjangan kesehatan\n- Jam kerja fleksibel\n- Lingkungan kerja yang kreatif\n- Kesempatan untuk berkembang",
                'location' => 'Yogyakarta',
                'job_type' => 'Full-time',
                'experience_level' => '1-3 tahun',
                'salary_min' => 5000000,
                'salary_max' => 8000000,
                'is_salary_visible' => true,
                'vacancies' => 1,
            ],
            [
                'title' => 'Digital Marketing Specialist',
                'description' => 'Bergabunglah dengan tim pemasaran kami untuk mengelola kampanye digital dan meningkatkan kehadiran online kami.',
                'requirements' => "- Gelar Sarjana di bidang Pemasaran atau terkait\n- Pengalaman 2+ tahun dalam pemasaran digital\n- Pemahaman mendalam tentang media sosial, SEO, dan SEM\n- Pengalaman dengan Google Analytics dan alat pemasaran digital lainnya\n- Keterampilan analitis dan kreativitas yang tinggi",
                'responsibilities' => "- Mengelola kampanye pemasaran digital\n- Mengoptimalkan strategi SEO dan SEM\n- Mengelola akun media sosial perusahaan\n- Menganalisis kinerja kampanye dan menyajikan laporan\n- Mengidentifikasi dan menerapkan tren pemasaran terbaru",
                'benefits' => "- Gaji kompetitif\n- Paket tunjangan lengkap\n- Lingkungan kerja yang dinamis\n- Pelatihan dan pengembangan berkelanjutan\n- Kesempatan networking",
                'location' => 'Jakarta',
                'job_type' => 'Full-time',
                'experience_level' => '2-4 tahun',
                'salary_min' => 8000000,
                'salary_max' => 15000000,
                'is_salary_visible' => false,
                'vacancies' => 1,
            ],
            [
                'title' => 'Graphic Designer',
                'description' => 'Kami mencari Graphic Designer berbakat untuk membuat desain visual yang menarik untuk berbagai platform.',
                'requirements' => "- Gelar di bidang Desain Grafis atau setara\n- Pengalaman 2+ tahun dalam desain grafis\n- Kemahiran dalam Adobe Creative Suite (Photoshop, Illustrator, InDesign)\n- Portofolio desain yang mengesankan\n- Pemahaman yang baik tentang tren desain terkini",
                'responsibilities' => "- Membuat aset visual untuk platform digital dan cetak\n- Merancang materi pemasaran, termasuk brosur, banner, dan media sosial\n- Memastikan konsistensi identitas merek\n- Berkolaborasi dengan tim pemasaran dan produk\n- Mengoptimalkan aset desain untuk berbagai platform",
                'benefits' => "- Gaji yang kompetitif\n- Asuransi kesehatan\n- Lingkungan kerja kreatif\n- Jam kerja fleksibel\n- Pengembangan profesional",
                'location' => 'Bandung',
                'job_type' => 'Full-time',
                'experience_level' => '2-4 tahun',
                'salary_min' => 6000000,
                'salary_max' => 12000000,
                'is_salary_visible' => true,
                'vacancies' => 1,
            ],
            [
                'title' => 'Quality Assurance Engineer',
                'description' => 'Kami mencari QA Engineer teliti untuk memastikan kualitas tinggi dari produk software kami.',
                'requirements' => "- Gelar di bidang Ilmu Komputer atau setara\n- Pengalaman 2+ tahun dalam pengujian software\n- Pengetahuan tentang metodologi dan alat pengujian\n- Kemampuan mengidentifikasi dan mendokumentasikan bug\n- Pemahaman tentang siklus pengembangan software",
                'responsibilities' => "- Merancang dan mengeksekusi kasus uji\n- Melakukan pengujian fungsional dan regresi\n- Melaporkan dan melacak bug\n- Berkolaborasi dengan tim pengembangan untuk menyelesaikan masalah\n- Memastikan kualitas produk sebelum rilis",
                'benefits' => "- Gaji yang kompetitif\n- Asuransi kesehatan\n- Tunjangan makan dan transportasi\n- Lingkungan kerja yang kolaboratif\n- Kesempatan pengembangan karir",
                'location' => 'Jakarta',
                'job_type' => 'Full-time',
                'experience_level' => '2-4 tahun',
                'salary_min' => 7000000,
                'salary_max' => 13000000,
                'is_salary_visible' => true,
                'vacancies' => 2,
            ],
            [
                'title' => 'Business Analyst',
                'description' => 'Kami mencari Business Analyst untuk menjembatani kesenjangan antara bisnis dan TI.',
                'requirements' => "- Gelar di bidang Bisnis, Teknologi, atau setara\n- Pengalaman 3+ tahun sebagai analis bisnis\n- Keterampilan analitis dan pemecahan masalah yang kuat\n- Pemahaman tentang proses bisnis dan sistem TI\n- Keterampilan komunikasi yang sangat baik",
                'responsibilities' => "- Mengidentifikasi dan menilai kebutuhan bisnis\n- Mendokumentasikan proses dan persyaratan\n- Menganalisis data untuk mendukung keputusan bisnis\n- Berkolaborasi dengan pemangku kepentingan dan tim teknis\n- Memantau dan melaporkan metrik kinerja",
                'benefits' => "- Gaji yang kompetitif\n- Asuransi kesehatan komprehensif\n- Program bonus tahunan\n- Pengembangan profesional\n- Keseimbangan kerja-hidup",
                'location' => 'Jakarta',
                'job_type' => 'Full-time',
                'experience_level' => '3-5 tahun',
                'salary_min' => 12000000,
                'salary_max' => 20000000,
                'is_salary_visible' => true,
                'vacancies' => 1,
            ],
            [
                'title' => 'DevOps Engineer',
                'description' => 'Bergabunglah dengan tim infrastruktur kami sebagai DevOps Engineer untuk mengelola dan mengoptimalkan pipeline CI/CD kami.',
                'requirements' => "- Gelar di bidang Ilmu Komputer atau setara\n- Pengalaman 3+ tahun dalam praktik DevOps\n- Pengetahuan mendalam tentang Docker, Kubernetes, dan CI/CD\n- Pengalaman dengan AWS, Azure, atau GCP\n- Keterampilan scripting (Python, Bash)",
                'responsibilities' => "- Mengelola dan mengotomatisasi infrastruktur\n- Mengimplementasikan dan mengelola pipeline CI/CD\n- Memantau dan mengoptimalkan kinerja sistem\n- Berkolaborasi dengan tim pengembangan untuk deployment\n- Memastikan keamanan dan keandalan sistem",
                'benefits' => "- Gaji di atas rata-rata industri\n- Asuransi kesehatan komprehensif\n- Bonus kinerja\n- Kesempatan untuk bekerja dengan teknologi terbaru\n- Lingkungan kerja yang fleksibel",
                'location' => 'Jakarta',
                'job_type' => 'Full-time',
                'experience_level' => '3-5 tahun',
                'salary_min' => 15000000,
                'salary_max' => 25000000,
                'is_salary_visible' => true,
                'vacancies' => 1,
            ],
            [
                'title' => 'Sales Executive',
                'description' => 'Bergabunglah dengan tim penjualan kami untuk memperluas basis pelanggan dan meningkatkan pendapatan.',
                'requirements' => "- Gelar Sarjana di bidang apapun\n- Pengalaman 2+ tahun dalam penjualan B2B\n- Keterampilan komunikasi dan negosiasi yang sangat baik\n- Kemampuan membangun hubungan dengan pelanggan\n- Motivasi tinggi dan berorientasi pada target",
                'responsibilities' => "- Mengidentifikasi dan mengejar peluang penjualan baru\n- Membangun dan memelihara hubungan dengan klien\n- Melakukan presentasi dan demonstrasi produk\n- Bernegosiasi dan menutup penjualan\n- Mencapai dan melampaui target penjualan",
                'benefits' => "- Gaji pokok + komisi menarik\n- Asuransi kesehatan\n- Insentif kinerja\n- Pelatihan dan pengembangan\n- Kesempatan perjalanan bisnis",
                'location' => 'Jakarta',
                'job_type' => 'Full-time',
                'experience_level' => '2-4 tahun',
                'salary_min' => 7000000,
                'salary_max' => 15000000,
                'is_salary_visible' => false,
                'vacancies' => 3,
            ],
            [
                'title' => 'Product Manager',
                'description' => 'Kami mencari Product Manager untuk memimpin pengembangan dan peluncuran produk inovatif kami.',
                'requirements' => "- Gelar di bidang Bisnis, Teknik, atau setara\n- Pengalaman 4+ tahun dalam manajemen produk\n- Pemahaman tentang metodologi pengembangan produk\n- Keterampilan analitis dan strategi yang kuat\n- Kemampuan untuk bekerja dengan berbagai pemangku kepentingan",
                'responsibilities' => "- Mendefinisikan visi dan strategi produk\n- Mengelola roadmap dan backlog produk\n- Berkolaborasi dengan tim pengembangan, desain, dan pemasaran\n- Menganalisis kebutuhan pasar dan pelanggan\n- Memantau kinerja produk dan membuat penyesuaian",
                'benefits' => "- Gaji yang sangat kompetitif\n- Asuransi kesehatan premium\n- Bonus tahunan\n- Kesempatan untuk memimpin inovasi\n- Lingkungan kerja yang dinamis",
                'location' => 'Jakarta',
                'job_type' => 'Full-time',
                'experience_level' => '4-6 tahun',
                'salary_min' => 18000000,
                'salary_max' => 30000000,
                'is_salary_visible' => true,
                'vacancies' => 1,
            ],
            [
                'title' => 'Customer Success Manager',
                'description' => 'Bergabunglah dengan tim kami untuk memastikan kepuasan dan retensi pelanggan.',
                'requirements' => "- Gelar Sarjana di bidang bisnis atau terkait\n- Pengalaman 3+ tahun dalam manajemen akun atau kesuksesan pelanggan\n- Keterampilan komunikasi dan interpersonal yang sangat baik\n- Kemampuan untuk memahami kebutuhan pelanggan\n- Pemikiran strategis dan berorientasi pada solusi",
                'responsibilities' => "- Membangun dan memelihara hubungan dengan pelanggan kunci\n- Memastikan penyerapan dan penggunaan produk yang optimal\n- Mengidentifikasi peluang pertumbuhan dalam basis pelanggan\n- Menangani masalah pelanggan dan memastikan resolusi\n- Melacak dan melaporkan metrik kesuksesan pelanggan",
                'benefits' => "- Gaji yang kompetitif\n- Asuransi kesehatan\n- Bonus retensi pelanggan\n- Pengembangan profesional\n- Lingkungan kerja yang kolaboratif",
                'location' => 'Jakarta',
                'job_type' => 'Full-time',
                'experience_level' => '3-5 tahun',
                'salary_min' => 10000000,
                'salary_max' => 18000000,
                'is_salary_visible' => true,
                'vacancies' => 1,
            ],
            [
                'title' => 'Mobile Developer (Android)',
                'description' => 'Kami mencari Mobile Developer untuk membangun dan meningkatkan aplikasi Android kami.',
                'requirements' => "- Gelar di bidang Ilmu Komputer atau setara\n- Pengalaman 3+ tahun dalam pengembangan Android\n- Kemahiran dalam Java atau Kotlin\n- Pemahaman tentang arsitektur aplikasi dan prinsip desain\n- Pengalaman dengan API RESTful dan integrasi backend",
                'responsibilities' => "- Mengembangkan dan memelihara aplikasi Android berkualitas tinggi\n- Berkolaborasi dengan tim desain dan backend\n- Mengimplementasikan fitur baru dan memperbaiki bug\n- Mengoptimalkan performa aplikasi\n- Berpartisipasi dalam code review dan dokumentasi",
                'benefits' => "- Gaji yang kompetitif\n- Asuransi kesehatan\n- Tunjangan perangkat\n- Lingkungan kerja yang fleksibel\n- Kesempatan untuk bekerja dengan teknologi terbaru",
                'location' => 'Jakarta',
                'job_type' => 'Full-time',
                'experience_level' => '3-5 tahun',
                'salary_min' => 10000000,
                'salary_max' => 18000000,
                'is_salary_visible' => true,
                'vacancies' => 1,
            ],
            [
                'title' => 'Mobile Developer (iOS)',
                'description' => 'Bergabunglah dengan tim kami untuk mengembangkan aplikasi iOS yang inovatif dan user-friendly.',
                'requirements' => "- Gelar di bidang Ilmu Komputer atau setara\n- Pengalaman 3+ tahun dalam pengembangan iOS\n- Kemahiran dalam Swift dan Objective-C\n- Pemahaman tentang pola desain iOS dan praktik terbaik\n- Pengalaman dengan Apple Human Interface Guidelines",
                'responsibilities' => "- Mengembangkan dan memelihara aplikasi iOS berkualitas tinggi\n- Berkolaborasi dengan desainer dan pengembang backend\n- Mengimplementasikan UI responsif dan fitur yang intuitif\n- Mengoptimalkan aplikasi untuk performa dan kepuasan pengguna\n- Memecahkan masalah teknis dan memperbaiki bug",
                'benefits' => "- Gaji yang kompetitif\n- Asuransi kesehatan\n- Tunjangan perangkat Apple\n- Lingkungan kerja yang kreatif\n- Kesempatan untuk berinovasi",
                'location' => 'Jakarta',
                'job_type' => 'Full-time',
                'experience_level' => '3-5 tahun',
                'salary_min' => 10000000,
                'salary_max' => 18000000,
                'is_salary_visible' => true,
                'vacancies' => 1,
            ],
            [
                'title' => 'Network Administrator',
                'description' => 'Kami mencari Network Administrator untuk mengelola dan mengamankan infrastruktur jaringan kami.',
                'requirements' => "- Gelar di bidang TI, Jaringan, atau setara\n- Pengalaman 3+ tahun dalam administrasi jaringan\n- Sertifikasi jaringan (CCNA, CCNP)\n- Pengetahuan mendalam tentang protokol jaringan dan keamanan\n- Kemampuan troubleshooting yang kuat",
                'responsibilities' => "- Mengelola dan memelihara infrastruktur jaringan\n- Memastikan keamanan jaringan dan pencadangan data\n- Merencanakan dan mengimplementasikan upgrade jaringan\n- Merespons dan menyelesaikan masalah jaringan\n- Mendokumentasikan konfigurasi dan prosedur jaringan",
                'benefits' => "- Gaji yang kompetitif\n- Asuransi kesehatan\n- Tunjangan sertifikasi\n- Lingkungan kerja yang stabil\n- Pengembangan profesional berkelanjutan",
                'location' => 'Jakarta',
                'job_type' => 'Full-time',
                'experience_level' => '3-5 tahun',
                'salary_min' => 9000000,
                'salary_max' => 15000000,
                'is_salary_visible' => true,
                'vacancies' => 1,
            ],
            [
                'title' => 'Database Administrator',
                'description' => 'Kami mencari Database Administrator untuk mengelola dan mengoptimalkan infrastruktur database kami.',
                'requirements' => "- Gelar di bidang Ilmu Komputer atau setara\n- Pengalaman 3+ tahun dalam administrasi database\n- Keahlian dalam MySQL, PostgreSQL, atau MongoDB\n- Pemahaman yang kuat tentang desain database dan optimasi kueri\n- Pengalaman dengan backup, replikasi, dan disaster recovery",
                'responsibilities' => "- Mengelola dan memelihara database perusahaan\n- Mengoptimalkan performa database\n- Mengimplementasikan strategi backup dan recovery\n- Memastikan keamanan dan integritas data\n- Berkolaborasi dengan tim pengembangan untuk desain database",
                'benefits' => "- Gaji yang kompetitif\n- Asuransi kesehatan komprehensif\n- Bonus kinerja\n- Lingkungan kerja yang stabil\n- Kesempatan pengembangan profesional",
                'location' => 'Jakarta',
                'job_type' => 'Full-time',
                'experience_level' => '3-5 tahun',
                'salary_min' => 12000000,
                'salary_max' => 20000000,
                'is_salary_visible' => true,
                'vacancies' => 1,
            ],
            [
                'title' => 'Customer Experience Specialist',
                'description' => 'Bergabunglah dengan tim kami untuk memberikan pengalaman pelanggan yang luar biasa.',
                'requirements' => "- Minimal lulusan D3\n- Pengalaman 1+ tahun dalam layanan pelanggan\n- Keterampilan komunikasi yang sangat baik\n- Kemampuan untuk menangani situasi yang sulit dengan tenang\n- Berorientasi pada detail dan pemecahan masalah",
                'responsibilities' => "- Merespon dan menyelesaikan pertanyaan pelanggan melalui berbagai saluran\n- Memberikan pengalaman pelanggan yang luar biasa\n- Mengidentifikasi dan meningkatkan proses layanan pelanggan\n- Berkolaborasi dengan tim produk untuk feedback pelanggan\n- Menganalisis data kepuasan pelanggan",
                'benefits' => "- Gaji yang kompetitif\n- Asuransi kesehatan\n- Lingkungan kerja yang dinamis\n- Pengembangan karir\n- Jadwal kerja yang fleksibel",
                'location' => 'Jakarta',
                'job_type' => 'Full-time',
                'experience_level' => '1-3 tahun',
                'salary_min' => 5000000,
                'salary_max' => 8000000,
                'is_salary_visible' => true,
                'vacancies' => 2,
            ],
        ];

        // Create jobs for each company and assign hiring stages
        foreach ($companies as $company) {
            // Each company gets a subset of jobs
            $companyJobs = array_slice($jobs, 0, rand(3, count($jobs)));

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
