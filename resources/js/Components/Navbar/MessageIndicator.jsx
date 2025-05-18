import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import {
    IconButton,
    Badge,
    Menu,
    MenuItem,
    ListItemText,
    ListItemIcon,
    Typography,
    Box,
    Divider,
    Button,
    List,
    ListItem,
    Avatar,
    useTheme,
    Tooltip,
    alpha,
} from '@mui/material';
import {
    Email as EmailIcon,
    Inbox as InboxIcon,
    People as PeopleIcon,
    AccessTime as AccessTimeIcon,
    Work as WorkIcon,
} from '@mui/icons-material';
import axios from 'axios';

const MessageIndicator = ({ initialUnreadCount = 0 }) => {
    const theme = useTheme();
    const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
    const [anchorEl, setAnchorEl] = useState(null);
    const [recentMessages, setRecentMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        fetchRecentMessages();
    };
    
    const handleClose = () => {
        setAnchorEl(null);
    };
    
    const fetchRecentMessages = async () => {
        setLoading(true);
        try {
            const response = await axios.get(route('manager.messages.recent'));
            setRecentMessages(response.data.messages);
        } catch (error) {
            console.error('Error fetching recent messages:', error);
        } finally {
            setLoading(false);
        }
    };
    
    // Listen for new messages via Echo/Pusher
    useEffect(() => {
        // Set up Echo listener for new messages if Echo is available
        if (window.Echo) {
            const channel = window.Echo.private(`user.${window.userId}`);
            
            channel.listen('NewMessageReceived', (e) => {
                setUnreadCount(prevCount => prevCount + 1);
                // Optionally refetch recent messages if the menu is open
                if (anchorEl) {
                    fetchRecentMessages();
                }
            });
            
            // Clean up listener on component unmount
            return () => {
                channel.stopListening('NewMessageReceived');
            };
        }
    }, [anchorEl]);
    
    const formatMessagePreview = (message) => {
        // Truncate message to 50 chars
        if (message.length > 50) {
            return message.substring(0, 50) + '...';
        }
        return message;
    };
    
    const formatTimestamp = (timestamp) => {
        const now = new Date();
        const messageDate = new Date(timestamp);
        const diffMs = now - messageDate;
        const diffMins = Math.round(diffMs / (1000 * 60));
        const diffHours = Math.round(diffMs / (1000 * 60 * 60));
        const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffMins < 60) {
            return `${diffMins} menit yang lalu`;
        } else if (diffHours < 24) {
            return `${diffHours} jam yang lalu`;
        } else if (diffDays < 7) {
            return `${diffDays} hari yang lalu`;
        } else {
            return messageDate.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        }
    };
    
    const markAsRead = async (messageId) => {
        try {
            await axios.post(route('manager.messages.mark-read', messageId));
            setUnreadCount(prevCount => Math.max(0, prevCount - 1));
            setRecentMessages(prevMessages => 
                prevMessages.map(msg => 
                    msg.id === messageId ? { ...msg, is_read: true } : msg
                )
            );
        } catch (error) {
            console.error('Error marking message as read:', error);
        }
    };
    
    return (
        <>
            <Tooltip title="Pesan">
                <IconButton
                    color="inherit"
                    onClick={handleClick}
                    aria-controls="message-menu"
                    aria-haspopup="true"
                >
                    <Badge badgeContent={unreadCount} color="error">
                        <EmailIcon />
                    </Badge>
                </IconButton>
            </Tooltip>
            
            <Menu
                id="message-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                    elevation: 3,
                    sx: {
                        width: 360,
                        maxHeight: 500,
                        overflow: 'auto',
                        mt: 1.5,
                        borderRadius: '0.75rem',
                        '& .MuiMenuItem-root': {
                            px: 2,
                            py: 1.5,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <Box sx={{ p: 2, pb: 1 }}>
                    <Typography variant="h6" fontWeight="bold">
                        Pesan
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {unreadCount > 0 
                            ? `Anda memiliki ${unreadCount} pesan belum dibaca`
                            : 'Semua pesan telah dibaca'}
                    </Typography>
                </Box>
                
                <Divider />
                
                {loading ? (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            Memuat pesan...
                        </Typography>
                    </Box>
                ) : recentMessages.length > 0 ? (
                    <List disablePadding>
                        {recentMessages.map((message) => (
                            <React.Fragment key={message.id}>
                                <ListItem
                                    alignItems="flex-start"
                                    component={Link}
                                    href={route('manager.messages.show', message.conversation_id)}
                                    onClick={() => {
                                        handleClose();
                                        if (!message.is_read) {
                                            markAsRead(message.id);
                                        }
                                    }}
                                    sx={{
                                        px: 2,
                                        py: 1.5,
                                        bgcolor: !message.is_read 
                                            ? alpha(theme.palette.primary.main, 0.08)
                                            : 'transparent',
                                        '&:hover': {
                                            bgcolor: !message.is_read 
                                                ? alpha(theme.palette.primary.main, 0.12)
                                                : alpha(theme.palette.primary.main, 0.04),
                                        },
                                    }}
                                >
                                    <Avatar
                                        src={message.sender.avatar || null}
                                        alt={message.sender.name}
                                        sx={{ 
                                            mr: 2,
                                            bgcolor: theme.palette.primary.main,
                                            width: 40,
                                            height: 40,
                                        }}
                                    >
                                        {message.sender.name.charAt(0)}
                                    </Avatar>
                                    <Box sx={{ width: '100%' }}>
                                        <Box sx={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start',
                                            mb: 0.5
                                        }}>
                                            <Typography 
                                                variant="subtitle2" 
                                                fontWeight={!message.is_read ? 'bold' : 'medium'}
                                                noWrap
                                                sx={{ maxWidth: '70%' }}
                                            >
                                                {message.sender.name}
                                            </Typography>
                                            <Typography 
                                                variant="caption" 
                                                color="text.secondary"
                                                component="span"
                                                sx={{ 
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    fontSize: '0.7rem'
                                                }}
                                            >
                                                <AccessTimeIcon 
                                                    sx={{ fontSize: '0.9rem', mr: 0.5 }} 
                                                />
                                                {formatTimestamp(message.created_at)}
                                            </Typography>
                                        </Box>
                                        <Typography 
                                            variant="body2"
                                            color={!message.is_read ? 'text.primary' : 'text.secondary'}
                                            fontWeight={!message.is_read ? 'medium' : 'normal'}
                                            sx={{
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}
                                        >
                                            {formatMessagePreview(message.message)}
                                        </Typography>
                                        {message.job && (
                                            <Typography 
                                                variant="caption" 
                                                color="primary"
                                                sx={{ 
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    mt: 0.5,
                                                    fontWeight: 'medium'
                                                }}
                                            >
                                                <WorkIcon 
                                                    sx={{ fontSize: '0.9rem', mr: 0.5 }} 
                                                />
                                                {message.job.title}
                                            </Typography>
                                        )}
                                    </Box>
                                </ListItem>
                                <Divider component="li" />
                            </React.Fragment>
                        ))}
                    </List>
                ) : (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            Tidak ada pesan terbaru
                        </Typography>
                    </Box>
                )}
                
                <Divider />
                
                <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Button
                        component={Link}
                        href={route('manager.messages.index')}
                        startIcon={<InboxIcon />}
                        onClick={handleClose}
                        fullWidth
                        variant="outlined"
                    >
                        Lihat Semua Pesan
                    </Button>
                </Box>
            </Menu>
        </>
    );
};

export default MessageIndicator;
