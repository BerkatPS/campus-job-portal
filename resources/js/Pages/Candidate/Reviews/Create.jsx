import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import {
    Container,
    Typography,
    Box,
    Paper,
    Rating,
    TextField,
    FormControlLabel,
    Checkbox,
    Stack,
    Divider,
    Avatar,
    FormHelperText,
    Alert,
    Card,
    CardContent,
    Tooltip,
    useTheme,
    useMediaQuery,
    alpha
} from '@mui/material';
import {
    Star as StarIcon,
    StarBorder as StarBorderIcon,
    Business as BusinessIcon,
    WorkOutline as WorkOutlineIcon,
    SentimentSatisfiedAlt as SatisfiedIcon,
    SentimentNeutral as NeutralIcon,
    SentimentDissatisfied as DissatisfiedIcon,
    ArrowBack as ArrowBackIcon,
    LightbulbOutlined as LightbulbIcon
} from '@mui/icons-material';
import Layout from '@/Components/Layout/Layout';
import Button from '@/Components/Shared/Button';
import { motion } from 'framer-motion';

const RatingCategory = ({ name, label, value, onChange, description }) => {
    const theme = useTheme();
    
    return (
        <Box 
            sx={{ 
                mb: 3.5, 
                p: 2, 
                borderRadius: '0.75rem',
                backgroundColor: (theme) => alpha(theme.palette.secondary.light, 0.1),
                transition: 'all 0.2s ease',
                '&:hover': {
                    backgroundColor: (theme) => alpha(theme.palette.secondary.light, 0.15),
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                }
            }}
        >
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, flex: 1 }}>
                    {label}
                </Typography>
                <Rating
                    name={name}
                    value={value}
                    onChange={(event, newValue) => onChange(name, newValue)}
                    precision={1}
                    icon={<StarIcon fontSize="inherit" />}
                    emptyIcon={<StarBorderIcon fontSize="inherit" />}
                    sx={{ color: 'secondary.main' }}
                />
            </Stack>
            <Typography variant="caption" color="text.secondary">
                {description}
            </Typography>
        </Box>
    );
};

const Create = ({ jobApplication, company }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { data, setData, post, processing, errors, reset } = useForm({
        job_application_id: jobApplication.id,
        rating: 0,
        review_text: '',
        rating_categories: {
            work_culture: 0,
            career_growth: 0,
            work_life_balance: 0,
            salary_benefits: 0,
            management: 0
        },
        is_anonymous: false,
    });

    const [submitting, setSubmitting] = useState(false);

    const handleCategoryRatingChange = (category, value) => {
        setData('rating_categories', {
            ...data.rating_categories,
            [category]: value
        });

        // Update overall rating as average of categories
        const values = Object.values({
            ...data.rating_categories,
            [category]: value
        });
        const sum = values.reduce((a, b) => a + b, 0);
        const avg = sum / values.length;
        setData('rating', Math.round(avg));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!data.rating) {
            setData('errors', { ...errors, rating: 'Harap berikan penilaian keseluruhan' });
            return;
        }
        
        if (data.review_text.length < 10) {
            setData('errors', { ...errors, review_text: 'Ulasan harus memiliki minimal 10 karakter' });
            return;
        }
        
        setSubmitting(true);
        post(route('candidate.reviews.store'), {
            onSuccess: () => {
                setSubmitting(false);
            },
            onError: () => {
                setSubmitting(false);
            }
        });
    };

    const getOverallRatingSentiment = (rating) => {
        if (rating >= 4) return <SatisfiedIcon color="success" />;
        if (rating >= 2) return <NeutralIcon color="warning" />;
        if (rating > 0) return <DissatisfiedIcon color="error" />;
        return null;
    };

    return (
        <Layout>
            <Head title="Berikan Ulasan Perusahaan" />

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

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Box 
                        sx={{ 
                            display: 'flex', 
                            flexDirection: { xs: 'column', md: 'row' },
                            gap: 4
                        }}
                    >
                        {/* Company Info Card - Left Side */}
                        <Box sx={{ width: { xs: '100%', md: '30%' }, order: { xs: 1, md: 0 } }}>
                            <Card 
                                sx={{ 
                                    position: 'sticky', 
                                    top: 24, 
                                    mb: 3, 
                                    borderRadius: '1rem', 
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                                    '&:hover': {
                                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)',
                                        transform: 'translateY(-4px)'
                                    },
                                }}
                            >
                                <Box 
                                    sx={{ 
                                        p: 2, 
                                        background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`,
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}
                                >
                                    <LightbulbIcon fontSize="small" />
                                    <Typography variant="subtitle2" fontWeight={600}>
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
                                                bgcolor: 'primary.light',
                                                color: 'primary.main',
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

                                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                        Posisi yang Dilamar
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <WorkOutlineIcon sx={{ color: 'text.secondary', mr: 1 }} />
                                        <Typography variant="body2">
                                            {jobApplication.job.title}
                                        </Typography>
                                    </Box>

                                    <Divider sx={{ my: 2 }} />

                                    <Box sx={{ 
                                        p: 2, 
                                        borderRadius: '0.75rem', 
                                        bgcolor: (theme) => alpha(theme.palette.info.light, 0.1),
                                        border: '1px dashed',
                                        borderColor: 'info.light'
                                    }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Ulasan Anda sangat berharga untuk membantu kandidat lain dalam mencari pekerjaan yang sesuai.
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Box>

                        {/* Review Form - Right Side */}
                        <Box sx={{ width: { xs: '100%', md: '70%' }, order: { xs: 0, md: 1 } }}>
                            <Paper
                                component="form"
                                onSubmit={handleSubmit}
                                elevation={0}
                                sx={{
                                    p: { xs: 3, md: 4 },
                                    borderRadius: '1rem',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                                }}
                            >
                                <Typography 
                                    variant="h5" 
                                    gutterBottom 
                                    fontWeight={600}
                                    sx={{
                                        background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}
                                >
                                    Berikan Ulasan untuk {company.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                                    Bagikan pengalaman dan pendapat Anda tentang perusahaan untuk membantu kandidat lain.
                                </Typography>

                                <Box 
                                    sx={{ 
                                        mb: 4, 
                                        p: 3, 
                                        borderRadius: '1rem',
                                        backgroundColor: (theme) => alpha(theme.palette.primary.light, 0.1),
                                    }}
                                >
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                                        Penilaian Keseluruhan
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Rating
                                            name="rating"
                                            value={data.rating}
                                            onChange={(event, newValue) => setData('rating', newValue)}
                                            precision={1}
                                            size="large"
                                            icon={<StarIcon fontSize="inherit" />}
                                            emptyIcon={<StarBorderIcon fontSize="inherit" />}
                                            sx={{ color: 'secondary.main', mr: 2 }}
                                        />
                                        {getOverallRatingSentiment(data.rating)}
                                        <Typography variant="body2" sx={{ ml: 1 }}>
                                            {data.rating} dari 5
                                        </Typography>
                                    </Box>
                                    {errors.rating && (
                                        <FormHelperText error>{errors.rating}</FormHelperText>
                                    )}
                                </Box>

                                <Divider sx={{ my: 3 }} />

                                <Typography 
                                    variant="subtitle1" 
                                    sx={{ 
                                        fontWeight: 600, 
                                        mb: 2,
                                        pb: 1,
                                        borderBottom: '2px solid',
                                        borderColor: 'secondary.main',
                                        display: 'inline-block'
                                    }}
                                >
                                    Penilaian Berdasarkan Kategori
                                </Typography>

                                <Box sx={{ mb: 3 }}>
                                    <RatingCategory
                                        name="work_culture"
                                        label="Budaya Kerja"
                                        value={data.rating_categories.work_culture}
                                        onChange={handleCategoryRatingChange}
                                        description="Bagaimana budaya dan lingkungan kerja di perusahaan ini?"
                                    />

                                    <RatingCategory
                                        name="career_growth"
                                        label="Pertumbuhan Karir"
                                        value={data.rating_categories.career_growth}
                                        onChange={handleCategoryRatingChange}
                                        description="Bagaimana kesempatan untuk pertumbuhan dan pengembangan karir?"
                                    />

                                    <RatingCategory
                                        name="work_life_balance"
                                        label="Keseimbangan Kerja"
                                        value={data.rating_categories.work_life_balance}
                                        onChange={handleCategoryRatingChange}
                                        description="Bagaimana keseimbangan antara pekerjaan dan kehidupan pribadi?"
                                    />

                                    <RatingCategory
                                        name="salary_benefits"
                                        label="Gaji & Tunjangan"
                                        value={data.rating_categories.salary_benefits}
                                        onChange={handleCategoryRatingChange}
                                        description="Bagaimana gaji dan tunjangan yang ditawarkan?"
                                    />

                                    <RatingCategory
                                        name="management"
                                        label="Manajemen"
                                        value={data.rating_categories.management}
                                        onChange={handleCategoryRatingChange}
                                        description="Bagaimana gaya manajemen dan kepemimpinan di perusahaan?"
                                    />
                                </Box>

                                <Divider sx={{ my: 3 }} />

                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                                        Ceritakan Pengalaman Anda
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={6}
                                        variant="outlined"
                                        placeholder="Bagikan pengalaman, hal positif/negatif, dan saran untuk perusahaan..."
                                        value={data.review_text}
                                        onChange={(e) => setData('review_text', e.target.value)}
                                        error={!!errors.review_text}
                                        helperText={errors.review_text || 'Minimal 10 karakter'}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '0.75rem'
                                            }
                                        }}
                                    />
                                </Box>

                                <Box 
                                    sx={{ 
                                        mb: 4, 
                                        p: 2,
                                        borderRadius: '0.75rem',
                                        backgroundColor: (theme) => alpha(theme.palette.background.default, 0.6),
                                        border: '1px solid',
                                        borderColor: 'divider'
                                    }}
                                >
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={data.is_anonymous}
                                                onChange={(e) => setData('is_anonymous', e.target.checked)}
                                                color="secondary"
                                            />
                                        }
                                        label="Kirim sebagai anonim (nama Anda tidak akan ditampilkan)"
                                    />
                                </Box>

                                {Object.keys(errors).length > 0 && (
                                    <Alert 
                                        severity="error" 
                                        sx={{ 
                                            mb: 3,
                                            borderRadius: '0.75rem',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        Mohon perbaiki kesalahan pada form sebelum mengirim.
                                    </Alert>
                                )}

                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                    <Button
                                        variant="outlined"
                                        color="inherit"
                                        href={route('candidate.applications.index')}
                                        sx={{
                                            borderRadius: '0.75rem',
                                            py: 1.25,
                                        }}
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="secondary"
                                        disabled={processing || submitting}
                                        sx={{
                                            borderRadius: '0.75rem',
                                            py: 1.25,
                                            px: 3,
                                            fontWeight: 600,
                                            boxShadow: '0 4px 14px 0 rgba(156, 39, 176, 0.25)',
                                            '&:hover': {
                                                boxShadow: '0 6px 20px 0 rgba(156, 39, 176, 0.35)',
                                                transform: 'translateY(-2px)'
                                            },
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        Kirim Ulasan
                                    </Button>
                                </Box>
                            </Paper>
                        </Box>
                    </Box>
                </motion.div>
            </Container>
        </Layout>
    );
};

export default Create;
