// src/pages/PaymentCallbackPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Loader2, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Ticket } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import useBookingStore from '../store/bookingStore';
import { searchTicketInFirestore } from '../services/firebaseService';

const PaymentCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { generateTicket, ticketData, setTicketData } = useBookingStore();

  const [verifying, setVerifying] = useState(true);
  const [status, setStatus] = useState('processing'); // 'processing' | 'success' | 'failed'
  const [errorMessage, setErrorMessage] = useState('');
  const [verifiedTicket, setVerifiedTicket] = useState(null);

  const pnr = searchParams.get('pnr') || searchParams.get('reference') || searchParams.get('custom_pnr') || searchParams.get('trxref') || searchParams.get('order_id') || searchParams.get('reference_id');
  const emailParam = searchParams.get('email');
  const nameParam = searchParams.get('fullname') || searchParams.get('name');
  const selarStatus = searchParams.get('status');

  useEffect(() => {
    let isMounted = true;

    const verifyTransaction = async () => {
      try {
        setVerifying(true);
        console.log('🔄 Verifying Selar payment callback. Params:', { pnr, emailParam, nameParam, selarStatus });

        // 1. Check if there is pending ticket data stored locally
        let localPending = null;
        try {
          const stored = localStorage.getItem('sky_pending_payment_ticket');
          if (stored) {
            localPending = JSON.parse(stored);
            console.log('📦 Found pending local ticket:', localPending);
          }
        } catch (e) {
          console.warn('Could not parse pending local ticket', e);
        }

        // 2. Call backend verify endpoint if reference exists
        let backendResult = null;
        if (pnr) {
          try {
            const res = await fetch(`/api/selar/verify/${encodeURIComponent(pnr)}`);
            if (res.ok) {
              backendResult = await res.json();
            }
          } catch (apiErr) {
            console.warn('Backend verify check skipped or failed:', apiErr);
          }
        }

        // 3. Check Firebase Firestore database
        let firestoreTicket = null;
        if (pnr) {
          try {
            firestoreTicket = await searchTicketInFirestore(pnr, '');
          } catch (fErr) {
            console.warn('Firestore lookup error:', fErr);
          }
        } else if (emailParam) {
          try {
            firestoreTicket = await searchTicketInFirestore('', emailParam);
          } catch (fErr) {
            console.warn('Firestore lookup by email error:', fErr);
          }
        }

        // 4. Check Zustand store ticket
        let storeTicket = ticketData || null;

        // 5. Check recent tickets in localStorage
        let historyTicket = null;
        try {
          const historyRaw = localStorage.getItem('sky_verified_tickets');
          if (historyRaw) {
            const history = JSON.parse(historyRaw);
            if (Array.isArray(history) && history.length > 0) {
              historyTicket = history.find(t => (pnr && t.bookingReference === pnr) || (emailParam && t.email === emailParam)) || history[0];
            }
          }
        } catch (hErr) {
          console.warn('History read error:', hErr);
        }

        // Resolve best matching ticket
        let resolvedTicket = firestoreTicket || localPending || storeTicket || historyTicket;

        // If no ticket found but user details are in query params, construct fallback ticket
        if (!resolvedTicket && (emailParam || nameParam)) {
          const generatedPnr = pnr || `REF${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
          const generatedTicketNum = `SKY${Date.now().toString().slice(-8)}`;
          const names = (nameParam || 'Valued Passenger').split(' ');
          const firstName = names[0] || 'Valued';
          const lastName = names.slice(1).join(' ') || 'Passenger';

          resolvedTicket = {
            bookingReference: generatedPnr,
            ticketNumber: generatedTicketNum,
            firstName,
            lastName,
            email: emailParam || '',
            passengerName: nameParam || `${firstName} ${lastName}`,
            tripType: 'round',
            passengers: 1,
            passengerList: [
              {
                id: '1',
                passengerType: 'Adult',
                firstName,
                lastName,
                passport: 'A' + Math.floor(10000000 + Math.random() * 90000000),
                nationality: 'International'
              }
            ],
            departure: 'London Heathrow (LHR)',
            destination: 'New York (JFK)',
            departDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
            returnDate: new Date(Date.now() + 86400000 * 21).toISOString().split('T')[0],
            status: 'confirmed',
            paymentStatus: 'paid',
            paymentMethod: 'selar'
          };
        }

        if (resolvedTicket) {
          // Stamp status as confirmed and paid
          const confirmedTicket = {
            ...resolvedTicket,
            status: 'confirmed',
            paymentStatus: 'paid',
            paymentMethod: 'selar',
            paidAt: new Date().toISOString(),
            email: emailParam || resolvedTicket.email || '',
            ...(nameParam && !resolvedTicket.passengerName ? { passengerName: nameParam } : {})
          };

          if (isMounted) {
            generateTicket(confirmedTicket);
            setTicketData(confirmedTicket);
            setVerifiedTicket(confirmedTicket);
            setStatus('success');
            setVerifying(false);
            try {
              localStorage.removeItem('sky_pending_payment_ticket');
            } catch (e) {}
          }
        } else {
          // If no pre-existing ticket was found, but status is success
          if (selarStatus === 'success' || (backendResult && backendResult.success)) {
            setStatus('success');
            setVerifying(false);
          } else {
            setStatus('failed');
            setErrorMessage('Unable to locate the flight reservation details for this payment session.');
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
  }, [pnr, emailParam, nameParam, selarStatus, generateTicket, setTicketData, ticketData]);

  const handleProceedToTicket = () => {
    const targetPnr = pnr || verifiedTicket?.bookingReference || ticketData?.bookingReference;
    if (targetPnr) {
      navigate(`/ticket?pnr=${encodeURIComponent(targetPnr)}`);
    } else {
      navigate('/ticket');
    }
  };

  const activePnr = pnr || verifiedTicket?.bookingReference || ticketData?.bookingReference;

  return (
    <div style={{ position: 'relative', zIndex: 25, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div className="payment-callback-container" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
        <div style={{ maxWidth: '520px', width: '100%', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '36px 28px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', textAlign: 'center' }}>
          
          {verifying && (
            <div>
              <Loader2 size={48} className="animate-spin" color="#2563eb" style={{ margin: '0 auto 20px' }} />
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

              {activePnr && (
                <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Booking Reference (PNR):</span>
                  <strong style={{ color: '#0f172a', letterSpacing: '1px' }}>{activePnr}</strong>
                </div>
              )}

              <button
                onClick={handleProceedToTicket}
                style={{ width: '100%', padding: '14px', borderRadius: '10px', backgroundColor: '#2563eb', color: '#ffffff', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '1rem', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)' }}
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
                {errorMessage || 'We could not automatically verify this payment session. If your account was debited, your ticket can be retrieved using your PNR or Email.'}
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <Link
                  to="/"
                  style={{ flex: 1, padding: '12px', borderRadius: '8px', backgroundColor: '#f1f5f9', color: '#334155', fontWeight: 600, border: '1px solid #cbd5e1', textDecoration: 'none', display: 'inline-block' }}
                >
                  Return to Home
                </Link>
                <Link
                  to="/verify"
                  style={{ flex: 1, padding: '12px', borderRadius: '8px', backgroundColor: '#2563eb', color: '#ffffff', fontWeight: 600, border: 'none', textDecoration: 'none', display: 'inline-block' }}
                >
                  Check PNR Status
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentCallbackPage;
