import React, { useState, useEffect, useMemo } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    IconButton,
    Chip,
    Avatar,
    TextField,
    InputAdornment,
    Menu,
    MenuItem,
    Button,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Card,
    Divider,
    useTheme,
    alpha,
    Tabs,
    Tab,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import {
    Search as SearchIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    MoreVert as MoreVertIcon,
    Business as BusinessIcon,
    Work as WorkIcon,
    FilterList as FilterListIcon,
    ViewList as ViewListIcon,
    ViewModule as ViewModuleIcon,
    Refresh as RefreshIcon,
    Download as DownloadIcon,
    LocationOn as LocationOnIcon,
    CalendarToday as CalendarTodayIcon,
    MonetizationOn as MonetizationOnIcon,
    FilterAlt as FilterIcon,
    Print as PrintIcon,
    CloudDownload as CloudDownloadIcon,
    CheckCircleOutline as CheckCircleOutlineIcon,
    DoDisturbOn as DoDisturbOnIcon
} from '@mui/icons-material';
import moment from 'moment';
import 'moment/locale/id';
import { motion } from 'framer-motion';
import Layout from '@/Components/Layout/Layout';
import Pagination from '@/Components/Shared/Pagination';
import Swal from 'sweetalert2';

moment.locale('id');

const JobsIndex = ({ jobs, filters, categories }) => {
    const { auth } = usePage().props;
    const theme = useTheme();
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedJob, setSelectedJob] = useState(null);
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [viewMode, setViewMode] = useState('list');
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [tabValue, setTabValue] = useState(statusFilter === 'active' ? 1 : (statusFilter === 'closed' ? 2 : 0));
    const [actionsAnchorEl, setActionsAnchorEl] = useState(null);

    // Calculate stats
    const totalJobs = useMemo(() => jobs?.total || jobs?.data?.length || 0, [jobs]);
    const activeJobs = useMemo(() => 
        jobs?.data?.filter(job => job.status === 'active')?.length || 0,
        [jobs]
    );
    const closedJobs = useMemo(() => 
        jobs?.data?.filter(job => job.status === 'closed')?.length || 0,
        [jobs]
    );

    // Apply filters to jobs (for local filtering)
    const filteredJobs = useMemo(() => {
        // Ensure jobs.data exists and is an array
        if (!jobs?.data || !Array.isArray(jobs.data)) {
            return [];
        }

        let filtered = [...jobs.data];
        
        // Since backend already applies filters, this is mainly for UI sync
        return filtered;
    }, [jobs?.data]);

    // Handle tab change for status filter
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        if (newValue === 0) {
            // All
            setStatusFilter('');
        } else if (newValue === 1) {
            // Active
            setStatusFilter('active');
        } else if (newValue === 2) {
            // Closed
            setStatusFilter('closed');
        }
    };

    // When search, filter or tab changes, update the URL to maintain state
    useEffect(() => {
        if (jobs?.data) {
            // Only update URL if user explicitly changed filters (not on initial load)
            if (searchTerm || statusFilter) {
                const params = { ...route().params };
                
                // Add filters to URL params
                if (searchTerm) params.search = searchTerm;
                else delete params.search;
                
                if (statusFilter) params.status = statusFilter;
                else delete params.status;
                
                // Reset to page 1 when filters change
                params.page = 1;
                
                router.get(route('admin.jobs.index', params), {}, {
                    preserveState: true,
                    replace: true,
                    only: ['jobs']
                });
            }
        }
    }, [searchTerm, statusFilter]);

    // Reset all filters
    const resetFilters = () => {
        setSearchTerm('');
        setStatusFilter('');
        setTabValue(0);
        
        // Reset URL query params and reload jobs data
        router.get(route('admin.jobs.index'), {}, {
            preserveState: false, // Don't preserve state to ensure complete refresh
            only: ['jobs']
        });
    };

    // Dialog handlers
    const handleDeleteDialogOpen = (job) => {
        setSelectedJob(job);
        
        Swal.fire({
            title: 'Konfirmasi Hapus',
            text: `Apakah Anda yakin ingin menghapus lowongan ${job.title}? Tindakan ini tidak dapat dibatalkan dan akan menghapus semua data terkait lowongan ini.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: theme.palette.error.main,
            cancelButtonColor: theme.palette.grey[500],
            confirmButtonText: 'Hapus',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                handleDeleteJob();
            } else {
                setSelectedJob(null);
            }
        });
    };

    const handleDeleteDialogClose = () => {
        setSelectedJob(null);
    };

    // Menu handlers
    const handleMenuOpen = (event, job) => {
        setMenuAnchorEl(event.currentTarget);
        setSelectedJob(job);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
        setSelectedJob(null);
    };

    const handleOpenActionsMenu = (event) => {
        setActionsAnchorEl(event.currentTarget);
    };

    const handleCloseActionsMenu = () => {
        setActionsAnchorEl(null);
    };

    // Delete job
    const handleDeleteJob = () => {
        if (selectedJob) {
            setLoading(true);
            router.delete(route('admin.jobs.destroy', selectedJob.id), {
                onSuccess: (page) => {
                    // Tampilkan pesan sukses dengan SweetAlert2
                    const message = page.props.flash && page.props.flash.message
                        ? page.props.flash.message
                        : 'Lowongan berhasil dihapus';
                    
                    Swal.fire({
                        title: 'Berhasil!',
                        text: message,
                        icon: 'success',
                        confirmButtonText: 'OK',
                        confirmButtonColor: theme.palette.primary.main
                    });
                    
                    setSelectedJob(null);
                    // Refresh data setelah penghapusan berhasil
                    router.reload({ only: ['jobs'] });
                },
                onError: (errors) => {
                    // Tampilkan pesan error dengan SweetAlert2
                    console.error('Error deleting job:', errors);
                    let errorMessage = 'Gagal menghapus lowongan: Terjadi kesalahan';
                    
                    if (errors.message) {
                        errorMessage = errors.message;
                    } else if (errors.errors && Object.keys(errors.errors).length > 0) {
                        errorMessage = 'Gagal menghapus lowongan:\n' + Object.values(errors.errors).flat().join('\n');
                    }
                    
                    Swal.fire({
                        title: 'Error!',
                        text: errorMessage,
                        icon: 'error',
                        confirmButtonText: 'OK',
                        confirmButtonColor: theme.palette.error.main
                    });
                },
                onFinish: () => {
                    setLoading(false);
                }
            });
        }
    };

    // Get status color
    const getStatusColor = (status) => {
        if (!status) return 'default';

        switch (status.toLowerCase()) {
            case 'active':
                return 'success';
            case 'draft':
                return 'warning';
            case 'closed':
                return 'error';
            default:
                return 'default';
        }
    };

    // Get status text
    const getStatusText = (status) => {
        if (!status) return 'Tidak Diketahui';

        switch (status.toLowerCase()) {
            case 'active':
                return 'Aktif';
            case 'draft':
                return 'Draft';
            case 'closed':
                return 'Ditutup';
            default:
                return status;
        }
    };

    // Job card component for grid view
    const JobCard = ({ job }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card
                sx={{
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    position: 'relative',
                    '&:hover': {
                        boxShadow: 6
                    }
                }}
            >
                <IconButton
                    size="small"
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                    onClick={(e) => handleMenuOpen(e, job)}
                >
                    <MoreVertIcon fontSize="small" />
                </IconButton>

                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <Avatar
                        src={job.company?.logo || ''}
                        alt={job.company?.name}
                        sx={{
                            width: 80,
                            height: 80,
                            bgcolor: (theme) => `${theme.palette.primary.main}20`,
                            color: 'primary.main'
                        }}
                    >
                        {job.company?.name?.charAt(0) || <WorkIcon />}
                    </Avatar>
                </Box>

                <Typography variant="h6" align="center" gutterBottom noWrap>
                    {job.title}
                </Typography>

                <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 1 }}>
                    {job.company?.name}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <Chip
                        label={getStatusText(job.status)}
                        color={getStatusColor(job.status)}
                        size="small"
                    />
                </Box>

                <Divider sx={{ my: 1 }} />

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOnIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary" noWrap>
                        {job.location}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarTodayIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                        {moment(job.created_at).format('DD MMM YYYY')}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <MonetizationOnIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                        {job.salary_min && job.salary_max
                            ? `Rp ${new Intl.NumberFormat('id-ID').format(job.salary_min)} - Rp ${new Intl.NumberFormat('id-ID').format(job.salary_max)}`
                            : job.salary_min
                                ? `Rp ${new Intl.NumberFormat('id-ID').format(job.salary_min)}`
                                : 'Tidak ditampilkan'}
                    </Typography>
                </Box>
            </Card>
        </motion.div>
    );

    // Job Logo Component 
    const JobLogo = ({ job, size = 48 }) => {
        const [hasError, setHasError] = useState(false);
        const theme = useTheme();

        // Generate colors based on job company name
        const generateColorFromName = (name) => {
            if (!name) return theme.palette.primary.main;

            const colors = [
                theme.palette.primary.main,
                theme.palette.secondary.main,
                theme.palette.success.main,
                theme.palette.warning.main,
                theme.palette.info.main,
            ];

            const hash = name.split('').reduce((acc, char) => {
                return char.charCodeAt(0) + acc;
            }, 0);

            return colors[hash % colors.length];
        };

        // Default logo content - job initial with background color
        const renderDefaultLogo = () => {
            const company = job.company?.name || 'Job';
            const bgColor = generateColorFromName(company);
            const initial = company.charAt(0).toUpperCase();

            return (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%',
                        bgcolor: bgColor,
                        color: 'white',
                        fontSize: size * 0.5,
                        fontWeight: 700,
                        borderRadius: 1,
                    }}
                >
                    {initial}
                </Box>
            );
        };

        if (!job.company?.logo || hasError) {
            return (
                <Box
                    sx={{
                        width: size,
                        height: size,
                        borderRadius: 1,
                        overflow: 'hidden',
                    }}
                >
                    {renderDefaultLogo()}
                </Box>
            );
        }

        return (
            <Box
                component="img"
                src={job.company.logo}
                alt={job.company.name}
                onError={() => setHasError(true)}
                sx={{
                    width: size,
                    height: size,
                    objectFit: 'contain',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                    p: 0.5,
                    bgcolor: 'white',
                }}
            />
        );
    };

    // Stats Card component to reduce duplication
    const StatsCard = ({ icon, count, label, color = "primary", delay = 0 }) => {
        const theme = useTheme();

        // Handle special case for grey which may not have .main property
        const getColorValue = (colorName) => {
            if (colorName === "grey") {
                return {
                    bgColor: alpha(theme.palette.grey[500], 0.03),
                    avatarBgColor: alpha(theme.palette.grey[500], 0.1),
                    avatarColor: theme.palette.grey[600]
                };
            } else {
                return {
                    bgColor: alpha(theme.palette[colorName].main, 0.03),
                    avatarBgColor: alpha(theme.palette[colorName].main, 0.1),
                    avatarColor: theme.palette[colorName].main
                };
            }
        };

        const colorValues = getColorValue(color);

        return (
            <Box sx={{ flex: 1, minWidth: '220px', maxWidth: '270px' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: delay * 0.1 }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            height: '100%',
                            borderRadius: 3,
                            bgcolor: colorValues.bgColor,
                            border: '1px solid',
                            borderColor: 'divider',
                        }}
                    >
                        <Avatar
                            sx={{
                                bgcolor: colorValues.avatarBgColor,
                                color: colorValues.avatarColor,
                                width: 52,
                                height: 52,
                            }}
                        >
                            {icon}
                        </Avatar>
                        <Box>
                            <Typography variant="h4" component="div" fontWeight="bold">
                                {count}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {label}
                            </Typography>
                        </Box>
                    </Paper>
                </motion.div>
            </Box>
        );
    };

    // Fungsi untuk mengekspor data ke CSV
    const exportToCSV = () => {
        // Pastikan ada data untuk diekspor
        if (!jobs?.data || jobs.data.length === 0) {
            alert('Tidak ada data untuk diekspor');
            return;
        }
    
        // Membuat header CSV
        const headers = [
            'ID', 'Judul', 'Perusahaan', 'Lokasi', 'Status',
            'Tanggal Dibuat', 'Gaji Minimum', 'Gaji Maksimum', 'Jumlah Pelamar'
        ];
    
        // Mengubah data jobs menjadi format CSV
        const csvData = jobs.data.map(job => [
            job.id,
            job.title,
            job.company?.name || '-',
            job.location || '-',
            getStatusText(job.status),
            moment(job.created_at).format('DD/MM/YYYY'),
            job.salary_min ? `Rp ${new Intl.NumberFormat('id-ID').format(job.salary_min)}` : '-',
            job.salary_max ? `Rp ${new Intl.NumberFormat('id-ID').format(job.salary_max)}` : '-',
            job.applications_count || 0
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
        link.setAttribute('download', `lowongan-pekerjaan-${moment().format('YYYY-MM-DD')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    // Fungsi untuk mencetak daftar lowongan
    const printJobList = () => {
        // Pastikan ada data untuk dicetak
        if (!jobs?.data || jobs.data.length === 0) {
            alert('Tidak ada data untuk dicetak');
            return;
        }
    
        // Membuat konten HTML untuk dicetak
        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Daftar Lowongan Pekerjaan - ${moment().format('DD MMMM YYYY')}</title>
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
                    .status-closed {
                        color: red;
                        font-weight: bold;
                    }
                    .status-draft {
                        color: orange;
                        font-weight: bold;
                    }
                </style>
            </head>
            <body>
                <div class="print-date">Dicetak pada: ${moment().format('DD MMMM YYYY, HH:mm:ss')}</div>
                <h1>Daftar Lowongan Pekerjaan</h1>
                <table>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Judul</th>
                            <th>Perusahaan</th>
                            <th>Lokasi</th>
                            <th>Status</th>
                            <th>Tanggal Dibuat</th>
                            <th>Jumlah Pelamar</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${jobs.data.map((job, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${job.title}</td>
                                <td>${job.company?.name || '-'}</td>
                                <td>${job.location || '-'}</td>
                                <td class="status-${job.status}">${getStatusText(job.status)}</td>
                                <td>${moment(job.created_at).format('DD/MM/YYYY')}</td>
                                <td>${job.applications_count || 0}</td>
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

    // Actions Menu Component
    const ActionsMenu = ({ anchorEl, onClose }) => {
        return (
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={onClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                        mt: 1.5,
                        borderRadius: 2,
                        minWidth: 180,
                        '& .MuiMenuItem-root': {
                            px: 2,
                            py: 1.5,
                        }
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={() => {
                    exportToCSV();
                    onClose();
                }}>
                    <ListItemIcon>
                        <CloudDownloadIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Ekspor CSV</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => {
                    printJobList();
                    onClose();
                }}>
                    <ListItemIcon>
                        <PrintIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Cetak Daftar</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => {
                    resetFilters();
                    onClose();
                }}>
                    <ListItemIcon>
                        <RefreshIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Segarkan Data</ListItemText>
                </MenuItem>
            </Menu>
        );
    };

    return (
        <Layout>
            <Head title="Daftar Lowongan Pekerjaan" />

            <Container maxWidth="xl" sx={{ py: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" component="h1" fontWeight="bold">
                        Lowongan Pekerjaan
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<FilterListIcon />}
                            onClick={handleOpenActionsMenu}
                        >
                            Aksi
                        </Button>
                        <Link href={route('admin.jobs.create')}>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AddIcon />}
                            >
                                Tambah Lowongan
                            </Button>
                        </Link>
                    </Box>
                </Box>

                {/* Stats Cards */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                    <StatsCard icon={<WorkIcon />} count={totalJobs} label="Total Lowongan" />
                    <StatsCard icon={<CheckCircleOutlineIcon />} count={activeJobs} label="Lowongan Aktif" color="success" delay={1} />
                    <StatsCard icon={<DoDisturbOnIcon />} count={closedJobs} label="Lowongan Ditutup" color="error" delay={2} />
                </Box>

                {/* Main Content Paper */}
                <Paper 
                    elevation={0}
                    sx={{ 
                        borderRadius: '1rem',
                        overflow: 'hidden',
                        border: '1px solid',
                        borderColor: 'divider',
                        mb: 3
                    }}
                >
                    {/* Tabs */}
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            aria-label="status lowongan tabs"
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
                            <Tab label="Semua Lowongan" />
                            <Tab label="Aktif" />
                            <Tab label="Ditutup" />
                        </Tabs>
                    </Box>

                    {/* Filters */}
                    <Box sx={{ p: 2, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                            <Box sx={{ flex: '1 1 260px' }}>
                                <TextField
                                    fullWidth
                                    placeholder="Cari lowongan berdasarkan judul, perusahaan, atau lokasi..."
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
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Tooltip title="Reset Semua Filter">
                                    <span>
                                        <IconButton
                                            color="primary"
                                            onClick={resetFilters}
                                            disabled={!searchTerm && tabValue === 0}
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
                                {jobs.total} {jobs.total === 1 ? 'lowongan' : 'lowongan'} ditemukan
                                {(searchTerm || statusFilter) ? ' dengan filter saat ini' : ''}
                            </Typography>
                        </Box>
                        {(searchTerm || tabValue > 0) && (
                            <Button
                                variant="text"
                                size="small"
                                startIcon={<FilterIcon fontSize="small" />}
                                onClick={resetFilters}
                            >
                                Hapus Filter
                            </Button>
                        )}
                    </Box>

                    {/* Job List */}
                    {viewMode === 'list' ? (
                        <Box sx={{ px: 2, pb: 2 }}>
                            <Paper
                                elevation={0}
                                sx={{
                                    borderRadius: 2,
                                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                    overflow: 'hidden',
                                }}
                            >
                                <TableContainer>
                                    <Table sx={{ minWidth: 650 }}>
                                        <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                                            <TableRow>
                                                <TableCell>Lowongan</TableCell>
                                                <TableCell>Perusahaan</TableCell>
                                                <TableCell>Status</TableCell>
                                                <TableCell>Tanggal Dibuat</TableCell>
                                                <TableCell align="center">Pelamar</TableCell>
                                                <TableCell>Aksi</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {jobs.data.length > 0 ? (
                                                jobs.data.map((job) => (
                                                    <TableRow key={job.id} hover>
                                                        <TableCell>
                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <JobLogo job={job} size={40} />
                                                                <Box sx={{ ml: 2 }}>
                                                                    <Typography variant="body1" fontWeight="medium">
                                                                        {job.title}
                                                                    </Typography>
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        {job.location}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell>
                                                            {job.company ? job.company.name : '-'}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                label={getStatusText(job.status)}
                                                                color={getStatusColor(job.status)}
                                                                size="small"
                                                            />
                                                        </TableCell>
                                                        <TableCell>{moment(job.created_at).format('DD MMM YYYY')}</TableCell>
                                                        <TableCell align="center">
                                                            {job.applications_count || 0}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                                <Link href={route('admin.jobs.edit', job.id)}>
                                                                    <IconButton size="small" color="primary">
                                                                        <Tooltip title="Edit">
                                                                            <EditIcon fontSize="small" />
                                                                        </Tooltip>
                                                                    </IconButton>
                                                                </Link>
                                                                <IconButton
                                                                    size="small"
                                                                    color="error"
                                                                    onClick={() => handleDeleteDialogOpen(job)}
                                                                >
                                                                    <Tooltip title="Hapus">
                                                                        <DeleteIcon fontSize="small" />
                                                                    </Tooltip>
                                                                </IconButton>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={(e) => handleMenuOpen(e, job)}
                                                                >
                                                                    <MoreVertIcon fontSize="small" />
                                                                </IconButton>
                                                            </Box>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Tidak ada data lowongan pekerjaan
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Box>
                    ) : (
                        <Box sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
                                {jobs.data.length > 0 ? (
                                    jobs.data.map((job) => (
                                        <Box
                                            key={job.id}
                                            sx={{
                                                width: {
                                                    xs: '100%',
                                                    sm: 'calc(50% - 12px)',
                                                    md: 'calc(33.333% - 16px)',
                                                    lg: 'calc(25% - 18px)'
                                                }
                                            }}
                                        >
                                            <JobCard job={job} />
                                        </Box>
                                    ))
                                ) : (
                                    <Box sx={{ width: '100%' }}>
                                        <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Tidak ada data lowongan pekerjaan
                                            </Typography>
                                        </Paper>
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    )}
                </Paper>

                {/* Pagination */}
                {jobs?.meta?.last_page > 1 && (
                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: '1rem',
                            border: '1px solid',
                            borderColor: 'divider',
                            boxShadow: 'none',
                            p: 2,
                            mb: 4
                        }}
                    >
                        <Pagination
                            currentPage={jobs.meta.current_page}
                            totalPages={jobs.meta.last_page}
                            totalItems={jobs.meta.total}
                            perPage={jobs.meta.per_page}
                            onPageChange={(page) => {
                                // Store current filters in URL
                                const params = {
                                    ...route().params,
                                    page: page
                                };
                                
                                // Add current filters to URL if they exist
                                if (searchTerm) params.search = searchTerm;
                                if (categoryFilter) params.category = categoryFilter;
                                if (statusFilter) params.status = statusFilter;
                                
                                router.get(route('admin.jobs.index', params), {}, {
                                    preserveState: true,
                                    replace: true,
                                    only: ['jobs']
                                });
                            }}
                            onPerPageChange={(newPerPage) => {
                                // Store current filters in URL
                                const params = {
                                    ...route().params,
                                    per_page: newPerPage,
                                    page: 1
                                };
                                
                                // Add current filters to URL if they exist
                                if (searchTerm) params.search = searchTerm;
                                if (categoryFilter) params.category = categoryFilter;
                                if (statusFilter) params.status = statusFilter;
                                
                                router.get(route('admin.jobs.index', params), {}, {
                                    preserveState: true,
                                    replace: true,
                                    only: ['jobs']
                                });
                            }}
                            showFirst
                            showLast
                            rounded="large"
                        />
                    </Paper>
                )}
            </Container>

            {/* Context menu */}
            <Menu
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={() => {
                    handleMenuClose();
                    if (selectedJob) {
                        handleDeleteDialogOpen(selectedJob);
                    }
                }} sx={{ color: 'error.main' }}>
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                    Hapus Lowongan
                </MenuItem>
            </Menu>

            {/* Delete confirmation dialog menggunakan SweetAlert2 */}

            {/* Actions menu */}
            <ActionsMenu anchorEl={actionsAnchorEl} onClose={handleCloseActionsMenu} />
        </Layout>
    );
};

export default JobsIndex;
