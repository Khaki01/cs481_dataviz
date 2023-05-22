import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#696CFF',
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
      secondary: '',
    },
  },
  components: {
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
          scrollBehavior: 'smooth !important',
        },
      }),
    },
  },
});

export default theme;
