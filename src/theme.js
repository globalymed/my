import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb',
      light: '#60a5fa',
      dark: '#1e40af',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#8b5cf6',
      light: '#a78bfa',
      dark: '#6d28d9',
      contrastText: '#ffffff',
    },
    success: {
      main: '#22c55e',
      light: '#4ade80',
      dark: '#16a34a',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.2,
      letterSpacing: '-0.00833em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.2,
      letterSpacing: '0em',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.2,
      letterSpacing: '0.00735em',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.1rem',
      lineHeight: 1.2,
      letterSpacing: '0em',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.2,
      letterSpacing: '0.0075em',
    },
    subtitle1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      letterSpacing: '0.00938em',
    },
    subtitle2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      letterSpacing: '0.00714em',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      letterSpacing: '0.00938em',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      letterSpacing: '0.01071em',
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 600,
      letterSpacing: '0.02857em',
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0, 0, 0, 0.05)',
    '0px 4px 6px rgba(0, 0, 0, 0.07)',
    '0px 6px 8px rgba(0, 0, 0, 0.08)',
    '0px 8px 12px rgba(0, 0, 0, 0.09)',
    '0px 10px 14px rgba(0, 0, 0, 0.1)',
    '0px 12px 16px rgba(0, 0, 0, 0.11)',
    '0px 14px 20px rgba(0, 0, 0, 0.12)',
    '0px 16px 24px rgba(0, 0, 0, 0.13)',
    '0px 18px 28px rgba(0, 0, 0, 0.14)',
    '0px 20px 32px rgba(0, 0, 0, 0.15)',
    '0px 22px 36px rgba(0, 0, 0, 0.16)',
    '0px 24px 40px rgba(0, 0, 0, 0.17)',
    '0px 26px 44px rgba(0, 0, 0, 0.18)',
    '0px 28px 48px rgba(0, 0, 0, 0.19)',
    '0px 30px 52px rgba(0, 0, 0, 0.2)',
    '0px 32px 56px rgba(0, 0, 0, 0.21)',
    '0px 34px 60px rgba(0, 0, 0, 0.22)',
    '0px 36px 64px rgba(0, 0, 0, 0.23)',
    '0px 38px 68px rgba(0, 0, 0, 0.24)',
    '0px 40px 72px rgba(0, 0, 0, 0.25)',
    '0px 42px 76px rgba(0, 0, 0, 0.26)',
    '0px 44px 80px rgba(0, 0, 0, 0.27)',
    '0px 46px 84px rgba(0, 0, 0, 0.28)',
    '0px 48px 88px rgba(0, 0, 0, 0.29)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 20px',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.07)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0px 6px 8px rgba(0, 0, 0, 0.09)',
          },
        },
        contained: {
          '&.MuiButton-containedPrimary': {
            background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
          },
          '&.MuiButton-containedSecondary': {
            background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 8px 12px rgba(0, 0, 0, 0.09)',
          overflow: 'hidden',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0px 12px 16px rgba(0, 0, 0, 0.11)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'all 0.2s ease-in-out',
            '&.Mui-focused': {
              boxShadow: '0px 0px 0px 3px rgba(37, 99, 235, 0.2)',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.07)',
        },
      },
    },
  },
});

export default theme;
