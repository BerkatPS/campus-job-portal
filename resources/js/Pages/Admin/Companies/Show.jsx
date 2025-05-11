import React, { useState } from 'react';
import { usePage, Link, router } from '@inertiajs/react';
import {
    Box,
    Typography,
    Divider,
    Avatar,
    Chip,
    IconButton,
    Stack,
    Button as MuiButton,
    Paper,
    Table as MuiTable,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip
} from '@mui/material';
import {
    Business as BusinessIcon,
    ArrowBack as ArrowBackIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    LocationOn as LocationIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    Language as WebsiteIcon,
    Work as WorkIcon,
    Person as PersonIcon,
    Visibility as VisibilityIcon
} from '@mui/icons-material';
import { Head } from '@inertiajs/react';

// Import custom components
import Card from '@/Components/Shared/Card';
import Button from '@/Components/Shared/Button';
import Modal from '@/Components/Shared/Modal';
import Alert from '@/Components/Shared/Alert';
import Tabs from '@/Components/Shared/Tabs';
import Layout from '@/Components/Layout/Layout';

// Company Details Component
const CompanyDetails = ({ company, stats }) => {
    return (
        <Box>
            {/* Stats Cards */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
                <Box sx={{ flex: '1 1 220px', minWidth: '220px' }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                            border: '1px solid',
                            borderColor: 'divider',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'transform 0.2s',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                            }
                        }}
                    >
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Total Jobs Posted
                        </Typography>
                        <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
                            {stats?.jobs?.total || 0}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                            <Chip
                                label={`${stats?.jobs?.active || 0} Active`}
                                size="small"
                                color="success"
                                variant="outlined"
                            />
                            <Chip
                                label={`${stats?.jobs?.closed || 0} Closed`}
                                size="small"
                                color="default"
                                variant="outlined"
                            />
                        </Box>
                    </Paper>
                </Box>

                <Box sx={{ flex: '1 1 220px', minWidth: '220px' }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                            border: '1px solid',
                            borderColor: 'divider',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'transform 0.2s',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                            }
                        }}
                    >
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Total Applications
                        </Typography>
                        <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
                            {stats?.applications?.total || 0}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 'auto' }}>
                            <Chip
                                label={`${stats?.applications?.pending || 0} Pending`}
                                size="small"
                                color="warning"
                                variant="outlined"
                            />
                            <Chip
                                label={`${stats?.applications?.accepted || 0} Accepted`}
                                size="small"
                                color="success"
                                variant="outlined"
                            />
                        </Box>
                    </Paper>
                </Box>

                <Box sx={{ flex: '1 1 220px', minWidth: '220px' }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                            border: '1px solid',
                            borderColor: 'divider',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'transform 0.2s',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                            }
                        }}
                    >
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Total Managers
                        </Typography>
                        <Typography variant="h4" fontWeight={700}>
                            {company.managers_count || 0}
                        </Typography>
                    </Paper>
                </Box>

                <Box sx={{ flex: '1 1 220px', minWidth: '220px' }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                            border: '1px solid',
                            borderColor: 'divider',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'transform 0.2s',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                            }
                        }}
                    >
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Status
                        </Typography>
                        <Typography variant="h4" fontWeight={700} color={company.is_active ? 'success.main' : 'text.disabled'}>
                            {company.is_active ? 'Active' : 'Inactive'}
                        </Typography>
                    </Paper>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                <Box sx={{ flex: '1 1 60%', minWidth: '300px' }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 2,
                            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                            border: '1px solid',
                            borderColor: 'divider',
                            mb: 3
                        }}
                    >
                        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                            About Company
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                            {company.description || 'No description available.'}
                        </Typography>
                    </Paper>

                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 2,
                            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                            border: '1px solid',
                            borderColor: 'divider',
                        }}
                    >
                        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                            Contact Information
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                            {company.address && (
                                <Box sx={{ flex: '1 1 45%', minWidth: '200px' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                        <LocationIcon color="primary" />
                                        <Box>
                                            <Typography variant="body2" fontWeight={500}>
                                                Address
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {company.address}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            )}

                            {company.phone && (
                                <Box sx={{ flex: '1 1 45%', minWidth: '200px' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                        <PhoneIcon color="primary" />
                                        <Box>
                                            <Typography variant="body2" fontWeight={500}>
                                                Phone
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {company.phone}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            )}

                            {company.email && (
                                <Box sx={{ flex: '1 1 45%', minWidth: '200px' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                        <EmailIcon color="primary" />
                                        <Box>
                                            <Typography variant="body2" fontWeight={500}>
                                                Email
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {company.email}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            )}

                            {company.website && (
                                <Box sx={{ flex: '1 1 45%', minWidth: '200px' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                        <WebsiteIcon color="primary" />
                                        <Box>
                                            <Typography variant="body2" fontWeight={500}>
                                                Website
                                            </Typography>
                                            <Typography
                                                component="a"
                                                href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                variant="body2"
                                                sx={{ color: 'primary.main', textDecoration: 'none' }}
                                            >
                                                {company.website}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    </Paper>
                </Box>

                <Box sx={{ flex: '1 1 30%', minWidth: '300px' }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 2,
                            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                            border: '1px solid',
                            borderColor: 'divider',
                        }}
                    >
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                            <Avatar
                                src={company.logo || '/images/company-placeholder.png'}
                                alt={company.name}
                                variant="rounded"
                                sx={{ width: 120, height: 120, mb: 2 }}
                            />

                            <Typography variant="h6" fontWeight={600} align="center">
                                {company.name}
                            </Typography>

                            {company.industry && (
                                <Chip
                                    label={company.industry}
                                    color="primary"
                                    variant="outlined"
                                    size="small"
                                    sx={{ mt: 1 }}
                                />
                            )}
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Stack spacing={2}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="body2" color="text.secondary">
                                    Status
                                </Typography>
                                <Chip
                                    label={company.is_active ? 'Active' : 'Inactive'}
                                    color={company.is_active ? 'success' : 'default'}
                                    size="small"
                                />
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="body2" color="text.secondary">
                                    Created
                                </Typography>
                                <Typography variant="body2">
                                    {new Date(company.created_at).toLocaleDateString()}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="body2" color="text.secondary">
                                    Last Updated
                                </Typography>
                                <Typography variant="body2">
                                    {new Date(company.updated_at).toLocaleDateString()}
                                </Typography>
                            </Box>
                        </Stack>

                        <Divider sx={{ my: 2 }} />

                        <Button
                            variant="contained"
                            fullWidth
                            component={Link}
                            href={route('admin.companies.managers', company.id)}
                            sx={{ mb: 1 }}
                        >
                            Manage Managers
                        </Button>

                        <Button
                            variant="outlined"
                            fullWidth
                            component={Link}
                            href={route('admin.companies.edit', company.id)}
                        >
                            Edit Company Details
                        </Button>
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
};

// Company Jobs Component
const CompanyJobs = ({ jobs }) => {
    return (
        <Box>
            {jobs.length === 0 ? (
                <Paper
                    elevation={0}
                    sx={{
                        p: 5,
                        borderRadius: 2,
                        textAlign: 'center',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                        border: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <WorkIcon sx={{ fontSize: 50, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                        No jobs available
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        This company hasn't posted any jobs yet.
                    </Typography>
                </Paper>
            ) : (
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: 2,
                        overflow: 'hidden',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                        border: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <TableContainer>
                        <MuiTable>
                            <TableHead>
                                <TableRow sx={{ bgcolor: 'rgba(0, 0, 0, 0.02)' }}>
                                    <TableCell sx={{ fontWeight: 600 }}>Job Title</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Applications</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Deadline</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {jobs.map((job) => (
                                    <TableRow key={job.id} sx={{
                                        '&:hover': {
                                            bgcolor: 'rgba(0, 0, 0, 0.02)',
                                            '& .job-actions': {
                                                opacity: 1,
                                            }
                                        },
                                    }}>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <WorkIcon fontSize="small" color="primary" />
                                                <Typography variant="body2" fontWeight={500}>
                                                    {job.title}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            {job.category ? (
                                                <Chip
                                                    label={job.category.name}
                                                    size="small"
                                                    color="secondary"
                                                    variant="outlined"
                                                />
                                            ) : (
                                                <Typography variant="caption" color="text.disabled">
                                                    Uncategorized
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <LocationIcon fontSize="small" color="action" />
                                                <Typography variant="body2">
                                                    {job.location}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={job.job_type}
                                                size="small"
                                                color="primary"
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={job.applications_count || 0}
                                                size="small"
                                                color="default"
                                                sx={{
                                                    fontWeight: 500,
                                                    bgcolor: job.applications_count ? 'rgba(0, 0, 0, 0.08)' : 'transparent'
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {new Date(job.submission_deadline).toLocaleDateString()}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={job.status || (job.is_active ? 'Active' : 'Inactive')}
                                                size="small"
                                                color={
                                                    job.status === 'active' || job.is_active ? 'success' :
                                                        job.status === 'draft' ? 'warning' : 'default'
                                                }
                                                sx={{ minWidth: '70px' }}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Box
                                                className="job-actions"
                                                sx={{
                                                    opacity: { xs: 1, md: 0 },
                                                    transition: 'opacity 0.2s'
                                                }}
                                            >
                                                <Tooltip title="View Job Details">
                                                    <IconButton
                                                        size="small"
                                                        component={Link}
                                                        href={route('admin.jobs.show', job.id)}
                                                        sx={{ color: 'primary.main' }}
                                                    >
                                                        <VisibilityIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </MuiTable>
                    </TableContainer>
                </Paper>
            )}
        </Box>
    );
};

// Company Managers Component
const CompanyManagers = ({ managers }) => {
    return (
        <Box>
            {managers.length === 0 ? (
                <Paper
                    elevation={0}
                    sx={{
                        p: 5,
                        borderRadius: 2,
                        textAlign: 'center',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                        border: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <PersonIcon sx={{ fontSize: 50, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                        No managers assigned
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        This company doesn't have any managers assigned yet.
                    </Typography>
                </Paper>
            ) : (
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: 2,
                        overflow: 'hidden',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                        border: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <TableContainer>
                        <MuiTable>
                            <TableHead>
                                <TableRow sx={{ bgcolor: 'rgba(0, 0, 0, 0.02)' }}>
                                    <TableCell sx={{ fontWeight: 600 }}>Manager</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Since</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {managers.map((manager) => (
                                    <TableRow key={manager.id} sx={{
                                        '&:hover': {
                                            bgcolor: 'rgba(0, 0, 0, 0.02)',
                                            '& .manager-actions': {
                                                opacity: 1,
                                            }
                                        },
                                    }}>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Avatar
                                                    src={manager.user?.avatar}
                                                    alt={manager.user?.name}
                                                    sx={{
                                                        width: 36,
                                                        height: 36,
                                                        bgcolor: manager.is_primary ? 'primary.main' : 'grey.400',
                                                    }}
                                                >
                                                    <PersonIcon fontSize="small" />
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="body2" fontWeight={600}>
                                                        {manager.user?.name}
                                                    </Typography>
                                                    {manager.is_primary && (
                                                        <Typography variant="caption" color="primary" sx={{ fontWeight: 500 }}>
                                                            Primary Manager
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {manager.user?.email}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={manager.user?.role?.name || 'Manager'}
                                                size="small"
                                                color="secondary"
                                                variant="outlined"
                                                sx={{ fontWeight: 500 }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {new Date(manager.created_at).toLocaleDateString()}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={manager.user?.is_active ? 'Active' : 'Inactive'}
                                                size="small"
                                                color={manager.user?.is_active ? 'success' : 'default'}
                                                sx={{ fontWeight: 500 }}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Box
                                                className="manager-actions"
                                                sx={{
                                                    opacity: { xs: 1, md: 0 },
                                                    transition: 'opacity 0.2s'
                                                }}
                                            >
                                                <Tooltip title="View Manager Details">
                                                    <IconButton
                                                        size="small"
                                                        component={Link}
                                                        href={route('admin.users.show', manager.user?.id)}
                                                        sx={{ color: 'primary.main' }}
                                                    >
                                                        <VisibilityIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </MuiTable>
                    </TableContainer>
                </Paper>
            )}
        </Box>
    );
};

const CompanyShow = () => {
    const { company, managers, jobs, stats } = usePage().props;
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');

    // Tab content
    const tabs = [
        {
            label: 'Overview',
            content: (
                <CompanyDetails company={company} stats={stats} />
            )
        },
        {
            label: `Jobs (${jobs?.length || 0})`,
            content: (
                <CompanyJobs jobs={jobs || []} />
            )
        },
        {
            label: `Managers (${managers?.length || 0})`,
            content: (
                <CompanyManagers managers={managers || []} />
            )
        }
    ];

    const handleDelete = () => {
        setLoading(true);
        router.delete(route('admin.companies.destroy', company.id), {
            onSuccess: () => {
                // Redirection happens automatically
            },
            onError: () => {
                setShowDeleteModal(false);
                setAlertMessage('Failed to delete company. It may be associated with active jobs or applications.');
                setAlertSeverity('error');
                setShowAlert(true);
                setLoading(false);
            },
        });
    };

    return (
        <Layout>
            <Head title={`${company.name} - Company Details`} />

            {showAlert && (
                <Alert
                    severity={alertSeverity}
                    onClose={() => setShowAlert(false)}
                    sx={{ mb: 2 }}
                >
                    {alertMessage}
                </Alert>
            )}

            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                        component={Link}
                        href={route('admin.companies.index')}
                        size="small"
                        sx={{
                            bgcolor: 'background.paper',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            '&:hover': { bgcolor: 'background.paper' }
                        }}
                    >
                        <ArrowBackIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="h5" component="h1" fontWeight={600}>
                        {company.name}
                    </Typography>

                    {company.is_active ? (
                        <Chip
                            label="Active"
                            color="success"
                            size="small"
                            sx={{ ml: 1 }}
                        />
                    ) : (
                        <Chip
                            label="Inactive"
                            color="default"
                            size="small"
                            sx={{ ml: 1 }}
                        />
                    )}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        color="primary"
                        component={Link}
                        href={route('admin.companies.edit', company.id)}
                    >
                        Edit
                    </Button>

                    <Button
                        variant="outlined"
                        startIcon={<DeleteIcon />}
                        color="error"
                        onClick={() => setShowDeleteModal(true)}
                    >
                        Delete
                    </Button>
                </Box>
            </Box>

            <Card>
                <Tabs
                    tabs={tabs}
                    variant="contained"
                    padding={0}
                />
            </Card>

            {/* Delete Confirmation Modal */}
            <Modal
                open={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Delete Company"
                description={`Are you sure you want to delete ${company.name}? This action cannot be undone and may affect related jobs and applications.`}
                confirmButton
                cancelButton
                confirmText="Delete"
                confirmColor="error"
                onConfirm={handleDelete}
                loading={loading}
            />
        </Layout>
    );
};

export default CompanyShow;
