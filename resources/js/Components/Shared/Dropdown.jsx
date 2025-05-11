import React, { useState } from 'react';
import {
    Button as MuiButton,
    Menu,
    MenuItem,
    IconButton,
    ListItemIcon,
    ListItemText,
    Typography,
    Divider,
    alpha,
    Box,
    Paper,
    useTheme
} from '@mui/material';
import {
    KeyboardArrowDown,
    MoreVert
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Button from './Button';

/**
 * Dropdown component - provides a dropdown menu with configurable items
 * 
 * @param {Object} props
 * @param {Array} props.items - Array of menu items with properties: label, onClick, icon, color, divider
 * @param {string} props.buttonType - Button type, either 'text', 'outlined', 'contained', or 'icon'
 * @param {string} props.label - Button label (for non-icon buttons)
 * @param {React.ReactNode} props.icon - Icon component to show on button
 * @param {string} props.buttonColor - Button color, defaults to 'primary'
 * @param {string} props.size - Button size, 'small', 'medium', or 'large'
 * @param {Object} props.buttonProps - Additional props to pass to the button
 * @param {string} props.variant - Menu variant: 'menu' (default) or 'select'
 * @param {Object} props.sx - Custom styles for the dropdown button
 */
const Dropdown = ({
                      items = [],
                      buttonType = 'text',
                      label = '',
                      icon = null,
                      buttonColor = 'primary',
                      size = 'medium',
                      buttonProps = {},
                      variant = 'menu',
                      sx = {}
                  }) => {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleItemClick = (onClick) => {
        if (onClick && typeof onClick === 'function') {
            onClick();
        }
        handleClose();
    };

    const renderButton = () => {
        if (buttonType === 'icon') {
            return (
                <IconButton
                    aria-controls={open ? 'dropdown-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                    color={buttonColor}
                    size={size}
                    sx={sx}
                    {...buttonProps}
                >
                    {icon || <MoreVert />}
                </IconButton>
            );
        }

        return (
            <Button
                aria-controls={open ? 'dropdown-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                variant={buttonType}
                color={buttonColor}
                size={size}
                startIcon={icon}
                endIcon={<MoreVert fontSize="small" />}
                sx={sx}
                {...buttonProps}
            >
                {label}
            </Button>
        );
    };

    return (
        <div>
            {renderButton()}
            
            <Menu
                id="dropdown-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'dropdown-button',
                    dense: size === 'small'
                }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                PaperProps={{
                    elevation: 3,
                    sx: {
                        minWidth: 180,
                        borderRadius: 1.5,
                        mt: 0.5,
                        p: 0.5,
                        '& .MuiMenuItem-root': {
                            borderRadius: 1,
                            mx: 0.5,
                            my: 0.2,
                        }
                    }
                }}
            >
                {items.map((item, index) => {
                    if (item.divider) {
                        return <Divider key={`divider-${index}`} sx={{ my: 1 }} />;
                    }

                    return (
                        <MenuItem
                            key={`item-${index}`}
                            onClick={() => handleItemClick(item.onClick)}
                            disabled={item.disabled}
                            sx={{ 
                                color: item.color ? theme.palette[item.color]?.main : 'inherit',
                                py: 1
                            }}
                            selected={item.selected}
                        >
                            {item.icon && (
                                <ListItemIcon sx={{ 
                                    color: item.color ? theme.palette[item.color]?.main : 'inherit',
                                    minWidth: 36
                                }}>
                                    {item.icon}
                                </ListItemIcon>
                            )}
                            <ListItemText>
                                <Typography 
                                    variant="body2" 
                                    sx={{ 
                                        fontWeight: item.bold ? 600 : 400
                                    }}
                                >
                                    {item.label}
                                </Typography>
                            </ListItemText>
                        </MenuItem>
                    );
                })}
            </Menu>
        </div>
    );
};

export default Dropdown;
