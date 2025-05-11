import React, { useState, useEffect } from 'react';
import { Head, usePage, Link, router } from '@inertiajs/react';
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
    Tab,
    Tabs,
    useTheme,
    Container,
    Card as MuiCard,
    CardContent,
    Menu,
    ListItemIcon,
    ListItemText,
    Stack,
    Button as MuiButton,
    MenuItem,
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    Edit as EditIcon,
    Visibility as ViewIcon,
    Delete as DeleteIcon,
    Business as BusinessIcon,
    FilterList as FilterIcon,
    CloudDownload as CloudDownloadIcon,
    Print as PrintIcon,
    Refresh as RefreshIcon,
    Language as LanguageIcon,
    CheckCircleOutline as CheckCircleOutlineIcon,
    DoDisturbOn as DoDisturbOnIcon,
    MoreVert as MoreVertIcon,
    MoreHoriz as MoreHorizIcon,
    OpenInNew as OpenInNewIcon,
    AccountBalance as AccountBalanceIcon,
    Info as InfoIcon,
    DataUsage as DataUsageIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// Import custom components
import Card from '@/Components/Shared/Card';
import Table from '@/Components/Shared/Table';
import Button from '@/Components/Shared/Button';
import Spinner from '@/Components/Shared/Spinner';
import Modal from '@/Components/Shared/Modal';
import Alert from '@/Components/Shared/Alert';
import Layout from '@/Components/Layout/Layout';

const CompaniesIndex = ({ companies = { data: [] }, filters = { industries: [] } }) => {
    const { flash } = usePage().props;
    const theme = useTheme();
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [companyToDelete, setCompanyToDelete] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [showAlert, setShowAlert] = useState(false);
    const [filterIndustry, setFilterIndustry] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [tabValue, setTabValue] = useState(0);
    const [actionsAnchorEl, setActionsAnchorEl] = useState(null);

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

    const handleOpenActionsMenu = (event) => {
        setActionsAnchorEl(event.currentTarget);
    };

    const handleCloseActionsMenu = () => {
        setActionsAnchorEl(null);
    };

    // Table columns configuration
    const columns = [
        {
            field: 'logo',
            header: '',
            width: '70px',
            render: (logo, company) => (
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Avatar
                        src={logo || '/default-logo.png'}
                        alt={company.name}
                        variant="rounded"
                        sx={{
                            width: 44,
                            height: 44,
                            bgcolor: logo ? 'transparent' : alpha(theme.palette.primary.main, 0.08),
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        }}
                    >
                        {!logo && <BusinessIcon color="primary" />}
                    </Avatar>
                </Box>
            ),
        },
        {
            field: 'name',
            header: 'Company Name',
            sortable: true,
            render: (name, company) => (
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="body1" fontWeight={600}>
                        {name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {company.address ? company.address.split(',')[0] : 'No location specified'}
                    </Typography>
                </Box>
            ),
        },
        {
            field: 'industry',
            header: 'Industry',
            sortable: true,
            render: (industry) => (
                <Chip
                    label={industry || 'Not specified'}
                    size="small"
                    color={industry ? 'primary' : 'default'}
                    variant={industry ? 'filled' : 'outlined'}
                    sx={{
                        bgcolor: industry ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                        color: industry ? theme.palette.primary.main : theme.palette.text.disabled,
                        fontWeight: 500,
                        '& .MuiChip-label': {
                            px: 1.5,
                        }
                    }}
                />
            ),
        },
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
                                bgcolor: alpha(theme.palette.success.main, 0.1),
                                color: theme.palette.success.dark,
                                fontWeight: 500,
                                '.MuiChip-icon': {
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
                                color: theme.palette.text.disabled,
                                fontWeight: 500,
                                '.MuiChip-icon': {
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
            field: 'website',
            header: 'Website',
            render: (website) => website ? (
                <Button
                    component="a"
                    href={website.startsWith('http') ? website : `https://${website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="text"
                    color="primary"
                    startIcon={<LanguageIcon fontSize="small" />}
                    endIcon={<OpenInNewIcon fontSize="small" />}
                    size="small"
                    sx={{
                        textTransform: 'none',
                        fontWeight: 400,
                        fontSize: '0.875rem',
                    }}
                >
                    {website.replace(/^https?:\/\//, '')}
                </Button>
            ) : (
                <Typography variant="body2" color="text.disabled">
                    Not provided
                </Typography>
            ),
        },
        {
            field: 'created_at',
            header: 'Created',
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

    // Filter companies based on search term and filters
    const filteredCompanies = companies?.data?.filter(company => {
        const matchesSearch = company?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (company?.industry && company.industry.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesIndustry = !filterIndustry || company?.industry === filterIndustry;

        const matchesStatus = !filterStatus ||
            (filterStatus === 'active' && company?.is_active) ||
            (filterStatus === 'inactive' && !company?.is_active);

        return matchesSearch && matchesIndustry && matchesStatus;
    }) || [];

    // Get stats for tabs
    const totalCompanies = companies?.data?.length || 0;
    const activeCompanies = companies?.data?.filter(c => c.is_active)?.length || 0;
    const inactiveCompanies = companies?.data?.filter(c => !c.is_active)?.length || 0;

    // Handle company deletion
    const handleDelete = () => {
        if (!companyToDelete) return;

        setLoading(true);
        router.delete(route('admin.companies.destroy', companyToDelete.id), {
            onSuccess: () => {
                setDeleteModal(false);
                setCompanyToDelete(null);
                setAlertMessage('Company deleted successfully.');
                setAlertSeverity('success');
                setShowAlert(true);
            },
            onError: (errors) => {
                setAlertMessage('Failed to delete company: ' + Object.values(errors).flat().join(' '));
                setAlertSeverity('error');
                setShowAlert(true);
            },
            onFinish: () => setLoading(false),
        });
    };

    // Toggle company active status
    const handleToggleActive = (company) => {
        router.post(route('admin.companies.toggle-active', company.id), {
            onSuccess: () => {
                setAlertMessage(`Company status ${company.is_active ? 'deactivated' : 'activated'} successfully.`);
                setAlertSeverity('success');
                setShowAlert(true);
            },
            onError: (errors) => {
                setAlertMessage('Failed to update company status: ' + Object.values(errors).flat().join(' '));
                setAlertSeverity('error');
                setShowAlert(true);
            }
        });
    };

    // Prepare the actions for the table
    const actions = (company) => (
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Tooltip title="View Details">
                <IconButton
                    size="small"
                    component={Link}
                    href={route('admin.companies.show', company.id)}
                    sx={{
                        color: theme.palette.info.main,
                        bgcolor: alpha(theme.palette.info.main, 0.1),
                        '&:hover': { bgcolor: alpha(theme.palette.info.main, 0.2) }
                    }}
                >
                    <ViewIcon fontSize="small" />
                </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
                <IconButton
                    size="small"
                    component={Link}
                    href={route('admin.companies.edit', company.id)}
                    sx={{
                        color: theme.palette.primary.main,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
                    }}
                >
                    <EditIcon fontSize="small" />
                </IconButton>
            </Tooltip>
            <Tooltip title={company.is_active ? "Deactivate" : "Activate"}>
                <IconButton
                    size="small"
                    onClick={() => handleToggleActive(company)}
                    sx={{
                        color: company.is_active ? theme.palette.warning.main : theme.palette.success.main,
                        bgcolor: company.is_active ? alpha(theme.palette.warning.main, 0.1) : alpha(theme.palette.success.main, 0.1),
                        '&:hover': {
                            bgcolor: company.is_active
                                ? alpha(theme.palette.warning.main, 0.2)
                                : alpha(theme.palette.success.main, 0.2)
                        }
                    }}
                >
                    {company.is_active ? <DoDisturbOnIcon fontSize="small" /> : <CheckCircleOutlineIcon fontSize="small" />}
                </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
                <IconButton
                    size="small"
                    onClick={() => {
                        setCompanyToDelete(company);
                        setDeleteModal(true);
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
        setFilterIndustry('');
        setFilterStatus('');
        setTabValue(0);
    };

    return (
        <Layout>
            <Head title="Companies Management" />

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
                        <BusinessIcon fontSize="large" />
                    </Avatar>
                    <Box>
                        <Typography variant="h4" component="h1" fontWeight={700}>
                            Companies
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Manage all registered companies in the portal
                        </Typography>
                    </Box>
                </Box>

                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        component={Link}
                        href={route('admin.companies.create')}
                        size="large"
                        sx={{ px: 3 }}
                    >
                        Add Company
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
                        <MuiCard
                            elevation={0}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                p: 2,
                                borderRadius: 2,
                                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                boxShadow: `0 1px 5px ${alpha(theme.palette.common.black, 0.05)}`,
                                bgcolor: alpha(theme.palette.primary.main, 0.03),
                            }}
                        >
                            <Avatar
                                sx={{
                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                    color: theme.palette.primary.main,
                                    width: 56,
                                    height: 56,
                                    mr: 2
                                }}
                            >
                                <BusinessIcon />
                            </Avatar>
                            <Box>
                                <Typography variant="h4" fontWeight={700} gutterBottom>
                                    {totalCompanies}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Total Companies
                                </Typography>
                            </Box>
                        </MuiCard>
                    </motion.div>
                </Box>

                <Box sx={{ flex: 1, minWidth: '220px', maxWidth: '270px' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
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
                                bgcolor: alpha(theme.palette.success.main, 0.03),
                            }}
                        >
                            <Avatar
                                sx={{
                                    bgcolor: alpha(theme.palette.success.main, 0.1),
                                    color: theme.palette.success.main,
                                    width: 56,
                                    height: 56,
                                    mr: 2
                                }}
                            >
                                <CheckCircleOutlineIcon />
                            </Avatar>
                            <Box>
                                <Typography variant="h4" fontWeight={700} gutterBottom>
                                    {activeCompanies}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Active Companies
                                </Typography>
                            </Box>
                        </MuiCard>
                    </motion.div>
                </Box>

                <Box sx={{ flex: 1, minWidth: '220px', maxWidth: '270px' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
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
                                bgcolor: alpha(theme.palette.grey[500], 0.03),
                            }}
                        >
                            <Avatar
                                sx={{
                                    bgcolor: alpha(theme.palette.grey[500], 0.1),
                                    color: theme.palette.grey[600],
                                    width: 56,
                                    height: 56,
                                    mr: 2
                                }}
                            >
                                <DoDisturbOnIcon />
                            </Avatar>
                            <Box>
                                <Typography variant="h4" fontWeight={700} gutterBottom>
                                    {inactiveCompanies}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Inactive Companies
                                </Typography>
                            </Box>
                        </MuiCard>
                    </motion.div>
                </Box>
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
                        <BusinessIcon color="primary" />
                        <Typography variant="h6" fontWeight={600}>
                            Company Directory
                        </Typography>
                    </Box>

                    <Box>
                        <Tooltip title="More Actions">
                            <IconButton onClick={handleOpenActionsMenu}>
                                <MoreVertIcon />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            anchorEl={actionsAnchorEl}
                            open={Boolean(actionsAnchorEl)}
                            onClose={handleCloseActionsMenu}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <MenuItem onClick={handleCloseActionsMenu}>
                                <ListItemIcon>
                                    <CloudDownloadIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Export to CSV</ListItemText>
                            </MenuItem>
                            <MenuItem onClick={handleCloseActionsMenu}>
                                <ListItemIcon>
                                    <PrintIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Print List</ListItemText>
                            </MenuItem>
                            <MenuItem onClick={handleCloseActionsMenu}>
                                <ListItemIcon>
                                    <RefreshIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Refresh Data</ListItemText>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Box>

                {/* Tabs */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        aria-label="company status tabs"
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
                        <Tab label="All Companies" />
                        <Tab label="Active" />
                        <Tab label="Inactive" />
                    </Tabs>
                </Box>

                {/* Filters */}
                <Box sx={{ p: 2, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                        <Box sx={{ flex: '1 1 260px' }}>
                            <TextField
                                fullWidth
                                placeholder="Search companies by name or industry..."
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
                        </Box>
                        <Box sx={{ flex: '1 1 220px' }}>
                            <TextField
                                select
                                fullWidth
                                size="small"
                                label="Industry"
                                value={filterIndustry}
                                onChange={(e) => setFilterIndustry(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AccountBalanceIcon fontSize="small" color="action" />
                                        </InputAdornment>
                                    ),
                                    sx: {
                                        borderRadius: 2,
                                    }
                                }}
                            >
                                <MenuItem value="">All Industries</MenuItem>
                                {filters?.industries?.map((industry) => (
                                    <MenuItem key={industry} value={industry}>
                                        {industry}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Tooltip title="Reset all filters">
                                <span>
                                    <IconButton
                                        color="primary"
                                        onClick={resetFilters}
                                        disabled={!searchTerm && !filterIndustry && tabValue === 0}
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
                        </Box>
                    </Box>
                </Box>

                {/* Filtered Results Stats */}
                <Box sx={{ px: 3, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="body2" color="text.secondary">
                            {filteredCompanies.length} {filteredCompanies.length === 1 ? 'company' : 'companies'} found
                            {(searchTerm || filterIndustry || filterStatus) ? ' with current filters' : ''}
                        </Typography>
                    </Box>
                    {(searchTerm || filterIndustry || tabValue > 0) && (
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
                            data={filteredCompanies}
                            columns={columns}
                            actions={actions}
                            pagination
                            paginationInfo={companies?.meta}
                            baseRoute="admin.companies.index"
                            emptyMessage="No companies found with the current filters."
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

            {/* Delete Confirmation Modal */}
            <Modal
                open={deleteModal}
                onClose={() => setDeleteModal(false)}
                title={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ bgcolor: alpha(theme.palette.error.main, 0.1), color: theme.palette.error.main }}>
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
                {companyToDelete && (
                    <Box>
                        <Box sx={{
                            p: 2,
                            mb: 3,
                            bgcolor: alpha(theme.palette.error.main, 0.05),
                            borderRadius: 2,
                            border: `1px solid ${alpha(theme.palette.error.main, 0.1)}`,
                        }}>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                Are you sure you want to delete this company?
                            </Typography>
                        </Box>

                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                borderRadius: 2,
                                bgcolor: alpha(theme.palette.background.default, 0.4),
                                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                mb: 3,
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Avatar
                                    src={companyToDelete.logo || null}
                                    alt={companyToDelete.name}
                                    variant="rounded"
                                    sx={{
                                        width: 64,
                                        height: 64,
                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                    }}
                                >
                                    {!companyToDelete.logo && <BusinessIcon fontSize="large" color="primary" />}
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" fontWeight={600}>
                                        {companyToDelete.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {companyToDelete.industry || 'No industry specified'} • {companyToDelete.address ? companyToDelete.address.split(',')[0] : 'No location'}
                                    </Typography>
                                    <Box sx={{ mt: 1 }}>
                                        <Chip
                                            label={companyToDelete.is_active ? 'Active' : 'Inactive'}
                                            color={companyToDelete.is_active ? 'success' : 'default'}
                                            size="small"
                                            variant={companyToDelete.is_active
                                                ? 'filled'
                                                : 'outlined'}
                                            sx={{
                                                fontWeight: 500,
                                                bgcolor: companyToDelete.is_active
                                                    ? alpha(theme.palette.success.main, 0.1)
                                                    : 'transparent',
                                                color: companyToDelete.is_active
                                                    ? theme.palette.success.dark
                                                    : theme.palette.text.disabled,
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </Box>

                            {companyToDelete.website && (
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    mt: 2,
                                    p: 1,
                                    borderRadius: 1,
                                    bgcolor: alpha(theme.palette.background.paper, 0.5),
                                }}>
                                    <LanguageIcon fontSize="small" color="primary" />
                                    <Typography variant="body2" component="a"
                                                href={companyToDelete.website.startsWith('http') ? companyToDelete.website : `https://${companyToDelete.website}`}
                                                target="_blank"
                                                sx={{ color: theme.palette.primary.main, textDecoration: 'none' }}
                                    >
                                        {companyToDelete.website}
                                    </Typography>
                                </Box>
                            )}
                        </Paper>

                        <Box sx={{
                            display: 'flex',
                            gap: 1,
                            alignItems: 'center',
                            p: 2,
                            bgcolor: alpha(theme.palette.warning.main, 0.05),
                            borderRadius: 2,
                            border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`,
                        }}
                        >
                            <InfoIcon color="warning" fontSize="small" />
                            <Typography variant="body2" color="text.secondary">
                                <strong>Warning:</strong> This action cannot be undone. All data associated with this company will be permanently deleted.
                            </Typography>
                        </Box>

                        <Box sx={{ mt: 3, p: 2, bgcolor: alpha(theme.palette.error.main, 0.03), borderRadius: 2 }}>
                            <Typography variant="body2" color="error.main" sx={{ fontWeight: 500, mb: 1 }}>
                                The following data will be deleted:
                            </Typography>
                            <Stack spacing={1}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Chip size="small" label="Company Profile" />
                                    <Typography variant="body2" color="text.secondary">
                                        All company information and logo
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Chip size="small" label="Job Listings" />
                                    <Typography variant="body2" color="text.secondary">
                                        All active and inactive job postings
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Chip size="small" label="Manager Assignments" />
                                    <Typography variant="body2" color="text.secondary">
                                        All manager associations
                                    </Typography>
                                </Box>
                            </Stack>
                        </Box>
                    </Box>

                )}
            </Modal>
        </Layout>
    );
};

export default CompaniesIndex;
