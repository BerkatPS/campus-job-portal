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
    Divider,
    alpha,
    Stack,
    Card as MuiCard,
    CardContent,
    useTheme,
    Badge,
    Avatar,
    Pagination,
    PaginationItem
} from '@mui/material';
import {
    Event,
    CalendarMonth,
    ViewAgenda,
    Refresh,
    Add,
    MoreVert,
    Edit,
    Delete,
    Person,
    BusinessCenter,
    VideoCall,
    LocationOn,
    CheckCircle,
    CancelOutlined,
    CheckCircleOutline,
    CancelOutlined as CancelIcon,
    Tune,
    Email,
    Search,
    EventAvailable
} from '@mui/icons-material';

// Custom Components
import Table from '@/Components/Shared/Table';
import Button from '@/Components/Shared/Button';
import CustomPagination from '@/Components/Shared/Pagination';
import SearchBar from '@/Components/Shared/SearchBar';
import Select from '@/Components/Shared/Select';
import Dropdown from '@/Components/Shared/Dropdown';
import Alert from '@/Components/Shared/Alert';
import Modal from '@/Components/Shared/Modal';
import Calendar from '@/Components/Shared/Calendar/Calendar';
import Layout from "@/Components/Layout/Layout.jsx";
import SweetAlert from '@/Components/Shared/SweetAlert';

const EventsIndex = () => {
    const { events, filterOptions, filters, flash } = usePage().props;
    const theme = useTheme();

    // Initialize searchParams with all available filter options from the controller
    const [searchParams, setSearchParams] = useState({
        search: filters.search || '',
        status: filters.status || '',
        type: filters.type || '',
        job: filters.job || '',
        timeframe: filters.timeframe || 'upcoming',
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
        sort: filters.sort || 'start_time',
        direction: filters.direction || 'asc',
        page: events.current_page || 1
    });

    const [view, setView] = useState('list'); // 'list' or 'calendar'
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [openDetailsModal, setOpenDetailsModal] = useState(false);
    const [openCancelModal, setOpenCancelModal] = useState(false);
    const [openCompleteModal, setOpenCompleteModal] = useState(false);
    const [openFilterDrawer, setOpenFilterDrawer] = useState(false);

    // SweetAlert state
    const [sweetAlert, setSweetAlert] = useState({
        show: false,
        title: '',
        text: '',
        icon: '',
        confirmButtonText: '',
        showCancelButton: false,
        cancelButtonText: '',
        onConfirm: null
    });

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

        router.get(route('manager.events.index'), params, {
            preserveState: true,
            replace: true,
            only: ['events']
        });
    }, [searchParams]);

    // Get color for event based on type and status (matches controller logic)
    const getEventColor = (type, status) => {
        if (status === 'cancelled') {
            return '#9e9e9e'; // Grey for cancelled events
        }

        // More subtle colors
        switch (type) {
            case 'interview':
                return '#4caf50'; // Green for interviews (kept for visual recognition)
            case 'test':
                return '#f59e0b'; // Amber for tests (slightly more muted)
            case 'meeting':
                return '#3b82f6'; // Blue for meetings (slightly more muted)
            default:
                return '#8b5cf6'; // Purple for other events (slightly more muted)
        }
    };

    // Define columns for the table
    const columns = [
        {
            field: 'title',
            header: 'Judul Acara',
            render: (value, row) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                        icon={row.type === 'interview' ? <Person fontSize="small" /> : <Event fontSize="small" />}
                        label={
                            row.type === 'interview' ? 'Wawancara' :
                                row.type === 'test' ? 'Tes' :
                                    row.type === 'meeting' ? 'Rapat' : 'Lainnya'
                        }
                        size="small"
                        sx={{
                            bgcolor: getEventColor(row.type, row.status),
                            color: 'white',
                            fontWeight: 500,
                            height: 24,
                            borderRadius: '12px'
                        }}
                    />
                    <Box>
                        <Typography variant="body2" fontWeight="500">
                            {value}
                        </Typography>
                        {row.description && (
                            <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 250, display: 'block' }}>
                                {row.description}
                            </Typography>
                        )}
                    </Box>
                </Box>
            )
        },
        {
            field: 'start_time',
            header: 'Tanggal & Waktu',
            render: (value, row) => (
                <Box>
                    <Typography variant="body2" fontWeight="500">
                        {new Date(value).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {new Date(value).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})} - {new Date(row.end_time).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}
                    </Typography>
                </Box>
            )
        },
        {
            field: 'job_application',
            header: 'Kandidat',
            render: (value, row) => {
                // Handle candidate info consistently based on controller response format
                if (row.job_application && row.job_application.user) {
                    return (
                        <Link href={route('manager.applications.show', row.job_application.id)}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Person fontSize="small" color="primary" />
                                <Box>
                                    <Typography variant="body2" fontWeight="500" color="primary.main">
                                        {row.job_application.user.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {row.job_application.user.email}
                                    </Typography>
                                </Box>
                            </Box>
                        </Link>
                    );
                } else {
                    return (
                        <Typography variant="caption" color="text.secondary">
                            Tidak ada kandidat spesifik
                        </Typography>
                    );
                }
            }
        },
        {
            field: 'job',
            header: 'Posisi Pekerjaan',
            render: (value, row) => value ? (
                <Link href={route('manager.jobs.show', value.id)}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BusinessCenter fontSize="small" color="primary" />
                        <Box>
                            <Typography variant="body2" fontWeight="500" color="primary.main">
                                {value.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {value.company.name}
                            </Typography>
                        </Box>
                    </Box>
                </Link>
            ) : (
                <Typography variant="caption" color="text.secondary">
                    Acara umum
                </Typography>
            )
        },
        {
            field: 'location',
            header: 'Lokasi',
            render: (value, row) => (
                <Box>
                    {value ? (
                        <Typography variant="body2">
                            <LocationOn fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5, color: 'primary.main' }} />
                            {value}
                        </Typography>
                    ) : null}

                    {row.meeting_link && (
                        <Typography variant="body2">
                            <Link href={row.meeting_link} target="_blank" style={{ display: 'inline-flex', alignItems: 'center' }}>
                                <VideoCall fontSize="small" sx={{ mr: 0.5, color: 'primary.main' }} />
                                Tautan Meeting
                            </Link>
                        </Typography>
                    )}
                </Box>
            )
        },
        {
            field: 'status',
            header: 'Status',
            render: (value) => (
                <Chip
                    label={
                        value === 'scheduled' ? 'Terjadwal' :
                            value === 'completed' ? 'Selesai' :
                                value === 'cancelled' ? 'Dibatalkan' :
                                    value === 'rescheduled' ? 'Dijadwalkan Ulang' : value
                    }
                    size="small"
                    variant="outlined"
                    color={
                        value === 'scheduled' ? 'primary' :
                            value === 'completed' ? 'success' :
                                value === 'cancelled' ? 'error' :
                                    value === 'rescheduled' ? 'warning' : 'default'
                    }
                    sx={{
                        fontWeight: 500,
                        borderRadius: '12px',
                        textTransform: 'capitalize',
                        '& .MuiChip-label': { px: 1.5 }
                    }}
                />
            )
        }
    ];

    // Format events for calendar (matches controller's calendar format)
    const calendarEvents = events.data ? events.data.map(event => ({
        id: event.id,
        title: event.title,
        start: event.start_time,
        end: event.end_time,
        backgroundColor: getEventColor(event.type, event.status),
        textColor: '#ffffff',
        borderColor: 'transparent',
        extendedProps: {
            ...event,
            type: event.type,
            status: event.status,
            location: event.location,
            job: event.job
        }
    })) : [];

    // Row action menu items
    const getRowActions = (row) => [
        {
            label: 'Lihat Detail',
            onClick: () => {
                setSelectedEvent(row);
                setOpenDetailsModal(true);
            },
            icon: <Event fontSize="small" />
        },
        {
            label: 'Edit Acara',
            onClick: () => router.visit(route('manager.events.edit', row.id)),
            icon: <Edit fontSize="small" />
        },
        { divider: true },
        {
            label: 'Tandai Selesai',
            onClick: () => {
                setSelectedEvent(row);
                setOpenCompleteModal(true);
            },
            icon: <CheckCircle fontSize="small" />,
            disabled: row.status === 'completed' || row.status === 'cancelled'
        },
        {
            label: 'Batalkan Acara',
            onClick: () => {
                setSelectedEvent(row);
                setOpenCancelModal(true);
            },
            icon: <CancelOutlined fontSize="small" />,
            disabled: row.status === 'completed' || row.status === 'cancelled',
            color: 'error'
        },
        { divider: true },
        {
            label: 'Hapus',
            onClick: () => deleteEvent(row.id),
            icon: <Delete fontSize="small" />,
            color: 'error'
        }
    ];

    // Mark event as completed (calls controller's updateStatus method)
    const completeEvent = () => {
        router.post(route('manager.events.update-status', selectedEvent.id), {
            status: 'completed'
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setOpenCompleteModal(false);
                setSweetAlert({
                    show: true,
                    title: 'Berhasil!',
                    text: 'Acara telah ditandai sebagai selesai.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            },
            onError: () => {
                setSweetAlert({
                    show: true,
                    title: 'Gagal',
                    text: 'Terjadi kesalahan saat menandai acara sebagai selesai.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        });
    };

    // Cancel event (calls controller's updateStatus method)
    const cancelEvent = () => {
        router.post(route('manager.events.update-status', selectedEvent.id), {
            status: 'cancelled'
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setOpenCancelModal(false);
                setSweetAlert({
                    show: true,
                    title: 'Berhasil!',
                    text: 'Acara telah dibatalkan.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            },
            onError: () => {
                setSweetAlert({
                    show: true,
                    title: 'Gagal',
                    text: 'Terjadi kesalahan saat membatalkan acara.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        });
    };

    // Delete event (calls controller's destroy method)
    const deleteEvent = (id) => {
        setSweetAlert({
            show: true,
            title: 'Konfirmasi Penghapusan',
            text: 'Apakah Anda yakin ingin menghapus acara ini? Tindakan ini tidak dapat dibatalkan.',
            icon: 'warning',
            confirmButtonText: 'Ya, Hapus',
            showCancelButton: true,
            cancelButtonText: 'Batal',
            onConfirm: () => {
                router.delete(route('manager.events.destroy', id), {
                    onSuccess: () => {
                        setSweetAlert({
                            show: true,
                            title: 'Berhasil!',
                            text: 'Acara telah dihapus.',
                            icon: 'success',
                            confirmButtonText: 'OK'
                        });
                    },
                    onError: () => {
                        setSweetAlert({
                            show: true,
                            title: 'Gagal',
                            text: 'Terjadi kesalahan saat menghapus acara.',
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                    }
                });
            }
        });
    };

    // Handle calendar event click
    const handleEventClick = (info) => {
        setSelectedEvent(info.event.extendedProps);
        setOpenDetailsModal(true);
    };

    // Handle date click on calendar
    const handleDateClick = (info) => {
        router.visit(route('manager.events.create', { date: info.dateStr }));
    };

    // Pagination change handler
    const handlePageChange = (page) => {
        setSearchParams(prev => ({ ...prev, page }));
    };

    // Count number of active filters
    const activeFilterCount = Object.entries(searchParams).filter(
        ([key, value]) => value !== '' && key !== 'page' && key !== 'sort' && key !== 'direction'
    ).length;

    // Get event type counts
    const eventTypeCounts = {
        all: events.total || 0,
        scheduled: events.data ? events.data.filter(e => e.status === 'scheduled').length : 0,
        completed: events.data ? events.data.filter(e => e.status === 'completed').length : 0,
        cancelled: events.data ? events.data.filter(e => e.status === 'cancelled').length : 0
    };

    // Handle sort change
    const handleSortChange = (field, direction) => {
        setSearchParams(prev => ({
            ...prev,
            sort: field,
            direction: direction,
            page: 1
        }));
    };

    // Parse attendees from JSON if needed
    const parseAttendees = (attendees) => {
        if (!attendees) return [];
        if (typeof attendees === 'string') {
            try {
                return JSON.parse(attendees);
            } catch (e) {
                return [];
            }
        }
        return attendees;
    };

    return (
        <Layout>
            <Head title="Acara & Wawancara" />

            {/* SweetAlert */}
            {sweetAlert.show && (
                <SweetAlert
                    title={sweetAlert.title}
                    text={sweetAlert.text}
                    icon={sweetAlert.icon}
                    showConfirmButton={true}
                    confirmButtonText={sweetAlert.confirmButtonText}
                    showCancelButton={sweetAlert.showCancelButton}
                    cancelButtonText={sweetAlert.cancelButtonText}
                    onConfirm={() => {
                        if (sweetAlert.onConfirm) {
                            sweetAlert.onConfirm();
                        }
                        setSweetAlert({ ...sweetAlert, show: false });
                    }}
                    onCancel={() => setSweetAlert({ ...sweetAlert, show: false })}
                    onClose={() => setSweetAlert({ ...sweetAlert, show: false })}
                />
            )}

            {/* Modern Header Section */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mb: 3,
                    flexWrap: { xs: 'wrap', sm: 'nowrap' },
                    gap: 2
                }}>
                    <Box>
                        <Typography variant="h5" fontWeight="600" gutterBottom>Acara & Wawancara</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Kelola acara, wawancara, dan rapat yang terjadwal
                        </Typography>
                    </Box>

                    <Box sx={{ 
                        display: 'flex', 
                        gap: 2,
                        marginLeft: { xs: 0, sm: 'auto' }
                    }}>
                        {/* View toggles */}
                        <ButtonGroup 
                            variant="outlined" 
                            size="small" 
                            sx={{
                                borderRadius: 2,
                                border: '1px solid',
                                borderColor: 'divider',
                                bgcolor: 'background.paper',
                                '& .MuiButtonGroup-grouped:not(:last-of-type)': {
                                    borderColor: 'divider',
                                },
                            }}
                        >
                            <Tooltip title="Tampilan Daftar">
                                <IconButton
                                    color={view === 'list' ? 'primary' : 'default'}
                                    onClick={() => setView('list')}
                                    sx={{ borderRadius: 0 }}
                                >
                                    <ViewAgenda />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Tampilan Kalender">
                                <IconButton
                                    color={view === 'calendar' ? 'primary' : 'default'}
                                    onClick={() => setView('calendar')}
                                    sx={{ borderRadius: 0 }}
                                >
                                    <CalendarMonth />
                                </IconButton>
                            </Tooltip>
                        </ButtonGroup>

                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() => router.visit(route('manager.events.create'))}
                            sx={{ 
                                borderRadius: '0.75rem',
                                minWidth: '180px',
                                boxShadow: 1,
                                '&:hover': {
                                    boxShadow: 2
                                }
                            }}
                        >
                            Jadwalkan Acara
                        </Button>
                    </Box>
                </Box>

                {/* Stats Cards - Modern, minimalist design */}
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, 1fr)',
                            md: 'repeat(4, 1fr)'
                        },
                        gap: 2.5,
                    }}
                >
                    {/* Card 1 - Total Events */}
                    <MuiCard sx={{
                        borderRadius: '1rem',
                        border: '1px solid',
                        borderColor: 'divider',
                        boxShadow: 'none',
                        backgroundColor: 'background.paper',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: 1,
                        }
                    }}>
                        <CardContent sx={{ p: 2.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Box sx={{
                                    mr: 1.5,
                                    p: 1,
                                    borderRadius: '12px',
                                    bgcolor: alpha(theme.palette.primary.main, 0.1)
                                }}>
                                    <Event fontSize="small" color="primary" />
                                </Box>
                                <Typography color="text.secondary" variant="body2">Total Acara</Typography>
                            </Box>
                            <Typography variant="h4" sx={{ fontWeight: '500' }}>
                                {eventTypeCounts.all}
                            </Typography>
                        </CardContent>
                    </MuiCard>

                    {/* Card 2 - Scheduled Events */}
                    <MuiCard sx={{
                        borderRadius: '1rem',
                        border: '1px solid',
                        borderColor: 'divider',
                        boxShadow: 'none',
                        backgroundColor: 'background.paper',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: 1,
                        }
                    }}>
                        <CardContent sx={{ p: 2.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Box sx={{
                                    mr: 1.5,
                                    p: 1,
                                    borderRadius: '12px',
                                    bgcolor: alpha(theme.palette.primary.main, 0.1)
                                }}>
                                    <EventAvailable fontSize="small" color="primary" />
                                </Box>
                                <Typography color="text.secondary" variant="body2">Terjadwal</Typography>
                            </Box>
                            <Typography variant="h4" sx={{ fontWeight: '500' }}>
                                {eventTypeCounts.scheduled}
                            </Typography>
                        </CardContent>
                    </MuiCard>

                    {/* Card 3 - Completed Events */}
                    <MuiCard sx={{
                        borderRadius: '1rem',
                        border: '1px solid',
                        borderColor: 'divider',
                        boxShadow: 'none',
                        backgroundColor: 'background.paper',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: 1,
                        }
                    }}>
                        <CardContent sx={{ p: 2.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Box sx={{
                                    mr: 1.5,
                                    p: 1,
                                    borderRadius: '12px',
                                    bgcolor: alpha(theme.palette.success.main, 0.1)
                                }}>
                                    <CheckCircleOutline fontSize="small" color="success" />
                                </Box>
                                <Typography color="text.secondary" variant="body2">Selesai</Typography>
                            </Box>
                            <Typography variant="h4" sx={{ fontWeight: '500', color: 'success.main' }}>
                                {eventTypeCounts.completed}
                            </Typography>
                        </CardContent>
                    </MuiCard>

                    {/* Card 4 - Cancelled Events */}
                    <MuiCard sx={{
                        borderRadius: '1rem',
                        border: '1px solid',
                        borderColor: 'divider',
                        boxShadow: 'none',
                        backgroundColor: 'background.paper',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: 1,
                        }
                    }}>
                        <CardContent sx={{ p: 2.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Box sx={{
                                    mr: 1.5,
                                    p: 1,
                                    borderRadius: '12px',
                                    bgcolor: alpha(theme.palette.error.main, 0.1)
                                }}>
                                    <CancelIcon fontSize="small" color="error" />
                                </Box>
                                <Typography color="text.secondary" variant="body2">Dibatalkan</Typography>
                            </Box>
                            <Typography variant="h4" sx={{ fontWeight: '500', color: 'error.main' }}>
                                {eventTypeCounts.cancelled}
                            </Typography>
                        </CardContent>
                    </MuiCard>
                </Box>
            </Box>

            {/* Filter Bar - Modernized */}
            <Paper
                elevation={0}
                sx={{
                    p: 2.5,
                    mb: 3,
                    borderRadius: '1rem',
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: 'none'
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 2,
                        alignItems: 'center'
                    }}
                >
                    {/* Search field */}
                    <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 40%' } }}>
                        <SearchBar
                            placeholder="Cari acara..."
                            value={searchParams.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            size="small"
                            startIcon={<Search fontSize="small" />}
                            sx={{ 
                                borderRadius: '0.75rem',
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'divider',
                                    },
                                },
                            }}
                        />
                    </Box>

                    {/* Event Type dropdown */}
                    <Box sx={{ flex: { xs: '1 1 calc(50% - 8px)', sm: '1 1 calc(33.33% - 11px)', md: '1 1 20%' } }}>
                        <Select
                            options={filterOptions.types ? filterOptions.types.map(type => ({
                                value: type.value,
                                label: type.value === 'interview' ? 'Wawancara' :
                                    type.value === 'test' ? 'Tes' :
                                        type.value === 'meeting' ? 'Rapat' : type.label
                            })) : []}
                            value={searchParams.type}
                            onChange={(e) => handleFilterChange('type', e.target.value)}
                            placeholder="Tipe Acara"
                            size="small"
                            sx={{ 
                                borderRadius: '0.75rem',
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'divider',
                                    },
                                },
                            }}
                        />
                    </Box>

                    {/* Status dropdown */}
                    <Box sx={{ flex: { xs: '1 1 calc(50% - 8px)', sm: '1 1 calc(33.33% - 11px)', md: '1 1 20%' } }}>
                        <Select
                            options={filterOptions.statuses ? filterOptions.statuses.map(status => ({
                                value: status.value,
                                label: status.value === 'scheduled' ? 'Terjadwal' :
                                    status.value === 'completed' ? 'Selesai' :
                                        status.value === 'cancelled' ? 'Dibatalkan' :
                                            status.value === 'rescheduled' ? 'Dijadwalkan Ulang' : status.label
                            })) : []}
                            value={searchParams.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            placeholder="Status"
                            size="small"
                            sx={{ 
                                borderRadius: '0.75rem',
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'divider',
                                    },
                                },
                            }}
                        />
                    </Box>
                    {/* Filter buttons */}
                    <Box sx={{
                        display: 'flex',
                        justifyContent: { xs: 'flex-start', md: 'flex-end' },
                        flex: { xs: '1 1 100%', md: '0 0 auto' },
                    }}>
                        <Stack direction="row" spacing={1}>
                            <Badge badgeContent={activeFilterCount} color="primary" invisible={activeFilterCount === 0}>
                                <Tooltip title="Filter Lanjutan">
                                    <IconButton
                                        color="primary"
                                        onClick={() => setOpenFilterDrawer(true)}
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
                            </Badge>

                            <Tooltip title="Segarkan">
                                <IconButton
                                    color="primary"
                                    onClick={() => router.reload({ only: ['events'] })}
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

            {/* Advanced Filters Modal */}
            <Modal
                open={openFilterDrawer}
                onClose={() => setOpenFilterDrawer(false)}
                title="Filter Lanjutan"
                maxWidth="sm"
                confirmButton
                confirmText="Terapkan Filter"
                onConfirm={() => setOpenFilterDrawer(false)}
                cancelButton
                cancelText="Reset"
                onCancel={() => {
                    setSearchParams({
                        search: '',
                        status: '',
                        type: '',
                        job: '',
                        timeframe: 'upcoming',
                        date_from: '',
                        date_to: '',
                        sort: 'start_time',
                        direction: 'asc',
                        page: 1
                    });
                    setOpenFilterDrawer(false);
                }}
            >
                <Box sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>Periode Waktu</Typography>
                    <Box sx={{ mb: 3 }}>
                        <Select
                            options={filterOptions.timeframes ? filterOptions.timeframes.map(timeframe => ({
                                value: timeframe.value,
                                label: timeframe.value === 'upcoming' ? 'Akan Datang' :
                                    timeframe.value === 'past' ? 'Sudah Lewat' :
                                        timeframe.value === 'today' ? 'Hari Ini' :
                                            timeframe.value === 'week' ? 'Minggu Ini' :
                                                timeframe.value === 'month' ? 'Bulan Ini' : timeframe.label
                            })) : []}
                            value={searchParams.timeframe}
                            onChange={(e) => handleFilterChange('timeframe', e.target.value)}
                            placeholder="Periode Waktu"
                            fullWidth
                            size="small"
                            sx={{ mb: 2 }}
                        />

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="caption" gutterBottom>Dari Tanggal</Typography>
                                <input
                                    type="date"
                                    value={searchParams.date_from}
                                    onChange={(e) => handleFilterChange('date_from', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '8px',
                                        border: '1px solid #ddd',
                                        borderRadius: '8px'
                                    }}
                                />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="caption" gutterBottom>Sampai Tanggal</Typography>
                                <input
                                    type="date"
                                    value={searchParams.date_to}
                                    onChange={(e) => handleFilterChange('date_to', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '8px',
                                        border: '1px solid #ddd',
                                        borderRadius: '8px'
                                    }}
                                />
                            </Box>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="subtitle2" gutterBottom>Opsi Pengurutan</Typography>
                    <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            <Box sx={{ flex: 1 }}>
                                <Select
                                    options={[
                                        { value: 'start_time', label: 'Tanggal & Waktu' },
                                        { value: 'title', label: 'Judul Acara' },
                                        { value: 'type', label: 'Tipe Acara' },
                                        { value: 'status', label: 'Status' },
                                    ]}
                                    value={searchParams.sort}
                                    onChange={(e) => handleSortChange(e.target.value, searchParams.direction)}
                                    placeholder="Urutkan Berdasarkan"
                                    fullWidth
                                    size="small"
                                />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <Select
                                    options={[
                                        { value: 'asc', label: 'Naik' },
                                        { value: 'desc', label: 'Turun' },
                                    ]}
                                    value={searchParams.direction}
                                    onChange={(e) => handleSortChange(searchParams.sort, e.target.value)}
                                    placeholder="Arah"
                                    fullWidth
                                    size="small"
                                />
                            </Box>
                        </Box>
                    </Box>

                    <Typography variant="subtitle2" gutterBottom>Filter Cepat</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        <Chip
                            label="Acara Hari Ini"
                            clickable
                            onClick={() => handleFilterChange('timeframe', 'today')}
                            color={searchParams.timeframe === 'today' ? 'primary' : 'default'}
                            variant={searchParams.timeframe === 'today' ? 'filled' : 'outlined'}
                            sx={{ borderRadius: '1rem' }}
                        />
                        <Chip
                            label="Minggu Ini"
                            clickable
                            onClick={() => handleFilterChange('timeframe', 'week')}
                            color={searchParams.timeframe === 'week' ? 'primary' : 'default'}
                            variant={searchParams.timeframe === 'week' ? 'filled' : 'outlined'}
                            sx={{ borderRadius: '1rem' }}
                        />
                        <Chip
                            label="Bulan Ini"
                            clickable
                            onClick={() => handleFilterChange('timeframe', 'month')}
                            color={searchParams.timeframe === 'month' ? 'primary' : 'default'}
                            variant={searchParams.timeframe === 'month' ? 'filled' : 'outlined'}
                            sx={{ borderRadius: '1rem' }}
                        />
                        <Chip
                            label="Akan Datang"
                            clickable
                            onClick={() => handleFilterChange('timeframe', 'upcoming')}
                            color={searchParams.timeframe === 'upcoming' ? 'primary' : 'default'}
                            variant={searchParams.timeframe === 'upcoming' ? 'filled' : 'outlined'}
                            sx={{ borderRadius: '1rem' }}
                        />
                        <Chip
                            label="Acara Lalu"
                            clickable
                            onClick={() => handleFilterChange('timeframe', 'past')}
                            color={searchParams.timeframe === 'past' ? 'primary' : 'default'}
                            variant={searchParams.timeframe === 'past' ? 'filled' : 'outlined'}
                            sx={{ borderRadius: '1rem' }}
                        />
                    </Box>
                </Box>
            </Modal>

            {view === 'list' ? (
                <>
                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: '1rem',
                            border: '1px solid',
                            borderColor: 'divider',
                            boxShadow: 'none',
                            overflow: 'hidden',
                            mb: 3
                        }}
                    >
                        <Table
                            columns={columns}
                            data={events.data || []}
                            getRowActions={getRowActions}
                            handleSort={handleSortChange}
                            sort={searchParams.sort}
                            direction={searchParams.direction}
                            emptyMessage="Tidak ada acara yang tersedia"
                        />
                    </Paper>

                    {events?.last_page > 1 && (
                        <Paper
                            elevation={0}
                            sx={{
                                borderRadius: '1rem',
                                border: '1px solid',
                                borderColor: 'divider',
                                boxShadow: 'none',
                                p: 2,
                                mb: 3
                            }}
                        >
                            <CustomPagination
                                currentPage={events.current_page}
                                totalPages={events.last_page}
                                totalItems={events.total}
                                perPage={events.per_page}
                                onPageChange={(page) => {
                                    handleFilterChange('page', page);
                                }}
                                onPerPageChange={(newPerPage) => {
                                    handleFilterChange('per_page', newPerPage);
                                    handleFilterChange('page', 1); // Reset to page 1 when changing per_page
                                }}
                                showFirst
                                showLast
                                rounded="large"
                            />
                        </Paper>
                    )}
                </>
            ) : (
                <Paper
                    elevation={0}
                    sx={{
                        overflow: 'hidden',
                        borderRadius: '1rem',
                        border: '1px solid',
                        borderColor: 'divider'
                    }}
                >
                    <Calendar
                        events={calendarEvents}
                        eventClick={handleEventClick}
                        dateClick={handleDateClick}
                        height="750px"
                        initialView="dayGridMonth"
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
                        }}
                    />
                </Paper>
            )}

            {/* Event Details Modal */}
            {selectedEvent && (
                <Modal
                    open={openDetailsModal}
                    onClose={() => setOpenDetailsModal(false)}
                    title="Detail Acara"
                    maxWidth="md"
                    sx={{
                        '& .MuiDialogTitle-root': {
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            px: 3,
                            py: 2,
                            bgcolor: alpha(theme.palette.primary.main, 0.04),
                        },
                        '& .MuiDialogContent-root': {
                            p: 0,
                        },
                    }}
                >
                    <Box sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                            {/* Left side content */}
                            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 65%' } }}>
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="h5" fontWeight="600" gutterBottom>{selectedEvent.title}</Typography>

                                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                        <Chip
                                            icon={selectedEvent.type === 'interview' ? <Person fontSize="small" /> : <Event fontSize="small" />}
                                            label={
                                                selectedEvent.type === 'interview' ? 'Wawancara' :
                                                    selectedEvent.type === 'test' ? 'Tes' :
                                                        selectedEvent.type === 'meeting' ? 'Rapat' : 'Lainnya'
                                            }
                                            size="small"
                                            sx={{
                                                bgcolor: getEventColor(selectedEvent.type, selectedEvent.status),
                                                color: 'white',
                                                fontWeight: 500,
                                                height: 24,
                                                borderRadius: '12px'
                                            }}
                                        />
                                        <Chip
                                            label={
                                                selectedEvent.status === 'scheduled' ? 'Terjadwal' :
                                                    selectedEvent.status === 'completed' ? 'Selesai' :
                                                        selectedEvent.status === 'cancelled' ? 'Dibatalkan' :
                                                            selectedEvent.status === 'rescheduled' ? 'Dijadwalkan Ulang' : selectedEvent.status
                                            }
                                            size="small"
                                            color={
                                                selectedEvent.status === 'scheduled' ? 'primary' :
                                                    selectedEvent.status === 'completed' ? 'success' :
                                                        selectedEvent.status === 'cancelled' ? 'error' :
                                                            selectedEvent.status === 'rescheduled' ? 'warning' : 'default'
                                            }
                                            sx={{
                                                fontWeight: 500,
                                                borderRadius: '12px',
                                                textTransform: 'capitalize'
                                            }}
                                        />
                                    </Box>

                                    {selectedEvent.description && (
                                        <Typography variant="body2" color="text.secondary" paragraph>
                                            {selectedEvent.description}
                                        </Typography>
                                    )}
                                </Box>

                                <Divider sx={{ my: 3 }} />

                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                                    {/* Date & Time card */}
                                    <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)' } }}>
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 2,
                                                borderRadius: '1rem',
                                                bgcolor: alpha(theme.palette.primary.main, 0.05),
                                                border: '1px solid',
                                                borderColor: alpha(theme.palette.primary.main, 0.1),
                                            }}
                                        >
                                            <Typography variant="subtitle2" fontWeight="bold" color="primary.main" gutterBottom>
                                                Tanggal & Waktu
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <CalendarMonth color="primary" fontSize="small" sx={{ mr: 1 }} />
                                                <Typography variant="body2" fontWeight="500">
                                                    {new Date(selectedEvent.start_time).toLocaleDateString('id-ID', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', pl: 3.5 }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    {new Date(selectedEvent.start_time).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})} -
                                                    {new Date(selectedEvent.end_time).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}
                                                </Typography>
                                            </Box>
                                        </Paper>
                                    </Box>

                                    {/* Location card */}
                                    {selectedEvent.location && (
                                        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)' } }}>
                                            <Paper
                                                elevation={0}
                                                sx={{
                                                    p: 2,
                                                    borderRadius: '1rem',
                                                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                                                    border: '1px solid',
                                                    borderColor: alpha(theme.palette.primary.main, 0.1),
                                                }}
                                            >
                                                <Typography variant="subtitle2" fontWeight="bold" color="primary.main" gutterBottom>
                                                    Lokasi
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                                    <LocationOn color="primary" fontSize="small" sx={{ mr: 1, mt: 0.3 }} />
                                                    <Typography variant="body2">
                                                        {selectedEvent.location}
                                                    </Typography>
                                                </Box>
                                            </Paper>
                                        </Box>
                                    )}

                                    {/* Meeting Link card */}
                                    {selectedEvent.meeting_link && (
                                        <Box sx={{ flex: { xs: '1 1 100%', sm: selectedEvent.location ? '1 1 100%' : '1 1 calc(50% - 12px)' } }}>
                                            <Paper
                                                elevation={0}
                                                sx={{
                                                    p: 2,
                                                    borderRadius: '1rem',
                                                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                                                    border: '1px solid',
                                                    borderColor: alpha(theme.palette.primary.main, 0.1),
                                                }}
                                            >
                                                <Typography variant="subtitle2" fontWeight="bold" color="primary.main" gutterBottom>
                                                    Tautan Meeting
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                                    <VideoCall color="primary" fontSize="small" sx={{ mr: 1, mt: 0.3 }} />
                                                    <Box>
                                                        <Button
                                                            component="a"
                                                            href={selectedEvent.meeting_link}
                                                            target="_blank"
                                                            variant="outlined"
                                                            size="small"
                                                            startIcon={<VideoCall />}
                                                            sx={{ borderRadius: '0.75rem', mb: 1 }}
                                                        >
                                                            Gabung Meeting
                                                        </Button>
                                                        <Typography variant="caption" display="block" color="text.secondary">
                                                            {selectedEvent.meeting_link}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Paper>
                                        </Box>
                                    )}
                                </Box>

                                <Divider sx={{ my: 3 }} />

                                <Typography variant="subtitle2" fontWeight="bold" color="primary.main" gutterBottom>
                                    Peserta
                                </Typography>
                                {selectedEvent.attendees && parseAttendees(selectedEvent.attendees).length > 0 ? (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {parseAttendees(selectedEvent.attendees).map((attendee, index) => (
                                            <Chip
                                                key={index}
                                                avatar={<Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                                                    {attendee.charAt(0).toUpperCase()}
                                                </Avatar>}
                                                label={attendee}
                                                size="small"
                                                variant="outlined"
                                                sx={{
                                                    borderRadius: '1rem',
                                                    borderColor: alpha(theme.palette.primary.main, 0.3),
                                                    bgcolor: alpha(theme.palette.primary.main, 0.05)
                                                }}
                                            />
                                        ))}
                                    </Box>
                                ) : (
                                    <Typography variant="body2" color="text.secondary">
                                        Tidak ada peserta yang terdaftar
                                    </Typography>
                                )}

                                {/* Notes section */}
                                {selectedEvent.notes && (
                                    <>
                                        <Divider sx={{ my: 3 }} />
                                        <Typography variant="subtitle2" fontWeight="bold" color="primary.main" gutterBottom>
                                            Catatan
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" paragraph>
                                            {selectedEvent.notes}
                                        </Typography>
                                    </>
                                )}
                            </Box>

                            {/* Right side content */}
                            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 30%' } }}>
                                {/* Candidate Info Card */}
                                {selectedEvent.job_application && selectedEvent.job_application.user && (
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 2.5,
                                            mb: 3,
                                            borderRadius: '1rem',
                                            bgcolor: 'background.paper',
                                            border: '1px solid',
                                            borderColor: 'divider'
                                        }}
                                    >
                                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Person fontSize="small" color="primary" sx={{ mr: 1 }} />
                                            Kandidat
                                        </Typography>

                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1.5,
                                            my: 1.5,
                                            p: 1.5,
                                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                                            borderRadius: '0.75rem'
                                        }}>
                                            <Avatar
                                                src={selectedEvent.job_application.user.avatar}
                                                alt={selectedEvent.job_application.user.name}
                                                sx={{ width: 40, height: 40 }}
                                            >
                                                {selectedEvent.job_application.user.name.charAt(0).toUpperCase()}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="body2" fontWeight="medium">
                                                    {selectedEvent.job_application.user.name}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {selectedEvent.job_application.user.email}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Stack direction="column" spacing={1.5} sx={{ mt: 2 }}>
                                            <Button
                                                component={Link}
                                                href={route('manager.applications.show', selectedEvent.job_application.id)}
                                                variant="outlined"
                                                size="small"
                                                startIcon={<Person />}
                                                fullWidth
                                                sx={{ borderRadius: '0.75rem' }}
                                            >
                                                Lihat Lamaran
                                            </Button>

                                            <Button
                                                component="a"
                                                href={`mailto:${selectedEvent.job_application.user.email}`}
                                                variant="outlined"
                                                size="small"
                                                startIcon={<Email />}
                                                fullWidth
                                                sx={{ borderRadius: '0.75rem' }}
                                            >
                                                Hubungi Kandidat
                                            </Button>
                                        </Stack>
                                    </Paper>
                                )}

                                {/* Job Info Card */}
                                {selectedEvent.job && (
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 2.5,
                                            mb: 3,
                                            borderRadius: '1rem',
                                            bgcolor: 'background.paper',
                                            border: '1px solid',
                                            borderColor: 'divider'
                                        }}
                                    >
                                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                            <BusinessCenter fontSize="small" color="primary" sx={{ mr: 1 }} />
                                            Posisi Pekerjaan
                                        </Typography>

                                        <Box sx={{
                                            my: 1.5,
                                            p: 1.5,
                                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                                            borderRadius: '0.75rem'
                                        }}>
                                            <Typography variant="body2" fontWeight="medium">
                                                {selectedEvent.job.title}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" display="block">
                                                {selectedEvent.job.company.name}
                                            </Typography>
                                        </Box>

                                        <Button
                                            component={Link}
                                            href={route('manager.jobs.show', selectedEvent.job.id)}
                                            variant="outlined"
                                            size="small"
                                            startIcon={<BusinessCenter />}
                                            fullWidth
                                            sx={{ borderRadius: '0.75rem', mt: 1 }}
                                        >
                                            Lihat Detail Pekerjaan
                                        </Button>
                                    </Paper>
                                )}

                                {/* Action Buttons */}
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 2.5,
                                        borderRadius: '1rem',
                                        bgcolor: 'background.paper',
                                        border: '1px solid',
                                        borderColor: 'divider'
                                    }}
                                >
                                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Tune fontSize="small" color="primary" sx={{ mr: 1 }} />
                                        Tindakan
                                    </Typography>

                                    <Stack direction="column" spacing={1.5} sx={{ mt: 1.5 }}>
                                        <Button
                                            variant="outlined"
                                            startIcon={<Edit />}
                                            fullWidth
                                            onClick={() => {
                                                setOpenDetailsModal(false);
                                                router.visit(route('manager.events.edit', selectedEvent.id));
                                            }}
                                            sx={{ borderRadius: '0.75rem' }}
                                        >
                                            Edit Acara
                                        </Button>

                                        {selectedEvent.status === 'scheduled' && (
                                            <>
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    startIcon={<CheckCircle />}
                                                    fullWidth
                                                    onClick={() => {
                                                        setOpenDetailsModal(false);
                                                        setOpenCompleteModal(true);
                                                    }}
                                                    sx={{ borderRadius: '0.75rem' }}
                                                >
                                                    Tandai Selesai
                                                </Button>

                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    startIcon={<CancelOutlined />}
                                                    fullWidth
                                                    onClick={() => {
                                                        setOpenDetailsModal(false);
                                                        setOpenCancelModal(true);
                                                    }}
                                                    sx={{ borderRadius: '0.75rem' }}
                                                >
                                                    Batalkan Acara
                                                </Button>
                                            </>
                                        )}

                                        <Divider sx={{ my: 0.5 }} />

                                        <Button
                                            variant="outlined"
                                            color="error"
                                            startIcon={<Delete />}
                                            fullWidth
                                            onClick={() => {
                                                setOpenDetailsModal(false);
                                                deleteEvent(selectedEvent.id);
                                            }}
                                            sx={{ borderRadius: '0.75rem' }}
                                        >
                                            Hapus Acara
                                        </Button>
                                    </Stack>
                                </Paper>
                            </Box>
                        </Box>
                    </Box>
                </Modal>
            )}

            {/* Complete Event Modal */}
            <Modal
                open={openCompleteModal}
                onClose={() => setOpenCompleteModal(false)}
                title="Tandai Acara Selesai"
                confirmButton
                confirmText="Tandai Selesai"
                confirmColor="success"
                cancelButton
                onConfirm={completeEvent}
                maxWidth="sm"
                sx={{
                    '& .MuiDialogTitle-root': {
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        px: 3,
                        py: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        bgcolor: alpha(theme.palette.success.main, 0.08),
                        '& .MuiTypography-root': {
                            fontWeight: 600
                        }
                    },
                    '& .MuiDialogContent-root': {
                        px: 3,
                        py: 2.5
                    },
                    '& .MuiDialogActions-root': {
                        px: 3,
                        py: 2
                    }
                }}
                titleStartIcon={<CheckCircleOutline color="success" />}
            >
                <Box>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2.5,
                            mb: 3,
                            borderRadius: '1rem',
                            bgcolor: alpha(theme.palette.success.main, 0.05),
                            border: '1px solid',
                            borderColor: alpha(theme.palette.success.main, 0.2),
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2
                        }}
                    >
                        <CheckCircleOutline color="success" sx={{ fontSize: 32 }} />
                        <Box>
                            <Typography variant="subtitle2" fontWeight="bold" color="success.main" gutterBottom>
                                Selesaikan Acara
                            </Typography>
                            <Typography variant="body2">
                                Acara ini akan ditandai sebagai selesai dan tidak dapat diubah kembali ke terjadwal.
                            </Typography>
                        </Box>
                    </Paper>

                    <Typography variant="body2" paragraph>
                        Apakah Anda yakin ingin menandai acara ini sebagai selesai? Tindakan ini tidak dapat dibatalkan.
                    </Typography>
                </Box>
            </Modal>

            {/* Cancel Event Modal */}
            <Modal
                open={openCancelModal}
                onClose={() => setOpenCancelModal(false)}
                title="Batalkan Acara"
                confirmButton
                confirmText="Batalkan Acara"
                confirmColor="error"
                cancelButton
                onConfirm={cancelEvent}
                maxWidth="sm"
                sx={{
                    '& .MuiDialogTitle-root': {
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        px: 3,
                        py: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        bgcolor: alpha(theme.palette.error.main, 0.08),
                        '& .MuiTypography-root': {
                            fontWeight: 600
                        }
                    },
                    '& .MuiDialogContent-root': {
                        px: 3,
                        py: 2.5
                    },
                    '& .MuiDialogActions-root': {
                        px: 3,
                        py: 2
                    }
                }}
                titleStartIcon={<CancelIcon color="error" />}
            >
                <Box>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2.5,
                            mb: 3,
                            borderRadius: '1rem',
                            bgcolor: alpha(theme.palette.error.main, 0.05),
                            border: '1px solid',
                            borderColor: alpha(theme.palette.error.main, 0.2),
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2
                        }}
                    >
                        <CancelIcon color="error" sx={{ fontSize: 32 }} />
                        <Box>
                            <Typography variant="subtitle2" fontWeight="bold" color="error.main" gutterBottom>
                                Batalkan Acara
                            </Typography>
                            <Typography variant="body2">
                                Acara ini akan dibatalkan dan semua peserta akan diberi tahu.
                            </Typography>
                        </Box>
                    </Paper>

                    <Typography variant="body2" paragraph>
                        Apakah Anda yakin ingin membatalkan acara ini? Tindakan ini tidak dapat dibatalkan.
                    </Typography>
                </Box>
            </Modal>
        </Layout>
    );
};

export default EventsIndex;
