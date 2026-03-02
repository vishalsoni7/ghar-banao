import { format, formatDistanceToNow } from 'date-fns';
import { hi, enIN } from 'date-fns/locale';

export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return new Intl.NumberFormat('en-IN').format(num);
};

export const formatDate = (date, lang = 'en') => {
  if (!date) return '';
  const d = new Date(date);
  return format(d, 'dd MMM yyyy', { locale: lang === 'hi' ? hi : enIN });
};

export const formatDateTime = (date, lang = 'en') => {
  if (!date) return '';
  const d = new Date(date);
  return format(d, 'dd MMM yyyy, hh:mm a', { locale: lang === 'hi' ? hi : enIN });
};

export const formatRelativeTime = (date, lang = 'en') => {
  if (!date) return '';
  const d = new Date(date);
  return formatDistanceToNow(d, {
    addSuffix: true,
    locale: lang === 'hi' ? hi : enIN
  });
};

export const formatDateForInput = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return format(d, 'yyyy-MM-dd');
};
