import React from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Divider,
    IconButton,
    Paper,
    Typography,
    useTheme,
    useMediaQuery,
    Chip,
    Tab,
    Tabs,
    List,
    alpha
} from '@mui/material';
import {
    LocationOn,
    Language,
    Email,
    Phone,
    Facebook,
    Twitter,
    LinkedIn,
    Instagram,
    Business,
    Work,
    CalendarToday,
    ArrowForward,
    AttachMoney,
    Description,
    People,
    StarOutlined
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import PublicLayout from '@/Components/Layout/PublicLayout.jsx';
import moment from 'moment';
import CompanyReviews from '@/Components/Company/CompanyReviews';
import CompanyLogo from '@/Components/Shared/CompanyLogo';

// Job Card Component
const JobCard = ({ job }) => {
    const theme = useTheme();

    const formatJobType = (type) => {
        if (!type) return 'Full Time';

        return type
            .replace('_', ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    const formatSalary = (minSalary, maxSalary) => {
        const formatCurrency = (amount) => {
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(amount);
        };

        if (!minSalary && !maxSalary) return 'Negotiable';
        if (!minSalary) return `Up to ${formatCurrency(maxSalary)}`;
        if (!maxSalary) return `From ${formatCurrency(minSalary)}`;
        return `${formatCurrency(minSalary)} - ${formatCurrency(maxSalary)}`;
    };

    return (
        <Card
            component={motion.div}
            whileHover={{ y: -5, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
            transition={{ duration: 0.3 }}
            sx={{
                mb: 3,
                bgcolor: 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                border: '1px solid',
                borderColor: 'divider',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            {/* Job card header with gradient */}
            <Box
                sx={{
                    height: 6,
                    width: '100%',
                    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                }}
            />

            <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                        <Link href={route('public.jobs.show', job.id)} className="no-underline">
                            <Typography
                                variant="h6"
                                fontWeight={600}
                                sx={{
                                    color: 'text.primary',
                                    transition: 'color 0.2s',
                                    '&:hover': { color: 'primary.main' }
                                }}
                            >
                                {job.title}
                            </Typography>
                        </Link>
                    </Box>
                </Box>

                <Divider sx={{ my: 1.5 }} />

                <Box sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                    mb: 2
                }}>
                    <Chip
                        size="small"
                        icon={<LocationOn fontSize="small" />}
                        label={job.location || 'Remote'}
                        variant="outlined"
                        sx={{
                            borderRadius: '8px',
                            borderColor: 'divider',
                            bgcolor: 'rgba(0,0,0,0.02)'
                        }}
                    />

                    <Chip
                        size="small"
                        icon={<Work fontSize="small" />}
                        label={formatJobType(job.type)}
                        variant="outlined"
                        sx={{
                            borderRadius: '8px',
                            borderColor: 'divider',
                            bgcolor: 'rgba(0,0,0,0.02)'
                        }}
                    />

                    <Chip
                        size="small"
                        icon={<AttachMoney fontSize="small" />}
                        label={job.is_salary_visible && (job.salary_min || job.salary_max)
                            ? formatSalary(job.salary_min, job.salary_max)
                            : 'Negotiable'}
                        variant="outlined"
                        sx={{
                            borderRadius: '8px',
                            borderColor: 'divider',
                            bgcolor: 'rgba(0,0,0,0.02)'
                        }}
                    />
                </Box>

                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 'auto'
                }}>
                    <Typography
                        variant="body2"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            color: 'text.secondary',
                            fontWeight: 500
                        }}
                    >
                        <CalendarToday fontSize="small" sx={{ fontSize: 16 }} />
                        {moment(job.created_at).fromNow()}
                    </Typography>

                    <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        endIcon={<ArrowForward fontSize="small" />}
                        component={Link}
                        href={route('public.jobs.show', job.id)}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 600,
                            borderRadius: '8px',
                            borderWidth: '1.5px'
                        }}
                    >
                        Detail
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default function Show({ company, jobCount, reviews, reviewStats }) {
    const theme = useTheme();
    const [currentTab, setCurrentTab] = React.useState(0);

    const formatWebsite = (url) => {
        if (!url) return '';
        return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
    };

    // Handler for tab changes
    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    return (
        <PublicLayout>
            <Head title={company ? `${company.name} | Perusahaan` : 'Detail Perusahaan'} />

            {/* Hero Section with Company Info */}
            <Box
                sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                    pt: 6,
                    pb: 12,
                    mb: -6
                }}
            >
                {/* Background pattern */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        opacity: 0.1,
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        backgroundSize: '40px 40px',
                    }}
                />
                <Container maxWidth="lg">
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            gap: 3,
                            alignItems: { xs: 'flex-start', md: 'center' }
                        }}
                    >
                        <Box
                            sx={{
                                width: { xs: '100%', md: '66.67%' }
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                <CompanyLogo
                                    company={company}
                                    size={120}
                                    variant="square"
                                    sx={{
                                        borderRadius: '16px',
                                        border: '4px solid white',
                                        boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                                    }}
                                />

                                <Box>
                                    <Typography variant="h3" fontWeight={700} gutterBottom>
                                        {company.name}
                                    </Typography>

                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                                        {company.industry && (
                                            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Business fontSize="small" />
                                                {company.industry}
                                            </Typography>
                                        )}

                                        {company.location && (
                                            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <LocationOn fontSize="small" />
                                                {company.location}
                                            </Typography>
                                        )}

                                        {company.website && (
                                            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Language fontSize="small" />
                                                <Link
                                                    href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-white hover:text-white/80"
                                                >
                                                    {formatWebsite(company.website)}
                                                </Link>
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                width: { xs: '100%', md: '33.33%' },
                                display: 'flex',
                                justifyContent: { xs: 'flex-start', md: 'flex-end' },
                                gap: 1,
                                mt: { xs: 2, md: 0 }
                            }}
                        >
                            {company.facebook && (
                                <IconButton
                                    href={company.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
                                >
                                    <Facebook />
                                </IconButton>
                            )}

                            {company.twitter && (
                                <IconButton
                                    href={company.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
                                >
                                    <Twitter />
                                </IconButton>
                            )}

                            {company.linkedin && (
                                <IconButton
                                    href={company.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
                                >
                                    <LinkedIn />
                                </IconButton>
                            )}

                            {company.instagram && (
                                <IconButton
                                    href={company.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
                                >
                                    <Instagram />
                                </IconButton>
                            )}

                            {company.email && (
                                <IconButton
                                    href={`mailto:${company.email}`}
                                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
                                >
                                    <Email />
                                </IconButton>
                            )}

                            {company.phone && (
                                <IconButton
                                    href={`tel:${company.phone}`}
                                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
                                >
                                    <Phone />
                                </IconButton>
                            )}
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* Main Content */}
            <Container maxWidth="lg" sx={{ mt: 8, mb: 6 }}>
                {/* Tab Navigation */}
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: '16px',
                        overflow: 'hidden',
                        border: '1px solid',
                        borderColor: 'divider',
                        mb: 4,
                        position: 'sticky',
                        top: { md: 80 },
                        zIndex: 10,
                        bgcolor: 'white',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                    }}
                >
                    <Tabs
                        value={currentTab}
                        onChange={handleTabChange}
                        variant="fullWidth"
                        textColor="primary"
                        indicatorColor="primary"
                        sx={{
                            '& .MuiTab-root': {
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '1rem',
                                py: 2
                            }
                        }}
                    >
                        <Tab
                            icon={<Description fontSize="small" />}
                            iconPosition="start"
                            label="Tentang"
                        />
                        <Tab
                            icon={<Work fontSize="small" />}
                            iconPosition="start"
                            label={`Lowongan (${jobCount || 0})`}
                        />
                        <Tab
                            icon={<StarOutlined fontSize="small" />}
                            iconPosition="start"
                            label={`Ulasan (${reviews?.length || 0})`}
                        />
                    </Tabs>
                </Paper>

                {/* About Company */}
                {currentTab === 0 && (
                    <Box>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 4,
                                borderRadius: '16px',
                                mb: 4,
                                border: '1px solid',
                                borderColor: 'divider',
                                background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.paper}fa 100%)`
                            }}
                        >
                            <Typography variant="h5" fontWeight={600} gutterBottom>
                                Tentang {company.name}
                            </Typography>

                            <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                                {company.about || 'Tidak ada informasi tentang perusahaan ini.'}
                            </Typography>
                        </Paper>

                        {/* Company Meta Info */}
                        <Box sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            gap: 3
                        }}>
                            <Box sx={{ width: { xs: '100%', md: '50%' } }}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        borderRadius: '16px',
                                        height: '100%',
                                        border: '1px solid',
                                        borderColor: 'divider'
                                    }}
                                >
                                    <Typography variant="h6" fontWeight={600} gutterBottom>
                                        Informasi Perusahaan
                                    </Typography>

                                    <List disablePadding>
                                        {company.industry && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        p: 1,
                                                        bgcolor: theme.palette.primary.main + '15',
                                                        borderRadius: '10px',
                                                        color: theme.palette.primary.main
                                                    }}
                                                >
                                                    <Business />
                                                </Box>
                                                <Box>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Industri
                                                    </Typography>
                                                    <Typography variant="subtitle1" fontWeight={600}>
                                                        {company.industry}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        )}

                                        {company.size && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        p: 1,
                                                        bgcolor: theme.palette.secondary.main + '15',
                                                        borderRadius: '10px',
                                                        color: theme.palette.secondary.main
                                                    }}
                                                >
                                                    <People />
                                                </Box>
                                                <Box>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Ukuran Perusahaan
                                                    </Typography>
                                                    <Typography variant="subtitle1" fontWeight={600}>
                                                        {company.size}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        )}

                                        {company.founded_year && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        p: 1,
                                                        bgcolor: theme.palette.success.main + '15',
                                                        borderRadius: '10px',
                                                        color: theme.palette.success.main
                                                    }}
                                                >
                                                    <CalendarToday />
                                                </Box>
                                                <Box>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Tahun Berdiri
                                                    </Typography>
                                                    <Typography variant="subtitle1" fontWeight={600}>
                                                        {company.founded_year}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        )}
                                    </List>
                                </Paper>
                            </Box>

                            <Box sx={{ width: { xs: '100%', md: '50%' } }}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        borderRadius: '16px',
                                        height: '100%',
                                        border: '1px solid',
                                        borderColor: 'divider'
                                    }}
                                >
                                    <Typography variant="h6" fontWeight={600} gutterBottom>
                                        Kontak
                                    </Typography>

                                    <List disablePadding>
                                        {company.location && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        p: 1,
                                                        bgcolor: theme.palette.primary.main + '15',
                                                        borderRadius: '10px',
                                                        color: theme.palette.primary.main
                                                    }}
                                                >
                                                    <LocationOn />
                                                </Box>
                                                <Box>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Alamat
                                                    </Typography>
                                                    <Typography variant="subtitle1" fontWeight={600}>
                                                        {company.location}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        )}

                                        {company.website && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        p: 1,
                                                        bgcolor: theme.palette.secondary.main + '15',
                                                        borderRadius: '10px',
                                                        color: theme.palette.secondary.main
                                                    }}
                                                >
                                                    <Language />
                                                </Box>
                                                <Box>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Website
                                                    </Typography>
                                                    <Typography variant="subtitle1" fontWeight={600}>
                                                        <Link
                                                            href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-primary hover:text-primary-dark"
                                                        >
                                                            {formatWebsite(company.website)}
                                                        </Link>
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        )}

                                        {company.email && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        p: 1,
                                                        bgcolor: theme.palette.info.main + '15',
                                                        borderRadius: '10px',
                                                        color: theme.palette.info.main
                                                    }}
                                                >
                                                    <Email />
                                                </Box>
                                                <Box>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Email
                                                    </Typography>
                                                    <Typography variant="subtitle1" fontWeight={600}>
                                                        <Link
                                                            href={`mailto:${company.email}`}
                                                            className="text-primary hover:text-primary-dark"
                                                        >
                                                            {company.email}
                                                        </Link>
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        )}

                                        {company.phone && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        p: 1,
                                                        bgcolor: theme.palette.success.main + '15',
                                                        borderRadius: '10px',
                                                        color: theme.palette.success.main
                                                    }}
                                                >
                                                    <Phone />
                                                </Box>
                                                <Box>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Telepon
                                                    </Typography>
                                                    <Typography variant="subtitle1" fontWeight={600}>
                                                        <Link
                                                            href={`tel:${company.phone}`}
                                                            className="text-primary hover:text-primary-dark"
                                                        >
                                                            {company.phone}
                                                        </Link>
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        )}
                                    </List>
                                </Paper>
                            </Box>
                        </Box>
                    </Box>
                )}

                {/* Job Listings */}
                {currentTab === 1 && (
                    <Box>
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h5" fontWeight={600} gutterBottom>
                                Lowongan Kerja di {company.name}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                {jobCount > 0
                                    ? `Ada ${jobCount} lowongan yang tersedia saat ini.`
                                    : 'Tidak ada lowongan yang tersedia saat ini.'}
                            </Typography>
                        </Box>

                        {company.jobs && company.jobs.length > 0 ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                {company.jobs.map(job => (
                                    <Box key={job.id} sx={{ width: '100%' }}>
                                        <JobCard job={job} />
                                    </Box>
                                ))}
                            </Box>
                        ) : (
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 4,
                                    borderRadius: '16px',
                                    textAlign: 'center',
                                    border: '1px solid',
                                    borderColor: 'divider'
                                }}
                            >
                                <Typography variant="h6">
                                    Tidak ada lowongan tersedia saat ini
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    Silakan cek kembali nanti untuk lowongan baru
                                </Typography>
                            </Paper>
                        )}
                    </Box>
                )}

                {/* Reviews */}
                {currentTab === 2 && (
                    <Box>
                        <CompanyReviews company={company} reviews={reviews} reviewStats={reviewStats} />
                    </Box>
                )}
            </Container>
        </PublicLayout>
    );
}
