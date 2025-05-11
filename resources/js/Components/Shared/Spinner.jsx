import React from 'react';
import { CircularProgress, Box, Typography, alpha, useTheme, Backdrop, Fade } from '@mui/material';
import { motion } from 'framer-motion';

const Spinner = ({
                     size = 40,
                     color = 'primary',
                     thickness = 4,
                     message,
                     variant = 'circular', // 'circular', 'pulse', 'dots'
                     overlay = false,
                     className,
                     position = 'center', // 'center', 'top', 'bottom'
                     animate = true,
                     ...props
                 }) => {
    const theme = useTheme();

    // Pulse animation spinner
    const PulseSpinner = () => {
        return (
            <Box sx={{ display: 'flex', gap: 1 }}>
                {[1, 2, 3].map((i) => (
                    <motion.div
                        key={i}
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.6, 1, 0.6]
                        }}
                        transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            repeatType: 'loop',
                            delay: i * 0.15,
                            ease: 'easeInOut'
                        }}
                    >
                        <Box
                            sx={{
                                width: size / 2.5,
                                height: size / 2.5,
                                borderRadius: '50%',
                                backgroundColor: theme.palette[color].main,
                            }}
                        />
                    </motion.div>
                ))}
            </Box>
        );
    };

    // Dots animation spinner
    const DotsSpinner = () => {
        return (
            <Box sx={{ display: 'flex', gap: 1 }}>
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        animate={{
                            y: ['0%', '-50%', '0%']
                        }}
                        transition={{
                            duration: 0.5,
                            repeat: Infinity,
                            repeatType: 'loop',
                            delay: i * 0.15,
                            ease: 'easeInOut'
                        }}
                    >
                        <Box
                            sx={{
                                width: size / 3.5,
                                height: size / 3.5,
                                borderRadius: '50%',
                                backgroundColor: theme.palette[color].main,
                            }}
                        />
                    </motion.div>
                ))}
            </Box>
        );
    };

    // Get spinner based on variant
    const getSpinner = () => {
        switch (variant) {
            case 'pulse':
                return <PulseSpinner />;
            case 'dots':
                return <DotsSpinner />;
            case 'circular':
            default:
                return (
                    <CircularProgress
                        color={color}
                        size={size}
                        thickness={thickness}
                        {...props}
                    />
                );
        }
    };

    // Position styles
    const getPositionStyles = () => {
        switch (position) {
            case 'top':
                return {
                    alignItems: 'flex-start',
                    pt: 4
                };
            case 'bottom':
                return {
                    alignItems: 'flex-end',
                    pb: 4
                };
            case 'center':
            default:
                return {
                    alignItems: 'center'
                };
        }
    };

    const spinner = (
        <Box
            className={className}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                ...getPositionStyles(),
                gap: 2
            }}
        >
            {animate ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                    {getSpinner()}
                </motion.div>
            ) : (
                getSpinner()
            )}

            {message && (
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mt: 1,
                        fontWeight: 500,
                        textAlign: 'center'
                    }}
                >
                    {message}
                </Typography>
            )}
        </Box>
    );

    if (overlay) {
        return (
            <Backdrop
                sx={{
                    color: '#fff',
                    zIndex: theme.zIndex.drawer + 1,
                    backgroundColor: alpha(theme.palette.background.paper, 0.7),
                    backdropFilter: 'blur(4px)'
                }}
                open={true}
            >
                <Fade in={true}>
                    {spinner}
                </Fade>
            </Backdrop>
        );
    }

    return spinner;
};

export default Spinner;
