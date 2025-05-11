import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Container,
    Box,
    Typography,
    TextField,
    Paper,
    Divider,
    useTheme,
    Chip,
    Avatar,
    Button,
    IconButton,
    Card,
    CardContent,
    CardActions,
    CardHeader,
    Tooltip,
    Badge,
    Alert,
    AlertTitle,
    Breadcrumbs,
    Pagination,
    Stack,
} from '@mui/material';
import {
    Forum as ForumIcon,
    ThumbUp as ThumbUpIcon,
    ThumbUpOutlined as ThumbUpOutlinedIcon,
    ArrowBack as ArrowBackIcon,
    Category as CategoryIcon,
    Person as PersonIcon,
    Visibility as VisibilityIcon,
    AccessTime as AccessTimeIcon,
    Reply as ReplyIcon,
    VerifiedUser as VerifiedUserIcon,
    Check as CheckIcon,
    School as SchoolIcon,
    NavigateNext as NavigateNextIcon,
    Bookmark as BookmarkIcon,
    BookmarkBorder as BookmarkBorderIcon,
    Share as ShareIcon,
    FiberManualRecord as FiberManualRecordIcon,
    Info as InfoIcon,
    Announcement as AnnouncementIcon,
} from '@mui/icons-material';
import PublicLayout from '@/Components/Layout/PublicLayout';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import DOMPurify from 'dompurify';
import { motion } from 'framer-motion';
import MuiThemeProvider from '@/Theme/MuiThemeProvider';

// Custom Chip component following your design system
const CustomChip = ({ icon, label, color = "default", onDelete, variant = "outlined", size = "small", className = "" }) => {
    const theme = useTheme();

    const getChipStyle = () => {
        if (color === "primary") {
            return {
                color: theme.palette.primary.main,
                borderColor: theme.palette.primary.main,
                backgroundColor: `${theme.palette.primary.main}15`,
                "& .MuiChip-deleteIcon": {
                    color: theme.palette.primary.main,
                },
            };
        } else if (color === "secondary") {
            return {
                color: theme.palette.secondary.main,
                borderColor: theme.palette.secondary.main,
                backgroundColor: `${theme.palette.secondary.main}15`,
                "& .MuiChip-deleteIcon": {
                    color: theme.palette.secondary.main,
                },
            };
        } else if (color === "error") {
            return {
                color: theme.palette.error.main,
                borderColor: theme.palette.error.main,
                backgroundColor: `${theme.palette.error.main}15`,
                "& .MuiChip-deleteIcon": {
                    color: theme.palette.error.main,
                },
            };
        } else if (color === "warning") {
            return {
                color: "#f59e0b",
                borderColor: "#f59e0b",
                backgroundColor: "#f59e0b15",
                "& .MuiChip-deleteIcon": {
                    color: "#f59e0b",
                },
            };
        } else if (color === "success") {
            return {
                color: "#10b981",
                borderColor: "#10b981",
                backgroundColor: "#10b98115",
                "& .MuiChip-deleteIcon": {
                    color: "#10b981",
                },
            };
        } else if (color === "info") {
            return {
                color: "#3b82f6",
                borderColor: "#3b82f6",
                backgroundColor: "#3b82f615",
                "& .MuiChip-deleteIcon": {
                    color: "#3b82f6",
                },
            };
        } else {
            return {
                color: theme.palette.text.secondary,
                borderColor: theme.palette.divider,
                backgroundColor: theme.palette.action.hover,
            };
        }
    };

    return (
        <Chip
            icon={icon}
            label={label}
            onDelete={onDelete}
            variant={variant}
            size={size}
            className={className}
            sx={{
                fontWeight: 500,
                borderRadius: '0.75rem',
                ...getChipStyle(),
            }}
        />
    );
};

const PostItem = ({ post, isLiked, onLike, isFirstPost, topic }) => {
    const theme = useTheme();

    // Fungsi untuk menampilkan konten HTML dengan aman
    const createMarkup = (html) => {
        return { __html: DOMPurify.sanitize(html) };
    };

    return (
        <Card
            elevation={0}
            className="transition-all duration-300 hover:shadow-md"
            sx={{
                mb: 3,
                border: '1px solid',
                borderColor: 'divider',
                borderLeft: isFirstPost ? `4px solid ${theme.palette.primary.main}` : '1px solid',
                borderRadius: '1rem',
                overflow: 'hidden',
            }}
        >
            <Box sx={{ bgcolor: isFirstPost ? 'primary.50' : 'background.paper' }}>
                <CardHeader
                    avatar={
                        <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            badgeContent={
                                isFirstPost ? (
                                    <Tooltip title="Pembuat Topik">
                                        <Avatar
                                            sx={{
                                                width: 22,
                                                height: 22,
                                                bgcolor: 'primary.main',
                                                border: '2px solid white',
                                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                                            }}
                                        >
                                            <PersonIcon sx={{ fontSize: 14 }} />
                                        </Avatar>
                                    </Tooltip>
                                ) : null
                            }
                        >
                            <Avatar
                                alt={post.user.name}
                                src={post.user.avatar}
                                sx={{
                                    width: 48,
                                    height: 48,
                                    bgcolor: isFirstPost ? 'primary.main' : 'secondary.main',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                                }}
                            >
                                {post.user.name?.charAt(0)}
                            </Avatar>
                        </Badge>
                    }
                    title={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="subtitle1" className="font-semibold text-gray-800">
                                {post.user.name}
                            </Typography>
                            {post.user.candidateProfile?.is_verified && (
                                <Tooltip title="Mahasiswa Terverifikasi">
                                    <VerifiedUserIcon color="primary" fontSize="small" sx={{ ml: 1 }} />
                                </Tooltip>
                            )}
                        </Box>
                    }
                    subheader={
                        <Stack spacing={0.5} mt={0.5}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                <AccessTimeIcon fontSize="inherit" sx={{ mr: 0.5 }} />
                                {format(new Date(post.created_at), 'dd MMMM yyyy, HH:mm', { locale: id })}
                            </Typography>
                            {post.user.candidateProfile && (
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <SchoolIcon fontSize="inherit" sx={{ mr: 0.5 }} />
                                    {post.user.candidateProfile.university}
                                </Typography>
                            )}
                        </Stack>
                    }
                    action={
                        <Box sx={{ mt: 1 }}>
                            {!isFirstPost && post.is_solution && (
                                <CustomChip
                                    label="Solusi"
                                    variant="filled"
                                    color="success"
                                    size="small"
                                    icon={<CheckIcon />}
                                />
                            )}
                        </Box>
                    }
                />
            </Box>

            <Divider />

            <CardContent sx={{ p: 3 }}>
                {isFirstPost && (
                    <Typography
                        variant="h5"
                        gutterBottom
                        sx={{
                            fontWeight: 700,
                            color: 'primary.700',
                            mb: 2.5,
                            pb: 1,
                            position: 'relative',
                            '&:after': {
                                content: '""',
                                position: 'absolute',
                                width: 60,
                                height: 3,
                                bottom: 0,
                                left: 0,
                                bgcolor: 'primary.main',
                                borderRadius: 1
                            }
                        }}
                    >
                        {topic.title}
                    </Typography>
                )}

                <Box
                    sx={{
                        color: 'text.primary',
                        '& img': {
                            maxWidth: '100%',
                            height: 'auto',
                            borderRadius: '0.5rem',
                            my: 1.5
                        },
                        '& a': {
                            color: 'primary.main',
                            textDecoration: 'none',
                            '&:hover': {
                                textDecoration: 'underline'
                            }
                        },
                        '& ul, & ol': { pl: 2, my: 1.5 },
                        '& blockquote': {
                            pl: 2,
                            borderLeft: '3px solid',
                            borderColor: 'primary.200',
                            color: 'text.secondary',
                            my: 1.5,
                            py: 0.5,
                            px: 2,
                            bgcolor: 'grey.50',
                            borderRadius: '0 0.5rem 0.5rem 0'
                        },
                        '& p': {
                            lineHeight: 1.6,
                            mb: 1.5
                        },
                        '& h1, & h2, & h3, & h4, & h5, & h6': {
                            color: 'text.primary',
                            fontWeight: 600,
                            mt: 2,
                            mb: 1
                        }
                    }}
                    dangerouslySetInnerHTML={createMarkup(post.content)}
                />
            </CardContent>

            <Divider />

            <CardActions sx={{ justifyContent: 'space-between', px: 3, py: 1.5 }}>
                <Button
                    size="small"
                    variant={isLiked ? "contained" : "outlined"}
                    color="primary"
                    startIcon={isLiked ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
                    onClick={() => onLike(post.id)}
                    sx={{
                        borderRadius: '0.75rem',
                        px: 2,
                        fontWeight: 500,
                        boxShadow: isLiked ? '0 2px 8px rgba(20, 184, 166, 0.25)' : 'none',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: isLiked ? '0 4px 12px rgba(20, 184, 166, 0.3)' : 'none',
                        },
                        transition: 'all 0.2s ease'
                    }}
                    className="transition-all duration-300"
                >
                    {isLiked ? 'Disukai' : 'Suka'} ({post.likes_count})
                </Button>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Bagikan">
                        <IconButton
                            size="small"
                            sx={{
                                bgcolor: 'grey.100',
                                borderRadius: '0.75rem',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    bgcolor: 'grey.200',
                                    transform: 'translateY(-2px)'
                                }
                            }}
                            className="text-gray-500 transition-all duration-300"
                        >
                            <ShareIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Simpan">
                        <IconButton
                            size="small"
                            sx={{
                                bgcolor: 'grey.100',
                                borderRadius: '0.75rem',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    bgcolor: 'grey.200',
                                    transform: 'translateY(-2px)'
                                }
                            }}
                            className="text-gray-500 transition-all duration-300"
                        >
                            <BookmarkBorderIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            </CardActions>
        </Card>
    );
};

const ReplyForm = ({ topicId, processingForm }) => {
    const theme = useTheme();
    const { data, setData, post, processing, errors, reset } = useForm({
        content: '',
        topic_id: topicId,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('public.forum.store.post'), {
            onSuccess: () => {
                reset('content');
            },
        });
    };

    return (
        <Card
            sx={{
                mt: 4,
                borderRadius: '1rem',
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
            }}
        >
            <CardContent sx={{ p: 0 }}>
                <Box
                    sx={{
                        bgcolor: 'primary.50',
                        p: 3,
                        borderRadius: '1rem 1rem 0 0',
                        borderBottom: '1px solid',
                        borderColor: 'divider'
                    }}
                >
                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ display: 'flex', alignItems: 'center' }}
                        className="text-gray-800"
                    >
                        <ReplyIcon sx={{ mr: 1 }} className="text-primary-500" />
                        Tulis Komentar
                    </Typography>
                </Box>

                <Box sx={{ p: 3 }}>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            id="content"
                            name="content"
                            label="Komentar Anda"
                            multiline
                            rows={4}
                            fullWidth
                            value={data.content}
                            onChange={e => setData('content', e.target.value)}
                            error={!!errors.content}
                            helperText={errors.content}
                            required
                            sx={{
                                mb: 2.5,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '0.75rem',
                                    '&:hover fieldset': {
                                        borderColor: 'primary.main',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'primary.main',
                                        boxShadow: '0 0 0 3px rgba(20, 184, 166, 0.1)'
                                    },
                                }
                            }}
                        />

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                type="submit"
                                loading={processing}
                                variant="contained"
                                size="large"
                                startIcon={<ReplyIcon />}
                                sx={{
                                    borderRadius: '0.75rem',
                                    px: 3,
                                    py: 1.2,
                                    fontWeight: 600,
                                    boxShadow: '0 4px 14px 0 rgba(20, 184, 166, 0.25)',
                                    '&:hover': {
                                        boxShadow: '0 6px 20px 0 rgba(20, 184, 166, 0.35)',
                                        transform: 'translateY(-2px)'
                                    },
                                    transition: 'all 0.3s ease'
                                }}
                                className="transition-all duration-300"
                            >
                                Kirim Komentar
                            </Button>
                        </Box>
                    </form>
                </Box>
            </CardContent>
        </Card>
    );
};

const Topic = ({ topic, posts, userLikes, flash }) => {
    const theme = useTheme();
    const [likes, setLikes] = useState(userLikes || []);
    const [page, setPage] = useState(posts.current_page || 1);
    const [isSaved, setIsSaved] = useState(false);

    const handlePageChange = (event, value) => {
        setPage(value);
        window.location.href = `${route('public.forum.topic', topic.slug)}?page=${value}`;
    };

    const handleLike = (postId) => {
        // Optimistic UI update
        if (likes.includes(postId)) {
            setLikes(likes.filter(id => id !== postId));
        } else {
            setLikes([...likes, postId]);
        }

        // Kirim request like
        window.axios.post(route('public.forum.like.post', postId))
            .then(response => {
                // Handle response if needed
            })
            .catch(error => {
                // Revert optimistic update on error
                if (likes.includes(postId)) {
                    setLikes([...likes, postId]);
                } else {
                    setLikes(likes.filter(id => id !== postId));
                }
            });
    };

    return (
        <MuiThemeProvider>
            <PublicLayout>
                <Head title={`${topic.title} - Forum Diskusi`} />

                <Box sx={{ bgcolor: 'gray.50' }} className="bg-gray-50">
                    <Container maxWidth="lg">
                        <Box sx={{ py: 3 }}>
                            <Breadcrumbs
                                separator={<NavigateNextIcon fontSize="small" className="text-gray-400" />}
                                aria-label="breadcrumb"
                            >
                                <Link href={route('public.home')} className="text-gray-600 hover:text-primary-600 transition-colors">
                                    Beranda
                                </Link>
                                <Link href={route('public.forum.index')} className="text-gray-600 hover:text-primary-600 transition-colors">
                                    <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                                        <ForumIcon sx={{ mr: 0.5 }} fontSize="small" />
                                        Forum
                                    </Typography>
                                </Link>
                                <Link href={route('public.forum.category', topic.category.slug)} className="text-gray-600 hover:text-primary-600 transition-colors">
                                    {topic.category.name}
                                </Link>
                                <Typography color="text.primary" className="text-gray-800 font-medium">
                                    Topik
                                </Typography>
                            </Breadcrumbs>
                        </Box>
                    </Container>
                </Box>

                <Container maxWidth="lg" sx={{ py: 6 }}>
                    <Box sx={{ 
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: '8fr 4fr' },
                        gap: 4 
                    }}>
                        {/* Main content */}
                        <Box>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                {flash?.success && (
                                    <Alert
                                        severity="success"
                                        sx={{
                                            mb: 3,
                                            borderRadius: '0.75rem',
                                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                            border: '1px solid rgba(16, 185, 129, 0.2)',
                                            '& .MuiAlert-icon': {
                                                color: '#10b981'
                                            }
                                        }}
                                    >
                                        <AlertTitle>Berhasil</AlertTitle>
                                        {flash.success}
                                    </Alert>
                                )}

                                {flash?.error && (
                                    <Alert
                                        severity="error"
                                        sx={{
                                            mb: 3,
                                            borderRadius: '0.75rem',
                                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                            border: '1px solid rgba(239, 68, 68, 0.2)',
                                            '& .MuiAlert-icon': {
                                                color: '#ef4444'
                                            }
                                        }}
                                    >
                                        <AlertTitle>Error</AlertTitle>
                                        {flash.error}
                                    </Alert>
                                )}

                                <Box sx={{ mb: 4 }}>
                                    <Button
                                        component={Link}
                                        href={route('public.forum.category', topic.category.slug)}
                                        startIcon={<ArrowBackIcon />}
                                        variant="outlined"
                                        color="inherit"
                                        sx={{
                                            borderRadius: '0.75rem',
                                            '&:hover': { transform: 'translateX(-4px)' },
                                            transition: 'transform 0.3s'
                                        }}
                                    >
                                        Kembali ke {topic.category.name}
                                    </Button>
                                </Box>

                                {/* Posts */}
                                {posts.data && posts.data.length > 0 && (
                                    <Box>
                                        {posts.data.map((post, index) => (
                                            <motion.div
                                                key={post.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                            >
                                                <PostItem
                                                    post={post}
                                                    isLiked={likes.includes(post.id)}
                                                    onLike={() => handleLike(post.id)}
                                                    isFirstPost={index === 0}
                                                    topic={topic}
                                                />
                                            </motion.div>
                                        ))}

                                        {/* Pagination */}
                                        {posts.last_page > 1 && (
                                            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                                                <Pagination
                                                    count={posts.last_page}
                                                    page={page}
                                                    onChange={handlePageChange}
                                                    color="primary"
                                                    shape="rounded"
                                                    sx={{
                                                        '& .MuiPaginationItem-root': {
                                                            borderRadius: '0.5rem',
                                                        }
                                                    }}
                                                />
                                            </Box>
                                        )}

                                        {/* Reply Form */}
                                        <ReplyForm topicId={topic.id} processingForm={false} />
                                    </Box>
                                )}
                            </motion.div>
                        </Box>

                        {/* Sidebar */}
                        <Box>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                            >
                                <Paper
                                    elevation={0}
                                    sx={{
                                        borderRadius: '1rem',
                                        p: 3,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        mb: 3
                                    }}
                                >
                                    <Typography
                                        variant="subtitle1"
                                        fontWeight="bold"
                                        gutterBottom
                                        sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}
                                    >
                                        <InfoIcon color="primary" fontSize="small" />
                                        Tentang Topik Ini
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <Box sx={{ '& > div': { mb: 2 } }}>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" gutterBottom>
                                                Kategori
                                            </Typography>
                                            <Typography variant="body2" fontWeight="medium">
                                                {topic.category.name}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" gutterBottom>
                                                Dibuat oleh
                                            </Typography>
                                            <Typography variant="body2" fontWeight="medium">
                                                {topic.user.name}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" gutterBottom>
                                                Tanggal dibuat
                                            </Typography>
                                            <Typography variant="body2">
                                                {format(new Date(topic.created_at), 'dd MMMM yyyy', { locale: id })}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" gutterBottom>
                                                Jumlah komentar
                                            </Typography>
                                            <Typography variant="body2">
                                                {posts.total} komentar
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" gutterBottom>
                                                Dilihat
                                            </Typography>
                                            <Typography variant="body2">
                                                {topic.views} kali
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Paper>

                                <Paper
                                    elevation={0}
                                    sx={{
                                        borderRadius: '1rem',
                                        p: 3,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        bgcolor: 'primary.50',
                                    }}
                                >
                                    <Typography
                                        variant="subtitle1"
                                        fontWeight="bold"
                                        gutterBottom
                                        sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}
                                    >
                                        <AnnouncementIcon color="primary" fontSize="small" />
                                        Aturan Forum
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <Box component="ul" sx={{ pl: 2, mb: 0 }}>
                                        <Box component="li" sx={{ mb: 1 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Gunakan bahasa yang sopan dan hormat
                                            </Typography>
                                        </Box>
                                        <Box component="li" sx={{ mb: 1 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Jangan melakukan spam atau mempromosikan hal yang tidak relevan
                                            </Typography>
                                        </Box>
                                        <Box component="li" sx={{ mb: 1 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Hormati pendapat orang lain
                                            </Typography>
                                        </Box>
                                        <Box component="li">
                                            <Typography variant="body2" color="text.secondary">
                                                Jaga privasi Anda dan orang lain
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Paper>
                            </motion.div>
                        </Box>
                    </Box>
                </Container>
            </PublicLayout>
        </MuiThemeProvider>
    );
};

export default Topic;
