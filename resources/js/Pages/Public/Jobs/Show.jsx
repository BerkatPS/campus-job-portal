import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Box, Typography, Container, Card, CardContent, Button,
    Chip, Divider, List, ListItem, ListItemIcon, ListItemText,
    Avatar, Paper, Dialog, DialogTitle, DialogContent,
    DialogContentText, DialogActions, TextField, Alert,
    useMediaQuery, Stack, IconButton, Breadcrumbs, Skeleton, Grid,
    LinearProgress, Fade, InputAdornment
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
    LocationOn, BusinessCenter, WorkOutline, School,
    AttachMoney, CalendarToday, AccessTime, CheckCircle,
    Share, Bookmark, BookmarkBorder, Facebook, Twitter, LinkedIn,
    ArrowBack, ChevronRight, FiberManualRecord, OpenInNew,
    EmailOutlined, MonetizationOnOutlined, AssignmentOutlined,
    ArrowForward, Public, FileUpload, LocalLibrary, Close as CloseIcon
} from '@mui/icons-material';
import MDEditor from '@uiw/react-md-editor';
import { motion } from 'framer-motion';
import moment from 'moment';
import 'moment/locale/id';

import PublicLayout from '@/Components/Layout/PublicLayout';
import MuiThemeProvider from '@/Theme/MuiThemeProvider';
import CompanyLogo from '@/Components/Shared/CompanyLogo';

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

const CustomChip = ({ icon, label, color = "default", onDelete, variant = "outlined", size = "small", className = "" }) => {
    const theme = useTheme();

    const getChipStyle = () => {
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
        return {};
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

const JobCard = ({ job, theme }) => {
    return (
        <Card
            component={motion.div}
            whileHover={{ y: -5, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
            transition={{ duration: 0.3 }}
            sx={{
                mb: 3,
                bgcolor: 'white',
                borderRadius: '0.75rem',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                border: '1px solid',
                borderColor: 'divider',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            {/* Job card header with gradient */}
            <Box
                sx={{
                    height: 6,
                    width: '100%',
                    background: `linear-gradient(90deg, #14b8a6 0%, #06b6d4 100%)`,
                }}
            />

            <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <CompanyLogo
                        company={job.company}
                        size={56}
                        variant="square"
                        sx={{ borderRadius: '0.75rem' }}
                    />

                    <Box sx={{ flex: 1 }}>
                        <Typography
                            variant="subtitle1"
                            fontWeight={600}
                            sx={{
                                color: 'text.primary',
                                transition: 'color 0.2s',
                                '&:hover': { color: '#14b8a6' }
                            }}
                        >
                            {job.title}
                        </Typography>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {job.company?.name}
                        </Typography>

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            <Chip
                                size="small"
                                icon={<LocationOn fontSize="small" />}
                                label={job.location || 'Remote'}
                                variant="outlined"
                                sx={{
                                    borderRadius: '0.75rem',
                                    borderColor: 'divider',
                                    bgcolor: 'rgba(0,0,0,0.02)'
                                }}
                            />

                            <Chip
                                size="small"
                                icon={<WorkOutline fontSize="small" />}
                                label={formatJobType(job.type)}
                                variant="outlined"
                                sx={{
                                    borderRadius: '0.75rem',
                                    borderColor: 'divider',
                                    bgcolor: 'rgba(0,0,0,0.02)'
                                }}
                            />
                        </Box>
                    </Box>

                    <IconButton
                        component={Link}
                        href={route('public.jobs.show', job.id)}
                        size="small"
                        sx={{
                            bgcolor: 'rgba(20, 184, 166, 0.1)',
                            color: '#14b8a6',
                            '&:hover': {
                                bgcolor: 'rgba(20, 184, 166, 0.2)',
                                color: '#14b8a6'
                            }
                        }}
                    >
                        <ArrowForward fontSize="small" />
                    </IconButton>
                </Box>
            </CardContent>
        </Card>
    );
};

export default function Show({ job, relatedJobs, auth }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
    const [openApplyDialog, setOpenApplyDialog] = useState(false);
    const [openShareDialog, setOpenShareDialog] = useState(false);
    const [openLoginDialog, setOpenLoginDialog] = useState(false);
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

    // Share URLs
    const shareUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(job.title + ' di ' + job.company.name)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`
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
                                    borderRadius: '0.75rem',
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
                                        fontWeight: 500,
                                        py: 1,
                                        textTransform: 'none',
                                        bgcolor: '#14b8a6',
                                        '&:hover': {
                                            bgcolor: '#0d9488'
                                        }
                                    }}
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

    const handleApplyButtonClick = () => {
        // Check if the user is logged in
        if (auth.user) {
            // Redirect directly to the application page
            window.location.href = route('candidate.jobs.apply', job.id);
        } else {
            // Show login dialog if not logged in
            setOpenLoginDialog(true);
        }
    };

    return (
        <PublicLayout>
            <Head title={`${job.title} - ${job.company?.name || 'Lowongan Pekerjaan'}`} />

            <Box sx={{
                background: 'linear-gradient(to bottom, #f0fdfa, #f5f7fa)',
                py: 4,
                borderBottom: '1px solid rgba(20, 184, 166, 0.1)'
            }}>
                <Container maxWidth="lg">
                    {/* Breadcrumbs Navigation */}
                    <Breadcrumbs separator={<ChevronRight fontSize="small" color="primary" />} sx={{ mb: 2.5 }}>
                        <Link href={route('public.jobs.index')} className="text-gray-500 hover:text-teal-500 no-underline text-sm">
                            Lowongan Pekerjaan
                        </Link>
                        {job.category && (
                            <Link href={route('public.jobs.index', { category_id: job.category.id })} className="text-gray-500 hover:text-teal-500 no-underline text-sm">
                                {job.category.name}
                            </Link>
                        )}
                        <Typography color="#14b8a6" className="text-sm" fontWeight={500}>
                            {job.title}
                        </Typography>
                    </Breadcrumbs>

                    {/* Job Header */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            justifyContent: 'space-between',
                            alignItems: { xs: 'flex-start', md: 'center' },
                            gap: { xs: 3, md: 0 },
                            mb: 3
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                                src={job.company?.logo_url}
                                alt={job.company?.name}
                                variant="rounded"
                                sx={{
                                    width: 64,
                                    height: 64,
                                    bgcolor: 'white',
                                    border: '1px solid rgba(20, 184, 166, 0.2)',
                                    borderRadius: '0.75rem',
                                    p: job.company?.logo_url ? 0 : 1,
                                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                                }}
                            >
                                {!job.company?.logo_url && job.company?.name?.charAt(0)}
                            </Avatar>

                            <Box>
                                <Typography
                                    variant="h5"
                                    component="h1"
                                    fontWeight={700}
                                    sx={{
                                        background: 'linear-gradient(90deg, #14b8a6, #06b6d4)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        mb: 0.5
                                    }}
                                >
                                    {job.title}
                                </Typography>

                                <Link
                                    href={route('public.companies.show', job.company?.id)}
                                    className="no-underline hover:text-teal-600"
                                >
                                    <Typography
                                        variant="subtitle1"
                                        color="text.secondary"
                                        component="span"
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.5,
                                            transition: 'color 0.2s',
                                            '&:hover': { color: '#0d9488' }
                                        }}
                                    >
                                        <BusinessCenter fontSize="small" />
                                        {job.company?.name}
                                    </Typography>
                                </Link>
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                width: { xs: '100%', md: 'auto' },
                                justifyContent: 'flex-end',
                                gap: 1
                            }}
                        >
                            <Button
                                variant="outlined"
                                color="primary"
                                startIcon={isSaved ? <Bookmark /> : <BookmarkBorder />}
                                onClick={() => setIsSaved(!isSaved)}
                                sx={{
                                    borderRadius: '0.75rem',
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    borderColor: '#14b8a6',
                                    color: '#14b8a6',
                                    '&:hover': {
                                        borderColor: '#0d9488',
                                        backgroundColor: 'rgba(20, 184, 166, 0.04)'
                                    }
                                }}
                            >
                                {isSaved ? 'Tersimpan' : 'Simpan'}
                            </Button>

                            <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<Share />}
                                onClick={() => setOpenShareDialog(true)}
                                sx={{
                                    borderRadius: '0.75rem',
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    borderColor: '#14b8a6',
                                    color: '#14b8a6',
                                    '&:hover': {
                                        borderColor: '#0d9488',
                                        backgroundColor: 'rgba(20, 184, 166, 0.04)'
                                    }
                                }}
                            >
                                Bagikan
                            </Button>

                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleApplyButtonClick}
                                sx={{
                                    borderRadius: '0.75rem',
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    px: 3,
                                    bgcolor: '#14b8a6',
                                    '&:hover': {
                                        bgcolor: '#0d9488'
                                    }
                                }}
                            >
                                Lamar Sekarang
                            </Button>
                        </Box>
                    </Box>

                    {/* Job Meta Information */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 1.5,
                            mt: 3
                        }}
                    >
                        <CustomChip
                            icon={<WorkOutline />}
                            label={formatJobType(job.type)}
                            variant="outlined"
                            sx={{
                                bgcolor: 'rgba(20, 184, 166, 0.04)',
                                borderColor: 'rgba(20, 184, 166, 0.3)',
                                color: '#0d9488'
                            }}
                        />

                        <CustomChip
                            icon={<LocationOn />}
                            label={job.location}
                            variant="outlined"
                            sx={{
                                bgcolor: 'rgba(20, 184, 166, 0.04)',
                                borderColor: 'rgba(20, 184, 166, 0.3)',
                                color: '#0d9488'
                            }}
                        />

                        <CustomChip
                            icon={<School />}
                            label={formatExperience(job.experience_level)}
                            variant="outlined"
                            sx={{
                                bgcolor: 'rgba(20, 184, 166, 0.04)',
                                borderColor: 'rgba(20, 184, 166, 0.3)',
                                color: '#0d9488'
                            }}
                        />

                        {job.salary_min && (
                            <CustomChip
                                icon={<AttachMoney />}
                                label={
                                    job.salary_max
                                        ? `${formatCurrency(job.salary_min)} - ${formatCurrency(job.salary_max)}`
                                        : `${formatCurrency(job.salary_min)}`
                                }
                                variant="outlined"
                                sx={{
                                    bgcolor: 'rgba(20, 184, 166, 0.04)',
                                    borderColor: 'rgba(20, 184, 166, 0.3)',
                                    color: '#0d9488'
                                }}
                            />
                        )}

                        <CustomChip
                            icon={<CalendarToday />}
                            label={`Deadline: ${moment(job.deadline).format('DD MMMM YYYY')}`}
                            variant="outlined"
                            sx={{
                                bgcolor: 'rgba(20, 184, 166, 0.04)',
                                borderColor: 'rgba(20, 184, 166, 0.3)',
                                color: '#0d9488'
                            }}
                        />
                    </Box>
                </Container>
            </Box>
            <Container maxWidth="lg" sx={{ my: 4 }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 3
                }}>
                    {/* Main Content */}
                    <Box sx={{ flex: 1 }}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Job Description */}
                            <Paper
                                elevation={0}
                                sx={{
                                    mb: 3,
                                    borderRadius: '0.75rem',
                                    border: '1px solid rgba(20, 184, 166, 0.2)',
                                    overflow: 'hidden'
                                }}
                            >
                                <Box sx={{
                                    py: 2,
                                    px: 3,
                                    background: 'linear-gradient(90deg, rgba(20, 184, 166, 0.1), rgba(6, 182, 212, 0.1))',
                                    borderBottom: '1px solid rgba(20, 184, 166, 0.1)'
                                }}>
                                    <Typography variant="h6" fontWeight={600} color="#0f766e">
                                        Deskripsi Pekerjaan
                                    </Typography>
                                </Box>
                                <Box sx={{ p: 3 }}>
                                    <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
                                        <div dangerouslySetInnerHTML={{ __html: job.description }} />
                                    </Typography>
                                </Box>
                            </Paper>

                            {/* Job Requirements */}
                            {job.requirements && (
                                <Paper
                                    elevation={0}
                                    sx={{
                                        mb: 3,
                                        borderRadius: '0.75rem',
                                        border: '1px solid rgba(20, 184, 166, 0.2)',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <Box sx={{
                                        py: 2,
                                        px: 3,
                                        background: 'linear-gradient(90deg, rgba(20, 184, 166, 0.1), rgba(6, 182, 212, 0.1))',
                                        borderBottom: '1px solid rgba(20, 184, 166, 0.1)'
                                    }}>
                                        <Typography variant="h6" fontWeight={600} color="#0f766e">
                                            Persyaratan
                                        </Typography>
                                    </Box>
                                    <Box sx={{ p: 3 }}>
                                        <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                                            <div dangerouslySetInnerHTML={{ __html: job.requirements }} />
                                        </Typography>
                                    </Box>
                                </Paper>
                            )}

                            {/* Job Responsibilities */}
                            {job.responsibilities && (
                                <Paper
                                    elevation={0}
                                    sx={{
                                        mb: 3,
                                        borderRadius: '0.75rem',
                                        border: '1px solid rgba(20, 184, 166, 0.2)',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <Box sx={{
                                        py: 2,
                                        px: 3,
                                        background: 'linear-gradient(90deg, rgba(20, 184, 166, 0.1), rgba(6, 182, 212, 0.1))',
                                        borderBottom: '1px solid rgba(20, 184, 166, 0.1)'
                                    }}>
                                        <Typography variant="h6" fontWeight={600} color="#0f766e">
                                            Tanggung Jawab
                                        </Typography>
                                    </Box>
                                    <Box sx={{ p: 3 }}>
                                        <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                                            <div dangerouslySetInnerHTML={{ __html: job.responsibilities }} />
                                        </Typography>
                                    </Box>
                                </Paper>
                            )}

                            {/* Job Benefits */}
                            {job.benefits && (
                                <Paper
                                    elevation={0}
                                    sx={{
                                        mb: 3,
                                        borderRadius: '0.75rem',
                                        border: '1px solid rgba(20, 184, 166, 0.2)',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <Box sx={{
                                        py: 2,
                                        px: 3,
                                        background: 'linear-gradient(90deg, rgba(20, 184, 166, 0.1), rgba(6, 182, 212, 0.1))',
                                        borderBottom: '1px solid rgba(20, 184, 166, 0.1)'
                                    }}>
                                        <Typography variant="h6" fontWeight={600} color="#0f766e">
                                            Benefit
                                        </Typography>
                                    </Box>
                                    <Box sx={{ p: 3 }}>
                                        <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                                            <div dangerouslySetInnerHTML={{ __html: job.benefits }} />
                                        </Typography>
                                    </Box>
                                </Paper>
                            )}

                            {/* Related Jobs */}
                            {relatedJobs && relatedJobs.length > 0 && (
                                <Box sx={{ mt: 6, mb: 4 }}>
                                    <Typography
                                        variant="h5"
                                        fontWeight={700}
                                        gutterBottom
                                        sx={{
                                            position: 'relative',
                                            display: 'inline-block',
                                            pb: 1,
                                            mb: 3,
                                            '&:after': {
                                                content: '""',
                                                position: 'absolute',
                                                bottom: 0,
                                                left: 0,
                                                width: '40%',
                                                height: '3px',
                                                background: 'linear-gradient(90deg, #14b8a6, #06b6d4)',
                                                borderRadius: '5px'
                                            }
                                        }}
                                    >
                                        Lowongan Serupa
                                    </Typography>
                                    <Grid container spacing={2}>
                                        {relatedJobs.map(relatedJob => (
                                            <Grid
                                                item
                                                xs={12}
                                                sm={6}
                                                lg={4}
                                                key={relatedJob.id}
                                            >
                                                <JobCard job={relatedJob} theme={theme} />
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            )}
                        </motion.div>
                    </Box>

                    {/* Sidebar */}
                    <Box sx={{
                        width: { xs: '100%', md: '320px' },
                        flexShrink: 0,
                        order: { xs: -1, md: 1 }
                    }}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                        >
                            {/* CTA Card */}
                            <Paper
                                elevation={0}
                                sx={{
                                    mb: 3,
                                    borderRadius: '0.75rem',
                                    border: '1px solid rgba(20, 184, 166, 0.2)',
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)'
                                }}
                            >
                                <Box sx={{
                                    py: 2,
                                    px: 3,
                                    background: 'linear-gradient(90deg, rgba(20, 184, 166, 0.12), rgba(6, 182, 212, 0.12))',
                                    borderBottom: '1px solid rgba(20, 184, 166, 0.1)'
                                }}>
                                    <Typography variant="h6" fontWeight={600} color="#0f766e">
                                        Tertarik dengan posisi ini?
                                    </Typography>
                                </Box>
                                <Box sx={{ p: 3 }}>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        Lamar segera sebelum batas akhir pendaftaran.
                                    </Typography>

                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        my: 2,
                                        p: 2,
                                        bgcolor: 'rgba(20, 184, 166, 0.05)',
                                        borderRadius: '0.75rem'
                                    }}>
                                        <CalendarToday sx={{ color: '#14b8a6', mr: 1.5, fontSize: 20 }} />
                                        <Box>
                                            <Typography variant="body2" fontWeight={600} color="#0f766e">
                                                Deadline:
                                            </Typography>
                                            <Typography variant="body2">
                                                {moment(job.deadline).format('DD MMMM YYYY')}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            mb: 2,
                                            textAlign: 'center',
                                            fontWeight: 500,
                                            color: moment().isAfter(moment(job.deadline))
                                                ? '#ef4444'
                                                : '#0d9488'
                                        }}
                                    >
                                        {moment().isAfter(moment(job.deadline)) ? (
                                            <span>Pendaftaran sudah ditutup</span>
                                        ) : (
                                            <>
                                                <span style={{ fontWeight: 600 }}>
                                                    {moment(job.deadline).diff(moment(), 'days')} hari
                                                </span>{' '}
                                                tersisa untuk melamar
                                            </>
                                        )}
                                    </Typography>

                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="large"
                                        fullWidth
                                        onClick={handleApplyButtonClick}
                                        disabled={moment().isAfter(moment(job.deadline))}
                                        sx={{
                                            borderRadius: '0.75rem',
                                            py: 1.2,
                                            textTransform: 'none',
                                            fontWeight: 500,
                                            bgcolor: '#14b8a6',
                                            '&:hover': {
                                                bgcolor: '#0d9488'
                                            },
                                            '&.Mui-disabled': {
                                                bgcolor: 'rgba(0, 0, 0, 0.12)',
                                            }
                                        }}
                                    >
                                        Lamar Sekarang
                                    </Button>
                                </Box>
                            </Paper>

                            {/* Company Information */}
                            <Paper
                                elevation={0}
                                sx={{
                                    mb: 3,
                                    borderRadius: '0.75rem',
                                    border: '1px solid rgba(20, 184, 166, 0.2)',
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)'
                                }}
                            >
                                <Box sx={{
                                    py: 2,
                                    px: 3,
                                    background: 'linear-gradient(90deg, rgba(20, 184, 166, 0.12), rgba(6, 182, 212, 0.12))',
                                    borderBottom: '1px solid rgba(20, 184, 166, 0.1)'
                                }}>
                                    <Typography variant="h6" fontWeight={600} color="#0f766e">
                                        Tentang Perusahaan
                                    </Typography>
                                </Box>
                                <Box sx={{ p: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                        <CompanyLogo
                                            company={job.company}
                                            size={60}
                                            variant="square"
                                            sx={{ borderRadius: '0.75rem' }}
                                        />

                                        <Box>
                                            <Typography variant="h6" fontWeight={600} color="#0f766e">
                                                {job.company?.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {job.company?.industry || 'Informasi Teknologi'}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {job.company?.description && (
                                        <Typography variant="body2" color="text.secondary" paragraph>
                                            {job.company?.description.length > 150
                                                ? `${job.company?.description.substring(0, 150)}...`
                                                : job.company?.description}
                                        </Typography>
                                    )}

                                    <Button
                                        component={Link}
                                        href={route('public.companies.show', job.company?.id)}
                                        variant="outlined"
                                        fullWidth
                                        endIcon={<ArrowForward />}
                                        sx={{
                                            mt: 1,
                                            borderRadius: '0.75rem',
                                            textTransform: 'none',
                                            fontWeight: 500,
                                            py: 1.2,
                                            borderColor: '#14b8a6',
                                            color: '#14b8a6',
                                            '&:hover': {
                                                borderColor: '#0d9488',
                                                backgroundColor: 'rgba(20, 184, 166, 0.04)'
                                            }
                                        }}
                                    >
                                        Lihat Profil Perusahaan
                                    </Button>
                                </Box>
                            </Paper>

                            {/* Share */}
                            <Paper
                                elevation={0}
                                sx={{
                                    borderRadius: '0.75rem',
                                    border: '1px solid rgba(20, 184, 166, 0.2)',
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)'
                                }}
                            >
                                <Box sx={{
                                    py: 2,
                                    px: 3,
                                    background: 'linear-gradient(90deg, rgba(20, 184, 166, 0.12), rgba(6, 182, 212, 0.12))',
                                    borderBottom: '1px solid rgba(20, 184, 166, 0.1)'
                                }}>
                                    <Typography variant="h6" fontWeight={600} color="#0f766e">
                                        Bagikan Lowongan
                                    </Typography>
                                </Box>
                                <Box sx={{ p: 3 }}>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        Bantu teman Anda menemukan pekerjaan yang cocok.
                                    </Typography>

                                    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                                        <IconButton
                                            component="a"
                                            href={shareUrls.facebook}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{
                                                bgcolor: '#1877F2',
                                                color: 'white',
                                                transition: 'all 0.2s',
                                                '&:hover': {
                                                    bgcolor: '#0C60CF',
                                                    transform: 'translateY(-2px)'
                                                }
                                            }}
                                        >
                                            <Facebook />
                                        </IconButton>

                                        <IconButton
                                            component="a"
                                            href={shareUrls.twitter}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{
                                                bgcolor: '#1DA1F2',
                                                color: 'white',
                                                transition: 'all 0.2s',
                                                '&:hover': {
                                                    bgcolor: '#0C85D0',
                                                    transform: 'translateY(-2px)'
                                                }
                                            }}
                                        >
                                            <Twitter />
                                        </IconButton>

                                        <IconButton
                                            component="a"
                                            href={shareUrls.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{
                                                bgcolor: '#0A66C2',
                                                color: 'white',
                                                transition: 'all 0.2s',
                                                '&:hover': {
                                                    bgcolor: '#084B8A',
                                                    transform: 'translateY(-2px)'
                                                }
                                            }}
                                        >
                                            <LinkedIn />
                                        </IconButton>

                                        <Button
                                            variant="outlined"
                                            onClick={() => setOpenShareDialog(true)}
                                            sx={{
                                                flex: 1,
                                                borderRadius: '0.75rem',
                                                textTransform: 'none',
                                                fontWeight: 500,
                                                borderColor: '#14b8a6',
                                                color: '#14b8a6',
                                                '&:hover': {
                                                    borderColor: '#0d9488',
                                                    backgroundColor: 'rgba(20, 184, 166, 0.04)'
                                                }
                                            }}
                                            startIcon={<Share />}
                                        >
                                            Lainnya
                                        </Button>
                                    </Stack>
                                </Box>
                            </Paper>
                        </motion.div>
                    </Box>
                </Box>
            </Container>


            {/* Share Dialog */}
            <Dialog
                open={openShareDialog}
                onClose={() => setOpenShareDialog(false)}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '12px',
                        p: 1
                    }
                }}
            >
                <DialogTitle sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="h6" fontWeight={600}>
                            Bagikan Lowongan
                        </Typography>
                        <IconButton onClick={() => setOpenShareDialog(false)} size="small">
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </DialogTitle>

                <DialogContent dividers sx={{ p: 3 }}>
                    <Typography variant="body1" paragraph>
                        Bantu orang lain menemukan kesempatan kerja dengan membagikan lowongan ini di:
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mt: 3 }}>
                        <Button
                            component="a"
                            href={shareUrls.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="contained"
                            sx={{
                                flex: 1,
                                bgcolor: '#1877F2',
                                color: 'white',
                                '&:hover': { bgcolor: '#0C60CF' },
                                borderRadius: '0.75rem',
                                textTransform: 'none',
                                py: 1.5,
                                fontWeight: 500
                            }}
                            startIcon={<Facebook />}
                        >
                            Facebook
                        </Button>

                        <Button
                            component="a"
                            href={shareUrls.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="contained"
                            sx={{
                                flex: 1,
                                bgcolor: '#1DA1F2',
                                color: 'white',
                                '&:hover': { bgcolor: '#0C85D0' },
                                borderRadius: '0.75rem',
                                textTransform: 'none',
                                py: 1.5,
                                fontWeight: 500
                            }}
                            startIcon={<Twitter />}
                        >
                            Twitter
                        </Button>

                        <Button
                            component="a"
                            href={shareUrls.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="contained"
                            sx={{
                                flex: 1,
                                bgcolor: '#0A66C2',
                                color: 'white',
                                '&:hover': { bgcolor: '#084B8A' },
                                borderRadius: '0.75rem',
                                textTransform: 'none',
                                py: 1.5,
                                fontWeight: 500
                            }}
                            startIcon={<LinkedIn />}
                        >
                            LinkedIn
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>

            {/* Login Dialog */}
            <Dialog
                open={openLoginDialog}
                onClose={() => setOpenLoginDialog(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '12px',
                        p: 2
                    }
                }}
            >
                <DialogTitle sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="h6" fontWeight={600}>
                            Login Diperlukan
                        </Typography>
                        <IconButton onClick={() => setOpenLoginDialog(false)} size="small">
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </DialogTitle>

                <DialogContent dividers sx={{ p: 3 }}>
                    <Alert
                        severity="info"
                        sx={{
                            mb: 3,
                            borderRadius: '8px',
                            bgcolor: 'rgba(3, 169, 244, 0.08)',
                            border: '1px solid rgba(3, 169, 244, 0.2)'
                        }}
                    >
                        <Typography variant="body1">
                            Anda perlu login terlebih dahulu untuk dapat melamar pekerjaan ini.
                        </Typography>
                    </Alert>

                    <Typography variant="body2" color="text.secondary" paragraph>
                        Silahkan login ke akun Anda untuk melanjutkan proses pelamaran pekerjaan.
                    </Typography>
                </DialogContent>

                <DialogActions sx={{ p: 3 }}>
                    <Button
                        onClick={() => setOpenLoginDialog(false)}
                        variant="outlined"
                        sx={{
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontWeight: 500
                        }}
                    >
                        Batal
                    </Button>
                    <Button
                        component={Link}
                        href={route('login')}
                        variant="contained"
                        color="primary"
                        sx={{
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontWeight: 500,
                            px: 3
                        }}
                    >
                        Login
                    </Button>
                </DialogActions>
            </Dialog>
        </PublicLayout>
    );
}
