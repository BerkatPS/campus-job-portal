import React, { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Box,
    Container,
    Paper,
    Typography,
    Button,
    Chip,
    Divider,
    Grid,
    Card,
    CardContent,
    Avatar,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    useMediaQuery,
    useTheme,
    LinearProgress
} from '@mui/material';
import {
    Business as BusinessIcon,
    LocationOn,
    AttachMoney,
    AccessTime,
    Work,
    WorkOutline,
    CalendarToday,
    CheckCircleOutline,
    Description,
    Info,
    People,
    Send as SendIcon,
    ArrowForward as ArrowForwardIcon,
    CheckCircle,
    Cancel as CancelIcon,
    Schedule as ScheduleIcon,
    ArrowBack as ArrowBackIcon,
    Assignment as AssignmentIcon
} from '@mui/icons-material';
import Layout from '@/Components/Layout/Layout';
import { alpha } from '@mui/material/styles';
import { motion } from 'framer-motion';
import SweetAlert from '@/Components/Shared/SweetAlert';

export default function ShowJob({ job, hasApplied, relatedJobs }) {
    const { auth, flash } = usePage().props;
    const [openDialog, setOpenDialog] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [redirectPending, setRedirectPending] = useState(false);


    // SweetAlert states
    const [sweetAlert, setSweetAlert] = useState({
        show: false,
        title: '',
        text: '',
        icon: ''
    });

    useEffect(() => {
        if (flash.success) {
            setSweetAlert({
                show: true,
                title: 'Berhasil',
                text: flash.success,
                icon: 'success'
            });
        } else if (flash.error) {
            setSweetAlert({
                show: true,
                title: 'Gagal',
                text: flash.error,
                icon: 'error'
            });
        } else if (hasApplied) {
            setSweetAlert({
                show: true,
                title: 'Info',
                text: 'Anda sudah melamar pekerjaan ini. Silakan cek status lamaran di halaman \'Lamaran Saya\'.',
                icon: 'info'
            });
        } else if (isJobExpired()) {
            setSweetAlert({
                show: true,
                title: 'Info',
                text: 'Lowongan ini sudah berakhir.',
                icon: 'info'
            });
        }

    }, [flash]);

    // Format the deadline date
    const formatDeadline = (dateString) => {
        if (!dateString) return 'Tidak tersedia';

        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Tidak tersedia';

            return date.toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            return 'Tidak tersedia';
        }
    };

    const isJobExpired = () => {
        if (!job?.submission_deadline) return true;
        return new Date(job.submission_deadline) < new Date();
    };


    const formatSalary = (min, max) => {
        if (!min && !max) return 'Tidak ditentukan';
        if (min && !max) return `Rp${min.toLocaleString()}+`;
        if (!min && max) return `Hingga Rp${max.toLocaleString()}`;
        return `Rp${min.toLocaleString()} - Rp${max.toLocaleString()}`;
    };

    const getRemainingDays = () => {
        if (!job?.submission_deadline) return 0;

        const deadlineDate = new Date(job.submission_deadline);
        const today = new Date();

        if (deadlineDate < today) return 0;

        const diffTime = deadlineDate - today;
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        return Math.floor(diffDays);
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
                return status || 'Tidak diketahui';
        }
    };

    const handleApplyClick = (e) => {
        e.preventDefault()

        if (!auth.user) {
            setOpenDialog(true);
            return;
        }

        window.location.href = route('candidate.jobs.apply', job?.id);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleLoginClick = () => {
        window.location.href = route('login');
    };

    const remainingDays = getRemainingDays();
    const isDeadlineNear = remainingDays > 0 && remainingDays <= 3;

    return (
        <Layout>
            <Head title={job?.title || 'Detail Lowongan'} />

            <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Box sx={{ mb: 3 }}>
                        <Button
                            component={Link}
                            href={route('candidate.jobs.index')}
                            startIcon={<ArrowBackIcon />}
                            sx={{
                                color: 'text.secondary',
                                fontWeight: 500,
                                '&:hover': {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                                }
                            }}
                        >
                            Kembali ke Lowongan
                        </Button>
                    </Box>

                    {sweetAlert.show && (
                        <SweetAlert
                            title={sweetAlert.title}
                            text={sweetAlert.text}
                            icon={sweetAlert.icon}
                            showConfirmButton={true}
                            onClose={() => setSweetAlert({ ...sweetAlert, show: false })}
                        />
                    )}

                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                md: '8fr 4fr'
                            },
                            gap: 3
                        }}
                    >
                        <Box>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: { xs: 3, md: 4 },
                                    borderRadius: '1rem',
                                    mb: 3,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
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

                                <Box sx={{ mb: 2, mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
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

                                <Box sx={{ mb: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
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
                                            <Typography
                                                variant="h4"
                                                component="h1"
                                                sx={{
                                                    fontWeight: 700,
                                                    mb: 1,
                                                    color: 'text.primary'
                                                }}
                                                className="text-gray-800"
                                            >
                                                {job?.title}
                                            </Typography>
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
                                                <BusinessIcon fontSize="small" sx={{ mr: 0.5 }} />
                                                {job?.company?.name}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 3 }}>
                                        {job?.job_type && (
                                            <Chip
                                                icon={<WorkOutline fontSize="small" />}
                                                label={job.job_type}
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
                                                label={job.experience_level}
                                                size="small"
                                                variant="outlined"
                                                sx={{ borderRadius: '0.75rem' }}
                                            />
                                        )}
                                    </Box>

                                    {(job?.is_salary_visible && (job?.salary_min || job?.salary_max)) && (
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            mb: 3,
                                            color: 'success.main',
                                            bgcolor: alpha(theme.palette.success.main, 0.1),
                                            px: 2,
                                            py: 1,
                                            borderRadius: '0.75rem',
                                            width: 'fit-content'
                                        }}>
                                            <AttachMoney fontSize="small" sx={{ mr: 0.5 }} />
                                            <Typography variant="body1" fontWeight="medium">
                                                {formatSalary(job?.salary_min, job?.salary_max)}
                                            </Typography>
                                        </Box>
                                    )}

                                    <Stack direction="row" spacing={3} sx={{ mb: 1 }}>
                                        {job?.submission_deadline && (
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <AccessTime
                                                    fontSize="small"
                                                    sx={{
                                                        mr: 1,
                                                        color: isDeadlineNear ? 'error.main' : 'text.secondary'
                                                    }}
                                                />
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: isDeadlineNear ? 'error.main' : 'text.secondary',
                                                        fontWeight: isDeadlineNear ? 'bold' : 'normal'
                                                    }}
                                                >
                                                    {remainingDays > 0
                                                        ? `${remainingDays} hari lagi`
                                                        : `Deadline: ${formatDeadline(job.submission_deadline)}`
                                                    }
                                                </Typography>
                                            </Box>
                                        )}

                                        {job?.created_at && (
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <CalendarToday fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                                <Typography variant="body2" color="text.secondary">
                                                    Diposting: {formatDeadline(job.created_at)}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Stack>
                                </Box>

                                <Divider sx={{ my: 3 }} />

                                <Box sx={{ mb: 4 }}>
                                    {/* IMPORTANT: Remove these direct SweetAlert components */}
                                    {/* Instead, we'll use conditional rendering for the buttons */}
                                    {hasApplied ? (
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                p: 2,
                                                bgcolor: 'info.light',
                                                color: 'info.dark',
                                                borderRadius: '0.75rem',
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <Info sx={{ mr: 1 }} />
                                            Anda sudah melamar pekerjaan ini. Silakan cek status lamaran di halaman 'Lamaran Saya'.
                                        </Typography>
                                    ) : isJobExpired() ? (
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                p: 2,
                                                bgcolor: 'error.light',
                                                color: 'error.dark',
                                                borderRadius: '0.75rem',
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <AccessTime sx={{ mr: 1 }} />
                                            Lowongan ini sudah berakhir.
                                        </Typography>
                                    ) : (
                                        <Stack direction={isMobile ? "column" : "row"} spacing={2}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                size="large"
                                                onClick={handleApplyClick}
                                                fullWidth={isMobile}
                                                startIcon={<SendIcon />}
                                                sx={{
                                                    py: 1.5,
                                                    px: 4,
                                                    fontSize: '1rem',
                                                    fontWeight: 600,
                                                    borderRadius: '0.75rem',
                                                    boxShadow: '0 4px 14px 0 rgba(20, 184, 166, 0.25)',
                                                    '&:hover': {
                                                        boxShadow: '0 6px 20px 0 rgba(20, 184, 166, 0.35)',
                                                        transform: 'translateY(-2px)'
                                                    },
                                                    transition: 'all 0.3s ease'
                                                }}
                                                className="transition-all duration-300"
                                            >
                                                Lamar Sekarang
                                            </Button>

                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                size="large"
                                                fullWidth={isMobile}
                                                component={Link}
                                                href={route('candidate.jobs.index')}
                                                sx={{
                                                    py: 1.5,
                                                    fontSize: '1rem',
                                                    borderRadius: '0.75rem',
                                                }}
                                            >
                                                Lihat Lowongan Lain
                                            </Button>
                                        </Stack>
                                    )}
                                </Box>

                                <Box sx={{ mb: 4 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                        Deskripsi Pekerjaan
                                    </Typography>
                                    <Typography variant="body1" sx={{
                                        whiteSpace: 'pre-line',
                                        color: 'text.secondary',
                                        lineHeight: 1.6
                                    }}>
                                        {job?.description || 'Tidak ada deskripsi tersedia'}
                                    </Typography>
                                </Box>

                                {job?.responsibilities && (
                                    <Box sx={{ mb: 4 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                            Tanggung Jawab
                                        </Typography>
                                        <Typography variant="body1" sx={{
                                            whiteSpace: 'pre-line',
                                            color: 'text.secondary',
                                            lineHeight: 1.6
                                        }}>
                                            {job.responsibilities}
                                        </Typography>
                                    </Box>
                                )}

                                {job?.requirements && (
                                    <Box sx={{ mb: 4 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                            Persyaratan
                                        </Typography>
                                        <Typography variant="body1" sx={{
                                            whiteSpace: 'pre-line',
                                            color: 'text.secondary',
                                            lineHeight: 1.6
                                        }}>
                                            {job.requirements}
                                        </Typography>
                                    </Box>
                                )}

                                {job?.benefits && (
                                    <Box sx={{ mb: 4 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                            Tunjangan dan Manfaat
                                        </Typography>
                                        <Typography variant="body1" sx={{
                                            whiteSpace: 'pre-line',
                                            color: 'text.secondary',
                                            lineHeight: 1.6
                                        }}>
                                            {job.benefits}
                                        </Typography>
                                    </Box>
                                )}
                            </Paper>
                        </Box>

                        <Box>
                            <Paper
                                elevation={0}
                                sx={{
                                    mb: 3,
                                    borderRadius: '1rem',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    overflow: 'hidden',
                                    position: 'relative'
                                }}
                            >
                                <CardContent>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                        Tentang Perusahaan
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                        <Avatar
                                            src={job?.company?.logo}
                                            alt={job?.company?.name}
                                            variant="rounded"
                                            sx={{
                                                width: 60,
                                                height: 60,
                                                mr: 2,
                                                borderRadius: '0.75rem',
                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                border: '1px solid',
                                                borderColor: 'divider',
                                                p: 1
                                            }}
                                        >
                                            {job?.company?.name?.charAt(0)}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                                {job?.company?.name}
                                            </Typography>
                                            {job?.company?.industry && (
                                                <Typography variant="body2" color="text.secondary">
                                                    {job.company.industry}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>

                                    {job?.company?.description && (
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                mb: 3,
                                                color: 'text.secondary',
                                                lineHeight: 1.6
                                            }}
                                        >
                                            {job.company.description}
                                        </Typography>
                                    )}

                                    {job?.company?.website && (
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            href={job.company.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            fullWidth
                                            sx={{
                                                borderRadius: '0.75rem',
                                                py: 1.25,
                                                '&:hover': {
                                                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                                                }
                                            }}
                                        >
                                            Kunjungi Website
                                        </Button>
                                    )}
                                </CardContent>
                            </Paper>

                            <Paper
                                elevation={0}
                                sx={{
                                    mb: 3,
                                    borderRadius: '1rem',
                                    border: '1px solid',
                                    borderColor: 'divider'
                                }}
                            >
                                <CardContent>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                        Detail Pekerjaan
                                    </Typography>
                                    <List dense disablePadding>
                                        {job?.job_type && (
                                            <ListItem disableGutters sx={{ py: 1 }}>
                                                <ListItemIcon sx={{ minWidth: 36 }}>
                                                    <WorkOutline sx={{ color: 'primary.main' }} />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary="Tipe Pekerjaan"
                                                    secondary={job.job_type}
                                                    primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                                                    secondaryTypographyProps={{ variant: 'body1', fontWeight: 500 }}
                                                />
                                            </ListItem>
                                        )}

                                        {job?.location && (
                                            <ListItem disableGutters sx={{ py: 1 }}>
                                                <ListItemIcon sx={{ minWidth: 36 }}>
                                                    <LocationOn sx={{ color: 'primary.main' }} />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary="Lokasi"
                                                    secondary={job.location}
                                                    primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                                                    secondaryTypographyProps={{ variant: 'body1', fontWeight: 500 }}
                                                />
                                            </ListItem>
                                        )}

                                        {job?.is_salary_visible && (job?.salary_min || job?.salary_max) && (
                                            <ListItem disableGutters sx={{ py: 1 }}>
                                                <ListItemIcon sx={{ minWidth: 36 }}>
                                                    <AttachMoney sx={{ color: 'success.main' }} />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary="Rentang Gaji"
                                                    secondary={formatSalary(job?.salary_min, job?.salary_max)}
                                                    primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                                                    secondaryTypographyProps={{ variant: 'body1', fontWeight: 500, color: 'success.main' }}
                                                />
                                            </ListItem>
                                        )}

                                        {job?.vacancies && (
                                            <ListItem disableGutters sx={{ py: 1 }}>
                                                <ListItemIcon sx={{ minWidth: 36 }}>
                                                    <People sx={{ color: 'primary.main' }} />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary="Jumlah Posisi"
                                                    secondary={job.vacancies}
                                                    primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                                                    secondaryTypographyProps={{ variant: 'body1', fontWeight: 500 }}
                                                />
                                            </ListItem>
                                        )}

                                        {job?.experience_level && (
                                            <ListItem disableGutters sx={{ py: 1 }}>
                                                <ListItemIcon sx={{ minWidth: 36 }}>
                                                    <Info sx={{ color: 'primary.main' }} />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary="Pengalaman"
                                                    secondary={job.experience_level}
                                                    primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                                                    secondaryTypographyProps={{ variant: 'body1', fontWeight: 500 }}
                                                />
                                            </ListItem>
                                        )}

                                        {job?.submission_deadline && (
                                            <ListItem
                                                disableGutters
                                                sx={{
                                                    py: 1,
                                                    color: isDeadlineNear ? 'error.main' : 'inherit'
                                                }}
                                            >
                                                <ListItemIcon sx={{ minWidth: 36 }}>
                                                    <AccessTime sx={{
                                                        color: isDeadlineNear ? 'error.main' : 'primary.main'
                                                    }} />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary="Deadline"
                                                    secondary={
                                                        remainingDays > 0
                                                            ? `${remainingDays} hari lagi (${formatDeadline(job.submission_deadline)})`
                                                            : formatDeadline(job.submission_deadline)
                                                    }
                                                    primaryTypographyProps={{
                                                        variant: 'body2',
                                                        color: 'text.secondary'
                                                    }}
                                                    secondaryTypographyProps={{
                                                        // variant: 'body1 fontWeight: isDeadlineNear ? 'bold' : 500,
                                                        color: isDeadlineNear ? 'error.main' : 'text.primary'
                                                    }}
                                                />
                                            </ListItem>
                                        )}
                                    </List>
                                </CardContent>
                            </Paper>

                            {relatedJobs && relatedJobs.length > 0 && (
                                <Paper
                                    elevation={0}
                                    sx={{
                                        borderRadius: '1rem',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                    }}
                                >
                                    <CardContent>
                                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                            Lowongan Serupa
                                        </Typography>
                                        <Stack spacing={2}>
                                            {relatedJobs.map(relatedJob => (
                                                <Box
                                                    key={relatedJob.id}
                                                    component={motion.div}
                                                    whileHover={{ y: -4 }}
                                                    sx={{
                                                        border: 1,
                                                        borderColor: 'divider',
                                                        borderRadius: '0.75rem',
                                                        p: 2,
                                                        '&:hover': {
                                                            borderColor: alpha(theme.palette.primary.main, 0.3),
                                                            boxShadow: '0 4px 14px rgba(0,0,0,0.05)',
                                                        },
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                    className="transition-all duration-300"
                                                >
                                                    <Link href={route('candidate.jobs.show', relatedJob.id)} style={{ textDecoration: 'none' }}>
                                                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5, color: 'text.primary' }}>
                                                            {relatedJob?.title}
                                                        </Typography>
                                                        <Typography variant="body2" sx={{
                                                            color: 'primary.main',
                                                            fontWeight: 500,
                                                            mb: 1.5,
                                                            display: 'flex',
                                                            alignItems: 'center'
                                                        }}>
                                                            <BusinessIcon fontSize="small" sx={{ mr: 0.5, fontSize: 16 }} />
                                                            {relatedJob?.company?.name}
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                            {relatedJob?.job_type && (
                                                                <Chip
                                                                    label={relatedJob.job_type}
                                                                    size="small"
                                                                    variant="outlined"
                                                                    icon={<WorkOutline fontSize="small" />}
                                                                    sx={{ borderRadius: '0.5rem' }}
                                                                />
                                                            )}
                                                            {relatedJob?.location && (
                                                                <Chip
                                                                    label={relatedJob.location}
                                                                    size="small"
                                                                    variant="outlined"
                                                                    icon={<LocationOn fontSize="small" />}
                                                                    sx={{ borderRadius: '0.5rem' }}
                                                                />
                                                            )}
                                                        </Box>

                                                        <Box sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                            mt: 2
                                                        }}>
                                                            {relatedJob?.submission_deadline && (
                                                                <Typography
                                                                    variant="caption"
                                                                    sx={{
                                                                        color: 'text.secondary',
                                                                        display: 'flex',
                                                                        alignItems: 'center'
                                                                    }}
                                                                >
                                                                    <AccessTimeIcon sx={{ mr: 0.5, fontSize: 14 }} />
                                                                    {Math.floor((new Date(relatedJob.submission_deadline) - new Date()) / (1000 * 60 * 60 * 24)) > 0
                                                                        ? `${Math.floor((new Date(relatedJob.submission_deadline) - new Date()) / (1000 * 60 * 60 * 24))} hari lagi`
                                                                        : 'Berakhir'
                                                                    }
                                                                </Typography>
                                                            )}

                                                            <ArrowForwardIcon
                                                                fontSize="small"
                                                                sx={{
                                                                    color: 'primary.main',
                                                                    ml: 1
                                                                }}
                                                            />
                                                        </Box>
                                                    </Link>
                                                </Box>
                                            ))}
                                        </Stack>
                                    </CardContent>
                                </Paper>
                            )}
                        </Box>
                    </Box>
                </motion.div>
            </Container>

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                PaperProps={{
                    sx: { borderRadius: '0.75rem' }
                }}
            >
                <DialogTitle id="alert-dialog-title" sx={{ pb: 1 }}>
                    <Typography variant="h6" fontWeight="600">
                        Login diperlukan untuk melamar
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Anda perlu login terlebih dahulu untuk dapat melamar pekerjaan ini. Silahkan login atau daftar jika belum memiliki akun.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 2.5 }}>
                    <Button
                        onClick={handleCloseDialog}
                        color="inherit"
                        variant="outlined"
                        sx={{
                            borderRadius: '0.75rem',
                            px: 3
                        }}
                    >
                        Batal
                    </Button>
                    <Button
                        onClick={handleLoginClick}
                        color="primary"
                        variant="contained"
                        autoFocus
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
                        Login
                    </Button>
                </DialogActions>
            </Dialog>
        </Layout>
    );
}
