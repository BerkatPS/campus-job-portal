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

// Modern topic list item component
const TopicListItem = ({ topic }) => {
    const theme = useTheme();

    if (!topic || !topic.user) {
        return (
            <Card
                variant="outlined"
                sx={{ mb: 2, borderRadius: '1rem' }}
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
                borderRadius: '1rem',
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    borderColor: theme.palette.primary.main,
                }
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ 
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '2fr 1fr' },
                    gap: 2
                }}>
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                            <Avatar
                                alt={topic.user.name || 'User'}
                                src={topic.user.avatar}
                                sx={{
                                    mr: 2,
                                    bgcolor: 'primary.main',
                                    width: 46,
                                    height: 46,
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                                }}
                            >
                                {topic.user.name ? topic.user.name.charAt(0) : 'U'}
                            </Avatar>
                            <Box>
                                <Typography
                                    variant="h6"
                                    component={Link}
                                    href={route('public.forum.topic', topic.slug)}
                                    sx={{
                                        textDecoration: 'none',
                                        color: 'text.primary',
                                        '&:hover': { color: 'primary.main' },
                                        fontWeight: 600,
                                        fontSize: '1.125rem',
                                        lineHeight: 1.3,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        mb: 0.5,
                                        transition: 'color 0.2s ease'
                                    }}
                                >
                                    {topic.title || 'Tanpa judul'}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                        <FileIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                        {topic.user.name || 'User'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                        <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                        {formatDistanceToNow(new Date(topic.created_at || new Date()), { addSuffix: true, locale: id })}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: { xs: 'flex-start', sm: 'flex-end' },
                        height: '100%',
                        alignItems: 'center',
                        gap: 1.5,
                        mt: { xs: 2, sm: 0 }
                    }}>
                        <Badge
                            icon={<CommentIcon fontSize="small" />}
                            label={`${topic.posts_count || 0}`}
                            variant="outlined"
                            size="small"
                            shape="rounded"
                            color="default"
                            sx={{ borderRadius: '0.5rem' }}
                        />
                        <Badge
                            icon={<VisibilityIcon fontSize="small" />}
                            label={`${topic.views || 0}`}
                            variant="outlined"
                            size="small"
                            shape="rounded"
                            color="default"
                            sx={{ borderRadius: '0.5rem' }}
                        />
                        <Badge
                            icon={<ThumbUpIcon fontSize="small" />}
                            label={topic.likes_count || 0}
                            variant="outlined"
                            size="small"
                            shape="rounded"
                            color="default"
                            sx={{ borderRadius: '0.5rem' }}
                        />
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

// Modern create topic dialog
const CreateTopicDialog = ({ open, onClose, category }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        content: '',
        category_id: category ? category.id : '',
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

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            sx={{
                '& .MuiDialog-paper': {
                    borderRadius: '1rem',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                }
            }}
        >
            <form onSubmit={handleSubmit}>
                <DialogTitle sx={{ px: 3, pt: 3, pb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CreateIcon sx={{ mr: 1.5, color: 'primary.main' }} />
                        <Typography variant="h5" component="h2" fontWeight="bold" className="text-gray-800">
                            Buat Topik Baru di Kategori "{category ? category.name : ''}"
                        </Typography>
                    </Box>
                </DialogTitle>

                <Divider />

                <DialogContent sx={{ px: 3, py: 4 }}>
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
                        required
                        sx={{
                            mb: 3,
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
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <CreateIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        id="content"
                        label="Konten"
                        multiline
                        rows={10}
                        fullWidth
                        variant="outlined"
                        value={data.content}
                        onChange={(e) => setData('content', e.target.value)}
                        error={!!errors.content}
                        helperText={errors.content}
                        required
                        sx={{
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
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5, mr: 1 }}>
                                    <CreateIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />
                </DialogContent>

                <Divider />

                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button
                        onClick={onClose}
                        variant="outlined"
                        color="inherit"
                        sx={{
                            borderRadius: '0.75rem',
                            px: 3
                        }}
                    >
                        Batal
                    </Button>
                    <LoadingButton
                        loading={processing}
                        type="submit"
                        variant="contained"
                        startIcon={<AddIcon />}
                        sx={{
                            borderRadius: '0.75rem',
                            px: 3,
                            py: 1,
                            fontWeight: 600,
                            boxShadow: '0 4px 14px 0 rgba(20, 184, 166, 0.25)',
                            '&:hover': {
                                boxShadow: '0 6px 20px 0 rgba(20, 184, 166, 0.35)',
                            }
                        }}
                    >
                        Buat Topik
                    </LoadingButton>
                </DialogActions>
            </form>
        </Dialog>
    );
};

// Main category component
const Category = ({ category, topics, popularTopics = [], flash }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(topics.current_page || 1);

    const getIconFromName = (iconName) => {
        if (!iconName) return <CategoryIcon />;
        return <span className="material-icons">{iconName}</span>;
    };

    const handleOpenCreateDialog = () => {
        setCreateDialogOpen(true);
    };

    const handleCloseCreateDialog = () => {
        setCreateDialogOpen(false);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        window.location.href = `${route('public.forum.category', category.slug)}?search=${searchQuery}`;
    };

    const handlePageChange = (pageNumber) => {
        setPage(pageNumber);
        let url = `${route('public.forum.category', category.slug)}?page=${pageNumber}`;
        if (searchQuery) {
            url += `&search=${searchQuery}`;
        }
        window.location.href = url;
    };

    return (
        <MuiThemeProvider>
            <PublicLayout>
                <Head title={`${category.name} - Forum Diskusi`} />

                <Box sx={{ bgcolor: 'gray.50' }} className="bg-gray-50 border-b border-gray-100">
                    <Container maxWidth="lg">
                        <Box sx={{ py: 2 }}>
                            <Breadcrumbs
                                separator={<ChevronRightIcon fontSize="small" className="text-gray-400" />}
                                aria-label="breadcrumb"
                            >
                                <Link href={route('public.home')} className="text-gray-600 hover:text-primary-600 transition-colors">
                                    Beranda
                                </Link>
                                <Link href={route('public.forum.index')} className="text-gray-600 hover:text-primary-600 transition-colors">
                                    Forum
                                </Link>
                                <Typography color="text.primary" className="text-gray-800 font-medium">
                                    {category.name}
                                </Typography>
                            </Breadcrumbs>
                        </Box>
                    </Container>
                </Box>

                <Container maxWidth="lg" sx={{ py: 4 }}>
                    {flash?.success && (
                        <Alert
                            severity="success"
                            sx={{
                                mb: 3,
                                borderRadius: '1rem',
                                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                border: '1px solid rgba(16, 185, 129, 0.2)',
                            }}
                        >
                            <Typography variant="body1" fontWeight={500}>
                                {flash.success}
                            </Typography>
                        </Alert>
                    )}

                    {flash?.error && (
                        <Alert
                            severity="error"
                            sx={{
                                mb: 3,
                                borderRadius: '1rem',
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                            }}
                        >
                            <Typography variant="body1" fontWeight={500}>
                                {flash.error}
                            </Typography>
                        </Alert>
                    )}

                    <Box sx={{ mb: 2 }}>
                        <Button
                            component={Link}
                            href={route('public.forum.index')}
                            startIcon={<ArrowBackIcon />}
                            variant="outlined"
                            sx={{
                                borderRadius: '0.75rem',
                                mb: 3
                            }}
                            color="inherit"
                        >
                            Kembali ke Forum
                        </Button>
                    </Box>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Card
                            customHeader={false}
                            sx={{
                                mb: 4,
                                borderRadius: '1rem',
                                overflow: 'hidden',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                                border: '1px solid',
                                borderColor: 'divider'
                            }}
                            variant="elevation"
                        >
                            <Box
                                sx={{
                                    p: 0,
                                    borderTop: 4,
                                    borderColor: category.color || theme.palette.primary.main,
                                }}
                            >
                                <Box
                                    sx={{
                                        bgcolor: category.color || theme.palette.primary.main,
                                        py: 1.5,
                                        px: 3,
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}
                                >
                                    <CategoryIcon />
                                    <Typography variant="subtitle1" fontWeight="medium">
                                        Kategori Forum
                                    </Typography>
                                </Box>

                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ 
                                        display: 'grid',
                                        gridTemplateColumns: { xs: '1fr', md: '8fr 4fr' },
                                        gap: 3
                                    }}>
                                        <Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <Avatar
                                                    sx={{
                                                        bgcolor: category.color || theme.palette.primary.main,
                                                        width: 48,
                                                        height: 48,
                                                        mr: 2,
                                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                                                    }}
                                                >
                                                    {getIconFromName(category.icon)}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="h4" component="h1" fontWeight="bold" className="text-gray-800">
                                                        {category.name}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                                        {category.topics_count} topik · {category.posts_count} post
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <Typography variant="body1" color="text.secondary" sx={{ my: 2 }}>
                                                {category.description}
                                            </Typography>

                                            <Box sx={{ display: 'flex', gap: 2, mb: 4, alignItems: 'center' }}>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    startIcon={<AddIcon />}
                                                    onClick={handleOpenCreateDialog}
                                                    sx={{
                                                        borderRadius: '0.75rem',
                                                        py: 1,
                                                        px: 3,
                                                        fontWeight: 600,
                                                        boxShadow: '0 4px 14px 0 rgba(20, 184, 166, 0.25)',
                                                    }}
                                                >
                                                    Buat Topik Baru
                                                </Button>

                                                <Box
                                                    component="form"
                                                    onSubmit={handleSearch}
                                                    sx={{
                                                        display: 'flex',
                                                        borderRadius: '0.75rem',
                                                        overflow: 'hidden',
                                                        border: '1px solid',
                                                        borderColor: 'divider',
                                                        flex: 1,
                                                        ml: { xs: 0, sm: 2 },
                                                        maxWidth: { xs: '100%', sm: 320 }
                                                    }}
                                                >
                                                    <TextField
                                                        placeholder="Cari topik..."
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                        size="small"
                                                        variant="outlined"
                                                        fullWidth
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <SearchIcon fontSize="small" color="action" />
                                                                </InputAdornment>
                                                            ),
                                                            sx: {
                                                                borderRadius: '0.75rem',
                                                                height: '100%',
                                                                '& fieldset': { border: 'none' }
                                                            }
                                                        }}
                                                        sx={{ '& .MuiOutlinedInput-root': { height: '100%' } }}
                                                    />
                                                    <IconButton type="submit" sx={{ bgcolor: 'action.hover' }}>
                                                        <SearchIcon />
                                                    </IconButton>
                                                </Box>
                                            </Box>

                                            <Divider sx={{ mb: 4 }} />

                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    mb: 3,
                                                    fontWeight: 'bold',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1
                                                }}
                                                className="text-gray-800"
                                            >
                                                <CommentIcon color="primary" />
                                                Topik Diskusi
                                            </Typography>

                                            {/* Topic List */}
                                            {topics.data && topics.data.length > 0 ? (
                                                <Box>
                                                    {topics.data.map((topic) => (
                                                        <motion.div
                                                            key={topic.id}
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ duration: 0.4 }}
                                                        >
                                                            <TopicListItem topic={topic} />
                                                        </motion.div>
                                                    ))}

                                                    {/* Pagination */}
                                                    {topics.last_page > 1 && (
                                                        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                                                            <CustomPagination
                                                                currentPage={page}
                                                                totalPages={topics.last_page}
                                                                onPageChange={handlePageChange}
                                                            />
                                                        </Box>
                                                    )}
                                                </Box>
                                            ) : (
                                                <Paper
                                                    sx={{
                                                        p: 4,
                                                        textAlign: 'center',
                                                        borderRadius: '1rem',
                                                        bgcolor: 'background.default'
                                                    }}
                                                >
                                                    <Box sx={{ mb: 2 }}>
                                                        <ForumIcon
                                                            sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }}
                                                        />
                                                        <Typography variant="h6" gutterBottom>
                                                            Belum ada topik diskusi
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                                            Jadilah yang pertama memulai diskusi pada kategori ini
                                                        </Typography>
                                                        <Button
                                                            variant="contained"
                                                            startIcon={<CreateIcon />}
                                                            onClick={handleOpenCreateDialog}
                                                            sx={{ borderRadius: '0.75rem' }}
                                                        >
                                                            Buat Topik Baru
                                                        </Button>
                                                    </Box>
                                                </Paper>
                                            )}
                                        </Box>

                                        {/* Sidebar */}
                                        <Box>
                                            <Card
                                                title="Topik Populer"
                                                icon={<ThumbUpIcon />}
                                                sx={{ mb: 3 }}
                                                titleProps={{ variant: 'subtitle1', fontWeight: 'medium' }}
                                            >
                                                <CardContent sx={{ pb: '16px !important' }}>
                                                    {popularTopics && popularTopics.length > 0 ? (
                                                        <Box>
                                                            {popularTopics.slice(0, 5).map((topic) => (
                                                                <ListItem
                                                                    key={topic.id}
                                                                    component={Link}
                                                                    href={route('public.forum.topic', topic.slug)}
                                                                    dense
                                                                    disableGutters
                                                                    sx={{
                                                                        px: 0,
                                                                        py: 1,
                                                                        borderBottom: '1px solid',
                                                                        borderColor: 'divider',
                                                                        '&:last-child': {
                                                                            borderBottom: 'none'
                                                                        },
                                                                        textDecoration: 'none',
                                                                        color: 'text.primary',
                                                                        transition: 'all 0.2s',
                                                                        '&:hover': {
                                                                            backgroundColor: 'action.hover',
                                                                            transform: 'translateX(4px)'
                                                                        },
                                                                        borderRadius: '0.5rem'
                                                                    }}
                                                                >
                                                                    <ListItemAvatar sx={{ minWidth: 36 }}>
                                                                        <Avatar
                                                                            alt={topic.user?.name || 'User'}
                                                                            src={topic.user?.avatar}
                                                                            sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}
                                                                        >
                                                                            {topic.user?.name?.charAt(0) || 'U'}
                                                                        </Avatar>
                                                                    </ListItemAvatar>
                                                                    <ListItemText
                                                                        primary={
                                                                            <Typography
                                                                                variant="body2"
                                                                                sx={{
                                                                                    display: '-webkit-box',
                                                                                    WebkitLineClamp: 2,
                                                                                    WebkitBoxOrient: 'vertical',
                                                                                    overflow: 'hidden',
                                                                                    fontWeight: 500
                                                                                }}
                                                                            >
                                                                                {topic.title}
                                                                            </Typography>
                                                                        }
                                                                        secondary={
                                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                                                                <Typography variant="caption" color="text.secondary">
                                                                                    {topic.likes_count || 0} likes
                                                                                </Typography>
                                                                                <Box
                                                                                    component="span"
                                                                                    sx={{
                                                                                        width: 3,
                                                                                        height: 3,
                                                                                        borderRadius: '50%',
                                                                                        bgcolor: 'text.disabled',
                                                                                        display: 'inline-block'
                                                                                    }}
                                                                                />
                                                                                <Typography variant="caption" color="text.secondary">
                                                                                    {formatDistanceToNow(new Date(topic.created_at), { addSuffix: true, locale: id })}
                                                                                </Typography>
                                                                            </Box>
                                                                        }
                                                                    />
                                                                </ListItem>
                                                            ))}
                                                        </Box>
                                                    ) : (
                                                        <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                                                            Belum ada topik populer
                                                        </Typography>
                                                    )}
                                                </CardContent>
                                            </Card>

                                            <Card
                                                title="Tentang Kategori"
                                                icon={<CategoryIcon />}
                                                titleProps={{ variant: 'subtitle1', fontWeight: 'medium' }}
                                            >
                                                <CardContent>
                                                    <Typography variant="body2" color="text.secondary" paragraph>
                                                        {category.description}
                                                    </Typography>
                                                    <Typography variant="body2" fontWeight="medium">
                                                        Statistik:
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                                                        <Chip
                                                            label={`${category.topics_count} topik`}
                                                            size="small"
                                                            sx={{ fontWeight: 500 }}
                                                        />
                                                        <Chip
                                                            label={`${category.posts_count} post`}
                                                            size="small"
                                                            sx={{ fontWeight: 500 }}
                                                        />
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Box>
                        </Card>
                    </motion.div>
                </Container>

                <CreateTopicDialog
                    open={createDialogOpen}
                    onClose={handleCloseCreateDialog}
                    category={category}
                />
            </PublicLayout>
        </MuiThemeProvider>
    );
};

export default Category;
