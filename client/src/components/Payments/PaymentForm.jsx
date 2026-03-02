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
  InputAdornment,
} from '@mui/material';
import { useLanguage } from '../../context/LanguageContext';
import { useVendors } from '../../context/VendorContext';
import { formatDateForInput } from '../../utils/formatters';
import { paymentModes } from '../../utils/translations';

const PaymentForm = ({ open, onClose, onSubmit, loading, preselectedVendor, preselectedPurchase }) => {
  const { t, language } = useLanguage();
  const { vendors, fetchVendors } = useVendors();

  const [formData, setFormData] = useState({
    vendorId: '',
    purchaseId: '',
    amount: '',
    date: formatDateForInput(new Date()),
    paymentMode: 'cash',
    reference: '',
    notes: '',
  });

  useEffect(() => {
    if (open) {
      fetchVendors();
    }
  }, [open, fetchVendors]);

  useEffect(() => {
    if (preselectedVendor) {
      setFormData(prev => ({ ...prev, vendorId: preselectedVendor._id }));
    }
    if (preselectedPurchase) {
      setFormData(prev => ({
        ...prev,
        purchaseId: preselectedPurchase._id,
        vendorId: preselectedPurchase.vendorId?._id || '',
      }));
    }
  }, [preselectedVendor, preselectedPurchase]);

  useEffect(() => {
    if (!open) {
      setFormData({
        vendorId: '',
        purchaseId: '',
        amount: '',
        date: formatDateForInput(new Date()),
        paymentMode: 'cash',
        reference: '',
        notes: '',
      });
    }
  }, [open]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validation
  const isFormValid = formData.vendorId &&
    formData.amount &&
    parseFloat(formData.amount) > 0 &&
    formData.date;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isFormValid) return;

    // Get vendor name
    const selectedVendor = vendors.find(v => v._id === formData.vendorId);

    onSubmit({
      ...formData,
      vendorName: selectedVendor?.name || '',
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{t('addPayment')}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={12}>
              <TextField
                fullWidth
                select
                label={t('selectVendor')}
                name="vendorId"
                value={formData.vendorId}
                onChange={handleChange}
                required
              >
                {vendors.map((vendor) => (
                  <MenuItem key={vendor._id} value={vendor._id}>
                    {vendor.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type="number"
                label={t('paymentAmount')}
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type="date"
                label={t('paymentDate')}
                name="date"
                value={formData.date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                select
                label={t('paymentMode')}
                name="paymentMode"
                value={formData.paymentMode}
                onChange={handleChange}
              >
                {paymentModes.map((mode) => (
                  <MenuItem key={mode.value} value={mode.value}>
                    {language === 'hi' ? mode.labelHi : mode.labelEn}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label={t('reference')}
                name="reference"
                value={formData.reference}
                onChange={handleChange}
                placeholder="UPI Ref / Cheque No."
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
          <Button onClick={onClose} disabled={loading}>{t('cancel')}</Button>
          <Button type="submit" variant="contained" disabled={loading || !isFormValid}>
            {loading ? <CircularProgress size={24} /> : t('save')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PaymentForm;
