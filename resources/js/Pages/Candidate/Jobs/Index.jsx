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
    BusinessCenter,
    AddCircleOutline as AddCircleOutlineIcon,
    Search as SearchIcon,
    FilterList as FilterListIcon,
    CheckCircle as CheckCircleIcon,
    Sort as SortIcon,
    KeyboardArrowDown as KeyboardArrowDownIcon,
    AccessTime as AccessTimeIcon,
    Work as WorkIcon,
    LocationOn,
    AttachMoney,
    CalendarToday,
    ArrowForward as ArrowForwardIcon,
    StarOutline as StarOutlineIcon,
    Business as BusinessIcon,
    WorkOutline,
    Assignment as AssignmentIcon,
    MonetizationOn as MonetizationOnIcon,
    EventAvailable as EventAvailableIcon,
    NotificationsActive as NotificationsActiveIcon,
    Paid as PaidIcon,
    Schedule as ScheduleIcon,
    Badge as BadgeIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from "@/Components/Layout/Layout.jsx";
import Button from '@/Components/Shared/Button';

// Job Card Component
const JobCard = ({ job }) => {
    const theme = useTheme();
    const [starred, setStarred] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

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

    const formatSalary = (salary) => {
        if (!salary) return null;

        if (salary >= 1000000000000) {
            return `${(salary / 1000000000000).toFixed(salary % 1000000000000 === 0 ? 0 : 1)} T`;
        }
        else if (salary >= 1000000000) {
            return `${(salary / 1000000000).toFixed(salary % 1000000000 === 0 ? 0 : 1)} M`;
        }
        else if (salary >= 1000000) {
            return `${(salary / 1000000).toFixed(salary % 1000000 === 0 ? 0 : 1)} Jt`;
        } else if (salary >= 10000) {
            return `${(salary / 1000).toFixed(salary % 1000 === 0 ? 0 : 1)} Rb` + (salary % 1000 === 0 ? '' : `.${salary % 1000}`)
        } else if (salary >= 1000) {
            return `${Math.floor(salary / 1000)} Rb`;
        } else {
            return salary.toString();
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

    // Toggle star
    const handleToggleStar = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setStarred(!starred);
        // Here you would typically call an API to save the star status
    };

    // Format salary range for display
    const getSalaryDisplay = () => {
        if (job?.salary_min && job?.salary_max) {
            return `${formatSalary(job.salary_min)} - ${formatSalary(job.salary_max)}`;
        } else if (job?.salary_min) {
            return `${formatSalary(job.salary_min)}+`;
        } else if (job?.salary_max) {
            return `Hingga ${formatSalary(job.salary_max)}`;
        } else {
            return "Gaji tidak ditampilkan";
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{ height: '100%' }}
        >
            <Card
                variant="outlined"
                sx={{
                    height: '100%',
                    borderRadius: 2,
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    borderWidth: 1,
                    borderColor: isHovered
                        ? alpha(theme.palette.primary.main, 0.5)
                        : alpha(theme.palette.divider, 0.7),
                    '&:hover': {
                        boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.08)}`,
                        borderColor: alpha(theme.palette.primary.main, 0.5),
                    },
                    display: 'flex',
                    flexDirection: 'column',
                    background: '#ffffff',
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Status indicator at top of card */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: getStatusColor(job?.status),
                    }}
                />

                <CardContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column', '&:last-child': { pb: 0 } }}>
                    {/* Header with company logo and job title */}
                    <Box sx={{ display: 'flex', p: 3, pb: 2 }}>
                        <Avatar
                            src={job?.company?.logo}
                            alt={job?.company?.name}
                            variant="rounded"
                            sx={{
                                width: 52,
                                height: 52,
                                mr: 2,
                                borderRadius: 1.5,
                                bgcolor: alpha(theme.palette.primary.main, 0.08),
                                border: '1px solid',
                                borderColor: alpha(theme.palette.divider, 0.5),
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
                                            fontWeight: 600,
                                            fontSize: '1.05rem',
                                            mb: 0.5,
                                            transition: 'all 0.2s',
                                            display: '-webkit-box',
                                            overflow: 'hidden',
                                            WebkitBoxOrient: 'vertical',
                                            WebkitLineClamp: 2,
                                        }}
                                    >
                                        {job?.title}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            color: theme.palette.grey[600],
                                            fontWeight: 500,
                                            mb: 0.5
                                        }}
                                    >
                                        <BusinessIcon fontSize="small" sx={{ mr: 0.5, fontSize: 16 }} />
                                        {job?.company?.name}
                                    </Typography>
                                </Box>

                                <Chip
                                    label={getStatusLabel(job?.status)}
                                    size="small"
                                    sx={{
                                        ml: 1,
                                        height: 24,
                                        fontSize: '0.7rem',
                                        fontWeight: 600,
                                        borderRadius: '4px',
                                        backgroundColor: alpha(getStatusColor(job?.status), 0.12),
                                        color: getStatusColor(job?.status),
                                        border: '1px solid',
                                        borderColor: alpha(getStatusColor(job?.status), 0.3),
                                    }}
                                />
                            </Box>
                        </Box>
                    </Box>

                    {/* Key details section */}
                    <Box sx={{ px: 3, mb: 2 }}>
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5 }}>
                            {/* Location */}
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <LocationOn sx={{
                                    color: theme.palette.grey[500],
                                    mr: 0.75,
                                    fontSize: 18
                                }} />
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 400 }}>
                                    {job?.location || 'Lokasi tidak tersedia'}
                                </Typography>
                            </Box>

                            {/* Experience */}
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <WorkIcon sx={{
                                    color: theme.palette.grey[500],
                                    mr: 0.75,
                                    fontSize: 18
                                }} />
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 400 }}>
                                    {job?.experience_level || 'Semua level'}
                                </Typography>
                            </Box>

                            {/* Type */}
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <BadgeIcon sx={{
                                    color: theme.palette.grey[500],
                                    mr: 0.75,
                                    fontSize: 18
                                }} />
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 400 }}>
                                    {job?.job_type || 'Tipe tidak tersedia'}
                                </Typography>
                            </Box>

                            {/* Deadline */}
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <ScheduleIcon sx={{
                                    color: isDeadlineNear() ? theme.palette.error.main : theme.palette.grey[500],
                                    mr: 0.75,
                                    fontSize: 18
                                }} />
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontWeight: isDeadlineNear() ? 600 : 400,
                                        color: isDeadlineNear() ? theme.palette.error.main : 'text.secondary'
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
                        </Box>
                    </Box>

                    {/* Salary & Description */}
                    <Box sx={{ px: 3, mb: 'auto' }}>
                        {/* Salary */}
                        <Box sx={{ mb: 1.5 }}>
                            <Typography
                                variant="body2"
                                sx={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    py: 0.5,
                                    px: 1.5,
                                    borderRadius: 1,
                                    fontWeight: 600,
                                    bgcolor: alpha(theme.palette.success.main, 0.08),
                                    color: theme.palette.success.dark,
                                    border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                                }}
                            >
                                <MonetizationOnIcon fontSize="small" sx={{ mr: 0.5, fontSize: 16 }} />
                                {getSalaryDisplay()}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Card Footer with action button */}
                    <Box sx={{ p: 3, pt: 2, mt: 'auto' }}>
                        <Divider sx={{ mb: 2, borderColor: alpha(theme.palette.divider, 0.5) }} />

                        <Link href={route('candidate.jobs.show', job?.id)} style={{ textDecoration: 'none' }}>
                            <Button
                                variant="contained"
                                size="medium"
                                fullWidth
                                endIcon={<ArrowForwardIcon />}
                                sx={{
                                    borderRadius: 1.5,
                                    py: 1,
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    boxShadow: 'none',
                                    '&:hover': {
                                        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.25)}`,
                                    },
                                    bgcolor: job?.has_applied
                                        ? alpha(theme.palette.primary.main, 0.8)
                                        : theme.palette.primary.main,
                                }}
                                disabled={job?.status === 'expired' || job?.status === 'closed'}
                            >
                                {job?.has_applied ? 'Sudah Dilamar' : 'Lihat Detail'}
                            </Button>
                        </Link>
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
                                                            sm: 'repeat(1, 1fr)',
                                                            md: 'repeat(2, 1fr)'
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
