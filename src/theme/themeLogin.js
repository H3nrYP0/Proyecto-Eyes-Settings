// theme/themeLogin.js
import { createTheme } from '@mui/material/styles';

// Colores teal específicos para login/register/forgot-password
const loginColors = {
  primary: '#1a4a4a',
  primaryLight: '#3d8080',
  primaryDark: '#0d2e2e',
  secondary: '#4e6e6e',
  accent: '#c9a050',
  gray50: '#f3f8f8',
  gray100: '#eaf3f3',
  gray400: '#8aaeae',
  gray500: '#4e6e6e',
  gray600: '#3a5454',
};

export const loginTheme = createTheme({
  palette: {
    primary: {
      main: loginColors.primary,
      light: loginColors.primaryLight,
      dark: loginColors.primaryDark,
    },
    secondary: {
      main: loginColors.secondary,
    },
    background: {
      default: loginColors.gray50,
      paper: '#ffffff',
    },
    text: {
      primary: loginColors.gray600,
      secondary: loginColors.gray500,
    },
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
    button: {
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          fontWeight: 600,
        },
        contained: {
          backgroundColor: loginColors.primary,
          '&:hover': {
            backgroundColor: loginColors.primaryDark,
          },
        },
        text: {
          color: loginColors.primary,
          '&:hover': {
            backgroundColor: 'rgba(26, 74, 74, 0.04)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: loginColors.primary,
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          '&.Mui-focused': {
            color: loginColors.primary,
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: loginColors.gray400,
          '&.Mui-checked': {
            color: loginColors.primary,
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

export default loginTheme;