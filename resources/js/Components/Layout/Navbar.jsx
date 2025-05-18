import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    Container,
    Avatar,
    Button,
    Tooltip,
    MenuItem,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    useScrollTrigger,
    alpha,
    useTheme,
    useMediaQuery,
    Slide,
    Chip
} from '@mui/material';
import {
    Menu as MenuIcon,
    Notifications as NotificationsIcon,
    Person as PersonIcon,
    Dashboard as DashboardIcon,
    Logout as LogoutIcon,
    Settings as SettingsIcon,
    Work as WorkIcon,
    School as SchoolIcon,
    Business as BusinessIcon,
    Search as SearchIcon,
    Close as CloseIcon,
    Forum as ForumIcon,
    Info as InfoIcon,
    ContactPhone as ContactPhoneIcon,
    Home as HomeIcon,
} from '@mui/icons-material';
import SharedButton from '@/Components/Shared/Button';
import Card from '@/Components/Shared/Card';
import Alert from '@/Components/Shared/Alert';
import SearchBar from '@/Components/Shared/SearchBar';
import Dropdown from '@/Components/Shared/Dropdown';
import SharedBadge from '@/Components/Shared/Badge';
import MessageIndicator from '@/Components/Navbar/MessageIndicator';

const HideOnScroll = (props) => {
    const { children } = props;
    const trigger = useScrollTrigger();
  
    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
};

const Navbar = () => {
    const { auth, routes } = usePage().props;
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
    });
    
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };
    
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    
    const toggleMobileDrawer = () => {
        setMobileDrawerOpen(!mobileDrawerOpen);
    };

    const isAuthenticated = auth && auth.user;
    
    // Handle different user roles
    const isCandidateOrAdmin = isAuthenticated && (auth.user.role === 'candidate' || auth.user.role === 'admin');
    const isManager = isAuthenticated && auth.user.role === 'manager';
    const isAdmin = isAuthenticated && auth.user.role === 'admin';
    
    const userNavigation = [
        {
            name: 'Profile',
            href: route(auth?.user?.role === 'candidate' ? 'candidate.profile' : 
                        auth?.user?.role === 'manager' ? 'manager.profile' : 
                        'admin.profile'),
            icon: <PersonIcon fontSize="small" />
        },
        {
            name: 'Dashboard',
            href: route(auth?.user?.role === 'candidate' ? 'candidate.dashboard' : 
                        auth?.user?.role === 'manager' ? 'manager.dashboard' : 
                        'admin.dashboard'),
            icon: <DashboardIcon fontSize="small" />
        },
        {
            name: 'Settings',
            href: route(auth?.user?.role === 'candidate' ? 'candidate.settings' : 
                        auth?.user?.role === 'manager' ? 'manager.settings' : 
                        'admin.settings'),
            icon: <SettingsIcon fontSize="small" />
        },
        {
            name: 'Logout',
            href: route('logout'),
            icon: <LogoutIcon fontSize="small" />
        }
    ];
    
    // Menu items for the mobile drawer
    const mobileMenuItems = [
        { name: 'Home', href: route('home') },
        { name: 'Jobs', href: route('jobs') },
        { name: 'Companies', href: route('companies') },
        { name: 'About Us', href: route('about') },
        { name: 'Contact', href: route('contact') },
        { name: 'Blog', href: route('blog') }
    ];
    
    // Public navigation for navbar items
    const navItems = [
        { label: 'Beranda', href: route('public.home'), icon: <HomeIcon fontSize="small" /> },
        { label: 'Lowongan', href: route('public.jobs.index'), icon: <BusinessIcon fontSize="small" /> },
        { label: 'Forum', href: route('public.forum.index'), icon: <ForumIcon fontSize="small" />, badge: auth?.user?.role === 'candidate' ? 'New' : null },
        { label: 'Tentang', href: route('public.about'), icon: <InfoIcon fontSize="small" /> },
        { label: 'Kontak', href: route('public.contact'), icon: <ContactPhoneIcon fontSize="small" /> },
    ];
    
    return (
        <>
            <HideOnScroll>
                <AppBar 
                    position="fixed"
                    elevation={trigger ? 4 : 0}
                    sx={{ 
                        backgroundColor: trigger ? 
                            (theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.95) : alpha(theme.palette.common.white, 0.95)) : 
                            'transparent',
                        backdropFilter: trigger ? 'blur(8px)' : 'none',
                        borderBottom: trigger ? 'none' : `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        transition: 'all 0.3s ease-in-out',
                        color: trigger ? 
                            (theme.palette.mode === 'dark' ? theme.palette.text.primary : theme.palette.text.primary) : 
                            (theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.white),
                        zIndex: theme.zIndex.drawer + 1
                    }}
                >
                    <Container maxWidth="xl">
                        <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 72 } }}>
                            {/* Logo and brand for larger screens */}
                            <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
                                <Link href={route('home')}>
                                    <Box 
                                        component="img"
                                        src="/images/logo.svg"
                                        alt="CampusJob"
                                        sx={{ 
                                            height: 36,
                                            width: 'auto',
                                            display: { xs: 'none', md: 'flex' },
                                            filter: trigger ? 'none' : 'brightness(0) invert(1)'
                                        }}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='32' height='32'%3E%3Cpath fill='%23333333' d='M3 6C3 4.34315 4.34315 3 6 3H14C17.866 3 21 6.13401 21 10V21H6C4.34315 21 3 19.6569 3 18V6Z'%3E%3C/path%3E%3C/svg%3E";
                                        }}
                                    />
                                </Link>
                                
                                <Link href={route('home')}>
                                    <Typography
                                        variant="h6"
                                        noWrap
                                        sx={{
                                            ml: 1,
                                            display: { xs: 'none', md: 'flex' },
                                            fontWeight: 700,
                                            letterSpacing: '.1rem',
                                            color: trigger ? 
                                                (theme.palette.mode === 'dark' ? theme.palette.text.primary : theme.palette.text.primary) : 
                                                (theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.white),
                                            textDecoration: 'none',
                                        }}
                                    >
                                        Campus<span style={{ color: theme.palette.primary.main }}>Job</span>
                                    </Typography>
                                </Link>
                            </Box>

                            {/* Hamburger menu for mobile */}
                            <Box sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}>
                                <IconButton
                                    size="large"
                                    aria-label="menu"
                                    onClick={toggleMobileDrawer}
                                    sx={{ 
                                        color: trigger ? 
                                            (theme.palette.mode === 'dark' ? theme.palette.text.primary : theme.palette.text.primary) : 
                                            (theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.white)
                                    }}
                                >
                                    <MenuIcon />
                                </IconButton>
                            </Box>

                            {/* Logo and brand for mobile */}
                            <Box 
                                sx={{ 
                                    display: { xs: 'flex', md: 'none' }, 
                                    flexGrow: 1,
                                    justifyContent: 'center'
                                }}
                            >
                                <Link href={route('home')}>
                                    <Box 
                                        component="img"
                                        src="/images/logo.svg"
                                        alt="CampusJob"
                                        sx={{ 
                                            height: 32,
                                            width: 'auto',
                                            filter: trigger ? 'none' : 'brightness(0) invert(1)'
                                        }}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='32' height='32'%3E%3Cpath fill='%23333333' d='M3 6C3 4.34315 4.34315 3 6 3H14C17.866 3 21 6.13401 21 10V21H6C4.34315 21 3 19.6569 3 18V6Z'%3E%3C/path%3E%3C/svg%3E";
                                        }}
                                    />
                                </Link>
                            </Box>

                            {/* Navigation links for desktop */}
                            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, marginLeft: 3 }}>
                                {navItems.map((item) => (
                                    <Link key={item.label} href={item.href}>
                                        <Button
                                            startIcon={item.icon}
                                            sx={{ 
                                                my: 2, 
                                                display: 'block',
                                                color: trigger ? 
                                                    (theme.palette.mode === 'dark' ? theme.palette.text.primary : theme.palette.text.primary) : 
                                                    (theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.white),
                                                '&:hover': {
                                                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                                }
                                            }}
                                        >
                                            {item.label}
                                            {item.badge && (
                                                <SharedBadge 
                                                    badgeContent={item.badge} 
                                                    color="primary" 
                                                    size="small"
                                                    sx={{ ml: 1 }}
                                                />
                                            )}
                                        </Button>
                                    </Link>
                                ))}
                            </Box>

                            {/* Search button */}
                            <Box sx={{ display: 'flex', mr: 1 }}>
                                <SearchBar
                                    placeholder="Search..."
                                    className="hidden md:block"
                                    sx={{ 
                                        width: 200,
                                        '& .MuiInputBase-root': {
                                            backgroundColor: alpha(theme.palette.common.white, 0.15),
                                            '&:hover': {
                                                backgroundColor: alpha(theme.palette.common.white, 0.25),
                                            },
                                        },
                                    }}
                                />
                            </Box>

                            {/* Auth buttons or user menu */}
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {isAuthenticated ? (
                                    <>
                                        {/* Notifications */}
                                        <Tooltip title="Notifications">
                                            <IconButton
                                                size="large"
                                                aria-label="notifications"
                                                sx={{ 
                                                    color: trigger ? 
                                                        (theme.palette.mode === 'dark' ? theme.palette.text.primary : theme.palette.text.primary) : 
                                                        (theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.white),
                                                    mr: 1
                                                }}
                                            >
                                                <SharedBadge badgeContent={3} color="error">
                                                    <NotificationsIcon />
                                                </SharedBadge>
                                            </IconButton>
                                        </Tooltip>
                                        
                                        {/* Message indicator - only for managers */}
                                        {isManager && (
                                            <MessageIndicator 
                                                initialUnreadCount={auth.unread_messages_count || 0} 
                                            />
                                        )}
                                        
                                        {/* User account menu */}
                                        <Dropdown
                                            trigger={
                                                <Tooltip title="Account settings">
                                                    <IconButton
                                                        sx={{ p: 0, border: `2px solid ${theme.palette.primary.main}` }}
                                                    >
                                                        <Avatar 
                                                            alt={auth.user.name}
                                                            src={auth.user.profile_photo_url} 
                                                            sx={{ width: 32, height: 32 }}
                                                        />
                                                    </IconButton>
                                                </Tooltip>
                                            }
                                            items={userNavigation}
                                            onClose={handleCloseUserMenu}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                                            <Link href={route('login')}>
                                                <Button
                                                    variant="text"
                                                    sx={{ 
                                                        color: trigger ? 
                                                            (theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary) : 
                                                            (theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.white),
                                                        '&:hover': {
                                                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                                        },
                                                        mr: 1
                                                    }}
                                                >
                                                    Login
                                                </Button>
                                            </Link>
                                            
                                            <Link href={route('register')}>
                                                <Button 
                                                    variant="contained" 
                                                    color="primary"
                                                    size="small"
                                                >
                                                    Register
                                                </Button>
                                            </Link>
                                        </Box>

                                        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                                            <Link href={route('login')}>
                                                <IconButton
                                                    size="small"
                                                    sx={{ 
                                                        color: trigger ? 
                                                            (theme.palette.mode === 'dark' ? theme.palette.text.primary : theme.palette.text.primary) : 
                                                            (theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.white)
                                                    }}
                                                >
                                                    <PersonIcon />
                                                </IconButton>
                                            </Link>
                                        </Box>
                                    </>
                                )}
                            </Box>
                        </Toolbar>
                    </Container>
                </AppBar>
            </HideOnScroll>
            
            {/* Mobile Drawer */}
            <Drawer
                anchor="left"
                open={mobileDrawerOpen}
                onClose={toggleMobileDrawer}
                sx={{
                    '& .MuiDrawer-paper': { 
                        boxSizing: 'border-box', 
                        width: 280,
                        backdropFilter: 'blur(8px)',
                    },
                    zIndex: theme.zIndex.drawer + 2
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 2,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <img 
                            src="/images/logo.svg" 
                            alt="CampusJob"
                            style={{ height: 32, marginRight: 8 }}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='32' height='32'%3E%3Cpath fill='%23333333' d='M3 6C3 4.34315 4.34315 3 6 3H14C17.866 3 21 6.13401 21 10V21H6C4.34315 21 3 19.6569 3 18V6Z'%3E%3C/path%3E%3C/svg%3E";
                            }}
                        />
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            Campus<span style={{ color: theme.palette.primary.main }}>Job</span>
                        </Typography>
                    </Box>
                    <IconButton onClick={toggleMobileDrawer}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                
                <Divider />
                
                {isAuthenticated && (
                    <Box sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Avatar 
                                src={auth.user.profile_photo_url} 
                                alt={auth.user.name}
                                sx={{ width: 40, height: 40, mr: 2 }}
                            />
                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                    {auth.user.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {auth.user.email}
                                </Typography>
                            </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                            <Link href={route(auth?.user?.role === 'candidate' ? 'candidate.dashboard' : 
                                        auth?.user?.role === 'manager' ? 'manager.dashboard' : 
                                        'admin.dashboard')}>
                                <Button 
                                    variant="outlined" 
                                    size="small" 
                                    startIcon={<DashboardIcon />}
                                    fullWidth
                                >
                                    Dashboard
                                </Button>
                            </Link>
                            
                            <Link href={route(auth?.user?.role === 'candidate' ? 'candidate.profile' : 
                                        auth?.user?.role === 'manager' ? 'manager.profile' : 
                                        'admin.profile')}>
                                <Button 
                                    variant="outlined" 
                                    size="small" 
                                    startIcon={<PersonIcon />}
                                    fullWidth
                                >
                                    Profile
                                </Button>
                            </Link>
                        </Box>
                    </Box>
                )}
                
                {isAuthenticated && <Divider />}
                
                <List>
                    {mobileMenuItems.map((item) => (
                        <Link key={item.name} href={item.href}>
                            <ListItem button onClick={toggleMobileDrawer}>
                                <ListItemText primary={item.name} />
                            </ListItem>
                        </Link>
                    ))}
                </List>
                
                <Divider />
                
                {!isAuthenticated && (
                    <Box sx={{ p: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
                            Join CampusJob today
                        </Typography>
                        
                        <Link href={route('login')}>
                            <Button 
                                variant="outlined" 
                                fullWidth
                                sx={{ mb: 1 }}
                            >
                                Login
                            </Button>
                        </Link>
                        
                        <Link href={route('register')}>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                fullWidth
                            >
                                Register
                            </Button>
                        </Link>
                    </Box>
                )}
            </Drawer>
            
            {/* Toolbar placeholder to prevent content from hiding behind the appbar */}
            <Toolbar sx={{ minHeight: { xs: 64, md: 72 } }} />
        </>
    );
};

export default Navbar; 