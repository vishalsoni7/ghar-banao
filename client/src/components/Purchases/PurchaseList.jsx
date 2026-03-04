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
import { Edit, Delete, Visibility, Receipt } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useLanguage } from '../../context/LanguageContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { paymentStatuses } from '../../utils/translations';

const PurchaseList = ({ purchases, onEdit, onDelete, onView }) => {
  const { t, language } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const getStatusChip = (status) => {
    const statusInfo = paymentStatuses.find(s => s.value === status);
    return (
      <Chip
        label={language === 'hi' ? statusInfo?.labelHi : statusInfo?.labelEn}
        color={statusInfo?.color || 'default'}
        size="small"
      />
    );
  };

  if (purchases.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 5 }}>
        <Receipt sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
        <Typography color="text.secondary">{t('noPurchases')}</Typography>
      </Box>
    );
  }

  // Mobile Card View
  if (isMobile) {
    return (
      <Grid container spacing={2}>
        {purchases.map((purchase) => (
          <Grid size={12} key={purchase._id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {purchase.vendorId?.name || purchase.vendorName || 'Unknown'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(purchase.date, language)}
                    </Typography>
                  </Box>
                  {getStatusChip(purchase.paymentStatus)}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Items</Typography>
                    <Typography variant="body2">{purchase.items?.length || 0}</Typography>
                  </Box>
                  <Box textAlign="right">
                    <Typography variant="caption" color="text.secondary">{t('totalAmount')}</Typography>
                    <Typography variant="body2" fontWeight="bold" color="primary">
                      {formatCurrency(purchase.totalAmount)}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <IconButton size="small" onClick={() => onView(purchase)}>
                    <Visibility />
                  </IconButton>
                  <IconButton size="small" onClick={() => onEdit(purchase)}>
                    <Edit />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => onDelete(purchase)}>
                    <Delete />
                  </IconButton>
                </Box>
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
            <TableCell>{t('purchaseDate')}</TableCell>
            <TableCell>{t('vendors')}</TableCell>
            <TableCell>Items</TableCell>
            <TableCell align="right">{t('totalAmount')}</TableCell>
            <TableCell align="right">{t('amountPaid')}</TableCell>
            <TableCell>{t('paymentStatus')}</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {purchases.map((purchase) => (
            <TableRow
              key={purchase._id}
              hover
              sx={{ cursor: 'pointer' }}
              onClick={() => onView(purchase)}
            >
              <TableCell>{formatDate(purchase.date, language)}</TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  {purchase.vendorId?.name || purchase.vendorName || 'Unknown'}
                </Typography>
                {purchase.billNumber && (
                  <Typography variant="caption" color="text.secondary">
                    Bill: {purchase.billNumber}
                  </Typography>
                )}
              </TableCell>
              <TableCell>
                {purchase.items?.slice(0, 2).map((item, i) => (
                  <Typography key={i} variant="body2">
                    {item.name} ({item.quantity} {item.unit})
                  </Typography>
                ))}
                {purchase.items?.length > 2 && (
                  <Typography variant="caption" color="text.secondary">
                    +{purchase.items.length - 2} more
                  </Typography>
                )}
              </TableCell>
              <TableCell align="right">
                <Typography fontWeight="bold">{formatCurrency(purchase.totalAmount)}</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography color={purchase.amountPaid > 0 ? 'success.main' : 'text.secondary'}>
                  {formatCurrency(purchase.amountPaid)}
                </Typography>
              </TableCell>
              <TableCell>{getStatusChip(purchase.paymentStatus)}</TableCell>
              <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                <Tooltip title={t('details')}>
                  <IconButton size="small" color="primary" onClick={() => onView(purchase)}>
                    <Visibility fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t('edit')}>
                  <IconButton size="small" onClick={() => onEdit(purchase)}>
                    <Edit fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t('delete')}>
                  <IconButton size="small" color="error" onClick={() => onDelete(purchase)}>
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

export default PurchaseList;
