// src/data/airlines.js
export const airlines = {
  // Full-service carriers
  'North America': [
    { code: 'AA', name: 'American Airlines', alliance: 'oneworld' },
    { code: 'UA', name: 'United Airlines', alliance: 'Star Alliance' },
    { code: 'DL', name: 'Delta Air Lines', alliance: 'SkyTeam' },
    { code: 'AC', name: 'Air Canada', alliance: 'Star Alliance' },
    { code: 'AM', name: 'Aeroméxico', alliance: 'SkyTeam' },
    { code: 'WN', name: 'Southwest Airlines', alliance: 'Independent' },
    { code: 'B6', name: 'JetBlue Airways', alliance: 'Independent' },
    { code: 'AS', name: 'Alaska Airlines', alliance: 'oneworld' },
    { code: 'WS', name: 'WestJet', alliance: 'Independent' },
  ],
  'Europe': [
    { code: 'BA', name: 'British Airways', alliance: 'oneworld' },
    { code: 'LH', name: 'Lufthansa', alliance: 'Star Alliance' },
    { code: 'AF', name: 'Air France', alliance: 'SkyTeam' },
    { code: 'KL', name: 'KLM Royal Dutch', alliance: 'SkyTeam' },
    { code: 'IB', name: 'Iberia', alliance: 'oneworld' },
    { code: 'TK', name: 'Turkish Airlines', alliance: 'Star Alliance' },
    { code: 'EK', name: 'Emirates', alliance: 'Independent' },
    { code: 'EY', name: 'Etihad Airways', alliance: 'Independent' },
    { code: 'QR', name: 'Qatar Airways', alliance: 'oneworld' },
    { code: 'SQ', name: 'Singapore Airlines', alliance: 'Star Alliance' },
    { code: 'CX', name: 'Cathay Pacific', alliance: 'oneworld' },
    { code: 'SK', name: 'SAS Scandinavian', alliance: 'Star Alliance' },
    { code: 'AY', name: 'Finnair', alliance: 'oneworld' },
    { code: 'OS', name: 'Austrian Airlines', alliance: 'Star Alliance' },
    { code: 'LX', name: 'Swiss International', alliance: 'Star Alliance' },
    { code: 'SN', name: 'Brussels Airlines', alliance: 'Star Alliance' },
    { code: 'TP', name: 'TAP Air Portugal', alliance: 'Star Alliance' },
    { code: 'A3', name: 'Aegean Airlines', alliance: 'Star Alliance' },
  ],
  'Asia': [
    { code: 'NH', name: 'All Nippon Airways', alliance: 'Star Alliance' },
    { code: 'JL', name: 'Japan Airlines', alliance: 'oneworld' },
    { code: 'KE', name: 'Korean Air', alliance: 'SkyTeam' },
    { code: 'OZ', name: 'Asiana Airlines', alliance: 'Star Alliance' },
    { code: 'MU', name: 'China Eastern', alliance: 'SkyTeam' },
    { code: 'CA', name: 'Air China', alliance: 'Star Alliance' },
    { code: 'CZ', name: 'China Southern', alliance: 'oneworld' },
    { code: 'HU', name: 'Hainan Airlines', alliance: 'Independent' },
    { code: 'BR', name: 'EVA Air', alliance: 'Star Alliance' },
    { code: 'CI', name: 'China Airlines', alliance: 'SkyTeam' },
    { code: 'TG', name: 'Thai Airways', alliance: 'Star Alliance' },
    { code: 'MH', name: 'Malaysia Airlines', alliance: 'oneworld' },
    { code: 'GA', name: 'Garuda Indonesia', alliance: 'SkyTeam' },
    { code: 'PR', name: 'Philippine Airlines', alliance: 'Independent' },
    { code: 'VN', name: 'Vietnam Airlines', alliance: 'SkyTeam' },
    { code: 'AI', name: 'Air India', alliance: 'Star Alliance' },
    { code: '6E', name: 'IndiGo', alliance: 'Independent' },
    { code: 'UK', name: 'Vistara', alliance: 'Star Alliance' },
    { code: 'FZ', name: 'Flydubai', alliance: 'Independent' },
  ],
  'Middle East': [
    { code: 'EK', name: 'Emirates', alliance: 'Independent' },
    { code: 'EY', name: 'Etihad Airways', alliance: 'Independent' },
    { code: 'QR', name: 'Qatar Airways', alliance: 'oneworld' },
    { code: 'GF', name: 'Gulf Air', alliance: 'Independent' },
    { code: 'KU', name: 'Kuwait Airways', alliance: 'Independent' },
    { code: 'SV', name: 'Saudia', alliance: 'SkyTeam' },
    { code: 'WY', name: 'Oman Air', alliance: 'Independent' },
    { code: 'FZ', name: 'Flydubai', alliance: 'Independent' },
  ],
  'Africa': [
    { code: 'SA', name: 'South African Airways', alliance: 'Star Alliance' },
    { code: 'KQ', name: 'Kenya Airways', alliance: 'SkyTeam' },
    { code: 'ET', name: 'Ethiopian Airlines', alliance: 'Star Alliance' },
    { code: 'MS', name: 'EgyptAir', alliance: 'Star Alliance' },
    { code: 'AT', name: 'Royal Air Maroc', alliance: 'oneworld' },
    { code: 'TU', name: 'Tunisair', alliance: 'Independent' },
    { code: 'AH', name: 'Air Algérie', alliance: 'Independent' },
    { code: 'TC', name: 'Air Tanzania', alliance: 'Independent' },
    { code: 'UG', name: 'Uganda Airlines', alliance: 'Independent' },
  ],
  'South America': [
    { code: 'LA', name: 'LATAM Airlines', alliance: 'oneworld' },
    { code: 'G3', name: 'Gol Transportes Aéreos', alliance: 'Independent' },
    { code: 'AR', name: 'Aerolíneas Argentinas', alliance: 'SkyTeam' },
    { code: 'AV', name: 'Avianca', alliance: 'Star Alliance' },
    { code: 'CM', name: 'Copa Airlines', alliance: 'Star Alliance' },
  ],
  'Oceania': [
    { code: 'QF', name: 'Qantas', alliance: 'oneworld' },
    { code: 'NZ', name: 'Air New Zealand', alliance: 'Star Alliance' },
    { code: 'VA', name: 'Virgin Australia', alliance: 'Independent' },
    { code: 'JQ', name: 'Jetstar Airways', alliance: 'Independent' },
  ]
};

// Get airlines by continent
export const getAirlinesByContinent = (continent) => {
  return airlines[continent] || airlines['Europe']; // Default to Europe if not found
};

// Get random airline from a continent
export const getRandomAirline = (continent) => {
  const airlineList = getAirlinesByContinent(continent);
  return airlineList[Math.floor(Math.random() * airlineList.length)];
};