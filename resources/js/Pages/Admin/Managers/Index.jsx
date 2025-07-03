import React, { useState, useEffect, useMemo } from 'react';
import { usePage, Link, router, Head } from '@inertiajs/react';
import {
    Box,
    Typography,
    IconButton,
    Chip,
    TextField,
    InputAdornment,
    Tooltip,
    Avatar,
    Paper,
    alpha,
    Tab,
    Tabs,
    useTheme,
    Card as MuiCard,
    Menu,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Grid
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    Edit as EditIcon,
    Visibility as ViewIcon,
    Delete as DeleteIcon,
    Business as BusinessIcon,
    Person as PersonIcon,
    FilterList as FilterIcon,
    AdminPanelSettings as AdminPanelSettingsIcon,
    SupervisorAccount as SupervisorAccountIcon,
    MoreVert as MoreVertIcon,
    CloudDownload as CloudDownloadIcon,
    Print as PrintIcon,
    Refresh as RefreshIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';

// Import custom components
import Card from '@/Components/Shared/Card';
import Table from '@/Components/Shared/Table';
import Button from '@/Components/Shared/Button';
import Modal from '@/Components/Shared/Modal';
import Alert from '@/Components/Shared/Alert';
import Select from '@/Components/Shared/Select';
import Layout from '@/Components/Layout/Layout';

// Fungsi untuk menampilkan dialog konfirmasi penghapusan dengan SweetAlert2
const showDeleteConfirmation = (manager, onConfirm) => {
    Swal.fire({
        title: 'Hapus Asosiasi Manager',
        html: `
            <p>Anda yakin ingin menghapus asosiasi manager ${manager?.user?.name} dengan perusahaan ${manager?.company?.name}?</p>
            <p style="color: #666; font-size: 0.9em; margin-top: 8px;">
                Tindakan ini hanya akan menghapus asosiasi, tidak menghapus data pengguna.
            </p>
        `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#f44336', // error.main
        cancelButtonColor: '#9e9e9e', // grey.500
        confirmButtonText: 'Hapus',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (result.isConfirmed) {
            onConfirm();
        }
    });
};

// Stats Card component to reduce duplication
const StatsCard = ({ icon, count, label, color = "primary", delay = 0 }) => {
    const theme = useTheme();

    return (
        <Box sx={{ flex: 1, minWidth: '220px', maxWidth: '270px' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay }}
            >
                <MuiCard
                    elevation={0}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 2,
                        borderRadius: 2,
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        boxShadow: `0 1px 5px ${alpha(theme.palette.common.black, 0.05)}`,
                        bgcolor: alpha(theme.palette[color].main, 0.03),
                    }}
                >
                    <Avatar
                        sx={{
                            bgcolor: alpha(theme.palette[color].main, 0.1),
                            color: theme.palette[color].main,
                            width: 56,
                            height: 56,
                            mr: 2
                        }}
                    >
                        {icon}
                    </Avatar>
                    <Box>
                        <Typography variant="h4" fontWeight={700} gutterBottom>
                            {count}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {label}
                        </Typography>
                    </Box>
                </MuiCard>
            </motion.div>
        </Box>
    );
};

// Actions Menu component
const ActionsMenu = ({ anchorEl, onClose }) => {
    return (
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={onClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            <MenuItem onClick={onClose}>
                <ListItemIcon>
                    <CloudDownloadIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Export CSV</ListItemText>
            </MenuItem>
            <MenuItem onClick={onClose}>
                <ListItemIcon>
                    <PrintIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Print List</ListItemText>
            </MenuItem>
            <MenuItem onClick={onClose}>
                <ListItemIcon>
                    <RefreshIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Refresh Data</ListItemText>
            </MenuItem>
        </Menu>
    );
};

const ManagersIndex = ({ managers = { data: [] }, companies = [], roles = [] }) => {
    const { flash } = usePage().props;
    const theme = useTheme();
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [managerToDelete, setManagerToDelete] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [showAlert, setShowAlert] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const [actionsAnchorEl, setActionsAnchorEl] = useState(null);

    // Filters
    const [filterCompany, setFilterCompany] = useState('');
    const [filterRole, setFilterRole] = useState('');
    const [filterPrimary, setFilterPrimary] = useState('');

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

    // Handle tab change
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        if (newValue === 0) {
            // All
            setFilterPrimary('');
        } else if (newValue === 1) {
            // Primary
            setFilterPrimary('true');
        } else if (newValue === 2) {
            // Secondary
            setFilterPrimary('false');
        }
    };

    const handleOpenActionsMenu = (event) => {
        setActionsAnchorEl(event.currentTarget);
    };

    const handleCloseActionsMenu = () => {
        setActionsAnchorEl(null);
    };

    // Handle manager deletion
    const handleDelete = () => {
        if (!managerToDelete) return;

        setLoading(true);
        router.delete(route('admin.managers.destroy', managerToDelete.id), {
            onSuccess: (page) => {
                // Tampilkan pesan sukses dengan SweetAlert2
                const message = page.props.flash && page.props.flash.message
                    ? page.props.flash.message
                    : 'Asosiasi manager berhasil dihapus';
                
                Swal.fire({
                    title: 'Berhasil!',
                    text: message,
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: theme.palette.primary.main
                });
                
                setManagerToDelete(null);
                // Refresh data setelah penghapusan berhasil
                router.reload({ only: ['managers'] });
            },
            onError: (errors) => {
                // Tampilkan pesan error dengan SweetAlert2
                console.error('Error deleting manager:', errors);
                let errorMessage = 'Gagal menghapus asosiasi manager: Terjadi kesalahan';
                
                if (errors.message) {
                    errorMessage = errors.message;
                } else if (errors.errors && Object.keys(errors.errors).length > 0) {
                    errorMessage = 'Gagal menghapus asosiasi manager:\n' + Object.values(errors.errors).flat().join('\n');
                }
                
                Swal.fire({
                    title: 'Error!',
                    text: errorMessage,
                    icon: 'error',
                    confirmButtonText: 'OK',
                    confirmButtonColor: theme.palette.error.main
                });
            },
            onFinish: () => setLoading(false),
        });
    };

    // Table columns configuration
    const columns = [
        {
            field: 'user',
            header: 'Manager',
            sortable: true,
            render: (_, manager) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar
                        src={manager.user?.avatar}
                        alt={manager.user?.name}
                        sx={{
                            width: 42,
                            height: 42,
                            border: manager.is_primary
                                ? `2px solid ${theme.palette.primary.main}`
                                : `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                            boxShadow: manager.is_primary
                                ? `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`
                                : 'none',
                        }}
                    >
                        {manager.user?.name?.charAt(0).toUpperCase() || <PersonIcon />}
                    </Avatar>
                    <Box>
                        <Typography variant="body1" fontWeight={600}>
                            {manager.user?.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {manager.user?.email}
                        </Typography>
                    </Box>
                </Box>
            ),
        },
        {
            field: 'company',
            header: 'Company',
            sortable: true,
            render: (_, manager) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    {manager.company?.logo ? (
                        <Avatar
                            src={manager.company.logo}
                            alt={manager.company?.name}
                            variant="rounded"
                            sx={{
                                width: 36,
                                height: 36,
                                border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                            }}
                        />
                    ) : (
                        <Avatar
                            variant="rounded"
                            sx={{
                                width: 36,
                                height: 36,
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                color: theme.palette.primary.main,
                            }}
                        >
                            <BusinessIcon />
                        </Avatar>
                    )}
                    <Box>
                        <Typography variant="body2" fontWeight={500}>
                            {manager.company?.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {manager.company?.industry || 'No industry specified'}
                        </Typography>
                    </Box>
                </Box>
            ),
        },
        {
            field: 'is_primary',
            header: 'Role',
            sortable: true,
            render: (isPrimary) => (
                <Chip
                    label={isPrimary ? 'Primary Manager' : 'Secondary Manager'}
                    color={isPrimary ? 'primary' : 'default'}
                    size="small"
                    variant={isPrimary ? 'filled' : 'outlined'}
                    icon={isPrimary ? <AdminPanelSettingsIcon /> : <SupervisorAccountIcon />}
                    sx={{
                        fontWeight: 500,
                        px: 0.5,
                        '& .MuiChip-icon': {
                            fontSize: '1rem',
                        }
                    }}
                />
            ),
        },
        {
            field: 'user.role',
            header: 'User Role',
            render: (_, manager) => (
                <Chip
                    label={manager.user?.role?.name || 'No Role'}
                    size="small"
                    color="secondary"
                    variant="outlined"
                    sx={{ fontWeight: 500 }}
                />
            ),
        },
        {
            field: 'user.is_active',
            header: 'Status',
            sortable: true,
            render: (_, manager) => (
                <Chip
                    label={manager.user?.is_active ? 'Active' : 'Inactive'}
                    color={manager.user?.is_active ? 'success' : 'default'}
                    size="small"
                    variant={manager.user?.is_active ? 'filled' : 'outlined'}
                    sx={{
                        fontWeight: 500,
                        backgroundColor: manager.user?.is_active
                            ? alpha(theme.palette.success.main, 0.1)
                            : alpha(theme.palette.action.disabled, 0.1),
                        color: manager.user?.is_active
                            ? theme.palette.success.dark
                            : theme.palette.text.disabled,
                    }}
                />
            ),
        },
        {
            field: 'created_at',
            header: 'Added On',
            sortable: true,
            render: (date) => {
                const formattedDate = new Date(date).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
                return (
                    <Typography variant="body2" color="text.secondary">
                        {formattedDate}
                    </Typography>
                );
            },
        },
    ];

    // Filter managers based on search term and filters
    const filteredManagers = useMemo(() => {
        return managers?.data?.filter(manager => {
            // Search filter
            const matchesSearch =
                manager.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                manager.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                manager.company?.name?.toLowerCase().includes(searchTerm.toLowerCase());

            // Additional filters
            const matchesCompany = !filterCompany || (manager.company?.id?.toString() === filterCompany);
            const matchesRole = !filterRole || (manager.user?.role_id?.toString() === filterRole);

            // Pastikan is_primary ada sebelum toString
            const isPrimary = manager.is_primary !== undefined ? manager.is_primary.toString() : '';
            const matchesPrimary = !filterPrimary || isPrimary === filterPrimary;

            return matchesSearch && matchesCompany && matchesRole && matchesPrimary;
        }) || [];
    }, [managers?.data, searchTerm, filterCompany, filterRole, filterPrimary]);

    // Get stats for tabs
    const totalManagers = managers?.data?.length || 0;
    const primaryManagers = managers?.data?.filter(m => m.is_primary === true)?.length || 0;
    const secondaryManagers = managers?.data?.filter(m => m.is_primary === false)?.length || 0;

    // Prepare the actions for the table
    const actions = (manager) => (
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Tooltip title="View User">
                <IconButton
                    size="small"
                    component={Link}
                    href={route('admin.users.show', manager.user_id)}
                    sx={{
                        color: theme.palette.info.main,
                        bgcolor: alpha(theme.palette.info.main, 0.1),
                        '&:hover': { bgcolor: alpha(theme.palette.info.main, 0.2) }
                    }}
                >
                    <ViewIcon fontSize="small" />
                </IconButton>
            </Tooltip>
            <Tooltip title="View Company">
                <IconButton
                    size="small"
                    component={Link}
                    href={route('admin.companies.show', manager.company_id)}
                    sx={{
                        color: theme.palette.primary.main,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
                    }}
                >
                    <BusinessIcon fontSize="small" />
                </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
                <IconButton
                    size="small"
                    component={Link}
                    href={route('admin.managers.edit', manager.id)}
                    sx={{
                        color: theme.palette.warning.main,
                        bgcolor: alpha(theme.palette.warning.main, 0.1),
                        '&:hover': { bgcolor: alpha(theme.palette.warning.main, 0.2) }
                    }}
                >
                    <EditIcon fontSize="small" />
                </IconButton>
            </Tooltip>
            <Tooltip title="Remove">
                <IconButton
                    size="small"
                    onClick={() => {
                        setManagerToDelete(manager);
                        showDeleteConfirmation(manager, handleDelete);
                    }}
                    sx={{
                        color: theme.palette.error.main,
                        bgcolor: alpha(theme.palette.error.main, 0.1),
                        '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.2) }
                    }}
                >
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </Tooltip>
        </Box>
    );

    const resetFilters = () => {
        setSearchTerm('');
        setFilterCompany('');
        setFilterRole('');
        setTabValue(0);
        setFilterPrimary('');
    };

    return (
        <Layout>
            <Head title="Company Managers" />

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
                        <AdminPanelSettingsIcon fontSize="large" />
                    </Avatar>
                    <Box>
                        <Typography variant="h4" component="h1" fontWeight={700}>
                            Company Managers
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Manage and assign users to handle company profiles and job listings
                        </Typography>
                    </Box>
                </Box>

                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        component={Link}
                        href={route('admin.managers.create')}
                        size="large"
                        sx={{ px: 3 }}
                    >
                        Add Manager
                    </Button>
                </motion.div>
            </Box>

            {/* Delete Confirmation Modal sudah diganti dengan SweetAlert2 */}

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

            {/* Stats Cards */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
                <StatsCard
                    icon={<PersonIcon />}
                    count={totalManagers}
                    label="Total Managers"
                    color="primary"
                    delay={0}
                />
                <StatsCard
                    icon={<AdminPanelSettingsIcon />}
                    count={primaryManagers}
                    label="Primary Managers"
                    color="success"
                    delay={0.1}
                />
                <StatsCard
                    icon={<SupervisorAccountIcon />}
                    count={secondaryManagers}
                    label="Secondary Managers"
                    color="info"
                    delay={0.2}
                />
            </Box>

            {/* Main Content */}
            <Paper
                elevation={0}
                sx={{
                    borderRadius: 3,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    overflow: 'hidden',
                    mb: 4,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 2,
                        pl: 3,
                        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <AdminPanelSettingsIcon color="primary" />
                        <Typography variant="h6" fontWeight={600}>
                            Manage Company Assignments
                        </Typography>
                    </Box>

                    <Box>
                        <Tooltip title="More Actions">
                            <IconButton onClick={handleOpenActionsMenu}>
                                <MoreVertIcon />
                            </IconButton>
                        </Tooltip>
                        <ActionsMenu
                            anchorEl={actionsAnchorEl}
                            onClose={handleCloseActionsMenu}
                        />
                    </Box>
                </Box>

                {/* Tabs */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        aria-label="manager tabs"
                        sx={{
                            '.MuiTabs-indicator': {
                                height: 3,
                                borderTopLeftRadius: 3,
                                borderTopRightRadius: 3,
                            },
                            '.MuiTab-root': {
                                textTransform: 'none',
                                fontWeight: 600,
                                px: 3,
                                py: 1.5,
                            }
                        }}
                    >
                        <Tab
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <PersonIcon />
                                    <span>All Managers</span>
                                    <Chip
                                        label={totalManagers}
                                        size="small"
                                        sx={{
                                            ml: 0.5,
                                            height: 20,
                                            fontSize: '0.7rem',
                                            fontWeight: 600,
                                        }}
                                    />
                                </Box>
                            }
                        />
                        <Tab
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <AdminPanelSettingsIcon />
                                    <span>Primary</span>
                                    <Chip
                                        label={primaryManagers}
                                        size="small"
                                        color="primary"
                                        sx={{
                                            ml: 0.5,
                                            height: 20,
                                            fontSize: '0.7rem',
                                            fontWeight: 600,
                                        }}
                                    />
                                </Box>
                            }
                        />
                        <Tab
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <SupervisorAccountIcon />
                                    <span>Secondary</span>
                                    <Chip
                                        label={secondaryManagers}
                                        size="small"
                                        color="info"
                                        sx={{
                                            ml: 0.5,
                                            height: 20,
                                            fontSize: '0.7rem',
                                            fontWeight: 600,
                                        }}
                                    />
                                </Box>
                            }
                        />
                    </Tabs>
                </Box>

                {/* Filters */}
                <Box sx={{ p: 2, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                placeholder="Search by manager name, email, or company..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon fontSize="small" />
                                        </InputAdornment>
                                    ),
                                    sx: {
                                        borderRadius: 2,
                                        bgcolor: alpha(theme.palette.common.black, 0.02),
                                    }
                                }}
                                variant="outlined"
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Select
                                fullWidth
                                value={filterCompany}
                                onChange={(e) => setFilterCompany(e.target.value)}
                                options={[
                                    { value: '', label: 'All Companies' },
                                    ...(companies || []).map(company => ({
                                        value: company.id.toString(),
                                        label: company.name
                                    }))
                                ]}
                                placeholder="All Companies"
                                size="small"
                                startAdornment={
                                    <InputAdornment position="start">
                                        <BusinessIcon fontSize="small" color="action" />
                                    </InputAdornment>
                                }
                            />
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Select
                                fullWidth
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value)}
                                options={[
                                    { value: '', label: 'All Roles' },
                                    ...(roles || []).map(role => ({
                                        value: role.id.toString(),
                                        label: role.name
                                    }))
                                ]}
                                placeholder="All Roles"
                                size="small"
                                startAdornment={
                                    <InputAdornment position="start">
                                        <PersonIcon fontSize="small" color="action" />
                                    </InputAdornment>
                                }
                            />
                        </Grid>
                        <Grid item xs={12} md={1} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'center' } }}>
                            <Tooltip title="Reset all filters">
                                <span>
                                    <IconButton
                                        color="primary"
                                        onClick={resetFilters}
                                        disabled={!searchTerm && !filterCompany && !filterRole && tabValue === 0}
                                        size="small"
                                        sx={{
                                            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                            borderRadius: 2,
                                        }}
                                    >
                                        <FilterIcon fontSize="small" />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </Box>

                {/* Filtered Results Stats */}
                <Box sx={{ px: 3, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="body2" color="text.secondary">
                            {filteredManagers.length} {filteredManagers.length === 1 ? 'result' : 'results'} found
                            {(searchTerm || filterCompany || filterRole || filterPrimary) ? ' with current filters' : ''}
                        </Typography>
                    </Box>
                    {(searchTerm || filterCompany || filterRole || tabValue > 0) && (
                        <Button
                            variant="text"
                            size="small"
                            startIcon={<FilterIcon fontSize="small" />}
                            onClick={resetFilters}
                        >
                            Clear Filters
                        </Button>
                    )}
                </Box>

                {/* Table */}
                <Box sx={{ px: 2, pb: 2 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: 2,
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            overflow: 'hidden',
                        }}
                    >
                        <Table
                            data={filteredManagers}
                            columns={columns}
                            actions={actions}
                            pagination
                            paginationInfo={managers?.meta}
                            baseRoute="admin.managers.index"
                            emptyMessage="No managers found with the current filters."
                            sx={{
                                '.MuiTableHead-root': {
                                    bgcolor: alpha(theme.palette.primary.main, 0.02),
                                },
                                '.MuiTableCell-head': {
                                    fontWeight: 600,
                                },
                                '.MuiTableRow-root:hover': {
                                    bgcolor: alpha(theme.palette.primary.main, 0.03),
                                }
                            }}
                            loading={loading}
                        />
                    </Paper>
                </Box>
            </Paper>
        </Layout>
    );
};

export default ManagersIndex;
