import React, { useState } from 'react';
import { Avatar, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

/**
 * CompanyLogo Component
 *
 * Displays a company logo with fallback to a color-generated initial when no logo is available
 * or when the logo fails to load.
 *
 * @param {Object} props
 * @param {Object} props.company - The company object with name and logo_url properties
 * @param {number} props.size - Size of the logo in pixels (default: 48)
 * @param {string} props.variant - Avatar variant ('circular', 'rounded', 'square') (default: 'square')
 * @param {Object} props.sx - Additional MUI sx styles to apply to the Avatar
 * @returns {JSX.Element}
 */
const CompanyLogo = ({ company, size = 48, variant = 'square', sx = {} }) => {
    const [hasError, setHasError] = useState(false);
    const theme = useTheme();

    // Generate colors based on company name
    const generateColorFromName = (name) => {
        if (!name) return theme.palette.primary.main;

        const colors = [
            theme.palette.primary.main,
            theme.palette.secondary.main,
            theme.palette.success.main,
            theme.palette.warning.main,
            theme.palette.info.main,
        ];

        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }

        return colors[Math.abs(hash) % colors.length];
    };

    // Generate a gradient style for the avatar background
    const generateGradientStyle = (name) => {
        if (!name) return { bgcolor: theme.palette.primary.main };

        const baseColor = generateColorFromName(name);
        const lighterColor = `${baseColor}99`; // Add transparency to make it lighter

        return {
            background: `linear-gradient(135deg, ${baseColor} 0%, ${lighterColor} 100%)`,
        };
    };

    // If no logo or error loading, show a styled avatar with initials
    if (!company?.logo_url || hasError) {
        const initials = company?.name?.charAt(0) || '?';
        const gradientStyle = generateGradientStyle(company?.name);

        return (
            <Avatar
                variant={variant}
                sx={{
                    width: size,
                    height: size,
                    fontSize: size * 0.5,
                    fontWeight: 'bold',
                    color: 'white',
                    ...gradientStyle,
                    ...sx
                }}
            >
                {initials.toUpperCase()}
            </Avatar>
        );
    }

    // Otherwise, show the logo image with error handling
    return (
        <Avatar
            src={company.logo_url}
            alt={company.name || 'Company Logo'}
            variant={variant}
            onError={() => setHasError(true)}
            sx={{
                width: size,
                height: size,
                ...sx
            }}
        />
    );
};

export default CompanyLogo;
