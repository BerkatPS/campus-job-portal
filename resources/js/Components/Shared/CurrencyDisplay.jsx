import React from 'react';
import { Box, Tooltip, Typography } from '@mui/material';
import { formatIDR } from '@/Utils/CurrencyUtils';

/**
 * Komponen untuk menampilkan angka dalam format mata uang IDR
 * 
 * @param {Object} props - Props komponen
 * @param {number|string} props.value - Nilai angka/mata uang yang akan ditampilkan
 * @param {boolean} props.withSymbol - Menampilkan simbol mata uang (Rp)
 * @param {boolean} props.withDecimal - Menampilkan nilai desimal
 * @param {string} props.variant - Variant Typography dari MUI
 * @param {Object} props.sx - Style tambahan
 * @param {string} props.color - Warna teks
 * @param {boolean} props.showTooltip - Menampilkan tooltip dengan format lengkap
 * @param {string} props.tooltipPlacement - Penempatan tooltip
 * @returns {React.ReactElement} - Komponen tampilan mata uang
 */
const CurrencyDisplay = ({
  value,
  withSymbol = true,
  withDecimal = false,
  variant = 'body1',
  sx = {},
  color = 'inherit',
  showTooltip = false,
  tooltipPlacement = 'top',
}) => {
  // Format angka ke format IDR
  const formattedValue = formatIDR(value, withSymbol, withDecimal);
  
  // Format untuk tooltip, selalu tampilkan lengkap
  const tooltipValue = formatIDR(value, true, true);
  
  const content = (
    <Typography
      variant={variant}
      color={color}
      sx={{
        fontVariantNumeric: 'tabular-nums', // Untuk memastikan penyelarasan angka yang baik
        ...sx
      }}
    >
      {formattedValue}
    </Typography>
  );
  
  // Tampilkan dengan tooltip jika diperlukan
  if (showTooltip) {
    return (
      <Tooltip title={tooltipValue} placement={tooltipPlacement} arrow>
        <Box component="span">{content}</Box>
      </Tooltip>
    );
  }
  
  return content;
};

export default CurrencyDisplay; 