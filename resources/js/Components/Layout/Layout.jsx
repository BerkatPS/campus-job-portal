// /resources/js/components/Layout/Layout.jsx
import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import {
    Box,
    CssBaseline,
    useTheme,
    useMediaQuery,
    Backdrop,
    CircularProgress,
    alpha,
} from '@mui/material';
import { motion } from 'framer-motion';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import MuiThemeProvider from "@/Theme/MuiThemeProvider.jsx";
import NotificationListener from "@/Components/NotificationListener.jsx";
import ToastNotification from "@/Components/ToastNotification.jsx";

// Custom backdrop component with loading animation
const LoadingBackdrop = ({ open }) => {

    return (
        <Backdrop
            sx={{
                color: '#fff',
                zIndex: (theme) => theme.zIndex.drawer + 1,
                backdropFilter: 'blur(8px)',
                backgroundColor: alpha('#000000', 0.6),
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}
            open={open}
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <CircularProgress
                    color="primary"
                    size={60}
                    thickness={4}
                    sx={{
                        '& .MuiCircularProgress-circle': {
                            strokeLinecap: 'round',
                        }
                    }}
                />
            </motion.div>
            <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
            >
                <Box sx={{ mt: 2, fontWeight: 'medium', fontSize: '1rem' }}>Loading...</Box>
            </motion.div>
        </Backdrop>
    );
};

const Layout = ({ children }) => {
    const { auth } = usePage().props;
    const [loading, setLoading] = useState(false);

    // Create Material UI Theme
    const [mode, setMode] = useState('light');

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
    const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(isMobile);
    const [echoInitialized, setEchoInitialized] = useState(false);

    useEffect(() => {
        const checkEcho = () => {
            if (window.Echo) {
                console.log('Echo is initialized');
                setEchoInitialized(true);
            } else {
                console.log('Waiting for Echo...');
                setTimeout(checkEcho, 100);
            }
        };

        checkEcho();
    }, []);

    useEffect(() => {
        setSidebarOpen(!isMobile);
        setSidebarCollapsed(isMobile);
    }, [isMobile]);

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setLoading(false);
        }, 300);
        return () => clearTimeout(timer);
    }, []);

    const handleSidebarToggle = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleSidebarCollapse = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    const toggleThemeMode = () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };

    const sidebarWidth = sidebarCollapsed ? 72 : 280;

    const mainContentWidth = isMobile ? '100%' : `calc(100% - ${sidebarWidth}px)`;
    const mainContentMargin = isMobile ? 0 : `${sidebarWidth}px`;

    return (
        <MuiThemeProvider>
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                overflow: 'hidden',
                bgcolor: 'background.default',
                transition: 'background-color 0.3s ease',
                position: 'relative',
            }}
        >
            <CssBaseline />

            {/* Custom background patterns for light/dark mode */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 0,
                    opacity: 0.02,
                    backgroundImage: mode === 'light'
                        ? `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${theme.palette.primary.main.replace('#', '')}' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                        : `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    pointerEvents: 'none',
                }}
            />

            <LoadingBackdrop open={loading} />

            {/* Toast notification at app root level */}
            <ToastNotification />
            
            {/* Notification listener outside of scrollable area */}
            {auth?.user?.id && (
                <NotificationListener userId={auth.user.id} />
            )}

            <Header
                toggleSidebar={handleSidebarToggle}
                onThemeToggle={toggleThemeMode}
                mode={mode}
                sidebarCollapsed={sidebarCollapsed}
            />

            <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative', zIndex: 1 }}>
                <Sidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                    collapsed={sidebarCollapsed}
                    toggleCollapsed={handleSidebarCollapse}
                    mode={mode}
                    sx={{ zIndex: (theme) => theme.zIndex.appBar + 1 }}
                />

                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        mt: '64px',
                        width: mainContentWidth,
                        ml: mainContentMargin,
                        height: 'calc(100vh - 64px)',
                        overflow: 'auto',
                        transition: theme.transitions.create(['width', 'margin-left'], {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.enteringScreen,
                        }),
                        scrollbarWidth: 'thin',
                        scrollbarColor: `${alpha(theme.palette.primary.main, 0.2)} ${alpha(theme.palette.background.paper, 0.1)}`,
                        '&::-webkit-scrollbar': {
                            width: '8px',
                            height: '8px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.2),
                            borderRadius: '4px',
                            '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.3),
                            },
                        },
                        '&::-webkit-scrollbar-track': {
                            backgroundColor: alpha(theme.palette.background.paper, 0.1),
                        },
                    }}
                    className="custom-scrollbar"
                >
                    {/* Main content without any wrapping container */}
                    {children}

                    <Footer mode={mode} />
                </Box>
            </Box>
        </Box>
        </MuiThemeProvider>
    );
}

export default Layout;
