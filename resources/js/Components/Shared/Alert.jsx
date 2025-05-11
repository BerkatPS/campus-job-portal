import React, { useState, useEffect } from 'react';
import {
    Alert as MuiAlert,
    AlertTitle,
    IconButton,
    Box,
    Typography,
    alpha,
    Collapse,
    LinearProgress,
    Stack,
    Grow
} from '@mui/material';
import {
    Close as CloseIcon,
    Info as InfoIcon,
    Warning as WarningIcon,
    Error as ErrorIcon,
    CheckCircle as CheckCircleIcon,
    ArrowForward as ArrowForwardIcon,
    MoreVert as MoreVertIcon,
    AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const severityIcons = {
    success: <CheckCircleIcon />,
    info: <InfoIcon />,
    warning: <WarningIcon />,
    error: <ErrorIcon />
};

// Custom progress bar for auto-dismissing alerts
const TimerProgressBar = ({ duration, isRunning, onComplete }) => {
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        if (!isRunning) return;

        const startTime = Date.now();
        const endTime = startTime + duration;

        const timer = setInterval(() => {
            const now = Date.now();
            const remaining = endTime - now;
            const newProgress = (remaining / duration) * 100;

            if (remaining <= 0) {
                clearInterval(timer);
                setProgress(0);
                onComplete();
            } else {
                setProgress(newProgress);
            }
        }, 30);

        return () => clearInterval(timer);
    }, [isRunning, duration, onComplete]);

    return (
        <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 3,
                borderBottomLeftRadius: '14px',
                borderBottomRightRadius: '14px',
                bgcolor: 'transparent',
                '& .MuiLinearProgress-bar': {
                    transition: 'none'
                }
            }}
        />
    );
};

const Alert = ({
                   children,
                   severity = 'info',
                   title,
                   onClose,
                   className,
                   variant = 'filled', // 'filled', 'outlined', 'standard', 'elevated'
                   icon,
                   action,
                   elevation = 0,
                   autoHideDuration,
                   actionText,
                   onActionClick,
                   dismissible = true,
                   dense = false,
                   showTimestamp = false,
                   timestamp = new Date(),
                   animate = true,
                   ...props
               }) => {
    const [open, setOpen] = useState(true);
    const [timerRunning, setTimerRunning] = useState(!!autoHideDuration);

    // Custom styles based on severity and variant
    const getCustomStyles = (theme) => {
        // Base styles
        const styles = {
            borderRadius: '14px',
            boxShadow: variant === 'elevated' ? theme.shadows[4] : (elevation ? theme.shadows[elevation] : 'none'),
            borderWidth: variant === 'outlined' ? 1 : 0,
            p: dense ? 1.5 : 2,
            alignItems: 'flex-start',
            position: 'relative',
            overflow: 'hidden',
            '&:hover': {
                boxShadow: variant === 'elevated' ? theme.shadows[6] : undefined
            }
        };

        // Background color based on variant
        if (variant === 'filled') {
            styles.bgcolor = theme.palette[severity].main;
            styles.color = theme.palette[severity].contrastText;
        } else if (variant === 'elevated') {
            styles.bgcolor = theme.palette.background.paper;
            styles.color = theme.palette.text.primary;
            styles.borderLeft = `4px solid ${theme.palette[severity].main}`;
        } else {
            styles.bgcolor = alpha(theme.palette[severity].main, variant === 'outlined' ? 0.05 : 0.1);
            styles.color = theme.palette.text.primary;
        }

        // Icon styles
        styles['& .MuiAlert-icon'] = {
            mt: title ? 0.5 : 0,
            mr: 2,
            p: 0.5,
            borderRadius: '12px',
            bgcolor: variant === 'filled'
                ? alpha('#fff', 0.2)
                : alpha(theme.palette[severity].main, 0.15),
            color: variant === 'filled'
                ? theme.palette[severity].contrastText
                : theme.palette[severity].main
        };

        return styles;
    };

    // Auto-hide functionality
    useEffect(() => {
        if (!autoHideDuration || !open) return;

        const timer = setTimeout(() => {
            handleClose();
        }, autoHideDuration);

        return () => clearTimeout(timer);
    }, [autoHideDuration, open]);

    const handleClose = () => {
        setOpen(false);
        if (onClose) {
            setTimeout(() => {
                onClose();
            }, 300); // Match the exit animation duration
        }
    };

    // Pause timer on hover
    const handleMouseEnter = () => {
        if (autoHideDuration) {
            setTimerRunning(false);
        }
    };

    const handleMouseLeave = () => {
        if (autoHideDuration) {
            setTimerRunning(true);
        }
    };

    const alertContent = (
        <MuiAlert
            severity={severity}
            variant={variant === 'elevated' ? 'standard' : variant}
            icon={icon || severityIcons[severity]}
            action={
                <>
                    {actionText && (
                        <Button
                            color={variant === 'filled' ? 'inherit' : severity}
                            size="small"
                            endIcon={<ArrowForwardIcon />}
                            onClick={onActionClick}
                            sx={{
                                fontWeight: 600,
                                mt: title ? 0 : -0.5,
                                fontSize: '0.8125rem',
                                textTransform: 'none',
                                '&:hover': {
                                    bgcolor: variant === 'filled'
                                        ? alpha('#fff', 0.15)
                                        : alpha(theme => theme.palette[severity].main, 0.1)
                                }
                            }}
                        >
                            {actionText}
                        </Button>
                    )}
                    {action}
                    {dismissible && onClose && (
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={handleClose}
                            sx={{
                                ml: 1,
                                borderRadius: '12px',
                                '&:hover': {
                                    bgcolor: variant === 'filled'
                                        ? alpha('#fff', 0.15)
                                        : alpha(theme => theme.palette[severity].main, 0.1)
                                }
                            }}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    )}
                </>
            }
            sx={getCustomStyles}
            className={className}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            {...props}
        >
            <Box>
                {title && (
                    <AlertTitle
                        sx={{
                            fontWeight: 600,
                            mb: 0.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}
                    >
                        <Box>{title}</Box>
                        {showTimestamp && (
                            <Typography
                                variant="caption"
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    opacity: 0.8,
                                    ml: 2,
                                    fontWeight: 400
                                }}
                            >
                                <AccessTimeIcon fontSize="inherit" sx={{ mr: 0.5 }} />
                                {typeof timestamp === 'string'
                                    ? timestamp
                                    : timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Typography>
                        )}
                    </AlertTitle>
                )}
                {typeof children === 'string' ? (
                    <Typography
                        variant="body2"
                        sx={{
                            opacity: variant === 'filled' ? 0.95 : 0.9,
                            lineHeight: 1.5
                        }}
                    >
                        {children}
                    </Typography>
                ) : (
                    children
                )}
            </Box>

            {autoHideDuration && timerRunning && (
                <TimerProgressBar
                    duration={autoHideDuration}
                    isRunning={timerRunning}
                    onComplete={handleClose}
                />
            )}
        </MuiAlert>
    );

    if (!animate) {
        return open ? alertContent : null;
    }

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Grow in={open} timeout={300}>
                        <div>
                            {alertContent}
                        </div>
                    </Grow>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Alert;
