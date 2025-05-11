import React, { useState } from 'react';
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
    Divider
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
    MonetizationOn as MonetizationOnIcon
} from '@mui/icons-material';
import moment from 'moment';
import 'moment/locale/id';
import { motion } from 'framer-motion';
import Layout from '@/Components/Layout/Layout';

moment.locale('id');

const JobsIndex = ({ jobs, filters, categories }) => {
    const { auth } = usePage().props;
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedJob, setSelectedJob] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [viewMode, setViewMode] = useState('list');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [filterOpen, setFilterOpen] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState(filters.category || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');

    // Dialog handlers
    const handleDeleteDialogOpen = (job) => {
        setSelectedJob(job);
        setDeleteDialogOpen(true);
    };

    const handleDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
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

    // Table pagination handlers
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Search handler
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.jobs.index'), {
            search: searchTerm,
            category: categoryFilter,
            status: statusFilter
        }, {
            preserveState: true,
            replace: true
        });
    };

    // Delete job
    const handleDeleteJob = () => {
        if (selectedJob) {
            router.delete(route('admin.jobs.destroy', selectedJob.id), {
                onSuccess: () => {
                    handleDeleteDialogClose();
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

    return (
        <Layout>
            <Head title="Daftar Lowongan Pekerjaan" />

            <Container maxWidth="xl" sx={{ py: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Typography variant="h4" component="h1" fontWeight="bold">
                        Lowongan Pekerjaan
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1 }}>
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

                <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                        <Box sx={{ flex: 1 }}>
                            <form onSubmit={handleSearch}>
                                <TextField
                                    fullWidth
                                    placeholder="Cari lowongan pekerjaan..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    edge="end"
                                                    type="submit"
                                                    size="small"
                                                >
                                                    <SearchIcon fontSize="small" />
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                    sx={{ bgcolor: 'background.paper' }}
                                />
                            </form>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                            <Tooltip title="Filter">
                                <IconButton onClick={() => setFilterOpen(!filterOpen)}>
                                    <FilterListIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Refresh">
                                <IconButton onClick={() => router.reload()}>
                                    <RefreshIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Export">
                                <IconButton>
                                    <DownloadIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="List View">
                                <IconButton
                                    color={viewMode === 'list' ? 'primary' : 'default'}
                                    onClick={() => setViewMode('list')}
                                >
                                    <ViewListIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Grid View">
                                <IconButton
                                    color={viewMode === 'grid' ? 'primary' : 'default'}
                                    onClick={() => setViewMode('grid')}
                                >
                                    <ViewModuleIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>

                    {filterOpen && (
                        <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 2 }}>
                                <Box sx={{ flex: 1 }}>
                                    <TextField
                                        select
                                        fullWidth
                                        label="Kategori"
                                        value={categoryFilter}
                                        onChange={(e) => setCategoryFilter(e.target.value)}
                                        size="small"
                                    >
                                        <MenuItem value="">Semua Kategori</MenuItem>
                                        {categories.map((category) => (
                                            <MenuItem key={category.id} value={category.id}>
                                                {category.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <TextField
                                        select
                                        fullWidth
                                        label="Status"
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        size="small"
                                    >
                                        <MenuItem value="">Semua Status</MenuItem>
                                        <MenuItem value="active">Aktif</MenuItem>
                                        <MenuItem value="draft">Draft</MenuItem>
                                        <MenuItem value="closed">Ditutup</MenuItem>
                                    </TextField>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                    variant="outlined"
                                    sx={{ mr: 1 }}
                                    onClick={() => {
                                        setCategoryFilter('');
                                        setStatusFilter('');
                                    }}
                                >
                                    Reset
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleSearch}
                                >
                                    Terapkan Filter
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Paper>

                {viewMode === 'list' ? (
                    <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
                        <TableContainer>
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Lowongan</TableCell>
                                        <TableCell>Perusahaan</TableCell>
                                        <TableCell>Lokasi</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Tanggal Posting</TableCell>
                                        <TableCell>Pelamar</TableCell>
                                        <TableCell>Aksi</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {jobs.data.length > 0 ? (
                                        jobs.data
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((job) => (
                                                <TableRow key={job.id} hover>
                                                    <TableCell>
                                                        <Box>
                                                            <Typography variant="body2" fontWeight="medium">
                                                                {job.title}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {job.type === 'full_time' ? 'Full Time' :
                                                                    job.type === 'part_time' ? 'Part Time' :
                                                                        job.type === 'contract' ? 'Kontrak' :
                                                                            job.type === 'internship' ? 'Magang' : job.type}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Avatar
                                                                src={job.company?.logo || ''}
                                                                alt={job.company?.name}
                                                                sx={{
                                                                    mr: 2,
                                                                    width: 30,
                                                                    height: 30,
                                                                    bgcolor: (theme) => `${theme.palette.primary.main}20`,
                                                                    color: 'primary.main'
                                                                }}
                                                            >
                                                                {job.company?.name?.charAt(0) || <BusinessIcon />}
                                                            </Avatar>
                                                            <Typography variant="body2">
                                                                {job.company?.name}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>{job.location}</TableCell>
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
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={jobs.total || jobs.data.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            labelRowsPerPage="Data per halaman:"
                            labelDisplayedRows={({ from, to, count }) => `${from}-${to} dari ${count}`}
                        />
                    </Paper>
                ) : (
                    <Box>
                        <Box sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 3,
                            mb: 3
                        }}>
                            {jobs.data.length > 0 ? (
                                jobs.data
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((job) => (
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

                        <Box>
                            <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
                                <TablePagination
                                    rowsPerPageOptions={[8, 16, 24, 32]}
                                    component="div"
                                    count={jobs.total || jobs.data.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    labelRowsPerPage="Data per halaman:"
                                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} dari ${count}`}
                                />
                            </Paper>
                        </Box>
                    </Box>
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
                    handleDeleteDialogOpen(selectedJob);
                }} sx={{ color: 'error.main' }}>
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                    Hapus Lowongan
                </MenuItem>
            </Menu>

            {/* Delete confirmation dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteDialogClose}
            >
                <DialogTitle>Konfirmasi Hapus</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Apakah Anda yakin ingin menghapus lowongan <strong>{selectedJob?.title}</strong>? Tindakan ini tidak dapat dibatalkan dan akan menghapus semua data terkait lowongan ini.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteDialogClose}>Batal</Button>
                    <Button
                        onClick={handleDeleteJob}
                        color="error"
                        variant="contained"
                    >
                        Hapus
                    </Button>
                </DialogActions>
            </Dialog>
        </Layout>
    );
};

export default JobsIndex;
