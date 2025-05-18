import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Container,
    Box,
    Typography,
    TextField,
    Paper,
    Divider,
    Avatar,
    IconButton,
    Tooltip,
    CardContent,
    Breadcrumbs,
    Badge,
    useTheme,
    useMediaQuery,
    InputAdornment,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
    Forum as ForumIcon,
    Category as CategoryIcon,
    Comment as CommentIcon,
    ThumbUp as ThumbUpIcon,
    ThumbUpAltOutlined as ThumbUpOutlinedIcon,
    Reply as ReplyIcon,
    NavigateNext as NavigateNextIcon,
    AccessTime as AccessTimeIcon,
    Visibility as VisibilityIcon,
    AccountCircle as AccountCircleIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import format from 'date-fns/format';
import { id } from 'date-fns/locale';
import DOMPurify from 'dompurify';
import PublicLayout from '@/Components/Layout/PublicLayout';

// Import komponen dari shared
import Button from '@/Components/Shared/Button';
import Card from '@/Components/Shared/Card';
import Alert from '@/Components/Shared/Alert';
import CustomPagination from '@/Components/Shared/Pagination';

// Modern post component dengan desain yang lebih bersih
const PostItem = ({ post, topic, onLike, isOwnPost }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [likeLoading, setLikeLoading] = useState(false);
    
    const isLiked = post.likes?.some(like => like.user_id === window.userId);
    
    const handleLike = async () => {
        setLikeLoading(true);
        await onLike(post.id);
        setLikeLoading(false);
    };
    
    const sanitizedContent = DOMPurify.sanitize(post.content);
    
    return (
        <Card
            variant="outlined"
            customHeader={false}
            elevation={0}
            sx={{
                mb: 3,
                borderRadius: '12px',
                transition: 'all 0.2s ease',
                '&:hover': {
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
                },
            }}
        >
            <CardContent sx={{ p: 0 }}>
                {/* Header */}
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 2,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.subtle'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                            src={post.user?.profile_photo || null}
                            alt={post.user?.name}
                            sx={{ width: 36, height: 36, mr: 1.5 }}
                        >
                            {post.user?.name?.charAt(0).toUpperCase()}
                        </Avatar>
                        
                        <Box>
                            <Typography variant="subtitle1" fontWeight="medium">
                                {post.user?.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <AccessTimeIcon fontSize="inherit" />
                                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: id })}
                            </Typography>
                        </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Tooltip title="Suka">
                            <IconButton 
                                onClick={handleLike} 
                                disabled={likeLoading || isOwnPost}
                                color={isLiked ? "primary" : "default"}
                                size="small"
                            >
                                {isLiked ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
                            </IconButton>
                        </Tooltip>
                        
                        {post.likes_count > 0 && (
                            <Typography variant="body2" color="text.secondary">
                                {post.likes_count}
                            </Typography>
                        )}
                    </Box>
                </Box>
                
                {/* Content */}
                <Box sx={{ p: 3 }}>
                    <Typography 
                        variant="body1" 
                        component="div"
                        sx={{ 
                            wordBreak: 'break-word',
                            '& p': { mt: 1, mb: 1 },
                            '& ul, & ol': { pl: 3 },
                            '& a': { color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } },
                        }}
                        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                    />
                </Box>
            </CardContent>
        </Card>
    );
};

// Modern topic page
const Topic = ({ auth, topic, posts, flash }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { data, setData, post, processing, errors, reset } = useForm({
        content: '',
        topic_id: topic.id,
    });
    
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('public.forum.store.post'), {
            onSuccess: () => {
                reset();
            },
        });
    };
    
    const handleLike = async (postId) => {
        await axios.post(route('public.forum.toggle.like'), {
            post_id: postId,
        });
    };
    
    return (
        <PublicLayout>
            <Head title={`${topic.title} - Forum Diskusi`} />
            
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {flash?.success && (
                    <Alert 
                        severity="success" 
                        sx={{ mb: 3, borderRadius: '12px' }}
                    >
                        {flash.success}
                    </Alert>
                )}
                
                {flash?.error && (
                    <Alert 
                        severity="error" 
                        sx={{ mb: 3, borderRadius: '12px' }}
                    >
                        {flash.error}
                    </Alert>
                )}
                
                {/* Header */}
                <Paper 
                    elevation={0} 
                    sx={{ 
                        p: 3, 
                        mb: 4, 
                        borderRadius: '12px',
                        border: '1px solid',
                        borderColor: 'divider',
                        bgcolor: 'background.paper'
                    }}
                >
                    <Box sx={{ mb: 2 }}>
                        <Breadcrumbs 
                            separator={<NavigateNextIcon fontSize="small" />} 
                            aria-label="breadcrumb"
                        >
                            <Link 
                                href={route('public.forum.index')} 
                                sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    color: 'text.secondary',
                                    textDecoration: 'none',
                                    '&:hover': {
                                        textDecoration: 'underline',
                                        color: 'primary.main'
                                    }
                                }}
                            >
                                <ForumIcon sx={{ mr: 0.5 }} fontSize="small" />
                                Forum
                            </Link>
                            <Link 
                                href={route('public.forum.category', topic.category.slug)} 
                                sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    color: 'text.secondary',
                                    textDecoration: 'none',
                                    '&:hover': {
                                        textDecoration: 'underline',
                                        color: 'primary.main'
                                    }
                                }}
                            >
                                <CategoryIcon sx={{ mr: 0.5 }} fontSize="small" />
                                {topic.category.name}
                            </Link>
                            <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
                                <CommentIcon sx={{ mr: 0.5 }} fontSize="small" />
                                Topik Diskusi
                            </Typography>
                        </Breadcrumbs>
                    </Box>
                    
                    <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                        {topic.title}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Avatar
                                src={topic.user?.profile_photo || null}
                                alt={topic.user?.name}
                                sx={{ width: 24, height: 24 }}
                            >
                                {topic.user?.name?.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography variant="body2" color="text.secondary">
                                {topic.user?.name}
                            </Typography>
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <AccessTimeIcon fontSize="small" />
                            {formatDistanceToNow(new Date(topic.created_at), { addSuffix: true, locale: id })}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <VisibilityIcon fontSize="small" />
                            {topic.views} dilihat
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <CommentIcon fontSize="small" />
                            {posts.total} komentar
                        </Typography>
                    </Box>
                </Paper>
                
                {/* Main Content - Posts */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" component="h2" fontWeight="bold" sx={{ mb: 3 }}>
                        Diskusi ({posts.total})
                    </Typography>
                    
                    {/* First Post - Original Topic Content */}
                    <PostItem 
                        post={{ 
                            id: topic.id, 
                            content: topic.content, 
                            created_at: topic.created_at, 
                            user: topic.user,
                            likes_count: topic.likes_count || 0,
                            likes: topic.likes || [] 
                        }} 
                        topic={topic} 
                        onLike={() => {}} 
                        isOwnPost={topic.user?.id === auth.user?.id} 
                    />
                    
                    {/* Replies */}
                    {posts.data.map((post) => (
                        <PostItem 
                            key={post.id} 
                            post={post} 
                            topic={topic} 
                            onLike={handleLike} 
                            isOwnPost={post.user?.id === auth.user?.id}
                        />
                    ))}
                    
                    {/* Pagination */}
                    {posts.links && posts.links.length > 3 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                            <CustomPagination
                                links={posts.links}
                                prevNext
                            />
                        </Box>
                    )}
                    
                    {/* Reply Form */}
                    <Paper 
                        elevation={0} 
                        sx={{ 
                            p: 3, 
                            borderRadius: '12px',
                            border: '1px solid',
                            borderColor: 'divider',
                            bgcolor: 'background.paper' 
                        }}
                    >
                        <Typography variant="h6" component="h3" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ReplyIcon color="primary" />
                            Tambahkan Komentar
                        </Typography>
                        
                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                id="content"
                                label="Konten Komentar"
                                variant="outlined"
                                multiline
                                rows={6}
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                error={!!errors.content}
                                helperText={errors.content}
                                sx={{ mb: 3, mt: 2 }}
                                InputProps={{
                                    startAdornment: processing ? null : (
                                        <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                                            <AccountCircleIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <LoadingButton
                                    loading={processing}
                                    type="submit"
                                    variant="contained"
                                    startIcon={<ReplyIcon />}
                                    disableElevation
                                >
                                    Kirim Komentar
                                </LoadingButton>
                            </Box>
                        </form>
                    </Paper>
                </Box>
            </Container>
        </PublicLayout>
    );
};

export default Topic;
