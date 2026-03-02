import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Typography,
  Box,
  Tooltip,
  useMediaQuery,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import { Delete, Payment } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useLanguage } from '../../context/LanguageContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { paymentModes } from '../../utils/translations';

const PaymentList = ({ payments, onDelete }) => {
  const { t, language } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const getPaymentModeChip = (mode) => {
    const modeInfo = paymentModes.find(m => m.value === mode);
    const colors = {
      cash: 'success',
      upi: 'primary',
      bank: 'info',
      cheque: 'warning',
    };
    return (
      <Chip
        label={language === 'hi' ? modeInfo?.labelHi : modeInfo?.labelEn}
        color={colors[mode] || 'default'}
        size="small"
      />
    );
  };

  if (payments.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 5 }}>
        <Payment sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
        <Typography color="text.secondary">{t('noPayments')}</Typography>
      </Box>
    );
  }

  // Mobile Card View
  if (isMobile) {
    return (
      <Grid container spacing={2}>
        {payments.map((payment) => (
          <Grid size={12} key={payment._id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {payment.vendorId?.name || payment.vendorName || 'Unknown'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(payment.date, language)}
                    </Typography>
                  </Box>
                  {getPaymentModeChip(payment.paymentMode)}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" color="success.main" fontWeight="bold">
                    {formatCurrency(payment.amount)}
                  </Typography>
                  <IconButton size="small" color="error" onClick={() => onDelete(payment)}>
                    <Delete />
                  </IconButton>
                </Box>

                {payment.reference && (
                  <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                    Ref: {payment.reference}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  // Desktop Table View
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('paymentDate')}</TableCell>
            <TableCell>{t('vendors')}</TableCell>
            <TableCell align="right">{t('paymentAmount')}</TableCell>
            <TableCell>{t('paymentMode')}</TableCell>
            <TableCell>{t('reference')}</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment._id} hover>
              <TableCell>{formatDate(payment.date, language)}</TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  {payment.vendorId?.name || payment.vendorName || 'Unknown'}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography fontWeight="bold" color="success.main">
                  {formatCurrency(payment.amount)}
                </Typography>
              </TableCell>
              <TableCell>{getPaymentModeChip(payment.paymentMode)}</TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {payment.reference || '-'}
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Tooltip title={t('delete')}>
                  <IconButton size="small" color="error" onClick={() => onDelete(payment)}>
                    <Delete fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PaymentList;
