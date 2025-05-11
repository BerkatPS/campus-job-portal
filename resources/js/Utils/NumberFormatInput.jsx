import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { parseFormattedNumber, formatNumberInput } from './CurrencyFormatter';

/**
 * Komponen TextField dengan format angka untuk mata uang IDR
 * 
 * @param {Object} props - Props untuk TextField
 * @param {string|number} props.value - Nilai dari input
 * @param {Function} props.onChange - Fungsi untuk menangani perubahan nilai
 * @param {string} props.label - Label TextField
 * @param {boolean} props.withSymbol - Menampilkan simbol mata uang (Rp)
 * @param {boolean} props.allowDecimal - Mengizinkan input desimal
 * @param {Object} props.error - Error dari validasi
 * @param {string} props.helperText - Teks bantuan atau pesan error
 * @param {string} props.placeholder - Placeholder teks
 * @param {Object} props.inputProps - Props tambahan untuk input
 * @param {Object} props.rest - Props lainnya untuk TextField
 * @returns {React.ReactElement} - Komponen TextField dengan format angka
 */
const NumberFormatInput = ({
  value,
  onChange,
  label = 'Nominal',
  withSymbol = true,
  allowDecimal = false,
  error,
  helperText,
  placeholder,
  inputProps,
  ...rest
}) => {
  const handleChange = (e) => {
    let inputValue = e.target.value;
    
    // Hapus semua karakter non-digit kecuali koma jika allowDecimal
    if (allowDecimal) {
      // Ganti semua titik dengan string kosong dan koma menjadi .
      inputValue = inputValue.replace(/\./g, '').replace(',', '.');
      
      // Jika ada input desimal, pastikan formatnya benar
      if (inputValue.includes('.')) {
        const [whole, decimal] = inputValue.split('.');
        // Hapus karakter non-digit dari keduanya
        const cleanWhole = whole.replace(/\D/g, '');
        const cleanDecimal = decimal.replace(/\D/g, '');
        // Format ulang dengan pemisah ribuan
        const formattedWhole = cleanWhole ? new Intl.NumberFormat('id-ID').format(parseInt(cleanWhole)) : '0';
        inputValue = `${formattedWhole},${cleanDecimal}`;
      } else {
        // Format sebagai bilangan bulat
        const digits = inputValue.replace(/\D/g, '');
        inputValue = digits ? new Intl.NumberFormat('id-ID').format(parseInt(digits)) : '';
      }
    } else {
      // Hapus semua karakter non-digit
      const digits = inputValue.replace(/\D/g, '');
      // Format dengan pemisah ribuan
      inputValue = digits ? new Intl.NumberFormat('id-ID').format(parseInt(digits)) : '';
    }
    
    // Kirim nilai yang sudah diformat ke callback onChange
    if (onChange) {
      // Buat event baru dengan nilai yang diformat
      const event = {
        target: {
          name: e.target.name,
          value: inputValue,
          rawValue: parseFormattedNumber(inputValue)
        }
      };
      onChange(event);
    }
  };

  return (
    <TextField
      label={label}
      value={value || ''}
      onChange={handleChange}
      error={!!error}
      helperText={helperText}
      placeholder={placeholder}
      inputProps={{
        inputMode: allowDecimal ? 'decimal' : 'numeric',
        ...inputProps
      }}
      InputProps={{
        startAdornment: withSymbol ? (
          <InputAdornment position="start">Rp</InputAdornment>
        ) : undefined,
        ...rest.InputProps
      }}
      {...rest}
    />
  );
};

export default NumberFormatInput; 