import React, { useState, useEffect } from 'react';
import { Head, usePage, Link, router } from '@inertiajs/react';
import {
    Box,
    Typography,
    Container,
    Paper,
    Tabs,
    Tab,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    IconButton,
    Button,
    Menu,
    MenuItem,
    Tooltip,
    useTheme,
    alpha,
    Card,
    CardContent,
    Chip,
    Avatar,
    Pagination
} from '@mui/material';
import {
    Notifications as NotificationsIcon,
    MoreVert as MoreVertIcon,
    Check as CheckIcon,
    Delete as DeleteIcon,
    FilterList as FilterListIcon,
    Work as WorkIcon,
    Business as BusinessIcon,
    Event as EventIcon,
    Email as EmailIcon,
    Settings as SettingsIcon,
    Dashboard as DashboardIcon,
    Edit as EditIcon,
    Chat as ChatIcon,
    NotificationsActive as NotificationsActiveIcon,
    NotificationsOff as NotificationsOffIcon,
    WarningAmber as WarningIcon,
    Assignment as AssignmentIcon,
    Person as PersonIcon,
    Error as ErrorIcon
} from '@mui/icons-material';
import Layout from '@/Components/Layout/Layout';
import { motion } from 'framer-motion';
import moment from 'moment';
import 'moment/locale/id';

const NotificationsPage = () => {
    const { auth, notifications, unreadCount } = usePage().props;
    const theme = useTheme();
    const [activeTab, setActiveTab] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const [filterAnchorEl, setFilterAnchorEl] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [loading, setLoading] = useState(false);
    const [currentNotifications, setCurrentNotifications] = useState([]);

    // Format notifications from backend
    useEffect(() => {
        if (notifications && notifications.data) {
            const formattedNotifications = notifications.data.map(notification => {
                const data = typeof notification.data === 'string'
                    ? JSON.parse(notification.data)
                    : notification.data;

                return {
                    id: notification.id,
                    title: data.title || getDefaultTitle(notification.type),
                    message: data.message || '',
                    time: moment(notification.created_at).fromNow(),
                    date: moment(notification.created_at).format('YYYY-MM-DD'),
                    type: getNotificationType(notification.type),
                    read: notification.read_at !== null,
                    icon: getNotificationIcon(notification.type),
                    route: data.action_url || '#',
                    action_text: data.action_text || 'Lihat Detail',
                    originalData: data
                };
            });

            setCurrentNotifications(formattedNotifications);
        }
    }, [notifications]);

    const getNotificationType = (type) => {
        if (type.includes('Job')) return 'job';
        if (type.includes('Application')) return 'application';
        if (type.includes('Interview')) return 'interview';
        if (type.includes('Company')) return 'company';
        if (type.includes('Message') || type.includes('Chat')) return 'message';
        if (type.includes('Forum')) return 'forum';
        if (type.includes('Welcome') || type.includes('System')) return 'system';
        return 'system';
    };

    const getDefaultTitle = (type) => {
        const parts = type.split('\\');
        const className = parts[parts.length - 1];
        // Convert camelCase to Title Case with spaces
        return className.replace(/([A-Z])/g, ' $1').trim();
    };

    const getNotificationIcon = (type) => {
        const notificationType = getNotificationType(type);

        switch (notificationType) {
            case 'job':
                return <WorkIcon />;
            case 'application':
                return <AssignmentIcon />;
            case 'interview':
                return <EventIcon />;
            case 'company':
                return <BusinessIcon />;
            case 'message':
                return <ChatIcon />;
            case 'system':
                return <SettingsIcon />;
            case 'forum':
                return <ChatIcon />;
            case 'newsletter':
                return <EmailIcon />;
            case 'error':
                return <ErrorIcon />;
            case 'warning':
                return <WarningIcon />;
            case 'user':
                return <PersonIcon />;
            default:
                return <NotificationsIcon />;
        }
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleFilterMenuOpen = (event) => {
        setFilterAnchorEl(event.currentTarget);
    };

    const handleFilterMenuClose = () => {
        setFilterAnchorEl(null);
    };

    const handleFilterSelect = (filter) => {
        setSelectedFilter(filter);
        setFilterAnchorEl(null);
    };

    const handleMarkAllAsRead = () => {
        setLoading(true);
        const basePath = getBasePath();

        // Gunakan rute yang benar untuk mark-all-as-read
        router.post(`${basePath}/notifications/mark-all-as-read`, {}, {
            onSuccess: () => {
                // Update UI setelah berhasil
                setCurrentNotifications(currentNotifications.map(notification => ({
                    ...notification,
                    read: true
                })));
                setAnchorEl(null);
            },
            onFinish: () => {
                setLoading(false);
            }
        });
    };

    const handleDeleteAll = () => {
        if (confirm('Apakah Anda yakin ingin menghapus semua notifikasi?')) {
            // Karena tidak ada endpoint khusus untuk menghapus semua notifikasi,
            // kita hanya reload halaman
            router.reload();
        }
    };

    const handleMarkAsRead = (id) => {
        setLoading(true);
        const basePath = getBasePath();

        // Gunakan rute yang benar untuk mark-as-read (perhatikan parameter)
        router.post(`${basePath}/notifications/${id}/mark-as-read`, {}, {
            onSuccess: () => {
                // Update UI setelah berhasil
                setCurrentNotifications(currentNotifications.map(notification =>
                    notification.id === id ? { ...notification, read: true } : notification
                ));
            },
            onFinish: () => {
                setLoading(false);
            }
        });
    };

    const handleDelete = (id) => {
        setLoading(true);
        const basePath = getBasePath();

        // Gunakan rute yang benar untuk delete
        router.delete(`${basePath}/notifications/${id}`, {}, {
            onSuccess: () => {
                // Update UI setelah berhasil
                setCurrentNotifications(currentNotifications.filter(notification => notification.id !== id));
            },
            onFinish: () => {
                setLoading(false);
            }
        });
    };

    // Helper to get the base path for API calls based on user role
    const getBasePath = () => {
        if (auth.user.role.slug === 'admin') {
            return '/admin';
        } else if (auth.user.role.slug === 'manager') {
            return '/manager';
        } else {
            return '/candidate';
        }
    };

    // Handle pagination
    const handlePageChange = (event, page) => {
        router.visit(`${getBasePath()}/notifications?page=${page}`, {
            preserveState: true,
            only: ['notifications']
        });
    };

    // Filter notifications based on active tab and selected filter
    const filteredNotifications = currentNotifications.filter(notification => {
        if (activeTab === 0) {
            return selectedFilter === 'all' || notification.type === selectedFilter;
        } else if (activeTab === 1) {
            return !notification.read && (selectedFilter === 'all' || notification.type === selectedFilter);
        } else {
            return notification.read && (selectedFilter === 'all' || notification.type === selectedFilter);
        }
    });

    // Get notification type icons for filter menu
    const notificationTypes = [
        { type: 'all', label: 'Semua', icon: <NotificationsIcon /> },
        { type: 'job', label: 'Lowongan', icon: <WorkIcon /> },
        { type: 'application', label: 'Lamaran', icon: <AssignmentIcon /> },
        { type: 'interview', label: 'Interview', icon: <EventIcon /> },
        { type: 'company', label: 'Perusahaan', icon: <BusinessIcon /> },
        { type: 'message', label: 'Pesan', icon: <ChatIcon /> },
        { type: 'system', label: 'Sistem', icon: <SettingsIcon /> },
        { type: 'forum', label: 'Forum', icon: <ChatIcon /> }
    ];

    // Get the selected filter label
    const selectedFilterLabel = notificationTypes.find(type => type.type === selectedFilter)?.label || 'Semua';

    // Get unread count for current filter
    const filteredUnreadCount =
        selectedFilter === 'all'
            ? unreadCount
            : currentNotifications.filter(n => !n.read && n.type === selectedFilter).length;

    const getTypeColor = (type) => {
        switch (type) {
            case 'job':
                return theme.palette.primary.main;
            case 'application':
                return theme.palette.success.main;
            case 'interview':
                return theme.palette.warning.main;
            case 'company':
                return theme.palette.info.main;
            case 'message':
                return theme.palette.secondary.main;
            case 'system':
                return theme.palette.grey[700];
            case 'forum':
                return theme.palette.purple?.main || '#9c27b0';
            case 'error':
                return theme.palette.error.main;
            default:
                return theme.palette.primary.main;
        }
    };

    // Handle item click to navigate to the notification's target
    const handleNotificationClick = (notification) => {
        // Mark as read
        if (!notification.read) {
            handleMarkAsRead(notification.id);
        }

        // Navigate to the action URL
        if (notification.route && notification.route !== '#') {
            router.visit(notification.route);
        }
    };

    const getPageTitle = () => {
        if (auth.user.role.slug === 'admin') {
            return "Admin Notifications";
        } else if (auth.user.role.slug === 'manager') {
            return "Manager Notifications";
        } else {
            return "Notifikasi";
        }
    };

    return (
        <Layout>
            <Head title={getPageTitle()} />
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box
                    component={motion.div}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    sx={{ mb: 4 }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <NotificationsIcon fontSize="large" color="primary" />
                            <Typography variant="h4" component="h1" fontWeight={700}>
                                Notifikasi
                            </Typography>
                            {unreadCount > 0 && (
                                <Chip
                                    label={`${unreadCount} baru`}
                                    size="small"
                                    color="primary"
                                    sx={{ fontWeight: 600, ml: 1 }}
                                />
                            )}
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<FilterListIcon />}
                                onClick={handleFilterMenuOpen}
                                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                            >
                                {selectedFilterLabel}
                            </Button>
                            <Tooltip title="Opsi lainnya">
                                <IconButton onClick={handleMenuOpen}>
                                    <MoreVertIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>

                    <Paper
                        elevation={0}
                        variant="outlined"
                        sx={{
                            borderRadius: 2,
                            overflow: 'hidden'
                        }}
                    >
                        <Tabs
                            value={activeTab}
                            onChange={handleTabChange}
                            sx={{
                                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                '& .MuiTab-root': {
                                    py: 2,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    minWidth: 100
                                }
                            }}
                        >
                            <Tab label="Semua" />
                            <Tab
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Typography>Belum Dibaca</Typography>
                                        {unreadCount > 0 && (
                                            <Chip
                                                label={unreadCount}
                                                size="small"
                                                color="primary"
                                                sx={{ fontWeight: 600, height: 20, minWidth: 20 }}
                                            />
                                        )}
                                    </Box>
                                }
                            />
                            <Tab label="Sudah Dibaca" />
                        </Tabs>

                        {loading && (
                            <Box sx={{ p: 4, textAlign: 'center' }}>
                                <Typography>Memuat notifikasi...</Typography>
                            </Box>
                        )}

                        {!loading && filteredNotifications.length > 0 ? (
                            <List disablePadding>
                                {filteredNotifications.map((notification, index) => (
                                    <React.Fragment key={notification.id}>
                                        {index > 0 && <Divider component="li" />}
                                        <ListItem
                                            sx={{
                                                py: 2,
                                                px: 3,
                                                backgroundColor: notification.read ? 'transparent' : alpha(theme.palette.primary.light, 0.05),
                                                borderLeft: notification.read ? 'none' : `4px solid ${theme.palette.primary.main}`,
                                                transition: 'all 0.2s ease',
                                                '&:hover': {
                                                    backgroundColor: alpha(theme.palette.primary.light, 0.1),
                                                    cursor: 'pointer'
                                                }
                                            }}
                                            onClick={() => handleNotificationClick(notification)}
                                        >
                                            <ListItemIcon sx={{ minWidth: 40 }}>
                                                <Avatar
                                                    sx={{
                                                        width: 40,
                                                        height: 40,
                                                        bgcolor: alpha(getTypeColor(notification.type), 0.1),
                                                        color: getTypeColor(notification.type)
                                                    }}
                                                >
                                                    {notification.icon}
                                                </Avatar>
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Typography variant="subtitle1" fontWeight={notification.read ? 500 : 700}>
                                                            {notification.title}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {notification.time}
                                                        </Typography>
                                                    </Box>
                                                }
                                                secondary={
                                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                                        {notification.message}
                                                    </Typography>
                                                }
                                                sx={{ my: 0 }}
                                            />
                                            <Box sx={{ display: 'flex', ml: 1 }}>
                                                {!notification.read && (
                                                    <Tooltip title="Tandai sudah dibaca">
                                                        <IconButton
                                                            size="small"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleMarkAsRead(notification.id);
                                                            }}
                                                            sx={{ color: theme.palette.primary.main }}
                                                        >
                                                            <CheckIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                                <Tooltip title="Hapus notifikasi">
                                                    <IconButton
                                                        size="small"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDelete(notification.id);
                                                        }}
                                                        sx={{ color: theme.palette.error.main }}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </ListItem>
                                    </React.Fragment>
                                ))}
                            </List>
                        ) : (
                            !loading && (
                                <Box sx={{ py: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                    {activeTab === 1 ? (
                                        <NotificationsOffIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                                    ) : (
                                        <NotificationsIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                                    )}
                                    <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                                        {activeTab === 1
                                            ? 'Tidak ada notifikasi yang belum dibaca'
                                            : activeTab === 2
                                                ? 'Tidak ada notifikasi yang sudah dibaca'
                                                : 'Tidak ada notifikasi'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {activeTab === 1
                                            ? 'Semua notifikasi Anda telah dibaca'
                                            : activeTab === 2
                                                ? 'Anda belum memiliki notifikasi yang sudah dibaca'
                                                : 'Anda akan menerima notifikasi tentang lowongan, aplikasi, dan aktivitas lainnya di sini'}
                                    </Typography>
                                </Box>
                            )
                        )}

                        {/* Pagination */}
                        {notifications && notifications.links && notifications.links.length > 3 && (
                            <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                                <Pagination
                                    count={Math.ceil(notifications.total / notifications.per_page)}
                                    page={notifications.current_page}
                                    onChange={handlePageChange}
                                    color="primary"
                                    shape="rounded"
                                />
                            </Box>
                        )}
                    </Paper>
                </Box>

                {/* Additional Info Card */}
                <Box
                    component={motion.div}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                >
                    <Card variant="outlined" sx={{ borderRadius: 2 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                Pengaturan Notifikasi
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Anda dapat mengubah preferensi notifikasi Anda di halaman pengaturan. Pilih jenis notifikasi yang ingin Anda terima melalui email atau di platform.
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<SettingsIcon />}
                                component={Link}
                                href={`${getBasePath()}/profile`}
                                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                            >
                                Atur Preferensi Notifikasi
                            </Button>
                        </CardContent>
                    </Card>
                </Box>
            </Container>

            {/* Options Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                    elevation: 2,
                    sx: {
                        minWidth: 200,
                        borderRadius: 2,
                        mt: 1,
                        boxShadow: theme.shadows[3],
                    },
                }}
            >
                <MenuItem onClick={handleMarkAllAsRead} sx={{ py: 1.5 }} disabled={loading || unreadCount === 0}>
                    <ListItemIcon>
                        <CheckIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Tandai semua sudah dibaca" />
                </MenuItem>
                <MenuItem onClick={handleDeleteAll} sx={{ py: 1.5 }} disabled={loading || currentNotifications.length === 0}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText primary="Hapus semua notifikasi" />
                </MenuItem>
            </Menu>

            {/* Filter Menu */}
            <Menu
                anchorEl={filterAnchorEl}
                open={Boolean(filterAnchorEl)}
                onClose={handleFilterMenuClose}
                PaperProps={{
                    elevation: 2,
                    sx: {
                        minWidth: 200,
                        borderRadius: 2,
                        mt: 1,
                        boxShadow: theme.shadows[3],
                    },
                }}
            >
                {notificationTypes.map((type) => (
                    <MenuItem
                        key={type.type}
                        onClick={() => handleFilterSelect(type.type)}
                        selected={selectedFilter === type.type}
                        sx={{
                            py: 1.5,
                            borderRadius: 1,
                            mx: 0.5,
                            my: 0.2
                        }}
                    >
                        <ListItemIcon sx={{ color: selectedFilter === type.type ? theme.palette.primary.main : 'inherit' }}>
                            {type.icon}
                        </ListItemIcon>
                        <ListItemText
                            primary={type.label}
                            primaryTypographyProps={{
                                fontWeight: selectedFilter === type.type ? 600 : 400
                            }}
                        />
                    </MenuItem>
                ))}
            </Menu>
        </Layout>
    );
};

export default NotificationsPage;
