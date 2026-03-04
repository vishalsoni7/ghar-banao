import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Add, Search } from '@mui/icons-material';
import toast from 'react-hot-toast';
import VendorList from '../components/Vendors/VendorList';
import VendorForm from '../components/Vendors/VendorForm';
import ConfirmDialog from '../components/Common/ConfirmDialog';
import { useVendors } from '../context/VendorContext';
import { useLanguage } from '../context/LanguageContext';

const Vendors = () => {
  const { t } = useLanguage();
  const { vendors, loading, fetchVendors, addVendor, updateVendor, deleteVendor } = useVendors();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [formOpen, setFormOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  const handleAdd = () => {
    setSelectedVendor(null);
    setFormOpen(true);
  };

  const handleEdit = (vendor) => {
    setSelectedVendor(vendor);
    setFormOpen(true);
  };

  const handleView = (vendor) => {
    // For now, just edit. Can add detailed view later.
    handleEdit(vendor);
  };

  const handleDelete = (vendor) => {
    setVendorToDelete(vendor);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (selectedVendor) {
        await updateVendor(selectedVendor._id, data);
        toast.success(t('vendorUpdated'));
      } else {
        await addVendor(data);
        toast.success(t('vendorAdded'));
      }
      setFormOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving vendor');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteVendor(vendorToDelete._id);
      toast.success(t('vendorDeleted'));
      setDeleteDialogOpen(false);
      setVendorToDelete(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error deleting vendor');
    } finally {
      setDeleting(false);
    }
  };

  const filteredVendors = vendors.filter(
    (v) =>
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.phone?.includes(searchTerm) ||
      v.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          {t('vendors')}
        </Typography>
        {!isMobile && (
          <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
            {t('addVendor')}
          </Button>
        )}
      </Box>

      <TextField
        fullWidth
        placeholder={t('search')}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <VendorList
          vendors={filteredVendors}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />
      )}

      <VendorForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        vendor={selectedVendor}
        loading={submitting}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title={t('delete') + ' ' + t('vendors').slice(0, -1)}
        message={`Are you sure you want to delete "${vendorToDelete?.name}"?`}
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
            {t('addVendor')}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Vendors;
