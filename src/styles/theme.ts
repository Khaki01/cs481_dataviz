import { createTheme } from '@mui/material/styles';
import { Inter, Poppins } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });
const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
});

const fontFamily = [inter.style.fontFamily, poppins.style.fontFamily].join(',');
// Create a theme instance.
const theme = createTheme({
  typography: {
    fontFamily,
    h1: {
      wordBreak: 'break-word',
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
      wordBreak: 'break-word',
    },
  },
  palette: {
    primary: {
      main: '#696CFF',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FFFFFF',
    },
    success: {
      main: '#71dd37',
    },
    error: {
      main: '#ff3e1d',
    },
    background: {
      default: '#f5f5f9',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#566A7F',
      secondary: '#000000',
    },
  },
  components: {
    MuiButtonBase: {
      styleOverrides: {
        root: ({ theme }) => ({
          '&:hover': {
            color: theme.palette.primary.main,
          },
        }),
      },
    },
    MuiButton: {
      styleOverrides: {
        textPrimary: ({ theme }) => ({
          '&:hover': {
            color: theme.palette.primary.main,
          },
        }),
        containedPrimary: ({ theme }) => ({
          '&:hover': {
            color: theme.palette.secondary.main,
          },
        }),
        outlinedPrimary: ({ theme }) => ({
          '&:hover': {
            color: theme.palette.primary.main,
          },
        }),
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          boxShadow: `0 2px 6px 0 ${theme.palette.divider}`,
        }),
      },
    },
    MuiCssBaseline: {
      styleOverrides: (theme) => ({
        html: {
          margin: 0,
          padding: 0,
          height: '100%',
          fontFamily,
          scrollBehavior: 'smooth !important',
        },
        main: {
          fontFamily,
        },
      }),
    },
  },
});

export default theme;
