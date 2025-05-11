import React from 'react';
import {
    Box,
    Typography,
    IconButton,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    OutlinedInput,
    Stack,
    useTheme,
    Tooltip,
    alpha,
    Paper,
    ButtonGroup,
    Button
} from '@mui/material';
import {
    KeyboardArrowLeft,
    KeyboardArrowRight,
    FirstPage,
    LastPage
} from '@mui/icons-material';

const Pagination = ({
                        currentPage,
                        totalPages = 1,
                        totalItems = 0,
                        perPage = 10,
                        perPageOptions = [10, 25, 50, 100],
                        onPageChange,
                        onPerPageChange,
                        className,
                        variant = 'standard', // 'standard', 'compact', 'simplified'
                        showInfo = true,
                        showFirst = true,
                        showLast = true,
                        showControls = true,
                        rounded = 'medium', // 'small', 'medium', 'large'
                        size = 'medium', // 'small', 'medium', 'large'
                        ...props
                    }) => {
    const theme = useTheme();
    const firstItem = (currentPage - 1) * perPage + 1;
    const lastItem = Math.min(currentPage * perPage, totalItems);

    // Calculate styles based on size
    const getSize = () => {
        switch (size) {
            case 'small': return {
                buttonSize: 'small',
                height: 30,
                fontSize: '0.75rem',
                px: 1
            };
            case 'large': return {
                buttonSize: 'medium',
                height: 48,
                fontSize: '0.95rem',
                px: 2
            };
            case 'medium':
            default: return {
                buttonSize: 'medium',
                height: 40,
                fontSize: '0.875rem',
                px: 1.5
            };
        }
    };

    // Calculate border radius based on rounded prop
    const getBorderRadius = () => {
        switch (rounded) {
            case 'small': return theme.spacing(0.5);
            case 'medium': return theme.spacing(1);
            case 'large': return theme.spacing(1.5);
            default: return theme.spacing(1);
        }
    };

    // Handle page change
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages && onPageChange) {
            onPageChange(page);
        }
    };

    // Handle per page change
    const handlePerPageChange = (event) => {
        if (onPerPageChange) {
            onPerPageChange(event.target.value);
        }
    };

    // Pagination variations
    if (variant === 'simplified') {
        // Simplified version with just Next/Previous buttons
        return (
            <Box
                className={className}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    py: 1
                }}
                {...props}
            >
                {showInfo && (
                    <Typography variant="body2" color="text.secondary">
                        {totalItems > 0 ? `${firstItem}-${lastItem} of ${totalItems}` : 'No items'}
                    </Typography>
                )}

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage <= 1}
                        size={getSize().buttonSize}
                        sx={{
                            borderRadius: getBorderRadius(),
                            color: theme.palette.text.primary,
                            '&:hover': {
                                bgcolor: alpha(theme.palette.primary.main, 0.08)
                            }
                        }}
                    >
                        <KeyboardArrowLeft />
                    </IconButton>

                    <IconButton
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                        size={getSize().buttonSize}
                        sx={{
                            borderRadius: getBorderRadius(),
                            color: theme.palette.text.primary,
                            '&:hover': {
                                bgcolor: alpha(theme.palette.primary.main, 0.08)
                            }
                        }}
                    >
                        <KeyboardArrowRight />
                    </IconButton>
                </Box>
            </Box>
        );
    }

    if (variant === 'compact') {
        // Compact version with page numbers but no per page selector
        return (
            <Box
                className={className}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                {...props}
            >
                <ButtonGroup
                    variant="outlined"
                    sx={{
                        borderRadius: getBorderRadius(),
                        '& .MuiButtonGroup-grouped': {
                            borderColor: theme.palette.divider,
                        }
                    }}
                >
                    {showFirst && (
                        <Tooltip title="First page">
              <span>
                <Button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage <= 1}
                    size={getSize().buttonSize}
                    sx={{
                        minWidth: getSize().height,
                        height: getSize().height,
                        borderRadius: 0,
                    }}
                >
                  <FirstPage fontSize="small" />
                </Button>
              </span>
                        </Tooltip>
                    )}

                    <Tooltip title="Previous page">
            <span>
              <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  size={getSize().buttonSize}
                  sx={{
                      minWidth: getSize().height,
                      height: getSize().height,
                      borderRadius: 0,
                  }}
              >
                <KeyboardArrowLeft fontSize="small" />
              </Button>
            </span>
                    </Tooltip>

                    <Button
                        disabled
                        sx={{
                            minWidth: 'auto',
                            px: 2,
                            height: getSize().height,
                            cursor: 'default',
                            fontSize: getSize().fontSize,
                            fontWeight: 500,
                            '&.Mui-disabled': {
                                color: theme.palette.text.primary,
                                borderColor: theme.palette.divider,
                            }
                        }}
                    >
                        {currentPage} / {totalPages}
                    </Button>

                    <Tooltip title="Next page">
            <span>
              <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  size={getSize().buttonSize}
                  sx={{
                      minWidth: getSize().height,
                      height: getSize().height,
                      borderRadius: 0,
                  }}
              >
                <KeyboardArrowRight fontSize="small" />
              </Button>
            </span>
                    </Tooltip>

                    {showLast && (
                        <Tooltip title="Last page">
              <span>
                <Button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage >= totalPages}
                    size={getSize().buttonSize}
                    sx={{
                        minWidth: getSize().height,
                        height: getSize().height,
                        borderRadius: 0,
                    }}
                >
                  <LastPage fontSize="small" />
                </Button>
              </span>
                        </Tooltip>
                    )}
                </ButtonGroup>
            </Box>
        );
    }

    // Standard full-featured pagination
    return (
        <Paper
            elevation={0}
            className={className}
            sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'stretch', sm: 'center' },
                justifyContent: 'space-between',
                p: 1.5,
                gap: 2,
                borderRadius: getBorderRadius(),
                border: `1px solid ${theme.palette.divider}`,
            }}
            {...props}
        >
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                spacing={2}
            >
                {onPerPageChange && (
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel id="rows-per-page-label">Per Page</InputLabel>
                        <Select
                            labelId="rows-per-page-label"
                            value={perPage}
                            label="Per Page"
                            onChange={handlePerPageChange}
                            size={getSize().buttonSize}
                            sx={{ borderRadius: getBorderRadius() }}
                        >
                            {perPageOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}

                {showInfo && (
                    <Typography variant="body2" color="text.secondary" sx={{ pt: { xs: 1, sm: 0 } }}>
                        Showing {totalItems > 0 ? firstItem : 0}-{lastItem} of {totalItems}
                    </Typography>
                )}
            </Stack>

            {showControls && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {showFirst && (
                        <Tooltip title="First page">
              <span>
                <IconButton
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage <= 1}
                    size={getSize().buttonSize}
                    sx={{
                        borderRadius: getBorderRadius(),
                        color: theme.palette.text.primary,
                        '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.08)
                        }
                    }}
                >
                  <FirstPage />
                </IconButton>
              </span>
                        </Tooltip>
                    )}

                    <Tooltip title="Previous page">
            <span>
              <IconButton
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  size={getSize().buttonSize}
                  sx={{
                      borderRadius: getBorderRadius(),
                      color: theme.palette.text.primary,
                      '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.08)
                      }
                  }}
              >
                <KeyboardArrowLeft />
              </IconButton>
            </span>
                    </Tooltip>

                    <Box
                        sx={{
                            px: 2,
                            py: 0.5,
                            borderRadius: 1,
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            fontWeight: 500,
                            minWidth: 60,
                            textAlign: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Typography variant="body2" fontWeight={600}>
                            {currentPage} / {totalPages}
                        </Typography>
                    </Box>

                    <Tooltip title="Next page">
            <span>
              <IconButton
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  size={getSize().buttonSize}
                  sx={{
                      borderRadius: getBorderRadius(),
                      color: theme.palette.text.primary,
                      '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.08)
                      }
                  }}
              >
                <KeyboardArrowRight />
              </IconButton>
            </span>
                    </Tooltip>

                    {showLast && (
                        <Tooltip title="Last page">
              <span>
                <IconButton
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage >= totalPages}
                    size={getSize().buttonSize}
                    sx={{
                        borderRadius: getBorderRadius(),
                        color: theme.palette.text.primary,
                        '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.08)
                        }
                    }}
                >
                  <LastPage />
                </IconButton>
              </span>
                        </Tooltip>
                    )}
                </Box>
            )}
        </Paper>
    );
};

export default Pagination;
