import React, { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    Container,
    Typography,
    Box,
    Grid,
    Avatar,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Chip,
    Divider,
    IconButton,
    Tab,
    Tabs,
    Tooltip,
    useTheme,
    useMediaQuery,
    Backdrop,
    Fade,
    Modal,
    Alert,
    AlertTitle,
    LinearProgress,
    Card,
    CardContent,
    Badge,
    Stack
} from '@mui/material';
import {
    Person as PersonIcon,
    Work as WorkIcon,
    School as SchoolIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    Home as HomeIcon,
    LinkedIn as LinkedInIcon,
    Language as LanguageIcon,
    GitHub as GitHubIcon,
    Twitter as TwitterIcon,
    UploadFile as UploadFileIcon,
    Edit as EditIcon,
    CalendarToday as CalendarTodayIcon,
    ArrowBack as ArrowBackIcon,
    LocationOn as LocationIcon,
    Star as StarIcon,
    Description as DescriptionIcon,
    Close as CloseIcon,
    Download as DownloadIcon,
    MoreVert as MoreVertIcon,
    ContentCopy as ContentCopyIcon,
    Verified as VerifiedIcon,
    Visibility as VisibilityIcon,
    Event as EventIcon,
    CalendarMonth as CalendarIcon,
    AccessTime as TimeIcon,
    Business as BusinessIcon,
    Videocam as VideocamIcon,
    CheckCircleOutline as CheckCircleOutlineIcon,
    CancelOutlined as CancelOutlinedIcon,
    Info as InfoIcon,
    ArrowForward as ArrowForwardIcon,
    VisibilityOff as VisibilityOffIcon,
    Notifications as NotificationsIcon,
    Today as TodayIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO, isAfter, isBefore, isToday, isEqual } from 'date-fns';
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
                <AnimatePresence mode="wait">
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                    >
                        <Box sx={{ pt: 3 }}>
                            {children}
            </Box>
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    );
};

// Resume preview modal
const ResumePreviewModal = ({ open, handleClose, resumeUrl }) => {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={open}>
            <Box
                sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '90%',
                        maxWidth: 900,
                        maxHeight: '90vh',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        borderRadius: '1rem',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                <Box
                    sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            p: 2,
                            bgcolor: 'primary.50',
                            borderBottom: '1px solid',
                            borderColor: 'primary.100',
                        }}
                    >
                        <Typography variant="h6" fontWeight="bold" color="primary.main">
                            Resume Preview
                            </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Download Resume">
                                <IconButton
                                    component="a"
                                    href={resumeUrl}
                                    download
                                size="small"
                                sx={{
                                        bgcolor: 'primary.50',
                                        '&:hover': { bgcolor: 'primary.100' },
                                    }}
                                >
                                    <DownloadIcon fontSize="small" color="primary" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Close">
                                <IconButton
                                    onClick={handleClose}
                                size="small"
                                sx={{
                                        bgcolor: 'error.50',
                                        '&:hover': { bgcolor: 'error.100' },
                                    }}
                                >
                                    <CloseIcon fontSize="small" color="error" />
                                </IconButton>
                            </Tooltip>
                                </Box>
                                </Box>
                    <Box
                            sx={{
                            flexGrow: 1,
                            height: 'calc(90vh - 64px)',
                            overflow: 'auto',
                        }}
                    >
                        <iframe
                            src={`${resumeUrl}#toolbar=0`}
                            width="100%"
                            height="100%"
                            style={{ border: 'none' }}
                            title="Resume Preview"
                        />
                </Box>
            </Box>
            </Fade>
        </Modal>
    );
};

export default function Index({ upcomingEvents = [], pastEvents = [], profileCompleteness = { percentage: 0, missingItems: [], isComplete: false }, user = {}, profile = {} }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [tabValue, setTabValue] = useState(0);
    const [eventTabValue, setEventTabValue] = useState(0);
    const [openResumeModal, setOpenResumeModal] = useState(false);
    const [copiedField, setCopiedField] = useState(null);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleEventTabChange = (event, newValue) => {
        setEventTabValue(newValue);
    };

    const handleCopyToClipboard = (text, field) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
        });
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

    // Helper function to format date
    const formatDate = (dateString) => {
        try {
            const date = parseISO(dateString);
            return format(date, 'd MMMM yyyy', { locale: id });
        } catch (e) {
            return dateString;
        }
    };

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

    return (
        <Layout>
            <Head title="Jadwal Events" />

            {/* Modern gradient background */}
            <Box
                sx={{
                    backgroundImage: 'linear-gradient(135deg, rgba(20, 184, 166, 0.12) 0%, rgba(15, 118, 110, 0.08) 100%)',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 200,
                    zIndex: -1,
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%2314b8a6\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
                        backgroundSize: '150px',
                    }
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
                            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
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

                    {/* Today's Events Section - Only show if profile completeness >= 60% */}
                    {profileCompleteness.percentage >= 60 && todayEvents.length > 0 && (
                        <motion.div variants={itemVariants}>
                            <StyledCard elevation={2} sx={{ mb: 4, overflow: 'visible', position: 'relative' }}>
                                <Box sx={{ position: 'absolute', top: -10, left: 20 }}>
                                    <Chip
                                        label="Hari Ini"
                                        color="primary"
                                        icon={<TodayIcon />}
                                        sx={{
                                            fontWeight: 'bold',
                                            fontSize: '0.9rem',
                                            py: 2,
                                            borderRadius: '1rem',
                                            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
                                        }}
                                    />
                                </Box>
                                <Box sx={{ p: 3, pt: 4 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 1 }}>
                                        <Typography variant="h6" fontWeight="bold">
                                            Interview dan Event Hari Ini
                                        </Typography>
                                        <Badge color="error" badgeContent={todayEvents.length} sx={{ ml: 2 }}>
                                            <NotificationsIcon color="primary" />
                                        </Badge>
                                    </Box>
                                    <Divider sx={{ mb: 3 }} />

                                    <Box sx={{
                                        display: 'grid',
                                        gridTemplateColumns: {
                                            xs: '1fr',
                                            md: 'repeat(2, 1fr)',
                                            lg: 'repeat(3, 1fr)'
                                        },
                                        gap: 3
                                    }}>
                                        {todayEvents.map((event) => (
                                            <Box key={event.id}>
                                                <Paper
                                                    elevation={0}
                                                    sx={{
                                                        p: 2,
                                                        borderRadius: '1rem',
                                                        border: '1px solid',
                                                        borderColor: 'divider',
                                                        backgroundColor: 'rgba(20, 184, 166, 0.05)',
                                                        display: 'flex',
                                                        height: '100%'
                                                    }}
                                                >
                                                    <Box sx={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        p: 1,
                                                        mr: 2,
                                                        minWidth: 80,
                                                        backgroundColor: 'primary.50',
                                                        borderRadius: '0.8rem'
                                                    }}>
                                                        <Typography
                                                            variant="h5"
                                                            fontWeight="bold"
                                                            color="primary"
                                                            sx={{ lineHeight: 1 }}
                                                        >
                                                            {format(parseISO(event.start_time), 'HH:mm', { locale: id })}
                                                        </Typography>
                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                            fontWeight="medium"
                                                        >
                                                            {format(parseISO(event.end_time), 'HH:mm', { locale: id })}
                                                        </Typography>
                                                    </Box>

                                                    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                                        <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <Typography variant="subtitle1" fontWeight="bold">
                                                                    {event.title}
                                                                </Typography>
                                                                <Chip
                                                                    label={getEventTypeText(event.type)}
                                                                    size="small"
                                                                    sx={{
                                                                        ml: 1,
                                                                        fontWeight: 'medium',
                                                                        backgroundColor: getEventTypeBgColor(event.type),
                                                                        borderRadius: '0.5rem',
                                                                    }}
                                                                />
                                                            </Box>
                                                            <Chip
                                                                label={getStatusText(event.status)}
                                                                size="small"
                                                                sx={{
                                                                    backgroundColor: `${getStatusColor(event.status)}20`,
                                                                    color: getStatusColor(event.status),
                                                                    fontWeight: 'medium',
                                                                }}
                                                            />
                                                        </Box>

                                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                            {event.job?.company?.name || 'Perusahaan'} - {event.job?.title || 'Posisi'}
                                                        </Typography>

                                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                            {event.type === 'online' || event.meeting_link ? (
                                                                <>
                                                                    <VideocamIcon fontSize="small" color="primary" sx={{ mr: 1, opacity: 0.7 }} />
                                                                    <Typography variant="body2" fontWeight="medium">
                                                                        {event.location || 'Video Call'}
                                                                    </Typography>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <LocationIcon fontSize="small" color="primary" sx={{ mr: 1, opacity: 0.7 }} />
                                                                    <Typography variant="body2" fontWeight="medium">
                                                                        {event.location || 'Lokasi belum ditentukan'}
                                                                    </Typography>
                                                                </>
                                                            )}
                                                        </Box>

                                                        <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
                                                            <Button
                                                                component={Link}
                                                                href={route('candidate.events.show', event.id)}
                                                                variant="outlined"
                                                                color="primary"
                                                                size="small"
                                                                endIcon={<ArrowForwardIcon />}
                                                                sx={{
                                                                    borderRadius: '8px',
                                                                    textTransform: 'none',
                                                                    fontWeight: 'medium',
                                                                }}
                                                            >
                                                                Lihat Detail
                                                            </Button>
                                                        </Box>
                                                    </Box>
                                                </Paper>
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                            </StyledCard>
                        </motion.div>
                    )}

                    {/* Profile is too incomplete - Show only completion guidance */}
                    {profileCompleteness.percentage < 60 ? (
                        <motion.div variants={itemVariants}>
                            <StyledCard elevation={1} sx={{ mb: 4, overflow: 'hidden' }}>
                                <Box sx={{ textAlign: 'center', p: 5 }}>
                                    <EventIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
                                    <Typography variant="h5" gutterBottom fontWeight="bold" color="text.secondary">
                                        Jadwal Event Tidak Tersedia
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" paragraph>
                                        Anda perlu melengkapi profil minimal 60% untuk dapat melihat jadwal event.
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph sx={{ maxWidth: 500, mx: 'auto' }}>
                                        Lengkapi informasi profil Anda seperti kontak, pendidikan, pengalaman, dan keahlian untuk
                                        meningkatkan kelengkapan profil Anda.
                                    </Typography>

                                    <Button
                                        component={Link}
                                        href={route('candidate.profile.edit')}
                                        variant="contained"
                                        color="primary"
                                        startIcon={<EditIcon />}
                                        sx={{ mt: 2 }}
                                    >
                                        Lengkapi Profil Sekarang
                                    </Button>
                                </Box>
                            </StyledCard>
                        </motion.div>
                    ) : (
                        <>


                        {/* Event Tabs */}
                        <motion.div variants={itemVariants}>
                            <Paper
                                elevation={0}
                                sx={{
                                    borderRadius: '1rem',
                                    overflow: 'hidden',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                }}
                            >
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <Tabs
                                        value={eventTabValue}
                                        onChange={handleEventTabChange}
                                        aria-label="event tabs"
                                        sx={{
                                            '& .MuiTab-root': {
                                                textTransform: 'none',
                                                minWidth: 120,
                                                fontWeight: 500,
                                                fontSize: '0.95rem',
                                                py: 2,
                                                '&.Mui-selected': {
                                                    fontWeight: 700,
                                                }
                                            },
                                            '& .MuiTabs-indicator': {
                                                height: 3,
                                                borderTopLeftRadius: 3,
                                                borderTopRightRadius: 3,
                                            }
                                        }}
                                    >
                                        <Tab
                                            label={`Mendatang (${upcomingEvents.length})`}
                                            id="event-tab-0"
                                            aria-controls="event-tabpanel-0"
                                            icon={<CalendarIcon fontSize="small" />}
                                            iconPosition="start"
                                        />
                                        <Tab
                                            label={`Selesai (${pastEvents.length})`}
                                            id="event-tab-1"
                                            aria-controls="event-tabpanel-1"
                                            icon={<CheckCircleOutlineIcon fontSize="small" />}
                                            iconPosition="start"
                                        />
                                    </Tabs>
                                </Box>

                                {/* Upcoming Events Tab */}
                                <TabPanel value={eventTabValue} index={0}>
                                    <Box sx={{ p: 2 }}>
                                        {upcomingEvents.length > 0 ? (
                                            <Box sx={{
                                                display: 'grid',
                                                gridTemplateColumns: {
                                                    xs: '1fr',
                                                    md: 'repeat(2, 1fr)',
                                                    lg: 'repeat(3, 1fr)'
                                                },
                                                gap: 3
                                            }}>
                                                {upcomingEvents.map((event) => (
                                                    <Box key={event.id}>
                                                        <StyledCard>
                                                            <Box sx={{ position: 'relative' }}>
                                                                {/* Event Type Badge */}
                                                                <Box
                                                                    sx={{
                                                                        position: 'absolute',
                                                                        top: 16,
                                                                        right: 16,
                                                                        zIndex: 1
                                                                    }}
                                                                >
                                                                    <Chip
                                                                        label={getEventTypeText(event.type)}
                                                                        size="small"
                                                                        sx={{
                                                                            color: 'white',
                                                                            fontWeight: 'medium',
                                                                            backgroundColor: getEventTypeBgColor(event.type),
                                                                            borderRadius: '0.5rem',
                                                                        }}
                                                                    />
                                                                </Box>

                                                                {/* Colorful Header Banner */}
                                                                <Box
                                                                    sx={{
                                                                        height: 80,
                                                                        background: 'linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)',
                                                                        position: 'relative',
                                                                        '&::before': {
                                                                            content: '""',
                                                                            position: 'absolute',
                                                                            top: 0,
                                                                            left: 0,
                                                                            right: 0,
                                                                            bottom: 0,
                                                                            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.08\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                                                                        }
                                                                    }}
                                                                />

                                                                {/* Company Logo/Job Info */}
                                                                <Box sx={{ px: 3, py: 5 }}>
                                                                    <Box sx={{
                                                                        mt: -4,
                                                                        mb: 2,
                                                                        display: 'flex',
                                                                        alignItems: 'center'
                                                                    }}>
                                                                        <Avatar
                                                                            src={event.job?.company?.logo}
                                                                            alt={event.job?.company?.name || ''}
                                                                            sx={{
                                                                                width: 64,
                                                                                height: 64,
                                                                                border: '3px solid white',
                                                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                                                backgroundColor: 'white'
                                                                            }}
                                                                        >
                                                                            {!event.job?.company?.logo && <BusinessIcon color="primary" />}
                                                                        </Avatar>
                                                                        <Box sx={{ ml: 2 }}>
                                                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                                                {event.job?.company?.name || 'Perusahaan'}
                                                                            </Typography>
                                                                            <Typography variant="subtitle1" fontWeight="bold" noWrap>
                                                                                {event.job?.title || 'Posisi'}
                                                                            </Typography>
                                                                        </Box>
                                                                    </Box>

                                                                    {/* Event Title */}
                                                                    <Typography variant="h6" gutterBottom>
                                                                        {event.title}
                                                                    </Typography>

                                                                    {/* Event Info List */}
                                                                    <List dense disablePadding>
                                                                        <ListItem disableGutters>
                                                                            <ListItemIcon sx={{ minWidth: 36 }}>
                                                                                <CalendarIcon fontSize="small" color="primary" />
                                                                            </ListItemIcon>
                                                                            <ListItemText
                                                                                primary={formatDate(event.start_time)}
                                                                                primaryTypographyProps={{ variant: 'body2' }}
                                                                            />
                                                                        </ListItem>
                                                                        <ListItem disableGutters>
                                                                            <ListItemIcon sx={{ minWidth: 36 }}>
                                                                                <TimeIcon fontSize="small" />
                                                                            </ListItemIcon>
                                                                            <ListItemText
                                                                                primary={`${formatTime(event.start_time)} - ${formatTime(event.end_time)}`}
                                                                                primaryTypographyProps={{ variant: 'body2' }}
                                                                            />
                                                                        </ListItem>
                                                                        {event.location && (
                                                                            <ListItem disableGutters>
                                                                                <ListItemIcon sx={{ minWidth: 36 }}>
                                                                                    {event.type === 'online' || event.meeting_link ? (
                                                                                        <VideocamIcon fontSize="small" color="primary" />
                                                                                    ) : (
                                                                                        <LocationIcon fontSize="small" color="primary" />
                                                                                    )}
                                                                                </ListItemIcon>
                                                                                <ListItemText
                                                                                    primary={event.location}
                                                                                    primaryTypographyProps={{
                                                                                        variant: 'body2',
                                                                                        noWrap: true,
                                                                                        style: { maxWidth: '200px' }
                                                                                    }}
                                                                                />
                                                                            </ListItem>
                                                                        )}
                                                                    </List>

                                                                    <Box sx={{ mt: 2 }}>
                                                                        <Chip
                                                                            label={getStatusText(event.status)}
                                                                            size="small"
                                                                            sx={{
                                                                                backgroundColor: `${getStatusColor(event.status)}20`,
                                                                                color: getStatusColor(event.status),
                                                                                fontWeight: 'medium',
                                                                            }}
                                                                        />
                                                                    </Box>
                                                                </Box>

                                                                <Divider />

                                                                {/* Card Actions */}
                                                                <Box sx={{ p: 2, textAlign: 'right' }}>
                                                                    <Button
                                                                        component={Link}
                                                                        href={route('candidate.events.show', event.id)}
                                                                        variant="contained"
                                                                        color="primary"
                                                                        endIcon={<ArrowForwardIcon />}
                                                                        disabled={!profileCompleteness.isComplete}
                                                                        sx={{
                                                                            borderRadius: '8px',
                                                                            textTransform: 'none',
                                                                            fontWeight: 'medium',
                                                                        }}
                                                                    >
                                                                        Lihat Detail
                                                                    </Button>
                                                                    {!profileCompleteness.isComplete && (
                                                                        <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                                                                            Lengkapi profil untuk melihat detail
                                                                        </Typography>
                                                                    )}
                                                                </Box>
                                                            </Box>
                                                        </StyledCard>
                                                    </Box>
                                                ))}
                                            </Box>
                                        ) : (
                                            <Box sx={{
                                                textAlign: 'center',
                                                py: 8,
                                                backgroundColor: 'rgba(0, 0, 0, 0.02)',
                                                borderRadius: '12px'
                                            }}>
                                                <EventIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                                    Tidak ada event yang akan datang
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Anda belum memiliki jadwal interview atau event lain untuk saat ini
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                </TabPanel>

                                {/* Past Events Tab */}
                                <TabPanel value={eventTabValue} index={1}>
                                    <Box sx={{ p: 2 }}>
                                        {pastEvents.length > 0 ? (
                                            <Box sx={{
                                                display: 'grid',
                                                gridTemplateColumns: {
                                                    xs: '1fr',
                                                    md: 'repeat(2, 1fr)',
                                                    lg: 'repeat(3, 1fr)'
                                                },
                                                gap: 3
                                            }}>
                                                {pastEvents.map((event) => (
                                                    <Box key={event.id}>
                                                        <StyledCard sx={{
                                                            opacity: 0.85,
                                                            '&:hover': {
                                                                opacity: 1
                                                            }
                                                        }}>
                                                            <Box sx={{ position: 'relative' }}>
                                                                {/* Event Type Badge */}
                                                                <Box
                                                                    sx={{
                                                                        position: 'absolute',
                                                                        top: 16,
                                                                        right: 16,
                                                                        zIndex: 1
                                                                    }}
                                                                >
                                                                    <Chip
                                                                        label={getEventTypeText(event.type)}
                                                                        size="small"
                                                                        sx={{
                                                                            fontWeight: 'medium',
                                                                            backgroundColor: getEventTypeBgColor(event.type),
                                                                            borderRadius: '0.5rem',
                                                                        }}
                                                                    />
                                                                </Box>

                                                                {/* Grayscale Header Banner for past events */}
                                                                <Box
                                                                    sx={{
                                                                        height: 80,
                                                                        background: 'linear-gradient(135deg, #9e9e9e 0%, #616161 100%)',
                                                                        position: 'relative',
                                                                        filter: 'saturate(0.7)',
                                                                        '&::before': {
                                                                            content: '""',
                                                                            position: 'absolute',
                                                                            top: 0,
                                                                            left: 0,
                                                                            right: 0,
                                                                            bottom: 0,
                                                                            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.08\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                                                                    }
                                                                }}
                                                            />

                                                                {/* Company Logo/Job Info */}
                                                                <Box sx={{ px: 3, py: 2 }}>
                                                                    <Box sx={{
                                                                        mt: -4,
                                                                        mb: 2,
                                                                        display: 'flex',
                                                                        alignItems: 'center'
                                                                    }}>
                                                                        <Avatar
                                                                            src={event.job?.company?.logo}
                                                                            alt={event.job?.company?.name || ''}
                                                                            sx={{
                                                                                width: 64,
                                                                                height: 64,
                                                                                border: '3px solid white',
                                                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                                                backgroundColor: 'white',
                                                                                filter: 'grayscale(0.5)'
                                                                            }}
                                                                        >
                                                                            {!event.job?.company?.logo && <BusinessIcon />}
                                                                        </Avatar>
                                                                        <Box sx={{ ml: 2 }}>
                                                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                                                {event.job?.company?.name || 'Perusahaan'}
                                                                            </Typography>
                                                                            <Typography variant="subtitle1" fontWeight="bold" noWrap>
                                                                                {event.job?.title || 'Posisi'}
                                                                            </Typography>
                                                                        </Box>
                                                                    </Box>

                                                                    {/* Event Title */}
                                                                    <Typography variant="h6" gutterBottom>
                                                                        {event.title}
                                                                    </Typography>

                                                                    {/* Event Info List */}
                                                                    <List dense disablePadding>
                                                                        <ListItem disableGutters>
                                                                            <ListItemIcon sx={{ minWidth: 36 }}>
                                                                                <CalendarIcon fontSize="small" />
                                                                            </ListItemIcon>
                                                                            <ListItemText
                                                                                primary={formatDate(event.start_time)}
                                                                                primaryTypographyProps={{ variant: 'body2' }}
                                                                            />
                                                                        </ListItem>
                                                                        <ListItem disableGutters>
                                                                            <ListItemIcon sx={{ minWidth: 36 }}>
                                                                                <TimeIcon fontSize="small" />
                                                                            </ListItemIcon>
                                                                            <ListItemText
                                                                                primary={`${formatTime(event.start_time)} - ${formatTime(event.end_time)}`}
                                                                                primaryTypographyProps={{ variant: 'body2' }}
                                                                            />
                                                                        </ListItem>
                                                                        {event.location && (
                                                                            <ListItem disableGutters>
                                                                                <ListItemIcon sx={{ minWidth: 36 }}>
                                                                                    {event.type === 'online' || event.meeting_link ? (
                                                                                        <VideocamIcon fontSize="small" />
                                                                                    ) : (
                                                                                        <LocationIcon fontSize="small" />
                                                                                    )}
                                                                                </ListItemIcon>
                                                                                <ListItemText
                                                                                    primary={event.location}
                                                                                    primaryTypographyProps={{
                                                                                        variant: 'body2',
                                                                                        noWrap: true,
                                                                                        style: { maxWidth: '200px' }
                                                                                    }}
                                                                                />
                                                                            </ListItem>
                                                                        )}
                                                                    </List>

                                                                    <Box sx={{ mt: 2 }}>
                                                                        <Chip
                                                                            label={getStatusText(event.status)}
                                                                            size="small"
                                                                            sx={{
                                                                                backgroundColor: `${getStatusColor(event.status)}20`,
                                                                                color: getStatusColor(event.status),
                                                                                fontWeight: 'medium',
                                                                            }}
                                                                        />
                                                                    </Box>
                                                                </Box>

                                                                <Divider />

                                                                {/* Card Actions */}
                                                                <Box sx={{ p: 2, textAlign: 'right' }}>
                                                                    <Button
                                                                        component={Link}
                                                                        href={route('candidate.events.show', event.id)}
                                                                        variant="outlined"
                                                                        color="primary"
                                                                        endIcon={<ArrowForwardIcon />}
                                                                        disabled={!profileCompleteness.isComplete}
                                                                        sx={{
                                                                            borderRadius: '8px',
                                                                            textTransform: 'none',
                                                                            fontWeight: 'medium',
                                                                        }}
                                                                    >
                                                                        Lihat Detail
                                                                    </Button>
                                                                    {!profileCompleteness.isComplete && (
                                                                        <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                                                                            Lengkapi profil untuk melihat detail
                                                                        </Typography>
                                                                    )}
                                                                </Box>
                                                            </Box>
                                                        </StyledCard>
                                                    </Box>
                                                ))}
                                            </Box>
                                        ) : (
                                            <Box sx={{
                                                textAlign: 'center',
                                                py: 8,
                                                backgroundColor: 'rgba(0, 0, 0, 0.02)',
                                                borderRadius: '12px'
                                            }}>
                                                <EventIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                                    Tidak ada event yang telah berlalu
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Riwayat event akan muncul di sini setelah event selesai
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                </TabPanel>
                            </Paper>
                        </motion.div>
                    {/* Profile Resume */}
                    {profile.resume && (
                        <ResumePreviewModal
                            open={openResumeModal}
                            handleClose={() => setOpenResumeModal(false)}
                            resumeUrl={profile.resume}
                        />
                    )}
                </>
            )}
        </motion.div>
    </Container>
</Layout>
);
}
