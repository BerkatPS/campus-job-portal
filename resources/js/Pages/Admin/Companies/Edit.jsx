import React, { useState, useEffect } from 'react';
import { Head, usePage, Link, useForm } from '@inertiajs/react';
import {
    Box,
    Typography,
    Divider,
    Avatar,
    Paper,
    alpha,
    Tooltip,
    Chip,
    useTheme,
    Tab,
    Tabs,
    Stack
} from '@mui/material';
import {
    Business as BusinessIcon,
    ArrowBack as ArrowBackIcon,
    Save as SaveIcon,
    Edit as EditIcon,
    LocationOn as LocationOnIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Language as LanguageIcon,
    Category as CategoryIcon,
    Description as DescriptionIcon,
    Info as InfoIcon,
    CheckCircleOutline as CheckCircleOutlineIcon,
    DoDisturbOn as DoDisturbOnIcon,
    CloudUpload as CloudUploadIcon,
    Cancel as CancelIcon,
    ContactMail as ContactMailIcon,
    Image as ImageIcon,
    Tune as TuneIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// Import custom components
import Button from '@/Components/Shared/Button';
import Input from '@/Components/Shared/Input';
import TextArea from '@/Components/Shared/TextArea';
import FormGroup from '@/Components/Shared/FormGroup';
import FileUpload from '@/Components/Shared/FileUpload';
import Checkbox from '@/Components/Shared/Checkbox';
import Alert from '@/Components/Shared/Alert';
import Layout from '@/Components/Layout/Layout';

const CompanyEdit = ({ company = {} }) => {
    const { auth } = usePage().props;
    const theme = useTheme();
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('error');
    const [activeTab, setActiveTab] = useState(0);
    const [logoPreview, setLogoPreview] = useState(company?.logo || null);

    const { data, setData, post, processing, errors, reset } = useForm({
        _method: 'PUT', // For method spoofing in Laravel
        name: company?.name || '',
        description: company?.description || '',
        logo: null, // We'll only submit this if a new image is uploaded
        website: company?.website || '',
        address: company?.address || '',
        phone: company?.phone || '',
        email: company?.email || '',
        industry: company?.industry || '',
        is_active: company?.is_active || false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route('admin.companies.update', company?.id), {
            onSuccess: () => {
                setAlertMessage('Company updated successfully.');
                setAlertSeverity('success');
                setShowAlert(true);
            },
            onError: (errors) => {
                setAlertMessage('Please check the form for errors.');
                setAlertSeverity('error');
                setShowAlert(true);

                // Scroll to top to see the alert
                window.scrollTo(0, 0);
            },
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setData('logo', file);

        // Create a preview for the logo
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const resetForm = () => {
        // Reset to original values
        setData({
            _method: 'PUT',
            name: company?.name || '',
            description: company?.description || '',
            logo: null,
            website: company?.website || '',
            address: company?.address || '',
            phone: company?.phone || '',
            email: company?.email || '',
            industry: company?.industry || '',
            is_active: company?.is_active || false,
        });
        setLogoPreview(company?.logo || null);
    };

    return (
        <Layout>
            <Head title={`Edit Company: ${company?.name || ''}`} />

            {/* Header Section */}
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                        sx={{
                            width: 56,
                            height: 56,
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                        }}
                    >
                        <EditIcon fontSize="large" />
                    </Avatar>
                    <Box>
                        <Typography variant="h4" component="h1" fontWeight={700}>
                            Edit Company
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Update company information and status
                        </Typography>
                    </Box>
                </Box>

                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    component={Link}
                    href={route('admin.companies.index')}
                >
                    Back to Companies
                </Button>
            </Box>

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
                            dense={true}
                            autoHideDuration={3000}
                        >
                            {alertMessage}
                        </Alert>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Company Profile Card */}
            <Paper
                elevation={0}
                sx={{
                    mb: 3,
                    p: 3,
                    borderRadius: 3,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { sm: 'center' }, gap: 2 }}>
                    <Avatar
                        src={company?.logo || null}
                        alt={company?.name || 'Company'}
                        variant="rounded"
                        sx={{
                            width: 80,
                            height: 80,
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            boxShadow: `0 4px 8px ${alpha(theme.palette.common.black, 0.1)}`,
                        }}
                    >
                        {!company?.logo && <BusinessIcon fontSize="large" color="primary" />}
                    </Avatar>

                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h5" fontWeight={600}>
                            {company?.name || 'Company Name'}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1, flexWrap: 'wrap' }}>
                            <Chip
                                label={company?.industry || 'No Industry'}
                                size="small"
                                color="primary"
                                variant={company?.industry ? 'filled' : 'outlined'}
                                icon={<CategoryIcon fontSize="small" />}
                                sx={{
                                    fontWeight: 500,
                                    bgcolor: company?.industry ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                                    color: company?.industry ? theme.palette.primary.main : theme.palette.text.disabled,
                                }}
                            />

                            <Chip
                                label={company?.is_active ? 'Active' : 'Inactive'}
                                size="small"
                                color={company?.is_active ? 'success' : 'default'}
                                variant={company?.is_active ? 'filled' : 'outlined'}
                                icon={company?.is_active ? <CheckCircleOutlineIcon fontSize="small" /> : <DoDisturbOnIcon fontSize="small" />}
                                sx={{
                                    fontWeight: 500,
                                    bgcolor: company?.is_active ? alpha(theme.palette.success.main, 0.1) : 'transparent',
                                    color: company?.is_active ? theme.palette.success.dark : theme.palette.text.disabled,
                                }}
                            />

                            {company?.website && (
                                <Tooltip title="Visit Website">
                                    <Chip
                                        icon={<LanguageIcon fontSize="small" />}
                                        label="Website"
                                        size="small"
                                        color="info"
                                        variant="outlined"
                                        component="a"
                                        href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        clickable
                                        sx={{ fontWeight: 500 }}
                                    />
                                </Tooltip>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Paper>

            {/* Main Form Content */}
            <Box component="form" onSubmit={handleSubmit}>
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: 3,
                        boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        overflow: 'hidden',
                        mb: 3,
                    }}
                >
                    {/* Tabs Navigation */}
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            value={activeTab}
                            onChange={handleTabChange}
                            aria-label="company edit tabs"
                            sx={{
                                px: 3,
                                '.MuiTabs-indicator': {
                                    height: 3,
                                    borderTopLeftRadius: 3,
                                    borderTopRightRadius: 3,
                                },
                                '.MuiTab-root': {
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    fontSize: '0.95rem',
                                    py: 2,
                                    minHeight: 48,
                                }
                            }}
                        >
                            <Tab
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <BusinessIcon fontSize="small" />
                                        <span>Company Information</span>
                                    </Box>
                                }
                            />
                            <Tab
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <ContactMailIcon fontSize="small" />
                                        <span>Contact Details</span>
                                    </Box>
                                }
                            />
                            <Tab
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <TuneIcon fontSize="small" />
                                        <span>Settings</span>
                                    </Box>
                                }
                            />
                        </Tabs>
                    </Box>

                    {/* Tab Content */}
                    <Box sx={{ p: 3 }}>
                        {/* Company Information Tab */}
                        {activeTab === 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                                    <Box sx={{ flex: 2 }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                            <FormGroup
                                                label="Company Name"
                                                required
                                                icon={<BusinessIcon fontSize="small" sx={{ opacity: 0.7 }} />}
                                                marginBottom="medium"
                                            >
                                                <Input
                                                    name="name"
                                                    value={data.name}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    required
                                                    error={errors.name}
                                                    helperText={errors.name}
                                                    fullWidth
                                                    placeholder="Enter company name"
                                                />
                                            </FormGroup>

                                            <FormGroup
                                                label="Company Description"
                                                icon={<DescriptionIcon fontSize="small" sx={{ opacity: 0.7 }} />}
                                                marginBottom="medium"
                                            >
                                                <TextArea
                                                    name="description"
                                                    value={data.description}
                                                    onChange={(e) => setData('description', e.target.value)}
                                                    error={errors.description}
                                                    helperText={errors.description}
                                                    rows={5}
                                                    fullWidth
                                                    placeholder="Enter company description, mission, and other details..."
                                                />
                                            </FormGroup>

                                            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                                                <Box sx={{ flex: 1 }}>
                                                    <FormGroup
                                                        label="Company Website"
                                                        icon={<LanguageIcon fontSize="small" sx={{ opacity: 0.7 }} />}
                                                        marginBottom="medium"
                                                    >
                                                        <Input
                                                            name="website"
                                                            value={data.website}
                                                            onChange={(e) => setData('website', e.target.value)}
                                                            error={errors.website}
                                                            helperText={errors.website || "Include https:// for external links"}
                                                            fullWidth
                                                            placeholder="e.g., www.company.com"
                                                        />
                                                    </FormGroup>
                                                </Box>

                                                <Box sx={{ flex: 1 }}>
                                                    <FormGroup
                                                        label="Industry"
                                                        icon={<CategoryIcon fontSize="small" sx={{ opacity: 0.7 }} />}
                                                        marginBottom="medium"
                                                    >
                                                        <Input
                                                            name="industry"
                                                            value={data.industry}
                                                            onChange={(e) => setData('industry', e.target.value)}
                                                            error={errors.industry}
                                                            helperText={errors.industry || "Specify the company's main industry"}
                                                            fullWidth
                                                            placeholder="e.g., Technology, Healthcare, Education"
                                                        />
                                                    </FormGroup>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>

                                    <Box sx={{ flex: 1 }}>
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 3,
                                                height: '100%',
                                                borderRadius: 2,
                                                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                                bgcolor: alpha(theme.palette.background.paper, 0.5),
                                            }}
                                        >
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <ImageIcon fontSize="small" color="primary" />
                                                    Company Logo
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" paragraph>
                                                    Upload a company logo or brand image. This will be displayed on the company profile and job listings.
                                                </Typography>
                                            </Box>

                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                                                <Avatar
                                                    src={logoPreview}
                                                    alt={data.name || 'Company Logo'}
                                                    variant="rounded"
                                                    sx={{
                                                        width: 150,
                                                        height: 150,
                                                        mb: 2,
                                                        boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.1)}`,
                                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                    }}
                                                >
                                                    {!logoPreview && <BusinessIcon sx={{ fontSize: 60 }} color="primary" />}
                                                </Avatar>

                                                <FileUpload
                                                    name="logo"
                                                    accept="image/*"
                                                    maxSize={2} // in MB
                                                    onChange={handleFileChange}
                                                    error={errors.logo}
                                                    helperText={errors.logo || "Upload new logo (max 2MB)"}
                                                    dragAndDrop
                                                    showPreview
                                                    inputProps={{
                                                        // Fixed: changed buttonProps to inputProps
                                                        startIcon: <CloudUploadIcon />,
                                                        children: 'Upload Logo',
                                                        variant: 'outlined',
                                                        color: 'primary',
                                                        size: 'small',
                                                        sx: { mt: 1 }
                                                    }}
                                                />
                                            </Box>
                                        </Paper>
                                    </Box>
                                </Box>
                            </motion.div>
                        )}

                        {/* Contact Details Tab */}
                        {activeTab === 1 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                                        <Box sx={{ flex: 1 }}>
                                            <FormGroup
                                                label="Email Address"
                                                icon={<EmailIcon fontSize="small" sx={{ opacity: 0.7 }} />}
                                                marginBottom="medium"
                                            >
                                                <Input
                                                    name="email"
                                                    type="email"
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    error={errors.email}
                                                    helperText={errors.email || "Main contact email for the company"}
                                                    fullWidth
                                                    placeholder="company@example.com"
                                                />
                                            </FormGroup>
                                        </Box>

                                        <Box sx={{ flex: 1 }}>
                                            <FormGroup
                                                label="Phone Number"
                                                icon={<PhoneIcon fontSize="small" sx={{ opacity: 0.7 }} />}
                                                marginBottom="medium"
                                            >
                                                <Input
                                                    name="phone"
                                                    value={data.phone}
                                                    onChange={(e) => setData('phone', e.target.value)}
                                                    error={errors.phone}
                                                    helperText={errors.phone || "Main contact phone for the company"}
                                                    fullWidth
                                                    placeholder="+1 (123) 456-7890"
                                                />
                                            </FormGroup>
                                        </Box>
                                    </Box>

                                    <Box>
                                        <FormGroup
                                            label="Company Address"
                                            icon={<LocationOnIcon fontSize="small" sx={{ opacity: 0.7 }} />}
                                            marginBottom="medium"
                                        >
                                            <TextArea
                                                name="address"
                                                value={data.address}
                                                onChange={(e) => setData('address', e.target.value)}
                                                error={errors.address}
                                                helperText={errors.address || "Physical address of the company headquarters or main office"}
                                                rows={4}
                                                fullWidth
                                                placeholder="Enter full company address"
                                            />
                                        </FormGroup>
                                    </Box>

                                    <Box>
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 3,
                                                borderRadius: 2,
                                                bgcolor: alpha(theme.palette.info.main, 0.05),
                                                border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
                                                display: 'flex',
                                                gap: 2,
                                            }}
                                        >
                                            <InfoIcon color="info" sx={{ mt: 0.5 }} />
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight={600} color="info.main" gutterBottom>
                                                    Contact Information Privacy
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    The contact information provided here will be visible to job seekers on the company profile page.
                                                    Make sure to use business contact details that can be made public.
                                                </Typography>
                                            </Box>
                                        </Paper>
                                    </Box>
                                </Box>
                            </motion.div>
                        )}

                        {/* Settings Tab */}
                        {activeTab === 2 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                                    <Box sx={{ flex: 1 }}>
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 3,
                                                borderRadius: 2,
                                                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                                height: '100%',
                                            }}
                                        >
                                            <FormGroup
                                                label="Company Status"
                                                icon={<TuneIcon fontSize="small" sx={{ opacity: 0.7 }} />}
                                                marginBottom="medium"
                                            >
                                                <Box sx={{ mb: 2 }}>
                                                    <Checkbox
                                                        label="Active Company"
                                                        name="is_active"
                                                        checked={data.is_active}
                                                        onChange={(e) => setData('is_active', e.target.checked)}
                                                        switchControl
                                                        color="success"
                                                    />
                                                </Box>

                                                <Box sx={{
                                                    p: 2,
                                                    bgcolor: data.is_active ? alpha(theme.palette.success.main, 0.05) : alpha(theme.palette.error.main, 0.05),
                                                    borderRadius: 2,
                                                    border: `1px solid ${data.is_active ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.error.main, 0.1)}`,
                                                }}>
                                                    {data.is_active ? (
                                                        <Typography variant="body2" color="text.secondary">
                                                            <strong>Active status:</strong> This company can post jobs and will be visible to candidates.
                                                        </Typography>
                                                    ) : (
                                                        <Typography variant="body2" color="text.secondary">
                                                            <strong>Inactive status:</strong> This company cannot post jobs and will not be visible to candidates.
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </FormGroup>
                                        </Paper>
                                    </Box>

                                    <Box sx={{ flex: 1 }}>
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 3,
                                                borderRadius: 2,
                                                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                            }}
                                        >
                                            <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <InfoIcon fontSize="small" color="primary" />
                                                About Company Settings
                                            </Typography>

                                            <Typography variant="body2" color="text.secondary" paragraph>
                                                Managing company settings allows you to control the visibility and functionality
                                                of the company profile in the job portal.
                                            </Typography>

                                            <Box sx={{ mt: 2 }}>
                                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                                                    <CheckCircleOutlineIcon fontSize="small" color="success" />
                                                    Active companies can post new job listings
                                                </Typography>
                                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                                                    <CheckCircleOutlineIcon fontSize="small" color="success" />
                                                    Active companies are visible in search results
                                                </Typography>
                                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                                                    <CheckCircleOutlineIcon fontSize="small" color="success" />
                                                    Active companies can receive applications
                                                </Typography>
                                            </Box>

                                            <Divider sx={{ my: 2 }} />

                                            <Box sx={{ mt: 'auto' }}>
                                                <Typography variant="caption" color="text.secondary">
                                                    Last updated: {new Date(company?.updated_at || Date.now()).toLocaleDateString()}
                                                </Typography>
                                            </Box>
                                        </Paper>
                                    </Box>
                                </Box>
                            </motion.div>
                        )}
                    </Box>
                </Paper>

                {/* Action Buttons */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 2,
                        mb: 4
                    }}
                >
                    <Button
                        type="button"
                        variant="outlined"
                        color="error"
                        startIcon={<CancelIcon />}
                        onClick={resetForm}
                        disabled={processing}
                    >
                        Reset Changes
                    </Button>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            startIcon={<SaveIcon />}
                            loading={processing}
                            size="large"
                            sx={{ px: 3 }}
                        >
                            Save Changes
                        </Button>
                    </motion.div>
                </Box>
            </Box>
        </Layout>
    );
};

export default CompanyEdit;
