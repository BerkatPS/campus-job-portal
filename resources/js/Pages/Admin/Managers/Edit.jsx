import React, { useState, useEffect } from 'react';
import { useForm, usePage, Link, router } from '@inertiajs/react';
import {
    Box,
    Typography,
    Divider,
    Stack,
    Avatar,
    Paper,
    alpha,
    useTheme,
} from '@mui/material';
import {
    Person as PersonIcon,
    Business as BusinessIcon,
    ArrowBack as ArrowBackIcon,
    Save as SaveIcon,
    Info as InfoIcon,
} from '@mui/icons-material';

// Import custom components
import Card from '@/Components/Shared/Card';
import Button from '@/Components/Shared/Button';
import Select from '@/Components/Shared/Select';
import FormGroup from '@/Components/Shared/FormGroup';
import Checkbox from '@/Components/Shared/Checkbox';
import Alert from '@/Components/Shared/Alert';
import Layout from '@/Components/Layout/Layout';

const ManagerEdit = () => {
    const { manager, user, company, companies, users, flash } = usePage().props;
    const theme = useTheme();
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('error');

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT', // For method spoofing in Laravel
        company_id: manager?.company_id || '',
        user_id: manager?.user_id || '',
        is_primary: manager?.is_primary || false,
    });

    useEffect(() => {
        // Check for flash messages from the backend
        if (flash?.message) {
            setAlertMessage(flash.message);
            setAlertSeverity(flash.type || 'success');
            setShowAlert(true);

            // Auto-hide the alert after 5 seconds
            const timer = setTimeout(() => {
                setShowAlert(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [flash]);

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route('admin.managers.update', manager.id), {
            onSuccess: () => {
                setAlertMessage('Manager updated successfully.');
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

    return (
        <Layout>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                        sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                            width: 56,
                            height: 56,
                        }}
                    >
                        <PersonIcon fontSize="large" />
                    </Avatar>
                    <Box>
                        <Typography variant="h4" component="h1" fontWeight={700}>
                            Edit Manager Assignment
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            Update manager details and company assignment
                        </Typography>
                    </Box>
                </Box>

                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    component={Link}
                    href={route('admin.managers.index')}
                >
                    Back to Managers
                </Button>
            </Box>

            {showAlert && (
                <Alert
                    severity={alertSeverity}
                    onClose={() => setShowAlert(false)}
                    sx={{ mb: 3 }}
                >
                    {alertMessage}
                </Alert>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{
                    borderRadius: 3,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    overflow: 'hidden',
                }}>
                    <Box sx={{
                        p: 3,
                        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5
                    }}>
                        <BusinessIcon color="primary" />
                        <Typography variant="h6" fontWeight={600}>
                            Edit Manager Assignment
                        </Typography>
                    </Box>

                    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar
                                    src={user?.avatar}
                                    alt={user?.name}
                                    sx={{ width: 64, height: 64 }}
                                >
                                    {user?.name?.charAt(0).toUpperCase()}
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" fontWeight={600}>
                                        {user?.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {user?.email}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                px: 1,
                                                py: 0.25,
                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                color: theme.palette.primary.main,
                                                borderRadius: 1,
                                                fontWeight: 500
                                            }}
                                        >
                                            {user?.role?.name || 'Manager'}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                px: 1,
                                                py: 0.25,
                                                bgcolor: user?.is_active ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.error.main, 0.1),
                                                color: user?.is_active ? theme.palette.success.main : theme.palette.error.main,
                                                borderRadius: 1,
                                                fontWeight: 500
                                            }}
                                        >
                                            {user?.is_active ? 'Active' : 'Inactive'}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <FormGroup
                                    label="Perusahaan"
                                    required
                                    icon={<BusinessIcon fontSize="small" sx={{ opacity: 0.7 }} />}
                                    marginBottom="medium"
                                >
                                    <Select
                                        name="company_id"
                                        value={data.company_id}
                                        onChange={(e) => setData('company_id', e.target.value)}
                                        options={(companies || []).map(company => ({
                                            value: company.id,
                                            label: company.name,
                                            description: company.is_active ? 'Aktif' : 'Tidak Aktif'
                                        }))}
                                        required
                                        error={errors.company_id}
                                        helperText={errors.company_id}
                                    />
                                </FormGroup>

                                <FormGroup
                                    label="Pengguna"
                                    required
                                    icon={<PersonIcon fontSize="small" sx={{ opacity: 0.7 }} />}
                                    marginBottom="medium"
                                >
                                    <Select
                                        name="user_id"
                                        value={data.user_id}
                                        onChange={(e) => setData('user_id', e.target.value)}
                                        options={(users || []).map(user => ({
                                            value: user.id,
                                            label: user.name,
                                            description: user.email
                                        }))}
                                        required
                                        error={errors.user_id}
                                        helperText={errors.user_id}
                                    />
                                </FormGroup>

                                <Box sx={{
                                    p: 2,
                                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                                    borderRadius: 2,
                                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                }}>
                                    <FormGroup
                                        marginBottom="none"
                                    >
                                        <Checkbox
                                            label="Tetapkan sebagai Manager Utama"
                                            name="is_primary"
                                            checked={data.is_primary}
                                            onChange={(e) => setData('is_primary', e.target.checked)}
                                            helperText="Manager utama memiliki kendali penuh atas detail perusahaan dan pengelolaan lowongan kerja"
                                        />
                                    </FormGroup>
                                </Box>
                            </Box>

                            <Divider sx={{ my: 4 }} />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Button
                                    type="button"
                                    variant="text"
                                    color="error"
                                    onClick={() => {
                                        // Reset to original values
                                        setData({
                                            _method: 'PUT',
                                            company_id: manager?.company_id || '',
                                            user_id: manager?.user_id || '',
                                            is_primary: manager?.is_primary || false,
                                        });
                                    }}
                                    disabled={processing}
                                >
                                    Reset Formulir
                                </Button>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    startIcon={<SaveIcon />}
                                    loading={processing}
                                    size="large"
                                >
                                    Simpan Perubahan
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                <Box sx={{
                    borderRadius: 3,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    overflow: 'hidden',
                    height: '100%',
                }}>
                    <Box sx={{
                        p: 3,
                        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        bgcolor: alpha(theme.palette.info.main, 0.05)
                    }}>
                        <InfoIcon color="info" />
                        <Typography variant="h6" fontWeight={600}>
                            Informasi
                        </Typography>
                    </Box>

                    <Box sx={{ p: 3 }}>
                        <Typography variant="body1" paragraph>
                            Manager perusahaan adalah pengguna yang dapat mengelola detail dan lowongan kerja untuk perusahaan tertentu.
                        </Typography>

                        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                            Status Saat Ini
                        </Typography>

                        <Box
                            sx={{
                                p: 2,
                                bgcolor: manager?.is_primary ? alpha(theme.palette.primary.main, 0.05) : alpha(theme.palette.secondary.main, 0.05),
                                border: `1px solid ${manager?.is_primary ? alpha(theme.palette.primary.main, 0.1) : alpha(theme.palette.secondary.main, 0.1)}`,
                                borderRadius: 2,
                                mb: 3
                            }}
                        >
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                <strong>{user?.name}</strong> saat ini merupakan
                            </Typography>
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    display: 'inline-block',
                                    px: 1.5,
                                    py: 0.5,
                                    bgcolor: manager?.is_primary ? theme.palette.primary.main : theme.palette.secondary.main,
                                    color: '#fff',
                                    borderRadius: 1,
                                    fontWeight: 600
                                }}
                            >
                                {manager?.is_primary ? 'Manager Utama' : 'Manager Sekunder'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                untuk perusahaan <strong>{company?.name}</strong>
                            </Typography>
                        </Box>

                        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                            Tindakan Tambahan
                        </Typography>

                        <Stack spacing={2}>
                            <Button
                                variant="outlined"
                                startIcon={<PersonIcon />}
                                component={Link}
                                href={route('admin.users.show', user?.id)}
                                fullWidth
                            >
                                Lihat Detail Pengguna
                            </Button>

                            <Button
                                variant="outlined"
                                startIcon={<BusinessIcon />}
                                component={Link}
                                href={route('admin.companies.show', company?.id)}
                                fullWidth
                            >
                                Lihat Detail Perusahaan
                            </Button>
                        </Stack>
                    </Box>
                </Box>
            </Box>
        </Layout>
    );
};

export default ManagerEdit;
