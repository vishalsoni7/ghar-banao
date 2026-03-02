import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  CircularProgress,
  Link,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Phone,
  Lock,
  Person,
  Email,
  Home,
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink, Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Register = () => {
  const { register, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    projectName: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await register({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        projectName: formData.projectName,
      });
      toast.success(t('registerSuccess'));
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 450,
          width: '100%',
          borderRadius: 3,
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Home color="primary" sx={{ fontSize: 48, mb: 1 }} />
          <Typography variant="h4" fontWeight="bold" color="primary">
            {t('appName')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('tagline')}
          </Typography>
        </Box>

        <Typography variant="h5" textAlign="center" mb={3}>
          {t('register')}
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label={t('name')}
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person color="action" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label={t('phone')}
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Phone color="action" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label={t('email')}
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="action" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label={t('projectName')}
            name="projectName"
            value={formData.projectName}
            onChange={handleChange}
            margin="normal"
            placeholder="e.g., My House Construction"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Home color="action" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label={t('password')}
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label={t('confirmPassword')}
            name="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleChange}
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="action" />
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : t('register')}
          </Button>

          <Typography textAlign="center" variant="body2">
            Already have an account?{' '}
            <Link component={RouterLink} to="/login">
              {t('login')}
            </Link>
          </Typography>
        </form>
      </Paper>
    </Box>
  );
};

export default Register;
