import React from 'react';
import { Tooltip as MuiTooltip, alpha, useTheme, Zoom } from '@mui/material';

const Tooltip = ({
                     children,
                     title,
                     placement = 'top',
                     arrow = true,
                     className,
                     variant = 'default', // 'default', 'light', 'dark', 'primary'
                     enterDelay = 100,
                     leaveDelay = 0,
                     maxWidth = 220,
                     interactive = false,
                     animate = true,
                     ...props
                 }) => {
    const theme = useTheme();

    // Skip rendering tooltip if no title provided
    if (!title) {
        return children;
    }

    // Get styles based on variant
    const getTooltipStyles = () => {
        const baseStyles = {
            maxWidth: maxWidth,
            fontSize: '0.75rem',
            padding: '6px 12px',
            borderRadius: '6px',
        };

        switch (variant) {
            case 'light':
                return {
                    ...baseStyles,
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    boxShadow: theme.shadows[2],
                    border: `1px solid ${theme.palette.divider}`,
                    '& .MuiTooltip-arrow': {
                        color: theme.palette.background.paper,
                        '&:before': {
                            border: `1px solid ${theme.palette.divider}`,
                            backgroundColor: theme.palette.background.paper,
                        }
                    }
                };
            case 'dark':
                return {
                    ...baseStyles,
                    backgroundColor: alpha(theme.palette.grey[900], 0.9),
                    color: theme.palette.common.white,
                    '& .MuiTooltip-arrow': {
                        color: alpha(theme.palette.grey[900], 0.9),
                    }
                };
            case 'primary':
                return {
                    ...baseStyles,
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    '& .MuiTooltip-arrow': {
                        color: theme.palette.primary.main,
                    }
                };
            case 'default':
            default:
                return baseStyles;
        }
    };

    return (
        <MuiTooltip
            title={title}
            placement={placement}
            arrow={arrow}
            enterDelay={enterDelay}
            leaveDelay={leaveDelay}
            interactive={interactive}
            TransitionComponent={animate ? Zoom : undefined}
            TransitionProps={animate ? { timeout: 200 } : undefined}
            classes={className}
            PopperProps={{
                sx: {
                    opacity: 1, // Ensure full opacity
                }
            }}
            componentsProps={{
                tooltip: {
                    sx: getTooltipStyles(),
                },
            }}
            {...props}
        >
            {children}
        </MuiTooltip>
    );
};

export default Tooltip;
