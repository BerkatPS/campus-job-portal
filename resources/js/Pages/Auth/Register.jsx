import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Box, Container, Typography, TextField, InputAdornment, IconButton, Fade } from '@mui/material';
import { Lock as LockIcon, Email as EmailIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import { motion } from 'framer-motion';
import Button from '@/Components/Shared/Button';
import Card from '@/Components/Shared/Card';
import Alert from '@/Components/Shared/Alert';
import { useTheme } from '@mui/material/styles';
import MuiThemeProvider from "@/theme/MuiThemeProvider.jsx";
import SweetAlert from '@/Components/Shared/SweetAlert'; // Import SweetAlert component

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        nim: '',
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);

    // State untuk SweetAlert
    const [alertProps, setAlertProps] = useState({
        title: null,
        text: null,
        icon: null
    });

    const theme = useTheme();

    // Fungsi untuk menampilkan error dengan SweetAlert
    const showErrorAlert = (title, message) => {
        setAlertProps({
            title: title,
            text: message,
            icon: 'error'
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validasi format NIM di client sebelum kirim ke server
        const nimPattern = /^\d{2}\d{2}\.\d{4}$/;
        if (!nimPattern.test(data.nim)) {
            showErrorAlert('Format NIM Tidak Valid', );
            return;
        }

        post(route('register'), {
            onError: (errors) => {
                // Prioritaskan pesan error
                if (errors.message) {
                    showErrorAlert('Registrasi Gagal', errors.message);
                } else if (errors.nim) {
                    showErrorAlert('Format NIM Tidak Valid', errors.nim);
                } else if (errors.email) {
                    showErrorAlert('Email Tidak Valid', errors.email);
                } else if (errors.password) {
                    showErrorAlert('Password Tidak Valid', errors.password);
                } else if (errors.name) {
                    showErrorAlert('Nama Tidak Valid', errors.name);
                } else if (errors.password_confirmation) {
                    showErrorAlert('Konfirmasi Password Tidak Cocok', errors.password_confirmation);
                }
            }
        });
    };

    useEffect(() => {
        document.title = 'Daftar - CampusJob';

        // Cek jika ada errors dari server saat pertama kali render
        if (Object.keys(errors).length > 0) {
            // Prioritaskan pesan error
            if (errors.message) {
                showErrorAlert('Registrasi Gagal', errors.message);
            } else if (errors.nim) {
                showErrorAlert('Format NIM Tidak Valid', errors.nim);
            } else if (errors.email) {
                showErrorAlert('Email Tidak Valid', errors.email);
            } else if (errors.password) {
                showErrorAlert('Password Tidak Valid', errors.password);
            } else if (errors.name) {
                showErrorAlert('Nama Tidak Valid', errors.name);
            } else if (errors.password_confirmation) {
                showErrorAlert('Konfirmasi Password Tidak Cocok', errors.password_confirmation);
            }
        }
    }, [errors]);

    // Fungsi untuk membantu mencegah registrasi dengan format NIM yang salah di sisi client
    const validateNIM = (nim) => {
        // Pattern untuk format NIM: YYCC.NNNN
        const pattern = /^\d{2}\d{2}\.\d{4}$/;
        return pattern.test(nim);
    };

    // Handler untuk input NIM dengan validasi
    const handleNIMChange = (e) => {
        const nim = e.target.value;
        setData('nim', nim);

        // Validasi hanya jika panjang NIM sudah mencukupi
        if (nim.length >= 7 && !validateNIM(nim)) {
            // Tampilkan helper text untuk field, tapi jangan gunakan SweetAlert
            // karena bisa mengganggu pengalaman pengguna
        }
    };

    return (
        <MuiThemeProvider>
            {/* SweetAlert component */}
            {alertProps.title && (
                <SweetAlert
                    title={alertProps.title}
                    text={alertProps.text}
                    icon={alertProps.icon}
                    onClose={() => setAlertProps({ title: null, text: null, icon: null })}
                />
            )}

            <Box
                className="min-h-screen flex flex-col bg-gradient-to-br from-primary-50 to-secondary-50"
                sx={{
                    backgroundImage: 'url(/images/auth-bg.svg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.07) 0%, rgba(20, 184, 166, 0.03) 100%)',
                        backdropFilter: 'blur(8px)',
                        zIndex: 0
                    }
                }}
            >
                <Head title="Daftar" />
                {/* Animated Shapes */}
                <div className="absolute top-20 right-20 w-64 h-64 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
                <div className="absolute bottom-40 left-20 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-primary-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>

                <Container maxWidth="lg" sx={{ mt: { xs: 4, md: 8 }, mb: 4, flex: 1, position: 'relative', zIndex: 1 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                            gap: 4
                        }}
                    >
                        {/* Left side - Register form */}
                        <Box sx={{ width: { xs: '100%', md: '500px' } }}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Card
                                    elevation={3}
                                    className="backdrop-blur-md border border-white/50"
                                    sx={{
                                        p: { xs: 3, md: 5 },
                                        borderRadius: '1.5rem',
                                        background: 'rgba(255, 255, 255, 0.85)',
                                        backdropFilter: 'blur(12px)',
                                        boxShadow: theme.shadows[4],
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            boxShadow: theme.shadows[5],
                                            transform: 'translateY(-4px)'
                                        }
                                    }}
                                >
                                    <Box sx={{ mb: 3 }} className="flex items-center">
                                        <Box className="bg-primary-500 text-white p-3 rounded-xl shadow-lg shadow-primary-500/30">
                                            <LockIcon sx={{ fontSize: 28 }} />
                                        </Box>
                                        <Typography
                                            variant="h4"
                                            component="h1"
                                            fontWeight="bold"
                                            sx={{ ml: 2 }}
                                            className="text-gray-900"
                                        >
                                            Daftar Akun Baru
                                        </Typography>
                                    </Box>

                                    <Typography
                                        variant="body1"
                                        className="text-gray-600 mb-6"
                                    >
                                        Silakan daftar untuk membuat akun baru.
                                    </Typography>

                                    {/* Register form */}
                                    <Box component="form" onSubmit={handleSubmit} className="space-y-4">
                                        <Box sx={{ mb: 3 }}>
                                            <TextField
                                                fullWidth
                                                label="Nama Lengkap"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                required
                                                error={!!errors.name}
                                                helperText={errors.name}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <LockIcon color="action" />
                                                        </InputAdornment>
                                                    )
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '0.75rem',
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            boxShadow: '0 0 0 2px rgba(20, 184, 166, 0.1)'
                                                        },
                                                        '&.Mui-focused': {
                                                            borderColor: 'primary.main',
                                                            boxShadow: '0 0 0 2px rgba(20, 184, 166, 0.2)'
                                                        }
                                                    }
                                                }}
                                            />
                                        </Box>

                                        <Box sx={{ mb: 3 }}>
                                            <TextField
                                                fullWidth
                                                label="Email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                required
                                                error={!!errors.email}
                                                helperText={errors.email}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <EmailIcon color="action" />
                                                        </InputAdornment>
                                                    )
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '0.75rem',
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            boxShadow: '0 0 0 2px rgba(20, 184, 166, 0.1)'
                                                        },
                                                        '&.Mui-focused': {
                                                            borderColor: 'primary.main',
                                                            boxShadow: '0 0 0 2px rgba(20, 184, 166, 0.2)'
                                                        }
                                                    }
                                                }}
                                            />
                                        </Box>

                                        <Box sx={{ mb: 3 }}>
                                            <TextField
                                                fullWidth
                                                label="NIM"
                                                value={data.nim}
                                                onChange={handleNIMChange}
                                                required
                                                error={!!errors.nim}
                                                helperText={errors.nim || ""}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '0.75rem',
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            boxShadow: '0 0 0 2px rgba(20, 184, 166, 0.1)'
                                                        },
                                                        '&.Mui-focused': {
                                                            borderColor: 'primary.main',
                                                            boxShadow: '0 0 0 2px rgba(20, 184, 166, 0.2)'
                                                        }
                                                    }
                                                }}
                                            />
                                        </Box>

                                        <Box sx={{ mb: 3 }}>
                                            <TextField
                                                fullWidth
                                                label="Password"
                                                type={showPassword ? 'text' : 'password'}
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                required
                                                error={!!errors.password}
                                                helperText={errors.password || "Minimal 8 karakter"}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <LockIcon color="action" />
                                                        </InputAdornment>
                                                    ),
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                onClick={() => setShowPassword(!showPassword)}
                                                                edge="end"
                                                            >
                                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    )
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '0.75rem',
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            boxShadow: '0 0 0 2px rgba(20, 184, 166, 0.1)'
                                                        },
                                                        '&.Mui-focused': {
                                                            borderColor: 'primary.main',
                                                            boxShadow: '0 0 0 2px rgba(20, 184, 166, 0.2)'
                                                        }
                                                    }
                                                }}
                                            />
                                        </Box>

                                        <Box sx={{ mb: 3 }}>
                                            <TextField
                                                fullWidth
                                                label="Konfirmasi Password"
                                                type={showPassword ? 'text' : 'password'}
                                                value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                required
                                                error={!!errors.password_confirmation}
                                                helperText={errors.password_confirmation}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <LockIcon color="action" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '0.75rem',
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            boxShadow: '0 0 0 2px rgba(20, 184, 166, 0.1)'
                                                        },
                                                        '&.Mui-focused': {
                                                            borderColor: 'primary.main',
                                                            boxShadow: '0 0 0 2px rgba(20, 184, 166, 0.2)'
                                                        }
                                                    }
                                                }}
                                            />
                                        </Box>

                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            size="large"
                                            disabled={processing}
                                            className="py-3 rounded-xl"
                                            sx={{
                                                mb: 3,
                                                py: 1.5,
                                                fontWeight: 600,
                                                boxShadow: '0 4px 14px 0 rgba(20, 184, 166, 0.25)',
                                                '&:hover': {
                                                    boxShadow: '0 6px 20px 0 rgba(20, 184, 166, 0.35)',
                                                    transform: 'translateY(-2px)'
                                                },
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            {processing ? 'Memproses...' : 'Daftar'}
                                        </Button>

                                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                                            <Typography variant="body2" className="text-gray-600">
                                                Sudah punya akun?{' '}
                                                <Link
                                                    href={route('login')}
                                                    className="text-primary-600 hover:text-primary-700 transition-colors font-medium"
                                                >
                                                    Masuk sekarang
                                                </Link>
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Card>
                            </motion.div>
                        </Box>
                    </Box>
                </Container>

                <Box
                    component="footer"
                    className="py-4 text-center bg-white/80 backdrop-blur-md relative z-10 border-t border-gray-100"
                >
                    <Typography variant="body2" className="text-gray-500">
                        &copy; {new Date().getFullYear()} CampusJob. All rights reserved.
                    </Typography>
                </Box>
            </Box>
        </MuiThemeProvider>
    );
}
