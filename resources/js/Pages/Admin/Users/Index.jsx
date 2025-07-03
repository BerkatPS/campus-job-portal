import React, { useState, useEffect } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
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
    Divider,
    Badge,
    Stack,
    Button as MuiButton,
    Tab,
    Tabs
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    Edit as EditIcon,
    Visibility as ViewIcon,
    Delete as DeleteIcon,
    Person as PersonIcon,
    FilterList as FilterIcon,
    Refresh as RefreshIcon,
    CheckCircleOutline as CheckCircleOutlineIcon,
    DoDisturbOn as DoDisturbOnIcon,
    CloudDownload as CloudDownloadIcon,
    Print as PrintIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// Import custom components
import Card from '@/Components/Shared/Card';
import Table from '@/Components/Shared/Table';
import Button from '@/Components/Shared/Button';
import Spinner from '@/Components/Shared/Spinner';
import Modal from '@/Components/Shared/Modal';
import Alert from '@/Components/Shared/Alert';
import Select from '@/Components/Shared/Select';
import Layout from '@/Components/Layout/Layout';

const UsersIndex = () => {
    const { users, filters, roles, flash } = usePage().props;
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [loading, setLoading] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [showAlert, setShowAlert] = useState(false);
    const [tabValue, setTabValue] = useState(0);

    // Filters
    const [filterRole, setFilterRole] = useState(filters?.role || '');
    const [filterStatus, setFilterStatus] = useState(filters?.status || '');

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
            setFilterStatus('');
        } else if (newValue === 1) {
            // Active
            setFilterStatus('active');
        } else if (newValue === 2) {
            // Inactive
            setFilterStatus('inactive');
        }
    };

    // Handle user deletion
    const handleDelete = () => {
        if (!userToDelete) return;

        setLoading(true);
        router.delete(route('admin.users.destroy', userToDelete.id), {
            onSuccess: () => {
                setDeleteModal(false);
                setUserToDelete(null);
                setAlertMessage('User deleted successfully.');
                setAlertSeverity('success');
                setShowAlert(true);
            },
            onError: (errors) => {
                setAlertMessage('Failed to delete user: ' + Object.values(errors).flat().join(' '));
                setAlertSeverity('error');
                setShowAlert(true);
            },
            onFinish: () => setLoading(false),
        });
    };

    // Table columns configuration
    const columns = [
        {
            field: 'avatar',
            header: '',
            width: '60px',
            render: (avatar, user) => (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Avatar
                        src={avatar}
                        alt={user.name}
                        sx={{
                            width: 40,
                            height: 40,
                            boxShadow: `0 2px 8px ${alpha('#000', 0.1)}`
                        }}
                    >
                        {user.name?.charAt(0).toUpperCase()}
                    </Avatar>
                </Box>
            ),
        },
        {
            field: 'name',
            header: 'Name',
            sortable: true,
            render: (name, user) => (
                <Box>
                    <Typography variant="body1" fontWeight={500}>
                        {name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {user.email}
                    </Typography>
                    {user.nim && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            NIM: {user.nim}
                        </Typography>
                    )}
                </Box>
            ),
        },
        {
            field: 'role',
            header: 'Role',
            sortable: true,
            render: (role) => (
                <Chip
                    label={role?.name || 'No Role'}
                    color="primary"
                    size="small"
                    variant="outlined"
                    sx={{ fontWeight: 500 }}
                />
            ),
        },
        // {
        //     field: 'email_verified_at',
        //     header: 'Verified',
        //     sortable: true,
        //     render: (verified) => (
        //         <Chip
        //             icon={verified ? <CheckCircleOutlineIcon fontSize="small" /> : <DoDisturbOnIcon fontSize="small" />}
        //             label={verified ? 'Verified' : 'Unverified'}
        //             color={verified ? 'success' : 'warning'}
        //             size="small"
        //             variant={verified ? 'filled' : 'outlined'}
        //             sx={{
        //                 fontWeight: 500,
        //                 backgroundColor: verified ? alpha('#4caf50', 0.1) : 'transparent',
        //                 '& .MuiChip-icon': {
        //                     fontSize: '1rem',
        //                     color: 'inherit',
        //                 }
        //             }}
        //         />
        //     ),
        // },
        {
            field: 'is_active',
            header: 'Status',
            sortable: true,
            render: (isActive) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {isActive ? (
                        <Chip
                            icon={<CheckCircleOutlineIcon fontSize="small" />}
                            label="Active"
                            color="success"
                            size="small"
                            variant="filled"
                            sx={{
                                bgcolor: alpha('#4caf50', 0.1),
                                color: '#2e7d32',
                                fontWeight: 500,
                                '& .MuiChip-icon': {
                                    fontSize: '1rem',
                                    color: 'inherit',
                                }
                            }}
                        />
                    ) : (
                        <Chip
                            icon={<DoDisturbOnIcon fontSize="small" />}
                            label="Inactive"
                            color="default"
                            size="small"
                            variant="outlined"
                            sx={{
                                color: alpha('#000', 0.6),
                                fontWeight: 500,
                                '& .MuiChip-icon': {
                                    fontSize: '1rem',
                                    color: 'inherit',
                                }
                            }}
                        />
                    )}
                </Box>
            ),
        },
        {
            field: 'created_at',
            header: 'Joined On',
            sortable: true,
            render: (date) => (
                <Typography variant="body2" color="text.secondary">
                    {new Date(date).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    })}
                </Typography>
            ),
        },
    ];

    // Filter users based on search term and filters
    const filteredUsers = users?.data?.filter(user => {
        // Search filter
        const matchesSearch =
            user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user?.nim && user.nim.toLowerCase().includes(searchTerm.toLowerCase()));

        // Additional filters
        const matchesRole = !filterRole || (user?.role?.id && user.role.id.toString() === filterRole);
        const matchesStatus = filterStatus === '' ||
            (filterStatus === 'active' && user?.is_active) ||
            (filterStatus === 'inactive' && !user?.is_active);

        return matchesSearch && matchesRole && matchesStatus;
    }) || [];
    
    // Fungsi untuk mengekspor data ke CSV
    const exportToCSV = () => {
        // Pastikan ada data untuk diekspor
        if (!filteredUsers || filteredUsers.length === 0) {
            alert('Tidak ada data untuk diekspor');
            return;
        }
    
        // Membuat header CSV
        const headers = [
            'ID', 'Nama', 'Email', 'NIM', 'Role', 'Status',
            'Tanggal Bergabung'
        ];
    
        // Mengubah data users menjadi format CSV
        const csvData = filteredUsers.map(user => [
            user.id,
            user.name || '-',
            user.email || '-',
            user.nim || '-',
            user.role?.name || '-',
            user.is_active ? 'Active' : 'Inactive',
            new Date(user.created_at).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            })
        ]);
    
        // Menggabungkan header dan data
        const csvContent = [
            headers.join(','),
            ...csvData.map(row => row.join(','))
        ].join('\n');
    
        // Membuat blob dan link untuk download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `users-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    // Fungsi untuk mencetak daftar pengguna
    const printUserList = () => {
        // Pastikan ada data untuk dicetak
        if (!filteredUsers || filteredUsers.length === 0) {
            alert('Tidak ada data untuk dicetak');
            return;
        }
    
        // Membuat konten HTML untuk dicetak
        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Daftar Pengguna - ${new Date().toLocaleDateString()}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 20px;
                    }
                    h1 {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th, td {
                        border: 1px solid #ddd;
                        padding: 8px;
                        text-align: left;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                    tr:nth-child(even) {
                        background-color: #f9f9f9;
                    }
                    .print-date {
                        text-align: right;
                        margin-bottom: 20px;
                        font-size: 12px;
                    }
                    .status-active {
                        color: green;
                        font-weight: bold;
                    }
                    .status-inactive {
                        color: #757575;
                        font-weight: bold;
                    }
                </style>
            </head>
            <body>
                <div class="print-date">Dicetak pada: ${new Date().toLocaleString()}</div>
                <h1>Daftar Pengguna</h1>
                <table>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Nama</th>
                            <th>Email</th>
                            <th>NIM</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Tanggal Bergabung</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredUsers.map((user, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${user.name || '-'}</td>
                                <td>${user.email || '-'}</td>
                                <td>${user.nim || '-'}</td>
                                <td>${user.role?.name || '-'}</td>
                                <td class="status-${user.is_active ? 'active' : 'inactive'}">${user.is_active ? 'Active' : 'Inactive'}</td>
                                <td>${new Date(user.created_at).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                })}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </body>
            </html>
        `;
    
        // Membuka jendela baru untuk mencetak
        const printWindow = window.open('', '_blank');
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
        
        // Menunggu konten dimuat sebelum mencetak
        printWindow.onload = function() {
            printWindow.print();
            // printWindow.close(); // Uncomment jika ingin jendela otomatis tertutup setelah mencetak
        };
    };

    // Prepare the actions for the table
    const actions = (user) => (
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Tooltip title="View Details">
                <IconButton
                    size="small"
                    component={Link}
                    href={route('admin.users.show', user.id)}
                    sx={{
                        color: '#2196f3',
                        bgcolor: alpha('#2196f3', 0.1),
                        '&:hover': { bgcolor: alpha('#2196f3', 0.2) }
                    }}
                >
                    <ViewIcon fontSize="small" />
                </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
                <IconButton
                    size="small"
                    onClick={() => {
                        setUserToDelete(user);
                        setDeleteModal(true);
                    }}
                    sx={{
                        color: '#f44336',
                        bgcolor: alpha('#f44336', 0.1),
                        '&:hover': { bgcolor: alpha('#f44336', 0.2) }
                    }}
                >
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </Tooltip>
        </Box>
    );

    const resetFilters = () => {
        setSearchTerm('');
        setFilterRole('');
        setFilterStatus('');
        setTabValue(0);
    };

    // Get stats for tabs
    const totalUsers = users?.data?.length || 0;
    const activeUsers = users?.data?.filter(u => u.is_active)?.length || 0;
    const inactiveUsers = users?.data?.filter(u => !u.is_active)?.length || 0;

    return (
        <Layout>
            <Head title="Users Management" />

            {/* Header Section */}
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                        sx={{
                            width: 56,
                            height: 56,
                            bgcolor: alpha('#3f51b5', 0.1),
                            color: '#3f51b5',
                        }}
                    >
                        <PersonIcon fontSize="large" />
                    </Avatar>
                    <Box>
                        <Typography variant="h4" component="h1" fontWeight={700}>
                            Users
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Manage all users in the system
                        </Typography>
                    </Box>
                </Box>

                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        component={Link}
                        href={route('admin.users.create')}
                        size="large"
                        sx={{ px: 3 }}
                    >
                        Add User
                    </Button>
                </motion.div>
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
                        >
                            {alertMessage}
                        </Alert>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Stats Cards */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
                <Box sx={{ flex: 1, minWidth: '220px', maxWidth: '270px' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                p: 2,
                                borderRadius: 2,
                                border: `1px solid ${alpha('#000', 0.1)}`,
                                boxShadow: `0 1px 5px ${alpha('#000', 0.05)}`,
                                bgcolor: alpha('#3f51b5', 0.03),
                            }}
                        >
                            <Avatar
                                sx={{
                                    bgcolor: alpha('#3f51b5', 0.1),
                                    color: '#3f51b5',
                                    width: 56,
                                    height: 56,
                                    mr: 2
                                }}
                            >
                                <PersonIcon />
                            </Avatar>
                            <Box>
                                <Typography variant="h4" fontWeight={700} gutterBottom>
                                    {totalUsers}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Total Users
                                </Typography>
                            </Box>
                        </Paper>
                    </motion.div>
                </Box>

                <Box sx={{ flex: 1, minWidth: '220px', maxWidth: '270px' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                p: 2,
                                borderRadius: 2,
                                border: `1px solid ${alpha('#000', 0.1)}`,
                                boxShadow: `0 1px 5px ${alpha('#000', 0.05)}`,
                                bgcolor: alpha('#4caf50', 0.03),
                            }}
                        >
                            <Avatar
                                sx={{
                                    bgcolor: alpha('#4caf50', 0.1),
                                    color: '#4caf50',
                                    width: 56,
                                    height: 56,
                                    mr: 2
                                }}
                            >
                                <CheckCircleOutlineIcon />
                            </Avatar>
                            <Box>
                                <Typography variant="h4" fontWeight={700} gutterBottom>
                                    {activeUsers}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Active Users
                                </Typography>
                            </Box>
                        </Paper>
                    </motion.div>
                </Box>

                <Box sx={{ flex: 1, minWidth: '220px', maxWidth: '270px' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                p: 2,
                                borderRadius: 2,
                                border: `1px solid ${alpha('#000', 0.1)}`,
                                boxShadow: `0 1px 5px ${alpha('#000', 0.05)}`,
                                bgcolor: alpha('#9e9e9e', 0.03),
                            }}
                        >
                            <Avatar
                                sx={{
                                    bgcolor: alpha('#9e9e9e', 0.1),
                                    color: '#757575',
                                    width: 56,
                                    height: 56,
                                    mr: 2
                                }}
                            >
                                <DoDisturbOnIcon />
                            </Avatar>
                            <Box>
                                <Typography variant="h4" fontWeight={700} gutterBottom>
                                    {inactiveUsers}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Inactive Users
                                </Typography>
                            </Box>
                        </Paper>
                    </motion.div>
                </Box>
            </Box>

            {/* Main Content */}
            <Paper
                elevation={0}
                sx={{
                    borderRadius: 3,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                    border: `1px solid ${alpha('#000', 0.1)}`,
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
                        borderBottom: `1px solid ${alpha('#000', 0.1)}`,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <PersonIcon color="primary" />
                        <Typography variant="h6" fontWeight={600}>
                            User Directory
                        </Typography>
                    </Box>

                    <Box>
                        <Tooltip title="Export Users">
                            <IconButton onClick={exportToCSV}>
                                <CloudDownloadIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Print List">
                            <IconButton onClick={printUserList}>
                                <PrintIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Refresh">
                            <IconButton onClick={() => router.reload()}>
                                <RefreshIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>

                {/* Tabs */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        aria-label="user status tabs"
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
                        <Tab label="All Users" />
                        <Tab label="Active" />
                        <Tab label="Inactive" />
                    </Tabs>
                </Box>

                {/* Filters */}
                <Box sx={{ p: 2, borderBottom: `1px solid ${alpha('#000', 0.1)}` }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                        <Box sx={{ flex: '1 1 300px' }}>
                            <TextField
                                fullWidth
                                placeholder="Search by name, email, or NIM..."
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
                                        bgcolor: alpha('#000', 0.02),
                                    }
                                }}
                                variant="outlined"
                                size="small"
                            />
                        </Box>
                        <Box sx={{ flex: '1 1 200px' }}>
                            <Select
                                fullWidth
                                label="Role"
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value)}
                                options={(roles || []).map(role => ({
                                    value: role.id.toString(),
                                    label: role.name
                                }))}
                                placeholder="All Roles"
                                showEmpty
                                size="small"
                                sx={{
                                    borderRadius: 2,
                                }}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Tooltip title="Reset all filters">
                                <span>
                                    <IconButton
                                        color="primary"
                                        onClick={resetFilters}
                                        disabled={!searchTerm && !filterRole && tabValue === 0}
                                        size="small"
                                        sx={{
                                            border: `1px solid ${alpha('#3f51b5', 0.2)}`,
                                            borderRadius: 2,
                                        }}
                                    >
                                        <FilterIcon fontSize="small" />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        </Box>
                    </Box>
                </Box>

                {/* Filtered Results Stats */}
                <Box sx={{ px: 3, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="body2" color="text.secondary">
                            {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'} found
                            {(searchTerm || filterRole || filterStatus) ? ' with current filters' : ''}
                        </Typography>
                    </Box>
                    {(searchTerm || filterRole || tabValue > 0) && (
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
                            border: `1px solid ${alpha('#000', 0.1)}`,
                            overflow: 'hidden',
                        }}
                    >
                        <Table
                            data={filteredUsers}
                            columns={columns}
                            actions={actions}
                            pagination
                            paginationInfo={users?.meta}
                            baseRoute="admin.users.index"
                            emptyMessage="No users found with the current filters."
                            sx={{
                                '.MuiTableHead-root': {
                                    bgcolor: alpha('#3f51b5', 0.02),
                                },
                                '.MuiTableCell-head': {
                                    fontWeight: 600,
                                },
                                '.MuiTableRow-root:hover': {
                                    bgcolor: alpha('#3f51b5', 0.03),
                                }
                            }}
                            loading={loading}
                        />
                    </Paper>
                </Box>
            </Paper>

            {/* Delete Confirmation Modal */}
            <Modal
                open={deleteModal}
                onClose={() => setDeleteModal(false)}
                title={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ bgcolor: alpha('#f44336', 0.1), color: '#f44336' }}>
                            <DeleteIcon />
                        </Avatar>
                        <Typography variant="h6" component="h2" fontWeight={600}>
                            Confirm Deletion
                        </Typography>
                    </Box>
                }
                contentSx={{
                    p: 3,
                    minWidth: { xs: '90vw', sm: 400, md: 500 }
                }}
                actions={
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <Button
                            variant="outlined"
                            onClick={() => setDeleteModal(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleDelete}
                                loading={loading}
                                startIcon={<DeleteIcon />}
                            >
                                Delete
                            </Button>
                        </motion.div>
                    </Box>
                }
            >
                {userToDelete && (
                    <Box>
                        <Box sx={{
                            p: 2,
                            mb: 3,
                            bgcolor: alpha('#f44336', 0.05),
                            borderRadius: 2,
                            border: `1px solid ${alpha('#f44336', 0.1)}`,
                        }}>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                Are you sure you want to delete this user?
                            </Typography>
                        </Box>

                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                borderRadius: 2,
                                bgcolor: alpha('#f5f5f5', 0.4),
                                border: `1px solid ${alpha('#000', 0.1)}`,
                                mb: 3,
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Avatar
                                    src={userToDelete.avatar}
                                    alt={userToDelete.name}
                                    sx={{
                                        width: 64,
                                        height: 64,
                                        bgcolor: alpha('#3f51b5', 0.1),
                                    }}
                                >
                                    {userToDelete.name?.charAt(0).toUpperCase()}
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" fontWeight={600}>
                                        {userToDelete.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {userToDelete.email}
                                    </Typography>
                                    <Box sx={{ mt: 1 }}>
                                        <Chip
                                            label={userToDelete.role?.name || 'No Role'}
                                            color="primary"
                                            size="small"
                                            variant="outlined"
                                            sx={{ fontWeight: 500 }}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        </Paper>

                        <Typography variant="body2" color="text.secondary">
                            This action cannot be undone. All data associated with this user will be permanently deleted, including:
                        </Typography>
                        <Box sx={{ pl: 2, mt: 1 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                • User profile and account information
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                • Application history
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                • Associated files and documents
                            </Typography>
                        </Box>
                    </Box>
                )}
            </Modal>
        </Layout>
    );
};

export default UsersIndex;


    // Fungsi untuk mengekspor data ke CSV
    const exportToCSV = () => {
        // Pastikan ada data untuk diekspor
        if (!filteredUsers || filteredUsers.length === 0) {
            alert('Tidak ada data untuk diekspor');
            return;
        }
    
        // Membuat header CSV
        const headers = [
            'ID', 'Nama', 'Email', 'NIM', 'Role', 'Status',
            'Tanggal Bergabung'
        ];
    
        // Mengubah data users menjadi format CSV
        const csvData = filteredUsers.map(user => [
            user.id,
            user.name || '-',
            user.email || '-',
            user.nim || '-',
            user.role?.name || '-',
            user.is_active ? 'Active' : 'Inactive',
            new Date(user.created_at).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            })
        ]);
    
        // Menggabungkan header dan data
        const csvContent = [
            headers.join(','),
            ...csvData.map(row => row.join(','))
        ].join('\n');
    
        // Membuat blob dan link untuk download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `users-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    // Fungsi untuk mencetak daftar pengguna
    const printUserList = () => {
        // Pastikan ada data untuk dicetak
        if (!filteredUsers || filteredUsers.length === 0) {
            alert('Tidak ada data untuk dicetak');
            return;
        }
    
        // Membuat konten HTML untuk dicetak
        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Daftar Pengguna - ${new Date().toLocaleDateString()}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 20px;
                    }
                    h1 {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th, td {
                        border: 1px solid #ddd;
                        padding: 8px;
                        text-align: left;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                    tr:nth-child(even) {
                        background-color: #f9f9f9;
                    }
                    .print-date {
                        text-align: right;
                        margin-bottom: 20px;
                        font-size: 12px;
                    }
                    .status-active {
                        color: green;
                        font-weight: bold;
                    }
                    .status-inactive {
                        color: #757575;
                        font-weight: bold;
                    }
                </style>
            </head>
            <body>
                <div class="print-date">Dicetak pada: ${new Date().toLocaleString()}</div>
                <h1>Daftar Pengguna</h1>
                <table>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Nama</th>
                            <th>Email</th>
                            <th>NIM</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Tanggal Bergabung</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredUsers.map((user, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${user.name || '-'}</td>
                                <td>${user.email || '-'}</td>
                                <td>${user.nim || '-'}</td>
                                <td>${user.role?.name || '-'}</td>
                                <td class="status-${user.is_active ? 'active' : 'inactive'}">${user.is_active ? 'Active' : 'Inactive'}</td>
                                <td>${new Date(user.created_at).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                })}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </body>
            </html>
        `;
    
        // Membuka jendela baru untuk mencetak
        const printWindow = window.open('', '_blank');
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
        
        // Menunggu konten dimuat sebelum mencetak
        printWindow.onload = function() {
            printWindow.print();
            // printWindow.close(); // Uncomment jika ingin jendela otomatis tertutup setelah mencetak
        };
    };
