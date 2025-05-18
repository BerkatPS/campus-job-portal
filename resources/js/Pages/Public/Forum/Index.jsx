import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Container,
    Box,
    Typography,
    TextField,
    Divider,
    useTheme,
    useMediaQuery,
    Avatar,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CardContent,
    CardHeader,
    CardActions,
    InputAdornment,
    Paper,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
    Forum as ForumIcon,
    Search as SearchIcon,
    Add as AddIcon,
    Comment as CommentIcon,
    Visibility as VisibilityIcon,
    ThumbUp as ThumbUpIcon,
    Category as CategoryIcon,
    Person as PersonIcon,
    AccessTime as AccessTimeIcon,
    Create as CreateIcon,
    QuestionAnswer as QuestionAnswerIcon,
    ArrowForward as ArrowForwardIcon,
    Info as InfoIcon,
    Work as WorkIcon,
    Description as DescriptionIcon,
    School as SchoolIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import PublicLayout from '@/Components/Layout/PublicLayout';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { id } from 'date-fns/locale';
import MuiThemeProvider from '@/Theme/MuiThemeProvider';

// Import komponen-komponen dari Components/Shared
import Card from '@/Components/Shared/Card';
import Button from '@/Components/Shared/Button';
import Alert from '@/Components/Shared/Alert';
import Badge from '@/Components/Shared/Badge';
import Tabs from '@/Components/Shared/Tabs';
import SearchBar from '@/Components/Shared/SearchBar';

// Kategori card dengan desain modern yang lebih sederhana
const CategoryCard = ({ category }) => {
    const theme = useTheme();

    // Pemetaan icon berdasarkan kategori
    const iconMap = {
        'announcement': <InfoIcon />,
        'career': <WorkIcon />,
        'interview': <QuestionAnswerIcon />,
        'resume': <DescriptionIcon />,
        'education': <SchoolIcon />
    };

    // Dapatkan icon yang sesuai
    const getIcon = () => {
        if (category.icon) {
            if (iconMap[category.icon]) {
                return iconMap[category.icon];
            }
            return <span className="material-icons">{category.icon}</span>;
        }
        return <CategoryIcon />;
    };

    return (
        <motion.div
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
        >
            <Card
                variant="outlined"
                customHeader={false}
                hover
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    borderRadius: '12px',
                    borderLeft: '4px solid',
                    borderColor: 'primary.main',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                    backgroundColor: 'background.paper',
                    '&:hover': {
                        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)',
                    }
                }}
            >
                <CardHeader
                    avatar={
                        <Avatar
                            sx={{
                                bgcolor: 'primary.main',
                                width: 40,
                                height: 40,
                            }}
                        >
                            {getIcon()}
                        </Avatar>
                    }
                    title={
                        <Typography variant="h6" fontWeight="medium">
                            {category.name}
                        </Typography>
                    }
                    subheader={
                        <Typography variant="body2" color="text.secondary">
                            {category.topics_count} topik
                        </Typography>
                    }
                />
                <CardContent sx={{ pt: 0 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {category.description}
                    </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', mt: 'auto', px: 2, pb: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem' }}>
                        <AccessTimeIcon fontSize="inherit" sx={{ mr: 0.5 }} />
                        {category.latest_topic
                            ? `Post terbaru ${formatDistanceToNow(new Date(category.latest_topic.updated_at), { addSuffix: true, locale: id })}`
                            : 'Belum ada post'}
                    </Typography>
                    <Button
                        component={Link}
                        href={route('public.forum.category', category.slug)}
                        size="small"
                        color="primary"
                        endIcon={<ArrowForwardIcon />}
                        variant="text"
                    >
                        Lihat
                    </Button>
                </CardActions>
            </Card>
        </motion.div>
    );
};

// Topic item dengan desain yang lebih sederhana dan modern
const TopicItem = ({ topic, showCategory = false }) => {
    const theme = useTheme();

    if (!topic || !topic.user) {
        return (
            <Card variant="outlined" sx={{ mb: 2, borderRadius: '12px' }}>
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
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Avatar 
                        src={topic.user.profile_photo || null}
                        alt={topic.user.name}
                        sx={{ width: 40, height: 40, mr: 2 }}
                    >
                        {topic.user.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                        <Link href={route('public.forum.topic', topic.slug)} className="no-underline">
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
                        
                        {showCategory && topic.category && (
                            <Typography 
                                variant="body2" 
                                component={Link}
                                href={route('public.forum.category', topic.category.slug)}
                                sx={{ 
                                    display: 'inline-block',
                                    color: 'primary.main',
                                    mb: 1,
                                    textDecoration: 'none',
                                    '&:hover': { textDecoration: 'underline' }
                                }}
                            >
                                {topic.category.name}
                            </Typography>
                        )}
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2, mt: 1 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                <PersonIcon fontSize="inherit" sx={{ mr: 0.5 }} />
                                {topic.user.name}
                            </Typography>
                            
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                <CommentIcon fontSize="inherit" sx={{ mr: 0.5 }} />
                                {topic.posts_count ? `${topic.posts_count} komentar` : 'Belum ada komentar'}
                            </Typography>
                            
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
                            
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
                                <AccessTimeIcon fontSize="inherit" sx={{ mr: 0.5 }} />
                                {formatDistanceToNow(new Date(topic.updated_at), { addSuffix: true, locale: id })}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

// Dialog buat topik baru dengan UI yang lebih sederhana dan modern
const CreateTopicDialog = ({ open, onClose, categories }) => {
    const theme = useTheme();
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        content: '',
        category_id: '',
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
                    Buat Topik Baru
                </Typography>
            </DialogTitle>
            
            <form onSubmit={handleSubmit}>
                <DialogContent sx={{ pt: 3 }}>
                    <FormControl fullWidth error={!!errors.category_id} sx={{ mb: 3 }}>
                        <InputLabel id="category-select-label">Kategori</InputLabel>
                        <Select
                            labelId="category-select-label"
                            id="category_id"
                            value={data.category_id}
                            label="Kategori"
                            onChange={(e) => setData('category_id', e.target.value)}
                        >
                            {categories.map((category) => (
                                <MenuItem key={category.id} value={category.id}>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.category_id && (
                            <Typography variant="caption" color="error">
                                {errors.category_id}
                            </Typography>
                        )}
                    </FormControl>
                    
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

// Komponen utama Forum
const Forum = ({ categories = [], popularTopics = [], recentTopics = [] }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [openDialog, setOpenDialog] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    
    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };
    
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
    
    const tabItems = [
        { label: 'Topik Terbaru', content: 'recent' },
        { label: 'Populer', content: 'popular' },
    ];

    return (
        <PublicLayout>
            <Head title="Forum Diskusi" />
            
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', md: 'center' },
                    mb: 4
                }}>
                    <Box sx={{ mb: { xs: 2, md: 0 } }}>
                        <Typography 
                            variant="h4" 
                            component="h1" 
                            sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                fontWeight: 'bold',
                                mb: 1
                            }}
                        >
                            <ForumIcon sx={{ mr: 1, color: 'primary.main' }} />
                            Forum Diskusi
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Berbagi ide dan diskusi dengan sesama mahasiswa
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
                
                {/* Categories Section */}
                <Box sx={{ mb: 6 }}>
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        mb: 3
                    }}>
                        <Typography variant="h5" component="h2" fontWeight="bold">
                            Kategori
                        </Typography>
                    </Box>
                    
                    <Box sx={{ 
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, 1fr)',
                            md: 'repeat(3, 1fr)',
                        },
                        gap: 3
                    }}>
                        {categories.map((category) => (
                            <CategoryCard key={category.id} category={category} />
                        ))}
                    </Box>
                </Box>
                
                {/* Topics Section */}
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
                        
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                variant={activeTab === 0 ? "contained" : "outlined"}
                                size="small"
                                onClick={() => setActiveTab(0)}
                                disableElevation
                                sx={{ 
                                    borderRadius: '8px',
                                    ...(activeTab === 0 ? {} : { color: 'text.primary', borderColor: 'divider' })
                                }}
                            >
                                Terbaru
                            </Button>
                            <Button
                                variant={activeTab === 1 ? "contained" : "outlined"}
                                size="small"
                                onClick={() => setActiveTab(1)}
                                disableElevation
                                sx={{ 
                                    borderRadius: '8px',
                                    ...(activeTab === 1 ? {} : { color: 'text.primary', borderColor: 'divider' })
                                }}
                            >
                                Populer
                            </Button>
                        </Box>
                    </Box>
                    
                    <Box sx={{ display: activeTab === 0 ? 'block' : 'none' }}>
                        {recentTopics.length > 0 ? (
                            recentTopics.map((topic) => (
                                <TopicItem key={topic.id} topic={topic} showCategory={true} />
                            ))
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
                                    Belum ada topik diskusi. Jadilah yang pertama membuat topik!
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
                    
                    <Box sx={{ display: activeTab === 1 ? 'block' : 'none' }}>
                        {popularTopics.length > 0 ? (
                            popularTopics.map((topic) => (
                                <TopicItem key={topic.id} topic={topic} showCategory={true} />
                            ))
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
                                    Belum ada topik diskusi populer.
                                </Typography>
                            </Paper>
                        )}
                    </Box>
                </Box>
                
                <CreateTopicDialog 
                    open={openDialog} 
                    onClose={handleCloseDialog} 
                    categories={categories}
                />
            </Container>
        </PublicLayout>
    );
};

export default Forum;
