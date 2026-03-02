import {
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  Box,
  Button,
  Chip,
} from '@mui/material';
import { Warning } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

const PendingPayments = ({ purchases }) => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const pendingPurchases = purchases?.filter(p => p.paymentStatus !== 'paid') || [];

  return (
    <Card sx={{ height: 400, display: 'flex', flexDirection: 'column' }}>
      <CardHeader
        title={t('pendingBills')}
        avatar={<Warning color="error" />}
        action={
          pendingPurchases.length > 0 && (
            <Chip
              label={pendingPurchases.length}
              color="error"
              size="small"
            />
          )
        }
      />
      <CardContent sx={{ pt: 0, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        {pendingPurchases.length > 0 ? (
          <List dense sx={{ flex: 1 }}>
            {pendingPurchases.slice(0, 5).map((purchase) => {
              const pending = purchase.totalAmount - purchase.amountPaid;
              return (
                <ListItem
                  key={purchase._id}
                  sx={{
                    borderRadius: 1,
                    mb: 1,
                    bgcolor: 'error.light',
                    opacity: 0.9,
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography variant="body2" fontWeight="medium">
                        {purchase.vendorId?.name || purchase.vendorName || 'Unknown'}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption">
                        {formatDate(purchase.date, language)}
                      </Typography>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Box textAlign="right">
                      <Typography variant="body2" fontWeight="bold" color="error.dark">
                        {formatCurrency(pending)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        of {formatCurrency(purchase.totalAmount)}
                      </Typography>
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        ) : (
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography color="text.secondary" textAlign="center">
              No pending payments!
            </Typography>
          </Box>
        )}

        {pendingPurchases.length > 5 && (
          <Button fullWidth onClick={() => navigate('/purchases?status=pending')}>
            View All ({pendingPurchases.length})
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default PendingPayments;
