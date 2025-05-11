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
    Tabs as MuiTabs,
    Tab,
    InputBase,
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
    Pagination
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
    Schedule as ScheduleIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from "@/Components/Layout/Layout.jsx";
import Card from '@/Components/Shared/Card';
import Button from '@/Components/Shared/Button';
import Badge from '@/Components/Shared/Badge';
import Tabs from '@/Components/Shared/Tabs';

// Modern application card component
const ApplicationCard = ({ application, navigate }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [starred, setStarred] = useState(false);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusColor = (status) => {
        if (!status || !status.slug) return '#999999';

        const statusColors = {
            'pending': theme.palette.warning.main,
            'in-review': theme.palette.primary.main,
            'shortlisted': theme.palette.info.main,
            'interview': theme.palette.info.dark,
            'offer': theme.palette.success.light,
            'hired': theme.palette.success.main,
            'rejected': theme.palette.error.main,
            'withdrawn': theme.palette.grey[500],
            'disqualified': theme.palette.grey[700]
        };

        return statusColors[status.slug] || theme.palette.grey[500];
    };

    const getStatusProgressValue = (status) => {
        if (!status || !status.slug) return 0;

        const statusProgress = {
            'pending': 10,
            'in-review': 30,
            'shortlisted': 50,
            'interview': 70,
            'offer': 90,
            'hired': 100,
            'rejected': 100,
            'withdrawn': 100,
            'disqualified': 100
        };

        return statusProgress[status.slug] || 0;
    };

    const getStatusIcon = (status) => {
        if (!status || !status.slug) return <MoreHorizIcon />;

        if (['hired'].includes(status.slug)) {
            return <CheckCircleIcon fontSize="small" />;
        } else if (['rejected', 'disqualified', 'withdrawn'].includes(status.slug)) {
            return <CancelIcon fontSize="small" />;
        } else {
            return <ScheduleIcon fontSize="small" />;
        }
    };

    const statusColor = getStatusColor(application.status);
    const progressValue = getStatusProgressValue(application.status);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '1rem',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    '&:hover': {
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                        transform: 'translateY(-4px)',
                        borderColor: 'rgba(20, 184, 166, 0.3)'
                    }
                }}
                className="transition-all duration-300"
            >
                {/* Status progress bar at top of card */}
                <LinearProgress
                    variant="determinate"
                    value={progressValue}
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        backgroundColor: 'rgba(0,0,0,0.05)',
                        '& .MuiLinearProgress-bar': {
                            backgroundColor: statusColor
                        }
                    }}
                />

                <Box sx={{ 
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
                    gap: 3
                }}>
                    <Box>
                        <Box sx={{ display: 'flex' }}>
                            <Avatar
                                src={application.job.company.logo}
                                alt={application.job.company.name}
                                variant="rounded"
                                sx={{
                                    width: 56,
                                    height: 56,
                                    bgcolor: 'rgba(20, 184, 166, 0.1)',
                                    color: 'primary.main',
                                    mr: 2.5,
                                    borderRadius: '0.75rem',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    p: 1
                                }}
                            >
                                {application.job.company.name ? application.job.company.name.charAt(0) : <BusinessIcon />}
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
                                            {application.job.title}
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
                                                {application.job.company.name}
                                            </Typography>

                                            {!isMobile && (
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: 'text.secondary',
                                                        display: 'flex',
                                                        alignItems: 'center'
                                                    }}
                                                >
                                                    <KeyboardArrowDownIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                                                    {application.job.location || 'Remote'}
                                                </Typography>
                                            )}
                                        </Stack>
                                    </Box>

                                    {!isMobile && (
                                        <IconButton
                                            size="small"
                                            onClick={() => setStarred(!starred)}
                                            sx={{ color: starred ? 'warning.main' : 'action.disabled' }}
                                        >
                                            {starred ? <StarIcon /> : <StarOutlineIcon />}
                                        </IconButton>
                                    )}
                                </Box>

                                <Box sx={{ mt: 1 }}>
                                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                                        <Chip
                                            size="small"
                                            label={application.status.name}
                                            icon={getStatusIcon(application.status)}
                                            sx={{
                                                backgroundColor: `${statusColor}15`,
                                                color: statusColor,
                                                fontWeight: 600,
                                                borderRadius: '0.5rem',
                                                border: '1px solid',
                                                borderColor: `${statusColor}30`,
                                                '& .MuiChip-icon': {
                                                    color: 'inherit'
                                                }
                                            }}
                                        />

                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: 'text.secondary',
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <AccessTimeIcon sx={{ mr: 0.5, fontSize: 14 }} />
                                            Dilamar {formatDate(application.created_at)}
                                        </Typography>
                                    </Stack>
                                </Box>

                                {application.current_stage && (
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                                            Tahap Saat Ini:
                                        </Typography>
                                        <Chip
                                            size="small"
                                            label={application.current_stage.name}
                                            sx={{
                                                backgroundColor: 'white',
                                                color: getStatusColor(application.current_stage),
                                                fontWeight: 500,
                                                borderRadius: '0.5rem',
                                                border: '1px solid',
                                                borderColor: `${getStatusColor(application.current_stage)}30`
                                            }}
                                        />
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    </Box>

                    <Box>
                        <Box sx={{
                            display: 'flex',
                            height: '100%',
                            flexDirection: { xs: 'row', md: 'column' },
                            justifyContent: { xs: 'space-between', md: 'flex-end' },
                            alignItems: { xs: 'center', md: 'flex-end' },
                            mt: { xs: 2, md: 0 }
                        }}>
                            {isMobile && (
                                <IconButton
                                    size="small"
                                    onClick={() => setStarred(!starred)}
                                    sx={{ color: starred ? 'warning.main' : 'action.disabled' }}
                                >
                                    {starred ? <StarIcon /> : <StarOutlineIcon />}
                                </IconButton>
                            )}

                            <Button
                                variant="contained"
                                color="primary"
                                endIcon={<ArrowForwardIcon />}
                                onClick={() => navigate(application.id)}
                                sx={{
                                    borderRadius: '0.75rem',
                                    py: 1.25,
                                    px: { xs: 2, md: 3 },
                                    fontWeight: 600,
                                    boxShadow: '0 4px 14px 0 rgba(20, 184, 166, 0.25)',
                                    '&:hover': {
                                        boxShadow: '0 6px 20px 0 rgba(20, 184, 166, 0.35)',
                                    },
                                    transition: 'all 0.3s ease'
                                }}
                                className="transition-all duration-300"
                            >
                                Lihat Detail
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </motion.div>
    );
};

// Empty state component
const EmptyState = ({ tabValue, navigateToJobs }) => {
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
                    <AssignmentIcon sx={{ fontSize: 48, color: 'primary.main', opacity: 0.8 }} />
                </Box>

                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }} className="text-gray-800">
                    {tabValue === 0 ? "Belum Ada Lamaran" : "Tidak ada lamaran dalam kategori ini"}
                </Typography>

                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, maxWidth: 500 }}>
                    {tabValue === 0
                        ? "Anda belum melamar pekerjaan apapun. Temukan lowongan yang sesuai dengan kualifikasi dan minat Anda."
                        : "Tidak ada lamaran yang sesuai dengan filter yang dipilih. Coba pilih kategori lain atau cari lowongan baru."}
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={navigateToJobs}
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
                    Cari Lowongan
                </Button>
            </Box>
        </Paper>
    );
};

// Modern tabs component
const ModernTabs = ({ value, onChange, tabs }) => {
    return (
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <MuiTabs
                value={value}
                onChange={onChange}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                sx={{
                    '& .MuiTab-root': {
                        minWidth: 'unset',
                        fontWeight: 500,
                        fontSize: '0.875rem',
                        textTransform: 'none',
                        px: 2,
                        py: 1.5,
                        mr: 2,
                        color: 'text.secondary',
                        '&.Mui-selected': {
                            color: 'primary.main',
                            fontWeight: 600
                        }
                    },
                    '& .MuiTabs-indicator': {
                        height: 3,
                        borderRadius: '3px 3px 0 0'
                    }
                }}
            >
                {tabs.map((tab, index) => (
                    <Tab key={index} label={tab.label} icon={tab.icon} iconPosition="start" />
                ))}
            </MuiTabs>
        </Box>
    );
};

// Main ApplicationsIndex component
export default function ApplicationsIndex({ applications, filters, filterOptions }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    const [tabValue, setTabValue] = useState(0);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [sortBy, setSortBy] = useState('newest');
    const [anchorEl, setAnchorEl] = useState(null);
    const [statusAnchorEl, setStatusAnchorEl] = useState(null);

    // Tab options with icons
    const tabOptions = [
        { label: "Semua", icon: <AssignmentIcon fontSize="small" /> },
        { label: "Aktif", icon: <ScheduleIcon fontSize="small" /> },
        { label: "Diterima", icon: <CheckCircleIcon fontSize="small" /> },
        { label: "Ditolak", icon: <CancelIcon fontSize="small" /> }
    ];

    const handleTabChange = (event, newValue) => {
        setLoading(true);
        setTabValue(newValue);

        // Simulate loading delay
        setTimeout(() => {
            setLoading(false);
        }, 500);
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleSortChange = (value) => {
        setSortBy(value);
        // Untuk implementasi filtering di server side
        let sort = 'created_at';
        let direction = 'desc';
        
        if (value === 'newest') {
            sort = 'created_at';
            direction = 'desc';
        } else if (value === 'oldest') {
            sort = 'created_at'; 
            direction = 'asc';
        } else if (value === 'company') {
            sort = 'company';
            direction = 'asc';
        }
        
        router.visit(route('candidate.applications.index', {
            search: searchTerm,
            status: filters?.status,
            sort: sort,
            direction: direction
        }), { preserveState: true });
        
        handleMenuClose();
    };

    const navigateToApplication = (id) => {
        router.visit(route('candidate.applications.show', id));
    };

    const navigateToJobs = () => {
        router.visit(route('candidate.jobs.index'));
    };

    // Filter applications based on active tab
    const getFilteredApplications = () => {
        if (!applications || !applications.data) {
            return [];
        }

        const appData = applications.data;

        // First apply tab filter
        let filtered = appData;
        if (tabValue === 1) {
            filtered = appData.filter(app =>
                !['rejected', 'disqualified', 'hired'].includes(app.status.slug)
            );
        } else if (tabValue === 2) {
            filtered = appData.filter(app =>
                ['hired'].includes(app.status.slug)
            );
        } else if (tabValue === 3) {
            filtered = appData.filter(app =>
                ['rejected', 'disqualified'].includes(app.status.slug)
            );
        }

        // Then apply search filter if there's a search term
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(app =>
                app.job.title.toLowerCase().includes(term) ||
                app.job.company.name.toLowerCase().includes(term)
            );
        }

        // Then apply sorting
        if (sortBy === 'newest') {
            filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        } else if (sortBy === 'oldest') {
            filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        } else if (sortBy === 'company') {
            filtered.sort((a, b) => a.job.company.name.localeCompare(b.job.company.name));
        }

        return filtered;
    };

    const filteredApplications = getFilteredApplications();

    // Menangani perubahan filter
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        // Untuk implementasi filtering di server side
        // router.visit(route('candidate.applications.index', {
        //     search: e.target.value,
        //     status: filters.status,
        //     sort: filters.sort,
        //     direction: filters.direction
        // }), { preserveState: true });
    };

    // Stats at the top
    const applicationStats = {
        total: applications?.data?.length || 0,
        active: applications?.data?.filter(app => !['rejected', 'disqualified', 'hired'].includes(app.status.slug))?.length || 0,
        accepted: applications?.data?.filter(app => ['hired'].includes(app.status.slug))?.length || 0,
        rejected: applications?.data?.filter(app => ['rejected', 'disqualified'].includes(app.status.slug))?.length || 0
    };

    // Handlers for status filter
    const handleStatusMenuClose = () => {
        setStatusAnchorEl(null);
    };

    const handleStatusChange = (statusId) => {
        // Untuk implementasi filtering di server side
        router.visit(route('candidate.applications.index', {
            search: searchTerm,
            status: statusId,
            sort: filters.sort,
            direction: filters.direction
        }), { preserveState: true });
        handleStatusMenuClose();
    };

    return (
        <Layout title="Lamaran Saya">
            <Head title="Lamaran Saya" />

            <Container
                maxWidth="lg"
                sx={{
                    py: { xs: 2, md: 4 }
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Page header with stats */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            flexDirection: { xs: 'column', md: 'row' },
                            mb: 4
                        }}
                    >
                        <Box>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 800,
                                    mb: 1,
                                    color: 'text.primary'
                                }}
                                className="text-gray-800"
                            >
                                Lamaran Saya
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Pantau dan kelola semua lamaran pekerjaan Anda
                            </Typography>
                        </Box>

                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddCircleOutlineIcon />}
                            onClick={navigateToJobs}
                            sx={{
                                mt: { xs: 2, md: 0 },
                                borderRadius: '0.75rem',
                                py: 1.25,
                                fontWeight: 600,
                                boxShadow: '0 4px 14px 0 rgba(20, 184, 166, 0.25)',
                                '&:hover': {
                                    boxShadow: '0 6px 20px 0 rgba(20, 184, 166, 0.35)'
                                }
                            }}
                            className="transition-all duration-300"
                        >
                            Cari Lowongan Baru
                        </Button>
                    </Box>

                    {/* Stats cards */}
                    <Box 
                        sx={{ 
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: 'repeat(2, 1fr)',
                                sm: 'repeat(4, 1fr)'
                            },
                            gap: 2,
                            mb: 4
                        }}
                    >
                        <Box>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2.5,
                                    borderRadius: '1rem',
                                    border: '1px solid',
                                    borderColor: tabValue === 0 ? 'rgba(20, 184, 166, 0.3)' : 'divider',
                                    backgroundColor: tabValue === 0 ? 'rgba(20, 184, 166, 0.05)' : 'white',
                                    transition: 'all 0.2s',
                                    cursor: 'pointer',
                                    height: '100%',
                                    '&:hover': {
                                        backgroundColor: 'rgba(20, 184, 166, 0.05)',
                                        borderColor: 'rgba(20, 184, 166, 0.3)',
                                    }
                                }}
                                onClick={(e) => handleTabChange(e, 0)}
                                className="transition-all duration-300"
                            >
                                <Typography variant="h4" fontWeight="bold" color={tabValue === 0 ? 'primary.main' : 'text.primary'}>
                                    {applicationStats.total}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Total Lamaran
                                </Typography>
                            </Paper>
                        </Box>

                        <Box>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2.5,
                                    borderRadius: '1rem',
                                    border: '1px solid',
                                    borderColor: tabValue === 1 ? 'rgba(20, 184, 166, 0.3)' : 'divider',
                                    backgroundColor: tabValue === 1 ? 'rgba(20, 184, 166, 0.05)' : 'white',
                                    transition: 'all 0.2s',
                                    cursor: 'pointer',
                                    height: '100%',
                                    '&:hover': {
                                        backgroundColor: 'rgba(20, 184, 166, 0.05)',
                                        borderColor: 'rgba(20, 184, 166, 0.3)',
                                    }
                                }}
                                onClick={(e) => handleTabChange(e, 1)}
                                className="transition-all duration-300"
                            >
                                <Typography variant="h4" fontWeight="bold" color={tabValue === 1 ? 'primary.main' : 'text.primary'}>
                                    {applicationStats.active}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Lamaran Aktif
                                </Typography>
                            </Paper>
                        </Box>

                        <Box>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2.5,
                                    borderRadius: '1rem',
                                    border: '1px solid',
                                    borderColor: tabValue === 2 ? 'rgba(20, 184, 166, 0.3)' : 'divider',
                                    backgroundColor: tabValue === 2 ? 'rgba(20, 184, 166, 0.05)' : 'white',
                                    transition: 'all 0.2s',
                                    cursor: 'pointer',
                                    height: '100%',
                                    '&:hover': {
                                        backgroundColor: 'rgba(20, 184, 166, 0.05)',
                                        borderColor: 'rgba(20, 184, 166, 0.3)',
                                    }
                                }}
                                onClick={(e) => handleTabChange(e, 2)}
                                className="transition-all duration-300"
                            >
                                <Typography variant="h4" fontWeight="bold" color={tabValue === 2 ? 'primary.main' : 'text.primary'}>
                                    {applicationStats.accepted}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Diterima
                                </Typography>
                            </Paper>
                        </Box>

                        <Box>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2.5,
                                    borderRadius: '1rem',
                                    border: '1px solid',
                                    borderColor: tabValue === 3 ? 'rgba(20, 184, 166, 0.3)' : 'divider',
                                    backgroundColor: tabValue === 3 ? 'rgba(20, 184, 166, 0.05)' : 'white',
                                    transition: 'all 0.2s',
                                    cursor: 'pointer',
                                    height: '100%',
                                    '&:hover': {
                                        backgroundColor: 'rgba(20, 184, 166, 0.05)',
                                        borderColor: 'rgba(20, 184, 166, 0.3)',
                                    }
                                }}
                                onClick={(e) => handleTabChange(e, 3)}
                                className="transition-all duration-300"
                            >
                                <Typography variant="h4" fontWeight="bold" color={tabValue === 3 ? 'primary.main' : 'text.primary'}>
                                    {applicationStats.rejected}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Ditolak
                                </Typography>
                            </Paper>
                        </Box>
                    </Box>

                    {/* Filters and search */}
                    <Paper
                        elevation={0}
                        sx={{
                            mb: 3,
                            p: 3,
                            borderRadius: '1rem',
                            border: '1px solid',
                            borderColor: 'divider',
                        }}
                    >
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexDirection: { xs: 'column', sm: 'row' },
                            gap: 2
                        }}>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                width: { xs: '100%', sm: 'auto' }
                            }}>
                                <ModernTabs
                                    value={tabValue}
                                    onChange={handleTabChange}
                                    tabs={tabOptions}
                                />
                            </Box>

                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                width: { xs: '100%', sm: 'auto' }
                            }}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        p: '4px 8px',
                                        borderRadius: '0.5rem',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        flex: 1,
                                        maxWidth: { xs: '100%', sm: 300 }
                                    }}
                                >
                                    <SearchIcon sx={{ color: 'action.active', mr: 1, fontSize: 20 }} />
                                    <InputBase
                                        placeholder="Cari lamaran..."
                                        value={searchTerm}
                                        onChange={handleSearch}
                                        sx={{ flex: 1, fontSize: '0.875rem' }}
                                    />
                                </Paper>

                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<SortIcon />}
                                    endIcon={<KeyboardArrowDownIcon />}
                                    onClick={handleMenuOpen}
                                    sx={{
                                        borderRadius: '0.5rem',
                                        textTransform: 'none',
                                        borderColor: 'divider',
                                        color: 'text.primary',
                                        px: 1.5,
                                        '&:hover': {
                                            borderColor: 'primary.main',
                                            backgroundColor: 'rgba(20, 184, 166, 0.05)'
                                        }
                                    }}
                                    className="whitespace-nowrap"
                                >
                                    {sortBy === 'newest' ? 'Terbaru' :
                                        sortBy === 'oldest' ? 'Terlama' :
                                            sortBy === 'company' ? 'Perusahaan' : 'Urutkan'}
                                </Button>

                                {/* Filter dropdown for status if available */}
                                {filterOptions && filterOptions.statuses && filterOptions.statuses.length > 0 && (
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<FilterAltIcon />}
                                        sx={{
                                            borderRadius: '0.5rem',
                                            textTransform: 'none',
                                            borderColor: 'divider',
                                            color: filters?.status ? 'primary.main' : 'text.primary',
                                            px: 1.5,
                                            '&:hover': {
                                                borderColor: 'primary.main',
                                                backgroundColor: 'rgba(20, 184, 166, 0.05)'
                                            },
                                            display: { xs: 'none', md: 'flex' }
                                        }}
                                        onClick={(e) => setStatusAnchorEl(e.currentTarget)}
                                    >
                                        Status
                                    </Button>
                                )}

                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleMenuClose}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
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
                                    <MenuItem onClick={() => handleSortChange('newest')}>
                                        Terbaru
                                        {sortBy === 'newest' && (
                                            <CheckCircleIcon
                                                fontSize="small"
                                                color="primary"
                                                sx={{ ml: 1 }}
                                            />
                                        )}
                                    </MenuItem>
                                    <MenuItem onClick={() => handleSortChange('oldest')}>
                                        Terlama
                                        {sortBy === 'oldest' && (
                                            <CheckCircleIcon
                                                fontSize="small"
                                                color="primary"
                                                sx={{ ml: 1 }}
                                            />
                                        )}
                                    </MenuItem>
                                    <MenuItem onClick={() => handleSortChange('company')}>
                                        Perusahaan
                                        {sortBy === 'company' && (
                                            <CheckCircleIcon
                                                fontSize="small"
                                                color="primary"
                                                sx={{ ml: 1 }}
                                            />
                                        )}
                                    </MenuItem>
                                </Menu>

                                {/* Status Filter Menu */}
                                <Menu
                                    anchorEl={statusAnchorEl}
                                    open={Boolean(statusAnchorEl)}
                                    onClose={handleStatusMenuClose}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
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
                                    <MenuItem onClick={() => handleStatusChange(null)}>
                                        Semua Status
                                        {!filters?.status && (
                                            <CheckCircleIcon
                                                fontSize="small"
                                                color="primary"
                                                sx={{ ml: 1 }}
                                            />
                                        )}
                                    </MenuItem>
                                    
                                    {filterOptions?.statuses?.map(status => (
                                        <MenuItem 
                                            key={status.id} 
                                            onClick={() => handleStatusChange(status.id)}
                                        >
                                            {status.name}
                                            {filters?.status == status.id && (
                                                <CheckCircleIcon
                                                    fontSize="small"
                                                    color="primary"
                                                    sx={{ ml: 1 }}
                                                />
                                            )}
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </Box>
                        </Box>
                    </Paper>

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
                            {/* Empty state */}
                            {filteredApplications.length === 0 ? (
                                <EmptyState
                                    tabValue={tabValue}
                                    navigateToJobs={navigateToJobs}
                                />
                            ) : (
                                /* Applications list */
                                <AnimatePresence>
                                    <Stack spacing={2.5}>
                                        {filteredApplications.map(application => (
                                            <ApplicationCard
                                                key={application.id}
                                                application={application}
                                                navigate={navigateToApplication}
                                            />
                                        ))}
                                    </Stack>
                                </AnimatePresence>
                            )}
                        </>
                    )}

                    {/* Pagination placeholder */}
                    {filteredApplications.length > 0 && applications.meta?.last_page > 1 && (
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mt: 4
                        }}>
                            <Pagination
                                count={applications.meta.last_page}
                                page={applications.meta.current_page}
                                shape="rounded"
                                color="primary"
                                size="large"
                                onChange={(e, page) => {
                                    router.visit(route('candidate.applications.index', {
                                        page: page,
                                        search: searchTerm,
                                        status: filters?.status,
                                        sort: filters?.sort,
                                        direction: filters?.direction
                                    }), { preserveState: true });
                                }}
                                sx={{
                                    '& .MuiPaginationItem-root': {
                                        borderRadius: '0.5rem',
                                        mx: 0.5
                                    }
                                }}
                            />
                        </Box>
                    )}
                </motion.div>
            </Container>
        </Layout>
    );
}
