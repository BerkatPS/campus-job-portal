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

// Kategori card dengan desain modern
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
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
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
                    borderRadius: '1rem',
                    border: '1px solid',
                    borderLeft: 3,
                    borderColor: category.color || theme.palette.primary.main,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                        borderColor: category.color || theme.palette.primary.main,
                    }
                }}
            >
                <CardHeader
                    avatar={
                        <Avatar
                            sx={{
                                bgcolor: category.color || theme.palette.primary.main,
                                width: 44,
                                height: 44,
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                            }}
                        >
                            {getIcon()}
                        </Avatar>
                    }
                    title={
                        <Typography variant="h6" component="h3" fontWeight="bold" className="text-gray-800">
                            {category.name}
                        </Typography>
                    }
                    subheader={
                        <Badge
                            label={`${category.topics_count} topik`}
                            size="small"
                            shape="pill"
                            color="primary"
                            sx={{ fontWeight: 500, mt: 0.5 }}
                        />
                    }
                />
                <CardContent sx={{ pt: 0 }}>
                    <Typography variant="body2" color="text.secondary" className="line-clamp-2">
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
                        sx={{
                            borderRadius: '0.75rem',
                            fontWeight: 500
                        }}
                    >
                        Lihat
                    </Button>
                </CardActions>
            </Card>
        </motion.div>
    );
};

// Topic item dengan desain yang lebih modern
const TopicItem = ({ topic, showCategory = false }) => {
    const theme = useTheme();

    if (!topic || !topic.user) {
        return (
            <Card variant="outlined" sx={{ mb: 2, borderRadius: '1rem' }}>
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
                                <PersonIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                {topic.user.name || 'User'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                {formatDistanceToNow(new Date(topic.created_at || new Date()), { addSuffix: true, locale: id })}
                            </Typography>
                        </Box>

                        {showCategory && topic.category && (
                            <Badge
                                label={topic.category.name || 'Umum'}
                                color="primary"
                                size="small"
                                shape="pill"
                                sx={{ mt: 1 }}
                            />
                        )}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

// Dialog buat topik baru dengan UI yang lebih modern
const CreateTopicDialog = ({ open, onClose, categories }) => {
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
                            Buat Topik Baru
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
                                    <QuestionAnswerIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel id="category-label">Kategori</InputLabel>
                        <Select
                            labelId="category-label"
                            id="category_id"
                            value={data.category_id}
                            label="Kategori"
                            onChange={(e) => setData('category_id', e.target.value)}
                            error={!!errors.category_id}
                            required
                            sx={{
                                borderRadius: '0.75rem',
                                '&:hover fieldset': {
                                    borderColor: 'primary.main',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'primary.main',
                                    boxShadow: '0 0 0 3px rgba(20, 184, 166, 0.1)'
                                },
                            }}
                            startAdornment={
                                <InputAdornment position="start">
                                    <CategoryIcon color="action" />
                                </InputAdornment>
                            }
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
                        id="content"
                        label="Konten"
                        multiline
                        rows={6}
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
                        color="inherit"
                        variant="outlined"
                        sx={{
                            borderRadius: '0.75rem',
                            px: 3
                        }}
                    >
                        Batal
                    </Button>
                    <LoadingButton
                        type="submit"
                        variant="contained"
                        loading={processing}
                        color="primary"
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
                        Kirim Topik
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
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    // Data sampel untuk preview jika data tidak tersedia
    const sampleCategories = [
        {
            id: 1,
            name: "Pengumuman",
            slug: "pengumuman",
            description: "Pengumuman penting dari kampus dan administrator",
            color: "#F43F5E", // rose-500
            icon: "announcement",
            topics_count: 1,
            latest_topic: {
                updated_at: new Date().toISOString()
            }
        },
        {
            id: 2,
            name: "Karir & Magang",
            slug: "karir-magang",
            description: "Diskusi tentang karir, magang, dan peluang kerja",
            color: "#3B82F6", // blue-500
            icon: "career",
            topics_count: 3,
            latest_topic: {
                updated_at: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
            }
        },
        {
            id: 3,
            name: "Tips & Trik Wawancara",
            slug: "tips-trik-wawancara",
            description: "Berbagi tips dan trik untuk persiapan wawancara kerja",
            color: "#10B981", // emerald-500
            icon: "interview",
            topics_count: 2,
            latest_topic: {
                updated_at: new Date(Date.now() - 7200000).toISOString() // 2 hours ago
            }
        },
        {
            id: 4,
            name: "Pembuatan CV & Resume",
            slug: "pembuatan-cv-resume",
            description: "Panduan dan saran untuk membuat CV dan resume yang menarik",
            color: "#F59E0B", // amber-500
            icon: "resume",
            topics_count: 3,
            latest_topic: {
                updated_at: new Date(Date.now() - 10800000).toISOString() // 3 hours ago
            }
        }
    ];

    // Gunakan data yang disediakan atau data sampel
    const categoryData = categories.length > 0 ? categories : sampleCategories;

    const handleOpenCreateDialog = () => {
        setOpenCreateDialog(true);
    };

    const handleCloseCreateDialog = () => {
        setOpenCreateDialog(false);
    };

    const handleTabChange = (newValue) => {
        setTabValue(newValue);
    };

    const handleSearch = (values) => {
        console.log('Searching for:', values.keyword);
        // Implementasi pencarian
    };

    return (
        <MuiThemeProvider>
            <PublicLayout>
                <Head title="Forum - CampusJob" />

                {/* Hero Section */}
                <Box
                    sx={{
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        py: { xs: 5, md: 8 },
                        position: 'relative',
                        overflow: 'hidden',
                        background: 'linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)',
                    }}
                >
                    {/* Elemen dekoratif latar */}
                    <Box
                        sx={{
                            position: 'absolute',
                            inset: 0,
                            overflow: 'hidden'
                        }}
                    >
                        <div className="absolute top-20 right-20 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-10"></div>
                        <div className="absolute bottom-0 left-20 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-10"></div>
                    </Box>

                    <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Box sx={{ textAlign: 'center', mb: 4 }}>
                                <Typography
                                    variant="h3"
                                    component="h1"
                                    fontWeight="bold"
                                    gutterBottom
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 1.5
                                    }}
                                >
                                    <ForumIcon sx={{ fontSize: '1.2em', verticalAlign: 'middle' }} />
                                    Forum CampusJob
                                </Typography>
                                <Typography variant="h6" sx={{ maxWidth: 700, mx: 'auto', mb: 4, fontWeight: 'normal', opacity: 0.9 }}>
                                    Diskusikan topik seputar karir, magang, dan peluang kerja bersama mahasiswa lainnya
                                </Typography>
                            </Box>
                        </motion.div>

                        <Paper
                            elevation={4}
                            sx={{
                                p: 2,
                                borderRadius: '1rem',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                                background: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.2)'
                            }}
                        >
                            <Box sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                gap: 2
                            }}>
                                <SearchBar
                                    placeholder="Cari topik diskusi..."
                                    onSearch={handleSearch}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    fullWidth
                                    size="medium"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '0.75rem',
                                            bgcolor: 'white',
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

                                <Button
                                    variant="contained"
                                    color="secondary"
                                    startIcon={<AddIcon />}
                                    onClick={handleOpenCreateDialog}
                                    sx={{
                                        whiteSpace: 'nowrap',
                                        px: 3,
                                        borderRadius: '0.75rem',
                                        fontWeight: 600,
                                        boxShadow: '0 4px 14px 0 rgba(20, 184, 166, 0.25)',
                                        '&:hover': {
                                            boxShadow: '0 6px 20px 0 rgba(20, 184, 166, 0.35)',
                                            transform: 'translateY(-2px)'
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    Topik Baru
                                </Button>
                            </Box>
                        </Paper>
                    </Container>
                </Box>

                {/* Konten Utama */}
                <Container maxWidth="lg" sx={{ py: 6 }}>
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            md: '8fr 4fr'
                        },
                        gap: 4
                    }}>
                        <Box>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.1 }}
                            >
                                <Box sx={{ mb: 4 }}>
                                    <Typography
                                        variant="h5"
                                        component="h2"
                                        fontWeight="bold"
                                        sx={{
                                            mb: 3,
                                            display: 'flex',
                                            alignItems: 'center',
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
                                        className="text-gray-800"
                                    >
                                        <CategoryIcon sx={{ mr: 1.5, color: 'primary.main' }} />
                                        Kategori Forum
                                    </Typography>

                                    <Box sx={{
                                        display: 'grid',
                                        gridTemplateColumns: {
                                            xs: '1fr',
                                            sm: 'repeat(2, 1fr)'
                                        },
                                        gap: 2.5,
                                        mb: 5
                                    }}>
                                        {categoryData.map(category => (
                                            <Box key={category.id}>
                                                <CategoryCard category={category} />
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.2 }}
                            >
                                <Box>
                                    <Typography
                                        variant="h5"
                                        component="h2"
                                        fontWeight="bold"
                                        sx={{
                                            mb: 3,
                                            display: 'flex',
                                            alignItems: 'center',
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
                                        className="text-gray-800"
                                    >
                                        <CommentIcon sx={{ mr: 1.5, color: 'primary.main' }} />
                                        Diskusi Terbaru
                                    </Typography>

                                    <Tabs
                                        value={tabValue}
                                        onChange={handleTabChange}
                                        tabs={[
                                            { label: 'Terbaru', icon: <AccessTimeIcon /> },
                                            { label: 'Populer', icon: <ThumbUpIcon /> }
                                        ]}
                                        sx={{ mb: 2 }}
                                    />

                                    {tabValue === 0 ? (
                                        // Tab Diskusi Terbaru
                                        <Box>
                                            {recentTopics && recentTopics.length > 0 ? (
                                                recentTopics.map(topic => (
                                                    <TopicItem key={topic.id} topic={topic} showCategory={true} />
                                                ))
                                            ) : (
                                                <Card
                                                    variant="outlined"
                                                    sx={{
                                                        py: 6,
                                                        textAlign: 'center',
                                                        borderRadius: '1rem',
                                                        bgcolor: 'rgba(243, 244, 246, 0.2)'
                                                    }}
                                                >
                                                    <ForumIcon sx={{ fontSize: 50, color: 'primary.main', opacity: 0.3, mb: 2 }} />
                                                    <Typography variant="h6" color="text.secondary" gutterBottom>
                                                        Belum ada diskusi
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
                                                        Jadilah yang pertama memulai diskusi di forum ini!
                                                    </Typography>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        startIcon={<CreateIcon />}
                                                        onClick={handleOpenCreateDialog}
                                                        sx={{
                                                            borderRadius: '0.75rem',
                                                            fontWeight: 600
                                                        }}
                                                    >
                                                        Buat Topik Baru
                                                    </Button>
                                                </Card>
                                            )}
                                        </Box>
                                    ) : (
                                        // Tab Diskusi Populer
                                        <Box>
                                            {popularTopics && popularTopics.length > 0 ? (
                                                popularTopics.map(topic => (
                                                    <TopicItem key={topic.id} topic={topic} showCategory={true} />
                                                ))
                                            ) : (
                                                <Card
                                                    variant="outlined"
                                                    sx={{
                                                        py: 6,
                                                        textAlign: 'center',
                                                        borderRadius: '1rem',
                                                        bgcolor: 'rgba(243, 244, 246, 0.2)'
                                                    }}
                                                >
                                                    <ForumIcon sx={{ fontSize: 50, color: 'primary.main', opacity: 0.3, mb: 2 }} />
                                                    <Typography variant="h6" color="text.secondary" gutterBottom>
                                                        Belum ada diskusi populer
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
                                                        Diskusi populer akan muncul di sini berdasarkan jumlah like dan komentar.
                                                    </Typography>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        startIcon={<CreateIcon />}
                                                        onClick={handleOpenCreateDialog}
                                                        sx={{
                                                            borderRadius: '0.75rem',
                                                            fontWeight: 600
                                                        }}
                                                    >
                                                        Buat Topik Baru
                                                    </Button>
                                                </Card>
                                            )}
                                        </Box>
                                    )}
                                </Box>
                            </motion.div>
                        </Box>

                        {/* Sidebar */}
                        <Box>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.3 }}
                            >
                                <Card
                                    title="Buat Topik Baru"
                                    icon={<CreateIcon />}
                                    sx={{ mb: 3 }}
                                    titleProps={{ variant: 'h6' }}
                                >
                                    <CardContent>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                            Punya pertanyaan atau ingin berbagi informasi? Buat topik baru sekarang!
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            startIcon={<AddIcon />}
                                            fullWidth
                                            onClick={handleOpenCreateDialog}
                                            sx={{
                                                borderRadius: '0.75rem',
                                                fontWeight: 600,
                                                py: 1.2
                                            }}
                                        >
                                            Buat Topik Baru
                                        </Button>
                                    </CardContent>
                                </Card>

                                <Card
                                    title="Panduan Forum"
                                    icon={<InfoIcon />}
                                    titleProps={{ variant: 'h6' }}
                                >
                                    <CardContent>
                                        <Typography variant="body2" color="text.secondary" paragraph>
                                            Selamat datang di Forum CampusJob. Berikut adalah beberapa panduan untuk berpartisipasi:
                                        </Typography>
                                        <Box component="ul" sx={{ ml: 2, mt: 1 }}>
                                            <Box component="li" sx={{ mb: 1 }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Gunakan bahasa yang sopan dan hormat
                                                </Typography>
                                            </Box>
                                            <Box component="li" sx={{ mb: 1 }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Pastikan topik sesuai dengan kategori yang dipilih
                                                </Typography>
                                            </Box>
                                            <Box component="li" sx={{ mb: 1 }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Hindari promosi yang tidak relevan
                                                </Typography>
                                            </Box>
                                            <Box component="li">
                                                <Typography variant="body2" color="text.secondary">
                                                    Bagikan informasi yang bermanfaat untuk semua
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Box>
                    </Box>
                </Container>

                {/* Dialog Buat Topik Baru */}
                <CreateTopicDialog
                    open={openCreateDialog}
                    onClose={handleCloseCreateDialog}
                    categories={categoryData}
                />
            </PublicLayout>
        </MuiThemeProvider>
    );
};

export default Forum;
