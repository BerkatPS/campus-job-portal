import React from 'react';
import { FormControl, FormLabel, FormHelperText, Box, Typography, alpha, useTheme } from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';

const FormGroup = ({
                       children,
                       label,
                       error,
                       helperText,
                       required = false,
                       className,
                       marginBottom = 'medium', // 'small', 'medium', 'large', 'none'
                       tooltip,
                       infoText,
                       ...props
                   }) => {
    const theme = useTheme();

    // Calculate margin bottom based on prop
    const getMarginBottom = () => {
        switch (marginBottom) {
            case 'small': return theme.spacing(2);
            case 'medium': return theme.spacing(3);
            case 'large': return theme.spacing(4);
            case 'none': return 0;
            default: return theme.spacing(3);
        }
    };

    return (
        <FormControl
            fullWidth
            error={!!error}
            className={className}
            sx={{ mb: getMarginBottom() }}
            {...props}
        >
            {label && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <FormLabel
                        sx={{
                            color: error ? theme.palette.error.main : 'text.primary',
                            fontWeight: 500,
                            fontSize: '0.875rem',
                            lineHeight: 1.5,
                            '&.Mui-focused': {
                                color: error ? theme.palette.error.main : theme.palette.primary.main,
                            }
                        }}
                    >
                        {label}
                        {required && (
                            <Box component="span" sx={{ ml: 0.5, color: theme.palette.error.main }}>
                                *
                            </Box>
                        )}
                    </FormLabel>

                    {infoText && (
                        <Box
                            sx={{
                                ml: 1,
                                display: 'flex',
                                alignItems: 'center',
                                color: 'text.secondary',
                                position: 'relative',
                                '&:hover .info-tooltip': {
                                    opacity: 1,
                                    visibility: 'visible',
                                    transform: 'translateY(0)'
                                }
                            }}
                        >
                            <InfoIcon
                                fontSize="small"
                                sx={{
                                    fontSize: '1rem',
                                    opacity: 0.7,
                                    cursor: 'help'
                                }}
                            />
                            <Box
                                className="info-tooltip"
                                sx={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: '50%',
                                    transform: 'translateY(5px) translateX(-50%)',
                                    width: 200,
                                    backgroundColor: theme.palette.background.paper,
                                    color: theme.palette.text.primary,
                                    borderRadius: 1.5,
                                    boxShadow: theme.shadows[3],
                                    p: 1.5,
                                    zIndex: 100,
                                    opacity: 0,
                                    visibility: 'hidden',
                                    transition: 'all 0.2s ease-in-out',
                                    '&:before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: -5,
                                        left: '50%',
                                        transform: 'translateX(-50%) rotate(45deg)',
                                        width: 10,
                                        height: 10,
                                        backgroundColor: theme.palette.background.paper,
                                    }
                                }}
                            >
                                <Typography variant="caption">{infoText}</Typography>
                            </Box>
                        </Box>
                    )}
                </Box>
            )}

            <Box>
                {children}
            </Box>

            {(error || helperText) && (
                <FormHelperText
                    error={!!error}
                    sx={{
                        mt: 0.5,
                        ml: theme.spacing(0.25),
                        lineHeight: 1.5,
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    {error || helperText}
                </FormHelperText>
            )}
        </FormControl>
    );
};

export default FormGroup;
