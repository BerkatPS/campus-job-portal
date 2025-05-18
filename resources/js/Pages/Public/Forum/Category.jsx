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
    IconButton,
    CardContent,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Breadcrumbs,
    InputAdornment,
    ListItem,
    ListItemText,
    ListItemAvatar,
    useMediaQuery,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
    Forum as ForumIcon,
    Search as SearchIcon,
    Add as AddIcon,
    Comment as CommentIcon,
    Visibility as VisibilityIcon,
    ThumbUp as ThumbUpIcon,
    AccessTime as AccessTimeIcon,
    ArrowBack as ArrowBackIcon,
    Create as CreateIcon,
    NavigateNext as NavigateNextIcon,
    Category as CategoryIcon,
    ChevronRight as ChevronRightIcon,
    InsertDriveFile as FileIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import PublicLayout from '@/Components/Layout/PublicLayout';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { id } from 'date-fns/locale';
import MuiThemeProvider from '@/Theme/MuiThemeProvider';

// Import komponen dari shared
import Button from '@/Components/Shared/Button';
import Card from '@/Components/Shared/Card';
import Alert from '@/Components/Shared/Alert';
import Badge from '@/Components/Shared/Badge';
import CustomPagination from '@/Components/Shared/Pagination';

// Modern topic list item component dengan desain yang lebih sederhana
const TopicListItem = ({ topic }) => {
    const theme = useTheme();

    if (!topic || !topic.user) {
        return (
            <Card
                variant="outlined"
                sx={{ mb: 2, borderRadius: '12px' }}
            >
                <CardContent>
                    <Typography variant="body2" color="text.secondary">Data topik tidak lengkap</Typography>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card
            variant="outlined"
            customHeader={false}
            hover
            elevation={0}
            sx={{
                mb: 2,
                borderRadius: '12px',
                transition: 'all 0.2s ease',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
                }
            }}
        >
            <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ 
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '2fr 1fr' },
                    gap: 2
                }}>
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                            <Avatar
                                src={topic.user.profile_photo || null}
                                alt={topic.user.name}
                                sx={{ width: 40, height: 40, mr: 2 }}
                            >
                                {topic.user.name.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box>
                                <Link 
                                    href={route('public.forum.topic', topic.slug)} 
                                    className="no-underline"
                                >
                                    <Typography 
                                        variant="h6" 
                                        component="h3" 
                                        sx={{ 
                                            fontWeight: 'medium',
                                            color: 'text.primary',
                                            fontSize: '1rem',
                                            mb: 0.5,
                                            '&:hover': { color: 'primary.main' }
                                        }}
                                    >
                                        {topic.title}
                                    </Typography>
                                </Link>
                                
                                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                        <AccessTimeIcon fontSize="inherit" sx={{ mr: 0.5 }} />
                                        {formatDistanceToNow(new Date(topic.created_at), { addSuffix: true, locale: id })}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                        <CommentIcon fontSize="inherit" sx={{ mr: 0.5 }} />
                                        {topic.posts_count} komentar
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    
                    <Box sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: { xs: 'flex-start', sm: 'flex-end' },
                        gap: 2,
                        mt: { xs: 1, sm: 0 }
                    }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                            <VisibilityIcon fontSize="inherit" sx={{ mr: 0.5 }} />
                            {topic.views} dilihat
                        </Typography>
                        
                        {topic.likes_count > 0 && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                <ThumbUpIcon fontSize="inherit" sx={{ mr: 0.5 }} />
                                {topic.likes_count} suka
                            </Typography>
                        )}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

// Modern create topic dialog dengan desain yang lebih bersih
const CreateTopicDialog = ({ open, onClose, category }) => {
    const theme = useTheme();
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        content: '',
        category_id: category?.id || '',
    });
    
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('public.forum.store.topic'), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };
    
    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Dialog 
            open={open} 
            onClose={handleClose} 
            maxWidth="md" 
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '12px',
                    overflow: 'hidden'
                }
            }}
        >
            <DialogTitle sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                borderBottom: '1px solid',
                borderColor: 'divider',
                py: 2
            }}>
                <CreateIcon color="primary" />
                <Typography variant="h6" component="span">
                    Buat Topik Baru di {category?.name || 'Forum'}
                </Typography>
            </DialogTitle>
            
            <form onSubmit={handleSubmit}>
                <DialogContent sx={{ pt: 3 }}>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="title"
                        label="Judul Topik"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        error={!!errors.title}
                        helperText={errors.title}
                        sx={{ mb: 3 }}
                    />
                    
                    <TextField
                        id="content"
                        label="Konten"
                        multiline
                        rows={8}
                        fullWidth
                        variant="outlined"
                        value={data.content}
                        onChange={(e) => setData('content', e.target.value)}
                        error={!!errors.content}
                        helperText={errors.content}
                    />
                </DialogContent>
                
                <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Button onClick={handleClose} variant="outlined" color="inherit">
                        Batal
                    </Button>
                    <LoadingButton 
                        loading={processing} 
                        type="submit" 
                        variant="contained" 
                        disableElevation
                    >
                        Buat Topik
                    </LoadingButton>
                </DialogActions>
            </form>
        </Dialog>
    );
};

// Main category component dengan desain yang lebih modern
const Category = ({ category, topics, popularTopics = [], flash }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [openDialog, setOpenDialog] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    const handleOpenDialog = () => {
        setOpenDialog(true);
    };
    
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
    
    const handleSearch = (query) => {
        setSearchQuery(query);
        // Implementasi pencarian
    };

    return (
        <PublicLayout>
            <Head title={`${category.name} - Forum Diskusi`} />
            
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
                            <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
                                <CategoryIcon sx={{ mr: 0.5 }} fontSize="small" />
                                {category.name}
                            </Typography>
                        </Breadcrumbs>
                    </Box>
                    
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: { xs: 'flex-start', md: 'center' },
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: 2
                    }}>
                        <Box>
                            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                                {category.name}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                {category.description}
                            </Typography>
                        </Box>
                        
                        <Button 
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleOpenDialog}
                            disableElevation
                        >
                            Topik Baru
                        </Button>
                    </Box>
                </Paper>
                
                {/* Search Box */}
                <Paper 
                    elevation={0} 
                    sx={{ 
                        p: 2, 
                        mb: 4, 
                        borderRadius: '12px',
                        border: '1px solid',
                        borderColor: 'divider',
                        bgcolor: 'background.paper'
                    }}
                >
                    <TextField
                        fullWidth
                        placeholder="Cari topik diskusi..."
                        variant="outlined"
                        size="medium"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                            sx: { borderRadius: '8px' }
                        }}
                    />
                </Paper>
                
                {/* Topics List */}
                <Box sx={{ mb: 4 }}>
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        mb: 3
                    }}>
                        <Typography variant="h5" component="h2" fontWeight="bold">
                            Topik Diskusi
                        </Typography>
                    </Box>
                    
                    {topics.data && topics.data.length > 0 ? (
                        <>
                            {topics.data.map((topic) => (
                                <TopicListItem key={topic.id} topic={topic} />
                            ))}
                            
                            {topics.links && topics.links.length > 3 && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                    <CustomPagination
                                        links={topics.links}
                                        prevNext
                                    />
                                </Box>
                            )}
                        </>
                    ) : (
                        <Paper 
                            sx={{ 
                                p: 3, 
                                textAlign: 'center',
                                borderRadius: '12px',
                                bgcolor: 'background.paper',
                                border: '1px dashed',
                                borderColor: 'divider'
                            }}
                        >
                            <Typography variant="body1" color="text.secondary">
                                Belum ada topik diskusi di kategori ini. Jadilah yang pertama membuat topik!
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={handleOpenDialog}
                                sx={{ mt: 2 }}
                                disableElevation
                            >
                                Buat Topik
                            </Button>
                        </Paper>
                    )}
                </Box>
                
                <CreateTopicDialog 
                    open={openDialog} 
                    onClose={handleCloseDialog} 
                    category={category}
                />
            </Container>
        </PublicLayout>
    );
};

export default Category;
