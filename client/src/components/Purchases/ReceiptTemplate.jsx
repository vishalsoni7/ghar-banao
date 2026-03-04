import { forwardRef } from 'react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { paymentStatuses, units } from '../../utils/translations';

const statusColors = {
  paid: { bg: '#e8f5e9', text: '#2e7d32', border: '#a5d6a7' },
  partial: { bg: '#fff8e1', text: '#e65100', border: '#ffcc02' },
  pending: { bg: '#ffebee', text: '#c62828', border: '#ef9a9a' },
};

const ReceiptTemplate = forwardRef(({ purchase, language }, ref) => {
  if (!purchase) return null;

  const statusInfo = paymentStatuses.find(s => s.value === purchase.paymentStatus);
  const statusLabel = language === 'hi' ? statusInfo?.labelHi : statusInfo?.labelEn;
  const colors = statusColors[purchase.paymentStatus] || statusColors.pending;
  const pendingAmount = purchase.totalAmount - (purchase.amountPaid || 0);
  const vendorName = purchase.vendorId?.name || purchase.vendorName || 'Unknown';

  const getUnitLabel = (unitValue) => {
    const unit = units.find(u => u.value === unitValue);
    return unit ? (language === 'hi' ? unit.labelHi : unit.labelEn) : unitValue;
  };

  const billPhotoUrl = purchase.billPhoto
    ? `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001'}${purchase.billPhoto}`
    : null;

  const isHindi = language === 'hi';

  return (
    <div
      ref={ref}
      style={{
        width: '600px',
        backgroundColor: '#ffffff',
        fontFamily: "'Segoe UI', Arial, sans-serif",
        fontSize: '14px',
        color: '#1a1a1a',
        padding: '0',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)',
          padding: '28px 32px 24px',
          color: '#ffffff',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '26px', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '4px' }}>
              {isHindi ? 'घरबनाओ' : 'GharBanao'}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.85, letterSpacing: '0.3px' }}>
              {isHindi ? 'निर्माण सामग्री और खर्च ट्रैकर' : 'Construction Material & Expense Tracker'}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>
              {isHindi ? 'खरीद रसीद' : 'Purchase Receipt'}
            </div>
            {purchase.billNumber && (
              <div style={{ fontSize: '12px', opacity: 0.85 }}>
                {isHindi ? 'बिल नं.' : 'Bill No.'} {purchase.billNumber}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '28px 32px' }}>

        {/* Vendor + Status + Date row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '24px',
          }}
        >
          <div>
            <div style={{ fontSize: '11px', color: '#757575', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '4px' }}>
              {isHindi ? 'विक्रेता' : 'Vendor'}
            </div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#0d47a1' }}>
              {vendorName}
            </div>
            <div style={{ fontSize: '12px', color: '#616161', marginTop: '4px' }}>
              {formatDate(purchase.date, language)}
            </div>
          </div>
          <div
            style={{
              backgroundColor: colors.bg,
              color: colors.text,
              border: `1px solid ${colors.border}`,
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: '700',
              letterSpacing: '0.3px',
            }}
          >
            {statusLabel}
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid #e0e0e0', marginBottom: '20px' }} />

        {/* Items Table */}
        <div style={{ marginBottom: '4px', fontSize: '11px', color: '#757575', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
          {isHindi ? 'सामान' : 'Items'} ({purchase.items?.length || 0})
        </div>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginBottom: '20px',
            fontSize: '13px',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#f5f7fa' }}>
              {[
                isHindi ? 'नाम' : 'Item',
                isHindi ? 'श्रेणी' : 'Category',
                isHindi ? 'मात्रा' : 'Qty',
                isHindi ? 'दर' : 'Rate',
                isHindi ? 'राशि' : 'Amount',
              ].map((heading, i) => (
                <th
                  key={i}
                  style={{
                    padding: '9px 10px',
                    textAlign: i >= 2 ? 'right' : 'left',
                    fontWeight: '700',
                    color: '#424242',
                    fontSize: '12px',
                    borderBottom: '2px solid #e0e0e0',
                    letterSpacing: '0.3px',
                  }}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {purchase.items?.map((item, index) => (
              <tr
                key={index}
                style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#fafafa' }}
              >
                <td style={{ padding: '9px 10px', borderBottom: '1px solid #f0f0f0', color: '#212121' }}>
                  {item.name || '-'}
                </td>
                <td style={{ padding: '9px 10px', borderBottom: '1px solid #f0f0f0', color: '#616161' }}>
                  {item.category || '-'}
                </td>
                <td style={{ padding: '9px 10px', borderBottom: '1px solid #f0f0f0', textAlign: 'right', color: '#212121' }}>
                  {item.quantity} {getUnitLabel(item.unit)}
                </td>
                <td style={{ padding: '9px 10px', borderBottom: '1px solid #f0f0f0', textAlign: 'right', color: '#212121' }}>
                  {formatCurrency(item.rate)}
                </td>
                <td style={{ padding: '9px 10px', borderBottom: '1px solid #f0f0f0', textAlign: 'right', fontWeight: '600', color: '#212121' }}>
                  {formatCurrency(item.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Payment Summary */}
        <div
          style={{
            backgroundColor: '#f5f7fa',
            borderRadius: '10px',
            padding: '18px 20px',
            marginBottom: '20px',
            border: '1px solid #e8eaf0',
          }}
        >
          <div style={{ fontSize: '11px', color: '#757575', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '12px' }}>
            {isHindi ? 'भुगतान सारांश' : 'Payment Summary'}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#424242' }}>{isHindi ? 'कुल राशि' : 'Total Amount'}</span>
            <span style={{ fontWeight: '700', color: '#1a1a1a' }}>{formatCurrency(purchase.totalAmount)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#424242' }}>{isHindi ? 'भुगतान की राशि' : 'Amount Paid'}</span>
            <span style={{ fontWeight: '700', color: '#2e7d32' }}>{formatCurrency(purchase.amountPaid || 0)}</span>
          </div>
          {pendingAmount > 0 && (
            <>
              <div style={{ borderTop: '1px dashed #ccc', margin: '8px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#c62828', fontWeight: '600' }}>{isHindi ? 'बकाया राशि' : 'Pending Amount'}</span>
                <span style={{ fontWeight: '800', color: '#c62828', fontSize: '15px' }}>{formatCurrency(pendingAmount)}</span>
              </div>
            </>
          )}
        </div>

        {/* Notes */}
        {purchase.notes && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', color: '#757575', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '6px' }}>
              {isHindi ? 'नोट्स' : 'Notes'}
            </div>
            <div
              style={{
                backgroundColor: '#fffde7',
                border: '1px solid #fff176',
                borderRadius: '8px',
                padding: '12px 14px',
                fontSize: '13px',
                color: '#5d4037',
                lineHeight: '1.5',
              }}
            >
              {purchase.notes}
            </div>
          </div>
        )}

        {/* Bill Photo */}
        {billPhotoUrl && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', color: '#757575', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '8px' }}>
              {isHindi ? 'बिल फोटो' : 'Bill Photo'}
            </div>
            <img
              src={billPhotoUrl}
              alt="Bill"
              crossOrigin="anonymous"
              style={{
                maxWidth: '100%',
                maxHeight: '260px',
                borderRadius: '8px',
                objectFit: 'contain',
                display: 'block',
                border: '1px solid #e0e0e0',
              }}
            />
          </div>
        )}

        {/* Footer */}
        <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: '14px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: '#9e9e9e' }}>
            {isHindi ? 'घरबनाओ द्वारा तैयार' : 'Generated by GharBanao'}
            {' · '}
            {new Date().toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', {
              day: '2-digit', month: 'short', year: 'numeric',
            })}
          </div>
        </div>
      </div>
    </div>
  );
});

ReceiptTemplate.displayName = 'ReceiptTemplate';

export default ReceiptTemplate;
