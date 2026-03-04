import {
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  Chip,
  Box,
  Button,
  Divider,
} from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { paymentStatuses } from '../../utils/translations';

const RecentPurchases = ({ purchases }) => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

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

  return (
    <Card>
      <CardHeader
        title={t('recentPurchases')}
        avatar={<ShoppingCart color="primary" />}
        action={
          <Button size="small" onClick={() => navigate('/purchases')}>
            {t('all')}
          </Button>
        }
      />
      <CardContent sx={{ pt: 0 }}>
        {purchases?.length > 0 ? (
          <List dense disablePadding>
            {purchases.slice(0, 5).map((purchase, index) => (
              <Box key={purchase._id}>
                <ListItem
                  sx={{
                    py: 1.5,
                    px: 1,
                  }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight="medium">
                          {purchase.vendorId?.name || purchase.vendorName || 'Unknown'}
                        </Typography>
                        {getStatusChip(purchase.paymentStatus)}
                      </Box>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(purchase.date, language)} • {purchase.items?.length} {t('items')}
                      </Typography>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Typography variant="body2" fontWeight="bold" color="primary">
                      {formatCurrency(purchase.totalAmount)}
                    </Typography>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < Math.min(purchases.length, 5) - 1 && <Divider />}
              </Box>
            ))}
          </List>
        ) : (
          <Typography color="text.secondary" textAlign="center" py={3}>
            {t('noPurchases')}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentPurchases;
