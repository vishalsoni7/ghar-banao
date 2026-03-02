import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useLanguage } from '../context/LanguageContext';
import { dashboardAPI } from '../utils/api';
import { formatCurrency } from '../utils/formatters';

const COLORS = ['#1976d2', '#4caf50', '#ff9800', '#f44336', '#9c27b0', '#00bcd4', '#795548', '#607d8b', '#e91e63', '#3f51b5'];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const Reports = () => {
  const { t } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [vendorData, setVendorData] = useState([]);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const [categoryRes, monthlyRes, vendorRes] = await Promise.all([
        dashboardAPI.getCategoryWise(),
        dashboardAPI.getMonthly(new Date().getFullYear()),
        dashboardAPI.getVendorWise(),
      ]);

      setCategoryData(categoryRes.data);
      setMonthlyData(monthlyRes.data.map((d, i) => ({
        ...d,
        name: MONTHS[i],
      })));
      setVendorData(vendorRes.data);
    } catch (error) {
      console.error('Error fetching report data:', error);
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
        {t('reports')}
      </Typography>

      <Grid container spacing={2}>
        {/* Monthly Spending Chart */}
        <Grid size={12}>
          <Card>
            <CardContent sx={{ p: isMobile ? 2 : 3 }}>
              <Typography variant="h6" mb={2}>
                {t('monthlySpending')} ({new Date().getFullYear()})
              </Typography>
              <Box sx={{ height: isMobile ? 220 : 300, mx: isMobile ? -1 : 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ left: isMobile ? -20 : 0, right: isMobile ? 10 : 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: isMobile ? 10 : 12 }} />
                    <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} tick={{ fontSize: isMobile ? 10 : 12 }} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Bar dataKey="amount" fill="#1976d2" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Category Wise Spending */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: isMobile ? 320 : 400, display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ p: isMobile ? 2 : 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" mb={2}>
                {t('categoryWise')}
              </Typography>
              {categoryData.length > 0 ? (
                <Box sx={{ flex: 1 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        dataKey="amount"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={isMobile ? 70 : 100}
                        label={isMobile ? false : ({ percent }) => `${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Legend wrapperStyle={{ fontSize: isMobile ? 12 : 14 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              ) : (
                <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Typography color="text.secondary">{t('noData')}</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Category Table */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: isMobile ? 320 : 400, display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ p: isMobile ? 2 : 3, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <Typography variant="h6" mb={2}>
                {t('categoryWise')} Details
              </Typography>
              <TableContainer sx={{ flex: 1, overflow: 'auto' }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('category')}</TableCell>
                      {!isMobile && <TableCell align="right">Items</TableCell>}
                      <TableCell align="right">{t('amount')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categoryData.map((cat, index) => (
                      <TableRow key={cat.name}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box
                              sx={{
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                bgcolor: COLORS[index % COLORS.length],
                                flexShrink: 0,
                              }}
                            />
                            <Typography variant="body2" noWrap sx={{ maxWidth: isMobile ? 100 : 'none' }}>
                              {cat.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        {!isMobile && <TableCell align="right">{cat.count}</TableCell>}
                        <TableCell align="right">{formatCurrency(cat.amount)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Vendor Wise Spending */}
        <Grid size={12}>
          <Card>
            <CardContent sx={{ p: isMobile ? 2 : 3 }}>
              <Typography variant="h6" mb={2}>
                {t('vendorWise')}
              </Typography>
              <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ minWidth: isMobile ? 80 : 'auto' }}>{t('vendors')}</TableCell>
                      {!isMobile && <TableCell align="right">Purchases</TableCell>}
                      <TableCell align="right" sx={{ minWidth: isMobile ? 70 : 'auto' }}>{t('totalAmount')}</TableCell>
                      {!isMobile && <TableCell align="right">{t('paid')}</TableCell>}
                      <TableCell align="right" sx={{ minWidth: isMobile ? 70 : 'auto' }}>{t('pending')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {vendorData.map((vendor) => (
                      <TableRow key={vendor.name}>
                        <TableCell>
                          <Typography variant="body2" noWrap sx={{ maxWidth: isMobile ? 80 : 'none' }}>
                            {vendor.name}
                          </Typography>
                        </TableCell>
                        {!isMobile && <TableCell align="right">{vendor.count}</TableCell>}
                        <TableCell align="right">{formatCurrency(vendor.amount)}</TableCell>
                        {!isMobile && (
                          <TableCell align="right" sx={{ color: 'success.main' }}>
                            {formatCurrency(vendor.paid)}
                          </TableCell>
                        )}
                        <TableCell
                          align="right"
                          sx={{ color: vendor.pending > 0 ? 'error.main' : 'text.secondary' }}
                        >
                          {formatCurrency(vendor.pending)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;
