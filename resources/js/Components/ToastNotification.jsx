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

    const getAccentColor = (type) => {
        switch (type) {
            case 'error': return '#e53935';
            case 'success': return '#43a047';
            case 'warning': return '#fb8c00';
            default: return '#1e88e5';
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'error': return 'error';
            case 'success': return 'check_circle';
            case 'warning': return 'warning';
            default: return 'info';
        }
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: '80px', // Positioned below the header
                right: '20px',
                zIndex: 10000,
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
                    const accentColor = getAccentColor(toast.type);

                    return (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: -50, x: 50 }}
                            animate={{ opacity: 1, y: 0, x: 0 }}
                            exit={{ opacity: 0, y: -20, x: 50 }}
                            transition={{ duration: 0.3 }}
                            style={{
                                backgroundColor: '#ffffff',
                                color: '#333333',
                                padding: '16px 20px',
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.02)',
                                width: 'calc(100% - 20px)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                pointerEvents: 'auto',
                                position: 'relative',
                                fontSize: '14px',
                                fontWeight: 500,
                                overflow: 'hidden',
                                borderLeft: `4px solid ${accentColor}`,
                            }}
                        >
                            {/* Icon with accent color */}
                            <span 
                                className="material-icons" 
                                style={{ 
                                    fontSize: '20px', 
                                    color: accentColor 
                                }}
                            >
                                {getIcon(toast.type)}
                            </span>
                            
                            {/* Message */}
                            <div style={{ flex: 1, wordBreak: 'break-word' }}>{toast.message}</div>
                            
                            {/* Close button */}
                            <button
                                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#9e9e9e',
                                    cursor: 'pointer',
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: 0,
                                    marginLeft: '8px',
                                    transition: 'background-color 0.2s',
                                    '&:hover': {
                                        backgroundColor: 'rgba(0,0,0,0.05)'
                                    }
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
