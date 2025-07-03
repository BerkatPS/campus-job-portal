import React, { useState, useEffect, useMemo } from 'react';
import { Head, usePage, Link, router } from '@inertiajs/react';
import moment from 'moment';
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
    Grid
} from '@mui/material';
import Swal from 'sweetalert2';
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
import CustomPagination from '@/Components/Shared/Pagination';

// Company Logo Component with Fallback
const CompanyLogo = ({ company, size = 48 }) => {
    const [hasError, setHasError] = useState(false);
    const theme = useTheme();

    // Generate colors based on company name
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

    // Default logo content - company initial with background color
    const renderDefaultLogo = () => {
        const bgColor = generateColorFromName(company.name);
        const initial = company.name?.charAt(0).toUpperCase() || 'C';

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

    if (!company.logo || hasError) {
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
            src={company.logo}
            alt={company.name}
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

// Fungsi untuk menampilkan dialog konfirmasi penghapusan dengan SweetAlert2
const showDeleteConfirmation = (company, onConfirm) => {
    Swal.fire({
        title: 'Hapus Perusahaan',
        html: `
            <p>Apakah Anda yakin ingin menghapus ${company?.name}?</p>
            <p style="color: #666; font-size: 0.9em; margin-top: 8px;">
                Tindakan ini tidak dapat dibatalkan. Semua data terkait perusahaan ini akan dihapus secara permanen.
            </p>
        `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#f44336', // error.main
        cancelButtonColor: '#9e9e9e', // grey.500
        confirmButtonText: 'Hapus',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (result.isConfirmed) {
            onConfirm();
        }
    });
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
                transition={{ duration: 0.3, delay }}
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
                        bgcolor: colorValues.bgColor,
                    }}
                >
                    <Avatar
                        sx={{
                            bgcolor: colorValues.avatarBgColor,
                            color: colorValues.avatarColor,
                            width: 56,
                            height: 56,
                            mr: 2
                        }}
                    >
                        {icon}
                    </Avatar>
                    <Box>
                        <Typography variant="h4" fontWeight={700} gutterBottom>
                            {count}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {label}
                        </Typography>
                    </Box>
                </MuiCard>
            </motion.div>
        </Box>
    );
};

// Actions Menu component
const ActionsMenu = ({ anchorEl, onClose }) => {
    return (
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={onClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
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
                printCompanyList();
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

const CompaniesIndex = ({ companies = { data: [] }, filters = { industries: [] } }) => {
    const { flash } = usePage().props;
    const theme = useTheme();
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [companyToDelete, setCompanyToDelete] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [showAlert, setShowAlert] = useState(false);
    const [filterIndustry, setFilterIndustry] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [tabValue, setTabValue] = useState(0);
    const [actionsAnchorEl, setActionsAnchorEl] = useState(null);

    // Calculate stats
    const totalCompanies = useMemo(() => companies?.total || companies?.data?.length || 0, [companies]);
    const activeCompanies = useMemo(() =>
        companies?.data?.filter(company => company.is_active)?.length || 0,
        [companies]
    );
    const inactiveCompanies = useMemo(() =>
        companies?.data?.filter(company => !company.is_active)?.length || 0,
        [companies]
    );

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
                    <CompanyLogo company={company} size={44} />
                </Box>
            ),
        },
        {
            field: 'name',
            header: 'Nama Perusahaan',
            sortable: true,
            render: (name, company) => (
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="body1" fontWeight={600}>
                        {name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {company.address ? company.address.split(',')[0] : 'Lokasi tidak tersedia'}
                    </Typography>
                </Box>
            ),
        },
        {
            field: 'industry',
            header: 'Industri',
            sortable: true,
            render: (industry) => (
                <Chip
                    label={industry || 'Tidak tersedia'}
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
                            label="Aktif"
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
                            label="Tidak Aktif"
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
                    Tidak tersedia
                </Typography>
            ),
        },
        {
            field: 'created_at',
            header: 'Tanggal Dibuat',
            sortable: true,
            render: (date) => {
                const formattedDate = new Date(date).toLocaleDateString('id-ID', {
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

    // Apply filters to companies
    const filteredCompanies = useMemo(() => {
        // Ensure companies.data exists and is an array
        if (!companies?.data || !Array.isArray(companies.data)) {
            return [];
        }
        
        let filtered = [...companies.data];
        
        // Apply search filter
        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            filtered = filtered.filter(company => 
                (company.name && company.name.toLowerCase().includes(lowerSearch)) ||
                (company.industry && company.industry.toLowerCase().includes(lowerSearch)) ||
                (company.address && company.address.toLowerCase().includes(lowerSearch))
            );
        }
        
        // Apply industry filter
        if (filterIndustry) {
            filtered = filtered.filter(company => company.industry === filterIndustry);
        }
        
        // Apply status filter
        if (filterStatus === 'active') {
            filtered = filtered.filter(company => company.is_active);
        } else if (filterStatus === 'inactive') {
            filtered = filtered.filter(company => !company.is_active);
        }
        
        return filtered;
    }, [companies?.data, searchTerm, filterIndustry, filterStatus]);

    // When search, filter or tab changes, update the URL to maintain state
    useEffect(() => {
        if (companies?.data) {
            // Only update URL if user explicitly changed filters (not on initial load)
            if (searchTerm || filterIndustry || filterStatus) {
                const params = { ...route().params };
                
                // Add filters to URL params
                if (searchTerm) params.search = searchTerm;
                else delete params.search;
                
                if (filterIndustry) params.industry = filterIndustry;
                else delete params.industry;
                
                if (filterStatus) params.status = filterStatus;
                else delete params.status;
                
                // Reset to page 1 when filters change
                params.page = 1;
                
                router.get(route('admin.companies.index', params), {}, {
                    preserveState: true,
                    replace: true,
                    only: ['companies']
                });
            }
        }
    }, [searchTerm, filterIndustry, filterStatus]);

    // Handle company deletion
    const handleDelete = () => {
        if (!companyToDelete) return;

        setLoading(true);
        router.delete(route('admin.companies.destroy', companyToDelete.id), {
            onSuccess: (page) => {
                setCompanyToDelete(null);
                
                // Tampilkan pesan sukses dengan SweetAlert2
                const message = page.props.flash && page.props.flash.message
                    ? page.props.flash.message
                    : 'Perusahaan berhasil dihapus';
                
                Swal.fire({
                    title: 'Berhasil!',
                    text: message,
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: theme.palette.primary.main
                });
                
                // Refresh data setelah penghapusan berhasil
                router.reload({ only: ['companies'] });
            },
            onError: (errors) => {
                // Tampilkan pesan error dengan SweetAlert2
                console.error('Error deleting company:', errors);
                let errorMessage = 'Gagal menghapus perusahaan: Terjadi kesalahan';
                
                if (errors.message) {
                    errorMessage = errors.message;
                } else if (errors.errors && Object.keys(errors.errors).length > 0) {
                    errorMessage = 'Gagal menghapus perusahaan:\n' + Object.values(errors.errors).flat().join('\n');
                }
                
                Swal.fire({
                    title: 'Error!',
                    text: errorMessage,
                    icon: 'error',
                    confirmButtonText: 'OK',
                    confirmButtonColor: theme.palette.error.main
                });
            },
            onFinish: () => setLoading(false),
        });
    };

    // Toggle company active status
    const handleToggleActive = (company) => {
        router.post(route('admin.companies.toggle-active', company.id), {
            onSuccess: () => {
                setAlertMessage(`Status perusahaan ${company.is_active ? 'dinonaktifkan' : 'diaktifkan'} berhasil.`);
                setAlertSeverity('success');
                setShowAlert(true);
            },
            onError: (errors) => {
                setAlertMessage('Gagal mengupdate status perusahaan: ' + Object.values(errors).flat().join(' '));
                setAlertSeverity('error');
                setShowAlert(true);
            }
        });
    };

    // Prepare the actions for the table
    const actions = (company) => (
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Tooltip title="Lihat Detail">
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
            <Tooltip title={company.is_active ? "Nonaktifkan" : "Aktifkan"}>
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
            <Tooltip title="Hapus">
                <IconButton
                    size="small"
                    onClick={() => {
                        setCompanyToDelete(company);
                        showDeleteConfirmation(company, handleDelete);
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

    // Reset all filters and go back to "All" tab
    const resetFilters = () => {
        setSearchTerm('');
        setFilterIndustry('');
        setFilterStatus('');
        setTabValue(0);
        
        // Reset URL query params and reload companies data
        router.get(route('admin.companies.index'), {}, {
            preserveState: false,  // Don't preserve state to ensure complete refresh
            only: ['companies']
        });
    };
    
    // Fungsi untuk mengekspor data ke CSV
    const exportToCSV = () => {
        // Pastikan ada data untuk diekspor
        if (!companies?.data || companies.data.length === 0) {
            alert('Tidak ada data untuk diekspor');
            return;
        }
    
        // Membuat header CSV
        const headers = [
            'ID', 'Nama Perusahaan', 'Industri', 'Alamat', 'Website', 'Status',
            'Tanggal Dibuat'
        ];
    
        // Mengubah data companies menjadi format CSV
        const csvData = companies.data.map(company => [
            company.id,
            company.name,
            company.industry || '-',
            company.address || '-',
            company.website || '-',
            company.is_active ? 'Aktif' : 'Tidak Aktif',
            moment(company.created_at).format('DD/MM/YYYY')
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
        link.setAttribute('download', `daftar-perusahaan-${moment().format('YYYY-MM-DD')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    // Fungsi untuk mencetak daftar perusahaan
    const printCompanyList = () => {
        // Pastikan ada data untuk dicetak
        if (!companies?.data || companies.data.length === 0) {
            alert('Tidak ada data untuk dicetak');
            return;
        }
    
        // Membuat konten HTML untuk dicetak
        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Daftar Perusahaan - ${moment().format('DD MMMM YYYY')}</title>
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
                    .status-inactive {
                        color: red;
                        font-weight: bold;
                    }
                </style>
            </head>
            <body>
                <div class="print-date">Dicetak pada: ${moment().format('DD MMMM YYYY, HH:mm:ss')}</div>
                <h1>Daftar Perusahaan</h1>
                <table>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Nama Perusahaan</th>
                            <th>Industri</th>
                            <th>Alamat</th>
                            <th>Website</th>
                            <th>Status</th>
                            <th>Tanggal Dibuat</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${companies.data.map((company, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${company.name}</td>
                                <td>${company.industry || '-'}</td>
                                <td>${company.address || '-'}</td>
                                <td>${company.website || '-'}</td>
                                <td class="status-${company.is_active ? 'active' : 'inactive'}">${company.is_active ? 'Aktif' : 'Tidak Aktif'}</td>
                                <td>${moment(company.created_at).format('DD/MM/YYYY')}</td>
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

    return (
        <Layout>
            <Head title="Perusahaan" />

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
                            Perusahaan
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Kelola perusahaan dan profil mereka
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
                        Tambah Perusahaan
                    </Button>
                </motion.div>
            </Box>

            {/* SweetAlert2 akan ditampilkan melalui fungsi showDeleteConfirmation */}

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
                <StatsCard
                    icon={<BusinessIcon />}
                    count={totalCompanies}
                    label="Total Perusahaan"
                    color="primary"
                    delay={0}
                />
                <StatsCard
                    icon={<CheckCircleOutlineIcon />}
                    count={activeCompanies}
                    label="Perusahaan Aktif"
                    color="success"
                    delay={0.1}
                />
                <StatsCard
                    icon={<DoDisturbOnIcon />}
                    count={inactiveCompanies}
                    label="Perusahaan Tidak Aktif"
                    color="grey"
                    delay={0.2}
                />
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
                            Direktori Perusahaan
                        </Typography>
                    </Box>

                    <Box>
                        <Tooltip title="Lihat Lebih Banyak">
                            <IconButton onClick={handleOpenActionsMenu}>
                                <MoreVertIcon />
                            </IconButton>
                        </Tooltip>
                        <ActionsMenu
                            anchorEl={actionsAnchorEl}
                            onClose={handleCloseActionsMenu}
                        />
                    </Box>
                </Box>

                {/* Tabs */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        aria-label="status perusahaan tabs"
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
                        <Tab label="Semua Perusahaan" />
                        <Tab label="Aktif" />
                        <Tab label="Tidak Aktif" />
                    </Tabs>
                </Box>

                {/* Filters */}
                <Box sx={{ p: 2, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                        <Box sx={{ flex: '1 1 260px' }}>
                            <TextField
                                fullWidth
                                placeholder="Cari perusahaan berdasarkan nama atau industri..."
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
                                label="Industri"
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
                                <MenuItem value="">Semua Industri</MenuItem>
                                {filters?.industries?.map((industry) => (
                                    <MenuItem key={industry} value={industry}>
                                        {industry}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Tooltip title="Reset Semua Filter">
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
                            {filteredCompanies.length} {filteredCompanies.length === 1 ? 'perusahaan' : 'perusahaan'} ditemukan
                            {(searchTerm || filterIndustry || filterStatus) ? ' dengan filter saat ini' : ''}
                        </Typography>
                    </Box>
                    {(searchTerm || filterIndustry || tabValue > 0) && (
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
                            emptyMessage="Tidak ada perusahaan ditemukan dengan filter saat ini."
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

            {/* Pagination */}
            {companies?.meta?.last_page > 1 && (
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
                    <CustomPagination
                        currentPage={companies.meta.current_page}
                        totalPages={companies.meta.last_page}
                        totalItems={companies.meta.total}
                        perPage={companies.meta.per_page}
                        onPageChange={(page) => {
                            // Store current filters in URL
                            const params = {
                                ...route().params,
                                page: page
                            };
                            
                            // Add current filters to URL if they exist
                            if (searchTerm) params.search = searchTerm;
                            if (filterIndustry) params.industry = filterIndustry;
                            if (filterStatus) params.status = filterStatus;
                            
                            router.get(route('admin.companies.index', params), {}, {
                                preserveState: true,
                                replace: true,
                                only: ['companies']
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
                            if (filterIndustry) params.industry = filterIndustry;
                            if (filterStatus) params.status = filterStatus;
                            
                            router.get(route('admin.companies.index', params), {}, {
                                preserveState: true,
                                replace: true,
                                only: ['companies']
                            });
                        }}
                        showFirst
                        showLast
                        rounded="large"
                    />
                </Paper>
            )}
        </Layout>
    );
};

export default CompaniesIndex;
