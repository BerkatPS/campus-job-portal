import React, { useState } from 'react';
import { usePage, Link, router } from '@inertiajs/react';
import {
    Box,
    Typography,
    Divider,
    Avatar,
    Chip,
    Stack,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
} from '@mui/material';
import {
    Person as PersonIcon,
    ArrowBack as ArrowBackIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    CalendarToday as CalendarIcon,
    Work as WorkIcon,
    Badge as BadgeIcon,
    LocationOn as LocationIcon,
    School as SchoolIcon,
    Business as BusinessIcon,
    Description as DescriptionIcon,
    CheckCircle as CheckCircleIcon,
    Language as LanguageIcon,
    LinkedIn as LinkedInIcon,
    GitHub as GitHubIcon,
    Twitter as TwitterIcon,
} from '@mui/icons-material';

// Import custom components
import Card from '@/Components/Shared/Card';
import Button from '@/Components/Shared/Button';
import Modal from '@/Components/Shared/Modal';
import Alert from '@/Components/Shared/Alert';
import Tabs from '@/Components/Shared/Tabs';
import Table from '@/Components/Shared/Table';
import Layout from "@/Components/Layout/Layout.jsx";

// User Profile Component
const UserProfile = ({ user, profile }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 33%' } }}>
                <Paper sx={{ p: 3, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                        <Avatar
                            src={user.avatar}
                            alt={user.name}
                            sx={{ width: 120, height: 120, mb: 2 }}
                        >
                            {user.name?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="h5" fontWeight={600} align="center">
                            {user.name}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" align="center">
                            {user.email}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                            <Chip
                                label={user.role?.name || 'No Role'}
                                color="primary"
                                size="small"
                            />
                            <Chip
                                label={user.is_active ? 'Active' : 'Inactive'}
                                color={user.is_active ? 'success' : 'default'}
                                size="small"
                            />
                        </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <List disablePadding>
                        {user.nim && (
                            <ListItem disablePadding sx={{ py: 1 }}>
                                <ListItemIcon sx={{ minWidth: 40 }}>
                                    <BadgeIcon fontSize="small" color="action" />
                                </ListItemIcon>
                                <ListItemText primary="NIM/Student ID" secondary={user.nim} />
                            </ListItem>
                        )}

                        {user.email_verified_at && (
                            <ListItem disablePadding sx={{ py: 1 }}>
                                <ListItemIcon sx={{ minWidth: 40 }}>
                                    <CheckCircleIcon fontSize="small" color="success" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Email Verified"
                                    secondary={new Date(user.email_verified_at).toLocaleDateString()}
                                />
                            </ListItem>
                        )}

                        <ListItem disablePadding sx={{ py: 1 }}>
                            <ListItemIcon sx={{ minWidth: 40 }}>
                                <CalendarIcon fontSize="small" color="action" />
                            </ListItemIcon>
                            <ListItemText
                                primary="Joined"
                                secondary={new Date(user.created_at).toLocaleDateString()}
                            />
                        </ListItem>

                        {user.updated_at && (
                            <ListItem disablePadding sx={{ py: 1 }}>
                                <ListItemIcon sx={{ minWidth: 40 }}>
                                    <CalendarIcon fontSize="small" color="action" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Last Updated"
                                    secondary={new Date(user.updated_at).toLocaleDateString()}
                                />
                            </ListItem>
                        )}
                    </List>
                </Paper>
            </Box>

            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 67%' } }}>
                {/* Candidate Profile Information */}
                {profile && (
                    <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                        <Typography variant="h6" gutterBottom fontWeight={600}>
                            Candidate Profile
                        </Typography>

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                            {profile.date_of_birth && (
                                <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)' } }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                        <CalendarIcon fontSize="small" color="action" />
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Date of Birth
                                            </Typography>
                                            <Typography variant="body1">
                                                {new Date(profile.date_of_birth).toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            )}

                            {profile.phone && (
                                <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)' } }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                        <PhoneIcon fontSize="small" color="action" />
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Phone
                                            </Typography>
                                            <Typography variant="body1">
                                                {profile.phone}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            )}

                            {profile.address && (
                                <Box sx={{ flex: '1 1 100%' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
                                        <LocationIcon fontSize="small" color="action" sx={{ mt: 0.5 }} />
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Address
                                            </Typography>
                                            <Typography variant="body1">
                                                {profile.address}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            )}
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {profile.education && (
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
                                        <SchoolIcon fontSize="small" color="action" sx={{ mt: 0.5 }} />
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Education
                                            </Typography>
                                            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                                                {profile.education}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            )}

                            {profile.experience && (
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
                                        <WorkIcon fontSize="small" color="action" sx={{ mt: 0.5 }} />
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Experience
                                            </Typography>
                                            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                                                {profile.experience}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            )}

                            {profile.skills && (
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
                                        <BadgeIcon fontSize="small" color="action" sx={{ mt: 0.5 }} />
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Skills
                                            </Typography>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                                                {profile.skills.split(',').map((skill, index) => (
                                                    <Chip
                                                        key={index}
                                                        label={skill.trim()}
                                                        size="small"
                                                        color="primary"
                                                        variant="outlined"
                                                    />
                                                ))}
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            )}
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                            {profile.linkedin && (
                                <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)' } }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <LinkedInIcon fontSize="small" color="primary" />
                                        <Typography
                                            variant="body2"
                                            component="a"
                                            href={profile.linkedin.startsWith('http') ? profile.linkedin : `https://${profile.linkedin}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{ color: 'primary.main', textDecoration: 'none' }}
                                        >
                                            LinkedIn Profile
                                        </Typography>
                                    </Box>
                                </Box>
                            )}

                            {profile.github && (
                                <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)' } }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <GitHubIcon fontSize="small" />
                                        <Typography
                                            variant="body2"
                                            component="a"
                                            href={profile.github.startsWith('http') ? profile.github : `https://${profile.github}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{ color: 'primary.main', textDecoration: 'none' }}
                                        >
                                            GitHub Profile
                                        </Typography>
                                    </Box>
                                </Box>
                            )}

                            {profile.website && (
                                <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)' } }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <LanguageIcon fontSize="small" color="action" />
                                        <Typography
                                            variant="body2"
                                            component="a"
                                            href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{ color: 'primary.main', textDecoration: 'none' }}
                                        >
                                            Personal Website
                                        </Typography>
                                    </Box>
                                </Box>
                            )}

                            {profile.twitter && (
                                <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)' } }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <TwitterIcon fontSize="small" color="info" />
                                        <Typography
                                            variant="body2"
                                            component="a"
                                            href={profile.twitter.startsWith('http') ? profile.twitter : `https://twitter.com/${profile.twitter}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{ color: 'primary.main', textDecoration: 'none' }}
                                        >
                                            Twitter Profile
                                        </Typography>
                                    </Box>
                                </Box>
                            )}
                        </Box>

                        {profile.resume && (
                            <Box sx={{ mt: 3 }}>
                                <Button
                                    variant="outlined"
                                    startIcon={<DescriptionIcon />}
                                    component="a"
                                    href={profile.resume}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    View Resume
                                </Button>
                            </Box>
                        )}
                    </Paper>
                )}
            </Box>
        </Box>
    );
};

// User Applications Component
const UserApplications = ({ applications }) => {
    // Get stage chip color based on stage name
    const getStageColor = (stage) => {
        const stageMap = {
            'screening': 'info',
            'interview': 'warning',
            'offer': 'success',
            'rejected': 'error',
            'hired': 'secondary',
        };
        return stageMap[stage?.slug] || 'default';
    };

    // Get status chip color based on status name
    const getStatusColor = (status) => {
        const statusMap = {
            'new': 'primary',
            'in-progress': 'info',
            'accepted': 'success',
            'rejected': 'error',
            'withdrawn': 'default',
        };
        return statusMap[status?.slug] || 'default';
    };

    return (
        <Box>
            {applications.length === 0 ? (
                <Paper sx={{ p: 4, borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary">
                        This user hasn't submitted any job applications yet.
                    </Typography>
                </Paper>
            ) : (
                <Table
                    columns={[
                        {
                            field: 'job',
                            header: 'Job',
                            render: (job) => (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <WorkIcon fontSize="small" color="action" />
                                    <Box>
                                        <Typography variant="body2" fontWeight={500}>
                                            {job?.title}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {job?.company?.name}
                                        </Typography>
                                    </Box>
                                </Box>
                            ),
                        },
                        {
                            field: 'current_stage',
                            header: 'Stage',
                            render: (stage) => (
                                <Chip
                                    label={stage?.name || 'Not Started'}
                                    color={getStageColor(stage)}
                                    size="small"
                                />
                            ),
                        },
                        {
                            field: 'status',
                            header: 'Status',
                            render: (status) => (
                                <Chip
                                    label={status?.name || 'Unknown'}
                                    color={getStatusColor(status)}
                                    size="small"
                                />
                            ),
                        },
                        {
                            field: 'created_at',
                            header: 'Applied On',
                            render: (date) => new Date(date).toLocaleDateString(),
                        },
                    ]}
                    data={applications}
                    actions={(application) => (
                        <Button
                            variant="text"
                            color="primary"
                            size="small"
                            component={Link}
                            href={route('admin.applications.show', application.id)}
                        >
                            View
                        </Button>
                    )}
                    emptyMessage="No applications found"
                />
            )}
        </Box>
    );
};

// User Company Management Component
const UserCompanies = ({ companies }) => {
    return (
        <Box>
            {companies.length === 0 ? (
                <Paper sx={{ p: 4, borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary">
                        This user is not managing any companies.
                    </Typography>
                </Paper>
            ) : (
                <Table
                    columns={[
                        {
                            field: 'company',
                            header: 'Company',
                            render: (_, manager) => (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {manager.company?.logo ? (
                                        <Avatar
                                            src={manager.company.logo}
                                            alt={manager.company?.name}
                                            variant="rounded"
                                            sx={{ width: 30, height: 30 }}
                                        />
                                    ) : (
                                        <BusinessIcon color="action" fontSize="small" />
                                    )}
                                    <Typography variant="body2" fontWeight={500}>
                                        {manager.company?.name}
                                    </Typography>
                                </Box>
                            ),
                        },
                        {
                            field: 'is_primary',
                            header: 'Role',
                            render: (isPrimary) => (
                                <Chip
                                    label={isPrimary ? 'Primary Manager' : 'Secondary Manager'}
                                    color={isPrimary ? 'primary' : 'default'}
                                    size="small"
                                    variant={isPrimary ? 'filled' : 'outlined'}
                                />
                            ),
                        },
                        {
                            field: 'created_at',
                            header: 'Added On',
                            render: (date) => new Date(date).toLocaleDateString(),
                        },
                    ]}
                    data={companies}
                    actions={(manager) => (
                        <Button
                            variant="text"
                            color="primary"
                            size="small"
                            component={Link}
                            href={route('admin.companies.show', manager.company_id)}
                        >
                            View Company
                        </Button>
                    )}
                    emptyMessage="No companies found"
                />
            )}
        </Box>
    );
};

const UserShow = () => {
    const { user, profile, applications, companies } = usePage().props;
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');

    // Tab content
    const tabs = [
        {
            label: 'Profile',
            content: (
                <UserProfile user={user} profile={profile} />
            )
        },
        {
            label: `Applications (${applications ? applications.length : 0})`,
            content: (
                <UserApplications applications={applications || []} />
            )
        },
        {
            label: `Company Management (${companies ? companies.length : 0})`,
            content: (
                <UserCompanies companies={companies || []} />
            )
        }
    ];

    const handleDelete = () => {
        setLoading(true);
        router.delete(route('admin.users.destroy', user.id), {
            onSuccess: () => {
                // Redirection happens automatically
            },
            onError: () => {
                setShowDeleteModal(false);
                setAlertMessage('Failed to delete user. There may be active applications or related data.');
                setAlertSeverity('error');
                setShowAlert(true);
                setLoading(false);
            },
        });
    };

    return (
        <>
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
                title={`User Profile: ${user.name}`}
                icon={<PersonIcon />}
                action={
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                            component={Link}
                            href={route('admin.users.index')}
                        >
                            Back
                        </Button>

                        <Button
                            variant="contained"
                            startIcon={<EditIcon />}
                            color="primary"
                            component={Link}
                            href={route('admin.users.edit', user.id)}
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
                }
            >
                <Box sx={{ mb: 3 }}>
                    <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                        <Chip
                            label={user.role?.name || 'No Role'}
                            color="primary"
                            size="small"
                        />
                        <Chip
                            label={user.is_active ? 'Active' : 'Inactive'}
                            color={user.is_active ? 'success' : 'default'}
                            size="small"
                        />
                        {user.email_verified_at && (
                            <Chip
                                label="Email Verified"
                                color="success"
                                size="small"
                                variant="outlined"
                                icon={<CheckCircleIcon fontSize="small" />}
                            />
                        )}
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
                title="Delete User"
                description={`Are you sure you want to delete ${user.name}? This action cannot be undone and will permanently remove all data associated with this user.`}
                confirmButton
                cancelButton
                confirmText="Delete"
                confirmColor="error"
                onConfirm={handleDelete}
                loading={loading}
            />
            </Layout>
        </>
    );
};

export default UserShow;
