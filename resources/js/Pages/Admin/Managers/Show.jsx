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
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    ListItemAvatar,
} from '@mui/material';
import {
    Person as PersonIcon,
    Business as BusinessIcon,
    ArrowBack as ArrowBackIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    CalendarToday as CalendarIcon,
    Work as WorkIcon,
    Apartment as ApartmentIcon,
    LocationOn as LocationIcon,
} from '@mui/icons-material';

// Import custom components
import Card from '@/Components/Shared/Card';
import Button from '@/Components/Shared/Button';
import Modal from '@/Components/Shared/Modal';
import Alert from '@/Components/Shared/Alert';
import Tabs from '@/Components/Shared/Tabs';
import Badge from '@/Components/Shared/Badge';
import Table from '@/Components/Shared/Table';
import Layout from '@/Components/Layout/Layout';

// Manager Overview Component
const ManagerOverview = ({ manager, company, user }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            {/* Left Column - User Information */}
            <Box sx={{ flex: 1 }}>
                <Paper sx={{ p: 3, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <Avatar
                            src={user?.avatar}
                            alt={user?.name}
                            sx={{ width: 80, height: 80 }}
                        >
                            {user?.name?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                            <Typography variant="h5" fontWeight={600}>
                                {user?.name}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                {user?.email}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                <Badge
                                    label={user?.role?.name || 'No Role'}
                                    color="primary"
                                    size="small"
                                    variant="outlined"
                                />
                                <Badge
                                    label={user?.is_active ? 'Active' : 'Inactive'}
                                    color={user?.is_active ? 'success' : 'default'}
                                    size="small"
                                />
                            </Box>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <List disablePadding>
                        {user?.email && (
                            <ListItem disablePadding sx={{ py: 1 }}>
                                <ListItemIcon sx={{ minWidth: 40 }}>
                                    <EmailIcon fontSize="small" color="action" />
                                </ListItemIcon>
                                <ListItemText primary="Email" secondary={user.email} />
                            </ListItem>
                        )}

                        {user?.profile?.phone && (
                            <ListItem disablePadding sx={{ py: 1 }}>
                                <ListItemIcon sx={{ minWidth: 40 }}>
                                    <PhoneIcon fontSize="small" color="action" />
                                </ListItemIcon>
                                <ListItemText primary="Phone" secondary={user.profile.phone} />
                            </ListItem>
                        )}

                        <ListItem disablePadding sx={{ py: 1 }}>
                            <ListItemIcon sx={{ minWidth: 40 }}>
                                <CalendarIcon fontSize="small" color="action" />
                            </ListItemIcon>
                            <ListItemText
                                primary="Joined"
                                secondary={user?.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                            />
                        </ListItem>

                        {user?.profile?.address && (
                            <ListItem disablePadding sx={{ py: 1 }}>
                                <ListItemIcon sx={{ minWidth: 40 }}>
                                    <LocationIcon fontSize="small" color="action" />
                                </ListItemIcon>
                                <ListItemText primary="Address" secondary={user.profile.address} />
                            </ListItem>
                        )}
                    </List>

                    <Box sx={{ mt: 3 }}>
                        <Button
                            variant="outlined"
                            startIcon={<PersonIcon />}
                            component={Link}
                            href={route('admin.users.show', user?.id)}
                            fullWidth
                        >
                            View Full User Profile
                        </Button>
                    </Box>
                </Paper>
            </Box>

            {/* Right Column - Company Information */}
            <Box sx={{ flex: 1 }}>
                <Paper sx={{ p: 3, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <Avatar
                            src={company?.logo}
                            alt={company?.name}
                            variant="rounded"
                            sx={{ width: 80, height: 80 }}
                        >
                            <BusinessIcon fontSize="large" />
                        </Avatar>
                        <Box>
                            <Typography variant="h5" fontWeight={600}>
                                {company?.name}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                {company?.industry || 'No Industry Specified'}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                <Badge
                                    label={manager?.is_primary ? 'Primary Manager' : 'Secondary Manager'}
                                    color={manager?.is_primary ? 'primary' : 'default'}
                                    size="small"
                                    variant={manager?.is_primary ? 'filled' : 'outlined'}
                                />
                                <Badge
                                    label={company?.is_active ? 'Active' : 'Inactive'}
                                    color={company?.is_active ? 'success' : 'default'}
                                    size="small"
                                />
                            </Box>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <List disablePadding>
                        {company?.email && (
                            <ListItem disablePadding sx={{ py: 1 }}>
                                <ListItemIcon sx={{ minWidth: 40 }}>
                                    <EmailIcon fontSize="small" color="action" />
                                </ListItemIcon>
                                <ListItemText primary="Company Email" secondary={company.email} />
                            </ListItem>
                        )}

                        {company?.phone && (
                            <ListItem disablePadding sx={{ py: 1 }}>
                                <ListItemIcon sx={{ minWidth: 40 }}>
                                    <PhoneIcon fontSize="small" color="action" />
                                </ListItemIcon>
                                <ListItemText primary="Company Phone" secondary={company.phone} />
                            </ListItem>
                        )}

                        {company?.website && (
                            <ListItem disablePadding sx={{ py: 1 }}>
                                <ListItemIcon sx={{ minWidth: 40 }}>
                                    <ApartmentIcon fontSize="small" color="action" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Website"
                                    secondary={
                                        <Link
                                            href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Typography variant="body2" color="primary" sx={{ textDecoration: 'none' }}>
                                                {company.website}
                                            </Typography>
                                        </Link>
                                    }
                                />
                            </ListItem>
                        )}

                        {company?.address && (
                            <ListItem disablePadding sx={{ py: 1 }}>
                                <ListItemIcon sx={{ minWidth: 40 }}>
                                    <LocationIcon fontSize="small" color="action" />
                                </ListItemIcon>
                                <ListItemText primary="Address" secondary={company.address} />
                            </ListItem>
                        )}
                    </List>

                    <Box sx={{ mt: 3 }}>
                        <Button
                            variant="outlined"
                            startIcon={<BusinessIcon />}
                            component={Link}
                            href={route('admin.companies.show', company?.id)}
                            fullWidth
                        >
                            View Full Company Profile
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
};

// Manager Jobs Component
const ManagerJobs = ({ jobs }) => {
    return (
        <Box>
            {!jobs || jobs.length === 0 ? (
                <Paper sx={{ p: 4, borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary">
                        No jobs have been posted by this company yet.
                    </Typography>
                </Paper>
            ) : (
                <Table
                    columns={[
                        {
                            field: 'title',
                            header: 'Job Title',
                            render: (title, job) => (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <WorkIcon fontSize="small" color="action" />
                                    <Typography variant="body2" fontWeight={500}>
                                        {title}
                                    </Typography>
                                </Box>
                            ),
                        },
                        {
                            field: 'location',
                            header: 'Location',
                            render: (location) => location || '-',
                        },
                        {
                            field: 'job_type',
                            header: 'Type',
                            render: (jobType) => (
                                <Badge
                                    label={jobType}
                                    color="primary"
                                    variant="outlined"
                                    size="small"
                                />
                            ),
                        },
                        {
                            field: 'status',
                            header: 'Status',
                            render: (status, job) => (
                                <Badge
                                    label={status || (job?.is_active ? 'Active' : 'Inactive')}
                                    color={
                                        status === 'published' ? 'success' :
                                            status === 'archived' ? 'warning' :
                                                status === 'closed' ? 'error' : 'default'
                                    }
                                    size="small"
                                />
                            ),
                        },
                        {
                            field: 'submission_deadline',
                            header: 'Deadline',
                            render: (deadline) => deadline ? new Date(deadline).toLocaleDateString() : '-',
                        },
                    ]}
                    data={jobs}
                    actions={(job) => (
                        <Button
                            variant="text"
                            color="primary"
                            size="small"
                            component={Link}
                            href={route('admin.jobs.show', job.id)}
                        >
                            View
                        </Button>
                    )}
                    emptyMessage="No jobs found"
                />
            )}
        </Box>
    );
};

const ManagerShow = () => {
    const { manager, company, user, jobs } = usePage().props;
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
                <ManagerOverview manager={manager} company={company} user={user} />
            )
        },
        {
            label: `Company Jobs (${jobs?.length || 0})`,
            content: (
                <ManagerJobs jobs={jobs || []} />
            )
        },
    ];

    const handleDelete = () => {
        setLoading(true);
        router.delete(route('admin.managers.destroy', manager.id), {
            onSuccess: () => {
                // Redirection happens automatically
            },
            onError: () => {
                setShowDeleteModal(false);
                setAlertMessage('Failed to remove manager association.');
                setAlertSeverity('error');
                setShowAlert(true);
                setLoading(false);
            },
        });
    };

    return (
        <Layout>
            {showAlert && (
                <Alert
                    severity={alertSeverity}
                    onClose={() => setShowAlert(false)}
                    sx={{ mb: 2 }}
                >
                    {alertMessage}
                </Alert>
            )}

            <Card
                title={`Company Manager: ${user?.name}`}
                icon={<PersonIcon />}
                action={
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                            component={Link}
                            href={route('admin.managers.index')}
                        >
                            Back
                        </Button>

                        <Button
                            variant="contained"
                            startIcon={<EditIcon />}
                            color="primary"
                            component={Link}
                            href={route('admin.managers.edit', manager?.id)}
                        >
                            Edit
                        </Button>

                        <Button
                            variant="outlined"
                            startIcon={<DeleteIcon />}
                            color="error"
                            onClick={() => setShowDeleteModal(true)}
                        >
                            Remove
                        </Button>
                    </Box>
                }
            >
                <Box sx={{ mb: 3 }}>
                    <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                        <Badge
                            label={manager?.is_primary ? 'Primary Manager' : 'Secondary Manager'}
                            color={manager?.is_primary ? 'primary' : 'default'}
                            size="small"
                        />
                        <Badge
                            label={company?.name}
                            color="secondary"
                            variant="outlined"
                            size="small"
                            icon={<BusinessIcon fontSize="small" />}
                        />
                        <Badge
                            label={user?.role?.name || 'No Role'}
                            color="info"
                            variant="outlined"
                            size="small"
                        />
                    </Stack>

                    <Tabs
                        tabs={tabs}
                        variant="contained"
                        padding={0}
                    />
                </Box>
            </Card>

            {/* Delete Confirmation Modal */}
            <Modal
                open={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Remove Manager"
                description={`Are you sure you want to remove ${user?.name} as a manager from ${company?.name}? This action cannot be undone.`}
                confirmButton
                cancelButton
                confirmText="Remove"
                confirmColor="error"
                onConfirm={handleDelete}
                loading={loading}
            />
        </Layout>
    );
};

export default ManagerShow;
