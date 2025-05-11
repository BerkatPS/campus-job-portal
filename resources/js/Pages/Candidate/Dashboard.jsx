import React, {useEffect, useState} from 'react';
import {Head, Link, usePage} from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Box,
    Container,
    Typography,
    Paper,
    Chip,
    Avatar,
    Button,
    Stack,
    CircularProgress,
    LinearProgress,
    alpha,
    useTheme,
    useMediaQuery,
    IconButton,
    Tooltip,
    ListItem,
    ListItemText,
    ListItemAvatar
} from '@mui/material';

import {
    Work as WorkIcon,
    Event as EventIcon,
    Schedule as ScheduleIcon,
    Person as PersonIcon,
    ArrowForward as ArrowForwardIcon,
    Edit as EditIcon,
    Search as SearchIcon,
    Business as CompanyIcon,
    LocationOn as LocationIcon,
    CalendarToday as CalendarTodayIcon,
    AssignmentTurnedIn as AssignmentTurnedInIcon,
} from '@mui/icons-material';
import Layout from '@/Components/Layout/Layout';



const Stats = ({ applications, pendingApplications, interviews }) => {
    const theme = useTheme();

    const statsData = [
        {
            icon: <AssignmentTurnedInIcon />,
            label: 'Total Lamaran',
            value: applications,
            color: theme.palette.primary.main,
            bgColor: alpha(theme.palette.primary.main, 0.1)
        },
        {
            icon: <ScheduleIcon />,
            label: 'Sedang Diproses',
            value: pendingApplications,
            color: theme.palette.warning.main,
            bgColor: alpha(theme.palette.warning.main, 0.1)
        },
        {
            icon: <EventIcon />,
            label: 'Interview Mendatang',
            value: interviews,
            color: theme.palette.info.main,
            bgColor: alpha(theme.palette.info.main, 0.1)
        }
    ];

    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
                gap: 3,
                mb: 4
            }}
        >
            {statsData.map((stat, index) => (
                <Paper
                    key={index}
                    elevation={0}
                    sx={{
                        p: 3,
                        borderRadius: '1rem',
                        border: '1px solid',
                        borderColor: 'divider',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                        }
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: '0.75rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mr: 2,
                                backgroundColor: stat.bgColor
                            }}
                        >
                            {React.cloneElement(stat.icon, {
                                sx: { fontSize: 24, color: stat.color }
                            })}
                        </Box>
                        <Typography variant="h3" fontWeight="bold">
                            {stat.value}
                        </Typography>
                    </Box>
                    <Typography variant="body1" color="text.secondary">
                        {stat.label}
                    </Typography>
                </Paper>
            ))}
        </Box>
    );
};

const RecentApplicationItem = ({ application }) => {
    const getStatusColor = (status) => {
        const lowerStatus = status?.toLowerCase() || '';
        if (lowerStatus.includes('accept') || lowerStatus.includes('diterima')) return 'success';
        if (lowerStatus.includes('reject') || lowerStatus.includes('ditolak')) return 'error';
        if (lowerStatus.includes('interview')) return 'info';
        if (lowerStatus.includes('pending') || lowerStatus.includes('diproses')) return 'warning';
        return 'default';
    };

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2,
                mb: 2,
                borderRadius: '0.75rem',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                    backgroundColor: alpha('#0f766e', 0.05)
                }
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                    src={application.job?.company?.logo}
                    sx={{
                        width: 48,
                        height: 48,
                        mr: 2,
                        backgroundColor: alpha('#0f766e', 0.1),
                        color: '#0f766e'
                    }}
                >
                    <CompanyIcon />
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" fontWeight="600">
                        {application.job?.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {application.job?.company?.name}
                    </Typography>
                    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Chip
                            label={application.status?.name}
                            size="small"
                            color={getStatusColor(application.status?.name)}
                            sx={{ borderRadius: '0.5rem' }}
                        />
                        <Typography variant="caption" color="text.secondary">
                            {application.created_at}
                        </Typography>
                    </Box>
                </Box>
                <Button
                    component={Link}
                    href={route('candidate.applications.show', application.id)}
                    variant="outlined"
                    size="small"
                    endIcon={<ArrowForwardIcon />}
                    sx={{ borderRadius: '0.75rem' }}
                >
                    Detail
                </Button>
            </Box>
        </Paper>
    );
};

const JobCard = ({ job }) => {
    return (
        <Paper
            elevation={0}
            sx={{
                height: '100%',
                borderRadius: '1rem',
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                }
            }}
        >
            <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                        src={job.company?.logo}
                        variant="rounded"
                        sx={{
                            width: 40,
                            height: 40,
                            mr: 1.5,
                            borderRadius: '0.5rem',
                            backgroundColor: alpha('#0f766e', 0.1),
                            color: '#0f766e'
                        }}
                    >
                        <CompanyIcon />
                    </Avatar>
                    <Typography variant="body2" fontWeight="medium">
                        {job.company?.name}
                    </Typography>
                </Box>

                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    {job.title}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                        {job.location}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <WorkIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                        {job.job_type}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                    <Button
                        component={Link}
                        href={route('candidate.jobs.show', job.id)}
                        variant="contained"
                        size="small"
                        fullWidth
                        sx={{ borderRadius: '0.75rem' }}
                    >
                        Lihat Detail
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
};

const UpcomingEventItem = ({ event }) => {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 2,
                mb: 2,
                borderRadius: '0.75rem',
                border: '1px solid',
                borderColor: 'divider'
            }}
        >
            <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                {event.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
                {event.job_title} • {event.company_name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarTodayIcon fontSize="small" color="primary" sx={{ mr: 0.5 }} />
                    <Typography variant="body2">{event.start_time}</Typography>
                </Box>
                <Chip
                    label={event.type}
                    size="small"
                    sx={{
                        borderRadius: '0.5rem',
                        textTransform: 'capitalize'
                    }}
                />
            </Box>
        </Paper>
    );
};

export default function Dashboard({
                                      stats = {},
                                      recentApplications = [],
                                      recommendedJobs = [],
                                      upcomingEvents = [],
                                      user = {},
                                      profile = {},
                                      resumeCompleteness = {}
                                  }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const completionPct = resumeCompleteness.percentage || 0;
    const missingItems = resumeCompleteness.missingItems || [];


    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };




    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const { auth } = usePage().props;

    useEffect(() => {
        console.log('Dashboard mounted');
        console.log('User ID:', auth?.user?.id);
        console.log('Echo available:', !!window.Echo);

        if (window.Echo && auth?.user?.id) {
            console.log('Testing private channel subscription...');
            const testChannel = window.Echo.private(`App.Models.User.${auth.user.id}`);
            testChannel.listen('.notification', (e) => {
                console.log('Notification received in dashboard:', e);
            });
        }
    }, []);

    return (
        <Layout>
            <Head title="Dashboard Kandidat" />

            <Container maxWidth="xl" sx={{ py: 3 }}>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Welcome Section */}
                    <motion.div variants={itemVariants}>
                        <Paper
                            elevation={0}
                            sx={{
                                mb: 4,
                                borderRadius: '1.5rem',
                                overflow: 'hidden',
                                border: '1px solid',
                                borderColor: 'divider',
                                background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.1) 0%, rgba(20, 184, 166, 0.05) 100%)',
                            }}
                        >
                            <Box sx={{ p: { xs: 3, md: 4 } }}>
                                <Box
                                    sx={{
                                        display: 'grid',
                                        gridTemplateColumns: { xs: '1fr', md: '8fr 4fr' },
                                        gap: 4,
                                        alignItems: 'center'
                                    }}
                                >
                                    <Box>
                                        <Typography
                                            variant="h4"
                                            fontWeight="bold"
                                            gutterBottom
                                        >
                                            Selamat Datang, {user.name}!
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            color="text.secondary"
                                            sx={{ mb: 3, maxWidth: 600 }}
                                        >
                                            Pantau status lamaran kerja, lihat rekomendasi pekerjaan, dan kelola jadwal interview Anda di satu tempat.
                                        </Typography>
                                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                            <Button
                                                component={Link}
                                                href={route('candidate.jobs.index')}
                                                variant="contained"
                                                startIcon={<SearchIcon />}
                                                size="large"
                                            >
                                                Cari Lowongan
                                            </Button>
                                            <Button
                                                component={Link}
                                                href={route('candidate.profile.edit')}
                                                variant="outlined"
                                                startIcon={<PersonIcon />}
                                                size="large"
                                            >
                                                Update Profil
                                            </Button>
                                        </Stack>
                                    </Box>
                                    {!isMobile && (
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Avatar
                                                src={user.avatar}
                                                sx={{
                                                    width: 120,
                                                    height: 120,
                                                    mx: 'auto',
                                                    border: '4px solid white',
                                                    boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
                                                }}
                                            />
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        </Paper>
                    </motion.div>

                    {/* Stats Cards */}
                    <motion.div variants={itemVariants}>
                        <Stats
                            applications={stats.applications}
                            pendingApplications={stats.pending_applications}
                            interviews={stats.interviews}
                        />
                    </motion.div>

                    {/* Main Content */}
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', lg: '8fr 4fr' },
                            gap: 3
                        }}
                    >
                        {/* Left Column */}
                        <Box>
                            {/* Recent Applications */}
                            <motion.div variants={itemVariants}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        mb: 3,
                                        borderRadius: '1rem',
                                        border: '1px solid',
                                        borderColor: 'divider'
                                    }}
                                >
                                    <Box
                                        sx={{
                                            p: 3,
                                            borderBottom: '1px solid',
                                            borderColor: 'divider',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Typography variant="h6" fontWeight="bold">
                                            Lamaran Terbaru
                                        </Typography>
                                        <Button
                                            component={Link}
                                            href={route('candidate.applications.index')}
                                            endIcon={<ArrowForwardIcon />}
                                        >
                                            Lihat Semua
                                        </Button>
                                    </Box>

                                    <Box sx={{ p: 3 }}>
                                        {recentApplications.length > 0 ? (
                                            recentApplications.map((application) => (
                                                <RecentApplicationItem
                                                    key={application.id}
                                                    application={application}
                                                />
                                            ))
                                        ) : (
                                            <Box sx={{ textAlign: 'center', py: 6 }}>
                                                <AssignmentTurnedInIcon
                                                    sx={{
                                                        fontSize: 48,
                                                        color: alpha(theme.palette.primary.main, 0.2),
                                                        mb: 2
                                                    }}
                                                />
                                                <Typography variant="body1" color="text.secondary" gutterBottom>
                                                    Anda belum melamar pekerjaan
                                                </Typography>
                                                <Button
                                                    component={Link}
                                                    href={route('candidate.jobs.index')}
                                                    variant="contained"
                                                    startIcon={<SearchIcon />}
                                                    sx={{ mt: 2 }}
                                                >
                                                    Cari Lowongan
                                                </Button>
                                            </Box>
                                        )}
                                    </Box>
                                </Paper>
                            </motion.div>

                            {/* Recommended Jobs */}
                            <motion.div variants={itemVariants}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        borderRadius: '1rem',
                                        border: '1px solid',
                                        borderColor: 'divider'
                                    }}
                                >
                                    <Box
                                        sx={{
                                            p: 3,
                                            borderBottom: '1px solid',
                                            borderColor: 'divider',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Typography variant="h6" fontWeight="bold">
                                            Rekomendasi Lowongan
                                        </Typography>
                                        <Button
                                            component={Link}
                                            href={route('candidate.jobs.index')}
                                            endIcon={<ArrowForwardIcon />}
                                        >
                                            Lihat Semua
                                        </Button>
                                    </Box>

                                    <Box sx={{ p: 3 }}>
                                        {recommendedJobs.length > 0 ? (
                                            <Box
                                                sx={{
                                                    display: 'grid',
                                                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                                                    gap: 2
                                                }}
                                            >
                                                {recommendedJobs.map((job) => (
                                                    <JobCard key={job.id} job={job} />
                                                ))}
                                            </Box>
                                        ) : (
                                            <Box sx={{ textAlign: 'center', py: 6 }}>
                                                <SearchIcon
                                                    sx={{
                                                        fontSize: 48,
                                                        color: alpha(theme.palette.primary.main, 0.2),
                                                        mb: 2
                                                    }}
                                                />
                                                <Typography variant="body1" color="text.secondary">
                                                    Belum ada rekomendasi lowongan
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                </Paper>
                            </motion.div>
                        </Box>

                        {/* Right Column */}
                        <Box>
                            {/* Profile Completion */}
                            <motion.div variants={itemVariants}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        mb: 3,
                                        borderRadius: '1rem',
                                        border: '1px solid',
                                        borderColor: 'divider'
                                    }}
                                >
                                    <Box
                                        sx={{
                                            p: 3,
                                            borderBottom: '1px solid',
                                            borderColor: 'divider'
                                        }}
                                    >
                                        <Typography variant="h6" fontWeight="bold">
                                            Kelengkapan Profil
                                        </Typography>
                                    </Box>

                                    <Box sx={{ p: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                            <Box sx={{ position: 'relative', mr: 3 }}>
                                                <CircularProgress
                                                    variant="determinate"
                                                    value={completionPct}
                                                    size={64}
                                                    thickness={4}
                                                    sx={{
                                                        color: completionPct < 50 ? 'error.main' :
                                                            completionPct < 80 ? 'warning.main' : 'success.main'
                                                    }}
                                                />
                                                <Box
                                                    sx={{
                                                        top: 0,
                                                        left: 0,
                                                        bottom: 0,
                                                        right: 0,
                                                        position: 'absolute',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}
                                                >
                                                    <Typography
                                                        variant="h6"
                                                        fontWeight="bold"
                                                        color={completionPct < 50 ? 'error.main' :
                                                            completionPct < 80 ? 'warning.main' : 'success.main'}
                                                    >
                                                        {completionPct}%
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Box>
                                                <Typography variant="subtitle1" fontWeight="600">
                                                    {completionPct === 100 ? 'Profil Lengkap' : 'Profil Perlu Dilengkapi'}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {completionPct === 100 ?
                                                        'Profil Anda telah lengkap' :
                                                        `${missingItems.length} item lagi`}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        {missingItems.length > 0 && (
                                            <Box>
                                                <Typography variant="subtitle2" gutterBottom>
                                                    Yang perlu dilengkapi:
                                                </Typography>
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                                                    {missingItems.map((item, index) => (
                                                        <Chip
                                                            key={index}
                                                            label={item}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{ borderRadius: '0.5rem' }}
                                                        />
                                                    ))}
                                                </Box>
                                                <Button
                                                    component={Link}
                                                    href={route('candidate.profile.edit')}
                                                    variant="contained"
                                                    fullWidth
                                                    startIcon={<EditIcon />}
                                                >
                                                    Lengkapi Profil
                                                </Button>
                                            </Box>
                                        )}
                                    </Box>
                                </Paper>
                            </motion.div>

                            {/* Upcoming Events */}
                            <motion.div variants={itemVariants}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        borderRadius: '1rem',
                                        border: '1px solid',
                                        borderColor: 'divider'
                                    }}
                                >
                                    <Box
                                        sx={{
                                            p: 3,
                                            borderBottom: '1px solid',
                                            borderColor: 'divider',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Typography variant="h6" fontWeight="bold">
                                            Event Mendatang
                                        </Typography>
                                        {upcomingEvents.length > 0 && (
                                            <Chip
                                                label={upcomingEvents.length}
                                                size="small"
                                                color="primary"
                                                sx={{ borderRadius: '0.5rem' }}
                                            />
                                        )}
                                    </Box>

                                    <Box sx={{ p: 3 }}>
                                        {upcomingEvents.length > 0 ? (
                                            upcomingEvents.map((event) => (
                                                <UpcomingEventItem
                                                    key={event.id}
                                                    event={event}
                                                />
                                            ))
                                        ) : (
                                            <Box sx={{ textAlign: 'center', py: 6 }}>
                                                <EventIcon
                                                    sx={{
                                                        fontSize: 48,
                                                        color: alpha(theme.palette.primary.main, 0.2),
                                                        mb: 2
                                                    }}
                                                />
                                                <Typography variant="body1" color="text.secondary">
                                                    Tidak ada event mendatang
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                </Paper>
                            </motion.div>
                        </Box>
                    </Box>
                </motion.div>
            </Container>
        </Layout>
    );
}
