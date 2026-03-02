import { useState } from 'react';
import {
  Typography,
  Box,
  IconButton,
  Chip,
  Tooltip,
  Collapse,
  Stack,
} from '@mui/material';
import {
  Edit,
  Delete,
  Phone,
  Place,
  ShoppingCart,
  ExpandMore,
  CurrencyRupee,
} from '@mui/icons-material';
import { useLanguage } from '../../context/LanguageContext';
import { formatCurrency } from '../../utils/formatters';

const VendorItem = ({ vendor, onEdit, onDelete, expanded, onToggle, isLast }) => {
  const { t } = useLanguage();

  return (
    <Box
      sx={{
        borderBottom: isLast ? 'none' : 1,
        borderColor: 'divider',
      }}
    >
      {/* Collapsed Header - Always visible */}
      <Box
        onClick={onToggle}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          py: 2,
          px: 1,
          cursor: 'pointer',
          '&:hover': { bgcolor: 'action.hover' },
        }}
      >
        {/* Expand Icon */}
        <IconButton
          size="small"
          sx={{
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
          }}
        >
          <ExpandMore fontSize="small" />
        </IconButton>

        {/* Name & Category */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle1" fontWeight="600" noWrap>
            {vendor.name}
          </Typography>
          {vendor.category && (
            <Chip
              label={vendor.category}
              size="small"
              sx={{ height: 20, fontSize: '0.7rem', mt: 0.5 }}
            />
          )}
        </Box>

        {/* Quick Stats - Total Amount */}
        <Box sx={{ textAlign: 'right', mr: 1 }}>
          <Typography variant="body2" fontWeight="bold">
            {formatCurrency(vendor.totalAmount || 0)}
          </Typography>
          {vendor.pendingAmount > 0 && (
            <Typography variant="caption" color="error.main">
              {formatCurrency(vendor.pendingAmount)} pending
            </Typography>
          )}
        </Box>

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title={t('edit')}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(vendor);
              }}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('delete')}>
            <IconButton
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(vendor);
              }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Expanded Details */}
      <Collapse in={expanded}>
        <Box
          sx={{
            px: 2,
            pb: 2,
            pt: 1,
            bgcolor: 'action.hover',
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          <Stack spacing={1.5}>
            {/* Contact Info Row */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {vendor.phone && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Phone fontSize="small" color="action" />
                  <Typography variant="body2">{vendor.phone}</Typography>
                </Box>
              )}
              {vendor.address && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Place fontSize="small" color="action" />
                  <Typography variant="body2">{vendor.address}</Typography>
                </Box>
              )}
            </Box>

            {/* Stats Row */}
            <Box
              sx={{
                display: 'flex',
                gap: 3,
                pt: 1.5,
                borderTop: 1,
                borderColor: 'divider',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ShoppingCart fontSize="small" color="action" />
                <Typography variant="body2">
                  <strong>{vendor.purchaseCount || 0}</strong> purchases
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CurrencyRupee fontSize="small" color="action" />
                <Typography variant="body2">
                  Total: <strong>{formatCurrency(vendor.totalAmount || 0)}</strong>
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography
                  variant="body2"
                  color={vendor.pendingAmount > 0 ? 'error.main' : 'success.main'}
                >
                  Pending: <strong>{formatCurrency(vendor.pendingAmount || 0)}</strong>
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Box>
      </Collapse>
    </Box>
  );
};

const VendorList = ({ vendors, onEdit, onDelete, onView }) => {
  const { t } = useLanguage();
  const [expandedId, setExpandedId] = useState(null);

  const handleToggle = (vendorId) => {
    setExpandedId(expandedId === vendorId ? null : vendorId);
  };

  if (vendors.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 5 }}>
        <Typography color="text.secondary">{t('noVendors')}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ borderTop: 1, borderColor: 'divider' }}>
      {vendors.map((vendor, index) => (
        <VendorItem
          key={vendor._id}
          vendor={vendor}
          onEdit={onEdit}
          onDelete={onDelete}
          expanded={expandedId === vendor._id}
          onToggle={() => handleToggle(vendor._id)}
          isLast={index === vendors.length - 1}
        />
      ))}
    </Box>
  );
};

export default VendorList;
