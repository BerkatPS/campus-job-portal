import React, { useState } from 'react';
import {
    Box,
    Typography,
    Rating,
    Paper,
    Avatar,
    Divider,
    Chip,
    LinearProgress,
    Grid,
    Button as MuiButton,
    IconButton,
    List,
    ListItem,
    Stack,
    Card,
    CardContent,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    Star as StarIcon,
    StarBorder as StarBorderIcon,
    StarHalf as StarHalfIcon,
    Person as PersonIcon,
    AccessTime as AccessTimeIcon,
    Info as InfoIcon,
    Sort as SortIcon,
    FilterList as FilterListIcon,
    KeyboardArrowDown as KeyboardArrowDownIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/Components/Shared/Button';
import EmptyState from '@/Components/Shared/EmptyState';

const CategoryRating = ({ label, value, count, color }) => {
    return (
        <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ width: 160, mr: 2, color: 'text.secondary' }}>
                {label}
            </Typography>
            <Box sx={{ flex: 1, mr: 2 }}>
                <LinearProgress
                    variant="determinate"
                    value={value * 20} // Convert 0-5 rating to 0-100%
                    sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                            backgroundColor: color,
                            borderRadius: 4
                        }
                    }}
                />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 60 }}>
                <StarIcon sx={{ color: color, fontSize: 16, mr: 0.5 }} />
                <Typography variant="body2" fontWeight={500}>
                    {value.toFixed(1)}
                </Typography>
            </Box>
        </Box>
    );
};

const RatingSummary = ({ averageRating, totalReviews, ratingCounts, averageCategories }) => {
    const theme = useTheme();

    return (
        <Card elevation={0} sx={{ borderRadius: '1rem', border: '1px solid', borderColor: 'divider', mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                            <Typography variant="h1" fontWeight={700} sx={{ color: 'secondary.main' }}>
                                {averageRating.toFixed(1)}
                            </Typography>
                            <Rating
                                value={averageRating}
                                precision={0.5}
                                readOnly
                                icon={<StarIcon fontSize="small" />}
                                emptyIcon={<StarBorderIcon fontSize="small" />}
                                sx={{ color: 'secondary.main', mb: 1 }}
                            />
                            <Typography variant="body2" color="text.secondary">
                                Berdasarkan {totalReviews} ulasan
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <Box>
                            <CategoryRating
                                label="Budaya Kerja"
                                value={averageCategories.work_culture || 0}
                                color={theme.palette.primary.main}
                            />
                            <CategoryRating
                                label="Pertumbuhan Karir"
                                value={averageCategories.career_growth || 0}
                                color={theme.palette.secondary.main}
                            />
                            <CategoryRating
                                label="Keseimbangan Kerja"
                                value={averageCategories.work_life_balance || 0}
                                color={theme.palette.success.main}
                            />
                            <CategoryRating
                                label="Gaji & Tunjangan"
                                value={averageCategories.salary_benefits || 0}
                                color={theme.palette.warning.main}
                            />
                            <CategoryRating
                                label="Manajemen"
                                value={averageCategories.management || 0}
                                color={theme.palette.info.main}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

const ReviewCard = ({ review }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <ListItem
            component={motion.div}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            sx={{
                p: 0,
                mb: 2,
                display: 'block',
                borderRadius: '1rem',
                overflow: 'hidden'
            }}
        >
            <Card
                elevation={0}
                sx={{
                    width: '100%',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '1rem'
                }}
            >
                <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                                sx={{
                                    bgcolor: review.is_anonymous ? 'grey.200' : 'primary.light',
                                    color: review.is_anonymous ? 'text.secondary' : 'primary.main',
                                    mr: 1.5
                                }}
                            >
                                {review.is_anonymous ? <PersonIcon /> : (review.user?.name?.charAt(0) || <PersonIcon />)}
                            </Avatar>
                            <Box>
                                <Typography variant="subtitle1" fontWeight={600}>
                                    {review.is_anonymous ? 'Anonim' : review.user?.name || 'Pengguna'}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="body2" color="text.secondary">
                                        {review.job_application.job.title}
                                    </Typography>
                                    <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 14 }} />
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <AccessTimeIcon sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                                        <Typography variant="caption" color="text.secondary">
                                            {formatDate(review.created_at)}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                        <Box sx={{ textAlign: 'center', p: 1, borderRadius: '0.75rem', bgcolor: 'secondary.light', minWidth: 60 }}>
                            <Typography variant="h5" fontWeight={700} sx={{ color: 'secondary.main' }}>
                                {review.rating}
                            </Typography>
                            <Typography variant="caption" sx={{ display: 'block', fontWeight: 500, color: 'secondary.dark' }}>
                                dari 5
                            </Typography>
                        </Box>
                    </Box>

                    {review.review_text && (
                        <Typography variant="body2" sx={{ my: 2 }}>
                            {review.review_text}
                        </Typography>
                    )}

                    {review.rating_categories && Object.keys(review.rating_categories).length > 0 && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                Penilaian Detail
                            </Typography>
                            <Grid container spacing={1}>
                                {review.rating_categories.work_culture !== undefined && (
                                    <Grid item xs={6} sm={4}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <Typography variant="caption" color="text.secondary" sx={{ mr: 1, flex: 1 }}>
                                                Budaya Kerja:
                                            </Typography>
                                            <Rating
                                                value={review.rating_categories.work_culture}
                                                readOnly
                                                size="small"
                                                icon={<StarIcon fontSize="inherit" />}
                                                emptyIcon={<StarBorderIcon fontSize="inherit" />}
                                                sx={{ color: 'secondary.main' }}
                                            />
                                        </Box>
                                    </Grid>
                                )}

                                {review.rating_categories.career_growth !== undefined && (
                                    <Grid item xs={6} sm={4}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <Typography variant="caption" color="text.secondary" sx={{ mr: 1, flex: 1 }}>
                                                Karir:
                                            </Typography>
                                            <Rating
                                                value={review.rating_categories.career_growth}
                                                readOnly
                                                size="small"
                                                icon={<StarIcon fontSize="inherit" />}
                                                emptyIcon={<StarBorderIcon fontSize="inherit" />}
                                                sx={{ color: 'secondary.main' }}
                                            />
                                        </Box>
                                    </Grid>
                                )}

                                {review.rating_categories.work_life_balance !== undefined && (
                                    <Grid item xs={6} sm={4}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <Typography variant="caption" color="text.secondary" sx={{ mr: 1, flex: 1 }}>
                                                WLB:
                                            </Typography>
                                            <Rating
                                                value={review.rating_categories.work_life_balance}
                                                readOnly
                                                size="small"
                                                icon={<StarIcon fontSize="inherit" />}
                                                emptyIcon={<StarBorderIcon fontSize="inherit" />}
                                                sx={{ color: 'secondary.main' }}
                                            />
                                        </Box>
                                    </Grid>
                                )}

                                {review.rating_categories.salary_benefits !== undefined && (
                                    <Grid item xs={6} sm={4}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <Typography variant="caption" color="text.secondary" sx={{ mr: 1, flex: 1 }}>
                                                Gaji:
                                            </Typography>
                                            <Rating
                                                value={review.rating_categories.salary_benefits}
                                                readOnly
                                                size="small"
                                                icon={<StarIcon fontSize="inherit" />}
                                                emptyIcon={<StarBorderIcon fontSize="inherit" />}
                                                sx={{ color: 'secondary.main' }}
                                            />
                                        </Box>
                                    </Grid>
                                )}

                                {review.rating_categories.management !== undefined && (
                                    <Grid item xs={6} sm={4}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <Typography variant="caption" color="text.secondary" sx={{ mr: 1, flex: 1 }}>
                                                Manajemen:
                                            </Typography>
                                            <Rating
                                                value={review.rating_categories.management}
                                                readOnly
                                                size="small"
                                                icon={<StarIcon fontSize="inherit" />}
                                                emptyIcon={<StarBorderIcon fontSize="inherit" />}
                                                sx={{ color: 'secondary.main' }}
                                            />
                                        </Box>
                                    </Grid>
                                )}
                            </Grid>
                        </Box>
                    )}
                </CardContent>
            </Card>
        </ListItem>
    );
};

const CompanyReviews = ({ companyId, reviews, averageRating, totalReviews, ratingCounts, averageCategories }) => {
    const [sortBy, setSortBy] = useState('newest');
    const [showCount, setShowCount] = useState(3);

    const sortedReviews = [...reviews].sort((a, b) => {
        if (sortBy === 'newest') {
            return new Date(b.created_at) - new Date(a.created_at);
        } else if (sortBy === 'oldest') {
            return new Date(a.created_at) - new Date(b.created_at);
        } else if (sortBy === 'highest') {
            return b.rating - a.rating;
        } else if (sortBy === 'lowest') {
            return a.rating - b.rating;
        }
        return 0;
    });

    const displayedReviews = sortedReviews.slice(0, showCount);
    const hasMoreReviews = showCount < reviews.length;

    const handleLoadMore = () => {
        setShowCount(prev => prev + 5);
    };

    const handleSort = (value) => {
        setSortBy(value);
    };

    return (
        <Box sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5" fontWeight={700}>
                    Ulasan ({totalReviews})
                </Typography>

                {reviews.length > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                            <SortIcon sx={{ fontSize: 18, mr: 0.5, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                                Urutkan:
                            </Typography>
                        </Box>
                        <MuiButton
                            size="small"
                            variant={sortBy === 'newest' ? 'contained' : 'outlined'}
                            color="secondary"
                            onClick={() => handleSort('newest')}
                            sx={{ mr: 1, borderRadius: '1rem', py: 0.5 }}
                        >
                            Terbaru
                        </MuiButton>
                        <MuiButton
                            size="small"
                            variant={sortBy === 'highest' ? 'contained' : 'outlined'}
                            color="secondary"
                            onClick={() => handleSort('highest')}
                            sx={{ borderRadius: '1rem', py: 0.5 }}
                        >
                            Tertinggi
                        </MuiButton>
                    </Box>
                )}
            </Box>

            {totalReviews > 0 ? (
                <>
                    <RatingSummary
                        averageRating={averageRating}
                        totalReviews={totalReviews}
                        ratingCounts={ratingCounts}
                        averageCategories={averageCategories}
                    />

                    <List sx={{ p: 0 }}>
                        <AnimatePresence>
                            {displayedReviews.map((review) => (
                                <ReviewCard key={review.id} review={review} />
                            ))}
                        </AnimatePresence>
                    </List>

                    {hasMoreReviews && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={handleLoadMore}
                                endIcon={<KeyboardArrowDownIcon />}
                            >
                                Muat Lebih Banyak
                            </Button>
                        </Box>
                    )}
                </>
            ) : (
                <Card
                    elevation={0}
                    sx={{
                        p: 4,
                        borderRadius: '1rem',
                        border: '1px solid',
                        borderColor: 'divider',
                        textAlign: 'center'
                    }}
                >
                    <EmptyState
                        icon={<StarHalfIcon sx={{ fontSize: 80, color: 'secondary.light' }} />}
                        title="Belum Ada Ulasan"
                        description="Perusahaan ini belum memiliki ulasan dari kandidat. Jadilah yang pertama memberikan ulasan setelah Anda melamar dan menyelesaikan proses aplikasi."
                    />
                </Card>
            )}
        </Box>
    );
};

export default CompanyReviews;
