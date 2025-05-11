import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Link, Head } from '@inertiajs/react';
import {
    Box,
    Typography,
    IconButton,
    FormControlLabel,
    Switch,
    Divider,
    Chip,
    Paper,
    alpha,
    Stack,
    Container
} from '@mui/material';
import {
    KeyboardArrowLeft,
    Event,
    LocationOn,
    VideoCall,
    Person,
    BusinessCenter,
    Add,
    CalendarMonth,
    Info as InfoIcon,
    CheckCircle as CheckCircleIcon,
    Description as DescriptionIcon,
    TitleOutlined as TitleIcon,
    CategoryOutlined as CategoryIcon,
    WorkOutline as WorkIcon,
    AccessTimeOutlined as TimeIcon
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';

// Custom Components
import Card from '@/Components/Shared/Card';
import Button from '@/Components/Shared/Button';
import Input from '@/Components/Shared/Input';
import TextArea from '@/Components/Shared/TextArea';
import Select from '@/Components/Shared/Select';
import FormGroup from '@/Components/Shared/FormGroup';
import Layout from '@/Components/Layout/Layout';
import SweetAlert from '@/Components/Shared/SweetAlert';

// Candidate Info Card Component
const CandidateInfoCard = ({ application }) => {
    return (
        <>
            <Divider sx={{ my: 3 }} />
            <Typography variant="subtitle2" fontWeight="600" color="primary.main" gutterBottom>
                Kandidat Terpilih
            </Typography>
            <Paper
                elevation={0}
                sx={{
                    p: 2.5,
                    borderRadius: '1rem',
                    bgcolor: theme => alpha(theme.palette.primary.main, 0.05),
                    border: '1px solid',
                    borderColor: theme => alpha(theme.palette.primary.main, 0.1),
                }}
            >
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <Person fontSize="small" color="primary" />
                    <Typography variant="body2" fontWeight="500">
                        {application.user.name}
                    </Typography>
                </Stack>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                    {application.user.email}
                </Typography>

                <Divider sx={{ my: 1.5 }} />

                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <BusinessCenter fontSize="small" color="primary" />
                    <Typography variant="body2" fontWeight="500">
                        {application.job.title}
                    </Typography>
                </Stack>
                <Typography variant="caption" color="text.secondary" display="block">
                    Melamar pada {new Date(application.created_at).toLocaleDateString()}
                </Typography>
            </Paper>
        </>
    );
};

// Job Info Card Component
const JobInfoCard = ({ jobId, jobs }) => {
    const selectedJob = jobs?.find(job => job.id.toString() === jobId?.toString());

    if (!selectedJob) return null;

    return (
        <>
            <Divider sx={{ my: 3 }} />
            <Typography variant="subtitle2" fontWeight="600" color="primary.main" gutterBottom>
                Lowongan Terpilih
            </Typography>
            <Paper
                elevation={0}
                sx={{
                    p: 2.5,
                    borderRadius: '1rem',
                    bgcolor: theme => alpha(theme.palette.info.main, 0.05),
                    border: '1px solid',
                    borderColor: theme => alpha(theme.palette.info.main, 0.1),
                }}
            >
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <BusinessCenter fontSize="small" color="info" />
                    <Typography variant="body2" fontWeight="500">
                        {selectedJob.title}
                    </Typography>
                </Stack>
                <Typography variant="caption" color="text.secondary" display="block">
                    {selectedJob.company_name}
                </Typography>
            </Paper>
        </>
    );
};

// Tips Card Component
const TipsCard = () => {
    return (
        <>
            <Divider sx={{ my: 3 }} />
            <Typography variant="subtitle2" fontWeight="600" color="primary.main" gutterBottom>
                Tips
            </Typography>
            <Paper
                elevation={0}
                sx={{
                    p: 2.5,
                    borderRadius: '1rem',
                    bgcolor: theme => alpha(theme.palette.warning.main, 0.05),
                    border: '1px solid',
                    borderColor: theme => alpha(theme.palette.warning.main, 0.1),
                }}
            >
                <Typography variant="body2" paragraph sx={{ mb: 1, display: 'flex', alignItems: 'flex-start' }}>
                    <InfoIcon fontSize="small" sx={{ mr: 1, color: 'warning.main', mt: 0.5 }} />
                    <strong>Pertemuan Virtual:</strong> Pastikan tautan meeting berfungsi dan semua peserta memiliki akses.
                </Typography>
                <Typography variant="body2" paragraph sx={{ mb: 1, display: 'flex', alignItems: 'flex-start' }}>
                    <InfoIcon fontSize="small" sx={{ mr: 1, color: 'warning.main', mt: 0.5 }} />
                    <strong>Pertemuan Tatap Muka:</strong> Tentukan lokasi yang jelas dan mudah diakses untuk semua peserta.
                </Typography>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <InfoIcon fontSize="small" sx={{ mr: 1, color: 'warning.main', mt: 0.5 }} />
                    <strong>Jangan Lupa:</strong> Semua peserta akan menerima notifikasi email otomatis.
                </Typography>
            </Paper>
        </>
    );
};

const EventCreate = ({ application = null, job = null, jobs = [], typeOptions = [] }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'interview',
        start_time: null,
        end_time: null,
        job_application_id: application?.id || '',
        job_id: job?.id || application?.job?.id || '',
        location: '',
        meeting_link: '',
        attendees: []
    });
    const [isVirtual, setIsVirtual] = useState(false);
    const [attendeeInput, setAttendeeInput] = useState('');
    const [selectedApplication, setSelectedApplication] = useState(application || null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // SweetAlert state
    const [sweetAlert, setSweetAlert] = useState({
        show: false,
        title: '',
        text: '',
        icon: '',
        confirmButtonText: '',
        showCancelButton: false,
        cancelButtonText: '',
        onConfirm: null
    });

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle toggling between physical and virtual meeting
    const handleLocationTypeChange = (e) => {
        setIsVirtual(e.target.checked);
        if (e.target.checked) {
            setFormData(prev => ({ ...prev, location: '' }));
        } else {
            setFormData(prev => ({ ...prev, meeting_link: '' }));
        }
    };

    // Handle adding an attendee
    const handleAddAttendee = () => {
        if (attendeeInput.trim() && !formData.attendees.includes(attendeeInput.trim())) {
            setFormData(prev => ({
                ...prev,
                attendees: [...prev.attendees, attendeeInput.trim()]
            }));
            setAttendeeInput('');
        }
    };

    // Handle removing an attendee
    const handleRemoveAttendee = (attendee) => {
        setFormData(prev => ({
            ...prev,
            attendees: prev.attendees.filter(a => a !== attendee)
        }));
    };

    // Form validation
    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Judul acara wajib diisi';
        }

        if (!formData.type) {
            newErrors.type = 'Tipe acara wajib diisi';
        }

        if (!formData.job_id) {
            newErrors.job_id = 'Lowongan terkait wajib diisi';
        }

        if (!formData.start_time) {
            newErrors.start_time = 'Waktu mulai wajib diisi';
        }

        if (!formData.end_time) {
            newErrors.end_time = 'Waktu selesai wajib diisi';
        } else if (formData.start_time && formData.end_time <= formData.start_time) {
            newErrors.end_time = 'Waktu selesai harus setelah waktu mulai';
        }

        if (isVirtual && !formData.meeting_link.trim()) {
            newErrors.meeting_link = 'Tautan meeting wajib diisi untuk acara virtual';
        }

        if (!isVirtual && !formData.location.trim()) {
            newErrors.location = 'Lokasi wajib diisi untuk acara tatap muka';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Submit form with confirmation using SweetAlert
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            // Show error SweetAlert for form validation errors
            setSweetAlert({
                show: true,
                title: 'Kesalahan Validasi Form',
                text: 'Mohon periksa formulir untuk kesalahan dan coba lagi.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        // Show confirmation dialog
        setSweetAlert({
            show: true,
            title: 'Konfirmasi Jadwal Acara',
            text: 'Apakah Anda yakin ingin menjadwalkan acara ini? Notifikasi akan dikirim ke semua peserta.',
            icon: 'question',
            confirmButtonText: 'Ya, Jadwalkan',
            showCancelButton: true,
            cancelButtonText: 'Batal',
            onConfirm: submitEvent
        });
    };

    // Function to actually submit the event after confirmation
    const submitEvent = () => {
        setLoading(true);

        // Format datetime values to ISO string
        const processedData = {
            ...formData,
            start_time: formData.start_time ? formData.start_time.toISOString() : null,
            end_time: formData.end_time ? formData.end_time.toISOString() : null,
            attendees: JSON.stringify(formData.attendees),
        };

        router.post(route('manager.events.store'), processedData, {
            onSuccess: () => {
                setLoading(false);

                // Show success SweetAlert
                setSweetAlert({
                    show: true,
                    title: 'Berhasil!',
                    text: 'Acara telah berhasil dijadwalkan. Notifikasi telah dikirim ke peserta.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    onConfirm: () => {
                        window.location.href = route('manager.events.index');
                    }
                });
            },
            onError: (errors) => {
                setErrors(errors);
                setLoading(false);

                // Show error SweetAlert
                setSweetAlert({
                    show: true,
                    title: 'Error!',
                    text: 'Terjadi masalah saat menjadwalkan acara. Mohon periksa formulir dan coba lagi.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            },
        });
    };

    // Handle key press in attendee input field
    const handleAttendeeKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddAttendee();
        }
    };

    return (
        <Layout>
            <Head title="Jadwal Acara Baru" />

            {/* SweetAlert */}
            {sweetAlert.show && (
                <SweetAlert
                    title={sweetAlert.title}
                    text={sweetAlert.text}
                    icon={sweetAlert.icon}
                    showConfirmButton={true}
                    confirmButtonText={sweetAlert.confirmButtonText}
                    showCancelButton={sweetAlert.showCancelButton}
                    cancelButtonText={sweetAlert.cancelButtonText}
                    onConfirm={() => {
                        if (sweetAlert.onConfirm) {
                            sweetAlert.onConfirm();
                        }
                        setSweetAlert({ ...sweetAlert, show: false });
                    }}
                    onCancel={() => setSweetAlert({ ...sweetAlert, show: false })}
                    onClose={() => setSweetAlert({ ...sweetAlert, show: false })}
                />
            )}

            <Container maxWidth="xl" sx={{ py: 4 }}>
                {/* Header Section */}
                <Box
                    sx={{
                        background: 'linear-gradient(135deg, rgba(15, 118, 110, 0.08) 0%, rgba(20, 184, 166, 0.15) 100%)',
                        py: 4,
                        borderRadius: '1rem',
                        px: 4,
                        mb: 4,
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                        border: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <IconButton
                                component={Link}
                                href={route('manager.events.index')}
                                sx={{
                                    bgcolor: 'background.paper',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                    '&:hover': { bgcolor: 'background.paper', opacity: 0.9 }
                                }}
                            >
                                <KeyboardArrowLeft />
                            </IconButton>
                            <Box>
                                <Typography variant="h5" fontWeight="600">
                                    Jadwal Acara Baru
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Buat acara atau wawancara baru untuk pelamar kerja
                                </Typography>
                            </Box>
                        </Stack>

                        <Chip
                            icon={<CalendarMonth fontSize="small" />}
                            label={new Date().toLocaleDateString()}
                            color="primary"
                            sx={{ borderRadius: '0.75rem', fontWeight: 500, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                        />
                    </Stack>
                </Box>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                        {/* Main Form Section */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: { xs: '100%', md: '70%' } }}>
                            {/* Event Details Card */}
                            <Paper
                                elevation={0}
                                variant="outlined"
                                sx={{
                                    borderRadius: '1rem',
                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
                                    overflow: 'hidden'
                                }}
                            >
                                {/* Card Header */}
                                <Box
                                    sx={{
                                        p: 3,
                                        backgroundColor: theme => alpha(theme.palette.primary.main, 0.04),
                                        borderBottom: '1px solid',
                                        borderColor: 'divider',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1.5
                                    }}
                                >
                                    <Event color="primary" />
                                    <Typography variant="h6" fontWeight="600">
                                        Detail Acara
                                    </Typography>
                                </Box>

                                {/* Card Content */}
                                <Box sx={{ p: 3 }}>
                                    <Box sx={{ mb: 3 }}>
                                        <FormGroup
                                            label="Judul Acara"
                                            required
                                            error={errors.title}
                                        >
                                            <Input
                                                name="title"
                                                value={formData.title}
                                                onChange={handleChange}
                                                placeholder="Masukkan judul acara"
                                                required
                                                fullWidth
                                                error={!!errors.title}
                                                helperText={errors.title}
                                                sx={{ borderRadius: '0.75rem' }}
                                                startAdornment={<TitleIcon color="primary" sx={{ mr: 1 }} />}
                                            />
                                        </FormGroup>
                                    </Box>

                                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, mb: 3 }}>
                                        <Box sx={{ flex: 1 }}>
                                            <FormGroup
                                                label="Tipe Acara"
                                                required
                                                error={errors.type}
                                            >
                                                <Select
                                                    name="type"
                                                    value={formData.type}
                                                    onChange={handleChange}
                                                    fullWidth
                                                    error={!!errors.type}
                                                    helperText={errors.type}
                                                    options={typeOptions && typeOptions.length > 0 ? typeOptions : [
                                                        { value: 'interview', label: 'Wawancara' },
                                                        { value: 'test', label: 'Tes Teknis' },
                                                        { value: 'meeting', label: 'Rapat' },
                                                        { value: 'other', label: 'Lainnya' }
                                                    ]}
                                                    sx={{ borderRadius: '0.75rem' }}
                                                    startAdornment={<CategoryIcon color="primary" sx={{ mr: 1 }} />}
                                                />
                                            </FormGroup>
                                        </Box>

                                        <Box sx={{ flex: 1 }}>
                                            <FormGroup
                                                label="Lowongan Terkait"
                                                required
                                                error={errors.job_id}
                                            >
                                                <Select
                                                    name="job_id"
                                                    value={formData.job_id}
                                                    onChange={handleChange}
                                                    placeholder="Pilih lowongan"
                                                    fullWidth
                                                    error={!!errors.job_id}
                                                    helperText={errors.job_id}
                                                    options={jobs && jobs.length > 0 ? jobs.map(job => ({
                                                        value: job.id,
                                                        label: `${job.title} - ${job.company_name}`
                                                    })) : []}
                                                    sx={{ borderRadius: '0.75rem' }}
                                                    disabled={!!formData.job_application_id} // Disable if application is selected
                                                    startAdornment={<WorkIcon color="primary" sx={{ mr: 1 }} />}
                                                />
                                            </FormGroup>
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, mb: 3 }}>
                                        <Box sx={{ flex: 1 }}>
                                            <FormGroup
                                                label="Waktu Mulai"
                                                required
                                                error={errors.start_time}
                                            >
                                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                    <DateTimePicker
                                                        value={formData.start_time}
                                                        onChange={(date) => setFormData(prev => ({ ...prev, start_time: date }))}
                                                        slotProps={{
                                                            textField: {
                                                                fullWidth: true,
                                                                error: !!errors.start_time,
                                                                helperText: errors.start_time,
                                                                sx: { borderRadius: '0.75rem' },
                                                                InputProps: {
                                                                    startAdornment: (
                                                                        <TimeIcon color="primary" sx={{ mr: 1 }} />
                                                                    )
                                                                }
                                                            }
                                                        }}
                                                    />
                                                </LocalizationProvider>
                                            </FormGroup>
                                        </Box>

                                        <Box sx={{ flex: 1 }}>
                                            <FormGroup
                                                label="Waktu Selesai"
                                                required
                                                error={errors.end_time}
                                            >
                                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                    <DateTimePicker
                                                        value={formData.end_time}
                                                        onChange={(date) => setFormData(prev => ({ ...prev, end_time: date }))}
                                                        minDateTime={formData.start_time}
                                                        slotProps={{
                                                            textField: {
                                                                fullWidth: true,
                                                                error: !!errors.end_time,
                                                                helperText: errors.end_time,
                                                                sx: { borderRadius: '0.75rem' },
                                                                InputProps: {
                                                                    startAdornment: (
                                                                        <TimeIcon color="primary" sx={{ mr: 1 }} />
                                                                    )
                                                                }
                                                            }
                                                        }}
                                                    />
                                                </LocalizationProvider>
                                            </FormGroup>
                                        </Box>
                                    </Box>

                                    <Box sx={{ mb: 2 }}>
                                        <FormGroup
                                            label="Deskripsi Acara"
                                            error={errors.description}
                                        >
                                            <TextArea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleChange}
                                                placeholder="Masukkan deskripsi acara"
                                                rows={4}
                                                fullWidth
                                                error={!!errors.description}
                                                helperText={errors.description}
                                                sx={{ borderRadius: '0.75rem' }}
                                                startAdornment={<DescriptionIcon color="primary" sx={{ mr: 1 }} />}
                                            />
                                        </FormGroup>
                                    </Box>
                                </Box>
                            </Paper>

                            {/* Location Details Card */}
                            <Paper
                                elevation={0}
                                variant="outlined"
                                sx={{
                                    borderRadius: '1rem',
                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
                                    overflow: 'hidden'
                                }}
                            >
                                {/* Card Header */}
                                <Box
                                    sx={{
                                        p: 3,
                                        backgroundColor: theme => alpha(theme.palette.primary.main, 0.04),
                                        borderBottom: '1px solid',
                                        borderColor: 'divider',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1.5
                                    }}
                                >
                                    <LocationOn color="primary" />
                                    <Typography variant="h6" fontWeight="600">
                                        Detail Lokasi
                                    </Typography>
                                </Box>

                                {/* Card Content */}
                                <Box sx={{ p: 3 }}>
                                    <Stack spacing={3}>
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 2.5,
                                                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
                                                borderRadius: '0.75rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                border: '1px solid',
                                                borderColor: theme => alpha(theme.palette.primary.main, 0.1),
                                            }}
                                        >
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                {isVirtual ? <VideoCall color="primary" /> : <LocationOn color="primary" />}
                                                <Typography variant="body2" fontWeight="500">
                                                    {isVirtual ? 'Pertemuan virtual (video call)' : 'Lokasi fisik (tatap muka)'}
                                                </Typography>
                                            </Stack>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={isVirtual}
                                                        onChange={handleLocationTypeChange}
                                                        color="primary"
                                                    />
                                                }
                                                label={isVirtual ? "Virtual" : "Fisik"}
                                                labelPlacement="start"
                                                sx={{ ml: 1, mr: 0 }}
                                            />
                                        </Paper>

                                        {isVirtual ? (
                                            <FormGroup
                                                label="Tautan Meeting"
                                                helperText="Zoom, Google Meet, Microsoft Teams, dll."
                                                error={errors.meeting_link}
                                                required
                                            >
                                                <Input
                                                    name="meeting_link"
                                                    value={formData.meeting_link}
                                                    onChange={handleChange}
                                                    placeholder="Masukkan tautan meeting"
                                                    startAdornment={<VideoCall sx={{ color: 'primary.main', mr: 1 }} />}
                                                    fullWidth
                                                    error={!!errors.meeting_link}
                                                    helperText={errors.meeting_link}
                                                    sx={{ borderRadius: '0.75rem' }}
                                                />
                                            </FormGroup>
                                        ) : (
                                            <FormGroup
                                                label="Lokasi"
                                                error={errors.location}
                                                required
                                            >
                                                <Input
                                                    name="location"
                                                    value={formData.location}
                                                    onChange={handleChange}
                                                    placeholder="Masukkan lokasi fisik"
                                                    startAdornment={<LocationOn sx={{ color: 'primary.main', mr: 1 }} />}
                                                    fullWidth
                                                    error={!!errors.location}
                                                    helperText={errors.location}
                                                    sx={{ borderRadius: '0.75rem' }}
                                                />
                                            </FormGroup>
                                        )}
                                    </Stack>
                                </Box>
                            </Paper>

                            {/* Attendees Card */}
                            <Paper
                                elevation={0}
                                variant="outlined"
                                sx={{
                                    borderRadius: '1rem',
                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
                                    overflow: 'hidden'
                                }}
                            >
                                {/* Card Header */}
                                <Box
                                    sx={{
                                        p: 3,
                                        backgroundColor: theme => alpha(theme.palette.primary.main, 0.04),
                                        borderBottom: '1px solid',
                                        borderColor: 'divider',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1.5
                                    }}
                                >
                                    <Person color="primary" />
                                    <Typography variant="h6" fontWeight="600">
                                        Peserta
                                    </Typography>
                                </Box>

                                {/* Card Content */}
                                <Box sx={{ p: 3 }}>
                                    <Stack spacing={3}>
                                        <Typography variant="body2" color="text.secondary">
                                            Tambahkan alamat email orang yang ingin Anda undang ke acara ini.
                                        </Typography>

                                        <Stack direction="row" spacing={2}>
                                            <Input
                                                value={attendeeInput}
                                                onChange={(e) => setAttendeeInput(e.target.value)}
                                                onKeyPress={handleAttendeeKeyPress}
                                                placeholder="Masukkan alamat email"
                                                fullWidth
                                                sx={{ borderRadius: '0.75rem' }}
                                                startAdornment={<Person sx={{ color: 'primary.main', mr: 1 }} />}
                                            />
                                            <Button
                                                variant="outlined"
                                                startIcon={<Add />}
                                                onClick={handleAddAttendee}
                                                sx={{ borderRadius: '0.75rem', minWidth: '100px' }}
                                            >
                                                Tambah
                                            </Button>
                                        </Stack>

                                        {formData.attendees.length > 0 && (
                                            <Paper
                                                elevation={0}
                                                sx={{
                                                    p: 2.5,
                                                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
                                                    borderRadius: '0.75rem',
                                                    border: '1px solid',
                                                    borderColor: theme => alpha(theme.palette.primary.main, 0.1),
                                                }}
                                            >
                                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                                                    <Person fontSize="small" color="primary" />
                                                    <Typography variant="subtitle2">
                                                        {formData.attendees.length} Peserta{formData.attendees.length > 1 ? '' : ''}
                                                    </Typography>
                                                </Stack>
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                    {formData.attendees.map((attendee, index) => (
                                                        <Chip
                                                            key={index}
                                                            label={attendee}
                                                            onDelete={() => handleRemoveAttendee(attendee)}
                                                            size="medium"
                                                            sx={{ borderRadius: '0.75rem', fontWeight: 500 }}
                                                        />
                                                    ))}
                                                </Box>
                                            </Paper>
                                        )}
                                    </Stack>
                                </Box>
                            </Paper>
                        </Box>

                        {/* Sidebar */}
                        <Box sx={{ width: { xs: '100%', md: '30%' } }}>
                            <Paper
                                elevation={0}
                                variant="outlined"
                                sx={{
                                    position: { md: 'sticky' },
                                    top: { md: 16 },
                                    borderRadius: '1rem',
                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
                                    overflow: 'hidden'
                                }}
                            >
                                {/* Card Header */}
                                <Box
                                    sx={{
                                        p: 3,
                                        backgroundColor: theme => alpha(theme.palette.primary.main, 0.04),
                                        borderBottom: '1px solid',
                                        borderColor: 'divider',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1.5
                                    }}
                                >
                                    <CheckCircleIcon color="primary" />
                                    <Typography variant="h6" fontWeight="600">
                                        Tindakan
                                    </Typography>
                                </Box>

                                {/* Card Content */}
                                <Box sx={{ p: 3 }}>
                                    <Stack spacing={2}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            size="large"
                                            fullWidth
                                            disabled={loading}
                                            sx={{
                                                borderRadius: '0.75rem',
                                                boxShadow: '0 4px 12px rgba(15, 118, 110, 0.2)',
                                                position: 'relative',
                                                py: 1.5
                                            }}
                                            startIcon={<CheckCircleIcon />}
                                        >
                                            {loading ? 'Memproses...' : 'Jadwalkan Acara'}
                                        </Button>

                                        <Button
                                            variant="outlined"
                                            size="large"
                                            fullWidth
                                            component={Link}
                                            href={route('manager.events.index')}
                                            disabled={loading}
                                            sx={{ borderRadius: '0.75rem', py: 1.5 }}
                                        >
                                            Batal
                                        </Button>
                                    </Stack>

                                    {/* Selected Candidate Info */}
                                    {selectedApplication && (
                                        <CandidateInfoCard application={selectedApplication} />
                                    )}

                                    {/* Selected Job Info */}
                                    {formData.job_id && !selectedApplication && (
                                        <JobInfoCard jobId={formData.job_id} jobs={jobs} />
                                    )}

                                    {/* Tips Card */}
                                    <TipsCard />
                                </Box>
                            </Paper>
                        </Box>
                    </Box>
                </form>
            </Container>
        </Layout>
    );
};

export default EventCreate;
