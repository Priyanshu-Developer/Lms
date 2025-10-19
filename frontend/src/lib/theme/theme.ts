import { createTheme, ThemeOptions } from '@mui/material/styles';

// Extend MUI theme types
declare module '@mui/material/styles' {
  interface TypeBackground {
    glass: string;
  }

  interface Palette {
    custom: {
      primaryLight: string;
      primaryMain: string;
      primaryDark: string;
      border: string;
      label: string;
      labelFocused: string;
      hover: string;
      glassGradient: string;
      gradient: string;       // for buttons or highlights
      textOnGradient: string; // text color on gradient
      boxShadow: string;      // shadow for gradient buttons
      accent?: string;        // optional extra accent color
    };
  }

  interface PaletteOptions {
    custom?: {
      primaryLight?: string;
      primaryMain?: string;
      primaryDark?: string;
      border?: string;
      label?: string;
      labelFocused?: string;
      hover?: string;
      glassGradient?: string;
      gradient?: string;
      textOnGradient?: string;
      boxShadow?: string;
      accent?: string;
    };
  }
}

// Custom color constants
export const PRIMARY_LIGHT = '#f3ecff';
export const PRIMARY_MAIN = '#b388ff';
export const PRIMARY_DARK = '#8e24aa';
export const BORDER_COLOR = '#b99aff';
export const LABEL = '#9c7be8';
export const LABEL_FOCUSED = '#d1aaff';
export const HOVER_COLOR = '#c77dff';
export const GLASS_GRADIENT = 'linear-gradient(112deg,#f3ecff44 0%,#f3ecff88 100%)';
export const BUTTON_GRADIENT = 'linear-gradient(90deg, #6b4efc 0%, #c17ef7 100%)';
export const TEXT_ON_GRADIENT = '#ffffff';
export const BUTTON_SHADOW = '0 2px 8px 0 rgba(105,76,255,0.10)';

export const getDesignTokens = (mode: 'light' | 'dark'): ThemeOptions => ({
  palette: {
    mode,
    primary: {
      main: mode === 'light' ? PRIMARY_DARK : PRIMARY_MAIN,
      dark: mode === 'light' ? PRIMARY_DARK : '#6b4efc',
      contrastText: '#fff',
    },
    secondary: {
      main: mode === 'light' ? PRIMARY_MAIN : PRIMARY_LIGHT,
    },
    background: {
      default: mode === 'light' ? '#faf8fe' : '#18141e',
      paper: mode === 'light' ? 'rgba(255,255,255,0.85)' : '#211d29',
      glass: PRIMARY_LIGHT,
    },
    text: {
      primary: mode === 'light' ? '#1a1850' : '#f5e8ff',
      secondary: mode === 'light' ? '#6d6493' : '#c2b6e8',
    },
    divider: BORDER_COLOR,
    error: { main: '#f44336' },
    warning: { main: '#ff9800' },
    info: { main: PRIMARY_DARK },
    success: { main: '#6ee7b7' },
    custom: {
      primaryLight: PRIMARY_LIGHT,
      primaryMain: PRIMARY_MAIN,
      primaryDark: PRIMARY_DARK,
      border: BORDER_COLOR,
      label: LABEL,
      labelFocused: LABEL_FOCUSED,
      hover: HOVER_COLOR,
      glassGradient: GLASS_GRADIENT,
      gradient: BUTTON_GRADIENT,
      textOnGradient: TEXT_ON_GRADIENT,
      boxShadow: BUTTON_SHADOW,
    },
  },
  typography: {
    fontFamily: "Manrope, 'Roboto', 'Arial', sans-serif",
    h1: { fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.5px' },
    h2: { fontSize: '1.75rem', fontWeight: 700 },
    h3: { fontSize: '1.5rem', fontWeight: 600 },
    h4: { fontWeight: 600, color: PRIMARY_DARK },
    body1: { fontSize: '1.05rem', color: PRIMARY_DARK },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.15px' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          padding: '13px 0px',
          fontWeight: 600,
          textTransform: 'none',
        },
        containedPrimary: {
          backgroundColor: PRIMARY_MAIN, // fallback solid color
          backgroundImage: BUTTON_GRADIENT, // gradient
          color: TEXT_ON_GRADIENT,
          boxShadow: BUTTON_SHADOW,
          '&:hover': {
            backgroundColor: PRIMARY_DARK, // fallback hover
            backgroundImage: BUTTON_GRADIENT, // keep gradient on hover
            boxShadow: '0 4px 12px 0 rgba(105,76,255,0.15)',
          },
        },
        outlined: {
          border: `2px solid ${BORDER_COLOR}`,
          backgroundColor: PRIMARY_DARK,
          '&:hover': {
            backgroundColor: HOVER_COLOR,
          },
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          background: PRIMARY_LIGHT,
          borderRadius: 12,
          '& .MuiOutlinedInput-root': {
            backgroundColor: PRIMARY_LIGHT,
            borderRadius: 12,
            border: `1.5px solid ${BORDER_COLOR}`,
            transition: 'border-color 0.2s',
            '&:hover fieldset': { borderColor: HOVER_COLOR },
            '&.Mui-focused fieldset': { borderColor: PRIMARY_DARK, borderWidth: 2 },
          },
          '& label': { color: LABEL, fontWeight: 500 },
          '& .Mui-focused label': { color: PRIMARY_DARK },
        },
      },
    },
  },
});
