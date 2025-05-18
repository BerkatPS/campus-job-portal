// import React, { useState, useEffect } from 'react';
// import { Head, usePage, Link, router } from '@inertiajs/react';
// import {
//     Box,
//     Typography,
//     Container,
//     Paper,
//     Tabs,
//     Tab,
//     List,
//     Divider,
//     IconButton,
//     Button,
//     Menu,
//     MenuItem,
//     Tooltip,
//     useTheme,
//     alpha,
//     Chip,
//     Pagination
// } from '@mui/material';
// import {
//     Notifications as NotificationsIcon,
//     MoreVert as MoreVertIcon,
//     Check as CheckIcon,
//     Delete as DeleteIcon,
//     FilterList as FilterListIcon,
//     Work as WorkIcon,
//     Business as BusinessIcon,
//     Event as EventIcon,
//     Email as EmailIcon,
//     Settings as SettingsIcon,
//     Dashboard as DashboardIcon,
//     Chat as ChatIcon,
//     NotificationsActive as NotificationsActiveIcon,
//     NotificationsOff as NotificationsOffIcon,
//     WarningAmber as WarningIcon,
//     Assignment as AssignmentIcon,
//     Person as PersonIcon,
//     Error as ErrorIcon,
//     ChevronRight as ChevronRightIcon
// } from '@mui/icons-material';
// import Layout from '@/Components/Layout/AdminLayout';
// import { motion } from 'framer-motion';
// import moment from 'moment';
// import 'moment/locale/id';
// import NotificationItem from '@/Components/Notifications/NotificationItem';
// import EmptyNotifications from '@/Components/Notifications/EmptyNotifications';
// import NotificationsLoading from '@/Components/Notifications/NotificationsLoading';
//
// const AdminNotificationsPage = () => {
//     const { auth, notifications, unreadCount } = usePage().props;
//     const theme = useTheme();
//     const [activeTab, setActiveTab] = useState(0);
//     const [anchorEl, setAnchorEl] = useState(null);
//     const [filterAnchorEl, setFilterAnchorEl] = useState(null);
//     const [selectedFilter, setSelectedFilter] = useState('all');
//     const [loading, setLoading] = useState(false);
//     const [currentNotifications, setCurrentNotifications] = useState([]);
//     const [refreshing, setRefreshing] = useState(false);
//
//     // Format notifications from backend
//     useEffect(() => {
//         if (notifications && notifications.data) {
//             const formattedNotifications = notifications.data.map(notification => {
//                 const data = typeof notification.data === 'string'
//                     ? JSON.parse(notification.data)
//                     : notification.data;
//
//                 return {
//                     id: notification.id,
//                     title: data.title || getDefaultTitle(notification.type),
//                     message: data.message || '',
//                     time: moment(notification.created_at).fromNow(),
//                     date: moment(notification.created_at).format('YYYY-MM-DD'),
//                     type: getNotificationType(notification.type),
//                     read: notification.read_at !== null,
//                     icon: getNotificationIcon(notification.type),
//                     route: data.action_url || '#',
//                     action_text: data.action_text || 'Lihat Detail',
//                     originalData: data
//                 };
//             });
//
//             setCurrentNotifications(formattedNotifications);
//         }
//     }, [notifications]);
//
//     const getNotificationType = (type) => {
//         if (type.includes('Job')) return 'job';
//         if (type.includes('Application')) return 'application';
//         if (type.includes('Interview')) return 'interview';
//         if (type.includes('Company')) return 'company';
//         if (type.includes('Message') || type.includes('Chat')) return 'message';
//         if (type.includes('Forum')) return 'forum';
//         if (type.includes('System')) return 'system';
//         if (type.includes('User')) return 'user';
//         if (type.includes('Platform')) return 'system';
//         return 'system';
//     };
//
//     const getDefaultTitle = (type) => {
//         const parts = type.split('\\');
//         const className = parts[parts.length - 1];
//         // Convert camelCase to Title Case with spaces
//         return className.replace(/([A-Z])/g, ' $1').trim();
//     };
//
//     const getNotificationIcon = (type) => {
//         const notificationType = getNotificationType(type);
//
//         switch (notificationType) {
//             case 'job':
//                 return <WorkIcon />;
//             case 'application':
//                 return <AssignmentIcon />;
//             case 'interview':
//                 return <EventIcon />;
//             case 'company':
//                 return <BusinessIcon />;
//             case 'message':
//                 return <ChatIcon />;
//             case 'system':
//                 return <SettingsIcon />;
//             case 'forum':
//                 return <ChatIcon />;
//             case 'newsletter':
//                 return <EmailIcon />;
//             case 'error':
//                 return <ErrorIcon />;
//             case 'warning':
//                 return <WarningIcon />;
//             case 'user':
//                 return <PersonIcon />;
//             default:
//                 return <NotificationsIcon />;
//         }
//     };
//
//     const handleTabChange = (event, newValue) => {
//         setActiveTab(newValue);
//     };
//
//     const handleMenuOpen = (event) => {
//         setAnchorEl(event.currentTarget);
//     };
//
//     const handleMenuClose = () => {
//         setAnchorEl(null);
//     };
//
//     const handleFilterMenuOpen = (event) => {
//         setFilterAnchorEl(event.currentTarget);
//     };
//
//     const handleFilterMenuClose = () => {
//         setFilterAnchorEl(null);
//     };
//
//     const handleFilterSelect = (filter) => {
//         setSelectedFilter(filter);
//         setFilterAnchorEl(null);
//     };
//
//     const handleMarkAllAsRead = () => {
//         setLoading(true);
//
//         router.post(`/admin/notifications/mark-all-as-read`, {}, {
//             onSuccess: () => {
//                 // Update UI setelah berhasil
//                 setCurrentNotifications(currentNotifications.map(notification => ({
//                     ...notification,
//                     read: true
//                 })));
//                 setAnchorEl(null);
//             },
//             onFinish: () => {
//                 setLoading(false);
//             }
//         });
//     };
//
//     const handleDeleteAll = () => {
//         if (confirm('Apakah Anda yakin ingin menghapus semua notifikasi?')) {
//             // Karena tidak ada endpoint khusus untuk menghapus semua notifikasi,
//             // kita hanya reload halaman
//             router.reload();
//         }
//     };
//
//     const handleMarkAsRead = (id) => {
//         setLoading(true);
//
//         router.post(`/admin/notifications/${id}/mark-as-read`, {}, {
//             onSuccess: () => {
//                 // Update UI setelah berhasil
//                 setCurrentNotifications(currentNotifications.map(notification =>
//                     notification.id === id ? { ...notification, read: true } : notification
//                 ));
//             },
//             onFinish: () => {
//                 setLoading(false);
//             }
//         });
//     };
//
//     const handleDelete = (id) => {
//         setLoading(true);
//
//         router.delete(`/admin/notifications/${id}`, {}, {
//             onSuccess: () => {
//                 // Update UI setelah berhasil
//                 setCurrentNotifications(currentNotifications.filter(notification => notification.id !== id));
//             },
//             onFinish: () => {
//                 setLoading(false);
//             }
//         });
//     };
//
//     // Handle pagination
//     const handlePageChange = (event, page) => {
//         router.visit(`/admin/notifications?page=${page}`, {
//             preserveState: true,
//             only: ['notifications']
//         });
//     };
//
//     // Fetch latest notifications
//     const fetchLatestNotifications = async () => {
//         setRefreshing(true);
//
//         try {
//             router.reload({
//                 only: ['notifications', 'unreadCount'],
//                 onSuccess: () => {
//                     setRefreshing(false);
//                 }
//             });
//         } catch (error) {
//             console.error('Error fetching notifications:', error);
//             setRefreshing(false);
//         }
//     };
//
//     // Filter notifications based on active tab and selected filter
//     const filteredNotifications = currentNotifications.filter(notification => {
//         if (activeTab === 0) {
//             return selectedFilter === 'all' || notification.type === selectedFilter;
//         } else if (activeTab === 1) {
//             return !notification.read && (selectedFilter === 'all' || notification.type === selectedFilter);
//         } else {
//             return notification.read && (selectedFilter === 'all' || notification.type === selectedFilter);
//         }
//     });
//
//     // Get notification type icons for filter menu
//     const notificationTypes = [
//         { type: 'all', label: 'Semua', icon: <NotificationsIcon /> },
//         { type: 'job', label: 'Lowongan', icon: <WorkIcon /> },
//         { type: 'application', label: 'Lamaran', icon: <AssignmentIcon /> },
//         { type: 'company', label: 'Perusahaan', icon: <BusinessIcon /> },
//         { type: 'user', label: 'Pengguna', icon: <PersonIcon /> },
//         { type: 'system', label: 'Sistem', icon: <SettingsIcon /> }
//     ];
//
//     // Get the selected filter label
//     const selectedFilterLabel = notificationTypes.find(type => type.type === selectedFilter)?.label || 'Semua';
//
//     // Get unread count for current filter
//     const filteredUnreadCount =
//         selectedFilter === 'all'
//             ? unreadCount
//             : currentNotifications.filter(n => !n.read && n.type === selectedFilter).length;
//
//     const getTypeColor = (type) => {
//         switch (type) {
//             case 'job':
//                 return theme.palette.primary.main;
//             case 'application':
//                 return theme.palette.success.main;
//             case 'interview':
//                 return theme.palette.warning.main;
//             case 'company':
//                 return theme.palette.info.main;
//             case 'message':
//                 return theme.palette.secondary.main;
//             case 'system':
//                 return theme.palette.grey[700];
//             case 'forum':
//                 return theme.palette.purple?.main || '#9c27b0';
//             case 'error':
//                 return theme.palette.error.main;
//             case 'user':
//                 return theme.palette.indigo?.main || '#3f51b5';
//             default:
//                 return theme.palette.primary.main;
//         }
//     };
//
//     // Handle item click to navigate to the notification's target
//     const handleNotificationClick = (notification) => {
//         // Mark as read
//         if (!notification.read) {
//             handleMarkAsRead(notification.id);
//         }
//
//         // Navigate to the action URL
//         if (notification.route && notification.route !== '#') {
//             router.visit(notification.route);
//         }
//     };
//
//     const getPageTitle = () => {
//         if (activeTab === 0) {
//             return 'Notifikasi';
//         } else if (activeTab === 1) {
//             return `Notifikasi Belum Dibaca (${filteredUnreadCount})`;
//         } else {
//             return `Notifikasi Sudah Dibaca (${filteredNotifications.length})`;
//         }
//     };
//
//     return (
//         <Layout>
//             <Head title={getPageTitle()} />
//             <Container maxWidth="lg" sx={{ py: 4 }}>
//                 <Box
//                     component={motion.div}
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.3 }}
//                     sx={{ mb: 4 }}
//                 >
//                     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                             <NotificationsIcon fontSize="large" color="primary" />
//                             <Typography variant="h4" component="h1" fontWeight={700}>
//                                 Notifikasi Admin
//                             </Typography>
//                             {unreadCount > 0 && (
//                                 <Chip
//                                     label={`${unreadCount} baru`}
//                                     size="small"
//                                     color="primary"
//                                     sx={{ fontWeight: 600, ml: 1 }}
//                                 />
//                             )}
//                         </Box>
//                         <Box sx={{ display: 'flex', gap: 1 }}>
//                             <Button
//                                 variant="outlined"
//                                 color="primary"
//                                 startIcon={<FilterListIcon />}
//                                 onClick={handleFilterMenuOpen}
//                                 sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
//                             >
//                                 {selectedFilterLabel}
//                             </Button>
//                             <Tooltip title="Opsi lainnya">
//                                 <IconButton onClick={handleMenuOpen}>
//                                     <MoreVertIcon />
//                                 </IconButton>
//                             </Tooltip>
//                         </Box>
//                     </Box>
//
//                     <Paper
//                         elevation={0}
//                         variant="outlined"
//                         sx={{
//                             borderRadius: 2,
//                             overflow: 'hidden'
//                         }}
//                     >
//                         <Tabs
//                             value={activeTab}
//                             onChange={handleTabChange}
//                             sx={{
//                                 borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
//                                 '& .MuiTab-root': {
//                                     py: 2,
//                                     textTransform: 'none',
//                                     fontWeight: 600,
//                                     minWidth: 100
//                                 }
//                             }}
//                         >
//                             <Tab label="Semua" />
//                             <Tab
//                                 label={
//                                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//                                         <Typography>Belum Dibaca</Typography>
//                                         {unreadCount > 0 && (
//                                             <Chip
//                                                 size="small"
//                                                 label={unreadCount}
//                                                 color="error"
//                                                 sx={{ height: 20, minWidth: 20, fontSize: '0.75rem' }}
//                                             />
//                                         )}
//                                     </Box>
//                                 }
//                             />
//                             <Tab label="Sudah Dibaca" />
//                         </Tabs>
//
//                         <List disablePadding>
//                             {loading ? (
//                                 <NotificationsLoading />
//                             ) : filteredNotifications.length === 0 ? (
//                                 <EmptyNotifications />
//                             ) : (
//                                 filteredNotifications.map((notification, index) => (
//                                     <React.Fragment key={notification.id || index}>
//                                         <NotificationItem
//                                             notification={notification}
//                                             onClick={() => handleNotificationClick(notification)}
//                                             onMarkAsRead={() => handleMarkAsRead(notification.id)}
//                                             onDelete={() => handleDelete(notification.id)}
//                                             color={getTypeColor(notification.type)}
//                                         />
//                                         {index < filteredNotifications.length - 1 && <Divider />}
//                                     </React.Fragment>
//                                 ))
//                             )}
//                         </List>
//
//                         {notifications && notifications.meta && notifications.meta.last_page > 1 && (
//                             <Box
//                                 sx={{
//                                     display: 'flex',
//                                     justifyContent: 'center',
//                                     pt: 2,
//                                     pb: 2,
//                                     borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`
//                                 }}
//                             >
//                                 <Pagination
//                                     count={notifications.meta.last_page}
//                                     page={notifications.meta.current_page}
//                                     onChange={handlePageChange}
//                                     color="primary"
//                                     shape="rounded"
//                                 />
//                             </Box>
//                         )}
//                     </Paper>
//                 </Box>
//             </Container>
//
//             {/* Filter Menu */}
//             <Menu
//                 anchorEl={filterAnchorEl}
//                 open={Boolean(filterAnchorEl)}
//                 onClose={handleFilterMenuClose}
//                 PaperProps={{
//                     elevation: 2,
//                     sx: {
//                         minWidth: 180,
//                         borderRadius: 2,
//                         mt: 1,
//                         '& .MuiMenuItem-root': {
//                             px: 2,
//                             py: 1,
//                         }
//                     }
//                 }}
//             >
//                 {notificationTypes.map((type) => (
//                     <MenuItem
//                         key={type.type}
//                         onClick={() => handleFilterSelect(type.type)}
//                         selected={selectedFilter === type.type}
//                         sx={{
//                             borderRadius: 1,
//                             my: 0.5,
//                             mx: 0.5
//                         }}
//                     >
//                         <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
//                             <Box sx={{ mr: 1.5, color: getTypeColor(type.type) }}>{type.icon}</Box>
//                             <Typography variant="body2">{type.label}</Typography>
//                             {selectedFilter === type.type && (
//                                 <Box sx={{ ml: 'auto' }}>
//                                     <CheckIcon fontSize="small" color="primary" />
//                                 </Box>
//                             )}
//                         </Box>
//                     </MenuItem>
//                 ))}
//             </Menu>
//
//             {/* Actions Menu */}
//             <Menu
//                 anchorEl={anchorEl}
//                 open={Boolean(anchorEl)}
//                 onClose={handleMenuClose}
//                 PaperProps={{
//                     elevation: 2,
//                     sx: {
//                         minWidth: 200,
//                         borderRadius: 2,
//                         mt: 1,
//                         '& .MuiMenuItem-root': {
//                             px: 2,
//                             py: 1,
//                         }
//                     }
//                 }}
//             >
//                 <MenuItem
//                     onClick={fetchLatestNotifications}
//                     disabled={refreshing}
//                     sx={{ borderRadius: 1, my: 0.5, mx: 0.5 }}
//                 >
//                     <Box sx={{ mr: 1.5, color: theme.palette.primary.main }}>
//                         {refreshing ? <NotificationsIcon fontSize="small" /> : <NotificationsIcon fontSize="small" />}
//                     </Box>
//                     <Typography variant="body2">{refreshing ? 'Memuat...' : 'Muat Ulang'}</Typography>
//                 </MenuItem>
//
//                 {unreadCount > 0 && (
//                     <MenuItem
//                         onClick={handleMarkAllAsRead}
//                         sx={{ borderRadius: 1, my: 0.5, mx: 0.5 }}
//                     >
//                         <Box sx={{ mr: 1.5, color: theme.palette.success.main }}>
//                             <NotificationsOffIcon fontSize="small" />
//                         </Box>
//                         <Typography variant="body2">Tandai Semua Dibaca</Typography>
//                     </MenuItem>
//                 )}
//
//                 <MenuItem
//                     onClick={handleDeleteAll}
//                     sx={{ borderRadius: 1, my: 0.5, mx: 0.5 }}
//                 >
//                     <Box sx={{ mr: 1.5, color: theme.palette.error.main }}>
//                         <DeleteIcon fontSize="small" />
//                     </Box>
//                     <Typography variant="body2">Hapus Semua</Typography>
//                 </MenuItem>
//             </Menu>
//         </Layout>
//     );
// };
//
// export default AdminNotificationsPage;
