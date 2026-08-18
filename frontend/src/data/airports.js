// src/data/airports.js
export const airports = [
  // ============================================
  // NORTH AMERICA
  // ============================================
  
  // USA
  { code: 'ATL', name: 'Hartsfield-Jackson Atlanta International', city: 'Atlanta', country: 'USA', continent: 'North America' },
  { code: 'LAX', name: 'Los Angeles International', city: 'Los Angeles', country: 'USA', continent: 'North America' },
  { code: 'ORD', name: "O'Hare International", city: 'Chicago', country: 'USA', continent: 'North America' },
  { code: 'DFW', name: 'Dallas/Fort Worth International', city: 'Dallas', country: 'USA', continent: 'North America' },
  { code: 'DEN', name: 'Denver International', city: 'Denver', country: 'USA', continent: 'North America' },
  { code: 'JFK', name: 'John F. Kennedy International', city: 'New York', country: 'USA', continent: 'North America' },
  { code: 'SFO', name: 'San Francisco International', city: 'San Francisco', country: 'USA', continent: 'North America' },
  { code: 'SEA', name: 'Seattle-Tacoma International', city: 'Seattle', country: 'USA', continent: 'North America' },
  { code: 'LAS', name: 'Harry Reid International', city: 'Las Vegas', country: 'USA', continent: 'North America' },
  { code: 'MIA', name: 'Miami International', city: 'Miami', country: 'USA', continent: 'North America' },
  { code: 'PHX', name: 'Phoenix Sky Harbor International', city: 'Phoenix', country: 'USA', continent: 'North America' },
  { code: 'IAH', name: 'George Bush Intercontinental', city: 'Houston', country: 'USA', continent: 'North America' },
  { code: 'EWR', name: 'Newark Liberty International', city: 'Newark', country: 'USA', continent: 'North America' },
  { code: 'MSP', name: 'Minneapolis-Saint Paul International', city: 'Minneapolis', country: 'USA', continent: 'North America' },
  { code: 'DTW', name: 'Detroit Metropolitan Wayne County', city: 'Detroit', country: 'USA', continent: 'North America' },
  { code: 'BOS', name: 'Boston Logan International', city: 'Boston', country: 'USA', continent: 'North America' },
  { code: 'CLT', name: 'Charlotte Douglas International', city: 'Charlotte', country: 'USA', continent: 'North America' },
  { code: 'SLC', name: 'Salt Lake City International', city: 'Salt Lake City', country: 'USA', continent: 'North America' },
  { code: 'SAN', name: 'San Diego International', city: 'San Diego', country: 'USA', continent: 'North America' },
  { code: 'TPA', name: 'Tampa International', city: 'Tampa', country: 'USA', continent: 'North America' },
  { code: 'PDX', name: 'Portland International', city: 'Portland', country: 'USA', continent: 'North America' },
  { code: 'STL', name: 'St. Louis Lambert International', city: 'St. Louis', country: 'USA', continent: 'North America' },
  { code: 'BWI', name: 'Baltimore/Washington International', city: 'Baltimore', country: 'USA', continent: 'North America' },
  { code: 'DCA', name: 'Ronald Reagan Washington National', city: 'Washington', country: 'USA', continent: 'North America' },
  { code: 'IAD', name: 'Washington Dulles International', city: 'Washington', country: 'USA', continent: 'North America' },
  { code: 'AUS', name: 'Austin-Bergstrom International', city: 'Austin', country: 'USA', continent: 'North America' },
  { code: 'SJC', name: 'San Jose International', city: 'San Jose', country: 'USA', continent: 'North America' },
  { code: 'OAK', name: 'Oakland International', city: 'Oakland', country: 'USA', continent: 'North America' },
  { code: 'FLL', name: 'Fort Lauderdale-Hollywood International', city: 'Fort Lauderdale', country: 'USA', continent: 'North America' },
  { code: 'MCO', name: 'Orlando International', city: 'Orlando', country: 'USA', continent: 'North America' },
  { code: 'HNL', name: 'Daniel K. Inouye International', city: 'Honolulu', country: 'USA', continent: 'North America' },
  { code: 'ANC', name: 'Ted Stevens Anchorage International', city: 'Anchorage', country: 'USA', continent: 'North America' },
  { code: 'MSY', name: 'Louis Armstrong New Orleans International', city: 'New Orleans', country: 'USA', continent: 'North America' },
  { code: 'SJU', name: 'Luis Muñoz Marín International', city: 'San Juan', country: 'Puerto Rico', continent: 'North America' },
  
  // Canada
  { code: 'YYZ', name: 'Toronto Pearson International', city: 'Toronto', country: 'Canada', continent: 'North America' },
  { code: 'YVR', name: 'Vancouver International', city: 'Vancouver', country: 'Canada', continent: 'North America' },
  { code: 'YUL', name: 'Montréal-Pierre Elliott Trudeau', city: 'Montreal', country: 'Canada', continent: 'North America' },
  { code: 'YYC', name: 'Calgary International', city: 'Calgary', country: 'Canada', continent: 'North America' },
  { code: 'YEG', name: 'Edmonton International', city: 'Edmonton', country: 'Canada', continent: 'North America' },
  { code: 'YOW', name: 'Ottawa Macdonald-Cartier International', city: 'Ottawa', country: 'Canada', continent: 'North America' },
  { code: 'YHZ', name: 'Halifax Stanfield International', city: 'Halifax', country: 'Canada', continent: 'North America' },
  { code: 'YWG', name: 'Winnipeg James Armstrong Richardson', city: 'Winnipeg', country: 'Canada', continent: 'North America' },
  { code: 'YQB', name: 'Québec City Jean Lesage International', city: 'Quebec City', country: 'Canada', continent: 'North America' },
  
  // Mexico
  { code: 'MEX', name: 'Mexico City International', city: 'Mexico City', country: 'Mexico', continent: 'North America' },
  { code: 'CUN', name: 'Cancún International', city: 'Cancún', country: 'Mexico', continent: 'North America' },
  { code: 'GDL', name: 'Guadalajara International', city: 'Guadalajara', country: 'Mexico', continent: 'North America' },
  { code: 'MTY', name: 'Monterrey International', city: 'Monterrey', country: 'Mexico', continent: 'North America' },
  { code: 'TIJ', name: 'Tijuana International', city: 'Tijuana', country: 'Mexico', continent: 'North America' },
  { code: 'PVR', name: 'Licenciado Gustavo Díaz Ordaz', city: 'Puerto Vallarta', country: 'Mexico', continent: 'North America' },
  { code: 'SJD', name: 'Los Cabos International', city: 'San José del Cabo', country: 'Mexico', continent: 'North America' },
  { code: 'BJX', name: 'Bajío International', city: 'León', country: 'Mexico', continent: 'North America' },
  
  // Central America & Caribbean
  { code: 'PTY', name: 'Tocumen International', city: 'Panama City', country: 'Panama', continent: 'North America' },
  { code: 'SJO', name: 'Juan Santamaría International', city: 'San José', country: 'Costa Rica', continent: 'North America' },
  { code: 'GUA', name: 'La Aurora International', city: 'Guatemala City', country: 'Guatemala', continent: 'North America' },
  { code: 'SAL', name: 'El Salvador International', city: 'San Salvador', country: 'El Salvador', continent: 'North America' },
  { code: 'KIN', name: 'Norman Manley International', city: 'Kingston', country: 'Jamaica', continent: 'North America' },
  { code: 'MBJ', name: 'Sangster International', city: 'Montego Bay', country: 'Jamaica', continent: 'North America' },
  { code: 'NAS', name: 'Lynden Pindling International', city: 'Nassau', country: 'Bahamas', continent: 'North America' },
  { code: 'PUJ', name: 'Punta Cana International', city: 'Punta Cana', country: 'Dominican Republic', continent: 'North America' },
  { code: 'SDQ', name: 'Las Américas International', city: 'Santo Domingo', country: 'Dominican Republic', continent: 'North America' },
  { code: 'HOG', name: 'Frank País International', city: 'Holguín', city: 'Holguín', country: 'Cuba', continent: 'North America' },
  { code: 'VRA', name: 'Juan Gualberto Gómez International', city: 'Varadero', country: 'Cuba', continent: 'North America' },

  // ============================================
  // SOUTH AMERICA
  // ============================================
  
  // Brazil
  { code: 'GRU', name: 'São Paulo Guarulhos International', city: 'São Paulo', country: 'Brazil', continent: 'South America' },
  { code: 'GIG', name: 'Rio de Janeiro–Galeão International', city: 'Rio de Janeiro', country: 'Brazil', continent: 'South America' },
  { code: 'BSB', name: 'Brasília International', city: 'Brasília', country: 'Brazil', continent: 'South America' },
  { code: 'CNF', name: 'Belo Horizonte International', city: 'Belo Horizonte', country: 'Brazil', continent: 'South America' },
  { code: 'POA', name: 'Salgado Filho International', city: 'Porto Alegre', country: 'Brazil', continent: 'South America' },
  { code: 'REC', name: 'Recife International', city: 'Recife', country: 'Brazil', continent: 'South America' },
  { code: 'FOR', name: 'Fortaleza International', city: 'Fortaleza', country: 'Brazil', continent: 'South America' },
  { code: 'MAO', name: 'Eduardo Gomes International', city: 'Manaus', country: 'Brazil', continent: 'South America' },
  { code: 'CWB', name: 'Afonso Pena International', city: 'Curitiba', country: 'Brazil', continent: 'South America' },
  
  // Argentina
  { code: 'EZE', name: 'Ezeiza International', city: 'Buenos Aires', country: 'Argentina', continent: 'South America' },
  { code: 'AEP', name: 'Jorge Newbery Airpark', city: 'Buenos Aires', country: 'Argentina', continent: 'South America' },
  { code: 'COR', name: 'Ingeniero Aeronáutico Ambrosio Taravella', city: 'Córdoba', country: 'Argentina', continent: 'South America' },
  { code: 'MDZ', name: 'El Plumerillo International', city: 'Mendoza', country: 'Argentina', continent: 'South America' },
  { code: 'BRC', name: 'San Carlos de Bariloche Airport', city: 'Bariloche', country: 'Argentina', continent: 'South America' },
  
  // Colombia
  { code: 'BOG', name: 'El Dorado International', city: 'Bogotá', country: 'Colombia', continent: 'South America' },
  { code: 'MDE', name: 'José María Córdova International', city: 'Medellín', country: 'Colombia', continent: 'South America' },
  { code: 'CLO', name: 'Alfonso Bonilla Aragón International', city: 'Cali', country: 'Colombia', continent: 'South America' },
  { code: 'CTG', name: 'Rafael Núñez International', city: 'Cartagena', country: 'Colombia', continent: 'South America' },
  { code: 'BAQ', name: 'Ernesto Cortissoz International', city: 'Barranquilla', country: 'Colombia', continent: 'South America' },
  
  // Chile
  { code: 'SCL', name: 'Arturo Merino Benítez International', city: 'Santiago', country: 'Chile', continent: 'South America' },
  { code: 'PUQ', name: 'Presidente Carlos Ibáñez del Campo', city: 'Punta Arenas', country: 'Chile', continent: 'South America' },
  { code: 'CCP', name: 'Carriel Sur International', city: 'Concepción', country: 'Chile', continent: 'South America' },
  
  // Peru
  { code: 'LIM', name: 'Jorge Chávez International', city: 'Lima', country: 'Peru', continent: 'South America' },
  { code: 'CUZ', name: 'Alejandro Velasco Astete International', city: 'Cusco', country: 'Peru', continent: 'South America' },
  
  // Venezuela
  { code: 'CCS', name: 'Simón Bolívar International', city: 'Caracas', country: 'Venezuela', continent: 'South America' },
  
  // Ecuador
  { code: 'UIO', name: 'Mariscal Sucre International', city: 'Quito', country: 'Ecuador', continent: 'South America' },
  { code: 'GYE', name: 'José Joaquín de Olmedo International', city: 'Guayaquil', country: 'Ecuador', continent: 'South America' },
  
  // Other South American
  { code: 'VVI', name: 'Viru Viru International', city: 'Santa Cruz', country: 'Bolivia', continent: 'South America' },
  { code: 'ASU', name: 'Silvio Pettirossi International', city: 'Asunción', country: 'Paraguay', continent: 'South America' },
  { code: 'MVD', name: 'Carrasco International', city: 'Montevideo', country: 'Uruguay', continent: 'South America' },

  // ============================================
  // EUROPE
  // ============================================
  
  // United Kingdom
  { code: 'LHR', name: 'London Heathrow', city: 'London', country: 'UK', continent: 'Europe' },
  { code: 'LGW', name: 'London Gatwick', city: 'London', country: 'UK', continent: 'Europe' },
  { code: 'MAN', name: 'Manchester International', city: 'Manchester', country: 'UK', continent: 'Europe' },
  { code: 'STN', name: 'London Stansted', city: 'London', country: 'UK', continent: 'Europe' },
  { code: 'LTN', name: 'London Luton', city: 'London', country: 'UK', continent: 'Europe' },
  { code: 'EDI', name: 'Edinburgh International', city: 'Edinburgh', country: 'UK', continent: 'Europe' },
  { code: 'GLA', name: 'Glasgow International', city: 'Glasgow', country: 'UK', continent: 'Europe' },
  { code: 'BHX', name: 'Birmingham International', city: 'Birmingham', country: 'UK', continent: 'Europe' },
  { code: 'BRS', name: 'Bristol International', city: 'Bristol', country: 'UK', continent: 'Europe' },
  { code: 'LBA', name: 'Leeds Bradford International', city: 'Leeds', country: 'UK', continent: 'Europe' },
  
  // France
  { code: 'CDG', name: 'Charles de Gaulle', city: 'Paris', country: 'France', continent: 'Europe' },
  { code: 'ORY', name: 'Orly International', city: 'Paris', country: 'France', continent: 'Europe' },
  { code: 'NCE', name: 'Nice Côte d\'Azur', city: 'Nice', country: 'France', continent: 'Europe' },
  { code: 'MRS', name: 'Marseille Provence', city: 'Marseille', country: 'France', continent: 'Europe' },
  { code: 'LYS', name: 'Lyon-Saint Exupéry', city: 'Lyon', country: 'France', continent: 'Europe' },
  { code: 'TLS', name: 'Toulouse-Blagnac', city: 'Toulouse', country: 'France', continent: 'Europe' },
  { code: 'BOD', name: 'Bordeaux-Mérignac', city: 'Bordeaux', country: 'France', continent: 'Europe' },
  { code: 'SXB', name: 'Strasbourg International', city: 'Strasbourg', country: 'France', continent: 'Europe' },
  
  // Germany
  { code: 'FRA', name: 'Frankfurt International', city: 'Frankfurt', country: 'Germany', continent: 'Europe' },
  { code: 'MUC', name: 'Munich International', city: 'Munich', country: 'Germany', continent: 'Europe' },
  { code: 'BER', name: 'Berlin Brandenburg', city: 'Berlin', country: 'Germany', continent: 'Europe' },
  { code: 'DUS', name: 'Düsseldorf International', city: 'Düsseldorf', country: 'Germany', continent: 'Europe' },
  { code: 'HAM', name: 'Hamburg International', city: 'Hamburg', country: 'Germany', continent: 'Europe' },
  { code: 'STR', name: 'Stuttgart International', city: 'Stuttgart', country: 'Germany', continent: 'Europe' },
  { code: 'CGN', name: 'Cologne Bonn', city: 'Cologne', country: 'Germany', continent: 'Europe' },
  { code: 'NUE', name: 'Nuremberg International', city: 'Nuremberg', country: 'Germany', continent: 'Europe' },
  { code: 'LEJ', name: 'Leipzig/Halle International', city: 'Leipzig', country: 'Germany', continent: 'Europe' },
  
  // Italy
  { code: 'FCO', name: 'Leonardo da Vinci International', city: 'Rome', country: 'Italy', continent: 'Europe' },
  { code: 'MXP', name: 'Milan Malpensa', city: 'Milan', country: 'Italy', continent: 'Europe' },
  { code: 'VCE', name: 'Venice Marco Polo', city: 'Venice', country: 'Italy', continent: 'Europe' },
  { code: 'NAP', name: 'Naples International', city: 'Naples', country: 'Italy', continent: 'Europe' },
  { code: 'BLQ', name: 'Bologna Guglielmo Marconi', city: 'Bologna', country: 'Italy', continent: 'Europe' },
  { code: 'FLR', name: 'Florence International', city: 'Florence', country: 'Italy', continent: 'Europe' },
  { code: 'PMO', name: 'Palermo International', city: 'Palermo', country: 'Italy', continent: 'Europe' },
  { code: 'CTA', name: 'Catania-Fontanarossa', city: 'Catania', country: 'Italy', continent: 'Europe' },
  
  // Spain
  { code: 'MAD', name: 'Madrid Barajas', city: 'Madrid', country: 'Spain', continent: 'Europe' },
  { code: 'BCN', name: 'Barcelona El Prat', city: 'Barcelona', country: 'Spain', continent: 'Europe' },
  { code: 'PMI', name: 'Palma de Mallorca', city: 'Palma de Mallorca', country: 'Spain', continent: 'Europe' },
  { code: 'AGP', name: 'Málaga-Costa del Sol', city: 'Málaga', country: 'Spain', continent: 'Europe' },
  { code: 'ALC', name: 'Alicante-Elche', city: 'Alicante', country: 'Spain', continent: 'Europe' },
  { code: 'LPA', name: 'Gran Canaria', city: 'Las Palmas', country: 'Spain', continent: 'Europe' },
  { code: 'TFN', name: 'Tenerife North', city: 'Tenerife', country: 'Spain', continent: 'Europe' },
  { code: 'TFS', name: 'Tenerife South', city: 'Tenerife', country: 'Spain', continent: 'Europe' },
  { code: 'SVQ', name: 'Seville International', city: 'Seville', country: 'Spain', continent: 'Europe' },
  { code: 'VLC', name: 'Valencia International', city: 'Valencia', country: 'Spain', continent: 'Europe' },
  
  // Netherlands
  { code: 'AMS', name: 'Amsterdam Schiphol', city: 'Amsterdam', country: 'Netherlands', continent: 'Europe' },
  { code: 'EIN', name: 'Eindhoven Airport', city: 'Eindhoven', country: 'Netherlands', continent: 'Europe' },
  { code: 'RTM', name: 'Rotterdam The Hague', city: 'Rotterdam', country: 'Netherlands', continent: 'Europe' },
  
  // Switzerland
  { code: 'ZRH', name: 'Zurich International', city: 'Zurich', country: 'Switzerland', continent: 'Europe' },
  { code: 'GVA', name: 'Geneva International', city: 'Geneva', country: 'Switzerland', continent: 'Europe' },
  { code: 'BSL', name: 'Basel-Mulhouse-Freiburg', city: 'Basel', country: 'Switzerland', continent: 'Europe' },
  
  // Austria
  { code: 'VIE', name: 'Vienna International', city: 'Vienna', country: 'Austria', continent: 'Europe' },
  { code: 'SZG', name: 'Salzburg Airport', city: 'Salzburg', country: 'Austria', continent: 'Europe' },
  { code: 'INN', name: 'Innsbruck International', city: 'Innsbruck', country: 'Austria', continent: 'Europe' },
  
  // Belgium
  { code: 'BRU', name: 'Brussels National', city: 'Brussels', country: 'Belgium', continent: 'Europe' },
  { code: 'ANR', name: 'Antwerp International', city: 'Antwerp', country: 'Belgium', continent: 'Europe' },
  
  // Denmark
  { code: 'CPH', name: 'Copenhagen Kastrup', city: 'Copenhagen', country: 'Denmark', continent: 'Europe' },
  { code: 'BLL', name: 'Billund International', city: 'Billund', country: 'Denmark', continent: 'Europe' },
  
  // Sweden
  { code: 'ARN', name: 'Stockholm Arlanda', city: 'Stockholm', country: 'Sweden', continent: 'Europe' },
  { code: 'GOT', name: 'Gothenburg Landvetter', city: 'Gothenburg', country: 'Sweden', continent: 'Europe' },
  { code: 'MMX', name: 'Malmö International', city: 'Malmö', country: 'Sweden', continent: 'Europe' },
  
  // Norway
  { code: 'OSL', name: 'Oslo Gardermoen', city: 'Oslo', country: 'Norway', continent: 'Europe' },
  { code: 'BGO', name: 'Bergen Flesland', city: 'Bergen', country: 'Norway', continent: 'Europe' },
  { code: 'TRD', name: 'Trondheim Værnes', city: 'Trondheim', country: 'Norway', continent: 'Europe' },
  
  // Finland
  { code: 'HEL', name: 'Helsinki Vantaa', city: 'Helsinki', country: 'Finland', continent: 'Europe' },
  
  // Ireland
  { code: 'DUB', name: 'Dublin International', city: 'Dublin', country: 'Ireland', continent: 'Europe' },
  { code: 'ORK', name: 'Cork International', city: 'Cork', country: 'Ireland', continent: 'Europe' },
  { code: 'SNN', name: 'Shannon International', city: 'Shannon', country: 'Ireland', continent: 'Europe' },
  
  // Portugal
  { code: 'LIS', name: 'Lisbon Humberto Delgado', city: 'Lisbon', country: 'Portugal', continent: 'Europe' },
  { code: 'OPO', name: 'Porto International', city: 'Porto', country: 'Portugal', continent: 'Europe' },
  { code: 'FNC', name: 'Madeira International', city: 'Funchal', country: 'Portugal', continent: 'Europe' },
  { code: 'PDL', name: 'Azores International', city: 'Ponta Delgada', country: 'Portugal', continent: 'Europe' },
  
  // Greece
  { code: 'ATH', name: 'Athens International', city: 'Athens', country: 'Greece', continent: 'Europe' },
  { code: 'SKG', name: 'Thessaloniki International', city: 'Thessaloniki', country: 'Greece', continent: 'Europe' },
  { code: 'HER', name: 'Heraklion International', city: 'Heraklion', country: 'Greece', continent: 'Europe' },
  { code: 'RHO', name: 'Rhodes International', city: 'Rhodes', country: 'Greece', continent: 'Europe' },
  
  // Turkey
  { code: 'IST', name: 'Istanbul International', city: 'Istanbul', country: 'Turkey', continent: 'Europe' },
  { code: 'SAW', name: 'Sabiha Gökçen International', city: 'Istanbul', country: 'Turkey', continent: 'Europe' },
  { code: 'AYT', name: 'Antalya International', city: 'Antalya', country: 'Turkey', continent: 'Europe' },
  { code: 'ESB', name: 'Esenboğa International', city: 'Ankara', country: 'Turkey', continent: 'Europe' },
  
  // Russia
  { code: 'SVO', name: 'Sheremetyevo International', city: 'Moscow', country: 'Russia', continent: 'Europe' },
  { code: 'DME', name: 'Domodedovo International', city: 'Moscow', country: 'Russia', continent: 'Europe' },
  { code: 'VKO', name: 'Vnukovo International', city: 'Moscow', country: 'Russia', continent: 'Europe' },
  { code: 'LED', name: 'Pulkovo International', city: 'St. Petersburg', country: 'Russia', continent: 'Europe' },
  
  // Other European
  { code: 'PRG', name: 'Václav Havel International', city: 'Prague', country: 'Czech Republic', continent: 'Europe' },
  { code: 'BUD', name: 'Budapest Ferenc Liszt', city: 'Budapest', country: 'Hungary', continent: 'Europe' },
  { code: 'WAW', name: 'Warsaw Chopin', city: 'Warsaw', country: 'Poland', continent: 'Europe' },
  { code: 'KRK', name: 'Kraków John Paul II', city: 'Kraków', country: 'Poland', continent: 'Europe' },
  { code: 'VIE', name: 'Vienna International', city: 'Vienna', country: 'Austria', continent: 'Europe' },
  { code: 'ZAG', name: 'Zagreb International', city: 'Zagreb', country: 'Croatia', continent: 'Europe' },
  { code: 'DBV', name: 'Dubrovnik International', city: 'Dubrovnik', country: 'Croatia', continent: 'Europe' },
  { code: 'BEG', name: 'Belgrade Nikola Tesla', city: 'Belgrade', country: 'Serbia', continent: 'Europe' },
  { code: 'SOF', name: 'Sofia International', city: 'Sofia', country: 'Bulgaria', continent: 'Europe' },
  { code: 'OTP', name: 'Henri Coandă International', city: 'Bucharest', country: 'Romania', continent: 'Europe' },
  { code: 'KIV', name: 'Chișinău International', city: 'Chisinau', city: 'Chișinău', country: 'Moldova', continent: 'Europe' },
  
  // ============================================
  // ASIA
  // ============================================
  
  // China
  { code: 'PEK', name: 'Beijing Capital International', city: 'Beijing', country: 'China', continent: 'Asia' },
  { code: 'PKX', name: 'Beijing Daxing International', city: 'Beijing', country: 'China', continent: 'Asia' },
  { code: 'PVG', name: 'Shanghai Pudong International', city: 'Shanghai', country: 'China', continent: 'Asia' },
  { code: 'SHA', name: 'Shanghai Hongqiao International', city: 'Shanghai', country: 'China', continent: 'Asia' },
  { code: 'CAN', name: 'Guangzhou Baiyun International', city: 'Guangzhou', country: 'China', continent: 'Asia' },
  { code: 'SZX', name: 'Shenzhen Bao\'an International', city: 'Shenzhen', country: 'China', continent: 'Asia' },
  { code: 'CTU', name: 'Chengdu Shuangliu International', city: 'Chengdu', country: 'China', continent: 'Asia' },
  { code: 'TFU', name: 'Chengdu Tianfu International', city: 'Chengdu', country: 'China', continent: 'Asia' },
  { code: 'XMN', name: 'Xiamen Gaoqi International', city: 'Xiamen', country: 'China', continent: 'Asia' },
  { code: 'HGH', name: 'Hangzhou Xiaoshan International', city: 'Hangzhou', country: 'China', continent: 'Asia' },
  { code: 'NGB', name: 'Ningbo Lishe International', city: 'Ningbo', country: 'China', continent: 'Asia' },
  { code: 'XIY', name: 'Xi\'an Xianyang International', city: 'Xi\'an', country: 'China', continent: 'Asia' },
  { code: 'NKG', name: 'Nanjing Lukou International', city: 'Nanjing', country: 'China', continent: 'Asia' },
  { code: 'CKG', name: 'Chongqing Jiangbei International', city: 'Chongqing', country: 'China', continent: 'Asia' },
  { code: 'KMG', name: 'Kunming Changshui International', city: 'Kunming', country: 'China', continent: 'Asia' },
  { code: 'HRB', name: 'Harbin Taiping International', city: 'Harbin', country: 'China', continent: 'Asia' },
  { code: 'SHE', name: 'Shenyang Taoxian International', city: 'Shenyang', country: 'China', continent: 'Asia' },
  { code: 'DLC', name: 'Dalian Zhoushuizi International', city: 'Dalian', country: 'China', continent: 'Asia' },
  { code: 'TNA', name: 'Jinan Yaoqiang International', city: 'Jinan', country: 'China', continent: 'Asia' },
  { code: 'WUH', name: 'Wuhan Tianhe International', city: 'Wuhan', country: 'China', continent: 'Asia' },
  { code: 'CSX', name: 'Changsha Huanghua International', city: 'Changsha', country: 'China', continent: 'Asia' },
  { code: 'URC', name: 'Ürümqi Diwopu International', city: 'Ürümqi', country: 'China', continent: 'Asia' },
  { code: 'KWL', name: 'Guilin Liangjiang International', city: 'Guilin', country: 'China', continent: 'Asia' },
  
  // Hong Kong
  { code: 'HKG', name: 'Hong Kong International', city: 'Hong Kong', country: 'Hong Kong', continent: 'Asia' },
  
  // Taiwan
  { code: 'TPE', name: 'Taiwan Taoyuan International', city: 'Taipei', country: 'Taiwan', continent: 'Asia' },
  { code: 'KHH', name: 'Kaohsiung International', city: 'Kaohsiung', country: 'Taiwan', continent: 'Asia' },
  { code: 'RMQ', name: 'Taichung International', city: 'Taichung', country: 'Taiwan', continent: 'Asia' },
  
  // Japan
  { code: 'HND', name: 'Tokyo Haneda', city: 'Tokyo', country: 'Japan', continent: 'Asia' },
  { code: 'NRT', name: 'Narita International', city: 'Tokyo', country: 'Japan', continent: 'Asia' },
  { code: 'KIX', name: 'Kansai International', city: 'Osaka', country: 'Japan', continent: 'Asia' },
  { code: 'ITM', name: 'Osaka International', city: 'Osaka', country: 'Japan', continent: 'Asia' },
  { code: 'NGO', name: 'Chubu Centrair International', city: 'Nagoya', country: 'Japan', continent: 'Asia' },
  { code: 'CTS', name: 'New Chitose International', city: 'Sapporo', country: 'Japan', continent: 'Asia' },
  { code: 'OKA', name: 'Naha International', city: 'Okinawa', country: 'Japan', continent: 'Asia' },
  { code: 'FUK', name: 'Fukuoka International', city: 'Fukuoka', country: 'Japan', continent: 'Asia' },
  
  // South Korea
  { code: 'ICN', name: 'Incheon International', city: 'Seoul', country: 'South Korea', continent: 'Asia' },
  { code: 'GMP', name: 'Gimpo International', city: 'Seoul', country: 'South Korea', continent: 'Asia' },
  { code: 'PUS', name: 'Gimhae International', city: 'Busan', country: 'South Korea', continent: 'Asia' },
  { code: 'CJU', name: 'Jeju International', city: 'Jeju Island', country: 'South Korea', continent: 'Asia' },
  
  // Singapore
  { code: 'SIN', name: 'Singapore Changi', city: 'Singapore', country: 'Singapore', continent: 'Asia' },
  
  // Malaysia
  { code: 'KUL', name: 'Kuala Lumpur International', city: 'Kuala Lumpur', country: 'Malaysia', continent: 'Asia' },
  { code: 'PEN', name: 'Penang International', city: 'Penang', country: 'Malaysia', continent: 'Asia' },
  { code: 'BKI', name: 'Kota Kinabalu International', city: 'Kota Kinabalu', country: 'Malaysia', continent: 'Asia' },
  
  // Thailand
  { code: 'BKK', name: 'Suvarnabhumi International', city: 'Bangkok', country: 'Thailand', continent: 'Asia' },
  { code: 'DMK', name: 'Don Mueang International', city: 'Bangkok', country: 'Thailand', continent: 'Asia' },
  { code: 'HKT', name: 'Phuket International', city: 'Phuket', country: 'Thailand', continent: 'Asia' },
  { code: 'CNX', name: 'Chiang Mai International', city: 'Chiang Mai', country: 'Thailand', continent: 'Asia' },
  { code: 'PHS', name: 'Phitsanulok Airport', city: 'Phitsanulok', country: 'Thailand', continent: 'Asia' },
  
  // Indonesia
  { code: 'CGK', name: 'Soekarno-Hatta International', city: 'Jakarta', country: 'Indonesia', continent: 'Asia' },
  { code: 'DPS', name: 'Ngurah Rai International', city: 'Bali', country: 'Indonesia', continent: 'Asia' },
  { code: 'SUB', name: 'Juanda International', city: 'Surabaya', country: 'Indonesia', continent: 'Asia' },
  { code: 'KNO', name: 'Kualanamu International', city: 'Medan', country: 'Indonesia', continent: 'Asia' },
  
  // Philippines
  { code: 'MNL', name: 'Ninoy Aquino International', city: 'Manila', country: 'Philippines', continent: 'Asia' },
  { code: 'CEB', name: 'Mactan-Cebu International', city: 'Cebu', country: 'Philippines', continent: 'Asia' },
  { code: 'DVO', name: 'Francisco Bangoy International', city: 'Davao', country: 'Philippines', continent: 'Asia' },
  
  // Vietnam
  { code: 'HAN', name: 'Noi Bai International', city: 'Hanoi', country: 'Vietnam', continent: 'Asia' },
  { code: 'SGN', name: 'Tan Son Nhat International', city: 'Ho Chi Minh City', country: 'Vietnam', continent: 'Asia' },
  { code: 'DAD', name: 'Da Nang International', city: 'Da Nang', country: 'Vietnam', continent: 'Asia' },
  
  // India
  { code: 'DEL', name: 'Indira Gandhi International', city: 'Delhi', country: 'India', continent: 'Asia' },
  { code: 'BOM', name: 'Chhatrapati Shivaji International', city: 'Mumbai', country: 'India', continent: 'Asia' },
  { code: 'BLR', name: 'Kempegowda International', city: 'Bangalore', country: 'India', continent: 'Asia' },
  { code: 'MAA', name: 'Chennai International', city: 'Chennai', country: 'India', continent: 'Asia' },
  { code: 'HYD', name: 'Rajiv Gandhi International', city: 'Hyderabad', country: 'India', continent: 'Asia' },
  { code: 'CCU', name: 'Netaji Subhas Chandra Bose', city: 'Kolkata', country: 'India', continent: 'Asia' },
  { code: 'COK', name: 'Cochin International', city: 'Kochi', country: 'India', continent: 'Asia' },
  { code: 'TRV', name: 'Trivandrum International', city: 'Thiruvananthapuram', country: 'India', continent: 'Asia' },
  { code: 'AMD', name: 'Sardar Vallabhbhai Patel', city: 'Ahmedabad', country: 'India', continent: 'Asia' },
  { code: 'PNQ', name: 'Pune International', city: 'Pune', country: 'India', continent: 'Asia' },
  { code: 'LKO', name: 'Chaudhary Charan Singh', city: 'Lucknow', country: 'India', continent: 'Asia' },
  
  // Pakistan
  { code: 'KHI', name: 'Jinnah International', city: 'Karachi', country: 'Pakistan', continent: 'Asia' },
  { code: 'LHE', name: 'Allama Iqbal International', city: 'Lahore', country: 'Pakistan', continent: 'Asia' },
  { code: 'ISB', name: 'Islamabad International', city: 'Islamabad', country: 'Pakistan', continent: 'Asia' },
  
  // Bangladesh
  { code: 'DAC', name: 'Hazrat Shahjalal International', city: 'Dhaka', country: 'Bangladesh', continent: 'Asia' },
  
  // Sri Lanka
  { code: 'CMB', name: 'Bandaranaike International', city: 'Colombo', country: 'Sri Lanka', continent: 'Asia' },
  
  // Nepal
  { code: 'KTM', name: 'Tribhuvan International', city: 'Kathmandu', country: 'Nepal', continent: 'Asia' },
  
  // Afghanistan
  { code: 'KBL', name: 'Hamid Karzai International', city: 'Kabul', country: 'Afghanistan', continent: 'Asia' },
  
  // Iran
  { code: 'IKA', name: 'Imam Khomeini International', city: 'Tehran', country: 'Iran', continent: 'Asia' },
  
  // Israel
  { code: 'TLV', name: 'Ben Gurion International', city: 'Tel Aviv', country: 'Israel', continent: 'Asia' },
  
  // Jordan
  { code: 'AMM', name: 'Queen Alia International', city: 'Amman', country: 'Jordan', continent: 'Asia' },
  
  // UAE
  { code: 'DXB', name: 'Dubai International', city: 'Dubai', country: 'UAE', continent: 'Asia' },
  { code: 'AUH', name: 'Abu Dhabi International', city: 'Abu Dhabi', country: 'UAE', continent: 'Asia' },
  { code: 'SHJ', name: 'Sharjah International', city: 'Sharjah', country: 'UAE', continent: 'Asia' },
  
  // Qatar
  { code: 'DOH', name: 'Hamad International', city: 'Doha', country: 'Qatar', continent: 'Asia' },
  
  // Saudi Arabia
  { code: 'RUH', name: 'King Khalid International', city: 'Riyadh', country: 'Saudi Arabia', continent: 'Asia' },
  { code: 'JED', name: 'King Abdulaziz International', city: 'Jeddah', country: 'Saudi Arabia', continent: 'Asia' },
  { code: 'DMM', name: 'King Fahd International', city: 'Dammam', country: 'Saudi Arabia', continent: 'Asia' },
  { code: 'MED', name: 'Prince Mohammad bin Abdulaziz', city: 'Medina', country: 'Saudi Arabia', continent: 'Asia' },
  
  // Kuwait
  { code: 'KWI', name: 'Kuwait International', city: 'Kuwait City', country: 'Kuwait', continent: 'Asia' },
  
  // Bahrain
  { code: 'BAH', name: 'Bahrain International', city: 'Manama', country: 'Bahrain', continent: 'Asia' },
  
  // Oman
  { code: 'MCT', name: 'Muscat International', city: 'Muscat', country: 'Oman', continent: 'Asia' },
  
  // ============================================
  // AFRICA
  // ============================================
  
  // South Africa
  { code: 'JNB', name: 'O.R. Tambo International', city: 'Johannesburg', country: 'South Africa', continent: 'Africa' },
  { code: 'CPT', name: 'Cape Town International', city: 'Cape Town', country: 'South Africa', continent: 'Africa' },
  { code: 'DUR', name: 'King Shaka International', city: 'Durban', country: 'South Africa', continent: 'Africa' },
  { code: 'PLZ', name: 'Port Elizabeth International', city: 'Port Elizabeth', country: 'South Africa', continent: 'Africa' },
  
  // Nigeria
  { code: 'LOS', name: 'Murtala Muhammed International', city: 'Lagos', country: 'Nigeria', continent: 'Africa' },
  { code: 'ABV', name: 'Nnamdi Azikiwe International', city: 'Abuja', country: 'Nigeria', continent: 'Africa' },
  { code: 'KAN', name: 'Mallam Aminu Kano International', city: 'Kano', country: 'Nigeria', continent: 'Africa' },
  { code: 'PHC', name: 'Port Harcourt International', city: 'Port Harcourt', country: 'Nigeria', continent: 'Africa' },
  
  // Egypt
  { code: 'CAI', name: 'Cairo International', city: 'Cairo', country: 'Egypt', continent: 'Africa' },
  { code: 'HBE', name: 'Borg El Arab International', city: 'Alexandria', country: 'Egypt', continent: 'Africa' },
  { code: 'HRG', name: 'Hurghada International', city: 'Hurghada', country: 'Egypt', continent: 'Africa' },
  { code: 'SSH', name: 'Sharm El Sheikh International', city: 'Sharm El Sheikh', country: 'Egypt', continent: 'Africa' },
  { code: 'LXR', name: 'Luxor International', city: 'Luxor', country: 'Egypt', continent: 'Africa' },
  
  // Kenya
  { code: 'NBO', name: 'Jomo Kenyatta International', city: 'Nairobi', country: 'Kenya', continent: 'Africa' },
  { code: 'MBA', name: 'Moi International', city: 'Mombasa', country: 'Kenya', continent: 'Africa' },
  
  // Ethiopia
  { code: 'ADD', name: 'Addis Ababa Bole International', city: 'Addis Ababa', country: 'Ethiopia', continent: 'Africa' },
  
  // Ghana
  { code: 'ACC', name: 'Kotoka International', city: 'Accra', country: 'Ghana', continent: 'Africa' },
  
  // Morocco
  { code: 'CMN', name: 'Mohammed V International', city: 'Casablanca', country: 'Morocco', continent: 'Africa' },
  { code: 'RAK', name: 'Marrakech Menara', city: 'Marrakech', country: 'Morocco', continent: 'Africa' },
  { code: 'TNG', name: 'Tangier Ibn Battuta', city: 'Tangier', country: 'Morocco', continent: 'Africa' },
  
  // Tunisia
  { code: 'TUN', name: 'Tunis Carthage International', city: 'Tunis', country: 'Tunisia', continent: 'Africa' },
  { code: 'MIR', name: 'Monastir Habib Bourguiba', city: 'Monastir', country: 'Tunisia', continent: 'Africa' },
  
  // Algeria
  { code: 'ALG', name: 'Houari Boumediene Airport', city: 'Algiers', country: 'Algeria', continent: 'Africa' },
  
  // Senegal
  { code: 'DSS', name: 'Blaise Diagne International', city: 'Dakar', country: 'Senegal', continent: 'Africa' },
  
  // Ivory Coast
  { code: 'ABJ', name: 'Félix Houphouët-Boigny International', city: 'Abidjan', country: 'Ivory Coast', continent: 'Africa' },
  
  // Cameroon
  { code: 'DLA', name: 'Douala International', city: 'Douala', country: 'Cameroon', continent: 'Africa' },
  
  // Angola
  { code: 'LAD', name: 'Quatro de Fevereiro International', city: 'Luanda', country: 'Angola', continent: 'Africa' },
  
  // Zimbabwe
  { code: 'HRE', name: 'Robert Gabriel Mugabe International', city: 'Harare', country: 'Zimbabwe', continent: 'Africa' },
  
  // Mauritius
  { code: 'MRU', name: 'Sir Seewoosagur Ramgoolam', city: 'Port Louis', country: 'Mauritius', continent: 'Africa' },
  
  // Seychelles
  { code: 'SEZ', name: 'Seychelles International', city: 'Victoria', country: 'Seychelles', continent: 'Africa' },
  
  // Tanzania
  { code: 'DAR', name: 'Julius Nyerere International', city: 'Dar es Salaam', country: 'Tanzania', continent: 'Africa' },
  { code: 'JRO', name: 'Kilimanjaro International', city: 'Arusha', country: 'Tanzania', continent: 'Africa' },
  { code: 'ZNZ', name: 'Abeid Amani Karume International', city: 'Zanzibar', country: 'Tanzania', continent: 'Africa' },
  
  // Uganda
  { code: 'EBB', name: 'Entebbe International', city: 'Entebbe', country: 'Uganda', continent: 'Africa' },
  
  // Rwanda
  { code: 'KGL', name: 'Kigali International', city: 'Kigali', country: 'Rwanda', continent: 'Africa' },
  
  // Namibia
  { code: 'WDH', name: 'Hosea Kutako International', city: 'Windhoek', country: 'Namibia', continent: 'Africa' },
  
  // Botswana
  { code: 'GBE', name: 'Sir Seretse Khama International', city: 'Gaborone', country: 'Botswana', continent: 'Africa' },
  
  // Mozambique
  { code: 'MPM', name: 'Maputo International', city: 'Maputo', country: 'Mozambique', continent: 'Africa' },
  
  // Madagascar
  { code: 'TNR', name: 'Ivato International', city: 'Antananarivo', country: 'Madagascar', continent: 'Africa' },

  // ============================================
  // OCEANIA
  // ============================================
  
  // Australia
  { code: 'SYD', name: 'Sydney Kingsford Smith', city: 'Sydney', country: 'Australia', continent: 'Oceania' },
  { code: 'MEL', name: 'Melbourne International', city: 'Melbourne', country: 'Australia', continent: 'Oceania' },
  { code: 'BNE', name: 'Brisbane International', city: 'Brisbane', country: 'Australia', continent: 'Oceania' },
  { code: 'PER', name: 'Perth International', city: 'Perth', country: 'Australia', continent: 'Oceania' },
  { code: 'ADL', name: 'Adelaide International', city: 'Adelaide', country: 'Australia', continent: 'Oceania' },
  { code: 'CBR', name: 'Canberra International', city: 'Canberra', country: 'Australia', continent: 'Oceania' },
  { code: 'DRW', name: 'Darwin International', city: 'Darwin', country: 'Australia', continent: 'Oceania' },
  { code: 'HBA', name: 'Hobart International', city: 'Hobart', country: 'Australia', continent: 'Oceania' },
  
  // New Zealand
  { code: 'AKL', name: 'Auckland International', city: 'Auckland', country: 'New Zealand', continent: 'Oceania' },
  { code: 'WLG', name: 'Wellington International', city: 'Wellington', country: 'New Zealand', continent: 'Oceania' },
  { code: 'CHC', name: 'Christchurch International', city: 'Christchurch', country: 'New Zealand', continent: 'Oceania' },
  { code: 'ZQN', name: 'Queenstown International', city: 'Queenstown', country: 'New Zealand', continent: 'Oceania' },
  
  // Fiji
  { code: 'NAN', name: 'Nadi International', city: 'Nadi', country: 'Fiji', continent: 'Oceania' },
  
  // Papua New Guinea
  { code: 'POM', name: 'Jacksons International', city: 'Port Moresby', country: 'Papua New Guinea', continent: 'Oceania' },
  
  // ============================================
  // POPULAR AIRPORTS (for quick suggestions)
  // ============================================
  
  // Middle East Hubs
  // European Hubs
  // African Hubs
  // Asian Hubs
  // North American Hubs
  // South American Hubs
  // Oceanian Hubs
];

// Helper function to get airport by code
export const getAirportByCode = (code) => {
  return airports.find(a => a.code === code);
};

// Helper function to search airports
export const searchAirports = (query) => {
  if (!query || query.length < 1) return [];
  const lowerQuery = query.toLowerCase();
  return airports.filter(airport => 
    airport.code.toLowerCase().includes(lowerQuery) ||
    airport.name.toLowerCase().includes(lowerQuery) ||
    airport.city.toLowerCase().includes(lowerQuery) ||
    airport.country.toLowerCase().includes(lowerQuery)
  );
};

// Popular airports for quick suggestions (major hubs)
export const popularAirports = [
  // North America
  'JFK', 'LAX', 'ORD', 'ATL', 'DFW', 'DEN', 'SFO', 'SEA', 'LAS', 'MIA',
  'YYZ', 'YVR', 'MEX',
  
  // Europe
  'LHR', 'CDG', 'FRA', 'AMS', 'MAD', 'BCN', 'FCO', 'MXP', 'ZRH', 'VIE',
  'CPH', 'ARN', 'DUB', 'LIS', 'ATH', 'IST',
  
  // Asia
  'DXB', 'DOH', 'SIN', 'HND', 'ICN', 'PEK', 'PVG', 'HKG', 'TPE', 'BKK',
  'KUL', 'DEL', 'BOM', 'NBO', 'KHI',
  
  // Africa
  'JNB', 'CAI', 'ADD', 'NBO', 'LOS', 'ACC', 'CMN',
  
  // South America
  'GRU', 'EZE', 'SCL', 'BOG', 'LIM',
  
  // Oceania
  'SYD', 'MEL', 'AKL',
  
  // Middle East
  'AUH', 'RUH', 'KWI', 'BAH', 'MCT'
];

// Group airports by continent for better organization
export const airportsByContinent = airports.reduce((acc, airport) => {
  if (!acc[airport.continent]) {
    acc[airport.continent] = [];
  }
  acc[airport.continent].push(airport);
  return acc;
}, {});

// Group airports by country for easy filtering
export const airportsByCountry = airports.reduce((acc, airport) => {
  if (!acc[airport.country]) {
    acc[airport.country] = [];
  }
  acc[airport.country].push(airport);
  return acc;
}, {});

export const continentMap = {
  'North America': '🌎',
  'South America': '🌎',
  'Europe': '🌍',
  'Africa': '🌍',
  'Asia': '🌏',
  'Oceania': '🌏'
};