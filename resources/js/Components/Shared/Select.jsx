import React from 'react';
import {
    Box,
    FormControl,
    InputLabel,
    Select as MuiSelect,
    MenuItem,
    FormHelperText,
    OutlinedInput,
    useTheme
} from '@mui/material';

const Select = ({
                    label,
                    name,
                    value,
                    onChange,
                    options = [],
                    error,
                    helperText,
                    required = false,
                    fullWidth = true,
                    disabled = false,
                    margin, // Hapus margin yang menyebabkan error
                    placeholder = "Select an option",
                    className = '',
                    ...props
                }) => {
    const theme = useTheme();

    return (
        <Box className={className}>
            <FormControl
                fullWidth={fullWidth}
                error={!!error}
                required={required}
                disabled={disabled}
                // Hapus margin prop dari FormControl
            >
                {label && (
                    <InputLabel id={`${name}-label`}>
                        {label}
                    </InputLabel>
                )}
                <MuiSelect
                    labelId={`${name}-label`}
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    input={<OutlinedInput label={label} />}
                    displayEmpty
                    disabled={disabled}
                    renderValue={(selected) => {
                        if (!selected) {
                            return <span style={{ color: theme.palette.text.secondary }}>{placeholder}</span>;
                        }
                        const selectedOption = options.find(option => option.value === selected);
                        return selectedOption ? selectedOption.label : selected;
                    }}
                    {...props}
                >
                    {placeholder && (
                        <MenuItem value="" disabled>
                            <span style={{ color: theme.palette.text.secondary }}>{placeholder}</span>
                        </MenuItem>
                    )}
                    {options.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </MuiSelect>
                {(error || helperText) && (
                    <FormHelperText>
                        {error || helperText}
                    </FormHelperText>
                )}
            </FormControl>
        </Box>
    );
};

export default Select;
