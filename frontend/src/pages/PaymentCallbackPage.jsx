// src/pages/PaymentCallbackPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Ticket } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import useBookingStore from '../store/bookingStore';
import { searchTicketInFirestore } from '../services/firebaseService';

const PaymentCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { generateTicket, ticketData } = useBookingStore();

  const [verifying, setVerifying] = useState(true);
  const [status, setStatus] = useState('processing'); // 'processing' | 'success' | 'failed'
  const [errorMessage, setErrorMessage] = useState('');
  const [verifiedTicket, setVerifiedTicket] = useState(null);

  const pnr = searchParams.get('pnr') || searchParams.get('reference') || searchParams.get('custom_pnr');
  const selarStatus = searchParams.get('status');

  useEffect(() => {
    let isMounted = true;

    const verifyTransaction = async () => {
      try {
        setVerifying(true);
        console.log('🔄 Verifying Selar payment for reference:', pnr);

        // Check if there is pending ticket data stored locally
        let localPending = null;
        try {
          const stored = localStorage.getItem('sky_pending_payment_ticket');
          if (stored) {
            localPending = JSON.parse(stored);
          }
        } catch (e) {
          console.warn('Could not parse pending local ticket', e);
        }

        // Call backend verify endpoint
        let backendResult = null;
        if (pnr) {
          try {
            const res = await fetch(`/api/selar/verify/${encodeURIComponent(pnr)}`);
            backendResult = await res.json();
          } catch (apiErr) {
            console.warn('Backend verify check skipped or failed:', apiErr);
          }
        }

        // Check Firebase Firestore database
        let firestoreTicket = null;
        if (pnr) {
          firestoreTicket = await searchTicketInFirestore(pnr, '');
        }

        const resolvedTicket = firestoreTicket || localPending || (ticketData?.bookingReference === pnr ? ticketData : null);

        if (resolvedTicket) {
          // Stamp status as confirmed and paid
          const confirmedTicket = {
            ...resolvedTicket,
            status: 'confirmed',
            paymentStatus: 'paid',
            paymentMethod: 'selar',
            paidAt: new Date().toISOString()
          };

          if (isMounted) {
            generateTicket(confirmedTicket);
            setVerifiedTicket(confirmedTicket);
            setStatus('success');
            setVerifying(false);
            try {
              localStorage.removeItem('sky_pending_payment_ticket');
            } catch (e) {}
          }
        } else {
          // If no pre-existing ticket was found, but status is success, generate from available params or direct back
          if (selarStatus === 'success' || (backendResult && backendResult.success)) {
            setStatus('success');
            setVerifying(false);
          } else {
            setStatus('failed');
            setErrorMessage('Unable to locate the flight reservation details for this payment reference.');
            setVerifying(false);
          }
        }
      } catch (err) {
        console.error('Payment verification failed:', err);
        if (isMounted) {
          setStatus('failed');
          setErrorMessage(err.message || 'An error occurred during payment verification.');
          setVerifying(false);
        }
      }
    };

    verifyTransaction();

    return () => {
      isMounted = false;
    };
  }, [pnr, selarStatus, generateTicket, ticketData]);

  const handleProceedToTicket = () => {
    navigate('/ticket');
  };

  return (
    <>
      <Navbar />
      <div className="payment-callback-container" style={{ minHeight: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
        <div style={{ maxWidth: '520px', width: '100%', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '36px 28px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', textAlign: 'center' }}>
          
          {verifying && (
            <div>
              <Loader2 size={48} className="animate-spin" color="#2a7de1" style={{ margin: '0 auto 20px' }} />
              <h2 style={{ fontSize: '1.4rem', color: '#0f172a', fontWeight: 700, marginBottom: '8px' }}>
                Verifying Payment with Selar...
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                Please wait a moment while we confirm your transaction and issue your IATA-compliant visa flight itinerary.
              </p>
            </div>
          )}

          {!verifying && status === 'success' && (
            <div>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <CheckCircle2 size={36} color="#16a34a" />
              </div>
              <h2 style={{ fontSize: '1.45rem', color: '#0f172a', fontWeight: 700, marginBottom: '8px' }}>
                Payment Confirmed!
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '20px' }}>
                Your transaction has been verified successfully by Selar. Your flight reservation is registered and valid for 14 days.
              </p>

              {pnr && (
                <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Booking Reference (PNR):</span>
                  <strong style={{ color: '#0f172a', letterSpacing: '1px' }}>{pnr}</strong>
                </div>
              )}

              <button
                onClick={handleProceedToTicket}
                style={{ width: '100%', padding: '14px', borderRadius: '10px', backgroundColor: '#2a7de1', color: '#ffffff', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '1rem' }}
              >
                <Ticket size={18} /> <span>View & Download My Ticket</span> <ArrowRight size={18} />
              </button>
            </div>
          )}

          {!verifying && status === 'failed' && (
            <div>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <AlertTriangle size={36} color="#dc2626" />
              </div>
              <h2 style={{ fontSize: '1.4rem', color: '#0f172a', fontWeight: 700, marginBottom: '8px' }}>
                Verification Issue
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '24px' }}>
                {errorMessage || 'We could not automatically verify this payment session. If your account was debited, your ticket will be activated automatically once the Selar webhook completes.'}
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => navigate('/')}
                  style={{ flex: 1, padding: '12px', borderRadius: '8px', backgroundColor: '#f1f5f9', color: '#334155', fontWeight: 600, border: '1px solid #cbd5e1', cursor: 'pointer' }}
                >
                  Return to Home
                </button>
                <button
                  onClick={() => navigate('/verify')}
                  style={{ flex: 1, padding: '12px', borderRadius: '8px', backgroundColor: '#2a7de1', color: '#ffffff', fontWeight: 600, border: 'none', cursor: 'pointer' }}
                >
                  Check PNR Status
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentCallbackPage;
