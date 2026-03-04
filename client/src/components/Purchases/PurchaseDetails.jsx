import { useRef, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
  IconButton,
  useMediaQuery,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
} from '@mui/material';
import { Close, Call, IosShare, Download } from '@mui/icons-material';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useLanguage } from '../../context/LanguageContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { paymentStatuses, units } from '../../utils/translations';
import ReceiptTemplate from './ReceiptTemplate';

const PurchaseDetails = ({ open, onClose, purchase }) => {
  const { t, language } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const receiptRef = useRef(null);
  const [generating, setGenerating] = useState(false);

  if (!purchase) return null;

  const statusInfo = paymentStatuses.find(s => s.value === purchase.paymentStatus);
  const pendingAmount = purchase.totalAmount - (purchase.amountPaid || 0);

  const getUnitLabel = (unitValue) => {
    const unit = units.find(u => u.value === unitValue);
    return unit ? (language === 'hi' ? unit.labelHi : unit.labelEn) : unitValue;
  };

  const vendorName = purchase.vendorId?.name || purchase.vendorName || 'Unknown';
  const vendorPhone = purchase.vendorId?.phone;

  const handleShareReceipt = async () => {
    const element = receiptRef.current;
    if (!element) return;

    setGenerating(true);
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = canvas.width / 2;
      const pdfHeight = canvas.height / 2;

      const pdf = new jsPDF({
        unit: 'px',
        format: [pdfWidth, pdfHeight],
        hotfixes: ['px_scaling'],
      });
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

      const pdfBlob = pdf.output('blob');
      const fileName = `receipt-${purchase.billNumber || purchase._id || Date.now()}.pdf`;
      const pdfFile = new File([pdfBlob], fileName, { type: 'application/pdf' });

      const canUseShare = navigator.share && navigator.canShare && navigator.canShare({ files: [pdfFile] });

      if (canUseShare) {
        await navigator.share({
          files: [pdfFile],
          title: language === 'hi' ? 'खरीद रसीद' : 'Purchase Receipt',
          text: `${language === 'hi' ? 'रसीद' : 'Receipt'} - ${vendorName}`,
        });
      } else {
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      if (err?.name !== 'AbortError') {
        console.error('Receipt generation failed:', err);
      }
    } finally {
      setGenerating(false);
    }
  };

  const canNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <>
      {/* Hidden receipt template rendered off-screen for PDF capture */}
      <Box
        sx={{
          position: 'fixed',
          left: '-9999px',
          top: 0,
          zIndex: -1,
          pointerEvents: 'none',
        }}
      >
        <ReceiptTemplate ref={receiptRef} purchase={purchase} language={language} />
      </Box>

      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{ sx: { borderRadius: isMobile ? 0 : 3 } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">{t('details')}</Typography>
          <IconButton onClick={onClose} edge="end">
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {/* Vendor & Date */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6" fontWeight="bold">
                  {vendorName}
                </Typography>
                {vendorPhone && (
                  <IconButton
                    size="small"
                    color="primary"
                    component="a"
                    href={`tel:${vendorPhone}`}
                  >
                    <Call fontSize="small" />
                  </IconButton>
                )}
              </Box>
              <Chip
                label={language === 'hi' ? statusInfo?.labelHi : statusInfo?.labelEn}
                color={statusInfo?.color || 'default'}
                size="small"
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              {formatDate(purchase.date, language)}
              {purchase.billNumber && ` • ${t('billNumber')}: ${purchase.billNumber}`}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Items Table */}
          <Typography variant="subtitle2" color="text.secondary" mb={1}>
            {t('items')} ({purchase.items?.length || 0})
          </Typography>

          <Box sx={{ overflowX: 'auto', mb: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>{t('itemName')}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>{t('category')}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>{t('qty')}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>{t('rate')}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>{t('amount')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {purchase.items?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.name || '-'}</TableCell>
                    <TableCell>{item.category || '-'}</TableCell>
                    <TableCell align="right">
                      {item.quantity} {getUnitLabel(item.unit)}
                    </TableCell>
                    <TableCell align="right">{formatCurrency(item.rate)}</TableCell>
                    <TableCell align="right">{formatCurrency(item.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>

          {/* Payment Summary */}
          <Box sx={{ bgcolor: 'action.hover', p: 2, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">{t('totalAmount')}</Typography>
              <Typography variant="body2" fontWeight="bold">
                {formatCurrency(purchase.totalAmount)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">{t('amountPaid')}</Typography>
              <Typography variant="body2" fontWeight="bold" color="success.main">
                {formatCurrency(purchase.amountPaid || 0)}
              </Typography>
            </Box>
            {pendingAmount > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">{t('pendingPayments')}</Typography>
                <Typography variant="body2" fontWeight="bold" color="error.main">
                  {formatCurrency(pendingAmount)}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Notes */}
          {purchase.notes && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
                {t('notes')}
              </Typography>
              <Typography variant="body2">{purchase.notes}</Typography>
            </>
          )}

          {/* Bill Photo */}
          {purchase.billPhoto && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" color="text.secondary" mb={1}>
                {t('billPhoto')}
              </Typography>
              <Box
                component="img"
                src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001'}${purchase.billPhoto}`}
                alt="Bill"
                sx={{
                  maxWidth: '100%',
                  maxHeight: 300,
                  borderRadius: 2,
                  objectFit: 'contain',
                }}
              />
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, gap: 1, flexWrap: 'wrap' }}>
          <Button onClick={onClose} variant="outlined" sx={{ flex: isMobile ? 1 : 'unset' }}>
            {t('cancel')}
          </Button>
          <Button
            onClick={handleShareReceipt}
            variant="contained"
            disabled={generating}
            startIcon={
              generating
                ? <CircularProgress size={16} color="inherit" />
                : canNativeShare
                  ? <IosShare />
                  : <Download />
            }
            sx={{ flex: isMobile ? 1 : 'unset' }}
          >
            {generating
              ? t('generatingPdf')
              : canNativeShare
                ? t('shareReceipt')
                : t('downloadReceipt')
            }
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PurchaseDetails;
