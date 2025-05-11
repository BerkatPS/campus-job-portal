import React from 'react';
import { Checkbox as MuiCheckbox, FormControlLabel, Typography, useTheme, Box } from '@mui/material';
import { alpha } from '@mui/material/styles';

const Checkbox = React.forwardRef((props, ref) => {
    const theme = useTheme();
    const {
        label,
        labelPlacement = 'end',
        color = 'primary',
        size = 'medium',
        disabled = false,
        error = false,
        helperText,
        sx,
        ...other
    } = props;

    const checkboxStyles = {
        '&.MuiCheckbox-root': {
            color: error ? theme.palette.error.main : theme.palette[color].main,
            '&.Mui-disabled': {
                color: theme.palette.action.disabled,
            },
            '&.Mui-checked': {
                color: error ? theme.palette.error.main : theme.palette[color].main,
            },
            '&:hover': {
                backgroundColor: alpha(
                    error ? theme.palette.error.main : theme.palette[color].main,
                    theme.palette.action.hoverOpacity
                ),
            },
        },
        '& .MuiSvgIcon-root': {
            fontSize: size === 'small' ? 20 : 24,
        },
    };

    const labelStyles = {
        '& .MuiFormControlLabel-label': {
            color: error ? theme.palette.error.main : theme.palette.text.primary,
            '&.Mui-disabled': {
                color: theme.palette.text.disabled,
            },
        },
    };

    return (
        <Box sx={{ ...sx }}>
            <FormControlLabel
                control={
                    <MuiCheckbox
                        ref={ref}
                        color={color}
                        size={size}
                        disabled={disabled}
                        sx={checkboxStyles}
                        {...other}
                    />
                }
                label={
                    <Typography variant="body2" component="span">
                        {label}
                    </Typography>
                }
                labelPlacement={labelPlacement}
                sx={labelStyles}
            />
            {helperText && (
                <Typography
                    variant="caption"
                    sx={{
                        color: error ? theme.palette.error.main : theme.palette.text.secondary,
                        mt: 0.5,
                        ml: 2,
                    }}
                >
                    {helperText}
                </Typography>
            )}
        </Box>
    );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox; 