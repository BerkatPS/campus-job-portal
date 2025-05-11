import React from 'react';
import { Box, Typography } from '@mui/material';
import CurrencyDisplay from './CurrencyDisplay';
import { formatIDR } from '@/Utils/CurrencyUtils';

/**
 * Komponen untuk menampilkan range gaji
 * 
 * @param {Object} props - Props komponen
 * @param {number|string} props.minSalary - Gaji minimum
 * @param {number|string} props.maxSalary - Gaji maksimum
 * @param {boolean} props.withSymbol - Menampilkan simbol mata uang
 * @param {string} props.variant - Variant Typography
 * @param {Object} props.sx - Style tambahan
 * @param {boolean} props.showTooltip - Menampilkan tooltip dengan format lengkap
 * @param {string} props.separator - Pemisah antara min dan max (default: "-")
 * @returns {React.ReactElement} - Komponen tampilan range gaji
 */
const SalaryDisplay = ({
  minSalary,
  maxSalary,
  withSymbol = true,
  variant = 'body2',
  sx = {},
  showTooltip = false,
  separator = "-"
}) => {
  // Jika tidak ada data gaji
  if (!minSalary && !maxSalary) {
    return <Typography variant={variant} sx={sx}>-</Typography>;
  }
  
  // Jika hanya ada salah satu nilai gaji
  if (!minSalary || !maxSalary) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', ...sx }}>
        {withSymbol && !showTooltip && (
          <Typography variant={variant} component="span" sx={{ mr: 0.5 }}>Rp</Typography>
        )}
        <CurrencyDisplay
          value={minSalary || maxSalary}
          withSymbol={withSymbol && showTooltip}
          variant={variant}
          showTooltip={showTooltip}
        />
      </Box>
    );
  }
  
  // Jika memiliki range gaji (min dan max)
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', ...sx }}>
      {withSymbol && !showTooltip && (
        <Typography variant={variant} component="span" sx={{ mr: 0.5 }}>Rp</Typography>
      )}
      <CurrencyDisplay
        value={minSalary}
        withSymbol={false}
        variant={variant}
        showTooltip={showTooltip}
        tooltipPlacement="top-start"
      />
      <Typography variant={variant} component="span" sx={{ mx: 0.5 }}>{separator}</Typography>
      <CurrencyDisplay
        value={maxSalary}
        withSymbol={withSymbol && showTooltip}
        variant={variant}
        showTooltip={showTooltip}
        tooltipPlacement="top-end"
      />
    </Box>
  );
};

export default SalaryDisplay; 