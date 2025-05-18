import React, { useState } from 'react';
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
    TextField,
    InputAdornment,
    alpha,
    useTheme,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Tooltip,
    useMediaQuery
} from '@mui/material';
import {
    Search as SearchIcon,
    Visibility as VisibilityIcon,
    Business as BusinessIcon,
    Badge as BadgeIcon,
    Email as EmailIcon,
    Star as StarIcon,
    FilterList as FilterListIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Layout from "@/Components/Layout/Layout.jsx";

const TeamPage = ({ teamMembers, companies }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCompany, setFilteredCompany] = useState('');
    
    // Filter team members based on search term and selected company
    const filteredTeamMembers = teamMembers.filter((member) => {
        const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             member.email.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCompany = filteredCompany ? 
            member.company.id.toString() === filteredCompany : 
            true;
            
        return matchesSearch && matchesCompany;
    });

    return (
        <Layout>
            <Head title="Tim Manajemen" />
            
            <Container maxWidth="lg">
                <Box sx={{ py: 4 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Box 
                            sx={{ 
                                display: 'flex', 
                                flexDirection: { xs: 'column', md: 'row' }, 
                                mb: 4, 
                                alignItems: 'center', 
                                justifyContent: 'space-between' 
                            }}
                        >
                            <Typography 
                                variant="h4" 
                                component="h1" 
                                fontWeight="bold" 
                                color="primary.main" 
                                sx={{ 
                                    mb: { xs: 2, md: 0 },
                                    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}
                            >
                                Tim Manajemen
                            </Typography>
                        </Box>
                        
                        <Box 
                            sx={{ 
                                display: 'flex', 
                                flexDirection: { xs: 'column', md: 'row' }, 
                                gap: 2, 
                                mb: 4 
                            }}
                        >
                            <Box sx={{ flex: 1 }}>
                                <TextField
                                    fullWidth
                                    placeholder="Cari anggota tim..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                        sx: {
                                            borderRadius: '10px',
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: alpha(theme.palette.primary.main, 0.2),
                                            },
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                borderColor: alpha(theme.palette.primary.main, 0.5),
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: theme.palette.primary.main,
                                            }
                                        }
                                    }}
                                    sx={{ 
                                        bgcolor: 'background.paper', 
                                        borderRadius: '10px',
                                        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                                    }}
                                />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <TextField
                                    select
                                    fullWidth
                                    SelectProps={{
                                        native: true,
                                    }}
                                    label="Filter Perusahaan"
                                    value={filteredCompany}
                                    onChange={(e) => setFilteredCompany(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <FilterListIcon />
                                            </InputAdornment>
                                        ),
                                        sx: {
                                            borderRadius: '10px',
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: alpha(theme.palette.primary.main, 0.2),
                                            },
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                borderColor: alpha(theme.palette.primary.main, 0.5),
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: theme.palette.primary.main,
                                            }
                                        }
                                    }}
                                    sx={{ 
                                        bgcolor: 'background.paper', 
                                        borderRadius: '10px',
                                        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                                    }}
                                >
                                    <option value="">Semua Perusahaan</option>
                                    {companies.map((company) => (
                                        <option key={company.id} value={company.id}>
                                            {company.name}
                                        </option>
                                    ))}
                                </TextField>
                            </Box>
                        </Box>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                borderRadius: '1.25rem',
                                border: '1px solid',
                                borderColor: alpha(theme.palette.primary.main, 0.1),
                                overflow: 'hidden',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                '&:hover': {
                                    boxShadow: '0 12px 28px rgba(0,0,0,0.08)',
                                }
                            }}
                        >
                            {isMobile ? (
                                // Mobile view - card list
                                <Box>
                                    {filteredTeamMembers.length > 0 ? (
                                        filteredTeamMembers.map((member) => (
                                            <Box 
                                                key={member.id}
                                                sx={{ 
                                                    p: 3, 
                                                    borderBottom: '1px solid',
                                                    borderColor: alpha(theme.palette.primary.main, 0.1),
                                                    '&:last-child': {
                                                        borderBottom: 'none',
                                                    },
                                                    transition: 'all 0.2s ease',
                                                    '&:hover': {
                                                        bgcolor: alpha(theme.palette.primary.main, 0.02),
                                                    }
                                                }}
                                            >
                                                <Stack direction="row" spacing={2} alignItems="center">
                                                    <Avatar 
                                                        src={member.avatar} 
                                                        alt={member.name}
                                                        sx={{ 
                                                            width: 60, 
                                                            height: 60,
                                                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                            color: theme.palette.primary.main,
                                                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                                            border: '2px solid',
                                                            borderColor: alpha(theme.palette.primary.main, 0.2),
                                                        }}
                                                    >
                                                        {!member.avatar && member.name?.charAt(0).toUpperCase()}
                                                    </Avatar>
                                                    <Box sx={{ flexGrow: 1 }}>
                                                        <Typography variant="subtitle1" fontWeight="bold">
                                                            {member.name}
                                                            {member.is_primary && (
                                                                <StarIcon 
                                                                    sx={{ 
                                                                        ml: 0.5, 
                                                                        fontSize: 16, 
                                                                        color: theme.palette.warning.main,
                                                                        verticalAlign: 'text-bottom'
                                                                    }} 
                                                                />
                                                            )}
                                                        </Typography>
                                                        <Typography 
                                                            variant="body2" 
                                                            color="text.secondary" 
                                                            sx={{ 
                                                                display: 'flex', 
                                                                alignItems: 'center', 
                                                                gap: 0.5,
                                                                mb: 1 
                                                            }}
                                                        >
                                                            <EmailIcon fontSize="small" />
                                                            {member.email}
                                                        </Typography>
                                                        <Stack direction="row" spacing={1} alignItems="center">
                                                            <Chip 
                                                                size="small" 
                                                                label={member.role?.name || "Manager"}
                                                                color="primary"
                                                                sx={{ 
                                                                    borderRadius: '0.5rem',
                                                                    fontWeight: 'medium' 
                                                                }}
                                                            />
                                                            <Typography 
                                                                variant="body2" 
                                                                color="text.secondary"
                                                                sx={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: 0.5
                                                                }}
                                                            >
                                                                <BusinessIcon fontSize="small" />
                                                                {member.company.name}
                                                            </Typography>
                                                        </Stack>
                                                    </Box>
                                                    <Button
                                                        component={Link}
                                                        href={route('manager.team.show', member.id)}
                                                        size="small"
                                                        variant="outlined"
                                                        startIcon={<VisibilityIcon />}
                                                        sx={{
                                                            borderRadius: '8px',
                                                            borderColor: alpha(theme.palette.primary.main, 0.3),
                                                            '&:hover': {
                                                                borderColor: theme.palette.primary.main,
                                                                backgroundColor: alpha(theme.palette.primary.main, 0.05)
                                                            },
                                                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                                            transition: 'all 0.2s ease',
                                                        }}
                                                    >
                                                        Detail
                                                    </Button>
                                                </Stack>
                                            </Box>
                                        ))
                                    ) : (
                                        <Box 
                                            sx={{ 
                                                p: 4, 
                                                textAlign: 'center',
                                                bgcolor: alpha(theme.palette.primary.light, 0.05),
                                            }}
                                        >
                                            <Typography variant="subtitle1" color="text.secondary">
                                                Tidak ada anggota tim yang ditemukan
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            ) : (
                                // Desktop view - table
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.03) }}>
                                                <TableCell sx={{ py: 2 }}>Nama</TableCell>
                                                <TableCell sx={{ py: 2 }}>Email</TableCell>
                                                <TableCell sx={{ py: 2 }}>Jabatan</TableCell>
                                                <TableCell sx={{ py: 2 }}>Perusahaan</TableCell>
                                                <TableCell sx={{ py: 2 }} align="center">Aksi</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {filteredTeamMembers.length > 0 ? (
                                                filteredTeamMembers.map((member) => (
                                                    <TableRow 
                                                        key={member.id} 
                                                        hover
                                                        sx={{ 
                                                            '&:hover': { 
                                                                bgcolor: alpha(theme.palette.primary.main, 0.02),
                                                            },
                                                            transition: 'background-color 0.2s'
                                                        }}
                                                    >
                                                        <TableCell>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                                <Avatar 
                                                                    src={member.avatar} 
                                                                    alt={member.name}
                                                                    sx={{ 
                                                                        width: 40, 
                                                                        height: 40,
                                                                        border: '2px solid',
                                                                        borderColor: alpha(theme.palette.primary.main, 0.2),
                                                                    }}
                                                                >
                                                                    {!member.avatar && member.name?.charAt(0).toUpperCase()}
                                                                </Avatar>
                                                                <Typography variant="body1" fontWeight="medium">
                                                                    {member.name} 
                                                                    {member.is_primary && (
                                                                        <Tooltip title="Akun Utama">
                                                                            <StarIcon 
                                                                                sx={{ 
                                                                                    ml: 0.5, 
                                                                                    fontSize: 16, 
                                                                                    color: theme.palette.warning.main,
                                                                                    verticalAlign: 'text-bottom'
                                                                                }} 
                                                                            />
                                                                        </Tooltip>
                                                                    )}
                                                                </Typography>
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography 
                                                                variant="body2" 
                                                                color="text.secondary"
                                                                sx={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: 0.5
                                                                }}
                                                            >
                                                                <EmailIcon fontSize="small" />
                                                                {member.email}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Chip 
                                                                size="small" 
                                                                label={member.role?.name || "Manager"}
                                                                color="primary"
                                                                sx={{ 
                                                                    borderRadius: '0.5rem',
                                                                    fontWeight: 'medium'
                                                                }}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography 
                                                                variant="body2"
                                                                sx={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: 0.5
                                                                }}
                                                            >
                                                                <BusinessIcon fontSize="small" color="action" />
                                                                {member.company.name}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <Button
                                                                component={Link}
                                                                href={route('manager.team.show', member.id)}
                                                                size="small"
                                                                variant="outlined"
                                                                startIcon={<VisibilityIcon />}
                                                                sx={{
                                                                    borderRadius: '8px',
                                                                    borderColor: alpha(theme.palette.primary.main, 0.3),
                                                                    '&:hover': {
                                                                        borderColor: theme.palette.primary.main,
                                                                        backgroundColor: alpha(theme.palette.primary.main, 0.05)
                                                                    },
                                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                                                    transition: 'all 0.2s ease',
                                                                }}
                                                            >
                                                                Detail
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                                        <Typography variant="subtitle1" color="text.secondary">
                                                            Tidak ada anggota tim yang ditemukan
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </Paper>
                    </motion.div>
                </Box>
            </Container>
        </Layout>
    );
};

export default TeamPage;
