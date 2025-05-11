import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Box, Typography, Container, Card, CardContent, Button,
    Chip, Divider, List, ListItem, ListItemIcon, ListItemText,
    Avatar, Paper, Dialog, DialogTitle, DialogContent,
    DialogContentText, DialogActions, TextField, Alert,
    useMediaQuery, Stack, IconButton, Breadcrumbs, Skeleton, Tooltip,
    LinearProgress, Fade
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
    LocationOn, BusinessCenter, WorkOutline, School,
    AttachMoney, CalendarToday, AccessTime, CheckCircle,
    Share, Bookmark, BookmarkBorder, Facebook, Twitter, LinkedIn,
    ArrowBack, ChevronRight, FiberManualRecord, OpenInNew,
    EmailOutlined, MonetizationOnOutlined, AssignmentOutlined,
    ArrowForward, Public, FileUpload, LocalLibrary
} from '@mui/icons-material';
import MDEditor from '@uiw/react-md-editor';
import { motion, AnimatePresence } from 'framer-motion';
import moment from 'moment';
import 'moment/locale/id';

import PublicLayout from '@/Components/Layout/PublicLayout';
import MuiThemeProvider from '@/Theme/MuiThemeProvider';

moment.locale('id');

// Format angka ke rupiah
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
};

// Format tipe pekerjaan
const formatJobType = (type) => {
    if (!type) return 'Tidak ditentukan';

    const types = {
        'full_time': 'Full Time',
        'part_time': 'Part Time',
        'contract': 'Kontrak',
        'internship': 'Magang',
        'freelance': 'Freelance'
    };
    return types[type] || type;
};

// Format level pengalaman
const formatExperience = (level) => {
    if (!level) return 'Tidak ditentukan';

    const levels = {
        'entry': 'Entry Level (0-2 tahun)',
        'mid': 'Mid Level (2-5 tahun)',
        'senior': 'Senior Level (5+ tahun)',
        'executive': 'Executive (10+ tahun)'
    };
    return levels[level] || level;
};

// Custom badge for skills and item type - sama seperti sebelumnya
const CustomChip = ({ icon, label, color = "default", onDelete, variant = "outlined", size = "small", className = "" }) => {
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
        // ... kode getChipStyle lainnya tetap sama
    };

    return (
        <Chip
            icon={icon}
            label={label}
            onDelete={onDelete}
            variant={variant}
            size={size}
            className={className}
            sx={{
                fontWeight: 500,
                borderRadius: '0.75rem',
                ...getChipStyle(),
            }}
        />
    );
};

export default function Show({ job, relatedJobs, auth }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
    const [openApplyDialog, setOpenApplyDialog] = useState(false);
    const [openShareDialog, setOpenShareDialog] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    // Get job type color
    const getJobTypeColor = (type) => {
        if (!type) return "default";

        const colors = {
            'full_time': 'primary',
            'part_time': 'secondary',
            'contract': 'info',
            'internship': 'success',
            'freelance': 'warning'
        };
        return colors[type] || "default";
    };

    // Pastikan job tidak null
    if (!job) {
        return (
            <MuiThemeProvider>
                <PublicLayout>
                    <Head title="Lowongan Tidak Ditemukan" />
                    <Container maxWidth="lg" sx={{ my: 8 }}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Alert
                                severity="error"
                                sx={{
                                    p: 3,
                                    borderRadius: '1rem',
                                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                    border: '1px solid rgba(239, 68, 68, 0.2)',
                                    '& .MuiAlert-icon': {
                                        color: '#ef4444'
                                    }
                                }}
                            >
                                <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                                    Maaf, lowongan pekerjaan tidak ditemukan.
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    Lowongan mungkin telah dihapus atau tidak tersedia lagi.
                                </Typography>
                            </Alert>
                            <Box sx={{ mt: 3 }}>
                                <Button
                                    component={Link}
                                    href={route('public.jobs.index')}
                                    variant="contained"
                                    color="primary"
                                    startIcon={<ArrowBack />}
                                    sx={{
                                        borderRadius: '0.75rem',
                                        fontWeight: 600,
                                        py: 1.2,
                                        px: 3,
                                        boxShadow: '0 4px 14px 0 rgba(20, 184, 166, 0.25)',
                                        '&:hover': {
                                            boxShadow: '0 6px 20px 0 rgba(20, 184, 166, 0.35)',
                                            transform: 'translateY(-2px)'
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                    className="transition-all duration-300"
                                >
                                    Kembali ke Daftar Lowongan
                                </Button>
                            </Box>
                        </motion.div>
                    </Container>
                </PublicLayout>
            </MuiThemeProvider>
        );
    }

    const { data, setData, post, processing, errors, reset, progress } = useForm({
        cover_letter: '',
        expected_salary: '',
        resume: null,
    });

    const handleApply = (e) => {
        e.preventDefault();
        post(route('candidate.applications.store', job.id), {
            onSuccess: () => {
                reset();
                setOpenApplyDialog(false);
            }
        });
    };

    const handleFileChange = (e) => {
        setData('resume', e.target.files[0]);
    };

    return (
        <MuiThemeProvider>
            <PublicLayout>
                <Head title={`${job.title} - ${job?.company?.name || 'Perusahaan'}`} />

                <Box sx={{ bgcolor: 'gray.50' }} className="bg-gray-50">
                    <Container maxWidth="lg">
                        <Box sx={{ py: 3 }}>
                            <Breadcrumbs
                                separator={<ChevronRight fontSize="small" className="text-gray-400" />}
                                aria-label="breadcrumb"
                            >
                                <Link href={route('public.home')} className="text-gray-600 hover:text-primary-600 transition-colors">
                                    Beranda
                                </Link>
                                <Link href={route('public.jobs.index')} className="text-gray-600 hover:text-primary-600 transition-colors">
                                    Lowongan Pekerjaan
                                </Link>
                                <Typography color="text.primary" className="text-gray-800 font-medium">
                                    {job.title}
                                </Typography>
                            </Breadcrumbs>
                        </Box>
                    </Container>
                </Box>

                <Container maxWidth="lg" sx={{ py: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                        {/* Main Content */}
                        <Box sx={{ width: { xs: '100%', md: '66.67%' } }}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Card
                                    sx={{
                                        mb: 4,
                                        overflow: 'visible',
                                        borderRadius: '1rem',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                                    }}
                                >
                                    <CardContent sx={{ p: 0 }}>
                                        <Box sx={{
                                            bgcolor: 'primary.600',
                                            color: 'primary.contrastText',
                                            p: 3,
                                            borderRadius: '1rem 1rem 0 0',
                                            position: 'relative',
                                            background: 'linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)'
                                        }}>
                                            {/* Background decorative elements */}
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    inset: 0,
                                                    overflow: 'hidden',
                                                    borderRadius: 'inherit',
                                                    zIndex: 0
                                                }}
                                            >
                                                <div className="absolute top-20 right-20 w-72 h-72 bg-primary-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>
                                                <div className="absolute bottom-0 left-20 w-64 h-64 bg-primary-200 rounded-full mix-blend-overlay filter blur-3xl opacity-10"></div>
                                            </Box>

                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    bottom: -40,
                                                    left: 24,
                                                    width: 80,
                                                    height: 80,
                                                    borderRadius: '1rem',
                                                    bgcolor: 'white',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                                                    border: '4px solid white',
                                                    zIndex: 10
                                                }}
                                            >
                                                <Avatar
                                                    src={job.company?.logo}
                                                    alt={job.company?.name || 'Company'}
                                                    variant="rounded"
                                                    sx={{
                                                        width: 70,
                                                        height: 70,
                                                        bgcolor: 'primary.100',
                                                        borderRadius: '0.75rem'
                                                    }}
                                                >
                                                    {job.company?.name?.charAt(0) || 'C'}
                                                </Avatar>
                                            </Box>

                                            {/* Status Indicator */}
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    right: 0,
                                                    p: 2,
                                                    zIndex: 5
                                                }}
                                            >
                                                {job.status === 'active' ? (
                                                    <CustomChip
                                                        label="Aktif"
                                                        size="small"
                                                        color="success"
                                                        icon={<CheckCircle fontSize="small" />}
                                                    />
                                                ) : (
                                                    <CustomChip
                                                        label="Ditutup"
                                                        size="small"
                                                        color="error"
                                                    />
                                                )}
                                            </Box>

                                            <Box sx={{ position: 'relative', zIndex: 1 }}>
                                                <Typography
                                                    variant="overline"
                                                    component="div"
                                                    sx={{
                                                        fontWeight: 600,
                                                        color: 'primary.50',
                                                        opacity: 0.8,
                                                        mb: 0.5,
                                                        letterSpacing: 1
                                                    }}
                                                >
                                                    LOWONGAN PEKERJAAN
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Box sx={{ p: 3, pt: 5 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap' }}>
                                                <Box>
                                                    <Typography
                                                        variant="h4"
                                                        component="h1"
                                                        fontWeight="bold"
                                                        gutterBottom
                                                        className="text-gray-800"
                                                    >
                                                        {job.title}
                                                    </Typography>

                                                    <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                                                        <Typography
                                                            variant="body1"
                                                            component="span"
                                                            className="text-primary-700 font-medium"
                                                        >
                                                            {job.company?.name || 'Perusahaan'}
                                                        </Typography>
                                                        <FiberManualRecord sx={{ fontSize: 8, color: 'text.secondary' }} />
                                                        <Typography variant="body2" color="text.secondary">
                                                            Diposting {moment(job.created_at).fromNow()}
                                                        </Typography>
                                                    </Stack>
                                                </Box>

                                                <Box sx={{ display: 'flex', gap: 1, mt: { xs: 2, sm: 0 } }}>
                                                    <Tooltip title="Bagikan">
                                                        <IconButton
                                                            color="primary"
                                                            onClick={() => setOpenShareDialog(true)}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: 'primary.50',
                                                                borderRadius: '0.75rem',
                                                                transition: 'all 0.2s ease',
                                                                '&:hover': {
                                                                    bgcolor: 'primary.100',
                                                                    transform: 'translateY(-2px)'
                                                                }
                                                            }}
                                                        >
                                                            <Share fontSize="small" className="text-primary-600" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title={isSaved ? "Hapus dari tersimpan" : "Simpan lowongan"}>
                                                        <IconButton
                                                            color="primary"
                                                            onClick={() => setIsSaved(!isSaved)}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: isSaved ? 'primary.50' : 'gray.100',
                                                                color: isSaved ? 'primary.500' : 'gray.500',
                                                                borderRadius: '0.75rem',
                                                                transition: 'all 0.2s ease',
                                                                '&:hover': {
                                                                    bgcolor: isSaved ? 'primary.100' : 'gray.200',
                                                                    transform: 'translateY(-2px)'
                                                                }
                                                            }}
                                                        >
                                                            {isSaved ? (
                                                                <Bookmark fontSize="small" className="text-primary-600" />
                                                            ) : (
                                                                <BookmarkBorder fontSize="small" className="text-gray-500" />
                                                            )}
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </Box>

                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                                                {job.type && (
                                                    <CustomChip
                                                        icon={<WorkOutline fontSize="small" />}
                                                        label={formatJobType(job.type)}
                                                        color={getJobTypeColor(job.type)}
                                                    />
                                                )}

                                                {job.experience_level && (
                                                    <CustomChip
                                                        icon={<School fontSize="small" />}
                                                        label={formatExperience(job.experience_level)}
                                                        color="info"
                                                    />
                                                )}

                                                {job.location && (
                                                    <CustomChip
                                                        icon={<LocationOn fontSize="small" />}
                                                        label={job.location}
                                                        color="secondary"
                                                    />
                                                )}

                                                {job.salary_min && (
                                                    <CustomChip
                                                        icon={<AttachMoney fontSize="small" />}
                                                        label={job.salary_max ? `${formatCurrency(job.salary_min)} - ${formatCurrency(job.salary_max)}` : `${formatCurrency(job.salary_min)}`}
                                                        color="success"
                                                    />
                                                )}
                                            </Box>

                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'flex-start',
                                                    mb: 4
                                                }}
                                            >
                                                <Button
                                                    variant="contained"
                                                    size="large"
                                                    onClick={() => setOpenApplyDialog(true)}
                                                    disabled={job.status !== 'active'}
                                                    sx={{
                                                        px: 4,
                                                        py: 1.5,
                                                        borderRadius: '0.75rem',
                                                        fontWeight: 600,
                                                        boxShadow: '0 4px 14px 0 rgba(20, 184, 166, 0.25)',
                                                        '&:hover': {
                                                            boxShadow: '0 6px 20px 0 rgba(20, 184, 166, 0.35)',
                                                            transform: 'translateY(-2px)'
                                                        },
                                                        transition: 'all 0.3s ease',
                                                        '&.Mui-disabled': {
                                                            backgroundColor: 'rgba(0, 0, 0, 0.12)',
                                                            color: 'rgba(0, 0, 0, 0.26)'
                                                        }
                                                    }}
                                                    className="transition-all duration-300"
                                                    startIcon={<EmailOutlined />}
                                                >
                                                    {job.status === 'active' ? 'Lamar Sekarang' : 'Lowongan Ditutup'}
                                                </Button>
                                            </Box>

                                            <Divider sx={{ mb: 4 }} />

                                            <Paper
                                                elevation={0}
                                                sx={{
                                                    p: 3,
                                                    mb: 4,
                                                    borderRadius: '1rem',
                                                    backgroundColor: 'rgba(20, 184, 166, 0.05)',
                                                    border: '1px solid rgba(20, 184, 166, 0.1)'
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                                    <Box sx={{ width: { xs: '50%', sm: '33.33%', lg: '25%' } }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                                            <LocationOn
                                                                color="action"
                                                                sx={{
                                                                    mr: 1.5,
                                                                    mt: 0.5,
                                                                    color: 'primary.500'
                                                                }}
                                                            />
                                                            <Box>
                                                                <Typography variant="caption" color="text.secondary" display="block">
                                                                    Lokasi
                                                                </Typography>
                                                                <Typography variant="body2" fontWeight={500}>
                                                                    {job.location || 'Tidak ditentukan'}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </Box>

                                                    <Box sx={{ width: { xs: '50%', sm: '33.33%', lg: '25%' } }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                                            <WorkOutline
                                                                color="action"
                                                                sx={{
                                                                    mr: 1.5,
                                                                    mt: 0.5,
                                                                    color: 'primary.500'
                                                                }}
                                                            />
                                                            <Box>
                                                                <Typography variant="caption" color="text.secondary" display="block">
                                                                    Tipe Pekerjaan
                                                                </Typography>
                                                                <Typography variant="body2" fontWeight={500}>
                                                                    {formatJobType(job.type)}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </Box>

                                                    <Box sx={{ width: { xs: '50%', sm: '33.33%', lg: '25%' } }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                                            <School
                                                                color="action"
                                                                sx={{
                                                                    mr: 1.5,
                                                                    mt: 0.5,
                                                                    color: 'primary.500'
                                                                }}
                                                            />
                                                            <Box>
                                                                <Typography variant="caption" color="text.secondary" display="block">
                                                                    Level Pengalaman
                                                                </Typography>
                                                                <Typography variant="body2" fontWeight={500}>
                                                                    {formatExperience(job.experience_level)}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </Box>

                                                    <Box sx={{ width: { xs: '50%', sm: '33.33%', lg: '25%' } }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                                            <AttachMoney
                                                                color="action"
                                                                sx={{
                                                                    mr: 1.5,
                                                                    mt: 0.5,
                                                                    color: 'primary.500'
                                                                }}
                                                            />
                                                            <Box>
                                                                <Typography variant="caption" color="text.secondary" display="block">
                                                                    Gaji
                                                                </Typography>
                                                                <Typography variant="body2" fontWeight={500}>
                                                                    {job.salary_min && job.salary_max
                                                                        ? `${formatCurrency(job.salary_min)} - ${formatCurrency(job.salary_max)}`
                                                                        : (job.salary_min
                                                                            ? `${formatCurrency(job.salary_min)}`
                                                                            : 'Gaji dirahasiakan')}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </Box>

                                                    {job.deadline && (
                                                        <Box sx={{ width: { xs: '50%', sm: '33.33%', lg: '25%' } }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                                                <CalendarToday
                                                                    color="action"
                                                                    sx={{
                                                                        mr: 1.5,
                                                                        mt: 0.5,
                                                                        color: 'primary.500'
                                                                    }}
                                                                />
                                                                <Box>
                                                                    <Typography variant="caption" color="text.secondary" display="block">
                                                                        Deadline
                                                                    </Typography>
                                                                    <Typography variant="body2" fontWeight={500}>
                                                                        {moment(job.deadline).format('DD MMMM YYYY')}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                        </Box>
                                                    )}

                                                    <Box sx={{ width: { xs: '50%', sm: '33.33%', lg: '25%' } }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                                            <AccessTime
                                                                color="action"
                                                                sx={{
                                                                    mr: 1.5,
                                                                    mt: 0.5,
                                                                    color: 'primary.500'
                                                                }}
                                                            />
                                                            <Box>
                                                                <Typography variant="caption" color="text.secondary" display="block">
                                                                    Tanggal Posting
                                                                </Typography>
                                                                <Typography variant="body2" fontWeight={500}>
                                                                    {moment(job.created_at).format('DD MMMM YYYY')}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </Paper>

                                            <Box sx={{ mb: 5 }}>
                                                <Typography
                                                    variant="h5"
                                                    gutterBottom
                                                    fontWeight="bold"
                                                    className="text-gray-800"
                                                    sx={{
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
                                                >
                                                    Deskripsi Pekerjaan
                                                </Typography>

                                                <Box sx={{ mt: 3, color: 'text.primary' }} data-color-mode="light">
                                                    <MDEditor.Markdown
                                                        source={job.description || "Tidak ada deskripsi"}
                                                        style={{
                                                            fontFamily: theme.typography.fontFamily,
                                                            fontSize: '1rem',
                                                            lineHeight: 1.6
                                                        }}
                                                    />
                                                </Box>
                                            </Box>

                                            <Box sx={{ mb: 5 }}>
                                                <Typography
                                                    variant="h5"
                                                    gutterBottom
                                                    fontWeight="bold"
                                                    className="text-gray-800"
                                                    sx={{
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
                                                >
                                                    Persyaratan
                                                </Typography>

                                                <Box sx={{ mt: 3, color: 'text.primary' }} data-color-mode="light">
                                                    <MDEditor.Markdown
                                                        source={job.requirements || "Tidak ada persyaratan khusus"}
                                                        style={{
                                                            fontFamily: theme.typography.fontFamily,
                                                            fontSize: '1rem',
                                                            lineHeight: 1.6
                                                        }}
                                                    />
                                                </Box>
                                            </Box>

                                            <Box sx={{ mb: 4 }}>
                                                <Typography
                                                    variant="h5"
                                                    gutterBottom
                                                    fontWeight="bold"
                                                    className="text-gray-800"
                                                    sx={{
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
                                                >
                                                    Skills & Kemampuan
                                                </Typography>

                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 3 }}>
                                                    {job.skills && job.skills.length > 0 ? (
                                                        job.skills.map((skill, index) => (
                                                            <CustomChip
                                                                key={index}
                                                                label={skill}
                                                                color="primary"
                                                                variant="outlined"
                                                                sx={{ mb: 1 }}
                                                            />
                                                        ))
                                                    ) : (
                                                        <Typography variant="body2" color="text.secondary">
                                                            Tidak ada skills yang ditentukan
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </Box>

                                            <Divider sx={{ my: 4 }} />

                                            <Box sx={{ textAlign: 'center' }}>
                                                <Button
                                                    variant="contained"
                                                    size="large"
                                                    onClick={() => setOpenApplyDialog(true)}
                                                    disabled={job.status !== 'active'}
                                                    sx={{
                                                        px: 6,
                                                        py: 1.5,
                                                        borderRadius: '0.75rem',
                                                        fontWeight: 600,
                                                        boxShadow: '0 4px 14px 0 rgba(20, 184, 166, 0.25)',
                                                        '&:hover': {
                                                            boxShadow: '0 6px 20px 0 rgba(20, 184, 166, 0.35)',
                                                            transform: 'translateY(-2px)'
                                                        },
                                                        transition: 'all 0.3s ease',
                                                        '&.Mui-disabled': {
                                                            backgroundColor: 'rgba(0, 0, 0, 0.12)',
                                                            color: 'rgba(0, 0, 0, 0.26)'
                                                        }
                                                    }}
                                                    className="transition-all duration-300"
                                                    startIcon={<EmailOutlined />}
                                                >
                                                    {job.status === 'active' ? 'Lamar Sekarang' : 'Lowongan Ditutup'}
                                                </Button>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>

                                {relatedJobs && relatedJobs.length > 0 && (
                                    <Card
                                        sx={{
                                            mb: 4,
                                            borderRadius: '1rem',
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                                        }}
                                    >
                                        <CardContent sx={{ p: 3 }}>
                                            <Typography
                                                variant="h5"
                                                gutterBottom
                                                fontWeight="bold"
                                                className="text-gray-800"
                                                sx={{
                                                    pb: 1,
                                                    position: 'relative',
                                                    '&:after': {
                                                        content: '""',
                                                        position: 'absolute',
                                                        width: 40,
                                                        height: 3,
                                                        bottom: 0,
                                                        left: 0,
                                                        bgcolor: 'primary.main',
                                                        borderRadius: 1
                                                    }
                                                }}
                                            >
                                                Lowongan Serupa
                                            </Typography>

                                            <Divider sx={{ mb: 2 }} />

                                            <List disablePadding>
                                                {relatedJobs.map((relatedJob, index) => (
                                                    <React.Fragment key={relatedJob.id}>
                                                        <ListItem
                                                            component={Link}
                                                            href={route('public.jobs.show', relatedJob.id)}
                                                            sx={{
                                                                px: 2,
                                                                py: 2,
                                                                textDecoration: 'none',
                                                                color: 'inherit',
                                                                borderRadius: '0.75rem',
                                                                transition: 'all 0.2s ease',
                                                                mb: index < relatedJobs.length - 1 ? 1 : 0,
                                                                '&:hover': {
                                                                    bgcolor: 'primary.50',
                                                                    transform: 'translateX(4px)'
                                                                }
                                                            }}
                                                            className="group"
                                                        >
                                                            <ListItemIcon sx={{ minWidth: 56 }}>
                                                                <Avatar
                                                                    src={relatedJob.company?.logo}
                                                                    alt={relatedJob.company?.name || 'Company'}
                                                                    variant="rounded"
                                                                    sx={{
                                                                        width: 40,
                                                                        height: 40,
                                                                        borderRadius: '0.5rem',
                                                                        border: '1px solid',
                                                                        borderColor: 'divider'
                                                                    }}
                                                                >
                                                                    {relatedJob.company?.name?.charAt(0) || 'C'}
                                                                </Avatar>
                                                            </ListItemIcon>
                                                            <ListItemText
                                                                primary={
                                                                    <Typography
                                                                        variant="subtitle1"
                                                                        fontWeight="medium"
                                                                        className="text-gray-800 group-hover:text-primary-600 transition-colors"
                                                                    >
                                                                        {relatedJob.title}
                                                                    </Typography>
                                                                }
                                                                secondary={
                                                                    <Box>
                                                                        <Typography variant="body2" color="text.secondary">
                                                                            {relatedJob.company?.name || 'Perusahaan'}
                                                                        </Typography>
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                                                                            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                                                                <LocationIcon fontSize="small" sx={{ mr: 0.5, fontSize: 14 }} />
                                                                                {relatedJob.location || 'Tidak ditentukan'}
                                                                            </Typography>
                                                                            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                                                                <WorkOutline fontSize="small" sx={{ mr: 0.5, fontSize: 14 }} />
                                                                                {formatJobType(relatedJob.type)}
                                                                            </Typography>
                                                                        </Box>
                                                                    </Box>
                                                                }
                                                            />
                                                            <ArrowForward
                                                                fontSize="small"
                                                                className="text-gray-300 group-hover:text-primary-500 transition-all opacity-0 group-hover:opacity-100"
                                                            />
                                                        </ListItem>
                                                        {index < relatedJobs.length - 1 && <Divider />}
                                                    </React.Fragment>
                                                ))}
                                            </List>
                                        </CardContent>
                                    </Card>
                                )}
                            </motion.div>
                        </Box>

                        {/* Sidebar */}
                        <Box sx={{ width: { xs: '100%', md: '33.33%' } }}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <Box
                                    sx={{
                                        position: { md: 'sticky' },
                                        top: { md: '100px' },
                                    }}
                                >
                                    <Card
                                        sx={{
                                            mb: 4,
                                            borderRadius: '1rem',
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                                        }}
                                    >
                                        <CardContent sx={{ p: 0 }}>
                                            <Box
                                                sx={{
                                                    bgcolor: 'primary.50',
                                                    p: 3,
                                                    borderRadius: '1rem 1rem 0 0',
                                                    borderBottom: '1px solid',
                                                    borderColor: 'divider'
                                                }}
                                            >
                                                <Typography
                                                    variant="h6"
                                                    gutterBottom
                                                    fontWeight="bold"
                                                    className="text-gray-800"
                                                >
                                                    Ringkasan Pekerjaan
                                                </Typography>
                                            </Box>

                                            <Box sx={{ p: 3 }}>
                                                <List disablePadding>
                                                    <ListItem disablePadding sx={{ py: 1.5 }}>
                                                        <ListItemIcon sx={{ minWidth: 36 }}>
                                                            <BusinessCenter
                                                                fontSize="small"
                                                                className="text-primary-500"
                                                            />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={
                                                                <Typography variant="caption" color="text.secondary">
                                                                    Perusahaan
                                                                </Typography>
                                                            }
                                                            secondary={
                                                                <Typography variant="body2" fontWeight={500} className="mt-0.5 text-gray-800">
                                                                    {job.company?.name || 'Perusahaan'}
                                                                </Typography>
                                                            }
                                                        />
                                                    </ListItem>

                                                    <ListItem disablePadding sx={{ py: 1.5 }}>
                                                        <ListItemIcon sx={{ minWidth: 36 }}>
                                                            <LocationOn
                                                                fontSize="small"
                                                                className="text-primary-500"
                                                            />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={
                                                                <Typography variant="caption" color="text.secondary">
                                                                    Lokasi
                                                                </Typography>
                                                            }
                                                            secondary={
                                                                <Typography variant="body2" fontWeight={500} className="mt-0.5 text-gray-800">
                                                                    {job.location || 'Tidak ditentukan'}
                                                                </Typography>
                                                            }
                                                        />
                                                    </ListItem>

                                                    <ListItem disablePadding sx={{ py: 1.5 }}>
                                                        <ListItemIcon sx={{ minWidth: 36 }}>
                                                            <WorkOutline
                                                                fontSize="small"
                                                                className="text-primary-500"
                                                            />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={
                                                                <Typography variant="caption" color="text.secondary">
                                                                    Tipe Pekerjaan
                                                                </Typography>
                                                            }
                                                            secondary={
                                                                <Typography variant="body2" fontWeight={500} className="mt-0.5 text-gray-800">
                                                                    {formatJobType(job.type)}
                                                                </Typography>
                                                            }
                                                        />
                                                    </ListItem>

                                                    <ListItem disablePadding sx={{ py: 1.5 }}>
                                                        <ListItemIcon sx={{ minWidth: 36 }}>
                                                            <School
                                                                fontSize="small"
                                                                className="text-primary-500"
                                                            />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={
                                                                <Typography variant="caption" color="text.secondary">
                                                                    Level Pengalaman
                                                                </Typography>
                                                            }
                                                            secondary={
                                                                <Typography variant="body2" fontWeight={500} className="mt-0.5 text-gray-800">
                                                                    {formatExperience(job.experience_level)}
                                                                </Typography>
                                                            }
                                                        />
                                                    </ListItem>

                                                    <ListItem disablePadding sx={{ py: 1.5 }}>
                                                        <ListItemIcon sx={{ minWidth: 36 }}>
                                                            <AttachMoney
                                                                fontSize="small"
                                                                className="text-primary-500"
                                                            />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={
                                                                <Typography variant="caption" color="text.secondary">
                                                                    Gaji
                                                                </Typography>
                                                            }
                                                            secondary={
                                                                <Typography variant="body2" fontWeight={500} className="mt-0.5 text-gray-800">
                                                                    {job.salary_min && job.salary_max
                                                                        ? `${formatCurrency(job.salary_min)} - ${formatCurrency(job.salary_max)}`
                                                                        : (job.salary_min
                                                                            ? `${formatCurrency(job.salary_min)}`
                                                                            : 'Gaji dirahasiakan')}
                                                                </Typography>
                                                            }
                                                        />
                                                    </ListItem>

                                                    {/* ...the rest of the ListItems */}
                                                </List>
                                            </Box>

                                            <Divider />

                                            <Box sx={{ p: 3 }}>
                                                <Button
                                                    variant="contained"
                                                    fullWidth
                                                    size="large"
                                                    onClick={() => setOpenApplyDialog(true)}
                                                    disabled={job.status !== 'active'}
                                                    sx={{
                                                        borderRadius: '0.75rem',
                                                        py: 1.5,
                                                        fontWeight: 600,
                                                        boxShadow: '0 4px 14px 0 rgba(20, 184, 166, 0.25)',
                                                        '&:hover': {
                                                            boxShadow: '0 6px 20px 0 rgba(20, 184, 166, 0.35)',
                                                            transform: 'translateY(-2px)'
                                                        },
                                                        transition: 'all 0.3s ease',
                                                        '&.Mui-disabled': {
                                                            backgroundColor: 'rgba(0, 0, 0, 0.12)',
                                                            color: 'rgba(0, 0, 0, 0.26)'
                                                        }
                                                    }}
                                                    className="transition-all duration-300"
                                                    startIcon={<EmailOutlined />}
                                                >
                                                    {job.status === 'active' ? 'Lamar Sekarang' : 'Lowongan Ditutup'}
                                                </Button>
                                            </Box>
                                        </CardContent>
                                    </Card>

                                    <Card
                                        sx={{
                                            borderRadius: '1rem',
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                                        }}
                                    >
                                        <CardContent sx={{ p: 0 }}>
                                            <Box
                                                sx={{
                                                    bgcolor: 'primary.50',
                                                    p: 3,
                                                    borderRadius: '1rem 1rem 0 0',
                                                    borderBottom: '1px solid',
                                                    borderColor: 'divider'
                                                }}
                                            >
                                                <Typography
                                                    variant="h6"
                                                    gutterBottom
                                                    fontWeight="bold"
                                                    className="text-gray-800"
                                                >
                                                    Tentang {job.company?.name || 'Perusahaan'}
                                                </Typography>
                                            </Box>

                                            <Box sx={{ p: 3 }}>
                                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                                                    <Avatar
                                                        src={job.company?.logo}
                                                        alt={job.company?.name || 'Company'}
                                                        variant="rounded"
                                                        sx={{
                                                            width: 80,
                                                            height: 80,
                                                            mb: 2,
                                                            bgcolor: 'primary.100',
                                                            borderRadius: '1rem',
                                                            border: '1px solid',
                                                            borderColor: 'divider'
                                                        }}
                                                    >
                                                        {job.company?.name?.charAt(0) || 'C'}
                                                    </Avatar>

                                                    <Typography variant="subtitle1" align="center" fontWeight="bold" className="text-gray-800">
                                                        {job.company?.name || 'Perusahaan'}
                                                    </Typography>

                                                    <Typography variant="body2" align="center" color="text.secondary" gutterBottom>
                                                        {job.company?.industry || 'Technology'}
                                                    </Typography>

                                                    <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                                                        <Button
                                                            component={Link}
                                                            href={route('public.jobs.index', {company_id: job.company?.id})}
                                                            variant="outlined"
                                                            size="small"
                                                            className="rounded-lg text-primary-600 border-primary-200 hover:bg-primary-50"
                                                        >
                                                            Lihat Semua Lowongan
                                                        </Button>

                                                        {job.company?.website && (
                                                            <Tooltip title="Kunjungi website">
                                                                <IconButton
                                                                    size="small"
                                                                    component="a"
                                                                    href={job.company.website}
                                                                    target="_blank"
                                                                    rel="noopener"
                                                                    className="text-primary-600 border border-primary-200 hover:bg-primary-50"
                                                                >
                                                                    <Public fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        )}
                                                    </Stack>
                                                </Box>

                                                <Box className="text-gray-600">
                                                    <Typography variant="body2" paragraph>
                                                        {job.company?.description ||
                                                            `${job.company?.name || 'Perusahaan'} adalah perusahaan yang bergerak di bidang teknologi dan inovasi.
                              Kami berfokus pada pengembangan solusi digital yang membantu meningkatkan produktivitas dan efisiensi.`}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Box>
                            </motion.div>
                        </Box>
                    </Box>
                </Container>

                {/* Dialog Lamar */}
                <Dialog
                    open={openApplyDialog}
                    onClose={() => setOpenApplyDialog(false)}
                    fullWidth
                    maxWidth="md"
                    sx={{
                        '& .MuiPaper-root': {
                            borderRadius: '1rem',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                        }
                    }}
                >
                    <DialogTitle
                        sx={{
                            p: 3,
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            bgcolor: 'grey.50'
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                                src={job.company?.logo}
                                variant="rounded"
                                sx={{
                                    width: 40,
                                    height: 40,
                                    bgcolor: 'primary.100',
                                    borderRadius: '0.5rem'
                                }}
                            >
                                {job.company?.name?.charAt(0) || 'C'}
                            </Avatar>
                            <Box>
                                <Typography variant="h6" fontWeight="bold" className="text-gray-800">
                                    Lamar: {job.title}
                                </Typography>
                                <Typography variant="subtitle2" color="text.secondary">
                                    {job.company?.name || 'Perusahaan'}
                                </Typography>
                            </Box>
                        </Box>
                    </DialogTitle>

                    <DialogContent dividers sx={{ p: 3 }}>
                        {!auth?.user ? (
                            <Box sx={{ py: 4, textAlign: 'center' }}>
                                <Box
                                    sx={{
                                        mb: 3,
                                        p: 3,
                                        borderRadius: '1rem',
                                        bgcolor: 'primary.50',
                                        display: 'inline-flex',
                                        color: 'primary.500'
                                    }}
                                >
                                    <LocalLibrary fontSize="large" />
                                </Box>
                                <Typography variant="h6" fontWeight="bold" paragraph className="text-gray-800">
                                    Anda harus login untuk melamar pekerjaan ini
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    Silakan login atau daftar untuk bisa melamar pekerjaan ini
                                </Typography>
                                <Box sx={{ mt: 4 }}>
                                    <Button
                                        component={Link}
                                        href={route('login', { redirect: window.location.href })}
                                        variant="contained"
                                        sx={{
                                            mr: 2,
                                            borderRadius: '0.75rem',
                                            px: 4,
                                            py: 1.2,
                                            fontWeight: 600,
                                        }}
                                    >
                                        Login
                                    </Button>
                                    <Button
                                        component={Link}
                                        href={route('register', { redirect: window.location.href })}
                                        variant="outlined"
                                        sx={{
                                            borderRadius: '0.75rem',
                                            px: 4,
                                            py: 1.2,
                                            fontWeight: 600,
                                        }}
                                    >
                                        Daftar
                                    </Button>
                                </Box>
                            </Box>
                        ) : (
                            <Box component="form" onSubmit={handleApply} sx={{ py: 2 }}>
                                {Object.keys(errors).length > 0 && (
                                    <Alert
                                        severity="error"
                                        sx={{
                                            mb: 3,
                                            borderRadius: '0.75rem',
                                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                            border: '1px solid rgba(239, 68, 68, 0.2)',
                                        }}
                                    >
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                            Terdapat kesalahan pada formulir. Silakan periksa kembali.
                                        </Typography>
                                    </Alert>
                                )}

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    <Box>
                                        <Typography variant="subtitle1" gutterBottom fontWeight={600} className="flex items-center">
                                            <EmailOutlined sx={{ mr: 1 }} fontSize="small" className="text-primary-500" />
                                            Surat Lamaran
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={5}
                                            variant="outlined"
                                            placeholder="Jelaskan mengapa Anda tertarik dengan posisi ini dan mengapa Anda cocok untuk pekerjaan ini"
                                            value={data.cover_letter}
                                            onChange={e => setData('cover_letter', e.target.value)}
                                            error={!!errors.cover_letter}
                                            helperText={errors.cover_letter}
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
                                        />
                                    </Box>

                                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                                        <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
                                            <Typography variant="subtitle1" gutterBottom fontWeight={600} className="flex items-center">
                                                <MonetizationOnOutlined sx={{ mr: 1 }} fontSize="small" className="text-primary-500" />
                                                Ekspektasi Gaji (Rp)
                                            </Typography>
                                            <TextField
                                                fullWidth
                                                type="number"
                                                variant="outlined"
                                                placeholder="Masukkan ekspektasi gaji Anda"
                                                value={data.expected_salary}
                                                onChange={e => setData('expected_salary', e.target.value)}
                                                error={!!errors.expected_salary}
                                                helperText={errors.expected_salary}
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
                                            />
                                        </Box>

                                        <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
                                            <Typography variant="subtitle1" gutterBottom fontWeight={600} className="flex items-center">
                                                <AssignmentOutlined sx={{ mr: 1 }} fontSize="small" className="text-primary-500" />
                                                Unggah CV/Resume
                                            </Typography>
                                            <Button
                                                variant="outlined"
                                                component="label"
                                                fullWidth
                                                startIcon={<FileUpload />}
                                                sx={{
                                                    height: 56,
                                                    textTransform: 'none',
                                                    borderRadius: '0.75rem',
                                                    borderStyle: 'dashed',
                                                    borderWidth: '2px',
                                                    color: data.resume ? 'primary.main' : 'text.secondary',
                                                    borderColor: data.resume ? 'primary.main' : 'divider',
                                                    bgcolor: data.resume ? 'primary.50' : 'transparent',
                                                    '&:hover': {
                                                        borderColor: 'primary.main',
                                                        bgcolor: 'primary.50'
                                                    }
                                                }}
                                            >
                                                {data.resume ? data.resume.name : 'Pilih File CV/Resume'}
                                                <input
                                                    type="file"
                                                    hidden
                                                    accept=".pdf,.doc,.docx"
                                                    onChange={handleFileChange}
                                                />
                                            </Button>

                                            <Box sx={{ mt: 1 }}>
                                                {errors.resume && (
                                                    <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                                                        {errors.resume}
                                                    </Typography>
                                                )}

                                                {progress && (
                                                    <Box sx={{ width: '100%', mt: 1 }}>
                                                        <LinearProgress
                                                            variant="determinate"
                                                            value={progress.percentage}
                                                            sx={{
                                                                height: 6,
                                                                borderRadius: 1,
                                                                bgcolor: 'primary.50',
                                                                '& .MuiLinearProgress-bar': {
                                                                    backgroundColor: 'primary.main'
                                                                }
                                                            }}
                                                        />
                                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                                            {progress.percentage}% selesai
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        )}
                    </DialogContent>

                    <DialogActions sx={{ p: 2.5, borderTop: '1px solid', borderColor: 'divider' }}>
                        <Button
                            onClick={() => setOpenApplyDialog(false)}
                            variant="outlined"
                            sx={{
                                borderRadius: '0.75rem',
                                px: 3,
                                py: 1,
                                fontWeight: 500
                            }}
                        >
                            Batal
                        </Button>
                        {auth?.user && (
                            <Button
                                variant="contained"
                                type="submit"
                                onClick={handleApply}
                                disabled={processing}
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
                                {processing ? 'Memproses...' : 'Kirim Lamaran'}
                            </Button>
                        )}
                    </DialogActions>
                </Dialog>

                {/* Dialog Share */}
                <Dialog
                    open={openShareDialog}
                    onClose={() => setOpenShareDialog(false)}
                    sx={{
                        '& .MuiPaper-root': {
                            borderRadius: '1rem',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                        }
                    }}
                >
                    <DialogTitle
                        sx={{
                            p: 3,
                            borderBottom: '1px solid',
                            borderColor: 'divider'
                        }}
                    >
                        <Typography variant="h6" fontWeight="bold" className="text-gray-800">
                            Bagikan Lowongan Pekerjaan
                        </Typography>
                    </DialogTitle>

                    <DialogContent sx={{ p: 3, pt: 4 }}>
                        <DialogContentText paragraph color="text.secondary">
                            Bagikan lowongan pekerjaan ini ke media sosial:
                        </DialogContentText>

                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, my: 3 }}>
                            <IconButton
                                sx={{
                                    bgcolor: '#3b5998',
                                    color: 'white',
                                    p: 2,
                                    '&:hover': {
                                        bgcolor: '#2d4373',
                                        transform: 'translateY(-2px)'
                                    },
                                    transition: 'all 0.2s ease',
                                    boxShadow: '0 4px 12px rgba(59, 89, 152, 0.3)'
                                }}
                            >
                                <Facebook />
                            </IconButton>

                            <IconButton
                                sx={{
                                    bgcolor: '#1da1f2',
                                    color: 'white',
                                    p: 2,
                                    '&:hover': {
                                        bgcolor: '#0c85d0',
                                        transform: 'translateY(-2px)'
                                    },
                                    transition: 'all 0.2s ease',
                                    boxShadow: '0 4px 12px rgba(29, 161, 242, 0.3)'
                                }}
                            >
                                <Twitter />
                            </IconButton>

                            <IconButton
                                sx={{
                                    bgcolor: '#0077b5',
                                    color: 'white',
                                    p: 2,
                                    '&:hover': {
                                        bgcolor: '#00669c',
                                        transform: 'translateY(-2px)'
                                    },
                                    transition: 'all 0.2s ease',
                                    boxShadow: '0 4px 12px rgba(0, 119, 181, 0.3)'
                                }}
                            >
                                <LinkedIn />
                            </IconButton>
                        </Box>

                        <Box sx={{ mt: 4 }}>
                            <Typography variant="subtitle2" gutterBottom fontWeight={600} className="text-gray-800">
                                Link Lowongan:
                            </Typography>
                            <TextField
                                fullWidth
                                variant="outlined"
                                value={window.location.href}
                                InputProps={{
                                    readOnly: true,
                                    endAdornment: (
                                        <Button
                                            variant="contained"
                                            size="small"
                                            onClick={() => {
                                                navigator.clipboard.writeText(window.location.href);
                                                // Could add toast notification here
                                            }}
                                            sx={{
                                                borderRadius: '0.5rem',
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                boxShadow: 'none',
                                                '&:hover': {
                                                    boxShadow: 'none'
                                                }
                                            }}
                                        >
                                            Salin
                                        </Button>
                                    ),
                                }}
                                size="small"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '0.75rem',
                                        pr: 1,
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
                        </Box>
                    </DialogContent>

                    <DialogActions sx={{ p: 2.5, borderTop: '1px solid', borderColor: 'divider' }}>
                        <Button
                            onClick={() => setOpenShareDialog(false)}
                            variant="outlined"
                            sx={{
                                borderRadius: '0.75rem',
                                px: 3,
                                py: 1,
                                fontWeight: 500
                            }}
                        >
                            Tutup
                        </Button>
                    </DialogActions>
                </Dialog>
            </PublicLayout>
        </MuiThemeProvider>
    );
}
