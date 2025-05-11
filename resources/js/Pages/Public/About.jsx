import React from 'react';
import { Head } from '@inertiajs/react';
import PublicLayout from '@/Components/Layout/PublicLayout';
import Button from '@/Components/Shared/Button';
import Card from '@/Components/Shared/Card';
import { motion } from 'framer-motion';
import {
    Handshake as HandshakeIcon,
    Diversity3 as DiversityIcon,
    Lightbulb as LightbulbIcon,
    ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { Box, Typography, Container, Avatar, Stack } from '@mui/material';
import MuiThemeProvider from '@/Theme/MuiThemeProvider';

export default function About() {
    // Team members data
    const teamMembers = [
        {
            name: "Ahmad Rizki",
            position: "CEO & Founder",
            image: "https://randomuser.me/api/portraits/men/32.jpg",
            bio: "Berpengalaman lebih dari 10 tahun di industri teknologi dan rekrutmen.",
            linkedin: "#",
            twitter: "#",
            email: "ahmad@example.com"
        },
        {
            name: "Siti Nurhayati",
            position: "COO",
            image: "https://randomuser.me/api/portraits/women/44.jpg",
            bio: "Ahli dalam operasional bisnis dan pengembangan produk digital.",
            linkedin: "#",
            twitter: "#",
            email: "siti@example.com"
        },
        {
            name: "Budi Santoso",
            position: "CTO",
            image: "https://randomuser.me/api/portraits/men/68.jpg",
            bio: "Pakar teknologi dengan fokus pada pengembangan platform berbasis AI.",
            linkedin: "#",
            twitter: "#",
            email: "budi@example.com"
        },
        {
            name: "Dewi Anggraini",
            position: "Head of Marketing",
            image: "https://randomuser.me/api/portraits/women/65.jpg",
            bio: "Spesialis marketing digital dengan pengalaman di perusahaan teknologi terkemuka.",
            linkedin: "#",
            twitter: "#",
            email: "dewi@example.com"
        }
    ];

    return (
        <MuiThemeProvider>
            <PublicLayout>
                <Head title="Tentang Kami - Campus Job Portal" />

                {/* Header Section */}
                <Box
                    className="relative py-24 bg-gradient-to-br "
                    sx={{
                        position: 'relative',
                        py: { xs: 12, md: 24 },
                        background: 'linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)',
                        overflow: 'hidden'
                    }}
                >
                    <Box
                        className="absolute inset-0 opacity-10"
                        sx={{ position: 'absolute', inset: 0, opacity: 0.1 }}
                    >
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
                            </pattern>
                            <rect width="100" height="100" fill="url(#grid)" />
                        </svg>
                    </Box>

                    <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                        <motion.div
                            className="max-w-3xl mx-auto text-center"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <Typography
                                variant="subtitle1"
                                className="text-blue-300 font-bold mb-4 uppercase tracking-wider"
                                sx={{ color: 'primary.100', fontWeight: 'bold', mb: 2, letterSpacing: 2, textTransform: 'uppercase' }}
                            >
                                Tentang Kami
                            </Typography>
                            <Typography
                                variant="h2"
                                component="h1"
                                className="text-5xl font-bold text-white mb-6"
                                sx={{
                                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                                    fontWeight: 'bold',
                                    color: 'white',
                                    mb: 3
                                }}
                            >
                                Kami Menghubungkan Talenta dengan Peluang
                            </Typography>
                            <Typography
                                variant="h6"
                                className="text-xl text-blue-100 max-w-2xl mx-auto"
                                sx={{
                                    color: 'primary.50',
                                    maxWidth: '42rem',
                                    mx: 'auto',
                                    fontWeight: 'normal',
                                    lineHeight: 1.6
                                }}
                            >
                                Platform inovatif yang menghubungkan mahasiswa dan alumni kampus terbaik
                                dengan perusahaan-perusahaan berkualitas di seluruh Indonesia.
                            </Typography>
                        </motion.div>
                    </Container>
                </Box>

                {/* Company Stats Section */}
                <Box
                    className="py-16 bg-white relative z-10 -mt-10"
                    sx={{
                        py: 8,
                        bgcolor: 'background.paper',
                        position: 'relative',
                        zIndex: 10,
                        mt: -5
                    }}
                >
                    <Container maxWidth="lg">
                        <Box
                            sx={{
                                bgcolor: 'background.paper',
                                borderRadius: '1rem',
                                boxShadow: 5,
                                p: 4
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    flexWrap: 'wrap',
                                    gap: 4,
                                    justifyContent: 'space-between'
                                }}
                            >
                                <CompanyStat number="2018" label="Didirikan" />
                                <CompanyStat number="50+" label="Karyawan" />
                                <CompanyStat number="200+" label="Kampus Partner" />
                                <CompanyStat number="10K+" label="Penempatan Karir" />
                            </Box>
                        </Box>
                    </Container>
                </Box>

                {/* Story Section */}
                <Box
                    className="py-24"
                    sx={{ py: { xs: 10, md: 12 } }}
                >
                    <Container maxWidth="lg">
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', lg: 'row' },
                                alignItems: 'center',
                                gap: { xs: 6, md: 8 }
                            }}
                        >
                            <Box sx={{ width: { xs: '100%', lg: '50%' } }}>
                                <motion.div
                                    initial={{ opacity: 0, x: -50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8 }}
                                >
                                    <Box sx={{ position: 'relative' }}>
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                inset: -4,
                                                bgcolor: 'primary.50',
                                                borderTopLeftRadius: 24,
                                                borderBottomRightRadius: 24,
                                                zIndex: -1,
                                                transform: 'rotate(-3deg)'
                                            }}
                                        ></Box>
                                        <Box
                                            component="img"
                                            src="/images/about-mission.svg"
                                            alt="Misi Kami"
                                            sx={{
                                                width: '100%',
                                                height: 'auto',
                                                borderRadius: 2,
                                                boxShadow: 5,
                                                position: 'relative',
                                                zIndex: 1
                                            }}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://placehold.co/600x400?text=Cerita+Kami";
                                            }}
                                        />
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                bottom: -16,
                                                right: -16,
                                                bgcolor: 'primary.main',
                                                color: 'white',
                                                py: 1.5,
                                                px: 3,
                                                borderRadius: 2,
                                                fontWeight: 500,
                                                boxShadow: 2
                                            }}
                                        >
                                            Sejak 2018
                                        </Box>
                                    </Box>
                                </motion.div>
                            </Box>

                            <Box sx={{ width: { xs: '100%', lg: '50%' } }}>
                                <motion.div
                                    initial={{ opacity: 0, x: 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8 }}
                                >
                                    <Typography
                                        variant="subtitle1"
                                        sx={{
                                            color: 'primary.main',
                                            fontWeight: 'bold',
                                            mb: 1,
                                            letterSpacing: 1,
                                            textTransform: 'uppercase'
                                        }}
                                    >
                                        Cerita Kami
                                    </Typography>
                                    <Typography
                                        variant="h3"
                                        sx={{
                                            fontWeight: 'bold',
                                            color: 'text.primary',
                                            mb: 3
                                        }}
                                    >
                                        Menjembatani Pendidikan dan Industri
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            color: 'text.secondary',
                                            mb: 3,
                                            fontSize: '1.125rem',
                                            lineHeight: 1.6
                                        }}
                                    >
                                        Campus Job Portal didirikan pada tahun 2018 dengan visi untuk menciptakan ekosistem rekrutmen yang efisien
                                        bagi mahasiswa dan alumni perguruan tinggi.
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            color: 'text.secondary',
                                            mb: 3,
                                            fontSize: '1.125rem',
                                            lineHeight: 1.6
                                        }}
                                    >
                                        Kami memahami tantangan yang dihadapi fresh graduate dalam mencari pekerjaan pertama mereka,
                                        serta kesulitan perusahaan dalam menemukan talenta muda berkualitas.
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            color: 'text.secondary',
                                            mb: 4,
                                            fontSize: '1.125rem',
                                            lineHeight: 1.6
                                        }}
                                    >
                                        Dengan menggabungkan teknologi AI dan pemahaman mendalam tentang dunia rekrutmen,
                                        kami telah membantu lebih dari 10.000 lulusan menemukan karir impian mereka dan
                                        membantu ratusan perusahaan memenuhi kebutuhan talenta mereka.
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Avatar
                                            src="https://randomuser.me/api/portraits/men/32.jpg"
                                            alt="Founder"
                                            sx={{
                                                width: 64,
                                                height: 64,
                                                border: 4,
                                                borderColor: 'background.paper',
                                                boxShadow: 2,
                                                mr: 2
                                            }}
                                        />
                                        <Box>
                                            <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
                                                Ahmad Rizki
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'primary.main' }}>
                                                Founder & CEO
                                            </Typography>
                                        </Box>
                                    </Box>
                                </motion.div>
                            </Box>
                        </Box>
                    </Container>
                </Box>

                {/* Values Section */}
                <Box
                    className="py-24 bg-gray-50"
                    sx={{
                        py: { xs: 10, md: 12 },
                        bgcolor: 'grey.50'
                    }}
                >
                    <Container maxWidth="lg">
                        <motion.div
                            className="text-center mb-16"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    color: 'primary.main',
                                    fontWeight: 'bold',
                                    mb: 1,
                                    letterSpacing: 1,
                                    textTransform: 'uppercase',
                                    textAlign: 'center'
                                }}
                            >
                                Nilai-Nilai Kami
                            </Typography>
                            <Typography
                                variant="h3"
                                sx={{
                                    fontWeight: 'bold',
                                    color: 'text.primary',
                                    mb: 2,
                                    textAlign: 'center'
                                }}
                            >
                                Yang Kami Yakini
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    color: 'text.secondary',
                                    mb: 8,
                                    maxWidth: '42rem',
                                    mx: 'auto',
                                    textAlign: 'center',
                                    fontSize: '1.125rem'
                                }}
                            >
                                Nilai-nilai yang menjadi landasan dalam setiap keputusan dan langkah yang kami ambil
                            </Typography>
                        </motion.div>

                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', md: 'row' },
                                gap: 4
                            }}
                        >
                            <Box sx={{ width: { xs: '100%', md: '33.33%' } }}>
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.1 }}
                                >
                                    <ValueCard
                                        icon={<HandshakeIcon fontSize="large" />}
                                        title="Integritas"
                                        description="Kami menjalankan bisnis dengan kejujuran dan transparansi, membangun kepercayaan dengan semua pemangku kepentingan."
                                    />
                                </motion.div>
                            </Box>

                            <Box sx={{ width: { xs: '100%', md: '33.33%' } }}>
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                >
                                    <ValueCard
                                        icon={<DiversityIcon fontSize="large" />}
                                        title="Inklusivitas"
                                        description="Kami percaya pada kesempatan yang sama bagi semua, terlepas dari latar belakang, universitas, atau identitas pribadi."
                                    />
                                </motion.div>
                            </Box>

                            <Box sx={{ width: { xs: '100%', md: '33.33%' } }}>
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                >
                                    <ValueCard
                                        icon={<LightbulbIcon fontSize="large" />}
                                        title="Inovasi"
                                        description="Kami terus mengembangkan solusi inovatif untuk menghadirkan pengalaman terbaik bagi pencari kerja dan perusahaan."
                                    />
                                </motion.div>
                            </Box>
                        </Box>
                    </Container>
                </Box>

                {/* Team Section */}
                <Box
                    className="py-24"
                    sx={{ py: { xs: 10, md: 12 } }}
                >
                    <Container maxWidth="lg">
                        <motion.div
                            className="text-center mb-16"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    color: 'primary.main',
                                    fontWeight: 'bold',
                                    mb: 1,
                                    letterSpacing: 1,
                                    textTransform: 'uppercase',
                                    textAlign: 'center'
                                }}
                            >
                                Tim Kami
                            </Typography>
                            <Typography
                                variant="h3"
                                sx={{
                                    fontWeight: 'bold',
                                    color: 'text.primary',
                                    mb: 2,
                                    textAlign: 'center'
                                }}
                            >
                                Bertemu dengan Orang-Orang Hebat
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    color: 'text.secondary',
                                    mb: 8,
                                    maxWidth: '42rem',
                                    mx: 'auto',
                                    textAlign: 'center',
                                    fontSize: '1.125rem'
                                }}
                            >
                                Tim profesional berdedikasi yang bekerja keras untuk mewujudkan visi kami
                            </Typography>
                        </motion.div>

                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                flexWrap: 'wrap',
                                gap: 4
                            }}
                        >
                            {teamMembers.map((member, index) => (
                                <Box
                                    key={member.name}
                                    sx={{
                                        width: {
                                            xs: '100%',
                                            sm: 'calc(50% - 16px)',
                                            lg: 'calc(25% - 16px)'
                                        }
                                    }}
                                >
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                    >
                                        <TeamCard member={member} />
                                    </motion.div>
                                </Box>
                            ))}
                        </Box>
                    </Container>
                </Box>

                {/* CTA Section */}
                <Box
                    className="py-24 bg-gradient-to-br "
                    sx={{
                        py: { xs: 10, md: 12 },
                        background: 'linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <Box
                        className="absolute inset-0 opacity-10"
                        sx={{ position: 'absolute', inset: 0, opacity: 0.1 }}
                    >
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="none" stroke="white" strokeWidth="0.5"></path>
                            <path d="M0,0 L100,100 M100,0 L0,100" stroke="white" strokeWidth="0.5"></path>
                        </svg>
                    </Box>

                    <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                        <motion.div
                            className="max-w-4xl mx-auto text-center"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <Typography
                                variant="h3"
                                sx={{
                                    fontSize: { xs: '2rem', md: '2.5rem' },
                                    fontWeight: 'bold',
                                    color: 'white',
                                    mb: 3
                                }}
                            >
                                Bergabunglah dalam Perjalanan Karir Impian
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{
                                    color: 'primary.50',
                                    maxWidth: '42rem',
                                    mx: 'auto',
                                    mb: 5,
                                    fontWeight: 'normal'
                                }}
                            >
                                Apakah Anda siap untuk memulai perjalanan karir Anda atau mencari talenta terbaik bagi perusahaan Anda?
                            </Typography>
                            <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                spacing={2}
                                justifyContent="center"
                            >
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    className="bg-white text-blue-700 hover:bg-blue-50"
                                    size="large"
                                    href={route('register')}
                                    component="a"
                                    endIcon={<ArrowForwardIcon />}
                                    sx={{
                                        bgcolor: 'white',
                                        color: 'primary.main',
                                        px: 4,
                                        py: 1.5,
                                        fontWeight: 600,
                                        borderRadius: 2,
                                        '&:hover': {
                                            bgcolor: 'grey.100'
                                        }
                                    }}
                                >
                                    Daftar Sekarang
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    className="bg-transparent border-white text-white hover:bg-white/10"
                                    size="large"
                                    href={route('public.contact')}
                                    component="a"
                                    sx={{
                                        borderColor: 'white',
                                        color: 'white',
                                        px: 4,
                                        py: 1.5,
                                        fontWeight: 600,
                                        borderRadius: 2,
                                        '&:hover': {
                                            bgcolor: 'rgba(255,255,255,0.1)',
                                            borderColor: 'white'
                                        }
                                    }}
                                >
                                    Hubungi Kami
                                </Button>
                            </Stack>
                        </motion.div>
                    </Container>
                </Box>
            </PublicLayout>
        </MuiThemeProvider>
    );
}

// Company Stat Component
const CompanyStat = ({ number, label }) => {
    return (
        <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
        >
            <Box sx={{ textAlign: 'center', width: { xs: '100%', sm: 'auto' } }}>
                <Typography
                    variant="h3"
                    sx={{
                        fontSize: { xs: '2rem', md: '2.5rem' },
                        fontWeight: 800,
                        color: 'primary.main',
                        mb: 1
                    }}
                >
                    {number}
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    {label}
                </Typography>
            </Box>
        </motion.div>
    );
};

// Value Card Component
const ValueCard = ({ icon, title, description }) => {
    return (
        <Card
            sx={{
                p: 4,
                height: '100%',
                bgcolor: 'background.paper',
                transition: 'all 0.3s ease',
                '&:hover': {
                    boxShadow: 8,
                    transform: 'translateY(-8px)'
                },
                border: '1px solid',
                borderColor: 'grey.100',
                borderRadius: '1rem'
            }}
        >
            <Box
                sx={{
                    bgcolor: 'primary.50',
                    color: 'primary.main',
                    borderRadius: '50%',
                    width: 64,
                    height: 64,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3
                }}
            >
                {icon}
            </Box>
            <Typography
                variant="h5"
                sx={{
                    fontWeight: 600,
                    mb: 2,
                    color: 'text.primary'
                }}
            >
                {title}
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                {description}
            </Typography>
        </Card>
    );
};

// Team Card Component
const TeamCard = ({ member }) => {
    return (
        <Card
            sx={{
                p: 0,
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                    boxShadow: 8,
                    transform: 'translateY(-8px)'
                },
                border: '1px solid',
                borderColor: 'grey.100',
                borderRadius: '1rem',
                height: '100%'
            }}
            className="group"
        >
            <Box sx={{ position: 'relative', overflow: 'hidden', pt: '100%' }}>
                <Box
                    component="img"
                    src={member.image}
                    alt={member.name}
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                            transform: 'scale(1.05)'
                        }
                    }}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/300x300?text=Team+Member";
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                        '.group:hover &': {
                            opacity: 1
                        }
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        p: 2,
                        transform: 'translateY(100%)',
                        transition: 'transform 0.3s ease',
                        '.group:hover &': {
                            transform: 'translateY(0)'
                        }
                    }}
                >
                    <Stack direction="row" spacing={2} justifyContent="center">
                        <Box
                            component="a"
                            href={member.linkedin}
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.1)',
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                transition: 'background-color 0.3s ease',
                                '&:hover': {
                                    bgcolor: 'rgba(255,255,255,0.2)'
                                }
                            }}
                        >
                            <i className="fab fa-linkedin-in"></i>
                        </Box>
                        <Box
                            component="a"
                            href={member.twitter}
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.1)',
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                transition: 'background-color 0.3s ease',
                                '&:hover': {
                                    bgcolor: 'rgba(255,255,255,0.2)'
                                }
                            }}
                        >
                            <i className="fab fa-twitter"></i>
                        </Box>
                        <Box
                            component="a"
                            href={`mailto:${member.email}`}
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.1)',
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                transition: 'background-color 0.3s ease',
                                '&:hover': {
                                    bgcolor: 'rgba(255,255,255,0.2)'
                                }
                            }}
                        >
                            <i className="fas fa-envelope"></i>
                        </Box>
                    </Stack>
                </Box>
            </Box>
            <Box sx={{ p: 3 }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                        mb: 0.5
                    }}
                >
                    {member.name}
                </Typography>
                <Typography
                    variant="subtitle2"
                    sx={{
                        color: 'primary.main',
                        mb: 1
                    }}
                >
                    {member.position}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {member.bio}
                </Typography>
            </Box>
        </Card>
    );
};
