import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Divider,
    Grid,
    Avatar,
    Rating,
    Chip,
    LinearProgress,
    Tabs,
    Tab,
    Stack,
    useTheme
} from '@mui/material';
import {
    Star as StarIcon,
    StarBorder as StarBorderIcon,
    ThumbUp as ThumbUpIcon,
    ThumbDown as ThumbDownIcon,
    SentimentSatisfiedAlt as SatisfiedIcon,
    SentimentDissatisfied as DissatisfiedIcon,
    SentimentNeutral as NeutralIcon,
    WorkOutline as WorkOutlineIcon,
    AutoGraph as AutoGraphIcon,
    BalanceOutlined as BalanceOutlinedIcon,
    MonetizationOnOutlined as MonetizationOnOutlinedIcon,
    SupervisorAccountOutlined as SupervisorAccountOutlinedIcon,
    Sort as SortIcon,
    FilterAlt as FilterAltIcon,
    Person as PersonIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/Components/Shared/Button';
import EmptyState from '@/Components/Shared/EmptyState';

const RatingStatItem = ({ label, value, count, total }) => {
    const theme = useTheme();
    const percentage = total > 0 ? (count / total) * 100 : 0;

    const getColor = (rating) => {
        if (rating >= 4) return theme.palette.success.main;
        if (rating >= 3) return theme.palette.warning.main;
        return theme.palette.error.main;
    };

    return (
        <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" component="span" sx={{ minWidth: 80 }}>
                {label}
            </Typography>
            <Box sx={{ flex: 1, mx: 2 }}>
                <LinearProgress
                    variant="determinate"
                    value={percentage}
                    sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'rgba(0, 0, 0, 0.05)',
                        '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                            backgroundColor: getColor(value),
                        }
                    }}
                />
            </Box>
            <Typography variant="body2" component="span" sx={{ minWidth: 50, textAlign: 'right' }}>
                {count}
            </Typography>
        </Box>
    );
};

const ReviewCard = ({ review }) => {
    const theme = useTheme();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getRatingColor = (rating) => {
        if (rating >= 4) return theme.palette.success.main;
        if (rating >= 3) return theme.palette.warning.main;
        return theme.palette.error.main;
    };

    const getRatingIcon = (rating) => {
        if (rating >= 4) return <SatisfiedIcon sx={{ color: getRatingColor(rating) }} />;
        if (rating >= 3) return <NeutralIcon sx={{ color: getRatingColor(rating) }} />;
        return <DissatisfiedIcon sx={{ color: getRatingColor(rating) }} />;
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map(part => part.charAt(0))
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'work_culture':
                return <WorkOutlineIcon fontSize="small" />;
            case 'career_growth':
                return <AutoGraphIcon fontSize="small" />;
            case 'work_life_balance':
                return <BalanceOutlinedIcon fontSize="small" />;
            case 'salary_benefits':
                return <MonetizationOnOutlinedIcon fontSize="small" />;
            case 'management':
                return <SupervisorAccountOutlinedIcon fontSize="small" />;
            default:
                return null;
        }
    };

    const categoryLabels = {
        'work_culture': 'Budaya Kerja',
        'career_growth': 'Pengembangan Karier',
        'work_life_balance': 'Work-Life Balance',
        'salary_benefits': 'Gaji & Tunjangan',
        'management': 'Manajemen'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '1rem',
                    mb: 3,
                    transition: 'all 0.2s',
                    '&:hover': {
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                        transform: 'translateY(-4px)',
                        borderColor: 'rgba(20, 184, 166, 0.3)'
                    }
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                            sx={{
                                bgcolor: review.is_anonymous ? 'grey.200' : 'primary.light',
                                color: review.is_anonymous ? 'text.secondary' : 'primary.main',
                                mr: 2
                            }}
                        >
                            {review.is_anonymous ? <PersonIcon /> : getInitials(review.user?.name)}
                        </Avatar>
                        <Box>
                            <Typography variant="subtitle1" fontWeight={600}>
                                {review.is_anonymous ? 'Anonim' : review.user?.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {review.job_application.job.title}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ textAlign: 'right' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    bgcolor: `${getRatingColor(review.rating)}15`,
                                    color: getRatingColor(review.rating),
                                    py: 0.5,
                                    px: 1.5,
                                    borderRadius: '1rem',
                                    fontWeight: 600
                                }}
                            >
                                {getRatingIcon(review.rating)}
                                <Typography variant="body2" fontWeight={600} sx={{ ml: 0.5 }}>
                                    {review.rating.toFixed(1)}
                                </Typography>
                            </Box>
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                            {formatDate(review.created_at)}
                        </Typography>
                    </Box>
                </Box>

                <Typography
                    variant="body1"
                    sx={{
                        mb: 2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                    }}
                >
                    {review.review_text}
                </Typography>

                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 1.5,
                                borderRadius: '0.75rem',
                                bgcolor: 'success.light',
                                border: '1px solid',
                                borderColor: 'success.main',
                                color: 'success.dark',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <ThumbUpIcon fontSize="small" sx={{ mr: 1 }} />
                                <Typography variant="subtitle2" fontWeight={700}>
                                    Kelebihan
                                </Typography>
                            </Box>
                            <Typography
                                variant="body2"
                                sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    flex: 1
                                }}
                            >
                                {review.pros || 'Tidak disebutkan'}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 1.5,
                                borderRadius: '0.75rem',
                                bgcolor: 'error.light',
                                border: '1px solid',
                                borderColor: 'error.main',
                                color: 'error.dark',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <ThumbDownIcon fontSize="small" sx={{ mr: 1 }} />
                                <Typography variant="subtitle2" fontWeight={700}>
                                    Kekurangan
                                </Typography>
                            </Box>
                            <Typography
                                variant="body2"
                                sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    flex: 1
                                }}
                            >
                                {review.cons || 'Tidak disebutkan'}
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>

                <Box sx={{ mb: 1 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                        Rating per Kategori:
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                        {Object.entries(review.rating_categories).map(([key, value]) => (
                            <Chip
                                key={key}
                                icon={getCategoryIcon(key)}
                                label={`${categoryLabels[key]}: ${value.toFixed(1)}`}
                                size="small"
                                sx={{
                                    bgcolor: `${getRatingColor(value)}15`,
                                    color: getRatingColor(value),
                                    borderRadius: '0.5rem',
                                    mb: 1,
                                    '& .MuiChip-icon': {
                                        color: 'inherit'
                                    }
                                }}
                            />
                        ))}
                    </Stack>
                </Box>
            </Paper>
        </motion.div>
    );
};

const CompanyReviews = ({ company, reviews, reviewStats }) => {
    const theme = useTheme();
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const getRatingColor = (rating) => {
        if (rating >= 4) return theme.palette.success.main;
        if (rating >= 3) return theme.palette.warning.main;
        return theme.palette.error.main;
    };

    // Filter reviews based on tab
    const filteredReviews = tabValue === 0
        ? reviews
        : tabValue === 1
            ? reviews.filter(review => review.rating >= 4)
            : reviews.filter(review => review.rating < 3);

    // Calculate rating distribution
    const ratingCounts = {
        5: reviews.filter(r => r.rating >= 4.5 && r.rating <= 5).length,
        4: reviews.filter(r => r.rating >= 3.5 && r.rating < 4.5).length,
        3: reviews.filter(r => r.rating >= 2.5 && r.rating < 3.5).length,
        2: reviews.filter(r => r.rating >= 1.5 && r.rating < 2.5).length,
        1: reviews.filter(r => r.rating >= 1 && r.rating < 1.5).length,
    };

    return (
        <div>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" component="h2" fontWeight={700} sx={{ mb: 1 }}>
                    Ulasan Perusahaan
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Lihat apa kata kandidat lain tentang pengalaman mereka bekerja di {company.name}.
                </Typography>
            </Box>

            {reviews.length > 0 ? (
                <Grid container spacing={4} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={4}>
                        <Box
                            sx={{
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: '1rem',
                                p: 3,
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <Box sx={{ textAlign: 'center', mb: 3 }}>
                                <Typography variant="h2" fontWeight={700} sx={{ color: getRatingColor(reviewStats.average_rating) }}>
                                    {reviewStats.average_rating.toFixed(1)}
                                </Typography>
                                <Rating
                                    value={reviewStats.average_rating}
                                    readOnly
                                    precision={0.5}
                                    icon={<StarIcon fontSize="inherit" />}
                                    emptyIcon={<StarBorderIcon fontSize="inherit" />}
                                    sx={{
                                        mb: 1,
                                        '& .MuiRating-iconFilled': {
                                            color: getRatingColor(reviewStats.average_rating),
                                        },
                                    }}
                                />
                                <Typography variant="body2" color="text.secondary">
                                    {reviewStats.total_reviews} ulasan
                                </Typography>
                            </Box>

                            <Divider sx={{ mb: 3 }} />

                            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                                Rating berdasarkan kategori
                            </Typography>

                            <Box sx={{ mb: 3 }}>
                                {Object.entries(reviewStats.category_averages).map(([key, value]) => (
                                    <Box key={key} sx={{ mb: 1.5 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                {key === 'work_culture' ? 'Budaya Kerja' :
                                                key === 'career_growth' ? 'Pengembangan Karier' :
                                                key === 'work_life_balance' ? 'Work-Life Balance' :
                                                key === 'salary_benefits' ? 'Gaji & Tunjangan' : 'Manajemen'}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                fontWeight={600}
                                                color={getRatingColor(value)}
                                            >
                                                {value.toFixed(1)}
                                            </Typography>
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={value * 20} // Convert 1-5 to percentage
                                            sx={{
                                                height: 8,
                                                borderRadius: 4,
                                                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                                                '& .MuiLinearProgress-bar': {
                                                    borderRadius: 4,
                                                    backgroundColor: getRatingColor(value),
                                                }
                                            }}
                                        />
                                    </Box>
                                ))}
                            </Box>

                            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                                Distribusi Rating
                            </Typography>

                            <Box sx={{ mb: 1, flex: 1 }}>
                                <RatingStatItem
                                    label="5 bintang"
                                    value={5}
                                    count={ratingCounts[5]}
                                    total={reviewStats.total_reviews}
                                />
                                <RatingStatItem
                                    label="4 bintang"
                                    value={4}
                                    count={ratingCounts[4]}
                                    total={reviewStats.total_reviews}
                                />
                                <RatingStatItem
                                    label="3 bintang"
                                    value={3}
                                    count={ratingCounts[3]}
                                    total={reviewStats.total_reviews}
                                />
                                <RatingStatItem
                                    label="2 bintang"
                                    value={2}
                                    count={ratingCounts[2]}
                                    total={reviewStats.total_reviews}
                                />
                                <RatingStatItem
                                    label="1 bintang"
                                    value={1}
                                    count={ratingCounts[1]}
                                    total={reviewStats.total_reviews}
                                />
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 1.5,
                                mb: 3,
                                borderRadius: '1rem',
                                border: '1px solid',
                                borderColor: 'divider',
                            }}
                        >
                            <Tabs
                                value={tabValue}
                                onChange={handleTabChange}
                                indicatorColor="primary"
                                textColor="primary"
                                variant="fullWidth"
                                sx={{
                                    '& .MuiTab-root': {
                                        fontWeight: 600,
                                        fontSize: '0.9rem',
                                        textTransform: 'none',
                                        minHeight: '48px',
                                        borderRadius: '0.5rem',
                                        '&.Mui-selected': {
                                            color: 'primary.main',
                                            backgroundColor: 'rgba(20, 184, 166, 0.08)',
                                        }
                                    }
                                }}
                            >
                                <Tab label={`Semua (${reviews.length})`} />
                                <Tab label={`Positif (${reviews.filter(r => r.rating >= 4).length})`} />
                                <Tab label={`Negatif (${reviews.filter(r => r.rating < 3).length})`} />
                            </Tabs>
                        </Paper>

                        <AnimatePresence>
                            {filteredReviews.length > 0 ? (
                                filteredReviews.map(review => (
                                    <ReviewCard key={review.id} review={review} />
                                ))
                            ) : (
                                <Box sx={{ textAlign: 'center', p: 4 }}>
                                    <Typography variant="body1" color="text.secondary">
                                        Tidak ada ulasan {tabValue === 1 ? 'positif' : tabValue === 2 ? 'negatif' : ''} yang tersedia.
                                    </Typography>
                                </Box>
                            )}
                        </AnimatePresence>
                    </Grid>
                </Grid>
            ) : (
                <EmptyState
                    icon={<StarIcon style={{ fontSize: 64 }} />}
                    title="Belum Ada Ulasan"
                    description={`Belum ada ulasan untuk ${company.name}. Jika Anda pernah bekerja di perusahaan ini, berbagi pengalaman Anda dapat membantu kandidat lain.`}
                />
            )}
        </div>
    );
};

export default CompanyReviews;
