import React from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    Container,
    Typography,
    Box,
    Paper,
    Avatar,
    Card,
    CardContent,
    Stack,
    Divider,
    Button,
    Chip,
    alpha,
    useTheme,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Tooltip
} from '@mui/material';
import {
    Business as BusinessIcon,
    Edit as EditIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Public as PublicIcon,
    LocationOn as LocationOnIcon,
    Category as CategoryIcon,
    Work as WorkIcon,
    Description as DescriptionIcon,
    CalendarMonth as CalendarMonthIcon,
    Person as PersonIcon,
    VerifiedUser as VerifiedUserIcon,
    Star as StarIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Layout from "@/Components/Layout/Layout.jsx";

// Stat card component
const StatCard = ({ icon, title, value, color }) => {
    const theme = useTheme();
    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                borderRadius: '0.75rem',
                border: '1px solid',
                borderColor: alpha(color, 0.2),
                background: `linear-gradient(135deg, rgba(255,255,255,1) 0%, ${alpha(color, 0.03)} 100%)`,
                height: '100%',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.05)'
                }
            }}
        >
            <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                    sx={{
                        width: 56,
                        height: 56,
                        borderRadius: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: alpha(color, 0.1),
                        color: color
                    }}
                >
                    {icon}
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h3" fontWeight="bold" color={color}>
                        {value}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        {title}
                    </Typography>
                </Box>
            </Stack>
        </Paper>
    );
};

// Application item component
const ApplicationItem = ({ application }) => {
    const theme = useTheme();
    
    return (
        <ListItem
            sx={{
                p: 2,
                mb: 1,
                borderRadius: '0.75rem',
                '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.05)
                }
            }}
        >
            <ListItemAvatar>
                <Avatar
                    src={application.user.avatar}
                    alt={application.user.name}
                    sx={{
                        width: 40,
                        height: 40,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main
                    }}
                >
                    {!application.user.avatar && application.user.name?.charAt(0).toUpperCase()}
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="body1" fontWeight="medium">
                            {application.user.name}
                        </Typography>
                        <Chip
                            label={application.status.name}
                            size="small"
                            sx={{ 
                                borderRadius: '0.5rem',
                                bgcolor: alpha(application.status.color, 0.1),
                                color: application.status.color,
                                border: '1px solid',
                                borderColor: alpha(application.status.color, 0.2),
                            }}
                        />
                    </Box>
                }
                secondary={
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                        <WorkIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                            {application.job.title}
                        </Typography>
                        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
                        <Typography variant="body2" color="text.secondary">
                            {application.created_at}
                        </Typography>
                    </Stack>
                }
            />
        </ListItem>
    );
};

const CompanyProfilePage = ({ company, stats, recentApplications, managers }) => {
    const theme = useTheme();

    return (
        <Layout>
            <Head title="Profil Perusahaan" />
            
            <Container maxWidth="lg">
                <Box sx={{ py: 4 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, mb: 4, alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="h4" component="h1" fontWeight="bold" color="primary.main">
                                Profil Perusahaan
                            </Typography>
                            <Button 
                                component={Link} 
                                href={route('manager.company-profile.edit')} 
                                variant="outlined" 
                                startIcon={<EditIcon />}
                                sx={{ mt: { xs: 2, md: 0 } }}
                            >
                                Edit Profil Perusahaan
                            </Button>
                        </Box>
                    </motion.div>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(12, 1fr)' }, gap: 3 }}>
                        {/* Company Info */}
                        <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 4' } }}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                            >
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        borderRadius: '1rem',
                                        border: '1px solid',
                                        borderColor: alpha(theme.palette.primary.main, 0.1),
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Avatar
                                        src={company.logo}
                                        alt={company.name}
                                        variant="rounded"
                                        sx={{
                                            width: 120,
                                            height: 120,
                                            mb: 2,
                                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                                            color: theme.palette.primary.main,
                                            fontSize: '3rem',
                                            borderRadius: '1rem'
                                        }}
                                    >
                                        {!company.logo && <BusinessIcon sx={{ fontSize: '3rem' }} />}
                                    </Avatar>
                                    
                                    <Typography variant="h5" fontWeight="bold" textAlign="center">
                                        {company.name}
                                    </Typography>
                                    
                                    <Chip 
                                        label={company.is_active ? 'Aktif' : 'Tidak Aktif'} 
                                        color={company.is_active ? 'success' : 'error'} 
                                        size="small" 
                                        sx={{ mt: 1, mb: 3, borderRadius: '0.5rem' }} 
                                    />
                                    
                                    <Stack spacing={2} sx={{ width: '100%' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                            <CategoryIcon sx={{ mr: 1.5, color: 'text.secondary', mt: 0.5 }} />
                                            <Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    Industri
                                                </Typography>
                                                <Typography variant="body1">
                                                    {company.industry || 'Tidak Ditentukan'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        
                                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                            <EmailIcon sx={{ mr: 1.5, color: 'text.secondary', mt: 0.5 }} />
                                            <Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    Email
                                                </Typography>
                                                <Typography variant="body1">
                                                    {company.email || 'Tidak Ditentukan'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        
                                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                            <PhoneIcon sx={{ mr: 1.5, color: 'text.secondary', mt: 0.5 }} />
                                            <Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    Telepon
                                                </Typography>
                                                <Typography variant="body1">
                                                    {company.phone || 'Tidak Ditentukan'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        
                                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                            <PublicIcon sx={{ mr: 1.5, color: 'text.secondary', mt: 0.5 }} />
                                            <Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    Website
                                                </Typography>
                                                <Typography variant="body1">
                                                    {company.website ? (
                                                        <Link href={company.website} target="_blank" rel="noopener noreferrer">
                                                            {company.website}
                                                        </Link>
                                                    ) : (
                                                        'Tidak Ditentukan'
                                                    )}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        
                                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                            <LocationOnIcon sx={{ mr: 1.5, color: 'text.secondary', mt: 0.5 }} />
                                            <Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    Alamat
                                                </Typography>
                                                <Typography variant="body1">
                                                    {company.address || 'Tidak Ditentukan'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        
                                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                            <CalendarMonthIcon sx={{ mr: 1.5, color: 'text.secondary', mt: 0.5 }} />
                                            <Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    Tanggal Bergabung
                                                </Typography>
                                                <Typography variant="body1">
                                                    {company.created_at}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Stack>
                                </Paper>
                            </motion.div>
                        </Box>

                        {/* Middle Section - Stats & Description */}
                        <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 8' } }}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                {/* Stats */}
                                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2, mb: 3 }}>
                                    <Box>
                                        <StatCard
                                            icon={<WorkIcon sx={{ fontSize: 28 }} />}
                                            title="Lowongan"
                                            value={stats.totalJobs}
                                            color={theme.palette.primary.main}
                                        />
                                    </Box>
                                    <Box>
                                        <StatCard
                                            icon={<PersonIcon sx={{ fontSize: 28 }} />}
                                            title="Lamaran"
                                            value={stats.totalApplications}
                                            color={theme.palette.success.main}
                                        />
                                    </Box>
                                    <Box>
                                        <StatCard
                                            icon={<CalendarMonthIcon sx={{ fontSize: 28 }} />}
                                            title="Acara"
                                            value={stats.totalEvents}
                                            color={theme.palette.warning.main}
                                        />
                                    </Box>
                                </Box>

                                {/* Description */}
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        borderRadius: '1rem',
                                        border: '1px solid',
                                        borderColor: alpha(theme.palette.primary.main, 0.1),
                                        mb: 3
                                    }}
                                >
                                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <DescriptionIcon color="primary" />
                                            <span>Deskripsi Perusahaan</span>
                                        </Stack>
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" paragraph>
                                        {company.description || 'Tidak ada deskripsi yang tersedia.'}
                                    </Typography>
                                </Paper>

                                {/* Recent Applications */}
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        borderRadius: '1rem',
                                        border: '1px solid',
                                        borderColor: alpha(theme.palette.primary.main, 0.1)
                                    }}
                                >
                                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <WorkIcon color="primary" />
                                            <span>Lamaran Terbaru</span>
                                        </Stack>
                                    </Typography>
                                    {recentApplications.length > 0 ? (
                                        <List sx={{ p: 0 }}>
                                            {recentApplications.map(application => (
                                                <ApplicationItem key={application.id} application={application} />
                                            ))}
                                        </List>
                                    ) : (
                                        <Box
                                            sx={{
                                                p: 3,
                                                textAlign: 'center',
                                                bgcolor: alpha(theme.palette.primary.main, 0.03),
                                                borderRadius: '0.75rem'
                                            }}
                                        >
                                            <Typography color="text.secondary">
                                                Belum ada lamaran yang masuk.
                                            </Typography>
                                        </Box>
                                    )}
                                </Paper>
                            </motion.div>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Layout>
    );
};

export default CompanyProfilePage;
