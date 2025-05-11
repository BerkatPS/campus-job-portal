import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    Typography,
    Box,
    Paper,
    TextField,
    MenuItem,
    useTheme,
    useMediaQuery,
    Divider,
    Alert,
    Container,
    IconButton
} from '@mui/material';
import { motion } from 'framer-motion';
import {
    LocationOn as LocationIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    AccessTime as ClockIcon,
    Send as SendIcon
} from '@mui/icons-material';
import Button from '@/Components/Shared/Button';
import Card from '@/Components/Shared/Card';
import PublicLayout from '@/Components/Layout/PublicLayout';
import MuiThemeProvider from '@/Theme/MuiThemeProvider';

// Contact information cards data
const contactInfoCards = [
    {
        icon: <LocationIcon fontSize="large" color="primary" />,
        title: 'Alamat Kami',
        content: 'Jl. Gatot Subroto No.123, Jakarta Selatan\nDKI Jakarta, Indonesia 12930'
    },
    {
        icon: <PhoneIcon fontSize="large" color="primary" />,
        title: 'Telepon & Fax',
        content: '+62 21 5678 9012\nFax: +62 21 5678 9013'
    },
    {
        icon: <EmailIcon fontSize="large" color="primary" />,
        title: 'Email',
        content: 'info@campusjob.id\nsupport@campusjob.id'
    },
    {
        icon: <ClockIcon fontSize="large" color="primary" />,
        title: 'Jam Operasional',
        content: 'Senin - Jumat: 09:00 - 17:00\nSabtu: 09:00 - 13:00'
    }
];

// FAQ data
const faqItems = [
    {
        question: 'Bagaimana cara mendaftar sebagai pencari kerja?',
        answer: 'Anda dapat mendaftar sebagai pencari kerja dengan mengklik tombol "Register" di bagian atas halaman dan mengisi formulir pendaftaran. Pastikan untuk memilih "Candidate" sebagai tipe akun Anda.'
    },
    {
        question: 'Apakah layanan ini gratis?',
        answer: 'Ya, layanan dasar kami gratis untuk para kandidat. Kami juga menawarkan layanan premium dengan fitur tambahan bagi perusahaan dan pencari kerja yang membutuhkan akses ke fitur lanjutan.'
    },
    {
        question: 'Bagaimana perusahaan dapat memposting lowongan?',
        answer: 'Perusahaan perlu mendaftar terlebih dahulu sebagai akun perusahaan. Setelah verifikasi, Anda dapat mengakses dashboard perusahaan dan memposting lowongan pekerjaan dari sana.'
    },
    {
        question: 'Berapa lama proses verifikasi akun perusahaan?',
        answer: 'Proses verifikasi akun perusahaan biasanya memakan waktu 1-2 hari kerja. Kami akan menghubungi Anda melalui email yang terdaftar setelah verifikasi selesai.'
    }
];

// Form inquiry options
const inquiryTypes = [
    { value: 'general', label: 'Pertanyaan Umum' },
    { value: 'support', label: 'Dukungan Teknis' },
    { value: 'billing', label: 'Billing dan Pembayaran' },
    { value: 'partnership', label: 'Kerjasama' },
    { value: 'feedback', label: 'Feedback dan Saran' }
];

const Contact = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        inquiryType: 'general',
        message: ''
    });

    const [formSubmitted, setFormSubmitted] = useState(false);
    const [formError, setFormError] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Form validation
        if (!formData.name || !formData.email || !formData.message) {
            setFormError(true);
            return;
        }

        // In a real app, you would submit the form data to the server here
        console.log('Form submitted:', formData);

        // Reset form after successful submission
        setFormData({
            name: '',
            email: '',
            phone: '',
            inquiryType: 'general',
            message: ''
        });

        setFormError(false);
        setFormSubmitted(true);

        // Reset success message after 5 seconds
        setTimeout(() => {
            setFormSubmitted(false);
        }, 5000);
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5
            }
        }
    };

    return (
        <MuiThemeProvider>
            <PublicLayout>
                <Head title="Hubungi Kami" />

                {/* Hero Section */}
                <Box
                    sx={{
                        position: 'relative',
                        backgroundImage: 'linear-gradient(135deg, #14b8a6 70%, #000DFF 100%)',
                        pt: { xs: 12, md: 15 },
                        pb: { xs: 10, md: 12 },
                        color: 'white',
                        overflow: 'hidden',
                    }}
                >
                    <Container maxWidth="lg">
                        <Box sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            gap: 3,
                            alignItems: 'center'
                        }}>
                            <Box sx={{ width: { xs: '100%', md: '58.33%' } }}>
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8 }}
                                >
                                    <Typography
                                        variant="h2"
                                        component="h1"
                                        sx={{
                                            fontWeight: 800,
                                            mb: 2,
                                            fontSize: { xs: '2.5rem', md: '3rem' }
                                        }}
                                    >
                                        Hubungi Kami
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            mb: 4,
                                            fontWeight: 'normal',
                                            opacity: 0.8,
                                            maxWidth: '90%',
                                            lineHeight: 1.6
                                        }}
                                    >
                                        Ada pertanyaan atau saran? Kami siap membantu Anda. Silakan hubungi kami melalui formulir di bawah ini atau melalui informasi kontak yang tersedia.
                                    </Typography>
                                </motion.div>
                            </Box>
                            <Box sx={{ width: { xs: '100%', md: '41.67%' } }}>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                >
                                    <Box
                                        component="img"
                                        src="/images/contact-illustration.jpg"
                                        alt="Contact Us"
                                        sx={{
                                            width: '100%',
                                            height: 'auto',
                                            maxHeight: 400,
                                            display: { xs: 'none', md: 'block' },
                                            filter: 'drop-shadow(0px 10px 15px rgba(0,0,0,0.2))'
                                        }}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://placehold.co/600x400?text=Contact+Us";
                                        }}
                                    />
                                </motion.div>
                            </Box>
                        </Box>
                    </Container>

                    {/* Decorative Elements */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: -100,
                            right: -100,
                            width: 300,
                            height: 300,
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.1)',
                            zIndex: 0
                        }}
                    />
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: -150,
                            left: -150,
                            width: 400,
                            height: 400,
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.05)',
                            zIndex: 0
                        }}
                    />
                </Box>

                {/* Contact Info Cards */}
                <Container maxWidth="lg" sx={{ mt: -8, mb: 10, position: 'relative', zIndex: 5 }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        flexWrap: 'wrap',
                        gap: 3
                    }}>
                        {contactInfoCards.map((card, index) => (
                            <Box
                                key={index}
                                sx={{
                                    width: {
                                        xs: '100%',
                                        sm: 'calc(50% - 12px)',
                                        md: 'calc(25% - 18px)'
                                    }
                                }}
                            >
                                <Paper
                                    elevation={5}
                                    sx={{
                                        p: 3,
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                        borderRadius: 3,
                                        transition: 'transform 0.3s, box-shadow 0.3s',
                                        '&:hover': {
                                            transform: 'translateY(-10px)',
                                            boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
                                        }
                                    }}
                                >
                                    <Box sx={{ mb: 2 }}>{card.icon}</Box>
                                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                                        {card.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                                        {card.content}
                                    </Typography>
                                </Paper>
                            </Box>
                        ))}
                    </Box>
                </Container>

                {/* Contact Form Section */}
                <Container maxWidth="lg" sx={{ py: 8 }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: 4
                    }}>
                        <Box sx={{ width: { xs: '100%', md: '50%' } }}>
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                            >
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontWeight: 700,
                                        mb: 3,
                                        color: 'text.primary'
                                    }}
                                >
                                    Kirim Pesan
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        color: 'text.secondary',
                                        mb: 4
                                    }}
                                >
                                    Isi formulir di bawah ini, dan tim kami akan menghubungi Anda kembali dalam waktu 24 jam.
                                </Typography>

                                <Box component="form" onSubmit={handleSubmit} noValidate>
                                    {formSubmitted && (
                                        <Alert
                                            severity="success"
                                            sx={{
                                                mb: 3,
                                                borderRadius: 2
                                            }}
                                        >
                                            Pesan Anda telah terkirim. Terima kasih telah menghubungi kami!
                                        </Alert>
                                    )}

                                    {formError && (
                                        <Alert
                                            severity="error"
                                            sx={{
                                                mb: 3,
                                                borderRadius: 2
                                            }}
                                        >
                                            Mohon isi semua field yang wajib diisi (Nama, Email, dan Pesan).
                                        </Alert>
                                    )}

                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: { xs: 'column', sm: 'row' },
                                        flexWrap: 'wrap',
                                        gap: 3,
                                        mb: 3
                                    }}>
                                        <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                                            <TextField
                                                label="Nama Lengkap"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                fullWidth
                                                required
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2
                                                    }
                                                }}
                                            />
                                        </Box>
                                        <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                                            <TextField
                                                label="Email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                fullWidth
                                                required
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2
                                                    }
                                                }}
                                            />
                                        </Box>
                                        <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                                            <TextField
                                                label="Nomor Telepon"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                fullWidth
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2
                                                    }
                                                }}
                                            />
                                        </Box>
                                        <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                                            <TextField
                                                select
                                                label="Jenis Pertanyaan"
                                                name="inquiryType"
                                                value={formData.inquiryType}
                                                onChange={handleChange}
                                                fullWidth
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2
                                                    }
                                                }}
                                            >
                                                {inquiryTypes.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Box>
                                    </Box>

                                    <Box sx={{ mb: 3 }}>
                                        <TextField
                                            label="Pesan"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            multiline
                                            rows={6}
                                            fullWidth
                                            required
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2
                                                }
                                            }}
                                        />
                                    </Box>

                                    <Box>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            size="large"
                                            startIcon={<SendIcon />}
                                            sx={{
                                                py: 1.5,
                                                px: 4,
                                                borderRadius: 2,
                                                boxShadow: '0 4px 14px 0 rgba(0, 0, 255, 0.39)',
                                                fontWeight: 600
                                            }}
                                        >
                                            Kirim Pesan
                                        </Button>
                                    </Box>
                                </Box>
                            </motion.div>
                        </Box>

                        <Box sx={{ width: { xs: '100%', md: '50%' } }}>
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                            >
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontWeight: 700,
                                        mb: 3,
                                        color: 'text.primary'
                                    }}
                                >
                                    Pertanyaan Umum
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        color: 'text.secondary',
                                        mb: 4
                                    }}
                                >
                                    Berikut adalah beberapa pertanyaan yang sering ditanyakan oleh pengguna kami.
                                </Typography>

                                <Box sx={{ mb: 4 }}>
                                    {faqItems.map((item, index) => (
                                        <Box key={index} sx={{ mb: 3 }}>
                                            <motion.div variants={itemVariants}>
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        fontWeight: 600,
                                                        mb: 1,
                                                        color: 'text.primary'
                                                    }}
                                                >
                                                    {item.question}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: 'text.secondary',
                                                        mb: 2,
                                                        lineHeight: 1.6
                                                    }}
                                                >
                                                    {item.answer}
                                                </Typography>
                                                {index < faqItems.length - 1 && (
                                                    <Divider sx={{ my: 3 }} />
                                                )}
                                            </motion.div>
                                        </Box>
                                    ))}
                                </Box>

                                <Box sx={{ mt: 4 }}>
                                    <Paper
                                        sx={{
                                            p: 3,
                                            borderRadius: 3,
                                            bgcolor: 'primary.50',
                                            border: '1px solid',
                                            borderColor: 'primary.100',
                                        }}
                                    >
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 600,
                                                mb: 1,
                                                color: 'text.primary'
                                            }}
                                        >
                                            Belum menemukan jawaban?
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: 'text.secondary',
                                                mb: 2,
                                                lineHeight: 1.6
                                            }}
                                        >
                                            Jika Anda memiliki pertanyaan khusus yang tidak tercantum di sini, silakan hubungi tim dukungan kami.
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            href="mailto:support@campusjob.id"
                                            sx={{
                                                borderRadius: 2,
                                                fontWeight: 500
                                            }}
                                        >
                                            support@campusjob.id
                                        </Button>
                                    </Paper>
                                </Box>
                            </motion.div>
                        </Box>
                    </Box>
                </Container>

                {/* Map Section */}
                <Box sx={{ height: 400, width: '100%', mt: 8 }}>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.2834792283087!2d106.8208842149486!3d-6.224110195493855!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3f8cf5dddb7%3A0x33073868489fcd10!2sJl.%20Gatot%20Subroto%2C%20Jakarta!5e0!3m2!1sen!2sid!4v1646646495000!5m2!1sen!2sid"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        title="Our Location"
                    ></iframe>
                </Box>
            </PublicLayout>
        </MuiThemeProvider>
    );
};

export default Contact;
