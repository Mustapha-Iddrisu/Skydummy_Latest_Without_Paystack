// src/data/routes.js
import { airports } from './airports';
import { airlines } from './airlines';

// Common routes by continent pair
const commonRoutes = {
'North America-Europe': [
    { from: 'JFK', to: 'LHR' },
    { from: 'JFK', to: 'CDG' },
    { from: 'JFK', to: 'FRA' },
    { from: 'EWR', to: 'LHR' },
    { from: 'ORD', to: 'LHR' },
    { from: 'ORD', to: 'FRA' },
    { from: 'LAX', to: 'LHR' },
    { from: 'LAX', to: 'CDG' },
    { from: 'SFO', to: 'LHR' },
    { from: 'BOS', to: 'LHR' },
    { from: 'MIA', to: 'LHR' },
    { from: 'ATL', to: 'LHR' },
    { from: 'IAD', to: 'LHR' },
    { from: 'YYZ', to: 'LHR' },
    { from: 'YVR', to: 'LHR' },
    { from: 'MEX', to: 'MAD' },
    { from: 'MEX', to: 'LHR' },
  ],
  'Europe-Asia': [
    { from: 'LHR', to: 'DXB' },
    { from: 'LHR', to: 'SIN' },
    { from: 'LHR', to: 'HND' },
    { from: 'LHR', to: 'PEK' },
    { from: 'LHR', to: 'DEL' },
    { from: 'LHR', to: 'BOM' },
    { from: 'CDG', to: 'DXB' },
    { from: 'CDG', to: 'HND' },
    { from: 'FRA', to: 'DXB' },
    { from: 'FRA', to: 'ICN' },
    { from: 'FRA', to: 'PEK' },
    { from: 'AMS', to: 'DXB' },
    { from: 'AMS', to: 'SIN' },
    { from: 'MAD', to: 'DXB' },
    { from: 'IST', to: 'DXB' },
    { from: 'IST', to: 'KUL' },
  ],
  'Europe-Africa': [
    { from: 'LHR', to: 'JNB' },
    { from: 'LHR', to: 'NBO' },
    { from: 'LHR', to: 'ACC' },
    { from: 'LHR', to: 'LOS' },
    { from: 'LHR', to: 'CAI' },
    { from: 'LHR', to: 'ADD' },
    { from: 'LHR', to: 'CMN' },
    { from: 'CDG', to: 'NBO' },
    { from: 'CDG', to: 'JNB' },
    { from: 'FRA', to: 'JNB' },
    { from: 'FRA', to: 'NBO' },
    { from: 'AMS', to: 'ACC' },
    { from: 'AMS', to: 'LOS' },
    { from: 'MAD', to: 'CMN' },
  ],
  'Asia-Pacific': [
    { from: 'HND', to: 'SYD' },
    { from: 'HND', to: 'MEL' },
    { from: 'HND', to: 'AKL' },
    { from: 'NRT', to: 'SYD' },
    { from: 'NRT', to: 'MEL' },
    { from: 'ICN', to: 'SYD' },
    { from: 'ICN', to: 'AKL' },
    { from: 'SIN', to: 'SYD' },
    { from: 'SIN', to: 'MEL' },
    { from: 'SIN', to: 'AKL' },
    { from: 'KUL', to: 'SYD' },
    { from: 'BKK', to: 'SYD' },
    { from: 'HKG', to: 'SYD' },
    { from: 'PEK', to: 'SYD' },
  ],
  'Middle East-Asia': [
    { from: 'DXB', to: 'DEL' },
    { from: 'DXB', to: 'BOM' },
    { from: 'DXB', to: 'HND' },
    { from: 'DXB', to: 'ICN' },
    { from: 'DXB', to: 'PEK' },
    { from: 'DXB', to: 'SIN' },
    { from: 'DXB', to: 'BKK' },
    { from: 'DXB', to: 'KUL' },
    { from: 'AUH', to: 'DEL' },
    { from: 'DOH', to: 'DEL' },
    { from: 'DOH', to: 'HND' },
  ],
  'Middle East-Europe': [
    { from: 'DXB', to: 'LHR' },
    { from: 'DXB', to: 'CDG' },
    { from: 'DXB', to: 'FRA' },
    { from: 'DXB', to: 'AMS' },
    { from: 'AUH', to: 'LHR' },
    { from: 'AUH', to: 'CDG' },
    { from: 'DOH', to: 'LHR' },
    { from: 'DOH', to: 'CDG' },
  ],
  'North America-Asia': [
    { from: 'JFK', to: 'HND' },
    { from: 'JFK', to: 'ICN' },
    { from: 'JFK', to: 'PEK' },
    { from: 'JFK', to: 'SIN' },
    { from: 'LAX', to: 'HND' },
    { from: 'LAX', to: 'ICN' },
    { from: 'LAX', to: 'PEK' },
    { from: 'LAX', to: 'SIN' },
    { from: 'SFO', to: 'HND' },
    { from: 'SFO', to: 'ICN' },
    { from: 'ORD', to: 'HND' },
    { from: 'ORD', to: 'PEK' },
    { from: 'DFW', to: 'HND' },
  ],
  'South America-North America': [
    { from: 'GRU', to: 'MIA' },
    { from: 'GRU', to: 'JFK' },
    { from: 'GRU', to: 'ATL' },
    { from: 'GRU', to: 'LAX' },
    { from: 'EZE', to: 'MIA' },
    { from: 'EZE', to: 'JFK' },
    { from: 'SCL', to: 'MIA' },
    { from: 'SCL', to: 'JFK' },
    { from: 'BOG', to: 'MIA' },
    { from: 'BOG', to: 'JFK' },
    { from: 'LIM', to: 'LAX' },
  ],
  'Africa-Europe': [
    { from: 'ACC', to: 'LHR' },
    { from: 'ACC', to: 'CDG' },
    { from: 'ACC', to: 'AMS' },
    { from: 'LOS', to: 'LHR' },
    { from: 'LOS', to: 'CDG' },
    { from: 'NBO', to: 'LHR' },
    { from: 'NBO', to: 'CDG' },
    { from: 'JNB', to: 'LHR' },
    { from: 'JNB', to: 'CDG' },
    { from: 'CMN', to: 'MAD' },
    { from: 'CMN', to: 'LHR' },
    { from: 'CAI', to: 'LHR' },
    { from: 'CAI', to: 'CDG' },
    { from: 'ADD', to: 'LHR' },
    { from: 'ADD', to: 'FRA' },
  ],
  'Africa-Asia': [
    { from: 'NBO', to: 'DXB' },
    { from: 'NBO', to: 'DOH' },
    { from: 'NBO', to: 'AUH' },
    { from: 'ACC', to: 'DXB' },
    { from: 'LOS', to: 'DXB' },
    { from: 'JNB', to: 'DXB' },
    { from: 'CAI', to: 'DXB' },
    { from: 'CAI', to: 'RUH' },
    { from: 'ADD', to: 'DXB' },
    { from: 'ADD', to: 'DEL' },
    { from: 'CMN', to: 'DXB' },
    { from: 'CMN', to: 'JED' },
  ],
};


// Flight numbers by airline
const flightNumbers = {

  'AA': [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200],
  'UA': [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200],
  'DL': [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200],
  'BA': [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200],
  'LH': [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200],
  'AF': [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200],
  'KL': [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200],
  'EK': [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200],
  'SQ': [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200],
  'CX': [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200],
  'NH': [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200],
  'JL': [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200],
  'KE': [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200],
  'OZ': [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200],
  'QR': [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200],
  'EY': [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200],
  'TK': [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200],
  'ET': [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200],
  'KQ': [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200],
  'SA': [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200],
  'QF': [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200],
  'NZ': [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200],
  'LA': [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200],
  'AV': [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200],
  'AT': [500, 510, 520, 530, 540, 550, 560, 570, 580, 590, 600, 610, 620, 630, 640, 650],
  'MS': [700, 710, 720, 730, 740, 750, 760, 770, 780, 790, 800],
  'SV': [800, 810, 820, 830, 840, 850, 860, 870, 880, 890],
  'GF': [900, 910, 920, 930, 940, 950, 960, 970, 980, 990],
  'KU': [100, 110, 120, 130, 140, 150, 160, 170, 180, 190],
  'WY': [200, 210, 220, 230, 240, 250, 260, 270, 280, 290],
  'FZ': [300, 310, 320, 330, 340, 350, 360, 370, 380, 390],
};

// Aircraft types
const aircraftTypes = [
'BOEING 737-800 (WINGLETS)',
  'BOEING 787-800 / 787-8 DREAMLINER',
  'BOEING 777-300ER',
  'AIRBUS A320-200',
  'AIRBUS A330-300',
  'AIRBUS A380-800',
  'BOEING 767-300ER',
  'AIRBUS A350-900',
  'BOEING 747-400',
  'EMBRAER E190',
  'AIRBUS A321NEO',
  'BOEING 737 MAX 8',
  'BOEING 787-9 DREAMLINER',
  'AIRBUS A330-200',
  'BOEING 777-200ER',
  'AIRBUS A340-600'
];

// Booking classes
const bookingClasses = ['ECONOMY V', 'ECONOMY Y', 'ECONOMY W', 'PREMIUM ECONOMY', 'BUSINESS J', 'BUSINESS C', 'FIRST F'];

// Meal options
const mealOptions = ['Meal included', 'Snack service', 'Full meal service', 'Refreshments', 'Not Available'];

// Get airline by code
export const getAirlineByCode = (code) => {
  for (const continent in airlines) {
    const airline = airlines[continent].find(a => a.code === code);
    if (airline) return airline;
  }
  return null;
};

// Get random flight number for an airline
const getRandomFlightNumber = (airlineCode) => {
  const numbers = flightNumbers[airlineCode] || [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
  return numbers[Math.floor(Math.random() * numbers.length)];
};

// Get continent of an airport
const getAirportContinent = (airportCode) => {
  const airport = airports.find(a => a.code === airportCode);
  return airport ? airport.continent : null;
};

// Find route between two airports
const findRoute = (fromCode, toCode) => {
  for (const routeCategory in commonRoutes) {
    const route = commonRoutes[routeCategory].find(r => 
      r.from === fromCode && r.to === toCode
    );
    if (route) return route;
  }
  return null;
};

// Generate departure time between 6 AM and 11 PM
const generateDepartureTime = (date) => {
  const baseDate = new Date(date);
  const hours = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
  const selectedHour = hours[Math.floor(Math.random() * hours.length)];
  const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  const selectedMinute = minutes[Math.floor(Math.random() * minutes.length)];
  baseDate.setHours(selectedHour, selectedMinute, 0, 0);
  return baseDate;
};

// Estimate flight duration based on continents
const estimateFlightDuration = (fromAirport, toAirport) => {
  const continentPairs = {
    'North America-Europe': 420,
    'North America-Asia': 780,
    'North America-South America': 480,
    'North America-Africa': 540,
    'Europe-Asia': 540,
    'Europe-Africa': 360,
    'Europe-South America': 660,
    'Europe-Oceania': 1320,
    'Asia-Oceania': 480,
    'Asia-Africa': 540,
    'Asia-North America': 780,
    'Asia-South America': 1020,
    'Middle East-Asia': 300,
    'Middle East-Europe': 360,
    'Middle East-Africa': 360,
    'Middle East-North America': 720,
    'Oceania-Asia': 480,
    'Oceania-North America': 780,
    'Oceania-Europe': 1320,
    'South America-North America': 480,
    'South America-Europe': 660,
    'South America-Africa': 540,
    'Africa-Europe': 360,
    'Africa-Asia': 540,
    'Africa-North America': 540,
    'Africa-Middle East': 360,
  };

  const fromContinent = fromAirport.continent;
  const toContinent = toAirport.continent;
  
  const key = `${fromContinent}-${toContinent}`;
  const reverseKey = `${toContinent}-${fromContinent}`;
  
  let duration = continentPairs[key] || continentPairs[reverseKey];
  
  if (!duration) {
    if (fromContinent === toContinent) {
      duration = Math.floor(Math.random() * 180) + 60;
    } else {
      duration = Math.floor(Math.random() * 480) + 240;
    }
  }
  
  duration += Math.floor(Math.random() * 60) - 30;
  return Math.max(60, duration);
};

// Format duration in hours and minutes
const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}hr(s) ${mins}min(s)`;
};

// Generate flight data for a route with overrides
const generateFlightDataWithOverrides = (fromCode, toCode, departDate, passengers, overrideAirline = null, hour = null, isDirect = null) => {
  const fromAirport = airports.find(a => a.code === fromCode);
  const toAirport = airports.find(a => a.code === toCode);
  
  if (!fromAirport || !toAirport) {
    return generateDummyFlightData(fromCode, toCode, departDate, passengers);
  }

  const fromContinent = fromAirport.continent;
  let availableAirlines = [];
  
  if (fromContinent && airlines[fromContinent]) {
    availableAirlines = [...airlines[fromContinent]];
  }
  
  if (availableAirlines.length === 0 && toAirport.continent && airlines[toAirport.continent]) {
    availableAirlines = [...airlines[toAirport.continent]];
  }
  
  if (availableAirlines.length === 0) {
    availableAirlines = [
      { code: 'EK', name: 'Emirates', alliance: 'Independent' },
      { code: 'SQ', name: 'Singapore Airlines', alliance: 'Star Alliance' },
      { code: 'BA', name: 'British Airways', alliance: 'oneworld' },
      { code: 'TK', name: 'Turkish Airlines', alliance: 'Star Alliance' },
      { code: 'ET', name: 'Ethiopian Airlines', alliance: 'Star Alliance' },
      { code: 'QR', name: 'Qatar Airways', alliance: 'oneworld' },
      { code: 'AT', name: 'Royal Air Maroc', alliance: 'oneworld' },
    ];
  }

  const airline = overrideAirline || availableAirlines[Math.floor(Math.random() * availableAirlines.length)];
  const flightNumber = getRandomFlightNumber(airline.code);
  
  const baseDate = new Date(departDate);
  const selectedHour = hour !== null ? hour : [6, 8, 11, 14, 17, 20][Math.floor(Math.random() * 6)];
  const minutes = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
  baseDate.setHours(selectedHour, minutes, 0, 0);
  const departureTime = baseDate;

  const duration = estimateFlightDuration(fromAirport, toAirport);
  
  // Calculate total duration
  let totalDuration = duration;
  let leg1Duration = duration;
  let leg2Duration = 0;
  let stopoverDetails = null;
  
  // Determine if connecting flight
  const stops = isDirect === true ? 0 : (isDirect === false ? 1 : (Math.random() > 0.6 ? 1 : 0));
  
  if (stops > 0) {
    const possibleStops = airports.filter(a => 
      a.code !== fromCode && a.code !== toCode && 
      (a.continent === fromAirport.continent || a.continent === toAirport.continent)
    );
    if (possibleStops.length > 0) {
      const stopAirport = possibleStops[Math.floor(Math.random() * possibleStops.length)];
      
      // Calculate leg durations (split the total duration between legs)
      leg1Duration = Math.floor(duration * 0.4) + Math.floor(Math.random() * 60);
      leg2Duration = duration - leg1Duration;
      
      // Generate times for each leg
      const arrivalAtTransit = new Date(departureTime.getTime() + leg1Duration * 60000);
      const layoverDuration = Math.floor(Math.random() * 120) + 60;
      const departureFromTransit = new Date(arrivalAtTransit.getTime() + layoverDuration * 60000);
      
      stopoverDetails = {
        airport: stopAirport.code,
        city: stopAirport.city,
        country: stopAirport.country,
        duration: layoverDuration,
        // 🔥 NEW: Add arrival and departure times for the transit
        arrivalTime: arrivalAtTransit.toISOString(),
        departureTime: departureFromTransit.toISOString(),
      };
      
      totalDuration = leg1Duration + leg2Duration + layoverDuration;
    }
  }
  
  const arrivalTime = new Date(departureTime.getTime() + totalDuration * 60000);
  const gate = `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 20) + 1}`;
  const terminal = Math.floor(Math.random() * 3) + 1;
  const bookingClass = bookingClasses[Math.floor(Math.random() * 3)];
  const row = Math.floor(Math.random() * 40) + 1;
  const seatLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
  const seat = `${row}${seatLetters[Math.floor(Math.random() * seatLetters.length)]}`;

  const meal = mealOptions[Math.floor(Math.random() * mealOptions.length)];

  return {
    airline: {
      code: airline.code,
      name: airline.name,
      alliance: airline.alliance || 'Independent'
    },
    flightNumber: `${airline.code} ${flightNumber}`,
    departure: {
      airport: fromCode,
      city: fromAirport.city,
      country: fromAirport.country,
      time: departureTime.toISOString(),
      terminal: terminal,
      gate: gate
    },
    arrival: {
      airport: toCode,
      city: toAirport.city,
      country: toAirport.country,
      time: arrivalTime.toISOString(),
      terminal: Math.floor(Math.random() * 3) + 1,
      gate: `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 20) + 1}`
    },
    duration: totalDuration,
    durationFormatted: formatDuration(totalDuration),
    stops: stops,
    stopoverDetails: stopoverDetails,
    // 🔥 NEW: Add leg durations for multi-leg flights
    leg1Duration: leg1Duration,
    leg2Duration: leg2Duration,
    aircraft: aircraftTypes[Math.floor(Math.random() * aircraftTypes.length)],
    bookingClass: bookingClass,
    seat: seat,
    baggage: {
      carryOn: '1 piece (7kg)',
      checked: '1 piece (23kg)'
    },
    meal: meal,
    wifi: Math.random() > 0.3 ? 'Available' : 'Not Available',
    passengers: passengers
  };
};

// Generate flight data for a route
const generateFlightData = (fromCode, toCode, departDate, passengers) => {
  return generateFlightDataWithOverrides(fromCode, toCode, departDate, passengers);
};

// Fallback dummy data
const generateDummyFlightData = (fromCode, toCode, departDate, passengers) => {
  const fromAirport = airports.find(a => a.code === fromCode) || { code: fromCode, city: 'Unknown', country: 'Unknown', continent: 'Unknown' };
  const toAirport = airports.find(a => a.code === toCode) || { code: toCode, city: 'Unknown', country: 'Unknown', continent: 'Unknown' };
  
  const airline = { code: 'AT', name: 'Royal Air Maroc', alliance: 'oneworld' };
  const flightNumber = Math.floor(Math.random() * 900) + 100;
  const departureTime = generateDepartureTime(departDate);
  const duration = 180;
  const arrivalTime = new Date(departureTime.getTime() + duration * 60000);
  
  return {
    airline: airline,
    flightNumber: `${airline.code} ${flightNumber}`,
    departure: {
      airport: fromCode,
      city: fromAirport.city,
      country: fromAirport.country,
      time: departureTime.toISOString(),
      terminal: 1,
      gate: `A${Math.floor(Math.random() * 20) + 1}`
    },
    arrival: {
      airport: toCode,
      city: toAirport.city,
      country: toAirport.country,
      time: arrivalTime.toISOString(),
      terminal: 2,
      gate: `B${Math.floor(Math.random() * 20) + 1}`
    },
    duration: duration,
    durationFormatted: '3hr(s) 0min(s)',
    stops: 0,
    stopoverDetails: null,
    leg1Duration: duration,
    leg2Duration: 0,
    aircraft: 'BOEING 737-800 (WINGLETS)',
    bookingClass: 'ECONOMY V',
    seat: `${Math.floor(Math.random() * 30) + 1}${['A', 'B', 'C', 'D', 'E', 'F'][Math.floor(Math.random() * 6)]}`,
    baggage: {
      carryOn: '1 piece (7kg)',
      checked: '1 piece (23kg)'
    },
    meal: 'Meal included',
    wifi: 'Available',
    passengers: passengers
  };
};

// ============ MAIN EXPORT FUNCTIONS ============

// Get multiple flight route options for a route
export const getMultipleRouteOptions = (fromCode, toCode, departDate, returnDate = null, passengers = 1, tripType = 'oneway', count = 4) => {
  const fromAirport = airports.find(a => a.code === fromCode);
  const toAirport = airports.find(a => a.code === toCode);
  
  let availableAirlines = [];
  if (fromAirport?.continent && airlines[fromAirport.continent]) {
    availableAirlines = [...airlines[fromAirport.continent]];
  }
  if (toAirport?.continent && airlines[toAirport.continent]) {
    airlines[toAirport.continent].forEach(a => {
      if (!availableAirlines.find(x => x.code === a.code)) {
        availableAirlines.push(a);
      }
    });
  }
  
  if (availableAirlines.length < 4) {
    const globalAirlines = [
      { code: 'EK', name: 'Emirates', alliance: 'Independent' },
      { code: 'SQ', name: 'Singapore Airlines', alliance: 'Star Alliance' },
      { code: 'BA', name: 'British Airways', alliance: 'oneworld' },
      { code: 'TK', name: 'Turkish Airlines', alliance: 'Star Alliance' },
      { code: 'ET', name: 'Ethiopian Airlines', alliance: 'Star Alliance' },
      { code: 'QR', name: 'Qatar Airways', alliance: 'oneworld' },
      { code: 'DL', name: 'Delta Air Lines', alliance: 'SkyTeam' },
      { code: 'LH', name: 'Lufthansa', alliance: 'Star Alliance' },
      { code: 'AT', name: 'Royal Air Maroc', alliance: 'oneworld' },
    ];
    globalAirlines.forEach(a => {
      if (!availableAirlines.find(x => x.code === a.code)) {
        availableAirlines.push(a);
      }
    });
  }

  const hours = [7, 11, 15, 20];
  const routeOptions = [];

  for (let i = 0; i < count; i++) {
    const airline = availableAirlines[i % availableAirlines.length];
    const departureHour = hours[i % hours.length];
    const isDirect = i % 2 === 0;

    const departureFlight = generateFlightDataWithOverrides(
      fromCode,
      toCode,
      departDate,
      passengers,
      airline,
      departureHour,
      isDirect
    );

    let returnFlight = null;
    if (tripType === 'round') {
      const retDate = returnDate ? new Date(returnDate) : new Date(new Date(departDate).getTime() + 7 * 86400000);
      const returnHour = (departureHour + 4) % 24;
      returnFlight = generateFlightDataWithOverrides(
        toCode,
        fromCode,
        retDate,
        passengers,
        airline,
        returnHour,
        isDirect
      );
    }

    routeOptions.push({
      id: `route-${fromCode}-${toCode}-${i + 1}`,
      departure: departureFlight,
      return: returnFlight,
      tripType: tripType
    });
  }

  return routeOptions;
};

// Get flight details for a route
export const getFlightDetails = (fromCode, toCode, departDate, passengers = 1, tripType = 'oneway') => {
  console.log('Generating flight details for:', { fromCode, toCode, departDate, passengers, tripType });
  
  // Generate departure flight
  const departureFlight = generateFlightData(fromCode, toCode, departDate, passengers);
  
  // If one-way, return only departure
  if (tripType === 'oneway') {
    return {
      departure: departureFlight,
      return: null
    };
  }

  // Generate return flight (approximately 7-14 days later)
  const returnDate = new Date(departDate);
  returnDate.setDate(returnDate.getDate() + Math.floor(Math.random() * 7) + 7);
  
  const returnFlight = generateFlightData(toCode, fromCode, returnDate, passengers);
  
  return {
    departure: departureFlight,
    return: returnFlight
  };
};

// Get multiple flight options for a route
export const getMultipleFlightOptions = (fromCode, toCode, departDate, passengers = 1, count = 3) => {
  const options = [];
  for (let i = 0; i < count; i++) {
    options.push(generateFlightData(fromCode, toCode, departDate, passengers));
  }
  return options;
};

// Export additional utility functions
export const getRandomAirline = (continent) => {
  if (continent && airlines[continent]) {
    return airlines[continent][Math.floor(Math.random() * airlines[continent].length)];
  }
  // Fallback to major airlines
  const allAirlines = Object.values(airlines).flat();
  return allAirlines[Math.floor(Math.random() * allAirlines.length)];
};