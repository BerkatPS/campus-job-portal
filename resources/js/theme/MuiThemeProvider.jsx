import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Import the theme from the Theme.js file
import theme from './Theme';

const muiTheme = createTheme({
    palette: {
        primary: {
            main: theme.colors.primary[500],
            light: theme.colors.primary[300],
            dark: theme.colors.primary[700],
            contrastText: '#fff',
        },
        secondary: {
            main: theme.colors.secondary[500],
            light: theme.colors.secondary[300],
            dark: theme.colors.secondary[700],
            contrastText: '#fff',
        },
        error: {
            main: theme.colors.utility.error,
        },
        warning: {
            main: theme.colors.utility.warning,
        },
        info: {
            main: theme.colors.utility.info,
        },
        success: {
            main: theme.colors.utility.success,
        },
        background: {
            default: theme.colors.gray[50],
            paper: '#fff',
        },
        text: {
            primary: theme.colors.gray[900],
            secondary: theme.colors.gray[600],
        },
    },
    typography: {
        fontFamily: theme.fontFamily.sans.join(','),
        fontSize: 14,
        h1: {
            fontSize: theme.fontSize['5xl'],
            fontWeight: theme.fontWeight.bold,
        },
        h2: {
            fontSize: theme.fontSize['4xl'],
            fontWeight: theme.fontWeight.bold,
        },
        h3: {
            fontSize: theme.fontSize['3xl'],
            fontWeight: theme.fontWeight.semibold,
        },
        h4: {
            fontSize: theme.fontSize['2xl'],
            fontWeight: theme.fontWeight.semibold,
        },
        h5: {
            fontSize: theme.fontSize.xl,
            fontWeight: theme.fontWeight.medium,
        },
        h6: {
            fontSize: theme.fontSize.lg,
            fontWeight: theme.fontWeight.medium,
        },
        body1: {
            fontSize: theme.fontSize.base,
        },
        body2: {
            fontSize: theme.fontSize.sm,
        },
        button: {
            textTransform: 'none',
        },
    },
    shape: {
        borderRadius: parseInt(theme.borderRadius.DEFAULT),
    },
    shadows: [
        'none',
        theme.boxShadow.sm,
        theme.boxShadow.DEFAULT,
        theme.boxShadow.md,
        theme.boxShadow.lg,
        theme.boxShadow.xl,
        theme.boxShadow['2xl'],
        theme.boxShadow.inner,
        theme.boxShadow.none,
        theme.boxShadow.none,
        theme.boxShadow.none,
        theme.boxShadow.none,
        theme.boxShadow.none,
        theme.boxShadow.none,
        theme.boxShadow.none,
        theme.boxShadow.none,
        theme.boxShadow.none,
        theme.boxShadow.none,
        theme.boxShadow.none,
        theme.boxShadow.none,
        theme.boxShadow.none,
        theme.boxShadow.none,
        theme.boxShadow.none,
        theme.boxShadow.none,
        theme.boxShadow.none,
    ],
});

export default function MuiThemeProvider({ children }) {
    return (
        <ThemeProvider theme={muiTheme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
}