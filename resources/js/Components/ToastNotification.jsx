// resources/js/Components/ToastNotification.jsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ToastNotification() {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        // Define showToast function on window object
        window.showToast = ({ message, type = 'info', duration = 5000 }) => {
            console.log('🔔 Showing toast:', message);
            const id = Date.now();

            setToasts(prev => [...prev, { id, message, type }]);

            // Auto-hide after duration (default 5 seconds)
            setTimeout(() => {
                setToasts(prev => prev.filter(toast => toast.id !== id));
            }, duration);
        };

        return () => {
            delete window.showToast;
        };
    }, []);

    const getColor = (type) => {
        switch (type) {
            case 'error': return { bg: '#f44336', text: '#ffffff' };
            case 'success': return { bg: '#4caf50', text: '#ffffff' };
            case 'warning': return { bg: '#ff9800', text: '#ffffff' };
            default: return { bg: '#2196f3', text: '#ffffff' };
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
                top: '80px', // Increased from 20px to 80px to position below the header
                right: '20px',
                zIndex: 10000, // Extremely high z-index to ensure visibility
                pointerEvents: 'none',
                width: '100%',
                maxWidth: '400px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '10px',
            }}
        >
            <AnimatePresence>
                {toasts.map((toast) => {
                    const colors = getColor(toast.type);

                    return (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: -50, x: 50 }}
                            animate={{ opacity: 1, y: 0, x: 0 }}
                            exit={{ opacity: 0, y: -20, x: 50 }}
                            transition={{ duration: 0.3 }}
                            style={{
                                backgroundColor: colors.bg,
                                color: colors.text,
                                padding: '16px 20px',
                                borderRadius: '12px',
                                boxShadow: '0 5px 15px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.05)',
                                width: 'calc(100% - 20px)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                pointerEvents: 'auto',
                                position: 'relative',
                                fontSize: '16px',
                                fontWeight: 500,
                                overflow: 'hidden',
                                border: '1px solid rgba(255,255,255,0.1)',
                            }}
                        >
                            {/* Notification header line */}
                            <div
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '4px',
                                    background: 'rgba(255,255,255 ,0.4)'
                                }}
                            />

                            <span style={{ fontSize: '22px' }}>{getIcon(toast.type)}</span>
                            <div style={{ flex: 1, wordBreak: 'break-word' }}>{toast.message}</div>
                            <button
                                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                                style={{
                                    background: 'rgba(255,255,255,0.2)',
                                    border: 'none',
                                    color: colors.text,
                                    cursor: 'pointer',
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: 0,
                                    marginLeft: '8px'
                                }}
                            >
                                ×
                            </button>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}
