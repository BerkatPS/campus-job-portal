import React, { useState, useEffect } from 'react';
import { Link, usePage, useForm } from '@inertiajs/react';
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Container,
    IconButton,
    Divider,
    Drawer,
    useScrollTrigger,
    Slide,
    Avatar,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Stack,
    Tooltip,
    alpha,
    useTheme,
    useMediaQuery,
    Paper
} from '@mui/material';
import {
    Menu as MenuIcon,
    KeyboardArrowDown,
    Login as LoginIcon,
    PersonAdd as PersonAddIcon,
    Dashboard as DashboardIcon,
    Logout as LogoutIcon,
    Home as HomeIcon,
    Business as BusinessIcon,
    ContactPhone as ContactPhoneIcon,
    Close as CloseIcon,
    Forum as ForumIcon,
    Work
} from '@mui/icons-material';
import Footer from './Footer';
import { motion } from 'framer-motion';
import Button from '../Shared/Button';
import CustomBadge from '../Shared/Badge';
import Dropdown from '../Shared/Dropdown';
import SearchBar from '../Shared/SearchBar';
import Modal from '../Shared/Modal';
import Spinner from '../Shared/Spinner';
import MuiThemeProvider from '@/Theme/MuiThemeProvider';

// Hide appbar on scroll
function HideOnScroll(props) {
    const { children } = props;
    const trigger = useScrollTrigger();

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
}

const PublicLayout = ({ children }) => {
    const { auth } = usePage().props;
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
    const { post } = useForm();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("");
    const [notificationCount, setNotificationCount] = useState(0);
    const [searchOpen, setSearchOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (auth?.user) {
            setNotificationCount(3); // Ganti dengan data sebenarnya dari API
        }

        const handleScroll = () => {
            const isScrolled = window.scrollY > 20;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { threshold: 0.5 }
        );

        document.querySelectorAll('section[id]').forEach((section) => {
            observer.observe(section);
        });

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            observer.disconnect();
        };
    }, [scrolled, auth]);

    const handleProfileMenuOpen = (event) => {
        setProfileMenuAnchor(event.currentTarget);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const handleSearch = (query) => {
        setLoading(true);
        // Implementasi pencarian
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    };

    const handleLogout = () => {
        post(route('logout'));
    };

    const menuItems = [
        { text: 'Beranda', route: 'public.home', icon: <HomeIcon /> },
        { text: 'Lowongan', route: 'public.jobs.index', icon: <Work /> },
        ...(auth?.user?.role_id === 3 || auth?.user?.role === 1 ? [
            { text: 'Forum', route: 'public.forum.index', icon: <ForumIcon />, badge: auth?.user?.role === 'candidate' ? 'New' : null }
        ] : []),
        { text: 'Perusahaan', route: 'public.companies.index', icon: <BusinessIcon/> },
        { text: 'Kontak', route: 'public.contact', icon: <ContactPhoneIcon /> },
    ];

    const userDashboardRoute = () => {
        if (auth.user) {
            if (auth.user.role_id === 1) {
                return 'admin.dashboard';
            } else if (auth.user.role_id === 2) {
                return 'manager.dashboard';
            } else {
                return 'candidate.dashboard';
            }
        }
        return 'login';
    };

    return (
        <MuiThemeProvider>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <HideOnScroll>
                    <AppBar
                        position="fixed"
                        color="default"
                        elevation={0}
                        sx={{
                            background: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.8)',
                            backdropFilter: 'blur(10px)',
                            borderBottom: scrolled ? '1px solid rgba(0, 0, 0, 0.05)' : 'none',
                            transition: 'all 0.3s ease-in-out',
                            color: theme.palette.text.primary,
                            boxShadow: scrolled ? '0 4px 20px rgba(0, 0, 0, 0.04)' : 'none',
                        }}
                    >
                        <Container maxWidth="xl">
                            <Toolbar sx={{ minHeight: { xs: '4rem', md: '4.5rem' }, p: { xs: 1, sm: 2 } }}>
                                <Link href={route('public.home')} className="flex items-center mr-6">
                                    <Box
                                        sx={{
                                            backgroundImage: `url('images/stia.png')`,
                                            backgroundSize: 'cover',
                                            display: { xs: 'none', sm: 'flex' },
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            bgcolor: 'rgba(0, 0, 0, 0.04)',
                                            color: theme.palette.text.primary,
                                            p: 1.5,
                                            borderRadius: 2,
                                            mr: 1.5
                                        }}
                                    >
                                    </Box>
                                    <Typography
                                        variant="h6"
                                        component="div"
                                        sx={{
                                            fontWeight: 600,
                                            letterSpacing: '-0.5px',
                                            display: { xs: 'none', sm: 'block' },
                                            color: theme.palette.text.primary
                                        }}
                                    >
                                        STIA Bayu Angga<Box component="span" sx={{ opacity: 0.7 }}> Loker</Box>
                                    </Typography>
                                </Link>

                                {/* Desktop menu */}
                                <Box sx={{
                                    display: { xs: 'none', md: 'flex' },
                                    gap: 1,
                                    mx: 'auto'
                                }}>
                                    {menuItems.map((item) => (
                                        <motion.div
                                            key={item.text}
                                            whileHover={{ y: -1 }}
                                            transition={{ type: 'spring', stiffness: 300 }}
                                        >
                                            <Link href={route(item.route)}>
                                                <Button
                                                    variant="text"
                                                    sx={{
                                                        px: 2,
                                                        py: 1,
                                                        borderRadius: '10px',
                                                        color: route().current(item.route) ?
                                                            theme.palette.text.primary :
                                                            theme.palette.text.secondary,
                                                        bgcolor: route().current(item.route) ?
                                                            'rgba(0, 0, 0, 0.04)' :
                                                            'transparent',
                                                        fontWeight: route().current(item.route) ? 500 : 400,
                                                        '&:hover': {
                                                            bgcolor: 'rgba(0, 0, 0, 0.04)'
                                                        }
                                                    }}
                                                    startIcon={
                                                        <Box sx={{
                                                            color: route().current(item.route) ?
                                                                theme.palette.text.primary :
                                                                theme.palette.text.secondary,
                                                            opacity: route().current(item.route) ? 1 : 0.7
                                                        }}>
                                                            {item.icon}
                                                        </Box>
                                                    }
                                                >
                                                    {item.text}
                                                    {item.badge && (
                                                        <CustomBadge
                                                            labe={item.badge}
                                                            color="error"
                                                            size="small"
                                                            sx={{ ml: 1 }}
                                                        />
                                                    )}
                                                </Button>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </Box>

                                <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {auth.user ? (
                                        <>
                                            <Tooltip title="Notifikasi">
                                                <IconButton
                                                    sx={{
                                                        color: theme.palette.text.secondary,
                                                        borderRadius: '10px',
                                                        '&:hover': {
                                                            bgcolor: 'rgba(0, 0, 0, 0.04)'
                                                        }
                                                    }}
                                                >

                                                </IconButton>
                                            </Tooltip>

                                            <Box>
                                                <Dropdown
                                                    buttonType="icon"
                                                    position="bottom-right"
                                                    trigger={
                                                        <Button
                                                            onClick={handleProfileMenuOpen}
                                                            variant="text"
                                                            sx={{
                                                                borderRadius: '10px',
                                                                px: { xs: 1, sm: 2 },
                                                                py: 1,
                                                                color: theme.palette.text.primary,
                                                                '&:hover': {
                                                                    bgcolor: 'rgba(0, 0, 0, 0.04)'
                                                                }
                                                            }}
                                                            endIcon={!isSmall && <KeyboardArrowDown sx={{ color: theme.palette.text.secondary }} />}
                                                        >
                                                            <Avatar
                                                                src={auth.user.profile_photo || undefined}
                                                                alt={auth.user.name}
                                                                sx={{
                                                                    width: 32,
                                                                    height: 32,
                                                                    mr: { xs: 0, sm: 1 },
                                                                    bgcolor: 'rgba(0, 0, 0, 0.08)'
                                                                }}
                                                            >
                                                                {auth.user.name?.charAt(0)}
                                                            </Avatar>
                                                            <Box component="span" sx={{
                                                                fontWeight: 500,
                                                                display: { xs: 'none', sm: 'inline' },
                                                                maxWidth: '120px',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap'
                                                            }}>
                                                                {auth.user.name}
                                                            </Box>
                                                        </Button>
                                                    }
                                                    items={[
                                                        {
                                                            label: auth.user.name,
                                                            disabled: true,
                                                            fontWeight: 'bold'
                                                        },
                                                        {
                                                            label: auth.user.email,
                                                            disabled: true,
                                                            color: 'text.secondary'
                                                        },
                                                        { divider: true },
                                                        {
                                                            label: 'Dashboard',
                                                            icon: <DashboardIcon fontSize="small" />,
                                                            onClick: () => {
                                                                window.location.href = route(userDashboardRoute());
                                                            }
                                                        },
                                                        { divider: true },
                                                        {
                                                            label: 'Logout',
                                                            icon: <LogoutIcon fontSize="small" />,
                                                            onClick: handleLogout
                                                        }
                                                    ]}
                                                />
                                            </Box>
                                        </>
                                    ) : (
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <motion.div whileHover={{ scale: 1.02 }}>
                                                <Link href={route('login')}>
                                                    <Button
                                                        variant="text"
                                                        sx={{
                                                            display: { xs: 'none', sm: 'inline-flex' },
                                                            borderRadius: '10px',
                                                            px: 2,
                                                            py: 1,
                                                            color: theme.palette.text.primary,
                                                            bgcolor: 'transparent',
                                                            '&:hover': {
                                                                bgcolor: 'rgba(0, 0, 0, 0.04)'
                                                            }
                                                        }}
                                                        startIcon={<LoginIcon />}
                                                    >
                                                        Login
                                                    </Button>
                                                </Link>
                                            </motion.div>

                                            <motion.div whileHover={{ scale: 1.02 }}>
                                                <Link href={route('register')}>
                                                    <Button
                                                        variant="contained"
                                                        sx={{
                                                            borderRadius: '10px',
                                                            px: { xs: 2, sm: 3 },
                                                            py: 1,
                                                            bgcolor: 'rgba(0, 0, 0, 0.8)',
                                                            color: '#fff',
                                                            '&:hover': {
                                                                bgcolor: 'rgba(0, 0, 0, 0.7)'
                                                            }
                                                        }}
                                                        startIcon={<PersonAddIcon />}
                                                    >
                                                        {isSmall ? '' : 'Register'}
                                                    </Button>
                                                </Link>
                                            </motion.div>
                                        </Box>
                                    )}

                                    {/* Mobile menu button */}
                                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                                        <IconButton
                                            aria-label="menu"
                                            onClick={toggleMobileMenu}
                                            sx={{
                                                color: theme.palette.text.primary,
                                                borderRadius: '10px',
                                                '&:hover': {
                                                    bgcolor: 'rgba(0, 0, 0, 0.04)'
                                                }
                                            }}
                                        >
                                            <MenuIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </Toolbar>
                        </Container>
                    </AppBar>
                </HideOnScroll>

                {/* Search Modal */}
                <Modal
                    open={searchOpen}
                    onClose={() => setSearchOpen(false)}
                    title="Cari"
                    maxWidth="md"
                    fullWidth
                >
                    <Box sx={{ p: 2 }}>
                        <SearchBar
                            onSearch={handleSearch}
                            placeholder="Cari lowongan, perusahaan, atau lokasi..."
                            fullWidth
                        />
                        {loading && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                                <Spinner size={40} />
                            </Box>
                        )}
                    </Box>
                </Modal>

                {/* Mobile drawer menu */}
                <Drawer
                    anchor="right"
                    open={mobileMenuOpen}
                    onClose={toggleMobileMenu}
                    sx={{
                        '& .MuiDrawer-paper': {
                            width: '85%',
                            maxWidth: '360px'
                        }
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box
                                    sx={{
                                        backgroundImage: `url('images/stia.png')`,
                                        backgroundSize: 'cover',
                                        display: { xs: 'none', sm: 'flex' },
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        bgcolor: 'rgba(0, 0, 0, 0.04)',
                                        color: theme.palette.text.primary,
                                        p: 1,
                                        borderRadius: 1.5,
                                        mr: 1.5,
                                    }}
                                >
                                    <BusinessIcon fontSize="small" />
                                </Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    STIA Bayu Angga
                                </Typography>
                            </Box>
                            <IconButton
                                onClick={toggleMobileMenu}
                                edge="end"
                                sx={{
                                    color: theme.palette.text.secondary,
                                    borderRadius: '10px',
                                    '&:hover': {
                                        bgcolor: 'rgba(0, 0, 0, 0.04)'
                                    }
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Box>

                        <Divider sx={{ opacity: 0.6 }} />

                        {auth.user && (
                            <Box sx={{ p: 3 }}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 2.5,
                                        bgcolor: 'rgba(0, 0, 0, 0.02)',
                                        borderRadius: 3,
                                        border: '1px solid rgba(0, 0, 0, 0.05)'
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar
                                            src={auth.user.profile_photo || undefined}
                                            alt={auth.user.name}
                                            sx={{
                                                width: 44,
                                                height: 44,
                                                bgcolor: 'rgba(0, 0, 0, 0.08)'
                                            }}
                                        >
                                            {auth.user.name?.charAt(0)}
                                        </Avatar>
                                        <Box sx={{ flex: 1, overflow: 'hidden' }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
                                                {auth.user.name}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {auth.user.email}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Stack direction="row" spacing={1.5} sx={{ mt: 2.5 }}>
                                        <Link href={route(userDashboardRoute())} className="flex-1">
                                            <Button
                                                variant="outlined"
                                                fullWidth
                                                sx={{
                                                    borderRadius: '10px',
                                                    py: 1,
                                                    borderColor: 'rgba(0, 0, 0, 0.2)',
                                                    color: theme.palette.text.primary,
                                                    '&:hover': {
                                                        borderColor: 'rgba(0, 0, 0, 0.3)',
                                                        bgcolor: 'rgba(0, 0, 0, 0.02)'
                                                    }
                                                }}
                                                startIcon={<DashboardIcon fontSize="small" />}
                                            >
                                                Dashboard
                                            </Button>
                                        </Link>
                                        <Link href="#" onClick={handleLogout} className="flex-1">
                                            <Button
                                                variant="outlined"
                                                fullWidth
                                                sx={{
                                                    borderRadius: '10px',
                                                    py: 1,
                                                    borderColor: 'rgba(0, 0, 0, 0.12)',
                                                    color: theme.palette.error.main,
                                                    '&:hover': {
                                                        borderColor: theme.palette.error.main,
                                                        bgcolor: alpha(theme.palette.error.main, 0.04)
                                                    }
                                                }}
                                                startIcon={<LogoutIcon fontSize="small" />}
                                            >
                                                Logout
                                            </Button>
                                        </Link>
                                    </Stack>
                                </Paper>
                            </Box>
                        )}

                        <List sx={{ px: 2, py: 1 }}>
                            {menuItems.map((item) => (
                                <Link key={item.route} href={route(item.route)}>
                                    <ListItem
                                        button
                                        onClick={toggleMobileMenu}
                                        sx={{
                                            borderRadius: '10px',
                                            mb: 0.75,
                                            bgcolor: route().current(item.route) ?
                                                'rgba(0, 0, 0, 0.04)' :
                                                'transparent',
                                            '&:hover': {
                                                bgcolor: 'rgba(0, 0, 0, 0.02)'
                                            }
                                        }}
                                    >
                                        <ListItemIcon sx={{
                                            minWidth: 40,
                                            color: route().current(item.route) ?
                                                theme.palette.text.primary :
                                                theme.palette.text.secondary,
                                            opacity: route().current(item.route) ? 1 : 0.7
                                        }}>
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Typography
                                                        variant="body1"
                                                        sx={{
                                                            fontWeight: route().current(item.route) ? 500 : 400,
                                                            color: route().current(item.route) ?
                                                                theme.palette.text.primary :
                                                                theme.palette.text.secondary
                                                        }}
                                                    >
                                                        {item.text}
                                                    </Typography>
                                                    {item.badge && (
                                                        <CustomBadge
                                                            label={item.badge}
                                                            color="error"
                                                            size="small"
                                                            sx={{ ml: 1 }}
                                                        />
                                                    )}
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                </Link>
                            ))}
                        </List>

                        {!auth.user && (
                            <Box sx={{ p: 3, mt: 1 }}>
                                <Typography variant="subtitle2" sx={{
                                    fontWeight: 500,
                                    mb: 2.5,
                                    color: theme.palette.text.secondary,
                                    px: 1
                                }}>
                                    Bergabung dengan STIA Bayu Angga Loker
                                </Typography>

                                <Stack spacing={1.5}>
                                    <Link href={route('register')} className="w-full">
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            sx={{
                                                borderRadius: '10px',
                                                py: 1.5,
                                                bgcolor: 'rgba(0, 0, 0, 0.8)',
                                                color: '#fff',
                                                '&:hover': {
                                                    bgcolor: 'rgba(0, 0, 0, 0.7)'
                                                }
                                            }}
                                            startIcon={<PersonAddIcon />}
                                        >
                                            Daftar Akun Baru
                                        </Button>
                                    </Link>
                                    <Link href={route('login')} className="w-full">
                                        <Button
                                            variant="outlined"
                                            fullWidth
                                            sx={{
                                                borderRadius: '10px',
                                                py: 1.5,
                                                borderColor: 'rgba(0, 0, 0, 0.2)',
                                                color: theme.palette.text.primary,
                                                '&:hover': {
                                                    borderColor: 'rgba(0, 0, 0, 0.3)',
                                                    bgcolor: 'rgba(0, 0, 0, 0.02)'
                                                }
                                            }}
                                            startIcon={<LoginIcon />}
                                        >
                                            Login
                                        </Button>
                                    </Link>
                                </Stack>
                            </Box>
                        )}
                    </motion.div>
                </Drawer>

                {/* Main Content */}
                <Box sx={{
                    flex: '1 0 auto',
                    pt: { xs: '4rem', md: '4.5rem' },
                    bgcolor: 'background.default'
                }}>
                    {children}
                </Box>

                {/* Footer */}
                <Footer />
            </Box>
        </MuiThemeProvider>
    );
};

export default PublicLayout;
