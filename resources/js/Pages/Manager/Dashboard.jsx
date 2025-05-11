import React from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    Container,
    Typography,
    Box,
    Paper,
    Chip,
    Button,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Avatar,
    Stack,
    LinearProgress,
    alpha,
    useTheme,
    Card,
    CardContent,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    Work as WorkIcon,
    Assessment as AssessmentIcon,
    Event as EventIcon,
    Warning as WarningIcon,
    People as PeopleIcon,
    CheckCircle as CheckCircleIcon,
    Schedule as ScheduleIcon,
    Email as EmailIcon,
    ArrowForward as ArrowForwardIcon,
    CalendarMonth as CalendarMonthIcon,
    Person as PersonIcon,
    Business as BusinessIcon,
    AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { motion } from 'framer-motion';
import Layout from "@/Components/Layout/Layout.jsx";

// StatsCard Component
const StatsCard = ({ icon, title, value, color, subtitle, additional }) => {
    const theme = useTheme();
    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                borderRadius: '0.75rem',
                border: '1px solid',
                borderColor: alpha(color, 0.2),
                background: `linear-gradient(135deg, rgba(255,255,255,1) 0%, ${alpha(color, 0.03)} 100%)`,
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
                }
            }}
        >
            <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                    sx={{
                        width: 56,
                        height: 56,
                        borderRadius: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: alpha(color, 0.1),
                        color: color
                    }}
                >
                    {icon}
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h3" fontWeight="bold" color={color}>
                        {value}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        {title}
                    </Typography>
                    {subtitle && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            {subtitle}
                        </Typography>
                    )}
                </Box>
            </Stack>
            {additional && (
                <Box sx={{ mt: 2 }}>{additional}</Box>
            )}
        </Paper>
    );
};

// ApplicationStatusChip Component
const ApplicationStatusChip = ({ status }) => {
    const getStatusColor = (statusName) => {
        switch (statusName?.toLowerCase()) {
            case 'accepted':
            case 'approved':
                return 'success';
            case 'rejected':
            case 'failed':
                return 'error';
            case 'in progress':
            case 'pending':
            case 'interview':
                return 'warning';
            default:
                return 'primary';
        }
    };

    return (
        <Chip
            label={status}
            size="small"
            color={getStatusColor(status)}
            sx={{ borderRadius: '0.5rem', fontWeight: 500 }}
        />
    );
};

// RecentApplicationItem Component
const RecentApplicationItem = ({ application }) => {
    return (
        <ListItem
            sx={{
                p: 2,
                mb: 1,
                borderRadius: '0.75rem',
                '&:hover': {
                    bgcolor: alpha('#0f766e', 0.05)
                }
            }}
        >
            <ListItemIcon>
                <Avatar
                    sx={{
                        width: 40,
                        height: 40,
                        bgcolor: alpha('#0f766e', 0.1),
                        color: '#0f766e'
                    }}
                >
                    <PersonIcon />
                </Avatar>
            </ListItemIcon>
            <ListItemText
                primary={
                    <Stack direction="row" alignItems="center" spacing={1} justifyContent="space-between">
                        <Typography variant="subtitle1" fontWeight="600">
                            {application.user.name}
                        </Typography>
                        <ApplicationStatusChip status={application.status.name} />
                    </Stack>
                }
                secondary={
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
                        <BusinessIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                            {application.job.title} • {application.job.company.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
                            {format(new Date(application.created_at), 'd MMM yyyy', { locale: id })}
                        </Typography>
                    </Stack>
                }
            />
        </ListItem>
    );
};

// UpcomingEventItem Component
const UpcomingEventItem = ({ event }) => {
    const getEventTypeColor = (type) => {
        switch (type?.toLowerCase()) {
            case 'interview':
                return '#0369a1';
            case 'test':
                return '#7c3aed';
            case 'meeting':
                return '#059669';
            default:
                return '#6366f1';
        }
    };

    return (
        <ListItem
            sx={{
                p: 2,
                mb: 1,
                borderRadius: '0.75rem',
                '&:hover': {
                    bgcolor: alpha('#0f766e', 0.05)
                }
            }}
        >
            <ListItemIcon>
                <Avatar
                    sx={{
                        width: 40,
                        height: 40,
                        bgcolor: alpha(getEventTypeColor(event.type), 0.1),
                        color: getEventTypeColor(event.type)
                    }}
                >
                    <EventIcon />
                </Avatar>
            </ListItemIcon>
            <ListItemText
                primary={
                    <Stack direction="row" alignItems="center" spacing={1} justifyContent="space-between">
                        <Typography variant="subtitle1" fontWeight="600">
                            {event.title}
                        </Typography>
                        <Chip
                            label={event.type}
                            size="small"
                            sx={{
                                borderRadius: '0.5rem',
                                bgcolor: alpha(getEventTypeColor(event.type), 0.1),
                                color: getEventTypeColor(event.type),
                                fontWeight: 500
                            }}
                        />
                    </Stack>
                }
                secondary={
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 0.5 }}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <PersonIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                                {event.candidate?.name || '-'}
                            </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <WorkIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                                {event.job.title}
                            </Typography>
                        </Stack>
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
                            {format(new Date(event.start_time), 'd MMM yyyy, HH:mm', { locale: id })}
                        </Typography>
                    </Stack>
                }
            />
        </ListItem>
    );
};

// ExpiringJobItem Component
const ExpiringJobItem = ({ job }) => {
    const getDaysRemainingColor = (days) => {
        if (days < 0) return 'error';
        if (days <= 2) return 'error';
        if (days <= 5) return 'warning';
        return 'success';
    };

    const getDaysRemainingText = (days) => {
        if (days < 0) return 'Berakhir';
        if (days === 0) return 'Berakhir hari ini';
        if (days === 1) return '1 hari lagi';
        return `${days} hari lagi`;
    };

    return (
        <ListItem
            sx={{
                p: 2,
                mb: 1,
                borderRadius: '0.75rem',
                '&:hover': {
                    bgcolor: alpha('#0f766e', 0.05)
                }
            }}
        >
            <ListItemIcon>
                <Avatar
                    sx={{
                        width: 40,
                        height: 40,
                        bgcolor: alpha('#dc2626', 0.1),
                        color: '#dc2626'
                    }}
                >
                    <WarningIcon />
                </Avatar>
            </ListItemIcon>
            <ListItemText
                primary={
                    <Stack direction="row" alignItems="center" spacing={1} justifyContent="space-between">
                        <Typography variant="subtitle1" fontWeight="600">
                            {job.title}
                        </Typography>
                        <Chip
                            label={getDaysRemainingText(job.days_remaining)}
                            size="small"
                            color={getDaysRemainingColor(job.days_remaining)}
                            sx={{ borderRadius: '0.5rem', fontWeight: 500 }}
                        />
                    </Stack>
                }
                secondary={
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 0.5 }}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <BusinessIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                                {job.company.name}
                            </Typography>
                        </Stack>
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
                            Berakhir: {format(new Date(job.submission_deadline), 'd MMM yyyy', { locale: id })}
                        </Typography>
                    </Stack>
                }
            />
        </ListItem>
    );
};

export default function Dashboard({
                                      stats = {},
                                      recentApplications = [],
                                      upcomingEvents = [],
                                      expiringJobs = []
                                  }) {
    const theme = useTheme();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.3 }
        }
    };

    return (
        <Layout>
            <Head title="Manager Dashboard" />

            <Container maxWidth="xl" sx={{ py: 3 }}>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Top Stats */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' }, gap: 3, mb: 4 }}>
                        <motion.div variants={itemVariants}>
                            <StatsCard
                                icon={<WorkIcon />}
                                title="Pekerjaan Aktif"
                                value={stats.activeJobsCount || 0}
                                color={theme.palette.primary.main}
                            />
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <StatsCard
                                icon={<PeopleIcon />}
                                title="Total Lamaran"
                                value={stats.totalApplicationsCount || 0}
                                color={theme.palette.info.main}
                            />
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <StatsCard
                                icon={<EventIcon />}
                                value={stats.activeJobsCount ? Math.round(stats.totalApplicationsCount / stats.activeJobsCount) : 0}
                                color={theme.palette.success.main}
                                subtitle="Per pekerjaan"
                            />
                        </motion.div>
                    </Box>

                    {/* Applications by Status */}
                    {stats.applicationsByStatus && stats.applicationsByStatus.length > 0 && (
                        <motion.div variants={itemVariants}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    borderRadius: '0.75rem',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    mb: 4
                                }}
                            >
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    Status Lamaran
                                </Typography>
                                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2 }}>
                                    {stats.applicationsByStatus.map((statusData, index) => (
                                        <Paper
                                            key={index}
                                            elevation={0}
                                            sx={{
                                                p: 2,
                                                borderRadius: '0.5rem',
                                                textAlign: 'center',
                                                border: '1px solid',
                                                borderColor: alpha(statusData.color || '#0f766e', 0.3),
                                                bgcolor: alpha(statusData.color || '#0f766e', 0.05)
                                            }}
                                        >
                                            <Typography variant="h4" fontWeight="bold" color={statusData.color || 'primary.main'}>
                                                {statusData.count}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {statusData.status}
                                            </Typography>
                                        </Paper>
                                    ))}
                                </Box>
                            </Paper>
                        </motion.div>
                    )}

                    {/* Content Grid */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3 }}>
                        {/* Recent Applications */}
                        <motion.div variants={itemVariants}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    borderRadius: '0.75rem',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    height: '100%'
                                }}
                            >
                                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                                    <Typography variant="h6" fontWeight="bold">
                                        Lamaran Terbaru
                                    </Typography>
                                    <Button
                                        component={Link}
                                        href={route('manager.applications.index')}
                                        endIcon={<ArrowForwardIcon />}
                                        sx={{ borderRadius: '0.5rem' }}
                                    >
                                        Lihat Semua
                                    </Button>
                                </Stack>

                                {recentApplications.length > 0 ? (
                                    <List disablePadding>
                                        {recentApplications.map((application) => (
                                            <RecentApplicationItem
                                                key={application.id}
                                                application={application}
                                            />
                                        ))}
                                    </List>
                                ) : (
                                    <Box sx={{ textAlign: 'center', py: 4 }}>
                                        <PeopleIcon sx={{ fontSize: 64, color: alpha(theme.palette.primary.main, 0.2), mb: 2 }} />
                                        <Typography variant="body1" color="text.secondary">
                                            Belum ada lamaran terbaru
                                        </Typography>
                                    </Box>
                                )}
                            </Paper>
                        </motion.div>

                        {/* Upcoming Events */}
                        <motion.div variants={itemVariants}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    borderRadius: '0.75rem',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    height: '100%'
                                }}
                            >
                                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                                    <Typography variant="h6" fontWeight="bold">
                                        Event Mendatang
                                    </Typography>
                                    <Button
                                        component={Link}
                                        href={route('manager.events.index')}
                                        endIcon={<ArrowForwardIcon />}
                                        sx={{ borderRadius: '0.5rem' }}
                                    >
                                        Lihat Semua
                                    </Button>
                                </Stack>

                                {upcomingEvents.length > 0 ? (
                                    <List disablePadding>
                                        {upcomingEvents.map((event) => (
                                            <UpcomingEventItem
                                                key={event.id}
                                                event={event}
                                            />
                                        ))}
                                    </List>
                                ) : (
                                    <Box sx={{ textAlign: 'center', py: 4 }}>
                                        <EventIcon sx={{ fontSize: 64, color: alpha(theme.palette.primary.main, 0.2), mb: 2 }} />
                                        <Typography variant="body1" color="text.secondary">
                                            Belum ada event mendatang
                                        </Typography>
                                    </Box>
                                )}
                            </Paper>
                        </motion.div>
                    </Box>

                    {/* Expiring Jobs */}
                    {expiringJobs.length > 0 && (
                        <motion.div variants={itemVariants}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    borderRadius: '0.75rem',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    mt: 3,
                                    bgcolor: alpha('#fef2f2', 0.7)
                                }}
                            >
                                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <WarningIcon color="error" sx={{ mr: 1 }} />
                                        <Typography variant="h6" fontWeight="bold">
                                            Pekerjaan Segera Berakhir
                                        </Typography>
                                    </Box>
                                    <Button
                                        component={Link}
                                        href={route('manager.jobs.index')}
                                        endIcon={<ArrowForwardIcon />}
                                        sx={{ borderRadius: '0.5rem' }}
                                    >
                                        Lihat Semua
                                    </Button>
                                </Stack>

                                <List disablePadding>
                                    {expiringJobs.map((job) => (
                                        <ExpiringJobItem
                                            key={job.id}
                                            job={job}
                                        />
                                    ))}
                                </List>
                            </Paper>
                        </motion.div>
                    )}
                </motion.div>
            </Container>
        </Layout>
    );
}
