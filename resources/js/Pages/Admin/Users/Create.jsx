import React, { useState } from 'react';
import { Head, Link, usePage, useForm } from '@inertiajs/react';
import {
    Box,
    Typography,
    Divider,
    Stack,
    InputAdornment,
    Paper,
    Avatar,
    alpha,
    Chip,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    useTheme,
    Tooltip,
    Button as MuiButton,
    FormControlLabel,
    Switch
} from '@mui/material';
import {
    Person as PersonIcon,
    ArrowBack as ArrowBackIcon,
    Save as SaveIcon,
    Email as EmailIcon,
    Lock as LockIcon,
    Badge as BadgeIcon,
    AccountCircle as AccountCircleIcon,
    Security as SecurityIcon,
    Settings as SettingsIcon,
    PhotoCamera as PhotoCameraIcon,
    Info as InfoIcon,
    HelpOutline as HelpOutlineIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    AddAPhoto as AddAPhotoIcon,
    CloudUpload as CloudUploadIcon,
    VerifiedUser as VerifiedUserIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// Import custom components
import Card from '@/Components/Shared/Card';
import Input from '@/Components/Shared/Input';
import Button from '@/Components/Shared/Button';
import Select from '@/Components/Shared/Select';
import Alert from '@/Components/Shared/Alert';
import Layout from '@/Components/Layout/Layout';

const UserCreate = ({ roles = [] }) => {
    const { auth } = usePage().props;
    const theme = useTheme();
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('error');
    const [activeStep, setActiveStep] = useState(0);
    const [avatarPreview, setAvatarPreview] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role_id: '',
        avatar: null,
        is_active: true,
        nim: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        // Create FormData object to handle file upload
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (key === 'avatar' && data[key] !== null) {
                formData.append(key, data[key]);
            } else if (key !== 'avatar') {
                formData.append(key, data[key]);
            }
        });

        post(route('admin.users.store'), {
            data: formData,
            forceFormData: true,
            onSuccess: () => {
                // Redirect happens automatically
            },
            onError: (errors) => {
                setAlertMessage('Please check the form for errors.');
                setAlertSeverity('error');
                setShowAlert(true);
                window.scrollTo(0, 0);

                // If there are errors related to a specific step, navigate to that step
                if (errors.name || errors.email || errors.nim) {
                    setActiveStep(0);
                } else if (errors.password || errors.password_confirmation) {
                    setActiveStep(1);
                } else if (errors.role_id || errors.avatar) {
                    setActiveStep(2);
                }
            },
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('avatar', file);

            // Create preview URL
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarPreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleNextStep = () => {
        setActiveStep((prevStep) => prevStep + 1);
    };

    const handlePrevStep = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const steps = [
        {
            label: 'Basic Information',
            description: 'Enter user basic information',
            icon: <PersonIcon />,
            content: (
                <Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Input
                            label="Full Name"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            error={errors.name}
                            helperText={errors.name}
                            fullWidth
                            placeholder="Enter user's full name"
                            startAdornment={<InputAdornment position="start"><PersonIcon color="primary" /></InputAdornment>}
                        />

                        <Input
                            label="Email Address"
                            name="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            error={errors.email}
                            helperText={errors.email}
                            fullWidth
                            placeholder="example@email.com"
                            startAdornment={<InputAdornment position="start"><EmailIcon color="primary" /></InputAdornment>}
                        />

                        <Input
                            label="NIM/Student ID"
                            name="nim"
                            value={data.nim}
                            onChange={(e) => setData('nim', e.target.value)}
                            error={errors.nim}
                            helperText={errors.nim || "Only required for student accounts"}
                            fullWidth
                            placeholder="Enter NIM if available"
                            startAdornment={<InputAdornment position="start"><BadgeIcon color="primary" /></InputAdornment>}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                        <Button onClick={handleNextStep} variant="contained" endIcon={<SecurityIcon />}>
                            Next: Security
                        </Button>
                    </Box>
                </Box>
            )
        },
        {
            label: 'Security',
            description: 'Set user password',
            icon: <SecurityIcon />,
            content: (
                <Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            required
                            error={errors.password}
                            helperText={errors.password || "Minimum 8 characters"}
                            fullWidth
                            startAdornment={<InputAdornment position="start"><LockIcon color="primary" /></InputAdornment>}
                        />

                        <Input
                            label="Confirm Password"
                            name="password_confirmation"
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                            error={errors.password_confirmation}
                            helperText={errors.password_confirmation}
                            fullWidth
                            startAdornment={<InputAdornment position="start"><LockIcon color="primary" /></InputAdornment>}
                        />
                    </Box>

                    <Paper elevation={0} sx={{ mt: 3, p: 2, bgcolor: alpha(theme.palette.info.main, 0.05), border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`, borderRadius: 2, display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                        <InfoIcon color="info" sx={{ mt: 0.5 }} />
                        <Box>
                            <Typography variant="subtitle2" color="info.main" gutterBottom>
                                Password Security Tips
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Use a combination of uppercase letters, lowercase letters, numbers, and symbols for a strong password.
                                Avoid using easily guessable personal information like birth dates.
                            </Typography>
                        </Box>
                    </Paper>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                        <Button onClick={handlePrevStep} variant="outlined" startIcon={<ArrowBackIcon />}>
                            Back
                        </Button>
                        <Button onClick={handleNextStep} variant="contained" endIcon={<SettingsIcon />}>
                            Next: Settings
                        </Button>
                    </Box>
                </Box>
            )
        },
        {
            label: 'Settings',
            description: 'Choose role and profile photo',
            icon: <SettingsIcon />,
            content: (
                <Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <VerifiedUserIcon fontSize="small" color="primary" />
                                Role & Status
                            </Typography>

                            <Select
                                label="User Role"
                                name="role_id"
                                value={data.role_id}
                                onChange={(e) => setData('role_id', e.target.value)}
                                options={(roles || []).map(role => ({
                                    value: role.id.toString(),
                                    label: role.name
                                }))}
                                required
                                error={errors.role_id}
                                helperText={errors.role_id || "Select an appropriate role for this user"}
                            />

                            <Box sx={{ mt: 3, p: 2, border: `1px solid ${alpha(theme.palette.divider, 0.1)}`, borderRadius: 2, bgcolor: alpha(theme.palette.background.paper, 0.5) }}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={data.is_active}
                                            onChange={(e) => setData('is_active', e.target.checked)}
                                            color="success"
                                        />
                                    }
                                    label="Active Account"
                                />
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: 2 }}>
                                    Inactive accounts cannot log into the system
                                </Typography>
                                <Box sx={{ mt: 1, p: 1, bgcolor: data.is_active ? alpha(theme.palette.success.main, 0.05) : alpha(theme.palette.error.main, 0.05), borderRadius: 1, border: `1px solid ${data.is_active ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.error.main, 0.1)}` }}>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        {data.is_active ? (
                                            <>
                                                <CheckCircleIcon fontSize="inherit" color="success" />
                                                User can immediately log in after creation
                                            </>
                                        ) : (
                                            <>
                                                <CancelIcon fontSize="inherit" color="error" />
                                                User cannot log in until account is activated
                                            </>
                                        )}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PhotoCameraIcon fontSize="small" color="primary" />
                                Profile Photo
                            </Typography>

                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
                                <Avatar src={avatarPreview} alt={data.name || "Preview"} sx={{ width: 120, height: 120, mb: 2, fontSize: '3rem', bgcolor: avatarPreview ? 'transparent' : alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main, border: `4px solid ${alpha(theme.palette.primary.main, 0.1)}` }}>
                                    {!avatarPreview && (data.name ? data.name.charAt(0).toUpperCase() : <PersonIcon sx={{ fontSize: 60 }} />)}
                                </Avatar>

                                <Box>
                                    <input
                                        id="avatar-upload"
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={handleFileChange}
                                    />
                                    <Button
                                        component="label"
                                        htmlFor="avatar-upload"
                                        variant="outlined"
                                        startIcon={<CloudUploadIcon />}
                                    >
                                        Upload Photo
                                    </Button>
                                </Box>

                                {errors.avatar && (
                                    <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                                        {errors.avatar}
                                    </Typography>
                                )}

                                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                                    Upload profile photo (max 2MB)
                                </Typography>

                                {avatarPreview && (
                                    <Button
                                        variant="text"
                                        color="error"
                                        size="small"
                                        onClick={() => {
                                            setAvatarPreview(null);
                                            setData('avatar', null);
                                        }}
                                        sx={{ mt: 1 }}
                                    >
                                        Remove Photo
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                        <Button onClick={handlePrevStep} variant="outlined" startIcon={<ArrowBackIcon />}>
                            Back
                        </Button>
                        <Button type="submit" variant="contained" color="primary" startIcon={<SaveIcon />} loading={processing}>
                            Create User
                        </Button>
                    </Box>
                </Box>
            )
        }
    ];

    return (
        <Layout>
            <Head title="Create New User" />

            {/* Alert Message */}
            <AnimatePresence>
                {showAlert && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Alert
                            severity={alertSeverity}
                            onClose={() => setShowAlert(false)}
                            sx={{ mb: 3 }}
                        >
                            {alertMessage}
                        </Alert>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header Section */}
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ width: 56, height: 56, bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}>
                        <PersonIcon fontSize="large" />
                    </Avatar>
                    <Box>
                        <Typography variant="h4" component="h1" fontWeight={700}>
                            Create New User
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Add a new user to the system
                        </Typography>
                    </Box>
                </Box>

                <Button variant="outlined" startIcon={<ArrowBackIcon />} component={Link} href={route('admin.users.index')}>
                    Back to Users List
                </Button>
            </Box>

            {/* Progress Steps Indicator */}
            <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.04)', border: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((step, index) => (
                        <Step key={step.label}>
                            <StepLabel StepIconProps={{ icon: step.icon, sx: { color: activeStep >= index ? theme.palette.primary.main : undefined } }}>
                                <Typography variant="subtitle2" fontWeight={600}>{step.label}</Typography>
                                <Typography variant="caption" color="text.secondary">{step.description}</Typography>
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Paper>

            {/* Main Form */}
            <Box component="form" onSubmit={handleSubmit}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.04)', border: `1px solid ${alpha(theme.palette.divider, 0.1)}`, mb: 3 }}>
                    <Box>
                        {steps[activeStep].content}
                    </Box>
                </Paper>
            </Box>
        </Layout>
    );
};

export default UserCreate;
