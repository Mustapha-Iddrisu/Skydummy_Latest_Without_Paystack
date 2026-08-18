// src/components/booking/PaymentRedirectModal.jsx
import React from 'react';
import { ExternalLink, ShieldCheck, X, AlertCircle, AlertTriangle } from 'lucide-react';

const PaymentRedirectModal = ({ 
  isOpen, 
  onClose, 
  checkoutUrl, 
  pnr, 
  amount, 
  tripType = 'round', 
  passengers = 1, 
  isConfigured = true 
}) => {
  if (!isOpen) return null;

  const tripLabel = tripType === 'oneway' ? 'One-way' : 'Round-trip';
  const passengerLabel = `${passengers} passenger${passengers > 1 ? 's' : ''}`;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        maxWidth: '490px',
        width: '100%',
        padding: '28px 24px',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2), 0 10px 10px -5px rgba(0,0,0,0.04)',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            color: '#64748b',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <X size={20} />
        </button>

        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '12px',
          backgroundColor: isConfigured ? '#eff6ff' : '#fffbeb',
          color: isConfigured ? '#2563eb' : '#d97706',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px'
        }}>
          {isConfigured ? <ShieldCheck size={28} /> : <AlertTriangle size={28} />}
        </div>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
          {isConfigured ? 'Proceed to Selar Checkout' : 'Product Link Not Set'}
        </h3>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: '#f1f5f9',
          padding: '4px 10px',
          borderRadius: '6px',
          fontSize: '0.8rem',
          fontWeight: 600,
          color: '#334155',
          marginBottom: '14px'
        }}>
          <span>{tripLabel}</span>
          <span>•</span>
          <span>{passengerLabel}</span>
          <span>•</span>
          <span>${amount} USD</span>
        </div>
        
        {isConfigured ? (
          <>
            <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5, marginBottom: '16px' }}>
              Redirecting to the dedicated Selar product checkout for your <strong>{tripLabel} ({passengerLabel})</strong> booking (PNR: <strong>{pnr}</strong>).
            </p>

            <div style={{
              background: '#f8fafc',
              borderRadius: '10px',
              padding: '12px 14px',
              border: '1px solid #e2e8f0',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px'
            }}>
              <AlertCircle size={18} color="#0284c7" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span style={{ fontSize: '0.8rem', color: '#475569' }}>
                Opens directly in a new window to complete payment safely. After paying, you'll be redirected back to download your ticket.
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a
                href={checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  try {
                    if (window.top && window.top !== window) {
                      window.top.location.href = checkoutUrl;
                      e.preventDefault();
                    }
                  } catch(err) {}
                }}
                style={{
                  padding: '14px 18px',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  borderRadius: '10px',
                  fontWeight: 600,
                  textAlign: 'center',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '0.95rem'
                }}
              >
                <span>Open Selar Checkout ({tripLabel} • {passengerLabel})</span>
                <ExternalLink size={16} />
              </a>

              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '10px 16px',
                  backgroundColor: 'transparent',
                  color: '#64748b',
                  border: 'none',
                  fontWeight: 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Cancel & Return to Form
              </button>
            </div>
          </>
        ) : (
          <>
            <p style={{ fontSize: '0.9rem', color: '#b45309', lineHeight: 1.5, marginBottom: '16px' }}>
              The specific Selar product link for <strong>{tripLabel}</strong> with <strong>{passengerLabel}</strong> has not been set yet in your environment variables.
            </p>
            <div style={{
              background: '#fef3c7',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '0.82rem',
              color: '#92400e',
              marginBottom: '20px',
              fontFamily: 'monospace'
            }}>
              VITE_SELAR_{tripType === 'oneway' ? 'ONEWAY' : 'ROUND'}_{passengers}=https://selar.com/your-product-link
            </div>
            <button
              type="button"
              onClick={onClose}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#0f172a',
                color: '#ffffff',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Back to Form
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentRedirectModal;
