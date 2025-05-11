import React, { useState } from 'react';
import {
    TextField,
    FormHelperText,
    FormControl,
    InputAdornment,
    alpha,
    useTheme
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
    LocalizationProvider,
    DatePicker as MuiDatePicker,
    TimePicker,
    DateTimePicker
} from '@mui/x-date-pickers';
import {
    CalendarToday,
    AccessTime,
    Event
} from '@mui/icons-material';
import { id } from 'date-fns/locale';

const DatePicker = ({
                        id,
                        name,
                        label,
                        value,
                        onChange,
                        placeholder,
                        required = false,
                        disabled = false,
                        error,
                        helperText,
                        fullWidth = true,
                        className,
                        minDate,
                        maxDate,
                        type = 'date', // 'date', 'time', or 'datetime'
                        format,
                        size = 'medium',
                        borderRadius = 'medium', // 'small', 'medium', 'large'
                        startIcon,
                        variant = 'outlined', // 'outlined', 'filled', 'standard'
                        ...props
                    }) => {
    const theme = useTheme();
    const [inputValue, setInputValue] = useState(value ? new Date(value) : null);

    // Calculate border radius based on prop
    const getBorderRadius = () => {
        switch (borderRadius) {
            case 'small': return '8px';
            case 'medium': return '12px';
            case 'large': return '16px';
            default: return '12px';
        }
    };

    // Default icons based on type
    const getDefaultIcon = () => {
        if (startIcon) return startIcon;
        switch (type) {
            case 'time':
                return <AccessTime fontSize="small" />;
            case 'datetime':
                return <Event fontSize="small" />;
            default:
                return <CalendarToday fontSize="small" />;
        }
    };

    const handleChange = (date) => {
        setInputValue(date);

        if (onChange) {
            onChange({
                target: {
                    name,
                    value: date,
                },
            });
        }
    };

    // Common TextField props
    const textFieldProps = {
        id: id || name,
        name: name,
        label: label,
        placeholder: placeholder,
        required: required,
        disabled: disabled,
        error: !!error,
        fullWidth: fullWidth,
        variant: variant,
        size: size,
        InputProps: {
            startAdornment: (
                <InputAdornment position="start" sx={{ color: 'text.secondary' }}>
                    {getDefaultIcon()}
                </InputAdornment>
            ),
            sx: {
                borderRadius: getBorderRadius(),
                transition: 'all 0.2s ease-in-out',
                ...(variant === 'outlined' && {
                    '&.Mui-focused': {
                        boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`
                    }
                })
            }
        },
        InputLabelProps: {
            shrink: true,
            sx: {
                fontSize: size === 'small' ? '0.875rem' : '1rem',
            }
        },
        sx: {
            '& .MuiOutlinedInput-root': {
                borderRadius: getBorderRadius(),
            },
            '& .MuiFilledInput-root': {
                borderRadius: getBorderRadius(),
            }
        }
    };

    const getPickerComponent = () => {
        switch (type) {
            case 'time':
                return (
                    <TimePicker
                        value={inputValue}
                        onChange={handleChange}
                        renderInput={(params) => <TextField {...params} {...textFieldProps} />}
                        minutesStep={5}
                        {...props}
                    />
                );
            case 'datetime':
                return (
                    <DateTimePicker
                        value={inputValue}
                        onChange={handleChange}
                        renderInput={(params) => <TextField {...params} {...textFieldProps} />}
                        minDate={minDate}
                        maxDate={maxDate}
                        {...props}
                    />
                );
            default:
                return (
                    <MuiDatePicker
                        value={inputValue}
                        onChange={handleChange}
                        renderInput={(params) => <TextField {...params} {...textFieldProps} />}
                        minDate={minDate}
                        maxDate={maxDate}
                        {...props}
                    />
                );
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={id}>
            <FormControl error={!!error} fullWidth={fullWidth} className={className}>
                {getPickerComponent()}

                {(error || helperText) && (
                    <FormHelperText error={!!error} sx={{ mt: 0.5, ml: 1.5 }}>
                        {error || helperText}
                    </FormHelperText>
                )}
            </FormControl>
        </LocalizationProvider>
    );
};

export default DatePicker;
