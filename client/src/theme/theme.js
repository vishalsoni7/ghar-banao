import { createTheme } from '@mui/material/styles';

export const getTheme = (mode) => createTheme({
  palette: {
    mode,
    // Black and white primary - inverts based on theme
    primary: {
      main: mode === 'dark' ? '#ffffff' : '#000000',
      light: mode === 'dark' ? '#ffffff' : '#000000',
      dark: mode === 'dark' ? '#cccccc' : '#000000',
      contrastText: mode === 'dark' ? '#000000' : '#ffffff',
    },
    // Secondary also black/white
    secondary: {
      main: mode === 'dark' ? '#cccccc' : '#333333',
      light: mode === 'dark' ? '#ffffff' : '#555555',
      dark: mode === 'dark' ? '#999999' : '#000000',
    },
    // Keep functional colors for status indicators
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
    },
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f',
    },
    info: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
    // Pure black/white backgrounds
    background: {
      default: mode === 'dark' ? '#000000' : '#ffffff',
      paper: mode === 'dark' ? '#000000' : '#ffffff',
    },
    // Text colors
    text: {
      primary: mode === 'dark' ? '#ffffff' : '#000000',
      secondary: mode === 'dark' ? '#aaaaaa' : '#666666',
    },
    // Divider color - subtle
    divider: mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
    // Action colors
    action: {
      active: mode === 'dark' ? '#ffffff' : '#000000',
      hover: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
      selected: mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
      disabled: mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.26)',
      disabledBackground: mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
        contained: {
          backgroundColor: mode === 'dark' ? '#ffffff' : '#000000',
          color: mode === 'dark' ? '#000000' : '#ffffff',
          '&:hover': {
            backgroundColor: mode === 'dark' ? '#cccccc' : '#333333',
          },
        },
        outlined: {
          borderColor: mode === 'dark' ? '#ffffff' : '#000000',
          color: mode === 'dark' ? '#ffffff' : '#000000',
          '&:hover': {
            borderColor: mode === 'dark' ? '#cccccc' : '#333333',
            backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          border: mode === 'dark' ? '1px solid #ffffff' : '1px solid #000000',
          backgroundColor: mode === 'dark' ? '#000000' : '#ffffff',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: mode === 'dark' ? '#000000' : '#ffffff',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: mode === 'dark' ? '1px solid #ffffff' : '1px solid #000000',
          backgroundColor: mode === 'dark' ? '#000000' : '#ffffff',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        // Only style default chips, not colored ones (success, warning, error)
        colorDefault: {
          backgroundColor: 'transparent',
          border: mode === 'dark' ? '1px solid #ffffff' : '1px solid #000000',
          color: mode === 'dark' ? '#ffffff' : '#000000',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: mode === 'dark' ? '#ffffff' : '#000000',
            },
            '&:hover fieldset': {
              borderColor: mode === 'dark' ? '#cccccc' : '#333333',
            },
            '&.Mui-focused fieldset': {
              borderColor: mode === 'dark' ? '#ffffff' : '#000000',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'dark' ? '#000000' : '#ffffff',
          color: mode === 'dark' ? '#ffffff' : '#000000',
          borderBottom: mode === 'dark' ? '1px solid #ffffff' : '1px solid #000000',
          boxShadow: 'none',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        // Only style default icon buttons, not colored ones (error, success, etc.)
        root: {
          '&:not(.MuiIconButton-colorError):not(.MuiIconButton-colorSuccess):not(.MuiIconButton-colorWarning):not(.MuiIconButton-colorInfo)': {
            color: mode === 'dark' ? '#ffffff' : '#000000',
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          color: mode === 'dark' ? '#ffffff' : '#000000',
          borderColor: mode === 'dark' ? '#ffffff' : '#000000',
          '&.Mui-selected': {
            backgroundColor: mode === 'dark' ? '#ffffff' : '#000000',
            color: mode === 'dark' ? '#000000' : '#ffffff',
            '&:hover': {
              backgroundColor: mode === 'dark' ? '#cccccc' : '#333333',
            },
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: mode === 'dark' ? '#000000' : '#ffffff',
          border: mode === 'dark' ? '1px solid #ffffff' : '1px solid #000000',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: mode === 'dark' ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.12)',
        },
      },
    },
  },
});
