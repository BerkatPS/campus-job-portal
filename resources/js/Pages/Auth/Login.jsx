import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Container,
    Box,
    Typography,
    InputAdornment,
    TextField,
    IconButton, useMediaQuery,
} from '@mui/material';
import {
    Login as LoginIcon,
    Email as EmailIcon,
    Lock as LockIcon,
    Visibility,
    VisibilityOff
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Button from '@/Components/Shared/Button';
import Card from '@/Components/Shared/Card';
import MuiThemeProvider from '@/Theme/MuiThemeProvider';
import SweetAlert from "@/Components/Shared/SweetAlert.jsx";
import {useTheme} from "@mui/material/styles";

export default function Login({ status, canResetPassword }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [alertProps, setAlertProps] = useState({
        title: null,
        text: null,
        icon: null
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onSuccess: () => {
                // Reset password field on success
                reset('password');
            },
            onError: (errors) => {
                // Show SweetAlert for login errors
                if (errors.email) {
                    setAlertProps({
                        title: 'Login Gagal',
                        text: errors.email,
                        icon: 'error'
                    });
                }
            }
        });
    };

    useEffect(() => {
        document.title = 'Login - CampusJob';

        // Show sweet alert for status message
        if (status) {
            setAlertProps({
                title: 'Sukses',
                text: status,
                icon: 'success'
            });
        }

        // Show error alerts if present
        if (errors.email) {
            setAlertProps({
                title: 'Login Gagal',
                text: errors.email,
                icon: 'error'
            });
        }

        return () => {
            reset('password');
        };
    }, [status, errors]);

    return (
        <MuiThemeProvider>
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
                <Head title="Masuk" />

                {/* Animated shapes - Tailwind classes for decorative elements */}
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
                        {/* Left side - Login form */}
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
                                        borderRadius: '1.5rem', // Theme.borderRadius['3xl']
                                        background: 'rgba(255, 255, 255, 0.85)',
                                        backdropFilter: 'blur(12px)',
                                        boxShadow: theme.shadows[4], // Using the custom shadows from Theme
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            boxShadow: theme.shadows[5],
                                            transform: 'translateY(-4px)'
                                        }
                                    }}
                                >
                                    <Box sx={{ mb: 3 }} className="flex items-center">
                                        <Box className="bg-primary-500 text-white p-3 rounded-xl shadow-lg shadow-primary-500/30">
                                            <LoginIcon sx={{ fontSize: 28 }} />
                                        </Box>
                                        <Typography
                                            variant="h4"
                                            component="h1"
                                            fontWeight="bold"
                                            sx={{ ml: 2 }}
                                            className="text-gray-900"
                                        >
                                            Masuk
                                        </Typography>
                                    </Box>

                                    <Typography
                                        variant="body1"
                                        className="text-gray-600 mb-6"
                                    >
                                        Selamat datang kembali! Silakan masuk untuk mengakses akun Anda.
                                    </Typography>

                                    {/* Login form */}
                                    <Box component="form" onSubmit={submit} className="space-y-4">
                                        <Box sx={{ mb: 3 }}>
                                            <TextField
                                                fullWidth
                                                id="email"
                                                name="email"
                                                label="Email"
                                                type="email"
                                                autoComplete="username"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                autoFocus
                                                required
                                                error={!!errors.email}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <EmailIcon color="action" />
                                                        </InputAdornment>
                                                    )
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '0.75rem', // Theme.borderRadius.xl
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
                                                className="bg-white/60"
                                            />
                                        </Box>

                                        <Box sx={{ mb: 3 }}>
                                            <TextField
                                                fullWidth
                                                id="password"
                                                name="password"
                                                label="Password"
                                                type={showPassword ? 'text' : 'password'}
                                                autoComplete="current-password"
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                required
                                                error={!!errors.password}
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
                                                        borderRadius: '0.75rem', // Theme.borderRadius.xl
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
                                                className="bg-white/60"
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
                                            loading={processing}
                                        >
                                            {processing ? 'Memproses...' : 'Masuk'}
                                        </Button>

                                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                                            <Typography variant="body2" className="text-gray-600">
                                                Belum punya akun?{' '}
                                                <Link
                                                    href={route('register')}
                                                    className="text-primary-600 hover:text-primary-700 transition-colors font-medium"
                                                >
                                                    Daftar sekarang
                                                </Link>
                                            </Typography>
                                        </Box>
                                        <Box sx={{ textAlign: 'center', mb: 5 }}>
                                            <Typography variant="body2" className="text-gray-600">
                                                <Link
                                                    href={route('public.home')}
                                                    className="text-gray-600 font-medium"
                                                >
                                                    Kembali ke Beranda
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
