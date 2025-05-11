import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Box, Typography, Paper, Chip, Button, Divider,
    Card, CardContent, Avatar, IconButton, Tab, Tabs, Grid,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TablePagination, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Container, Stack, Tooltip, alpha, useTheme, LinearProgress, useMediaQuery
} from '@mui/material';
import {
    LocationOn, WorkOutline, Timer, AttachMoney, School,
    Edit as EditIcon, Delete as DeleteIcon, Download as DownloadIcon,
    Check as CheckIcon, Close as CloseIcon, CalendarToday, Circle,
    Assignment as AssignmentIcon, People as PeopleIcon,
    Visibility as VisibilityIcon, ArrowBack as ArrowBackIcon,
    BusinessCenter as BusinessCenterIcon,
    Star as StarIcon,
    MoreVert as MoreVertIcon,
    Send as SendIcon
} from '@mui/icons-material';
import moment from 'moment';
import 'moment/locale/id';
import MDEditor from '@uiw/react-md-editor';
import { motion, AnimatePresence } from 'framer-motion';

import Layout from '@/Components/Layout/Layout';

moment.locale('id');

export default function Show({ job }) {
    const { auth } = usePage().props;
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [tabValue, setTabValue] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleOpenDialog = (application) => {
        setSelectedApplication(application);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const getStatusColor = (status) => {
        if (!status) return theme.palette.grey[500];

        const statusLower = status.toLowerCase();

        switch (statusLower) {
            case 'active':
                return theme.palette.success.main;
            case 'draft':
                return theme.palette.warning.main;
            case 'closed':
            case 'expired':
                return theme.palette.error.main;
            default:
                return theme.palette.grey[500];
        }
    };

    const getApplicationStatusColor = (status) => {
        if (!status) return 'default';

        const statusLower = status.toLowerCase();

        switch (statusLower) {
            case 'pending':
                return 'warning';
            case 'reviewed':
                return 'info';
            case 'accepted':
                return 'success';
            case 'rejected':
                return 'error';
            default:
                return 'default';
        }
    };

    const getApplicationStatusText = (status) => {
        if (!status) return 'Tidak diketahui';

        const statusLower = status.toLowerCase();

        switch (statusLower) {
            case 'pending':
                return 'Menunggu Review';
            case 'reviewed':
                return 'Sudah Direview';
            case 'accepted':
                return 'Diterima';
            case 'rejected':
                return 'Ditolak';
            default:
                return status;
        }
    };

    const formatSalary = (min, max) => {
        const formatNumber = (num) => {
            return new Intl.NumberFormat('id-ID').format(num);
        };

        if (min && max) {
            return `Rp ${formatNumber(min)} - Rp ${formatNumber(max)}`;
        } else if (min) {
            return `Rp ${formatNumber(min)}`;
        } else if (max) {
            return `Hingga Rp ${formatNumber(max)}`;
        } else {
            return 'Gaji tidak ditampilkan';
        }
    };

    const getExperienceLevelText = (level) => {
        if (!level) return 'Tidak ditentukan';

        switch (level) {
            case 'entry':
                return 'Entry Level (0-2 tahun)';
            case 'mid':
                return 'Mid Level (2-5 tahun)';
            case 'senior':
                return 'Senior Level (5+ tahun)';
            case 'executive':
                return 'Executive (10+ tahun)';
            default:
                return level;
        }
    };

    const getJobTypeText = (type) => {
        if (!type) return 'Tidak ditentukan';

        switch (type) {
            case 'full_time':
                return 'Full Time';
            case 'part_time':
                return 'Part Time';
            case 'contract':
                return 'Kontrak';
            case 'internship':
                return 'Magang';
            case 'freelance':
                return 'Freelance';
            default:
                return type;
        }
    };

    // Helper function untuk format tanggal yang aman
    const formatDate = (date, format = 'DD MMMM YYYY') => {
        if (!date) return '';

        try {
            // Pastikan menggunakan format ISO atau parsing yang benar
            const momentDate = moment(date, [moment.ISO_8601, 'YYYY-MM-DD']);
            if (momentDate.isValid()) {
                return momentDate.format(format);
            }
            return '';
        } catch (error) {
            console.error('Error formatting date:', error);
            return '';
        }
    };

    // Get remaining days as integer
    const getRemainingDays = () => {
        if (!job?.submission_deadline) return 0;

        const deadlineDate = new Date(job.submission_deadline);
        const today = new Date();

        if (deadlineDate < today) return 0;

        const diffTime = deadlineDate - today;
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        return Math.floor(diffDays);
    };

    const remainingDays = getRemainingDays();
    const isDeadlineNear = remainingDays > 0 && remainingDays <= 3;

    return (
        <Layout>
            <Head title={`${job.title} - Detail Lowongan`} />

            <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Back button */}
                    <Box sx={{ mb: 2 }}>
                        <Button
                            component={Link}
                            href={route('manager.jobs.index')}
                            startIcon={<ArrowBackIcon />}
                            sx={{
                                color: 'text.secondary',
                                fontWeight: 500,
                                '&:hover': {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                                },
                                borderRadius: '0.75rem',
                            }}
                        >
                            Kembali ke Daftar Lowongan
                        </Button>
                    </Box>

                    {/* Header Section with Enhanced UI */}
                    <Paper
                        elevation={0}
                        sx={{
                            mb: 3,
                            p: 3,
                            borderRadius: '1rem',
                            border: '1px solid',
                            borderColor: 'divider',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Status progress bar at top of card */}
                        <LinearProgress
                            variant="determinate"
                            value={job?.status === 'active' ? 100 : 0}
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: 4,
                                backgroundColor: 'rgba(0,0,0,0.05)',
                                '& .MuiLinearProgress-bar': {
                                    backgroundColor: getStatusColor(job?.status)
                                }
                            }}
                        />

                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', md: 'row' },
                                justifyContent: 'space-between',
                                alignItems: { xs: 'flex-start', md: 'flex-start' },
                                gap: 2,
                                mt: 1
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                <Avatar
                                    src={job?.company?.logo}
                                    alt={job?.company?.name}
                                    variant="rounded"
                                    sx={{
                                        width: 64,
                                        height: 64,
                                        mr: 2.5,
                                        borderRadius: '0.75rem',
                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        p: 1
                                    }}
                                >
                                    {!job?.company?.logo && job?.company?.name?.charAt(0)}
                                </Avatar>

                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography
                                            variant="h4"
                                            component="h1"
                                            sx={{
                                                fontWeight: 700,
                                                color: 'text.primary',
                                                lineHeight: 1.2,
                                                mb: 1
                                            }}
                                            className="text-gray-800"
                                        >
                                            {job.title}
                                        </Typography>

                                        <Chip
                                            label={job.status || 'Active'}
                                            size="small"
                                            sx={{
                                                height: 24,
                                                fontWeight: 600,
                                                bgcolor: alpha(getStatusColor(job.status), 0.1),
                                                color: getStatusColor(job.status),
                                                fontSize: '0.7rem',
                                                borderRadius: '0.5rem',
                                                border: '1px solid',
                                                borderColor: `${getStatusColor(job.status)}30`
                                            }}
                                        />
                                    </Box>

                                    <Typography
                                        variant="body1"
                                        sx={{
                                            color: 'primary.main',
                                            fontWeight: 500,
                                            display: 'flex',
                                            alignItems: 'center',
                                            mb: 1
                                        }}
                                    >
                                        <BusinessCenterIcon fontSize="small" sx={{ mr: 0.5 }} />
                                        {job.company?.name}
                                    </Typography>

                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 2 }}>
                                        {job?.job_type && (
                                            <Chip
                                                icon={<WorkOutline fontSize="small" />}
                                                label={getJobTypeText(job.job_type)}
                                                size="small"
                                                variant="outlined"
                                                sx={{ borderRadius: '0.75rem' }}
                                            />
                                        )}
                                        {job?.location && (
                                            <Chip
                                                icon={<LocationOn fontSize="small" />}
                                                label={job.location}
                                                size="small"
                                                variant="outlined"
                                                sx={{ borderRadius: '0.75rem' }}
                                            />
                                        )}
                                        {job?.experience_level && (
                                            <Chip
                                                icon={<AssignmentIcon fontSize="small" />}
                                                label={getExperienceLevelText(job.experience_level)}
                                                size="small"
                                                variant="outlined"
                                                sx={{ borderRadius: '0.75rem' }}
                                            />
                                        )}
                                    </Box>
                                </Box>
                            </Box>

                            <Stack
                                direction={{ xs: 'row', md: 'row' }}
                                spacing={1}
                                sx={{ mt: { xs: 2, md: 0 } }}
                            >
                                <Tooltip title="Edit Lowongan">
                                    <Button
                                        component={Link}
                                        href={route('manager.jobs.edit', job.id)}
                                        variant="outlined"
                                        color="primary"
                                        startIcon={<EditIcon />}
                                        sx={{
                                            borderRadius: '0.75rem',
                                            '&:hover': {
                                                borderColor: 'primary.main',
                                                backgroundColor: alpha(theme.palette.primary.main, 0.05)
                                            }
                                        }}
                                    >
                                        Edit
                                    </Button>
                                </Tooltip>

                                <Tooltip title="Hapus Lowongan">
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        startIcon={<DeleteIcon />}
                                        onClick={() => {
                                            if (confirm('Apakah Anda yakin ingin menghapus lowongan ini?')) {
                                                window.location.href = route('manager.jobs.destroy', job.id);
                                            }
                                        }}
                                        sx={{
                                            borderRadius: '0.75rem',
                                            '&:hover': {
                                                borderColor: 'error.main',
                                                backgroundColor: alpha(theme.palette.error.main, 0.05)
                                            }
                                        }}
                                    >
                                        Hapus
                                    </Button>
                                </Tooltip>
                            </Stack>
                        </Box>
                    </Paper>

                    {/* Enhanced Tabs Navigation */}
                    <Box sx={{
                        mb: 3,
                        bgcolor: 'background.paper',
                        borderRadius: '1rem',
                        border: '1px solid',
                        borderColor: 'divider',
                        overflow: 'hidden'
                    }}>
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            variant="fullWidth"
                            sx={{
                                '& .MuiTab-root': {
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    minHeight: 56,
                                    fontSize: '0.95rem'
                                },
                                '& .MuiTabs-indicator': {
                                    height: 3,
                                    borderRadius: '3px 3px 0 0'
                                }
                            }}
                        >
                            <Tab
                                label="Detail Lowongan"
                                icon={<BusinessCenterIcon />}
                                iconPosition="start"
                            />
                            <Tab
                                label={`Pelamar (${job.applications?.length || 0})`}
                                icon={<PeopleIcon />}
                                iconPosition="start"
                            />
                        </Tabs>
                    </Box>

                    {/* Tab Panels */}
                    <AnimatePresence mode="wait">
                        {tabValue === 0 && (
                            <motion.div
                                key="detail-tab"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Box sx={{
                                    display: 'grid',
                                    gridTemplateColumns: { xs: '1fr', md: '8fr 4fr' },
                                    gap: 3
                                }}>
                                    <Box>
                                        {/* Deskripsi & Persyaratan Lowongan */}
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: { xs: 3, md: 4 },
                                                mb: 3,
                                                borderRadius: '1rem',
                                                border: '1px solid',
                                                borderColor: 'divider'
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    mb: 3,
                                                }}
                                            >
                                                <Typography
                                                    variant="h5"
                                                    sx={{
                                                        fontWeight: 700,
                                                        color: 'text.primary'
                                                    }}
                                                    className="text-gray-800"
                                                >
                                                    Deskripsi Pekerjaan
                                                </Typography>
                                            </Box>

                                            <Box
                                                data-color-mode="light"
                                                sx={{
                                                    '& p': {
                                                        fontSize: '1rem',
                                                        lineHeight: 1.7,
                                                        color: 'text.secondary'
                                                    },
                                                    '& ul, & ol': {
                                                        pl: 3
                                                    },
                                                    '& li': {
                                                        mb: 1,
                                                        color: 'text.secondary'
                                                    }
                                                }}
                                            >
                                                <MDEditor.Markdown source={job.description || 'Tidak ada deskripsi pekerjaan'} />
                                            </Box>

                                            <Divider sx={{ my: 4 }} />

                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    mb: 3,
                                                }}
                                            >
                                                <Typography
                                                    variant="h5"
                                                    sx={{
                                                        fontWeight: 700,
                                                        color: 'text.primary'
                                                    }}
                                                    className="text-gray-800"
                                                >
                                                    Persyaratan
                                                </Typography>
                                            </Box>

                                            <Box
                                                data-color-mode="light"
                                                sx={{
                                                    '& p': {
                                                        fontSize: '1rem',
                                                        lineHeight: 1.7,
                                                        color: 'text.secondary'
                                                    },
                                                    '& ul, & ol': {
                                                        pl: 3
                                                    },
                                                    '& li': {
                                                        mb: 1,
                                                        color: 'text.secondary'
                                                    }
                                                }}
                                            >
                                                <MDEditor.Markdown source={job.requirements || 'Tidak ada persyaratan khusus'} />
                                            </Box>
                                        </Paper>
                                    </Box>

                                    <Box>
                                        {/* Informasi Lowongan Card */}
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                mb: 3,
                                                borderRadius: '1rem',
                                                border: '1px solid',
                                                borderColor: 'divider',
                                                overflow: 'hidden'
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                                                    py: 2,
                                                    px: 3,
                                                    borderBottom: '1px solid',
                                                    borderColor: 'divider'
                                                }}
                                            >
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        fontWeight: 700,
                                                        color: 'text.primary'
                                                    }}
                                                    className="text-gray-800"
                                                >
                                                    Informasi Lowongan
                                                </Typography>
                                            </Box>

                                            <Box sx={{ p: 3 }}>
                                                <Stack spacing={3}>
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'flex-start',
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                                borderRadius: '0.75rem',
                                                                p: 1,
                                                                mr: 2,
                                                                minWidth: 40,
                                                                minHeight: 40
                                                            }}
                                                        >
                                                            <LocationOn color="primary" />
                                                        </Box>
                                                        <Box>
                                                            <Typography
                                                                variant="body2"
                                                                color="text.secondary"
                                                                sx={{ mb: 0.5 }}
                                                            >
                                                                Lokasi
                                                            </Typography>
                                                            <Typography variant="body1" fontWeight="medium">
                                                                {job.location || 'Lokasi tidak ditentukan'}
                                                            </Typography>
                                                        </Box>
                                                    </Box>

                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'flex-start',
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                                borderRadius: '0.75rem',
                                                                p: 1,
                                                                mr: 2,
                                                                minWidth: 40,
                                                                minHeight: 40
                                                            }}
                                                        >
                                                            <WorkOutline color="primary" />
                                                        </Box>
                                                        <Box>
                                                            <Typography
                                                                variant="body2"
                                                                color="text.secondary"
                                                                sx={{ mb: 0.5 }}
                                                            >
                                                                Tipe Pekerjaan
                                                            </Typography>
                                                            <Typography variant="body1" fontWeight="medium">
                                                                {getJobTypeText(job.job_type)}
                                                            </Typography>
                                                        </Box>
                                                    </Box>

                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'flex-start',
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                                borderRadius: '0.75rem',
                                                                p: 1,
                                                                mr: 2,
                                                                minWidth: 40,
                                                                minHeight: 40
                                                            }}
                                                        >
                                                            <School color="primary" />
                                                        </Box>
                                                        <Box>
                                                            <Typography
                                                                variant="body2"
                                                                color="text.secondary"
                                                                sx={{ mb: 0.5 }}
                                                            >
                                                                Level Pengalaman
                                                            </Typography>
                                                            <Typography variant="body1" fontWeight="medium">
                                                                {getExperienceLevelText(job.experience_level)}
                                                            </Typography>
                                                        </Box>
                                                    </Box>

                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'flex-start',
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                bgcolor: alpha(theme.palette.success.main, 0.1),
                                                                borderRadius: '0.75rem',
                                                                p: 1,
                                                                mr: 2,
                                                                minWidth: 40,
                                                                minHeight: 40
                                                            }}
                                                        >
                                                            <AttachMoney sx={{ color: 'success.main' }} />
                                                        </Box>
                                                        <Box>
                                                            <Typography
                                                                variant="body2"
                                                                color="text.secondary"
                                                                sx={{ mb: 0.5 }}
                                                            >
                                                                Gaji
                                                            </Typography>
                                                            <Typography variant="body1" fontWeight="medium" sx={{ color: 'success.main' }}>
                                                                {formatSalary(job.salary_min, job.salary_max)}
                                                            </Typography>
                                                        </Box>
                                                    </Box>

                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'flex-start',
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                bgcolor: alpha(
                                                                    isDeadlineNear ? theme.palette.error.main : theme.palette.primary.main,
                                                                    0.1
                                                                ),
                                                                borderRadius: '0.75rem',
                                                                p: 1,
                                                                mr: 2,
                                                                minWidth: 40,
                                                                minHeight: 40
                                                            }}
                                                        >
                                                            <CalendarToday sx={{
                                                                color: isDeadlineNear ? 'error.main' : 'primary.main'
                                                            }} />
                                                        </Box>
                                                        <Box>
                                                            <Typography
                                                                variant="body2"
                                                                color="text.secondary"
                                                                sx={{ mb: 0.5 }}
                                                            >
                                                                Batas Pendaftaran
                                                            </Typography>
                                                            <Typography
                                                                variant="body1"
                                                                fontWeight="medium"
                                                                sx={{
                                                                    color: isDeadlineNear ? 'error.main' : 'text.primary'
                                                                }}
                                                            >
                                                                {job.submission_deadline
                                                                    ? `${remainingDays} hari lagi (${formatDate(job.submission_deadline)})`
                                                                    : 'Tidak ada batas waktu'}
                                                            </Typography>
                                                        </Box>
                                                    </Box>

                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'flex-start',
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                                borderRadius: '0.75rem',
                                                                p: 1,
                                                                mr: 2,
                                                                minWidth: 40,
                                                                minHeight: 40
                                                            }}
                                                        >
                                                            <Timer color="primary" />
                                                        </Box>
                                                        <Box>
                                                            <Typography
                                                                variant="body2"
                                                                color="text.secondary"
                                                                sx={{ mb: 0.5 }}
                                                            >
                                                                Dibuat
                                                            </Typography>
                                                            <Typography variant="body1" fontWeight="medium">
                                                                {job.created_at ? formatDate(job.created_at, 'DD MMMM YYYY') : 'Tidak diketahui'}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </Stack>
                                            </Box>
                                        </Paper>

                                        {/* Skills Card */}
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                mb: 3,
                                                borderRadius: '1rem',
                                                border: '1px solid',
                                                borderColor: 'divider',
                                                overflow: 'hidden'
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                                                    py: 2,
                                                    px: 3,
                                                    borderBottom: '1px solid',
                                                    borderColor: 'divider'
                                                }}
                                            >
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        fontWeight: 700,
                                                        color: 'text.primary'
                                                    }}
                                                    className="text-gray-800"
                                                >
                                                    Skills & Kemampuan
                                                </Typography>
                                            </Box>

                                            <Box sx={{ p: 3 }}>
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                    {job.skills && job.skills.length > 0 ? (
                                                        job.skills.map((skill, index) => (
                                                            <Chip
                                                                key={index}
                                                                label={skill}
                                                                color="primary"
                                                                variant="outlined"
                                                                sx={{
                                                                    borderRadius: '0.75rem',
                                                                    fontWeight: 500,
                                                                    '&:hover': {
                                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                                                    },
                                                                    transition: 'all 0.3s ease'
                                                                }}
                                                                className="transition-all duration-300"
                                                            />
                                                        ))
                                                    ) : (
                                                        <Typography variant="body2" color="text.secondary">
                                                            Tidak ada skills yang ditentukan
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </Box>
                                        </Paper>

                                        {/* Statistik Card */}
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                borderRadius: '1rem',
                                                border: '1px solid',
                                                borderColor: 'divider',
                                                overflow: 'hidden'
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                                                    py: 2,
                                                    px: 3,
                                                    borderBottom: '1px solid',
                                                    borderColor: 'divider'
                                                }}
                                            >
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        fontWeight: 700,
                                                        color: 'text.primary'
                                                    }}
                                                    className="text-gray-800"
                                                >
                                                    Statistik
                                                </Typography>
                                            </Box>

                                            <Box sx={{ p: 3 }}>
                                                <Box sx={{
                                                    display: 'grid',
                                                    gridTemplateColumns: '1fr 1fr',
                                                    gap: 2
                                                }}>
                                                    <Paper
                                                        elevation={0}
                                                        sx={{
                                                            height: '100%',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            p: 2,
                                                            borderRadius: '0.75rem',
                                                            border: '1px solid',
                                                            borderColor: 'divider',
                                                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                                                            '&:hover': {
                                                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                                                transform: 'translateY(-4px)'
                                                            },
                                                            transition: 'all 0.3s ease'
                                                        }}
                                                        className="transition-all duration-300"
                                                    >
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                                borderRadius: '50%',
                                                                p: 1.5,
                                                                mb: 1
                                                            }}
                                                        >
                                                            <PeopleIcon color="primary" />
                                                        </Box>
                                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                                            Total Pelamar
                                                        </Typography>
                                                        <Typography
                                                            variant="h4"
                                                            sx={{ fontWeight: 700, color: 'primary.main' }}
                                                            className="text-primary-600"
                                                        >
                                                            {job.applications?.length || 0}
                                                        </Typography>
                                                    </Paper>
                                                    <Paper
                                                        elevation={0}
                                                        sx={{
                                                            height: '100%',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            p: 2,
                                                            borderRadius: '0.75rem',
                                                            border: '1px solid',
                                                            borderColor: 'divider',
                                                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                                                            '&:hover': {
                                                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                                                transform: 'translateY(-4px)'
                                                            },
                                                            transition: 'all 0.3s ease'
                                                        }}
                                                        className="transition-all duration-300"
                                                    >
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                                borderRadius: '50%',
                                                                p: 1.5,
                                                                mb: 1
                                                            }}
                                                        >
                                                            <VisibilityIcon color="primary" />
                                                        </Box>
                                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                                            View
                                                        </Typography>
                                                        <Typography
                                                            variant="h4"
                                                            sx={{ fontWeight: 700, color: 'primary.main' }}
                                                            className="text-primary-600"
                                                        >
                                                            {job.view_count || 0}
                                                        </Typography>
                                                    </Paper>
                                                </Box>
                                            </Box>
                                        </Paper>
                                    </Box>
                                </Box>
                            </motion.div>
                        )}

                        {tabValue === 1 && (
                            <motion.div
                                key="applicants-tab"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Paper
                                    elevation={0}
                                    sx={{
                                        width: '100%',
                                        mb: 2,
                                        overflow: 'hidden',
                                        borderRadius: '1rem',
                                        border: '1px solid',
                                        borderColor: 'divider'
                                    }}
                                >
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                                                    <TableCell sx={{ fontWeight: 600, py: 2 }}>Pelamar</TableCell>
                                                    <TableCell sx={{ fontWeight: 600, py: 2 }}>Email</TableCell>
                                                    <TableCell sx={{ fontWeight: 600, py: 2 }}>Status</TableCell>
                                                    <TableCell sx={{ fontWeight: 600, py: 2 }}>Tahap</TableCell>
                                                    <TableCell sx={{ fontWeight: 600, py: 2 }}>Tanggal Melamar</TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 600, py: 2 }}>Aksi</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {job.applications && job.applications.length > 0 ? (
                                                    job.applications
                                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                        .map((application) => (
                                                            <TableRow
                                                                key={application.id}
                                                                hover
                                                                sx={{
                                                                    '&:hover': {
                                                                        bgcolor: alpha(theme.palette.primary.main, 0.03)
                                                                    },
                                                                    cursor: 'pointer',
                                                                    transition: 'all 0.2s ease'
                                                                }}
                                                                onClick={() => handleOpenDialog(application)}
                                                                className="transition-all duration-200"
                                                            >
                                                                <TableCell sx={{ py: 1.5 }}>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                        <Avatar
                                                                            src={application.user?.avatar}
                                                                            alt={application.user?.name}
                                                                            sx={{
                                                                                width: 36,
                                                                                height: 36,
                                                                                bgcolor: alpha(theme.palette.primary.main, 0.1)
                                                                            }}
                                                                        >
                                                                            {application.user?.name?.charAt(0) || '?'}
                                                                        </Avatar>
                                                                        <Typography variant="body2" fontWeight={500}>
                                                                            {application.user?.name || 'Unnamed User'}
                                                                        </Typography>
                                                                    </Box>
                                                                </TableCell>
                                                                <TableCell sx={{ py: 1.5 }}>{application.user?.email || '-'}</TableCell>
                                                                <TableCell sx={{ py: 1.5 }}>
                                                                    <Chip
                                                                        label={application.status?.name || 'Pending'}
                                                                        color={getApplicationStatusColor(application.status?.name)}
                                                                        size="small"
                                                                        sx={{
                                                                            fontWeight: 600,
                                                                            borderRadius: '0.5rem'
                                                                        }}
                                                                    />
                                                                </TableCell>
                                                                <TableCell sx={{ py: 1.5 }}>
                                                                    {application.current_stage ? (
                                                                        <Chip
                                                                            label={application.current_stage.name}
                                                                            variant="outlined"
                                                                            size="small"
                                                                            sx={{
                                                                                borderColor: application.current_stage.color,
                                                                                color: application.current_stage.color,
                                                                                fontWeight: 500,
                                                                                borderRadius: '0.5rem'
                                                                            }}
                                                                        />
                                                                    ) : '-'}
                                                                </TableCell>
                                                                <TableCell sx={{ py: 1.5 }}>
                                                                    {formatDate(application.created_at)}
                                                                </TableCell>
                                                                <TableCell align="right" sx={{ py: 1.5 }}>
                                                                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                                        <Tooltip title="Lihat Detail">
                                                                            <IconButton
                                                                                component={Link}
                                                                                href={route('manager.applications.show', application.id)}
                                                                                size="small"
                                                                                sx={{
                                                                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                                                    color: 'primary.main',
                                                                                    '&:hover': {
                                                                                        bgcolor: alpha(theme.palette.primary.main, 0.2)
                                                                                    },
                                                                                    borderRadius: '0.5rem'
                                                                                }}
                                                                            >
                                                                                <VisibilityIcon fontSize="small" />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                        <Tooltip title="Terima">
                                                                            <IconButton
                                                                                component={Link}
                                                                                href={route('manager.applications.accept', application.id)}
                                                                                method="put"
                                                                                size="small"
                                                                                sx={{
                                                                                    bgcolor: alpha(theme.palette.success.main, 0.1),
                                                                                    color: 'success.main',
                                                                                    '&:hover': {
                                                                                        bgcolor: alpha(theme.palette.success.main, 0.2)
                                                                                    },
                                                                                    borderRadius: '0.5rem'
                                                                                }}
                                                                            >
                                                                                <CheckIcon fontSize="small" />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                        <Tooltip title="Tolak">
                                                                            <IconButton
                                                                                component={Link}
                                                                                href={route('manager.applications.reject', application.id)}
                                                                                method="put"
                                                                                size="small"
                                                                                sx={{
                                                                                    bgcolor: alpha(theme.palette.error.main, 0.1),
                                                                                    color: 'error.main',
                                                                                    '&:hover': {
                                                                                        bgcolor: alpha(theme.palette.error.main, 0.2)
                                                                                    },
                                                                                    borderRadius: '0.5rem'
                                                                                }}
                                                                            >
                                                                                <CloseIcon fontSize="small" />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    </Stack>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                                                            <Box sx={{ textAlign: 'center' }}>
                                                                <Box
                                                                    sx={{
                                                                        width: 120,
                                                                        height: 120,
                                                                        borderRadius: '50%',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                                                        mx: 'auto',
                                                                        mb: 3
                                                                    }}
                                                                >
                                                                    <PeopleIcon sx={{ fontSize: 48, color: 'primary.main', opacity: 0.8 }} />
                                                                </Box>
                                                                <Typography
                                                                    variant="h5"
                                                                    sx={{ fontWeight: 700, mb: 1 }}
                                                                    className="text-gray-800"
                                                                >
                                                                    Belum ada pelamar
                                                                </Typography>
                                                                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 450, mx: 'auto' }}>
                                                                    Lowongan ini belum memiliki pelamar. Sabar, pelamar akan segera datang!
                                                                </Typography>
                                                            </Box>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    {job.applications && job.applications.length > 0 && (
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'flex-end',
                                                borderTop: `1px solid ${theme.palette.divider}`,
                                                py: 2,
                                                px: 2
                                            }}
                                        >
                                            <TablePagination
                                                rowsPerPageOptions={[5, 10, 25]}
                                                component="div"
                                                count={job.applications.length}
                                                rowsPerPage={rowsPerPage}
                                                page={page}
                                                onPageChange={handleChangePage}
                                                onRowsPerPageChange={handleChangeRowsPerPage}
                                                labelRowsPerPage="Baris per halaman"
                                                labelDisplayedRows={({ from, to, count }) =>
                                                    `${from}-${to} dari ${count !== -1 ? count : `lebih dari ${to}`}`
                                                }
                                                sx={{
                                                    '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                                                        my: 1
                                                    }
                                                }}
                                            />
                                        </Box>
                                    )}
                                </Paper>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </Container>

            {/* Dialog untuk detail pelamar */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: '1rem' }
                }}
            >
                <DialogTitle sx={{ pb: 1 }}>
                    <Typography variant="h6" component="div" fontWeight="600">
                        {selectedApplication?.user?.name || 'Detail Pelamar'}
                    </Typography>
                </DialogTitle>
                <DialogContent dividers>
                    {selectedApplication && (
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Avatar
                                    src={selectedApplication.user?.avatar}
                                    alt={selectedApplication.user?.name}
                                    sx={{
                                        width: 64,
                                        height: 64,
                                        mr: 2,
                                        bgcolor: alpha(theme.palette.primary.main, 0.1)
                                    }}
                                >
                                    {selectedApplication.user?.name?.charAt(0) || '?'}
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" gutterBottom fontWeight="600">
                                        {selectedApplication.user?.name || 'Unnamed User'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {selectedApplication.user?.email || 'No email provided'}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ my: 3 }}>
                                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                                    Status Pelamar
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                    <Chip
                                        label={selectedApplication.status?.name || 'Pending'}
                                        color={getApplicationStatusColor(selectedApplication.status?.name)}
                                        sx={{
                                            mr: 2,
                                            fontWeight: 600,
                                            borderRadius: '0.75rem'
                                        }}
                                    />
                                    <Typography variant="body2" color="text.secondary">
                                        Diperbarui {selectedApplication.updated_at ? formatDate(selectedApplication.updated_at) : '-'}
                                    </Typography>
                                </Box>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ my: 3 }}>
                                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                                    Detail Lamaran
                                </Typography>
                                <Box sx={{ mt: 2 }}>
                                    <Box sx={{ display: 'flex', mb: 1 }}>
                                        <Typography variant="body2" color="text.secondary" sx={{ width: 160 }}>
                                            Tanggal Melamar
                                        </Typography>
                                        <Typography variant="body2" fontWeight="500">
                                            {selectedApplication.created_at ? formatDate(selectedApplication.created_at) : '-'}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', mb: 1 }}>
                                        <Typography variant="body2" color="text.secondary" sx={{ width: 160 }}>
                                            Tahap Saat Ini
                                        </Typography>
                                        <Typography variant="body2" fontWeight="500">
                                            {selectedApplication.current_stage?.name || '-'}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    Tindakan Cepat
                                </Typography>
                            </Box>
                            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                                <Button
                                    component={Link}
                                    href={route('manager.applications.accept', selectedApplication.id)}
                                    method="put"
                                    variant="contained"
                                    color="success"
                                    startIcon={<CheckIcon />}
                                    sx={{
                                        borderRadius: '0.75rem',
                                        px: 3,
                                        py: 1,
                                        '&:hover': {
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                    className="transition-all duration-300"
                                >
                                    Terima
                                </Button>
                                <Button
                                    component={Link}
                                    href={route('manager.applications.reject', selectedApplication.id)}
                                    method="put"
                                    variant="contained"
                                    color="error"
                                    startIcon={<CloseIcon />}
                                    sx={{
                                        borderRadius: '0.75rem',
                                        px: 3,
                                        py: 1,
                                        '&:hover': {
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                    className="transition-all duration-300"
                                >
                                    Tolak
                                </Button>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2.5 }}>
                    <Button
                        onClick={handleCloseDialog}
                        variant="outlined"
                        sx={{
                            borderRadius: '0.75rem',
                            px: 3
                        }}
                    >
                        Tutup
                    </Button>
                    <Button
                        component={Link}
                        href={selectedApplication ? route('manager.applications.show', selectedApplication.id) : '#'}
                        variant="contained"
                        color="primary"
                        endIcon={<ArrowBackIcon sx={{ transform: 'rotate(180deg)' }} />}
                        sx={{
                            borderRadius: '0.75rem',
                            px: 3,
                            boxShadow: '0 4px 14px 0 rgba(20, 184, 166, 0.25)',
                            '&:hover': {
                                boxShadow: '0 6px 20px 0 rgba(20, 184, 166, 0.35)',
                            },
                            transition: 'all 0.3s ease'
                        }}
                        className="transition-all duration-300"
                    >
                        Lihat Detail Lengkap
                    </Button>
                </DialogActions>
            </Dialog>
        </Layout>
    );
}
