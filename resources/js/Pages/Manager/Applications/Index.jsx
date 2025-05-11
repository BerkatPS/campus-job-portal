import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { usePage, Link, Head } from '@inertiajs/react';
import {
    Box,
    Typography,
    IconButton,
    Tooltip,
    Chip,
    ButtonGroup,
    Paper,
    alpha,
    Stack,
    Divider,
    Avatar,
    Card as MuiCard,
    CardContent,
    useTheme
} from '@mui/material';
import {
    FilterList,
    MoreVert,
    ViewKanban,
    ViewList,
    FileDownload,
    Add,
    Business,
    Person,
    Search,
    Refresh,
    QueryStats,
    WorkOutline,
    Tune,
    Badge
} from '@mui/icons-material';

// Custom Components
import Card from '@/Components/Shared/Card';
import Table from '@/Components/Shared/Table';
import Button from '@/Components/Shared/Button';
import Pagination from '@/Components/Shared/Pagination';
import SearchBar from '@/Components/Shared/SearchBar';
import Select from '@/Components/Shared/Select';
import Dropdown from '@/Components/Shared/Dropdown';
import Alert from '@/Components/Shared/Alert';
import Layout from '@/Components/Layout/Layout';

// Stat Card Component
const StatCard = ({ title, value, icon, color }) => {
    const theme = useTheme();

    return (
        <MuiCard sx={{
            borderRadius: '1rem',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: 'none',
            overflow: 'hidden',
            transition: 'transform 0.2s, box-shadow 0.2s',
            height: '100%',
            '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.05)',
            }
        }}>
            <CardContent sx={{ p: 2.5, height: '100%' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Typography color="text.secondary" variant="body2">{title}</Typography>
                    <Box sx={{
                        p: 1,
                        borderRadius: '50%',
                        bgcolor: alpha(theme.palette[color].main, 0.1)
                    }}>
                        {icon}
                    </Box>
                </Stack>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: color === 'success' ? theme.palette.success.main : 'inherit' }}>
                    {value}
                </Typography>
            </CardContent>
        </MuiCard>
    );
};

const Index = () => {
    const { applications, filters, flash } = usePage().props;
    const theme = useTheme();

    const [searchParams, setSearchParams] = useState({
        search: '',
        status: '',
        job: '',
        page: 1
    });
    const [view, setView] = useState('list'); // 'list' or 'kanban'
    const [activeFilters, setActiveFilters] = useState(0);

    // Handle filter change
    const handleFilterChange = (name, value) => {
        setSearchParams(prev => ({
            ...prev,
            [name]: value,
            page: 1 // Reset page when filter changes
        }));
    };

    // Apply filters
    useEffect(() => {
        const params = Object.fromEntries(
            Object.entries(searchParams).filter(([_, v]) => v !== '')
        );

        // Count active filters
        setActiveFilters(Object.values(params).filter(v => v !== '').length);

        router.get(route('manager.applications.index'), params, {
            preserveState: true,
            replace: true,
            only: ['applications']
        });
    }, [searchParams]);

    // Define columns for the table
    const columns = [
        {
            field: 'id',
            header: 'ID',
            width: '70px',
        },
        {
            field: 'applicant',
            header: 'Applicant',
            render: (_, row) => (
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar
                        src={row.user?.avatar || '/images/avatars/default.png'}
                        alt={row.user?.name || 'User'}
                        sx={{
                            width: 40,
                            height: 40,
                            border: '2px solid',
                            borderColor: theme => alpha(theme.palette.primary.main, 0.2),
                        }}
                    />
                    <Box>
                        <Typography variant="body2" fontWeight="500">
                            {row.user?.name || 'Unknown User'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {row.user?.email || 'No email'}
                        </Typography>
                    </Box>
                </Stack>
            )
        },
        {
            field: 'job',
            header: 'Job Position',
            render: (_, row) => (
                row.job ? (
                    <Link href={route('manager.jobs.show', row.job?.id)}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <WorkOutline fontSize="small" color="primary" />
                            <Box>
                                <Typography variant="body2" color="primary.main" sx={{ fontWeight: 500 }}>
                                    {row.job?.title || 'Unnamed Position'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {row.job?.location || 'No location'}
                                </Typography>
                            </Box>
                        </Stack>
                    </Link>
                ) : (
                    <Typography variant="body2" color="text.secondary">
                        Position not available
                    </Typography>
                )
            )
        },
        {
            field: 'status',
            header: 'Status',
            render: (_, row) => (
                row.status ? (
                    <Chip
                        label={row.status.name}
                        size="small"
                        sx={{
                            backgroundColor: `${row.status.color}20`,
                            color: row.status.color,
                            fontWeight: 500,
                            borderRadius: '12px',
                            py: 0.5
                        }}
                    />
                ) : (
                    <Chip
                        label="Unknown"
                        size="small"
                        sx={{
                            backgroundColor: '#eee',
                            color: '#666',
                            fontWeight: 500,
                            borderRadius: '12px',
                            py: 0.5
                        }}
                    />
                )
            )
        },
        {
            field: 'current_stage',
            header: 'Current Stage',
            render: (_, row) => (
                row.current_stage ? (
                    <Chip
                        label={row.current_stage.name}
                        size="small"
                        variant="outlined"
                        sx={{
                            borderColor: row.current_stage.color,
                            color: row.current_stage.color,
                            borderRadius: '12px',
                            py: 0.5
                        }}
                    />
                ) : <Typography variant="caption">Not started</Typography>
            )
        },
        {
            field: 'created_at',
            header: 'Applied Date',
            render: (value) => value ? (
                <Stack direction="column" spacing={0.5}>
                    <Typography variant="body2" fontWeight="500">
                        {new Date(value).toLocaleDateString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                </Stack>
            ) : '-'
        }
    ];

    // Row action menu items
    const getRowActions = (row) => [
        {
            label: 'View Application',
            onClick: () => router.visit(route('manager.applications.show', row.id)),
            icon: <Person fontSize="small" />
        },
        {
            label: 'Schedule Interview',
            onClick: () => router.visit(route('manager.events.create', { application_id: row.id })),
            icon: <Add fontSize="small" />
        },
        { divider: true },
        {
            label: 'Mark as Favorite',
            onClick: () => markAsFavorite(row.id),
            color: row.is_favorite ? 'success' : 'inherit',
            icon: row.is_favorite ? <span className="material-icons-outlined">star</span> : <span className="material-icons-outlined">star_outline</span>
        },
        { divider: true },
        {
            label: 'Download Resume',
            onClick: () => row.resume ? window.open(row.resume_url, '_blank') : null,
            disabled: !row.resume,
            icon: <FileDownload fontSize="small" />
        }
    ];

    // Mark application as favorite
    const markAsFavorite = (id) => {
        router.post(route('manager.applications.toggle-favorite-post', id), {}, {
            preserveScroll: true,
            preserveState: true
        });
    };

    // Pagination change handler
    const handlePageChange = (page) => {
        setSearchParams(prev => ({ ...prev, page }));
    };

    // Export to CSV
    const exportToCSV = () => {
        router.get(route('manager.applications.export'), searchParams);
    };

    const statuses = filters?.statuses || [];
    const jobs = filters?.jobs || [];

    // Get application statistics
    const totalApplications = applications?.total || 0;
    const pendingApplications = applications?.data?.filter(app => app.status?.name === 'Pending').length || 0;
    const reviewingApplications = applications?.data?.filter(app => app.status?.name === 'Reviewing').length || 0;
    const shortlistedApplications = applications?.data?.filter(app => app.status?.name === 'Shortlisted').length || 0;

    return (
        <Layout>
            <Head title="Job Applications" />

            {/* Header Section with Stats */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, rgba(15, 118, 110, 0.08) 0%, rgba(20, 184, 166, 0.15) 100%)',
                    py: 4,
                    borderRadius: '1rem',
                    px: 3,
                    mb: 4,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                    border: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    justifyContent="space-between"
                    alignItems={{ xs: 'flex-start', md: 'center' }}
                    spacing={2}
                    sx={{ mb: 3 }}
                >
                    <Box>
                        <Typography variant="h5" fontWeight="600" gutterBottom>Job Applications</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Manage and review candidate applications for your open positions
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={2}>
                        <ButtonGroup
                            variant="outlined"
                            size="small"
                            sx={{
                                bgcolor: 'background.paper',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                            }}
                        >
                            <Tooltip title="List View">
                                <IconButton
                                    color={view === 'list' ? 'primary' : 'default'}
                                    onClick={() => setView('list')}
                                    sx={{ borderRadius: 0 }}
                                >
                                    <ViewList />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Kanban View">
                                <IconButton
                                    color={view === 'kanban' ? 'primary' : 'default'}
                                    onClick={() => {
                                        setView('kanban');
                                        router.visit(route('manager.applications.kanban'));
                                    }}
                                    sx={{ borderRadius: 0 }}
                                >
                                    <ViewKanban />
                                </IconButton>
                            </Tooltip>
                        </ButtonGroup>

                        <Tooltip title="Export Applications">
                            <Button
                                variant="contained"
                                startIcon={<FileDownload />}
                                onClick={exportToCSV}
                                size="small"
                                sx={{ borderRadius: '8px' }}
                            >
                                Export
                            </Button>
                        </Tooltip>
                    </Stack>
                </Stack>

                {/* Stats Cards */}
                <Box
                    sx={{
                        mt: 1,
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, 1fr)',
                            md: 'repeat(4, 1fr)'
                        },
                        gap: 2
                    }}
                >
                    <StatCard
                        title="Total Applications"
                        value={totalApplications}
                        icon={<Badge fontSize="small" color="primary" />}
                        color="primary"
                    />

                    <StatCard
                        title="Pending"
                        value={pendingApplications}
                        icon={<QueryStats fontSize="small" color="warning" />}
                        color="warning"
                    />

                    <StatCard
                        title="Reviewing"
                        value={reviewingApplications}
                        icon={<Person fontSize="small" color="info" />}
                        color="info"
                    />

                    <StatCard
                        title="Shortlisted"
                        value={shortlistedApplications}
                        icon={<WorkOutline fontSize="small" color="success" />}
                        color="success"
                    />
                </Box>
            </Box>

            {/* Alert Messages */}
            {flash?.success && (
                <Alert
                    severity="success"
                    title="Success"
                    onClose={() => router.reload({ only: ['flash'] })}
                    sx={{ mb: 3 }}
                >
                    {flash.success}
                </Alert>
            )}

            {/* Filter Bar */}
            <Paper
                elevation={0}
                sx={{
                    p: 2.5,
                    mb: 3,
                    borderRadius: '1rem',
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)'
                }}
            >
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, 1fr)',
                            md: '5fr 3fr 3fr 1fr'
                        },
                        gap: 2,
                        alignItems: 'center'
                    }}
                >
                    <Box>
                        <SearchBar
                            placeholder="Search applicants"
                            value={searchParams.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            size="small"
                            sx={{ borderRadius: '0.75rem' }}
                        />
                    </Box>

                    <Box>
                        <Select
                            options={jobs.map(job => ({ value: job.id, label: job.title }))}
                            value={searchParams.job}
                            onChange={(e) => handleFilterChange('job', e.target.value)}
                            placeholder="Job Position"
                            size="small"
                            startIcon={<WorkOutline fontSize="small" />}
                            sx={{ borderRadius: '0.75rem' }}
                        />
                    </Box>

                    <Box>
                        <Select
                            options={statuses.map(status => ({ value: status.id, label: status.name }))}
                            value={searchParams.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            placeholder="Status"
                            size="small"
                            startIcon={<Badge fontSize="small" />}
                            sx={{ borderRadius: '0.75rem' }}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                        <Stack direction="row" spacing={1}>
                            <Tooltip title="More Filters">
                                <IconButton
                                    color="primary"
                                    sx={{
                                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                                        '&:hover': {
                                            bgcolor: alpha(theme.palette.primary.main, 0.15),
                                        }
                                    }}
                                >
                                    <Tune />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Refresh">
                                <IconButton
                                    color="primary"
                                    onClick={() => router.reload({ only: ['applications'] })}
                                    sx={{
                                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                                        '&:hover': {
                                            bgcolor: alpha(theme.palette.primary.main, 0.15),
                                        }
                                    }}
                                >
                                    <Refresh />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    </Box>
                </Box>
            </Paper>

            {/* Application Table */}
            <Paper
                elevation={0}
                sx={{
                    overflow: 'hidden',
                    borderRadius: '1rem',
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)'
                }}
            >
                {applications?.data ? (
                    <Table
                        columns={columns}
                        data={applications.data}
                        onRowClick={(row) => router.visit(route('manager.applications.show', row.id))}
                        actions={(row) => (
                            <Dropdown
                                buttonType="icon"
                                icon={<MoreVert />}
                                items={getRowActions(row)}
                            />
                        )}
                        borderRadius="large"
                        variant="outlined"
                        zebraPattern
                        hoverEffect
                        sx={{
                            '& .MuiTableHead-root': {
                                bgcolor: alpha(theme.palette.primary.main, 0.04),
                            },
                            '& .MuiTableCell-head': {
                                fontWeight: 600,
                                color: theme.palette.text.primary
                            },
                            '& .MuiTableCell-root': {
                                borderColor: theme.palette.divider,
                                padding: '12px 16px',
                            },
                            '& .MuiTableRow-root:hover': {
                                bgcolor: alpha(theme.palette.primary.main, 0.04),
                            }
                        }}
                    />
                ) : (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="body1">Memuat data aplikasi...</Typography>
                    </Box>
                )}
            </Paper>

            {/* Pagination */}
            {applications?.data && applications.data.length > 0 && (
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    spacing={2}
                    sx={{ mt: 3 }}
                >
                    <Typography variant="body2" color="text.secondary">
                        Showing {applications.from}-{applications.to} of {applications.total} applications
                    </Typography>

                    <Pagination
                        currentPage={applications.current_page}
                        totalPages={applications.last_page}
                        onPageChange={handlePageChange}
                        totalItems={applications.total}
                        perPage={applications.per_page}
                        variant="rounded"
                    />
                </Stack>
            )}

            {/* Empty State */}
            {applications?.data && applications.data.length === 0 && (
                <Box sx={{ py: 8, textAlign: 'center' }}>
                    <Person sx={{ fontSize: 60, color: alpha(theme.palette.text.primary, 0.1), mb: 2 }} />
                    <Typography variant="h6" gutterBottom>No applications found</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
                        There are no applications matching your filters. Try changing your search criteria or check back later.
                    </Typography>
                </Box>
            )}
        </Layout>
    );
};

export default Index;
