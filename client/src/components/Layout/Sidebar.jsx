import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import {
  Dashboard,
  Store,
  ShoppingCart,
  Payment,
  Assessment,
  Category,
  Home,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const Sidebar = ({ mobileOpen, onClose, drawerWidth }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const menuItems = [
    { path: '/dashboard', icon: <Dashboard />, label: t('dashboard') },
    { path: '/vendors', icon: <Store />, label: t('vendors') },
    { path: '/purchases', icon: <ShoppingCart />, label: t('purchases') },
    { path: '/payments', icon: <Payment />, label: t('payments') },
    { path: '/categories', icon: <Category />, label: t('categories') },
    { path: '/reports', icon: <Assessment />, label: t('reports') },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  const drawerContent = (
    <Box>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.5, minHeight: 64 }}>
        <Home color="primary" sx={{ fontSize: 32, flexShrink: 0 }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', overflow: 'hidden' }}>
          <Typography variant="h6" color="primary" fontWeight="bold" noWrap sx={{ lineHeight: 1.2 }}>
            {t('appName')}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap sx={{ lineHeight: 1.3 }}>
            {t('tagline')}
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
              sx={{
                mx: 1,
                my: 0.5,
                borderRadius: 2,
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'primary.contrastText',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
