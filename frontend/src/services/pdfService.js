// src/services/pdfService.js
import jsPDF from 'jspdf';

// Helper to get passenger details with passports
const getPassengerDetails = (ticketData) => {
  const details = [];
  
  if (ticketData.passengerList && ticketData.passengerList.length > 0) {
    ticketData.passengerList.forEach((p, index) => {
      const fullName = `${p.firstName || ''} ${p.lastName || ''}`.trim();
      details.push({
        name: fullName || `Passenger ${index + 1}`,
        passport: p.passport || 'N/A'
      });
    });
  } else {
    details.push({
      name: `${ticketData.firstName || 'Passenger'} ${ticketData.lastName || ''}`.trim() || 'Passenger',
      passport: ticketData.passport || 'N/A'
    });
  }
  
  return details;
};

export const generateTicketPDF = (ticketData, autoDownload = true) => {
  try {
    console.log('Generating PDF for:', ticketData);
    console.log('Trip type:', ticketData.tripType);
    console.log('Passengers:', ticketData.passengerCount || 1);
    
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Balanced margins - comfortable but compact
    const margin = {
      top: 15,
      bottom: 15,
      left: 15,
      right: 15
    };
    
    const contentWidth = pageWidth - margin.left - margin.right;
    let y = margin.top;

    // Helper to safely convert to string
    const safeString = (value) => {
      if (value === null || value === undefined) return 'N/A';
      return String(value);
    };

    // Helper to format date
    const formatDateLong = (date) => {
      if (!date) return 'N/A';
      const d = new Date(date);
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    };

    // Helper to add a line
    const addLine = (yPos) => {
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.4);
      doc.line(margin.left, yPos, pageWidth - margin.right, yPos);
    };

    // Helper to add a section header
    const addSection = (text, yPos, isReturn = false) => {
      if (isReturn) {
        doc.setFillColor(200, 16, 46);
      } else {
        doc.setFillColor(0, 51, 102);
      }
      doc.rect(margin.left, yPos - 4, contentWidth, 8, 'F');
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text(text, margin.left + 4, yPos + 2);
      doc.setTextColor(0, 0, 0);
      return yPos + 9;
    };

    // Helper to add flight details
    const addFlightDetails = (flight, yPos, isReturn = false) => {
      let currentY = yPos;
      
      // Airline and Flight number
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text(safeString(flight.airline?.name || 'Airline'), margin.left, currentY);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      doc.text(`Flight: ${safeString(flight.flightNumber || 'N/A')}  •  Class: ${safeString(flight.bookingClass || 'N/A')}`, margin.left + 65, currentY);
      currentY += 6;
      
      // Route
      const fromCode = safeString(flight.departure?.airport || 'N/A');
      const fromCity = safeString(flight.departure?.city || '');
      const fromCountry = safeString(flight.departure?.country || '');
      const toCode = safeString(flight.arrival?.airport || 'N/A');
      const toCity = safeString(flight.arrival?.city || '');
      const toCountry = safeString(flight.arrival?.country || '');
      
      if (flight.stops > 0 && flight.stopoverDetails) {
        const transit = flight.stopoverDetails;
        const hrs = Math.floor(transit.duration / 60);
        const mins = transit.duration % 60;
        const durStr = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;

        // Calculate Leg 1 and Leg 2 dates & durations
        const leg1DepTime = flight.departure?.time ? new Date(flight.departure.time) : null;
        let leg1ArrTime = transit.arrivalTime ? new Date(transit.arrivalTime) : null;
        let leg2DepTime = transit.departureTime ? new Date(transit.departureTime) : null;
        const leg2ArrTime = flight.arrival?.time ? new Date(flight.arrival.time) : null;
        
        let leg1DurMin = flight.leg1Duration;
        let leg2DurMin = flight.leg2Duration;

        if (!leg1DurMin && leg1DepTime && leg1ArrTime) {
          leg1DurMin = Math.round((leg1ArrTime - leg1DepTime) / 60000);
        }
        if (!leg2DurMin && leg2DepTime && leg2ArrTime) {
          leg2DurMin = Math.round((leg2ArrTime - leg2DepTime) / 60000);
        }

        const formatLegDur = (mins) => {
          if (!mins || isNaN(mins) || mins <= 0) return 'N/A';
          const h = Math.floor(mins / 60);
          const m = Math.round(mins % 60);
          if (h > 0 && m > 0) return `${h}h ${m}m`;
          if (h > 0) return `${h}h`;
          return `${m}m`;
        };

        const leg1DurStr = formatLegDur(leg1DurMin);
        const leg2DurStr = formatLegDur(leg2DurMin);

        // Leg 1: Departure -> Transit
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(2, 132, 199);
        doc.text('1. Departure -> Transit', margin.left, currentY);
        currentY += 4;

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text(`${fromCode} (${fromCity})`, margin.left, currentY);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(150, 150, 150);
        doc.text('→', margin.left + 70, currentY);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text(`${safeString(transit.airport)} (${safeString(transit.city)})`, margin.left + 85, currentY);
        currentY += 5;

        // Leg 1 Times & Duration
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(80, 80, 80);
        if (leg1DepTime && leg1ArrTime) {
          doc.text(`Depart: ${leg1DepTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`, margin.left, currentY);
          doc.text(`Arrive: ${leg1ArrTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`, margin.left + 50, currentY);
          doc.text(`Duration: ${leg1DurStr}`, margin.left + 105, currentY);
          currentY += 5;
        }

        // Layover
        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(100, 100, 100);
        doc.text(`   Layover at ${safeString(transit.city)} (${safeString(transit.airport)}): ${durStr}`, margin.left, currentY);
        currentY += 5;

        // Leg 2: Transit -> Arrival
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(2, 132, 199);
        doc.text('2. Transit -> Arrival', margin.left, currentY);
        currentY += 4;

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text(`${safeString(transit.airport)} (${safeString(transit.city)})`, margin.left, currentY);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(150, 150, 150);
        doc.text('→', margin.left + 70, currentY);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text(`${toCode} (${toCity})`, margin.left + 85, currentY);
        currentY += 5;

        // Leg 2 Times & Duration
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(80, 80, 80);
        if (leg2DepTime && leg2ArrTime) {
          doc.text(`Depart: ${leg2DepTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`, margin.left, currentY);
          doc.text(`Arrive: ${leg2ArrTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`, margin.left + 50, currentY);
          doc.text(`Duration: ${leg2DurStr}`, margin.left + 105, currentY);
          currentY += 5;
        }
      } else {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text(fromCode, margin.left, currentY);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text(`${fromCity}, ${fromCountry}`, margin.left + 28, currentY);
        
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(150, 150, 150);
        doc.text('→', margin.left + 80, currentY);
        
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text(toCode, margin.left + 95, currentY);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text(`${toCity}, ${toCountry}`, margin.left + 120, currentY);
        currentY += 6;

        // Times and duration for Direct Flights
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(80, 80, 80);
        
        if (flight.departure?.time && flight.arrival?.time) {
          const depTime = new Date(flight.departure.time);
          const arrTime = new Date(flight.arrival.time);
          
          doc.text(`Depart: ${depTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`, margin.left, currentY);
          doc.text(`Arrive: ${arrTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`, margin.left + 50, currentY);
          doc.text(`Duration: ${safeString(flight.durationFormatted || 'N/A')}`, margin.left + 105, currentY);
          currentY += 5;
        }
      }
      
      // Additional details
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(`Aircraft: ${safeString(flight.aircraft || 'N/A')}`, margin.left, currentY);
      doc.text(`Terminal: ${safeString(flight.departure?.terminal || 'N/A')}`, margin.left + 75, currentY);
      doc.text(`Gate: ${safeString(flight.departure?.gate || 'N/A')}`, margin.left + 120, currentY);
      currentY += 4;
      
      // Stops and Meals
      if (flight.stops > 0 && flight.stopoverDetails) {
        const hrs = Math.floor(flight.stopoverDetails.duration / 60);
        const mins = flight.stopoverDetails.duration % 60;
        const durStr = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
        doc.text(`Transit Stop: ${safeString(flight.stopoverDetails.city)}, ${safeString(flight.stopoverDetails.country)} (${safeString(flight.stopoverDetails.airport)}) - ${durStr} layover`, margin.left, currentY);
      } else {
        doc.text('Transit: Direct Non-stop Flight', margin.left, currentY);
      }
      doc.text(`Meals: ${safeString(flight.meal || 'Included')}`, margin.left + 115, currentY);
      currentY += 4;
      
      // Status
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 150, 0);
      doc.text('✓ Confirmed', margin.left, currentY);
      doc.setTextColor(100, 100, 100);
      currentY += 6;
      
      // Passenger details
      const passengerDetails = getPassengerDetails(ticketData);
      const passengerCount = ticketData.passengerCount || passengerDetails.length || 1;
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(100, 100, 100);
      
      if (passengerCount === 1) {
        // Single passenger - one line
        doc.text('Passenger:', margin.left, currentY);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        doc.text(passengerDetails[0]?.name || 'Passenger', margin.left + 32, currentY);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(100, 100, 100);
        doc.text('Passport:', margin.left + 110, currentY);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        doc.text(passengerDetails[0]?.passport || 'N/A', margin.left + 130, currentY);
        currentY += 5;
        
        // Seat and Booking on same line
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(100, 100, 100);
        doc.text('Seat:', margin.left, currentY);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        doc.text(safeString(flight.seat || 'Check-in required'), margin.left + 22, currentY);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(100, 100, 100);
        doc.text('Booking:', margin.left + 105, currentY);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 150, 0);
        doc.text('CONFIRMED', margin.left + 125, currentY);
        currentY += 5;
      } else if (passengerCount <= 3) {
        // 2-3 passengers - compact display
        doc.text(`Passengers (${passengerCount}):`, margin.left, currentY);
        currentY += 4;
        passengerDetails.forEach((p, index) => {
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(0, 0, 0);
          doc.text(`  ${index + 1}. ${p.name}`, margin.left, currentY);
          doc.setTextColor(100, 100, 100);
          doc.text(`Passport: ${p.passport}`, margin.left + 95, currentY);
          currentY += 4;
        });
        // Seat and Booking
        currentY += 1;
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(100, 100, 100);
        doc.text('Seat:', margin.left, currentY);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        doc.text(safeString(flight.seat || 'Check-in required'), margin.left + 22, currentY);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(100, 100, 100);
        doc.text('Booking:', margin.left + 105, currentY);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 150, 0);
        doc.text('CONFIRMED', margin.left + 125, currentY);
        currentY += 5;
      } else {
        // 4+ passengers - more compact
        doc.text(`Passengers (${passengerCount}):`, margin.left, currentY);
        currentY += 4;
        passengerDetails.slice(0, 4).forEach((p, index) => {
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(0, 0, 0);
          doc.text(`  ${index + 1}. ${p.name}`, margin.left, currentY);
          doc.setTextColor(100, 100, 100);
          doc.text(`Passport: ${p.passport}`, margin.left + 95, currentY);
          currentY += 4;
        });
        if (passengerCount > 4) {
          doc.setFont('helvetica', 'italic');
          doc.setTextColor(100, 100, 100);
          doc.text(`  + ${passengerCount - 4} more passenger(s)`, margin.left, currentY);
          currentY += 4;
        }
        currentY += 2;
      }
      
      doc.setTextColor(0, 0, 0);
      
      return currentY;
    };

    // ============ HEADER ============
    // Issued date and 14-day validity window
    const issueDateObj = ticketData.issueDate ? new Date(ticketData.issueDate) : new Date();
    const dateStr = issueDateObj.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    const expiryDateObj = ticketData.expiryDate 
      ? new Date(ticketData.expiryDate) 
      : new Date(issueDateObj.getTime() + 14 * 24 * 60 * 60 * 1000);
    const expiryStr = expiryDateObj.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`ISSUED: ${dateStr}  •  VALID UNTIL: ${expiryStr} (14 DAYS)`, pageWidth - margin.right - 80, y);
    y += 6;
    
    // Main Title
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 51, 102);
    const destination = ticketData.flightDetails?.departure?.arrival?.city || ticketData.destination || 'Unknown';
    doc.text(`TRIP TO ${safeString(destination).toUpperCase()}`, margin.left, y);
    y += 8;
    
    // Date range
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    const departDate = new Date(ticketData.departDate);
    const departDateStr = departDate.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    
    let dateRange = departDateStr;
    if (ticketData.tripType === 'round' && ticketData.returnDate) {
      const returnDate = new Date(ticketData.returnDate);
      const returnDateStr = returnDate.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
      dateRange = `${departDateStr} • ${returnDateStr}`;
    }
    doc.text(dateRange, margin.left, y);
    y += 8;
    
    // Passenger info
    const passengerDetails = getPassengerDetails(ticketData);
    const passengerCount = ticketData.passengerCount || passengerDetails.length || 1;
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 100, 100);
    
    if (passengerCount === 1) {
      doc.text('PREPARED FOR', margin.left, y);
      y += 4;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text(passengerDetails[0]?.name || 'Passenger', margin.left, y);
      y += 5;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(`Passport: ${passengerDetails[0]?.passport || 'N/A'}`, margin.left, y);
    } else {
      doc.text(`PREPARED FOR (${passengerCount} Passengers)`, margin.left, y);
      y += 5;
      const displayNames = passengerDetails.slice(0, 3);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text(displayNames.map(p => p.name).join(', '), margin.left, y);
      if (passengerDetails.length > 3) {
        y += 5;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text(`+ ${passengerDetails.length - 3} more passenger(s)`, margin.left, y);
      }
    }
    y += 6;
    
    // Reservation codes
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`RESERVATION CODE: ${safeString(ticketData.bookingReference)}`, margin.left, y);
    doc.text(`AIRLINE CODE: ${safeString(ticketData.bookingReference)}`, margin.left + 100, y);
    y += 6;
    
    addLine(y);
    y += 8;

    // ============ FLIGHT DETAILS ============
    const flightDetails = ticketData.flightDetails;
    
    if (flightDetails && flightDetails.departure) {
      // DEPARTURE FLIGHT
      const depFlight = flightDetails.departure;
      const depDateStr2 = formatDateLong(depFlight.departure?.time || ticketData.departDate);
      
      y = addSection(`DEPARTURE: ${depDateStr2.toUpperCase()}`, y, false);
      y = addFlightDetails(depFlight, y, false);
      
      // Add return flight ONLY if round trip
      if (ticketData.tripType === 'round' && flightDetails.return) {
        y += 4;
        addLine(y);
        y += 6;
        
        const retFlight = flightDetails.return;
        const retDateStr2 = formatDateLong(retFlight.departure?.time);
        
        y = addSection(`RETURN: ${retDateStr2.toUpperCase()}`, y, true);
        y = addFlightDetails(retFlight, y, true);
      }
    } else {
      y += 10;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(200, 16, 46);
      doc.text('FLIGHT DETAILS NOT AVAILABLE', margin.left, y);
      y += 10;
    }

    // ============ FOOTER ============
    // Add padding to push footer to bottom
    y = pageHeight - margin.bottom - 12;
    addLine(y);
    y += 4;
    
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150, 150, 150);
    doc.text('This is a ticket for visa application purposes only.', margin.left, y);
    doc.text('No actual flight reservation is made', margin.left, y + 3);
    
    y += 6;
    doc.setTextColor(100, 100, 100);
    const footerText = `SkyDummy • ${safeString(ticketData.bookingReference)}`;
    const footerWidth = doc.getTextWidth(footerText);
    doc.text(footerText, (pageWidth - footerWidth) / 2, y);

    const fileName = `SkyDummy_Ticket_${safeString(ticketData.bookingReference)}.pdf`;
    if (autoDownload) {
      console.log('Saving PDF as:', fileName);
      doc.save(fileName);
    }
    
    console.log('PDF generated successfully!');
    return doc;
    
  } catch (error) {
    console.error('Error in PDF generation:', error);
    console.error('Error stack:', error.stack);
    throw new Error(`PDF Generation Failed: ${error.message}`);
  }
};

// ============================================
// PRINT HTML GENERATION - Same as before
// ============================================

export const generatePrintHTML = (ticketData) => {
  const safeString = (value) => {
    if (value === null || value === undefined) return 'N/A';
    return String(value);
  };

  const getPassengerDetails = (data) => {
    const details = [];
    if (data.passengerList && data.passengerList.length > 0) {
      data.passengerList.forEach((p, index) => {
        const fullName = `${p.firstName || ''} ${p.lastName || ''}`.trim();
        details.push({
          name: fullName || `Passenger ${index + 1}`,
          passport: p.passport || 'N/A'
        });
      });
    } else {
      details.push({
        name: `${data.firstName || 'Passenger'} ${data.lastName || ''}`.trim() || 'Passenger',
        passport: data.passport || 'N/A'
      });
    }
    return details;
  };

  const passengerDetails = getPassengerDetails(ticketData);
  const passengerCount = ticketData.passengerCount || passengerDetails.length || 1;

  const formatDateWithYear = (date) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const destination = ticketData.flightDetails?.departure?.arrival?.city || ticketData.destination || 'Unknown';
  const flightDetails = ticketData.flightDetails;
  
  const departDateStr = new Date(ticketData.departDate).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  
  let dateRange = departDateStr;
  if (ticketData.tripType === 'round' && ticketData.returnDate) {
    const returnDateStr = new Date(ticketData.returnDate).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    dateRange = `${departDateStr} • ${returnDateStr}`;
  }

  const buildPassengerDisplay = () => {
    if (passengerCount === 1) {
      return `${passengerDetails[0]?.name || 'Passenger'} (Passport: ${passengerDetails[0]?.passport || 'N/A'})`;
    } else {
      return passengerDetails.map(p => `${p.name} (Passport: ${p.passport})`).join('; ');
    }
  };

  const buildFlightHTML = (flight, isReturn = false) => {
    const dateStr = formatDateWithYear(flight.departure?.time);
    
    const depTime = flight.departure?.time ? new Date(flight.departure.time) : null;
    const arrTime = flight.arrival?.time ? new Date(flight.arrival.time) : null;

    // Multi-leg times calculation
    const transit = flight.stopoverDetails;
    let leg1DepTime = depTime;
    let leg1ArrTime = transit?.arrivalTime ? new Date(transit.arrivalTime) : null;
    let leg2DepTime = transit?.departureTime ? new Date(transit.departureTime) : null;
    let leg2ArrTime = arrTime;

    let leg1DurMin = flight.leg1Duration;
    let leg2DurMin = flight.leg2Duration;

    if (!leg1DurMin && leg1DepTime && leg1ArrTime) {
      leg1DurMin = Math.round((leg1ArrTime - leg1DepTime) / 60000);
    }
    if (!leg2DurMin && leg2DepTime && leg2ArrTime) {
      leg2DurMin = Math.round((leg2ArrTime - leg2DepTime) / 60000);
    }

    const formatLegDur = (mins) => {
      if (!mins || isNaN(mins) || mins <= 0) return 'N/A';
      const h = Math.floor(mins / 60);
      const m = Math.round(mins % 60);
      if (h > 0 && m > 0) return `${h}h ${m}m`;
      if (h > 0) return `${h}h`;
      return `${m}m`;
    };
    
    return `
      <div class="flight-section ${isReturn ? 'return' : ''}">
        <div class="flight-header ${isReturn ? 'return-header' : ''}">
          <h2>${isReturn ? 'RETURN' : 'DEPARTURE'}: ${dateStr.toUpperCase()}</h2>
          <p class="flight-verify">Please verify flight times prior to departure</p>
        </div>
        
        <div class="flight-airline">
          <h3>${safeString(flight.airline?.name || 'Airline')}</h3>
          <p class="flight-number">Flight: ${safeString(flight.flightNumber || 'N/A')} • Class: ${safeString(flight.bookingClass || 'N/A')}</p>
        </div>
        
        ${flight.stops > 0 && flight.stopoverDetails ? `
          <div class="multi-leg-print-box">
            <div class="leg-box">
              <div class="leg-title">1. Departure → Transit</div>
              <div class="flight-route">
                <div class="route-point">
                  <span class="airport-code">${safeString(flight.departure?.airport || 'N/A')}</span>
                  <span class="airport-location">${safeString(flight.departure?.city || '')}, ${safeString(flight.departure?.country || '')}</span>
                </div>
                <div class="route-arrow">
                  <span>→</span>
                  <span class="duration">Leg 1 • ${formatLegDur(leg1DurMin)}</span>
                </div>
                <div class="route-point">
                  <span class="airport-code">${safeString(flight.stopoverDetails.airport)}</span>
                  <span class="airport-location">${safeString(flight.stopoverDetails.city)}, ${safeString(flight.stopoverDetails.country)}</span>
                </div>
              </div>
              <div class="leg-times-row">
                <span><strong>Depart:</strong> ${leg1DepTime ? leg1DepTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</span>
                <span><strong>Arrive:</strong> ${leg1ArrTime ? leg1ArrTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</span>
                <span><strong>Duration:</strong> ${formatLegDur(leg1DurMin)}</span>
              </div>
            </div>

            <div class="layover-bar">
              ⏱ Layover at ${safeString(flight.stopoverDetails.city)} (${safeString(flight.stopoverDetails.airport)}): <strong>${Math.floor(flight.stopoverDetails.duration / 60)}h ${flight.stopoverDetails.duration % 60}m</strong>
            </div>

            <div class="leg-box">
              <div class="leg-title">2. Transit → Arrival</div>
              <div class="flight-route">
                <div class="route-point">
                  <span class="airport-code">${safeString(flight.stopoverDetails.airport)}</span>
                  <span class="airport-location">${safeString(flight.stopoverDetails.city)}, ${safeString(flight.stopoverDetails.country)}</span>
                </div>
                <div class="route-arrow">
                  <span>→</span>
                  <span class="duration">Leg 2 • ${formatLegDur(leg2DurMin)}</span>
                </div>
                <div class="route-point">
                  <span class="airport-code">${safeString(flight.arrival?.airport || 'N/A')}</span>
                  <span class="airport-location">${safeString(flight.arrival?.city || '')}, ${safeString(flight.arrival?.country || '')}</span>
                </div>
              </div>
              <div class="leg-times-row">
                <span><strong>Depart:</strong> ${leg2DepTime ? leg2DepTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</span>
                <span><strong>Arrive:</strong> ${leg2ArrTime ? leg2ArrTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</span>
                <span><strong>Duration:</strong> ${formatLegDur(leg2DurMin)}</span>
              </div>
            </div>
          </div>
        ` : `
          <div class="flight-route">
            <div class="route-point">
              <span class="airport-code">${safeString(flight.departure?.airport || 'N/A')}</span>
              <span class="airport-location">${safeString(flight.departure?.city || '')}, ${safeString(flight.departure?.country || '')}</span>
            </div>
            <div class="route-arrow">
              <span>→</span>
              <span class="duration">Duration: ${safeString(flight.durationFormatted || 'N/A')}</span>
            </div>
            <div class="route-point">
              <span class="airport-code">${safeString(flight.arrival?.airport || 'N/A')}</span>
              <span class="airport-location">${safeString(flight.arrival?.city || '')}, ${safeString(flight.arrival?.country || '')}</span>
            </div>
          </div>
        `}
        
        <div class="flight-details-grid">
          <div class="detail-item">
            <label>Aircraft:</label>
            <span>${safeString(flight.aircraft || 'N/A')}</span>
          </div>
          <div class="detail-item">
            <label>Status:</label>
            <span class="status-confirmed">Confirmed</span>
          </div>
          ${depTime ? `
            <div class="detail-item">
              <label>Departing At:</label>
              <span>${depTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          ` : ''}
          ${arrTime ? `
            <div class="detail-item">
              <label>Arriving At:</label>
              <span>${arrTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          ` : ''}
          <div class="detail-item">
            <label>Terminal:</label>
            <span>${safeString(flight.departure?.terminal || 'N/A')}</span>
          </div>
          <div class="detail-item">
            <label>Gate:</label>
            <span>${safeString(flight.departure?.gate || 'N/A')}</span>
          </div>
          <div class="detail-item">
            <label>Transit / Stops:</label>
            <span>${flight.stops > 0 && flight.stopoverDetails ? `${flight.stopoverDetails.city}, ${flight.stopoverDetails.country} (${flight.stopoverDetails.airport})` : 'Direct Non-stop'}</span>
          </div>
          <div class="detail-item">
            <label>Meals:</label>
            <span>${safeString(flight.meal || 'Not Available')}</span>
          </div>
        </div>
        
        <div class="passenger-details">
          <div class="detail-row">
            <label>${passengerCount === 1 ? 'Passenger:' : `Passengers (${passengerCount}):`}</label>
            <span>${buildPassengerDisplay()}</span>
          </div>
          <div class="detail-row">
            <label>Seats:</label>
            <span>${safeString(flight.seat || 'Check-in required')}</span>
          </div>
          <div class="detail-row">
            <label>Booking:</label>
            <span class="status-confirmed">CONFIRMED</span>
          </div>
        </div>
      </div>
    `;
  };

  let flightHTML = '';
  
  if (flightDetails && flightDetails.departure) {
    flightHTML += buildFlightHTML(flightDetails.departure, false);
    
    if (ticketData.tripType === 'round' && flightDetails.return) {
      flightHTML += `<hr>`;
      flightHTML += buildFlightHTML(flightDetails.return, true);
    }
  } else {
    flightHTML = `
      <div class="flight-not-available">
        <h3>FLIGHT DETAILS NOT AVAILABLE</h3>
        <p>Please contact support for assistance.</p>
      </div>
    `;
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>SkyDummy Ticket - ${ticketData.bookingReference}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Helvetica', 'Arial', sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          color: #333;
          background: white;
        }
        .ticket-container { background: white; padding: 20px; }
        
        .header {
          margin-bottom: 15px;
          padding-bottom: 12px;
          border-bottom: 2px solid #003366;
        }
        .header .issued {
          text-align: right;
          color: #999;
          font-size: 9px;
          margin-bottom: 3px;
        }
        .header h1 { font-size: 22px; color: #003366; font-weight: bold; margin-bottom: 3px; }
        .header .destination {
          font-size: 26px;
          color: #C8102E;
          font-weight: bold;
          margin-bottom: 3px;
        }
        .header .date-range { font-size: 12px; color: #666; }
        
        .passenger-info {
          margin: 12px 0;
          padding: 10px 15px;
          background: #f5f6f8;
          border-radius: 6px;
        }
        .passenger-info .label {
          font-size: 8px;
          font-weight: bold;
          color: #999;
          text-transform: uppercase;
        }
        .passenger-info .name { font-size: 16px; font-weight: bold; margin: 4px 0; }
        .passenger-info .codes { font-size: 10px; color: #666; }
        
        .flight-section { margin: 15px 0; page-break-inside: avoid; }
        .flight-header {
          background: #003366;
          padding: 5px 10px;
          border-radius: 4px 4px 0 0;
        }
        .flight-header.return-header {
          background: #C8102E;
        }
        .flight-header h2 {
          font-size: 13px;
          color: white;
          font-weight: bold;
        }
        .flight-verify {
          font-size: 7px;
          color: rgba(255,255,255,0.8);
          font-style: italic;
        }
        .flight-airline { margin: 6px 0; }
        .flight-airline h3 { font-size: 16px; font-weight: bold; margin-bottom: 2px; }
        .flight-number { font-size: 11px; color: #666; }
        
        .flight-route {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f8f9fa;
          padding: 10px 15px;
          border-radius: 6px;
          margin: 6px 0;
        }
        .route-point { display: flex; flex-direction: column; align-items: center; }
        .airport-code { font-size: 18px; font-weight: bold; color: #003366; }
        .airport-location { font-size: 9px; color: #666; }
        .route-arrow {
          display: flex;
          flex-direction: column;
          align-items: center;
          color: #ccc;
          font-size: 16px;
        }
        .duration { font-size: 9px; color: #999; font-style: italic; }
        
        .multi-leg-print-box { display: flex; flex-direction: column; gap: 6px; margin: 6px 0; }
        .leg-box { background: #f8f9fa; padding: 8px 12px; border-radius: 6px; border: 1px solid #e2e8f0; }
        .leg-title { font-size: 10px; font-weight: bold; color: #003366; text-transform: uppercase; margin-bottom: 4px; }
        .leg-times-row {
          display: flex;
          justify-content: space-between;
          padding-top: 6px;
          margin-top: 4px;
          border-top: 1px dashed #cbd5e1;
          font-size: 11px;
          color: #475569;
        }
        .leg-times-row strong { color: #1e293b; }
        .layover-bar { background: #e0f2fe; color: #0369a1; font-size: 10px; padding: 5px; border-radius: 4px; text-align: center; }
        
        .flight-details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          gap: 4px;
          margin: 6px 0;
          padding: 10px;
          background: #f8f9fa;
          border-radius: 6px;
        }
        .detail-item { display: flex; flex-direction: column; }
        .detail-item label {
          font-size: 7px;
          text-transform: uppercase;
          color: #999;
          font-weight: bold;
        }
        .detail-item span { font-size: 10px; font-weight: 500; }
        .status-confirmed { color: #28a745; font-weight: bold; }
        
        .passenger-details {
          background: #f5f6f8;
          padding: 10px 15px;
          border-radius: 6px;
          margin-top: 6px;
        }
        .detail-row {
          display: flex;
          padding: 3px 0;
          font-size: 11px;
        }
        .detail-row label {
          font-weight: bold;
          color: #666;
          width: 80px;
        }
        .detail-row span { color: #333; }
        
        hr { border: none; border-top: 2px solid #ddd; margin: 15px 0; }
        
        .footer {
          margin-top: 20px;
          padding-top: 12px;
          border-top: 1px solid #ddd;
          font-size: 8px;
          color: #999;
          text-align: center;
        }
        
        @media print {
          body { padding: 0; }
          .ticket-container { padding: 10px; }
          .flight-section { page-break-inside: avoid; }
          .flight-route, .flight-details-grid, .passenger-info, .passenger-details {
            background: #f8f9fa !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .flight-header {
            background: #003366 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .flight-header.return-header {
            background: #C8102E !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      </style>
    </head>
    <body>
      <div class="ticket-container">
        <div class="header">
          <div class="issued">ISSUED: ${new Date(ticketData.issueDate || Date.now()).toLocaleDateString('en-US', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric' 
          })} &bull; VALID UNTIL: ${new Date(ticketData.expiryDate || (Date.now() + 14*24*60*60*1000)).toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })} (14 DAYS)</div>
          <h1>TRIP TO</h1>
          <div class="destination">${destination.toUpperCase()}</div>
          <div class="date-range">${dateRange}</div>
        </div>
        
        <div class="passenger-info">
          <div class="label">${passengerCount === 1 ? 'PREPARED FOR' : `PREPARED FOR (${passengerCount} Passengers)`}</div>
          <div class="name">${buildPassengerDisplay()}</div>
          <div class="codes">RESERVATION CODE: ${ticketData.bookingReference} &bull; VALIDITY: 14 DAYS (EXPIRES ${ticketData.expiryDate || 'N/A'})</div>
          <div class="codes">AIRLINE CODE: ${ticketData.bookingReference}</div>
        </div>
        
        ${flightHTML}
        
        <div class="footer">
          <div>This is a ticket for visa application purposes only.</div>
          <div>No actual flight reservation is made.</div>
          <div style="margin-top: 3px;">SkyDummy • support@skydummy.com</div>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const generateTicketHTML = generatePrintHTML;

export default {
  generateTicketPDF,
  generatePrintHTML,
  generateTicketHTML
};