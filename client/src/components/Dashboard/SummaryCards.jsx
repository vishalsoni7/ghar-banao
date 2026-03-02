import { Card, CardContent, Typography, Box, Grid, useTheme } from '@mui/material';
import {
  AccountBalance,
  CheckCircle,
  Pending,
  Store,
} from '@mui/icons-material';
import { useLanguage } from '../../context/LanguageContext';
import { formatCurrency } from '../../utils/formatters';

const SummaryCards = ({ summary }) => {
  const { t } = useLanguage();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Black/white theme with status colors only for paid (green) and pending (red)
  const cards = [
    {
      title: t('totalSpent'),
      value: formatCurrency(summary?.totalAmount || 0),
      icon: <AccountBalance />,
      color: isDark ? '#ffffff' : '#000000',
      bgColor: 'transparent',
      borderColor: isDark ? '#ffffff' : '#000000',
    },
    {
      title: t('totalPaid'),
      value: formatCurrency(summary?.totalPaid || 0),
      icon: <CheckCircle />,
      color: '#4caf50', // Keep green for paid status
      bgColor: 'transparent',
      borderColor: '#4caf50',
    },
    {
      title: t('pendingPayments'),
      value: formatCurrency(summary?.pendingAmount || 0),
      icon: <Pending />,
      color: '#f44336', // Keep red for pending status
      bgColor: 'transparent',
      borderColor: '#f44336',
    },
    {
      title: t('totalVendors'),
      value: summary?.vendorCount || 0,
      icon: <Store />,
      color: isDark ? '#ffffff' : '#000000',
      bgColor: 'transparent',
      borderColor: isDark ? '#ffffff' : '#000000',
    },
  ];

  return (
    <Grid container spacing={3}>
      {cards.map((card, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
          <Card
            sx={{
              height: '100%',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' },
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom noWrap>
                    {card.title}
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" sx={{ color: card.color }}>
                    {card.value}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 2,
                    bgcolor: 'transparent',
                    border: `1px solid ${card.borderColor}`,
                    color: card.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    ml: 1,
                  }}
                >
                  {card.icon}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default SummaryCards;
