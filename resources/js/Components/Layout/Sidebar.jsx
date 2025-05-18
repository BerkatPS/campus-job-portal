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
import AnalyticsIcon from '@mui/icons-material/Analytics';
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
    FiberManualRecord as FiberManualRecordIcon,
    AutoFixHigh as AutoFixHighIcon
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

    // Primary color for the entire sidebar
    const primaryColor = theme.palette.primary.main;

    // Definisi item menu
    const menuItems = [];

    // Item menu berdasarkan peran user
    if (userRole === 'admin') {
        menuItems.push(
            {
                text: 'Dasbor',
                icon: <DashboardIcon />,
                route: 'admin.dashboard',
                color: primaryColor
            },
            {
                text: 'Perusahaan',
                icon: <BusinessIcon />,
                route: 'admin.companies.index',
                color: primaryColor,
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
                color: primaryColor,
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
                color: primaryColor,
                submenu: [
                    { text: 'Semua Manajer', route: 'admin.managers.index', icon: <ChevronRightIcon fontSize="small" /> },
                    { text: 'Tambah Manajer', route: 'admin.managers.create', icon: <ChevronRightIcon fontSize="small" /> }
                ]
            },
            {
                text: 'Pengguna',
                icon: <PeopleIcon />,
                route: 'admin.users.index',
                color: primaryColor,
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
                route: 'manager.dashboard',
                color: primaryColor
            },
            {
                text: 'Lowongan',
                icon: <WorkIcon />,
                route: 'manager.jobs.index',
                color: primaryColor,
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
                color: primaryColor,
                submenu: [
                    { text: 'Tampilan Daftar', route: 'manager.applications.index', icon: <ChevronRightIcon fontSize="small" /> },
                    // { text: 'Tampilan Kanban', route: 'manager.applications.kanban', icon: <ChevronRightIcon fontSize="small" /> }
                ]
            },
            {
                text: 'Acara',
                icon: <EventIcon />,
                route: 'manager.events.index',
                color: primaryColor
            },
            {
                text: 'Tim',
                icon: <PeopleIcon />,
                route: 'manager.team.index',
                color: primaryColor,
                submenu: [
                    { text: 'Daftar Tim', route: 'manager.team.index', icon: <ChevronRightIcon fontSize="small" /> }
                ]
            },
            {
                text: 'Profil',
                icon: <PersonIcon />,
                route: 'manager.profile.index',
                color: primaryColor,
                submenu: [
                    { text: 'Profil Saya', route: 'manager.profile.index', icon: <ChevronRightIcon fontSize="small" /> },
                    { text: 'Edit Profil', route: 'manager.profile.edit', icon: <ChevronRightIcon fontSize="small" /> },
                    { text: 'Keamanan', route: 'manager.profile.security', icon: <ChevronRightIcon fontSize="small" /> }
                ]
            },
            {
                text: 'Profil Perusahaan',
                icon: <BusinessIcon />,
                route: 'manager.company-profile.index',
                color: primaryColor,
                submenu: [
                    { text: 'Detail Perusahaan', route: 'manager.company-profile.index', icon: <ChevronRightIcon fontSize="small" /> },
                    { text: 'Edit Perusahaan', route: 'manager.company-profile.edit', icon: <ChevronRightIcon fontSize="small" /> }
                ]
            },
            {
                text: 'Analitik',
                icon: <AnalyticsIcon />,
                route: 'manager.analytics.index',
                color: primaryColor
            }
        );
    } else {
        menuItems.push(
            {
                text: 'Dasbor',
                icon: <DashboardIcon />,
                route: 'candidate.dashboard',
                color: primaryColor
            },
            {
                text: 'Daftar Lowongan',
                icon: <WorkIcon />,
                route: 'candidate.jobs.index',
                color: primaryColor
            },
            {
                text: 'Lamaran Saya',
                icon: <AssignmentIcon />,
                route: 'candidate.applications.index',
                color: primaryColor
            },
            {
                text: 'Resume AI',
                icon: <AutoFixHighIcon />,
                route: 'candidate.resume-enhancer.index',
                color: primaryColor
            },
            {
                text: 'Acara',
                icon: <EventIcon />,
                route: 'candidate.events.index',
                color: primaryColor
            },
            {
                text: 'Portofolio',
                icon: <FolderIcon />,
                route: 'candidate.portfolio.index',
                color: primaryColor
            },
            {
                text: 'Profil',
                icon: <PersonIcon />,
                route: 'candidate.profile.index',
                color: primaryColor
            },
            {
                text: 'Forum',
                icon: <ForumIcon />,
                route: 'public.forum.index',
                color: primaryColor
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
                            component="div"
                            onClick={() => toggleMenu(item.text)}
                            onMouseEnter={() => setHoveredItem(item.text)}
                            onMouseLeave={() => setHoveredItem(null)}
                            sx={{
                                borderRadius: '16px',
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
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    backgroundColor: alpha(primaryColor, 0.08),
                                    transform: 'translateX(3px)',
                                    '&::before': {
                                        opacity: 1,
                                        height: '50%'
                                    },
                                    '& .menu-icon-wrapper': {
                                        backgroundColor: alpha(primaryColor, 0.15),
                                    }
                                },
                                ...(isActive && {
                                    backgroundColor: mode === 'dark'
                                        ? alpha(primaryColor, 0.15)
                                        : alpha(primaryColor, 0.12),
                                    color: primaryColor,
                                    fontWeight: 600,
                                    '& .MuiListItemIcon-root': {
                                        color: 'white'
                                    },
                                    '& .menu-icon-wrapper': {
                                        backgroundColor: primaryColor,
                                    }
                                }),
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    left: 0,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: 4,
                                    height: isActive ? '70%' : '0%',
                                    backgroundColor: primaryColor,
                                    borderRadius: '0 4px 4px 0',
                                    opacity: isActive ? 1 : 0,
                                    transition: 'all 0.3s ease',
                                    boxShadow: isActive ? `0 0 10px ${alpha(primaryColor, 0.5)}` : 'none'
                                }
                            }}
                        >
                            <Tooltip title={collapsed ? item.text : ""} placement="right" arrow>
                                <Box
                                    className="menu-icon-wrapper"
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 36,
                                        height: 36,
                                        borderRadius: '12px',
                                        backgroundColor: isActive
                                            ? primaryColor
                                            : (mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'),
                                        transition: 'all 0.2s ease',
                                        mr: collapsed ? 0 : 3,
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 'auto',
                                            color: isActive
                                                ? 'white'
                                                : (hoveredItem === item.text
                                                    ? primaryColor
                                                    : mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'),
                                            transition: 'color 0.2s ease, transform 0.2s ease',
                                            transform: hoveredItem === item.text ? 'scale(1.1)' : 'scale(1)',
                                            m: 0
                                        }}
                                    >
                                        {item.icon}
                                    </ListItemIcon>
                                </Box>
                            </Tooltip>

                            {!collapsed && (
                                <>
                                    <ListItemText
                                        primary={item.text}
                                        primaryTypographyProps={{
                                            sx: {
                                                fontWeight: isActive ? 600 : 500,
                                                fontSize: '0.95rem',
                                                letterSpacing: '0.1px',
                                                color: isActive ? primaryColor : 'inherit'
                                            }
                                        }}
                                    />

                                    {item.badge && (
                                        <Chip
                                            label={item.badge}
                                            size="small"
                                            sx={{
                                                height: 20,
                                                fontSize: '0.7rem',
                                                fontWeight: 700,
                                                borderRadius: '10px',
                                                backgroundColor: primaryColor,
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                                '.MuiChip-label': {
                                                    px: 1,
                                                }
                                            }}
                                        />
                                    )}

                                    <Box
                                        sx={{
                                            width: 24,
                                            height: 24,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '8px',
                                            backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                                            transition: 'all 0.2s ease',
                                        }}
                                    >
                                        <motion.div
                                            animate={{
                                                rotate: openMenus[item.text] ? 90 : 0,
                                            }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <ArrowForwardIosIcon sx={{ fontSize: 12, color: isActive ? primaryColor : 'inherit' }} />
                                        </motion.div>
                                    </Box>
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
                                                        whileHover={{ x: 8, transition: { type: 'spring', stiffness: 400, damping: 10 } }}
                                                    >
                                                        <ListItem
                                                            component="div"
                                                            sx={{
                                                                pl: 8,
                                                                pr: 2,
                                                                py: 1.2,
                                                                mx: 2,
                                                                mb: 0.5,
                                                                borderRadius: '12px',
                                                                position: 'relative',
                                                                overflow: 'hidden',
                                                                border: 'none',
                                                                width: '100%',
                                                                textAlign: 'left',
                                                                transition: 'all 0.2s ease',
                                                                '&:hover': {
                                                                    backgroundColor: alpha(primaryColor, 0.06),
                                                                },
                                                                ...(isSubItemActive && {
                                                                    backgroundColor: alpha(primaryColor, 0.08),
                                                                    color: primaryColor,
                                                                    fontWeight: 600,
                                                                    '& .MuiListItemIcon-root': {
                                                                        color: primaryColor,
                                                                        transform: 'scale(1.2)'
                                                                    }
                                                                }),
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            <ListItemIcon
                                                                sx={{
                                                                    minWidth: 18,
                                                                    mr: 2,
                                                                    color: isSubItemActive
                                                                        ? primaryColor
                                                                        : theme.palette.text.secondary,
                                                                    opacity: isSubItemActive ? 1 : 0.6,
                                                                    transition: 'transform 0.2s ease, opacity 0.2s ease',
                                                                }}
                                                            >
                                                                <FiberManualRecordIcon sx={{ fontSize: 8 }} />
                                                            </ListItemIcon>

                                                            <ListItemText
                                                                primary={subItem.text}
                                                                primaryTypographyProps={{
                                                                    sx: {
                                                                        fontSize: '0.85rem',
                                                                        fontWeight: isSubItemActive ? 600 : 400,
                                                                        letterSpacing: isSubItemActive ? '0.1px' : 'normal',
                                                                        color: isSubItemActive ? primaryColor : 'inherit'
                                                                    }
                                                                }}
                                                            />

                                                            {subItem.badge && (
                                                                <Chip
                                                                    label={subItem.badge}
                                                                    size="small"
                                                                    sx={{
                                                                        height: 18,
                                                                        fontSize: '0.65rem',
                                                                        fontWeight: 700,
                                                                        borderRadius: '10px',
                                                                        backgroundColor: primaryColor,
                                                                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
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
                            component="div"
                            onMouseEnter={() => setHoveredItem(item.text)}
                            onMouseLeave={() => setHoveredItem(null)}
                            sx={{
                                borderRadius: '16px',
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
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    backgroundColor: alpha(primaryColor, 0.08),
                                    transform: 'translateX(3px)',
                                    '&::before': {
                                        opacity: 1,
                                        height: '50%'
                                    },
                                    '& .menu-icon-wrapper': {
                                        backgroundColor: alpha(primaryColor, 0.15),
                                    }
                                },
                                ...(isActive && {
                                    backgroundColor: mode === 'dark'
                                        ? alpha(primaryColor, 0.15)
                                        : alpha(primaryColor, 0.12),
                                    color: primaryColor,
                                    fontWeight: 600,
                                    '& .MuiListItemIcon-root': {
                                        color: 'white'
                                    },
                                    '& .menu-icon-wrapper': {
                                        backgroundColor: primaryColor,
                                    }
                                }),
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    left: 0,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: 4,
                                    height: isActive ? '70%' : '0%',
                                    backgroundColor: primaryColor,
                                    borderRadius: '0 4px 4px 0',
                                    opacity: isActive ? 1 : 0,
                                    transition: 'all 0.3s ease',
                                    boxShadow: isActive ? `0 0 10px ${alpha(primaryColor, 0.5)}` : 'none'
                                },
                                cursor: 'pointer'
                            }}
                        >
                            <Tooltip title={collapsed ? item.text : ""} placement="right" arrow>
                                <Box
                                    className="menu-icon-wrapper"
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 36,
                                        height: 36,
                                        borderRadius: '12px',
                                        backgroundColor: isActive
                                            ? primaryColor
                                            : (mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'),
                                        transition: 'all 0.2s ease',
                                        mr: collapsed ? 0 : 3,
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 'auto',
                                            color: isActive
                                                ? 'white'
                                                : (hoveredItem === item.text
                                                    ? primaryColor
                                                    : mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'),
                                            transition: 'color 0.2s ease, transform 0.2s ease',
                                            transform: hoveredItem === item.text ? 'scale(1.1)' : 'scale(1)',
                                            m: 0
                                        }}
                                    >
                                        {item.icon}
                                    </ListItemIcon>
                                </Box>
                            </Tooltip>

                            {!collapsed && (
                                <>
                                    <ListItemText
                                        primary={item.text}
                                        primaryTypographyProps={{
                                            sx: {
                                                fontWeight: isActive ? 600 : 500,
                                                fontSize: '0.95rem',
                                                letterSpacing: '0.1px',
                                                color: isActive ? primaryColor : 'inherit'
                                            }
                                        }}
                                    />

                                    {item.badge && (
                                        <Chip
                                            label={item.badge}
                                            size="small"
                                            sx={{
                                                height: 20,
                                                fontSize: '0.7rem',
                                                fontWeight: 700,
                                                borderRadius: '10px',
                                                backgroundColor: primaryColor,
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
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

    // Render drawer content
    const drawerContent = (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: mode === 'dark' ? 'background.default' : 'background.paper',
                backgroundImage: mode === 'dark'
                    ? 'linear-gradient(rgba(20, 20, 30, 0.8), rgba(10, 10, 20, 0.9))'
                    : 'linear-gradient(rgba(255, 255, 255, 0.9), rgba(250, 250, 255, 1))',
                borderRight: '1px solid',
                borderColor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                boxShadow: collapsed ? 'none' : (mode === 'dark' ? '0 0 20px rgba(0,0,0,0.5)' : '0 0 20px rgba(0,0,0,0.05)')
            }}
        >
            <Box sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: collapsed ? 'center' : 'space-between',
                borderBottom: '1px solid',
                borderColor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                backdropFilter: 'blur(8px)',
                position: 'sticky',
                top: 0,
                zIndex: 10,
                backgroundColor: mode === 'dark' ? 'rgba(18, 18, 30, 0.7)' : 'rgba(255, 255, 255, 0.8)'
            }}>
                {!collapsed && (
                    <Link href="/">
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            transform: 'translateY(0px)',
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                            }
                        }}>
                            <Typography
                                variant="h6"
                                noWrap
                                component="div"
                                sx={{
                                    fontWeight: 800,
                                    letterSpacing: '-0.5px',
                                    background: 'linear-gradient(90deg, #4F46E5, #06B6D4)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    fontSize: '1.3rem',
                                }}
                            >
                                CampusJobs
                            </Typography>
                        </Box>
                    </Link>
                )}
                {!isMobile && (
                    <IconButton onClick={toggleCollapsed} size="small" sx={{
                        borderRadius: '12px',
                        backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                        padding: '8px',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                            transform: 'scale(1.05)'
                        }
                    }}>
                        <MenuOpenIcon sx={{
                            transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s ease'
                        }} />
                    </IconButton>
                )}
            </Box>

            {!collapsed && (
                <Box sx={{
                    px: 2,
                    py: 2.5,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    borderBottom: '1px solid',
                    borderColor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                    mb: 1,
                    background: mode === 'dark'
                        ? 'linear-gradient(rgba(30, 30, 50, 0.3), rgba(20, 20, 40, 0.1))'
                        : 'linear-gradient(rgba(245, 245, 255, 0.5), rgba(240, 240, 250, 0.2))',
                    borderRadius: '16px',
                    mx: 2,
                    boxShadow: mode === 'dark'
                        ? '0 4px 20px rgba(0,0,0,0.2)'
                        : '0 4px 20px rgba(0,0,0,0.03)'
                }}>
                    <Avatar
                        src={user.avatar_url || '/default-avatar.png'}
                        alt={user.name}
                        sx={{
                            width: 70,
                            height: 70,
                            mb: 1.5,
                            border: '3px solid',
                            borderColor: primaryColor,
                            boxShadow: `0 4px 15px ${alpha(primaryColor, 0.3)}`,
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                borderRadius: '50%',
                                background: 'transparent',
                                border: `2px solid ${alpha(primaryColor, 0.5)}`,
                                transform: 'scale(1.15)',
                                opacity: 0.5,
                                transition: 'all 0.3s ease'
                            },
                            '&:hover': {
                                transform: 'scale(1.05)',
                                boxShadow: `0 6px 20px ${alpha(primaryColor, 0.4)}`,
                                '&::before': {
                                    transform: 'scale(1.2)',
                                    opacity: 0.7
                                }
                            },
                            transition: 'all 0.3s ease'
                        }}
                    />
                    <Typography
                        variant="subtitle1"
                        noWrap
                        align="center"
                        sx={{
                            fontWeight: 600,
                            fontSize: '1rem',
                            lineHeight: 1.2,
                            mb: 0.2,
                            color: mode === 'dark' ? 'white' : 'text.primary'
                        }}
                    >
                        {user.name || 'Pengguna'}
                    </Typography>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                            mb: 1.5,
                            opacity: 0.8,
                            fontWeight: 500
                        }}
                    >
                        {user.email || 'guest@example.com'}
                    </Typography>

                    <Chip
                        label={roleName}
                        size="small"
                        sx={{
                            borderRadius: '12px',
                            fontWeight: 600,
                            fontSize: '0.7rem',
                            backgroundColor: alpha(primaryColor, 0.1),
                            color: primaryColor,
                            border: `1px solid ${alpha(primaryColor, 0.2)}`,
                            '.MuiChip-label': {
                                px: 1.2,
                                py: 0.3
                            }
                        }}
                    />
                </Box>
            )}

            {collapsed && (
                <Box sx={{
                    py: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    <Avatar
                        src={user.avatar_url || '/default-avatar.png'}
                        alt={user.name}
                        sx={{
                            width: 40,
                            height: 40,
                            border: '2px solid',
                            borderColor: primaryColor,
                            boxShadow: `0 4px 15px ${alpha(primaryColor, 0.3)}`,
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                borderRadius: '50%',
                                background: 'transparent',
                                border: `2px solid ${alpha(primaryColor, 0.5)}`,
                                transform: 'scale(1.15)',
                                opacity: 0.5,
                                transition: 'all 0.3s ease'
                            },
                            '&:hover': {
                                transform: 'scale(1.05)',
                                boxShadow: `0 6px 20px ${alpha(primaryColor, 0.4)}`,
                                '&::before': {
                                    transform: 'scale(1.2)',
                                    opacity: 0.7
                                }
                            },
                            transition: 'all 0.3s ease'
                        }}
                    />
                </Box>
            )}

            {!collapsed && (
                <Paper
                    elevation={0}
                    sx={{
                        mx: 2,
                        mb: 2,
                        borderRadius: '12px',
                        boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.05)',
                        backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        pl: 1.5,
                        pr: 1
                    }}
                >
                    <InputBase
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{
                            flex: 1,
                            fontSize: '0.85rem',
                            '& .MuiInputBase-input': {
                                py: 1,
                            }
                        }}
                    />
                    <IconButton size="small" sx={{ p: 0.5 }}>
                        <SearchIcon fontSize="small" sx={{ opacity: 0.7 }} />
                    </IconButton>
                </Paper>
            )}

            <Box sx={{
                flexGrow: 1,
                overflowY: 'auto',
                px: collapsed ? 0 : 0,
                '&::-webkit-scrollbar': {
                    width: '4px',
                },
                '&::-webkit-scrollbar-track': {
                    background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                    background: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                    borderRadius: '20px',
                },
                scrollbarWidth: 'thin',
                scrollbarColor: mode === 'dark' ? 'rgba(255,255,255,0.1) transparent' : 'rgba(0,0,0,0.1) transparent',
                py: 1
            }}>
                <List sx={{ pt: 0 }}>
                    <AnimatePresence>
                        {renderMenuItems(filteredMenuItems)}
                    </AnimatePresence>
                </List>
            </Box>

            <Box sx={{
                p: 2,
                borderTop: '1px solid',
                borderColor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                display: 'flex',
                justifyContent: collapsed ? 'center' : 'flex-start'
            }}>
                <Button
                    href={route('logout')}
                    method="post"
                    as="button"
                    startIcon={collapsed ? null : <LogoutIcon />}
                    color="error"
                    size={collapsed ? "small" : "medium"}
                    sx={{
                        borderRadius: '12px',
                        px: collapsed ? 1 : 3,
                        py: 1,
                        backgroundColor: mode === 'dark' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.08)',
                        color: 'error.main',
                        fontWeight: 600,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            backgroundColor: mode === 'dark' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(239, 68, 68, 0.15)',
                            transform: 'translateY(-2px)',
                        }
                    }}
                >
                    {collapsed ? <LogoutIcon fontSize="small" /> : 'Logout'}
                </Button>
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
