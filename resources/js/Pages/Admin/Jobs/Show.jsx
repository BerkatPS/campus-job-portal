import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Grid,
    Chip,
    Button,
    IconButton,
    Avatar,
    Tab,
    Tabs,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Card,
    CardContent,
    Divider,
    Tooltip,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Business as BusinessIcon,
    LocationOn as LocationOnIcon,
    WorkOutline as WorkOutlineIcon,
    School as SchoolIcon,
    AttachMoney as AttachMoneyIcon,
    Timer as TimerIcon,
    Person as PersonIcon,
    Event as EventIcon,
    CalendarToday as CalendarTodayIcon,
    Category as CategoryIcon,
    Download as DownloadIcon,
    Check as CheckIcon,
    Close as CloseIcon,
    Circle as CircleIcon,
} from '@mui/icons-material';
import moment from 'moment';
import 'moment/locale/id';
import MDEditor from '@uiw/react-md-editor';
import Layout from '@/Components/Layout/Layout';

moment.locale('id');

const JobShow = ({ job, applications }) => {
    const { auth } = usePage().props;
    const [tabValue, setTabValue] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [applicationDialogOpen, setApplicationDialogOpen] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);

    // Handler functions
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleDeleteDialogOpen = () => {
        setDeleteDialogOpen(true);
    };

    const handleDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
    };

    const handleDeleteJob = () => {
        router.delete(route('admin.jobs.destroy', job.id), {
            onSuccess: () => {
                router.visit(route('admin.jobs.index'));
            }
        });
    };

    const handleOpenApplicationDialog = (application) => {
        setSelectedApplication(application);
        setApplicationDialogOpen(true);
    };

    const handleCloseApplicationDialog = () => {
        setApplicationDialogOpen(false);
        setSelectedApplication(null);
    };

    // Helper functions
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

    const getApplicationStatusColor = (status) => {
        if (!status) return 'default';

        switch (status.toLowerCase()) {
            case 'pending':
                return 'warning';
            case 'reviewed':
                return 'info';
            case 'accepted':
                return 'success';
            case 'rejected':
                return 'error';
            default:
                return 'default';
        }
    };

    const getApplicationStatusText = (status) => {
        if (!status) return 'Tidak Diketahui';

        switch (status.toLowerCase()) {
            case 'pending':
                return 'Menunggu Review';
            case 'reviewed':
                return 'Sudah Direview';
            case 'accepted':
                return 'Diterima';
            case 'rejected':
                return 'Ditolak';
            default:
                return status;
        }
    };

    const getJobTypeText = (type) => {
        switch (type) {
            case 'full_time':
                return 'Full Time';
            case 'part_time':
                return 'Part Time';
            case 'contract':
                return 'Kontrak';
            case 'internship':
                return 'Magang';
            case 'freelance':
                return 'Freelance';
            default:
                return type;
        }
    };

    const getExperienceLevelText = (level) => {
        switch (level) {
            case 'entry':
                return 'Entry Level (0-2 tahun)';
            case 'mid':
                return 'Mid Level (2-5 tahun)';
            case 'senior':
                return 'Senior Level (5+ tahun)';
            case 'executive':
                return 'Executive (10+ tahun)';
            default:
                return level;
        }
    };

    const formatSalary = (min, max) => {
        const formatNumber = (num) => {
            return new Intl.NumberFormat('id-ID').format(num);
        };

        if (min && max) {
            return `Rp ${formatNumber(min)} - Rp ${formatNumber(max)}`;
        } else if (min) {
            return `Rp ${formatNumber(min)}`;
        } else if (max) {
            return `Hingga Rp ${formatNumber(max)}`;
        } else {
            return 'Gaji tidak ditampilkan';
        }
    };

    return (
        <Layout>
            <Head title={`${job.title} - Detail Lowongan`} />

            <Container maxWidth="xl" sx={{ py: 3 }}>
                {/* Header */}
                <Box sx={{ mb: 3 }}>
                    <Button
                        component={Link}
                        href={route('admin.jobs.index')}
                        startIcon={<ArrowBackIcon />}
                        sx={{ mb: 2 }}
                    >
                        Kembali ke Daftar Lowongan
                    </Button>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                                {job.title}
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Avatar
                                    src={job.company?.logo || ''}
                                    alt={job.company?.name}
                                    sx={{
                                        mr: 2,
                                        bgcolor: (theme) => `${theme.palette.primary.main}20`,
                                        color: 'primary.main'
                                    }}
                                >
                                    {job.company?.name?.charAt(0) || <BusinessIcon />}
                                </Avatar>
                                <Typography variant="h6" color="text.secondary">
                                    {job.company?.name}
                                </Typography>
                                <Chip
                                    label={job.status}
                                    color={getStatusColor(job.status)}
                                    size="small"
                                    sx={{ ml: 2 }}
                                />
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                component={Link}
                                href={route('admin.jobs.edit', job.id)}
                                variant="outlined"
                                startIcon={<EditIcon />}
                            >
                                Edit
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={handleDeleteDialogOpen}
                            >
                                Hapus
                            </Button>
                        </Box>
                    </Box>
                </Box>

                {/* Tabs */}
                {/*<Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>*/}
                {/*    <Tabs value={tabValue} onChange={handleTabChange} aria-label="job tabs">*/}
                {/*        <Tab label="Detail Lowongan" id="tab-0" />*/}
                {/*        <Tab label={`Pelamar (${applications.total || 0})`} id="tab-1" />*/}
                {/*    </Tabs>*/}
                {/*</Box>*/}

                {/* Tab Content */}
                <Box sx={{ mt: 3 }}>
                    {/* Tab: Detail Lowongan */}
                    {tabValue === 0 && (
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={8}>
                                <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                        Deskripsi Pekerjaan
                                    </Typography>
                                    <Box data-color-mode="light" sx={{ mt: 2 }}>
                                        <MDEditor.Markdown source={job.description} />
                                    </Box>
                                </Paper>

                                <Paper sx={{ p: 3, borderRadius: 3 }}>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                        Persyaratan
                                    </Typography>
                                    <Box data-color-mode="light" sx={{ mt: 2 }}>
                                        <MDEditor.Markdown source={job.requirements} />
                                    </Box>
                                </Paper>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                        Informasi Lowongan
                                    </Typography>

                                    <List dense>
                                        <ListItem>
                                            <ListItemIcon>
                                                <CategoryIcon color="action" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="Kategori"
                                                secondary={job.category?.name || '-'}
                                            />
                                        </ListItem>

                                        <ListItem>
                                            <ListItemIcon>
                                                <LocationOnIcon color="action" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="Lokasi"
                                                secondary={job.location}
                                            />
                                        </ListItem>

                                        <ListItem>
                                            <ListItemIcon>
                                                <WorkOutlineIcon color="action" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="Tipe Pekerjaan"
                                                secondary={getJobTypeText(job.type)}
                                            />
                                        </ListItem>

                                        <ListItem>
                                            <ListItemIcon>
                                                <SchoolIcon color="action" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="Level Pengalaman"
                                                secondary={getExperienceLevelText(job.experience_level)}
                                            />
                                        </ListItem>

                                        <ListItem>
                                            <ListItemIcon>
                                                <AttachMoneyIcon color="action" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="Kisaran Gaji"
                                                secondary={formatSalary(job.salary_min, job.salary_max)}
                                            />
                                        </ListItem>

                                        <ListItem>
                                            <ListItemIcon>
                                                <CalendarTodayIcon color="action" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="Deadline Pendaftaran"
                                                secondary={job.deadline
                                                    ? moment(job.deadline).format('DD MMMM YYYY')
                                                    : 'Tidak ada batasan waktu'
                                                }
                                            />
                                        </ListItem>

                                        <ListItem>
                                            <ListItemIcon>
                                                <TimerIcon color="action" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="Tanggal Posting"
                                                secondary={moment(job.created_at).format('DD MMMM YYYY')}
                                            />
                                        </ListItem>
                                    </List>
                                </Paper>

                                <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                        Skills & Kemampuan
                                    </Typography>

                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                                        {job.skills && job.skills.length > 0 ? (
                                            job.skills.map((skill, index) => (
                                                <Chip
                                                    key={index}
                                                    label={skill}
                                                    color="primary"
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            ))
                                        ) : (
                                            <Typography variant="body2" color="text.secondary">
                                                Tidak ada skill yang ditentukan
                                            </Typography>
                                        )}
                                    </Box>
                                </Paper>

                                <Paper sx={{ p: 3, borderRadius: 3 }}>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                        Statistik
                                    </Typography>

                                    <Grid container spacing={2} sx={{ mt: 1 }}>
                                        <Grid item xs={6}>
                                            <Card variant="outlined">
                                                <CardContent>
                                                    <Typography color="text.secondary" variant="body2" gutterBottom>
                                                        Total Pelamar
                                                    </Typography>
                                                    <Typography variant="h4">
                                                        {/*{applications.total || 0}*/}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>

                                        <Grid item xs={6}>
                                            <Card variant="outlined">
                                                <CardContent>
                                                    <Typography color="text.secondary" variant="body2" gutterBottom>
                                                        Total View
                                                    </Typography>
                                                    <Typography variant="h4">
                                                        {job.view_count || 0}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                        </Grid>
                    )}

                    {/* Tab: Pelamar */}
                    {tabValue === 1 && (
                        <Paper sx={{ p: 3, borderRadius: 3 }}>
                            <TableContainer>
                                <Table sx={{ minWidth: 650 }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Pelamar</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Tanggal Melamar</TableCell>
                                            <TableCell>Ekspektasi Gaji</TableCell>
                                            <TableCell align="center">Aksi</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {applications.data && applications.data.length > 0 ? (
                                            applications.data
                                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map((application) => (
                                                    <TableRow key={application.id} hover>
                                                        <TableCell>
                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <Avatar
                                                                    sx={{
                                                                        mr: 2,
                                                                        bgcolor: (theme) => `${theme.palette.secondary.main}20`,
                                                                        color: 'secondary.main'
                                                                    }}
                                                                >
                                                                    {application.user?.name?.charAt(0) || <PersonIcon />}
                                                                </Avatar>
                                                                <Box>
                                                                    <Typography variant="body2" fontWeight="medium">
                                                                        {application.user?.name}
                                                                    </Typography>
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        {application.user?.email}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                label={getApplicationStatusText(application.status)}
                                                                color={getApplicationStatusColor(application.status)}
                                                                size="small"
                                                                icon={<CircleIcon sx={{ width: '10px', height: '10px' }} />}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            {moment(application.created_at).format('DD MMM YYYY')}
                                                        </TableCell>
                                                        <TableCell>
                                                            {application.expected_salary ?
                                                                `Rp ${new Intl.NumberFormat('id-ID').format(application.expected_salary)}` :
                                                                '-'
                                                            }
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                                                <Tooltip title="Lihat Detail">
                                                                    <Button
                                                                        variant="outlined"
                                                                        size="small"
                                                                        onClick={() => handleOpenApplicationDialog(application)}
                                                                    >
                                                                        Detail
                                                                    </Button>
                                                                </Tooltip>

                                                                <Tooltip title="Download CV">
                                                                    <IconButton
                                                                        color="primary"
                                                                        size="small"
                                                                        component="a"
                                                                        href={route('admin.applications.download-cv', application.id)}
                                                                        target="_blank"
                                                                    >
                                                                        <DownloadIcon fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Box>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Belum ada pelamar untuk lowongan ini
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
                                count={applications.total || 0}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                labelRowsPerPage="Data per halaman:"
                                labelDisplayedRows={({ from, to, count }) => `${from}-${to} dari ${count}`}
                            />
                        </Paper>
                    )}
                </Box>
            </Container>

            {/* Delete Job Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteDialogClose}
            >
                <DialogTitle>Konfirmasi Hapus</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Apakah Anda yakin ingin menghapus lowongan <strong>{job.title}</strong>? Tindakan ini tidak dapat dibatalkan dan akan menghapus semua data terkait lowongan ini.
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

            {/* Application Detail Dialog */}
            <Dialog
                open={applicationDialogOpen}
                onClose={handleCloseApplicationDialog}
                maxWidth="md"
                fullWidth
            >
                {selectedApplication && (
                    <>
                        <DialogTitle>
                            <Typography variant="h6">
                                Detail Pelamar: {selectedApplication.user?.name}
                            </Typography>
                        </DialogTitle>
                        <DialogContent dividers>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                        Informasi Pribadi
                                    </Typography>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Nama Lengkap
                                        </Typography>
                                        <Typography variant="body1">
                                            {selectedApplication.user?.name}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Email
                                        </Typography>
                                        <Typography variant="body1">
                                            {selectedApplication.user?.email}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Telepon
                                        </Typography>
                                        <Typography variant="body1">
                                            {selectedApplication.user?.phone || '-'}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Alamat
                                        </Typography>
                                        <Typography variant="body1">
                                            {selectedApplication.user?.address || '-'}
                                        </Typography>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                        Detail Lamaran
                                    </Typography>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Status
                                        </Typography>
                                        <Chip
                                            label={getApplicationStatusText(selectedApplication.status)}
                                            color={getApplicationStatusColor(selectedApplication.status)}
                                            size="small"
                                        />
                                    </Box>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Tanggal Melamar
                                        </Typography>
                                        <Typography variant="body1">
                                            {moment(selectedApplication.created_at).format('DD MMMM YYYY, HH:mm')}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Ekspektasi Gaji
                                        </Typography>
                                        <Typography variant="body1">
                                            {selectedApplication.expected_salary ?
                                                `Rp ${new Intl.NumberFormat('id-ID').format(selectedApplication.expected_salary)}` :
                                                '-'
                                            }
                                        </Typography>
                                    </Box>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            CV/Resume
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<DownloadIcon />}
                                            component="a"
                                            href={route('admin.applications.download-cv', selectedApplication.id)}
                                            target="_blank"
                                            sx={{ mt: 1 }}
                                        >
                                            Download CV
                                        </Button>
                                    </Box>
                                </Grid>

                                <Grid item xs={12}>
                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                        Surat Lamaran
                                    </Typography>
                                    <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                                        {selectedApplication.cover_letter || 'Tidak ada surat lamaran'}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseApplicationDialog}>Tutup</Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Layout>
    );
};

export default JobShow;
