import React from 'react';
import { Box, Typography, Button, useTheme } from '@mui/material';
import { Inbox, SearchX, FileQuestion, AlertCircle } from 'lucide-react';

/**
 * EmptyState Component
 *
 * A reusable component for displaying empty state messages across the application.
 *
 * @param {Object} props
 * @param {string} props.title - Main title for the empty state
 * @param {string} props.description - Detailed description of the empty state
 * @param {React.ReactNode} props.icon - Custom icon to display (defaults to Inbox icon)
 * @param {string} props.iconType - Predefined icon type ('default', 'search', 'file', 'warning')
 * @param {string} props.actionText - Text for the action button
 * @param {function} props.onAction - Function to call when action button is clicked
 * @param {Object} props.sx - Additional styling for the component
 * @returns {JSX.Element}
 */
const EmptyState = ({
    title = "No items found",
    description = "There are no items to display at the moment.",
    icon = null,
    iconType = "default",
    actionText = "",
    onAction = null,
    sx = {}
}) => {
    const theme = useTheme();

    const getIcon = () => {
        const iconSize = 64;
        const iconColor = theme.palette.primary.main;

        if (icon) return icon;

        switch (iconType) {
            case 'search':
                return <SearchX size={iconSize} color={iconColor} />;
            case 'file':
                return <FileQuestion size={iconSize} color={iconColor} />;
            case 'warning':
                return <AlertCircle size={iconSize} color={iconColor} />;
            case 'default':
            default:
                return <Inbox size={iconSize} color={iconColor} />;
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                py: 6,
                px: 3,
                ...sx
            }}
        >
            <Box
                sx={{
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 2,
                    borderRadius: '50%',
                    bgcolor: theme.palette.primary.main + '15',
                }}
            >
                {getIcon()}
            </Box>

            <Typography
                variant="h5"
                component="h3"
                fontWeight={600}
                gutterBottom
                color="text.primary"
            >
                {title}
            </Typography>

            <Typography
                variant="body1"
                color="text.secondary"
                sx={{ maxWidth: 450, mb: actionText ? 3 : 0 }}
            >
                {description}
            </Typography>

            {actionText && onAction && (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={onAction}
                    sx={{ mt: 2 }}
                >
                    {actionText}
                </Button>
            )}
        </Box>
    );
};

export default EmptyState;
