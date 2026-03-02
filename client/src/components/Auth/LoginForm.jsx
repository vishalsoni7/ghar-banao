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
import { Visibility, VisibilityOff, Phone, Lock, Home } from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const LoginForm = () => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    phone: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData.phone, formData.password);
      toast.success(t('loginSuccess'));
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
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
          maxWidth: 400,
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
          {t('login')}
        </Typography>

        <form onSubmit={handleSubmit}>
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

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : t('login')}
          </Button>

          <Typography textAlign="center" variant="body2">
            Don't have an account?{' '}
            <Link component={RouterLink} to="/register">
              {t('register')}
            </Link>
          </Typography>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginForm;
