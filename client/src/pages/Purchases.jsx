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
  Chip,
} from '@mui/material';
import { Add, Search, FilterList, Clear } from '@mui/icons-material';
import toast from 'react-hot-toast';
import PurchaseList from '../components/Purchases/PurchaseList';
import PurchaseForm from '../components/Purchases/PurchaseForm';
import ConfirmDialog from '../components/Common/ConfirmDialog';
import { usePurchases } from '../context/PurchaseContext';
import { useVendors } from '../context/VendorContext';
import { useLanguage } from '../context/LanguageContext';

const Purchases = () => {
  const { t } = useLanguage();
  const { purchases, loading, fetchPurchases, addPurchase, updatePurchase, deletePurchase } = usePurchases();
  const { vendors, fetchVendors } = useVendors();

  const [formOpen, setFormOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [purchaseToDelete, setPurchaseToDelete] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [vendorFilter, setVendorFilter] = useState('');

  useEffect(() => {
    fetchPurchases();
    fetchVendors();
  }, [fetchPurchases, fetchVendors]);

  const handleAdd = () => {
    setSelectedPurchase(null);
    setFormOpen(true);
  };

  const handleEdit = (purchase) => {
    setSelectedPurchase(purchase);
    setFormOpen(true);
  };

  const handleView = (purchase) => {
    handleEdit(purchase);
  };

  const handleDelete = (purchase) => {
    setPurchaseToDelete(purchase);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (selectedPurchase) {
        await updatePurchase(selectedPurchase._id, data);
        toast.success(t('purchaseUpdated'));
      } else {
        await addPurchase(data);
        toast.success(t('purchaseAdded'));
      }
      setFormOpen(false);
      fetchPurchases();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving purchase');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await deletePurchase(purchaseToDelete._id);
      toast.success(t('purchaseDeleted'));
      setDeleteDialogOpen(false);
      setPurchaseToDelete(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error deleting purchase');
    } finally {
      setDeleting(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setVendorFilter('');
  };

  const filteredPurchases = purchases.filter((p) => {
    const matchesSearch =
      p.vendorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.vendorId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.items?.some(item => item.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      p.billNumber?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !statusFilter || p.paymentStatus === statusFilter;
    const matchesVendor = !vendorFilter || p.vendorId?._id === vendorFilter;

    return matchesSearch && matchesStatus && matchesVendor;
  });

  const hasFilters = searchTerm || statusFilter || vendorFilter;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          {t('purchases')}
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
          {t('addPurchase')}
        </Button>
      </Box>

      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
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
        <Grid size={{ xs: 6, sm: 3 }}>
          <TextField
            fullWidth
            size="small"
            select
            label={t('paymentStatus')}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="">{t('all')}</MenuItem>
            <MenuItem value="paid">{t('paid')}</MenuItem>
            <MenuItem value="partial">{t('partial')}</MenuItem>
            <MenuItem value="pending">{t('pending')}</MenuItem>
          </TextField>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
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
        {hasFilters && (
          <Grid size={{ xs: 12, sm: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Clear />}
              onClick={clearFilters}
              sx={{ height: 40 }}
            >
              Clear
            </Button>
          </Grid>
        )}
      </Grid>

      {/* Results Count */}
      {hasFilters && (
        <Box sx={{ mb: 2 }}>
          <Chip
            label={`${filteredPurchases.length} results`}
            size="small"
            color="primary"
            variant="outlined"
          />
        </Box>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <PurchaseList
          purchases={filteredPurchases}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />
      )}

      <PurchaseForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        purchase={selectedPurchase}
        loading={submitting}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title={t('delete') + ' Purchase'}
        message="Are you sure you want to delete this purchase?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
        loading={deleting}
      />
    </Box>
  );
};

export default Purchases;
