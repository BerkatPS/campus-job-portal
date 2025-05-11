// resources/js/Components/ToastNotification.jsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {alpha, IconButton, Tooltip, useThemeProps} from "@mui/material";
import {useTheme} from "@mui/material/styles";

export default function ToastNotification() {
    const [toasts, setToasts] = useState([]);
    const { theme } = useTheme();

    useEffect(() => {
        // Define showToast function on window object
        window.showToast = ({ message, type = 'info' }) => {
            console.log('🔔 Showing toast:', message);
            const id = Date.now();

            setToasts(prev => [...prev, { id, message, type }]);

            // Auto-hide after 5 seconds
            setTimeout(() => {
                setToasts(prev => prev.filter(toast => toast.id !== id));
            }, 5000);
        };

        return () => {
            delete window.showToast;
        };
    }, []);

    const getColor = (type) => {
        switch (type) {
            case 'error': return '#f44336';
            case 'success': return '#4caf50';
            case 'warning': return '#ff9800';
            default: return '#2196f3';
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'error': return '❌';
            case 'success': return '✅';
            case 'warning': return '⚠️';
            default: return 'ℹ️';
        }
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: '20px', // Position from top
                right: '20px', // Position from right
                zIndex: 999999, // Ensure it's on top of all UI elements
                pointerEvents: 'none',
                width: '100%', // Allow full width responsiveness
                maxWidth: '400px', // Limit max width to 400px
                marginTop: '10px', // Space between consecutive notifications
                marginRight: '20px', // Right margin for spacing
                overflow: 'visible', // Ensure content is fully visible
            }}
        >
            <AnimatePresence>
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        initial={{opacity: 0, y: -20, scale: 0.8}}
                        animate={{opacity: 1, y: 0, scale: 1}}
                        exit={{opacity: 0, y: -20, scale: 0.8}}
                        transition={{duration: 0.3}}
                        style={{
                            backgroundColor: getColor(toast.type), // Set color based on type (info, error, success)
                            color: 'white',
                            padding: '16px 24px',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)', // Ensure shadow to make it pop
                            minWidth: '300px', // Minimum width of the toast
                            maxWidth: '450px', // Maximum width to prevent overflow
                            marginBottom: '10px', // Space between multiple toasts
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            pointerEvents: 'auto',
                            position: 'relative',
                            overflow: 'visible', // Prevent overflow clipping
                        }}
                    >
                        <span style={{fontSize: '20px'}}>{getIcon(toast.type)}</span>
                        <div style={{flex: 1}}>{toast.message}</div>
                        <button
                            onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '20px',
                                padding: '4px 8px',
                                marginLeft: 'auto'
                            }}
                        >
                            ×
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
