import React from 'react';
import { Head, router } from '@inertiajs/react';
import {
    Container,
    Typography,
    Box,
    Paper,
    Rating,
    Stack,
    Divider,
    Avatar,
    Card,
    CardContent,
    Chip,
    useTheme,
    useMediaQuery,
    LinearProgress,
    alpha
} from '@mui/material';
import {
    Star as StarIcon,
    StarBorder as StarBorderIcon,
    Business as BusinessIcon,
    WorkOutline as WorkOutlineIcon,
    AccessTime as AccessTimeIcon,
    ArrowBack as ArrowBackIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    ThumbUpAlt as ThumbUpIcon,
    VerifiedUser as VerifiedIcon
} from '@mui/icons-material';
import Layout from '@/Components/Layout/Layout';
import Button from '@/Components/Shared/Button';
import { motion } from 'framer-motion';

const RatingCategoryDisplay = ({ label, value }) => {
    const theme = useTheme();
    
    return (
        <Box 
            sx={{ 
                mb: 2.5,
                p: 2,
                borderRadius: '0.75rem',
                backgroundColor: alpha(theme.palette.secondary.light, 0.1),
                transition: 'transform 0.2s ease',
                '&:hover': {
                    backgroundColor: alpha(theme.palette.secondary.light, 0.15),
                    transform: 'translateY(-2px)'
                }
            }}
        >
            <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="body2" sx={{ fontWeight: 600, flex: 1 }}>
                    {label}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Rating
                        readOnly
                        value={value}
                        precision={1}
                        icon={<StarIcon fontSize="small" />}
                        emptyIcon={<StarBorderIcon fontSize="small" />}
                        sx={{ color: 'secondary.main', mr: 1 }}
                    />
                    <Typography variant="body2" sx={{ 
                        fontWeight: 600, 
                        color: theme.palette.secondary.dark,
                        minWidth: '24px',
                        textAlign: 'center'
                    }}>
                        {value}
                    </Typography>
                </Box>
            </Stack>
            
            <Box sx={{ mt: 1, width: '100%' }}>
                <LinearProgress 
                    variant="determinate" 
                    value={value * 20} 
                    sx={{ 
                        height: 6, 
                        borderRadius: 3,
                        backgroundColor: alpha(theme.palette.secondary.main, 0.15),
                        '& .MuiLinearProgress-bar': {
                            borderRadius: 3,
                            backgroundColor: theme.palette.secondary.main,
                        }
                    }} 
                />
            </Box>
        </Box>
    );
};

const Show = ({ review }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const company = review.company;
    const jobApplication = review.job_application;
    const ratingCategories = review.rating_categories || {};

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleDelete = () => {
        if (confirm('Apakah Anda yakin ingin menghapus ulasan ini?')) {
            router.delete(route('candidate.reviews.destroy', review.id));
        }
    };

    return (
        <Layout>
            <Head title="Detail Ulasan Perusahaan" />

            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Button
                    variant="text"
                    color="inherit"
                    startIcon={<ArrowBackIcon />}
                    href={route('candidate.applications.index')}
                    sx={{ mb: 3 }}
                >
                    Kembali ke Aplikasi
                </Button>

                <Box 
                    component={motion.div}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    sx={{ 
                        display: 'flex', 
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: 4
                    }}
                >
                    {/* Company Info Card - Left Side */}
                    <Box sx={{ 
                        width: { xs: '100%', md: '30%' }, 
                        order: { xs: 2, md: 1 }
                    }}>
                        <Card 
                            sx={{ 
                                position: 'sticky', 
                                top: 24, 
                                borderRadius: '0.75rem', 
                                overflow: 'hidden',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                                '&:hover': {
                                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)',
                                    transform: 'translateY(-4px)'
                                }
                            }}
                        >
                            <Box 
                                sx={{ 
                                    p: 2, 
                                    background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`,
                                    color: 'white'
                                }}
                            >
                                <Typography variant="subtitle1" fontWeight={600}>
                                    Info Perusahaan
                                </Typography>
                            </Box>
                            
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Avatar
                                        src={company.logo}
                                        variant="rounded"
                                        sx={{
                                            width: 64,
                                            height: 64,
                                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                                            color: theme.palette.primary.main,
                                            mr: 2,
                                            borderRadius: '0.5rem',
                                            p: 1
                                        }}
                                    >
                                        {company.name ? company.name.charAt(0) : <BusinessIcon />}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                            {company.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {company.industry}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                        Posisi yang Dilamar
                                    </Typography>
                                    <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        p: 1.5, 
                                        bgcolor: alpha(theme.palette.primary.light, 0.1),
                                        borderRadius: '0.5rem'
                                    }}>
                                        <WorkOutlineIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                                        <Typography variant="body2" fontWeight={500}>
                                            {jobApplication.job.title}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                        Tanggal Ulasan
                                    </Typography>
                                    <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center',
                                        p: 1.5, 
                                        bgcolor: alpha(theme.palette.secondary.light, 0.1),
                                        borderRadius: '0.5rem'
                                    }}>
                                        <AccessTimeIcon sx={{ color: theme.palette.secondary.main, mr: 1 }} />
                                        <Typography variant="body2" fontWeight={500}>
                                            {formatDate(review.created_at)}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<EditIcon />}
                                        href={route('candidate.reviews.edit', review.id)}
                                        fullWidth
                                        sx={{ 
                                            borderRadius: '0.5rem',
                                            py: 1.25
                                        }}
                                    >
                                        Edit Ulasan
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        startIcon={<DeleteIcon />}
                                        onClick={handleDelete}
                                        fullWidth
                                        sx={{ 
                                            borderRadius: '0.5rem',
                                            py: 1.25
                                        }}
                                    >
                                        Hapus Ulasan
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>

                    {/* Review Content - Right Side */}
                    <Box sx={{ 
                        width: { xs: '100%', md: '70%' }, 
                        order: { xs: 1, md: 2 }
                    }}>
                        <Card
                            elevation={0}
                            sx={{
                                borderRadius: '0.75rem',
                                overflow: 'hidden',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                                mb: 3
                            }}
                        >
                            <Box 
                                sx={{ 
                                    p: 2, 
                                    background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`,
                                    color: 'white'
                                }}
                            >
                                <Typography variant="subtitle1" fontWeight={600}>
                                    Ulasan untuk {company.name}
                                </Typography>
                            </Box>
                            
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ 
                                    mb: 3, 
                                    display: 'flex', 
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    justifyContent: 'space-between', 
                                    alignItems: { xs: 'flex-start', sm: 'center' },
                                    gap: 2
                                }}>
                                    <Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                            <Chip
                                                size="small"
                                                label={review.is_anonymous ? "Anonim" : "Publik"}
                                                icon={review.is_anonymous ? null : <VerifiedIcon fontSize="small" />}
                                                sx={{
                                                    bgcolor: review.is_anonymous ? 'grey.200' : alpha(theme.palette.primary.main, 0.1),
                                                    color: review.is_anonymous ? 'text.secondary' : theme.palette.primary.main,
                                                    fontWeight: 500,
                                                    '& .MuiChip-icon': {
                                                        color: review.is_anonymous ? 'text.secondary' : theme.palette.primary.main,
                                                    }
                                                }}
                                            />
                                        </Box>
                                        <Typography variant="body2" color="text.secondary">
                                            Diposting pada {formatDate(review.created_at)}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ 
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        p: 2, 
                                        borderRadius: '1rem', 
                                        bgcolor: alpha(theme.palette.secondary.main, 0.1),
                                        minWidth: 100
                                    }}>
                                        <Typography variant="h3" fontWeight={700} sx={{ color: theme.palette.secondary.main }}>
                                            {review.rating}
                                        </Typography>
                                        <Rating
                                            readOnly
                                            value={review.rating}
                                            precision={1}
                                            icon={<StarIcon fontSize="small" />}
                                            emptyIcon={<StarBorderIcon fontSize="small" />}
                                            sx={{ color: theme.palette.secondary.main }}
                                        />
                                        <Typography variant="caption" sx={{ display: 'block', fontWeight: 500, color: theme.palette.secondary.dark }}>
                                            dari 5
                                        </Typography>
                                    </Box>
                                </Box>

                                {review.review_text && (
                                    <Box 
                                        sx={{ 
                                            mb: 4,
                                            p: 3,
                                            backgroundColor: alpha(theme.palette.background.paper, 0.6),
                                            borderRadius: '0.75rem',
                                            border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                                        }}
                                    >
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: theme.palette.primary.main }}>
                                            Ulasan Anda
                                        </Typography>
                                        <Typography variant="body1" sx={{ 
                                            whiteSpace: 'pre-line',
                                            lineHeight: 1.7,
                                        }}>
                                            {review.review_text}
                                        </Typography>
                                    </Box>
                                )}

                                <Box 
                                    sx={{ 
                                        p: 3, 
                                        backgroundColor: alpha(theme.palette.primary.light, 0.05),
                                        borderRadius: '0.75rem',
                                    }}
                                >
                                    <Typography variant="subtitle1" sx={{ 
                                        fontWeight: 600, 
                                        mb: 2.5,
                                        color: theme.palette.primary.dark,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                    }}>
                                        <ThumbUpIcon fontSize="small" />
                                        Penilaian Berdasarkan Kategori
                                    </Typography>

                                    {ratingCategories.work_culture !== undefined && (
                                        <RatingCategoryDisplay label="Budaya Kerja" value={ratingCategories.work_culture} />
                                    )}

                                    {ratingCategories.career_growth !== undefined && (
                                        <RatingCategoryDisplay label="Pertumbuhan Karir" value={ratingCategories.career_growth} />
                                    )}

                                    {ratingCategories.work_life_balance !== undefined && (
                                        <RatingCategoryDisplay label="Keseimbangan Kerja" value={ratingCategories.work_life_balance} />
                                    )}

                                    {ratingCategories.salary_benefits !== undefined && (
                                        <RatingCategoryDisplay label="Gaji & Tunjangan" value={ratingCategories.salary_benefits} />
                                    )}

                                    {ratingCategories.management !== undefined && (
                                        <RatingCategoryDisplay label="Manajemen" value={ratingCategories.management} />
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>
                </Box>
            </Container>
        </Layout>
    );
};

export default Show;
