import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Grid, Card, CardContent, CardHeader } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { PieChartOutlined } from '@mui/icons-material';
import SummaryCards from '../components/Dashboard/SummaryCards';
import RecentPurchases from '../components/Dashboard/RecentPurchases';
import PendingPayments from '../components/Dashboard/PendingPayments';
import { dashboardAPI } from '../utils/api';
import { useLanguage } from '../context/LanguageContext';
import { formatCurrency } from '../utils/formatters';

const COLORS = ['#1976d2', '#4caf50', '#ff9800', '#f44336', '#9c27b0', '#00bcd4', '#795548', '#607d8b'];

const Dashboard = () => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [recentPurchases, setRecentPurchases] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [summaryRes, recentRes, categoryRes] = await Promise.all([
        dashboardAPI.getSummary(),
        dashboardAPI.getRecent(),
        dashboardAPI.getCategoryWise(),
      ]);

      setSummary(summaryRes.data);
      setRecentPurchases(recentRes.data);
      setCategoryData(categoryRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        {t('dashboard')}
      </Typography>

      {/* Summary Cards */}
      <SummaryCards summary={summary} />

      <Grid container spacing={3} sx={{ mt: 1 }}>
        {/* Category Pie Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: 400, display: 'flex', flexDirection: 'column' }}>
            <CardHeader
              title={t('spendingByCategory')}
              avatar={<PieChartOutlined color="primary" />}
            />
            <CardContent sx={{ pt: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="amount"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      labelLine={false}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Typography color="text.secondary">{t('noData')}</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Pending Payments */}
        <Grid size={{ xs: 12, md: 6 }}>
          <PendingPayments purchases={recentPurchases} />
        </Grid>

        {/* Recent Purchases */}
        <Grid size={12}>
          <RecentPurchases purchases={recentPurchases} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
