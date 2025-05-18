import React, { useState, useEffect } from 'react';
import { Head, Link, usePage, useForm, router } from '@inertiajs/react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Chip,
    InputAdornment,
    Card as MuiCard,
    CardContent,
    Divider,
    alpha,
    Tooltip,
    useTheme,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Pagination,
    PaginationItem
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    FilterAlt as FilterIcon,
    Visibility as VisibilityIcon,
    MoreVert as MoreVertIcon,
    Business as BusinessIcon,
    LocationOn as LocationOnIcon,
    CalendarMonth as CalendarMonthIcon,
    Person as PersonIcon,
    Work as WorkIcon,
    ToggleOn as ToggleOnIcon,
    ContentCopy as ContentCopyIcon,
    Refresh as RefreshIcon,
    Tune as TuneIcon
} from '@mui/icons-material';
import moment from 'moment';
import Layout from '@/Components/Layout/Layout';
import CurrencyDisplay from '@/Components/Shared/CurrencyDisplay';

// Helper function untuk format tanggal yang aman
const formatDate = (date, format = 'DD MMM YYYY') => {
    if (!date) return '';

    try {
        const parsedDate = moment(date, [moment.ISO_8601, 'YYYY-MM-DD']);
        if (parsedDate.isValid()) {
            return parsedDate.format(format);
        }
        return '';
    } catch (error) {
        console.error('Error formatting date:', error);
        return '';
    }
};

export default function Index({ jobs, filters }) {
    const { auth } = usePage().props;
    const theme = useTheme();
    const [page, setPage] = useState(jobs?.current_page || 1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedJob, setSelectedJob] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
    const [activeJob, setActiveJob] = useState(null);

    const { data, setData, get, processing, errors } = useForm({
        search: filters?.search || '',
        status: filters?.status || '',
        category: filters?.category || '',
        location: filters?.location || '',
    });

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        router.get(route('manager.jobs.index', {
            ...data,
            page: newPage,
        }), {
            preserveState: true,
            preserveScroll: true,
            only: ['jobs'],
        });
    };

    const handleChangeRowsPerPage = (event) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setPage(1);
        router.get(route('manager.jobs.index', {
            ...data,
            page: 1,
            per_page: newRowsPerPage,
        }), {
            preserveState: true,
            preserveScroll: true,
            only: ['jobs'],
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        get(route('manager.jobs.index', data));
    };

    const handleDeleteClick = (job) => {
        setSelectedJob(job);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (selectedJob) {
            router.delete(route('manager.jobs.destroy', selectedJob.id), {
                onSuccess: () => {
                    setDeleteDialogOpen(false);
                }
            });
        }
    };

    const openActionMenu = (event, job) => {
        setActionMenuAnchor(event.currentTarget);
        setActiveJob(job);
    };

    const closeActionMenu = () => {
        setActionMenuAnchor(null);
    };

    // Determine the job status more accurately
    const getJobStatus = (job) => {
        if (job.status === 'active' || (job.is_active === true && (!job.status || job.status === ''))) {
            return 'active';
        } else if (job.status === 'draft') {
            return 'draft';
        } else if (job.status === 'closed' || (job.status === undefined && job.is_active === false)) {
            return 'closed';
        } else {
            return job.is_active ? 'active' : 'closed';
        }
    };

    // Update the getStatusColor function to use the updated status logic
    const getStatusColor = (job) => {
        const status = getJobStatus(job);
        switch(status) {
            case 'active': return 'success';
            case 'draft': return 'warning';
            case 'closed': return 'error';
            default: return 'default';
        }
    };

    // Update the getStatusText function to use consistent logic
    const getStatusText = (job) => {
        const status = getJobStatus(job);
        switch(status) {
            case 'active': return 'Aktif';
            case 'draft': return 'Draft';
            case 'closed': return 'Ditutup';
            default: return 'Tidak Diketahui';
        }
    };

    // Count jobs correctly - each job in exactly one category
    const totalJobs = jobs?.total || 0;
    const activeJobs = jobs?.data?.filter(job => getJobStatus(job) === 'active').length || 0;
    const draftJobs = jobs?.data?.filter(job => getJobStatus(job) === 'draft').length || 0;
    const closedJobs = jobs?.data?.filter(job => getJobStatus(job) === 'closed').length || 0;

    return (
        <Layout>
            <Head title="Daftar Lowongan Pekerjaan" />

            {/* Header Section */}
            <Box
                sx={{
                    background: theme.palette.mode === 'dark'
                        ? alpha(theme.palette.primary.dark, 0.05)
                        : alpha(theme.palette.primary.light, 0.05),
                    py: 4,
                    borderRadius: '0.75rem',
                    px: 3,
                    mb: 4,
                    boxShadow: 'none',
                    border: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box>
                        <Typography variant="h5" fontWeight="600" gutterBottom>
                            Daftar Lowongan Pekerjaan
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Kelola semua lowongan pekerjaan dari perusahaan Anda
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        component={Link}
                        href={route('manager.jobs.create')}
                        sx={{
                            borderRadius: '0.75rem',
                            boxShadow: '0 4px 12px rgba(15, 118, 110, 0.2)'
                        }}
                    >
                        Tambah Lowongan
                    </Button>
                </Box>

                {/* Stats Cards */}
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, 1fr)',
                            md: 'repeat(4, 1fr)'
                        },
                        gap: 2,
                        mt: 1
                    }}
                >
                    <MuiCard sx={{
                        borderRadius: '0.75rem',
                        border: '1px solid',
                        borderColor: 'divider',
                        boxShadow: 'none',
                        overflow: 'hidden',
                        transition: 'all 0.15s ease-in-out',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.03)',
                        }
                    }}>
                        <CardContent sx={{ p: 2.5 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography color="text.secondary" variant="body2" fontWeight="500">Total Lowongan</Typography>
                                <Box sx={{
                                    p: 1,
                                    borderRadius: '8px',
                                    bgcolor: alpha(theme.palette.primary.main, 0.08)
                                }}>
                                    <BusinessIcon fontSize="small" color="primary" />
                                </Box>
                            </Box>
                            <Typography variant="h4" sx={{ mt: 1, fontWeight: '600', color: theme.palette.text.primary }}>
                                {totalJobs}
                            </Typography>
                        </CardContent>
                    </MuiCard>

                    <MuiCard sx={{
                        borderRadius: '0.75rem',
                        border: '1px solid',
                        borderColor: 'divider',
                        boxShadow: 'none',
                        overflow: 'hidden',
                        transition: 'all 0.15s ease-in-out',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.03)',
                        }
                    }}>
                        <CardContent sx={{ p: 2.5 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography color="text.secondary" variant="body2" fontWeight="500">Lowongan Aktif</Typography>
                                <Box sx={{
                                    p: 1,
                                    borderRadius: '8px',
                                    bgcolor: alpha(theme.palette.success.main, 0.08)
                                }}>
                                    <WorkIcon fontSize="small" color="success" />
                                </Box>
                            </Box>
                            <Typography variant="h4" sx={{ mt: 1, fontWeight: '600', color: theme.palette.text.primary }}>
                                {activeJobs}
                            </Typography>
                        </CardContent>
                    </MuiCard>

                    <MuiCard sx={{
                        borderRadius: '0.75rem',
                        border: '1px solid',
                        borderColor: 'divider',
                        boxShadow: 'none',
                        overflow: 'hidden',
                        transition: 'all 0.15s ease-in-out',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.03)',
                        }
                    }}>
                        <CardContent sx={{ p: 2.5 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography color="text.secondary" variant="body2" fontWeight="500">Draft</Typography>
                                <Box sx={{
                                    p: 1,
                                    borderRadius: '8px',
                                    bgcolor: alpha(theme.palette.warning.main, 0.08)
                                }}>
                                    <EditIcon fontSize="small" color="warning" />
                                </Box>
                            </Box>
                            <Typography variant="h4" sx={{ mt: 1, fontWeight: '600', color: theme.palette.text.primary }}>
                                {draftJobs}
                            </Typography>
                        </CardContent>
                    </MuiCard>

                    <MuiCard sx={{
                        borderRadius: '0.75rem',
                        border: '1px solid',
                        borderColor: 'divider',
                        boxShadow: 'none',
                        overflow: 'hidden',
                        transition: 'all 0.15s ease-in-out',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.03)',
                        }
                    }}>
                        <CardContent sx={{ p: 2.5 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography color="text.secondary" variant="body2" fontWeight="500">Ditutup</Typography>
                                <Box sx={{
                                    p: 1,
                                    borderRadius: '8px',
                                    bgcolor: alpha(theme.palette.error.main, 0.08)
                                }}>
                                    <BusinessIcon fontSize="small" color="error" />
                                </Box>
                            </Box>
                            <Typography variant="h4" sx={{ mt: 1, fontWeight: '600', color: theme.palette.text.primary }}>
                                {closedJobs}
                            </Typography>
                        </CardContent>
                    </MuiCard>
                </Box>
            </Box>

            {/* Filter Bar */}
            <Paper
                component="form"
                elevation={0}
                onSubmit={handleSearch}
                sx={{
                    p: 2,
                    mb: 3,
                    borderRadius: '0.75rem',
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { xs: 'stretch', md: 'center' },
                    gap: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: 'none'
                }}
            >
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: '1fr 1fr',
                            md: '3fr 1fr 1fr'
                        },
                        gap: 2,
                        width: '100%'
                    }}
                >
                    <TextField
                        fullWidth
                        placeholder="Cari lowongan..."
                        variant="outlined"
                        value={data.search}
                        onChange={(e) => setData('search', e.target.value)}
                        size="small"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '0.75rem',
                            }
                        }}
                    />

                    <TextField
                        select
                        fullWidth
                        variant="outlined"
                        label="Status"
                        value={data.status}
                        onChange={(e) => setData('status', e.target.value)}
                        size="small"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '0.75rem',
                            }
                        }}
                    >
                        <MenuItem value="">Semua Status</MenuItem>
                        <MenuItem value="active">Aktif</MenuItem>
                        <MenuItem value="draft">Draft</MenuItem>
                        <MenuItem value="closed">Ditutup</MenuItem>
                    </TextField>

                    <TextField
                        select
                        fullWidth
                        variant="outlined"
                        label="Kategori"
                        value={data.category}
                        onChange={(e) => setData('category', e.target.value)}
                        size="small"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '0.75rem',
                            }
                        }}
                    >
                        <MenuItem value="">Semua Kategori</MenuItem>
                        {filters.categories?.map((category) => (
                            <MenuItem key={category.id} value={category.id}>
                                {category.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, alignSelf: { xs: 'flex-end', md: 'center' } }}>
                    <Tooltip title="Apply Filter">
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={processing}
                            sx={{
                                borderRadius: '0.75rem',
                                minWidth: '36px',
                                width: '36px',
                                height: '36px',
                                padding: 0,
                            }}
                        >
                            <FilterIcon fontSize="small" />
                        </Button>
                    </Tooltip>

                    <Tooltip title="Reset Filter">
                        <IconButton
                            color="primary"
                            onClick={() => {
                                setData({
                                    search: '',
                                    status: '',
                                    category: '',
                                    location: '',
                                });
                                get(route('manager.jobs.index'));
                            }}
                            sx={{
                                bgcolor: alpha(theme.palette.primary.main, 0.04),
                                '&:hover': {
                                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                                },
                            }}
                        >
                            <RefreshIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Advanced Filter">
                        <IconButton
                            color="primary"
                            onClick={() => setFilterOpen(true)}
                            sx={{
                                bgcolor: alpha(theme.palette.primary.main, 0.04),
                                '&:hover': {
                                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                                },
                            }}
                        >
                            <TuneIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Paper>

            {errors.search && (
                <Box sx={{ mb: 3 }}>
                    <Alert severity="error" sx={{ borderRadius: '0.75rem' }}>{errors.search}</Alert>
                </Box>
            )}

            {/* Job Table */}
            <Paper
                elevation={0}
                sx={{
                    overflow: 'hidden',
                    borderRadius: '0.75rem',
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: 'none',
                    mb: 3
                }}
            >
                <TableContainer>
                    <Table sx={{ minWidth: 650 }} aria-label="tabel lowongan pekerjaan">
                        <TableHead>
                            <TableRow sx={{ bgcolor: theme.palette.mode === 'dark'
                                ? alpha(theme.palette.background.paper, 0.5)
                                : alpha(theme.palette.grey[50], 1) }}>
                                <TableCell sx={{ fontWeight: 600 }}>Judul Pekerjaan</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Perusahaan</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Lokasi</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Tanggal Posting</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Pelamar</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 600 }}>Aksi</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {jobs?.data?.length > 0 ? (
                                jobs.data.map((job) => (
                                    <TableRow
                                        key={job.id}
                                        hover
                                        sx={{
                                            '&:hover': {
                                                bgcolor: alpha(theme.palette.primary.main, 0.04)
                                            }
                                        }}
                                    >
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <WorkIcon fontSize="small" color="primary" />
                                                <Link
                                                    href={route('manager.jobs.show', job.id)}
                                                    className="text-blue-600 hover:underline"
                                                    style={{ fontWeight: 500 }}
                                                >
                                                    {job.title}
                                                </Link>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <BusinessIcon fontSize="small" sx={{ mr: 1, color: theme.palette.text.secondary }} />
                                                {job.company?.name}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <LocationOnIcon fontSize="small" sx={{ mr: 1, color: theme.palette.text.secondary }} />
                                                {job.location}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={getStatusText(job)}
                                                color={getStatusColor(job)}
                                                size="small"
                                                sx={{
                                                    minWidth: 80,
                                                    borderRadius: '6px',
                                                    fontWeight: '500',
                                                    '& .MuiChip-label': {
                                                        px: 1
                                                    }
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <CalendarMonthIcon fontSize="small" sx={{ mr: 1, color: theme.palette.text.secondary }} />
                                                {formatDate(job.created_at)}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Chip
                                                    icon={<PersonIcon fontSize="small" />}
                                                    label={job.applications_count}
                                                    size="small"
                                                    sx={{
                                                        fontWeight: 500,
                                                        borderRadius: '6px',
                                                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                                                        color: theme.palette.primary.main
                                                    }}
                                                />
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                onClick={(e) => openActionMenu(e, job)}
                                                size="small"
                                                sx={{
                                                    color: theme.palette.primary.main,
                                                    '&:hover': {
                                                        bgcolor: alpha(theme.palette.primary.main, 0.1)
                                                    },
                                                }}
                                            >
                                                <MoreVertIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <WorkIcon
                                                sx={{
                                                    fontSize: 60,
                                                    color: alpha(theme.palette.text.secondary, 0.2),
                                                    mb: 2
                                                }}
                                            />
                                            <Typography variant="h6" gutterBottom>
                                                Tidak ada data lowongan pekerjaan
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                Belum ada lowongan pekerjaan yang tersedia. Tambahkan lowongan baru untuk mulai merekrut kandidat.
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                startIcon={<AddIcon />}
                                                component={Link}
                                                href={route('manager.jobs.create')}
                                                sx={{
                                                    borderRadius: '0.75rem',
                                                    mt: 1
                                                }}
                                            >
                                                Tambah Lowongan Baru
                                            </Button>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Pagination - Using MUI Pagination like in Public/Jobs/Index */}
                {jobs?.last_page > 1 && (
                    <Box sx={{ 
                        mt: 3, 
                        mb: 3, 
                        display: 'flex', 
                        justifyContent: 'center',
                        borderTop: `1px solid ${theme.palette.divider}`,
                        pt: 3
                    }}>
                        <Pagination
                            count={jobs.last_page}
                            page={jobs.current_page}
                            color="primary"
                            shape="rounded"
                            variant="outlined"
                            renderItem={(item) => (
                                <PaginationItem
                                    component={Link}
                                    href={route('manager.jobs.index', {
                                        ...data,
                                        page: item.page
                                    })}
                                    {...item}
                                    sx={{
                                        borderRadius: '8px',
                                        fontWeight: item.selected ? 600 : 400,
                                    }}
                                />
                            )}
                        />
                    </Box>
                )}
            </Paper>

            {/* Menu Aksi */}
            <Menu
                anchorEl={actionMenuAnchor}
                open={Boolean(actionMenuAnchor)}
                onClose={closeActionMenu}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                    elevation: 2,
                    sx: {
                        borderRadius: '12px',
                        minWidth: 200,
                        overflow: 'hidden',
                        mt: 1,
                        '& .MuiMenuItem-root': {
                            px: 2,
                            py: 1.5
                        }
                    }
                }}
            >
                <MenuItem
                    component={Link}
                    href={activeJob ? route('manager.jobs.show', activeJob.id) : '#'}
                    onClick={closeActionMenu}
                >
                    <ListItemIcon>
                        <VisibilityIcon fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Lihat Detail" />
                </MenuItem>

                <MenuItem
                    component={Link}
                    href={activeJob ? route('manager.jobs.edit', activeJob.id) : '#'}
                    onClick={closeActionMenu}
                >
                    <ListItemIcon>
                        <EditIcon fontSize="small" color="info" />
                    </ListItemIcon>
                    <ListItemText primary="Edit Lowongan" />
                </MenuItem>

                <Divider />

                <MenuItem
                    onClick={() => {
                        if (activeJob) {
                            handleDeleteClick(activeJob);
                        }
                        closeActionMenu();
                    }}
                    sx={{ color: 'error.main' }}
                >
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText primary="Hapus Lowongan" />
                </MenuItem>
            </Menu>

            {/* Dialog Konfirmasi Hapus */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                PaperProps={{
                    sx: {
                        borderRadius: '16px',
                        padding: 1
                    }
                }}
            >
                <DialogTitle>Konfirmasi Hapus</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Apakah Anda yakin ingin menghapus lowongan "{selectedJob?.title}"? Tindakan ini tidak dapat dibatalkan.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ pb: 2, px: 3 }}>
                    <Button
                        onClick={() => setDeleteDialogOpen(false)}
                        variant="outlined"
                        sx={{ borderRadius: '10px' }}
                    >
                        Batal
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        color="error"
                        variant="contained"
                        sx={{ borderRadius: '10px' }}
                    >
                        Hapus
                    </Button>
                </DialogActions>
            </Dialog>
        </Layout>
    );
}
