import React from 'react';
import {
    Paper,
    Table as MuiTable,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Box,
    IconButton,
    Tooltip,
    TableSortLabel,
    alpha,
    useTheme,
    Skeleton,
    Checkbox,
    TablePagination,
    Chip
} from '@mui/material';
import {
    ArrowUpward,
    ArrowDownward,
    Refresh,
    SearchOff,
    MoreVert
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Table = ({
                   columns = [],
                   data = [],
                   loading = false,
                   onRowClick,
                   onSort,
                   sortField,
                   sortDirection,
                   emptyMessage = 'No data available',
                   stickyHeader = false,
                   className,
                   actions,
                   variant = 'outlined', // 'outlined', 'elevated', 'plain'
                   density = 'medium', // 'compact', 'medium', 'comfortable'
                   borderRadius = 'medium', // 'small', 'medium', 'large'
                   showTableHead = true,
                   zebraPattern = false,
                   selectable = false,
                   selectedRows = [],
                   onSelectRow,
                   onSelectAll,
                   hoverEffect = true,
                   pagination,  // { page, rowsPerPage, count, onChangePage, onChangeRowsPerPage }
                   // Filter out custom props that shouldn't be passed to MuiTable
                   paginationInfo,
                   baseRoute,
                   ...props
               }) => {
    const theme = useTheme();

    // Calculate border radius based on prop
    const getBorderRadius = () => {
        switch (borderRadius) {
            case 'small': return theme.spacing(1);
            case 'medium': return theme.spacing(2);
            case 'large': return theme.spacing(3);
            default: return theme.spacing(2);
        }
    };

    // Get padding based on density
    const getPadding = () => {
        switch (density) {
            case 'compact': return '4px 8px';
            case 'comfortable': return '16px 16px';
            case 'medium':
            default: return '12px 16px';
        }
    };

    // Get table styles based on variant
    const getTableStyles = () => {
        const radius = getBorderRadius();

        switch (variant) {
            case 'elevated':
                return {
                    borderRadius: radius,
                    overflow: 'hidden',
                    boxShadow: theme.shadows[3],
                    border: 'none'
                };
            case 'plain':
                return {
                    borderRadius: radius,
                    overflow: 'hidden',
                    boxShadow: 'none',
                    border: 'none'
                };
            case 'outlined':
            default:
                return {
                    borderRadius: radius,
                    overflow: 'hidden',
                    boxShadow: 'none',
                    border: `1px solid ${theme.palette.divider}`
                };
        }
    };

    const handleSort = (field) => {
        if (onSort) {
            const isAsc = sortField === field && sortDirection === 'asc';
            onSort(field, isAsc ? 'desc' : 'asc');
        }
    };

    // Handle row selection
    const handleSelectRow = (event, id) => {
        if (onSelectRow) {
            onSelectRow(id);
        }
    };

    // Handle select all rows
    const handleSelectAll = (event) => {
        if (onSelectAll) {
            onSelectAll(event.target.checked);
        }
    };

    // Check if a row is selected
    const isSelected = (id) => selectedRows.indexOf(id) !== -1;

    // Calculate column widths
    const hasFixedWidths = columns.some(column => column.width || column.minWidth);

    // Render loading placeholders
    const renderSkeletons = () => {
        return Array(5).fill(null).map((_, index) => (
            <TableRow key={`skeleton-${index}`}>
                {selectable && (
                    <TableCell padding="checkbox">
                        <Checkbox disabled />
                    </TableCell>
                )}
                {columns.map((column, colIndex) => (
                    <TableCell key={`skeleton-cell-${colIndex}`}>
                        <Skeleton
                            height={24}
                            width={colIndex === 0 ? '70%' : '40%'}
                            animation="wave"
                        />
                    </TableCell>
                ))}
                {actions && (
                    <TableCell align="right">
                        <Skeleton height={24} width={40} animation="wave" />
                    </TableCell>
                )}
            </TableRow>
        ));
    };

    // Render empty state
    const renderEmptyState = () => (
        <TableRow>
            <TableCell
                colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)}
                sx={{ py: 8, textAlign: 'center' }}
            >
                <Box
                    component={motion.div}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                >
                    <SearchOff sx={{ fontSize: 48, color: alpha(theme.palette.text.secondary, 0.3), mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        {emptyMessage}
                    </Typography>
                    {onSort && (
                        <Tooltip title="Refresh">
                            <IconButton
                                size="small"
                                color="primary"
                                onClick={() => onSort(sortField, sortDirection)}
                                sx={{
                                    mt: 1,
                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                    '&:hover': {
                                        bgcolor: alpha(theme.palette.primary.main, 0.2),
                                    }
                                }}
                            >
                                <Refresh />
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>
            </TableCell>
        </TableRow>
    );

    return (
        <Paper
            elevation={0}
            sx={{ ...getTableStyles() }}
            className={className}
        >
            <TableContainer sx={{ maxHeight: stickyHeader ? 500 : undefined }}>
                <MuiTable stickyHeader={stickyHeader} size={density === 'compact' ? 'small' : 'medium'} {...props}>
                    {showTableHead && (
                        <TableHead>
                            <TableRow>
                                {selectable && (
                                    <TableCell
                                        padding="checkbox"
                                        sx={{
                                            bgcolor: theme.palette.background.neutral || alpha(theme.palette.grey[200], 0.3),
                                            position: 'sticky',
                                            left: 0,
                                            zIndex: 3,
                                        }}
                                    >
                                        <Checkbox
                                            indeterminate={selectedRows.length > 0 && selectedRows.length < data.length}
                                            checked={data.length > 0 && selectedRows.length === data.length}
                                            onChange={handleSelectAll}
                                            color="primary"
                                        />
                                    </TableCell>
                                )}

                                {columns.map((column) => (
                                    <TableCell
                                        key={column.field}
                                        align={column.align || 'left'}
                                        style={{
                                            minWidth: column.minWidth,
                                            width: column.width,
                                            ...(column.sticky ? {
                                                position: 'sticky',
                                                left: column.stickyOffset || 0,
                                                zIndex: 2,
                                            } : {})
                                        }}
                                        sx={{
                                            padding: getPadding(),
                                            fontSize: '0.875rem',
                                            fontWeight: 600,
                                            color: theme.palette.text.primary,
                                            bgcolor: theme.palette.background.neutral || alpha(theme.palette.grey[200], 0.3),
                                            whiteSpace: 'nowrap',
                                            '&:first-of-type': {
                                                borderTopLeftRadius: !selectable ? getBorderRadius() : 0
                                            },
                                            '&:last-of-type': {
                                                borderTopRightRadius: !actions ? getBorderRadius() : 0
                                            }
                                        }}
                                    >
                                        {column.sortable ? (
                                            <TableSortLabel
                                                active={sortField === column.field}
                                                direction={sortField === column.field ? sortDirection : 'asc'}
                                                onClick={() => handleSort(column.field)}
                                                sx={{
                                                    '& .MuiTableSortLabel-icon': {
                                                        color: sortField === column.field ? theme.palette.primary.main : 'inherit'
                                                    }
                                                }}
                                            >
                                                {column.header}
                                            </TableSortLabel>
                                        ) : (
                                            column.header
                                        )}
                                    </TableCell>
                                ))}

                                {actions && (
                                    <TableCell
                                        align="right"
                                        sx={{
                                            padding: getPadding(),
                                            bgcolor: theme.palette.background.neutral || alpha(theme.palette.grey[200], 0.3),
                                            borderTopRightRadius: getBorderRadius()
                                        }}
                                    >
                                        Actions
                                    </TableCell>
                                )}
                            </TableRow>
                        </TableHead>
                    )}

                    <TableBody>
                        {loading ? (
                            renderSkeletons()
                        ) : data.length === 0 ? (
                            renderEmptyState()
                        ) : (
                            data.map((row, rowIndex) => {
                                const isItemSelected = selectable && isSelected(row.id || rowIndex);
                                const rowId = row.id || rowIndex;

                                return (
                                    <TableRow
                                        key={rowId}
                                        hover={hoverEffect}
                                        onClick={onRowClick ? () => onRowClick(row) : undefined}
                                        selected={isItemSelected}
                                        sx={{
                                            cursor: onRowClick ? 'pointer' : 'default',
                                            '&:hover': hoverEffect ? {
                                                bgcolor: alpha(theme.palette.primary.main, 0.04)
                                            } : {},
                                            '&.Mui-selected': {
                                                bgcolor: alpha(theme.palette.primary.main, 0.08),
                                                '&:hover': {
                                                    bgcolor: alpha(theme.palette.primary.main, 0.12)
                                                }
                                            },
                                            ...(zebraPattern && {
                                                bgcolor: rowIndex % 2 === 1 ? alpha(theme.palette.grey[100], 0.3) : 'inherit'
                                            })
                                        }}
                                    >
                                        {selectable && (
                                            <TableCell
                                                padding="checkbox"
                                                onClick={(event) => event.stopPropagation()}
                                                sx={{
                                                    bgcolor: isItemSelected ? alpha(theme.palette.primary.main, 0.08) : 'inherit',
                                                    position: 'sticky',
                                                    left: 0,
                                                    zIndex: 1,
                                                }}
                                            >
                                                <Checkbox
                                                    checked={isItemSelected}
                                                    onChange={(event) => handleSelectRow(event, rowId)}
                                                    color="primary"
                                                />
                                            </TableCell>
                                        )}

                                        {columns.map((column) => {
                                            const value = row[column.field];
                                            return (
                                                <TableCell
                                                    key={`${rowId}-${column.field}`}
                                                    align={column.align || 'left'}
                                                    sx={{
                                                        padding: getPadding(),
                                                        ...(column.sticky ? {
                                                            position: 'sticky',
                                                            left: column.stickyOffset || 0,
                                                            bgcolor: isItemSelected
                                                                ? alpha(theme.palette.primary.main, 0.08)
                                                                : (zebraPattern && rowIndex % 2 === 1)
                                                                    ? alpha(theme.palette.grey[100], 0.3)
                                                                    : theme.palette.background.paper,
                                                            zIndex: 1,
                                                        } : {})
                                                    }}
                                                >
                                                    {column.render ? column.render(value, row) : value}
                                                </TableCell>
                                            );
                                        })}

                                        {actions && (
                                            <TableCell
                                                align="right"
                                                onClick={(event) => event.stopPropagation()}
                                                sx={{ padding: getPadding() }}
                                            >
                                                {typeof actions === 'function' ? actions(row) : actions}
                                            </TableCell>
                                        )}
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </MuiTable>
            </TableContainer>

            {pagination && (
                <TablePagination
                    component="div"
                    count={pagination.count || 0}
                    page={pagination.page || 0}
                    onPageChange={pagination.onChangePage || (() => {})}
                    rowsPerPage={pagination.rowsPerPage || 10}
                    onRowsPerPageChange={pagination.onChangeRowsPerPage || (() => {})}
                    rowsPerPageOptions={pagination.rowsPerPageOptions || [5, 10, 25, 50]}
                    sx={{
                        borderTop: `1px solid ${theme.palette.divider}`,
                        '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                            fontSize: '0.875rem',
                        }
                    }}
                />
            )}
        </Paper>
    );
};

export default Table;
