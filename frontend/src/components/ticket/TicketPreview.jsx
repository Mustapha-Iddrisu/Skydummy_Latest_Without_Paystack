// src/components/ticket/TicketPreview.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  Ticket, 
  Armchair, 
  PlaneTakeoff, 
  PlaneLanding, 
  Plane, 
  ArrowRightLeft, 
  Clock, 
  Check, 
  FileDown, 
  Printer, 
  Mail, 
  Plus, 
  Info,
  Calendar,
  Hourglass,
  AlertTriangle
} from 'lucide-react';
import useBookingStore from '../../store/bookingStore';
import { generateTicketPDF, generatePrintHTML } from '../../services/pdfService';
import { sendAppreciationEmail } from '../../services/emailService';

const TicketPreview = ({ ticketData: customTicketData }) => {
  const navigate = useNavigate();
  const { ticketData: storeTicketData, resetForm } = useBookingStore();
  const ticketData = customTicketData || storeTicketData;
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!ticketData && !customTicketData) {
      navigate('/');
    }
  }, [ticketData, customTicketData, navigate]);

  if (!ticketData) {
    return null;
  }

  const handleDownload = () => {
    try {
      generateTicketPDF(ticketData, true);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('There was an error generating the PDF. Please try again.');
    }
  };

  const handlePrint = () => {
    try {
      const printHTML = generatePrintHTML(ticketData);
      
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      if (!printWindow) {
        alert('Please allow popups to print the ticket.');
        return;
      }
      
      printWindow.document.write(printHTML);
      printWindow.document.close();
      
      printWindow.onload = function() {
        setTimeout(() => {
          printWindow.print();
        }, 500);
      };
    } catch (error) {
      console.error('Error printing:', error);
      alert('There was an error printing the ticket. Please try downloading instead.');
    }
  };

  const handleSendEmail = async () => {
    if (!ticketData.email) {
      alert('❌ No email address found for this ticket.');
      return;
    }

    try {
      setIsSending(true);
      console.log('📧 Sending appreciation email to:', ticketData.email);
      
      const result = await sendAppreciationEmail({
        toEmail: ticketData.email,
        passengerName: `${ticketData.firstName} ${ticketData.lastName}`,
        ticketData: ticketData
      });
      
      if (result.success) {
        alert(`✅ Email sent! Use code ${result.promoCode} for 10% off your next booking.`);
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('❌ Failed to send email. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleNewBooking = () => {
    resetForm();
    navigate('/');
  };

  const flightDetails = ticketData.flightDetails;
  const depFlight = flightDetails?.departure;
  const retFlight = flightDetails?.return;

  const formatTime = (isoString) => {
    if (!isoString) return '--:--';
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return '--:--';
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch {
      return '--:--';
    }
  };

  const formatDuration = (minutes) => {
    if (!minutes || isNaN(minutes)) return '--:--';
    const hrs = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hrs > 0 && mins > 0) return `${hrs}h ${mins}m`;
    if (hrs > 0) return `${hrs}h`;
    return `${mins}m`;
  };

  const renderFlightBox = (flight, isReturn = false) => {
    if (!flight) return null;
    
    const isConnecting = flight.stops > 0 && flight.stopoverDetails;
    const transit = flight.stopoverDetails;
    
    // Get times with fallbacks
    const depTime = formatTime(flight.departure?.time);
    const arrTime = formatTime(flight.arrival?.time);
    
    // Get transit times (from the data we added in routes.js)
    const transitArrivalTime = formatTime(transit?.arrivalTime);
    const transitDepartureTime = formatTime(transit?.departureTime);
    
    // Get leg durations
    const leg1Duration = flight.leg1Duration || 0;
    const leg2Duration = flight.leg2Duration || 0;

    let layoverStr = '';
    if (transit?.duration) {
      const hrs = Math.floor(transit.duration / 60);
      const mins = transit.duration % 60;
      layoverStr = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
    }

    return (
      <div className="ticket-flight-box" style={{ marginBottom: '1rem', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1rem' }}>
        {/* Flight Header */}
        <div className="flight-box-top" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>
          <span style={{ fontWeight: 'bold', color: '#0b2b40' }}>{flight.airline.name} ({flight.airline.code})</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#4b5563' }}>
            <Ticket size={13} /> {flight.flightNumber}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#4b5563' }}>
            <Armchair size={13} /> {flight.bookingClass}
          </span>
        </div>

        {isConnecting ? (
          <div className="multi-leg-container">
            {/* ===== LEG 1: Departure -> Transit ===== */}
            <div className="leg-segment" style={{ marginBottom: '0.5rem' }}>
              <div className="leg-badge-title" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '600', color: '#1a56db', marginBottom: '0.5rem' }}>
                <PlaneTakeoff size={14} /> <span>1. Departure → Transit</span>
              </div>
              <div className="flight-box-route" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div className="route-city-block" style={{ textAlign: 'center', minWidth: '100px' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#0b2b40' }}>{flight.departure.airport}</div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{flight.departure.city}</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#1a56db' }}>Depart: {depTime}</div>
                </div>

                <div className="route-path-middle" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1', minWidth: '80px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#6b7280' }}>{formatDuration(leg1Duration)}</span>
                  <div className="line-with-plane" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1a56db' }}></span>
                    <span style={{ flex: '1', height: '2px', background: '#d1d5db', minWidth: '30px' }}></span>
                    <Plane size={14} style={{ color: '#1a56db' }} />
                    <span style={{ flex: '1', height: '2px', background: '#d1d5db', minWidth: '30px' }}></span>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#dc2626' }}></span>
                  </div>
                </div>

                <div className="route-city-block right" style={{ textAlign: 'center', minWidth: '100px' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#0b2b40' }}>{transit.airport}</div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{transit.city}</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#dc2626' }}>Arrive: {transitArrivalTime}</div>
                </div>
              </div>
            </div>

            {/* Layover Indicator */}
            <div className="transit-layover-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '0.5rem', background: '#f3f4f6', borderRadius: '6px', margin: '0.5rem 0' }}>
              <Clock size={14} style={{ color: '#6b7280' }} /> 
              <span style={{ fontSize: '0.9rem', color: '#4b5563' }}>
                Layover at {transit.city} ({transit.airport}): <strong>{layoverStr}</strong>
              </span>
            </div>

            {/* ===== LEG 2: Transit -> Arrival ===== */}
            <div className="leg-segment" style={{ marginTop: '0.5rem' }}>
              <div className="leg-badge-title" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '600', color: '#dc2626', marginBottom: '0.5rem' }}>
                <PlaneLanding size={14} /> <span>2. Transit → Arrival</span>
              </div>
              <div className="flight-box-route" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div className="route-city-block" style={{ textAlign: 'center', minWidth: '100px' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#0b2b40' }}>{transit.airport}</div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{transit.city}</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#1a56db' }}>Depart: {transitDepartureTime}</div>
                </div>

                <div className="route-path-middle" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1', minWidth: '80px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#6b7280' }}>{formatDuration(leg2Duration)}</span>
                  <div className="line-with-plane" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1a56db' }}></span>
                    <span style={{ flex: '1', height: '2px', background: '#d1d5db', minWidth: '30px' }}></span>
                    <Plane size={14} style={{ color: '#dc2626' }} />
                    <span style={{ flex: '1', height: '2px', background: '#d1d5db', minWidth: '30px' }}></span>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#dc2626' }}></span>
                  </div>
                </div>

                <div className="route-city-block right" style={{ textAlign: 'center', minWidth: '100px' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#0b2b40' }}>{flight.arrival.airport}</div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{flight.arrival.city}</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#dc2626' }}>Arrive: {arrTime}</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Direct Flight */
          <div className="flight-box-route" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div className="route-city-block" style={{ textAlign: 'center', minWidth: '100px' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#0b2b40' }}>{flight.departure.airport}</div>
              <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{flight.departure.city}</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#1a56db' }}>Depart: {depTime}</div>
            </div>

            <div className="route-path-middle" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1', minWidth: '80px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#4b5563' }}>{flight.durationFormatted || formatDuration(flight.duration)}</span>
              <div className="line-with-plane" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', width: '100%' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1a56db' }}></span>
                <span style={{ flex: '1', height: '2px', background: '#d1d5db', minWidth: '30px' }}></span>
                <Plane size={14} style={{ color: '#1a56db' }} />
                <span style={{ flex: '1', height: '2px', background: '#d1d5db', minWidth: '30px' }}></span>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#dc2626' }}></span>
              </div>
              <span style={{ fontSize: '0.7rem', color: '#6b7280', background: '#e5e7eb', padding: '2px 8px', borderRadius: '12px' }}>Direct Non-stop</span>
            </div>

            <div className="route-city-block right" style={{ textAlign: 'center', minWidth: '100px' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#0b2b40' }}>{flight.arrival.airport}</div>
              <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{flight.arrival.city}</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#dc2626' }}>Arrive: {arrTime}</div>
            </div>
          </div>
        )}

        <div className="flight-box-meta" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid #e5e7eb', fontSize: '0.8rem', color: '#4b5563' }}>
          <span><strong>Aircraft:</strong> {flight.aircraft}</span>
          <span><strong>Terminal:</strong> {flight.departure?.terminal || '1'}</span>
          <span><strong>Gate:</strong> {flight.departure?.gate || 'A1'}</span>
          <span><strong>Seat:</strong> {flight.seat || 'Assigned at Check-in'}</span>
          {flight.meal && <span><strong>Meal:</strong> {flight.meal}</span>}
        </div>
      </div>
    );
  };

  return (
    <div className="ticket-preview" id="ticket-preview">
      <div className="ticket-header">
        <div className="success-icon">
          <CheckCircle size={36} color="#16a34a" />
        </div>
        <h2>Ticket Generated Successfully!</h2>
        <p>Your flight ticket generated using your selected route is ready for download or print</p>
      </div>

      <div className="ticket-card">
        {/* Reservation Header */}
        <div className="ticket-row">
          <div className="ticket-field">
            <label>Booking Reference</label>
            <span className="ticket-value">{ticketData.bookingReference}</span>
          </div>
          <div className="ticket-field">
            <label>Ticket Number</label>
            <span className="ticket-value">{ticketData.ticketNumber}</span>
          </div>
        </div>
        
        <div className="ticket-row">
          <div className="ticket-field">
            <label>Passenger Name</label>
            <span className="ticket-value">{ticketData.firstName} {ticketData.lastName}</span>
          </div>
          <div className="ticket-field">
            <label>Passport Number</label>
            <span className="ticket-value">{ticketData.passport}</span>
          </div>
        </div>

        {/* Selected Route Itinerary Section */}
        {depFlight && (
          <div className="ticket-route-breakdown">
            <div className="route-section-header" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem', fontSize: '1.1rem', fontWeight: 'bold', color: '#0b2b40' }}>
              <PlaneTakeoff size={16} /> <span>OUTBOUND FLIGHT ITINERARY</span>
            </div>
            {renderFlightBox(depFlight, false)}

            {/* Return Segment if Round Trip */}
            {ticketData.tripType === 'round' && retFlight && (
              <>
                <div className="route-section-header return-header" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '1rem', marginBottom: '0.75rem', fontSize: '1.1rem', fontWeight: 'bold', color: '#0b2b40' }}>
                  <PlaneLanding size={16} /> <span>RETURN FLIGHT ITINERARY</span>
                </div>
                {renderFlightBox(retFlight, true)}
              </>
            )}
          </div>
        )}
        
        <div className="ticket-row price-row">
          <div className="ticket-field">
            <label>Issue Date</label>
            <span className="ticket-value" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={14} color="#6b7280" /> {ticketData.issueDate || new Date().toISOString().split('T')[0]}
            </span>
          </div>
          <div className="ticket-field">
            <label>Validity (14 Days)</label>
            <span className="ticket-value" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: ticketData.status === 'expired' ? '#dc2626' : '#2563eb', fontWeight: 'bold' }}>
              <Hourglass size={14} /> Valid until {ticketData.expiryDate || (ticketData.issueDate ? new Date(new Date(ticketData.issueDate).getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : '14 Days')}
            </span>
          </div>
        </div>

        <div className="ticket-row price-row">
          <div className="ticket-field">
            <label>Total Price</label>
            <span className="ticket-value price">{ticketData.totalPrice}</span>
          </div>
          <div className="ticket-field">
            <label>GDS Status</label>
            {ticketData.status === 'expired' ? (
              <span className="status-badge expired" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#fee2e2', color: '#dc2626', borderColor: '#fca5a5' }}>
                <AlertTriangle size={14} /> <span>Expired (14 Days Passed)</span>
              </span>
            ) : (
              <span className="status-badge confirmed" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Check size={14} /> <span>Confirmed & Active</span>
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="ticket-actions">
        <button onClick={handleDownload} className="btn-download" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <FileDown size={16} /> <span>Download PDF</span>
        </button>
        
        <button onClick={handlePrint} className="btn-print" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Printer size={16} /> <span>Print Ticket</span>
        </button>

        <button 
          onClick={handleSendEmail} 
          className="btn-email"
          disabled={isSending}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <Mail size={16} /> 
          <span>{isSending ? 'Sending...' : 'Get Promo Code'}</span>
        </button>

        <button onClick={handleNewBooking} className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={16} /> <span>Book Another Ticket</span>
        </button>
      </div>
      
      <div className="ticket-disclaimer" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Info size={16} />
        <span>This is an official dummy ticket generated for visa application purposes. No actual flight seat is booked.</span>
      </div>
      
      <div className="ticket-helper">
        <h4>💡 Get 10% off your next booking!</h4>
        <p>Click "Get Promo Code" to receive a discount code via email.</p>
      </div>
    </div>
  );
};

export default TicketPreview;