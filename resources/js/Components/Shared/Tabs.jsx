import React, { useState, useEffect } from 'react';
import {
    Tabs as MuiTabs,
    Tab as MuiTab,
    Box,
    alpha,
    useTheme,
    Badge
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const TabPanel = ({ children, value, index, animate = true, padding = 3, ...props }) => {
    const theme = useTheme();

    if (!animate) {
        return (
            <Box
                role="tabpanel"
                hidden={value !== index}
                id={`tabpanel-${index}`}
                aria-labelledby={`tab-${index}`}
                sx={{ p: padding }}
                {...props}
            >
                {value === index && children}
            </Box>
        );
    }

    return (
        <Box
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            sx={{ p: padding, overflow: 'hidden' }}
            {...props}
        >
            <AnimatePresence mode="wait">
                {value === index && (
                    <motion.div
                        key={`tab-${index}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </Box>
    );
};

const Tabs = ({
                  value = 0,
                  onChange,
                  tabs = [],
                  variant = "standard", // "standard", "contained", "fullWidth", "pills", "buttons"
                  orientation = "horizontal",
                  className,
                  tabClassName,
                  tabPanelClassName,
                  centered = false,
                  scrollable = false,
                  padding = 3,
                  indicatorColor = "primary",
                  indicatorHeight = 3,
                  size = "medium", // "small", "medium", "large"
                  animate = true,
                  showBadges = true,
                  tabPadding,
                  rounded = "medium", // "small", "medium", "large", "full"
                  fullWidth = false,
                  ...props
              }) => {
    const theme = useTheme();
    const safeValue = value !== undefined && value !== null ? value : 0;
    const [mountedValue, setMountedValue] = useState(safeValue);

    useEffect(() => {
        setMountedValue(value !== undefined && value !== null ? value : 0);
    }, [value]);

    // Calculate border radius based on rounded prop
    const getBorderRadius = () => {
        switch (rounded) {
            case 'small': return theme.spacing(0.5);
            case 'medium': return theme.spacing(1);
            case 'large': return theme.spacing(1.5);
            case 'full': return theme.spacing(5); // Very rounded
            default: return theme.spacing(1);
        }
    };

    // Get tab styling based on variant
    const getTabStyles = () => {
        const radius = getBorderRadius();

        // Get padding based on size
        const getPadding = () => {
            if (tabPadding) return tabPadding;
            switch (size) {
                case 'small': return orientation === 'vertical' ? '6px 12px' : '6px 10px';
                case 'large': return orientation === 'vertical' ? '12px 24px' : '12px 20px';
                case 'medium':
                default: return orientation === 'vertical' ? '8px 16px' : '8px 16px';
            }
        };

        // Font size based on size
        const getFontSize = () => {
            switch (size) {
                case 'small': return '0.8125rem';
                case 'large': return '1rem';
                case 'medium':
                default: return '0.875rem';
            }
        };

        // Base styles for all variants
        const baseStyles = {
            padding: getPadding(),
            minHeight: 'auto',
            fontSize: getFontSize(),
            fontWeight: 500,
            transition: 'all 0.2s ease-in-out',
            textTransform: 'none',
            '&.Mui-selected': {
                fontWeight: 600,
            },
        };

        // Additional styles based on variant
        switch (variant) {
            case 'fullWidth':
                return {
                    ...baseStyles,
                    opacity: 0.7,
                    flex: 1,
                    '&.Mui-selected': {
                        ...baseStyles['&.Mui-selected'],
                        opacity: 1,
                    },
                };

            case 'contained':
                return {
                    ...baseStyles,
                    minWidth: 'auto',
                    marginRight: orientation === 'horizontal' ? 1 : 0,
                    marginBottom: orientation === 'vertical' ? 1 : 0,
                    borderRadius: radius,
                    color: theme.palette.text.secondary,
                    '&.Mui-selected': {
                        ...baseStyles['&.Mui-selected'],
                        color: theme.palette.primary.main,
                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    },
                    '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.04),
                    },
                };

            case 'pills':
                return {
                    ...baseStyles,
                    minWidth: 'auto',
                    marginRight: orientation === 'horizontal' ? 1 : 0,
                    marginBottom: orientation === 'vertical' ? 1 : 0,
                    borderRadius: radius,
                    color: theme.palette.text.secondary,
                    '&.Mui-selected': {
                        ...baseStyles['&.Mui-selected'],
                        color: theme.palette.common.white,
                        backgroundColor: theme.palette.primary.main,
                    },
                    '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.04),
                        '&.Mui-selected': {
                            backgroundColor: theme.palette.primary.dark,
                        },
                    },
                };

            case 'buttons':
                return {
                    ...baseStyles,
                    minWidth: 'auto',
                    marginRight: orientation === 'horizontal' ? 1 : 0,
                    marginBottom: orientation === 'vertical' ? 1 : 0,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: radius,
                    '&.Mui-selected': {
                        ...baseStyles['&.Mui-selected'],
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        borderColor: theme.palette.primary.main,
                    },
                    '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.04),
                    },
                };

            case 'standard':
            default:
                return {
                    ...baseStyles,
                    opacity: 0.7,
                    '&.Mui-selected': {
                        ...baseStyles['&.Mui-selected'],
                        opacity: 1,
                    },
                    '&:after': variant !== 'fullWidth' ? {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: '2px',
                        borderRadius: '2px 2px 0 0',
                        backgroundColor: 'transparent',
                    } : undefined,
                    '&.Mui-selected:after': variant !== 'fullWidth' ? {
                        backgroundColor: theme.palette.primary.main,
                    } : undefined,
                };
        }
    };

    // Render the tab label with optional badge
    const renderTabLabel = (tab) => {
        if (!tab.badge || !showBadges) {
            return tab.label;
        }

        return (
            <Box sx={{ position: 'relative', pr: 2 }}>
                {tab.label}
                <Badge
                    badgeContent={tab.badge}
                    color="error"
                    sx={{
                        position: 'absolute',
                        right: -8,
                        top: -8,
                        '& .MuiBadge-badge': {
                            fontSize: '0.6rem',
                            height: 16,
                            minWidth: 16,
                        },
                    }}
                />
            </Box>
        );
    };

    // Additional props for MUI Tabs component
    const getTabsProps = () => ({
        orientation,
        variant: variant === 'fullWidth' ? 'fullWidth' : (scrollable ? 'scrollable' : 'standard'),
        centered: !scrollable && centered,
        allowScrollButtonsMobile: scrollable,
        ScrollButtonComponent: scrollable ? undefined : null,
        TabIndicatorProps: {
            style: {
                height: orientation === 'horizontal' ? indicatorHeight : undefined,
                width: orientation === 'vertical' ? indicatorHeight : undefined,
            },
            sx: {
                display: ['pills', 'buttons', 'contained'].includes(variant) ? 'none' : undefined,
            },
        },
    });

    return (
        <Box
            className={className}
            sx={{
                width: '100%',
                display: 'flex',
                flexDirection: orientation === 'vertical' ? 'row' : 'column',
            }}
        >
            <Box
                sx={{
                    borderBottom: orientation === 'horizontal' && variant === 'standard' ? 1 : 0,
                    borderRight: orientation === 'vertical' && variant === 'standard' ? 1 : 0,
                    borderColor: 'divider',
                    width: orientation === 'vertical' ? 'auto' : '100%',
                    minWidth: orientation === 'vertical' ? 200 : undefined,
                }}
            >
                <MuiTabs
                    value={mountedValue}
                    onChange={(event, newValue) => {
                        setMountedValue(newValue);
                        if (onChange) onChange(event, newValue);
                    }}
                    aria-label="tabs"
                    indicatorColor={indicatorColor}
                    sx={{
                        minHeight: 'auto',
                        ...(variant === 'pills' || variant === 'buttons' || variant === 'contained' ? {
                            bgcolor: 'transparent',
                            p: 0.5,
                            borderRadius: getBorderRadius(),
                            gap: 0.5,
                        } : {}),
                    }}
                    {...getTabsProps()}
                >
                    {tabs.map((tab, index) => (
                        <MuiTab
                            key={index}
                            label={renderTabLabel(tab)}
                            icon={tab.icon}
                            iconPosition={tab.iconPosition || 'start'}
                            disabled={tab.disabled}
                            className={tabClassName}
                            disableRipple={variant === 'standard'}
                            sx={{
                                ...getTabStyles(),
                                ...{
                                    flex: fullWidth ? 1 : 'initial',
                                },
                            }}
                            {...tab.props}
                        />
                    ))}
                </MuiTabs>
            </Box>

            <Box
                sx={{
                    flex: orientation === 'vertical' ? 1 : undefined,
                    width: orientation === 'vertical' ? '100%' : undefined,
                }}
            >
                {tabs.map((tab, index) => (
                    <TabPanel
                        key={index}
                        value={mountedValue}
                        index={index}
                        className={tabPanelClassName}
                        animate={animate}
                        padding={padding}
                    >
                        {tab.content}
                    </TabPanel>
                ))}
            </Box>
        </Box>
    );
};

export default Tabs;
