import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import {
    Container,
    Typography,
    Box,
    Paper,
    Grid,
    TextField,
    Button,
    Stack,
    CircularProgress,
    alpha,
    useTheme,
    Alert,
    Divider
} from '@mui/material';
import {
    Save as SaveIcon,
    ArrowBack as ArrowBackIcon,
    Shield as ShieldIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Layout from "@/Components/Layout/Layout.jsx";

const SecurityPage = () => {
    const theme = useTheme();
    
    const { data, setData, errors, post, processing, recentlySuccessful, reset } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('manager.profile.update-security'), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <Layout>
            <Head title="Keamanan Akun" />
            
            <Container maxWidth="lg">
                <Box sx={{ py: 4 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Box sx={{ display: 'flex', mb: 4, alignItems: 'center' }}>
                            <Button 
                                component={Link} 
                                href={route('manager.profile.index')} 
                                startIcon={<ArrowBackIcon />}
                                sx={{ mr: 2 }}
                            >
                                Kembali
                            </Button>
                            <Typography variant="h4" component="h1" fontWeight="bold" color="primary.main">
                                Keamanan Akun
                            </Typography>
                        </Box>
                        
                        {recentlySuccessful && (
                            <Alert severity="success" sx={{ mb: 3, borderRadius: '0.75rem' }}>
                                Password berhasil diperbarui
                            </Alert>
                        )}
                    </motion.div>

                    <Grid container spacing={3} justifyContent="center">
                        <Grid item xs={12} md={8}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                            >
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        borderRadius: '1rem',
                                        border: '1px solid',
                                        borderColor: alpha(theme.palette.primary.main, 0.1),
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                        <ShieldIcon color="primary" sx={{ mr: 2, fontSize: 28 }} />
                                        <Typography variant="h6" fontWeight="bold">
                                            Perbarui Password
                                        </Typography>
                                    </Box>
                                    
                                    <Divider sx={{ mb: 3 }} />
                                    
                                    <form onSubmit={handleSubmit}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    label="Password Saat Ini"
                                                    fullWidth
                                                    type="password"
                                                    value={data.current_password}
                                                    onChange={(e) => setData('current_password', e.target.value)}
                                                    error={!!errors.current_password}
                                                    helperText={errors.current_password}
                                                    sx={{ mb: 2 }}
                                                    required
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    label="Password Baru"
                                                    fullWidth
                                                    type="password"
                                                    value={data.password}
                                                    onChange={(e) => setData('password', e.target.value)}
                                                    error={!!errors.password}
                                                    helperText={errors.password}
                                                    sx={{ mb: 2 }}
                                                    required
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    label="Konfirmasi Password Baru"
                                                    fullWidth
                                                    type="password"
                                                    value={data.password_confirmation}
                                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                                    error={!!errors.password_confirmation}
                                                    helperText={errors.password_confirmation}
                                                    sx={{ mb: 2 }}
                                                    required
                                                />
                                            </Grid>
                                        </Grid>
                                        
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                type="submit"
                                                disabled={processing}
                                                startIcon={processing ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                                sx={{ borderRadius: '0.75rem' }}
                                            >
                                                Perbarui Password
                                            </Button>
                                        </Box>
                                    </form>
                                </Paper>
                            </motion.div>
                        </Grid>
                        
                        <Grid item xs={12} md={8}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        borderRadius: '1rem',
                                        border: '1px solid',
                                        borderColor: alpha(theme.palette.primary.main, 0.1),
                                    }}
                                >
                                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                                        Tips Keamanan
                                    </Typography>
                                    
                                    <Divider sx={{ mb: 2 }} />
                                    
                                    <Box component="ul" sx={{ pl: 2 }}>
                                        <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                                            Gunakan password yang kuat dengan kombinasi huruf, angka, dan simbol.
                                        </Typography>
                                        <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                                            Jangan gunakan password yang sama untuk beberapa akun.
                                        </Typography>
                                        <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                                            Perbarui password Anda secara berkala.
                                        </Typography>
                                        <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                                            Jangan bagikan password Anda kepada siapapun.
                                        </Typography>
                                        <Typography component="li" variant="body1">
                                            Selalu logout dari akun Anda saat menggunakan perangkat publik.
                                        </Typography>
                                    </Box>
                                </Paper>
                            </motion.div>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </Layout>
    );
};

export default SecurityPage;
