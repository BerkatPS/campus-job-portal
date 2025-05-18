import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    Chip,
    Paper,
    Tabs,
    Tab,
    Avatar,
    Divider,
    IconButton,
    CircularProgress,
    useMediaQuery, Breadcrumbs
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import {
    CalendarToday as CalendarTodayIcon,
    AccessTime as TimeIcon,
    Videocam as VideocamIcon,
    Business as BusinessIcon,
    CheckCircleOutline as CheckCircleOutlineIcon,
    Cancel as CancelIcon,
    WorkOutline as WorkOutlineIcon,
    InfoOutlined as InfoOutlinedIcon,
    Email as EmailIcon,
    Add as AddIcon,
    NoteAltOutlined as NoteAltOutlinedIcon,
    NoteAdd as NoteAddIcon,
    NavigateBefore as NavigateBeforeIcon,
    NavigateNext as NavigateNextIcon,
    Event as EventIcon,
    ChevronRight as ChevronRightIcon,
    ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import moment from 'moment';
import 'moment/locale/id';
import Layout from '@/Components/Layout/Layout.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import {CalendarIcon, CheckIcon} from "lucide-react";


moment.locale('id');

// Countdown component for upcoming interviews
const Countdown = ({ date }) => {
    const [countdown, setCountdown] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const calculateCountdown = () => {
            const now = moment();
            const eventTime = moment(date);
            const duration = moment.duration(eventTime.diff(now));

            setCountdown({
                days: Math.max(0, Math.floor(duration.asDays())),
                hours: Math.max(0, duration.hours()),
                minutes: Math.max(0, duration.minutes()),
                seconds: Math.max(0, duration.seconds())
            });
        };

        calculateCountdown();
        const interval = setInterval(calculateCountdown, 1000); // Update every second

        return () => clearInterval(interval);
    }, [date]);

    return (
        <Box sx={{ mt: 2, mb: 4, px: { xs: 0, md: 2 } }}>
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 2
            }}>
                <Box>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 1.5,
                            borderRadius: '1rem',
                            textAlign: 'center',
                            backgroundColor: 'rgba(20, 184, 166, 0.05)',
                            border: '1px solid rgba(20, 184, 166, 0.1)'
                        }}
                    >
                        <Typography variant="h4" fontWeight="bold" color="primary.main">
                            {countdown.days}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Hari
                        </Typography>
                    </Paper>
                </Box>
                <Box>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 1.5,
                            borderRadius: '1rem',
                            textAlign: 'center',
                            backgroundColor: 'rgba(20, 184, 166, 0.05)',
                            border: '1px solid rgba(20, 184, 166, 0.1)'
                        }}
                    >
                        <Typography variant="h4" fontWeight="bold" color="primary.main">
                            {countdown.hours}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Jam
                        </Typography>
                    </Paper>
                </Box>
                <Box>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 1.5,
                            borderRadius: '1rem',
                            textAlign: 'center',
                            backgroundColor: 'rgba(20, 184, 166, 0.05)',
                            border: '1px solid rgba(20, 184, 166, 0.1)'
                        }}
                    >
                        <Typography variant="h4" fontWeight="bold" color="primary.main">
                            {countdown.minutes}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Menit
                        </Typography>
                    </Paper>
                </Box>
                <Box>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 1.5,
                            borderRadius: '1rem',
                            textAlign: 'center',
                            backgroundColor: 'rgba(20, 184, 166, 0.05)',
                            border: '1px solid rgba(20, 184, 166, 0.1)'
                        }}
                    >
                        <Typography variant="h4" fontWeight="bold" color="primary.main">
                            {countdown.seconds}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Detik
                        </Typography>
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
};

// Tab Panel component
const TabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box>
                    {children}
                </Box>
            )}
        </div>
    );
};



// EventCalendar component
const EventCalendar = ({ eventDate, event }) => {
    const [calendarView, setCalendarView] = useState('month');
    const [currentDate, setCurrentDate] = useState(moment(eventDate));
    const [selectedDate, setSelectedDate] = useState(moment(eventDate));
    const theme = useTheme();

    const getDaysInMonth = (date) => {
        const daysInMonth = date.daysInMonth();
        const days = [];
        const startOfMonth = date.clone().startOf('month');
        const endOfMonth = date.clone().endOf('month');

        // Get the day of the week for the first day of the month (0-6, where 0 is Sunday)
        const firstDayOfMonth = startOfMonth.day();

        // Add previous month's days to fill the first week
        const prevMonthDays = firstDayOfMonth;
        for (let i = prevMonthDays - 1; i >= 0; i--) {
            days.push({
                date: startOfMonth.clone().subtract(i + 1, 'days'),
                isCurrentMonth: false,
                isToday: false,
                isSelected: false,
                hasEvent: false
            });
        }

        // Add days of the current month
        const today = moment();
        for (let i = 0; i < daysInMonth; i++) {
            const day = startOfMonth.clone().add(i, 'days');
            days.push({
                date: day,
                isCurrentMonth: true,
                isToday: day.isSame(today, 'day'),
                isSelected: day.isSame(selectedDate, 'day'),
                hasEvent: day.isSame(moment(eventDate), 'day')
            });
        }

        // Add next month's days to complete the last week
        const nextMonthDays = 42 - days.length; // 6 rows of 7 days
        for (let i = 0; i < nextMonthDays; i++) {
            days.push({
                date: endOfMonth.clone().add(i + 1, 'days'),
                isCurrentMonth: false,
                isToday: false,
                isSelected: false,
                hasEvent: false
            });
        }

        return days;
    };

    const handlePrevMonth = () => {
        setCurrentDate(currentDate.clone().subtract(1, 'month'));
    };

    const handleNextMonth = () => {
        setCurrentDate(currentDate.clone().add(1, 'month'));
    };

    const handleDateClick = (date) => {
        setSelectedDate(date);
    };

    const isEventDay = (date) => {
        return date.isSame(moment(eventDate), 'day');
    };

    const days = getDaysInMonth(currentDate);

    return (
        <Card
            elevation={0}
            sx={{
                height: '100%',
                borderRadius: '1rem',
                border: '1px solid',
                borderColor: 'divider'
            }}
        >
            <Box
                sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                }}
            >
                <Typography variant="subtitle1" fontWeight="bold">
                    {currentDate.format('MMMM YYYY')}
                </Typography>
                <Box>
                    <IconButton size="small" onClick={handlePrevMonth}>
                        <NavigateBeforeIcon />
                    </IconButton>
                    <IconButton size="small" onClick={handleNextMonth}>
                        <NavigateNextIcon />
                    </IconButton>
                </Box>
            </Box>

            <Box sx={{ p: 2 }}>
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: 0.5
                }}>
                    {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day, index) => (
                        <Box
                            key={index}
                            sx={{
                                textAlign: 'center',
                                py: 0.5,
                                fontSize: '0.75rem',
                                fontWeight: 'medium',
                                color: 'text.secondary'
                            }}
                        >
                            {day}
                        </Box>
                    ))}

                    {days.map((day, index) => (
                        <Box
                            key={index}
                            onClick={() => handleDateClick(day.date)}
                            sx={{
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: 32,
                                cursor: 'pointer',
                                borderRadius: '0.5rem',
                                fontWeight: day.isSelected ? 'bold' : 'regular',
                                color: !day.isCurrentMonth
                                    ? alpha(theme.palette.text.primary, 0.3)
                                    : day.isToday
                                    ? theme.palette.primary.main
                                    : 'text.primary',
                                backgroundColor: day.isSelected
                                    ? alpha(theme.palette.primary.main, 0.1)
                                    : 'transparent',
                                '&:hover': {
                                    backgroundColor: day.isSelected
                                        ? alpha(theme.palette.primary.main, 0.15)
                                        : alpha(theme.palette.action.hover, 0.1)
                                }
                            }}
                        >
                            {day.date.format('D')}
                            {day.hasEvent && (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        bottom: 2,
                                        width: 4,
                                        height: 4,
                                        borderRadius: '50%',
                                        backgroundColor: theme.palette.primary.main
                                    }}
                                />
                            )}
                        </Box>
                    ))}
                </Box>
            </Box>

            <Box
                sx={{
                    p: 2,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    backgroundColor: alpha(theme.palette.grey[50], 0.5)
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 1,
                        mb: 1,
                        borderRadius: '0.5rem',
                        backgroundColor: alpha(theme.palette.grey[100], 0.7),
                        border: '1px solid',
                        borderColor: 'divider'
                    }}
                >
                    <CalendarIcon sx={{ mr: 1, fontSize: 18, color: 'text.secondary', opacity: 0.7 }} />
                    <Typography variant="caption" fontWeight="medium" color="text.secondary">
                        {selectedDate.format('dddd, DD MMMM YYYY')}
                    </Typography>
                </Box>

                {isEventDay(selectedDate) ? (
                    <Box>
                        <Box
                            sx={{
                                p: 1.5,
                                borderRadius: '0.75rem',
                                backgroundColor: alpha(theme.palette.background.paper, 0.7),
                                border: '1px solid',
                                borderColor: 'divider',
                                mb: 1
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box
                                    sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        backgroundColor: alpha(theme.palette.text.primary, 0.8),
                                        mr: 1.5
                                    }}
                                />
                                <Box>
                                    <Typography variant="body2" fontWeight="medium" color="text.primary">
                                        {moment(eventDate).format('HH:mm')} - {moment(event.end_time).format('HH:mm')}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {event.title}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 2 }}>
                            {event.status === 'pending' ? '* Memerlukan konfirmasi kehadiran' :
                             event.status === 'confirmed' ? '* Sudah dikonfirmasi' :
                             event.status === 'completed' ? '* Interview selesai' :
                             event.status === 'canceled' ? '* Interview dibatalkan' : ''}
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            Tidak ada interview pada tanggal ini.
                        </Typography>
                    </Box>
                )}
            </Box>
        </Card>
    );
};

export default function Show({ event, application, user, interviewers }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [openNoteDialog, setOpenNoteDialog] = useState(false);
  const [note, setNote] = useState('');
    const [tabValue, setTabValue] = useState(0);
    const [showLoading, setShowLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    // Gunakan default empty object jika event tidak ada
    const eventData = event || {};
    // Gunakan default empty object jika user tidak ada
    const userData = user || {};
    // Gunakan default empty array jika interviewers tidak ada
    const interviewersList = interviewers || [];
    // Gunakan default empty object jika application tidak ada
    const applicationData = application || {};

    // Calculate if the interview is upcoming
    const isUpcoming = eventData.start_time ? moment(eventData.start_time).isAfter(moment()) : false;
    const isPast = eventData.end_time ? moment(eventData.end_time).isBefore(moment()) : false;
    const isToday = eventData.start_time ? moment(eventData.start_time).isSame(moment(), 'day') : false;

    // Calculate time until interview
    const daysUntil = eventData.start_time ? moment(eventData.start_time).diff(moment(), 'days') : 0;
    const hoursUntil = eventData.start_time ? moment(eventData.start_time).diff(moment(), 'hours') % 24 : 0;

    // Handle tab change
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

  const handleCancel = () => {
        setShowLoading(true);

        router.post(route('candidate.events.cancel', eventData.id), {
      reason: cancelReason
    }, {
      onSuccess: () => {
        setOpenCancelDialog(false);
                setShowLoading(false);
            },
            onError: () => {
                setShowLoading(false);
      }
    });
  };

  const handleConfirm = () => {
        setShowLoading(true);

        router.post(route('candidate.events.confirm', eventData.id), {}, {
      onSuccess: () => {
                setShowLoading(false);
            },
            onError: () => {
                setShowLoading(false);
      }
    });
  };

  const handleAddNote = () => {
        setShowLoading(true);

        router.post(route('candidate.events.add-note', eventData.id), {
      note: note
    }, {
      onSuccess: () => {
        setOpenNoteDialog(false);
        setNote('');
                setShowLoading(false);
            },
            onError: () => {
                setShowLoading(false);
      }
    });
  };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

  // Fungsi untuk menentukan warna status
  const getStatusColor = (status) => {
    if (!status) return theme.palette.grey[500];
    switch (status) {
      case 'confirmed':
                return theme.palette.success.main;
      case 'pending':
                return theme.palette.warning.main;
      case 'canceled':
                return theme.palette.error.main;
      case 'completed':
                return theme.palette.info.main;
      default:
                return theme.palette.grey[500];
    }
  };

  // Fungsi untuk mendapatkan teks status
  const getStatusText = (status) => {
    if (!status) return 'Pending';
    switch (status) {
      case 'confirmed':
        return 'Terkonfirmasi';
      case 'pending':
        return 'Menunggu Konfirmasi';
      case 'canceled':
        return 'Dibatalkan';
      case 'completed':
        return 'Selesai';
      default:
        return status || 'Pending';
    }
  };

    // Fungsi untuk mendapatkan icon status
    const getStatusIcon = (status) => {
        if (!status) return null;
        switch (status) {
            case 'confirmed':
                return <CheckIcon fontSize="small" />;
            case 'pending':
                return <TimeIcon fontSize="small" />;
            case 'canceled':
                return <CancelIcon fontSize="small" />;
            case 'completed':
                return <CheckCircleOutlineIcon fontSize="small" />;
            default:
                return null;
        }
    };

    // Fungsi untuk mendapatkan tipe interview
    const getEventType = (type) => {
        if (!type) return 'Tidak Ditentukan';

        switch (type) {
            case 'online':
                return 'Online Interview';
            case 'onsite':
                return 'In-person Interview';
            default:
                return type || 'Tidak Ditentukan';
        }
    };

  // Langkah-langkah interview
  const interviewSteps = [
    {
      label: 'Undangan Interview',
      description: `Undangan interview untuk posisi ${applicationData?.job?.title || 'pekerjaan'} telah dikirim.`,
      date: eventData.created_at || null,
      icon: <EventIcon color="primary" />
    },
    {
      label: 'Konfirmasi Kehadiran',
      description: eventData.status === 'confirmed'
        ? 'Anda telah mengkonfirmasi kehadiran.'
        : (eventData.status === 'canceled'
          ? 'Anda telah membatalkan interview.'
          : 'Menunggu konfirmasi kehadiran Anda.'),
      date: eventData.confirmed_at || null,
      icon: eventData.status === 'confirmed' ? <CheckIcon color="success" /> :
        eventData.status === 'canceled' ? <CancelIcon color="error" /> :
          <TimeIcon color="warning" />
    },
    {
      label: 'Pelaksanaan Interview',
      description: eventData.start_time && moment(eventData.start_time).isValid() && moment(eventData.start_time).isBefore(moment())
        ? 'Interview telah dilaksanakan.'
        : 'Interview akan dilaksanakan sesuai jadwal.',
      date: eventData.start_time || null,
      icon: eventData.start_time && moment(eventData.start_time).isValid() && moment(eventData.start_time).isBefore(moment()) ?
        <CheckCircleOutlineIcon color="info" /> :
        <EventIcon color="primary" />
    },
    {
      label: 'Hasil Interview',
      description: eventData.result
        ? `Hasil interview: ${eventData.result}`
        : 'Menunggu hasil interview.',
      date: eventData.result_at || null,
      icon: eventData.result === 'passed' ?
        <CheckCircleOutlineIcon color="success" /> :
        eventData.result === 'failed' ?
          <CancelIcon color="error" /> :
          <TimeIcon color="action" />
    }
  ];

  // Menentukan langkah aktif
  const getActiveStep = () => {
    if (eventData.result) return 3;
    if (eventData.end_time && moment(eventData.end_time).isValid() && moment(eventData.end_time).isBefore(moment())) return 2;
    if (eventData.status === 'confirmed' || eventData.status === 'canceled') return 1;
    return 0;
  };

    // Custom Stepper to match our design
    const ModernStepper = ({ steps, activeStep }) => {
  return (
            <Box sx={{ mt: 2 }}>
                {steps.map((step, index) => {
                    const isActive = index === activeStep;
                    const isCompleted = index < activeStep;

                    return (
                        <Box
                            key={index}
                            sx={{
                                display: 'flex',
                                mb: index === steps.length - 1 ? 0 : 4,
                                position: 'relative'
                            }}
                        >
                            {/* Vertical line connecting steps */}
                            {index < steps.length - 1 && (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        left: 20,
                                        top: 40,
                                        bottom: -40,
                                        width: 1,
                                        bgcolor: isCompleted ? alpha(theme.palette.text.primary, 0.3) : alpha(theme.palette.text.primary, 0.1),
                                        zIndex: 0
                                    }}
                                />
                            )}

                            {/* Step circle */}
                            <Box
                                sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    bgcolor: isActive ? alpha(theme.palette.text.primary, 0.9) :
                                        isCompleted ? alpha(theme.palette.text.primary, 0.05) : alpha(theme.palette.text.primary, 0.03),
                                    border: '1px solid',
                                    borderColor: isActive ? alpha(theme.palette.text.primary, 0.9) :
                                        isCompleted ? alpha(theme.palette.text.primary, 0.3) : alpha(theme.palette.text.primary, 0.1),
                                    color: isActive ? theme.palette.background.paper :
                                        isCompleted ? theme.palette.text.primary : theme.palette.text.secondary,
                                    zIndex: 1,
                                    transition: 'all 0.2s ease-in-out',
                                    boxShadow: isActive ? '0 4px 10px rgba(0,0,0,0.05)' : 'none'
                                }}
                            >
                                {step.icon || (isCompleted ? <CheckIcon fontSize="small" /> : index + 1)}
        </Box>

                            {/* Step content */}
                            <Box sx={{ ml: 2, flex: 1 }}>
                                <Typography
                                    variant="subtitle1"
                                    fontWeight={isActive || isCompleted ? 'bold' : 'medium'}
                                    color={isActive ? theme.palette.text.primary :
                                        isCompleted ? theme.palette.text.primary : theme.palette.text.secondary}
                                    sx={{ transition: 'all 0.2s ease-in-out' }}
                                >
                                    {step.label}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color={isActive ? alpha(theme.palette.text.primary, 0.7) :
                                        isCompleted ? alpha(theme.palette.text.primary, 0.7) : alpha(theme.palette.text.secondary, 0.7)}
                                    paragraph
                                    sx={{ mt: 0.5 }}
                                >
                                    {step.description}
                                </Typography>
                                {step.date && (
                                    <Typography
                                        variant="caption"
                                        color={theme.palette.text.secondary}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            opacity: isActive || isCompleted ? 0.8 : 0.6
                                        }}
                                    >
                                        <CalendarIcon fontSize="inherit" sx={{ mr: 0.5 }} />
                                        {moment(step.date).format('DD MMMM YYYY, HH:mm')}
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    );
                })}
            </Box>
        );
    };

    return (
        <Layout>
            <Head title={`Interview - ${eventData.title || 'Detail'}`} />

            <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Breadcrumbs */}
                    <Paper
                        elevation={0}
                        sx={{
                            py: 2,
                            px: 3,
                            mb: 3,
                            borderRadius: '1rem',
                            backgroundColor: 'rgba(20, 184, 166, 0.05)',
                            border: '1px solid rgba(20, 184, 166, 0.1)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <Breadcrumbs
                            separator={<ChevronRightIcon fontSize="small" sx={{ color: 'primary.main', opacity: 0.7 }} />}
                            aria-label="breadcrumb"
                        >
                            <Link
                                href={route('candidate.dashboard')}
                                className="text-primary-600 hover:text-primary-800 font-medium"
                            >
                                Dashboard
                                </Link>
                            <Link
                                href={route('candidate.events.index')}
                                className="text-primary-600 hover:text-primary-800 font-medium"
                            >
                                Interview
                            </Link>
                            <Typography color="text.primary" fontWeight="medium">
                                {eventData.title || 'Detail Interview'}
                            </Typography>
                        </Breadcrumbs>

                        <Button
                            component={Link}
                            href={route('candidate.events.index')}
                            startIcon={<ArrowBackIcon />}
                            variant="text"
                            sx={{
                                color: 'primary.main',
                                '&:hover': {
                                    backgroundColor: 'rgba(20, 184, 166, 0.05)'
                                },
                                fontWeight: 500,
                                display: { xs: 'none', sm: 'flex' }
                            }}
                        >
                            Kembali
                        </Button>
                    </Paper>

                    {/* Header with Timer for Upcoming Interviews */}

                    {/* Main Content */}
                    <Box sx={{ display: 'flex', gap: 3 }}>
                        <Box sx={{ flex: 1 }}>
                            <Paper
                                elevation={0}
                                sx={{
                                    borderRadius: '1rem',
                                    overflow: 'hidden',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    position: 'relative'
                                }}
                            >
                                <Tabs
                                    value={tabValue}
                                    onChange={handleTabChange}
                                    variant="scrollable"
                                    scrollButtons="auto"
                                    sx={{
                                        borderBottom: '1px solid',
                                        borderColor: 'divider',
                                        backgroundColor: alpha(theme.palette.grey[50], 0.5),
                                        '& .MuiTabs-indicator': {
                                            backgroundColor: 'primary.main',
                                            height: 3,
                                            borderTopLeftRadius: 3,
                                            borderTopRightRadius: 3
                                        },
                                        '& .MuiTab-root': {
                                            minHeight: 64,
                                            color: 'text.secondary',
                                            '&.Mui-selected': {
                                                color: 'primary.main',
                                                fontWeight: 'bold'
                                            }
                                        }
                                    }}
                                >
                                    <Tab
                                        label="Informasi"
                                        icon={<InfoOutlinedIcon />}
                                        iconPosition="start"
                                        sx={{ textTransform: 'none', fontWeight: 'medium' }}
                                    />
                                    <Tab
                                        label="Interviewer"
                                        // icon={<PeopleAltOutlinedIcon />}
                                        iconPosition="start"
                                        sx={{ textTransform: 'none', fontWeight: 'medium' }}
                                    />
                                    <Tab
                                        label="Catatan"
                                        // icon={<NoteOutlinedIcon />}
                                        iconPosition="start"
                                        sx={{ textTransform: 'none', fontWeight: 'medium' }}
                                    />
                                </Tabs>

                                <TabPanel value={tabValue} index={0}>
                                    <Box sx={{ p: 3 }}>
                                        <Typography
                                            variant="h6"
                                            fontWeight="bold"
                                            sx={{ mb: 3, color: 'primary.main' }}
                                        >
                                            Detail Interview
                                        </Typography>

                                        <Box sx={{ mb: 3 }}>
                                            <Typography
                                                variant="body1"
                                                sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                                            >
                                                <CalendarTodayIcon sx={{ mr: 1, color: 'primary.main', opacity: 0.7 }} />
                                                {eventData.start_time ? moment(eventData.start_time).format('dddd, DD MMMM YYYY') : 'Tanggal belum ditentukan'}
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                sx={{ display: 'flex', alignItems: 'center', mr: 3, mb: { xs: 1, md: 0 } }}
                                            >
                                                <TimeIcon sx={{ mr: 1, color: 'primary.main', opacity: 0.7 }} />
                                                {eventData.start_time && eventData.end_time ?
                                                    `${moment(eventData.start_time).format('HH:mm')} - ${moment(eventData.end_time).format('HH:mm')} WIB` :
                                                    'Waktu belum ditentukan'}
                                            </Typography>
                                            <Chip
                                                icon={eventData.type === 'online' ? <VideocamIcon fontSize="small" /> : <BusinessIcon fontSize="small" />}
                                                label={getEventType(eventData.type)}
                                                variant="outlined"
                                                size="small"
                                                sx={{
                                                    borderRadius: '0.5rem',
                                                    borderColor: 'primary.main',
                                                    color: 'primary.main',
                                                    '& .MuiChip-icon': {
                                                        color: 'primary.main'
                                                    }
                                                }}
                                            />
                                        </Box>

                                        {eventData.description && (
                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                {eventData.description}
                                            </Typography>
                                        )}
                                    </Box>

                                    <Typography
                                        variant="h6"
                                        fontWeight="bold"
                                        sx={{ mt: 4, mb: 2, color: 'primary.main', px: 3 }}
                                    >
                                        Waktu Menuju Interview
                                    </Typography>

                                    <Box sx={{ px: 3, pb: 3 }}>
                                        <Countdown date={eventData.start_time} />

                                        <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                                            {eventData.status === 'pending' && (
                                                <>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        startIcon={<CheckCircleOutlineIcon />}
                                                        onClick={handleConfirm}
                                                        disabled={showLoading}
                                                        sx={{
                                                            borderRadius: '0.75rem',
                                                            py: 1.5,
                                                            px: 3,
                                                            fontWeight: 600,
                                                            boxShadow: '0 4px 14px 0 rgba(20, 184, 166, 0.25)',
                                                            '&:hover': {
                                                                boxShadow: '0 6px 20px 0 rgba(20, 184, 166, 0.35)',
                                                            }
                                                        }}
                                                    >
                                                        {showLoading ? (
                                                            <CircularProgress size={24} color="inherit" />
                                                        ) : (
                                                            'Konfirmasi Kehadiran'
                                                        )}
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        startIcon={<CancelIcon />}
                                                        onClick={() => setOpenCancelDialog(true)}
                                                        disabled={showLoading}
                                                        sx={{
                                                            borderRadius: '0.75rem',
                                                            py: 1.5,
                                                            px: 3,
                                                            fontWeight: 500,
                                                            borderColor: theme.palette.error.main,
                                                            color: theme.palette.error.main,
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(239, 68, 68, 0.05)',
                                                                borderColor: theme.palette.error.dark
                                                            }
                                                        }}
                                                    >
                                                        Tolak Interview
                                                    </Button>
                                                </>
                                            )}

                                            {eventData.status === 'confirmed' && (
                                                <>
                                                    {eventData.type === 'online' && eventData.meeting_link && (
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            startIcon={<VideocamIcon />}
                                                            href={eventData.meeting_link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            sx={{
                                                                borderRadius: '0.75rem',
                                                                py: 1.5,
                                                                px: 3,
                                                                fontWeight: 600,
                                                                boxShadow: '0 4px 14px 0 rgba(20, 184, 166, 0.25)',
                                                                '&:hover': {
                                                                    boxShadow: '0 6px 20px 0 rgba(20, 184, 166, 0.35)',
                                                                }
                                                            }}
                                                        >
                                                            Masuk Link Meeting
                                                        </Button>
                                                    )}

                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        startIcon={<CancelIcon />}
                                                        onClick={() => setOpenCancelDialog(true)}
                                                        disabled={showLoading}
                                                        sx={{
                                                            borderRadius: '0.75rem',
                                                            py: 1.5,
                                                            px: 3,
                                                            fontWeight: 500,
                                                            borderColor: theme.palette.error.main,
                                                            color: theme.palette.error.main,
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(239, 68, 68, 0.05)',
                                                                borderColor: theme.palette.error.dark
                                                            }
                                                        }}
                                                    >
                                                        Batalkan Interview
                                                    </Button>
                                                </>
                                            )}

                                            <Button
                                                variant="outlined"
                                                startIcon={<NoteAddIcon />}
                                                onClick={() => setOpenNoteDialog(true)}
                                                disabled={showLoading}
                                                sx={{
                                                    borderRadius: '0.75rem',
                                                    py: 1.5,
                                                    px: 3,
                                                    fontWeight: 500,
                                                    borderColor: 'divider',
                                                    color: 'text.primary',
                                                    '&:hover': {
                                                        borderColor: 'text.primary',
                                                        backgroundColor: alpha(theme.palette.text.primary, 0.05)
                                                    }
                                                }}
                                            >
                                                Tambah Catatan
                                            </Button>
                                        </Box>
                                    </Box>
                                </TabPanel>

                                <TabPanel value={tabValue} index={1}>
                                    <Box sx={{ p: 3 }}>
                                        <Typography
                                            variant="h6"
                                            fontWeight="bold"
                                            sx={{ mb: 3, color: 'primary.main' }}
                                        >
                                            Interviewer
                                        </Typography>

                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                            {interviewers && interviewers.length > 0 ? (
                                                interviewers.map((interviewer, index) => (
                                                    <Paper
                                                        key={index}
                                                        elevation={0}
                                                        sx={{
                                                            p: 2,
                                                            borderRadius: '0.75rem',
                                                            border: '1px solid',
                                                            borderColor: 'divider',
                                                            display: 'flex',
                                                            flexDirection: { xs: 'column', sm: 'row' },
                                                            alignItems: { xs: 'flex-start', sm: 'center' },
                                                            gap: 2
                                                        }}
                                                    >
                                                        <Avatar
                                                            src={interviewer.avatar}
                                                            alt={interviewer.name}
                                                            sx={{
                                                                width: { xs: 48, sm: 56 },
                                                                height: { xs: 48, sm: 56 },
                                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                                color: 'primary.main',
                                                                fontWeight: 'bold',
                                                                fontSize: '1.25rem'
                                                            }}
                                                        >
                                                            {interviewer.name ? interviewer.name.charAt(0) : 'U'}
                                                        </Avatar>

                                                        <Box sx={{ flex: 1 }}>
                                                            <Typography variant="body1" fontWeight="medium">
                                                                {interviewer.name}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {interviewer.position || 'HR Staff'}
                                                            </Typography>
                                                            {interviewer.company && (
                                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                                                    {interviewer.company}
                                                                </Typography>
                                                            )}
                                                        </Box>

                                                        {interviewer.email && (
                                                            <Button
                                                                variant="outlined"
                                                                startIcon={<EmailIcon />}
                                                                href={`mailto:${interviewer.email}`}
                                                                size="small"
                                                                sx={{
                                                                    borderRadius: '0.5rem',
                                                                    textTransform: 'none',
                                                                    borderColor: 'divider',
                                                                    color: 'text.primary',
                                                                    '&:hover': {
                                                                        borderColor: 'primary.main',
                                                                        backgroundColor: alpha(theme.palette.primary.main, 0.05)
                                                                    }
                                                                }}
                                                            >
                                                                Email
                                                            </Button>
                                                        )}
                                                    </Paper>
                                                ))
                                            ) : (
                                                <Box
                                                    sx={{
                                                        p: 3,
                                                        borderRadius: '0.75rem',
                                                        backgroundColor: alpha(theme.palette.grey[100], 0.5),
                                                        textAlign: 'center'
                                                    }}
                                                >
                                                    <Typography variant="body2" color="text.secondary">
                                                        Belum ada informasi interviewer
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>
                                    </Box>
                                </TabPanel>

                                <TabPanel value={tabValue} index={2}>
                                    <Box sx={{ p: 3 }}>
                                        <Typography
                                            variant="h6"
                                            fontWeight="bold"
                                            sx={{ mb: 3, color: 'primary.main' }}
                                        >
                                            Catatan
                                        </Typography>

                                        {eventData.notes ? (
                                            <Paper
                                                elevation={0}
                                                sx={{
                                                    p: 3,
                                                    borderRadius: '0.75rem',
                                                    border: '1px solid',
                                                    borderColor: 'divider',
                                                    backgroundColor: alpha(theme.palette.grey[50], 0.7)
                                                }}
                                            >
                                                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                                                    {eventData.notes}
                                                </Typography>

                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, textAlign: 'right' }}>
                                                    Terakhir diperbarui: {eventData.updated_at ? moment(eventData.updated_at).format('DD MMM YYYY, HH:mm') : 'Tidak diketahui'}
                                                </Typography>
                                            </Paper>
                                        ) : (
                                            <Box
                                                sx={{
                                                    p: 3,
                                                    borderRadius: '0.75rem',
                                                    backgroundColor: alpha(theme.palette.grey[100], 0.5),
                                                    textAlign: 'center',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: 2
                                                }}
                                            >
                                                <NoteAltOutlinedIcon sx={{ fontSize: 48, color: alpha(theme.palette.text.secondary, 0.3) }} />
                                                <Typography variant="body2" color="text.secondary">
                                                    Belum ada catatan untuk interview ini
                                                </Typography>
                                                <Button
                                                    variant="outlined"
                                                    startIcon={<AddIcon />}
                                                    onClick={() => setOpenNoteDialog(true)}
                                                    sx={{
                                                        mt: 1,
                                                        borderRadius: '0.75rem',
                                                        textTransform: 'none',
                                                        borderColor: 'divider',
                                                        color: 'text.primary',
                                                        '&:hover': {
                                                            borderColor: 'primary.main',
                                                            backgroundColor: alpha(theme.palette.primary.main, 0.05)
                                                        }
                                                    }}
                                                >
                                                    Tambah Catatan
                                                </Button>
                                            </Box>
                                        )}
                                    </Box>
                                </TabPanel>
                            </Paper>
                        </Box>

                        <Box sx={{ flex: 1 }}>
                            <Box sx={{ mb: 3 }}>
                                <EventCalendar eventDate={eventData.start_time} event={eventData} />
                            </Box>

                            <Card
                                elevation={0}
                                sx={{
                                    borderRadius: '1rem',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    overflow: 'hidden',
                                    transition: 'all 0.2s ease-in-out',
                                    '&:hover': {
                                        boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                                        borderColor: alpha(theme.palette.text.primary, 0.2)
                                    }
                                }}
                            >
                                <CardContent sx={{ p: 0 }}>
                                    <Box
                                        sx={{
                                            p: 2,
                                            borderBottom: '1px solid',
                                            borderColor: 'divider',
                                            display: 'flex',
                                            alignItems: 'center',
                                            backgroundColor: alpha(theme.palette.grey[50], 0.5)
                                        }}
                                    >
                                        <WorkOutlineIcon sx={{ mr: 1.5, color: 'text.secondary', opacity: 0.7 }} />
                                        <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
                                            Detail Lowongan
                                        </Typography>
                                    </Box>

                                    <Box sx={{ p: 2 }}>
                                        <Typography variant="body1" fontWeight="medium" gutterBottom>
                                            {applicationData?.job?.title || 'Posisi tidak tersedia'}
                                        </Typography>

                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <Avatar
                                                src={applicationData?.job?.company?.logo}
                                                alt={applicationData?.job?.company?.name}
                                                sx={{
                                                    width: 32,
                                                    height: 32,
                                                    mr: 1,
                                                    bgcolor: alpha(theme.palette.text.primary, 0.1)
                                                }}
                                            >
                                                {applicationData?.job?.company?.name.charAt(0)}
                                            </Avatar>
                                            <Typography variant="body2" color="text.secondary">
                                                {applicationData?.job?.company?.name || 'Perusahaan tidak tersedia'}
                                            </Typography>
                                        </Box>

                                        <Divider sx={{ my: 2 }} />

                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            <Paper
                                                elevation={0}
                                                sx={{
                                                    p: 1.5,
                                                    borderRadius: '0.75rem',
                                                    backgroundColor: alpha(theme.palette.grey[100], 0.7),
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
                                                    Status
                                                </Typography>
                                                {/*<Chip*/}
                                                {/*    label={applicationData?.status || 'Pending'}*/}
                                                {/*    size="small"*/}
                                                {/*    sx={{*/}
                                                {/*        borderRadius: '0.5rem',*/}
                                                {/*        backgroundColor: alpha(getJobApplicationStatusColor(applicationData?.status), 0.1),*/}
                                                {/*        color: getJobApplicationStatusColor(applicationData?.status),*/}
                                                {/*        '& .MuiChip-label': {*/}
                                                {/*            fontSize: '0.7rem',*/}
                                                {/*            fontWeight: 'medium',*/}
                                                {/*            px: 1*/}
                                                {/*        }*/}
                                                {/*    }}*/}
                                                {/*/>*/}
                                            </Paper>
                                            <Paper
                                                elevation={0}
                                                sx={{
                                                    p: 1.5,
                                                    borderRadius: '0.75rem',
                                                    backgroundColor: alpha(theme.palette.grey[100], 0.7),
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
                                                    Fase
                                                </Typography>
                                                <Typography variant="body2" fontWeight="medium" align="center">
                                                    {getRecruitmentPhaseName(applicationData?.phase)}
                                                </Typography>
                                            </Paper>
                                        </Box>

                                        <Box sx={{ mt: 3 }}>
                                            <Button
                                                component={Link}
                                                // href={route('candidate.applications.show', applicationData?.id)}
                                                fullWidth
                                                variant="outlined"
                                                // startIcon={<Visi />}
                                                sx={{
                                                    borderRadius: '0.75rem',
                                                    py: 1,
                                                    borderColor: 'divider',
                                                    color: 'text.primary',
                                                    fontWeight: 500,
                                                    '&:hover': {
                                                        borderColor: 'text.primary',
                                                        backgroundColor: alpha(theme.palette.text.primary, 0.05)
                                                    }
                                                }}
                                            >
                                                Lihat Detail Lamaran
                                            </Button>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Box>
                    </Box>
                </motion.div>
            </Container>
        </Layout>
    );
}

function getJobApplicationStatusColor(status) {
    if (!status) return 'grey.500';

    switch (status) {
        case 'accepted':
            return 'success.main';
        case 'rejected':
            return 'error.main';
        case 'pending':
            return 'warning.main';
        default:
            return 'grey.500';
    }
}

function getJobApplicationStatus(status) {
    if (!status) return 'Pending';

    switch (status) {
        case 'accepted':
            return 'Diterima';
        case 'rejected':
            return 'Ditolak';
        case 'pending':
            return 'Menunggu';
        default:
            return status || 'Pending';
    }
}

function getRecruitmentPhaseName(phase) {
    if (!phase) return 'Tidak Ditentukan';

    switch (phase) {
        case 'screening':
            return 'Seleksi';
        case 'interview':
            return 'Wawancara';
        case 'offer':
            return 'Penawaran';
        case 'onboarding':
            return 'Onboarding';
        default:
            return phase || 'Tidak Ditentukan';
    }
}
