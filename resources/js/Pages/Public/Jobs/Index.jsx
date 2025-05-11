import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    Box, Typography, Container, Card, CardContent,
    TextField, Button, Chip, Divider, InputAdornment,
    FormControl, InputLabel, Select, MenuItem,
    Stack, IconButton, CardActions, CardHeader, Avatar,
    Collapse, Skeleton, Alert, Badge, Tooltip,
    Paper, useTheme, useMediaQuery
} from '@mui/material';
import {
    Search as SearchIcon,
    LocationOn as LocationIcon,
    Work as WorkIcon,
    FilterAlt as FilterIcon,
    Business as BusinessIcon,
    AccessTime as TimeIcon,
    AttachMoney as SalaryIcon,
    Bookmark as BookmarkIcon,
    BookmarkBorder as BookmarkBorderIcon,
    Category as CategoryIcon,
    CalendarMonth as CalendarIcon,
    Bolt as BoltIcon,
    PersonSearch as PersonSearchIcon,
    ArrowForward as ArrowForwardIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import moment from 'moment';
import 'moment/locale/id';

import PublicLayout from '@/Components/Layout/PublicLayout';
import MuiThemeProvider from '@/Theme/MuiThemeProvider';
import CustomPagination from '@/Components/Shared/Pagination';

// Fungsi format yang sama seperti sebelumnya
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
};

const formatJobType = (type) => {
    const types = {
        'full_time': 'Full Time',
        'part_time': 'Part Time',
        'contract': 'Kontrak',
        'internship': 'Magang',
        'freelance': 'Freelance'
    };
    return types[type] || type;
};

const formatExperienceLevel = (level) => {
    const levels = {
        'entry': 'Entry Level (0-2 tahun)',
        'mid': 'Mid Level (2-5 tahun)',
        'senior': 'Senior Level (5+ tahun)',
        'executive': 'Executive (10+ tahun)'
    };
    return levels[level] || level;
};

// Custom Chip component sama seperti sebelumnya
const CustomChip = ({ icon, label, color = "default", onDelete, variant = "outlined", size = "small" }) => {
    const theme = useTheme();

    const getChipStyle = () => {
        // Logika styling sama seperti sebelumnya
        if (color === "primary") {
            return {
                color: theme.palette.primary.main,
                borderColor: theme.palette.primary.main,
                backgroundColor: `${theme.palette.primary.main}15`,
                "& .MuiChip-deleteIcon": {
                    color: theme.palette.primary.main,
                },
            };
        }
        // ...kode lain tetap sama
    };

    return (
        <Chip
            icon={icon}
            label={label}
            onDelete={onDelete}
            variant={variant}
            size={size}
            sx={{
                fontWeight: 500,
                borderRadius: '0.75rem',
                ...getChipStyle(),
            }}
        />
    );
};

export default function Index({ jobs, filters, categories = [], total = 0 }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

    // State yang sama seperti sebelumnya
    const [filterOpen, setFilterOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    const [locationQuery, setLocationQuery] = useState(filters?.location || '');
    const [selectedCategory, setSelectedCategory] = useState(filters?.category_id || '');
    const [selectedType, setSelectedType] = useState(filters?.type || '');
    const [selectedExperience, setSelectedExperience] = useState(filters?.experience_level || '');
    const [page, setPage] = useState(parseInt(filters?.page || 1));
    const [isLoading, setIsLoading] = useState(false);
    const [savedJobs, setSavedJobs] = useState([]);

    // Handler functions sama seperti sebelumnya
    const handlePageChange = (newPage) => {
        setPage(newPage);
        applyFilters({ page: newPage });
    };

    const handlePerPageChange = (newPerPage) => {
        setPage(1);
        applyFilters({ page: 1, per_page: newPerPage });
    };

    const applyFilters = (additionalFilters = {}) => {
        setIsLoading(true);

        const currentFilters = {
            search: searchQuery,
            location: locationQuery,
            category_id: selectedCategory,
            type: selectedType,
            experience_level: selectedExperience,
            page: page,
            ...additionalFilters
        };

        Object.keys(currentFilters).forEach(key =>
            !currentFilters[key] && delete currentFilters[key]
        );

        router.get(route('public.jobs.index'), currentFilters, {
            preserveState: true,
            onFinish: () => setIsLoading(false)
        });
    };

    const resetFilters = () => {
        setSearchQuery('');
        setLocationQuery('');
        setSelectedCategory('');
        setSelectedType('');
        setSelectedExperience('');
        setPage(1);
        router.get(route('public.jobs.index'), {}, { preserveState: true });
    };

    const toggleSaveJob = (jobId) => {
        if (savedJobs.includes(jobId)) {
            setSavedJobs(savedJobs.filter(id => id !== jobId));
        } else {
            setSavedJobs([...savedJobs, jobId]);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        applyFilters({ page: 1 });
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100 }
        }
    };

    return (
        <MuiThemeProvider>
            <PublicLayout>
                <Head title="Cari Lowongan Pekerjaan" />

                {/* Hero Section dengan gradient dan efek blur */}
                <Box
                    sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        py: { xs: 8, md: 12 },
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                    className="bg-gradient-to-br from-primary-700 to-primary-900"
                >
                    {/* Background Elements */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-20 right-20 w-64 h-64 bg-primary-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>
                        <div className="absolute bottom-20 left-20 w-72 h-72 bg-secondary-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>
                        <div className="absolute top-40 left-40 w-48 h-48 bg-primary-300 rounded-full mix-blend-overlay filter blur-3xl opacity-30"></div>
                    </div>

                    <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Box sx={{ width: '100%', maxWidth: { xs: '100%', md: '83.33%' }, textAlign: 'center' }}>
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
                                        Temukan Karir Impian Anda
                                    </Typography>
                                    <Typography variant="h6" gutterBottom sx={{ mb: 5, maxWidth: '700px', mx: 'auto', color: 'primary.100', fontWeight: 'normal' }}>
                                        Jelajahi ribuan lowongan pekerjaan dari perusahaan ternama untuk mahasiswa dan fresh graduate
                                    </Typography>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                >
                                    <Card
                                        elevation={4}
                                        sx={{
                                            p: { xs: 2, md: 3 },
                                            borderRadius: '1.5rem',
                                            background: 'rgba(255, 255, 255, 0.95)',
                                            backdropFilter: 'blur(10px)',
                                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                                            border: '1px solid rgba(255, 255, 255, 0.2)',
                                        }}
                                        className="hover:shadow-xl transition-shadow duration-300"
                                    >
                                        <form onSubmit={handleSearch}>
                                            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: 'center' }}>
                                                <Box sx={{ width: { xs: '100%', md: '41.67%' } }}>
                                                    <TextField
                                                        placeholder="Posisi, perusahaan, atau kata kunci"
                                                        fullWidth
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                        variant="outlined"
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <SearchIcon className="text-primary-500" />
                                                                </InputAdornment>
                                                            ),
                                                            sx: {
                                                                borderRadius: '0.75rem',
                                                                '&:hover': {
                                                                    boxShadow: '0 0 0 2px rgba(20, 184, 166, 0.1)'
                                                                },
                                                                '&.Mui-focused': {
                                                                    borderColor: 'primary.main',
                                                                    boxShadow: '0 0 0 2px rgba(20, 184, 166, 0.2)'
                                                                }
                                                            }
                                                        }}
                                                    />
                                                </Box>
                                                <Box sx={{ width: { xs: '100%', md: '33.33%' } }}>
                                                    <TextField
                                                        placeholder="Lokasi"
                                                        fullWidth
                                                        value={locationQuery}
                                                        onChange={(e) => setLocationQuery(e.target.value)}
                                                        variant="outlined"
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <LocationIcon className="text-primary-500" />
                                                                </InputAdornment>
                                                            ),
                                                            sx: {
                                                                borderRadius: '0.75rem',
                                                                '&:hover': {
                                                                    boxShadow: '0 0 0 2px rgba(20, 184, 166, 0.1)'
                                                                },
                                                                '&.Mui-focused': {
                                                                    borderColor: 'primary.main',
                                                                    boxShadow: '0 0 0 2px rgba(20, 184, 166, 0.2)'
                                                                }
                                                            }
                                                        }}
                                                    />
                                                </Box>
                                                <Box sx={{ width: { xs: '100%', md: '25%' } }}>
                                                    <Button
                                                        type="submit"
                                                        variant="contained"
                                                        fullWidth
                                                        size="large"
                                                        className="py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-primary-500/20 hover:-translate-y-1"
                                                        endIcon={<SearchIcon />}
                                                        sx={{
                                                            height: '56px',
                                                            fontWeight: 600,
                                                            boxShadow: '0 4px 14px 0 rgba(20, 184, 166, 0.3)',
                                                        }}
                                                    >
                                                        Cari Pekerjaan
                                                    </Button>
                                                </Box>

                                                <Box sx={{ width: '100%', textAlign: 'right' }}>
                                                    <Button
                                                        variant="text"
                                                        color="primary"
                                                        onClick={() => setFilterOpen(!filterOpen)}
                                                        startIcon={<FilterIcon />}
                                                        className="font-medium"
                                                        endIcon={filterOpen ? <CloseIcon /> : null}
                                                    >
                                                        {filterOpen ? 'Sembunyikan Filter' : 'Filter Lanjutan'}
                                                    </Button>
                                                </Box>
                                            </Box>
                                        </form>

                                        <AnimatePresence>
                                            {filterOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <Box sx={{ pt: 3 }}>
                                                        <Divider sx={{ mb: 3 }}>
                                                            <Typography variant="body2" color="text.secondary" className="font-medium px-2">
                                                                Filter Lowongan
                                                            </Typography>
                                                        </Divider>

                                                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                                                            <Box sx={{ width: { xs: '100%', md: '33.33%' } }}>
                                                                <FormControl fullWidth variant="outlined">
                                                                    <InputLabel id="category-label">Kategori</InputLabel>
                                                                    <Select
                                                                        labelId="category-label"
                                                                        value={selectedCategory}
                                                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                                                        label="Kategori"
                                                                        startAdornment={
                                                                            <InputAdornment position="start">
                                                                                <CategoryIcon className="text-primary-400" />
                                                                            </InputAdornment>
                                                                        }
                                                                        sx={{
                                                                            borderRadius: '0.75rem',
                                                                            '&:hover': {
                                                                                boxShadow: '0 0 0 2px rgba(20, 184, 166, 0.1)'
                                                                            },
                                                                            '&.Mui-focused': {
                                                                                boxShadow: '0 0 0 2px rgba(20, 184, 166, 0.2)'
                                                                            }
                                                                        }}
                                                                    >
                                                                        <MenuItem value="">Semua Kategori</MenuItem>
                                                                        {categories && Array.isArray(categories) && categories.map((category) => (
                                                                            <MenuItem value={category.id} key={category.id}>
                                                                                {category.name}
                                                                            </MenuItem>
                                                                        ))}
                                                                    </Select>
                                                                </FormControl>
                                                            </Box>
                                                            <Box sx={{ width: { xs: '100%', md: '33.33%' } }}>
                                                                <FormControl fullWidth variant="outlined">
                                                                    <InputLabel id="type-label">Tipe Pekerjaan</InputLabel>
                                                                    <Select
                                                                        labelId="type-label"
                                                                        value={selectedType}
                                                                        onChange={(e) => setSelectedType(e.target.value)}
                                                                        label="Tipe Pekerjaan"
                                                                        startAdornment={
                                                                            <InputAdornment position="start">
                                                                                <WorkIcon className="text-primary-400" />
                                                                            </InputAdornment>
                                                                        }
                                                                        sx={{
                                                                            borderRadius: '0.75rem',
                                                                            '&:hover': {
                                                                                boxShadow: '0 0 0 2px rgba(20, 184, 166, 0.1)'
                                                                            },
                                                                            '&.Mui-focused': {
                                                                                boxShadow: '0 0 0 2px rgba(20, 184, 166, 0.2)'
                                                                            }
                                                                        }}
                                                                    >
                                                                        <MenuItem value="">Semua Tipe</MenuItem>
                                                                        <MenuItem value="full_time">Full Time</MenuItem>
                                                                        <MenuItem value="part_time">Part Time</MenuItem>
                                                                        <MenuItem value="contract">Kontrak</MenuItem>
                                                                        <MenuItem value="internship">Magang</MenuItem>
                                                                        <MenuItem value="freelance">Freelance</MenuItem>
                                                                    </Select>
                                                                </FormControl>
                                                            </Box>
                                                            <Box sx={{ width: { xs: '100%', md: '33.33%' } }}>
                                                                <FormControl fullWidth variant="outlined">
                                                                    <InputLabel id="experience-label">Level Pengalaman</InputLabel>
                                                                    <Select
                                                                        labelId="experience-label"
                                                                        value={selectedExperience}
                                                                        onChange={(e) => setSelectedExperience(e.target.value)}
                                                                        label="Level Pengalaman"
                                                                        startAdornment={
                                                                            <InputAdornment position="start">
                                                                                <PersonSearchIcon className="text-primary-400" />
                                                                            </InputAdornment>
                                                                        }
                                                                        sx={{
                                                                            borderRadius: '0.75rem',
                                                                            '&:hover': {
                                                                                boxShadow: '0 0 0 2px rgba(20, 184, 166, 0.1)'
                                                                            },
                                                                            '&.Mui-focused': {
                                                                                boxShadow: '0 0 0 2px rgba(20, 184, 166, 0.2)'
                                                                            }
                                                                        }}
                                                                    >
                                                                        <MenuItem value="">Semua Level</MenuItem>
                                                                        <MenuItem value="entry">Entry Level (0-2 tahun)</MenuItem>
                                                                        <MenuItem value="mid">Mid Level (2-5 tahun)</MenuItem>
                                                                        <MenuItem value="senior">Senior Level (5+ tahun)</MenuItem>
                                                                        <MenuItem value="executive">Executive (10+ tahun)</MenuItem>
                                                                    </Select>
                                                                </FormControl>
                                                            </Box>

                                                            <Box sx={{ width: '100%', mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                                                <Button
                                                                    variant="outlined"
                                                                    color="secondary"
                                                                    onClick={resetFilters}
                                                                    className="rounded-xl border-gray-300 text-gray-700"
                                                                >
                                                                    Reset Filter
                                                                </Button>
                                                                <Button
                                                                    variant="contained"
                                                                    color="primary"
                                                                    onClick={() => applyFilters({ page: 1 })}
                                                                    className="rounded-xl"
                                                                >
                                                                    Terapkan Filter
                                                                </Button>
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </Card>
                                </motion.div>
                            </Box>
                        </Box>
                    </Container>
                </Box>

                {/* Active Filters Bar */}
                {Object.keys(filters).some(key => filters[key] && key !== 'page') && (
                    <Box
                        sx={{
                            py: 2,
                            backdropFilter: 'blur(10px)',
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        }}
                        className="sticky top-0 z-10"
                    >
                        <Container maxWidth="lg">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                                <Stack direction="row" spacing={1} sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                                        <FilterIcon fontSize="small" sx={{ mr: 0.5 }} /> Filter Aktif:
                                    </Typography>

                                    {filters.search && (
                                        <CustomChip
                                            icon={<SearchIcon fontSize="small" />}
                                            label={filters.search}
                                            color="primary"
                                            onDelete={() => {
                                                setSearchQuery('');
                                                applyFilters({ search: '', page: 1 });
                                            }}
                                        />
                                    )}

                                    {filters.location && (
                                        <CustomChip
                                            icon={<LocationIcon fontSize="small" />}
                                            label={filters.location}
                                            color="info"
                                            onDelete={() => {
                                                setLocationQuery('');
                                                applyFilters({ location: '', page: 1 });
                                            }}
                                        />
                                    )}

                                    {filters.type && (
                                        <CustomChip
                                            icon={<WorkIcon fontSize="small" />}
                                            label={formatJobType(filters.type)}
                                            color="secondary"
                                            onDelete={() => {
                                                setSelectedType('');
                                                applyFilters({ type: '', page: 1 });
                                            }}
                                        />
                                    )}

                                    {filters.category_id && categories && (
                                        <CustomChip
                                            icon={<CategoryIcon fontSize="small" />}
                                            label={categories.find(c => c.id === parseInt(filters.category_id))?.name || 'Kategori'}
                                            color="warning"
                                            onDelete={() => {
                                                setSelectedCategory('');
                                                applyFilters({ category_id: '', page: 1 });
                                            }}
                                        />
                                    )}

                                    {filters.experience_level && (
                                        <CustomChip
                                            icon={<PersonSearchIcon fontSize="small" />}
                                            label={formatExperienceLevel(filters.experience_level)}
                                            color="success"
                                            onDelete={() => {
                                                setSelectedExperience('');
                                                applyFilters({ experience_level: '', page: 1 });
                                            }}
                                        />
                                    )}
                                </Stack>

                                <Button
                                    variant="text"
                                    size="small"
                                    color="error"
                                    onClick={resetFilters}
                                    startIcon={<CloseIcon fontSize="small" />}
                                    sx={{ fontSize: '0.875rem' }}
                                >
                                    Reset Semua
                                </Button>
                            </Box>
                        </Container>
                    </Box>
                )}

                {/* Results Section */}
                <Box sx={{ py: 6, backgroundColor: 'gray.50' }} className="bg-gray-50">
                    <Container maxWidth="lg">
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {/* Main content */}
                            <Box sx={{ width: '100%' }}>
                                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                                    <Typography variant="h5" component="h2" fontWeight="bold" className="text-gray-800">
                                        {!isLoading && (
                                            <div className="flex items-center">
                                                <span className="bg-primary-100 text-primary-600 px-3 py-1 rounded-lg mr-2 font-bold">{total}</span>
                                                Lowongan Pekerjaan Ditemukan
                                            </div>
                                        )}
                                        {isLoading && (
                                            <Skeleton width={300} />
                                        )}
                                    </Typography>
                                </Box>

                                {jobs?.data && jobs.data.length === 0 && !isLoading && (
                                    <Alert
                                        severity="info"
                                        sx={{
                                            mb: 4,
                                            borderRadius: '1rem',
                                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                            border: '1px solid rgba(59, 130, 246, 0.2)',
                                            '& .MuiAlert-icon': {
                                                color: '#3b82f6'
                                            }
                                        }}
                                    >
                                        <Typography variant="body1" fontWeight={500}>
                                            Tidak ada lowongan pekerjaan yang ditemukan. Silakan coba dengan filter berbeda.
                                        </Typography>
                                    </Alert>
                                )}

                                {/* Job Listings */}
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                        {isLoading ? (
                                            // Skeleton loader
                                            Array.from(new Array(6)).map((_, index) => (
                                                <Box key={index} sx={{ width: '100%' }}>
                                                    <Card
                                                        sx={{
                                                            borderRadius: '1rem',
                                                            overflow: 'hidden',
                                                            border: '1px solid',
                                                            borderColor: 'divider'
                                                        }}
                                                    >
                                                        <CardContent>
                                                            <Skeleton variant="text" width="60%" height={40} />
                                                            <Skeleton variant="text" width="40%" />
                                                            <Box sx={{ my: 2 }}>
                                                                <Skeleton variant="text" width="100%" height={60} />
                                                            </Box>
                                                            <Box sx={{ display: 'flex', mt: 2, gap: 1 }}>
                                                                <Skeleton variant="rounded" width={90} height={30} sx={{ borderRadius: '0.75rem' }} />
                                                                <Skeleton variant="rounded" width={90} height={30} sx={{ borderRadius: '0.75rem' }} />
                                                                <Skeleton variant="rounded" width={90} height={30} sx={{ borderRadius: '0.75rem' }} />
                                                            </Box>
                                                        </CardContent>
                                                    </Card>
                                                </Box>
                                            ))
                                        ) : (
                                            jobs?.data && jobs.data.length > 0 ? jobs.data.map((job) => (
                                                <Box key={job.id} sx={{ width: '100%' }}>
                                                    <motion.div variants={itemVariants}>
                                                        <Card
                                                            sx={{
                                                                borderRadius: '1rem',
                                                                overflow: 'hidden',
                                                                border: '1px solid',
                                                                borderColor: 'divider',
                                                                transition: 'all 0.3s ease',
                                                                '&:hover': {
                                                                    transform: 'translateY(-4px)',
                                                                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                                                                    borderColor: 'primary.100',
                                                                }
                                                            }}
                                                            className="hover:border-primary-200"
                                                        >
                                                            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                                                                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                                                                    <Box sx={{ width: { xs: '100%', md: '75%' } }}>
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, flexWrap: 'wrap', gap: 1 }}>
                                                                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                                                                                <CalendarIcon fontSize="small" sx={{ mr: 0.5 }} />
                                                                                {job.created_at ? moment(job.created_at).fromNow() : 'Tidak ada tanggal'}
                                                                            </Typography>

                                                                            {job.deadline && moment(job.deadline).isBefore(moment()) ? (
                                                                                <CustomChip
                                                                                    label="Ditutup"
                                                                                    size="small"
                                                                                    color="error"
                                                                                />
                                                                            ) : (
                                                                                job.created_at && moment().diff(moment(job.created_at), 'days') <= 3 && (
                                                                                    <CustomChip
                                                                                        label="Baru"
                                                                                        size="small"
                                                                                        color="success"
                                                                                        icon={<BoltIcon fontSize="small" />}
                                                                                    />
                                                                                )
                                                                            )}
                                                                        </Box>

                                                                        <Link
                                                                            href={route('public.jobs.show', job.id)}
                                                                            className="no-underline hover:text-primary-600 transition-colors group">
                                                                            <Typography
                                                                                variant="h6"
                                                                                component="h3"
                                                                                fontWeight="bold"
                                                                                gutterBottom
                                                                                className="group-hover:text-primary-600 transition-colors"
                                                                            >
                                                                                {job.title}
                                                                            </Typography>
                                                                        </Link>

                                                                        <Box
                                                                            sx={{
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                                mb: 2
                                                                            }}
                                                                            className="text-gray-600"
                                                                        >
                                                                            <Box
                                                                                sx={{
                                                                                    display: 'flex',
                                                                                    alignItems: 'center',
                                                                                    mr: 2.5,
                                                                                    color: 'text.secondary'
                                                                                }}
                                                                            >
                                                                                <BusinessIcon fontSize="small" sx={{ mr: 0.75 }} />
                                                                                <Typography variant="body2">
                                                                                    {job.company?.name || 'Nama perusahaan tidak tersedia'}
                                                                                </Typography>
                                                                            </Box>

                                                                            {job.location && (
                                                                                <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                                                                                    <LocationIcon fontSize="small" sx={{ mr: 0.75 }} />
                                                                                    <Typography variant="body2">
                                                                                        {job.location}
                                                                                    </Typography>
                                                                                </Box>
                                                                            )}
                                                                        </Box>

                                                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                                                                            {job.type && (
                                                                                <CustomChip
                                                                                    icon={<WorkIcon fontSize="small" />}
                                                                                    label={formatJobType(job.type)}
                                                                                    color={job.type === 'full_time' ? 'primary' :
                                                                                        job.type === 'part_time' ? 'secondary' :
                                                                                            job.type === 'contract' ? 'info' :
                                                                                                job.type === 'internship' ? 'success' : 'warning'}
                                                                                />
                                                                            )}

                                                                            {job.salary_min && (
                                                                                <CustomChip
                                                                                    icon={<SalaryIcon fontSize="small" />}
                                                                                    label={job.salary_max ? `${formatCurrency(job.salary_min)} - ${formatCurrency(job.salary_max)}` : `${formatCurrency(job.salary_min)}`}
                                                                                    color="info"
                                                                                />
                                                                            )}

                                                                            {job.experience_level && (
                                                                                <CustomChip
                                                                                    icon={<PersonSearchIcon fontSize="small" />}
                                                                                    label={formatExperienceLevel(job.experience_level)}
                                                                                    color="default"
                                                                                />
                                                                            )}
                                                                        </Box>

                                                                        <Divider sx={{ mb: 2 }} />

                                                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                                            {job.skills && Array.isArray(job.skills) && job.skills.length > 0 ? (
                                                                                <>
                                                                                    {job.skills.slice(0, 3).map((skill, index) => (
                                                                                        <CustomChip
                                                                                            key={index}
                                                                                            label={skill}
                                                                                            size="small"
                                                                                            color="primary"
                                                                                            variant="outlined"
                                                                                        />
                                                                                    ))}

                                                                                    {job.skills.length > 3 && (
                                                                                        <Tooltip title={job.skills.slice(3).join(', ')}>
                                                                                            <Box component="span" className="cursor-pointer">
                                                                                                <CustomChip
                                                                                                    label={`+${job.skills.length - 3}`}
                                                                                                    size="small"
                                                                                                    color="primary"
                                                                                                    variant="outlined"
                                                                                                />
                                                                                            </Box>
                                                                                        </Tooltip>
                                                                                    )}
                                                                                </>
                                                                            ) : null}
                                                                        </Box>
                                                                    </Box>

                                                                    <Box
                                                                        sx={{
                                                                            width: { xs: '100%', md: '25%' },
                                                                            display: 'flex',
                                                                            flexDirection: 'column',
                                                                            alignItems: { xs: 'flex-start', md: 'flex-end' },
                                                                            justifyContent: 'space-between',
                                                                            borderLeft: { xs: 'none', md: '1px solid' },
                                                                            borderColor: 'divider',
                                                                            pl: { xs: 0, md: 3 },
                                                                            pt: { xs: 2, md: 0 },
                                                                            mt: { xs: 2, md: 0 },
                                                                            borderTop: { xs: '1px solid', md: 'none' },
                                                                        }}
                                                                    >
                                                                        <Box
                                                                            sx={{
                                                                                display: 'flex',
                                                                                flexDirection: { xs: 'row', md: 'column' },
                                                                                alignItems: { xs: 'center', md: 'flex-end' },
                                                                                justifyContent: 'space-between',
                                                                                width: '100%',
                                                                                mb: { xs: 2, md: 'auto' }
                                                                            }}
                                                                        >
                                                                            <IconButton
                                                                                color="primary"
                                                                                onClick={() => toggleSaveJob(job.id)}
                                                                                sx={{
                                                                                    ml: { xs: 0, md: 'auto' },
                                                                                    mb: { xs: 0, md: 2 },
                                                                                    color: savedJobs.includes(job.id) ? 'primary.main' : 'gray.400'
                                                                                }}
                                                                                className={`rounded-xl transition-colors hover:bg-primary-50 ${savedJobs.includes(job.id) ? 'text-primary-500' : 'text-gray-400'}`}
                                                                            >
                                                                                {savedJobs.includes(job.id) ? (
                                                                                    <BookmarkIcon className="text-primary-500" />
                                                                                ) : (
                                                                                    <BookmarkBorderIcon />
                                                                                )}
                                                                            </IconButton>

                                                                            {/* Job deadline */}
                                                                            {job.deadline && (
                                                                                <Typography
                                                                                    variant="body2"
                                                                                    color="text.secondary"
                                                                                    className="text-right text-gray-500"
                                                                                >
                                                                                    <TimeIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                                                                                    {moment().diff(moment(job.deadline), 'days') > 0
                                                                                        ? 'Ditutup'
                                                                                        : `Ditutup ${moment(job.deadline).fromNow()}`
                                                                                    }
                                                                                </Typography>
                                                                            )}
                                                                        </Box>

                                                                        <Button
                                                                            variant="contained"
                                                                            color="primary"
                                                                            component={Link}
                                                                            href={route('public.jobs.show', job.id)}
                                                                            sx={{
                                                                                mt: { xs: 2, md: 0 },
                                                                                width: { xs: '100%', md: '100%' },
                                                                                borderRadius: '0.75rem',
                                                                                py: 1,
                                                                                fontWeight: 600,
                                                                                boxShadow: '0 4px 14px 0 rgba(20, 184, 166, 0.25)',
                                                                                '&:hover': {
                                                                                    boxShadow: '0 6px 20px 0 rgba(20, 184, 166, 0.35)',
                                                                                    transform: 'translateY(-2px)'
                                                                                },
                                                                            }}
                                                                            className="transition-all duration-300 hover:shadow-lg"
                                                                            endIcon={<ArrowForwardIcon />}
                                                                        >
                                                                            Lihat Detail
                                                                        </Button>
                                                                    </Box>
                                                                </Box>
                                                            </CardContent>
                                                        </Card>
                                                    </motion.div>
                                                </Box>
                                            )) : (
                                                <Box sx={{ width: '100%' }}>
                                                    <Alert severity="info" sx={{
                                                        p: 3,
                                                        borderRadius: '1rem',
                                                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                                        border: '1px solid rgba(59, 130, 246, 0.2)',
                                                    }}>
                                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                            Tidak ada lowongan tersedia
                                                        </Typography>
                                                    </Alert>
                                                </Box>
                                            )
                                        )}
                                    </Box>
                                </motion.div>

                                {/* Pagination */}
                                {jobs?.data && jobs.data.length > 0 && (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                                        <CustomPagination
                                            currentPage={page}
                                            totalPages={jobs?.last_page || 1}
                                            totalItems={total || 0}
                                            perPage={jobs?.per_page || 10}
                                            onPageChange={handlePageChange}
                                            variant="compact"
                                            showFirst={true}
                                            showLast={true}
                                            rounded="large"
                                            size="medium"
                                            className="bg-white shadow-sm"
                                        />
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    </Container>
                </Box>
            </PublicLayout>
        </MuiThemeProvider>
    );
}
