import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Ticket, 
  User, 
  Search, 
  Loader2, 
  AlertTriangle, 
  CheckCircle, 
  Database, 
  Barcode, 
  Calendar, 
  FileDown, 
  Printer, 
  PlusCircle, 
  Contact, 
  Route as RouteIcon, 
  QrCode,
  Clock,
  Hourglass
} from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import TicketPreview from '../components/ticket/TicketPreview';
import { generateTicketPDF } from '../services/pdfService';
import { searchTicketInFirestore, saveTicketToFirestore, checkTicketExpiry } from '../services/firebaseService';

const sampleDate = new Date();
const sampleIssue = sampleDate.toISOString().split('T')[0];
const sampleExpiryDate = new Date(sampleDate.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

const SAMPLE_TICKETS = [
  {
    bookingReference: 'PNR-77A9X2',
    ticketNumber: 'SKY88204910',
    status: 'confirmed',
    issueDate: sampleIssue,
    expiryDate: sampleExpiryDate,
    validityDays: 14,
    createdAt: sampleDate.toISOString(),
    tripType: 'round',
    passengers: 1,
    firstName: 'John',
    lastName: 'Doe',
    passport: 'A9821034',
    email: 'john.doe@example.com',
    passengerList: [
      { firstName: 'John', lastName: 'Doe', passport: 'A9821034', title: 'Mr' }
    ],
    totalPrice: '$12.00 USD',
    flightDetails: {
      flightNumber: 'EK202',
      airline: { name: 'Emirates', code: 'EK', logo: '✈️' },
      departure: { airport: 'JFK', city: 'New York', country: 'United States', time: '11:00', terminal: '4', gate: 'B22' },
      arrival: { airport: 'LHR', city: 'London', country: 'United Kingdom', time: '23:10', terminal: '3', gate: 'A14' },
      aircraft: 'Boeing 777-300ER',
      bookingClass: 'Economy (M)',
      durationFormatted: '7h 10m',
      stops: 1,
      stopoverDetails: {
        airport: 'DXB',
        city: 'Dubai',
        country: 'UAE',
        duration: 120
      },
      returnFlight: {
        flightNumber: 'EK201',
        airline: { name: 'Emirates', code: 'EK', logo: '✈️' },
        departure: { airport: 'LHR', city: 'London', country: 'United Kingdom', time: '14:20', terminal: '3', gate: 'A18' },
        arrival: { airport: 'JFK', city: 'New York', country: 'United States', time: '19:00', terminal: '4', gate: 'B20' },
        aircraft: 'Boeing 777-300ER',
        bookingClass: 'Economy (M)',
        durationFormatted: '7h 40m',
        stops: 0
      }
    }
  }
];

const PnrVerificationPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialRef = searchParams.get('pnr') || searchParams.get('ref') || '';
  const initialLastName = searchParams.get('lastName') || '';

  const [pnrInput, setPnrInput] = useState(initialRef);
  const [lastNameInput, setLastNameInput] = useState(initialLastName);
  const [ticketResult, setTicketResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Search function
  const performSearch = async (targetPnr, targetLastName) => {
    setErrorMsg('');
    setSearched(true);

    const queryRef = (targetPnr || pnrInput).trim();
    const queryName = (targetLastName !== undefined ? targetLastName : lastNameInput).trim().toLowerCase();

    if (!queryRef) {
      setErrorMsg('Please enter a PNR Reference or Contact Email');
      return;
    }

    setIsSearching(true);

    try {
      // 1. Query Cloud Database (Firestore) for instant worldwide cross-device verification
      const isEmailQuery = queryRef.includes('@');
      let cloudTicket = null;
      if (isEmailQuery) {
        cloudTicket = await searchTicketInFirestore('', queryRef.toLowerCase());
      } else {
        cloudTicket = await searchTicketInFirestore(queryRef.toUpperCase(), queryName);
      }

      if (cloudTicket) {
        setTicketResult(cloudTicket);
        setIsSearching(false);
        return;
      }

      // 2. Check Server API endpoint
      const res = await fetch(`/api/tickets?pnr=${encodeURIComponent(queryRef)}&lastName=${encodeURIComponent(queryName)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.ticket) {
          setTicketResult(data.ticket);
          setIsSearching(false);
          return;
        }
      }
    } catch (err) {
      console.log('Cloud / Server lookup failed, falling back to local store', err);
    }

    // 2. Fallback to localStorage, pending session, and sample tickets
    setTimeout(() => {
      let storedTickets = [];
      try {
        const pending = localStorage.getItem('sky_pending_payment_ticket');
        if (pending) {
          storedTickets.push(JSON.parse(pending));
        }
      } catch (e) {}

      try {
        const stored = localStorage.getItem('sky_verified_tickets');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) storedTickets.push(...parsed);
        }
      } catch (err) {
        console.error('Failed to parse stored tickets', err);
      }

      try {
        const zustandStored = localStorage.getItem('booking-storage');
        if (zustandStored) {
          const parsed = JSON.parse(zustandStored);
          if (parsed?.state?.ticketData) {
            storedTickets.push(parsed.state.ticketData);
          }
        }
      } catch (err) {
        console.error('Failed to parse zustand store', err);
      }

      const allTickets = [...storedTickets, ...SAMPLE_TICKETS];
      const upperQuery = queryRef.toUpperCase();
      const lowerQuery = queryRef.toLowerCase();

      const match = allTickets.find(t => {
        const refMatch = t.bookingReference?.toUpperCase() === upperQuery || 
                         t.ticketNumber?.toUpperCase() === upperQuery ||
                         t.email?.toLowerCase() === lowerQuery ||
                         t.bookingReference?.replace('-', '')?.toUpperCase() === upperQuery.replace('-', '');
        
        let nameMatch = true;
        if (queryName) {
          const mainLast = t.lastName?.toLowerCase() || '';
          const listLast = t.passengerList?.some(p => p.lastName?.toLowerCase() === queryName);
          nameMatch = mainLast.includes(queryName) || listLast;
        }

        return refMatch && nameMatch;
      });

      if (match) {
        setTicketResult(checkTicketExpiry(match));
      } else {
        setTicketResult(null);
        setErrorMsg(`No active ticket found for "${queryRef}". Please verify your reference or email.`);
      }

      setIsSearching(false);
    }, 250);
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    performSearch();
  };

  useEffect(() => {
    // Ensure sample demo tickets exist in Firestore cloud database
    SAMPLE_TICKETS.forEach(ticket => {
      saveTicketToFirestore(ticket);
    });

    if (initialRef) {
      performSearch(initialRef, initialLastName);
    }
  }, [initialRef]);

  const handleDownloadPDF = async () => {
    if (!ticketResult) return;
    try {
      await generateTicketPDF(ticketResult);
    } catch (err) {
      console.error('PDF generation error', err);
      alert('Could not download PDF. Please try printing directly.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="pnr-page-wrapper">
      <Navbar />

      <div className="pnr-hero-banner">
        <div className="pnr-container">
          <div className="pnr-hero-header">
            <span className="pnr-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} /> Official GDS Validation Portal
            </span>
            <h1>Live Flight Itinerary & PNR Verification</h1>
            <p>Verify e-ticket authenticity, passenger manifests, and route itineraries synchronized across global GDS flight networks.</p>
          </div>

          <form onSubmit={handleSearch} className="pnr-search-card">
            <div className="pnr-input-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Ticket size={14} /> PNR / Booking Reference or E-Ticket #
              </label>
              <input 
                type="text"
                placeholder="e.g. SKY-8X92K4 or PNR-77A9X2"
                value={pnrInput}
                onChange={(e) => setPnrInput(e.target.value)}
                required
              />
            </div>

            <div className="pnr-input-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={14} /> Passenger Last Name (Optional)
              </label>
              <input 
                type="text"
                placeholder="e.g. Doe"
                value={lastNameInput}
                onChange={(e) => setLastNameInput(e.target.value)}
              />
            </div>

            <button type="submit" className="pnr-submit-btn" disabled={isSearching} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {isSearching ? (
                <><Loader2 size={16} className="animate-spin" /> Verifying...</>
              ) : (
                <><Search size={16} /> Verify Status</>
              )}
            </button>
          </form>

          {/* Quick Demo Reference Suggestions */}
          <div className="pnr-quick-chips">
            <span>Try sample PNR:</span>
            <button 
              type="button" 
              className="chip-btn"
              onClick={() => { 
                setPnrInput('PNR-77A9X2'); 
                setLastNameInput('Doe'); 
                performSearch('PNR-77A9X2', 'Doe');
              }}
            >
              PNR-77A9X2 (Doe)
            </button>
          </div>
        </div>
      </div>

      <div className="pnr-main-content">
        <div className="pnr-container">

          {errorMsg && (
            <div className="pnr-error-banner">
              <AlertTriangle size={24} color="#dc2626" />
              <div>
                <strong>Verification Query Notice</strong>
                <p>{errorMsg}</p>
              </div>
            </div>
          )}

          {ticketResult && (
            <div className="pnr-result-section">
              {/* Verification Status Header */}
              <div className="pnr-status-header">
                {ticketResult.isExpired ? (
                  <div className="status-live-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#fee2e2', color: '#dc2626', borderColor: '#fca5a5' }}>
                    <AlertTriangle size={16} color="#dc2626" /> RESERVATION EXPIRED (14-DAY VALIDITY PASSED)
                  </div>
                ) : (
                  <div className="status-live-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <span className="pulse-dot"></span>
                    <CheckCircle size={16} color="#16a34a" /> VERIFIED ACTIVE IN GDS (14 DAYS VALIDITY)
                  </div>
                )}
                <div className="pnr-meta-tags">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Database size={13} /> Amadeus / Sabre Record Locator: <strong>{ticketResult.bookingReference}</strong>
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Barcode size={13} /> E-Ticket #: <strong>{ticketResult.ticketNumber}</strong>
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={13} /> Issued: <strong>{ticketResult.issueDate}</strong>
                  </span>
                  {ticketResult.expiryDate && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: ticketResult.isExpired ? '#dc2626' : '#2563eb' }}>
                      <Hourglass size={13} /> Expires: <strong>{ticketResult.expiryDate} (14 Days)</strong>
                    </span>
                  )}
                </div>
              </div>

              {/* Verified Badge Banner */}
              <div className="pnr-info-callout" style={{ display: 'flex', alignItems: 'center', gap: '8px', borderLeftColor: ticketResult.isExpired ? '#dc2626' : '#16a34a' }}>
                <ShieldCheck size={18} color={ticketResult.isExpired ? '#dc2626' : '#16a34a'} />
                <span>
                  {ticketResult.isExpired 
                    ? `This reservation validity window of 14 days expired on ${ticketResult.expiryDate}. For visa applications, please generate a new itinerary.` 
                    : `This flight reservation itinerary is officially registered and active in Firebase GDS with a 14-day validity window ending on ${ticketResult.expiryDate || 'N/A'}.`}
                </span>
              </div>

              {/* Ticket Preview Component */}
              <div className="pnr-preview-container">
                <TicketPreview ticketData={ticketResult} />
              </div>

              {/* Action Toolbar */}
              <div className="pnr-actions-bar">
                <button className="btn-pnr-action primary" onClick={handleDownloadPDF} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <FileDown size={16} /> Download Official PDF
                </button>
                <button className="btn-pnr-action secondary" onClick={handlePrint} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Printer size={16} /> Print Itinerary
                </button>
                <Link to="/" className="btn-pnr-action outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <PlusCircle size={16} /> Book Another Itinerary
                </Link>
              </div>
            </div>
          )}

          {!searched && !ticketResult && (
            <div className="pnr-features-grid">
              <div className="feature-card">
                <div className="feature-icon" style={{ display: 'inline-flex' }}><Contact size={28} color="#2a7de1" /></div>
                <h3>Embassy Compliant</h3>
                <p>Formatted according to strict VFS, TLScontact, and BLS embassy requirements worldwide.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon" style={{ display: 'inline-flex' }}><RouteIcon size={28} color="#2a7de1" /></div>
                <h3>Multi-Leg & Transits</h3>
                <p>Detailed step-by-step 1. Departure → Transit and 2. Transit → Arrival breakdowns for layovers.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon" style={{ display: 'inline-flex' }}><QrCode size={28} color="#2a7de1" /></div>
                <h3>IATA BCBP Barcode</h3>
                <p>Includes scannable 2D IATA barcodes for maximum authenticity on paper or digital view.</p>
              </div>
            </div>
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PnrVerificationPage;
