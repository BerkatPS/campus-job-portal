// resources/js/Components/NotificationListener.jsx
import { useEffect } from 'react';

export default function NotificationListener({ userId }) {
    useEffect(() => {
        console.log('NotificationListener mounted with userId:', userId);

        if (!userId) {
            console.warn('NotificationListener: No userId provided');
            return;
        }

        if (!window.Echo) {
            console.error('NotificationListener: Echo is not initialized');
            return;
        }

        console.log('Setting up notification listener for user:', userId);

        const channel = window.Echo.private(`App.Models.User.${userId}`);

        // Listen for notification event
        channel.notification((notification) => {
            console.log('🔔 New notification received:', notification);

            // Dispatch event that Header component will catch
            window.dispatchEvent(new CustomEvent('notification.received', {
                detail: notification
            }));

            // Show toast notification
            if (window.showToast) {
                let type = 'info';
                let message = 'New notification received';

                // Extract message from notification data
                if (notification.data?.message) {
                    message = notification.data.message;
                }

                // Try to determine notification type from notification data or type
                if (notification.data?.icon === 'success' || notification.type?.includes('Success')) {
                    type = 'success';
                } else if (notification.data?.icon === 'error' || notification.type?.includes('Error')) {
                    type = 'error';
                } else if (notification.data?.icon === 'warning' || notification.type?.includes('Warning')) {
                    type = 'warning';
                }

                // Use the title if available to make it more informative
                if (notification.data?.title) {
                    message = `${notification.data.title}: ${message}`;
                }

                window.showToast({
                    message: message,
                    type: type,
                    duration: 7000 // Slightly longer duration for better visibility
                });
            }
        });

        // Subscribe to channel events for debugging
        channel.error((error) => {
            console.error('Channel error:', error);
        });

        console.log('✅ Notification listener setup complete');

        return () => {
            console.log('NotificationListener unmounting, leaving channel');
            window.Echo.leave(`App.Models.User.${userId}`);
        };
    }, [userId]);

    return null;
}
