# Format Mata Uang Indonesia (IDR)

Kumpulan utilitas untuk menangani format mata uang Indonesia (IDR) di aplikasi.

## Daftar Isi
- [Utilitas Format IDR](#utilitas-format-idr)
- [Komponen NumberFormatInput](#komponen-numberformatinput)
- [Komponen CurrencyDisplay](#komponen-currencydisplay)
- [Komponen SalaryDisplay](#komponen-salarydisplay)

## Utilitas Format IDR

File: `CurrencyFormatter.js`

### `formatIDR(amount, withSymbol = true, withDecimal = false)`

Fungsi untuk memformat angka menjadi format mata uang Indonesia (IDR).

```jsx
import { formatIDR } from '@/Utils/CurrencyFormatter';

// Output: Rp10.000
const formattedPrice = formatIDR(10000);

// Output: 10.000 (tanpa simbol Rp)
const formattedPriceNoSymbol = formatIDR(10000, false);

// Output: Rp10.000,00 (dengan desimal)
const formattedPriceWithDecimal = formatIDR(10000, true, true);
```

### `formatNumberInput(inputValue)`

Fungsi untuk memformat input angka dengan titik sebagai pemisah ribuan.

```jsx
import { formatNumberInput } from '@/Utils/CurrencyFormatter';

// Output: 10.000
const formattedInput = formatNumberInput('10000');
```

### `parseFormattedNumber(formattedValue)`

Fungsi untuk mengubah string angka berformat menjadi nilai numerik.

```jsx
import { parseFormattedNumber } from '@/Utils/CurrencyFormatter';

// Output: 10000
const numericValue = parseFormattedNumber('Rp10.000');
```

### `handleCurrencyInput(event, setValueCallback, allowDecimal = false)`

Handler untuk input mata uang, bisa digunakan pada event onChange dari input.

```jsx
import { handleCurrencyInput } from '@/Utils/CurrencyFormatter';

// Di dalam komponen React
const [price, setPrice] = useState('');

// Pada event onChange
<input 
  value={price} 
  onChange={(e) => handleCurrencyInput(e, setPrice)}
/>
```

## Komponen NumberFormatInput

File: `NumberFormatInput.jsx`

Komponen TextField dengan format angka yang sudah diintegrasikan untuk mata uang IDR.

```jsx
import NumberFormatInput from '@/Utils/NumberFormatInput';

// Di dalam komponen React
const [price, setPrice] = useState('');

// Render komponen
<NumberFormatInput
  label="Harga"
  value={price}
  onChange={(e) => {
    setPrice(e.target.value);      // Untuk menampilkan format dengan titik pemisah ribuan
    // atau
    // setPrice(e.target.rawValue); // Untuk mendapatkan nilai numerik
  }}
  error={!!errors.price}
  helperText={errors.price}
  allowDecimal={true} // Untuk mengizinkan input desimal
/>
```

## Komponen CurrencyDisplay

File: `Components/Shared/CurrencyDisplay.jsx`

Komponen untuk menampilkan angka dalam format mata uang IDR yang rapi.

```jsx
import CurrencyDisplay from '@/Components/Shared/CurrencyDisplay';

// Tampilan basic
<CurrencyDisplay value={10000} />

// Tampilan dengan tooltip untuk format lengkap
<CurrencyDisplay value={10000} showTooltip />

// Tidak menampilkan simbol Rp
<CurrencyDisplay value={10000} withSymbol={false} />

// Tampilkan dengan desimal
<CurrencyDisplay value={10000} withDecimal />

// Dengan variant typography dan style tambahan
<CurrencyDisplay
  value={10000}
  variant="h6"
  sx={{ fontWeight: 'bold', color: 'success.main' }}
/>
```

## Komponen SalaryDisplay

File: `Components/Shared/SalaryDisplay.jsx`

Komponen khusus untuk menampilkan range gaji.

```jsx
import SalaryDisplay from '@/Components/Shared/SalaryDisplay';

// Tampilan basic (Rp10.000 - Rp15.000)
<SalaryDisplay minSalary={10000} maxSalary={15000} />

// Tanpa min atau max salary
<SalaryDisplay minSalary={10000} />
<SalaryDisplay maxSalary={15000} />

// Tidak menampilkan simbol Rp
<SalaryDisplay minSalary={10000} maxSalary={15000} withSymbol={false} />

// Dengan tooltip untuk format lengkap
<SalaryDisplay
  minSalary={10000}
  maxSalary={15000}
  showTooltip
/>

// Dengan variant dan custom separator
<SalaryDisplay
  minSalary={10000}
  maxSalary={15000}
  variant="body1"
  separator="sampai"
/>
```

## Contoh penggunaan pada tabel

```jsx
import Table from '@/Components/Shared/Table';
import SalaryDisplay from '@/Components/Shared/SalaryDisplay';

// Definisi kolom pada tabel
const columns = [
  // Kolom lainnya...
  {
    field: 'salary_min',
    header: 'Salary Range',
    sortable: true,
    render: (salary_min, job) => (
      <SalaryDisplay
        minSalary={salary_min}
        maxSalary={job.salary_max}
        showTooltip
      />
    ),
  },
  // Kolom lainnya...
];

// Komponen tabel
<Table
  data={jobs}
  columns={columns}
  // Props lainnya...
/>
```

## Kontribusi

Jika Anda ingin menambahkan lebih banyak fungsi atau meningkatkan utilitas yang ada, silakan buat pull request. 