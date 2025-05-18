import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import { Box, CssBaseline } from '@mui/material';
import Header from '@/Components/Layout/Header';
import Sidebar from '@/Components/Layout/Sidebar';
import NotificationListener from '@/Components/NotificationListener';
import ToastNotification from '@/Components/ToastNotification';

export default function CandidateLayout({ children, title }) {
    const [open, setOpen] = React.useState(false);
    const [collapsed, setCollapsed] = React.useState(false);
    const { auth } = usePage().props;

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <CssBaseline />
            
            <Head title={title} />
            
            {/* Add toast notification component */}
            <ToastNotification />
            
            {/* Add notification listener for real-time updates */}
            {auth?.user?.id && <NotificationListener userId={auth.user.id} />}
            
            <Sidebar 
                isOpen={open} 
                onClose={handleDrawerClose} 
                collapsed={collapsed} 
                toggleCollapsed={toggleCollapsed} 
            />
            
            <Box 
                component="main" 
                sx={{ 
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    width: { sm: `calc(100% - ${collapsed ? 72 : 280}px)` },
                    ml: { sm: `${collapsed ? 72 : 280}px` },
                    transition: (theme) => theme.transitions.create(['margin', 'width'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                }}
            >
                <Header 
                    onDrawerOpen={handleDrawerOpen} 
                    sidebarCollapsed={collapsed}
                />
                
                <Box 
                    component="div" 
                    sx={{ 
                        flexGrow: 1,
                        p: { xs: 1, sm: 2, md: 3 },
                        bgcolor: 'background.default'
                    }}
                >
                    {children}
                </Box>
            </Box>
        </Box>
    );
}