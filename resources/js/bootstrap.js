// resources/js/bootstrap.js
import _ from 'lodash';
window._ = _;

import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Add CSRF token - Improve token retrieval with fallbacks
let token = document.head.querySelector('meta[name="csrf-token"]');
if (token) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
    console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
}

// Set withCredentials to ensure cookies are sent with cross-domain requests
window.axios.defaults.withCredentials = true;

// Configure axios to handle session timeouts and CSRF mismatches
window.axios.interceptors.response.use(
    response => response,
    error => {
        // Handle 419 (CSRF token mismatch) errors by refreshing the page to get a new token
        if (error.response && error.response.status === 419) {
            console.warn('CSRF token mismatch detected. Refreshing page to obtain a new token.');

            // Store the current URL to redirect back after refresh
            const currentPath = window.location.href;
            sessionStorage.setItem('redirect_after_refresh', currentPath);

            // Reload the page to get a fresh CSRF token
            window.location.reload();
            return new Promise(() => {});
        }

        // Handle 401 (Unauthenticated) errors
        if (error.response && error.response.status === 401) {
            console.warn('Session expired. Redirecting to login page.');
            window.location.href = '/login';
            return new Promise(() => {});
        }

        return Promise.reject(error);
    }
);

// Import Echo and Pusher
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

/*
|--------------------------------------------------------------------------
| Echo Configuration
|--------------------------------------------------------------------------
|
| Echo enables real-time event broadcasting. We'll use Laravel Echo to
| subscribe to private channels and receive notifications in real-time.
*/

// Enable detailed logging
Pusher.logToConsole = true;

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: true,
    authEndpoint: '/broadcasting/auth', // Pastikan endpoint ini sesuai
    // Custom authorizer untuk mengelola otentikasi dengan lebih baik
    authorizer: (channel, options) => {
        return {
            authorize: (socketId, callback) => {
                axios.post('/broadcasting/auth', {
                    socket_id: socketId,
                    channel_name: channel.name
                }, {
                    headers: {
                        'X-CSRF-TOKEN': token ? token.content : '',
                    },
                    withCredentials: true // Penting! Pastikan cookies terkirim
                })
                .then(response => {
                    callback(false, response.data);
                })
                .catch(error => {
                    console.error('Authorization Error:', error);
                    callback(true, error);
                });
            }
        };
    }
});

if (window.Echo?.connector?.pusher) {
    // Log connection state changes
    window.Echo.connector.pusher.connection.bind('state_change', function(states) {
        console.log('Pusher state changed from', states.previous, 'to', states.current);
    });
    
    // Log connection errors
    window.Echo.connector.pusher.connection.bind('error', function(err) {
        console.error('Pusher connection error:', err);
    });
}

// Add a global function to check if private channels are working
window.testPrivateChannel = function(userId) {
    if (!window.Echo) {
        console.error('Echo is not initialized');
        return;
    }
    
    console.log('Testing private channel subscription...');
    
    // Subscribe to the private channel
    const channel = window.Echo.private(`App.Models.User.${userId}`);
    
    // Add a listener for a test event
    channel.listen('TestEvent', (e) => {
        console.log('Received test event:', e);
    });
    
    console.log(`Subscribed to private-App.Models.User.${userId}`);
};

// Check for redirect after refresh
document.addEventListener('DOMContentLoaded', () => {
    const redirectPath = sessionStorage.getItem('redirect_after_refresh');
    if (redirectPath) {
        sessionStorage.removeItem('redirect_after_refresh');
        // Only redirect if we're not already on that page
        if (window.location.href !== redirectPath) {
            window.location.href = redirectPath;
        }
    }
});
