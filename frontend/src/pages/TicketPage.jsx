// src/pages/TicketPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Loader2, Ticket, Search, AlertCircle, ArrowLeft } from 'lucide-react';
import useBookingStore from '../store/bookingStore';
import TicketPreview from '../components/ticket/TicketPreview';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { searchTicketInFirestore } from '../services/firebaseService';

const TicketPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { ticketGenerated, ticketData, isLoading, setTicketData, generateTicket } = useBookingStore();

  const [isRecovering, setIsRecovering] = useState(!ticketData);
  const [recoveredTicket, setRecoveredTicket] = useState(ticketData || null);

  const queryPnr = searchParams.get('pnr') || searchParams.get('reference') || searchParams.get('custom_pnr') || searchParams.get('id');

  useEffect(() => {
    let isMounted = true;

    const recoverTicket = async () => {
      // 1. If ticketData is already in Zustand store, use it immediately
      if (ticketData) {
        if (isMounted) {
          setRecoveredTicket(ticketData);
          setIsRecovering(false);
        }
        return;
      }

      setIsRecovering(true);
      console.log('🔍 Attempting ticket recovery on TicketPage with query PNR:', queryPnr);

      try {
        let foundTicket = null;

        // 2. Check pending payment ticket in localStorage
        try {
          const pendingRaw = localStorage.getItem('sky_pending_payment_ticket');
          if (pendingRaw) {
            const parsedPending = JSON.parse(pendingRaw);
            if (!queryPnr || parsedPending.bookingReference === queryPnr) {
              foundTicket = {
                ...parsedPending,
                status: 'confirmed',
                paymentStatus: 'paid'
              };
              console.log('✅ Recovered ticket from pending payment storage:', foundTicket);
            }
          }
        } catch (e) {
          console.warn('Error reading pending ticket from localStorage', e);
        }

        // 3. If query PNR is provided, look up Firestore cloud database
        if (!foundTicket && queryPnr) {
          try {
            const firestoreResult = await searchTicketInFirestore(queryPnr, '');
            if (firestoreResult) {
              foundTicket = firestoreResult;
              console.log('✅ Recovered ticket from Firestore cloud database:', foundTicket);
            }
          } catch (fireErr) {
            console.warn('Firestore lookup error on TicketPage:', fireErr);
          }

          // Also check backend API endpoint
          if (!foundTicket) {
            try {
              const res = await fetch(`/api/tickets/${encodeURIComponent(queryPnr)}`);
              if (res.ok) {
                const apiData = await res.json();
                if (apiData && (apiData.ticket || apiData.bookingReference)) {
                  foundTicket = apiData.ticket || apiData;
                  console.log('✅ Recovered ticket from backend API:', foundTicket);
                }
              }
            } catch (apiErr) {
              console.warn('API lookup skipped:', apiErr);
            }
          }
        }

        // 4. Check recent verified tickets list in localStorage
        if (!foundTicket) {
          try {
            const historyRaw = localStorage.getItem('sky_verified_tickets');
            if (historyRaw) {
              const history = JSON.parse(historyRaw);
              if (Array.isArray(history) && history.length > 0) {
                if (queryPnr) {
                  foundTicket = history.find(t => t.bookingReference === queryPnr) || null;
                } else {
                  // Use most recent ticket created
                  foundTicket = history[0];
                  console.log('✅ Using most recent ticket from history:', foundTicket);
                }
              }
            }
          } catch (e) {
            console.warn('Error reading history tickets from localStorage', e);
          }
        }

        if (isMounted) {
          if (foundTicket) {
            setRecoveredTicket(foundTicket);
            setTicketData(foundTicket);
          }
          setIsRecovering(false);
        }
      } catch (err) {
        console.error('Failed to recover ticket on TicketPage:', err);
        if (isMounted) {
          setIsRecovering(false);
        }
      }
    };

    recoverTicket();

    return () => {
      isMounted = false;
    };
  }, [ticketData, queryPnr, setTicketData]);

  const activeTicket = ticketData || recoveredTicket;

  return (
    <div className="ticket-page-wrapper" style={{ position: 'relative', zIndex: 25, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '1rem 0.5rem 3rem', maxWidth: '800px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        {(isLoading || isRecovering) && (
          <div className="loading-container" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '2.5rem 1.5rem', margin: '1rem auto' }}>
            <Loader2 size={40} className="animate-spin" color="#2563eb" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 700, margin: '0 0 0.5rem 0' }}>
              Loading Your Flight Ticket...
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0, textAlign: 'center' }}>
              Retrieving verified GDS reservation and generating your official downloadable itinerary.
            </p>
          </div>
        )}

        {!isLoading && !isRecovering && activeTicket && (
          <TicketPreview ticketData={activeTicket} />
        )}

        {!isLoading && !isRecovering && !activeTicket && (
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '2.5rem 1.5rem',
            textAlign: 'center',
            maxWidth: '520px',
            margin: '2rem auto',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem'
            }}>
              <Ticket size={30} />
            </div>
            
            <h2 style={{ fontSize: '1.35rem', color: '#0f172a', fontWeight: 700, marginBottom: '0.5rem' }}>
              No Ticket Active in Session
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: 1.5, marginBottom: '1.75rem' }}>
              If you just completed a payment, your booking reference may still be confirming or you can check using your PNR.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link
                to="/verify"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.85rem 1.25rem',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  borderRadius: '10px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  fontSize: '0.95rem'
                }}
              >
                <Search size={18} /> <span>Verify PNR / Search Ticket</span>
              </Link>

              <Link
                to="/"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.8rem 1.25rem',
                  backgroundColor: '#f1f5f9',
                  color: '#334155',
                  borderRadius: '10px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  fontSize: '0.92rem'
                }}
              >
                <ArrowLeft size={16} /> <span>Create New Booking</span>
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default TicketPage;

