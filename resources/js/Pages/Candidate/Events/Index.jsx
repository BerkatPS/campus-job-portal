import React, { useState, useMemo, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    Container,
    Typography,
    Box,
    Paper,
    Chip,
    Divider,
    IconButton,
    Tab,
    Tabs,
    useTheme,
    useMediaQuery,
    Alert,
    LinearProgress,
    Badge,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell
} from '@mui/material';
import {
    LocationOn as LocationIcon,
    Event as EventIcon,
    AccessTime as TimeIcon,
    Videocam as VideocamIcon,
    Notifications as NotificationsIcon,
    Today as TodayIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO, isAfter, isBefore, isToday, isEqual, addMonths, subMonths, getDay, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addDays, parse } from 'date-fns';
import { id } from 'date-fns/locale';
import Layout from "@/Components/Layout/Layout.jsx";
import Button from "@/Components/Shared/Button";

// Custom styled Paper component for cards
const StyledCard = ({ children, elevation = 0, sx = {} }) => (
        <Paper
        elevation={elevation}
            sx={{
            borderRadius: '1.5rem',
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
            transition: 'all 0.3s ease',
            '&:hover': {
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
                transform: 'translateY(-2px)',
                borderColor: 'primary.200',
            },
            ...sx
        }}
    >
        {children}
        </Paper>
    );

// Custom Calendar Component
const CalendarComponent = ({ events, onDateClick }) => {
    const theme = useTheme();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = monthStart;
    const endDate = monthEnd;

    const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate });
    const startDayOfWeek = getDay(monthStart);

    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const prevMonth = () => {
        setCurrentDate(subMonths(currentDate, 1));
    };

    const nextMonth = () => {
        setCurrentDate(addMonths(currentDate, 1));
    };

    const onDateClickHandler = (day) => {
        setSelectedDate(day);
        if (onDateClick) onDateClick(day);
    };

    // Function to check if a date has events
    const hasEvents = (date) => {
        return events.some(event => {
            const eventDate = parseISO(event.start_time);
            return isSameDay(eventDate, date);
        });
    };

    // Function to get events for a date
    const getEventsForDate = (date) => {
        return events.filter(event => {
            const eventDate = parseISO(event.start_time);
            return isSameDay(eventDate, date);
        });
    };

    // Count events for each date
    const eventCounts = {};
    daysInMonth.forEach(day => {
        const eventsOnDay = getEventsForDate(day);
        if (eventsOnDay.length > 0) {
            eventCounts[format(day, 'yyyy-MM-dd')] = eventsOnDay.length;
        }
    });

    return (
        <Box>
            {/* Calendar Header */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
                px: 1
            }}>
                <IconButton onClick={prevMonth} size="small" sx={{ color: theme.palette.grey[700] }}>
                    <ChevronLeftIcon />
                </IconButton>

                <Typography variant="h6" fontWeight="bold">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </Typography>

                <IconButton onClick={nextMonth} size="small" sx={{ color: theme.palette.grey[700] }}>
                    <ChevronRightIcon />
                </IconButton>
            </Box>

            {/* Calendar Grid */}
            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '1rem', overflow: 'hidden' }}>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ backgroundColor: theme.palette.grey[50] }}>
                            {dayNames.map((day) => (
                                <TableCell key={day} align="center" sx={{
                                    fontWeight: 'bold',
                                    color: theme.palette.grey[700],
                                    py: 1,
                                    borderBottom: '1px solid',
                                    borderColor: theme.palette.grey[200]
                                }}>
                                    {day}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array(Math.ceil((daysInMonth.length + startDayOfWeek) / 7))
                            .fill(null)
                            .map((_, weekIndex) => (
                                <TableRow key={weekIndex}>
                                    {Array(7).fill(null).map((_, dayIndex) => {
                                        const dayNumber = weekIndex * 7 + dayIndex - startDayOfWeek + 1;
                                        const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth.length;

                                        if (!isCurrentMonth) {
                                            return <TableCell key={dayIndex} sx={{ height: '60px', borderColor: theme.palette.grey[100] }}></TableCell>;
                                        }

                                        const day = daysInMonth[dayNumber - 1];
                                        const isToday = isSameDay(day, new Date());
                                        const isSelected = isSameDay(day, selectedDate);
                                        const dayHasEvents = hasEvents(day);
                                        const eventCount = eventCounts[format(day, 'yyyy-MM-dd')] || 0;

                                        return (
                                            <TableCell
                                                key={dayIndex}
                                                onClick={() => onDateClickHandler(day)}
                                                sx={{
                                                    height: '60px',
                                                    cursor: 'pointer',
                                                    position: 'relative',
                                                    p: 0.5,
                                                    borderColor: theme.palette.grey[100],
                                                    ...(isToday && {
                                                        backgroundColor: 'rgba(20, 184, 166, 0.05)',
                                                    }),
                                                    ...(isSelected && {
                                                        backgroundColor: 'rgba(20, 184, 166, 0.1)',
                                                    }),
                                                    '&:hover': {
                                                        backgroundColor: theme.palette.grey[50],
                                                    }
                                                }}
                                            >
                                                <Box sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    height: '100%',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            fontWeight: isToday || isSelected ? 'bold' : 'normal',
                                                            color: isToday ? theme.palette.primary.main : 'inherit',
                                                            width: '24px',
                                                            height: '24px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            borderRadius: '50%',
                                                            ...(isToday && {
                                                                backgroundColor: 'rgba(20, 184, 166, 0.1)',
                                                            })
                                                        }}
                                                    >
                                                        {dayNumber}
                                                    </Typography>

                                                    {dayHasEvents && (
                                                        <Badge
                                                            badgeContent={eventCount}
                                                            color="primary"
                                                            sx={{
                                                                '& .MuiBadge-badge': {
                                                                    fontSize: '0.7rem',
                                                                    height: '18px',
                                                                    minWidth: '18px',
                                                                    borderRadius: '9px',
                                                                }
                                                            }}
                                                        >
                                                            <Box sx={{ width: 4, height: 4 }} />
                                                        </Badge>
                                                    )}
                                                </Box>
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};



export default function Index({ upcomingEvents = [], pastEvents = [], profileCompleteness = { percentage: 0, missingItems: [], isComplete: false }, user = {}, profile = {} }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [tabValue, setTabValue] = useState(0);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [openResumeModal, setOpenResumeModal] = useState(false);
    const [copiedField, setCopiedField] = useState(null);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleCopyToClipboard = (text, field) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
        });
    };

    const handleDateClick = (date) => {
        setSelectedDate(date);
    };

    const skillBadges = profile.skills
        ? profile.skills
            .split(',')
            .map(skill => skill.trim())
            .filter(skill => skill.length > 0)
        : [];

    // Filter events happening today
    const todayEvents = useMemo(() => {
        return upcomingEvents.filter(event => {
            try {
                const eventDate = parseISO(event.start_time);
                return isToday(eventDate);
            } catch (e) {
                return false;
            }
        });
    }, [upcomingEvents]);

    // Filter events for selected date
    const selectedDateEvents = useMemo(() => {
        return upcomingEvents.filter(event => {
            try {
                const eventDate = parseISO(event.start_time);
                return isSameDay(eventDate, selectedDate);
            } catch (e) {
                return false;
            }
        });
    }, [upcomingEvents, selectedDate]);


    // Helper function to format time
    const formatTime = (dateString) => {
        try {
            const date = parseISO(dateString);
            return format(date, 'HH:mm', { locale: id });
        } catch (e) {
            return dateString;
        }
    };

    // Function to get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed':
                return theme.palette.success.main;
            case 'canceled':
                return theme.palette.error.main;
            case 'completed':
                return theme.palette.info.main;
            case 'scheduled':
            case 'pending':
                return theme.palette.warning.main;
            default:
                return theme.palette.grey[500];
        }
    };

    // Function to get status text
    const getStatusText = (status) => {
        switch (status) {
            case 'confirmed':
                return 'Terkonfirmasi';
            case 'canceled':
                return 'Dibatalkan';
            case 'completed':
                return 'Selesai';
            case 'scheduled':
            case 'pending':
                return 'Menunggu Konfirmasi';
            default:
                return status || 'Menunggu';
        }
    };

    // Function to get event type text
    const getEventTypeText = (type) => {
        switch (type) {
            case 'interview':
                return 'Wawancara';
            case 'test':
                return 'Tes';
            case 'meeting':
                return 'Pertemuan';
            case 'online':
                return 'Wawancara Online';
            case 'onsite':
                return 'Wawancara Langsung';
            default:
                return type || 'Event';
        }
    };

    // Get badge color based on event type
    const getEventTypeBgColor = (type) => {
        switch (type) {
            case 'interview':
            case 'online':
                return 'rgba(25, 118, 210, 0.1)';
            case 'test':
                return 'rgba(156, 39, 176, 0.1)';
            case 'meeting':
                return 'rgba(46, 125, 50, 0.1)';
            case 'onsite':
                return 'rgba(211, 47, 47, 0.1)';
            default:
                return 'rgba(117, 117, 117, 0.1)';
        }
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 100, damping: 15 }
        }
    };

    // Event card component for selected date
    const EventCard = ({ event }) => {
        return (
            <Paper
                elevation={0}
                sx={{
                    p: 2.5,
                    mb: 2,
                    borderRadius: '1rem',
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                        borderColor: theme.palette.grey[300],
                    }
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                    {/* Time Section */}
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        justifyContent: 'center',
                        width: { xs: '100%', sm: '16.66%' }, // Equivalent to sm={2}
                    }}>
                        <Typography variant="h5" fontWeight="bold" color="text.primary">
                            {formatTime(event.start_time)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {formatTime(event.end_time)}
                        </Typography>
                    </Box>

                    {/* Content Section */}
                    <Box sx={{
                        flex: 1, // Takes remaining space
                        width: { xs: '100%', sm: '83.33%' }, // Equivalent to sm={10}
                    }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, alignItems: 'flex-start' }}>
                            <Box>
                                <Typography variant="h6" fontWeight="bold">
                                    {event.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {event.job?.company?.name || 'Perusahaan'} - {event.job?.title || 'Posisi'}
                                </Typography>
                            </Box>
                            <Chip
                                label={getStatusText(event.status)}
                                size="small"
                                sx={{
                                    backgroundColor: `${getStatusColor(event.status)}15`,
                                    color: getStatusColor(event.status),
                                    fontWeight: 'medium',
                                    borderRadius: '0.5rem',
                                }}
                            />
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                                    <Chip
                                        label={getEventTypeText(event.type)}
                                        size="small"
                                        sx={{
                                            backgroundColor: getEventTypeBgColor(event.type),
                                            fontWeight: 'medium',
                                            borderRadius: '0.5rem',
                                        }}
                                        icon={<EventIcon style={{ opacity: 0.7 }} />}
                                    />
                                </Box>
                            </Box>

                            {event.location && (
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <LocationIcon sx={{ fontSize: 18, color: theme.palette.grey[500], mr: 0.5 }} />
                                    <Typography variant="body2" color="text.secondary">
                                        {event.location}
                                    </Typography>
                                </Box>
                            )}

                            {event.type === 'online' && event.meeting_link && (
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <VideocamIcon sx={{ fontSize: 18, color: theme.palette.primary.main, mr: 0.5 }} />
                                    <Link href={event.meeting_link} target="_blank" sx={{ textDecoration: 'none' }}>
                                        <Typography
                                            variant="body2"
                                            color="primary"
                                            sx={{ '&:hover': { textDecoration: 'underline' } }}
                                        >
                                            Join Meeting
                                        </Typography>
                                    </Link>
                                </Box>
                            )}
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <Button
                                component={Link}
                                href={route('candidate.events.show', event.id)}
                                variant="outlined"
                                color="primary"
                                size="small"
                                sx={{
                                    borderRadius: '0.8rem',
                                    fontWeight: 'medium',
                                    textTransform: 'none',
                                    px: 2,
                                }}
                            >
                                Detail Event
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Paper>
        );
    };

    return (
        <Layout>
            <Head title="Jadwal Events" />

            {/* Modern subtle background */}
            <Box
                sx={{
                    backgroundImage: 'linear-gradient(135deg, rgba(245, 245, 245, 0.6) 0%, rgba(250, 250, 250, 0.8) 100%)',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 200,
                    zIndex: -1,
                }}
            />

            <Container maxWidth="lg" sx={{ py: 4, mt: { xs: 2, md: 3 }, position: 'relative' }}>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Page Header */}
                    <motion.div variants={itemVariants}>
                        <Box sx={{ mb: 4, textAlign: { xs: 'center', md: 'left' } }}>
                            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom color="text.primary">
                                Jadwal Event
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Kelola jadwal interview dan event lainnya terkait lamaran Anda
                            </Typography>
                        </Box>
                    </motion.div>

                    {/* Profile Completeness Warning */}
                    {!profileCompleteness.isComplete && profileCompleteness.percentage < 100 && (
                        <motion.div variants={itemVariants}>
                            <Alert
                                severity={profileCompleteness.percentage < 60 ? "error" : "warning"}
                                sx={{
                                    mb: 4,
                                    borderRadius: '1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    '& .MuiAlert-icon': {
                                        alignItems: 'center'
                                    }
                                }}
                                action={
                                    <Button
                                        color="inherit"
                                        size="small"
                                        component={Link}
                                        href={route('candidate.profile.edit')}
                                        sx={{
                                            fontWeight: 'bold',
                                            '&:hover': {
                                                backgroundColor: profileCompleteness.percentage < 60 ?
                                                    'rgba(211, 47, 47, 0.04)' : 'rgba(237, 108, 2, 0.04)'
                                            }
                                        }}
                                    >
                                        Lengkapi Sekarang
                                    </Button>
                                }
                            >
                                <Box>
                                    <Typography variant="subtitle2" fontWeight="bold">
                                        {profileCompleteness.percentage < 60
                                            ? "Profil Anda belum cukup lengkap!"
                                            : "Profil Anda belum sepenuhnya lengkap!"}
                                    </Typography>
                                    <Typography variant="body2">
                                        {profileCompleteness.percentage < 60
                                            ? "Anda perlu melengkapi profil minimal 60% untuk dapat melihat jadwal event"
                                            : "Lengkapi profil Anda untuk meningkatkan peluang dipilih oleh perusahaan"}
                                    </Typography>
                                    <Box sx={{ mt: 1, mb: 0.5 }}>
                                        <LinearProgress
                                            variant="determinate"
                                            value={profileCompleteness.percentage}
                                            sx={{
                                                height: 6,
                                                borderRadius: 3,
                                                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                                '& .MuiLinearProgress-bar': {
                                                    borderRadius: 3,
                                                    backgroundColor: profileCompleteness.percentage < 60 ?
                                                        'error.main' : (profileCompleteness.percentage < 100 ? 'warning.main' : 'success.main'),
                                                }
                                            }}
                                        />
                                    </Box>
                                    <Typography variant="caption" sx={{ fontWeight: 'medium' }}>
                                        Kelengkapan: {profileCompleteness.percentage}%
                                    </Typography>
                                </Box>
                            </Alert>
                        </motion.div>
                    )}

                    {/* If profile completeness < 60%, show nothing */}
                    {profileCompleteness.percentage < 60 ? (
                        <motion.div variants={itemVariants}>
                            <StyledCard sx={{ p: 4, textAlign: 'center' }}>
                                <Box sx={{ mb: 3, opacity: 0.7 }}>
                                    <EventIcon sx={{ fontSize: 60, color: theme.palette.grey[400] }} />
                                </Box>
                                <Typography variant="h5" fontWeight="bold" gutterBottom>
                                    Lengkapi Profil Anda
                                </Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
                                    Anda perlu melengkapi profil setidaknya 60% untuk dapat melihat dan mengelola jadwal event interview.
                                </Typography>
                                <Button
                                    component={Link}
                                    href={route('candidate.profile.edit')}
                                    variant="contained"
                                    sx={{
                                        borderRadius: '1rem',
                                        px: 3,
                                        py: 1,
                                        fontWeight: 'bold',
                                        textTransform: 'none'
                                    }}
                                >
                                    Lengkapi Profil
                                </Button>
                            </StyledCard>
                        </motion.div>
                    ) : (
                        <>
                            {/* Today's Events Section */}
                            {todayEvents.length > 0 && (
                                <motion.div variants={itemVariants}>
                                    <StyledCard elevation={0} sx={{ mb: 4, overflow: 'visible', position: 'relative' }}>
                                        <Box sx={{ position: 'absolute', top: -10, left: 20 }}>
                                            <Chip
                                                label="Hari Ini"
                                                icon={<TodayIcon />}
                                                sx={{
                                                    fontWeight: 'bold',
                                                    fontSize: '0.9rem',
                                                    py: 2,
                                                    borderRadius: '1rem',
                                                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.08)',
                                                    bgcolor: theme.palette.grey[50],
                                                    color: theme.palette.text.primary,
                                                    border: '1px solid',
                                                    borderColor: theme.palette.divider,
                                                    '& .MuiChip-icon': {
                                                        color: theme.palette.primary.main
                                                    }
                                                }}
                                            />
                                        </Box>
                                        <Box sx={{ p: 3, pt: 4 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 1 }}>
                                                <Typography variant="h6" fontWeight="bold" color="text.primary">
                                                    Interview dan Event Hari Ini
                                                </Typography>
                                                <Badge badgeContent={todayEvents.length}
                                                    sx={{ ml: 2,
                                                        '& .MuiBadge-badge': {
                                                            bgcolor: theme.palette.grey[700],
                                                            color: theme.palette.common.white
                                                        }
                                                    }}
                                                >
                                                    <NotificationsIcon sx={{ color: theme.palette.grey[600] }} />
                                                </Badge>
                                            </Box>
                                            <Divider sx={{ mb: 3 }} />

                                            <Box sx={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                mx: -1.5, // Negative margin to offset padding
                                            }}>
                                                {todayEvents.map((event) => (
                                                    <Box
                                                        key={event.id}
                                                        sx={{
                                                            width: {
                                                                xs: '100%',       // Full width on mobile
                                                                md: '50%',        // 2 cards per row on tablet
                                                                lg: '33.333%',    // 3 cards per row on desktop
                                                            },
                                                            p: 1.5,
                                                        }}
                                                    >
                                                        <Paper
                                                            elevation={0}
                                                            sx={{
                                                                p: 2,
                                                                height: '100%',
                                                                borderRadius: '1rem',
                                                                border: '1px solid',
                                                                borderColor: 'divider',
                                                                transition: 'all 0.2s',
                                                                '&:hover': {
                                                                    borderColor: theme.palette.grey[300],
                                                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                                                                }
                                                            }}
                                                        >
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                                <Chip
                                                                    label={getEventTypeText(event.type)}
                                                                    size="small"
                                                                    sx={{
                                                                        fontWeight: 'medium',
                                                                        backgroundColor: getEventTypeBgColor(event.type),
                                                                        borderRadius: '0.5rem',
                                                                    }}
                                                                />
                                                                <Chip
                                                                    label={getStatusText(event.status)}
                                                                    size="small"
                                                                    sx={{
                                                                        backgroundColor: `${getStatusColor(event.status)}15`,
                                                                        color: getStatusColor(event.status),
                                                                        fontWeight: 'medium',
                                                                        borderRadius: '0.5rem',
                                                                    }}
                                                                />
                                                            </Box>

                                                            <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 1.5, mb: 0.5 }}>
                                                                {event.title}
                                                            </Typography>

                                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                                {event.job?.company?.name || 'Perusahaan'} - {event.job?.title || 'Posisi'}
                                                            </Typography>

                                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                <TimeIcon sx={{ fontSize: 18, color: theme.palette.grey[500], mr: 0.5 }} />
                                                                <Typography variant="body2" color="text.secondary">
                                                                    {format(parseISO(event.start_time), 'HH:mm', { locale: id })} - {format(parseISO(event.end_time), 'HH:mm', { locale: id })}
                                                                </Typography>
                                                            </Box>

                                                            {event.location && (
                                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                    <LocationIcon sx={{ fontSize: 18, color: theme.palette.grey[500], mr: 0.5 }} />
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        {event.location}
                                                                    </Typography>
                                                                </Box>
                                                            )}

                                                            {event.type === 'online' && event.meeting_link && (
                                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                    <VideocamIcon sx={{ fontSize: 18, color: theme.palette.primary.main, mr: 0.5, opacity: 0.7 }} />
                                                                    <Link href={event.meeting_link} target="_blank" sx={{ textDecoration: 'none' }}>
                                                                        <Typography
                                                                            variant="body2"
                                                                            color="primary"
                                                                            sx={{ '&:hover': { textDecoration: 'underline' } }}
                                                                        >
                                                                            Join Meeting
                                                                        </Typography>
                                                                    </Link>
                                                                </Box>
                                                            )}

                                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                                                <Button
                                                                    component={Link}
                                                                    href={route('candidate.events.show', event.id)}
                                                                    variant="outlined"
                                                                    color="primary"
                                                                    size="small"
                                                                    sx={{
                                                                        borderRadius: '0.8rem',
                                                                        fontWeight: 'medium',
                                                                        textTransform: 'none',
                                                                    }}
                                                                >
                                                                    Detail
                                                                </Button>
                                                            </Box>
                                                        </Paper>
                                                    </Box>
                                                ))}
                                            </Box>
                                        </Box>
                                    </StyledCard>
                                </motion.div>
                            )}

                            {/* Calendar and Event Listing Section */}
                            <motion.div variants={itemVariants}>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: { xs: 'column', md: 'row' },
                                    gap: 3
                                }}>
                                    {/* Calendar */}
                                    <Box sx={{
                                        width: { xs: '100%', md: '40%', lg: '35%' }
                                    }}>
                                        <StyledCard sx={{ p: 3, height: '100%' }}>
                                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                                Kalender
                                            </Typography>
                                            <CalendarComponent
                                                events={upcomingEvents}
                                                onDateClick={handleDateClick}
                                            />
                                        </StyledCard>
                                    </Box>

                                    {/* Events for Selected Date */}
                                    <Box sx={{
                                        width: { xs: '100%', md: '60%', lg: '65%' }
                                    }}>
                                        <StyledCard sx={{ p: 3, height: '100%' }}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                                    Event pada {format(selectedDate, 'd MMMM yyyy', { locale: id })}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ minHeight: 300 }}>
                                                {selectedDateEvents.length > 0 ? (
                                                    <Box>
                                                        {selectedDateEvents.map(event => (
                                                            <EventCard key={event.id} event={event} />
                                                        ))}
                                                    </Box>
                                                ) : (
                                                    <Box sx={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        py: 6,
                                                        opacity: 0.7
                                                    }}>
                                                        <EventIcon sx={{ fontSize: 60, color: theme.palette.grey[400], mb: 2 }} />
                                                        <Typography variant="h6" color="text.secondary" gutterBottom>
                                                            Tidak ada event untuk tanggal ini
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Pilih tanggal lain atau periksa tab "Upcoming"
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Box>
                                        </StyledCard>
                                    </Box>
                                </Box>
                            </motion.div>


                        </>
                    )}
                </motion.div>
            </Container>
        </Layout>
    );
}
