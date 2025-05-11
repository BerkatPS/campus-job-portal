import React, { useState, useEffect } from 'react';
import { Link, usePage, useForm } from '@inertiajs/react';
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Container,
    IconButton,
    Menu,
    MenuItem,
    Divider,
    Drawer,
    useScrollTrigger,
    Slide,
    Fade,
    Avatar,
    Badge as MuiBadge,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Stack,
    Chip,
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
    Assignment as AssignmentIcon,
    Info as InfoIcon,
    ContactPhone as ContactPhoneIcon,
    Search as SearchIcon,
    Close as CloseIcon,
    Forum as ForumIcon,
    Notifications as NotificationsIcon
} from '@mui/icons-material';
import Footer from './Footer';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../Shared/Button';
import Card from '../Shared/Card';
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

const PublicLayout = ({ children, title }) => {
    const { auth } = usePage().props;
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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

    const handleProfileMenuClose = () => {
        setProfileMenuAnchor(null);
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
        { text: 'Lowongan', route: 'public.jobs.index', icon: <BusinessIcon /> },
        ...(auth?.user?.role_id === 3 || auth?.user?.role === 1 ? [
            { text: 'Forum', route: 'public.forum.index', icon: <ForumIcon />, badge: auth?.user?.role === 'candidate' ? 'New' : null }
        ] : []),
        { text: 'Tentang', route: 'public.about', icon: <InfoIcon /> },
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
                        elevation={scrolled ? 4 : 0}
                        sx={{
                            background: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.8)',
                            backdropFilter: 'blur(10px)',
                            borderBottom: scrolled ? '1px solid rgba(229, 231, 235, 0.8)' : 'none',
                            transition: 'all 0.3s ease-in-out',
                            color: theme.palette.text.primary,
                            boxShadow: scrolled ? '0 4px 20px rgba(0, 0, 0, 0.05)' : 'none',
                        }}
                        className="border-b border-gray-100/80"
                    >
                        <Container maxWidth="xl">
                            <Toolbar sx={{ minHeight: { xs: '4.5rem' }, p: { xs: 1, sm: 2 } }}>
                                <Link href={route('public.home')} className="flex items-center mr-6">
                                    <Box
                                        className="bg-primary-500 text-white p-2 rounded-xl shadow-md shadow-primary-500/20 mr-2"
                                        sx={{ display: { xs: 'none', sm: 'flex' } }}
                                    >
                                        <BusinessIcon />
                                    </Box>
                                    <Typography
                                        variant="h5"
                                        component="div"
                                        sx={{
                                            fontWeight: 'bold',
                                            letterSpacing: '-0.5px',
                                            display: { xs: 'none', sm: 'block' },
                                            color: theme.palette.text.primary
                                        }}
                                    >
                                        STIA Bayu Angga Loker
                                    </Typography>
                                </Link>

                                {/* Desktop menu */}
                                <Box sx={{
                                    display: { xs: 'none', md: 'flex' },
                                    gap: 0.5,
                                    mx: 'auto'
                                }}>
                                    {menuItems.map((item) => (
                                        <motion.div
                                            key={item.text}
                                            whileHover={{ y: -2 }}
                                            transition={{ type: 'spring', stiffness: 300 }}
                                        >
                                            <Link href={route(item.route)}>
                                                <Button
                                                    variant="text"
                                                    sx={{
                                                        px: 2,
                                                        py: 1,
                                                        borderRadius: '0.75rem',
                                                        color: route().current(item.route) ?
                                                            theme.palette.primary.main :
                                                            theme.palette.text.primary,
                                                        bgcolor: route().current(item.route) ?
                                                            alpha(theme.palette.primary.main, 0.1) :
                                                            'transparent',
                                                        '&:hover': {
                                                            bgcolor: alpha(theme.palette.primary.main, 0.1)
                                                        }
                                                    }}
                                                    startIcon={item.icon}
                                                    className={route().current(item.route) ? 'font-medium' : ''}
                                                >
                                                    {item.text}
                                                    {item.badge && (
                                                        <CustomBadge
                                                            label={item.badge}
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
                                    {/*<Tooltip title="Cari">*/}
                                    {/*    <IconButton*/}
                                    {/*        onClick={() => setSearchOpen(true)}*/}
                                    {/*        sx={{*/}
                                    {/*            color: theme.palette.text.primary,*/}
                                    {/*            '&:hover': {*/}
                                    {/*                bgcolor: alpha(theme.palette.primary.main, 0.1)*/}
                                    {/*            }*/}
                                    {/*        }}*/}
                                    {/*        className="rounded-xl"*/}
                                    {/*    >*/}
                                    {/*        <SearchIcon />*/}
                                    {/*    </IconButton>*/}
                                    {/*</Tooltip>*/}

                                    {auth.user ? (
                                        <>
                                            <Tooltip title="Notifikasi">
                                                <IconButton
                                                    sx={{
                                                        color: theme.palette.text.primary,
                                                        '&:hover': {
                                                            bgcolor: alpha(theme.palette.primary.main, 0.1)
                                                        }
                                                    }}
                                                    className="rounded-xl"
                                                >
                                                    <CustomBadge
                                                        label={notificationCount}
                                                        color="error"
                                                    >
                                                        <NotificationsIcon />
                                                    </CustomBadge>
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
                                                                borderRadius: '50px',
                                                                px: { xs: 1, sm: 2 },
                                                                py: 1,
                                                                color: theme.palette.text.primary,
                                                                '&:hover': {
                                                                    bgcolor: alpha(theme.palette.primary.main, 0.1)
                                                                }
                                                            }}
                                                            endIcon={!isSmall && <KeyboardArrowDown />}
                                                        >
                                                            <Avatar
                                                                src={auth.user.profile_photo || undefined}
                                                                alt={auth.user.name}
                                                                sx={{
                                                                    width: 32,
                                                                    height: 32,
                                                                    mr: { xs: 0, sm: 1 },
                                                                    border: `2px solid ${theme.palette.primary.main}`
                                                                }}
                                                            >
                                                                {auth.user.name?.charAt(0)}
                                                            </Avatar>
                                                            <span className="font-medium hidden sm:inline truncate max-w-[100px]">
                                                                {auth.user.name}
                                                            </span>
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
                                            <motion.div whileHover={{ scale: 1.05 }}>
                                                <Link href={route('login')}>
                                                    <Button
                                                        variant="outlined"
                                                        color="primary"
                                                        sx={{
                                                            display: { xs: 'none', sm: 'inline-flex' },
                                                            borderRadius: '0.75rem',
                                                            px: 2,
                                                            py: 1,
                                                        }}
                                                        startIcon={<LoginIcon />}
                                                    >
                                                        Login
                                                    </Button>
                                                </Link>
                                            </motion.div>

                                            <motion.div whileHover={{ scale: 1.05 }}>
                                                <Link href={route('register')}>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        sx={{
                                                            borderRadius: '0.75rem',
                                                            px: { xs: 2, sm: 3 },
                                                            py: 1,
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
                                                '&:hover': {
                                                    bgcolor: alpha(theme.palette.primary.main, 0.1)
                                                }
                                            }}
                                            className="rounded-xl"
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
                    PaperProps={{
                        sx: {
                            width: '85%',
                            maxWidth: 320,
                            borderTopLeftRadius: 16,
                            borderBottomLeftRadius: 16,
                            p: 0
                        }
                    }}
                >
                    <motion.div
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                        <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box
                                    className="bg-primary-500 text-white p-2 rounded-xl shadow-md shadow-primary-500/20 mr-2"
                                >
                                    <BusinessIcon />
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    Campus<span style={{ color: theme.palette.primary.main }}>Job</span>
                                </Typography>
                            </Box>
                            <IconButton
                                onClick={toggleMobileMenu}
                                edge="end"
                                color="inherit"
                                className="rounded-xl hover:bg-primary-50"
                            >
                                <CloseIcon />
                            </IconButton>
                        </Box>

                        <Divider />

                        {auth.user && (
                            <Box sx={{ p: 3 }}>
                                <Card
                                    sx={{
                                        p: 3,
                                        bgcolor: theme.palette.mode === 'dark' ?
                                            alpha(theme.palette.primary.main, 0.1) :
                                            alpha(theme.palette.primary.light, 0.1),
                                        borderRadius: '1rem',
                                    }}
                                    className="border-0 shadow-md shadow-primary-500/5"
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar
                                            src={auth.user.profile_photo || undefined}
                                            alt={auth.user.name}
                                            sx={{
                                                width: 48,
                                                height: 48,
                                                border: `2px solid ${theme.palette.primary.main}`
                                            }}
                                        >
                                            {auth.user.name?.charAt(0)}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                {auth.user.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" noWrap>
                                                {auth.user.email}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
                                        <Link href={route(userDashboardRoute())} className="flex-1">
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                fullWidth
                                                sx={{ borderRadius: '0.75rem', py: 1 }}
                                                startIcon={<DashboardIcon />}
                                            >
                                                Dashboard
                                            </Button>
                                        </Link>
                                        <Link href={route('logout')} method="post" className="flex-1">
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                fullWidth
                                                sx={{ borderRadius: '0.75rem', py: 1 }}
                                                startIcon={<LogoutIcon />}
                                            >
                                                Logout
                                            </Button>
                                        </Link>
                                    </Stack>
                                </Card>
                            </Box>
                        )}

                        <List sx={{ px: 3, py: 1 }}>
                            {menuItems.map((item) => (
                                <Link key={item.route} href={route(item.route)}>
                                    <ListItem
                                        button
                                        onClick={toggleMobileMenu}
                                        sx={{
                                            borderRadius: '0.75rem',
                                            mb: 1,
                                            bgcolor: route().current(item.route) ?
                                                alpha(theme.palette.primary.main, 0.1) :
                                                'transparent',
                                            '&:hover': {
                                                bgcolor: alpha(theme.palette.primary.main, 0.05)
                                            }
                                        }}
                                    >
                                        <ListItemIcon sx={{
                                            minWidth: 40,
                                            color: route().current(item.route) ?
                                                theme.palette.primary.main :
                                                theme.palette.text.secondary
                                        }}>
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    {item.text}
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
                                            primaryTypographyProps={{
                                                fontWeight: route().current(item.route) ? 600 : 400,
                                                color: route().current(item.route) ?
                                                    theme.palette.primary.main :
                                                    theme.palette.text.primary
                                            }}
                                        />
                                    </ListItem>
                                </Link>
                            ))}
                        </List>

                        {!auth.user && (
                            <Box sx={{ p: 3, mt: 2 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 3 }}>
                                    Bergabung dengan STIA Bayu Angga Loker
                                </Typography>

                                <Stack spacing={2}>
                                    <Link href={route('register')} className="w-full">
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            sx={{ borderRadius: '0.75rem', py: 1.5 }}
                                            startIcon={<PersonAddIcon />}
                                        >
                                            Daftar Akun Baru
                                        </Button>
                                    </Link>
                                    <Link href={route('login')} className="w-full">
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            fullWidth
                                            sx={{ borderRadius: '0.75rem', py: 1.5 }}
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

                {/* Main content */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: '100vh',
                    }}
                >
                    <Box sx={{ height: { xs: '4.5rem' } }} />

                    {children}

                </Box>

                <Footer />
            </Box>
        </MuiThemeProvider>
    );
};

export default PublicLayout;
