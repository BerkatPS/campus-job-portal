import React, { useState } from 'react';
import {
    TextField,
    InputAdornment,
    FormHelperText,
    FormControl,
    IconButton,
    alpha,
    useTheme,
    Typography
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Input = ({
    label,
    value,
    onChange,
    error,
    fullWidth = false,
    startAdornment,
    endAdornment,
    className = '',
    color = 'primary',
    size = 'medium',
    required = false,
    multiline = false,
    rows = 4,
    ...props
}) => {
    const theme = useTheme();
    const { type, name, id, placeholder, disabled } = props;
    const isPasswordField = type === 'password';
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const getBorderRadius = () => {
        switch (props.borderRadius) {
            case 'small':
                return '0.5rem';
            case 'large':
                return '1rem';
            case 'medium':
            default:
                return '0.75rem';
        }
    };

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
                    {label} {required && <span style={{ color: theme.palette.error.main }}>*</span>}
                </Typography>
            )}
            <FormControl error={!!error} fullWidth={fullWidth}>
                <TextField
                    id={id || name}
                    name={name}
                    type={isPasswordField ? (showPassword ? 'text' : 'password') : type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    error={!!error}
                    multiline={multiline}
                    rows={multiline ? rows : undefined}
                    variant={props.variant || 'outlined'}
                    size={size}
                    fullWidth={fullWidth}
                    InputProps={{
                        startAdornment: startAdornment,
                        endAdornment: (
                            <>
                                {isPasswordField && (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            edge="end"
                                            size="small"
                                            sx={{
                                                mr: -0.5,
                                                color: 'text.secondary',
                                                '&:hover': {
                                                    bgcolor: alpha(theme.palette.primary.main, 0.08)
                                                }
                                            }}
                                        >
                                            {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                        </IconButton>
                                    </InputAdornment>
                                )}
                                {endAdornment && !isPasswordField && endAdornment}
                            </>
                        ),
                        sx: {
                            borderRadius: getBorderRadius(),
                            '& .MuiInputBase-input': {
                                padding: multiline ? undefined : '12px 16px',
                            }
                        }
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: error ? theme.palette.error.main : theme.palette.divider,
                                borderWidth: error ? 1.5 : 1,
                                borderRadius: getBorderRadius(),
                            },
                            '&:hover fieldset': {
                                borderColor: error 
                                    ? theme.palette.error.main 
                                    : theme.palette[color].main,
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: error 
                                    ? theme.palette.error.main 
                                    : theme.palette[color].main,
                                borderWidth: 1.5,
                            },
                        },
                    }}
                    {...props}
                />
                {error && (
                    <FormHelperText>{error}</FormHelperText>
                )}
            </FormControl>
        </div>
    );
};

export default Input;
