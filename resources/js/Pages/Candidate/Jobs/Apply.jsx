import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Breadcrumbs,
    Link as MuiLink,
    TextField,
    Button,
    Alert,
    Chip,
    Stack,
    alpha,
    useTheme,
    Snackbar,
    Card,
    CardMedia,
    CardContent,
    CardActionArea,
    CardActions,
    FormControl,
    FormLabel,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Divider,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import {
    Send,
    Description,
    NavigateNext,
    DoneAll,
    AccessTime,
    Error as ErrorIcon,
    PictureAsPdf,
    Edit,
    BusinessCenter,
    Person,
    LocationOn,
    CalendarToday,
    InfoOutlined,
    Code,
    Link as LinkIcon,
    Work,
    OpenInNew,
    GitHub,
    Folder,
    Star,
    StarBorder,
} from '@mui/icons-material';
import Layout from '@/Components/Layout/Layout';
import SweetAlert from '@/Components/Shared/SweetAlert';

export default function Apply({ job, candidateProfile, portfolioItems }) {
    const theme = useTheme();

    // Form state
    const [submitting, setSubmitting] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
    const [redirectPending, setRedirectPending] = useState(false);
    const [selectedPortfolioItems, setSelectedPortfolioItems] = useState([]);
    const [portfolioPreviewOpen, setPortfolioPreviewOpen] = useState(false);
    const [selectedPreviewItem, setSelectedPreviewItem] = useState(null);


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

    useEffect(() => {
        if (redirectPending) {
            const timer = setTimeout(() => {
                window.location.href = route('candidate.applications.index');
            }, 1500); // Delay redirect to ensure the alert is seen

            return () => clearTimeout(timer);
        }
    }, [redirectPending]);



    useEffect(() => {
        if (import.meta.env.NODE_ENV !== 'production') {
            console.log('Job data:', job);
            console.log('Candidate profile:', candidateProfile);
            console.log('Portfolio items:', portfolioItems);
        }
    }, [job, candidateProfile, portfolioItems]);

    // Initialize form
    const { data, setData, post, processing, errors, reset } = useForm({
        job_id: job?.id || '',
        cover_letter: '',
        portfolio_items: [],
    });

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    // Handle portfolio selection
    const handlePortfolioItemToggle = (itemId) => {
        // Toggle selection in the component state for visual feedback
        setSelectedPortfolioItems(prev => {
            if (prev.includes(itemId)) {
                return prev.filter(id => id !== itemId);
            } else {
                return [...prev, itemId];
            }
        });

        // Also update the form data
        setData('portfolio_items', prev => {
            if (prev.includes(itemId)) {
                return prev.filter(id => id !== itemId);
            } else {
                return [...prev, itemId];
            }
        });
    };

    // Open portfolio preview dialog
    const handleOpenPortfolioPreview = (item) => {
        setSelectedPreviewItem(item);
        setPortfolioPreviewOpen(true);
    };

    // Close portfolio preview dialog
    const handleClosePortfolioPreview = () => {
        setPortfolioPreviewOpen(false);
        setSelectedPreviewItem(null);
    };

    // Check application deadline
    const isDeadlinePassed = () => {
        if (!job?.submission_deadline) return false;

        const deadline = new Date(job.submission_deadline);
        const now = new Date();
        return deadline < now;
    };

    // Handle form pre-submission (validation and confirmation)
    const handlePreSubmit = (e) => {
        e.preventDefault();

        // Basic validation before showing confirmation
        if (!data.cover_letter || data.cover_letter.trim().length < 10) {
            setSnackbar({
                open: true,
                message: 'Cover letter harus diisi minimal 10 karakter',
                severity: 'error'
            });
            return;
        }

        // Show SweetAlert confirmation instead of Dialog
        setSweetAlert({
            show: true,
            title: 'Kirim Lamaran',
            text: `Apakah Anda yakin ingin mengirim lamaran untuk posisi ${job.title} di ${job.company.name}? Pastikan semua informasi telah lengkap dan akurat.`,
            icon: 'question',
            confirmButtonText: 'Konfirmasi & Kirim',
            showCancelButton: true,
            cancelButtonText: 'Periksa Kembali',
            onConfirm: handleSubmit
        });
    };

    // Handle actual form submission
    const handleSubmit = () => {
        setSubmitting(true);

        // Log what we're submitting for debugging
        if (import.meta.env.NODE_ENV !== 'production') {
            console.log('Submitting application data:', data);
        }

        // Submit application
        post(route('candidate.jobs.submit-application', job.id), {
            onSuccess: () => {
                // Show success message first
                setSweetAlert({
                    show: true,
                    title: 'Berhasil!',
                    text: 'Lamaran Anda telah berhasil dikirim. Anda akan dialihkan ke halaman lamaran Anda.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    onConfirm: () => {
                        // Set flag to redirect after alert is closed
                        setRedirectPending(true);
                    }
                });
            },
            onError: (errors) => {
                console.error('Application submission errors:', errors);
                setSnackbar({
                    open: true,
                    message: 'Terjadi kesalahan saat mengirim lamaran. Silakan coba lagi.',
                    severity: 'error'
                });
                setSubmitting(false);
            }
        });
    };

    // Handle snackbar close
    const handleSnackbarClose = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    // Function to get the portfolio type icon
    const getPortfolioTypeIcon = (type) => {
        switch (type) {
            case 'project':
                return <Folder />;
            case 'open_source':
                return <Code />;
            case 'work':
                return <Work />;
            default:
                return <Description />;
        }
    };

    // Render the application form
    return (
        <Layout>
            <Head title={`Apply - ${job?.title}`} />

            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Breadcrumbs */}
                <Breadcrumbs 
                    separator={<NavigateNext fontSize="small" />} 
                    aria-label="breadcrumb"
                    sx={{ mb: 3 }}
                >
                    <MuiLink underline="hover" color="inherit" component={Link} href={route('candidate.dashboard')}>
                        Dashboard
                    </MuiLink>
                    <MuiLink underline="hover" color="inherit" component={Link} href={route('candidate.jobs.index')}>
                        Lowongan
                    </MuiLink>
                    <MuiLink 
                        underline="hover" 
                        color="inherit" 
                        component={Link}
                        href={route('candidate.jobs.show', job.id)}
                    >
                        {job.title}
                    </MuiLink>
                    <Typography color="text.primary">Lamar</Typography>
                </Breadcrumbs>

                {/* Application Form */}
                <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 3 }}>
                    {/* Form Area */}
                    <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(66.666% - 12px)' } }}>
                        <Paper 
                            elevation={0} 
                            sx={{ 
                                p: 3, 
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 2,
                                mb: 3
                            }}
                        >
                            <Typography variant="h5" gutterBottom>
                                Lamar Posisi {job.title}
                            </Typography>

                            <Box 
                                display="flex" 
                                alignItems="center" 
                                sx={{ 
                                    mb: 3,
                                    p: 2,
                                    backgroundColor: alpha(theme.palette.info.main, 0.1),
                                    borderRadius: 1,
                                    border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`
                                }}
                            >
                                <InfoOutlined color="info" sx={{ mr: 1 }} />
                                <Typography variant="body2">
                                    Periksa kembali dokumen dan informasi yang Anda berikan sebelum mengirim lamaran.
                                </Typography>
                            </Box>

                            <Box component="form" onSubmit={handlePreSubmit} sx={{ mt: 3 }}>
                                <TextField
                                    name="cover_letter"
                                    label="Cover Letter"
                                    multiline
                                    rows={8}
                                    value={data.cover_letter}
                                    onChange={handleChange}
                                    fullWidth
                                    variant="outlined"
                                    required
                                    placeholder="Tuliskan mengapa Anda tertarik dengan posisi ini dan mengapa Anda adalah kandidat yang tepat..."
                                    error={!!errors.cover_letter}
                                    helperText={errors.cover_letter || 'Jelaskan mengapa Anda tertarik dengan posisi ini dan kualifikasi yang Anda miliki.'}
                                    InputProps={{
                                        sx: { fontFamily: 'inherit' }
                                    }}
                                    sx={{ mb: 3 }}
                                />

                                {/* Resume Section */}
                                <Box sx={{ mb: 4 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Resume
                                    </Typography>
                                    
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            p: 2,
                                            backgroundColor: theme.palette.background.default,
                                            borderRadius: 1,
                                            border: '1px solid',
                                            borderColor: 'divider',
                                        }}
                                    >
                                        <PictureAsPdf color="error" sx={{ fontSize: 28, mr: 2 }} />
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Typography variant="subtitle1">
                                                {candidateProfile.resume_filename || 'Resume.pdf'}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Last updated: {candidateProfile.last_updated}
                                            </Typography>
                                        </Box>
                                        <Tooltip title="Lihat Resume">
                                            <IconButton 
                                                color="primary"
                                                href={candidateProfile.resume}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <OpenInNew />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Edit Resume">
                                            <IconButton 
                                                color="primary"
                                                component={Link}
                                                href={route('candidate.profile.edit')}
                                            >
                                                <Edit />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </Box>

                                {/* Portfolio Selection Section */}
                                {portfolioItems && portfolioItems.length > 0 && (
                                    <Box sx={{ mb: 4 }}>
                                        <Typography variant="h6" gutterBottom>
                                            Portfolio
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" paragraph>
                                            Pilih proyek-proyek yang relevan dengan posisi ini untuk ditampilkan pada lamaran Anda.
                                        </Typography>
                                        
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                            {portfolioItems.map((item) => (
                                                <Box 
                                                    key={item.id} 
                                                    sx={{ 
                                                        width: { 
                                                            xs: '100%', 
                                                            sm: 'calc(50% - 8px)', 
                                                            md: 'calc(33.333% - 11px)' 
                                                        } 
                                                    }}
                                                >
                                                    <Card 
                                                        variant="outlined" 
                                                        sx={{ 
                                                            height: '100%', 
                                                            display: 'flex', 
                                                            flexDirection: 'column',
                                                            position: 'relative',
                                                            transition: 'all 0.2s',
                                                            borderColor: selectedPortfolioItems.includes(item.id) 
                                                                ? theme.palette.primary.main 
                                                                : 'divider',
                                                            backgroundColor: selectedPortfolioItems.includes(item.id) 
                                                                ? alpha(theme.palette.primary.main, 0.05) 
                                                                : 'transparent',
                                                        }}
                                                    >
                                                        {item.is_featured && (
                                                            <Chip 
                                                                icon={<Star fontSize="small" />} 
                                                                label="Featured" 
                                                                size="small"
                                                                color="primary"
                                                                sx={{ 
                                                                    position: 'absolute', 
                                                                    top: 8, 
                                                                    right: 8, 
                                                                    zIndex: 1 
                                                                }}
                                                            />
                                                        )}
                                                        
                                                        {item.thumbnail ? (
                                                            <CardMedia
                                                                component="img"
                                                                height="140"
                                                                image={item.thumbnail}
                                                                alt={item.title}
                                                            />
                                                        ) : (
                                                            <Box 
                                                                sx={{ 
                                                                    height: 140, 
                                                                    display: 'flex', 
                                                                    alignItems: 'center', 
                                                                    justifyContent: 'center',
                                                                    backgroundColor: alpha(theme.palette.primary.main, 0.1)
                                                                }}
                                                            >
                                                                {getPortfolioTypeIcon(item.type)}
                                                            </Box>
                                                        )}
                                                        
                                                        <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                                                            <Typography variant="subtitle1" component="div" noWrap>
                                                                {item.title}
                                                            </Typography>
                                                            <Chip 
                                                                label={item.type_label} 
                                                                size="small" 
                                                                color="default"
                                                                variant="outlined"
                                                                icon={getPortfolioTypeIcon(item.type)}
                                                                sx={{ mb: 1 }}
                                                            />
                                                            <Typography 
                                                                variant="body2" 
                                                                color="text.secondary"
                                                                sx={{
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                    display: '-webkit-box',
                                                                    WebkitLineClamp: 2,
                                                                    WebkitBoxOrient: 'vertical',
                                                                }}
                                                            >
                                                                {item.description || 'No description provided'}
                                                            </Typography>
                                                        </CardContent>
                                                        
                                                        <CardActions sx={{ justifyContent: 'space-between', pt: 0 }}>
                                                            <Button 
                                                                size="small" 
                                                                onClick={() => handleOpenPortfolioPreview(item)}
                                                            >
                                                                Preview
                                                            </Button>
                                                            
                                                            <Checkbox
                                                                checked={selectedPortfolioItems.includes(item.id)}
                                                                onChange={() => handlePortfolioItemToggle(item.id)}
                                                                inputProps={{ 'aria-label': `Select ${item.title}` }}
                                                                color="primary"
                                                            />
                                                        </CardActions>
                                                    </Card>
                                                </Box>
                                            ))}
                                        </Box>
                                        
                                        {errors.portfolio_items && (
                                            <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                                                {errors.portfolio_items}
                                            </Typography>
                                        )}
                                    </Box>
                                )}

                                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                                    <Button
                                        variant="outlined"
                                        component={Link}
                                        href={route('candidate.jobs.show', job.id)}
                                    >
                                        Kembali
                                    </Button>
                                    
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        disabled={processing || submitting || isDeadlinePassed()}
                                        startIcon={<Send />}
                                    >
                                        Kirim Lamaran
                                    </Button>
                                </Box>
                            </Box>
                        </Paper>
                    </Box>

                    {/* Job Summary Sidebar */}
                    <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 12px)' } }}>
                        <Paper 
                            elevation={0} 
                            sx={{ 
                                p: 3, 
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 2,
                                position: { md: 'sticky' },
                                top: { md: 24 },
                            }}
                        >
                            <Typography variant="h6" gutterBottom>
                                Ringkasan Lowongan
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                {job.company.logo ? (
                                    <Box
                                        component="img"
                                        src={job.company.logo}
                                        alt={job.company.name}
                                        sx={{ 
                                            width: 48, 
                                            height: 48, 
                                            objectFit: 'contain',
                                            mr: 2,
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            borderRadius: 1,
                                            padding: 0.5
                                        }}
                                    />
                                ) : (
                                    <BusinessCenter sx={{ fontSize: 48, mr: 2, color: 'primary.main' }} />
                                )}
                                <Box>
                                    <Typography variant="subtitle1" fontWeight={600}>
                                        {job.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {job.company.name}
                                    </Typography>
                                </Box>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Stack spacing={2}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <LocationOn sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
                                    <Typography variant="body2">
                                        {job.location || 'Lokasi tidak ditentukan'}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <BusinessCenter sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
                                    <Typography variant="body2">
                                        {job.job_type || 'Tipe pekerjaan tidak ditentukan'}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <CalendarToday sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
                                    <Typography variant="body2">
                                        Deadline: {job.submission_deadline}
                                    </Typography>
                                </Box>

                                <Box 
                                    sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center',
                                        p: 1.5,
                                        backgroundColor: 
                                            job.days_remaining > 5 
                                                ? alpha(theme.palette.success.main, 0.1)
                                                : job.days_remaining > 2
                                                ? alpha(theme.palette.warning.main, 0.1)
                                                : alpha(theme.palette.error.main, 0.1),
                                        borderRadius: 1,
                                    }}
                                >
                                    {job.days_remaining > 0 ? (
                                        <>
                                            <AccessTime sx={{ 
                                                mr: 1, 
                                                fontSize: 20,
                                                color: 
                                                    job.days_remaining > 5 
                                                        ? theme.palette.success.main
                                                        : job.days_remaining > 2
                                                        ? theme.palette.warning.main
                                                        : theme.palette.error.main,
                                            }} />
                                            <Typography variant="body2">
                                                {job.days_remaining} hari tersisa untuk melamar
                                            </Typography>
                                        </>
                                    ) : (
                                        <>
                                            <ErrorIcon sx={{ color: theme.palette.error.main, mr: 1, fontSize: 20 }} />
                                            <Typography variant="body2" color="error">
                                                Batas waktu pendaftaran telah berakhir
                                            </Typography>
                                        </>
                                    )}
                                </Box>
                            </Stack>
                        </Paper>
                    </Box>
                </Box>
            </Container>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleSnackbarClose} 
                    severity={snackbar.severity} 
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {/* SweetAlert for confirmations and messages */}
            <SweetAlert
                show={sweetAlert.show}
                title={sweetAlert.title}
                text={sweetAlert.text}
                icon={sweetAlert.icon}
                showCancelButton={sweetAlert.showCancelButton}
                confirmButtonText={sweetAlert.confirmButtonText}
                cancelButtonText={sweetAlert.cancelButtonText}
                onConfirm={() => {
                    if (sweetAlert.onConfirm) sweetAlert.onConfirm();
                    setSweetAlert(prev => ({ ...prev, show: false }));
                }}
                onCancel={() => setSweetAlert(prev => ({ ...prev, show: false }))}
            />

            {/* Portfolio Preview Dialog */}
            <Dialog
                open={portfolioPreviewOpen}
                onClose={handleClosePortfolioPreview}
                maxWidth="md"
                fullWidth
            >
                {selectedPreviewItem && (
                    <>
                        <DialogTitle>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Typography variant="h6">
                                    {selectedPreviewItem.title}
                                </Typography>
                                <Chip 
                                    label={selectedPreviewItem.type_label} 
                                    size="small" 
                                    color="primary"
                                    icon={getPortfolioTypeIcon(selectedPreviewItem.type)}
                                />
                            </Box>
                        </DialogTitle>
                        <DialogContent dividers>
                            {selectedPreviewItem.thumbnail && (
                                <Box sx={{ mb: 2, textAlign: 'center' }}>
                                    <img 
                                        src={selectedPreviewItem.thumbnail} 
                                        alt={selectedPreviewItem.title}
                                        style={{ 
                                            maxWidth: '100%', 
                                            maxHeight: '300px',
                                            objectFit: 'contain',
                                            borderRadius: '4px'
                                        }}
                                    />
                                </Box>
                            )}
                            
                            <Typography variant="body1" paragraph>
                                {selectedPreviewItem.description || 'No description provided'}
                            </Typography>
                            
                            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                                {selectedPreviewItem.project_url && (
                                    <Button 
                                        variant="outlined" 
                                        startIcon={<LinkIcon />}
                                        href={selectedPreviewItem.project_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        size="small"
                                    >
                                        View Project
                                    </Button>
                                )}
                                
                                {selectedPreviewItem.repository_url && (
                                    <Button 
                                        variant="outlined" 
                                        startIcon={<GitHub />}
                                        href={selectedPreviewItem.repository_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        size="small"
                                    >
                                        View Repository
                                    </Button>
                                )}
                            </Stack>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClosePortfolioPreview}>
                                Close
                            </Button>
                            <Button 
                                variant="contained" 
                                onClick={() => {
                                    handlePortfolioItemToggle(selectedPreviewItem.id);
                                    handleClosePortfolioPreview();
                                }}
                            >
                                {selectedPortfolioItems.includes(selectedPreviewItem.id) 
                                    ? 'Remove from Application' 
                                    : 'Add to Application'}
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Layout>
    );
}
