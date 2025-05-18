import React, { useState, useEffect } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
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
    const { csrf_token } = usePage().props;
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
        _token: csrf_token,
    });

    const [alertProps, setAlertProps] = useState({
        title: null,
        text: null,
        icon: null
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            preserveScroll: true,
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
                className="min-h-screen flex flex-col"
                sx={{
                    backgroundImage: 'url(/images/background-login.jpg)',
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
                        background: 'linear-gradient(75deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.4) 100%)',
                        zIndex: 0
                    }
                }}
            >
                <Head title="Masuk" />

                <Container maxWidth="lg" sx={{ mt: { xs: 4, md: 8 }, mb: 4, flex: 1, position: 'relative', zIndex: 1 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            justifyContent: { xs: 'center', md: 'space-between' },
                            alignItems: 'center',
                            height: '100%'
                        }}
                    >
                        {/* Left side - Branding and welcome message */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="hidden md:block"
                            sx={{ color: 'white', maxWidth: '500px', mr: 4 }}
                        >
                            <Box sx={{ mb: 6 }}>
                                <Typography
                                    variant="h3"
                                    component="h1"
                                    fontWeight="800"
                                    sx={{
                                        color: 'white',
                                        textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                                        mb: 2
                                    }}
                                >
                                    Portal Karir Kampus
                                </Typography>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        color: 'white',
                                        opacity: 0.9,
                                        textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                                        mb: 3
                                    }}
                                >
                                    Temukan peluang karir terbaik untuk masa depanmu
                                </Typography>
                            </Box>
                        </motion.div>

                        {/* Right side - Login form */}
                        <Box sx={{ width: { xs: '100%', sm: '450px', md: '400px' } }}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Card
                                    elevation={3}
                                    sx={{
                                        p: { xs: 3, sm: 4 },
                                        borderRadius: '0.75rem',
                                        background: 'rgba(255, 255, 255, 0.9)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            mb: 4,
                                            textAlign: 'center'
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: '60px',
                                                height: '60px',
                                                borderRadius: '0.75rem',
                                                background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                margin: '0 auto 16px',
                                                boxShadow: '0 10px 15px -3px rgba(20, 184, 166, 0.3)'
                                            }}
                                        >
                                            <LoginIcon sx={{ fontSize: 30, color: 'white' }} />
                                        </Box>
                                        <Typography
                                            variant="h5"
                                            component="h2"
                                            fontWeight={700}
                                            sx={{
                                                background: 'linear-gradient(90deg, #14b8a6, #0d9488)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                mb: 1
                                            }}
                                        >
                                            Masuk ke Akun
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ mb: 2 }}
                                        >
                                            Masukkan kredensial untuk melanjutkan
                                        </Typography>
                                    </Box>

                                    {/* Login form */}
                                    <Box component="form" onSubmit={submit}>
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
                                                            <EmailIcon sx={{ color: '#14b8a6' }} />
                                                        </InputAdornment>
                                                    )
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '0.75rem',
                                                        bgcolor: 'rgba(255, 255, 255, 0.8)',
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            boxShadow: '0 0 0 2px rgba(20, 184, 166, 0.1)'
                                                        },
                                                        '&.Mui-focused': {
                                                            borderColor: '#14b8a6',
                                                            boxShadow: '0 0 0 2px rgba(20, 184, 166, 0.2)'
                                                        }
                                                    }
                                                }}
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
                                                            <LockIcon sx={{ color: '#14b8a6' }} />
                                                        </InputAdornment>
                                                    ),
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                onClick={() => setShowPassword(!showPassword)}
                                                                edge="end"
                                                            >
                                                                {showPassword ? (
                                                                    <VisibilityOff sx={{ color: 'rgba(0, 0, 0, 0.54)' }} />
                                                                ) : (
                                                                    <Visibility sx={{ color: 'rgba(0, 0, 0, 0.54)' }} />
                                                                )}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    )
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '0.75rem',
                                                        bgcolor: 'rgba(255, 255, 255, 0.8)',
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            boxShadow: '0 0 0 2px rgba(20, 184, 166, 0.1)'
                                                        },
                                                        '&.Mui-focused': {
                                                            borderColor: '#14b8a6',
                                                            boxShadow: '0 0 0 2px rgba(20, 184, 166, 0.2)'
                                                        }
                                                    }
                                                }}
                                            />
                                        </Box>

                                        <Button
                                            type="submit"
                                            variant="contained"
                                            fullWidth
                                            size="large"
                                            disabled={processing}
                                            sx={{
                                                mb: 3,
                                                py: 1.5,
                                                fontWeight: 600,
                                                borderRadius: '0.75rem',
                                                backgroundColor: '#14b8a6',
                                                background: 'linear-gradient(90deg, #14b8a6, #0d9488)',
                                                boxShadow: '0 4px 14px 0 rgba(20, 184, 166, 0.25)',
                                                '&:hover': {
                                                    backgroundColor: '#0d9488',
                                                    boxShadow: '0 6px 20px 0 rgba(20, 184, 166, 0.35)',
                                                    transform: 'translateY(-2px)'
                                                },
                                                transition: 'all 0.3s ease'
                                            }}
                                            loading={processing}
                                        >
                                            {processing ? 'Memproses...' : 'Masuk'}
                                        </Button>

                                        <Box sx={{ textAlign: 'center', mb: 2 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Belum punya akun?{' '}
                                                <Link
                                                    href={route('register')}
                                                    className="text-teal-600 hover:text-teal-700 transition-colors font-medium"
                                                >
                                                    Daftar sekarang
                                                </Link>
                                            </Typography>
                                        </Box>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Typography variant="body2" color="text.secondary">
                                                <Link
                                                    href={route('public.home')}
                                                    className="text-gray-600 hover:text-teal-600 transition-colors font-medium"
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
                    sx={{
                        py: 2,
                        textAlign: 'center',
                        position: 'relative',
                        zIndex: 10,
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                        bgcolor: 'rgba(0, 0, 0, 0.5)'
                    }}
                >
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        &copy; {new Date().getFullYear()} STIA Bayu Angga . All rights reserved.
                    </Typography>
                </Box>
            </Box>
        </MuiThemeProvider>
    );
}
