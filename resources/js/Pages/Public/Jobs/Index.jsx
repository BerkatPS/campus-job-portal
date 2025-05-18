import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    Box, Typography, Container, Card, CardContent,
    TextField, Button, Chip, Divider, InputAdornment,
    FormControl, InputLabel, Select, MenuItem,
    Stack, IconButton, Grid, Paper, Avatar,
    useTheme, useMediaQuery, Collapse, Pagination, PaginationItem
} from '@mui/material';
import {
    Search as SearchIcon,
    LocationOn as LocationIcon,
    Work as WorkIcon,
    FilterAlt as FilterIcon,
    Business as BusinessIcon,
    AccessTime as TimeIcon,
    AttachMoney as SalaryIcon,
    Bookmark as BookmarkIcon,
    BookmarkBorder as BookmarkBorderIcon,
    Category as CategoryIcon,
    CalendarMonth as CalendarIcon,
    Close as CloseIcon,
    ArrowForward as ArrowForwardIcon,
    FilterList,
    BusinessCenter,
    Favorite,
    LocationOn,
    WorkOutline,
    AttachMoney,
    CalendarToday,
    ArrowForward,
    Verified as VerifiedIcon,
    BuildCircle as BuildCircleIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import moment from 'moment';
import 'moment/locale/id';

import PublicLayout from '@/Components/Layout/PublicLayout';
import MuiThemeProvider from '@/Theme/MuiThemeProvider';
import CustomPagination from '@/Components/Shared/Pagination';
import CompanyLogo from '@/Components/Shared/CompanyLogo';

// Function to create alpha version of color
const alpha = (color, value) => {
    return color + value.toString(16).padStart(2, '0');
};

// Fungsi format yang sama seperti sebelumnya
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
};

const formatJobType = (type) => {
    const types = {
        'full_time': 'Full Time',
        'part_time': 'Part Time',
        'contract': 'Kontrak',
        'internship': 'Magang',
        'freelance': 'Freelance'
    };
    return types[type] || type;
};

const formatExperienceLevel = (level) => {
    const levels = {
        'entry': 'Entry Level (0-2 tahun)',
        'mid': 'Mid Level (2-5 tahun)',
        'senior': 'Senior Level (5+ tahun)',
        'executive': 'Executive (10+ tahun)'
    };
    return levels[level] || level;
};

// Custom Chip component
const CustomChip = ({ icon, label, color = "default", onDelete, variant = "outlined", size = "small" }) => {
    const theme = useTheme();

    const getChipStyle = () => {
        if (color === "primary") {
            return {
                color: theme.palette.primary.main,
                borderColor: theme.palette.primary.main,
                backgroundColor: `${theme.palette.primary.main}15`,
                "& .MuiChip-deleteIcon": {
                    color: theme.palette.primary.main,
                },
            };
        }
        return {};
    };

    return (
        <Chip
            icon={icon}
            label={label}
            onDelete={onDelete}
            variant={variant}
            size={size}
            sx={{
                fontWeight: 500,
                borderRadius: '0.75rem',
                ...getChipStyle(),
            }}
        />
    );
};

// Job Card Component
const JobCard = ({ job }) => {
    const theme = useTheme();

    // Function to determine if the job deadline has passed
    const isJobClosed = () => {
        return moment().isAfter(moment(job.deadline));
    };

    // Function to check if job is recently posted (within last 48 hours)
    const isNewJob = () => {
        const jobDate = moment(job.created_at);
        const now = moment();
        const hoursDiff = now.diff(jobDate, 'hours');
        return hoursDiff <= 48;
    };

    return (
        <Card
            component={motion.div}
            whileHover={{
                y: -5,
                boxShadow: '0 10px 20px rgba(0,0,0,0.08)'
            }}
            transition={{ duration: 0.3 }}
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'white',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 3,
                boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
                overflow: 'hidden',
                position: 'relative',
            }}
        >
            {/* Job Card Header with subtle gradient background */}
            <Box
                sx={{
                    height: 8,
                    width: '100%',
                    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                }}
            />


            <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2.5 }}>
                    <CompanyLogo company={job.company} size={56} />

                    <Box sx={{ flex: 1, ml: 2 }}>
                        <Link
                            href={route('public.jobs.show', job.id)}
                            className="no-underline"
                        >
                            <Typography
                                variant="h6"
                                fontWeight={700}
                                sx={{
                                    color: 'text.primary',
                                    fontSize: '1.1rem',
                                    lineHeight: 1.3,
                                    mb: 0.5,
                                    transition: 'color 0.2s',
                                    '&:hover': {
                                        color: theme.palette.primary.main,
                                    }
                                }}
                            >
                                {job.title}
                            </Typography>
                        </Link>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5
                            }}
                        >
                            <BusinessCenter fontSize="small" sx={{ fontSize: 16 }} />
                            {job.company?.name}
                        </Typography>
                    </Box>

                    <IconButton
                        size="small"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Add to favorites logic here
                        }}
                        sx={{
                            color: 'action.disabled',
                            '&:hover': { color: 'error.main' }
                        }}
                    >
                        <Favorite fontSize="small" />
                    </IconButton>
                </Box>

                <Divider sx={{ my: 1.5 }} />

                <Box sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                    mb: 2.5
                }}>
                    <Chip
                        icon={<LocationOn fontSize="small" />}
                        label={job.location || 'Remote'}
                        size="small"
                        variant="outlined"
                        sx={{
                            borderRadius: '6px',
                            bgcolor: alpha(theme.palette.grey[500], 0.08),
                            color: theme.palette.text.primary,
                            fontWeight: 500,
                            border: 'none',
                        }}
                    />
                    <Chip
                        icon={<WorkOutline fontSize="small" />}
                        label={formatJobType(job.job_type)}
                        size="small"
                        variant="outlined"
                        sx={{
                            borderRadius: '6px',
                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                            color: theme.palette.primary.dark,
                            fontWeight: 500,
                            border: 'none',
                        }}
                    />
                    {job.is_salary_visible && (job.salary_min || job.salary_max) && (
                        <Chip
                            icon={<AttachMoney fontSize="small" />}
                            label={job.salary_min && job.salary_max
                                ? `${formatCurrency(job.salary_min)} - ${formatCurrency(job.salary_max)}`
                                : job.salary_min
                                    ? `Mulai dari ${formatCurrency(job.salary_min)}`
                                    : `Hingga ${formatCurrency(job.salary_max)}`}
                            size="small"
                            variant="outlined"
                            sx={{
                                borderRadius: '6px',
                                bgcolor: alpha(theme.palette.success.main, 0.08),
                                color: theme.palette.success.dark,
                                fontWeight: 500,
                                border: 'none',
                            }}
                        />
                    )}
                </Box>

                <Box sx={{ mt: 'auto', pt: 1 }}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <Typography
                            variant="caption"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                color: 'text.secondary'
                            }}
                        >
                            <CalendarToday fontSize="small" sx={{ fontSize: 14 }} />
                            {moment(job.created_at).fromNow()}
                        </Typography>

                        <Typography
                            variant="caption"
                            color={isJobClosed() ? "error.main" : "success.main"}
                            sx={{
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                py: 0.5,
                                px: 1,
                                borderRadius: 1,
                                bgcolor: isJobClosed()
                                    ? alpha(theme.palette.error.main, 0.08)
                                    : alpha(theme.palette.success.main, 0.08)
                            }}
                        >
                            {isJobClosed()
                                ? 'Ditutup'
                                : `${moment(job.deadline).diff(moment(), 'days')} hari tersisa`}
                        </Typography>
                    </Box>

                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            endIcon={<ArrowForward fontSize="small" />}
                            component={Link}
                            href={route('public.jobs.show', job.id)}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 600,
                                borderRadius: '6px',
                                px: 2,
                                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                                '&:hover': {
                                    boxShadow: '0 6px 15px rgba(0,0,0,0.15)',
                                }
                            }}
                        >
                            Detail
                        </Button>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default function Index({ jobs, filters, categories }) {
    const theme = useTheme();
    const [filterValues, setFilterValues] = useState({
        search: filters.search || '',
        category: filters.category || '',
        location: filters.location || '',
        type: filters.type || '',
        sort: isValidSortOption(filters.sort) ? filters.sort : 'latest'
    });
    const [openFilters, setOpenFilters] = useState(false);

    // Validate sort option
    function isValidSortOption(option) {
        const validOptions = ['latest', 'oldest', 'relevant', 'salary_high', 'salary_low'];
        return validOptions.includes(option);
    }

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilterValues(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('public.jobs.index'), filterValues, {
            preserveState: true,
            replace: true
        });
    };

    const clearFilters = () => {
        setFilterValues({
            search: '',
            category: '',
            location: '',
            type: '',
            sort: 'latest'
        });

        router.get(route('public.jobs.index'), {
            preserveState: true,
            replace: true
        });
    };

    return (
        <PublicLayout title="Job Listings">
            <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
                {/* Hero/Search Section */}
                <Box
                    sx={{
                        bgcolor: 'primary.main',
                        py: { xs: 6, md: 10 },
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    {/* Decorative Elements */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            opacity: 0.1,
                            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 10%, transparent 10.5%)',
                            backgroundSize: '20px 20px',
                            backgroundPosition: '0 0',
                            zIndex: 1
                        }}
                    />

                    <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
                        <Box sx={{ textAlign: 'center', mb: 5 }}>
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Typography
                                    variant="h3"
                                    component="h1"
                                    fontWeight={700}
                                    color="white"
                                    sx={{ mb: 1 }}
                                >
                                    Temukan Lowongan Kerja Impianmu
                                </Typography>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <Typography
                                    variant="h6"
                                    color="white"
                                    sx={{ mb: 4, opacity: 0.9, maxWidth: '700px', mx: 'auto' }}
                                >
                                    Berbagai lowongan dari perusahaan terbaik di Indonesia
                                </Typography>
                            </motion.div>
                        </Box>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <Paper
                                elevation={3}
                                sx={{
                                    borderRadius: '12px',
                                    p: { xs: 2, md: 3 },
                                    boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
                                }}
                            >
                                <form onSubmit={handleSearch}>
                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: { xs: 'column', md: 'row' },
                                        gap: 2
                                    }}>
                                        <TextField
                                            name="search"
                                            value={filterValues.search}
                                            onChange={handleFilterChange}
                                            placeholder="Cari lowongan kerja"
                                            fullWidth
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <SearchIcon color="action" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                }
                                            }}
                                        />

                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => setOpenFilters(!openFilters)}
                                            startIcon={<FilterIcon />}
                                            sx={{
                                                minWidth: { xs: '100%', md: '180px' },
                                                borderRadius: 2,
                                                fontWeight: 600,
                                                textTransform: 'none',
                                                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                                            }}
                                        >
                                            Filter Lanjutan
                                        </Button>

                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            sx={{
                                                minWidth: { xs: '100%', md: '180px' },
                                                borderRadius: 2,
                                                fontWeight: 600,
                                                textTransform: 'none',
                                                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                                            }}
                                        >
                                            Cari Lowongan
                                        </Button>
                                    </Box>

                                    <Collapse in={openFilters}>
                                        <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                            <TextField
                                                select
                                                name="category"
                                                label="Kategori"
                                                value={filterValues.category}
                                                onChange={handleFilterChange}
                                                sx={{ minWidth: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(33.333% - 11px)' } }}
                                                SelectProps={{
                                                    MenuProps: {
                                                        PaperProps: {
                                                            sx: { maxHeight: 300 }
                                                        }
                                                    }
                                                }}
                                            >
                                                <MenuItem value="">Semua Kategori</MenuItem>
                                                {categories
                                                    .filter(category => category && typeof category === 'string')
                                                    .map(category => (
                                                    <MenuItem key={category} value={category}>
                                                        {category}
                                                    </MenuItem>
                                                ))}
                                            </TextField>

                                            <TextField
                                                name="location"
                                                label="Lokasi"
                                                value={filterValues.location}
                                                onChange={handleFilterChange}
                                                placeholder="Contoh: Jakarta, Remote, dll"
                                                sx={{ minWidth: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(33.333% - 11px)' } }}
                                            />

                                            <TextField
                                                select
                                                name="type"
                                                label="Jenis Pekerjaan"
                                                value={filterValues.type}
                                                onChange={handleFilterChange}
                                                sx={{ minWidth: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(33.333% - 11px)' } }}
                                            >
                                                <MenuItem value="">Semua Jenis</MenuItem>
                                                <MenuItem value="full_time">Full Time</MenuItem>
                                                <MenuItem value="part_time">Part Time</MenuItem>
                                                <MenuItem value="contract">Kontrak</MenuItem>
                                                <MenuItem value="internship">Magang</MenuItem>
                                                <MenuItem value="freelance">Freelance</MenuItem>
                                            </TextField>
                                        </Box>
                                    </Collapse>
                                </form>
                            </Paper>
                        </motion.div>
                    </Container>
                </Box>

                {/* Job List Section */}
                <Container maxWidth="lg" sx={{ py: 5 }}>
                    {/* Filters and sorting */}
                    <Box sx={{ mb: 3 }}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: { xs: 'flex-start', md: 'center' },
                            flexDirection: { xs: 'column', md: 'row' },
                            gap: { xs: 2, md: 0 }
                        }}>
                            <Typography variant="h5" component="h2" fontWeight={700} color="text.primary">
                                {jobs.data.length > 0
                                    ? `${jobs.total} Lowongan Tersedia`
                                    : 'Tidak ada lowongan yang sesuai dengan kriteria Anda'
                                }
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                {(filterValues.search || filterValues.category || filterValues.location || filterValues.type) && (
                                    <Button
                                        size="small"
                                        onClick={clearFilters}
                                        variant="outlined"
                                        color="primary"
                                        startIcon={<CloseIcon fontSize="small" />}
                                        sx={{
                                            borderRadius: '8px',
                                            textTransform: 'none',
                                            fontWeight: 600,
                                        }}
                                    >
                                        Reset Filter
                                    </Button>
                                )}

                                <TextField
                                    select
                                    name="sort"
                                    label="Urutan"
                                    size="small"
                                    value={filterValues.sort}
                                    onChange={(e) => {
                                        handleFilterChange(e);
                                        router.get(route('public.jobs.index'), {
                                            ...filterValues,
                                            sort: e.target.value
                                        }, {
                                            preserveState: true,
                                            replace: true
                                        });
                                    }}
                                    sx={{
                                        minWidth: 150,
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '8px',
                                        }
                                    }}
                                >
                                    <MenuItem value="latest">Terbaru</MenuItem>
                                    <MenuItem value="oldest">Terlama</MenuItem>
                                    <MenuItem value="relevant">Paling Relevan</MenuItem>
                                    <MenuItem value="salary_high">Gaji Tertinggi</MenuItem>
                                    <MenuItem value="salary_low">Gaji Terendah</MenuItem>
                                </TextField>
                            </Box>
                        </Box>

                        {/* Active filters */}
                        {(filterValues.search || filterValues.category || filterValues.location || filterValues.type) && (
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2,
                                    mt: 2,
                                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                                    borderRadius: 2,
                                    border: '1px dashed',
                                    borderColor: alpha(theme.palette.primary.main, 0.3),
                                }}
                            >
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {filterValues.search && (
                                        <Chip
                                            label={`Kata kunci: "${filterValues.search}"`}
                                            color="primary"
                                            variant="outlined"
                                            onDelete={() => {
                                                setFilterValues(prev => ({ ...prev, search: '' }));
                                                router.get(route('public.jobs.index'), {
                                                    ...filterValues,
                                                    search: ''
                                                }, {
                                                    preserveState: true,
                                                    replace: true
                                                });
                                            }}
                                            sx={{ borderRadius: '8px' }}
                                        />
                                    )}
                                    {filterValues.category && (
                                        <Chip
                                            label={`Kategori: ${filterValues.category}`}
                                            color="primary"
                                            variant="outlined"
                                            onDelete={() => {
                                                setFilterValues(prev => ({ ...prev, category: '' }));
                                                router.get(route('public.jobs.index'), {
                                                    ...filterValues,
                                                    category: ''
                                                }, {
                                                    preserveState: true,
                                                    replace: true
                                                });
                                            }}
                                            sx={{ borderRadius: '8px' }}
                                        />
                                    )}
                                    {filterValues.location && (
                                        <Chip
                                            label={`Lokasi: ${filterValues.location}`}
                                            color="primary"
                                            variant="outlined"
                                            onDelete={() => {
                                                setFilterValues(prev => ({ ...prev, location: '' }));
                                                router.get(route('public.jobs.index'), {
                                                    ...filterValues,
                                                    location: ''
                                                }, {
                                                    preserveState: true,
                                                    replace: true
                                                });
                                            }}
                                            sx={{ borderRadius: '8px' }}
                                        />
                                    )}
                                    {filterValues.type && (
                                        <Chip
                                            label={`Tipe: ${formatJobType(filterValues.type)}`}
                                            color="primary"
                                            variant="outlined"
                                            onDelete={() => {
                                                setFilterValues(prev => ({ ...prev, type: '' }));
                                                router.get(route('public.jobs.index'), {
                                                    ...filterValues,
                                                    type: ''
                                                }, {
                                                    preserveState: true,
                                                    replace: true
                                                });
                                            }}
                                            sx={{ borderRadius: '8px' }}
                                        />
                                    )}
                                </Box>
                            </Paper>
                        )}
                    </Box>

                    {/* Job Cards */}
                    {jobs.data.length > 0 ? (
                        <>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1.5 }}>
                                {jobs.data.map(job => (
                                    <Box
                                        key={job.id}
                                        sx={{
                                            width: {
                                                xs: '100%',
                                                sm: '50%',
                                                lg: '33.333%'
                                            },
                                            p: 1.5,  // Padding on all sides for card spacing
                                        }}
                                    >
                                        <JobCard job={job} />
                                    </Box>
                                ))}
                            </Box>

                            {/* Pagination */}
                            {jobs.last_page > 1 && (
                                <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
                                    <Pagination
                                        count={jobs.last_page}
                                        page={jobs.current_page}
                                        color="primary"
                                        shape="rounded"
                                        variant="outlined"
                                        renderItem={(item) => (
                                            <PaginationItem
                                                component={Link}
                                                href={route('public.jobs.index', {
                                                    ...filterValues,
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
                        </>
                    ) : (
                        <Box
                            sx={{
                                textAlign: 'center',
                                py: 10
                            }}
                        >
                            <BuildCircleIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                            <Typography
                                variant="h5"
                                gutterBottom
                                sx={{
                                    color: 'text.secondary',
                                    fontWeight: 500
                                }}
                            >
                                Tidak ada lowongan yang ditemukan
                            </Typography>
                            <Typography
                                variant="body1"
                                color="text.secondary"
                                sx={{ mb: 3, maxWidth: '500px', mx: 'auto' }}
                            >
                                Coba ubah filter pencarian Anda untuk menemukan lebih banyak hasil.
                            </Typography>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={clearFilters}
                                sx={{
                                    borderRadius: '8px',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    px: 3
                                }}
                            >
                                Reset Filter
                            </Button>
                        </Box>
                    )}
                </Container>
            </Box>
        </PublicLayout>
    );
}
