import React from 'react';
import { Head } from '@inertiajs/react';
import { Box, CssBaseline } from '@mui/material';
import Header from '@/Components/Layout/Header';
import Sidebar from '@/Components/Layout/Sidebar';

export default function AdminLayout({ children, title }) {
    const [open, setOpen] = React.useState(false);
    const [collapsed, setCollapsed] = React.useState(false);

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