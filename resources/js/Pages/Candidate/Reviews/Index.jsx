import React from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    Container,
    Typography,
    Box,
    Paper,
    Rating,
    Divider,
    Avatar,
    Grid,
    Card,
    CardContent,
    Chip,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Tooltip,
    Alert,
    Stack,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    Star as StarIcon,
    StarBorder as StarBorderIcon,
    StarHalf as StarHalfIcon,
    Business as BusinessIcon,
    Person as PersonIcon,
    AccessTime as AccessTimeIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as VisibilityIcon,
    ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import Layout from '@/Components/Layout/Layout';
import Button from '@/Components/Shared/Button';
import { motion } from 'framer-motion';
import EmptyState from '@/Components/Shared/EmptyState';

const ReviewListItem = ({ review, onDelete }) => {
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
                mb: 2,
                p: 0,
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
                    borderRadius: '1rem',
                }}
            >
                <CardContent sx={{ p: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={8} md={9}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Avatar
                                    src={review.company.logo}
                                    variant="rounded"
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        bgcolor: 'primary.light',
                                        color: 'primary.main',
                                        mr: 1.5,
                                        borderRadius: '0.5rem',
                                    }}
                                >
                                    {review.company.name ? review.company.name.charAt(0) : <BusinessIcon />}
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight={600}>
                                        {review.company.name}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            {review.job_application.job.title}
                                        </Typography>
                                        <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 14 }} />
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <AccessTimeIcon sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                                            <Typography variant="caption" color="text.secondary">
                                                {formatDate(review.created_at)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>

                            <Box sx={{ my: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Rating
                                        value={review.rating}
                                        readOnly
                                        precision={0.5}
                                        size="small"
                                        icon={<StarIcon fontSize="inherit" />}
                                        emptyIcon={<StarBorderIcon fontSize="inherit" />}
                                        sx={{ color: 'secondary.main', mr: 1 }}
                                    />
                                    <Typography variant="body2" fontWeight={500}>
                                        {review.rating.toFixed(1)}
                                    </Typography>

                                    {review.is_anonymous && (
                                        <Chip
                                            size="small"
                                            label="Anonim"
                                            sx={{
                                                ml: 1,
                                                height: 20,
                                                fontSize: '0.7rem',
                                                bgcolor: 'grey.200',
                                                color: 'text.secondary',
                                            }}
                                        />
                                    )}
                                </Box>

                                {review.review_text && (
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                        }}
                                    >
                                        {review.review_text}
                                    </Typography>
                                )}
                            </Box>
                        </Grid>

                        <Grid item xs={12} sm={4} md={3} sx={{ display: 'flex', alignItems: 'center', justifyContent: {xs: 'flex-start', sm: 'flex-end'} }}>
                            <Stack direction={{xs: 'row', sm: 'column'}} spacing={1} sx={{ width: {xs: '100%', sm: 'auto'} }}>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                    startIcon={<VisibilityIcon />}
                                    href={route('candidate.reviews.show', review.id)}
                                    sx={{ flexGrow: {xs: 1, sm: 0} }}
                                >
                                    Lihat
                                </Button>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    color="error"
                                    startIcon={<DeleteIcon />}
                                    onClick={() => onDelete(review.id)}
                                    sx={{ flexGrow: {xs: 1, sm: 0} }}
                                >
                                    Hapus
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </ListItem>
    );
};

const Index = ({ reviews, flash }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus ulasan ini?')) {
            router.delete(route('candidate.reviews.destroy', id));
        }
    };

    return (
        <Layout>
            <Head title="Ulasan Perusahaan Saya" />

            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        Ulasan Perusahaan Saya
                    </Typography>
                </Box>

                {flash.success && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                        {flash.success}
                    </Alert>
                )}

                {flash.error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {flash.error}
                    </Alert>
                )}

                {reviews.length > 0 ? (
                    <List sx={{ p: 0 }}>
                        {reviews.map((review) => (
                            <ReviewListItem
                                key={review.id}
                                review={review}
                                onDelete={handleDelete}
                            />
                        ))}
                    </List>
                ) : (
                    <Paper
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
                            description="Anda belum memberikan ulasan untuk perusahaan tempat Anda melamar. Berikan ulasan untuk membantu kandidat lain."
                            button={
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    href={route('candidate.applications.index')}
                                    endIcon={<ArrowForwardIcon />}
                                    sx={{ mt: 2 }}
                                >
                                    Lihat Aplikasi Saya
                                </Button>
                            }
                        />
                    </Paper>
                )}
            </Container>
        </Layout>
    );
};

export default Index;
