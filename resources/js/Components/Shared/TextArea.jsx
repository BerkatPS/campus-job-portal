import React, { useState, useEffect, useRef } from 'react';
import {
    TextField,
    FormHelperText,
    FormControl,
    InputAdornment,
    Typography,
    Box,
    alpha,
    useTheme
} from '@mui/material';

const TextArea = ({
                      rows = 4,
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
                      variant = 'outlined', // 'outlined', 'filled', 'standard'
                      size = 'medium', // 'small', 'medium'
                      borderRadius = 'medium', // 'small', 'medium', 'large'
                      maxLength,
                      showCount = false,
                      minRows,
                      maxRows,
                      autoGrow = false,
                      startIcon,
                      endIcon,
                      ...props
                  }) => {
    const theme = useTheme();
    const textareaRef = useRef(null);
    const [charCount, setCharCount] = useState(value ? String(value).length : 0);

    // Calculate border radius based on prop
    const getBorderRadius = () => {
        switch (borderRadius) {
            case 'small': return '8px';
            case 'medium': return '12px';
            case 'large': return '16px';
            default: return '12px';
        }
    };

    // Update char count when value changes
    useEffect(() => {
        setCharCount(value ? String(value).length : 0);
    }, [value]);

    // Auto resize the textarea if autoGrow is enabled
    useEffect(() => {
        if (autoGrow && textareaRef.current) {
            const textarea = textareaRef.current.querySelector('textarea');
            if (textarea) {
                // Reset height to get the actual scroll height
                textarea.style.height = 'auto';
                textarea.style.height = `${textarea.scrollHeight}px`;
            }
        }
    }, [value, autoGrow]);

    // Handle input change
    const handleChange = (e) => {
        const newValue = e.target.value;
        if (maxLength && newValue.length > maxLength) {
            // Prevent input beyond maxLength
            return;
        }

        setCharCount(newValue.length);
        if (onChange) {
            onChange(e);
        }
    };

    return (
        <FormControl
            error={!!error}
            fullWidth={fullWidth}
            className={className}
            sx={{ position: 'relative' }}
        >
            <TextField
                id={id || name}
                name={name}
                label={label}
                value={value || ''}
                onChange={handleChange}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                error={!!error}
                multiline
                rows={rows}
                minRows={minRows}
                maxRows={maxRows}
                variant={variant}
                size={size}
                ref={textareaRef}
                InputProps={{
                    startAdornment: startIcon ? (
                        <InputAdornment position="start" sx={{ color: 'text.secondary', alignSelf: 'flex-start', mt: 2 }}>
                            {startIcon}
                        </InputAdornment>
                    ) : null,
                    endAdornment: endIcon ? (
                        <InputAdornment position="end" sx={{ color: 'text.secondary', alignSelf: 'flex-start', mt: 2 }}>
                            {endIcon}
                        </InputAdornment>
                    ) : null,
                    sx: {
                        borderRadius: getBorderRadius(),
                        transition: 'all 0.2s ease-in-out',
                        ...(variant === 'outlined' && {
                            '&.Mui-focused': {
                                boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`
                            }
                        })
                    }
                }}
                inputProps={{
                    maxLength: maxLength,
                }}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: getBorderRadius(),
                    },
                    '& .MuiFilledInput-root': {
                        borderRadius: getBorderRadius(),
                    },
                    '& .MuiInputBase-inputMultiline': {
                        resize: 'vertical',
                    }
                }}
                {...props}
            />

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 0.5
                }}
            >
                {(error || helperText) && (
                    <FormHelperText error={!!error} sx={{ ml: 1.5 }}>
                        {error || helperText}
                    </FormHelperText>
                )}

                {showCount && (
                    <Typography
                        variant="caption"
                        color={maxLength && charCount >= maxLength ? "error" : "text.secondary"}
                        sx={{
                            ml: 'auto',
                            mr: 1.5,
                            ...(!(error || helperText) && { mt: 0.5 })
                        }}
                    >
                        {charCount}{maxLength ? `/${maxLength}` : ''}
                    </Typography>
                )}
            </Box>
        </FormControl>
    );
};

export default TextArea;
