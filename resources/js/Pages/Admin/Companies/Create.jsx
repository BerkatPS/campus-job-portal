import React, { useState, useEffect } from 'react';
import { Head, usePage, Link, useForm } from '@inertiajs/react';
import {
    Box,
    Typography,
    Divider,
    Stack,
    Avatar,
    Paper,
    IconButton,
    Tooltip,
    Chip,
    useTheme,
    alpha,
    TextField,
    MenuItem,
} from '@mui/material';
import {
    Business as BusinessIcon,
    ArrowBack as ArrowBackIcon,
    Save as SaveIcon,
    CameraAlt as CameraAltIcon,
    InfoOutlined as InfoIcon,
    WebAsset as WebsiteIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    LocationOn as LocationIcon,
    Category as CategoryIcon,
    ToggleOn as ToggleOnIcon,
    Phone
} from '@mui/icons-material';

// Import custom components
import Card from '@/Components/Shared/Card';
import Button from '@/Components/Shared/Button';
import Input from '@/Components/Shared/Input';
import TextArea from '@/Components/Shared/TextArea';
import FormGroup from '@/Components/Shared/FormGroup';
import FileUpload from '@/Components/Shared/FileUpload';
import Checkbox from '@/Components/Shared/Checkbox';
import Alert from '@/Components/Shared/Alert';
import Layout from '@/Components/Layout/Layout';

const CompanyCreate = ({ industries = [], company = null, }) => {
    const { auth } = usePage().props;
    const theme = useTheme();
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('error');
    const [logoPreview, setLogoPreview] = useState(null);
    const [logoFile, setLogoFile] = useState(null);

    const { data, setData, post, put, processing, errors } = useForm({
        name: company?.name || '',
        description: company?.description || '',
        logo: null, // File object
        website: company?.website || '',
        address: company?.address || '',
        phone: company?.phone || '',
        email: company?.email || '',
        industry: company?.industry || '',
        is_active: company?.is_active ?? true,
    });


    const handleSubmit = (e) => {
        e.preventDefault();

        // Buat FormData object dengan benar
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description || '');
        formData.append('website', data.website || '');
        formData.append('address', data.address || '');
        formData.append('phone', data.phone || '');
        formData.append('email', data.email || '');
        formData.append('industry', data.industry || '');
        formData.append('is_active', data.is_active ? '1' : '0');

        // Pastikan logoFile adalah objek File yang valid
        if (logoFile) {
            formData.append('logo', logoFile);
        }

        // PENTING: Kirim formData langsung, bukan di dalam objek data
        post(route('admin.companies.store'), formData, {
            onSuccess: () => {
                // Success handling
            },
            onError: (errors) => {
                console.error('Form validation errors:', errors);
                setAlertMessage('Please check the form for errors.');
                setAlertSeverity('error');
                setShowAlert(true);
                window.scrollTo(0, 0);
            },
        });
    };



    const handleFileChange = (file) => {
        if (!file) {
            setLogoFile(null);
            setLogoPreview(null);
            setData('logo', null);
            return;
        }

        setLogoFile(file);

        // Create preview URL
        const reader = new FileReader();
        reader.onload = (e) => {
            setLogoPreview(e.target.result);
        };
        reader.readAsDataURL(file);
    };

    return (
        <Layout>
            <Head title="Create Company" />

            {/* Header Section */}
            <Box
                sx={{
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.primary.main, 0.15)} 100%)`,
                    py: 4,
                    borderRadius: '1rem',
                    px: 3,
                    mb: 4,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                    border: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Link href={route('admin.companies.index')}>
                            <IconButton
                                sx={{
                                    mr: 2,
                                    bgcolor: 'background.paper',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                    '&:hover': { bgcolor: 'background.paper', opacity: 0.9 }
                                }}
                            >
                                <ArrowBackIcon />
                            </IconButton>
                        </Link>
                        <Box>
                            <Typography variant="h5" fontWeight="600">
                                Create New Company
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Add a new company to the platform
                            </Typography>
                        </Box>
                    </Box>

                    <Box>
                        <Chip
                            icon={<BusinessIcon fontSize="small" />}
                            label="New Company"
                            color="primary"
                            sx={{ borderRadius: '0.75rem', fontWeight: 500, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                        />
                    </Box>
                </Box>
            </Box>

            {showAlert && (
                <Alert
                    severity={alertSeverity}
                    onClose={() => setShowAlert(false)}
                    sx={{ mb: 3, borderRadius: '0.75rem', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
                >
                    {alertMessage}
                </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                    {/* Left Column - Company Info & Contact */}
                    <Box sx={{ flex: '1 1 65%' }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: '1rem',
                                border: '1px solid',
                                borderColor: 'divider',
                                mb: 3
                            }}
                        >
                            <Typography variant="h6" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <InfoIcon fontSize="small" color="primary" />
                                Company Information
                            </Typography>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <Box>
                                    <Input
                                        label="Company Name"
                                        name="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                        error={!!errors.name}
                                        helperText={errors.name}
                                        fullWidth
                                        placeholder="Enter company name"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '0.75rem',
                                            }
                                        }}
                                    />
                                </Box>

                                <Box>
                                    <TextArea
                                        label="Description"
                                        name="description"
                                        value={data.description || ''}
                                        onChange={(e) => setData('description', e.target.value)}
                                        error={!!errors.description}
                                        helperText={errors.description}
                                        rows={4}
                                        fullWidth
                                        placeholder="Enter company description"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '0.75rem',
                                            }
                                        }}
                                    />
                                </Box>

                                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
                                    <Box sx={{ flex: 1 }}>
                                        <Input
                                            label="Website"
                                            name="website"
                                            value={data.website || ''}
                                            onChange={(e) => setData('website', e.target.value)}
                                            error={!!errors.website}
                                            helperText={errors.website}
                                            fullWidth
                                            placeholder="e.g., www.company.com"
                                            startAdornment={
                                                <WebsiteIcon color="action" fontSize="small" sx={{ mr: 1 }} />
                                            }
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '0.75rem',
                                                }
                                            }}
                                        />
                                    </Box>

                                    <Box sx={{ flex: 1 }}>
                                        <TextField
                                            select
                                            label="Industry"
                                            name="industry"
                                            value={data.industry || ''}
                                            onChange={(e) => setData('industry', e.target.value)}
                                            error={!!errors.industry}
                                            helperText={errors.industry || "Select an industry or type a new one"}
                                            fullWidth
                                            InputProps={{
                                                startAdornment: (
                                                    <CategoryIcon color="action" fontSize="small" sx={{ mr: 1 }} />
                                                ),
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '0.75rem',
                                                }
                                            }}
                                        >
                                            {industries && industries.length > 0 ? (
                                                <>
                                                    <MenuItem value="">
                                                        <em>Select an industry</em>
                                                    </MenuItem>
                                                    {industries.map((industry, index) => (
                                                        <MenuItem key={index} value={industry}>
                                                            {industry}
                                                        </MenuItem>
                                                    ))}
                                                </>
                                            ) : (
                                                <MenuItem value="">No industries available</MenuItem>
                                            )}
                                        </TextField>
                                    </Box>
                                </Box>
                            </Box>
                        </Paper>

                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: '1rem',
                                border: '1px solid',
                                borderColor: 'divider'
                            }}
                        >
                            <Typography variant="h6" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Phone fontSize="small" color="primary" />
                                Contact Information
                            </Typography>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
                                    <Box sx={{ flex: 1 }}>
                                        <Input
                                            label="Email"
                                            name="email"
                                            type="email"
                                            value={data.email || ''}
                                            onChange={(e) => setData('email', e.target.value)}
                                            error={!!errors.email}
                                            helperText={errors.email}
                                            fullWidth
                                            placeholder="Enter contact email"
                                            startAdornment={
                                                <EmailIcon color="action" fontSize="small" sx={{ mr: 1 }} />
                                            }
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '0.75rem',
                                                }
                                            }}
                                        />
                                    </Box>

                                    <Box sx={{ flex: 1 }}>
                                        <Input
                                            label="Phone"
                                            name="phone"
                                            value={data.phone || ''}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            error={!!errors.phone}
                                            helperText={errors.phone}
                                            fullWidth
                                            placeholder="Enter contact phone"
                                            startAdornment={
                                                <PhoneIcon color="action" fontSize="small" sx={{ mr: 1 }} />
                                            }
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '0.75rem',
                                                }
                                            }}
                                        />
                                    </Box>
                                </Box>

                                <Box>
                                    <TextArea
                                        label="Address"
                                        name="address"
                                        value={data.address || ''}
                                        onChange={(e) => setData('address', e.target.value)}
                                        error={!!errors.address}
                                        helperText={errors.address}
                                        rows={3}
                                        fullWidth
                                        placeholder="Enter company address"
                                        startAdornment={
                                            <LocationIcon color="action" fontSize="small" sx={{ mr: 1 }} />
                                        }
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '0.75rem',
                                            }
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Paper>
                    </Box>

                    {/* Right Column - Logo & Status */}
                    <Box sx={{ flex: '1 1 35%', display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: '1rem',
                                border: '1px solid',
                                borderColor: 'divider',
                                height: 'fit-content'
                            }}
                        >
                            <Typography variant="h6" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CameraAltIcon fontSize="small" color="primary" />
                                Company Logo
                            </Typography>

                            <Box sx={{
                                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                                borderRadius: '1rem',
                                p: 3,
                                textAlign: 'center',
                                border: '1px dashed',
                                borderColor: alpha(theme.palette.primary.main, 0.3),
                                mb: 2
                            }}>
                                {logoPreview ? (
                                    <Box sx={{ position: 'relative', mb: 2 }}>
                                        <Avatar
                                            src={logoPreview}
                                            alt="Company Logo Preview"
                                            variant="rounded"
                                            sx={{
                                                width: 120,
                                                height: 120,
                                                mx: 'auto',
                                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                                            }}
                                        >
                                            <BusinessIcon fontSize="large" />
                                        </Avatar>
                                        <IconButton
                                            sx={{
                                                position: 'absolute',
                                                bottom: -10,
                                                right: '50%',
                                                transform: 'translateX(50%)',
                                                bgcolor: 'primary.main',
                                                color: 'white',
                                                '&:hover': {
                                                    bgcolor: 'primary.dark'
                                                },
                                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                                            }}
                                            onClick={() => document.getElementById('company-logo-upload').click()}
                                        >
                                            <CameraAltIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                ) : (
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: 2,
                                            mb: 2
                                        }}
                                    >
                                        <Avatar
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                color: 'primary.main',
                                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                                            }}
                                        >
                                            <BusinessIcon fontSize="large" />
                                        </Avatar>
                                        <Typography variant="body2" color="text.secondary">
                                            No logo uploaded
                                        </Typography>
                                    </Box>
                                )}

                                <input
                                    id="company-logo-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e.target.files[0] || null)}
                                    style={{ display: 'none' }}
                                />

                                <Button
                                    variant="outlined"
                                    startIcon={<CameraAltIcon />}
                                    onClick={() => document.getElementById('company-logo-upload').click()}
                                    sx={{
                                        textTransform: 'none',
                                        borderRadius: '2rem',
                                        px: 3
                                    }}
                                >
                                    {logoPreview ? 'Change Logo' : 'Upload Logo'}
                                </Button>

                                {errors.logo && (
                                    <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                                        {errors.logo}
                                    </Typography>
                                )}

                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                    Recommended: Square image, max 2MB
                                </Typography>
                            </Box>
                        </Paper>

                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: '1rem',
                                border: '1px solid',
                                borderColor: 'divider',
                                height: 'fit-content'
                            }}
                        >
                            <Typography variant="h6" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <ToggleOnIcon fontSize="small" color="primary" />
                                Company Status
                            </Typography>

                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                backgroundColor: alpha(theme.palette.success.main, data.is_active ? 0.1 : 0.05),
                                borderRadius: '1rem',
                                p: 2,
                                border: '1px solid',
                                borderColor: alpha(theme.palette.success.main, data.is_active ? 0.3 : 0.1),
                            }}>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight={500}>
                                        {data.is_active ? 'Active' : 'Inactive'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {data.is_active
                                            ? 'Company will be visible to users'
                                            : 'Company will be hidden from users'}
                                    </Typography>
                                </Box>

                                <Checkbox
                                    name="is_active"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    color="success"
                                    sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                                />
                            </Box>
                        </Paper>
                    </Box>
                </Box>

                <Box sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 2,
                    mt: 4,
                    position: 'sticky',
                    bottom: 24,
                    zIndex: 10
                }}>
                    <Paper
                        elevation={3}
                        sx={{
                            display: 'flex',
                            gap: 2,
                            p: 1.5,
                            borderRadius: '3rem',
                            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <Button
                            type="button"
                            variant="outlined"
                            onClick={() => {
                                reset();
                                setLogoPreview(null);
                                setLogoFile(null);
                            }}
                            disabled={processing}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 600,
                                borderRadius: '2rem',
                                px: 3
                            }}
                        >
                            Reset Form
                        </Button>

                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={<SaveIcon />}
                            loading={processing}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 600,
                                borderRadius: '2rem',
                                px: 3,
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                            }}
                        >
                            Create Company
                        </Button>
                    </Paper>
                </Box>
            </Box>
        </Layout>
    );
};

export default CompanyCreate;
