import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  Grid,
  MenuItem,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Add, Search } from '@mui/icons-material';
import toast from 'react-hot-toast';
import PaymentList from '../components/Payments/PaymentList';
import PaymentForm from '../components/Payments/PaymentForm';
import ConfirmDialog from '../components/Common/ConfirmDialog';
import { usePayments } from '../context/PaymentContext';
import { useVendors } from '../context/VendorContext';
import { useLanguage } from '../context/LanguageContext';

const Payments = () => {
  const { t } = useLanguage();
  const { payments, loading, fetchPayments, addPayment, deletePayment } = usePayments();
  const { vendors, fetchVendors } = useVendors();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [vendorFilter, setVendorFilter] = useState('');

  useEffect(() => {
    fetchPayments();
    fetchVendors();
  }, [fetchPayments, fetchVendors]);

  const handleAdd = () => {
    setFormOpen(true);
  };

  const handleDelete = (payment) => {
    setPaymentToDelete(payment);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (data) => {
    setSubmitting(true);
    try {
      await addPayment(data);
      toast.success(t('paymentAdded'));
      setFormOpen(false);
      fetchPayments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding payment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await deletePayment(paymentToDelete._id);
      toast.success(t('paymentDeleted'));
      setDeleteDialogOpen(false);
      setPaymentToDelete(null);
      fetchPayments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error deleting payment');
    } finally {
      setDeleting(false);
    }
  };

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.vendorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.vendorId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.reference?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesVendor = !vendorFilter || p.vendorId?._id === vendorFilter;

    return matchesSearch && matchesVendor;
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          {t('payments')}
        </Typography>
        {!isMobile && (
          <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
            {t('addPayment')}
          </Button>
        )}
      </Box>

      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            size="small"
            placeholder={t('search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            size="small"
            select
            label={t('vendors')}
            value={vendorFilter}
            onChange={(e) => setVendorFilter(e.target.value)}
          >
            <MenuItem value="">{t('all')}</MenuItem>
            {vendors.map((v) => (
              <MenuItem key={v._id} value={v._id}>
                {v.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <PaymentList payments={filteredPayments} onDelete={handleDelete} />
      )}

      <PaymentForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        loading={submitting}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title={t('delete') + ' Payment'}
        message="Are you sure you want to delete this payment?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
        loading={deleting}
      />

      {/* Fixed Bottom Button for Mobile */}
      {isMobile && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            p: 2,
            bgcolor: 'background.paper',
            borderTop: 1,
            borderColor: 'divider',
            zIndex: 1000,
          }}
        >
          <Button
            variant="contained"
            fullWidth
            size="large"
            startIcon={<Add />}
            onClick={handleAdd}
          >
            {t('addPayment')}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Payments;
