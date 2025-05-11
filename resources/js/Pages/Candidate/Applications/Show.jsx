import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    Container,
    Typography,
    Box,
    Divider,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    Avatar,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Breadcrumbs,
    Paper,
    Chip,
    Tooltip,
    IconButton,
    useTheme,
    useMediaQuery,
    Modal,
    Fade,
    Backdrop,
    MenuItem,
    Menu
} from '@mui/material';
import {
    Work as WorkIcon,
    Business as BusinessIcon,
    LocationOn as LocationIcon,
    AccessTime as TimeIcon,
    ArrowBack as ArrowBackIcon,
    EventNote as EventNoteIcon,
    NavigateNext as NavigateNextIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Description as DescriptionIcon,
    CalendarToday as CalendarTodayIcon,
    Info as InfoIcon,
    Assignment as AssignmentIcon,
    Timeline as TimelineIcon,
    AccountCircle as AccountCircleIcon,
    School as SchoolIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    AttachFile as AttachFileIcon,
    CloudDownload as CloudDownloadIcon,
    Visibility as VisibilityIcon,
    Close as CloseIcon,
    MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { format, formatDistance } from 'date-fns';
import { id } from 'date-fns/locale';
import Layout from "@/Components/Layout/Layout.jsx";
import Button from "@/Components/Shared/Button";
import Badge from "@/Components/Shared/Badge";
import Alert from "@/Components/Shared/Alert";
import CandidateLayout from '@/Layouts/CandidateLayout';
import Card from '@/Components/Shared/Card';

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
                                    <CloudDownloadIcon fontSize="small" color="primary" />
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

// Styled Card component
const StyledCard = ({ children, elevation = 0, sx = {} }) => (
    <Paper
        elevation={elevation}
        sx={{
            borderRadius: '1rem',
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
            p: 3,
            mb: 3,
            transition: 'all 0.3s ease',
            '&:hover': {
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            },
            ...sx
        }}
    >
        {children}
    </Paper>
);

export default function ApplicationShow({ application }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [openResumeModal, setOpenResumeModal] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    // Format date
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return format(date, 'd MMMM yyyy', { locale: id });
        } catch (e) {
            return dateString;
        }
    };

    // Format date with time
    const formatDateTime = (dateString) => {
        try {
            const date = new Date(dateString);
            return format(date, 'd MMMM yyyy, HH:mm', { locale: id });
        } catch (e) {
            return dateString;
        }
    };

    // Format relative time
    const formatRelativeTime = (dateString) => {
        try {
            const date = new Date(dateString);
            return formatDistance(date, new Date(), {
                addSuffix: true,
                locale: id
            });
        } catch (e) {
            return '';
        }
    };

    // Get status color
    const getStatusColor = (status) => {
        const statusMap = {
            'pending': theme.palette.warning.main,
            'reviewing': theme.palette.info.main,
            'interview': theme.palette.primary.main,
            'offered': theme.palette.success.main,
            'hired': theme.palette.success.dark,
            'rejected': theme.palette.error.main,
            'withdrawn': theme.palette.error.light,
            'disqualified': theme.palette.error.dark
        };

        return statusMap[status.slug] || theme.palette.grey[500];
    };

    return (
        <Layout>
            <Head title={`Lamaran untuk ${application.job.title}`} />

            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Breadcrumbs */}
                <Breadcrumbs
                    separator={<NavigateNextIcon fontSize="small" />}
                    aria-label="breadcrumb"
                    sx={{ mb: 3 }}
                >
                    <Link href={route('candidate.dashboard')} className="text-gray-600 no-underline">
                        Dashboard
                    </Link>
                    <Link href={route('candidate.applications.index')} className="text-gray-600 no-underline">
                        Lamaran Saya
                    </Link>
                    <Typography color="text.primary">Detail Lamaran</Typography>
                </Breadcrumbs>

                {/* Header Section */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    mb: 4
                }}>
                    <Typography variant="h4" component="h1" fontWeight="bold">
                        Detail Lamaran
                    </Typography>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        component={Link}
                        href={route('candidate.applications.index')}
                    >
                        Kembali ke Daftar Lamaran
                    </Button>
                </Box>

                {/* Using Box instead of Grid */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                    {/* Main Content */}
                    <Box sx={{ flex: 2, minWidth: 0 }}>
                        {/* Job Details */}
                        <StyledCard elevation={1}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                alignItems: { xs: 'center', sm: 'flex-start' },
                                textAlign: { xs: 'center', sm: 'left' }
                            }}>
                                <Avatar
                                    src={application.job.company.logo}
                                    alt={application.job.company.name}
                                    variant="rounded"
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        mb: { xs: 2, sm: 0 },
                                        mr: { sm: 3 },
                                        bgcolor: 'primary.main',
                                    }}
                                >
                                    {application.job.company.name.charAt(0)}
                                </Avatar>

                                <Box sx={{ flex: 1 }}>
                                    <Chip
                                        label={application.status.name}
                                        size="small"
                                        sx={{
                                            mb: 1,
                                            fontWeight: 'medium',
                                            backgroundColor: `${getStatusColor(application.status)}20`,
                                            color: getStatusColor(application.status),
                                            borderRadius: '0.5rem'
                                        }}
                                    />

                                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                                        {application.job.title}
                                    </Typography>

                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <BusinessIcon fontSize="small" sx={{ mr: 1, opacity: 0.7 }} color="primary" />
                                        <Typography variant="body1">
                                            {application.job.company.name}
                                        </Typography>
                                    </Box>

                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: { xs: 'column', sm: 'row' },
                                        alignItems: { xs: 'flex-start', sm: 'center' },
                                        gap: 2,
                                        mt: 2
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <CalendarTodayIcon fontSize="small" sx={{ mr: 1, opacity: 0.7 }} color="primary" />
                                            <Typography variant="body2" color="text.secondary">
                                                Dilamar pada {formatDate(application.created_at)}
                                            </Typography>
                                        </Box>

                                        {application.current_stage && (
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <TimelineIcon fontSize="small" sx={{ mr: 1, opacity: 0.7 }} color="primary" />
                                                <Typography variant="body2" color="text.secondary">
                                                    Tahap: {application.current_stage.name}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                </Box>
                            </Box>
                        </StyledCard>

                        {/* Timeline Status */}
                        {application.stage_history && application.stage_history.length > 0 && (
                            <StyledCard elevation={1}>
                                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                                    <TimelineIcon sx={{ mr: 1 }} color="primary" />
                                    Status Perjalanan Lamaran
                                </Typography>

                                <Stepper orientation="vertical" activeStep={application.stage_history.length}>
                                    {application.stage_history.map((history, index) => (
                                        <Step key={history.id} completed={true}>
                                            <StepLabel>
                                                <Typography variant="subtitle1" fontWeight="bold">
                                                    {history.stage.name}
                                                </Typography>
                                            </StepLabel>
                                            <StepContent>
                                                <Box sx={{ mb: 2 }}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {history.date && (
                                                            <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                                                {formatDate(history.date)}
                                                            </Typography>
                                                        )}
                                                        {history.notes || 'Tahap diperbarui'}
                                                    </Typography>
                                                </Box>
                                            </StepContent>
                                        </Step>
                                    ))}
                                </Stepper>
                            </StyledCard>
                        )}

                        {/* Cover Letter */}
                        {application.cover_letter && (
                            <StyledCard elevation={1}>
                                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                                    <DescriptionIcon sx={{ mr: 1 }} color="primary" />
                                    Surat Lamaran
                                </Typography>

                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 2,
                                        backgroundColor: 'background.paper',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        borderRadius: '0.5rem'
                                    }}
                                >
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            whiteSpace: 'pre-line',
                                            lineHeight: 1.8
                                        }}
                                    >
                                        {application.cover_letter}
                                    </Typography>
                                </Paper>
                            </StyledCard>
                        )}

                        {/* Form Responses */}
                        {application.form_responses && application.form_responses.length > 0 && (
                            <StyledCard elevation={1}>
                                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                                    <AssignmentIcon sx={{ mr: 1 }} color="primary" />
                                    Tanggapan Tambahan
                                </Typography>

                                {application.form_responses.map((section) => (
                                    <Box key={section.id} sx={{ mb: 3 }}>
                                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                                            {section.name}
                                        </Typography>

                                        <List disablePadding>
                                            {section.responses.map((response) => (
                                                <ListItem
                                                    key={response.id}
                                                    disablePadding
                                                    disableGutters
                                                    sx={{ mb: 2 }}
                                                >
                                                    <ListItemText
                                                        primary={response.field.name}
                                                        secondary={
                                                            response.field.field_type === 'checkbox' ?
                                                                (JSON.parse(response.value).join(', ')) :
                                                                response.value
                                                        }
                                                        primaryTypographyProps={{
                                                            variant: 'body2',
                                                            color: 'text.secondary',
                                                            fontWeight: 'medium'
                                                        }}
                                                        secondaryTypographyProps={{
                                                            variant: 'body1',
                                                            color: 'text.primary'
                                                        }}
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>

                                        {application.form_responses.indexOf(section) < application.form_responses.length - 1 && (
                                            <Divider sx={{ my: 2 }} />
                                        )}
                                    </Box>
                                ))}
                            </StyledCard>
                        )}

                        {/* Events/Interviews */}
                        {application.events && application.events.length > 0 && (
                            <StyledCard elevation={1}>
                                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                                    <EventNoteIcon sx={{ mr: 1 }} color="primary" />
                                    Jadwal Interview/Event
                                </Typography>

                                <List disablePadding>
                                    {application.events.map((event) => (
                                        <ListItem
                                            key={event.id}
                                            disableGutters
                                            sx={{
                                                py: 1,
                                                borderBottom: '1px solid',
                                                borderColor: 'divider',
                                                '&:last-child': { borderBottom: 'none' }
                                            }}
                                        >
                                            <ListItemIcon>
                                                <CalendarTodayIcon color="primary" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={event.title}
                                                secondary={
                                                    <Box component="span">
                                                        <Typography component="span" variant="body2" color="text.secondary">
                                                            {event.type} • {formatDateTime(event.start_time)}
                                                        </Typography>
                                                        {event.location && (
                                                            <Typography component="span" variant="body2" color="text.secondary" display="block">
                                                                <LocationIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                                                                {event.location}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                }
                                            />
                                            {event.status && (
                                                <Chip
                                                    label={event.status}
                                                    size="small"
                                                    color={event.status === 'completed' ? 'success' : 'primary'}
                                                    sx={{ ml: 2 }}
                                                />
                                            )}
                                        </ListItem>
                                    ))}
                                </List>
                            </StyledCard>
                        )}
                    </Box>

                    {/* Sidebar */}
                    <Box sx={{ flex: 1, minWidth: { md: 300 } }}>
                        {/* Application Summary */}
                        <StyledCard elevation={1}>
                            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                                <InfoIcon sx={{ mr: 1 }} color="primary" />
                                Ringkasan Lamaran
                            </Typography>

                            <List>
                                <ListItem disableGutters sx={{ mb: 2, px: 0 }}>
                                    <ListItemIcon sx={{ minWidth: 30 }}>
                                        <AssignmentIcon fontSize="small" color="primary" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="ID Lamaran"
                                        secondary={`#${application.id}`}
                                        primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                                        secondaryTypographyProps={{ variant: 'body1', fontWeight: 'medium' }}
                                    />
                                </ListItem>

                                <ListItem disableGutters sx={{ mb: 2, px: 0 }}>
                                    <ListItemIcon sx={{ minWidth: 30 }}>
                                        <CalendarTodayIcon fontSize="small" color="primary" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Tanggal Lamaran"
                                        secondary={formatDate(application.created_at)}
                                        primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                                        secondaryTypographyProps={{ variant: 'body1', fontWeight: 'medium' }}
                                    />
                                </ListItem>

                                <ListItem disableGutters sx={{ mb: 2, px: 0 }}>
                                    <ListItemIcon sx={{ minWidth: 30 }}>
                                        <TimelineIcon fontSize="small" color="primary" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Status Lamaran"
                                        secondary={
                                            <Chip
                                                label={application.status.name}
                                                size="small"
                                                sx={{
                                                    mt: 0.5,
                                                    fontWeight: 'medium',
                                                    backgroundColor: `${getStatusColor(application.status)}20`,
                                                    color: getStatusColor(application.status),
                                                }}
                                            />
                                        }
                                        primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                                    />
                                </ListItem>

                                {application.current_stage && (
                                    <ListItem disableGutters sx={{ mb: 2, px: 0 }}>
                                        <ListItemIcon sx={{ minWidth: 30 }}>
                                            <InfoIcon fontSize="small" color="primary" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Tahap Sekarang"
                                            secondary={application.current_stage.name}
                                            primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                                            secondaryTypographyProps={{ variant: 'body1', fontWeight: 'medium' }}
                                        />
                                    </ListItem>
                                )}
                            </List>
                        </StyledCard>

                        {/* Resume Section */}
                        {application.resume && (
                            <StyledCard elevation={1}>
                                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                                    <DescriptionIcon sx={{ mr: 1 }} color="primary" />
                                    Resume
                                </Typography>

                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        border: '1px dashed',
                                        borderColor: 'primary.200',
                                        borderRadius: '0.75rem',
                                        backgroundColor: 'primary.50',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <AttachFileIcon color="primary" sx={{ mr: 2, transform: 'rotate(45deg)' }} />
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Resume
                                            </Typography>
                                            <Typography variant="body1" fontWeight="medium">
                                                {application.resume.split('/').pop()}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box>
                                        <Tooltip title="Lihat Resume">
                                            <IconButton
                                                color="primary"
                                                onClick={() => setOpenResumeModal(true)}
                                                sx={{ mr: 1 }}
                                            >
                                                <VisibilityIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Download Resume">
                                            <IconButton
                                                component="a"
                                                href={application.resume}
                                                download
                                                color="primary"
                                            >
                                                <CloudDownloadIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </Paper>
                            </StyledCard>
                        )}

                        {/* Action Buttons */}
                        <StyledCard elevation={1}>
                            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                                <InfoIcon sx={{ mr: 1 }} color="primary" />
                                Tindakan
                            </Typography>

                            <Button
                                component={Link}
                                href={route('candidate.jobs.show', application.job.id)}
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{ mb: 2 }}
                            >
                                Lihat Detail Pekerjaan
                            </Button>

                            {application.status.slug === 'rejected' && (
                                <Alert
                                    severity="error"
                                    sx={{ mt: 2 }}
                                >
                                    <Typography variant="body2" fontWeight="bold">Lamaran Ditolak</Typography>
                                    Kami mohon maaf, lamaran Anda tidak dapat dilanjutkan. Silakan cari peluang lain yang sesuai dengan kualifikasi Anda.
                                </Alert>
                            )}

                            {application.status.slug === 'hired' && (
                                <Alert
                                    severity="success"
                                    sx={{ mt: 2 }}
                                >
                                    <Typography variant="body2" fontWeight="bold">Selamat!</Typography>
                                    Anda telah diterima untuk posisi ini. Perusahaan akan menghubungi Anda untuk informasi selanjutnya.
                                </Alert>
                            )}
                        </StyledCard>
                    </Box>
                </Box>
            </Container>

            {/* Resume Preview Modal */}
            {application.resume && (
                <ResumePreviewModal
                    open={openResumeModal}
                    handleClose={() => setOpenResumeModal(false)}
                    resumeUrl={application.resume}
                />
            )}
        </Layout>
    );
}
