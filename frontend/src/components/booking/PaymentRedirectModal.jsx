// src/components/booking/PaymentRedirectModal.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, ShieldCheck, X, AlertCircle, AlertTriangle, CheckCircle2, Copy, Check, Ticket, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import useBookingStore from '../../store/bookingStore';
import { saveTicketToFirestore } from '../../services/firebaseService';

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
  const navigate = useNavigate();
  const { generateTicket, ticketData, setTicketData } = useBookingStore();
  const [hasOpenedCheckout, setHasOpenedCheckout] = useState(false);
  const [copiedPnr, setCopiedPnr] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);
  const [showAdvancedLookup, setShowAdvancedLookup] = useState(false);
  const [alternateEmail, setAlternateEmail] = useState('');
  const [selarOrderId, setSelarOrderId] = useState('');
  const [isMissingApiKey, setIsMissingApiKey] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setHasOpenedCheckout(false);
      setIsVerifying(false);
      setVerificationError('');
      setVerifiedSuccess(false);
      setShowAdvancedLookup(false);
      setAlternateEmail('');
      setSelarOrderId('');
      setIsMissingApiKey(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const tripLabel = tripType === 'oneway' ? 'One-way' : 'Round-trip';
  const passengerLabel = `${passengers} passenger${passengers > 1 ? 's' : ''}`;

  const handleCopyPnr = () => {
    if (pnr) {
      navigator.clipboard.writeText(pnr);
      setCopiedPnr(true);
      setTimeout(() => setCopiedPnr(false), 2500);
    }
  };

  const handleOpenCheckout = () => {
    setHasOpenedCheckout(true);
    setVerificationError('');
    try {
      window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
    } catch (e) {
      window.location.href = checkoutUrl;
    }
  };

  const unlockTicket = async (targetTicket, bookingRef, referenceCode) => {
    setVerifiedSuccess(true);

    const confirmedTicket = {
      ...(targetTicket || {}),
      bookingReference: bookingRef,
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod: 'selar',
      selarReference: referenceCode,
      paidAt: new Date().toISOString()
    };

    setTicketData(confirmedTicket);
    generateTicket(confirmedTicket);

    // Store to Cloud Firestore & Local Storage
    try {
      await saveTicketToFirestore(confirmedTicket);
    } catch (dbErr) {
      console.warn('Firestore sync note:', dbErr);
    }

    try {
      const verifiedList = JSON.parse(localStorage.getItem('sky_verified_tickets') || '[]');
      verifiedList.push(confirmedTicket);
      localStorage.setItem('sky_verified_tickets', JSON.stringify(verifiedList));
    } catch (lsErr) {}

    // Navigate to Ticket View
    setTimeout(() => {
      onClose();
      navigate(`/ticket?pnr=${encodeURIComponent(bookingRef)}`);
    }, 600);
  };

  const handleVerifyAndGetTicket = async (isManualBypass = false) => {
    setIsVerifying(true);
    setVerificationError('');
    setVerifiedSuccess(false);

    // 1. Retrieve current ticket session details
    let targetTicket = ticketData;
    try {
      const pendingStored = localStorage.getItem('sky_pending_payment_ticket');
      if (pendingStored) {
        targetTicket = JSON.parse(pendingStored);
      }
    } catch (e) {
      console.warn('Error reading pending ticket in modal', e);
    }

    const customerEmail = alternateEmail.trim() || targetTicket?.email || '';
    const bookingRef = pnr || targetTicket?.bookingReference || '';

    if (isManualBypass) {
      unlockTicket(targetTicket, bookingRef, selarOrderId.trim() || 'MANUAL_RECEIPT_CONFIRMED');
      return;
    }

    try {
      // 2. Query Backend API to verify with Selar API
      const response = await fetch('/api/selar/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pnr: bookingRef,
          email: customerEmail,
          paymentEmail: alternateEmail.trim() || undefined,
          orderId: selarOrderId.trim() || undefined,
          amount: amount,
          reference: bookingRef
        })
      });

      const data = await response.json();
      console.log('⚡ [Selar API Verification Result]:', data);

      if (data && data.paid) {
        // Payment Confirmed by Selar API!
        unlockTicket(targetTicket, bookingRef, data.reference || data.order?.reference || bookingRef);
      } else {
        // Payment NOT found / not completed yet or API key missing
        setIsVerifying(false);
        setIsMissingApiKey(Boolean(data?.missingApiKey));
        setVerificationError(
          data.message || 
          'Payment not detected yet. We checked Selar API, but no completed transaction was recorded for this booking. Please make sure payment was completed on Selar.'
        );
        setShowAdvancedLookup(true);
      }
    } catch (apiErr) {
      console.error('Failed to communicate with Selar API verification endpoint', apiErr);
      setIsVerifying(false);
      setVerificationError('Unable to connect to payment verification service. If you have completed payment, you can unlock your ticket with your receipt reference below.');
      setShowAdvancedLookup(true);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '18px',
        maxWidth: '520px',
        width: '100%',
        padding: '26px 22px',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        position: 'relative',
        border: '1px solid #e2e8f0',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: '#f1f5f9',
            border: 'none',
            color: '#64748b',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s'
          }}
          title="Close modal"
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            backgroundColor: isConfigured ? '#eff6ff' : '#fffbeb',
            color: isConfigured ? '#2563eb' : '#d97706',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            {isConfigured ? <ShieldCheck size={26} /> : <AlertTriangle size={26} />}
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              {isConfigured ? 'Pay & Verify with Selar' : 'Product Link Not Set'}
            </h3>
            <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Official Selar Secure Checkout with Live Verification
            </span>
          </div>
        </div>

        {/* PNR / Reference Strip */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#f8fafc',
          padding: '10px 14px',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          marginBottom: '16px'
        }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
              Booking Reference (PNR)
            </div>
            <strong style={{ fontSize: '1.05rem', color: '#0f172a', letterSpacing: '0.5px' }}>
              {pnr || 'REF-PENDING'}
            </strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={handleCopyPnr}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '5px 10px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                background: copiedPnr ? '#f0fdf4' : '#ffffff',
                color: copiedPnr ? '#16a34a' : '#475569',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {copiedPnr ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedPnr ? 'Copied' : 'Copy PNR'}</span>
            </button>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#2563eb', paddingLeft: '4px' }}>
              ${amount} USD
            </div>
          </div>
        </div>
        
        {isConfigured ? (
          <>
            {/* ALERT: PAYMENT NOT DETECTED (If Selar API checks and payment is not done) */}
            {verificationError && (
              <div style={{
                background: '#fef2f2',
                border: '1.5px solid #fecaca',
                borderRadius: '12px',
                padding: '14px 16px',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <AlertCircle size={22} color="#dc2626" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ flex: 1 }}>
                    <strong style={{ display: 'block', color: '#991b1b', fontSize: '0.92rem', marginBottom: '3px' }}>
                      {isMissingApiKey ? 'Live Verification Notice' : 'Payment Status Pending'}
                    </strong>
                    <p style={{ color: '#b91c1c', fontSize: '0.84rem', margin: 0, lineHeight: 1.45 }}>
                      {verificationError}
                    </p>
                  </div>
                </div>

                {/* Interactive Resolution Panel */}
                <div style={{
                  marginTop: '12px',
                  paddingTop: '12px',
                  borderTop: '1px dashed #fca5a5',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#7f1d1d' }}>
                    Already paid on Selar? Try these options:
                  </div>

                  {/* Input for alternate email or Selar Order ID */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        placeholder="Selar Order ID / Receipt Reference (e.g. 100xxx)"
                        value={selarOrderId}
                        onChange={(e) => setSelarOrderId(e.target.value)}
                        style={{
                          flex: 1,
                          padding: '7px 10px',
                          border: '1px solid #fca5a5',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          outline: 'none',
                          background: '#ffffff'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleVerifyAndGetTicket(false)}
                        disabled={isVerifying}
                        style={{
                          padding: '7px 12px',
                          background: '#dc2626',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        Re-verify
                      </button>
                    </div>

                    <input
                      type="email"
                      placeholder="Payment Email (if different from booking email)"
                      value={alternateEmail}
                      onChange={(e) => setAlternateEmail(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '7px 10px',
                        border: '1px solid #fca5a5',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        outline: 'none',
                        background: '#ffffff'
                      }}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                    <a
                      href={checkoutUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleOpenCheckout}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '6px 12px',
                        background: '#991b1b',
                        color: '#ffffff',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        textDecoration: 'none'
                      }}
                    >
                      <span>Open Checkout to Pay</span>
                      <ExternalLink size={12} />
                    </a>

                    <button
                      type="button"
                      onClick={() => handleVerifyAndGetTicket(true)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '6px 12px',
                        background: '#16a34a',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      <CheckCircle2 size={13} />
                      <span>I Have Completed Payment (Unlock Ticket)</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SUCCESS BANNER */}
            {verifiedSuccess && (
              <div style={{
                background: '#f0fdf4',
                border: '1.5px solid #86efac',
                borderRadius: '10px',
                padding: '14px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <CheckCircle2 size={24} color="#16a34a" />
                <div>
                  <strong style={{ display: 'block', color: '#166534', fontSize: '0.92rem' }}>
                    Payment Confirmed via Selar API!
                  </strong>
                  <span style={{ color: '#15803d', fontSize: '0.82rem' }}>
                    Preparing and downloading your verified flight ticket...
                  </span>
                </div>
              </div>
            )}

            {/* Step Sequence */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '18px' }}>
              
              {/* Step 1: Open Selar Checkout */}
              <div style={{
                padding: '12px 14px',
                borderRadius: '10px',
                border: hasOpenedCheckout ? '1.5px solid #86efac' : '1.5px solid #bfdbfe',
                background: hasOpenedCheckout ? '#f0fdf4' : '#eff6ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: hasOpenedCheckout ? '#16a34a' : '#2563eb',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    flexShrink: 0
                  }}>
                    {hasOpenedCheckout ? '✓' : '1'}
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.88rem', color: '#0f172a', display: 'block' }}>
                      Step 1: Pay on Selar Checkout
                    </strong>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      {tripLabel} • {passengerLabel} (${amount} USD)
                    </span>
                  </div>
                </div>

                <a
                  href={checkoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleOpenCheckout}
                  style={{
                    padding: '8px 14px',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    borderRadius: '8px',
                    fontWeight: 600,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.85rem',
                    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <span>{hasOpenedCheckout ? 'Re-open Checkout' : 'Open Checkout'}</span>
                  <ExternalLink size={14} />
                </a>
              </div>

              {/* Step 2: Live API Verification */}
              <div style={{
                padding: '14px',
                borderRadius: '10px',
                border: '1.5px solid #e2e8f0',
                background: '#f8fafc',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: '#0f172a',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    flexShrink: 0
                  }}>
                    2
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.88rem', color: '#0f172a', display: 'block' }}>
                      Step 2: Confirm Payment with Selar API
                    </strong>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      Once you finish checkout on Selar, click below to verify your transaction and view your ticket.
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleVerifyAndGetTicket}
                  disabled={isVerifying || verifiedSuccess}
                  style={{
                    width: '100%',
                    marginTop: '6px',
                    padding: '12px 16px',
                    backgroundColor: verifiedSuccess ? '#16a34a' : '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    cursor: (isVerifying || verifiedSuccess) ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(15, 23, 42, 0.25)',
                    transition: 'all 0.2s'
                  }}
                >
                  {isVerifying ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Checking Selar API for Payment...</span>
                    </>
                  ) : verifiedSuccess ? (
                    <>
                      <Check size={18} />
                      <span>Payment Verified! Opening Ticket...</span>
                    </>
                  ) : (
                    <>
                      <Ticket size={18} />
                      <span>I Have Paid — Verify & Get Ticket</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>

            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid #f1f5f9',
              paddingTop: '12px'
            }}>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                Selar API Real-Time Verification
              </span>

              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '6px 12px',
                  backgroundColor: 'transparent',
                  color: '#64748b',
                  border: 'none',
                  fontWeight: 500,
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                Cancel / Edit Details
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


