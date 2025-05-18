import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { useTheme } from '@mui/material/styles';
import {
    Avatar,
    Box,
    Button,
    Chip,
    Container,
    InputAdornment,
    MenuItem,
    Paper,
    Pagination,
    PaginationItem,
    TextField,
    Typography,
    Card,
    CardContent,
    Skeleton, alpha, Collapse,
} from '@mui/material';
import {
    Search,
    LocationOn,
    Business,
    ArrowForward,
    Work,
    Verified as VerifiedIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import PublicLayout from '@/Components/Layout/PublicLayout.jsx';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import {FilterIcon, SearchIcon} from "lucide-react";

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

    if (!company.logo_url || hasError) {
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
            src={company.logo_url}
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

// Company Card Component
const CompanyCard = ({ company }) => {
    const theme = useTheme();

    const formatTimeAgo = (dateString) => {
        try {
            if (!dateString) return '';
            const now = new Date();
            const updated = parseISO(dateString);
            const diffInMinutes = Math.floor((now - updated) / (1000 * 60));

            if (diffInMinutes < 60) {
                return `Terakhir aktif ${diffInMinutes} menit yang lalu`;
            } else if (diffInMinutes < 24 * 60) {
                const diffInHours = Math.floor(diffInMinutes / 60);
                return `Terakhir aktif ${diffInHours} jam yang lalu`;
            } else {
                const diffInDays = Math.floor(diffInMinutes / (60 * 24));
                return `Terakhir aktif ${diffInDays} hari yang lalu`;
            }
        } catch (error) {
            return '';
        }
    };

    const getVerifiedBadge = () => {
        // Simulasi perusahaan terverifikasi (bisa diubah sesuai logika aplikasi)
        const isVerified = company.name.includes('PT') || Math.random() > 0.5;

        if (isVerified) {
            return (
                <Box
                    component="span"
                    sx={{
                        color: theme.palette.primary.main,
                        display: 'inline-flex',
                        alignItems: 'center',
                        fontWeight: 500,
                        fontSize: '13px',
                        mr: 1,
                    }}
                >
                    <VerifiedIcon
                        fontSize="small"
                        sx={{
                            fontSize: 16,
                            mr: 0.5,
                            color: theme.palette.primary.main
                        }}
                    />
                    {company.name.includes('GROUP') ? 'Verified Company' : ''}
                </Box>
            );
        }
        return null;
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
            {/* Company Card Header with subtle gradient background */}
            <Box
                sx={{
                    height: 8,
                    width: '100%',
                    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                }}
            />

            <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex' }}>
                    <CompanyLogo company={company} size={64} />

                    <Box sx={{ flex: 1, ml: 2 }}>
                        <Box sx={{ mb: 0.5, display: 'flex', alignItems: 'center' }}>
                            {getVerifiedBadge()}
                        </Box>

                        <Link
                            href={route('public.companies.show', company.id)}
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
                                {company.name}
                            </Typography>
                        </Link>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <LocationOn fontSize="small" sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                {company.location || 'Indonesia'}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ mt: 3 }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 1.5,
                        gap: 1.5,
                    }}>
                        <Chip
                            icon={<Business sx={{ fontSize: '1rem !important' }} />}
                            label={company.industry || 'Perusahaan'}
                            size="small"
                            sx={{
                                borderRadius: '6px',
                                bgcolor: alpha(theme.palette.primary.main, 0.08),
                                color: theme.palette.primary.dark,
                                fontWeight: 500,
                                border: 'none',
                            }}
                        />

                        <Chip
                            icon={<Work sx={{ fontSize: '1rem !important' }} />}
                            label={`${company.jobs_count || 0} lowongan`}
                            size="small"
                            sx={{
                                borderRadius: '6px',
                                bgcolor: alpha(theme.palette.info.main, 0.08),
                                color: theme.palette.info.dark,
                                fontWeight: 500,
                                border: 'none',
                            }}
                        />
                    </Box>
                </Box>

                <Box sx={{
                    mt: 'auto',
                    pt: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontStyle: 'italic' }}
                    >
                        {formatTimeAgo(company.updated_at)}
                    </Typography>

                    <Button
                        component={Link}
                        href={route('public.companies.show', company.id)}
                        endIcon={<ArrowForward fontSize="small" />}
                        size="small"
                        sx={{
                            borderRadius: '6px',
                            textTransform: 'none',
                            fontWeight: 600,
                            pl: 1,
                            pr: 1.5,
                            '&:hover': {
                                backgroundColor: 'transparent',
                                color: theme.palette.primary.main,
                            },
                        }}
                    >
                        Detail
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default function Index({ companies, filters }) {
    const theme = useTheme();
    const [filterValues, setFilterValues] = useState({
        search: filters.search || '',
        industry: filters.industry || '',
        location: filters.location || '',
        sort: filters.sort || 'latest'
    });
    const [openFilters, setOpenFilters] = useState(false);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilterValues(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('public.companies.index'), filterValues, {
            preserveState: true,
            replace: true
        });
    };

    const clearFilters = () => {
        setFilterValues({
            search: '',
            industry: '',
            location: '',
            sort: 'latest'
        });

        router.get(route('public.companies.index'), {
            preserveState: true,
            replace: true
        });
    };

    return (
        <PublicLayout title="Perusahaan">
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
                                    Perusahaan Terbaik di Indonesia
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
                                    Temukan berbagai perusahaan berkualitas untuk karir masa depanmu
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
                                            placeholder="Cari nama perusahaan"
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
                                            Cari Perusahaan
                                        </Button>
                                    </Box>

                                    <Collapse in={openFilters}>
                                        <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                            <TextField
                                                select
                                                name="industry"
                                                label="Industri"
                                                value={filterValues.industry}
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
                                                <MenuItem value="">Semua Industri</MenuItem>
                                                <MenuItem value="Technology">Teknologi</MenuItem>
                                                <MenuItem value="Finance">Keuangan</MenuItem>
                                                <MenuItem value="Education">Pendidikan</MenuItem>
                                                <MenuItem value="Healthcare">Kesehatan</MenuItem>
                                                <MenuItem value="Manufacturing">Manufaktur</MenuItem>
                                                <MenuItem value="Retail">Retail</MenuItem>
                                                <MenuItem value="Media">Media</MenuItem>
                                                <MenuItem value="Services">Jasa</MenuItem>
                                            </TextField>

                                            <TextField
                                                name="location"
                                                label="Lokasi"
                                                value={filterValues.location}
                                                onChange={handleFilterChange}
                                                placeholder="Contoh: Jakarta, Bandung, dll"
                                                sx={{ minWidth: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(33.333% - 11px)' } }}
                                            />

                                            <TextField
                                                select
                                                name="sort"
                                                label="Urutan"
                                                value={filterValues.sort}
                                                onChange={handleFilterChange}
                                                sx={{ minWidth: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(33.333% - 11px)' } }}
                                            >
                                                <MenuItem value="latest">Terbaru</MenuItem>
                                                <MenuItem value="oldest">Terlama</MenuItem>
                                                <MenuItem value="alphabetical">A-Z</MenuItem>
                                                <MenuItem value="jobs_count">Jumlah Lowongan</MenuItem>
                                                <MenuItem value="popular">Popularitas</MenuItem>
                                            </TextField>
                                        </Box>
                                    </Collapse>
                                </form>
                            </Paper>
                        </motion.div>
                    </Container>
                </Box>

                {/* Companies List Section */}
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
                                {companies.data.length > 0
                                    ? `${companies.total} Perusahaan Tersedia`
                                    : 'Tidak ada perusahaan yang sesuai dengan kriteria Anda'
                                }
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                {(filterValues.search || filterValues.industry || filterValues.location) && (
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
                                        router.get(route('public.companies.index'), {
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
                                    <MenuItem value="alphabetical">A-Z</MenuItem>
                                    <MenuItem value="jobs_count">Jumlah Lowongan</MenuItem>
                                    <MenuItem value="popular">Popularitas</MenuItem>
                                </TextField>
                            </Box>
                        </Box>

                        {/* Active filters */}
                        {(filterValues.search || filterValues.industry || filterValues.location) && (
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
                                                router.get(route('public.companies.index'), {
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
                                    {filterValues.industry && (
                                        <Chip
                                            label={`Industri: ${filterValues.industry}`}
                                            color="primary"
                                            variant="outlined"
                                            onDelete={() => {
                                                setFilterValues(prev => ({ ...prev, industry: '' }));
                                                router.get(route('public.companies.index'), {
                                                    ...filterValues,
                                                    industry: ''
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
                                                router.get(route('public.companies.index'), {
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
                                </Box>
                            </Paper>
                        )}
                    </Box>

                    {/* Company Cards */}
                    {companies.data.length > 0 ? (
                        <>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1.5 }}>
                                {companies.data.map(company => (
                                    <Box
                                        key={company.id}
                                        sx={{
                                            width: {
                                                xs: '100%',
                                                sm: '50%',
                                                lg: '33.333%'
                                            },
                                            p: 1.5,  // Padding on all sides for card spacing
                                        }}
                                    >
                                        <CompanyCard company={company} />
                                    </Box>
                                ))}
                            </Box>

                            {/* Pagination */}
                            {companies.last_page > 1 && (
                                <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
                                    <Pagination
                                        count={companies.last_page}
                                        page={companies.current_page}
                                        color="primary"
                                        shape="rounded"
                                        variant="outlined"
                                        renderItem={(item) => (
                                            <PaginationItem
                                                component={Link}
                                                href={route('public.companies.index', {
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
                            <BusinessIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                            <Typography
                                variant="h5"
                                gutterBottom
                                sx={{
                                    color: 'text.secondary',
                                    fontWeight: 500
                                }}
                            >
                                Tidak ada perusahaan yang ditemukan
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
