import React, { useState, useRef, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    TextField,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    FormHelperText,
    Paper,
    Grid,
    Switch,
    FormControlLabel,
    FormGroup,
    Divider,
    Radio,
    RadioGroup,
    Alert,
    Tabs,
    Tab,
    ToggleButton,
    ToggleButtonGroup,
    InputAdornment,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Send as SendIcon,
    AttachFile as AttachFileIcon,
    EventNote as EventNoteIcon,
    Event as EventIcon,
    LocationOn as LocationOnIcon,
    Link as LinkIcon,
    Videocam as VideocamIcon,
    Public as PublicIcon,
} from '@mui/icons-material';
import Layout from '@/Components/Layout/Layout';
import { motion } from 'framer-motion';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const CreateFromApplication = ({ application, jobs, templates }) => {
    const [attachment, setAttachment] = useState(null);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [scheduleInterview, setScheduleInterview] = useState(false);
    const [interviewType, setInterviewType] = useState('offline');
    const fileInputRef = useRef();

    const { data, setData, post, processing, errors, reset } = useForm({
        candidate_id: application.candidate.id,
        job_id: application.job.id,
        subject: '',
        message: '',
        attachment: null,
        application_id: application.id,
        from_application: true,
        schedule_interview: false,
        interview_date: null,
        interview_time: null,
        interview_location: '',
        interview_type: 'offline',
        interview_link: '',
    });

    useEffect(() => {
        if (selectedTemplate) {
            const template = templates.find(t => t.id === selectedTemplate);
            if (template) {
                setData(current => ({
                    ...current,
                    subject: template.subject,
                    message: template.message,
                }));
            }
        }
    }, [selectedTemplate]);

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setData('attachment', e.target.files[0]);
            setAttachment(e.target.files[0].name);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setData('schedule_interview', scheduleInterview);
        setData('interview_type', interviewType);
        
        post(route('manager.messages.store-from-application'), {
            onSuccess: () => {
                reset();
                setAttachment(null);
                setSelectedTemplate(null);
                setScheduleInterview(false);
            },
        });
    };

    const handleTemplateChange = (event, newTemplate) => {
        setSelectedTemplate(newTemplate);
    };

    const handleInterviewTypeChange = (event, newType) => {
        if (newType !== null) {
            setInterviewType(newType);
            setData('interview_type', newType);
        }
    };

    return (
        <Layout>
            <Head title="Kirim Pesan ke Kandidat" />

            <Container maxWidth="lg">
                <Box sx={{ py: 4 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Box sx={{ display: 'flex', mb: 4, alignItems: 'center' }}>
                            <Button
                                component={Link}
                                href={route('manager.applications.show', application.id)}
                                startIcon={<ArrowBackIcon />}
                                sx={{ mr: 2 }}
                            >
                                Kembali
                            </Button>
                            <Typography variant="h5" component="h1" fontWeight="bold">
                                Kirim Pesan ke {application.candidate.name}
                            </Typography>
                        </Box>

                        <Paper elevation={3} sx={{ p: 3, borderRadius: '0.75rem', mb: 4 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Kandidat
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 1 }}>
                                        {application.candidate.name} ({application.candidate.email})
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Pekerjaan Terkait
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 1 }}>
                                        {application.job.title}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>

                        <Paper elevation={3} sx={{ p: 3, borderRadius: '0.75rem', mb: 4 }}>
                            <Typography variant="h6" component="h2" fontWeight="bold" sx={{ mb: 2 }}>
                                Template Pesan
                            </Typography>
                            <Box sx={{ width: '100%' }}>
                                <ToggleButtonGroup
                                    value={selectedTemplate}
                                    exclusive
                                    onChange={handleTemplateChange}
                                    aria-label="template pesan"
                                    sx={{ 
                                        display: 'flex', 
                                        flexWrap: 'wrap',
                                        mb: 2,
                                        '& .MuiToggleButtonGroup-grouped': {
                                            border: 1,
                                            borderColor: 'divider',
                                            m: 0.5,
                                        }, 
                                    }}
                                >
                                    {templates.map(template => (
                                        <ToggleButton 
                                            key={template.id} 
                                            value={template.id}
                                            sx={{ 
                                                textTransform: 'none',
                                                minWidth: { xs: '100%', sm: '180px' },
                                            }}
                                        >
                                            {template.name}
                                        </ToggleButton>
                                    ))}
                                </ToggleButtonGroup>
                            </Box>
                        </Paper>

                        <Paper elevation={3} sx={{ p: 3, borderRadius: '0.75rem' }}>
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Subjek Pesan"
                                            value={data.subject}
                                            onChange={(e) => setData('subject', e.target.value)}
                                            error={!!errors.subject}
                                            helperText={errors.subject}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={8}
                                            label="Isi Pesan"
                                            placeholder="Tuliskan pesan Anda di sini..."
                                            value={data.message}
                                            onChange={(e) => setData('message', e.target.value)}
                                            error={!!errors.message}
                                            helperText={errors.message}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                style={{ display: 'none' }}
                                                onChange={handleFileChange}
                                            />
                                            <Button
                                                variant="outlined"
                                                startIcon={<AttachFileIcon />}
                                                onClick={() => fileInputRef.current.click()}
                                                sx={{ mr: 2 }}
                                            >
                                                Tambahkan Lampiran
                                            </Button>
                                            {attachment && (
                                                <Chip
                                                    label={attachment}
                                                    onDelete={() => {
                                                        setAttachment(null);
                                                        setData('attachment', null);
                                                    }}
                                                    color="primary"
                                                    variant="outlined"
                                                />
                                            )}
                                        </Box>
                                        {errors.attachment && (
                                            <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                                                {errors.attachment}
                                            </Typography>
                                        )}
                                    </Grid>
                                    
                                    <Grid item xs={12}>
                                        <Divider sx={{ my: 2 }} />
                                        <FormControlLabel
                                            control={
                                                <Switch 
                                                    checked={scheduleInterview}
                                                    onChange={(e) => setScheduleInterview(e.target.checked)}
                                                    color="primary"
                                                />
                                            }
                                            label={
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <EventNoteIcon color="primary" sx={{ mr: 1 }} />
                                                    <Typography variant="subtitle1">Jadwalkan Wawancara</Typography>
                                                </Box>
                                            }
                                        />
                                    </Grid>
                                    
                                    {scheduleInterview && (
                                        <>
                                            <Grid item xs={12} md={6}>
                                                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={id}>
                                                    <DatePicker
                                                        label="Tanggal Wawancara"
                                                        value={data.interview_date}
                                                        onChange={(date) => setData('interview_date', date)}
                                                        slotProps={{
                                                            textField: {
                                                                fullWidth: true,
                                                                error: !!errors.interview_date,
                                                                helperText: errors.interview_date,
                                                            }
                                                        }}
                                                    />
                                                </LocalizationProvider>
                                            </Grid>
                                            
                                            <Grid item xs={12} md={6}>
                                                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={id}>
                                                    <TimePicker
                                                        label="Waktu Wawancara"
                                                        value={data.interview_time}
                                                        onChange={(time) => setData('interview_time', time)}
                                                        slotProps={{
                                                            textField: {
                                                                fullWidth: true,
                                                                error: !!errors.interview_time,
                                                                helperText: errors.interview_time,
                                                            }
                                                        }}
                                                    />
                                                </LocalizationProvider>
                                            </Grid>
                                            
                                            <Grid item xs={12}>
                                                <Box sx={{ mb: 2 }}>
                                                    <Typography variant="subtitle2" gutterBottom>
                                                        Tipe Wawancara
                                                    </Typography>
                                                    <ToggleButtonGroup
                                                        value={interviewType}
                                                        exclusive
                                                        onChange={handleInterviewTypeChange}
                                                        aria-label="tipe wawancara"
                                                    >
                                                        <ToggleButton value="offline" aria-label="offline interview">
                                                            <PublicIcon sx={{ mr: 1 }} />
                                                            Tatap Muka
                                                        </ToggleButton>
                                                        <ToggleButton value="online" aria-label="online interview">
                                                            <VideocamIcon sx={{ mr: 1 }} />
                                                            Online
                                                        </ToggleButton>
                                                    </ToggleButtonGroup>
                                                </Box>
                                            </Grid>
                                            
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label={interviewType === 'online' ? "Link Meeting" : "Lokasi Wawancara"}
                                                    value={interviewType === 'online' ? data.interview_link : data.interview_location}
                                                    onChange={(e) => interviewType === 'online' 
                                                        ? setData('interview_link', e.target.value)
                                                        : setData('interview_location', e.target.value)
                                                    }
                                                    error={interviewType === 'online' ? !!errors.interview_link : !!errors.interview_location}
                                                    helperText={interviewType === 'online' ? errors.interview_link : errors.interview_location}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                {interviewType === 'online' ? <LinkIcon /> : <LocationOnIcon />}
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            </Grid>
                                            
                                            <Grid item xs={12}>
                                                <Alert severity="info" sx={{ mt: 1 }}>
                                                    Kandidat akan menerima undangan kalender dan notifikasi email untuk jadwal wawancara ini.
                                                </Alert>
                                            </Grid>
                                        </>
                                    )}
                                    
                                    <Grid item xs={12}>
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                size="large"
                                                endIcon={<SendIcon />}
                                                disabled={processing || !data.subject || !data.message || (scheduleInterview && (!data.interview_date || !data.interview_time || (interviewType === 'offline' && !data.interview_location) || (interviewType === 'online' && !data.interview_link)))}
                                            >
                                                Kirim Pesan
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </form>
                        </Paper>
                    </motion.div>
                </Box>
            </Container>
        </Layout>
    );
};

export default CreateFromApplication;
