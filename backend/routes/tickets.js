import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '../data/tickets.json');

// Ensure data directory exists
const dataDir = path.dirname(DATA_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initial sample tickets
const sampleNow = new Date();
const sampleIssue = sampleNow.toISOString().split('T')[0];
const sampleExpiresAtDate = new Date(sampleNow.getTime() + 14 * 24 * 60 * 60 * 1000);
const sampleExpiresAt = sampleExpiresAtDate.toISOString();
const sampleExpiryDate = sampleExpiresAtDate.toISOString().split('T')[0];

const SAMPLE_TICKETS = [
  {
    bookingReference: 'PNR-77A9X2',
    ticketNumber: 'SKY88204910',
    status: 'confirmed',
    issueDate: sampleIssue,
    expiryDate: sampleExpiryDate,
    expiresAt: sampleExpiresAt,
    validityDays: 14,
    createdAt: sampleNow.toISOString(),
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

// Helper to load tickets
const loadTickets = () => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      const data = JSON.parse(content);
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.error('Error reading tickets file:', err);
  }
  return SAMPLE_TICKETS;
};

// Helper to save tickets
const saveTickets = (tickets) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(tickets, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving tickets file:', err);
  }
};

// GET /api/tickets - Search or list
router.get('/', (req, res) => {
  const { pnr, lastName } = req.query;
  const tickets = loadTickets();

  if (!pnr) {
    return res.json({ success: true, count: tickets.length, tickets: tickets.slice(0, 50) });
  }

  const queryRef = pnr.trim().toUpperCase();
  const queryName = lastName ? lastName.trim().toLowerCase() : '';

  const match = tickets.find(t => {
    const refMatch = t.bookingReference?.toUpperCase() === queryRef || 
                     t.ticketNumber?.toUpperCase() === queryRef ||
                     t.bookingReference?.replace('-', '')?.toUpperCase() === queryRef.replace('-', '');
    
    let nameMatch = true;
    if (queryName) {
      const mainLast = t.lastName?.toLowerCase() || '';
      const listLast = t.passengerList?.some(p => p.lastName?.toLowerCase() === queryName);
      nameMatch = mainLast.includes(queryName) || listLast;
    }

    return refMatch && nameMatch;
  });

  if (match) {
    return res.json({ success: true, found: true, ticket: match });
  } else {
    return res.status(404).json({ success: false, found: false, message: 'Ticket not found for given PNR' });
  }
});

// GET /api/tickets/:pnr - Lookup by PNR parameter
router.get('/:pnr', (req, res) => {
  const queryRef = req.params.pnr.trim().toUpperCase();
  const tickets = loadTickets();

  const match = tickets.find(t => 
    t.bookingReference?.toUpperCase() === queryRef || 
    t.ticketNumber?.toUpperCase() === queryRef ||
    t.bookingReference?.replace('-', '')?.toUpperCase() === queryRef.replace('-', '')
  );

  if (match) {
    return res.json({ success: true, found: true, ticket: match });
  } else {
    return res.status(404).json({ success: false, found: false, message: 'Ticket not found' });
  }
});

// POST /api/tickets - Register a new ticket (called when ticket is generated)
router.post('/', (req, res) => {
  const newTicket = req.body;
  if (!newTicket || (!newTicket.bookingReference && !newTicket.ticketNumber)) {
    return res.status(400).json({ success: false, message: 'Invalid ticket data' });
  }

  const tickets = loadTickets();
  
  // Remove existing duplicate if present
  const filtered = tickets.filter(t => 
    t.bookingReference !== newTicket.bookingReference && 
    t.ticketNumber !== newTicket.ticketNumber
  );

  filtered.unshift(newTicket);
  saveTickets(filtered.slice(0, 200));

  console.log(`Registered ticket ${newTicket.bookingReference} / ${newTicket.ticketNumber} on server store`);
  res.json({ success: true, message: 'Ticket registered successfully on PNR verification server', ticket: newTicket });
});

export default router;
