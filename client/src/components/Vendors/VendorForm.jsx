import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { useLanguage } from '../../context/LanguageContext';
import { usePurchases } from '../../context/PurchaseContext';

const VendorForm = ({ open, onClose, onSubmit, vendor, loading }) => {
  const { t, language } = useLanguage();
  const { categories, fetchCategories } = usePurchases();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    category: '',
    notes: '',
  });
  const [touched, setTouched] = useState({
    name: false,
    category: false,
  });

  useEffect(() => {
    if (open) {
      // Sync categories when form opens
      fetchCategories(true);
    }
  }, [open, fetchCategories]);

  useEffect(() => {
    if (vendor) {
      setFormData({
        name: vendor.name || '',
        phone: vendor.phone || '',
        address: vendor.address || '',
        category: vendor.category || '',
        notes: vendor.notes || '',
      });
    } else {
      setFormData({
        name: '',
        phone: '',
        address: '',
        category: '',
        notes: '',
      });
    }
    // Reset touched state when form opens/closes
    setTouched({ name: false, category: false });
  }, [vendor, open]);

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {vendor ? t('editVendor') : t('addVendor')}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={12}>
              <TextField
                fullWidth
                label={t('vendorName')}
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={() => handleBlur('name')}
                required
                error={touched.name && !formData.name}
                helperText={touched.name && !formData.name ? 'Vendor name is required' : ''}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label={t('vendorPhone')}
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                select
                label={t('vendorCategory')}
                name="category"
                value={formData.category}
                onChange={handleChange}
                onBlur={() => handleBlur('category')}
                required
                error={touched.category && !formData.category}
                helperText={touched.category && !formData.category ? 'Category is required' : ''}
              >
                <MenuItem value="" disabled>
                  -- Select Category --
                </MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat._id} value={cat.name}>
                    {language === 'hi' ? cat.nameHi || cat.name : cat.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label={t('vendorAddress')}
                name="address"
                value={formData.address}
                onChange={handleChange}
                multiline
                rows={2}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label={t('notes')}
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{t('cancel')}</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !formData.name || !formData.category}
          >
            {loading ? <CircularProgress size={24} /> : t('save')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default VendorForm;
