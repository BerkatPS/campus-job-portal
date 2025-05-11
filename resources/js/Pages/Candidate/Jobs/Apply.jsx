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
} from '@mui/icons-material';
import Layout from '@/Components/Layout/Layout';
import SweetAlert from '@/Components/Shared/SweetAlert';

export default function Apply({ job, candidateProfile }) {
    const theme = useTheme();

    // Form state
    const [submitting, setSubmitting] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
    const [redirectPending, setRedirectPending] = useState(false);


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
        }
    }, [job, candidateProfile]);

    // Initialize form
    const { data, setData, post, processing, errors, reset } = useForm({
        job_id: job?.id || '',
        cover_letter: '',
    });

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
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

                setSweetAlert({
                    show: true,
                    title: 'Gagal',
                    text: 'Pengiriman lamaran gagal: ' + Object.values(errors).join(', '),
                    icon: 'error',
                    confirmButtonText: 'OK'
                });

                setSubmitting(false);
            },
        });
    };


    // Close snackbar
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    // Render job details section
    const renderJobDetails = () => (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                mb: 4,
                bgcolor: alpha(theme.palette.primary.main, 0.03),
                border: '1px solid',
                borderColor: alpha(theme.palette.primary.main, 0.1),
                borderRadius: 2
            }}
        >
            <Typography variant="h6" gutterBottom>
                Detail Pekerjaan
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 1, gap: 2 }}>
                <Box sx={{
                    flex: '1 1 200px',
                    minWidth: { xs: '100%', sm: '45%', md: '22%' }
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <BusinessCenter color="primary" sx={{ mr: 1, fontSize: 20 }} />
                        <Box>
                            <Typography variant="caption" color="text.secondary">
                                Posisi
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                                {job.title}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Box sx={{
                    flex: '1 1 200px',
                    minWidth: { xs: '100%', sm: '45%', md: '22%' }
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Person color="primary" sx={{ mr: 1, fontSize: 20 }} />
                        <Box>
                            <Typography variant="caption" color="text.secondary">
                                Perusahaan
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                                {job.company.name}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Box sx={{
                    flex: '1 1 200px',
                    minWidth: { xs: '100%', sm: '45%', md: '22%' }
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationOn color="primary" sx={{ mr: 1, fontSize: 20 }} />
                        <Box>
                            <Typography variant="caption" color="text.secondary">
                                Lokasi
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                                {job.location || 'Remote'}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Box sx={{
                    flex: '1 1 200px',
                    minWidth: { xs: '100%', sm: '45%', md: '22%' }
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarToday color="primary" sx={{ mr: 1, fontSize: 20 }} />
                        <Box>
                            <Typography variant="caption" color="text.secondary">
                                Deadline
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                                {job.submission_deadline}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>

            {job.days_remaining !== null && (
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                    {isDeadlinePassed() ? (
                        <>
                            <ErrorIcon fontSize="small" sx={{ mr: 1, color: 'error.main' }} />
                            <Typography variant="body2" color="error.main" fontWeight="medium">
                                Batas waktu pendaftaran telah berakhir
                            </Typography>
                        </>
                    ) : job.days_remaining <= 3 ? (
                        <>
                            <AccessTime fontSize="small" sx={{ mr: 1, color: 'warning.main' }} />
                            <Typography variant="body2" color="warning.main" fontWeight="medium">
                                {job.days_remaining > 1 ? `${job.days_remaining} hari` : '1 hari'} tersisa untuk melamar
                            </Typography>
                        </>
                    ) : (
                        <>
                            <InfoOutlined fontSize="small" sx={{ mr: 1, color: 'info.main' }} />
                            <Typography variant="body2" color="info.main">
                                {job.days_remaining} hari tersisa untuk melamar
                            </Typography>
                        </>
                    )}
                </Box>
            )}
        </Paper>
    );

    return (
        <Layout>
            <Head title={`Lamar untuk ${job.title}`} />

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

            {/* Snackbar untuk notifikasi */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message={snackbar.message}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                sx={{
                    '& .MuiSnackbarContent-root': {
                        backgroundColor: snackbar.severity === 'success'
                            ? theme.palette.success.main
                            : snackbar.severity === 'error'
                                ? theme.palette.error.main
                                : theme.palette.info.main
                    }
                }}
            />

            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Breadcrumbs */}
                <Breadcrumbs
                    separator={<NavigateNext fontSize="small" />}
                    aria-label="breadcrumb"
                    sx={{ mb: 4 }}
                >
                    <Link href={route('candidate.dashboard')} className="text-gray-600 no-underline">
                        Dashboard
                    </Link>
                    <Link href={route('candidate.jobs.index')} className="text-gray-600 no-underline">
                        Lowongan
                    </Link>
                    <Link href={route('candidate.jobs.show', job.id)} className="text-gray-600 no-underline">
                        {job.title}
                    </Link>
                    <Typography color="text.primary">Lamar</Typography>
                </Breadcrumbs>

                {/* Informasi Pekerjaan */}
                <Paper
                    elevation={1}
                    sx={{
                        p: 4,
                        mb: 4,
                        borderRadius: 2,
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            justifyContent: { md: 'space-between' },
                            alignItems: { md: 'center' }
                        }}
                    >
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
                                {job.title}
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                {job.company.name} • {job.location || 'Remote'}
                            </Typography>
                        </Box>
                        <Box sx={{ mt: { xs: 2, md: 0 } }}>
                            <MuiLink
                                href={route('candidate.jobs.show', job.id)}
                                underline="hover"
                                sx={{ color: 'primary.main' }}
                                component={Link}
                            >
                                Lihat Detail Lowongan
                            </MuiLink>
                        </Box>
                    </Box>
                </Paper>

                {/* Form Lamaran */}
                <Paper sx={{ borderRadius: 2, mb: 4, overflow: 'visible' }}>
                    <Box sx={{ p: 4 }}>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                            Lamar Posisi Ini
                        </Typography>

                        {/* Alert Deadline */}
                        {isDeadlinePassed() && (
                            <Alert
                                severity="error"
                                sx={{
                                    mb: 3,
                                    borderRadius: 2
                                }}
                            >
                                <Typography variant="subtitle2" fontWeight="bold">
                                    Lowongan ini telah ditutup
                                </Typography>
                                <Typography variant="body2">
                                    Batas pendaftaran untuk posisi ini telah berakhir. Silakan periksa lowongan lain yang tersedia.
                                </Typography>
                                <Button
                                    component={Link}
                                    href={route('candidate.jobs.index')}
                                    variant="outlined"
                                    color="error"
                                    size="small"
                                    sx={{ mt: 1, borderRadius: 1.5 }}
                                >
                                    Lihat Lowongan Lain
                                </Button>
                            </Alert>
                        )}

                        {/* Bagian Resume */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                mb: 4,
                                bgcolor: alpha(theme.palette.success.main, 0.05),
                                border: '1px solid',
                                borderColor: alpha(theme.palette.success.main, 0.2),
                                borderRadius: 2
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6" color="text.primary">
                                    Resume Anda
                                </Typography>
                                <Chip
                                    label="Dari Profil Anda"
                                    size="small"
                                    color="success"
                                    sx={{ borderRadius: '10px' }}
                                />
                            </Box>

                            <Alert
                                severity="info"
                                sx={{ mb: 2 }}
                                icon={<InfoOutlined />}
                            >
                                Resume dari profil Anda akan digunakan untuk lamaran ini. Perusahaan akan melihat resume terbaru Anda saat mereview lamaran.
                            </Alert>

                            {!candidateProfile?.has_resume && (
                                <Alert
                                    severity="error"
                                    sx={{ mb: 2 }}
                                >
                                    Anda belum mengunggah resume ke profil. Silakan unggah resume terlebih dahulu sebelum melanjutkan.
                                </Alert>
                            )}

                            {candidateProfile?.has_resume && (
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    bgcolor: 'background.paper',
                                    p: 2,
                                    borderRadius: 1,
                                    border: '1px solid',
                                    borderColor: alpha(theme.palette.divider, 0.5)
                                }}>
                                    <PictureAsPdf sx={{ fontSize: 40, color: 'error.main', mr: 2 }} />
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="subtitle1" fontWeight={500}>
                                            {candidateProfile.resume_filename}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Terakhir diperbarui: {candidateProfile.last_updated}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Button
                                            component="a"
                                            href={candidateProfile.resume}
                                            target="_blank"
                                            variant="outlined"
                                            size="small"
                                            sx={{ mr: 1 }}
                                            startIcon={<Description />}
                                        >
                                            Lihat
                                        </Button>
                                        <Button
                                            component={Link}
                                            href={route('candidate.profile.edit')}
                                            variant="outlined"
                                            color="primary"
                                            size="small"
                                            startIcon={<Edit />}
                                        >
                                            Perbarui
                                        </Button>
                                    </Box>
                                </Box>
                            )}
                        </Paper>

                        {/* Detail Pekerjaan */}
                        {renderJobDetails()}

                        <form onSubmit={handlePreSubmit}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                {/* Bagian Cover Letter */}
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        bgcolor: 'background.paper',
                                        border: '1px solid',
                                        borderColor: errors.cover_letter ? 'error.main' : 'divider',
                                        borderRadius: 2
                                    }}
                                >
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Typography variant="h6">
                                            Cover Letter
                                        </Typography>
                                        <Chip
                                            label="Wajib"
                                            size="small"
                                            color="primary"
                                            variant="outlined"
                                            sx={{ borderRadius: '10px' }}
                                        />
                                    </Box>

                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        Perkenalkan diri Anda dan jelaskan mengapa Anda cocok untuk posisi ini.
                                    </Typography>

                                    <TextField
                                        name="cover_letter"
                                        placeholder="Tulis cover letter Anda di sini..."
                                        multiline
                                        rows={8}
                                        fullWidth
                                        value={data.cover_letter}
                                        onChange={handleChange}
                                        error={!!errors.cover_letter}
                                        helperText={errors.cover_letter || 'Minimal 10 karakter'}
                                        variant="outlined"
                                        disabled={isDeadlinePassed() || submitting}
                                        required
                                    />
                                </Paper>

                                {/* Disclaimer Syarat dan Ketentuan */}
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        bgcolor: alpha(theme.palette.info.main, 0.05),
                                        border: '1px solid',
                                        borderColor: alpha(theme.palette.info.main, 0.1),
                                        borderRadius: 2
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                        <InfoOutlined sx={{ color: 'info.main', mr: 2, mt: 0.5 }} />
                                        <Typography variant="body2" color="text.secondary">
                                            Dengan mengirimkan lamaran ini, Anda mengonfirmasi bahwa semua informasi yang diberikan akurat dan lengkap.
                                            Kami mungkin menghubungi Anda terkait lamaran ini melalui email atau telepon. Data Anda akan diproses sesuai dengan
                                            kebijakan privasi kami.
                                        </Typography>
                                    </Box>
                                </Paper>

                                {/* Tombol Submit */}
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        disabled={processing || isDeadlinePassed() || submitting || !candidateProfile?.has_resume}
                                        endIcon={<Send />}
                                        sx={{
                                            px: 4,
                                            py: 1.5,
                                            borderRadius: 2,
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                                        }}
                                        size="large"
                                    >
                                        {submitting || processing ? 'Mengirim...' : 'Kirim Lamaran'}
                                    </Button>
                                </Box>
                            </Box>
                        </form>
                    </Box>
                </Paper>
            </Container>
        </Layout>
    );
}
