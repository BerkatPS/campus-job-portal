import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Typography,
    Avatar,
    IconButton,
    Tooltip,
    useTheme,
    useMediaQuery,
    alpha,
    InputBase,
    Paper,
    Chip
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    Business as BusinessIcon,
    Work as WorkIcon,
    People as PeopleIcon,
    Person as PersonIcon,
    Settings as SettingsIcon,
    Event as EventIcon,
    ChevronRight as ChevronRightIcon,
    Search as SearchIcon,
    Logout as LogoutIcon,
    MenuOpen as MenuOpenIcon,
    Folder as FolderIcon,
    SupervisedUserCircle as SupervisedUserCircleIcon,
    Assignment as AssignmentIcon,
    Forum as ForumIcon,
    ArrowForwardIos as ArrowForwardIosIcon,
    FiberManualRecord as FiberManualRecordIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// Import komponen-komponen dari Shared
import Button from '@/Components/Shared/Button';

const Sidebar = ({ isOpen, onClose, collapsed, toggleCollapsed, mode = 'light' }) => {
    const { auth } = usePage().props;
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

    // Pastikan data user selalu ada
    const user = auth?.user || {};

    // Definisi role berdasarkan role_id
    const roles = {
        1: 'Admin',
        2: 'Manajer',
        3: 'Kandidat',
        4: 'Tamu'
    };

    // Tentukan userRole berdasarkan role_id di database
    let userRole = 'candidate'; // Default role jika tidak ada role_id

    if (user?.role_id === 1) {
        userRole = 'admin';
    } else if (user?.role_id === 2) {
        userRole = 'manager';
    }

    // Ambil nama role untuk ditampilkan
    const roleName = roles[user?.role_id || 3] || 'Kandidat';

    const [openMenus, setOpenMenus] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [hoveredItem, setHoveredItem] = useState(null);


    // Toggle submenu buka/tutup
    const toggleMenu = (menu) => {
        setOpenMenus(prev => ({
            ...prev,
            [menu]: !prev[menu]
        }));
    };

    // Tutup semua menu yang terbuka ketika drawer diciutkan
    useEffect(() => {
        if (collapsed) {
            setOpenMenus({});
        }
    }, [collapsed]);

    // Mengatur menu awal yang terbuka berdasarkan rute saat ini
    useEffect(() => {
        const setInitialOpenMenus = () => {
            const initialOpenMenus = {};
            menuItems.forEach(item => {
                if (item.submenu && item.submenu.some(subItem => route().current(subItem.route))) {
                    initialOpenMenus[item.text] = true;
                }
            });
            setOpenMenus(initialOpenMenus);
        };

        setInitialOpenMenus();
    }, []);

    // Gaya badge berdasarkan peran
    const getRoleBadgeStyles = () => {
        if (userRole === 'admin') {
            return {
                bgcolor: 'error.main',
                color: 'white'
            };
        } else if (userRole === 'manager') {
            return {
                bgcolor: 'info.main',
                color: 'white'
            };
        } else {
            return {
                bgcolor: 'success.main',
                color: 'white'
            };
        }
    };

    // Definisi item menu
    const menuItems = [];

    // Item menu berdasarkan peran user
    if (userRole === 'admin') {
        menuItems.push(
            {
                text: 'Dasbor',
                icon: <DashboardIcon />,
                route: 'admin.dashboard'
            },
            {
                text: 'Perusahaan',
                icon: <BusinessIcon />,
                route: 'admin.companies.index',
                submenu: [
                    { text: 'Semua Perusahaan', route: 'admin.companies.index', icon: <ChevronRightIcon fontSize="small" /> },
                    { text: 'Tambah Perusahaan', route: 'admin.companies.create', icon: <ChevronRightIcon fontSize="small" /> },
                    // { text: 'Menunggu Verifikasi', route: 'admin.companies.pending', icon: <ChevronRightIcon fontSize="small" />, badge: 5 }
                ]
            },
            {
                text: 'Lowongan',
                icon: <WorkIcon />,
                route: 'admin.jobs.index',
                submenu: [
                    { text: 'Semua Lowongan', route: 'admin.jobs.index', icon: <ChevronRightIcon fontSize="small" /> },
                    { text: 'Tambah Lowongan', route: 'admin.jobs.create', icon: <ChevronRightIcon fontSize="small" /> },
                    // { text: 'Kategori', route: 'admin.jobs.categories', icon: <ChevronRightIcon fontSize="small" /> }
                ]
            },
            {
                text: 'Manajer',
                icon: <SupervisedUserCircleIcon />,
                route: 'admin.managers.index',
                submenu: [
                    { text: 'Semua Manajer', route: 'admin.managers.index', icon: <ChevronRightIcon fontSize="small" /> },
                    { text: 'Tambah Manajer', route: 'admin.managers.create', icon: <ChevronRightIcon fontSize="small" /> }
                ]
            },
            {
                text: 'Pengguna',
                icon: <PeopleIcon />,
                route: 'admin.users.index',
                submenu: [
                    { text: 'Semua Pengguna', route: 'admin.users.index', icon: <ChevronRightIcon fontSize="small" /> },
                    { text: 'Tambah Pengguna', route: 'admin.users.create', icon: <ChevronRightIcon fontSize="small" /> }
                ]
            },
            // { text: 'Tahapan Rekrutmen', icon: <ViewKanbanIcon />, route: 'admin.hiring-stages.index' },
            // { text: 'Pembuat Formulir', icon: <ArticleIcon />, route: 'admin.form-builder.index' },
            // { text: 'Analitik', icon: <AnalyticsIcon />, route: 'admin.analytics' },
            // { text: 'Pengaturan', icon: <SettingsIcon />, route: 'admin.settings' }
        );
    } else if (userRole === 'manager') {
        menuItems.push(
            {
                text: 'Dashboard',
                icon: <DashboardIcon />,
                route: 'manager.dashboard'
            },
            {
                text: 'Lowongan',
                icon: <WorkIcon />,
                route: 'manager.jobs.index',
                submenu: [
                    { text: 'Semua Lowongan', route: 'manager.jobs.index', icon: <ChevronRightIcon fontSize="small" /> },
                    { text: 'Tambah Lowongan', route: 'manager.jobs.create', icon: <ChevronRightIcon fontSize="small" /> },
                    // { text: 'Lowongan Draft', route: 'manager.jobs.drafts', icon: <ChevronRightIcon fontSize="small" /> }
                ]
            },
            {
                text: 'Lamaran',
                icon: <AssignmentIcon />,
                route: 'manager.applications.index',
                submenu: [
                    { text: 'Tampilan Daftar', route: 'manager.applications.index', icon: <ChevronRightIcon fontSize="small" /> },
                    // { text: 'Tampilan Kanban', route: 'manager.applications.kanban', icon: <ChevronRightIcon fontSize="small" /> }
                ]
            },
            {
                text: 'Acara',
                icon: <EventIcon />,
                route: 'manager.events.index',
            },
            // {
            //     text: 'Tim',
            //     icon: <PeopleIcon />,
            //     route: 'manager.team'
            // },
            // {
            //     text: 'Profil Perusahaan',
            //     icon: <BusinessIcon />,
            //     route: 'manager.company'
            // },
            // {
            //     text: 'Analitik',
            //     icon: <AnalyticsIcon />,
            //     route: 'manager.analytics'
            // }
        );
    } else {
        menuItems.push(
            {
                text: 'Dasbor',
                icon: <DashboardIcon />,
                route: 'candidate.dashboard'
            },
            {
                text: 'Daftar Lowongan',
                icon: <WorkIcon />,
                route: 'candidate.jobs.index'
            },
            {
                text: 'Lamaran Saya',
                icon: <AssignmentIcon />,
                route: 'candidate.applications.index',
            },
            {
                text: 'Acara',
                icon: <EventIcon />,
                route: 'candidate.events.index',
            },
            {
                text: 'Portofolio',  // Menu baru
                icon: <FolderIcon />, // Ikon untuk portofolio
                // route: 'candidate.portfolio.index'  // Pastikan rute ini ada di backend
            },
            {
                text: 'Profil',
                icon: <PersonIcon />,
                route: 'candidate.profile.index'
            },
            {
                text: 'Forum',
                icon: <ForumIcon />,
                route: 'public.forum.index'
            },
        );
    }

    // Filter item menu berdasarkan kata pencarian
    const filteredMenuItems = searchTerm.length > 0
        ? menuItems.filter(item =>
            item.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.submenu && item.submenu.some(subItem =>
                subItem.text.toLowerCase().includes(searchTerm.toLowerCase())
            ))
          )
        : menuItems;

    // Menghitung apakah item aktif (kecocokan persis atau induk dari submenu aktif)
    const isActiveItem = (item) => {
        if (route().current(item.route)) {
            return true;
        }

        if (item.submenu) {
            return item.submenu.some(subItem => route().current(subItem.route));
        }

        return false;
    };

    // Varian animasi untuk item menu
    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
        exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
    };

    // Render item menu
    const renderMenuItems = (items) => {
        return items.map((item, index) => {
            // Untuk hasil pencarian, juga tampilkan subitem yang cocok
            const matchingSubItems = searchTerm.length > 0 && item.submenu
                ? item.submenu.filter(subItem =>
                    subItem.text.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                : [];

            const isActive = isActiveItem(item);

            if (item.submenu && (openMenus[item.text] || matchingSubItems.length > 0)) {
                return (
                    <motion.div
                        key={item.text}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={itemVariants}
                        transition={{ delay: index * 0.05 }}
                    >
                        <ListItem
                            component="button"
                            onClick={() => toggleMenu(item.text)}
                            onMouseEnter={() => setHoveredItem(item.text)}
                            onMouseLeave={() => setHoveredItem(null)}
                            sx={{
                                borderRadius: '12px',
                                mb: 0.8,
                                pl: collapsed ? 2.5 : 3,
                                pr: collapsed ? 2.5 : 2,
                                py: 1.5,
                                mx: collapsed ? 1 : 2,
                                position: 'relative',
                                overflow: 'hidden',
                                border: 'none',
                                background: 'none',
                                width: '100%',
                                textAlign: 'left',
                                '&:hover': {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                                    '&::before': {
                                        opacity: 1
                                    }
                                },
                                ...(isActive && {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.12),
                                    color: theme.palette.primary.main,
                                    fontWeight: 600,
                                    '& .MuiListItemIcon-root': {
                                        color: theme.palette.primary.main
                                    }
                                }),
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    left: 0,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: 4,
                                    height: isActive ? '80%' : '0%',
                                    backgroundColor: theme.palette.primary.main,
                                    borderRadius: '0 4px 4px 0',
                                    opacity: isActive ? 1 : 0,
                                    transition: 'all 0.3s ease'
                                }
                            }}
                        >
                            <Tooltip title={collapsed ? item.text : ""} placement="right" arrow>
                                <ListItemIcon
                                    sx={{
                                        minWidth: 'auto',
                                        mr: collapsed ? 0 : 3,
                                        color: isActive ? theme.palette.primary.main : (hoveredItem === item.text ? theme.palette.primary.main : 'inherit'),
                                        transition: 'color 0.2s ease'
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                            </Tooltip>

                            {!collapsed && (
                                <>
                                    <ListItemText
                                        primary={item.text}

                                    />

                                    {item.badge && (
                                        <Chip
                                            label={item.badge}
                                            size="small"
                                            color="primary"
                                            sx={{
                                                height: 20,
                                                fontSize: '0.7rem',
                                                fontWeight: 700,
                                                mr: 1.5,
                                                borderRadius: '10px',
                                                backgroundColor: theme.palette.primary.main,
                                                '.MuiChip-label': {
                                                    px: 1,
                                                }
                                            }}
                                        />
                                    )}

                                    <motion.div
                                        animate={{
                                            rotate: openMenus[item.text] ? 90 : 0,
                                        }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <ArrowForwardIosIcon sx={{ fontSize: 14 }} />
                                    </motion.div>
                                </>
                            )}
                        </ListItem>

                        <AnimatePresence>
                            {!collapsed && (openMenus[item.text] || matchingSubItems.length > 0) && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <List component="div" disablePadding>
                                        {(searchTerm.length > 0 ? matchingSubItems : item.submenu).map((subItem) => {
                                            const isSubItemActive = route().current(subItem.route);

                                            return (
                                                <Link key={subItem.text} href={route(subItem.route)}>
                                                    <motion.div
                                                        whileHover={{ x: 5 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <ListItem
                                                            component="button"
                                                            sx={{
                                                                pl: 7,
                                                                pr: 2,
                                                                py: 1.2,
                                                                mx: 2,
                                                                mb: 0.5,
                                                                borderRadius: '10px',
                                                                position: 'relative',
                                                                overflow: 'hidden',
                                                                border: 'none',
                                                                background: 'none',
                                                                width: '100%',
                                                                textAlign: 'left',
                                                                '&:hover': {
                                                                    backgroundColor: alpha(theme.palette.primary.main, 0.06),
                                                                },
                                                                ...(isSubItemActive && {
                                                                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                                                                    color: theme.palette.primary.main,
                                                                    fontWeight: 600,
                                                                    '& .MuiListItemIcon-root': {
                                                                        color: theme.palette.primary.main
                                                                    }
                                                                }),
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            <ListItemIcon
                                                                sx={{
                                                                    minWidth: 18,
                                                                    mr: 2,
                                                                    color: isSubItemActive ? theme.palette.primary.main : theme.palette.text.secondary,
                                                                    opacity: 0.7
                                                                }}
                                                            >
                                                                <FiberManualRecordIcon sx={{ fontSize: 8 }} />
                                                            </ListItemIcon>

                                                            <ListItemText
                                                                primary={subItem.text}

                                                            />

                                                            {subItem.badge && (
                                                                <Chip
                                                                    label={subItem.badge}
                                                                    size="small"
                                                                    color="primary"
                                                                    sx={{
                                                                        height: 18,
                                                                        fontSize: '0.65rem',
                                                                        fontWeight: 700,
                                                                        borderRadius: '10px',
                                                                        backgroundColor: theme.palette.primary.main,
                                                                        '.MuiChip-label': {
                                                                            px: 1,
                                                                        }
                                                                    }}
                                                                />
                                                            )}
                                                        </ListItem>
                                                    </motion.div>
                                                </Link>
                                            );
                                        })}
                                    </List>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                );
            }

            return (
                <motion.div
                    key={item.text}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={itemVariants}
                    transition={{ delay: index * 0.05 }}
                >
                    <Link href={route(item.route)}>
                        <ListItem
                            component="button"
                            onMouseEnter={() => setHoveredItem(item.text)}
                            onMouseLeave={() => setHoveredItem(null)}
                            sx={{
                                borderRadius: '12px',
                                mb: 0.8,
                                pl: collapsed ? 2.5 : 3,
                                pr: collapsed ? 2.5 : 2,
                                py: 1.5,
                                mx: collapsed ? 1 : 2,
                                position: 'relative',
                                overflow: 'hidden',
                                border: 'none',
                                background: 'none',
                                width: '100%',
                                textAlign: 'left',
                                '&:hover': {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                                    '&::before': {
                                        opacity: 1
                                    }
                                },
                                ...(isActive && {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.12),
                                    color: theme.palette.primary.main,
                                    fontWeight: 600,
                                    '& .MuiListItemIcon-root': {
                                        color: theme.palette.primary.main
                                    }
                                }),
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    left: 0,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: 4,
                                    height: isActive ? '80%' : '0%',
                                    backgroundColor: theme.palette.primary.main,
                                    borderRadius: '0 4px 4px 0',
                                    opacity: isActive ? 1 : 0,
                                    transition: 'all 0.3s ease'
                                },
                                cursor: 'pointer'
                            }}
                        >
                            <Tooltip
                                title={collapsed ? item.text : ""}
                                placement="right"
                                arrow
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 'auto',
                                        mr: collapsed ? 0 : 3,
                                        color: isActive ? theme.palette.primary.main : (hoveredItem === item.text ? theme.palette.primary.main : 'inherit'),
                                        transition: 'color 0.2s ease'
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                            </Tooltip>

                            {!collapsed && (
                                <>
                                    <ListItemText
                                        primary={item.text}

                                    />

                                    {item.badge && (
                                        <Chip
                                            label={item.badge}
                                            size="small"
                                            color="primary"
                                            sx={{
                                                height: 20,
                                                fontSize: '0.7rem',
                                                fontWeight: 700,
                                                borderRadius: '10px',
                                                backgroundColor: theme.palette.primary.main,
                                                '.MuiChip-label': {
                                                    px: 1,
                                                }
                                            }}
                                        />
                                    )}
                                </>
                            )}
                        </ListItem>
                    </Link>
                </motion.div>
            );
        });
    };

    const drawerContent = (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            bgcolor: mode === 'dark' ? alpha('#1A2027', 0.98) : '#FFFFFF',
            background: mode === 'dark'
                ? 'linear-gradient(180deg, #1F2937 0%, #111827 100%)'
                : 'linear-gradient(180deg, #FFFFFF 0%, #F9FAFB 100%)',
            position: 'relative',
            zIndex: 1,
            borderRight: '1px solid',
            borderColor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
        }}>
            {/* Pola Latar Belakang Dekoratif */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: -1,
                    opacity: 0.03,
                    background: mode === 'dark'
                        ? 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23FFFFFF\' fill-opacity=\'0.2\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
                        : 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%234F46E5\' fill-opacity=\'0.2\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
                }}
            />

            {/* Logo / Header */}
            <Box
                sx={{
                    p: 2.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    borderBottom: '1px solid',
                    borderColor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
                }}
            >
                {collapsed ? (
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Avatar
                            alt="Logo"
                            src="/images/logo-icon.svg"
                            sx={{
                                width: 40,
                                height: 40,
                                backgroundColor: 'primary.main',
                                boxShadow: '0 4px 8px rgba(79, 70, 229, 0.2)'
                            }}
                        />
                    </motion.div>
                ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Avatar
                                alt="Logo"
                                src="/images/logo-icon.svg"
                                sx={{
                                    width: 40,
                                    height: 40,
                                    mr: 2,
                                    backgroundColor: 'primary.main',
                                    boxShadow: '0 4px 8px rgba(79, 70, 229, 0.2)'
                                }}
                            />
                        </motion.div>

                        <Typography
                            variant="h6"
                            fontWeight="800"
                            sx={{
                                background: 'linear-gradient(90deg, #4F46E5 0%, #7C3AED 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}
                        >
                            Portal Karir
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* Bagian bilah pencarian */}
            <Box
                sx={{
                    px: 2,
                    py: 2,
                    transition: 'padding 0.3s ease',
                    display: 'flex',
                    justifyContent: collapsed ? 'center' : 'flex-start'
                }}
            >
                {collapsed ? (
                    <IconButton
                        size="small"
                        sx={{
                            backgroundColor: mode === 'dark' ? alpha('#4F46E5', 0.1) : '#F3F4F6',
                            borderRadius: '10px',
                            width: 40,
                            height: 40,
                            color: theme.palette.primary.main,
                            '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.1)
                            }
                        }}
                    >
                        <SearchIcon fontSize="small" />
                    </IconButton>
                ) : (
                    <Paper
                        elevation={0}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            py: 0.5,
                            px: 1.5,
                            borderRadius: '12px',
                            backgroundColor: mode === 'dark' ? alpha('#4F46E5', 0.1) : '#F3F4F6',
                            border: '1px solid',
                            borderColor: mode === 'dark' ? 'transparent' : 'rgba(0,0,0,0.05)'
                        }}
                    >
                        <SearchIcon
                            sx={{
                                color: mode === 'dark' ? alpha('#FFF', 0.7) : alpha('#000', 0.5),
                                mr: 1
                            }}
                            fontSize="small"
                        />
                        <InputBase
                            placeholder="Cari menu..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            sx={{
                                flex: 1,
                                fontSize: '0.9rem',
                                '& .MuiInputBase-input': {
                                    py: 0.7
                                }
                            }}
                        />
                        {searchTerm && (
                            <IconButton
                                size="small"
                                onClick={() => setSearchTerm('')}
                                sx={{ p: 0.5 }}
                            >
                                <motion.div whileHover={{ rotate: 90 }} transition={{ duration: 0.2 }}>
                                    <MenuOpenIcon fontSize="small" />
                                </motion.div>
                            </IconButton>
                        )}
                    </Paper>
                )}
            </Box>

            {/* Header kategori dengan animasi */}
            <Box sx={{ mb: 0.5 }}>
                {!collapsed && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                    >
                        <Typography
                            variant="overline"
                            sx={{
                                px: 4,
                                py: 1,
                                fontWeight: 700,
                                display: 'block',
                                fontSize: '0.65rem',
                                letterSpacing: '0.1em',
                                color: mode === 'dark' ? alpha('#FFF', 0.5) : theme.palette.text.secondary
                            }}
                        >
                            NAVIGASI UTAMA
                        </Typography>
                    </motion.div>
                )}
            </Box>

            {/* Item menu */}
            <Box
                sx={{
                    flexGrow: 1,
                    overflow: 'auto',
                    px: collapsed ? 0 : 1,
                    pb: 2,
                    maskImage: 'linear-gradient(to bottom, transparent, black 10px, black 90%, transparent)',
                    '&::-webkit-scrollbar': {
                        width: '5px',
                    },
                    '&::-webkit-scrollbar-track': {
                        backgroundColor: 'transparent',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: mode === 'dark' ? alpha('#FFF', 0.2) : alpha('#000', 0.1),
                        borderRadius: '10px',
                    }
                }}
            >
                <AnimatePresence>
                    <List component="nav" sx={{ px: 0 }}>
                        {filteredMenuItems.length > 0 ? (
                            renderMenuItems(filteredMenuItems)
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Box sx={{ px: 3, py: 2 }}>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 2,
                                            textAlign: 'center',
                                            borderRadius: '12px',
                                            backgroundColor: mode === 'dark' ? alpha('#4F46E5', 0.1) : alpha('#F3F4F6', 0.8),
                                            border: '1px dashed',
                                            borderColor: mode === 'dark' ? alpha('#FFF', 0.1) : alpha('#000', 0.1),
                                        }}
                                    >
                                        <SearchIcon
                                            sx={{
                                                fontSize: 40,
                                                color: mode === 'dark' ? alpha('#FFF', 0.3) : alpha('#000', 0.2),
                                                mb: 1
                                            }}
                                        />
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: mode === 'dark' ? alpha('#FFF', 0.7) : alpha('#000', 0.7),
                                                fontWeight: 500
                                            }}
                                        >
                                            Tidak ada menu yang cocok
                                        </Typography>
                                    </Paper>
                                </Box>
                            </motion.div>
                        )}
                    </List>
                </AnimatePresence>
            </Box>

            <Divider sx={{
                borderColor: mode === 'dark' ? alpha('#FFF', 0.05) : alpha('#000', 0.05)
            }} />

            {/* Bagian pengguna */}
            <Box
                sx={{
                    p: collapsed ? 2 : 3,
                    mt: 'auto',
                    borderTop: '1px solid',
                    borderColor: mode === 'dark' ? alpha('#FFF', 0.05) : alpha('#000', 0.05),
                    background: mode === 'dark'
                        ? 'linear-gradient(180deg, rgba(79, 70, 229, 0.1) 0%, rgba(79, 70, 229, 0.05) 100%)'
                        : 'linear-gradient(180deg, rgba(249, 250, 251, 0.7) 0%, rgba(249, 250, 251, 1) 100%)',
                    backdropFilter: 'blur(10px)'
                }}
            >
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    mb: collapsed ? 0 : 1.5
                }}>
                    <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
                        <Avatar
                            alt={user?.name || 'User'}
                            src={user?.avatar}
                            sx={{
                                width: 42,
                                height: 42,
                                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                border: '2px solid',
                                borderColor: getRoleBadgeStyles().bgcolor,
                                ...(collapsed && {
                                    mx: 'auto'
                                })
                            }}
                        >
                            {user?.name ? user.name.charAt(0) : 'U'}
                        </Avatar>
                    </motion.div>

                    {!collapsed && (
                        <Box sx={{ overflow: 'hidden' }}>
                            <Typography
                                variant="body2"
                                fontWeight="bold"
                                noWrap
                                sx={{
                                    color: mode === 'dark' ? '#FFF' : 'text.primary'
                                }}
                            >
                                {user?.name || 'Pengguna'}
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                <Chip
                                    label={roleName}
                                    size="small"
                                    sx={{
                                        height: 20,
                                        fontSize: '0.65rem',
                                        fontWeight: 700,
                                        borderRadius: '10px',
                                        ...getRoleBadgeStyles(),
                                        '.MuiChip-label': {
                                            px: 1,
                                        }
                                    }}
                                />
                            </Box>
                        </Box>
                    )}

                    {!collapsed && (
                        <IconButton
                            size="small"
                            sx={{
                                ml: 'auto',
                                backgroundColor: mode === 'dark' ? alpha('#FFF', 0.05) : alpha('#000', 0.05),
                                '&:hover': {
                                    backgroundColor: mode === 'dark' ? alpha('#FFF', 0.1) : alpha('#000', 0.1),
                                }
                            }}
                        >
                            <SettingsIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                    )}
                </Box>

                {!collapsed && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.3 }}
                    >
                        <Button
                            component={Link}
                            href={route('logout')}
                            method="post"
                            variant="contained"
                            color="primary"
                            size="small"
                            fullWidth
                            startIcon={<LogoutIcon fontSize="small" />}
                            sx={{
                                py: 1,
                                borderRadius: '10px',
                                background: 'linear-gradient(90deg, #14b8a6 0%, #0f766e 100%)',
                                boxShadow: '0 4px 10px rgba(79, 70, 229, 0.2)',
                                fontWeight: 600,
                                textTransform: 'none',
                                '&:hover': {
                                    background: 'linear-gradient(90deg, #14b8a6 0%, #0f766e 100%)',
                                    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
                                    transform: 'translateY(-1px)'
                                },
                                transition: 'all 0.2s ease'
                            }}
                        >
                            Keluar
                        </Button>
                    </motion.div>
                )}
            </Box>

            {/* Tombol ciutkan */}
            <Box
                sx={{
                    p: 1.5,
                    textAlign: 'center',
                    borderTop: '1px solid',
                    borderColor: mode === 'dark' ? alpha('#FFF', 0.05) : alpha('#000', 0.05)
                }}
            >
                <Tooltip
                    title={collapsed ? "Perluas Sidebar" : "Ciutkan Sidebar"}
                    placement="right"
                    arrow
                >
                    <IconButton
                        onClick={toggleCollapsed}
                        size="small"
                        sx={{
                            border: '1px solid',
                            borderColor: alpha(theme.palette.primary.main, 0.2),
                            backgroundColor: alpha(theme.palette.primary.main, 0.05),
                            color: theme.palette.primary.main,
                            '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                transform: 'scale(1.1)'
                            },
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <motion.div
                            animate={{
                                rotate: collapsed ? 0 : 180,
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            <MenuOpenIcon fontSize="small" />
                        </motion.div>
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    );

    return (
        <Drawer
            variant={isMobile ? 'temporary' : 'permanent'}
            open={isOpen}
            onClose={onClose}

        >
            {drawerContent}
        </Drawer>
    );
};

export default Sidebar;
