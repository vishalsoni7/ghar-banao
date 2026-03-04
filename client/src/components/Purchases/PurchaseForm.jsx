import { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Typography,
  Box,
  CircularProgress,
  InputAdornment,
  Autocomplete,
  Chip,
  Stack,
  Collapse,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Add, Delete, PhotoCamera, Close, ExpandMore, ExpandLess, PersonAdd } from '@mui/icons-material';
import toast from 'react-hot-toast';
import { useLanguage } from '../../context/LanguageContext';
import { useVendors } from '../../context/VendorContext';
import { usePurchases } from '../../context/PurchaseContext';
import { formatCurrency, formatDateForInput } from '../../utils/formatters';
import { units } from '../../utils/translations';

const emptyItem = {
  name: '',
  category: '',
  quantity: '',
  unit: 'piece',
  rate: '',
  amount: 0,
};

const PurchaseForm = ({ open, onClose, onSubmit, purchase, loading }) => {
  const { t, language } = useLanguage();
  const { vendors, fetchVendors, addVendor } = useVendors();
  const { categories, fetchCategories } = usePurchases();
  const fileInputRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Quick add vendor state
  const [showAddVendor, setShowAddVendor] = useState(false);
  const [newVendor, setNewVendor] = useState({ name: '', phone: '', category: '' });
  const [addingVendor, setAddingVendor] = useState(false);

  const [formData, setFormData] = useState({
    vendorId: '',
    vendorName: '',
    date: formatDateForInput(new Date()),
    items: [{ ...emptyItem }],
    billNumber: '',
    paymentStatus: 'pending',
    amountPaid: '',
    notes: '',
    billPhoto: null,
  });
  const [billPhotoPreview, setBillPhotoPreview] = useState(null);
  const [showOptional, setShowOptional] = useState(false);

  useEffect(() => {
    if (open) {
      fetchVendors();
      // Auto-sync categories to get any new default categories
      fetchCategories(true);
    }
  }, [open, fetchVendors, fetchCategories]);

  useEffect(() => {
    if (purchase) {
      setFormData({
        vendorId: purchase.vendorId?._id || '',
        vendorName: purchase.vendorName || '',
        date: formatDateForInput(purchase.date),
        items: purchase.items?.length > 0 ? purchase.items : [{ ...emptyItem }],
        billNumber: purchase.billNumber || '',
        paymentStatus: purchase.paymentStatus || 'pending',
        amountPaid: purchase.amountPaid || '',
        notes: purchase.notes || '',
        billPhoto: null,
      });
      if (purchase.billPhoto) {
        const apiBase = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001';
        setBillPhotoPreview(`${apiBase}${purchase.billPhoto}`);
      }
      // Show optional fields if they have data
      if (purchase.billNumber || purchase.notes || purchase.billPhoto) {
        setShowOptional(true);
      }
    } else {
      setFormData({
        vendorId: '',
        vendorName: '',
        date: formatDateForInput(new Date()),
        items: [{ ...emptyItem }],
        billNumber: '',
        paymentStatus: 'pending',
        amountPaid: '',
        notes: '',
        billPhoto: null,
      });
      setBillPhotoPreview(null);
      setShowOptional(false);
    }
  }, [purchase, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleVendorChange = (event, newValue) => {
    if (typeof newValue === 'string') {
      // User typed a new vendor name
      setFormData({ ...formData, vendorId: '', vendorName: newValue });
    } else if (newValue && newValue._id) {
      // User selected existing vendor
      setFormData({ ...formData, vendorId: newValue._id, vendorName: newValue.name });
    } else {
      setFormData({ ...formData, vendorId: '', vendorName: '' });
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;

    // Auto-calculate amount
    if (field === 'quantity' || field === 'rate') {
      const qty = parseFloat(newItems[index].quantity) || 0;
      const rate = parseFloat(newItems[index].rate) || 0;
      newItems[index].amount = qty * rate;
    }

    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { ...emptyItem }],
    });
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData({ ...formData, items: newItems });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, billPhoto: file });
      setBillPhotoPreview(URL.createObjectURL(file));
    }
  };

  const clearPhoto = () => {
    setFormData({ ...formData, billPhoto: null });
    setBillPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Quick add vendor handler
  const handleQuickAddVendor = async () => {
    if (!newVendor.name.trim()) {
      toast.error(t('vendorName') + ' ' + t('required') || 'Vendor name is required');
      return;
    }

    setAddingVendor(true);
    try {
      const createdVendor = await addVendor(newVendor);
      if (createdVendor) {
        // Select the newly created vendor
        setFormData({ ...formData, vendorId: createdVendor._id, vendorName: createdVendor.name });
        toast.success(t('vendorAdded'));
        setShowAddVendor(false);
        setNewVendor({ name: '', phone: '', category: '' });
        // Refresh vendors list
        fetchVendors();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add vendor');
    } finally {
      setAddingVendor(false);
    }
  };

  const totalAmount = formData.items.reduce((sum, item) => sum + (item.amount || 0), 0);

  // Validation
  const hasVendor = formData.vendorId || formData.vendorName?.trim();
  const hasValidItems = formData.items.some(item =>
    item.category && parseFloat(item.quantity) > 0 && parseFloat(item.rate) >= 0
  );
  const isFormValid = hasVendor && hasValidItems && formData.date;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isFormValid) return;

    // Get vendor name if vendorId selected
    let vendorName = formData.vendorName;
    if (formData.vendorId) {
      const selectedVendor = vendors.find(v => v._id === formData.vendorId);
      vendorName = selectedVendor?.name || '';
    }

    onSubmit({
      ...formData,
      vendorName,
      totalAmount,
      items: formData.items.filter(item => item.category),
    });
  };

  const selectedVendor = vendors.find(v => v._id === formData.vendorId) ||
    (formData.vendorName ? { name: formData.vendorName } : null);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{ sx: { borderRadius: isMobile ? 0 : 3 } }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {purchase ? t('editPurchase') : t('addPurchase')}
          {isMobile && (
            <IconButton onClick={onClose} edge="end">
              <Close />
            </IconButton>
          )}
        </DialogTitle>

        <DialogContent sx={{ pt: 2, px: isMobile ? 2 : 3 }}>
          <Stack spacing={3}>
            {/* Vendor Selection with Quick Add */}
            <Box>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'stretch' }}>
                <Autocomplete
                  freeSolo
                  options={vendors}
                  getOptionLabel={(option) =>
                    typeof option === 'string' ? option : option.name
                  }
                  value={selectedVendor}
                  onChange={handleVendorChange}
                  onInputChange={(event, newInputValue, reason) => {
                    if (reason === 'input') {
                      setFormData({ ...formData, vendorId: '', vendorName: newInputValue });
                    }
                  }}
                  sx={{ flex: 1 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t('vendors') + ' *'}
                      placeholder={t('selectVendor')}
                      required
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props} key={option._id}>
                      <Box>
                        <Typography>{option.name}</Typography>
                        {option.phone && (
                          <Typography variant="caption" color="text.secondary">
                            {option.phone}
                          </Typography>
                        )}
                      </Box>
                    </li>
                  )}
                />
                <Button
                  variant={showAddVendor ? 'contained' : 'outlined'}
                  onClick={() => setShowAddVendor(!showAddVendor)}
                  sx={{ minWidth: 56, px: 1 }}
                  title={t('addVendor')}
                >
                  <PersonAdd />
                </Button>
              </Box>

              {/* Quick Add Vendor Form */}
              <Collapse in={showAddVendor}>
                <Box sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                  <Typography variant="subtitle2" mb={2}>{t('addVendor')}</Typography>
                  <Stack spacing={2}>
                    <TextField
                      size="small"
                      label={t('vendorName') + ' *'}
                      value={newVendor.name}
                      onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                      fullWidth
                    />
                    <TextField
                      size="small"
                      label={t('phone')}
                      value={newVendor.phone}
                      onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })}
                      fullWidth
                      inputProps={{ maxLength: 10 }}
                    />
                    <TextField
                      size="small"
                      select
                      label={t('category') + ' *'}
                      value={newVendor.category}
                      onChange={(e) => setNewVendor({ ...newVendor, category: e.target.value })}
                      SelectProps={{ native: true }}
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                    >
                      <option value="">{t('selectOption')}</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat.name}>
                          {language === 'hi' ? cat.nameHi || cat.name : cat.name}
                        </option>
                      ))}
                    </TextField>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      <Button
                        size="small"
                        onClick={() => {
                          setShowAddVendor(false);
                          setNewVendor({ name: '', phone: '', category: '' });
                        }}
                      >
                        {t('cancel')}
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={handleQuickAddVendor}
                        disabled={addingVendor || !newVendor.name.trim() || !newVendor.category}
                        startIcon={addingVendor ? <CircularProgress size={16} /> : <Add />}
                      >
                        {t('add')}
                      </Button>
                    </Box>
                  </Stack>
                </Box>
              </Collapse>
            </Box>

            {/* Date and Payment Status */}
            <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2 }}>
              <TextField
                type="date"
                label={t('purchaseDate')}
                name="date"
                value={formData.date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
                fullWidth={isMobile}
                sx={{ flex: isMobile ? undefined : 1 }}
              />
              <TextField
                select
                label={t('paymentStatus')}
                name="paymentStatus"
                value={formData.paymentStatus}
                onChange={handleChange}
                SelectProps={{ native: true }}
                InputLabelProps={{ shrink: true }}
                fullWidth={isMobile}
                sx={{ flex: isMobile ? undefined : 1 }}
              >
                <option value="pending">{t('pending')}</option>
                <option value="partial">{t('partial')}</option>
                <option value="paid">{t('paid')}</option>
              </TextField>
            </Box>

            {/* Amount Paid - Show only for partial/paid */}
            {formData.paymentStatus !== 'pending' && (
              <TextField
                type="number"
                label={t('amountPaid')}
                name="amountPaid"
                value={formData.amountPaid}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
                fullWidth
              />
            )}

            {/* Items Section */}
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {t('addItems')}
                </Typography>
                <Button size="small" startIcon={<Add />} onClick={addItem}>
                  {t('add')}
                </Button>
              </Box>

              <Stack spacing={2}>
                {formData.items.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 2,
                      bgcolor: 'action.hover',
                      borderRadius: 2,
                    }}
                  >
                    <Stack spacing={2}>
                      {/* Item Name with Delete Button */}
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                        <TextField
                          label={t('itemName')}
                          placeholder={t('enterItemName')}
                          value={item.name}
                          onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                          fullWidth
                          size={isMobile ? 'medium' : 'small'}
                        />
                        {formData.items.length > 1 && (
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => removeItem(index)}
                            sx={{ mt: isMobile ? 1 : 0.5 }}
                          >
                            <Delete />
                          </IconButton>
                        )}
                      </Box>

                      {/* Category */}
                      <TextField
                        select
                        label={t('category') + ' *'}
                        value={item.category}
                        onChange={(e) => handleItemChange(index, 'category', e.target.value)}
                        SelectProps={{ native: true }}
                        InputLabelProps={{ shrink: true }}
                        required
                        fullWidth
                        size={isMobile ? 'medium' : 'small'}
                      >
                        <option value="">{t('selectOption')}</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat.name}>
                            {language === 'hi' ? cat.nameHi || cat.name : cat.name}
                          </option>
                        ))}
                      </TextField>

                      {/* Quantity and Unit */}
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                          type="number"
                          label={t('quantity') + ' *'}
                          placeholder={t('qty')}
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                          required
                          sx={{ flex: 1 }}
                          inputProps={{ min: 0 }}
                          size={isMobile ? 'medium' : 'small'}
                        />
                        <TextField
                          select
                          label={t('unit')}
                          value={item.unit}
                          onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                          SelectProps={{ native: true }}
                          InputLabelProps={{ shrink: true }}
                          sx={{ flex: 1 }}
                          size={isMobile ? 'medium' : 'small'}
                        >
                          {units.map((u) => (
                            <option key={u.value} value={u.value}>
                              {language === 'hi' ? u.labelHi : u.labelEn}
                            </option>
                          ))}
                        </TextField>
                      </Box>

                      {/* Rate and Amount */}
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <TextField
                          type="number"
                          label={t('rateWithSymbol') + ' *'}
                          placeholder={t('pricePerUnit')}
                          value={item.rate}
                          onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                          required
                          sx={{ flex: 1 }}
                          InputProps={{
                            startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                          }}
                          inputProps={{ min: 0 }}
                          size={isMobile ? 'medium' : 'small'}
                        />
                        <Box sx={{ flex: 1, textAlign: 'right' }}>
                          <Typography variant="caption" color="text.secondary">
                            {t('amount')}
                          </Typography>
                          <Typography variant="h6" fontWeight="bold">
                            {formatCurrency(item.amount)}
                          </Typography>
                        </Box>
                      </Box>
                    </Stack>
                  </Box>
                ))}
              </Stack>

              {/* Total */}
              <Box sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                mt: 2,
                pt: 1.5,
                borderTop: 1,
                borderColor: 'divider'
              }}>
                <Typography variant="h6">
                  {t('totalAmount')}: <strong>{formatCurrency(totalAmount)}</strong>
                </Typography>
              </Box>
            </Box>

            {/* Optional Fields Toggle */}
            <Button
              size="small"
              onClick={() => setShowOptional(!showOptional)}
              endIcon={showOptional ? <ExpandLess /> : <ExpandMore />}
              sx={{ alignSelf: 'flex-start', textTransform: 'none' }}
              color="inherit"
            >
              {showOptional ? t('hideOptionalFields') : t('showOptionalFields')}
            </Button>

            <Collapse in={showOptional}>
              <Stack spacing={2}>
                {/* Bill Number */}
                <TextField
                  size="small"
                  label={t('billNumber')}
                  name="billNumber"
                  value={formData.billNumber}
                  onChange={handleChange}
                  placeholder="Invoice/Bill number"
                />

                {/* Bill Photo */}
                <Box>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  {billPhotoPreview ? (
                    <Box sx={{ position: 'relative', display: 'inline-block' }}>
                      <img
                        src={billPhotoPreview}
                        alt="Bill"
                        style={{
                          maxWidth: 150,
                          maxHeight: 150,
                          borderRadius: 8,
                          objectFit: 'cover'
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={clearPhoto}
                        sx={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          bgcolor: 'error.main',
                          color: 'white',
                          '&:hover': { bgcolor: 'error.dark' },
                          width: 24,
                          height: 24,
                        }}
                      >
                        <Close sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
                  ) : (
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<PhotoCamera />}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {t('billPhoto')}
                    </Button>
                  )}
                </Box>

                {/* Notes */}
                <TextField
                  size="small"
                  label={t('notes')}
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  multiline
                  rows={2}
                  placeholder="Any additional notes..."
                />
              </Stack>
            </Collapse>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: isMobile ? 2 : 3, pb: 2, pt: 1, flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 1 : 0 }}>
          {!isMobile && (
            <Button onClick={onClose} color="inherit" disabled={loading}>
              {t('cancel')}
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !isFormValid}
            fullWidth={isMobile}
            size={isMobile ? 'large' : 'medium'}
            sx={{ minWidth: isMobile ? undefined : 100 }}
          >
            {loading ? <CircularProgress size={22} /> : t('save')}
          </Button>
          {isMobile && (
            <Button onClick={onClose} color="inherit" disabled={loading} fullWidth>
              {t('cancel')}
            </Button>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PurchaseForm;
