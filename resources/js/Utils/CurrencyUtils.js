/**
 * Format angka menjadi format mata uang Indonesia (IDR)
 * 
 * @param {number|string} amount - Jumlah/angka yang akan diformat
 * @param {boolean} withSymbol - Apakah menyertakan simbol mata uang (Rp)
 * @param {boolean} withDecimal - Apakah menyertakan desimal (2 digit)
 * @returns {string} - String yang sudah diformat
 */
export const formatIDR = (amount, withSymbol = true, withDecimal = false) => {
  // Handle null/undefined values
  if (amount === null || amount === undefined) {
    return withSymbol ? 'Rp 0' : '0';
  }
  
  // Pastikan input adalah angka
  const numAmount = Number(amount);
  
  // Jika bukan angka valid, kembalikan string kosong atau nilai default
  if (isNaN(numAmount)) {
    return withSymbol ? 'Rp 0' : '0';
  }

  // Format angka dengan pemisah ribuan dan desimal
  const formatter = new Intl.NumberFormat('id-ID', {
    style: withSymbol ? 'currency' : 'decimal',
    currency: 'IDR',
    minimumFractionDigits: withDecimal ? 2 : 0,
    maximumFractionDigits: withDecimal ? 2 : 0,
  });

  return formatter.format(numAmount);
};

/**
 * Format angka input dengan titik sebagai pemisah ribuan
 * Fungsi ini cocok untuk digunakan pada event onChange input
 * 
 * @param {string} inputValue - Nilai dari input field
 * @returns {string} - String yang sudah diformat dengan titik sebagai pemisah ribuan
 */
export const formatNumberInput = (inputValue) => {
  // Tangani nilai null/undefined
  if (inputValue === null || inputValue === undefined) {
    return '';
  }
  
  // Hapus semua karakter kecuali digit
  const digits = String(inputValue).replace(/\D/g, '');
  
  // Jika kosong, kembalikan string kosong
  if (!digits) return '';
  
  // Format dengan pemisah ribuan
  return new Intl.NumberFormat('id-ID').format(parseInt(digits));
};

/**
 * Parse string angka berformat ke angka biasa
 * 
 * @param {string} formattedValue - String angka yang sudah diformat
 * @returns {number} - Nilai angka yang sudah di-parse
 */
export const parseFormattedNumber = (formattedValue) => {
  if (!formattedValue) return 0;
  // Hapus semua karakter non-digit (kecuali tanda desimal)
  const cleanValue = String(formattedValue).replace(/[^\d,-]/g, '').replace(',', '.');
  return parseFloat(cleanValue);
};

/**
 * Custom handler untuk input mata uang
 * 
 * @param {Event} event - Event object
 * @param {Function} setValueCallback - Callback function untuk mengupdate state/value
 * @param {boolean} allowDecimal - Izinkan input desimal
 */
export const handleCurrencyInput = (event, setValueCallback, allowDecimal = false) => {
  let value = event.target.value;
  
  // Hapus semua karakter kecuali digit dan koma (untuk desimal)
  value = allowDecimal 
    ? value.replace(/[^\d,]/g, '').replace(/,{2,}/g, ',') 
    : value.replace(/\D/g, '');
  
  // Format sebagai angka dengan pemisah ribuan
  const formattedValue = value ? formatNumberInput(value) : '';
  
  // Update state dengan nilai yang sudah diformat
  setValueCallback(formattedValue);
}; 