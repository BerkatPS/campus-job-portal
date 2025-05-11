import React from 'react';
import { Head } from '@inertiajs/react';
import {
    Box,
    Typography,
    Button,
    Container,
    Paper
} from '@mui/material';
import {
    SentimentDissatisfied as SentimentDissatisfiedIcon,
    ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { Link } from '@inertiajs/react';

export default function NotFound() {
    return (
        <>
            <Head title="404 - Halaman Tidak Ditemukan" />
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'background.default',
                    py: 8
                }}
            >
                <Container maxWidth="md">
                    <Paper
                        elevation={0}
                        variant="outlined"
                        sx={{
                            p: { xs: 4, md: 6 },
                            borderRadius: 2,
                            textAlign: 'center',
                            borderColor: 'primary.200'
                        }}
                    >
                        <Box sx={{ mb: 3 }}>
                            <SentimentDissatisfiedIcon
                                sx={{
                                    fontSize: 80,
                                    color: 'primary.500',
                                    mb: 2
                                }}
                            />

                            <Typography
                                variant="h3"
                                component="h1"
                                sx={{
                                    mb: 1,
                                    fontWeight: 'bold',
                                    color: 'primary.700'
                                }}
                            >
                                404 - Halaman Tidak Ditemukan
                            </Typography>

                            <Typography
                                variant="h6"
                                component="h2"
                                sx={{
                                    mb: 4,
                                    color: 'text.secondary',
                                    maxWidth: '600px',
                                    mx: 'auto'
                                }}
                            >
                                Maaf, halaman yang Anda cari tidak dapat ditemukan atau mungkin telah dipindahkan.
                            </Typography>

                            <Box
                                sx={{
                                    height: '240px',
                                    background: 'radial-gradient(circle, rgba(20,184,166,0.1) 0%, rgba(240,253,250,0.2) 70%)',
                                    borderRadius: 4,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mb: 4,
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                <Typography
                                    variant="h1"
                                    sx={{
                                        fontWeight: 'black',
                                        fontSize: { xs: '120px', md: '180px' },
                                        color: 'primary.main',
                                        opacity: 0.3
                                    }}
                                >
                                    404
                                </Typography>
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        width: '100%',
                                        height: '100%',
                                        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%2314b8a6\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
                                        opacity: 0.5
                                    }}
                                />
                            </Box>

                            <Typography
                                variant="body1"
                                sx={{
                                    mb: 4,
                                    color: 'text.secondary',
                                    maxWidth: '500px',
                                    mx: 'auto'
                                }}
                            >
                                Anda dapat kembali ke halaman utama atau mencoba mencari lagi informasi yang Anda butuhkan.
                            </Typography>

                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                                <Button
                                    component={Link}
                                    href="/"
                                    variant="contained"
                                    color="primary"
                                    startIcon={<ArrowBackIcon />}
                                    size="large"
                                    sx={{
                                        borderRadius: 2,
                                        px: 3,
                                        py: 1,
                                        fontWeight: 'medium'
                                    }}
                                >
                                    Kembali ke Beranda
                                </Button>

                                <Button
                                    component={Link}
                                    href="/jobs"
                                    variant="outlined"
                                    color="primary"
                                    size="large"
                                    sx={{
                                        borderRadius: 2,
                                        px: 3,
                                        py: 1,
                                        fontWeight: 'medium'
                                    }}
                                >
                                    Lihat Lowongan
                                </Button>
                            </Box>
                        </Box>
                    </Paper>
                </Container>
            </Box>
        </>
    );
}
