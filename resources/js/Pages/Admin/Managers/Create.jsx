import React, { useState, useEffect } from 'react';
import { Head, Link, usePage, useForm } from '@inertiajs/react';
import {
    Box,
    Typography,
    Divider,
    Stack,
    Paper,
    alpha,
    Tooltip,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Avatar,
    Chip,
    useTheme,
} from '@mui/material';
import {
    Person as PersonIcon,
    Business as BusinessIcon,
    ArrowBack as ArrowBackIcon,
    Save as SaveIcon,
    Info as InfoIcon,
    CheckCircle as CheckCircleIcon,
    AdminPanelSettings as AdminPanelSettingsIcon,
    Assignment as AssignmentIcon,
    Cancel as CancelIcon,
    Error as ErrorIcon,
    Help as HelpIcon,
    Star as StarIcon,
} from '@mui/icons-material';

// Import custom components
import Card from '@/Components/Shared/Card';
import Button from '@/Components/Shared/Button';
import Select from '@/Components/Shared/Select';
import FormGroup from '@/Components/Shared/FormGroup';
import Checkbox from '@/Components/Shared/Checkbox';
import Alert from '@/Components/Shared/Alert';
import Layout from '@/Components/Layout/Layout';
import { motion } from 'framer-motion';

const ManagerCreate = ({ companies = [], users = [] }) => {
    const { auth } = usePage().props;
    const theme = useTheme();
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('error');
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isUserManager, setIsUserManager] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        company_id: '',
        user_id: '',
        is_primary: false,
        update_role: true, // Default ke true untuk otomatis update role
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route('admin.managers.store'), {
            onSuccess: () => {
                // Redirect happens automatically
            },
            onError: (errors) => {
                setAlertMessage('Mohon periksa kembali formulir untuk kesalahan.');
                setAlertSeverity('error');
                setShowAlert(true);

                // Scroll to top to see the alert
                window.scrollTo(0, 0);
            },
        });
    };

    // Handle company selection change
    const handleCompanyChange = (e) => {
        const companyId = e.target.value;
        setData('company_id', companyId);

        // Find the selected company object
        const company = companies.find(c => c.id.toString() === companyId.toString());
        setSelectedCompany(company || null);
    };

    // Handle user selection change
    const handleUserChange = (e) => {
        const userId = e.target.value;
        setData('user_id', userId);

        // Find the selected user object
        const user = users.find(u => u.id.toString() === userId.toString());
        setSelectedUser(user || null);

        // Check if user has manager role
        if (user && user.role && user.role.slug === 'manager') {
            setIsUserManager(true);
            setData('update_role', false); // No need to update role if already manager
        } else {
            setIsUserManager(false);
            setData('update_role', true); // Default to true for non-manager users
        }
    };

    return (
        <Layout>
            <Head title="Tambah Manager Perusahaan" />

            {showAlert && (
                <Alert
                    severity={alertSeverity}
                    onClose={() => setShowAlert(false)}
                    sx={{ mb: 3 }}
                >
                    {alertMessage}
                </Alert>
            )}

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
                        <AdminPanelSettingsIcon fontSize="large" />
                    </Avatar>
                    <Box>
                        <Typography variant="h4" component="h1" fontWeight={700}>
                            Tambah Manager Perusahaan
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            Tetapkan pengguna sebagai manager perusahaan untuk mengelola detail dan lowongan kerja
                        </Typography>
                    </Box>
                </Box>

                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    component={Link}
                    href={route('admin.managers.index')}
                >
                    Kembali ke Daftar Manager
                </Button>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                {/* Main Form Section */}
                <Box sx={{ flex: 1 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: 3,
                            boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            overflow: 'hidden',
                        }}
                    >
                        <Box sx={{
                            p: 3,
                            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5
                        }}>
                            <BusinessIcon color="primary" />
                            <Typography variant="h6" fontWeight={600}>
                                Formulir Penugasan Manager
                            </Typography>
                        </Box>

                        <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                                <Box sx={{ flex: 1 }}>
                                    <FormGroup
                                        label="Perusahaan"
                                        required
                                        icon={<BusinessIcon fontSize="small" sx={{ opacity: 0.7 }} />}
                                        marginBottom="medium"
                                    >
                                        <Select
                                            name="company_id"
                                            value={data.company_id}
                                            onChange={handleCompanyChange}
                                            options={(companies || []).map(company => ({
                                                value: company.id,
                                                label: company.name,
                                                description: company.is_active ? 'Aktif' : 'Tidak Aktif'
                                            }))}
                                            required
                                            placeholder="Pilih perusahaan"
                                            error={errors.company_id}
                                            helperText={errors.company_id}
                                        />
                                    </FormGroup>
                                </Box>

                                <Box sx={{ flex: 1 }}>
                                    <FormGroup
                                        label="Pengguna"
                                        required
                                        icon={<PersonIcon fontSize="small" sx={{ opacity: 0.7 }} />}
                                        marginBottom="medium"
                                    >
                                        <Select
                                            name="user_id"
                                            value={data.user_id}
                                            onChange={handleUserChange}
                                            options={(users || []).map(user => ({
                                                value: user.id,
                                                label: user.name,
                                                description: user.email,
                                                additionalInfo: user.role ? user.role.name : 'Tanpa Role'
                                            }))}
                                            required
                                            placeholder="Pilih pengguna"
                                            error={errors.user_id}
                                            helperText={errors.user_id || "Pilih pengguna yang akan ditugaskan sebagai manager"}
                                            emptyMessage={users.length === 0 ? "Tidak ada pengguna yang tersedia" : "Tidak ada pilihan tersedia"}
                                        />
                                    </FormGroup>
                                </Box>
                            </Box>

                            <Box sx={{ mt: 2 }}>
                                <Box
                                    sx={{
                                        p: 2,
                                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                                        borderRadius: 2,
                                        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                    }}
                                >
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

                            {/* Update Role Option - only show when selected user is not already manager */}
                            {selectedUser && !isUserManager && (
                                <Box sx={{ mt: 2 }}>
                                    <Box
                                        sx={{
                                            p: 2,
                                            bgcolor: alpha(theme.palette.secondary.main, 0.04),
                                            borderRadius: 2,
                                            border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
                                        }}
                                    >
                                        <FormGroup
                                            marginBottom="none"
                                        >
                                            <Checkbox
                                                label="Ubah role pengguna menjadi Manager"
                                                name="update_role"
                                                checked={data.update_role}
                                                onChange={(e) => setData('update_role', e.target.checked)}
                                                helperText={`Role ${selectedUser.name} saat ini adalah "${selectedUser.role?.name || 'Tanpa Role'}". Dengan opsi ini, role akan diubah menjadi "Manager".`}
                                            />
                                        </FormGroup>
                                    </Box>
                                </Box>
                            )}

                            {/* Show info when user already has manager role */}
                            {selectedUser && isUserManager && (
                                <Box sx={{ mt: 2 }}>
                                    <Box
                                        sx={{
                                            p: 2,
                                            bgcolor: alpha(theme.palette.info.main, 0.04),
                                            borderRadius: 2,
                                            border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: 1,
                                        }}
                                    >
                                        <InfoIcon color="info" sx={{ mt: 0.5 }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {selectedUser.name} sudah memiliki role Manager. Tidak diperlukan perubahan role.
                                        </Typography>
                                    </Box>
                                </Box>
                            )}

                            {(selectedCompany || selectedUser) && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                        Ringkasan Penugasan
                                    </Typography>
                                    <Box
                                        sx={{
                                            p: 2,
                                            bgcolor: 'background.paper',
                                            borderRadius: 2,
                                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                                            {selectedCompany && (
                                                <Box sx={{ flex: 1 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                        <Avatar
                                                            sx={{
                                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                                color: theme.palette.primary.main
                                                            }}
                                                        >
                                                            <BusinessIcon />
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Perusahaan
                                                            </Typography>
                                                            <Typography variant="subtitle2" fontWeight={600}>
                                                                {selectedCompany.name}
                                                            </Typography>
                                                            <Chip
                                                                size="small"
                                                                label={selectedCompany.is_active ? "Aktif" : "Tidak Aktif"}
                                                                color={selectedCompany.is_active ? "success" : "error"}
                                                                variant="outlined"
                                                                sx={{ mt: 0.5, height: 20, fontSize: '0.7rem' }}
                                                            />
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            )}

                                            {selectedUser && (
                                                <Box sx={{ flex: 1 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                        <Avatar
                                                            src={selectedUser.avatar}
                                                            sx={{
                                                                bgcolor: alpha(theme.palette.secondary.main, 0.1),
                                                                color: theme.palette.secondary.main
                                                            }}
                                                        >
                                                            <PersonIcon />
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Pengguna
                                                            </Typography>
                                                            <Typography variant="subtitle2" fontWeight={600}>
                                                                {selectedUser.name}
                                                            </Typography>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                                                <Chip
                                                                    size="small"
                                                                    label={selectedUser.role ? selectedUser.role.name : "Tanpa Role"}
                                                                    color={selectedUser.role && selectedUser.role.slug === 'manager' ? "primary" : "default"}
                                                                    variant="outlined"
                                                                    sx={{ height: 20, fontSize: '0.7rem' }}
                                                                />
                                                                {data.update_role && !isUserManager && (
                                                                    <Chip
                                                                        size="small"
                                                                        label="→ Manager"
                                                                        color="secondary"
                                                                        icon={<StarIcon sx={{ fontSize: '0.7rem !important' }} />}
                                                                        variant="outlined"
                                                                        sx={{ height: 20, fontSize: '0.7rem' }}
                                                                    />
                                                                )}
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            )}
                                        </Box>
                                    </Box>
                                </Box>
                            )}

                            <Divider sx={{ my: 4 }} />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Button
                                    type="button"
                                    variant="text"
                                    color="error"
                                    onClick={() => reset()}
                                    disabled={processing}
                                    startIcon={<CancelIcon />}
                                >
                                    Reset Formulir
                                </Button>

                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        startIcon={<SaveIcon />}
                                        loading={processing}
                                        size="large"
                                    >
                                        Simpan Manager
                                    </Button>
                                </motion.div>
                            </Box>
                        </Box>
                    </Paper>
                </Box>

                {/* Information Sidebar */}
                <Box sx={{ width: { xs: '100%', md: '35%' } }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                borderRadius: 3,
                                boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                overflow: 'hidden',
                                height: '100%',
                            }}
                        >
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

                                <Box sx={{
                                    bgcolor: alpha(theme.palette.warning.main, 0.05),
                                    border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                                    borderRadius: 2,
                                    p: 2,
                                    mb: 3
                                }}>
                                    <Typography variant="subtitle2" color="warning.dark" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <ErrorIcon fontSize="small" />
                                        Penting untuk diketahui:
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Jika Anda menetapkan manager utama baru, manager utama yang sudah ada akan diturunkan menjadi manager sekunder.
                                    </Typography>
                                </Box>

                                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                    Perubahan Role User
                                </Typography>

                                <Box sx={{
                                    bgcolor: alpha(theme.palette.secondary.main, 0.05),
                                    border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
                                    borderRadius: 2,
                                    p: 2,
                                    mb: 3
                                }}>
                                    <Typography variant="subtitle2" color="secondary.main" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <PersonIcon fontSize="small" />
                                        Perubahan Otomatis
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Ketika Anda menambahkan user sebagai manager, user tersebut secara otomatis akan memiliki role "Manager" (kecuali jika Anda menonaktifkan opsi tersebut).
                                    </Typography>
                                </Box>

                                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                    Fitur dan Hak Akses Manager
                                </Typography>

                                <List disablePadding>
                                    <ListItem disablePadding sx={{ pb: 1 }}>
                                        <ListItemIcon sx={{ minWidth: 32 }}>
                                            <CheckCircleIcon fontSize="small" color="success" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Mengubah profil perusahaan"
                                            primaryTypographyProps={{ variant: 'body2' }}
                                        />
                                    </ListItem>
                                    <ListItem disablePadding sx={{ pb: 1 }}>
                                        <ListItemIcon sx={{ minWidth: 32 }}>
                                            <CheckCircleIcon fontSize="small" color="success" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Membuat dan mengelola lowongan kerja"
                                            primaryTypographyProps={{ variant: 'body2' }}
                                        />
                                    </ListItem>
                                    <ListItem disablePadding sx={{ pb: 1 }}>
                                        <ListItemIcon sx={{ minWidth: 32 }}>
                                            <CheckCircleIcon fontSize="small" color="success" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Melihat dan mengelola lamaran"
                                            primaryTypographyProps={{ variant: 'body2' }}
                                        />
                                    </ListItem>
                                </List>

                                <Divider sx={{ my: 3 }} />

                                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                    Perbedaan Manager Utama & Sekunder
                                </Typography>

                                <Box sx={{
                                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                    borderRadius: 2,
                                    p: 2,
                                    mb: 2
                                }}>
                                    <Typography variant="subtitle2" color="primary.main" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <AdminPanelSettingsIcon fontSize="small" />
                                        Manager Utama
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        Dapat mengelola semua aspek perusahaan termasuk mengubah informasi dasar, logo, dan detail kontak.
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Juga dapat menambahkan manager sekunder lain untuk perusahaan.
                                    </Typography>
                                </Box>

                                <Box sx={{
                                    bgcolor: alpha(theme.palette.secondary.main, 0.05),
                                    border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
                                    borderRadius: 2,
                                    p: 2
                                }}>
                                    <Typography variant="subtitle2" color="secondary.main" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <AssignmentIcon fontSize="small" />
                                        Manager Sekunder
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Dapat mengelola lowongan kerja dan aplikasi, tetapi memiliki akses terbatas untuk mengubah detail perusahaan.
                                    </Typography>
                                </Box>

                                <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <HelpIcon fontSize="small" color="action" />
                                    <Typography variant="caption" color="text.secondary">
                                        Butuh bantuan? Hubungi tim dukungan di support@campusjobportal.com
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </motion.div>
                </Box>
            </Box>
        </Layout>
    );
};

export default ManagerCreate;
