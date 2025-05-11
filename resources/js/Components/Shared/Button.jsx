import React from 'react';
import { Button as MuiButton, CircularProgress, alpha, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

const Button = React.forwardRef(({
                    children,
                    variant = 'contained',
                    color = 'primary',
                    size = 'medium',
                    type = 'button',
                    fullWidth = false,
                    disabled = false,
                    loading = false,
                    startIcon,
                    endIcon,
                    onClick,
                    className,
                    rounded = 'medium', // 'small', 'medium', 'large', 'full'
                    elevation = true,
                    animate = true,
                    ...props
                }, ref) => {
    const theme = useTheme();

    // Calculate border radius based on rounded prop
    const getBorderRadius = () => {
        switch (rounded) {
            case 'small': return '8px';
            case 'medium': return '12px';
            case 'large': return '16px';
            case 'full': return '50px';
            default: return '12px';
        }
    };

    // Get padding based on size
    const getPadding = () => {
        switch (size) {
            case 'small': return rounded === 'full' ? '4px 16px' : '4px 12px';
            case 'medium': return rounded === 'full' ? '6px 20px' : '6px 16px';
            case 'large': return rounded === 'full' ? '8px 28px' : '8px 22px';
            default: return '6px 16px';
        }
    };

    // Get shadow based on color and elevation
    const getShadow = () => {
        if (!elevation || variant !== 'contained' || disabled) return 'none';

        return `0 4px 10px ${alpha(
            theme.palette[color]?.main || theme.palette.primary.main,
            0.3
        )}`;
    };

    const buttonContent = (
        <MuiButton
            ref={ref}
            variant={variant}
            color={color}
            size={size}
            type={type}
            fullWidth={fullWidth}
            disabled={disabled || loading}
            startIcon={loading ? undefined : startIcon}
            endIcon={loading ? undefined : endIcon}
            onClick={onClick}
            className={className}
            sx={{
                borderRadius: getBorderRadius(),
                textTransform: 'none',
                fontWeight: 600,
                letterSpacing: '0.01em',
                padding: getPadding(),
                boxShadow: getShadow(),
                transition: 'all 0.2s ease-in-out',
                position: 'relative',
                '&:hover': {
                    boxShadow: getShadow(),
                    transform: !animate ? undefined : 'translateY(-2px)',
                    background: variant === 'contained' ? undefined :
                        alpha(theme.palette[color]?.main || theme.palette.primary.main, 0.08),
                },
            }}
            {...props}
        >
            {loading && (
                <CircularProgress
                    size={size === 'small' ? 16 : size === 'large' ? 24 : 20}
                    color="inherit"
                    sx={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        marginLeft: '-12px',
                        marginTop: '-12px',
                    }}
                />
            )}
            <span style={{ visibility: loading ? 'hidden' : 'visible' }}>
        {children}
      </span>
        </MuiButton>
    );

    // Apply motion if animate is true
    if (animate && !disabled && !loading) {
        return (
            <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ display: fullWidth ? 'block' : 'inline-block' }}
            >
                {buttonContent}
            </motion.div>
        );
    }

    return buttonContent;
});

Button.displayName = 'Button';

export default Button;
