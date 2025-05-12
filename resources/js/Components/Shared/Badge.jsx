import React from 'react';
import { Chip, Badge as MuiBadge, Box, useTheme, Typography } from '@mui/material';

const Badge = ({
                   label,
                   color = 'default',
                   size = 'medium',
                   variant = 'filled', // 'filled', 'outlined', 'text'
                   shape = 'rounded', // 'rounded', 'square', 'pill'
                   icon,
                   badgeContent,
                   overlap,
                   className,
                   sx = {},
                   children,
                   ...props
               }) => {
    const theme = useTheme();

    // Jika ada children, gunakan MuiBadge untuk membuatnya sebagai badge
    if (children) {
        return (
            <MuiBadge
                badgeContent={badgeContent}
                color={color}
                overlap={overlap || 'rectangular'}
                className={className}
                sx={sx}
                {...props}
            >
                {children}
            </MuiBadge>
        );
    }

    // Jika tidak ada children, gunakan Chip untuk badge standalone
    const chipProps = { ...props };
    delete chipProps.children;

    // Tentukan border radius berdasarkan shape
    const getBorderRadius = () => {
        switch (shape) {
            case 'square': return '4px';
            case 'pill': return '9999px';
            case 'rounded':
            default: return size === 'small' ? '12px' : '16px';
        }
    };

    // Tentukan padding berdasarkan ukuran
    const getPadding = () => {
        if (variant === 'text') {
            return size === 'small' ? '0 4px' : '0 6px';
        }
        return size === 'small' ? '0 8px' : '0 12px';
    };

    // Tentukan tinggi berdasarkan ukuran
    const getHeight = () => {
        return size === 'small' ? '20px' : '24px';
    };

    // Tentukan font size berdasarkan ukuran
    const getFontSize = () => {
        return size === 'small' ? '0.7rem' : '0.75rem';
    };

    // Tentukan style berdasarkan variant
    const getVariantStyles = () => {
        // Validasi apakah color ada dalam palette dan memiliki properti main
        // Jika tidak, gunakan default untuk mencegah error
        const validColors = ['primary', 'secondary', 'success', 'error', 'info', 'warning', 'default'];
        const safeColor = validColors.includes(color) ? color : 'default';

        // Ini akan membuat rgba dengan opacity rendah yang aman bahkan jika Theme.palette[safeColor].main tidak ada
        const getHoverBackground = () => {
            return theme.palette.mode === 'dark'
                ? `rgba(0, 0, 0, 0.08)`  // Dark mode hover color
                : `rgba(0, 0, 0, 0.04)`; // Light mode hover color
        };

        switch (variant) {
            case 'outlined':
                return {
                    backgroundColor: 'transparent',
                    borderColor: `${safeColor}.main`,
                    color: `${safeColor}.main`,
                    '&:hover': {
                        backgroundColor: getHoverBackground()
                    }
                };
            case 'text':
                return {
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: `${safeColor}.main`,
                    padding: getPadding(),
                };
            case 'filled':
            default:
                return {
                    backgroundColor: `${safeColor}.main`,
                    borderColor: `${safeColor}.main`,
                    color: `${safeColor}.contrastText`,
                    '&:hover': {
                        backgroundColor: `${safeColor}.dark`,
                    }
                };
        }
    };

    return (
        <Chip
            label={
                <Typography
                    variant="caption"
                    sx={{
                        fontWeight: 500,
                        fontSize: getFontSize(),
                        lineHeight: 1,
                    }}
                >
                    {label}
                </Typography>
            }
            size={size}
            icon={icon}
            variant={variant === 'outlined' ? 'outlined' : 'filled'}
            className={className}
            sx={{
                height: getHeight(),
                borderRadius: getBorderRadius(),
                padding: getPadding(),
                fontSize: getFontSize(),
                fontWeight: 500,
                ...getVariantStyles(),
                ...sx,
            }}
            {...chipProps}
        />
    );
};

export default Badge;
