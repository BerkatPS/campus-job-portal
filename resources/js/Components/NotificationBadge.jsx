// resources/js/Components/NotificationBadge.jsx
import { useState, useEffect } from 'react';
import { Badge, IconButton } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import axios from 'axios';

export default function NotificationBadge({ onClick }) {
    const [count, setCount] = useState(0);

    const fetchCount = async () => {
        try {
            const response = await axios.get('/api/notifications/unread-count');
            setCount(response.data.unreadCount);
        } catch (error) {
            console.error('Failed to fetch notification count', error);
        }
    };

    useEffect(() => {
        // Define global refresh function
        window.refreshNotifications = fetchCount;

        // Fetch initial count
        fetchCount();

        // Listen for new notifications
        const handleNewNotification = () => {
            setCount(prevCount => prevCount + 1);
        };

        window.addEventListener('notification.received', handleNewNotification);

        // Refresh count periodically
        const interval = setInterval(fetchCount, 60000); // Every minute

        return () => {
            clearInterval(interval);
            delete window.refreshNotifications;
            window.removeEventListener('notification.received', handleNewNotification);
        };
    }, []);

    return (
        <IconButton color="inherit" onClick={onClick}>
            <Badge badgeContent={count} color="error">
                <NotificationsIcon />
            </Badge>
        </IconButton>
    );
}
