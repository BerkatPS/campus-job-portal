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
    ListItemText,
    Avatar,
    LinearProgress,
    alpha,
    useTheme,
    IconButton,
    useMediaQuery,
    ListItemAvatar,
    Divider
} from '@mui/material';
import {
    Work as WorkIcon,
    Business as BusinessIcon,
    Event as EventIcon,
    Assessment as AssessmentIcon,
    ArrowForward as ArrowForwardIcon,
    Person as PersonIcon,
    Email as EmailIcon,
    Warning as WarningIcon,
    CalendarToday as CalendarTodayIcon,
    Assignment as AssignmentIcon,
    Alarm as AlarmIcon,
    Groups as GroupsIcon,
    Phone as PhoneIcon,
    People as PeopleIcon,
    CheckCircle as CheckCircleIcon,
    Schedule as ScheduleIcon,
    MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { motion } from 'framer-motion';
import Layout from "@/Components/Layout/Layout.jsx";

// Stats Card Component
function StatsCard({ icon, title, value, subtitle }) {
    const theme = useTheme();

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                height: '100%',
                borderRadius: '12px',
                border: '1px solid',
                borderColor: theme.palette.divider,
                transition: 'all 0.3s ease',
                '&:hover': {
                    boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
                    borderColor: theme.palette.primary.main,
                }
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Avatar
                    sx={{
                        width: 48,
                        height: 48,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        mr: 2,
                    }}
                >
                    {icon}
                </Avatar>

                <Box>
                    <Typography variant="body2" color="text.secondary" fontWeight="500">
                        {title}
                    </Typography>
                    <Typography variant="h5" fontWeight="700" sx={{ my: 0.5 }}>
                        {value}
                    </Typography>
                    {subtitle && (
                        <Typography variant="caption" color="text.secondary">
                            {subtitle}
                        </Typography>
                    )}
                </Box>
            </Box>
        </Paper>
    );
};

// ApplicationStatusChip Component with more subtle colors
const ApplicationStatusChip = ({ status }) => {
    const theme = useTheme();

    const getStatusColor = (statusName) => {
        switch (statusName?.toLowerCase()) {
            case 'accepted':
            case 'approved':
                return theme.palette.success.light;
            case 'rejected':
            case 'failed':
                return theme.palette.error.light;
            case 'in progress':
            case 'pending':
            case 'interview':
                return theme.palette.warning.light;
            default:
                return theme.palette.primary.light;
        }
    };

    return (
        <Chip
            label={status}
            size="small"
            sx={{
                borderRadius: '6px',
                fontWeight: 500,
                bgcolor: alpha(getStatusColor(status), 0.1),
                color: getStatusColor(status),
                border: '1px solid',
                borderColor: alpha(getStatusColor(status), 0.2)
            }}
        />
    );
};

// Recent Application Item
function RecentApplicationItem({ application }) {
    const theme = useTheme();
    const statusColors = {
        "Menunggu Review": "#FF9800",
        "Ditolak": "#F44336",
        "Diterima": "#4CAF50",
        "Diproses": "#2196F3",
        "Interview": "#9C27B0",
        "Dalam Pertimbangan": "#FF5722"
    };

    return (
        <ListItem
            alignItems="flex-start"
            sx={{
                py: 2,
                px: 3,
                transition: 'background-color 0.2s',
                '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                }
            }}
            component={Link}
            href={route('manager.applications.show', application.id)}
        >
            <ListItemAvatar>
                <Avatar
                    alt={application.candidate?.name || ''}
                    src={application.candidate?.avatar_url || '/path/to/default-avatar.jpg'}
                    sx={{
                        width: 42,
                        height: 42,
                        border: '2px solid',
                        borderColor: alpha(theme.palette.primary.main, 0.1)
                    }}
                />
            </ListItemAvatar>
            <ListItemText
                primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body1" fontWeight="600">
                            {application.candidate?.name || 'Unnamed Candidate'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {application.date_applied_formatted || ''}
                        </Typography>
                    </Box>
                }
                secondary={
                    <React.Fragment>
                        <Box component="span" sx={{ display: 'block', mb: 0.5 }}>
                            <Typography variant="body2" component="span" color="text.secondary">
                                {application.job?.title || ''} • {application.job?.location || ''}
                            </Typography>
                        </Box>
                        <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                            <Chip
                                label={application.status || ''}
                                size="small"
                                sx={{
                                    height: 22,
                                    fontSize: '0.75rem',
                                    backgroundColor: alpha(statusColors[application.status] || theme.palette.primary.main, 0.1),
                                    color: statusColors[application.status] || theme.palette.primary.main,
                                    fontWeight: 500,
                                    '& .MuiChip-label': { px: 1 }
                                }}
                            />
                            {application.next_event && (
                                <Typography variant="caption" component="span" color="text.secondary" sx={{ ml: 1 }}>
                                    • {application.next_event.type} pada {application.next_event.date_formatted}
                                </Typography>
                            )}
                        </Box>
                    </React.Fragment>
                }
            />
        </ListItem>
    );
}

// Upcoming Event Item
function UpcomingEventItem({ event }) {
    const theme = useTheme();
    const isUrgent = event.days_until <= 1;

    return (
        <ListItem
            sx={{
                py: 2,
                px: 3,
                transition: 'background-color 0.2s',
                '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                }
            }}
            component={Link}
            href={route('manager.events.show', event.id)}
        >
            <ListItemAvatar>
                <Avatar
                    sx={{
                        bgcolor: isUrgent
                            ? alpha(theme.palette.error.main, 0.1)
                            : alpha(theme.palette.primary.main, 0.1),
                        color: isUrgent
                            ? theme.palette.error.main
                            : theme.palette.primary.main
                    }}
                >
                    <CalendarTodayIcon fontSize="small" />
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body1" fontWeight="600">
                            {event.title || ''}
                        </Typography>
                        {isUrgent && (
                            <Chip
                                label="Hari Ini"
                                size="small"
                                color="error"
                                sx={{ height: 22, fontSize: '0.75rem', '& .MuiChip-label': { px: 1 } }}
                            />
                        )}
                    </Box>
                }
                secondary={
                    <React.Fragment>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                            <CalendarTodayIcon fontSize="inherit" />
                            <Typography variant="body2" component="span" color="text.secondary">
                                {event.date_formatted || ''} • {event.time_formatted || ''}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <PersonIcon fontSize="inherit" />
                            <Typography variant="body2" component="span" color="text.secondary">
                                {event.application?.candidate?.name || ''}
                            </Typography>
                        </Box>
                    </React.Fragment>
                }
            />
        </ListItem>
    );
}

// Expiring Job Item
function ExpiringJobItem({ job }) {
    const theme = useTheme();
    const daysLeft = job.days_until_expires;
    const isUrgent = daysLeft <= 3;

    return (
        <ListItem
            sx={{
                py: 2,
                px: 3,
                transition: 'background-color 0.2s',
                '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                }
            }}
            component={Link}
            href={route('manager.jobs.edit', job.id)}
        >
            <ListItemAvatar>
                <Avatar
                    sx={{
                        bgcolor: isUrgent
                            ? alpha(theme.palette.error.main, 0.1)
                            : alpha(theme.palette.warning.main, 0.1),
                        color: isUrgent
                            ? theme.palette.error.main
                            : theme.palette.warning.main
                    }}
                >
                    <WarningIcon fontSize="small" />
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body1" fontWeight="600">
                            {job.title}
                        </Typography>
                        <Chip
                            label={`${daysLeft} hari lagi`}
                            size="small"
                            sx={{
                                height: 22,
                                fontSize: '0.75rem',
                                backgroundColor: alpha(
                                    isUrgent ? theme.palette.error.main : theme.palette.warning.main,
                                    0.1
                                ),
                                color: isUrgent ? theme.palette.error.main : theme.palette.warning.main,
                                fontWeight: 500,
                                '& .MuiChip-label': { px: 1 }
                            }}
                        />
                    </Box>
                }
                secondary={
                    <Typography variant="body2" color="text.secondary">
                        {job.applications_count} lamaran • {job.location}
                    </Typography>
                }
            />
        </ListItem>
    );
}

// Team Member Item
function TeamMemberItem({ member }) {
    const theme = useTheme();

    return (
        <ListItem
            sx={{
                py: 2,
                px: 3,
                transition: 'background-color 0.2s',
                '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                }
            }}
        >
            <ListItemAvatar>
                <Avatar
                    alt={member.name}
                    src={member.avatar_url || '/path/to/default-avatar.jpg'}
                    sx={{
                        width: 40,
                        height: 40,
                        border: '2px solid',
                        borderColor: alpha(theme.palette.primary.main, 0.1)
                    }}
                />
            </ListItemAvatar>
            <ListItemText
                primary={
                    <Typography variant="body1" fontWeight="600">
                        {member.name}
                    </Typography>
                }
                secondary={
                    <Typography variant="body2" color="text.secondary">
                        {member.role || 'Team Member'} • {member.email}
                    </Typography>
                }
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton size="small" sx={{ color: theme.palette.text.secondary }}>
                    <EmailIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" sx={{ color: theme.palette.text.secondary }}>
                    <PhoneIcon fontSize="small" />
                </IconButton>
            </Box>
        </ListItem>
    );
}

export default function Dashboard({ stats, recent_applications, upcoming_events, job_statuses }) {
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Layout>
            <Head title="Manager Dashboard" />
            <Container maxWidth="xl">
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Manager Dashboard
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Overview tentang lowongan kerja dan pelamar pada perusahaan Anda
                    </Typography>
                </Box>

                {/* Stats Cards */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 4 }}>
                    <Box sx={{ flex: 1 }}>
                        <StatsCard
                            icon={<PeopleIcon />}
                            title="Total Pelamar"
                            value={stats?.total_applicants || 0}
                            subtitle="Pelamar aktif saat ini"
                        />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <StatsCard
                            icon={<WorkIcon />}
                            title="Lowongan Aktif"
                            value={stats?.active_jobs || 0}
                            subtitle="Lowongan yang masih dibuka"
                        />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <StatsCard
                            icon={<ScheduleIcon />}
                            title="Jadwal Interview"
                            value={stats?.upcoming_interviews || 0}
                            subtitle="Dalam 7 hari ke depan"
                        />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <StatsCard
                            icon={<CheckCircleIcon />}
                            title="Pelamar Diterima"
                            value={stats?.accepted_applicants || 0}
                            subtitle="Dalam 30 hari terakhir"
                        />
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
                    {/* Recent Applications and Upcoming Events */}
                    <Box sx={{ flex: 2 }}>
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
                            {/* Recent Applications */}
                            <Paper
                                elevation={0}
                                sx={{
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    border: '1px solid',
                                    borderColor: theme.palette.divider,
                                    flex: 1,
                                }}
                            >
                                <Box sx={{ px: 3, py: 2, borderBottom: '1px solid', borderColor: theme.palette.divider }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="h6" fontWeight="600">
                                            Aplikasi Terbaru
                                        </Typography>
                                        <Button
                                            component={Link}
                                            href={route('manager.applications.index')}
                                            endIcon={<ArrowForwardIcon />}
                                            size="small"
                                        >
                                            Lihat Semua
                                        </Button>
                                    </Box>
                                </Box>
                                <List disablePadding>
                                    {recent_applications && recent_applications.length > 0 ? (
                                        recent_applications.map((application, index) => (
                                            <React.Fragment key={application.id}>
                                                <RecentApplicationItem application={application} />
                                                {index < recent_applications.length - 1 && (
                                                    <Divider component="li" variant="inset" />
                                                )}
                                            </React.Fragment>
                                        ))
                                    ) : (
                                        <ListItem>
                                            <ListItemText
                                                primary={
                                                    <Typography variant="body2" color="text.secondary" align="center">
                                                        Tidak ada aplikasi terbaru
                                                    </Typography>
                                                }
                                            />
                                        </ListItem>
                                    )}
                                </List>
                            </Paper>

                            {/* Upcoming Events */}
                            <Paper
                                elevation={0}
                                sx={{
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    border: '1px solid',
                                    borderColor: theme.palette.divider,
                                    flex: 1,
                                }}
                            >
                                <Box sx={{ px: 3, py: 2, borderBottom: '1px solid', borderColor: theme.palette.divider }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="h6" fontWeight="600">
                                            Jadwal Mendatang
                                        </Typography>
                                        <Button
                                            component={Link}
                                            href={route('manager.events.index')}
                                            endIcon={<ArrowForwardIcon />}
                                            size="small"
                                        >
                                            Lihat Semua
                                        </Button>
                                    </Box>
                                </Box>
                                <List disablePadding>
                                    {upcoming_events && upcoming_events.length > 0 ? (
                                        upcoming_events.map((event, index) => (
                                            <React.Fragment key={event.id}>
                                                <UpcomingEventItem event={event} />
                                                {index < upcoming_events.length - 1 && (
                                                    <Divider component="li" variant="inset" />
                                                )}
                                            </React.Fragment>
                                        ))
                                    ) : (
                                        <ListItem>
                                            <ListItemText
                                                primary={
                                                    <Typography variant="body2" color="text.secondary" align="center">
                                                        Tidak ada jadwal mendatang
                                                    </Typography>
                                                }
                                            />
                                        </ListItem>
                                    )}
                                </List>
                            </Paper>
                        </Box>

                        {/* Job Status */}
                        <Paper
                            elevation={0}
                            sx={{
                                borderRadius: 2,
                                overflow: 'hidden',
                                border: '1px solid',
                                borderColor: theme.palette.divider,
                            }}
                        >
                            <Box sx={{ px: 3, py: 2, borderBottom: '1px solid', borderColor: theme.palette.divider }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="h6" fontWeight="600">
                                        Status Lowongan Kerja
                                    </Typography>
                                    <Button
                                        component={Link}
                                        href={route('manager.jobs.index')}
                                        endIcon={<ArrowForwardIcon />}
                                        size="small"
                                    >
                                        Kelola Lowongan
                                    </Button>
                                </Box>
                            </Box>
                            <List disablePadding>
                                {job_statuses && job_statuses.length > 0 ? (
                                    job_statuses.map((job, index) => (
                                        <React.Fragment key={job.id}>
                                            <ListItem
                                                alignItems="flex-start"
                                                sx={{
                                                    py: 2,
                                                    px: 3,
                                                    transition: 'background-color 0.2s',
                                                    '&:hover': {
                                                        backgroundColor: alpha(theme.palette.primary.main, 0.04),
                                                    }
                                                }}
                                                component={Link}
                                                href={route('manager.jobs.show', job.id)}
                                            >
                                                <ListItemAvatar>
                                                    <Avatar
                                                        sx={{
                                                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                            color: theme.palette.primary.main
                                                        }}
                                                    >
                                                        <WorkIcon />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <Typography variant="body1" fontWeight="600">
                                                                {job.title || ''}
                                                            </Typography>
                                                            <Chip
                                                                label={job.status || ''}
                                                                color={job.status === "Dibuka" ? "success" : "default"}
                                                                size="small"
                                                                sx={{ height: 22, fontSize: '0.75rem', '& .MuiChip-label': { px: 1 } }}
                                                            />
                                                        </Box>
                                                    }
                                                    secondary={
                                                        <React.Fragment>
                                                            <Box component="span" sx={{ display: 'block', mb: 0.5 }}>
                                                                <Typography variant="body2" component="span" color="text.secondary">
                                                                    {job.location || ''} • {job.type || ''}
                                                                </Typography>
                                                            </Box>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                <Box component="span">
                                                                    <Typography variant="body2" component="span" color="text.secondary">
                                                                        {job.applicants_count || 0} Pelamar
                                                                    </Typography>
                                                                    {job.deadline_formatted && (
                                                                        <Typography variant="body2" component="span" color="text.secondary">
                                                                            • Deadline: {job.deadline_formatted}
                                                                        </Typography>
                                                                    )}
                                                                </Box>
                                                                <LinearProgress
                                                                    variant="determinate"
                                                                    value={job.completion_percentage || 0}
                                                                    sx={{
                                                                        width: '100px',
                                                                        ml: 2,
                                                                        height: 6,
                                                                        borderRadius: 3,
                                                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                                        '& .MuiLinearProgress-bar': {
                                                                            borderRadius: 3
                                                                        }
                                                                    }}
                                                                />
                                                            </Box>
                                                        </React.Fragment>
                                                    }
                                                />
                                            </ListItem>
                                            {index < job_statuses.length - 1 && (
                                                <Divider component="li" variant="inset" />
                                            )}
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <ListItem>
                                        <ListItemText
                                            primary={
                                                <Typography variant="body2" color="text.secondary" align="center">
                                                    Tidak ada lowongan aktif
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                )}
                            </List>
                        </Paper>
                    </Box>

                    {/* Quick Actions */}
                    <Box sx={{ flex: 1 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                borderRadius: 2,
                                overflow: 'hidden',
                                border: '1px solid',
                                borderColor: theme.palette.divider,
                                height: '100%',
                            }}
                        >
                            <Box sx={{ px: 3, py: 2, borderBottom: '1px solid', borderColor: theme.palette.divider }}>
                                <Typography variant="h6" fontWeight="600">
                                    Aksi Cepat
                                </Typography>
                            </Box>
                            <Box sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <Button
                                        component={Link}
                                        href={route('manager.jobs.create')}
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        startIcon={<WorkIcon />}
                                        sx={{
                                            py: 1.5,
                                            bgcolor: theme.palette.primary.main,
                                            '&:hover': {
                                                bgcolor: theme.palette.primary.dark,
                                            }
                                        }}
                                    >
                                        Tambah Lowongan Baru
                                    </Button>

                                    <Button
                                        component={Link}
                                        href={route('manager.applications.index')}
                                        variant="outlined"
                                        color="primary"
                                        fullWidth
                                        startIcon={<PeopleIcon />}
                                        sx={{ py: 1.5 }}
                                    >
                                        Kelola Pelamar
                                    </Button>

                                    <Button
                                        component={Link}
                                        href={route('manager.events.create')}
                                        variant="outlined"
                                        color="primary"
                                        fullWidth
                                        startIcon={<EventIcon />}
                                        sx={{ py: 1.5 }}
                                    >
                                        Jadwalkan Event
                                    </Button>

                                    {/*<Button*/}
                                    {/*    component={Link}*/}
                                    {/*    href={route('manager.reports.index')}*/}
                                    {/*    variant="outlined"*/}
                                    {/*    color="primary"*/}
                                    {/*    fullWidth*/}
                                    {/*    startIcon={<AssessmentIcon />}*/}
                                    {/*    sx={{ py: 1.5 }}*/}
                                    {/*>*/}
                                    {/*    Lihat Laporan*/}
                                    {/*</Button>*/}
                                </Box>

                                <Divider sx={{ my: 3 }} />

                                <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                                    Informasi Kontak
                                </Typography>

                                <Box sx={{ mb: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                        <Avatar
                                            sx={{
                                                width: 36,
                                                height: 36,
                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                color: theme.palette.primary.main,
                                                mr: 2
                                            }}
                                        >
                                            <BusinessIcon fontSize="small" />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body2" fontWeight="500">
                                                PT Teknologi Masa Depan
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Perusahaan Anda
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ pl: 7, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <EmailIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1.5 }} />
                                            <Typography variant="body2" color="text.secondary">
                                                contact@tekmasdep.com
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <PhoneIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1.5 }} />
                                            <Typography variant="body2" color="text.secondary">
                                                (021) 5578-9000
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>

                                <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                                    Pengingat Penting
                                </Typography>

                                <Box sx={{ display: 'flex', p: 2, bgcolor: alpha(theme.palette.warning.main, 0.08), borderRadius: 1.5 }}>
                                    <WarningIcon sx={{ color: theme.palette.warning.main, mr: 2 }} />
                                    <Box>
                                        <Typography variant="body2" fontWeight="500" gutterBottom>
                                            Pastikan untuk meninjau semua pelamar
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Terdapat {stats?.pending_applications || 0} aplikasi yang belum ditinjau dan menunggu respons Anda.
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Paper>
                    </Box>
                </Box>
            </Container>
        </Layout>
    );
}
