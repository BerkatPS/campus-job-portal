import React from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    Box,
    Container,
    Paper,
    Typography,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Chip,
    Button,
    Card,
    CardContent,
    useTheme,
    useMediaQuery,
    IconButton,
} from '@mui/material';
import {
    Assignment as AssignmentIcon,
    BusinessCenter as BusinessCenterIcon,
    CalendarToday as CalendarTodayIcon,
    Star as StarIcon,
    Work as WorkIcon,
    LocationOn as LocationOnIcon,
    AttachMoney as AttachMoneyIcon,
    DateRange as DateRangeIcon,
    ArrowForward as ArrowForwardIcon,
    PlaylistAddCheck as PlaylistAddCheckIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Layout from '@/Components/Layout/Layout.jsx';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

// Stats Card Component
function StatsCard({ icon, title, value, subtitle }) {
    return (
        <Card elevation={0} sx={{
            height: '100%',
            p: 2,
            border: '1px solid rgba(0, 0, 0, 0.12)',
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)',
            },
        }}>
            <CardContent sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                p: 0,
                '&:last-child': {
                    pb: 0
                }
            }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 1.5,
                        color: 'primary.main',
                        bgcolor: 'primary.lighter',
                        p: 1,
                        borderRadius: 1.5
                    }}
                >
                    {icon}
                </Box>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                    {value}
                </Typography>
                <Typography variant="body1" color="text.primary" fontWeight={500}>
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {subtitle}
                </Typography>
            </CardContent>
        </Card>
    );
}

// Recent Application Item
function RecentApplicationItem({ application }) {
    return (
        <ListItem
            alignItems="flex-start"
            sx={{
                py: 1.5,
                px: 2,
                '&:hover': { bgcolor: 'background.paper' },
                borderRadius: 1
            }}
        >
            <ListItemAvatar>
                <Avatar
                    alt={application.job.company.name}
                    src={application.job.company.logo_url}
                    sx={{ width: 40, height: 40, borderRadius: 1 }}
                >
                    {application.job.company.name.charAt(0)}
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={
                    <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 0.5 }}>
                        {application.job.title}
                    </Typography>
                }
                secondary={
                    <React.Fragment>
                        <Typography component="span" variant="body2" sx={{ display: 'block', color: 'text.primary', mb: 0.5 }}>
                            {application.job.company.name} • {application.job.location}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                            <Chip
                                label={application.status}
                                size="small"
                                sx={{
                                    bgcolor: application.status_color || 'primary.lighter',
                                    color: 'primary.main',
                                    fontSize: '0.75rem'
                                }}
                            />
                            <Typography variant="caption" color="text.secondary">
                                {application.date_applied_formatted}
                            </Typography>
                        </Box>

                        {application.next_event && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, bgcolor: 'info.lighter', p: 0.8, borderRadius: 1 }}>
                                <CalendarTodayIcon sx={{ fontSize: 14, mr: 0.5, color: 'info.main' }} />
                                <Typography variant="caption" sx={{ color: 'info.main' }}>
                                    {application.next_event.type}: {application.next_event.date_formatted}
                                </Typography>
                            </Box>
                        )}
                    </React.Fragment>
                }
            />
        </ListItem>
    );
}

// Recommended Job Item
function RecommendedJobItem({ job }) {
    return (
        <ListItem
            alignItems="flex-start"
            sx={{
                py: 1.5,
                px: 2,
                '&:hover': { bgcolor: 'background.paper' },
                borderRadius: 1,
                mb: 1
            }}
            // href={route('jobs.show', job.id)}
        >
            <ListItemAvatar>
                <Avatar
                    alt={job.company.name}
                    src={job.company.logo_url}
                    sx={{ width: 40, height: 40, borderRadius: 1 }}
                >
                    {job.company.name.charAt(0)}
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={
                    <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 0.5 }}>
                        {job.title}
                    </Typography>
                }
                secondary={
                    <React.Fragment>
                        <Typography component="span" variant="body2" sx={{ display: 'block', color: 'text.primary', mb: 0.5 }}>
                            {job.company.name} • {job.location}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <AttachMoneyIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                                <Typography variant="caption" color="text.secondary">
                                    {job.salary_formatted}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <DateRangeIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                                <Typography variant="caption" color="text.secondary">
                                    {job.deadline_formatted}
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                            <Chip
                                label={`${job.match_percentage}% Match`}
                                size="small"
                                sx={{
                                    bgcolor: 'success.lighter',
                                    color: 'success.main',
                                    fontSize: '0.75rem'
                                }}
                            />
                            <Typography variant="caption" sx={{
                                color: job.days_remaining <= 3 ? 'error.main' : 'text.secondary',
                                fontWeight: job.days_remaining <= 3 ? 'medium' : 'regular'
                            }}>
                                {job.days_remaining} hari tersisa
                            </Typography>
                        </Box>
                    </React.Fragment>
                }
            />
        </ListItem>
    );
}

// Upcoming Event Item with human readable time
function UpcomingEventItem({ event }) {
    // Format countdown in a human-readable way
    const formatCountdown = (daysUntil) => {
        if (daysUntil === 0) {
            // For events happening today, we'd need hours information
            return "Hari ini";
        } else if (daysUntil === 1) {
            return "1 hari lagi";
        } else {
            return `${daysUntil} hari lagi`;
        }
    };

    return (
        <ListItem
            alignItems="flex-start"
            sx={{
                py: 1.5,
                px: 2,
                '&:hover': { bgcolor: 'background.paper' },
                borderRadius: 1,
                mb: 1
            }}
        >
            <ListItemAvatar>

            </ListItemAvatar>
            <ListItemText
                primary={
                    <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 0.5 }}>
                        {event.type}
                    </Typography>
                }
                secondary={
                    <React.Fragment>
                        <Typography component="span" variant="body2" sx={{ display: 'block', color: 'text.primary', mb: 0.5 }}>
                            {event.job.title} • {event.job.company.name}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <CalendarTodayIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                                {event.date_formatted}
                            </Typography>
                        </Box>
                    </React.Fragment>
                }
            />
        </ListItem>
    );
}

export default function Dashboard({ auth, stats, applications, recommendations, upcomingEvents, upcomingEventsCount, profileCompleteness }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

    // Ensure arrays exist to prevent errors
    const safeApplications = applications || [];
    const safeRecommendations = recommendations || [];
    const safeUpcomingEvents = upcomingEvents || [];
    const safeMonthlyApps = stats?.monthlyApplications || [];
    const safeAppsByStatus = stats?.applicationsByStatus || [];

    // Colors for pie chart
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#FF6B6B'];

    return (
        <Layout>
            <Head title="Dashboard Kandidat" />

            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Selamat datang kembali, {auth.user.name}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Berikut adalah ringkasan aktivitas lamaran dan rekomendasi pekerjaan untuk Anda
                    </Typography>
                </Box>

                {/* Stats Cards */}
                <Box sx={{
                    mb: 4,
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 3
                }}>
                    <Box sx={{
                        width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' }
                    }}>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <StatsCard
                                icon={<AssignmentIcon sx={{ fontSize: 24 }} />}
                                title="Total Lamaran"
                                value={stats.totalApplications}
                                subtitle="0 masih aktif"
                            />
                        </motion.div>
                    </Box>

                    <Box sx={{
                        width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' }
                    }}>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                        >
                            <StatsCard
                                icon={<PlaylistAddCheckIcon sx={{ fontSize: 24 }} />}
                                title="Tingkat Keberhasilan"
                                value={`${stats.successRate}%`}
                                subtitle="dari 0 lamaran selesai"
                            />
                        </motion.div>
                    </Box>

                    <Box sx={{
                        width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' }
                    }}>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                        >
                            <StatsCard
                                icon={<CalendarTodayIcon sx={{ fontSize: 24 }} />}
                                title="Jadwal Mendatang"
                                value={upcomingEventsCount || 0}
                                subtitle="dalam 7 hari ke depan"
                            />
                        </motion.div>
                    </Box>

                    <Box sx={{
                        width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' }
                    }}>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.3 }}
                        >
                            <StatsCard
                                icon={<StarIcon sx={{ fontSize: 24 }} />}
                                title="Rekomendasi"
                                value={safeRecommendations.length}
                                subtitle="pekerjaan untuk Anda"
                            />
                        </motion.div>
                    </Box>
                </Box>

                {/* Main Content */}
                <Box sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 4
                }}>
                    {/* Charts - Left Section */}
                    <Box sx={{
                        width: { xs: '100%', lg: 'calc(66.666% - 16px)' }
                    }}>
                        <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid rgba(0, 0, 0, 0.12)' }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium' }}>
                                Status Lamaran
                            </Typography>

                            {safeAppsByStatus && safeAppsByStatus.length > 0 ? (
                                <Box sx={{ height: 300, mt: 2 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={safeAppsByStatus}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                outerRadius={100}
                                                fill="#8884d8"
                                                dataKey="count"
                                                nameKey="status"
                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            >
                                                {safeAppsByStatus.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Box>
                            ) : (
                                <Box sx={{
                                    height: 300,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    bgcolor: 'background.paper',
                                    borderRadius: 1
                                }}>
                                    <Typography variant="body1" color="text.secondary">
                                        Visual chart will be displayed here
                                    </Typography>
                                </Box>
                            )}
                        </Paper>

                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: 2,
                                mt: 3,
                                border: '1px solid rgba(0, 0, 0, 0.12)'
                            }}
                        >
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium' }}>
                                Tren Lamaran Bulanan
                            </Typography>

                            {safeMonthlyApps && safeMonthlyApps.length > 0 ? (
                                <Box sx={{ height: 300, mt: 2 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={safeMonthlyApps}
                                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                        >
                                            <XAxis dataKey="month" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="count" fill={theme.palette.primary.main} barSize={30} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Box>
                            ) : (
                                <Box sx={{
                                    height: 300,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    bgcolor: 'background.paper',
                                    borderRadius: 1
                                }}>
                                    <Typography variant="body1" color="text.secondary">
                                        Visual chart will be displayed here
                                    </Typography>
                                </Box>
                            )}
                        </Paper>
                    </Box>

                    {/* Right Sidebar */}
                    <Box sx={{
                        width: { xs: '100%', lg: 'calc(33.333% - 16px)' }
                    }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                borderRadius: 2,
                                border: '1px solid rgba(0, 0, 0, 0.12)',
                                mb: 3,
                                height: 'auto'
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                                    Jadwal Mendatang
                                </Typography>
                                <Button
                                    endIcon={<ArrowForwardIcon />}
                                    size="small"
                                    component={Link}
                                >
                                    Lihat Semua
                                </Button>
                            </Box>

                            {safeUpcomingEvents && safeUpcomingEvents.length > 0 ? (
                                <List disablePadding>
                                    {safeUpcomingEvents.map((event) => (
                                        <UpcomingEventItem key={event.id} event={event} />
                                    ))}
                                </List>
                            ) : (
                                <Box sx={{
                                    py: 4,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'column',
                                    bgcolor: 'background.paper',
                                    borderRadius: 1
                                }}>
                                    <CalendarTodayIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                                    <Typography variant="body1" color="text.secondary">
                                        Belum ada jadwal mendatang
                                    </Typography>
                                </Box>
                            )}
                        </Paper>

                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                borderRadius: 2,
                                border: '1px solid rgba(0, 0, 0, 0.12)',
                                height: 'auto'
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                                    Rekomendasi Pekerjaan
                                </Typography>
                                <Button
                                    endIcon={<ArrowForwardIcon />}
                                    size="small"
                                    component={Link}
                                >
                                    Lihat Semua
                                </Button>
                            </Box>

                            {safeRecommendations && safeRecommendations.length > 0 ? (
                                <List disablePadding>
                                    {safeRecommendations.map((job) => (
                                        <RecommendedJobItem key={job.id} job={job} />
                                    ))}
                                </List>
                            ) : (
                                <Box sx={{
                                    py: 4,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'column',
                                    bgcolor: 'background.paper',
                                    borderRadius: 1
                                }}>
                                    <WorkIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                                    <Typography variant="body1" color="text.secondary">
                                        Belum ada rekomendasi pekerjaan
                                    </Typography>
                                </Box>
                            )}
                        </Paper>
                    </Box>
                </Box>
            </Container>
        </Layout>
    );
}
