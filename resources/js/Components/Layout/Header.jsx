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
    Notifications as NotificationsIcon,
    Dashboard as DashboardIcon,
    Work as WorkIcon,
    Settings as SettingsIcon,
    Logout as LogoutIcon,
    ChevronRight as ChevronRightIcon,
    Search as SearchIcon,
    Business as BusinessIcon,
    Person as PersonIcon,
    Chat as ChatIcon,
    Assignment as AssignmentIcon,
    EventNote as EventNoteIcon,
    Delete as DeleteIcon,
    CheckCircle as CheckCircleIcon,
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
    const { auth, latestNotifications: initialNotifications, unreadNotificationsCount: initialUnreadCount, unreadMessagesCount: initialUnreadMessagesCount, csrf_token } = usePage().props;
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [anchorElNotifications, setAnchorElNotifications] = useState(null);
    const [anchorElMessages, setAnchorElMessages] = useState(null);
    const [loading, setLoading] = useState(false);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [notifications, setNotifications] = useState(initialNotifications || []);

    // Get stored count from sessionStorage or use initialUnreadCount
    const storedCount = parseInt(sessionStorage.getItem('unreadNotificationsCount'), 10);
    const [unreadCount, setUnreadCount] = useState(
        // Priority: 1. Initial count from props, 2. Stored count from sessionStorage, 3. Default to 0
        initialUnreadCount !== undefined && initialUnreadCount !== null ? initialUnreadCount :
        (!isNaN(storedCount) ? storedCount : 0)
    );

    const [unreadMessagesCount, setUnreadMessagesCount] = useState(initialUnreadMessagesCount || 0);
    const [newNotificationReceived, setNewNotificationReceived] = useState(false);
    const [newMessageReceived, setNewMessageReceived] = useState(false);
    const [recentMessages, setRecentMessages] = useState([]);

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

    // Fetch unread notifications count on mount and periodically
    useEffect(() => {
        // Fetch initial unread count on component mount
        fetchUnreadNotificationsCount();

        // Set up periodic polling for unread notifications count (every 30 seconds)
        const intervalId = setInterval(() => {
            fetchUnreadNotificationsCount();
        }, 30000); // 30 seconds

        // Clean up interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    // Update the useEffect for Inertia page changes
    useEffect(() => {
        // Store the current count in sessionStorage on component mount
        if (unreadCount > 0) {
            sessionStorage.setItem('unreadNotificationsCount', unreadCount);
        }

        const handleBeforeVisit = () => {
            // Save the current unread count before page navigation
            sessionStorage.setItem('unreadNotificationsCount', unreadCount);
        };

        const handleFinish = () => {
            // Re-fetch the unread notifications count after page navigation
            if (auth?.user) {
                fetchUnreadNotificationsCount();
            }
        };

        // Listen for Inertia navigation events
        document.addEventListener('inertia:before', handleBeforeVisit);
        document.addEventListener('inertia:finish', handleFinish);

        return () => {
            document.removeEventListener('inertia:before', handleBeforeVisit);
            document.removeEventListener('inertia:finish', handleFinish);
        };
    }, [unreadCount, auth?.user]);

    // Function to fetch unread notifications count
    const fetchUnreadNotificationsCount = async () => {
        try {
            const basePath = getBasePath();
            const response = await axios.get(`${basePath}/notifications/unread-count`, {
                headers: {
                    'X-CSRF-TOKEN': csrf_token || document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
                }
            });

            if (response.data && (typeof response.data.count === 'number' || typeof response.data.unread_count === 'number')) {
                // Handle both possible response formats
                const count = response.data.count !== undefined ? response.data.count : response.data.unread_count;
                setUnreadCount(count);

                // Always save to sessionStorage when we get a new count
                sessionStorage.setItem('unreadNotificationsCount', count);
            }
        } catch (error) {
            console.error('Error fetching unread notifications count:', error);

            // Fall back to stored value if API request fails
            const storedCount = sessionStorage.getItem('unreadNotificationsCount');
            if (storedCount !== null) {
                setUnreadCount(parseInt(storedCount, 10));
            }
        }
    };

    useEffect(() => {
        const handlePageVisit = () => {
            // Re-fetch the unread notifications count whenever a page navigation occurs
            if (auth?.user) {
                fetchUnreadNotificationsCount();
            }
        };

        // Listen for Inertia page visit events
        document.addEventListener('inertia:finish', handlePageVisit);

        return () => {
            document.removeEventListener('inertia:finish', handlePageVisit);
        };
    }, [auth?.user]);

    // Set up real-time message notifications
    useEffect(() => {
        const userId = auth?.user?.id;
        if (!userId) return;

        // Function to handle new message
        const handleNewMessage = (data) => {
            console.log('📩 New message received:', data);

            // Only show notification for messages where current user is the receiver
            if (data.message && data.message.receiver_id === userId) {
                setNewMessageReceived(true);
                setUnreadMessagesCount(prev => prev + 1);

                // Update recent messages if the messages dropdown is open
                if (Boolean(anchorElMessages)) {
                    fetchRecentMessages();
                }

                // Show browser notification
                if (Notification.permission === 'granted') {
                    const sender = data.message.sender?.name || 'Someone';
                    new Notification('New Message', {
                        body: `${sender}: ${data.message.body?.substring(0, 60)}${data.message.body?.length > 60 ? '...' : ''}`,
                        icon: '/logo.png'
                    });
                }
            }
        };

        // Set up Echo to listen for private messages
        const userRole = auth?.user?.role?.slug || 'guest';
        let channelName;

        if (userRole === 'manager') {
            channelName = `manager.messages.${userId}`;
        } else if (userRole === 'candidate') {
            channelName = `candidate.messages.${userId}`;
        }

        if (window.Echo && channelName) {
            window.Echo.private(channelName)
                .listen('.message.sent', handleNewMessage);
        }

        // Request notification permission
        if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
            Notification.requestPermission();
        }

        return () => {
            if (window.Echo && channelName) {
                window.Echo.leave(channelName);
            }
        };
    }, [auth?.user?.id, auth?.user?.role?.slug]);

    // Configure axios with CSRF token for all requests
    useEffect(() => {
        // Set CSRF token in axios defaults
        axios.defaults.headers.common['X-CSRF-TOKEN'] = csrf_token || document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        // Also set X-Requested-With header to identify AJAX requests
        axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    }, [csrf_token]);

    // Function to fetch recent messages
    const fetchRecentMessages = async () => {
        setMessagesLoading(true);
        try {
            const basePath = getBasePath();
            const response = await axios.get(`${basePath}/messages/recent`, {
                headers: {
                    'X-CSRF-TOKEN': csrf_token || document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
                }
            });
            if (response.data && response.data.conversations) {
                setRecentMessages(response.data.conversations);
                setUnreadMessagesCount(response.data.unreadCount || 0);
                setNewMessageReceived(false);
            }
        } catch (error) {
            console.error('Error fetching recent messages:', error);
        } finally {
            setMessagesLoading(false);
        }
    };

    // Function to fetch latest notifications without page reload
    const fetchLatestNotifications = async () => {
        setRefreshing(true);
        try {
            const basePath = getBasePath();
            const response = await axios.get(`${basePath}/notifications/latest`, {
                headers: {
                    'X-CSRF-TOKEN': csrf_token || document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
                }
            });
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

    // Message indicator animation when new message is received
    useEffect(() => {
        if (newMessageReceived) {
            // Automatically fetch new messages when messages dropdown is opened
            if (Boolean(anchorElMessages)) {
                fetchRecentMessages();
            }
        }
    }, [newMessageReceived, anchorElMessages]);

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

    const handleOpenMessagesMenu = (event) => {
        setAnchorElMessages(event.currentTarget);
        // Fetch recent messages when opening the dropdown
        fetchRecentMessages();
    };

    const handleCloseMessagesMenu = () => {
        setAnchorElMessages(null);
    };

    const handleGoToMessages = () => {
        const basePath = getBasePath();
        handleCloseMessagesMenu();
        router.visit(`${basePath}/messages`);
    };

    const handleGoToConversation = (conversationId) => {
        const basePath = getBasePath();
        handleCloseMessagesMenu();
        router.visit(`${basePath}/messages/${conversationId}`);
    };

    // Get base path for API calls based on user role
    const getBasePath = () => {
        // Access role_id directly from user object
        const roleId = auth?.user?.role_id;

        if (roleId === 1) {
            return '/admin';
        } else if (roleId === 2) {
            return '/manager';
        } else if (roleId === 3) {
            return '/candidate';
        } else {
            return '/';  // Default path for guests or unknown roles
        }
    };


    // Mark notification as read
    const markNotificationAsRead = async (notificationId) => {
        try {
            const basePath = getBasePath();
            await axios.post(`${basePath}/notifications/${notificationId}/read`, {}, {
                headers: {
                    'X-CSRF-TOKEN': csrf_token || document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
                }
            });

            // Update the notifications state to mark this notification as read
            setNotifications(prev =>
                prev.map(notification =>
                    notification.id === notificationId
                        ? { ...notification, read_at: new Date().toISOString() }
                        : notification
                )
            );

            // Update the unread count
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    // Mark all notifications as read
    const markAllNotificationsAsRead = async () => {
        try {
            const basePath = getBasePath();
            await axios.post(`${basePath}/notifications/mark-all-as-read`, {}, {
                headers: {
                    'X-CSRF-TOKEN': csrf_token || document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
                }
            });

            // Update the notifications state to mark all notifications as read
            setNotifications(prev =>
                prev.map(notification =>
                    ({ ...notification, read_at: new Date().toISOString() })
                )
            );

            // Update the unread count
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    // Get user role
    const userRole = auth?.user?.role_id;
    const isAdmin = userRole === 1;
    const isManager = userRole === 2;
    const isCandidate = userRole === 3;

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

    // Handle post requests like logout more securely
    const handlePostAction = (e, route, method) => {
        e.preventDefault();

        router.post(route, { _token: csrf_token }, {
            onSuccess: () => {
                // Success handler if needed
            },
            onError: (errors) => {
                console.error('Error performing action:', errors);
            }
        });
    };

    // Get messages page link based on user role
    const getMessagesLink = () => {
        if (isManager) return route('manager.messages.index');
        if (isCandidate) return route('candidate.messages.index');
        return '#';
    };

    // Get notification link based on user role
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
                        backdropFilter: "blur(12px)",
                        backgroundColor: isScrolled
                            ? alpha(theme.palette.background.paper, 0.85)
                            : alpha(theme.palette.background.paper, 0.75),
                        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                        transition: 'all 0.3s ease-in-out',
                        boxShadow: isScrolled
                            ? `0 4px 20px ${alpha(theme.palette.primary.main, 0.08)}`
                            : 'none',
                    }}
                    className="backdrop-saturate-150"
                >
                    <Container maxWidth="xl">
                        <Toolbar disableGutters className="py-1.5">
                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                {/* Left side - Logo and menu toggle */}
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                                    >
                                        <IconButton
                                            color="primary"
                                            aria-label="open drawer"
                                            onClick={toggleSidebar}
                                            edge="start"
                                            sx={{
                                                mr: 1.5,
                                                bgcolor: alpha(theme.palette.primary.main, 0.08),
                                                '&:hover': {
                                                    bgcolor: alpha(theme.palette.primary.main, 0.15),
                                                    transform: 'translateY(-2px)',
                                                },
                                                transition: 'all 0.2s',
                                                borderRadius: '12px',
                                                width: 40,
                                                height: 40
                                            }}
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
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,
                                                transition: 'transform 0.2s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-2px)'
                                                }
                                            }}>
                                                <Typography
                                                    variant="h6"
                                                    noWrap
                                                    sx={{
                                                        display: { xs: 'none', md: 'block' },
                                                        fontWeight: 800,
                                                        background: 'linear-gradient(90deg, #4F46E5, #06B6D4)',
                                                        WebkitBackgroundClip: 'text',
                                                        WebkitTextFillColor: 'transparent',
                                                        letterSpacing: '-0.5px',
                                                        fontSize: '1.3rem',
                                                    }}
                                                >
                                                    Portal karir Bayu Angga
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
                                        maxWidth: '450px',
                                        width: '100%',
                                    }}
                                >

                                </Box>

                                {/* Right side - notifications, and user menu */}
                                <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto', gap: 1 }}>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        animate={newNotificationReceived ? { scale: [1, 1.2, 1], transition: { repeat: 3, duration: 0.5 } } : {}}
                                    >
                                        <Tooltip title="Notifikasi">
                                            <IconButton
                                                onClick={handleOpenNotificationsMenu}
                                                sx={{
                                                    bgcolor: alpha(theme.palette.warning.main, 0.08),
                                                    color: theme.palette.warning.main,
                                                    '&:hover': {
                                                        bgcolor: alpha(theme.palette.warning.main, 0.15),
                                                        transform: 'translateY(-2px)',
                                                    },
                                                    transition: 'all 0.2s',
                                                    borderRadius: '12px',
                                                    width: 40,
                                                    height: 40
                                                }}
                                            >
                                                <Badge
                                                    badgeContent={unreadCount > 0 ? unreadCount : null}
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
                                                            fontWeight: 'bold',
                                                            minWidth: '18px',
                                                            height: '18px',
                                                            fontSize: '0.7rem',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }
                                                    }}
                                                >
                                                    <NotificationsIcon fontSize="small" />
                                                </Badge>
                                            </IconButton>
                                        </Tooltip>
                                    </motion.div>

                                    <Box sx={{ ml: 0.5 }}>
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <Tooltip title="Account menu">
                                                <IconButton
                                                    onClick={handleOpenUserMenu}
                                                    sx={{
                                                        p: 0.5,
                                                        border: '2px solid',
                                                        borderColor: alpha(theme.palette.primary.main, 0.2),
                                                        transition: 'all 0.2s',
                                                        '&:hover': {
                                                            borderColor: theme.palette.primary.main,
                                                            transform: 'translateY(-2px)',
                                                        },
                                                    }}
                                                >
                                                    <Avatar
                                                        src={auth?.user?.avatar_url || ''}
                                                        alt={auth?.user?.name || 'Avatar'}
                                                        sx={{
                                                            width: 32,
                                                            height: 32,
                                                            boxShadow: `0 0 0 2px ${alpha(theme.palette.background.paper, 0.8)}`
                                                        }}
                                                    />
                                                </IconButton>
                                            </Tooltip>
                                        </motion.div>

                                        <Menu
                                            sx={{ mt: '45px' }}
                                            id="menu-appbar"
                                            anchorEl={anchorElUser}
                                            anchorOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                            keepMounted
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                            open={Boolean(anchorElUser)}
                                            onClose={handleCloseUserMenu}
                                            PaperProps={{
                                                elevation: 6,
                                                sx: {
                                                    overflow: 'visible',
                                                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                                                    mt: 1.5,
                                                    borderRadius: '16px',
                                                    width: 230,
                                                    '&:before': {
                                                        content: '""',
                                                        display: 'block',
                                                        position: 'absolute',
                                                        top: 0,
                                                        right: 14,
                                                        width: 10,
                                                        height: 10,
                                                        bgcolor: 'background.paper',
                                                        transform: 'translateY(-50%) rotate(45deg)',
                                                        zIndex: 0,
                                                    },
                                                },
                                            }}
                                        >
                                            <Box sx={{ px: 2, py: 1.5, textAlign: 'center' }}>
                                                <Avatar
                                                    src={auth?.user?.avatar_url || ''}
                                                    alt={auth?.user?.name || 'Avatar'}
                                                    sx={{
                                                        width: 60,
                                                        height: 60,
                                                        mx: 'auto',
                                                        mb: 1,
                                                        border: '3px solid',
                                                        borderColor: theme.palette.background.paper,
                                                        boxShadow: `0 0 0 2px ${theme.palette.primary.main}`
                                                    }}
                                                />
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                    {auth?.user?.name}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                                    {auth?.user?.email}
                                                </Typography>
                                            </Box>

                                            <Divider sx={{ my: 1 }} />

                                            {getUserMenuItems().map((item) => (
                                                item.method === 'post' ? (
                                                    <MenuItem
                                                        key={item.label}
                                                        onClick={(e) => {
                                                            handleCloseUserMenu();
                                                            handlePostAction(e, item.route, item.method);
                                                        }}
                                                        sx={{
                                                            py: 1.2,
                                                            mx: 1,
                                                            mb: 0.5,
                                                            borderRadius: '12px',
                                                            '&:hover': {
                                                                backgroundColor:
                                                                    item.label === 'Logout'
                                                                        ? alpha(theme.palette.error.main, 0.08)
                                                                        : alpha(theme.palette.primary.main, 0.08),
                                                                '& .MuiListItemIcon-root': {
                                                                    color:
                                                                        item.label === 'Logout'
                                                                            ? theme.palette.error.main
                                                                            : theme.palette.primary.main
                                                                }
                                                            }
                                                        }}
                                                    >
                                                        <ListItemIcon
                                                            sx={{
                                                                minWidth: 36,
                                                                color:
                                                                    item.label === 'Logout'
                                                                        ? theme.palette.error.main
                                                                        : theme.palette.text.secondary,
                                                            }}
                                                        >
                                                            {item.icon}
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={item.label}
                                                            sx={{
                                                                '& .MuiTypography-root': {
                                                                    fontSize: '0.95rem',
                                                                    fontWeight: item.label === 'Logout' ? 600 : 500,
                                                                    color: item.label === 'Logout' ? theme.palette.error.main : 'inherit',
                                                                }
                                                            }}
                                                        />
                                                    </MenuItem>
                                                ) : (
                                                    <Link
                                                        key={item.label}
                                                        href={item.route}
                                                        method={item.method || 'get'}
                                                        as={item.method ? 'button' : 'a'}
                                                        data={{ _token: csrf_token }}
                                                        style={{ display: 'block' }}
                                                    >
                                                        <MenuItem
                                                            onClick={handleCloseUserMenu}
                                                            sx={{
                                                                py: 1.2,
                                                                mx: 1,
                                                                mb: 0.5,
                                                                borderRadius: '12px',
                                                                '&:hover': {
                                                                    backgroundColor:
                                                                        item.label === 'Logout'
                                                                            ? alpha(theme.palette.error.main, 0.08)
                                                                            : alpha(theme.palette.primary.main, 0.08),
                                                                    '& .MuiListItemIcon-root': {
                                                                        color:
                                                                            item.label === 'Logout'
                                                                                ? theme.palette.error.main
                                                                                : theme.palette.primary.main
                                                                    }
                                                                }
                                                            }}
                                                        >
                                                            <ListItemIcon
                                                                sx={{
                                                                    minWidth: 36,
                                                                    color:
                                                                        item.label === 'Logout'
                                                                            ? theme.palette.error.main
                                                                            : theme.palette.text.secondary,
                                                                }}
                                                            >
                                                                {item.icon}
                                                            </ListItemIcon>
                                                            <ListItemText
                                                                primary={item.label}
                                                                sx={{
                                                                    '& .MuiTypography-root': {
                                                                        fontSize: '0.95rem',
                                                                        fontWeight: 500,
                                                                        color:
                                                                            item.label === 'Logout'
                                                                                ? theme.palette.error.main
                                                                                : theme.palette.text.primary
                                                                    }
                                                                }}
                                                            />
                                                        </MenuItem>
                                                    </Link>
                                                )
                                            ))}
                                        </Menu>
                                    </Box>
                                </Box>
                            </Box>
                        </Toolbar>
                    </Container>
                </AppBar>
            </Slide>

            {/* Messages Menu */}
            <Menu
                sx={{ mt: '45px' }}
                id="menu-messages"
                anchorEl={anchorElMessages}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorElMessages)}
                onClose={handleCloseMessagesMenu}
                PaperProps={{
                    sx: {
                        mt: 1.5,
                        width: 320,
                        maxHeight: '80vh',
                        overflowY: 'auto',
                        boxShadow: theme.shadows[4],
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    }
                }}
            >
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                        Messages
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {messagesLoading ? (
                            <IconButton size="small" disabled>
                                <CircularProgress size={18} />
                            </IconButton>
                        ) : (
                            <Tooltip title="Refresh">
                                <IconButton
                                    size="small"
                                    onClick={fetchRecentMessages}
                                    disabled={refreshing}
                                >
                                    <RefreshIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                        <Tooltip title="View all messages">
                            <IconButton
                                size="small"
                                onClick={handleGoToMessages}
                            >
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>
                <Divider />


            </Menu>

            {/* Notifications Menu */}
            <Menu
                sx={{ mt: '45px' }}
                id="notifications-menu"
                anchorEl={anchorElNotifications}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorElNotifications)}
                onClose={handleCloseNotificationsMenu}
                PaperProps={{
                    elevation: 6,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 4px 20px rgba(0,0,0,0.15))',
                        mt: 1.5,
                        borderRadius: '16px',
                        width: { xs: 340, md: 400 },
                        maxHeight: '80vh',
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
            >
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                        Notifikasi
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {unreadCount > 0 && (
                            <Tooltip title="Mark all as read">
                                <IconButton
                                    onClick={markAllNotificationsAsRead}
                                    size="small"
                                    sx={{
                                        bgcolor: alpha(theme.palette.success.main, 0.08),
                                        color: theme.palette.success.main,
                                        '&:hover': {
                                            bgcolor: alpha(theme.palette.success.main, 0.15),
                                        },
                                        width: 34,
                                        height: 34,
                                        borderRadius: '10px'
                                    }}
                                >
                                    <CheckCircleIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                        <Tooltip title="Refresh">
                            <IconButton
                                onClick={fetchLatestNotifications}
                                size="small"
                                disabled={refreshing}
                                sx={{
                                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                                    color: theme.palette.primary.main,
                                    '&:hover': {
                                        bgcolor: alpha(theme.palette.primary.main, 0.15),
                                    },
                                    width: 34,
                                    height: 34,
                                    borderRadius: '10px'
                                }}
                            >
                                {refreshing ? <CircularProgress size={18} /> : <RefreshIcon fontSize="small" />}
                            </IconButton>
                        </Tooltip>

                        <Link href={getNotificationLink()}>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={handleCloseNotificationsMenu}
                                sx={{
                                    borderRadius: '10px',
                                    textTransform: 'none',
                                    fontSize: '0.85rem',
                                    fontWeight: 500,
                                    py: 0.5
                                }}
                            >
                                Lihat Semua
                            </Button>
                        </Link>
                    </Box>
                </Box>

                <Divider />

                <Box
                    sx={{
                        maxHeight: 400,
                        overflowY: 'auto',
                        '&::-webkit-scrollbar': {
                            width: '4px',
                        },
                        '&::-webkit-scrollbar-track': {
                            background: 'transparent',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: theme.palette.divider,
                            borderRadius: '20px',
                        },
                    }}
                >
                    {loading ? (
                        <NotificationsLoading />
                    ) : notifications.length === 0 ? (
                        <EmptyNotifications />
                    ) : (
                        notifications.map((notification) => {
                            const notificationData = notification.data || {};
                            const isRead = !!notification.read_at;
                            const title = (notificationData && notificationData.title) || getDefaultTitle(notification.type);
                            const type = notification.type;
                            const typeColor = getTypeColor(type);

                            return (
                                <Box
                                    key={notification.id}
                                    sx={{
                                        px: 2,
                                        py: 1.5,
                                        position: 'relative',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                        bgcolor: isRead ? 'transparent' : alpha(typeColor, 0.05),
                                        '&:hover': {
                                            bgcolor: alpha(typeColor, 0.08),
                                        },
                                        display: 'flex',
                                        alignItems: 'flex-start'
                                    }}
                                    onClick={() => markNotificationAsRead(notification.id)}
                                >
                                    <Box
                                        sx={{
                                            mr: 2,
                                            mt: 0.5,
                                            p: 1,
                                            borderRadius: '12px',
                                            bgcolor: alpha(typeColor, 0.12),
                                            color: typeColor,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        {getNotificationIcon(type)}
                                    </Box>

                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: isRead ? 500 : 600, mb: 0.5 }}>
                                            {title}
                                            {!isRead && (
                                                <Box
                                                    component="span"
                                                    sx={{
                                                        display: 'inline-block',
                                                        width: 8,
                                                        height: 8,
                                                        bgcolor: theme.palette.error.main,
                                                        borderRadius: '50%',
                                                        ml: 1,
                                                        verticalAlign: 'middle'
                                                    }}
                                                />
                                            )}
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: 'text.secondary',
                                                fontSize: '0.85rem',
                                                mb: 0.5,
                                                lineHeight: 1.4
                                            }}
                                        >
                                            {notificationData.message}
                                        </Typography>

                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: alpha(theme.palette.text.secondary, 0.7),
                                                fontSize: '0.75rem',
                                                fontWeight: 500
                                            }}
                                        >
                                            {getRelativeTime(notification.created_at)}
                                        </Typography>
                                    </Box>
                                </Box>
                            );
                        })
                    )}
                </Box>
            </Menu>

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
