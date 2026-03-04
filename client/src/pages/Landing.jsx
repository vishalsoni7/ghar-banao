import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
  useTheme,
} from '@mui/material';
import {
  HomeWork,
  Inventory,
  Payment,
  Assessment,
  People,
  Speed,
  Security,
  CloudDone,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

// Animated counter hook
const useAnimatedCounter = (targetValue, duration = 2000) => {
  const [count, setCount] = useState(0);
  const startTimeRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = timestamp - startTimeRef.current;
      const percentage = Math.min(progress / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - percentage, 4);
      const currentValue = Math.floor(easeOutQuart * targetValue);

      setCount(currentValue);

      if (percentage < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [targetValue, duration]);

  return count;
};

// Format number to Indian format with commas (e.g., 12,34,567)
const formatIndianNumber = (num) => {
  const str = num.toString();
  if (str.length <= 3) return str;

  // Get last 3 digits
  let result = str.slice(-3);
  let remaining = str.slice(0, -3);

  // Add commas every 2 digits for the remaining part
  while (remaining.length > 0) {
    const chunk = remaining.slice(-2);
    remaining = remaining.slice(0, -2);
    result = chunk + ',' + result;
  }

  return result;
};

// Animated stat component
const AnimatedStat = ({ label, targetValue, prefix = '', suffix = '' }) => {
  const animatedValue = useAnimatedCounter(targetValue, 2500);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 2,
        borderRadius: 2,
        bgcolor: 'background.default',
        gap: 3,
        minWidth: 280,
      }}
    >
      <Typography color="text.secondary" sx={{ flexShrink: 0 }}>{label}</Typography>
      <Typography fontWeight="bold" sx={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>
        {prefix} {formatIndianNumber(animatedValue)}{suffix}
      </Typography>
    </Box>
  );
};

const Landing = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useAuth();

  // Generate random values on mount
  const [stats] = useState(() => ({
    totalPurchases: Math.floor(Math.random() * 2000000) + 1000000, // 10L - 30L
    totalPayments: Math.floor(Math.random() * 1500000) + 800000,   // 8L - 23L
    pendingAmount: Math.floor(Math.random() * 500000) + 100000,    // 1L - 6L
    activeVendors: Math.floor(Math.random() * 30) + 10,            // 10 - 40
  }));

  // If user is logged in, redirect to dashboard
  if (user) {
    navigate('/dashboard');
    return null;
  }

  const features = [
    {
      icon: <People sx={{ fontSize: 40 }} />,
      title: 'Vendor Management',
      titleHi: 'विक्रेता प्रबंधन',
      description: 'Track all your vendors, their contact details, and payment history in one place.',
      descriptionHi: 'अपने सभी विक्रेताओं, उनके संपर्क विवरण और भुगतान इतिहास को एक ही स्थान पर ट्रैक करें।',
    },
    {
      icon: <Inventory sx={{ fontSize: 40 }} />,
      title: 'Purchase Tracking',
      titleHi: 'खरीद ट्रैकिंग',
      description: 'Record every purchase with itemized details, bill photos, and payment status.',
      descriptionHi: 'आइटम विवरण, बिल फोटो और भुगतान स्थिति के साथ हर खरीद को रिकॉर्ड करें।',
    },
    {
      icon: <Payment sx={{ fontSize: 40 }} />,
      title: 'Payment Management',
      titleHi: 'भुगतान प्रबंधन',
      description: 'Keep track of all payments - cash, UPI, bank transfers, and cheques.',
      descriptionHi: 'सभी भुगतानों का ट्रैक रखें - नकद, UPI, बैंक ट्रांसफर और चेक।',
    },
    {
      icon: <Assessment sx={{ fontSize: 40 }} />,
      title: 'Reports & Analytics',
      titleHi: 'रिपोर्ट और विश्लेषण',
      description: 'Get insights with detailed reports on spending, vendor-wise analysis, and more.',
      descriptionHi: 'खर्च, विक्रेता-वार विश्लेषण और अधिक पर विस्तृत रिपोर्ट के साथ जानकारी प्राप्त करें।',
    },
  ];

  const benefits = [
    {
      icon: <Speed sx={{ fontSize: 32 }} />,
      title: 'Fast & Easy',
      titleHi: 'तेज़ और आसान',
      description: 'Simple interface designed for quick data entry',
      descriptionHi: 'त्वरित डेटा प्रविष्टि के लिए सरल इंटरफ़ेस',
    },
    {
      icon: <Security sx={{ fontSize: 32 }} />,
      title: 'Secure',
      titleHi: 'सुरक्षित',
      description: 'Your data is protected and private',
      descriptionHi: 'आपका डेटा सुरक्षित और निजी है',
    },
    {
      icon: <CloudDone sx={{ fontSize: 32 }} />,
      title: 'Cloud Sync',
      titleHi: 'क्लाउड सिंक',
      description: 'Access your data from anywhere',
      descriptionHi: 'कहीं से भी अपना डेटा एक्सेस करें',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)'
            : 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
          py: { xs: 8, md: 12 },
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <HomeWork sx={{ fontSize: 48, color: 'primary.main' }} />
                  <Typography
                    variant="h2"
                    fontWeight="bold"
                    sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' } }}
                  >
                    GharBanao
                  </Typography>
                </Box>
                <Typography
                  variant="h5"
                  color="text.secondary"
                  sx={{ fontSize: { xs: '1.1rem', md: '1.4rem' } }}
                >
                  Construction Material & Expense Tracker
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ fontSize: { xs: '1rem', md: '1.1rem' }, maxWidth: 500 }}
                >
                  Manage your home construction expenses effortlessly. Track vendors, purchases,
                  and payments all in one place. Never lose track of a single rupee.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 2 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/register')}
                    sx={{ px: 4, py: 1.5, fontSize: '1rem' }}
                  >
                    Get Started Free
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/login')}
                    sx={{ px: 4, py: 1.5, fontSize: '1rem' }}
                  >
                    Login
                  </Button>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box
                sx={{
                  p: 4,
                  borderRadius: 4,
                  border: 1,
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                }}
              >
                <Stack spacing={2}>
                  <AnimatedStat
                    label="Total Purchases"
                    targetValue={stats.totalPurchases}
                    prefix="₹"
                  />
                  <AnimatedStat
                    label="Total Payments"
                    targetValue={stats.totalPayments}
                    prefix="₹"
                  />
                  <AnimatedStat
                    label="Pending Amount"
                    targetValue={stats.pendingAmount}
                    prefix="₹"
                  />
                  <AnimatedStat
                    label="Active Vendors"
                    targetValue={stats.activeVendors}
                  />
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="xl">
          <Typography
            variant="h3"
            fontWeight="bold"
            textAlign="center"
            sx={{ mb: 2, fontSize: { xs: '1.8rem', md: '2.5rem' } }}
          >
            Everything You Need
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
          >
            All the tools to manage your construction project finances in one simple app
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                lg: 'repeat(4, 1fr)',
              },
              gap: 3,
              maxWidth: 1200,
              mx: 'auto',
            }}
          >
            {features.map((feature, index) => (
              <Card
                key={index}
                sx={{
                  height: 220,
                  border: 1,
                  borderColor: 'divider',
                  boxShadow: 'none',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ color: 'primary.main', mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Box
        sx={{
          py: { xs: 6, md: 8 },
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
          borderTop: 1,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            {benefits.map((benefit, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Stack alignItems="center" textAlign="center" spacing={1}>
                  <Box sx={{ color: 'text.primary', mb: 1 }}>{benefit.icon}</Box>
                  <Typography variant="h6" fontWeight="bold">
                    {benefit.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {benefit.description}
                  </Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="sm">
          <Stack alignItems="center" textAlign="center" spacing={3}>
            <Typography
              variant="h3"
              fontWeight="bold"
              sx={{ fontSize: { xs: '1.8rem', md: '2.5rem' } }}
            >
              Start Managing Your Construction Expenses
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Join thousands of homeowners who trust GharBanao for their construction management needs.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              sx={{ px: 6, py: 1.5, fontSize: '1.1rem' }}
            >
              Create Free Account
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          py: 3,
          borderTop: 1,
          borderColor: 'divider',
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} GharBanao. Made with care for Indian homeowners.
        </Typography>
      </Box>
    </Box>
  );
};

export default Landing;
