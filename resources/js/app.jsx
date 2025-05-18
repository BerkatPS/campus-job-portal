import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import MuiThemeProvider from '@/Theme/MuiThemeProvider';
import ToastNotification from '@/Components/ToastNotification';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        // Add ToastNotification here at the top level, but NOT NotificationListener
        root.render(
            <MuiThemeProvider>
                <ToastNotification />
                <App {...props} />
            </MuiThemeProvider>
        );
    },
    progress: {
        color: '#5bb4c2',
    },
    // Adding 404 page handling
    resolveErrors: (error) => {
        if (error.response && error.response.status === 404) {
            return {
                __component: 'Errors/404',  // Pastikan ini adalah jalur komponen yang benar
                title: 'Halaman Tidak Ditemukan'
            };
        }
        return error;
    },

});
