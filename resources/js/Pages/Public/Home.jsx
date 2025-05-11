import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Components/Layout/PublicLayout';
import Button from '@/Components/Shared/Button';
import Card from '@/Components/Shared/Card';
import { motion } from 'framer-motion';
import {
    Search as SearchIcon,
    BusinessCenter as BusinessIcon,
    AssignmentInd as AssignmentIcon,
    ArrowForward as ArrowForwardIcon,
    ChevronRight as ChevronRightIcon,
    LightbulbOutlined as LightbulbIcon,
    ComputerOutlined as ComputerIcon,
    ChatOutlined as ChatIcon,
    TrendingUp as TrendingUpIcon,
    LocationOn as LocationIcon,
    AttachMoney as MoneyIcon,
    AccessTime as TimeIcon
} from '@mui/icons-material';

export default function Home({ auth, latestJobs = [] }) {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Fake job data for demonstration
    const demoJobs = [
        {
            id: 1,
            title: "Frontend Developer",
            company: "Tech Innovators",
            logo: "https://randomuser.me/api/portraits/men/32.jpg",
            location: "Jakarta",
            type: "Full-time",
            salary: "Rp 8.000.000 - Rp 12.000.000",
            postedDate: "2024-04-20"
        },
        {
            id: 2,
            title: "Marketing Specialist",
            company: "Digital Solutions",
            logo: "https://randomuser.me/api/portraits/women/44.jpg",
            location: "Bandung",
            type: "Part-time",
            salary: "Rp 5.000.000 - Rp 7.000.000",
            postedDate: "2024-04-22"
        },
        {
            id: 3,
            title: "UI/UX Designer",
            company: "Creative Studio",
            logo: "https://randomuser.me/api/portraits/women/65.jpg",
            location: "Surabaya (Remote)",
            type: "Remote",
            salary: "Rp 10.000.000 - Rp 15.000.000",
            postedDate: "2024-04-25"
        }
    ];

    const jobs = latestJobs.length > 0 ? latestJobs : demoJobs;

    return (
        <PublicLayout>
            <Head title="Home - Campus Job Portal" />

            {/* Hero Section with Parallax */}
            <div className="relative h-screen overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700">
                <motion.div
                    className="absolute inset-0 w-full h-full"
                    style={{
                        backgroundImage: 'url(/images/hero-pattern.svg)',
                        backgroundSize: 'cover',
                        y: scrollY * 0.5,
                        opacity: 0.2
                    }}
                />

                {/* Animated Shapes */}
                <div className="absolute top-20 left-20 w-64 h-64 bg-primary-300 rounded-full mix-blend-overlay filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-40 right-20 w-72 h-72 bg-secondary-300 rounded-full mix-blend-overlay filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-20 left-40 w-56 h-56 bg-primary-400 rounded-full mix-blend-overlay filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

                <div className="absolute inset-0 bg-gradient-to-r from-primary-900/80 to-primary-700/80" />

                <div className="container mx-auto px-6 h-full flex flex-col justify-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-3xl"
                    >
                        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white leading-tight mb-6">
                            Temukan <span className="text-primary-200">Karir Impianmu</span> Mulai Sekarang
                        </h1>
                        <p className="text-xl text-primary-100 mb-10 max-w-2xl">
                            Platform karir kampus #1 di Indonesia yang menghubungkan mahasiswa dan alumni
                            dengan perusahaan-perusahaan terbaik
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Link href={route('public.jobs.index')}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    size="large"
                                    className="px-8 py-3 text-lg rounded-xl transition-all hover:shadow-lg hover:shadow-primary-500/20 hover:-translate-y-1"
                                    endIcon={<ArrowForwardIcon />}
                                >
                                    Cari Lowongan
                                </Button>
                            </Link>
                            {!auth.user && (
                                <Link href={route('register')}>
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        className="bg-transparent border-white text-white hover:bg-white/10 px-8 py-3 text-lg rounded-xl"
                                    >
                                        Daftar Gratis
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </motion.div>

                    <motion.div
                        className="absolute bottom-0 right-0 -mb-24 mr-0 sm:mr-12 lg:mr-24 xl:mr-48 hidden lg:block"
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <img
                            src="/images/hero-illustration.svg"
                            alt="Job Search Illustration"
                            className="w-full max-w-xl h-auto filter drop-shadow-2xl"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://placehold.co/600x400?text=Career+Illustration";
                            }}
                        />
                    </motion.div>

                    <div className="absolute bottom-8 left-0 right-0 flex justify-center">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 1 }}
                            className="animate-bounce"
                        >
                            <ChevronRightIcon className="text-white transform rotate-90" fontSize="large" />
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="py-16 bg-primary-50">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                        <StatCard number="1,200+" label="Perusahaan" icon={<BusinessIcon fontSize="large" className="text-primary-500" />} />
                        <StatCard number="25,000+" label="Lowongan" icon={<AssignmentIcon fontSize="large" className="text-primary-500" />} />
                        <StatCard number="50,000+" label="Pencari Kerja" icon={<TrendingUpIcon fontSize="large" className="text-primary-500" />} />
                        <StatCard number="10,000+" label="Penempatan Kerja" icon={<LightbulbIcon fontSize="large" className="text-primary-500" />} />
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h6 className="text-primary-600 font-bold mb-2 uppercase tracking-wider">Fitur Unggulan</h6>
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">Temukan Kemudahan Mencari Kerja</h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Platform kami menyediakan berbagai fitur yang akan memudahkan perjalanan karir Anda
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <FeatureCard
                                icon={<SearchIcon fontSize="large" />}
                                title="Pencarian Cerdas"
                                description="Temukan lowongan yang sesuai dengan keahlian dan minat Anda dengan sistem pencarian cerdas berbasis AI."
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <FeatureCard
                                icon={<ComputerIcon fontSize="large" />}
                                title="Perusahaan Terpercaya"
                                description="Hanya berpartner dengan perusahaan terverifikasi untuk menjamin kualitas dan keamanan karir Anda."
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <FeatureCard
                                icon={<ChatIcon fontSize="large" />}
                                title="Manajemen Lamaran"
                                description="Pantau semua lamaran Anda dari satu dashboard terintegrasi dan dapatkan notifikasi real-time."
                            />
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Latest Jobs Section */}
            <div className="py-24 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h6 className="text-primary-600 font-bold mb-2 uppercase tracking-wider">Lowongan Terkini</h6>
                            <h2 className="text-4xl font-bold text-gray-800">Temukan Lowongan Baru</h2>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <Link href={route('public.jobs.index')}>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    endIcon={<ArrowForwardIcon />}
                                    className="rounded-xl"
                                >
                                    Lihat Semua Lowongan
                                </Button>
                            </Link>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {jobs.map((job, index) => (
                            <motion.div
                                key={job.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <JobCard job={job} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Testimonials Section */}
            <div className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h6 className="text-primary-600 font-bold mb-2 uppercase tracking-wider">Testimonial</h6>
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">Kisah Sukses</h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Dengarkan pengalaman dari mereka yang telah sukses menemukan karir impian melalui platform kami
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <TestimonialCard
                                name="Andi Pratama"
                                role="Frontend Developer"
                                company="Tech Innovators"
                                image="https://randomuser.me/api/portraits/men/1.jpg"
                                quote="Campus Job Portal membantu saya mendapatkan pekerjaan pertama saya setelah lulus. Fitur AI matching sangat akurat merekomendasikan pekerjaan yang sesuai dengan skill saya."
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <TestimonialCard
                                name="Budi Santoso"
                                role="Marketing Specialist"
                                company="Digital Solutions"
                                image="https://randomuser.me/api/portraits/men/2.jpg"
                                quote="Antarmuka yang intuitif dan banyaknya lowongan berkualitas membuat saya mudah menemukan posisi yang tepat. Dalam waktu 2 minggu saya sudah mendapatkan panggilan interview."
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <TestimonialCard
                                name="Dewi Anggraini"
                                role="UI/UX Designer"
                                company="Creative Studio"
                                image="https://randomuser.me/api/portraits/women/1.jpg"
                                quote="Dalam satu minggu mendaftar, saya sudah mendapatkan tiga panggilan wawancara! Platform ini membuka banyak peluang bagi fresh graduate seperti saya."
                            />
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-24 bg-gradient-to-br from-primary-700 to-primary-900 relative overflow-hidden">
                {/* Background Decorative Elements */}
                <div className="absolute top-20 right-20 w-64 h-64 bg-primary-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>
                <div className="absolute bottom-20 left-20 w-72 h-72 bg-secondary-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>

                <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="none" stroke="white" strokeWidth="0.5"></path>
                        <path d="M0,0 L100,100 M100,0 L0,100" stroke="white" strokeWidth="0.5"></path>
                    </svg>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <motion.div
                        className="max-w-4xl mx-auto text-center"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Siap Memulai Perjalanan Karir Impianmu?
                        </h2>
                        <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
                            Bergabunglah dengan ribuan mahasiswa dan alumni yang telah menemukan karir mereka melalui STIA Bayu Angga Loker
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href={route('public.jobs.index')}>
                                <Button
                                    variant="contained"
                                    className="bg-white text-primary-700 hover:bg-primary-50 px-8 py-3 text-lg rounded-xl"
                                    size="large"
                                >
                                    Cari Lowongan
                                </Button>
                            </Link>
                            {!auth.user && (
                                <Link href={route('register')}>
                                    <Button
                                        variant="outlined"
                                        className="bg-transparent border-white text-white hover:bg-white/10 px-8 py-3 text-lg rounded-xl"
                                        size="large"
                                    >
                                        Buat Akun
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </PublicLayout>
    );
}

// Feature Card Component
const FeatureCard = ({ icon, title, description }) => {
    return (
        <Card className="p-8 h-full bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 rounded-2xl">
            <div className="bg-primary-100 text-primary-600 rounded-2xl w-16 h-16 flex items-center justify-center mb-6">
                {icon}
            </div>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </Card>
    );
};

// Job Card Component
const JobCard = ({ job }) => {
    const dateDiff = getDateDifference(job.postedDate);

    return (
        <Card className="p-6 h-full bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 rounded-2xl">
            <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden mr-4 flex-shrink-0 bg-gray-100 border border-gray-200">
                    <img
                        src={job.logo}
                        alt={job.company}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://placehold.co/100x100?text=Company";
                        }}
                    />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{job.title}</h3>
                    <p className="text-gray-600 text-sm">{job.company}</p>
                </div>
            </div>

            <div className="mb-4 space-y-2">
                <div className="flex items-center">
                    <LocationIcon fontSize="small" className="text-gray-400 mr-2" />
                    <span className="text-gray-500 text-sm">{job.location}</span>
                </div>
                <div className="flex items-center">
                    <MoneyIcon fontSize="small" className="text-gray-400 mr-2" />
                    <span className="text-gray-500 text-sm">{job.salary}</span>
                </div>
            </div>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                <span className={`text-xs px-3 py-1 rounded-full ${
                    job.type === 'Full-time' ? 'bg-primary-100 text-primary-800' :
                        job.type === 'Part-time' ? 'bg-secondary-100 text-secondary-800' :
                            'bg-purple-100 text-purple-800'
                }`}>
                    {job.type}
                </span>
                <div className="flex items-center text-xs text-gray-500">
                    <TimeIcon fontSize="small" className="text-gray-400 mr-1" style={{ fontSize: '0.75rem' }} />
                    {dateDiff}
                </div>
            </div>
        </Card>
    );
};

// Testimonial Card Component
const TestimonialCard = ({ name, role, company, image, quote }) => {
    return (
        <Card className="p-6 h-full bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-2 border border-gray-100 rounded-2xl">
            <div className="mb-6 text-primary-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197L9.758 4.03c0 0-.218.052-.597.144-.377.13-.892.258-1.432.468-.565.221-1.182.4-1.774.754-.596.33-1.193.753-1.704 1.268-.526.51-.993 1.09-1.42 1.638-.43.551-.796 1.117-1.07 1.741-.275.601-.513 1.19-.592 1.753-.164.891-.03 1.668.356 2.241.385.666.998 1.13 1.722 1.357.292.09.62.158.985.165.365.008.786-.04 1.186-.15.602-.142 1.205-.407 1.7-.798.484-.389.847-.865 1.077-1.412.23-.551.32-1.13.245-1.755-.07-.625-.329-1.163-.711-1.585-.381-.432-.896-.724-1.466-.876-.57-.15-1.232-.19-1.873-.082-.637.11-1.294.35-1.825.782-.534.368-1.082.898-1.275 1.579-.198.671-.06 1.583.573 2.14.627.554 1.64.77 2.768.584 1.127-.187 2.262-.726 3.11-1.471.845-.751 1.276-1.71 1.292-2.662.013-.953-.441-1.861-1.157-2.522C9.1 8.507 7.762 8.07 6.5 8.07c-.998 0-1.817.812-1.817 1.817 0 1.004.816 1.82 1.817 1.82.483 0 .918-.2 1.228-.523.309-.326.491-.766.491-1.254 0-.492-.182-.934-.494-1.26-.306-.322-.741-.523-1.225-.523zm11.83 0c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197l-.484-1.828c0 0-.218.052-.597.144-.377.13-.892.258-1.432.468-.565.221-1.182.4-1.774.754-.596.33-1.193.753-1.704 1.268-.526.51-.993 1.09-1.42 1.638-.43.551-.796 1.117-1.07 1.741-.275.601-.513 1.19-.592 1.753-.164.891-.03 1.668.356 2.241.385.666.998 1.13 1.722 1.357.292.09.62.158.985.165.365.008.786-.04 1.186-.15.602-.142 1.205-.407 1.7-.798.484-.389.847-.865 1.077-1.412.23-.551.32-1.13.245-1.755-.07-.625-.329-1.163-.711-1.585-.381-.432-.896-.724-1.466-.876-.57-.15-1.232-.19-1.873-.082-.637.11-1.294.35-1.825.782-.534.368-1.082.898-1.275 1.579-.198.671-.06 1.583.573 2.14.627.554 1.64.77 2.768.584 1.127-.187 2.262-.726 3.11-1.471.845-.751 1.276-1.71 1.292-2.662.013-.953-.441-1.861-1.157-2.522-1.152-1.072-2.491-1.508-3.753-1.508-.998 0-1.817.812-1.817 1.817 0 1.004.816 1.82 1.817 1.82.483 0 .918-.2 1.228-.523.309-.326.491-.766.491-1.254 0-.492-.182-.934-.494-1.26-.306-.322-.741-.523-1.225-.523z" />
                </svg>
            </div>
            <p className="text-gray-600 italic mb-6">{quote}</p>
            <div className="flex items-center mt-auto pt-4 border-t border-gray-100">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-primary-100">
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://placehold.co/100x100?text=Person";
                        }}
                    />
                </div>
                <div>
                    <h4 className="font-semibold text-gray-800">{name}</h4>
                    <p className="text-gray-500 text-sm">{role} di {company}</p>
                </div>
            </div>
        </Card>
    );
};

// Stat Card Component
const StatCard = ({ number, label, icon }) => {
    return (
        <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
        >
            <div className="inline-flex items-center justify-center mb-4">
                <div className="bg-primary-100 text-primary-600 rounded-2xl w-16 h-16 flex items-center justify-center">
                    {icon}
                </div>
            </div>
            <div className="text-4xl font-extrabold text-primary-600 mb-2">{number}</div>
            <div className="text-gray-600">{label}</div>
        </motion.div>
    );
};

// Helper function to get date difference
const getDateDifference = (dateString) => {
    const now = new Date();
    const postedDate = new Date(dateString);
    const diffTime = Math.abs(now - postedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return "Hari ini";
    } else if (diffDays === 1) {
        return "Kemarin";
    } else if (diffDays < 7) {
        return `${diffDays} hari yang lalu`;
    } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `${weeks} minggu yang lalu`;
    } else {
        const months = Math.floor(diffDays / 30);
        return `${months} bulan yang lalu`;
    }
};
