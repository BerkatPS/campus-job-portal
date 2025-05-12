import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Box,
    Typography,
    IconButton,
    Chip,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Tabs,
    Tab,
    Avatar,
    Paper,
    alpha,
    Container,
    Stack,
    useTheme,
    LinearProgress,
    useMediaQuery
} from '@mui/material';

// MUI Lab Components for Timeline
import {
    Timeline,
    TimelineItem,
    TimelineConnector,
    TimelineSeparator,
    TimelineContent,
    TimelineDot,
} from '@mui/lab';

// MUI Icons
import {
    KeyboardArrowLeft,
    Event,
    Email,
    Phone,
    Person,
    BusinessCenter,
    LocationOn,
    School,
    Work,
    Star,
    StarBorder,
    Edit,
    CalendarMonth,
    FilePresentOutlined,
    Download,
    Check,
    VideoCall,
    WorkOutline,
    Timer,
    AccessTime,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
} from '@mui/icons-material';

// Custom Components
import Button from '@/Components/Shared/Button';
import Dropdown from '@/Components/Shared/Dropdown';
import Alert from '@/Components/Shared/Alert';
import TextArea from '@/Components/Shared/TextArea';
import Select from '@/Components/Shared/Select';
import Modal from '@/Components/Shared/Modal';
import Layout from '@/Components/Layout/Layout';
import { motion, AnimatePresence } from 'framer-motion';

// Tab Panel Component
const TabPanel = ({ children, value, index }) => {
    return (
        <Box
            role="tabpanel"
            hidden={value !== index}
            id={`application-tabpanel-${index}`}
            aria-labelledby={`application-tab-${index}`}
        >
            {value === index && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                >
                    {children}
                </motion.div>
            )}
        </Box>
    );
};

// Section Title Component
const SectionTitle = ({ title, color = 'primary.main' }) => (
    <Box sx={{
        display: 'flex',
        alignItems: 'center',
        mb: 2,
        mt: 1
    }}>
        <Box sx={{
            width: 4,
            height: 20,
            bgcolor: color,
            borderRadius: 1,
            mr: 1.5
        }} />
        <Typography variant="h6" fontWeight="700" color="text.primary" className="text-gray-800">
            {title}
        </Typography>
    </Box>
);

const Show = () => {
    const { application, stages, statuses, events, flash } = usePage().props;
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [tabValue, setTabValue] = useState(0);
    const [openStatusModal, setOpenStatusModal] = useState(false);
    const [openStageModal, setOpenStageModal] = useState(false);
    const [openNotesModal, setOpenNotesModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(application?.status?.id);
    const [selectedStage, setSelectedStage] = useState(application?.current_stage?.id);
    const [notes, setNotes] = useState(application?.notes || '');
    const [openRejectModal, setOpenRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [stageNotes, setStageNotes] = useState('');

    useEffect(() => {
        if (application.current_stage) {
            setSelectedStage(application.current_stage.id);
        }
    }, [application]);

    // Handle tab change
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // Toggle favorite status
    const handleToggleFavorite = () => {
        router.put(route('manager.applications.toggle-favorite', application.id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                router.reload({ only: ['application'] });
            }
        });
    };

    // Save notes
    const handleNotesSubmit = () => {
        router.put(route('manager.applications.update-notes', application.id), {
            notes: notes
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setOpenNotesModal(false);
                router.reload({ only: ['application'] });
            }
        });
    };

    // Reject application
    const rejectApplication = () => {
        router.post(route('manager.applications.update-status', application.id), {
            status: 'rejected',
            reason: rejectionReason
        }, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => setOpenRejectModal(false)
        });
    };

    // Change application stage
    const handleStageSubmit = () => {
        router.put(route('manager.applications.update-stage', application.id), {
            stage_id: selectedStage,
            notes: stageNotes
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setOpenStageModal(false);
                setStageNotes('');
                router.reload({ only: ['application'] });
            }
        });
    };

    // Fix handleStageChange
    const handleStageChange = (event) => {
        setSelectedStage(event.target.value);
    };

    const handleStatusChange = (event) => {
        setSelectedStatus(event.target.value);
    };

    const handleStatusSubmit = () => {
        router.put(route('manager.applications.update-status', application.id), {
            status_id: selectedStatus
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setOpenStatusModal(false);
                router.reload({ only: ['application'] });
            }
        });
    };

    const handleNotesChange = (event) => {
        setNotes(event.target.value);
    };

    const handleCloseStatusModal = () => {
        setOpenStatusModal(false);
        setSelectedStatus(application?.status?.id);
    };

    const handleCloseStageModal = () => {
        setOpenStageModal(false);
        setSelectedStage(application?.current_stage?.id);
        setStageNotes('');
    };

    const handleCloseNotesModal = () => {
        setOpenNotesModal(false);
        setNotes(application?.notes || '');
    };

    // Actions dropdown items
    const getActions = () => [
        {
            label: 'Ubah Status',
            icon: <Check />,
            onClick: () => setOpenStatusModal(true)
        },
        {
            label: 'Ubah Tahap',
            icon: <WorkOutline />,
            onClick: () => setOpenStageModal(true)
        },
        {
            label: 'Tambah Catatan',
            icon: <Edit />,
            onClick: () => setOpenNotesModal(true)
        },
        {
            label: application.is_favorite ? 'Hapus dari Favorit' : 'Tambah ke Favorit',
            icon: application.is_favorite ? <Star /> : <StarBorder />,
            onClick: handleToggleFavorite
        }
    ];

    // Format date function
    const formatDate = (dateString, format = 'long') => {
        if (!dateString) return '';

        const date = new Date(dateString);

        if (format === 'long') {
            return date.toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } else if (format === 'short') {
            return date.toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } else if (format === 'datetime') {
            return date.toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        return date.toLocaleDateString('id-ID');
    };

    return (
        <Layout>
            <Head title={`Lamaran ${application?.user?.name || ''} - Detail`} />

            <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Box
                        sx={{
                            bgcolor: 'background.paper',
                            borderRadius: '1rem',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                            overflow: 'hidden',
                            border: '1px solid',
                            borderColor: 'divider'
                        }}
                    >
                        <Box sx={{ p: { xs: 2, md: 3 } }}>

                            {flash.success && (
                                <Alert
                                    severity="success"
                                    title="Berhasil"
                                    onClose={() => router.reload({ only: ['flash'] })}
                                    sx={{ mb: 3, borderRadius: '0.75rem' }}
                                    icon={<CheckCircleIcon fontSize="inherit" />}
                                >
                                    {flash.success}
                                </Alert>
                            )}

                            {/* Header Section */}
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                flexDirection: { xs: 'column', sm: 'row' },
                                gap: { xs: 2, sm: 0 },
                                mb: 4,
                                pb: 3,
                                borderBottom: '1px solid',
                                borderColor: theme => alpha(theme.palette.divider, 0.7)
                            }}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Link href={route('manager.applications.index')}>
                                        <IconButton
                                            sx={{
                                                bgcolor: theme => alpha(theme.palette.primary.main, 0.1),
                                                borderRadius: '0.75rem',
                                                '&:hover': {
                                                    bgcolor: theme => alpha(theme.palette.primary.main, 0.2),
                                                }
                                            }}
                                        >
                                            <KeyboardArrowLeft />
                                        </IconButton>
                                    </Link>
                                    <Box>
                                        <Typography
                                            variant="h5"
                                            sx={{
                                                fontWeight: 700,
                                                color: 'text.primary',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1
                                            }}
                                            className="text-gray-800"
                                        >
                                            Lamaran {application?.user?.name}
                                            {application?.is_favorite && (
                                                <Star
                                                    fontSize="small"
                                                    sx={{ color: theme => theme.palette.warning.main }}
                                                />
                                            )}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Melamar untuk <strong>{application?.job?.title}</strong> pada {formatDate(application?.created_at, 'short')}
                                        </Typography>
                                    </Box>
                                </Stack>

                                <Box>
                                    <Dropdown
                                        buttonType="button"
                                        items={getActions()}
                                        variant="contained"
                                        color="primary"
                                        sx={{
                                            borderRadius: '0.75rem',
                                            py: 1.25,
                                            fontWeight: 600,
                                            boxShadow: '0 4px 14px 0 rgba(20, 184, 166, 0.25)',
                                            '&:hover': {
                                                boxShadow: '0 6px 20px 0 rgba(20, 184, 166, 0.35)',
                                            },
                                            transition: 'all 0.3s ease'
                                        }}
                                        className="transition-all duration-300"
                                    >
                                        Aksi
                                    </Dropdown>
                                </Box>
                            </Box>

                            {/* Main Content */}
                            <Box sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', lg: 'row' },
                                gap: 3
                            }}>
                                {/* Left Content */}
                                <Box sx={{
                                    flex: '1 1 auto',
                                    width: { xs: '100%', lg: 'calc(100% - 350px)' }
                                }}>
                                    {/* Tabs */}
                                    <Box sx={{ mb: 4 }}>
                                        <Box sx={{
                                            mb: 3,
                                            bgcolor: 'background.paper',
                                            borderRadius: '1rem',
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            overflow: 'hidden'
                                        }}>
                                            <Tabs
                                                value={tabValue}
                                                onChange={handleTabChange}
                                                variant="fullWidth"
                                                sx={{
                                                    '& .MuiTab-root': {
                                                        fontWeight: 600,
                                                        textTransform: 'none',
                                                        minHeight: 56,
                                                        fontSize: '0.95rem'
                                                    },
                                                    '& .MuiTabs-indicator': {
                                                        height: 3,
                                                        borderRadius: '3px 3px 0 0'
                                                    }
                                                }}
                                            >
                                                <Tab label="Ikhtisar" />
                                                <Tab label="CV" />
                                                <Tab label="Linimasa" />
                                                <Tab label="Acara" />
                                            </Tabs>
                                        </Box>

                                        <AnimatePresence mode="wait">
                                            {/* Overview Tab */}
                                            <TabPanel value={tabValue} index={0}>
                                                <Paper
                                                    elevation={0}
                                                    sx={{
                                                        borderRadius: '1rem',
                                                        border: '1px solid',
                                                        borderColor: 'divider',
                                                        p: { xs: 2, md: 3 }
                                                    }}
                                                >
                                                    <Stack spacing={3}>
                                                        {/* Status Section */}
                                                        <Box sx={{ position: 'relative' }}>
                                                            <LinearProgress
                                                                variant="determinate"
                                                                value={application?.status?.name === 'Accepted' ? 100 :
                                                                    application?.status?.name === 'Rejected' ? 100 :
                                                                        application?.status?.name === 'Interview' ? 60 :
                                                                            application?.status?.name === 'Reviewed' ? 40 : 20}
                                                                sx={{
                                                                    position: 'absolute',
                                                                    top: 0,
                                                                    left: 0,
                                                                    right: 0,
                                                                    height: 4,
                                                                    backgroundColor: 'rgba(0,0,0,0.05)',
                                                                    '& .MuiLinearProgress-bar': {
                                                                        backgroundColor: application?.status?.color || 'primary.main'
                                                                    },
                                                                    mb: 2
                                                                }}
                                                            />

                                                            <Box sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'space-between',
                                                                mb: 2,
                                                                pb: 2,
                                                                mt: 1,
                                                                borderBottom: '1px solid',
                                                                borderColor: theme => alpha(theme.palette.divider, 0.1)
                                                            }}>
                                                                <Typography variant="h6" fontWeight="700" className="text-gray-800">Status Lamaran</Typography>
                                                                <Chip
                                                                    label={application?.status?.name}
                                                                    sx={{
                                                                        height: 28,
                                                                        fontWeight: 600,
                                                                        backgroundColor: alpha(application?.status?.color, 0.1),
                                                                        color: application?.status?.color,
                                                                        fontSize: '0.75rem',
                                                                        borderRadius: '0.5rem',
                                                                        border: '1px solid',
                                                                        borderColor: `${alpha(application?.status?.color, 0.3)}`
                                                                    }}
                                                                />
                                                            </Box>

                                                            {application?.current_stage && (
                                                                <Box sx={{
                                                                    mt: 2,
                                                                    p: 2,
                                                                    bgcolor: alpha(theme.palette.background.paper, 0.5),
                                                                    borderRadius: '0.75rem',
                                                                    border: '1px solid',
                                                                    borderColor: alpha(theme.palette.divider, 0.1)
                                                                }}>
                                                                    <Typography variant="body2" color="text.secondary" mb={1}>Tahap Saat Ini</Typography>
                                                                    <Chip
                                                                        label={application?.current_stage?.name}
                                                                        size="small"
                                                                        sx={{
                                                                            height: 24,
                                                                            fontWeight: 600,
                                                                            backgroundColor: alpha(application?.current_stage?.color, 0.1),
                                                                            color: application?.current_stage?.color,
                                                                            fontSize: '0.75rem',
                                                                            borderRadius: '0.5rem',
                                                                            border: '1px solid',
                                                                            borderColor: `${alpha(application?.current_stage?.color, 0.3)}`
                                                                        }}
                                                                    />
                                                                </Box>
                                                            )}
                                                        </Box>

                                                        <Divider />

                                                        {/* Cover Letter */}
                                                        <Box>
                                                            <SectionTitle title="Surat Lamaran" />
                                                            <Paper
                                                                elevation={0}
                                                                sx={{
                                                                    p: 3,
                                                                    borderRadius: '0.75rem',
                                                                    bgcolor: alpha(theme.palette.primary.main, 0.03),
                                                                    border: '1px solid',
                                                                    borderColor: alpha(theme.palette.primary.main, 0.1)
                                                                }}
                                                            >
                                                                <Typography variant="body2" sx={{
                                                                    whiteSpace: 'pre-line',
                                                                    lineHeight: 1.7,
                                                                    color: 'text.secondary'
                                                                }}>
                                                                    {application?.cover_letter || 'Tidak ada surat lamaran yang disediakan.'}
                                                                </Typography>
                                                            </Paper>
                                                        </Box>

                                                        {/* Recruiter Notes */}
                                                        {application?.notes && (
                                                            <Box>
                                                                <SectionTitle title="Catatan Rekruter" color="warning.main" />
                                                                <Paper
                                                                    elevation={0}
                                                                    sx={{
                                                                        p: 3,
                                                                        borderRadius: '0.75rem',
                                                                        bgcolor: alpha(theme.palette.warning.main, 0.05),
                                                                        border: '1px solid',
                                                                        borderColor: alpha(theme.palette.warning.main, 0.2)
                                                                    }}
                                                                >
                                                                    <Typography variant="body2" sx={{
                                                                        whiteSpace: 'pre-line',
                                                                        lineHeight: 1.7,
                                                                        color: 'text.secondary'
                                                                    }}>
                                                                        {application?.notes}
                                                                    </Typography>
                                                                </Paper>
                                                            </Box>
                                                        )}

                                                    </Stack>
                                                </Paper>
                                            </TabPanel>

                                            {/* Resume Tab */}
                                            <TabPanel value={tabValue} index={1}>
                                                <Paper
                                                    elevation={0}
                                                    sx={{
                                                        borderRadius: '1rem',
                                                        border: '1px solid',
                                                        borderColor: 'divider',
                                                        p: { xs: 2, md: 3 },
                                                        position: 'relative'
                                                    }}
                                                >
                                                    {application?.resume ? (
                                                        <Box sx={{ p: 2, textAlign: 'center' }}>
                                                            <Box
                                                                component="iframe"
                                                                src={`${application?.resume_url}#view=FitH`}
                                                                width="100%"
                                                                height="600px"
                                                                sx={{
                                                                    border: 'none',
                                                                    borderRadius: '0.75rem',
                                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                                                }}
                                                            />
                                                            <Button
                                                                variant="outlined"
                                                                color="primary"
                                                                startIcon={<Download />}
                                                                sx={{
                                                                    mt: 3,
                                                                    borderRadius: '0.75rem',
                                                                    py: 1.25,
                                                                    fontWeight: 500,
                                                                    '&:hover': {
                                                                        borderColor: 'primary.main',
                                                                        backgroundColor: alpha(theme.palette.primary.main, 0.05)
                                                                    }
                                                                }}
                                                                onClick={() => window.open(application?.resume_url, '_blank')}
                                                            >
                                                                Unduh CV
                                                            </Button>
                                                        </Box>
                                                    ) : (
                                                        <Box sx={{
                                                            p: 5,
                                                            textAlign: 'center',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            minHeight: '300px'
                                                        }}>
                                                            <Box
                                                                sx={{
                                                                    width: 80,
                                                                    height: 80,
                                                                    borderRadius: '50%',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    backgroundColor: alpha(theme.palette.grey[500], 0.1),
                                                                    mb: 2
                                                                }}
                                                            >
                                                                <FilePresentOutlined sx={{ fontSize: 40, color: 'text.secondary' }} />
                                                            </Box>
                                                            <Typography
                                                                variant="h6"
                                                                sx={{ fontWeight: 700, mb: 1 }}
                                                                className="text-gray-800"
                                                            >
                                                                Tidak Ada CV yang Diunggah
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Kandidat belum mengunggah CV untuk lamaran ini.
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                </Paper>
                                            </TabPanel>

                                            {/* Timeline Tab */}
                                            <TabPanel value={tabValue} index={2}>
                                                <Paper
                                                    elevation={0}
                                                    sx={{
                                                        borderRadius: '1rem',
                                                        border: '1px solid',
                                                        borderColor: 'divider',
                                                        p: { xs: 2, md: 3 }
                                                    }}
                                                >
                                                    <Timeline
                                                        position="right"
                                                        sx={{
                                                            px: 0,
                                                            py: 1,
                                                            '& .MuiTimelineItem-root': {
                                                                minHeight: 'auto',
                                                            }
                                                        }}
                                                    >
                                                        {application?.stage_history && application?.stage_history.length > 0 ? (
                                                            application?.stage_history.map((history, index) => (
                                                                <TimelineItem key={index}>
                                                                    <TimelineSeparator>
                                                                        <TimelineDot
                                                                            sx={{
                                                                                bgcolor: history.stage.color,
                                                                                boxShadow: `0 0 0 3px ${alpha(history.stage.color, 0.2)}`
                                                                            }}
                                                                        />
                                                                        {index < application?.stage_history.length - 1 && (
                                                                            <TimelineConnector sx={{ minHeight: 30 }} />
                                                                        )}
                                                                    </TimelineSeparator>
                                                                    <TimelineContent sx={{ py: 1.5, px: 2 }}>
                                                                        <Typography variant="body2" fontWeight="600">
                                                                            Dipindahkan ke tahap {history.stage.name}
                                                                        </Typography>
                                                                        <Typography variant="caption" color="text.secondary" display="block">
                                                                            {formatDate(history.created_at, 'datetime')}
                                                                            {history.user && ` oleh ${history.user.name}`}
                                                                        </Typography>
                                                                        {history.notes && (
                                                                            <Paper
                                                                                elevation={0}
                                                                                sx={{
                                                                                    mt: 1,
                                                                                    p: 1.5,
                                                                                    bgcolor: alpha(theme.palette.grey[500], 0.1),
                                                                                    borderRadius: '0.75rem',
                                                                                    border: '1px solid',
                                                                                    borderColor: alpha(theme.palette.grey[500], 0.2)
                                                                                }}
                                                                            >
                                                                                <Typography
                                                                                    variant="body2"
                                                                                    sx={{
                                                                                        color: 'text.secondary',
                                                                                        lineHeight: 1.6
                                                                                    }}
                                                                                >
                                                                                    {history.notes}
                                                                                </Typography>
                                                                            </Paper>
                                                                        )}
                                                                    </TimelineContent>
                                                                </TimelineItem>
                                                            ))
                                                        ) : (
                                                            <Box sx={{
                                                                p: 4,
                                                                textAlign: 'center',
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                minHeight: '200px',
                                                                bgcolor: alpha(theme.palette.background.paper, 0.5),
                                                                borderRadius: '0.75rem',
                                                                border: '1px dashed',
                                                                borderColor: alpha(theme.palette.divider, 0.3)
                                                            }}>
                                                                <Box
                                                                    sx={{
                                                                        width: 70,
                                                                        height: 70,
                                                                        borderRadius: '50%',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                                                        mb: 2
                                                                    }}
                                                                >
                                                                    <AccessTime sx={{ fontSize: 36, color: 'primary.main' }} />
                                                                </Box>
                                                                <Typography
                                                                    variant="h6"
                                                                    sx={{ fontWeight: 700, mb: 1 }}
                                                                    className="text-gray-800"
                                                                >
                                                                    Belum Ada Riwayat
                                                                </Typography>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    Belum ada riwayat tahapan yang tersedia.
                                                                </Typography>
                                                            </Box>
                                                        )}
                                                    </Timeline>
                                                </Paper>
                                            </TabPanel>

                                            {/* Events Tab */}
                                            <TabPanel value={tabValue} index={3}>
                                                <Paper
                                                    elevation={0}
                                                    sx={{
                                                        borderRadius: '1rem',
                                                        border: '1px solid',
                                                        borderColor: 'divider',
                                                        p: { xs: 2, md: 3 }
                                                    }}
                                                >
                                                    <Box sx={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        mb: 3,
                                                        flexDirection: { xs: 'column', sm: 'row' },
                                                        gap: { xs: 2, sm: 0 }
                                                    }}>
                                                        <Typography
                                                            variant="h6"
                                                            sx={{ fontWeight: 700 }}
                                                            className="text-gray-800"
                                                        >
                                                            Acara Terjadwal
                                                        </Typography>
                                                        <Button
                                                            variant="contained"
                                                            startIcon={<Event />}
                                                            onClick={() => router.visit(route('manager.events.create', { application_id: application.id }))}
                                                            sx={{
                                                                borderRadius: '0.75rem',
                                                                py: 1.25,
                                                                px: 2,
                                                                fontWeight: 600,
                                                                boxShadow: '0 4px 14px 0 rgba(20, 184, 166, 0.25)',
                                                                '&:hover': {
                                                                    boxShadow: '0 6px 20px 0 rgba(20, 184, 166, 0.35)',
                                                                    transform: 'translateY(-2px)'
                                                                },
                                                                transition: 'all 0.3s ease'
                                                            }}
                                                            className="transition-all duration-300"
                                                        >
                                                            Jadwalkan Acara
                                                        </Button>
                                                    </Box>

                                                    {events && events.length > 0 ? (
                                                        <Stack spacing={2.5}>
                                                            {events.map((event, index) => (
                                                                <motion.div
                                                                    key={index}
                                                                    whileHover={{ y: -4 }}
                                                                    transition={{ duration: 0.2 }}
                                                                >
                                                                    <Paper
                                                                        elevation={0}
                                                                        sx={{
                                                                            p: 3,
                                                                            borderRadius: '0.75rem',
                                                                            border: '1px solid',
                                                                            borderColor: 'divider',
                                                                            transition: 'all 0.2s ease-in-out',
                                                                            '&:hover': {
                                                                                boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
                                                                            }
                                                                        }}
                                                                        className="transition-all duration-300"
                                                                    >
                                                                        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "flex-start" }} spacing={2}>
                                                                            <Stack direction="row" spacing={2} alignItems="flex-start">
                                                                                <Avatar
                                                                                    sx={{
                                                                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                                                        color: 'primary.main',
                                                                                        width: 48,
                                                                                        height: 48,
                                                                                        borderRadius: '0.75rem'
                                                                                    }}
                                                                                >
                                                                                    {event.type === 'interview' ? <Person /> : <Event />}
                                                                                </Avatar>
                                                                                <Box>
                                                                                    <Typography
                                                                                        variant="h6"
                                                                                        sx={{ fontWeight: 700 }}
                                                                                        className="text-gray-800"
                                                                                    >
                                                                                        {event.title}
                                                                                    </Typography>
                                                                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1.5 }}>{event.description}</Typography>
                                                                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="flex-start" sx={{ mt: 1 }}>
                                                                                        <Chip
                                                                                            icon={<CalendarMonth fontSize="small" />}
                                                                                            label={formatDate(event.start_time, 'short')}
                                                                                            size="small"
                                                                                            variant="outlined"
                                                                                            sx={{ borderRadius: '0.75rem' }}
                                                                                        />
                                                                                        <Chip
                                                                                            icon={<Timer fontSize="small" />}
                                                                                            label={`${new Date(event.start_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} -
                                        ${new Date(event.end_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`}
                                                                                            size="small"
                                                                                            variant="outlined"
                                                                                            sx={{ borderRadius: '0.75rem' }}
                                                                                        />
                                                                                    </Stack>
                                                                                    {event.location && (
                                                                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1.5 }}>
                                                                                            <LocationOn fontSize="small" sx={{ color: 'primary.main', mr: 0.5 }} />
                                                                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                                                                {event.location}
                                                                                            </Typography>
                                                                                        </Box>
                                                                                    )}
                                                                                    {event.meeting_link && (
                                                                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                                                            <Link
                                                                                                href={event.meeting_link}
                                                                                                target="_blank"
                                                                                                style={{
                                                                                                    display: 'inline-flex',
                                                                                                    alignItems: 'center',
                                                                                                    textDecoration: 'none',
                                                                                                    color: theme.palette.primary.main,
                                                                                                    fontWeight: 500
                                                                                                }}
                                                                                            >
                                                                                                <VideoCall fontSize="small" sx={{ mr: 0.5 }} />
                                                                                                Bergabung dengan Pertemuan
                                                                                            </Link>
                                                                                        </Box>
                                                                                    )}
                                                                                </Box>
                                                                            </Stack>
                                                                            <Chip
                                                                                label={event.status === 'scheduled' ? 'Terjadwal' :
                                                                                    event.status === 'completed' ? 'Selesai' :
                                                                                        event.status === 'cancelled' ? 'Dibatalkan' : event.status}
                                                                                size="small"
                                                                                color={
                                                                                    event.status === 'scheduled' ? 'primary' :
                                                                                        event.status === 'completed' ? 'success' :
                                                                                            event.status === 'cancelled' ? 'error' : 'default'
                                                                                }
                                                                                sx={{
                                                                                    fontWeight: 600,
                                                                                    borderRadius: '0.5rem',
                                                                                    height: 24
                                                                                }}
                                                                            />
                                                                        </Stack>
                                                                    </Paper>
                                                                </motion.div>
                                                            ))}
                                                        </Stack>
                                                    ) : (
                                                        <Box sx={{
                                                            p: 5,
                                                            textAlign: 'center',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            minHeight: '260px',
                                                            bgcolor: alpha(theme.palette.background.paper, 0.5),
                                                            borderRadius: '0.75rem',
                                                            border: '1px dashed',
                                                            borderColor: alpha(theme.palette.divider, 0.3)
                                                        }}>
                                                            <Box
                                                                sx={{
                                                                    width: 80,
                                                                    height: 80,
                                                                    borderRadius: '50%',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                                                    mb: 2
                                                                }}
                                                            >
                                                                <Event sx={{ fontSize: 40, color: 'primary.main' }} />
                                                            </Box>
                                                            <Typography
                                                                variant="h6"
                                                                sx={{ fontWeight: 700, mb: 1 }}
                                                                className="text-gray-800"
                                                            >
                                                                Tidak Ada Acara Terjadwal
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
                                                                Belum ada wawancara atau acara yang dijadwalkan untuk lamaran ini.
                                                            </Typography>
                                                            <Button
                                                                variant="outlined"
                                                                startIcon={<Event />}
                                                                onClick={() => router.visit(route('manager.events.create', { application_id: application.id }))}
                                                                sx={{
                                                                    borderRadius: '0.75rem',
                                                                    py: 1.25,
                                                                    fontWeight: 500,
                                                                    '&:hover': {
                                                                        borderColor: 'primary.main',
                                                                        backgroundColor: alpha(theme.palette.primary.main, 0.05)
                                                                    }
                                                                }}
                                                            >
                                                                Jadwalkan Acara Pertama
                                                            </Button>
                                                        </Box>
                                                    )}
                                                </Paper>
                                            </TabPanel>
                                        </AnimatePresence>
                                    </Box>
                                </Box>

                                {/* Right Sidebar */}
                                <Box sx={{
                                    flex: '0 0 auto',
                                    width: { xs: '100%', lg: '350px' }
                                }}>
                                    <Stack spacing={3}>
                                        {/* Candidate Profile Card */}
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                borderRadius: '1rem',
                                                border: '1px solid',
                                                borderColor: 'divider',
                                                overflow: 'hidden'
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                                                    py: 2,
                                                    px: 3,
                                                    borderBottom: '1px solid',
                                                    borderColor: 'divider',
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <Person fontSize="small" sx={{ color: 'primary.main', mr: 1 }} />
                                                <Typography
                                                    variant="h6"
                                                    sx={{ fontWeight: 700 }}
                                                    className="text-gray-800"
                                                >
                                                    Profil Kandidat
                                                </Typography>
                                            </Box>

                                            <Box sx={{ p: 3 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                                    <Avatar
                                                        src={application?.user?.avatar || '/images/avatars/default.png'}
                                                        sx={{
                                                            width: 64,
                                                            height: 64,
                                                            mr: 2,
                                                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                            border: '2px solid',
                                                            borderColor: 'primary.main',
                                                            borderRadius: '0.75rem'
                                                        }}
                                                    >
                                                        {application?.user?.name?.charAt(0) || '?'}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography
                                                            variant="h6"
                                                            sx={{ fontWeight: 700 }}
                                                            className="text-gray-800"
                                                        >
                                                            {application?.user?.name}
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: 0.5
                                                            }}
                                                        >
                                                            <Email fontSize="small" sx={{ color: 'primary.main', fontSize: 16 }} />
                                                            {application?.user?.email}
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                <List disablePadding sx={{
                                                    mb: 2,
                                                    '& .MuiListItem-root': {
                                                        px: 0
                                                    }
                                                }}>
                                                    {application?.user?.profile && (
                                                        <>
                                                            {application?.user?.profile.phone && (
                                                                <ListItem disablePadding sx={{ mb: 2 }}>
                                                                    <ListItemIcon sx={{
                                                                        minWidth: 36,
                                                                        color: 'primary.main'
                                                                    }}>
                                                                        <Phone fontSize="small" />
                                                                    </ListItemIcon>
                                                                    <ListItemText
                                                                        primary={application?.user?.profile.phone}
                                                                        primaryTypographyProps={{
                                                                            variant: 'body2',
                                                                            fontWeight: 500
                                                                        }}
                                                                    />
                                                                </ListItem>
                                                            )}

                                                            {application?.user?.profile.address && (
                                                                <ListItem disablePadding sx={{ mb: 2 }}>
                                                                    <ListItemIcon sx={{
                                                                        minWidth: 36,
                                                                        color: 'primary.main'
                                                                    }}>
                                                                        <LocationOn fontSize="small" />
                                                                    </ListItemIcon>
                                                                    <ListItemText
                                                                        primary={application?.user?.profile.address}
                                                                        primaryTypographyProps={{
                                                                            variant: 'body2',
                                                                            fontWeight: 500
                                                                        }}
                                                                    />
                                                                </ListItem>
                                                            )}

                                                            {application?.user?.profile.education && (
                                                                <ListItem disablePadding sx={{ mb: 2 }}>
                                                                    <ListItemIcon sx={{
                                                                        minWidth: 36,
                                                                        color: 'primary.main'
                                                                    }}>
                                                                        <School fontSize="small" />
                                                                    </ListItemIcon>
                                                                    <ListItemText
                                                                        primary="Pendidikan"
                                                                        secondary={application?.user?.profile.education}
                                                                        primaryTypographyProps={{
                                                                            variant: 'body2',
                                                                            fontWeight: 500,
                                                                            color: 'text.secondary',
                                                                            mb: 0.5
                                                                        }}
                                                                        secondaryTypographyProps={{
                                                                            variant: 'body2',
                                                                            fontWeight: 500,
                                                                            color: 'text.primary'
                                                                        }}
                                                                    />
                                                                </ListItem>
                                                            )}

                                                            {application?.user?.profile.skills && (
                                                                <ListItem disablePadding sx={{ mb: 2 }}>
                                                                    <ListItemIcon sx={{
                                                                        minWidth: 36,
                                                                        color: 'primary.main'
                                                                    }}>
                                                                        <BusinessCenter fontSize="small" />
                                                                    </ListItemIcon>
                                                                    <ListItemText
                                                                        primary="Keahlian"
                                                                        secondary={
                                                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                                                                                {application?.user?.profile.skills.split(',').map((skill, index) => (
                                                                                    <Chip
                                                                                        key={index}
                                                                                        label={skill.trim()}
                                                                                        size="small"
                                                                                        variant="outlined"
                                                                                        sx={{
                                                                                            borderRadius: '0.5rem',
                                                                                            fontSize: '0.75rem'
                                                                                        }}
                                                                                    />
                                                                                ))}
                                                                            </Box>
                                                                        }
                                                                        primaryTypographyProps={{
                                                                            variant: 'body2',
                                                                            fontWeight: 500,
                                                                            color: 'text.secondary'
                                                                        }}
                                                                    />
                                                                </ListItem>
                                                            )}

                                                            {application.user.profile.experience && (
                                                                <ListItem disablePadding sx={{ mb: 1.5 }}>
                                                                    <ListItemIcon sx={{
                                                                        minWidth: 36,
                                                                        color: 'primary.main'
                                                                    }}>
                                                                        <Work fontSize="small" />
                                                                    </ListItemIcon>
                                                                    <ListItemText
                                                                        primary="Pengalaman"
                                                                        secondary={application.user.profile.experience}
                                                                        primaryTypographyProps={{
                                                                            variant: 'body2',
                                                                            fontWeight: 500,
                                                                            color: 'text.secondary',
                                                                            mb: 0.5
                                                                        }}
                                                                        secondaryTypographyProps={{
                                                                            variant: 'body2',
                                                                            fontWeight: 500,
                                                                            color: 'text.primary'
                                                                        }}
                                                                    />
                                                                </ListItem>
                                                            )}
                                                        </>
                                                    )}
                                                </List>
                                            </Box>
                                        </Paper>

                                        {/* Job Details Card */}
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                borderRadius: '1rem',
                                                border: '1px solid',
                                                borderColor: 'divider',
                                                overflow: 'hidden'
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                                                    py: 2,
                                                    px: 3,
                                                    borderBottom: '1px solid',
                                                    borderColor: 'divider',
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <BusinessCenter fontSize="small" sx={{ color: 'primary.main', mr: 1 }} />
                                                <Typography
                                                    variant="h6"
                                                    sx={{ fontWeight: 700 }}
                                                    className="text-gray-800"
                                                >
                                                    Detail Lowongan
                                                </Typography>
                                            </Box>

                                            <Box sx={{ p: 3 }}>
                                                <Typography
                                                    variant="h6"
                                                    sx={{ fontWeight: 700, mb: 1 }}
                                                    className="text-gray-800"
                                                >
                                                    {application.job.title}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 0.5,
                                                        mb: 2
                                                    }}
                                                >
                                                    <BusinessCenter fontSize="small" sx={{ fontSize: 16 }} />
                                                    {application.job.company.name}
                                                    <Box component="span" sx={{ mx: 0.5 }}>•</Box>
                                                    <LocationOn fontSize="small" sx={{ fontSize: 16 }} />
                                                    {application.job.location}
                                                </Typography>

                                                <Box sx={{ mt: 2, mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                    <Chip
                                                        label={application.job.job_type === 'full_time' ? 'Full Time' :
                                                            application.job.job_type === 'part_time' ? 'Part Time' :
                                                                application.job.job_type === 'contract' ? 'Kontrak' :
                                                                    application.job.job_type === 'internship' ? 'Magang' :
                                                                        application.job.job_type === 'freelance' ? 'Freelance' :
                                                                            application.job.job_type}
                                                        size="small"
                                                        color="primary"
                                                        variant="outlined"
                                                        sx={{
                                                            borderRadius: '0.75rem',
                                                            fontWeight: 500
                                                        }}
                                                    />
                                                    {application.job.category && (
                                                        <Chip
                                                            label={application.job.category.name}
                                                            size="small"
                                                            color="primary"
                                                            variant="outlined"
                                                            sx={{
                                                                borderRadius: '0.75rem',
                                                                fontWeight: 500
                                                            }}
                                                        />
                                                    )}
                                                    {application.job.is_salary_visible && (
                                                        <Chip
                                                            label={`Rp${application.job.salary_min} - Rp${application.job.salary_max}`}
                                                            size="small"
                                                            color="success"
                                                            variant="outlined"
                                                            sx={{
                                                                borderRadius: '0.75rem',
                                                                fontWeight: 500
                                                            }}
                                                        />
                                                    )}
                                                </Box>

                                                <Divider sx={{ my: 2 }} />

                                                <Box sx={{ mb: 4 }}>
                                                    <Paper
                                                        elevation={0}
                                                        sx={{
                                                            p: 2,
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            gap: 2,
                                                            bgcolor: alpha(theme.palette.background.paper, 0.5),
                                                            borderRadius: '0.75rem',
                                                            border: '1px solid',
                                                            borderColor: alpha(theme.palette.divider, 0.2)
                                                        }}
                                                    >
                                                        <Stack direction="row" spacing={1.5} alignItems="flex-start">
                                                            <Box
                                                                sx={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                                    borderRadius: '0.75rem',
                                                                    p: 1,
                                                                    mr: 1,
                                                                    minWidth: 36,
                                                                    minHeight: 36
                                                                }}
                                                            >
                                                                <CalendarMonth sx={{ color: 'primary.main', fontSize: 20 }} />
                                                            </Box>
                                                            <Box>
                                                                <Typography variant="body2" color="text.secondary" fontWeight="500">Batas Pendaftaran</Typography>
                                                                <Typography variant="body2" fontWeight="600">
                                                                    {formatDate(application.job.submission_deadline, 'short')}
                                                                </Typography>
                                                            </Box>
                                                        </Stack>

                                                        <Stack direction="row" spacing={1.5} alignItems="flex-start">
                                                            <Box
                                                                sx={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                                    borderRadius: '0.75rem',
                                                                    p: 1,
                                                                    mr: 1,
                                                                    minWidth: 36,
                                                                    minHeight: 36
                                                                }}
                                                            >
                                                                <WorkOutline sx={{ color: 'primary.main', fontSize: 20 }} />
                                                            </Box>
                                                            <Box>
                                                                <Typography variant="body2" color="text.secondary" fontWeight="500">Lowongan</Typography>
                                                                <Typography variant="body2" fontWeight="600">
                                                                    {application.job.vacancies}
                                                                </Typography>
                                                            </Box>
                                                        </Stack>

                                                        <Stack direction="row" spacing={1.5} alignItems="flex-start">
                                                            <Box
                                                                sx={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                                    borderRadius: '0.75rem',
                                                                    p: 1,
                                                                    mr: 1,
                                                                    minWidth: 36,
                                                                    minHeight: 36
                                                                }}
                                                            >
                                                                <BusinessCenter sx={{ color: 'primary.main', fontSize: 20 }} />
                                                            </Box>
                                                            <Box>
                                                                <Typography variant="body2" color="text.secondary" fontWeight="500">Level Pengalaman</Typography>
                                                                <Typography variant="body2" fontWeight="600">
                                                                    {application.job.experience_level || 'Tidak ditentukan'}
                                                                </Typography>
                                                            </Box>
                                                        </Stack>
                                                    </Paper>
                                                </Box>

                                                <Box sx={{
                                                    mt: 3,
                                                    mb: 1
                                                }}>
                                                    <Button
                                                        fullWidth
                                                        variant="outlined"
                                                        startIcon={<BusinessCenter />}
                                                        onClick={() => router.visit(route('manager.jobs.show', application.job.id))}
                                                        sx={{
                                                            borderRadius: '0.75rem',
                                                            py: 1.25,
                                                            fontWeight: 600,
                                                            '&:hover': {
                                                                borderColor: 'primary.main',
                                                                backgroundColor: alpha(theme.palette.primary.main, 0.05)
                                                            },
                                                            transition: 'all 0.2s ease'
                                                        }}
                                                        className="transition-all duration-200"
                                                    >
                                                        Lihat Detail Lowongan
                                                    </Button>
                                                </Box>
                                            </Box>
                                        </Paper>

                                        {/* Quick Actions Card */}
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                borderRadius: '1rem',
                                                border: '1px solid',
                                                borderColor: 'divider',
                                                overflow: 'hidden'
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                                                    py: 2,
                                                    px: 3,
                                                    borderBottom: '1px solid',
                                                    borderColor: 'divider',
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <AccessTime fontSize="small" sx={{ color: 'primary.main', mr: 1 }} />
                                                <Typography
                                                    variant="h6"
                                                    sx={{ fontWeight: 700 }}
                                                    className="text-gray-800"
                                                >
                                                    Tindakan Cepat
                                                </Typography>
                                            </Box>

                                            <Box sx={{ p: 3 }}>
                                                <Stack spacing={2}>
                                                    <Button
                                                        variant="contained"
                                                        color="success"
                                                        startIcon={<CheckCircleIcon />}
                                                        fullWidth
                                                        onClick={() => setOpenStatusModal(true)}
                                                        sx={{
                                                            borderRadius: '0.75rem',
                                                            py: 1.25,
                                                            fontWeight: 600,
                                                            boxShadow: '0 4px 14px 0 rgba(76, 175, 80, 0.25)',
                                                            '&:hover': {
                                                                boxShadow: '0 6px 20px 0 rgba(76, 175, 80, 0.35)',
                                                                transform: 'translateY(-2px)'
                                                            },
                                                            transition: 'all 0.3s ease'
                                                        }}
                                                        className="transition-all duration-300"
                                                    >
                                                        Terima Lamaran
                                                    </Button>

                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        startIcon={<CancelIcon />}
                                                        fullWidth
                                                        onClick={() => setOpenRejectModal(true)}
                                                        sx={{
                                                            borderRadius: '0.75rem',
                                                            py: 1.25,
                                                            fontWeight: 600,
                                                            '&:hover': {
                                                                borderColor: 'error.main',
                                                                backgroundColor: alpha(theme.palette.error.main, 0.05)
                                                            },
                                                            transition: 'all 0.2s ease'
                                                        }}
                                                        className="transition-all duration-200"
                                                    >
                                                        Tolak Lamaran
                                                    </Button>

                                                    <Button
                                                        variant="outlined"
                                                        color="primary"
                                                        startIcon={<Event />}
                                                        fullWidth
                                                        onClick={() => router.visit(route('manager.events.create', { application_id: application.id }))}
                                                        sx={{
                                                            borderRadius: '0.75rem',
                                                            py: 1.25,
                                                            fontWeight: 600,
                                                            '&:hover': {
                                                                borderColor: 'primary.main',
                                                                backgroundColor: alpha(theme.palette.primary.main, 0.05)
                                                            },
                                                            transition: 'all 0.2s ease'
                                                        }}
                                                        className="transition-all duration-200"
                                                    >
                                                        Jadwalkan Wawancara
                                                    </Button>
                                                </Stack>
                                            </Box>
                                        </Paper>
                                    </Stack>
                                </Box>
                            </Box>

                            {/* Status Modal */}
                            <Modal
                                open={openStatusModal}
                                onClose={handleCloseStatusModal}
                                title="Ubah Status Lamaran"
                                confirmButton
                                cancelButton
                                onConfirm={handleStatusSubmit}
                                maxWidth="sm"
                                PaperProps={{
                                    sx: { borderRadius: '1rem' }
                                }}
                            >
                                <Box sx={{ p: 1 }}>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        Pilih status baru untuk lamaran ini. Status ini akan ditampilkan kepada kandidat di portal mereka.
                                    </Typography>
                                    <Select
                                        label="Status"
                                        value={selectedStatus}
                                        onChange={handleStatusChange}
                                        options={statuses.map(status => ({
                                            value: status.id,
                                            label: status.name
                                        }))}
                                        fullWidth
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '0.75rem'
                                            }
                                        }}
                                    />
                                </Box>
                            </Modal>

                            {/* Stage Modal */}
                            <Modal
                                open={openStageModal}
                                onClose={handleCloseStageModal}
                                title="Ubah Tahap Lamaran"
                                confirmButton
                                cancelButton
                                onConfirm={handleStageSubmit}
                                maxWidth="sm"
                                PaperProps={{
                                    sx: { borderRadius: '1rem' }
                                }}
                            >
                                <Box sx={{ p: 1 }}>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        Pilih tahap baru untuk lamaran ini. Perubahan tahap akan dicatat dalam linimasa lamaran.
                                    </Typography>
                                    <Stack spacing={2}>
                                        <Select
                                            label="Tahap"
                                            value={selectedStage}
                                            onChange={handleStageChange}
                                            options={stages.map(stage => ({
                                                value: stage.id,
                                                label: stage.name
                                            }))}
                                            fullWidth
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '0.75rem'
                                                }
                                            }}
                                        />
                                        <TextArea
                                            label="Catatan (opsional)"
                                            value={stageNotes}
                                            onChange={(e) => setStageNotes(e.target.value)}
                                            fullWidth
                                            multiline
                                            rows={4}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '0.75rem'
                                                }
                                            }}
                                            placeholder="Tambahkan catatan mengenai perubahan tahap ini..."
                                        />
                                    </Stack>
                                </Box>
                            </Modal>

                            {/* Notes Modal */}
                            <Modal
                                open={openNotesModal}
                                onClose={handleCloseNotesModal}
                                title="Tambah Catatan"
                                confirmButton
                                cancelButton
                                onConfirm={handleNotesSubmit}
                                maxWidth="sm"
                                PaperProps={{
                                    sx: { borderRadius: '1rem' }
                                }}
                            >
                                <Box sx={{ p: 1 }}>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        Tambahkan catatan untuk lamaran ini. Catatan ini hanya dapat dilihat oleh tim rekrutmen.
                                    </Typography>
                                    <TextArea
                                        label="Catatan"
                                        value={notes}
                                        onChange={handleNotesChange}
                                        fullWidth
                                        multiline
                                        rows={4}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '0.75rem'
                                            }
                                        }}
                                        placeholder="Masukkan catatan tentang kandidat ini..."
                                    />
                                </Box>
                            </Modal>

                            {/* Reject Modal */}
                            <Modal
                                open={openRejectModal}
                                onClose={() => setOpenRejectModal(false)}
                                title="Tolak Lamaran"
                                confirmButton
                                confirmText="Tolak Lamaran"
                                confirmColor="error"
                                cancelButton
                                onConfirm={rejectApplication}
                                maxWidth="sm"
                                PaperProps={{
                                    sx: { borderRadius: '1rem' }
                                }}
                            >
                                <Box sx={{ p: 1 }}>
                                    <Typography variant="body2" paragraph>
                                        Apakah Anda yakin ingin menolak lamaran ini? Ini akan memindahkan lamaran ke status "Ditolak".
                                    </Typography>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 2,
                                            mb: 3,
                                            borderRadius: '0.75rem',
                                            bgcolor: alpha(theme.palette.error.main, 0.05),
                                            border: '1px solid',
                                            borderColor: alpha(theme.palette.error.main, 0.2)
                                        }}
                                    >
                                        <Typography variant="body2" fontWeight="medium" color="error.main" gutterBottom>
                                            Peringatan: Tindakan ini tidak dapat dibatalkan.
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Kandidat akan menerima notifikasi bahwa lamaran mereka telah ditolak.
                                        </Typography>
                                    </Paper>
                                    <TextArea
                                        rows={4}
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        placeholder="Alasan penolakan (opsional)"
                                        fullWidth
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '0.75rem'
                                            }
                                        }}
                                    />
                                </Box>
                            </Modal>
                        </Box>
                    </Box>
                </motion.div>
            </Container>
        </Layout>
    );
};

export default Show;
