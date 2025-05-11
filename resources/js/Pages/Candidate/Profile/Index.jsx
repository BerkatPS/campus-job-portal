import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    Container,
    Typography,
    Box,
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
    Button,
    Card,
    CardContent,
    Stack,
    alpha,
    LinearProgress,
    AvatarGroup,
    CircularProgress
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
    Edit as EditIcon,
    CalendarToday as CalendarTodayIcon,
    LocationOn as LocationIcon,
    Star as StarIcon,
    Description as DescriptionIcon,
    Close as CloseIcon,
    Download as DownloadIcon,
    ContentCopy as ContentCopyIcon,
    Verified as VerifiedIcon,
    Visibility as VisibilityIcon,
    Badge as BadgeIcon,
    CheckCircleOutline as CheckCircleOutlineIcon,
    Assessment as AssessmentIcon,
    ArrowForward as ArrowForwardIcon,
    VerifiedUser as VerifiedUserIcon,
    ForwardToInbox as ForwardToInboxIcon,
    Forum as ForumIcon,
    FiberManualRecord as FiberManualRecordIcon,
    Check as CheckIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import Layout from "@/Components/Layout/Layout.jsx";

// Modern Glass Card component with hover animation
const GlassCard = ({ children, elevation = 0, sx = {}, hover = true }) => {
    const theme = useTheme();

    return (
        <Paper
            elevation={elevation}
            sx={{
                borderRadius: '1.5rem',
                overflow: 'hidden',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                ...(hover && {
                    '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.07)',
                        borderColor: 'primary.200',
                    }
                }),
                ...sx
            }}
        >
            {children}
        </Paper>
    );
};

// Modern Tabs component
const ModernTabs = ({ value, onChange, tabs }) => {
    const theme = useTheme();

    return (
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
                value={value}
                onChange={(e, val) => onChange(val)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                    '& .MuiTab-root': {
                        minWidth: 'unset',
                        fontWeight: 500,
                        fontSize: '0.875rem',
                        textTransform: 'none',
                        px: 2.5,
                        py: 1.5,
                        mr: 2,
                        color: 'text.secondary',
                        '&.Mui-selected': {
                            color: 'primary.main',
                            fontWeight: 600
                        }
                    },
                    '& .MuiTabs-indicator': {
                        height: 3,
                        borderRadius: '3px 3px 0 0',
                        backgroundColor: theme.palette.primary.main
                    }
                }}
            >
                {tabs.map((tab, index) => (
                    <Tab
                        key={index}
                        label={tab.label}
                        icon={tab.icon}
                        iconPosition="start"
                        sx={{ alignItems: 'center' }}
                    />
                ))}
            </Tabs>
        </Box>
    );
};

// Tab Panel component with animation
const TabPanel = ({ children, value, index }) => {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`profile-tabpanel-${index}`}
            aria-labelledby={`profile-tab-${index}`}
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
                        <Box sx={{ py: 3 }}>
                            {children}
                        </Box>
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    );
};

// Profile section card with modern design
const ProfileSectionCard = ({ children, icon, title, subtitle, empty, onAction, actionIcon, actionText, sx = {} }) => {
    const theme = useTheme();

    if (empty) {
        return (
            <Paper
                elevation={0}
                sx={{
                    p: 0,
                    mb: 3,
                    borderRadius: '1rem',
                    border: '1px solid',
                    borderColor: 'divider',
                    backgroundColor: 'rgba(20, 184, 166, 0.02)',
                    background: 'radial-gradient(circle at 100% 100%, rgba(20, 184, 166, 0.03) 0%, transparent 50%)',
                    ...sx
                }}
            >
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 6,
                    px: 3
                }}>
                    <Box sx={{
                        p: 2.5,
                        borderRadius: '50%',
                        backgroundColor: 'rgba(20, 184, 166, 0.08)',
                        mb: 3
                    }}>
                        {icon && React.cloneElement(icon, {
                            sx: { fontSize: 42, color: 'primary.main', opacity: 0.6 }
                        })}
                    </Box>
                    <Typography variant="h6" color="text.secondary" fontWeight="medium" gutterBottom>
                        {title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ maxWidth: 500, mb: 3 }}>
                        {subtitle}
                    </Typography>
                    {onAction && (
                        <Button
                            onClick={() => router.visit(route('candidate.profile.edit'))}
                            variant="outlined"
                            color="primary"
                            startIcon={actionIcon || <EditIcon />}
                            sx={{
                                borderRadius: '12px',
                                px: 3,
                                py: 1.2,
                                fontWeight: 500,
                                borderWidth: '1.5px',
                                borderColor: 'rgba(20, 184, 166, 0.5)',
                                '&:hover': {
                                    borderColor: 'primary.main',
                                    backgroundColor: 'rgba(20, 184, 166, 0.05)',
                                    transform: 'translateY(-2px)'
                                },
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {actionText || 'Tambah Informasi'}
                        </Button>
                    )}
                </Box>
            </Paper>
        );
    }

    return (
        <Paper
            elevation={0}
            sx={{
                mb: 3,
                borderRadius: '1rem',
                border: '1px solid',
                borderColor: 'divider',
                overflow: 'hidden',
                ...sx
            }}
        >
            <Box sx={{
                p: 3,
                backgroundColor: 'rgba(20, 184, 166, 0.05)',
                borderBottom: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {icon && React.cloneElement(icon, {
                        sx: { mr: 1.5, color: 'primary.main' }
                    })}
                    <Typography variant="subtitle1" fontWeight="bold" color="primary.main">
                        {title}
                    </Typography>
                </Box>

                {onAction && (
                    <Tooltip title={actionText || "Edit"}>
                        <IconButton
                            onClick={() => router.visit(route('candidate.profile.edit'))}
                            color="primary"
                            size="small"
                            sx={{
                                bgcolor: 'rgba(20, 184, 166, 0.1)',
                                '&:hover': {
                                    bgcolor: 'rgba(20, 184, 166, 0.2)',
                                    transform: 'translateY(-2px)'
                                },
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {actionIcon || <EditIcon fontSize="small" />}
                        </IconButton>
                    </Tooltip>
                )}
            </Box>

            <Box sx={{ p: 3 }}>
                {children}
            </Box>
        </Paper>
    );
};

// Resume preview modal with modern design
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
                        boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
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
                            p: 2.5,
                            bgcolor: 'rgba(20, 184, 166, 0.08)',
                            borderBottom: '1px solid',
                            borderColor: 'rgba(20, 184, 166, 0.15)',
                        }}
                    >
                        <Typography variant="h6" fontWeight="bold" color="primary.main">
                            Pratinjau Resume
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Download Resume">
                                <IconButton
                                    component="a"
                                    href={resumeUrl}
                                    download
                                    sx={{
                                        bgcolor: 'white',
                                        '&:hover': {
                                            bgcolor: 'rgba(20, 184, 166, 0.1)',
                                            transform: 'translateY(-2px)'
                                        },
                                        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <DownloadIcon fontSize="small" color="primary" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Tutup">
                                <IconButton
                                    onClick={handleClose}
                                    sx={{
                                        bgcolor: 'white',
                                        '&:hover': {
                                            bgcolor: 'rgba(239, 68, 68, 0.1)',
                                            transform: 'translateY(-2px)'
                                        },
                                        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                                        transition: 'all 0.3s ease'
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

// Skill Chip component
const SkillChip = ({ label }) => {
    const theme = useTheme();

    return (
        <Chip
            label={label}
            variant="outlined"
            icon={<StarIcon />}
            sx={{
                borderRadius: '0.75rem',
                py: 2.2,
                px: 1,
                fontWeight: 500,
                backgroundColor: 'rgba(20, 184, 166, 0.08)',
                borderColor: 'rgba(20, 184, 166, 0.2)',
                color: 'text.primary',
                '& .MuiChip-icon': {
                    color: theme.palette.primary.main
                },
                '&:hover': {
                    backgroundColor: 'rgba(20, 184, 166, 0.12)',
                    transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease'
            }}
        />
    );
};

// Social Media Badge component
const SocialMediaBadge = ({ type, username, url }) => {
    const getIcon = () => {
        switch (type) {
            case 'linkedin': return <LinkedInIcon fontSize="small" sx={{ color: '#0077b5' }} />;
            case 'github': return <GitHubIcon fontSize="small" sx={{ color: '#333' }} />;
            case 'twitter': return <TwitterIcon fontSize="small" sx={{ color: '#1da1f2' }} />;
            case 'website': return <LanguageIcon fontSize="small" sx={{ color: '#14b8a6' }} />;
            default: return <LanguageIcon fontSize="small" sx={{ color: '#14b8a6' }} />;
        }
    };

    const getDisplay = () => {
        switch (type) {
            case 'linkedin': return username.replace(/(https?:\/\/)?(www\.)?linkedin\.com\/in\//, '');
            case 'github': return username.replace(/(https?:\/\/)?(www\.)?github\.com\//, '');
            case 'twitter': return username.replace(/(https?:\/\/)?(www\.)?twitter\.com\//, '@');
            case 'website': return username.replace(/(https?:\/\/)?(www\.)?/, '');
            default: return username;
        }
    };

    return (
        <Chip
            icon={getIcon()}
            label={getDisplay()}
            component="a"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            clickable
            variant="outlined"
            sx={{
                borderRadius: '0.75rem',
                py: 2,
                fontWeight: 500,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderColor: 'divider',
                '&:hover': {
                    backgroundColor: 'rgba(20, 184, 166, 0.05)',
                    transform: 'translateY(-2px)',
                    borderColor: 'primary.main'
                },
                transition: 'all 0.3s ease'
            }}
        />
    );
};

export default function Index({ user, profile }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
    const [tabValue, setTabValue] = useState(0);
    const [openResumeModal, setOpenResumeModal] = useState(false);
    const [copiedField, setCopiedField] = useState(null);

    const handleTabChange = (newValue) => {
        setTabValue(newValue);
    };

    const handleCopyToClipboard = (text, field) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    // Format skill badges
    const skillBadges = profile.skills ? profile.skills.split(',').map(skill => skill.trim()) : [];

    // Calculate profile completion
    const calculateCompletion = () => {
        const requiredFields = [
            user.avatar,
            profile.phone,
            profile.date_of_birth,
            profile.address,
            profile.education,
            profile.experience,
            profile.skills,
            profile.resume
        ];

        const filledFields = requiredFields.filter(Boolean).length;
        const totalFields = requiredFields.length;
        return Math.round((filledFields / totalFields) * 100);
    };

    const completionPercentage = calculateCompletion();

    // Missing profile items
    const getMissingItems = () => {
        const items = [];
        if (!user.avatar) items.push('Foto Profil');
        if (!profile.phone) items.push('Nomor Telepon');
        if (!profile.date_of_birth) items.push('Tanggal Lahir');
        if (!profile.address) items.push('Alamat');
        if (!profile.education) items.push('Pendidikan');
        if (!profile.experience) items.push('Pengalaman Kerja');
        if (!profile.skills) items.push('Keahlian');
        if (!profile.resume) items.push('Resume');
        return items;
    };

    const missingItems = getMissingItems();

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

    // Initialize stats object if not provided
    useEffect(() => {
        if (!profile.stats) {
            profile.stats = {
                applications: 0,
                profileViews: 0,
                interviews: 0,
                accepted: 0
            };
        }
    }, [profile]);

    return (
        <Layout>
            <Head title="Profil Saya" />

            {/* Modern gradient background */}
            <Box
                sx={{
                    backgroundImage: 'linear-gradient(135deg, rgba(20, 184, 166, 0.12) 0%, rgba(15, 118, 110, 0.08) 100%)',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 320,
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

            <Container maxWidth="lg" sx={{ py: 4, mt: { xs: 3, md: 5 }, position: 'relative' }}>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Main Profile Card */}
                    <motion.div variants={itemVariants}>
                        <GlassCard elevation={0} sx={{ mb: 4, overflow: 'visible' }}>
                            <Box sx={{ width: '100%' }}>
                                {/* Profile Header */}
                                <Box sx={{ width: '100%' }}>
                                    <Box sx={{
                                        position: 'relative',
                                        px: { xs: 3, md: 4 },
                                        pt: { xs: 8, md: 4 },
                                        pb: 3,
                                        background: 'linear-gradient(to right, rgba(20, 184, 166, 0.03) 0%, rgba(20, 184, 166, 0.08) 100%)'
                                    }}>
                                        <Box sx={{ 
                                            display: 'grid',
                                            gridTemplateColumns: {
                                                xs: '1fr',
                                                md: '8fr 4fr'
                                            },
                                            gap: 2,
                                            alignItems: 'flex-start'
                                        }}>
                                            {/* Avatar and Info */}
                                            <Box>
                                                <Box sx={{
                                                    display: 'flex',
                                                    flexDirection: { xs: 'column', md: 'row' },
                                                    alignItems: { xs: 'center', md: 'flex-start' },
                                                    gap: { xs: 2, md: 3 }
                                                }}>
                                                    <Box sx={{ position: 'relative' }}>
                                                        <Avatar
                                                            src={user.avatar}
                                                            alt={user.name}
                                                            sx={{
                                                                width: { xs: 110, md: 130 },
                                                                height: { xs: 110, md: 130 },
                                                                border: '4px solid white',
                                                                boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                                                                marginTop: { xs: '-60px', md: 0 },
                                                                position: { xs: 'absolute', md: 'relative' },
                                                                top: { xs: 0, md: 'auto' },
                                                                left: { xs: '50%', md: 'auto' },
                                                                transform: { xs: 'translateX(-50%)', md: 'none' },
                                                            }}
                                                        />
                                                        {completionPercentage === 100 && (
                                                            <Box
                                                                sx={{
                                                                    position: 'absolute',
                                                                    bottom: 0,
                                                                    right: 0,
                                                                    bgcolor: 'white',
                                                                    borderRadius: '50%',
                                                                    padding: 0.5,
                                                                    border: '2px solid white',
                                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                                    zIndex: 2,
                                                                    ...(isMobile && {
                                                                        bottom: '12%',
                                                                        right: '36%',
                                                                    })
                                                                }}
                                                            >
                                                                <VerifiedUserIcon color="success" sx={{ fontSize: 24 }} />
                                                            </Box>
                                                        )}
                                                    </Box>

                                                    <Box sx={{
                                                        textAlign: { xs: 'center', md: 'left' },
                                                        mt: { xs: 6, md: 0.5 },
                                                        flex: 1
                                                    }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' }, mb: 1 }}>
                                                            <Typography variant="h4" fontWeight="bold" mr={1}>
                                                                {user.name}
                                                            </Typography>
                                                            <Tooltip title="Profil Terverifikasi">
                                                                <VerifiedIcon color="primary" />
                                                            </Tooltip>
                                                        </Box>

                                                        <Typography variant="body1" color="text.secondary" gutterBottom>
                                                            {user.email}
                                                        </Typography>

                                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: { xs: 'center', md: 'flex-start' }, mt: 1 }}>
                                                            {profile.phone && (
                                                                <Chip
                                                                    icon={<PhoneIcon fontSize="small" />}
                                                                    label={profile.phone}
                                                                    variant="outlined"
                                                                    size="small"
                                                                    sx={{
                                                                        borderRadius: '0.75rem',
                                                                        borderColor: 'rgba(20, 184, 166, 0.3)',
                                                                        backgroundColor: 'rgba(20, 184, 166, 0.05)',
                                                                        '& .MuiChip-icon': {
                                                                            color: theme.palette.primary.main
                                                                        }
                                                                    }}
                                                                />
                                                            )}

                                                            {profile.address && (
                                                                <Chip
                                                                    icon={<LocationIcon fontSize="small" />}
                                                                    label={profile.address.split(',')[0]}
                                                                    variant="outlined"
                                                                    size="small"
                                                                    sx={{
                                                                        borderRadius: '0.75rem',
                                                                        borderColor: 'rgba(20, 184, 166, 0.3)',
                                                                        backgroundColor: 'rgba(20, 184, 166, 0.05)',
                                                                        '& .MuiChip-icon': {
                                                                            color: theme.palette.primary.main
                                                                        }
                                                                    }}
                                                                />
                                                            )}

                                                            {user.nim && (
                                                                <Chip
                                                                    icon={<BadgeIcon fontSize="small" />}
                                                                    label={`NIM: ${user.nim}`}
                                                                    variant="outlined"
                                                                    size="small"
                                                                    sx={{
                                                                        borderRadius: '0.75rem',
                                                                        borderColor: 'rgba(20, 184, 166, 0.3)',
                                                                        backgroundColor: 'rgba(20, 184, 166, 0.05)',
                                                                        '& .MuiChip-icon': {
                                                                            color: theme.palette.primary.main
                                                                        }
                                                                    }}
                                                                />
                                                            )}
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </Box>

                                            {/* Profile Completion */}
                                            <Box sx={{
                                                mt: { xs: 6, md: 0 },
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: { xs: 'center', md: 'flex-end' }
                                            }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                    <Box
                                                        sx={{
                                                            position: 'relative',
                                                            display: 'inline-flex',
                                                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                                                            borderRadius: '50%'
                                                        }}
                                                    >
                                                        <CircularProgress
                                                            variant="determinate"
                                                            value={completionPercentage}
                                                            size={64}
                                                            thickness={5}
                                                            sx={{
                                                                color: completionPercentage < 50 ? 'error.main' :
                                                                    completionPercentage < 80 ? 'warning.main' :
                                                                        'success.main',
                                                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                                                borderRadius: '50%'
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
                                                                justifyContent: 'center',
                                                            }}
                                                        >
                                                            <Typography
                                                                variant="h6"
                                                                component="div"
                                                                fontWeight="bold"
                                                                color={completionPercentage < 50 ? 'error.main' :
                                                                    completionPercentage < 80 ? 'warning.main' :
                                                                        'success.main'}
                                                            >
                                                                {completionPercentage}%
                                                            </Typography>
                                                        </Box>
                                                    </Box>

                                                    <Box>
                                                        <Typography variant="body1" fontWeight="medium">
                                                            Profil {completionPercentage === 100 ? 'Lengkap' : 'Belum Lengkap'}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {completionPercentage === 100
                                                                ? 'Semua data telah lengkap!'
                                                                : `${missingItems.length} item perlu dilengkapi`}
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <Tooltip title="Edit Profil">
                                                        <Button
                                                            onClick={() => router.visit(route('candidate.profile.edit'))}
                                                            variant="contained"
                                                            color="primary"
                                                            startIcon={<EditIcon />}
                                                            sx={{
                                                                borderRadius: '0.75rem',
                                                                fontWeight: 500,
                                                                px: 2,
                                                                py: 1,
                                                                boxShadow: '0 4px 14px 0 rgba(20, 184, 166, 0.25)',
                                                                '&:hover': {
                                                                    boxShadow: '0 6px 20px 0 rgba(20, 184, 166, 0.35)',
                                                                    transform: 'translateY(-2px)'
                                                                },
                                                                transition: 'all 0.3s ease'
                                                            }}
                                                        >
                                                            Edit Profil
                                                        </Button>
                                                    </Tooltip>

                                                    {profile.resume && (
                                                        <Tooltip title="Lihat Resume">
                                                            <IconButton
                                                                onClick={() => setOpenResumeModal(true)}
                                                                sx={{
                                                                    bgcolor: 'rgba(20, 184, 166, 0.1)',
                                                                    color: 'secondary.main',
                                                                    '&:hover': {
                                                                        bgcolor: 'rgba(20, 184, 166, 0.2)',
                                                                        transform: 'translateY(-2px)'
                                                                    },
                                                                    transition: 'all 0.3s ease',
                                                                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)'
                                                                }}
                                                            >
                                                                <VisibilityIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>

                                {/* Tabs Section */}
                                <Box sx={{ width: '100%' }}>
                                    <Box sx={{ px: 3, pb: 1 }}>
                                        <ModernTabs
                                            value={tabValue}
                                            onChange={handleTabChange}
                                            tabs={[
                                                {
                                                    label: "Profil",
                                                    icon: <PersonIcon fontSize="small" />
                                                },
                                                {
                                                    label: "Pendidikan",
                                                    icon: <SchoolIcon fontSize="small" />
                                                },
                                                {
                                                    label: "Pengalaman",
                                                    icon: <WorkIcon fontSize="small" />
                                                },
                                                {
                                                    label: "Keahlian",
                                                    icon: <StarIcon fontSize="small" />
                                                }
                                            ]}
                                        />
                                    </Box>

                                    <Box sx={{ px: 3, pb: 3 }}>
                                        {/* Personal Info Tab */}
                                        <TabPanel value={tabValue} index={0}>
                                            <Box sx={{ 
                                                display: 'grid',
                                                gridTemplateColumns: {
                                                    xs: '1fr',
                                                    md: 'repeat(2, 1fr)'
                                                },
                                                gap: 3
                                            }}>
                                                {/* Personal Information */}
                                                <Box>
                                                    <ProfileSectionCard
                                                        icon={<PersonIcon />}
                                                        title="Informasi Pribadi"
                                                        onAction={true}
                                                    >
                                                        <List disablePadding>
                                                            {profile.date_of_birth && (
                                                                <ListItem disablePadding disableGutters sx={{ mb: 2.5 }}>
                                                                    <ListItemIcon
                                                                        sx={{
                                                                            minWidth: 40,
                                                                            display: 'flex',
                                                                            justifyContent: 'center'
                                                                        }}
                                                                    >
                                                                        <Box
                                                                            sx={{
                                                                                width: 32,
                                                                                height: 32,
                                                                                borderRadius: '8px',
                                                                                bgcolor: 'rgba(20, 184, 166, 0.08)',
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                                justifyContent: 'center'
                                                                            }}
                                                                        >
                                                                            <CalendarTodayIcon
                                                                                fontSize="small"
                                                                                color="primary"
                                                                            />
                                                                        </Box>
                                                                    </ListItemIcon>
                                                                    <ListItemText
                                                                        primary="Tanggal Lahir"
                                                                        secondary={format(new Date(profile.date_of_birth), 'd MMMM yyyy', { locale: id })}
                                                                        primaryTypographyProps={{
                                                                            variant: 'body2',
                                                                            color: 'text.secondary',
                                                                            fontWeight: 500
                                                                        }}
                                                                        secondaryTypographyProps={{
                                                                            variant: 'body1',
                                                                            fontWeight: 'medium',
                                                                            color: 'text.primary',
                                                                            component: 'span'
                                                                        }}
                                                                    />
                                                                </ListItem>
                                                            )}

                                                            {profile.phone && (
                                                                <ListItem disablePadding disableGutters sx={{ mb: 2.5 }}>
                                                                    <ListItemIcon
                                                                        sx={{
                                                                            minWidth: 40,
                                                                            display: 'flex',
                                                                            justifyContent: 'center'
                                                                        }}
                                                                    >
                                                                        <Box
                                                                            sx={{
                                                                                width: 32,
                                                                                height: 32,
                                                                                borderRadius: '8px',
                                                                                bgcolor: 'rgba(20, 184, 166, 0.08)',
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                                justifyContent: 'center'
                                                                            }}
                                                                        >
                                                                            <PhoneIcon
                                                                                fontSize="small"
                                                                                color="primary"
                                                                            />
                                                                        </Box>
                                                                    </ListItemIcon>
                                                                    <ListItemText
                                                                        primary="Nomor Telepon"
                                                                        secondary={
                                                                            <span style={{ display: 'flex', alignItems: 'center' }}>
                                                                                <Typography
                                                                                    variant="body1"
                                                                                    component="span"
                                                                                    fontWeight="medium"
                                                                                    sx={{ mr: 1 }}
                                                                                >
                                                                                    {profile.phone}
                                                                                </Typography>
                                                                                <Tooltip title={copiedField === 'phone' ? 'Disalin!' : 'Salin'}>
                                                                                    <IconButton
                                                                                        size="small"
                                                                                        onClick={() => handleCopyToClipboard(profile.phone, 'phone')}
                                                                                        sx={{
                                                                                            p: 0.5,
                                                                                            color: copiedField === 'phone' ? 'success.main' : 'action.active',
                                                                                            bgcolor: copiedField === 'phone' ? 'rgba(16, 185, 129, 0.1)' : 'transparent'
                                                                                        }}
                                                                                    >
                                                                                        {copiedField === 'phone' ?
                                                                                            <CheckIcon fontSize="small" /> :
                                                                                            <ContentCopyIcon fontSize="small" />
                                                                                        }
                                                                                    </IconButton>
                                                                                </Tooltip>
                                                                            </span>
                                                                        }
                                                                        primaryTypographyProps={{
                                                                            variant: 'body2',
                                                                            color: 'text.secondary',
                                                                            fontWeight: 500
                                                                        }}
                                                                    />
                                                                </ListItem>
                                                            )}

                                                            {profile.address && (
                                                                <ListItem disablePadding disableGutters sx={{ mb: 2.5 }}>
                                                                    <ListItemIcon
                                                                        sx={{
                                                                            minWidth: 40,
                                                                            display: 'flex',
                                                                            justifyContent: 'center'
                                                                        }}
                                                                    >
                                                                        <Box
                                                                            sx={{
                                                                                width: 32,
                                                                                height: 32,
                                                                                borderRadius: '8px',
                                                                                bgcolor: 'rgba(20, 184, 166, 0.08)',
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                                justifyContent: 'center'
                                                                            }}
                                                                        >
                                                                            <LocationIcon
                                                                                fontSize="small"
                                                                                color="primary"
                                                                            />
                                                                        </Box>
                                                                    </ListItemIcon>
                                                                    <ListItemText
                                                                        primary="Alamat"
                                                                        secondary={profile.address}
                                                                        primaryTypographyProps={{
                                                                            variant: 'body2',
                                                                            color: 'text.secondary',
                                                                            fontWeight: 500
                                                                        }}
                                                                        secondaryTypographyProps={{
                                                                            variant: 'body1',
                                                                            fontWeight: 'medium',
                                                                            color: 'text.primary',
                                                                            component: 'span'
                                                                        }}
                                                                    />
                                                                </ListItem>
                                                            )}

                                                            <ListItem disablePadding disableGutters>
                                                                <ListItemIcon
                                                                    sx={{
                                                                        minWidth: 40,
                                                                        display: 'flex',
                                                                        justifyContent: 'center'
                                                                    }}
                                                                >
                                                                    <Box
                                                                        sx={{
                                                                            width: 32,
                                                                            height: 32,
                                                                            borderRadius: '8px',
                                                                            bgcolor: 'rgba(20, 184, 166, 0.08)',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center'
                                                                        }}
                                                                    >
                                                                        <EmailIcon
                                                                            fontSize="small"
                                                                            color="primary"
                                                                        />
                                                                    </Box>
                                                                </ListItemIcon>
                                                                <ListItemText
                                                                    primary="Email"
                                                                    secondary={
                                                                        <span style={{ display: 'flex', alignItems: 'center' }}>
                                                                            <Typography
                                                                                variant="body1"
                                                                                component="span"
                                                                                fontWeight="medium"
                                                                                sx={{ mr: 1 }}
                                                                            >
                                                                                {user.email}
                                                                            </Typography>
                                                                            <Tooltip title={copiedField === 'email' ? 'Disalin!' : 'Salin'}>
                                                                                <IconButton
                                                                                    size="small"
                                                                                    onClick={() => handleCopyToClipboard(user.email, 'email')}
                                                                                    sx={{
                                                                                        p: 0.5,
                                                                                        color: copiedField === 'email' ? 'success.main' : 'action.active',
                                                                                        bgcolor: copiedField === 'email' ? 'rgba(16, 185, 129, 0.1)' : 'transparent'
                                                                                    }}
                                                                                >
                                                                                    {copiedField === 'email' ?
                                                                                        <CheckIcon fontSize="small" /> :
                                                                                        <ContentCopyIcon fontSize="small" />
                                                                                    }
                                                                                </IconButton>
                                                                            </Tooltip>
                                                                        </span>
                                                                    }
                                                                    primaryTypographyProps={{
                                                                        variant: 'body2',
                                                                        color: 'text.secondary',
                                                                        fontWeight: 500
                                                                    }}
                                                                />
                                                            </ListItem>
                                                        </List>
                                                    </ProfileSectionCard>
                                                </Box>

                                                {/* Social Media */}
                                                <Box>
                                                    <ProfileSectionCard
                                                        icon={<LanguageIcon />}
                                                        title="Media Sosial"
                                                        onAction={true}
                                                        empty={!profile.linkedin && !profile.github && !profile.twitter && !profile.website}
                                                        subtitle="Tambahkan tautan media sosial Anda untuk meningkatkan profil profesional Anda."
                                                        actionText="Tambah Media Sosial"
                                                    >
                                                        <Stack spacing={2}>
                                                            {profile.linkedin && (
                                                                <SocialMediaBadge
                                                                    type="linkedin"
                                                                    username={profile.linkedin}
                                                                    url={profile.linkedin}
                                                                />
                                                            )}

                                                            {profile.github && (
                                                                <SocialMediaBadge
                                                                    type="github"
                                                                    username={profile.github}
                                                                    url={profile.github}
                                                                />
                                                            )}

                                                            {profile.twitter && (
                                                                <SocialMediaBadge
                                                                    type="twitter"
                                                                    username={profile.twitter}
                                                                    url={profile.twitter}
                                                                />
                                                            )}

                                                            {profile.website && (
                                                                <SocialMediaBadge
                                                                    type="website"
                                                                    username={profile.website}
                                                                    url={profile.website}
                                                                />
                                                            )}
                                                        </Stack>
                                                    </ProfileSectionCard>
                                                </Box>

                                                {/* Resume */}
                                                {profile.resume && (
                                                    <Box>
                                                        <Paper
                                                            elevation={0}
                                                            sx={{
                                                                p: 0,
                                                                borderRadius: '1rem',
                                                                border: '1px solid',
                                                                borderColor: 'divider',
                                                                background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.04) 0%, rgba(20, 184, 166, 0.08) 100%)',
                                                                position: 'relative',
                                                                overflow: 'hidden'
                                                            }}
                                                        >
                                                            <Box
                                                                sx={{
                                                                    position: 'absolute',
                                                                    width: 200,
                                                                    height: 200,
                                                                    borderRadius: '50%',
                                                                    backgroundColor: 'rgba(20, 184, 166, 0.08)',
                                                                    top: -80,
                                                                    right: -60,
                                                                    zIndex: 0
                                                                }}
                                                            />
                                                            <Box
                                                                sx={{
                                                                    position: 'absolute',
                                                                    width: 100,
                                                                    height: 100,
                                                                    borderRadius: '50%',
                                                                    backgroundColor: 'rgba(20, 184, 166, 0.1)',
                                                                    bottom: -30,
                                                                    left: '30%',
                                                                    zIndex: 0
                                                                }}
                                                            />

                                                            <Box sx={{
                                                                p: 3,
                                                                display: 'flex',
                                                                flexDirection: { xs: 'column', sm: 'row' },
                                                                alignItems: 'center',
                                                                gap: 3,
                                                                position: 'relative',
                                                                zIndex: 1
                                                            }}>
                                                                <Box
                                                                    sx={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        width: 60,
                                                                        height: 60,
                                                                        bgcolor: 'white',
                                                                        borderRadius: '1rem',
                                                                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.05)',
                                                                        flexShrink: 0
                                                                    }}
                                                                >
                                                                    <DescriptionIcon
                                                                        color="primary"
                                                                        sx={{ fontSize: 28 }}
                                                                    />
                                                                </Box>

                                                                <Box sx={{
                                                                    flexGrow: 1,
                                                                    textAlign: { xs: 'center', sm: 'left' }
                                                                }}>
                                                                    <Typography
                                                                        variant="h6"
                                                                        fontWeight="bold"
                                                                        gutterBottom
                                                                    >
                                                                        CV / Resume
                                                                    </Typography>
                                                                    <Typography
                                                                        variant="body2"
                                                                        color="text.secondary"
                                                                    >
                                                                        {profile.resume.split('/').pop()}
                                                                    </Typography>
                                                                </Box>

                                                                <Stack
                                                                    direction="row"
                                                                    spacing={1}
                                                                    sx={{
                                                                        flexShrink: 0,
                                                                        mt: { xs: 2, sm: 0 }
                                                                    }}
                                                                >
                                                                    <Button
                                                                        variant="contained"
                                                                        color="primary"
                                                                        startIcon={<VisibilityIcon />}
                                                                        onClick={() => setOpenResumeModal(true)}
                                                                        sx={{
                                                                            borderRadius: '0.75rem',
                                                                            fontWeight: 500,
                                                                            boxShadow: '0 4px 14px 0 rgba(20, 184, 166, 0.25)',
                                                                            '&:hover': {
                                                                                boxShadow: '0 6px 20px 0 rgba(20, 184, 166, 0.35)',
                                                                                transform: 'translateY(-2px)'
                                                                            },
                                                                            transition: 'all 0.3s ease'
                                                                        }}
                                                                    >
                                                                        Lihat
                                                                    </Button>

                                                                    <Button
                                                                        variant="outlined"
                                                                        color="primary"
                                                                        startIcon={<DownloadIcon />}
                                                                        component="a"
                                                                        href={profile.resume}
                                                                        download
                                                                        sx={{
                                                                            borderRadius: '0.75rem',
                                                                            fontWeight: 500,
                                                                            borderColor: 'rgba(20, 184, 166, 0.5)',
                                                                            '&:hover': {
                                                                                borderColor: 'primary.main',
                                                                                backgroundColor: 'rgba(20, 184, 166, 0.05)',
                                                                                transform: 'translateY(-2px)'
                                                                            },
                                                                            transition: 'all 0.3s ease'
                                                                        }}
                                                                    >
                                                                        Download
                                                                    </Button>
                                                                </Stack>
                                                            </Box>
                                                        </Paper>
                                                    </Box>
                                                )}
                                            </Box>
                                        </TabPanel>

                                        {/* Education Tab */}
                                        <TabPanel value={tabValue} index={1}>
                                            <Box>
                                                {profile.education ? (
                                                    <ProfileSectionCard
                                                        icon={<SchoolIcon />}
                                                        title="Riwayat Pendidikan"
                                                        onAction={true}
                                                        actionIcon={<EditIcon />}
                                                    >
                                                        <Typography
                                                            variant="body1"
                                                            sx={{
                                                                whiteSpace: 'pre-line',
                                                                lineHeight: 1.8
                                                            }}
                                                        >
                                                            {profile.education}
                                                        </Typography>
                                                    </ProfileSectionCard>
                                                ) : (
                                                    <ProfileSectionCard
                                                        icon={<SchoolIcon />}
                                                        title="Belum ada informasi pendidikan"
                                                        subtitle="Tambahkan informasi pendidikan Anda untuk meningkatkan profil Anda."
                                                        empty={true}
                                                        onAction={true}
                                                        actionText="Tambah Pendidikan"
                                                    />
                                                )}
                                            </Box>
                                        </TabPanel>

                                        {/* Experience Tab */}
                                        <TabPanel value={tabValue} index={2}>
                                            <Box>
                                                {profile.experience ? (
                                                    <ProfileSectionCard
                                                        icon={<WorkIcon />}
                                                        title="Pengalaman Kerja"
                                                        onAction={true}
                                                        actionIcon={<EditIcon />}
                                                    >
                                                        <Typography
                                                            variant="body1"
                                                            sx={{
                                                                whiteSpace: 'pre-line',
                                                                lineHeight: 1.8
                                                            }}
                                                        >
                                                            {profile.experience}
                                                        </Typography>
                                                    </ProfileSectionCard>
                                                ) : (
                                                    <ProfileSectionCard
                                                        icon={<WorkIcon />}
                                                        title="Belum ada pengalaman kerja"
                                                        subtitle="Tambahkan pengalaman kerja Anda untuk menunjukkan kualifikasi kepada perekrut."
                                                        empty={true}
                                                        onAction={true}
                                                        actionText="Tambah Pengalaman"
                                                    />
                                                )}
                                            </Box>
                                        </TabPanel>

                                        {/* Skills Tab */}
                                        <TabPanel value={tabValue} index={3}>
                                            <Box>
                                                {skillBadges.length > 0 ? (
                                                    <ProfileSectionCard
                                                        icon={<StarIcon />}
                                                        title="Keahlian"
                                                        onAction={true}
                                                        actionIcon={<EditIcon />}
                                                    >
                                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                                                            {skillBadges.map((skill, index) => (
                                                                <SkillChip key={index} label={skill} />
                                                            ))}
                                                        </Box>
                                                    </ProfileSectionCard>
                                                ) : (
                                                    <ProfileSectionCard
                                                        icon={<StarIcon />}
                                                        title="Belum ada keahlian"
                                                        subtitle="Tambahkan keahlian Anda untuk menonjolkan keterampilan yang Anda miliki."
                                                        empty={true}
                                                        onAction={true}
                                                        actionText="Tambah Keahlian"
                                                    />
                                                )}
                                            </Box>
                                        </TabPanel>
                                    </Box>
                                </Box>
                            </Box>
                        </GlassCard>
                    </motion.div>

                    {/* Profile Completeness Card */}
                    {completionPercentage < 100 && missingItems.length > 0 && (
                        <motion.div variants={itemVariants}>
                            <GlassCard sx={{ p: 3 }} hover={false}>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    <Box sx={{ textAlign: { xs: 'center', md: 'left' }, mb: { xs: 2, md: 0 } }}>
                                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                                            Lengkapi Profil Anda
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Profil yang lengkap meningkatkan peluang ditemukan oleh perekrut.
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {missingItems.map((item, index) => (
                                        <Chip
                                            key={index}
                                            label={item}
                                            size="small"
                                            sx={{
                                                borderRadius: '0.75rem',
                                                bgcolor: 'rgba(20, 184, 166, 0.08)',
                                                color: 'primary.main',
                                                fontWeight: 500,
                                                border: '1px solid rgba(20, 184, 166, 0.2)'
                                            }}
                                        />
                                    ))}
                                </Box>

                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                                        <Button
                                            onClick={() => router.visit(route('candidate.profile.edit'))}
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            startIcon={<EditIcon />}
                                            sx={{
                                                borderRadius: '0.75rem',
                                                py: 1.2,
                                                fontWeight: 600,
                                                boxShadow: '0 4px 14px 0 rgba(20, 184, 166, 0.25)',
                                                '&:hover': {
                                                    boxShadow: '0 6px 20px 0 rgba(20, 184, 166, 0.35)',
                                                    transform: 'translateY(-2px)'
                                                },
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            Lengkapi Sekarang
                                        </Button>
                                    </Box>
                                </Box>
                            </GlassCard>
                        </motion.div>
                    )}

                    {/* Profile Stats Card */}
                    <motion.div variants={itemVariants}>
                        <GlassCard sx={{ mt: 4, p: 0 }} hover={false}>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                <Box sx={{ 
                                    p: 3,
                                    bgcolor: 'rgba(20, 184, 166, 0.04)',
                                    borderRight: { md: '1px solid' },
                                    borderBottom: { xs: '1px solid', md: 'none' },
                                    borderColor: 'divider'
                                }}>
                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        height: '100%',
                                        textAlign: { xs: 'center', md: 'left' }
                                    }}>
                                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                                            Statistik Aktivitas
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Lihat data aktivitas profil dan lamaran Anda pada platform kami.
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ 
                                    p: 3,
                                    borderRight: { md: '1px solid' },
                                    borderBottom: '1px solid',
                                    borderColor: 'divider'
                                }}>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <ForwardToInboxIcon
                                            color="primary"
                                            sx={{
                                                fontSize: 36,
                                                mb: 1,
                                                opacity: 0.8
                                            }}
                                        />
                                        <Typography variant="h4" fontWeight="bold">
                                            {profile.stats?.applications || 0}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Lamaran Terkirim
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ 
                                    p: 3,
                                    borderRight: { md: '1px solid' },
                                    borderColor: 'divider'
                                }}>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <VisibilityIcon
                                            color="info"
                                            sx={{
                                                fontSize: 36,
                                                mb: 1,
                                                opacity: 0.8,
                                                color: theme.palette.info.main
                                            }}
                                        />
                                        <Typography variant="h4" fontWeight="bold">
                                            {profile.stats?.profileViews || 0}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Dilihat Perekrut
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ 
                                    p: 3,
                                    borderRight: { md: '1px solid' },
                                    borderColor: 'divider'
                                }}>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <ForumIcon
                                            sx={{
                                                fontSize: 36,
                                                mb: 1,
                                                opacity: 0.8,
                                                color: theme.palette.warning.main
                                            }}
                                        />
                                        <Typography variant="h4" fontWeight="bold">
                                            {profile.stats?.interviews || 0}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Interview
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ 
                                    p: 3,
                                    borderRight: { md: '1px solid' },
                                    borderColor: 'divider'
                                }}>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <CheckCircleOutlineIcon
                                            sx={{
                                                fontSize: 36,
                                                mb: 1,
                                                opacity: 0.8,
                                                color: theme.palette.success.main
                                            }}
                                        />
                                        <Typography variant="h4" fontWeight="bold">
                                            {profile.stats?.accepted || 0}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Diterima
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </GlassCard>
                    </motion.div>

                    {/* Resume Preview Modal */}
                    {profile.resume && (
                        <ResumePreviewModal
                            open={openResumeModal}
                            handleClose={() => setOpenResumeModal(false)}
                            resumeUrl={profile.resume}
                        />
                    )}
                </motion.div>
            </Container>
        </Layout>
    );
}
