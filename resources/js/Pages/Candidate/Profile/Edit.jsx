import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import {
    Container,
    Typography,
    Box,
    Avatar,
    TextField,
    Button,
    Divider,
    IconButton,
    InputAdornment,
    Paper,
    Alert as MuiAlert,
    Snackbar,
    Card as MuiCard,
    CardContent,
    CardHeader,
    Tabs as MuiTabs,
    Tab as MuiTab,
    LinearProgress
} from '@mui/material';
import {
    Save as SaveIcon,
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
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
    Edit as EditIcon,
    CheckCircleOutline as CheckCircleOutlineIcon,
    Badge as BadgeIcon,
    CalendarMonth as CalendarMonthIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import id from 'date-fns/locale/id';
import Layout from "@/Components/Layout/Layout.jsx";
import SweetAlert from "@/Components/Shared/SweetAlert.jsx";
import { ToastContainerWrapper } from "@/Components/Shared/Toast.jsx";
import {toast} from "react-toastify";

// Custom Tab Panel Component
function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Box
            role="tabpanel"
            hidden={value !== index}
            id={`profile-tabpanel-${index}`}
            aria-labelledby={`profile-tab-${index}`}
            sx={{ py: 3 }}
            {...other}
        >
            {value === index && children}
        </Box>
    );
}

// Custom TextField Component
function CustomTextField({ label, value, onChange, error, helperText, type = "text", multiline = false, rows = 1, placeholder = "", fullWidth = true, required = false, startAdornment = null, endAdornment = null, disabled = false }) {
    return (
        <TextField
            label={label}
            value={value || ''}
            onChange={onChange}
            error={!!error}
            helperText={error || helperText}
            type={type}
            multiline={multiline}
            rows={rows}
            placeholder={placeholder}
            fullWidth={fullWidth}
            required={required}
            disabled={disabled}
            variant="outlined"
            sx={{
                mb: 2,
                '& .MuiInputBase-root': {
                    borderRadius: 1.5,
                },
                '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: error ? 'error.main' : 'divider',
                },
            }}
        />
    );
}

// Custom FileUpload Component
function CustomFileUpload({ accept, label, onChange, error, maxSize, icon }) {
    const fileInputRef = React.useRef(null);
    const [fileName, setFileName] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
            onChange(file);

            // Debug log
            console.log('File selected:', file.name, file.type, file.size);
        }
    };

    return (
        <Box sx={{ mb: 2 }}>
            <input
                ref={fileInputRef}
                accept={accept}
                id={`file-upload-${label.replace(/\s/g, '-').toLowerCase()}`}
                type="file"
                name="resume" // Add explicit name attribute
                hidden
                onChange={handleFileChange}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <label htmlFor={`file-upload-${label.replace(/\s/g, '-').toLowerCase()}`}>
                    <Button
                        component="span"
                        variant="outlined"
                        startIcon={icon}
                        sx={{ borderRadius: 2 }}
                    >
                        {label}
                    </Button>
                </label>
                {fileName && (
                    <Typography variant="body2" sx={{ ml: 2 }}>
                        {fileName}
                    </Typography>
                )}
            </Box>
            {error && (
                <Typography variant="caption" color="error">
                    {error}
                </Typography>
            )}
            <Typography variant="caption" color="text.secondary" display="block">
                Maksimal ukuran file: {maxSize}MB
            </Typography>
        </Box>
    );
}

export default function Edit({ user, profile }) {
    const [activeTab, setActiveTab] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(user.avatar || null);
    const [resumeFile, setResumeFile] = useState(null);
    const [resumeFileName, setResumeFileName] = useState(profile?.resume_name || null);
    const [resumeUploadProgress, setResumeUploadProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState('idle'); // 'idle', 'uploading', 'success', 'error'
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Toast notification helper
    const showToast = (message, type = 'info') => {
        toast[type](message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
        });
    };

    // Initialize form with Inertia's useForm
    const { data, setData, errors, setError, clearErrors, post, processing } = useForm({
        name: user.name || '',
        email: user.email || '',
        nim: user.nim || '',
        password: '',
        password_confirmation: '',
        avatar: null,
        date_of_birth: profile.date_of_birth || '',
        phone: profile.phone || '',
        address: profile.address || '',
        education: profile.education || '',
        experience: profile.experience || '',
        skills: profile.skills || '',
        linkedin: profile.linkedin || '',
        website: profile.website || '',
        twitter: profile.twitter || '',
        github: profile.github || '',
        resume: null,
        _method: 'PUT'  // Method spoofing for Laravel
    });

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

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

    // Client-side validation
    const validateForm = () => {
        clearErrors();
        let hasErrors = false;

        // Ensure name is not empty
        if (!data.name || data.name.trim() === '') {
            setError('name', 'Nama tidak boleh kosong');
            hasErrors = true;
        }

        // Ensure email is not empty and valid
        if (!data.email || data.email.trim() === '') {
            setError('email', 'Email tidak boleh kosong');
            hasErrors = true;
        } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
            setError('email', 'Format email tidak valid');
            hasErrors = true;
        }

        // If passwords don't match
        if (data.password && data.password !== data.password_confirmation) {
            setError('password_confirmation', 'Konfirmasi password tidak cocok');
            hasErrors = true;
        }

        console.log('Form validation result:', !hasErrors ? 'Valid' : 'Invalid');
        return !hasErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Don't submit if already submitting
        if (isSubmitting) return;

        // Disable submit button
        setIsSubmitting(true);

        // Client-side validation
        if (!validateForm()) {
            setIsSubmitting(false);
            return;
        }

        // Use Inertia.js form handling to submit the form
        post(route('candidate.profile.update'), {
            // Use FormData for file uploads
            forceFormData: true,
            // Process uploaded files
            onSuccess: () => {
                setIsSubmitting(false);
                setSweetAlert({
                    show: true,
                    title: 'Berhasil!',
                    text: 'Perubahan profil berhasil disimpan',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    onConfirm: () => {
                        // Reset password fields
                        setData('password', '');
                        setData('password_confirmation', '');

                        // Reload page after dialog is closed
                        window.location.reload();
                    }
                });

                // Reset password fields
                setData('password', '');
                setData('password_confirmation', '');

                // Reload page after a delay
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            },
            onError: (errors) => {
                setIsSubmitting(false);

                let errorMessage = 'Terjadi kesalahan saat menyimpan perubahan.';
                if (errors.avatar) {
                    errorMessage = 'Error foto profil: ' + errors.avatar;
                } else if (errors.resume) {
                    errorMessage = 'Error resume: ' + errors.resume;
                } else if (Object.keys(errors).length > 0) {
                    errorMessage = Object.values(errors)[0];
                }

                showToast(errorMessage, 'error');
                console.error('Form errors:', errors);
            },
            preserveScroll: true
        });
    };

    const handleResumeChange = (file) => {
        if (file) {
            // Validate file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                showToast('Ukuran file terlalu besar! Maksimal 2MB.', 'error');
                return;
            }

            // Validate file type
            const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!validTypes.includes(file.type)) {
                showToast('Format file tidak didukung! Gunakan PDF, DOC, atau DOCX.', 'error');
                return;
            }

            setResumeFile(file);
            setResumeFileName(file.name);
            showToast(`File resume "${file.name}" dipilih dan siap diupload.`, 'info');
        }
    };

    const handleResumeUpload = (e) => {
        e.preventDefault();

        if (!resumeFile) {
            showToast('Pilih file resume terlebih dahulu', 'warning');
            return;
        }

        // Show confirmation dialog first
        setSweetAlert({
            show: true,
            title: 'Upload Resume',
            text: `Anda yakin ingin mengupload resume "${resumeFileName}"?`,
            icon: 'question',
            confirmButtonText: 'Ya, Upload',
            showCancelButton: true,
            cancelButtonText: 'Batal',
            onConfirm: () => performResumeUpload()
        });
    };

    const performResumeUpload = () => {
        // Show loading state
        setIsSubmitting(true);
        setUploadStatus('uploading');
        setResumeUploadProgress(0);

        // Create form data with the file
        const formData = new FormData();
        formData.append('resume', resumeFile);

        // Get CSRF token from meta tag or page props
        const csrf_token = document.querySelector('meta[name="csrf-token"]')?.content || window.page.props.csrf_token;

        console.log('Uploading file:', resumeFile.name, resumeFile.type, resumeFile.size);
        showToast(`Mulai mengupload resume "${resumeFileName}"...`, 'info');

        // Use Axios directly for file upload with proper CSRF token
        axios.post(route('candidate.profile.upload-resume'), formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'X-CSRF-TOKEN': csrf_token,
                'Accept': 'application/json'
            },
            // Set timeout longer for large file uploads
            timeout: 120000, // 120 seconds
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setResumeUploadProgress(percentCompleted);

                if (percentCompleted === 100) {
                    showToast('Upload selesai, menunggu respons server...', 'info');
                }
            }
        })
            .then(response => {
                console.log('Upload successful:', response.data);
                setResumeFile(null);
                setIsSubmitting(false);
                setUploadStatus('success');
                setResumeUploadProgress(100);

                // Show success alert
                setSweetAlert({
                    show: true,
                    title: 'Berhasil!',
                    text: response.data.message || 'Resume berhasil diupload! Sekarang Anda dapat melamar pekerjaan.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    onConfirm: () => {
                        window.location.reload();
                    }
                });
            })
            .catch(error => {
                console.error('Upload error:', error);
                setIsSubmitting(false);
                setUploadStatus('error');

                let errorMessage = 'Terjadi kesalahan saat mengupload resume.';

                // Handle different error scenarios
                if (error.response) {
                    // Server responded with an error status
                    console.error('Error status:', error.response.status);
                    console.error('Error data:', error.response.data);

                    if (error.response.status === 413) {
                        errorMessage = 'File terlalu besar untuk server. Maksimal 2MB.';
                    } else if (error.response.status === 419) {
                        errorMessage = 'Sesi telah berakhir. Halaman akan dimuat ulang dalam beberapa detik.';
                        // Auto reload for CSRF issues
                        setTimeout(() => window.location.reload(), 3000);
                    } else if (error.response.status === 422) {
                        // Get detailed validation errors
                        if (error.response.data.errors?.resume) {
                            errorMessage = `Error validasi: ${error.response.data.errors.resume}`;
                        } else if (error.response.data.message) {
                            errorMessage = `Error validasi: ${error.response.data.message}`;
                        }
                    } else if (error.response.status === 409) {
                        errorMessage = error.response.data.message || 'Konflik saat mengupload file. Mungkin nama file sudah digunakan.';
                    } else if (error.response.status >= 500) {
                        errorMessage = 'Server error. Silakan coba lagi nanti atau hubungi administrator.';
                    }
                } else if (error.request) {
                    // Request made but no response received
                    errorMessage = 'Tidak ada respons dari server. Periksa koneksi internet Anda dan coba lagi.';
                } else if (error.code === 'ECONNABORTED') {
                    errorMessage = 'Waktu upload habis. Periksa koneksi internet Anda atau coba file yang lebih kecil.';
                } else {
                    // Error setting up request
                    errorMessage = `Gagal membuat permintaan: ${error.message}`;
                }

                // Show error toast
                showToast(errorMessage, 'error');

                // Show detailed error in Sweet Alert for persistent error message
                setSweetAlert({
                    show: true,
                    title: 'Gagal Upload Resume',
                    text: errorMessage,
                    icon: 'error',
                    confirmButtonText: 'Coba Lagi',
                    showCancelButton: false
                });
            });
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                window.showToast({
                    message: 'Ukuran foto terlalu besar! Maksimal 2MB',
                    type: 'error',
                    duration: 3000
                })
                return;
            }

            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                window.showToast({
                    message: 'Format file tidak didukung! Gunakan JPG, PNG, atau GIF',
                    type: 'error',
                    duration: 3000
                })
                return;
            }

            // Create preview and set avatar data
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarPreview(e.target.result);
            };
            reader.readAsDataURL(file);

            setData('avatar', file);
            window.showToast({
                message: 'Foto profil dipilih. Klik Simpan Perubahan untuk menyimpan.',
                type: 'info',
                duration: 3000
            })
        }
    };

    const handleCloseNotification = () => {
        setNotification({ ...notification, open: false });
    };

    return (
        <Layout>
            <Head title="Edit Profil" />

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

            <ToastContainerWrapper />

            <Container maxWidth="lg" sx={{ py: 4 }}>
                <MuiCard elevation={0} variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden', mb: 4 }}>
                    <CardHeader
                        title={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                                <Typography variant="h5" component="h1" fontWeight="bold">
                                    Edit Profil
                                </Typography>
                            </Box>
                        }
                        sx={{ backgroundColor: 'primary.lighter', py: 2 }}
                    />
                    <CardContent>
                        <Box component="form" onSubmit={handleSubmit} encType="multipart/form-data">
                            {/* Tabs Navigation */}
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <MuiTabs
                                    value={activeTab}
                                    onChange={handleTabChange}
                                    variant="scrollable"
                                    scrollButtons="auto"
                                    sx={{
                                        '& .MuiTab-root': {
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            borderRadius: '8px 8px 0 0',
                                            minHeight: 48,
                                        },
                                        '& .Mui-selected': {
                                            color: 'primary.main',
                                            fontWeight: 700,
                                        },
                                        '& .MuiTabs-indicator': {
                                            height: 3,
                                            borderRadius: '3px 3px 0 0',
                                        },
                                    }}
                                >
                                    <MuiTab label="Informasi Dasar" />
                                    <MuiTab label="Informasi Kontak" />
                                    <MuiTab label="Pendidikan & Pengalaman" />
                                    <MuiTab label="Media Sosial" />
                                    <MuiTab label="Resume" />
                                </MuiTabs>
                            </Box>

                            {/* Tab Panels */}
                            <TabPanel value={activeTab} index={0}>
                                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: { xs: '100%', md: '30%' }, mb: { xs: 3, md: 0 } }}>
                                        <Paper
                                            elevation={0}
                                            variant="outlined"
                                            sx={{
                                                p: 1,
                                                borderRadius: '50%',
                                                mb: 2,
                                                borderColor: 'primary.lighter',
                                                width: 160,
                                                height: 160,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <Avatar
                                                src={avatarPreview}
                                                sx={{ width: 150, height: 150 }}
                                            />
                                        </Paper>
                                        <input
                                            type="file"
                                            id="avatar-upload"
                                            accept="image/jpeg,image/png,image/jpg,image/gif"
                                            hidden
                                            onChange={handleAvatarChange}
                                        />
                                        <label htmlFor="avatar-upload">
                                            <Button
                                                component="span"
                                                variant="outlined"
                                                size="small"
                                                startIcon={<EditIcon />}
                                                sx={{ borderRadius: 2, mb: 1 }}
                                            >
                                                Ubah Foto
                                            </Button>
                                        </label>
                                        {data.avatar && (
                                            <Typography
                                                variant="caption"
                                                color="primary"
                                                sx={{ mt: 1, display: 'flex', alignItems: 'center' }}
                                            >
                                                <CheckCircleOutlineIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                                {typeof data.avatar === 'object' ? data.avatar.name : 'Foto siap diupload'}
                                            </Typography>
                                        )}
                                        {errors.avatar && (
                                            <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                                                {errors.avatar}
                                            </Typography>
                                        )}
                                    </Box>
                                    <Box sx={{ width: { xs: '100%', md: '70%' } }}>
                                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 2 }}>
                                            <Box sx={{ flex: 1 }}>
                                                <CustomTextField
                                                    label="Nama Lengkap"
                                                    value={data.name}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    error={errors.name}
                                                    required
                                                    startAdornment={<PersonIcon />}
                                                />
                                            </Box>
                                            <Box sx={{ flex: 1 }}>
                                                <CustomTextField
                                                    label="Email"
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    error={errors.email}
                                                    required
                                                    startAdornment={<EmailIcon />}
                                                />
                                            </Box>
                                        </Box>
                                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 2 }}>
                                            <Box sx={{ flex: 1 }}>
                                                <CustomTextField
                                                    label="NIM"
                                                    value={data.nim}
                                                    onChange={(e) => setData('nim', e.target.value)}
                                                    error={errors.nim}
                                                    startAdornment={<BadgeIcon />}
                                                    disabled
                                                />
                                            </Box>
                                        </Box>
                                        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, fontWeight: 'bold' }}>
                                            Ubah Password (Opsional)
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                                            <Box sx={{ flex: 1 }}>
                                                <CustomTextField
                                                    type={showPassword ? 'text' : 'password'}
                                                    label="Password Baru"
                                                    value={data.password}
                                                    onChange={(e) => setData('password', e.target.value)}
                                                    error={errors.password}
                                                    endAdornment={
                                                        <IconButton
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            edge="end"
                                                        >
                                                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                        </IconButton>
                                                    }
                                                />
                                            </Box>
                                            <Box sx={{ flex: 1 }}>
                                                <CustomTextField
                                                    type={showPassword ? 'text' : 'password'}
                                                    label="Konfirmasi Password"
                                                    value={data.password_confirmation}
                                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                                    error={errors.password_confirmation}
                                                    endAdornment={
                                                        <IconButton
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            edge="end"
                                                        >
                                                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                        </IconButton>
                                                    }
                                                />
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            </TabPanel>

                            <TabPanel value={activeTab} index={1}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                                        <Box sx={{ flex: 1 }}>
                                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={id}>
                                                <DatePicker
                                                    label="Tanggal Lahir"
                                                    value={data.date_of_birth ? new Date(data.date_of_birth) : null}
                                                    onChange={(date) => setData('date_of_birth', date ? date.toISOString().split('T')[0] : null)}
                                                    slotProps={{
                                                        textField: {
                                                            variant: 'outlined',
                                                            fullWidth: true,
                                                            error: !!errors.date_of_birth,
                                                            helperText: errors.date_of_birth,
                                                            InputProps: {
                                                                startAdornment: (
                                                                    <InputAdornment position="start">
                                                                        <CalendarMonthIcon />
                                                                    </InputAdornment>
                                                                ),
                                                            },
                                                            sx: {
                                                                mb: 2,
                                                                '& .MuiInputBase-root': {
                                                                    borderRadius: 1.5,
                                                                }
                                                            }
                                                        }
                                                    }}
                                                />
                                            </LocalizationProvider>
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <CustomTextField
                                                label="Nomor Telepon"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                error={errors.phone}
                                                startAdornment={<PhoneIcon />}
                                            />
                                        </Box>
                                    </Box>
                                    <Box>
                                        <CustomTextField
                                            label="Alamat"
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            error={errors.address}
                                            multiline
                                            rows={3}
                                            startAdornment={<HomeIcon />}
                                        />
                                    </Box>
                                </Box>
                            </TabPanel>

                            <TabPanel value={activeTab} index={2}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    <CustomTextField
                                        label="Pendidikan"
                                        placeholder="Contoh: S1 Teknik Informatika, Universitas Indonesia, 2018-2022"
                                        value={data.education}
                                        onChange={(e) => setData('education', e.target.value)}
                                        error={errors.education}
                                        multiline
                                        rows={3}
                                        startAdornment={<SchoolIcon />}
                                    />
                                    <CustomTextField
                                        label="Pengalaman"
                                        placeholder="Contoh: Software Engineer di PT. XYZ (2022-sekarang)"
                                        value={data.experience}
                                        onChange={(e) => setData('experience', e.target.value)}
                                        error={errors.experience}
                                        multiline
                                        rows={3}
                                        startAdornment={<WorkIcon />}
                                    />
                                    <CustomTextField
                                        label="Keahlian"
                                        placeholder="Contoh: Java, Python, React, SQL, Cloud Computing"
                                        value={data.skills}
                                        onChange={(e) => setData('skills', e.target.value)}
                                        error={errors.skills}
                                        multiline
                                        rows={3}
                                    />
                                </Box>
                            </TabPanel>

                            <TabPanel value={activeTab} index={3}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                                        <Box sx={{ flex: 1 }}>
                                            <CustomTextField
                                                label="LinkedIn URL"
                                                placeholder="https://linkedin.com/in/username"
                                                value={data.linkedin}
                                                onChange={(e) => setData('linkedin', e.target.value)}
                                                error={errors.linkedin}
                                                startAdornment={<LinkedInIcon />}
                                            />
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <CustomTextField
                                                label="Website Personal"
                                                placeholder="https://example.com"
                                                value={data.website}
                                                onChange={(e) => setData('website', e.target.value)}
                                                error={errors.website}
                                                startAdornment={<LanguageIcon />}
                                            />
                                        </Box>
                                    </Box>
                                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                                        <Box sx={{ flex: 1 }}>
                                            <CustomTextField
                                                label="Twitter URL"
                                                placeholder="https://twitter.com/username"
                                                value={data.twitter}
                                                onChange={(e) => setData('twitter', e.target.value)}
                                                error={errors.twitter}
                                                startAdornment={<TwitterIcon />}
                                            />
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <CustomTextField
                                                label="GitHub URL"
                                                placeholder="https://github.com/username"
                                                value={data.github}
                                                onChange={(e) => setData('github', e.target.value)}
                                                error={errors.github}
                                                startAdornment={<GitHubIcon />}
                                            />
                                        </Box>
                                    </Box>
                                </Box>
                            </TabPanel>

                            <TabPanel value={activeTab} index={4}>
                                <Paper elevation={0} variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                        <UploadFileIcon sx={{ mr: 1 }} /> Upload Resume
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        Upload resume/CV Anda dalam format PDF, DOC, atau DOCX. Maksimal ukuran file 2MB.
                                    </Typography>
                                    <Divider sx={{ my: 2 }} />

                                    {/* Current resume status */}
                                    {profile?.resume_url && (
                                        <Box sx={{ mb: 3, p: 2, bgcolor: 'success.lighter', borderRadius: 1 }}>
                                            <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <CheckCircleOutlineIcon sx={{ mr: 1, color: 'success.main' }} />
                                                Resume tersedia
                                            </Typography>
                                            <Typography variant="body2" sx={{ mb: 1 }}>
                                                {profile.resume_name || 'resume.pdf'}
                                            </Typography>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                href={profile.resume_url}
                                                target="_blank"
                                                startIcon={<VisibilityIcon />}
                                                sx={{ mr: 1 }}
                                            >
                                                Lihat Resume
                                            </Button>
                                        </Box>
                                    )}

                                    {/* Upload progress indicator */}
                                    {uploadStatus === 'uploading' && (
                                        <Box sx={{ mt: 2, mb: 3 }}>
                                            <Typography variant="body2" sx={{ mb: 1 }}>
                                                Mengupload resume... {resumeUploadProgress}%
                                            </Typography>
                                            <LinearProgress
                                                variant="determinate"
                                                value={resumeUploadProgress}
                                                sx={{ height: 10, borderRadius: 5 }}
                                            />
                                        </Box>
                                    )}

                                    {/* File input field */}
                                    <Box sx={{ mb: 3 }}>
                                        <input
                                            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                            id="resume-upload"
                                            type="file"
                                            name="resume"
                                            hidden
                                            onChange={(e) => handleResumeChange(e.target.files[0])}
                                        />
                                        <label htmlFor="resume-upload">
                                            <Button
                                                variant="contained"
                                                component="span"
                                                startIcon={<UploadFileIcon />}
                                                sx={{ mb: 2, borderRadius: '8px' }}
                                                disabled={isSubmitting}
                                            >
                                                Pilih File Resume
                                            </Button>
                                        </label>

                                        {resumeFileName && (
                                            <Typography variant="body2" sx={{ ml: 1, display: 'inline-flex', alignItems: 'center' }}>
                                                <CheckCircleOutlineIcon fontSize="small" sx={{ mr: 0.5, color: 'success.main' }} />
                                                {resumeFileName}
                                            </Typography>
                                        )}

                                        <Typography variant="caption" color="text.secondary" display="block">
                                            Format yang didukung: PDF, DOC, DOCX. Maksimal ukuran file: 2MB
                                        </Typography>
                                    </Box>

                                    <Button
                                        variant="contained"
                                        color="primary"
                                        disabled={!resumeFile || isSubmitting}
                                        onClick={handleResumeUpload}
                                        startIcon={<UploadFileIcon />}
                                        sx={{ borderRadius: '8px' }}
                                    >
                                        {isSubmitting ? 'Mengupload...' : 'Upload Resume'}
                                    </Button>

                                    {/* Resume tips */}
                                    <Box sx={{ mt: 3, bgcolor: 'info.lighter', p: 2, borderRadius: 2 }}>
                                        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                                            Tips Resume Efektif:
                                        </Typography>
                                        <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
                                            <li>Gunakan format yang jelas dan mudah dibaca</li>
                                            <li>Sesuaikan resume dengan posisi yang dilamar</li>
                                            <li>Tonjolkan pencapaian dan keterampilan relevan</li>
                                            <li>Pastikan tidak ada kesalahan penulisan</li>
                                            <li>Jangan melebihi 2 halaman</li>
                                        </Typography>
                                    </Box>
                                </Paper>
                            </TabPanel>

                            <Divider sx={{ my: 3 }} />

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    startIcon={<SaveIcon />}
                                    disabled={isSubmitting || processing}
                                    sx={{
                                        fontWeight: 'bold',
                                        borderRadius: 2,
                                        py: 1.2,
                                        px: 3,
                                        '&.Mui-disabled': {
                                            opacity: 0.7,
                                        }
                                    }}
                                >
                                    {isSubmitting || processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </Button>
                            </Box>
                        </Box>
                    </CardContent>
                </MuiCard>
            </Container>

            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <MuiAlert
                    elevation={6}
                    variant="filled"
                    onClose={handleCloseNotification}
                    severity={notification.severity}
                    sx={{ width: '100%', borderRadius: 2 }}
                >
                    {notification.message}
                </MuiAlert>
            </Snackbar>
        </Layout>
    );
}
