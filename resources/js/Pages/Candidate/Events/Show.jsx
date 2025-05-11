import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
  Box, Typography, Container, Grid, Card, CardContent,
  Paper, Button, Chip, Divider, IconButton, Avatar,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Alert, List, ListItem, ListItemIcon,
  ListItemText, ListItemAvatar, Breadcrumbs, Tooltip,
    Stack, Stepper, Step, StepLabel, StepContent,
    LinearProgress, useTheme, useMediaQuery,
    Badge, CircularProgress, Tabs, Tab, Menu,
    MenuItem, Collapse, Fade, Zoom
} from '@mui/material';
import {
  Event as EventIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  PersonOutline as PersonIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Videocam as VideocamIcon,
  Business as BusinessIcon,
  ArrowBack as ArrowBackIcon,
  Description as DescriptionIcon,
  ChevronRight as ChevronRightIcon,
  NoteAdd as NoteAddIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
    Add as AddIcon,
    Close as CloseIcon,
    ContentCopy as ContentCopyIcon,
    Bookmark as BookmarkIcon,
    InfoOutlined as InfoOutlinedIcon,
    CheckCircleOutline as CheckCircleOutlineIcon,
    Create as CreateIcon,
    MoreVert as MoreVertIcon,
    NavigateNext as NavigateNextIcon,
    NavigateBefore as NavigateBeforeIcon,
    Launch as LaunchIcon,
    WorkOutline as WorkOutlineIcon,
    School as SchoolIcon,
    LocalOffer as LocalOfferIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import moment from 'moment';
import 'moment/locale/id';

import Layout from "@/Components/Layout/Layout.jsx";

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
            id={`event-tabpanel-${index}`}
            aria-labelledby={`event-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ pt: 3 }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={index}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </Box>
            )}
        </div>
    );
};

// Enhanced Dialog component
const EnhancedDialog = ({
                            open,
                            onClose,
                            title,
                            content,
                            actions,
                            maxWidth = 'sm',
                            color = 'primary',
                            icon = null
                        }) => {
    const theme = useTheme();

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth={maxWidth}
            fullWidth
            PaperProps={{
                elevation: 0,
                sx: {
                    borderRadius: '1rem',
                    overflow: 'hidden',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                    border: '1px solid',
                    borderColor: 'divider'
                }
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 3,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    bgcolor: color === 'primary' ? 'primary.50' :
                        color === 'success' ? 'success.50' :
                            color === 'error' ? 'error.50' : 'primary.50',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {icon && (
                        <Box
                            sx={{
                                mr: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                backgroundColor: color === 'primary' ? 'primary.100' :
                                    color === 'success' ? 'success.100' :
                                        color === 'error' ? 'error.100' : 'primary.100',
                            }}
                        >
                            {React.cloneElement(icon, {
                                fontSize: 'medium',
                                sx: {
                                    color: color === 'primary' ? 'primary.main' :
                                        color === 'success' ? 'success.main' :
                                            color === 'error' ? 'error.main' : 'primary.main'
                                }
                            })}
                        </Box>
                    )}
                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        color={color === 'primary' ? 'primary.main' :
                            color === 'success' ? 'success.main' :
                                color === 'error' ? 'error.main' : 'primary.main'}
                    >
                        {title}
                    </Typography>
                </Box>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box>

            <DialogContent sx={{ p: 3 }}>
                {content}
            </DialogContent>

            {actions && (
                <DialogActions sx={{ p: 3, pt: 0 }}>
                    {actions}
                </DialogActions>
            )}
        </Dialog>
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
        if (!type) return 'Undefined';

        switch (type) {
            case 'online':
                return 'Online Interview';
            case 'onsite':
                return 'In-person Interview';
            default:
                return type;
    }
  };

  // Langkah-langkah interview
  const interviewSteps = [
    {
      label: 'Undangan Interview',
            description: `Undangan interview untuk posisi ${applicationData?.job?.title || 'pekerjaan'} telah dikirim.`,
            date: eventData.created_at,
            icon: <EventIcon color="primary" />
    },
    {
      label: 'Konfirmasi Kehadiran',
            description: eventData.status === 'confirmed'
        ? 'Anda telah mengkonfirmasi kehadiran.'
                : (eventData.status === 'canceled'
          ? 'Anda telah membatalkan interview.'
          : 'Menunggu konfirmasi kehadiran Anda.'),
            date: eventData.confirmed_at,
            icon: eventData.status === 'confirmed' ? <CheckIcon color="success" /> :
                eventData.status === 'canceled' ? <CancelIcon color="error" /> :
                    <TimeIcon color="warning" />
    },
    {
      label: 'Pelaksanaan Interview',
            description: moment(eventData.start_time).isBefore(moment())
        ? 'Interview telah dilaksanakan.'
        : 'Interview akan dilaksanakan sesuai jadwal.',
            date: eventData.start_time,
            icon: moment(eventData.start_time).isBefore(moment()) ?
                <CheckCircleOutlineIcon color="info" /> :
                <EventIcon color="primary" />
    },
    {
      label: 'Hasil Interview',
            description: eventData.result
                ? `Hasil interview: ${eventData.result}`
        : 'Menunggu hasil interview.',
            date: eventData.result_at,
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
        if (moment(eventData.end_time).isBefore(moment())) return 2;
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
                                        width: 2,
                                        bgcolor: isCompleted ? 'primary.main' : 'divider',
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
                                    bgcolor: isActive ? 'primary.main' :
                                        isCompleted ? 'primary.50' : 'grey.100',
                                    border: '2px solid',
                                    borderColor: isActive ? 'primary.main' :
                                        isCompleted ? 'primary.main' : 'divider',
                                    color: isActive ? 'white' :
                                        isCompleted ? 'primary.main' : 'text.secondary',
                                    zIndex: 1
                                }}
                            >
                                {step.icon || (isCompleted ? <CheckIcon /> : index + 1)}
        </Box>

                            {/* Step content */}
                            <Box sx={{ ml: 2, flex: 1 }}>
                                <Typography
                                    variant="subtitle1"
                                    fontWeight={isActive || isCompleted ? 'bold' : 'medium'}
                                    color={isActive ? 'primary.main' :
                                        isCompleted ? 'text.primary' : 'text.secondary'}
                                >
                                    {step.label}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" paragraph sx={{ mt: 0.5 }}>
                                    {step.description}
                                </Typography>
                                {step.date && (
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
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

    // Render cancel dialog content
    const renderCancelDialogContent = () => (
        <>
            <Alert
                severity="warning"
                variant="outlined"
                  sx={{
                    mb: 3,
                    borderRadius: '0.75rem',
                    '& .MuiAlert-icon': {
                        color: theme.palette.warning.main
                    }
                }}
            >
                <Typography variant="subtitle2">
                    {eventData.status === 'pending'
                        ? 'Menolak undangan interview dapat mempengaruhi penilaian perusahaan terhadap aplikasi Anda.'
                        : 'Membatalkan interview yang telah terkonfirmasi dapat mempengaruhi penilaian perusahaan terhadap aplikasi Anda.'}
                  </Typography>
            </Alert>

            <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                    Detail Interview:
                </Typography>

                <Stack spacing={1.5} sx={{ mt: 2, mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <EventIcon sx={{ mr: 1.5, color: 'primary.main', opacity: 0.7 }} />
                        <Typography variant="body2">
                            {eventData.title}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarIcon sx={{ mr: 1.5, color: 'primary.main', opacity: 0.7 }} />
                        <Typography variant="body2">
                            {moment(eventData.start_time).format('dddd, DD MMMM YYYY')}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TimeIcon sx={{ mr: 1.5, color: 'primary.main', opacity: 0.7 }} />
                        <Typography variant="body2">
                            {moment(eventData.start_time).format('HH:mm')} - {moment(eventData.end_time).format('HH:mm')}
                        </Typography>
                      </Box>
                </Stack>
            </Box>

            <Divider sx={{ my: 2 }} />

            <TextField
                autoFocus
                margin="dense"
                label="Alasan"
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Berikan alasan mengapa Anda tidak dapat menghadiri interview ini."
                required
                    sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '0.75rem',
                        '&:hover fieldset': {
                            borderColor: 'primary.main',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: 'primary.main',
                            boxShadow: '0 0 0 3px rgba(20, 184, 166, 0.1)'
                        }
                    }
                }}
            />
        </>
    );

    // Render cancel dialog actions
    const renderCancelDialogActions = () => (
        <>
            <Button
                onClick={() => setOpenCancelDialog(false)}
                variant="outlined"
                sx={{
                    borderRadius: '0.75rem',
                    py: 1,
                    px: 3,
                    fontWeight: 500,
                    borderColor: 'divider',
                    color: 'text.primary',
                    '&:hover': {
                        borderColor: 'primary.main',
                        backgroundColor: 'rgba(20, 184, 166, 0.05)'
                    }
                }}
                disabled={showLoading}
            >
                Batal
            </Button>
            <Button
                variant="contained"
                color="error"
                onClick={handleCancel}
                disabled={!cancelReason.trim() || showLoading}
                sx={{
                    borderRadius: '0.75rem',
                    py: 1,
                    px: 3,
                    fontWeight: 600,
                    boxShadow: '0 4px 14px 0 rgba(239, 68, 68, 0.25)',
                    '&:hover': {
                        boxShadow: '0 6px 20px 0 rgba(239, 68, 68, 0.35)',
                    }
                }}
            >
                {showLoading ? (
                    <CircularProgress size={24} color="inherit" />
                ) : (
                    eventData.status === 'pending' ? 'Tolak Interview' : 'Batalkan Interview'
                )}
            </Button>
        </>
    );

    // Render note dialog content
    const renderNoteDialogContent = () => (
        <>
            <Alert
                severity="info"
                variant="outlined"
                sx={{
                    mb: 3,
                    borderRadius: '0.75rem',
                    '& .MuiAlert-icon': {
                        color: theme.palette.info.main
                    }
                }}
            >
                <Typography variant="subtitle2">
                    Catatan ini hanya dapat dilihat oleh Anda dan bisa digunakan untuk mencatat hal-hal penting selama interview.
                      </Typography>
            </Alert>

            <TextField
                autoFocus
                margin="dense"
                label="Catatan"
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Tambahkan catatan tentang interview (misalnya: pertanyaan yang diajukan, hal yang perlu dipersiapkan, dll)"
                required
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '0.75rem',
                        '&:hover fieldset': {
                            borderColor: 'primary.main',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: 'primary.main',
                            boxShadow: '0 0 0 3px rgba(20, 184, 166, 0.1)'
                        }
                    }
                }}
            />
        </>
    );

    // Render note dialog actions
    const renderNoteDialogActions = () => (
        <>
            <Button
                onClick={() => setOpenNoteDialog(false)}
                variant="outlined"
                sx={{
                    borderRadius: '0.75rem',
                    py: 1,
                    px: 3,
                    fontWeight: 500,
                    borderColor: 'divider',
                    color: 'text.primary',
                    '&:hover': {
                        borderColor: 'primary.main',
                        backgroundColor: 'rgba(20, 184, 166, 0.05)'
                    }
                }}
                disabled={showLoading}
            >
                Batal
            </Button>
            <Button
                variant="contained"
                color="primary"
                onClick={handleAddNote}
                disabled={!note.trim() || showLoading}
                sx={{
                    borderRadius: '0.75rem',
                    py: 1,
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
                    'Simpan Catatan'
                )}
            </Button>
        </>
    );

    return (
        <Layout>
            <Head title={`Interview - ${eventData.title}`} />

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
                                {eventData.title}
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
                    {isUpcoming && (
                        <Box sx={{ mb: 4 }}>
                            <Paper
                                elevation={0}
                                sx={{
                                    borderRadius: '1.5rem',
                                    overflow: 'hidden',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    position: 'relative'
                                }}
                            >
                                <Box
                                    sx={{
                                        p: { xs: 3, md: 4 },
                                        background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.1) 0%, rgba(15, 118, 110, 0.05) 100%)',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {/* Decorative elements */}
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            width: 300,
                                            height: 300,
                                            borderRadius: '50%',
                                            backgroundColor: 'rgba(20, 184, 166, 0.05)',
                                            top: -150,
                                            right: -100
                                        }}
                                    />
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            width: 200,
                                            height: 200,
                                            borderRadius: '50%',
                                            backgroundColor: 'rgba(20, 184, 166, 0.03)',
                                            bottom: -100,
                                            left: '30%'
                                        }}
                                    />

                                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                                        <Chip
                                            label={isToday ? "Hari Ini" : "Jadwal Interview"}
                                            color="primary"
                                            size="small"
                                            sx={{
                                                borderRadius: '0.5rem',
                                                fontWeight: 'bold',
                                                px: 1,
                                                mb: 2
                                            }}
                                        />
                                        <Typography
                                            variant={isMobile ? "h5" : "h4"}
                                            fontWeight="bold"
                                            color="primary.main"
                                            gutterBottom
                                        >
                                            {eventData.title}
                        </Typography>

                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, flexWrap: 'wrap' }}>
                                            <Typography
                                                variant="body1"
                                                sx={{ display: 'flex', alignItems: 'center', mr: 3, mb: { xs: 1, md: 0 } }}
                                            >
                                                <CalendarIcon sx={{ mr: 1, color: 'primary.main', opacity: 0.7 }} />
                                                {moment(eventData.start_time).format('dddd, DD MMMM YYYY')}
                      </Typography>
                                            <Typography
                                                variant="body1"
                                                sx={{ display: 'flex', alignItems: 'center', mr: 3, mb: { xs: 1, md: 0 } }}
                                            >
                                                <TimeIcon sx={{ mr: 1, color: 'primary.main', opacity: 0.7 }} />
                                                {moment(eventData.start_time).format('HH:mm')} - {moment(eventData.end_time).format('HH:mm')} WIB
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
                                        sx={{ mt: 4, mb: 2, color: 'primary.main' }}
                                    >
                                        Waktu Menuju Interview
                      </Typography>

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
                                                    borderColor: 'primary.main',
                                                    backgroundColor: 'rgba(20, 184, 166, 0.05)'
                                                }
                                            }}
                            >
                              Tambah Catatan
                            </Button>
                        </Box>
                      </Box>

                                {/* Status Bar */}
                                <Box
                                    sx={{
                                        p: 2,
                                        borderTop: '1px solid',
                                        borderColor: 'divider',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        backgroundColor: 'background.paper'
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Chip
                                            icon={getStatusIcon(eventData.status)}
                                            label={getStatusText(eventData.status)}
                                            size="small"
                                            sx={{
                                                borderRadius: '0.5rem',
                                                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                                '& .MuiChip-label': {
                                                    fontWeight: 'medium'
                                                },
                                                '& .MuiChip-icon': {
                                                    color: getStatusColor(eventData.status)
                                                },
                                                color: getStatusColor(eventData.status)
                                            }}
                                        />

                                        {eventData.type === 'online' && eventData.meeting_link && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', ml: 3 }}>
                                                <Tooltip title="Salin Link Meeting">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => copyToClipboard(eventData.meeting_link)}
                                                        sx={{
                                                            mr: 1,
                                                            backgroundColor: 'rgba(20, 184, 166, 0.05)',
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(20, 184, 166, 0.1)'
                                                            }
                                                        }}
                                                    >
                                                        {copied ? <CheckIcon fontSize="small" color="success" /> : <ContentCopyIcon fontSize="small" color="primary" />}
                                                    </IconButton>
                                                </Tooltip>
                                                <Link
                                                    href={eventData.meeting_link}
                                                    target="_blank"
                                                    sx={{
                                                        color: 'primary.main',
                                                        textDecoration: 'none',
                                                        '&:hover': {
                                                            textDecoration: 'underline'
                                                        }
                                                    }}
                                                >
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            fontWeight: 'medium'
                                                        }}
                                                    >
                                                        Link Meeting
                                                        <LaunchIcon fontSize="inherit" sx={{ ml: 0.5 }} />
                    </Typography>
                                                </Link>
                                            </Box>
                                        )}
                                    </Box>

                                    {eventData.type === 'onsite' && eventData.location && (
                                        <Tooltip title={eventData.location}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <LocationIcon sx={{ mr: 1, color: 'primary.main', opacity: 0.7, fontSize: 18 }} />
                                                <Typography variant="body2" noWrap sx={{ maxWidth: { xs: 120, sm: 200, md: 'none' } }}>
                                                    {eventData.location}
                                                </Typography>
                                            </Box>
                                        </Tooltip>
                                    )}
                                </Box>
                            </Paper>
                        </Box>
                    )}

                    {/* Main Content */}
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '1fr', md: '8fr 4fr', lg: '8fr 4fr' },
                        gap: 3
                    }}>
                        <Box>
                            <Paper
                                elevation={0}
                                sx={{
                                    borderRadius: '1.5rem',
                                    overflow: 'hidden',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    mb: 4
                                }}
                            >
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <Tabs
                                        value={tabValue}
                                        onChange={handleTabChange}
                                        aria-label="event tabs"
                                        variant={isMobile ? "fullWidth" : "standard"}
                                        sx={{
                                            px: 3,
                                            '& .MuiTab-root': {
                                                py: 2,
                                                px: 2,
                                                fontWeight: 600,
                                                textTransform: 'none',
                                                minWidth: 0,
                                                color: 'text.secondary',
                                                '&.Mui-selected': {
                                                    color: 'primary.main'
                                                }
                                            },
                                            '& .MuiTabs-indicator': {
                                                height: 3,
                                                borderTopLeftRadius: 3,
                                                borderTopRightRadius: 3,
                                                backgroundColor: 'primary.main'
                                            }
                                        }}
                                    >
                                        <Tab label="Informasi" id="event-tab-0" aria-controls="event-tabpanel-0" />
                                        <Tab label="Tahapan" id="event-tab-1" aria-controls="event-tabpanel-1" />
                                        {eventData.notes && <Tab label="Catatan" id="event-tab-2" aria-controls="event-tabpanel-2" />}
                                    </Tabs>
                                </Box>

                                <Box sx={{ p: { xs: 2, md: 3 } }}>
                                    <TabPanel value={tabValue} index={0}>
                                        <Box>
                                            <Typography variant="h6" fontWeight="bold" gutterBottom color="primary.main">
                                                Detail Interview
                        </Typography>

                                            <Box sx={{
                                                gridColumn: { xs: '1', sm: '1 / span 2' },
                                                gap: 3
                                            }}>


                                                <Box>
                                                    <Card
                                                        elevation={0}
                                                        sx={{
                                                            height: '100%',
                                                            borderRadius: '1rem',
                                                            border: '1px solid',
                                                            borderColor: 'divider'
                                                        }}
                                                    >
                                                        <CardContent>
                                                            <Typography
                                                                variant="subtitle1"
                                                                fontWeight="bold"
                                                                gutterBottom
                                                                sx={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    color: 'primary.main'
                                                                }}
                                                            >
                                                                <EventIcon sx={{ mr: 1, fontSize: 20 }} />
                                                                Jadwal
                        </Typography>
                                                            <Box sx={{ mt: 1 }}>
                                                                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                                                                    <CalendarIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 18, mt: 0.3 }} />
                                                                    <Typography variant="body2">
                                                                        {moment(eventData.start_time).format('dddd, DD MMMM YYYY')}
                        </Typography>
                                                                </Box>
                                                                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                                                                    <TimeIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 18, mt: 0.3 }} />
                                                                    <Typography variant="body2">
                                                                        {moment(eventData.start_time).format('HH:mm')} - {moment(eventData.end_time).format('HH:mm')} WIB
                                                                        <Typography variant="caption" color="text.secondary" display="block">
                                                                            Durasi: {moment.duration(moment(eventData.end_time).diff(moment(eventData.start_time))).asMinutes()} menit
                                                                        </Typography>
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                        </CardContent>
                                                    </Card>
                                                </Box>

                                                <Box sx={{ gridColumn: { xs: '1', sm: '1 / span 2' } }}>
                                                    <Card
                                                        elevation={0}
                                                        sx={{
                                                            borderRadius: '1rem',
                                                            border: '1px solid',
                                                            borderColor: 'divider'
                                                        }}
                                                    >
                                                        <CardContent>
                                                            <Typography
                                                                variant="subtitle1"
                                                                fontWeight="bold"
                                                                gutterBottom
                                                                sx={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    color: 'primary.main'
                                                                }}
                                                            >
                                                                <PersonIcon sx={{ mr: 1, fontSize: 20 }} />
                                                                Interviewer
                        </Typography>

                                                            {interviewersList && interviewersList.length > 0 ? (
                                                                <List disablePadding>
                                                                    {interviewersList.map((interviewer, index) => (
                                                                        <React.Fragment key={index}>
                                                                            {index > 0 && <Divider component="li" sx={{ my: 1 }} />}
                                                                            <ListItem
                                                                                disablePadding
                                                                                disableGutters
                                                                                sx={{ py: 1 }}
                                                                            >
                                                                                <ListItemAvatar>
                                                                                    <Avatar
                                                                                        alt={interviewer.name}
                                                                                        src={interviewer.avatar}
                                                                                        sx={{
                                                                                            bgcolor: 'primary.light',
                                                                                            width: 40,
                                                                                            height: 40
                                                                                        }}
                                                                                    >
                                                                                        {interviewer.name.charAt(0)}
                                                                                    </Avatar>
                                                                                </ListItemAvatar>
                                                                                <ListItemText
                                                                                    primary={
                                                                                        <Typography variant="body1" fontWeight="medium">
                                                                                            {interviewer.name}
                                                                                        </Typography>
                                                                                    }
                                                                                    secondary={
                                                                                        <>
                                                                                            {interviewer.position && (
                                                                                                <Typography variant="body2" color="text.secondary" display="block">
                                                                                                    {interviewer.position}
                                                                                                </Typography>
                                                                                            )}
                                                                                            {interviewer.company && (
                                                                                                <Typography
                                                                                                    variant="caption"
                                                                                                    color="text.secondary"
                                                                                                    sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}
                                                                                                >
                                                                                                    <BusinessIcon sx={{ mr: 0.5, fontSize: 14 }} />
                                                                                                    {interviewer.company}
                                                                                                </Typography>
                                                                                            )}
                                                                                        </>
                                                                                    }
                                                                                />
                                                                            </ListItem>
                                                                        </React.Fragment>
                                                                    ))}
                                                                </List>
                                                            ) : (
                                                                <Typography variant="body2" color="text.secondary">
                                                                    Belum ada interviewer yang ditentukan.
                                                                </Typography>
                                                            )}
                                                        </CardContent>
                                                    </Card>
                                                </Box>

                                                {eventData.type === 'online' && eventData.meeting_platform && (
                                                    <Box>
                                                        <Card
                                                            elevation={0}
                                                            sx={{
                                                                height: '100%',
                                                                borderRadius: '1rem',
                                                                border: '1px solid',
                                                                borderColor: 'divider'
                                                            }}
                                                        >
                                                            <CardContent>
                                                                <Typography
                                                                    variant="subtitle1"
                                                                    fontWeight="bold"
                                                                    gutterBottom
                                                                    sx={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        color: 'primary.main'
                                                                    }}
                                                                >
                                                                    <VideocamIcon sx={{ mr: 1, fontSize: 20 }} />
                                                                    Platform Meeting
                                                                </Typography>
                                                                <Typography variant="body1">
                                                                    {eventData.meeting_platform}
                                                                </Typography>

                                                                {eventData.meeting_id && (
                                                                    <Box sx={{ mt: 1 }}>
                                                                        <Typography variant="body2" color="text.secondary">
                                                                            Meeting ID: {eventData.meeting_id}
                                                                        </Typography>
                                                                        {eventData.meeting_passcode && (
                                                                            <Typography variant="body2" color="text.secondary">
                                                                                Passcode: {eventData.meeting_passcode}
                                                                            </Typography>
                                                                        )}
                                                                    </Box>
                                                                )}

                                                                {eventData.meeting_link && (
                      <Button
                        variant="outlined"
                        size="small"
                                                                        startIcon={<LaunchIcon />}
                                                                        href={eventData.meeting_link}
                                                                        target="_blank"
                                                                        sx={{
                                                                            mt: 2,
                                                                            borderRadius: '0.75rem',
                                                                            fontWeight: 500,
                                                                            textTransform: 'none'
                                                                        }}
                                                                    >
                                                                        Buka Link Meeting
                      </Button>
                                                                )}
                                                            </CardContent>
                                                        </Card>
                                                    </Box>
                                                )}

                                                {eventData.type === 'onsite' && eventData.location && (
                                                    <Box>
                                                        <Card
                                                            elevation={0}
                                                            sx={{
                                                                height: '100%',
                                                                borderRadius: '1rem',
                                                                border: '1px solid',
                                                                borderColor: 'divider'
                                                            }}
                                                        >
                  <CardContent>
                                                                <Typography
                                                                    variant="subtitle1"
                                                                    fontWeight="bold"
                                                                    gutterBottom
                                                                    sx={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        color: 'primary.main'
                                                                    }}
                                                                >
                                                                    <LocationIcon sx={{ mr: 1, fontSize: 20 }} />
                                                                    Lokasi
                                                                </Typography>
                                                                <Typography variant="body1">
                                                                    {eventData.location}
                      </Typography>

                                                                {eventData.location_detail && (
                                                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                                        {eventData.location_detail}
                                                                    </Typography>
                                                                )}

                                                                {eventData.location_maps_url && (
                      <Button
                                                                        variant="outlined"
                        size="small"
                                                                        startIcon={<LocationIcon />}
                                                                        href={eventData.location_maps_url}
                                                                        target="_blank"
                                                                        sx={{
                                                                            mt: 2,
                                                                            borderRadius: '0.75rem',
                                                                            fontWeight: 500,
                                                                            textTransform: 'none'
                                                                        }}
                                                                    >
                                                                        Lihat di Maps
                      </Button>
                                                                )}
                                                            </CardContent>
                                                        </Card>
                                                    </Box>
                                                )}

                                                {eventData.instructions && (
                                                    <Box>
                                                        <Card
                                                            elevation={0}
                                                            sx={{
                                                                borderRadius: '1rem',
                                                                border: '1px solid',
                                                                borderColor: 'divider'
                                                            }}
                                                        >
                                                            <CardContent>
                                                                <Typography
                                                                    variant="subtitle1"
                                                                    fontWeight="bold"
                                                                    gutterBottom
                                                                    sx={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        color: 'primary.main'
                                                                    }}
                                                                >
                                                                    <InfoOutlinedIcon sx={{ mr: 1, fontSize: 20 }} />
                                                                    Petunjuk &amp; Persiapan
                                                                </Typography>
                                                                <Typography variant="body2" component="div">
                                                                    <div dangerouslySetInnerHTML={{ __html: eventData.instructions }} />
                                                                </Typography>
                                                            </CardContent>
                                                        </Card>
                                                    </Box>
                                                )}
                                            </Box>
                    </Box>
                                    </TabPanel>

                                    <TabPanel value={tabValue} index={1}>
                                        <Box>
                                            <Typography variant="h6" fontWeight="bold" gutterBottom color="primary.main">
                                                Tahapan Interview
                                            </Typography>

                                            <ModernStepper steps={interviewSteps} activeStep={getActiveStep()} />
                                        </Box>
                                    </TabPanel>

                                    {eventData.notes && (
                                        <TabPanel value={tabValue} index={2}>
                                            <Box>
                                                <Typography variant="h6" fontWeight="bold" gutterBottom color="primary.main">
                                                    Catatan Interview
                                                </Typography>

                      <Paper
                                                    elevation={0}
                                                    sx={{
                                                        p: 3,
                                                        borderRadius: '1rem',
                                                        backgroundColor: 'rgba(20, 184, 166, 0.05)',
                                                        border: '1px solid rgba(20, 184, 166, 0.1)',
                                                        position: 'relative'
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            position: 'absolute',
                                                            top: 12,
                                                            right: 12,
                                                            display: 'flex',
                                                            gap: 1
                                                        }}
                                                    >
                                                        <Tooltip title="Edit Catatan">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => {
                                                                    setNote(eventData.notes);
                                                                    setOpenNoteDialog(true);
                                                                }}
                                                                sx={{
                                                                    backgroundColor: 'rgba(20, 184, 166, 0.1)',
                                                                    '&:hover': {
                                                                        backgroundColor: 'rgba(20, 184, 166, 0.2)'
                                                                    }
                                                                }}
                                                            >
                                                                <CreateIcon fontSize="small" color="primary" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>

                                                    <Typography variant="body1">
                                                        {eventData.notes}
                              </Typography>

                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                        sx={{
                                                            display: 'block',
                                                            mt: 2,
                                                            textAlign: 'right',
                                                            fontStyle: 'italic'
                                                        }}
                                                    >
                                                        Terakhir diperbarui: {moment(eventData.updated_at).format('DD MMM YYYY, HH:mm')}
                            </Typography>
                                                </Paper>
                          </Box>
                                        </TabPanel>
                                    )}
                        </Box>
                      </Paper>
            </Box>

                        <Box>
                            {/* Profile Card */}
                            <Paper
                                elevation={0}
                                sx={{
                                    borderRadius: '1.5rem',
                                    overflow: 'hidden',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    mb: 3
                                }}
                            >
                                <Box
                                    sx={{
                                        p: 3,
                                        background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.1) 0%, rgba(15, 118, 110, 0.05) 100%)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {/* Decorative elements */}
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            width: 150,
                                            height: 150,
                                            borderRadius: '50%',
                                            backgroundColor: 'rgba(20, 184, 166, 0.05)',
                                            top: -75,
                                            right: -50
                                        }}
                                    />

                                    <Avatar
                                        alt={userData.name}
                                        src={userData.profile_photo_url}
                                        sx={{ width: 80, height: 80, mb: 2, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}
                                    >
                                        {userData.name.charAt(0)}
                                    </Avatar>

                                    <Typography variant="h6" fontWeight="bold">
                                        {userData.name}
                            </Typography>

                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        {userData.email}
                      </Typography>

                                    {userData.phone && (
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                mb: 2
                                            }}
                                        >
                                            {userData.phone}
                        </Typography>
                      )}
                                </Box>

                                <Box sx={{ p: 3 }}>
                                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                        Informasi Kandidat
                      </Typography>

                      <List disablePadding>
                                        {userData.current_job && (
                                            <ListItem disablePadding disableGutters sx={{ py: 1 }}>
                                                <ListItemIcon sx={{ minWidth: 40 }}>
                                                    <WorkOutlineIcon color="primary" fontSize="small" />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={userData.current_job}
                                                    secondary={userData.current_company}
                                                    primaryTypographyProps={{
                                                        variant: 'body2',
                                                        fontWeight: 'medium'
                                                    }}
                                                    secondaryTypographyProps={{
                                                        variant: 'caption'
                                                    }}
                                                />
                                            </ListItem>
                                        )}

                                        {userData.education && (
                                            <ListItem disablePadding disableGutters sx={{ py: 1 }}>
                                                <ListItemIcon sx={{ minWidth: 40 }}>
                                                    <SchoolIcon color="primary" fontSize="small" />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={userData.education}
                                                    secondary={userData.education_year}
                                                    primaryTypographyProps={{
                                                        variant: 'body2',
                                                        fontWeight: 'medium'
                                                    }}
                                                    secondaryTypographyProps={{
                                                        variant: 'caption'
                                                    }}
                                                />
                                            </ListItem>
                                        )}

                                        {userData.location && (
                                            <ListItem disablePadding disableGutters sx={{ py: 1 }}>
                                                <ListItemIcon sx={{ minWidth: 40 }}>
                                                    <LocationIcon color="primary" fontSize="small" />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={userData.location}
                                                    primaryTypographyProps={{
                                                        variant: 'body2',
                                                        fontWeight: 'medium'
                                                    }}
                                                />
                                            </ListItem>
                                        )}
                                    </List>

                                    {userData.skills && userData.skills.length > 0 && (
                                        <Box sx={{ mt: 2 }}>
                                            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                                Skills
                                            </Typography>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                {userData.skills.map((skill, index) => (
                                                    <Chip
                            key={index}
                                                        label={skill}
                                                        size="small"
                                                        icon={<LocalOfferIcon fontSize="small" />}
                                                        sx={{
                                                            borderRadius: '0.5rem',
                                                            backgroundColor: 'rgba(20, 184, 166, 0.1)',
                                                            color: 'primary.main',
                                                            fontWeight: 'medium',
                                                            '& .MuiChip-icon': {
                                                                color: 'primary.main'
                                                            }
                                                        }}
                                                    />
                                                ))}
                                            </Box>
                                        </Box>
                                    )}
                                </Box>
                            </Paper>

                            {/* Tips Card */}
                            <Paper
                                elevation={0}
                                sx={{
                                    borderRadius: '1.5rem',
                                    overflow: 'hidden',
                                    border: '1px solid',
                                    borderColor: 'divider'
                                }}
                            >
                                <Box
                                    sx={{
                                        p: 2,
                                        backgroundColor: 'primary.50',
                                        borderBottom: '1px solid rgba(20, 184, 166, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <Typography
                                        variant="subtitle1"
                                        fontWeight="bold"
                                        color="primary.main"
                                        sx={{ display: 'flex', alignItems: 'center' }}
                                    >
                                        <InfoOutlinedIcon sx={{ mr: 1 }} />
                                        Tips Interview
                                    </Typography>
                                    <IconButton size="small">
                                        <BookmarkIcon fontSize="small" color="primary" />
                                    </IconButton>
                                </Box>

                                <Box sx={{ p: 3 }}>
                                    <List disablePadding sx={{ '& .MuiListItem-root': { py: 1.5 } }}>
                                        <ListItem disableGutters>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                                                <CheckCircleOutlineIcon color="success" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText
                                                primary="Riset tentang perusahaan"
                                                secondary="Pelajari visi misi, budaya dan produk perusahaan"
                                                primaryTypographyProps={{
                                                    variant: 'body2',
                                                    fontWeight: 'medium'
                                                }}
                                                secondaryTypographyProps={{
                                                    variant: 'caption'
                                                }}
                            />
                          </ListItem>

                                        <ListItem disableGutters>
                                            <ListItemIcon sx={{ minWidth: 36 }}>
                                                <CheckCircleOutlineIcon color="success" fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="Siapkan dokumen penting"
                                                secondary="Resume, portfolio, dan dokumen pendukung lainnya"
                                                primaryTypographyProps={{
                                                    variant: 'body2',
                                                    fontWeight: 'medium'
                                                }}
                                                secondaryTypographyProps={{
                                                    variant: 'caption'
                                                }}
                                            />
                                        </ListItem>

                                        <ListItem disableGutters>
                                            <ListItemIcon sx={{ minWidth: 36 }}>
                                                <CheckCircleOutlineIcon color="success" fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="Berlatih pertanyaan umum"
                                                secondary="Tentang kekuatan, kelemahan, pengalaman dan alasan melamar"
                                                primaryTypographyProps={{
                                                    variant: 'body2',
                                                    fontWeight: 'medium'
                                                }}
                                                secondaryTypographyProps={{
                                                    variant: 'caption'
                                                }}
                                            />
                                        </ListItem>

                                        <ListItem disableGutters>
                                            <ListItemIcon sx={{ minWidth: 36 }}>
                                                <CheckCircleOutlineIcon color="success" fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="Cek koneksi internet"
                                                secondary="Pastikan koneksi stabil untuk interview online"
                                                primaryTypographyProps={{
                                                    variant: 'body2',
                                                    fontWeight: 'medium'
                                                }}
                                                secondaryTypographyProps={{
                                                    variant: 'caption'
                                                }}
                                            />
                                        </ListItem>

                                        <ListItem disableGutters>
                                            <ListItemIcon sx={{ minWidth: 36 }}>
                                                <CheckCircleOutlineIcon color="success" fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="Datang 15 menit lebih awal"
                                                secondary="Tunjukkan profesionalisme dengan tepat waktu"
                                                primaryTypographyProps={{
                                                    variant: 'body2',
                                                    fontWeight: 'medium'
                                                }}
                                                secondaryTypographyProps={{
                                                    variant: 'caption'
                                                }}
                                            />
                                        </ListItem>
                      </List>


                    </Box>
                            </Paper>
            </Box>
          </Box>
        </motion.div>
            </Container>

            {/* Cancel Dialog */}
            <EnhancedDialog
          open={openCancelDialog}
          onClose={() => setOpenCancelDialog(false)}
                title={eventData.status === 'pending' ? "Tolak Interview" : "Batalkan Interview"}
                content={renderCancelDialogContent()}
                actions={renderCancelDialogActions()}
          maxWidth="sm"
              color="error"
                icon={<CancelIcon />}
            />

            {/* Note Dialog */}
            <EnhancedDialog
          open={openNoteDialog}
          onClose={() => setOpenNoteDialog(false)}
                title="Tambah Catatan"
                content={renderNoteDialogContent()}
                actions={renderNoteDialogActions()}
          maxWidth="sm"
              color="primary"
                icon={<NoteAddIcon />}
            />
        </Layout>
    );
}
