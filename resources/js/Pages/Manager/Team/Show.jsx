import React from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    Container,
    Typography,
    Box,
    Paper,
    Avatar,
    Stack,
    Divider,
    Chip,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    alpha,
    useTheme, Tooltip
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Email as EmailIcon,
    Person as PersonIcon,
    Business as BusinessIcon,
    Star as StarIcon,
    Edit as EditIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Layout from "@/Components/Layout/Layout.jsx";

const TeamMemberPage = ({ teamMember }) => {
    const theme = useTheme();

    return (
        <Layout>
            <Head title={`Tim - ${teamMember.name}`} />

            <Container maxWidth="lg">
                <Box sx={{ py: 4 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Box sx={{ display: 'flex', mb: 4, alignItems: 'center' }}>
                            <Button
                                component={Link}
                                href={route('manager.team.index')}
                                startIcon={<ArrowBackIcon />}
                                sx={{ mr: 2 }}
                            >
                                Kembali
                            </Button>
                            <Typography variant="h4" component="h1" fontWeight="bold" color="primary.main">
                                Detail Anggota Tim
                            </Typography>
                            {!teamMember.is_current_user && (
                                <Button
                                    component={Link}
                                    href={route('manager.team.edit', teamMember.id)}
                                    startIcon={<EditIcon />}
                                    variant="outlined"
                                    sx={{ ml: 'auto' }}
                                >
                                    Edit
                                </Button>
                            )}
                        </Box>
                    </motion.div>

                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                        {/* Profile Card */}
                        <Box sx={{ width: { xs: '100%', md: '33.333%' } }}>
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
                                        src={teamMember.avatar}
                                        alt={teamMember.name}
                                        sx={{
                                            width: 120,
                                            height: 120,
                                            mb: 2,
                                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                                            color: theme.palette.primary.main,
                                            fontSize: '3rem'
                                        }}
                                    >
                                        {!teamMember.avatar && teamMember.name?.charAt(0).toUpperCase()}
                                    </Avatar>

                                    <Typography variant="h5" fontWeight="bold" textAlign="center">
                                        {teamMember.name}
                                        {teamMember.is_current_user && (
                                            <Chip
                                                label="Anda"
                                                color="success"
                                                size="small"
                                                sx={{ ml: 1, borderRadius: '0.5rem' }}
                                            />
                                        )}
                                    </Typography>

                                    <Chip
                                        label={teamMember.role?.name || "Manager"}
                                        color="primary"
                                        size="small"
                                        sx={{ mt: 1, mb: 2, borderRadius: '0.5rem' }}
                                    />

                                    <Stack spacing={1.5} sx={{ width: '100%', mt: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <EmailIcon sx={{ mr: 1.5, color: 'text.secondary' }} />
                                            <Typography variant="body1">{teamMember.email}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <PersonIcon sx={{ mr: 1.5, color: 'text.secondary' }} />
                                            <Typography variant="body1">
                                                {teamMember.is_current_user ? 'Anda' : 'Anggota Tim'}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Paper>
                            </motion.div>
                        </Box>

                        {/* Perusahaan yang Dikelola */}
                        <Box sx={{ width: { xs: '100%', md: '66.667%' } }}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        borderRadius: '1rem',
                                        border: '1px solid',
                                        borderColor: alpha(theme.palette.primary.main, 0.1),
                                        height: '100%',
                                    }}
                                >
                                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                                        Perusahaan yang Dikelola
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />

                                    {teamMember.companies && teamMember.companies.length > 0 ? (
                                        <List>
                                            {teamMember.companies.map((company) => (
                                                <ListItem
                                                    key={company.id}
                                                    sx={{
                                                        mb: 1,
                                                        borderRadius: '0.75rem',
                                                        '&:hover': {
                                                            bgcolor: alpha(theme.palette.primary.main, 0.05)
                                                        }
                                                    }}
                                                >
                                                    <ListItemAvatar>
                                                        <Avatar
                                                            src={company.logo}
                                                            alt={company.name}
                                                            sx={{
                                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                                color: theme.palette.primary.main
                                                            }}
                                                        >
                                                            <BusinessIcon />
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={
                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <Typography variant="body1" fontWeight="medium">
                                                                    {company.name}
                                                                </Typography>
                                                                {company.is_primary && (
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                                                                        <Chip
                                                                            label="Utama"
                                                                            size="small"
                                                                            color="primary"
                                                                            sx={{ borderRadius: '0.5rem' }}
                                                                        />
                                                                        <Tooltip title="Manager Utama">
                                                                            <StarIcon sx={{ ml: 0.5, color: theme.palette.warning.main }} />
                                                                        </Tooltip>
                                                                    </Box>
                                                                )}
                                                            </Box>
                                                        }
                                                    />
                                                    <Button
                                                        component={Link}
                                                        href={route('manager.company-profile.index')}
                                                        size="small"
                                                        sx={{ ml: 1 }}
                                                    >
                                                        Lihat
                                                    </Button>
                                                </ListItem>
                                            ))}
                                        </List>
                                    ) : (
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
                                            <BusinessIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                                            <Typography variant="body1" color="text.secondary" align="center">
                                                Tidak ada perusahaan yang dikelola.
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

export default TeamMemberPage;
