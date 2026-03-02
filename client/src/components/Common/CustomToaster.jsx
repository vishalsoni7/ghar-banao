import { Toaster } from 'react-hot-toast';
import { useTheme as useMuiTheme } from '@mui/material/styles';

const CustomToaster = () => {
  const theme = useMuiTheme();

  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderRadius: '8px',
          boxShadow: theme.shadows[3],
        },
        success: {
          iconTheme: {
            primary: theme.palette.success.main,
            secondary: '#fff',
          },
        },
        error: {
          iconTheme: {
            primary: theme.palette.error.main,
            secondary: '#fff',
          },
        },
      }}
    />
  );
};

export default CustomToaster;
