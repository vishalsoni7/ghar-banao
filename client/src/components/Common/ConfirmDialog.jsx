import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
} from '@mui/material';
import { useLanguage } from '../../context/LanguageContext';

const ConfirmDialog = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
  confirmColor = 'error',
  loading = false,
}) => {
  const { t } = useLanguage();

  return (
    <Dialog open={open} onClose={loading ? undefined : onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>{title || t('confirmDelete')}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {message || t('confirmDelete')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={loading}>
          {cancelText || t('cancel')}
        </Button>
        <Button onClick={onConfirm} color={confirmColor} variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={20} color="inherit" /> : (confirmText || t('delete'))}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
