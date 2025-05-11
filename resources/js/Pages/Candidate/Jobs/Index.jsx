import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    Container,
    Typography,
    Box,
    Divider,
    Avatar,
    Paper,
    Chip,
    IconButton,
    MenuItem,
    FormControl,
    Select,
    Stack,
    useMediaQuery,
    useTheme,
    LinearProgress,
    CircularProgress,
    Fade,
    Menu,
    Tooltip,
    Pagination,
    TextField,
    InputAdornment,
    Card,
    CardContent,
    alpha
} from '@mui/material';
import {
    Work as WorkIcon,
    Business as BusinessIcon,
    AccessTime as AccessTimeIcon,
    ArrowForward as ArrowForwardIcon,
    Search as SearchIcon,
    FilterList as FilterListIcon,
    Sort as SortIcon,
    MoreVert as MoreVertIcon,
    Star as StarIcon,
    StarOutline as StarOutlineIcon,
    KeyboardArrowDown as KeyboardArrowDownIcon,
    VisibilityOutlined as VisibilityIcon,
    MoreHoriz as MoreHorizIcon,
    Assignment as AssignmentIcon,
    AddCircleOutline as AddCircleOutlineIcon,
    FilterAlt as FilterAltIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Schedule as ScheduleIcon,
    LocationOn,
    AttachMoney,
    WorkOutline,
    CalendarToday,
    BusinessCenter
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from "@/Components/Layout/Layout.jsx";
import Button from '@/Components/Shared/Button';

// Job Card Component
const JobCard = ({ job }) => {
    const theme = useTheme();
    const [starred, setStarred] = useState(false);

    const formatDate = (dateString) => {
        if (!dateString) return '';

        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return '';

            return date.toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return '';
        }
    };

    // Get status color based on job status
    const getStatusColor = (status) => {
        switch(status) {
            case 'active':
                return theme.palette.success.main;
            case 'expired':
                return theme.palette.error.main;
            case 'draft':
                return theme.palette.warning.main;
            default:
                return theme.palette.grey[500];
        }
    };

    // Get status label
    const getStatusLabel = (status) => {
        switch(status) {
            case 'active':
                return 'Aktif';
            case 'expired':
                return 'Berakhir';
            case 'closed':
                return 'Ditutup';
            case 'draft':
                return 'Draft';
            default:
                return status;
        }
    };

    // Calculate if deadline is near (less than 3 days)
    const isDeadlineNear = () => {
        if (!job?.days_remaining && job?.days_remaining !== 0) return false;
        return job.days_remaining <= 3 && job.days_remaining >= 0;
    };

    // Ensure days_remaining is an integer
    const daysRemaining = job?.days_remaining ? Math.floor(job.days_remaining) : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <Card
                variant="outlined"
                sx={{
                    height: '100%',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                        borderColor: alpha(theme.palette.primary.main, 0.3)
                    },
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                }}
                className="transition-all duration-300"
            >
                {/* Status progress bar at top of card */}
                <LinearProgress
                    variant="determinate"
                    value={job?.status === 'active' ? 100 : 0}
                    sx={{
                        height: 4,
                        backgroundColor: 'rgba(0,0,0,0.05)',
                        '& .MuiLinearProgress-bar': {
                            backgroundColor: getStatusColor(job?.status)
                        }
                    }}
                />

                <CardContent sx={{
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                        <Avatar
                            src={job?.company?.logo}
                            alt={job?.company?.name}
                            variant="rounded"
                            sx={{
                                width: 56,
                                height: 56,
                                mr: 2,
                                borderRadius: 2,
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                border: '1px solid',
                                borderColor: 'divider',
                                p: 1
                            }}
                        >
                            {!job?.company?.logo && job?.company?.name?.charAt(0)}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 700,
                                            color: 'text.primary',
                                            mb: 0.5
                                        }}
                                        className="text-gray-800"
                                    >
                                        {job?.title}
                                    </Typography>
                                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: 'primary.main',
                                                fontWeight: 500,
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <BusinessIcon fontSize="small" sx={{ mr: 0.5, fontSize: 16 }} />
                                            {job?.company?.name}
                                        </Typography>
                                    </Stack>
                                </Box>
                                <Chip
                                    label={getStatusLabel(job?.status)}
                                    size="small"
                                    sx={{
                                        height: 24,
                                        fontWeight: 600,
                                        bgcolor: alpha(getStatusColor(job?.status), 0.1),
                                        color: getStatusColor(job?.status),
                                        fontSize: '0.7rem',
                                        borderRadius: '0.5rem',
                                        border: '1px solid',
                                        borderColor: `${getStatusColor(job?.status)}30`
                                    }}
                                />
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {job?.job_type && (
                            <Chip
                                icon={<WorkOutline fontSize="small" />}
                                label={job.job_type}
                                size="small"
                                variant="outlined"
                                sx={{ borderRadius: 1 }}
                            />
                        )}
                        {job?.location && (
                            <Chip
                                icon={<LocationOn fontSize="small" />}
                                label={job.location}
                                size="small"
                                variant="outlined"
                                sx={{ borderRadius: 1 }}
                            />
                        )}
                        {job?.experience_level && (
                            <Chip
                                icon={<AssignmentIcon fontSize="small" />}
                                label={job.experience_level}
                                size="small"
                                variant="outlined"
                                sx={{ borderRadius: 1 }}
                            />
                        )}
                    </Box>

                    {(job?.salary_min || job?.salary_max) && (
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mb: 2,
                            color: 'success.main',
                            bgcolor: alpha(theme.palette.success.main, 0.1),
                            px: 1.5,
                            py: 0.75,
                            borderRadius: 1,
                            width: 'fit-content'
                        }}>
                            <AttachMoney fontSize="small" sx={{ mr: 0.5 }} />
                            <Typography variant="body2" fontWeight="medium">
                                {job?.salary_min && job?.salary_max
                                    ? `Rp${job.salary_min.toLocaleString()} - Rp${job.salary_max.toLocaleString()}`
                                    : job?.salary_min
                                        ? `Rp${job.salary_min.toLocaleString()}+`
                                        : job?.salary_max
                                            ? `Hingga Rp${job.salary_max.toLocaleString()}`
                                            : ''
                                }
                            </Typography>
                        </Box>
                    )}

                    <Box sx={{ mt: 'auto' }}>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <CalendarToday
                                    fontSize="small"
                                    sx={{
                                        color: isDeadlineNear() ? 'error.main' : 'text.secondary',
                                        mr: 0.5
                                    }}
                                />
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: isDeadlineNear() ? 'error.main' : 'text.secondary',
                                        fontWeight: isDeadlineNear() ? 'bold' : 'normal'
                                    }}
                                >
                                    {daysRemaining > 0
                                        ? `${daysRemaining} hari lagi`
                                        : job?.status === 'expired'
                                            ? 'Sudah berakhir'
                                            : formatDate(job?.submission_deadline)
                                    }
                                </Typography>
                            </Box>
                            <Link href={route('candidate.jobs.show', job?.id)}>
                                <Button
                                    variant="contained"
                                    size="small"
                                    endIcon={<ArrowForwardIcon />}
                                    sx={{
                                        borderRadius: 2,
                                        px: 2,
                                        boxShadow: '0 4px 14px 0 rgba(20, 184, 166, 0.25)',
                                        '&:hover': {
                                            boxShadow: '0 6px 20px 0 rgba(20, 184, 166, 0.35)',
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                    className="transition-all duration-300"
                                    disabled={job?.status === 'expired' || job?.status === 'closed'}
                                >
                                    {job?.has_applied ? 'Sudah Dilamar' : 'Lihat Detail'}
                                </Button>
                            </Link>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </motion.div>
    );
};

// Empty state component
const EmptyState = () => {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 6,
                textAlign: 'center',
                border: '1px dashed',
                borderColor: 'divider',
                borderRadius: '1rem',
                bgcolor: 'rgba(0,0,0,0.01)'
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Box
                    sx={{
                        width: 120,
                        height: 120,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(20, 184, 166, 0.1)',
                        mb: 3
                    }}
                >
                    <BusinessCenter sx={{ fontSize: 48, color: 'primary.main', opacity: 0.8 }} />
                </Box>

                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }} className="text-gray-800">
                    Tidak ada lowongan yang ditemukan
                </Typography>

                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, maxWidth: 500 }}>
                    Tidak ada lowongan pekerjaan yang sesuai dengan kriteria pencarian Anda.
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={() => router.get(route('candidate.jobs.index'))}
                    sx={{
                        borderRadius: '0.75rem',
                        py: 1.5,
                        px: 4,
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
                    Lihat Semua Lowongan
                </Button>
            </Box>
        </Paper>
    );
};

export default function Index({ jobs, filters, filterOptions }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    const [search, setSearch] = useState(filters?.search || '');
    const [sortAnchorEl, setSortAnchorEl] = useState(null);
    const [statusAnchorEl, setStatusAnchorEl] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        setLoading(true);
        router.get(route('candidate.jobs.index'), {
            search: search,
            company: filters?.company,
            job_type: filters?.job_type,
            location: filters?.location,
            experience_level: filters?.experience_level,
            status: filters?.status,
            sort: filters?.sort,
            direction: filters?.direction
        }, {
            preserveState: true,
            onSuccess: () => setLoading(false),
            onError: () => setLoading(false)
        });
    };

    const handleFilterChange = (name, value) => {
        setLoading(true);
        router.get(route('candidate.jobs.index'), {
            ...filters,
            [name]: value,
            page: 1 // Reset to first page when changing filters
        }, {
            preserveState: true,
            onSuccess: () => setLoading(false),
            onError: () => setLoading(false)
        });
    };

    const handleSortChange = (sort, direction) => {
        setSortAnchorEl(null);
        setLoading(true);
        router.get(route('candidate.jobs.index'), {
            ...filters,
            sort: sort,
            direction: direction,
            page: 1
        }, {
            preserveState: true,
            onSuccess: () => setLoading(false),
            onError: () => setLoading(false)
        });
    };

    const handlePaginationChange = (event, page) => {
        setLoading(true);
        router.get(route('candidate.jobs.index'), {
            ...filters,
            page: page
        }, {
            preserveState: true,
            onSuccess: () => setLoading(false),
            onError: () => setLoading(false)
        });
    };

    const clearFilters = () => {
        setLoading(true);
        router.get(route('candidate.jobs.index'), {
            search: search,
            status: 'active', // Default to active jobs
        }, {
            preserveState: true,
            onSuccess: () => setLoading(false),
            onError: () => setLoading(false)
        });
    };

    // Handle sort menu
    const handleSortMenuOpen = (event) => {
        setSortAnchorEl(event.currentTarget);
    };

    const handleSortMenuClose = () => {
        setSortAnchorEl(null);
    };

    // Handle status filter menu
    const handleStatusMenuOpen = (event) => {
        setStatusAnchorEl(event.currentTarget);
    };

    const handleStatusMenuClose = () => {
        setStatusAnchorEl(null);
    };

    // Get sort display text
    const getSortDisplayText = () => {
        const sort = filters?.sort || 'created_at';
        const direction = filters?.direction || 'desc';

        if (sort === 'created_at' && direction === 'desc') return 'Terbaru';
        if (sort === 'created_at' && direction === 'asc') return 'Terlama';
        if (sort === 'submission_deadline' && direction === 'asc') return 'Deadline Terdekat';
        if (sort === 'title' && direction === 'asc') return 'Judul (A-Z)';
        if (sort === 'title' && direction === 'desc') return 'Judul (Z-A)';
        if (sort === 'company' && direction === 'asc') return 'Perusahaan (A-Z)';
        if (sort === 'company' && direction === 'desc') return 'Perusahaan (Z-A)';

        return 'Urutkan';
    };

    return (
        <Layout title="Lowongan Pekerjaan">
            <Head title="Lowongan Pekerjaan" />
            <Container
                maxWidth="xl"
                sx={{
                    py: { xs: 2, md: 4 }
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Page header */}
                    <Box sx={{ mb: 4 }}>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 800,
                                mb: 1,
                                color: 'text.primary'
                            }}
                            className="text-gray-800"
                        >
                            Daftar Lowongan Pekerjaan
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Temukan dan lamar lowongan pekerjaan yang sesuai dengan keahlian dan minat Anda
                        </Typography>
                    </Box>

                    {/* Search bar */}
                    <Box sx={{ mb: 4 }}>
                        <Paper
                            component="form"
                            onSubmit={handleSearch}
                            elevation={0}
                            sx={{
                                p: 1.5,
                                display: 'flex',
                                alignItems: 'center',
                                borderRadius: '1rem',
                                border: '1px solid',
                                borderColor: 'divider',
                                boxShadow: '0 4px 14px rgba(0,0,0,0.05)',
                                '&:hover': {
                                    borderColor: 'primary.main',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                },
                                transition: 'all 0.3s ease'
                            }}
                            className="transition-all duration-300"
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, mx: 1 }}>
                                <SearchIcon color="action" sx={{ mr: 1 }} />
                                <TextField
                                    fullWidth
                                    placeholder="Cari lowongan berdasarkan judul, perusahaan, atau lokasi..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    variant="standard"
                                    InputProps={{
                                        disableUnderline: true
                                    }}
                                />
                            </Box>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={loading}
                                sx={{
                                    height: 48,
                                    borderRadius: '0.75rem',
                                    px: 3,
                                    py: 1.25,
                                    fontWeight: 600,
                                    boxShadow: '0 4px 14px 0 rgba(20, 184, 166, 0.25)',
                                    '&:hover': {
                                        boxShadow: '0 6px 20px 0 rgba(20, 184, 166, 0.35)',
                                    },
                                    transition: 'all 0.3s ease'
                                }}
                                className="transition-all duration-300"
                            >
                                {loading ? 'Mencari...' : 'Cari'}
                            </Button>
                        </Paper>
                    </Box>

                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                md: '1fr 3fr',
                            },
                            gap: 3
                        }}
                    >
                        {/* Filter sidebar */}
                        <Box>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    borderRadius: '1rem',
                                    position: 'sticky',
                                    top: 100,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                }}
                            >
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mb: 3
                                }}>
                                    <Typography variant="h6" fontWeight="bold">
                                        Filter
                                    </Typography>
                                    <Button
                                        variant="text"
                                        color="primary"
                                        size="small"
                                        onClick={clearFilters}
                                        disabled={loading}
                                    >
                                        Reset
                                    </Button>
                                </Box>

                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle2" gutterBottom fontWeight="medium">
                                        Status
                                    </Typography>
                                    <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                                        <Select
                                            value={filters?.status || 'active'}
                                            onChange={(e) => handleFilterChange('status', e.target.value)}
                                            sx={{ borderRadius: '0.75rem' }}
                                            disabled={loading}
                                        >
                                            <MenuItem value="active">Aktif</MenuItem>
                                            <MenuItem value="expired">Berakhir/Ditutup</MenuItem>
                                        </Select>
                                    </FormControl>

                                    <Typography variant="subtitle2" gutterBottom fontWeight="medium">
                                        Perusahaan
                                    </Typography>
                                    <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                                        <Select
                                            value={filters?.company || ''}
                                            onChange={(e) => handleFilterChange('company', e.target.value)}
                                            displayEmpty
                                            sx={{ borderRadius: '0.75rem' }}
                                            disabled={loading}
                                        >
                                            <MenuItem value="">Semua Perusahaan</MenuItem>
                                            {filterOptions?.companies && filterOptions.companies.map((company) => (
                                                <MenuItem key={company.id} value={company.id}>
                                                    {company.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <Typography variant="subtitle2" gutterBottom fontWeight="medium">
                                        Tipe Pekerjaan
                                    </Typography>
                                    <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                                        <Select
                                            value={filters?.job_type || ''}
                                            onChange={(e) => handleFilterChange('job_type', e.target.value)}
                                            displayEmpty
                                            sx={{ borderRadius: '0.75rem' }}
                                            disabled={loading}
                                        >
                                            <MenuItem value="">Semua Tipe</MenuItem>
                                            {filterOptions?.jobTypes && filterOptions.jobTypes.map((type) => (
                                                <MenuItem key={type.value} value={type.value}>
                                                    {type.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <Typography variant="subtitle2" gutterBottom fontWeight="medium">
                                        Lokasi
                                    </Typography>
                                    <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                                        <Select
                                            value={filters?.location || ''}
                                            onChange={(e) => handleFilterChange('location', e.target.value)}
                                            displayEmpty
                                            sx={{ borderRadius: '0.75rem' }}
                                            disabled={loading}
                                        >
                                            <MenuItem value="">Semua Lokasi</MenuItem>
                                            {filterOptions?.locations && filterOptions.locations.map((location) => (
                                                <MenuItem key={location.value} value={location.value}>
                                                    {location.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <Typography variant="subtitle2" gutterBottom fontWeight="medium">
                                        Level Pengalaman
                                    </Typography>
                                    <FormControl fullWidth size="small">
                                        <Select
                                            value={filters?.experience_level || ''}
                                            onChange={(e) => handleFilterChange('experience_level', e.target.value)}
                                            displayEmpty
                                            sx={{ borderRadius: '0.75rem' }}
                                            disabled={loading}
                                        >
                                            <MenuItem value="">Semua Level</MenuItem>
                                            {filterOptions?.experienceLevels && filterOptions.experienceLevels.map((level) => (
                                                <MenuItem key={level.value} value={level.value}>
                                                    {level.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <Box>
                                    <Typography variant="subtitle2" gutterBottom fontWeight="medium">
                                        Urutan
                                    </Typography>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        size="medium"
                                        endIcon={<KeyboardArrowDownIcon />}
                                        onClick={handleSortMenuOpen}
                                        sx={{
                                            borderRadius: '0.75rem',
                                            textTransform: 'none',
                                            justifyContent: 'space-between',
                                            color: 'text.primary',
                                            borderColor: 'divider',
                                            '&:hover': {
                                                borderColor: 'primary.main',
                                                backgroundColor: 'rgba(20, 184, 166, 0.05)'
                                            }
                                        }}
                                        disabled={loading}
                                    >
                                        {getSortDisplayText()}
                                    </Button>
                                    <Menu
                                        anchorEl={sortAnchorEl}
                                        open={Boolean(sortAnchorEl)}
                                        onClose={handleSortMenuClose}
                                        PaperProps={{
                                            elevation: 0,
                                            sx: {
                                                mt: 1.5,
                                                overflow: 'visible',
                                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                                                borderRadius: '0.75rem',
                                                border: '1px solid',
                                                borderColor: 'divider',
                                                '& .MuiMenuItem-root': {
                                                    px: 2,
                                                    py: 1,
                                                    borderRadius: '0.5rem',
                                                    mx: 0.5,
                                                    my: 0.25,
                                                    fontSize: '0.875rem',
                                                },
                                            },
                                        }}
                                    >
                                        <MenuItem onClick={() => handleSortChange('created_at', 'desc')}>
                                            Terbaru
                                            {filters?.sort === 'created_at' && filters?.direction === 'desc' && (
                                                <CheckCircleIcon
                                                    fontSize="small"
                                                    color="primary"
                                                    sx={{ ml: 1 }}
                                                />
                                            )}
                                        </MenuItem>
                                        <MenuItem onClick={() => handleSortChange('created_at', 'asc')}>
                                            Terlama
                                            {filters?.sort === 'created_at' && filters?.direction === 'asc' && (
                                                <CheckCircleIcon
                                                    fontSize="small"
                                                    color="primary"
                                                    sx={{ ml: 1 }}
                                                />
                                            )}
                                        </MenuItem>
                                        <MenuItem onClick={() => handleSortChange('submission_deadline', 'asc')}>
                                            Deadline Terdekat
                                            {filters?.sort === 'submission_deadline' && filters?.direction === 'asc' && (
                                                <CheckCircleIcon
                                                    fontSize="small"
                                                    color="primary"
                                                    sx={{ ml: 1 }}
                                                />
                                            )}
                                        </MenuItem>
                                        <MenuItem onClick={() => handleSortChange('title', 'asc')}>
                                            Judul (A-Z)
                                            {filters?.sort === 'title' && filters?.direction === 'asc' && (
                                                <CheckCircleIcon
                                                    fontSize="small"
                                                    color="primary"
                                                    sx={{ ml: 1 }}
                                                />
                                            )}
                                        </MenuItem>
                                        <MenuItem onClick={() => handleSortChange('title', 'desc')}>
                                            Judul (Z-A)
                                            {filters?.sort === 'title' && filters?.direction === 'desc' && (
                                                <CheckCircleIcon
                                                    fontSize="small"
                                                    color="primary"
                                                    sx={{ ml: 1 }}
                                                />
                                            )}
                                        </MenuItem>
                                        <MenuItem onClick={() => handleSortChange('company', 'asc')}>
                                            Perusahaan (A-Z)
                                            {filters?.sort === 'company' && filters?.direction === 'asc' && (
                                                <CheckCircleIcon
                                                    fontSize="small"
                                                    color="primary"
                                                    sx={{ ml: 1 }}
                                                />
                                            )}
                                        </MenuItem>
                                        <MenuItem onClick={() => handleSortChange('company', 'desc')}>
                                            Perusahaan (Z-A)
                                            {filters?.sort === 'company' && filters?.direction === 'desc' && (
                                                <CheckCircleIcon
                                                    fontSize="small"
                                                    color="primary"
                                                    sx={{ ml: 1 }}
                                                />
                                            )}
                                        </MenuItem>
                                    </Menu>
                                </Box>
                            </Paper>
                        </Box>

                        {/* Main content */}
                        <Box>
                            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6" fontWeight="medium">
                                    {jobs?.total || 0} lowongan ditemukan
                                </Typography>

                                {/* Status filter chips */}
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Chip
                                        label="Lowongan Aktif"
                                        color={filters?.status === 'active' ? 'primary' : 'default'}
                                        onClick={() => handleFilterChange('status', 'active')}
                                        icon={<CheckCircleIcon fontSize="small" />}
                                        variant={filters?.status === 'active' ? 'filled' : 'outlined'}
                                        sx={{
                                            borderRadius: '0.75rem',
                                            fontWeight: 500
                                        }}
                                        disabled={loading}
                                    />
                                    <Chip
                                        label="Lowongan Berakhir"
                                        color={filters?.status === 'expired' ? 'primary' : 'default'}
                                        onClick={() => handleFilterChange('status', 'expired')}
                                        icon={<AccessTimeIcon fontSize="small" />}
                                        variant={filters?.status === 'expired' ? 'filled' : 'outlined'}
                                        sx={{
                                            borderRadius: '0.75rem',
                                            fontWeight: 500
                                        }}
                                        disabled={loading}
                                    />
                                </Box>
                            </Box>

                            {/* Loading state */}
                            {loading ? (
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    py: 8
                                }}>
                                    <CircularProgress color="primary" />
                                </Box>
                            ) : (
                                <>
                                    {jobs?.data?.length > 0 ? (
                                        <>
                                            <AnimatePresence>
                                                <Box
                                                    sx={{
                                                        display: 'grid',
                                                        gridTemplateColumns: {
                                                            xs: '1fr',
                                                            sm: 'repeat(2, 1fr)',
                                                            lg: 'repeat(3, 1fr)'
                                                        },
                                                        gap: 3
                                                    }}
                                                >
                                                    {jobs.data.map((job) => (
                                                        <JobCard key={job.id} job={job} />
                                                    ))}
                                                </Box>
                                            </AnimatePresence>

                                            {jobs.meta?.last_page > 1 && (
                                                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                                                    <Pagination
                                                        count={jobs.meta.last_page}
                                                        page={jobs.meta.current_page}
                                                        onChange={handlePaginationChange}
                                                        color="primary"
                                                        shape="rounded"
                                                        size="large"
                                                        sx={{
                                                            '& .MuiPaginationItem-root': {
                                                                borderRadius: '0.75rem',
                                                                mx: 0.5
                                                            }
                                                        }}
                                                    />
                                                </Box>
                                            )}
                                        </>
                                    ) : (
                                        <EmptyState />
                                    )}
                                </>
                            )}
                        </Box>
                    </Box>
                </motion.div>
            </Container>
        </Layout>
    );
}
