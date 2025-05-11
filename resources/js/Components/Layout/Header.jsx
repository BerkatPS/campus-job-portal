import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    Avatar,
    MenuItem,
    Tooltip,
    useTheme,
    Slide,
    Container,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Drawer,
    Divider,
    useMediaQuery,
    Badge,
    Chip,
    CircularProgress,
} from '@mui/material';
import {
    Menu as MenuIcon,
    DarkMode as DarkModeIcon,
    LightMode as LightModeIcon,
    Notifications as NotificationsIcon,
    AccountCircle as AccountCircleIcon,
    Dashboard as DashboardIcon,
    Work as WorkIcon,
    Settings as SettingsIcon,
    Logout as LogoutIcon,
    ChevronRight as ChevronRightIcon,
    Search as SearchIcon,
    Business as BusinessIcon,
    Person as PersonIcon,
    Mail as MailIcon,
    Assignment as AssignmentIcon,
    EventNote as EventNoteIcon,
    Delete as DeleteIcon,
    CheckCircle as CheckCircleIcon,
    Error as ErrorIcon,
    Info as InfoIcon,
    Refresh as RefreshIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { alpha } from '@mui/material/styles';
import Button from "@/Components/Shared/Button.jsx";
import moment from 'moment';
import 'moment/locale/id';
import axios from 'axios';

const Header = ({ toggleSidebar }) => {
    const { auth, latestNotifications: initialNotifications, unreadNotificationsCount: initialUnreadCount } = usePage().props;
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [anchorElNotifications, setAnchorElNotifications] = useState(null);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [notifications, setNotifications] = useState(initialNotifications || []);
    const [unreadCount, setUnreadCount] = useState(initialUnreadCount || 0);
    const [newNotificationReceived, setNewNotificationReceived] = useState(false);

    useEffect(() => {
        const handleNotificationReceived = (event) => {
            console.log('🔔 Notification received in Header component', event.detail);
            setNewNotificationReceived(true);

            // Update notifications state without reloading
            if (event.detail) {
                const notification = event.detail;
                // Format the notification to match your expected structure
                const formattedNotification = {
                    id: notification.id,
                    type: notification.type,
                    data: notification.data,
                    read_at: null,
                    created_at: notification.created_at || new Date().toISOString(),
                };

                setNotifications(prev => [formattedNotification, ...prev]);
                setUnreadCount(prev => prev + 1);
            }
        };

        // Listen for notification events
        window.addEventListener('notification.received', handleNotificationReceived);

        // Clean up
        return () => {
            window.removeEventListener('notification.received', handleNotificationReceived);
        };
    }, []);


    // Function to fetch latest notifications without page reload
    const fetchLatestNotifications = async () => {
        setRefreshing(true);
        try {
            const basePath = getBasePath();
            const response = await axios.get(`${basePath}/notifications/latest`);
            if (response.data && response.data.notifications) {
                setNotifications(response.data.notifications);
                setUnreadCount(response.data.unreadCount || 0);
                setNewNotificationReceived(false);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setRefreshing(false);
        }
    };

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            if (offset > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Notification indicator animation when new notification is received
    useEffect(() => {
        if (newNotificationReceived) {
            // Automatically fetch new notifications when notification dropdown is opened
            if (Boolean(anchorElNotifications)) {
                fetchLatestNotifications();
            }
        }
    }, [newNotificationReceived, anchorElNotifications]);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const handleOpenNotificationsMenu = (event) => {
        setAnchorElNotifications(event.currentTarget);
        // Fetch latest notifications when opening the dropdown
        if (newNotificationReceived) {
            fetchLatestNotifications();
        }
    };

    const handleCloseNotificationsMenu = () => {
        setAnchorElNotifications(null);
    };

    const handleMarkNotificationAsRead = async (notificationId) => {
        setLoading(true);
        const basePath = getBasePath();

        try {
            const response = await axios.post(`${basePath}/notifications/${notificationId}/mark-as-read`);
            // Update notifications locally instead of reloading
            if (response.status === 200) {
                setNotifications(prevNotifications =>
                    prevNotifications.map(notification =>
                        notification.id === notificationId
                            ? { ...notification, read_at: new Date().toISOString() }
                            : notification
                    )
                );
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
            // Show toast or error message here
            if (window.showToast) {
                window.showToast({
                    message: 'Gagal menandai notifikasi sebagai dibaca',
                    type: 'error'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteNotification = async (notificationId) => {
        setLoading(true);
        const basePath = getBasePath();

        try {
            const response = await axios.delete(`${basePath}/notifications/${notificationId}`);
            // Update notifications locally instead of reloading
            if (response.status === 200) {
                const deletedNotification = notifications.find(n => n.id === notificationId);
                setNotifications(prevNotifications =>
                    prevNotifications.filter(notification => notification.id !== notificationId)
                );

                // Only decrease unread count if the deleted notification was unread
                if (deletedNotification && !deletedNotification.read_at) {
                    setUnreadCount(prev => Math.max(0, prev - 1));
                }
            }
        } catch (error) {
            console.error('Error deleting notification:', error);
            // Show toast or error message here
            if (window.showToast) {
                window.showToast({
                    message: 'Gagal menghapus notifikasi',
                    type: 'error'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAllAsRead = async () => {
        setLoading(true);
        const basePath = getBasePath();

        try {
            const response = await axios.post(`${basePath}/notifications/mark-all-as-read`);
            // Update notifications locally instead of reloading
            if (response.status === 200) {
                const now = new Date().toISOString();
                setNotifications(prevNotifications =>
                    prevNotifications.map(notification =>
                        notification.read_at ? notification : { ...notification, read_at: now }
                    )
                );
                setUnreadCount(0);
            }
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            // Show toast or error message here
            if (window.showToast) {
                window.showToast({
                    message: 'Gagal menandai semua notifikasi sebagai dibaca',
                    type: 'error'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    // Get base path for API calls based on user role
    const getBasePath = () => {
        const userRole = auth?.user?.role?.slug || 'guest';

        if (userRole === 'admin') {
            return '/admin';
        } else if (userRole === 'manager') {
            return '/manager';
        } else {
            return '/candidate';
        }
    };

    // Get user role
    const userRole = auth?.user?.role?.slug || 'guest';
    const isAdmin = userRole === 'admin';
    const isManager = userRole === 'manager';
    const isCandidate = userRole === 'candidate';

    // User menu items based on role
    const getUserMenuItems = () => {
        const baseItems = [
            {
                label: 'Dashboard',
                icon: <DashboardIcon />,
                route: route('dashboard')
            },
            {
                label: 'Settings',
                icon: <SettingsIcon />,
                route: '#'
            },
        ];

        if (isAdmin) {
            baseItems.unshift({
                label: 'Admin Panel',
                icon: <DashboardIcon />,
                route: route('admin.dashboard')
            });
        } else if (isManager) {
            baseItems.unshift({
                label: 'Manager Dashboard',
                icon: <BusinessIcon />,
                route: route('manager.dashboard')
            });
        } else if (isCandidate) {
            baseItems.unshift({
                label: 'My Profile',
                icon: <PersonIcon />,
                route: route('candidate.profile.index')
            });
        }

        baseItems.push({
            label: 'Logout',
            icon: <LogoutIcon />,
            route: route('logout'),
            method: 'post'
        });

        return baseItems;
    };

    const getNotificationLink = () => {
        if (isManager) return route('manager.notifications.index');
        if (isCandidate) return route('candidate.notifications.index');
        return '#';
    };

    // Get appropriate icon for each notification type
    const getNotificationIcon = (type) => {
        if (type.includes('Job') || type.includes('Lowongan')) {
            return <WorkIcon />;
        } else if (type.includes('Application') || type.includes('Lamaran')) {
            return <AssignmentIcon />;
        } else if (type.includes('Interview') || type.includes('Jadwal') || type.includes('Event')) {
            return <EventNoteIcon />;
        } else if (type.includes('Company') || type.includes('Perusahaan')) {
            return <BusinessIcon />;
        } else if (type.includes('Message') || type.includes('Pesan')) {
            return <MailIcon />;
        } else if (type.includes('Profile') || type.includes('User')) {
            return <PersonIcon />;
        } else if (type.includes('Test')) {
            return <InfoIcon />;
        } else {
            return <NotificationsIcon />;
        }
    };

    // Format relative time for notifications
    const getRelativeTime = (date) => {
        moment.locale('id');
        return moment(date).fromNow();
    };

    // Get a default title from the notification type if none is provided
    const getDefaultTitle = (type) => {
        const parts = type.split('\\');
        const className = parts[parts.length - 1];
        // Convert camelCase to Title Case with spaces
        return className.replace(/([A-Z])/g, ' $1').trim();
    };

    // Get color based on notification type
    const getTypeColor = (type) => {
        if (type.includes('Job') || type.includes('Lowongan')) {
            return theme.palette.primary.main;
        } else if (type.includes('Application') || type.includes('Lamaran')) {
            return theme.palette.success.main;
        } else if (type.includes('Interview') || type.includes('Jadwal') || type.includes('Event')) {
            return theme.palette.warning.main;
        } else if (type.includes('Company') || type.includes('Perusahaan')) {
            return theme.palette.info.main;
        } else if (type.includes('Message') || type.includes('Pesan')) {
            return theme.palette.secondary.main;
        } else if (type.includes('Test')) {
            return theme.palette.info.light;
        } else {
            return theme.palette.grey[700];
        }
    };

    // Empty state component for notifications
    const EmptyNotifications = () => (
        <Box sx={{ py: 4, textAlign: 'center' }}>
            <NotificationsIcon sx={{ fontSize: 40, color: alpha(theme.palette.text.secondary, 0.4), mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
                Tidak ada notifikasi baru
            </Typography>
        </Box>
    );

    // Loading state component
    const NotificationsLoading = () => (
        <Box sx={{ py: 3, textAlign: 'center' }}>
            <CircularProgress size={30} color="primary" sx={{ mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
                Memuat notifikasi...
            </Typography>
        </Box>
    );

    return (
        <>
            <Slide appear={false} direction="down" in={!isScrolled}>
                <AppBar
                    position="fixed"
                    elevation={isScrolled ? 4 : 0}
                    sx={{
                        zIndex: theme.zIndex.appBar,
                        backdropFilter: "blur(8px)",
                        backgroundColor: isScrolled
                            ? alpha(theme.palette.background.paper, 0.95)
                            : alpha(theme.palette.background.paper, 0.85),
                        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        transition: 'all 0.3s ease-in-out',
                    }}
                    className="backdrop-saturate-150"
                >
                    <Container maxWidth="xl">
                        <Toolbar disableGutters className="py-1">
                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                {/* Left side - Logo and menu toggle */}
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <motion.div whileTap={{ scale: 0.95 }}>
                                        <IconButton
                                            color="primary"
                                            aria-label="open drawer"
                                            onClick={toggleSidebar}
                                            edge="start"
                                            className="text-primary-600 hover:bg-primary-50"
                                            sx={{ mr: 1 }}
                                        >
                                            <MenuIcon />
                                        </IconButton>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <Link href={route('dashboard')}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography
                                                    variant="h6"
                                                    noWrap
                                                    sx={{
                                                        display: { xs: 'none', md: 'block' },
                                                        fontWeight: 700,
                                                        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                                        WebkitBackgroundClip: 'text',
                                                        WebkitTextFillColor: 'transparent',
                                                        letterSpacing: '.05rem',
                                                    }}
                                                    className="font-bold hidden md:block"
                                                >
                                                    Bayu Angga Loker
                                                </Typography>
                                            </Box>
                                        </Link>
                                    </motion.div>
                                </Box>

                                {/* Search bar - visible on larger screens */}
                                <Box
                                    sx={{
                                        display: { xs: 'none', md: 'flex' },
                                        mx: 'auto',
                                        position: 'relative',
                                        maxWidth: '400px',
                                        width: '100%',
                                    }}
                                    className="hidden md:flex"
                                >
                                    <Box
                                        component="div"
                                        sx={{
                                            position: 'relative',
                                            width: '100%',
                                            borderRadius: 'full',
                                            backgroundColor: alpha(theme.palette.common.black, 0.04),
                                            '&:hover': {
                                                backgroundColor: alpha(theme.palette.common.black, 0.06),
                                            },
                                            transition: 'all 0.2s ease',
                                        }}
                                        className="rounded-full bg-gray-100 dark:bg-gray-800 flex items-center"
                                    >
                                        <IconButton sx={{ p: '10px' }} aria-label="search">
                                            <SearchIcon fontSize="small" color="action" />
                                        </IconButton>
                                        <input
                                            type="text"
                                            placeholder="Search for jobs, companies..."
                                            className="bg-transparent border-none outline-none flex-1 px-2 py-2 text-sm"
                                            style={{ background: 'transparent', border: 'none', outline: 'none', width: '100%' }}
                                        />
                                    </Box>
                                </Box>

                                {/* Right side - notifications, and user menu */}
                                <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto', gap: 0.5 }}>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        animate={newNotificationReceived ? { scale: [1, 1.2, 1], transition: { repeat: 3, duration: 0.5 } } : {}}
                                    >
                                        <Tooltip title="Notifikasi">
                                            <IconButton
                                                onClick={handleOpenNotificationsMenu}
                                                color="primary"
                                                className="text-primary-600 hover:bg-primary-50"
                                                sx={{
                                                    borderRadius: '50%',
                                                    p: 1,
                                                    transition: 'all 0.2s ease-in-out',
                                                }}
                                            >
                                                <Badge
                                                    badgeContent={unreadCount}
                                                    color="error"
                                                    sx={{
                                                        '& .MuiBadge-badge': {
                                                            animation: newNotificationReceived ?
                                                                'pulse 1.5s infinite' : 'none',
                                                            '@keyframes pulse': {
                                                                '0%': { transform: 'scale(1)' },
                                                                '50%': { transform: 'scale(1.2)' },
                                                                '100%': { transform: 'scale(1)' },
                                                            },
                                                        }
                                                    }}
                                                >
                                                    <NotificationsIcon />
                                                </Badge>
                                            </IconButton>
                                        </Tooltip>
                                    </motion.div>

                                    <Menu
                                        sx={{
                                            mt: '45px',
                                            '& .MuiPaper-root': {
                                                borderRadius: 2,
                                                minWidth: 320,
                                                maxWidth: 350,
                                                boxShadow: theme.shadows[3],
                                                mt: 1.5,
                                                '& .MuiMenuItem-root': {
                                                    px: 2,
                                                    py: 1.5,
                                                    my: 0.5,
                                                    borderRadius: 1,
                                                    mx: 0.5,
                                                    '&:hover': {
                                                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                                    },
                                                },
                                            },
                                        }}
                                        id="menu-notifications"
                                        anchorEl={anchorElNotifications}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'right',
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        open={Boolean(anchorElNotifications)}
                                        onClose={handleCloseNotificationsMenu}
                                    >
                                        <Box sx={{ px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                Notifikasi
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                {(unreadCount > 0) && (
                                                    <Badge badgeContent={unreadCount} color="error" sx={{ mr: 1 }}>
                                                        <NotificationsIcon color="primary" fontSize="small" />
                                                    </Badge>
                                                )}
                                                <Tooltip title="Refresh Notifikasi">
                                                    <IconButton
                                                        size="small"
                                                        onClick={fetchLatestNotifications}
                                                        color="primary"
                                                        disabled={refreshing}
                                                    >
                                                        <RefreshIcon fontSize="small" sx={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </Box>

                                        <Divider sx={{ my: 1 }} />

                                        {loading || refreshing ? (
                                            <NotificationsLoading />
                                        ) : notifications && notifications.length > 0 ? (
                                            <Box sx={{ maxHeight: 360, overflowY: 'auto' }}>
                                                {notifications.slice(0, 5).map((notification) => {
                                                    const data = typeof notification.data === 'string'
                                                        ? JSON.parse(notification.data)
                                                        : notification.data;

                                                    const icon = getNotificationIcon(notification.type);
                                                    const typeColor = getTypeColor(notification.type);
                                                    const title = data.title || getDefaultTitle(notification.type);
                                                    const message = data.message || '';
                                                    const actionUrl = data.action_url || '#';

                                                    return (
                                                        <MenuItem
                                                            key={notification.id}
                                                            component={Link}
                                                            href={actionUrl}
                                                            onClick={() => {
                                                                if (!notification.read_at) {
                                                                    handleMarkNotificationAsRead(notification.id);
                                                                }
                                                                handleCloseNotificationsMenu();
                                                            }}
                                                            sx={{
                                                                backgroundColor: notification.read_at ? 'transparent' : alpha(theme.palette.primary.light, 0.1),
                                                                borderLeft: notification.read_at ? 'none' : `3px solid ${theme.palette.primary.main}`,
                                                                position: 'relative',
                                                                '&:hover': {
                                                                    '& .notification-actions': {
                                                                        opacity: 1,
                                                                    }
                                                                }
                                                            }}
                                                        >
                                                            <ListItemIcon sx={{ minWidth: 40 }}>
                                                                <Avatar
                                                                    sx={{
                                                                        width: 36,
                                                                        height: 36,
                                                                        bgcolor: alpha(typeColor, 0.1),
                                                                        color: typeColor
                                                                    }}
                                                                >
                                                                    {icon}
                                                                </Avatar>
                                                            </ListItemIcon>
                                                            <Box sx={{ width: '100%', pr: 1 }}>
                                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                                                                    <Typography variant="subtitle2" sx={{ fontWeight: notification.read_at ? 500 : 700 }}>
                                                                        {title}
                                                                    </Typography>
                                                                    <Box
                                                                        className="notification-actions"
                                                                        sx={{
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            opacity: 0,
                                                                            transition: 'opacity 0.2s ease-in-out',
                                                                            backgroundColor: alpha(theme.palette.background.paper, 0.8),
                                                                            borderRadius: 1,
                                                                            p: '2px',
                                                                            ml: 1
                                                                        }}
                                                                    >
                                                                        {!notification.read_at && (
                                                                            <Tooltip title="Tandai dibaca">
                                                                                <IconButton
                                                                                    size="small"
                                                                                    onClick={(e) => {
                                                                                        e.preventDefault();
                                                                                        e.stopPropagation();
                                                                                        handleMarkNotificationAsRead(notification.id);
                                                                                    }}
                                                                                    sx={{ padding: 0.5, mr: 0.5, color: theme.palette.primary.main }}
                                                                                >
                                                                                    <CheckCircleIcon fontSize="small" />
                                                                                </IconButton>
                                                                            </Tooltip>
                                                                        )}
                                                                        <Tooltip title="Hapus notifikasi">
                                                                            <IconButton
                                                                                size="small"
                                                                                onClick={(e) => {
                                                                                    e.preventDefault();
                                                                                    e.stopPropagation();
                                                                                    handleDeleteNotification(notification.id);
                                                                                }}
                                                                                sx={{ padding: 0.5, color: theme.palette.error.main }}
                                                                            >
                                                                                <DeleteIcon fontSize="small" />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    </Box>
                                                                </Box>
                                                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', mb: 0.5 }}>
                                                                    {message}
                                                                </Typography>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {getRelativeTime(notification.created_at)}
                                                                </Typography>
                                                            </Box>
                                                        </MenuItem>
                                                    );
                                                })}

                                                {notifications.length > 5 && (
                                                    <Box sx={{ p: 1, textAlign: 'center' }}>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Showing 5 of {notifications.length} notifications
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Box>
                                        ) : (
                                            <EmptyNotifications />
                                        )}

                                        <Divider sx={{ my: 1 }} />

                                        <Box sx={{ p: 1 }}>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Link href={getNotificationLink()} style={{ textDecoration: 'none', flex: 1 }}>
                                                    <Button
                                                        variant="outlined"
                                                        fullWidth
                                                        size="small"
                                                        sx={{
                                                            borderRadius: 1,
                                                            textTransform: 'none',
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        Lihat Semua
                                                    </Button>
                                                </Link>
                                                {(unreadCount > 0) && (
                                                    <Button
                                                        variant="text"
                                                        size="small"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleMarkAllAsRead();
                                                        }}
                                                        sx={{
                                                            borderRadius: 1,
                                                            textTransform: 'none',
                                                            fontWeight: 600,
                                                            minWidth: 'auto',
                                                        }}
                                                    >
                                                        Tandai semua dibaca
                                                    </Button>
                                                )}
                                            </Box>
                                        </Box>
                                    </Menu>

                                    <Box sx={{ ml: 0.5 }}>
                                        <Tooltip title="Account settings">
                                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                <IconButton
                                                    onClick={handleOpenUserMenu}
                                                    sx={{ p: 0 }}
                                                    className="ml-2"
                                                >
                                                    <Avatar
                                                        alt={auth.user?.name || ''}
                                                        src={auth.user?.avatar || '/images/default-avatar.png'}
                                                        sx={{
                                                            width: 40,
                                                            height: 40,
                                                            border: `2px solid ${theme.palette.primary.main}`,
                                                            transition: 'all 0.2s ease-in-out',
                                                        }}
                                                        className="shadow-md"
                                                    />
                                                </IconButton>
                                            </motion.div>
                                        </Tooltip>
                                        <Menu
                                            sx={{
                                                mt: '45px',
                                                '& .MuiPaper-root': {
                                                    borderRadius: 2,
                                                    minWidth: 200,
                                                    boxShadow: theme.shadows[3],
                                                    mt: 1.5,
                                                    '& .MuiMenuItem-root': {
                                                        px: 2,
                                                        py: 1,
                                                        my: 0.5,
                                                        borderRadius: 1,
                                                        mx: 0.5,
                                                        '&:hover': {
                                                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                                        },
                                                    },
                                                },
                                            }}
                                            id="menu-appbar"
                                            anchorEl={anchorElUser}
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'right',
                                            }}
                                            keepMounted
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                            open={Boolean(anchorElUser)}
                                            onClose={handleCloseUserMenu}
                                        >
                                            <Box sx={{ px: 2, py: 1.5 }}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                    {auth.user?.name || 'User'}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" noWrap>
                                                    {auth.user?.email || 'user@example.com'}
                                                </Typography>
                                                <Chip
                                                    label={userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                                                    size="small"
                                                    color="primary"
                                                    sx={{ mt: 1 }}
                                                />
                                            </Box>

                                            <Divider sx={{ my: 1 }} />

                                            {getUserMenuItems().map((item) => (
                                                <MenuItem
                                                    key={item.label}
                                                    component={Link}
                                                    href={item.route}
                                                    method={item.method || 'get'}
                                                    onClick={handleCloseUserMenu}
                                                >
                                                    <ListItemIcon sx={{ minWidth: 36, color: theme.palette.primary.main }}>
                                                        {item.icon}
                                                    </ListItemIcon>
                                                    <ListItemText primary={item.label} />
                                                </MenuItem>
                                            ))}
                                        </Menu>
                                    </Box>
                                </Box>
                            </Box>
                        </Toolbar>
                    </Container>
                </AppBar>
            </Slide>

            {/* Mobile drawer menu */}
            <Drawer
                anchor="right"
                open={mobileMenuOpen}
                onClose={toggleMobileMenu}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: '85%',
                        maxWidth: 300,
                        boxShadow: theme.shadows[8],
                        backgroundColor: theme.palette.background.paper,
                    },
                }}
            >
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>Menu</Typography>
                    <IconButton onClick={toggleMobileMenu}>
                        <ChevronRightIcon />
                    </IconButton>
                </Box>
                <Divider />
                {/* Mobile menu content */}
            </Drawer>

            {/* Optional: Test notification button - remove in production */}
            {process.env.NODE_ENV === 'development' && (
                <Tooltip title="Kirim notifikasi test (Development only)">
                    <IconButton
                        sx={{
                            position: 'fixed',
                            bottom: 20,
                            right: 20,
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.2),
                            },
                            zIndex: 1000,
                        }}
                        onClick={async () => {
                            try {
                                const response = await axios.get('/test-notification');
                                if (response.status === 200) {
                                    if (window.showToast) {
                                        window.showToast({
                                            message: 'Notifikasi test berhasil dikirim!',
                                            type: 'success'
                                        });
                                    }
                                }
                            } catch (error) {
                                console.error('Error sending test notification:', error);
                            }
                        }}
                    >
                        <NotificationsIcon />
                    </IconButton>
                </Tooltip>
            )}
        </>
    );
};

export default Header;
