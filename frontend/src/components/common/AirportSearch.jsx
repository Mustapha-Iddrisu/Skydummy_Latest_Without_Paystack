// src/components/common/AirportSearch.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDebounce } from 'use-debounce';
import Fuse from 'fuse.js';
import { 
  Plane, 
  Search, 
  X, 
  Loader2, 
  Star, 
  MapPin, 
  Globe 
} from 'lucide-react';

// Complete Airport Database - All International Airports
const airports = [
  // ============================================
  // NORTH AMERICA
  // ============================================
  
  // USA
  { code: 'ATL', name: 'Hartsfield-Jackson Atlanta International', city: 'Atlanta', country: 'USA' },
  { code: 'LAX', name: 'Los Angeles International', city: 'Los Angeles', country: 'USA' },
  { code: 'ORD', name: "O'Hare International", city: 'Chicago', country: 'USA' },
  { code: 'DFW', name: 'Dallas/Fort Worth International', city: 'Dallas', country: 'USA' },
  { code: 'DEN', name: 'Denver International', city: 'Denver', country: 'USA' },
  { code: 'JFK', name: 'John F. Kennedy International', city: 'New York', country: 'USA' },
  { code: 'SFO', name: 'San Francisco International', city: 'San Francisco', country: 'USA' },
  { code: 'SEA', name: 'Seattle-Tacoma International', city: 'Seattle', country: 'USA' },
  { code: 'LAS', name: 'Harry Reid International', city: 'Las Vegas', country: 'USA' },
  { code: 'MIA', name: 'Miami International', city: 'Miami', country: 'USA' },
  { code: 'PHX', name: 'Phoenix Sky Harbor International', city: 'Phoenix', country: 'USA' },
  { code: 'IAH', name: 'George Bush Intercontinental', city: 'Houston', country: 'USA' },
  { code: 'EWR', name: 'Newark Liberty International', city: 'Newark', country: 'USA' },
  { code: 'MSP', name: 'Minneapolis-Saint Paul International', city: 'Minneapolis', country: 'USA' },
  { code: 'DTW', name: 'Detroit Metropolitan Wayne County', city: 'Detroit', country: 'USA' },
  { code: 'BOS', name: 'Boston Logan International', city: 'Boston', country: 'USA' },
  { code: 'CLT', name: 'Charlotte Douglas International', city: 'Charlotte', country: 'USA' },
  { code: 'SLC', name: 'Salt Lake City International', city: 'Salt Lake City', country: 'USA' },
  { code: 'SAN', name: 'San Diego International', city: 'San Diego', country: 'USA' },
  { code: 'TPA', name: 'Tampa International', city: 'Tampa', country: 'USA' },
  { code: 'PDX', name: 'Portland International', city: 'Portland', country: 'USA' },
  { code: 'STL', name: 'St. Louis Lambert International', city: 'St. Louis', country: 'USA' },
  { code: 'BWI', name: 'Baltimore/Washington International', city: 'Baltimore', country: 'USA' },
  { code: 'DCA', name: 'Ronald Reagan Washington National', city: 'Washington', country: 'USA' },
  { code: 'IAD', name: 'Washington Dulles International', city: 'Washington', country: 'USA' },
  { code: 'AUS', name: 'Austin-Bergstrom International', city: 'Austin', country: 'USA' },
  { code: 'SJC', name: 'San Jose International', city: 'San Jose', country: 'USA' },
  { code: 'OAK', name: 'Oakland International', city: 'Oakland', country: 'USA' },
  { code: 'FLL', name: 'Fort Lauderdale-Hollywood International', city: 'Fort Lauderdale', country: 'USA' },
  { code: 'MCO', name: 'Orlando International', city: 'Orlando', country: 'USA' },
  { code: 'HNL', name: 'Daniel K. Inouye International', city: 'Honolulu', country: 'USA' },
  { code: 'ANC', name: 'Ted Stevens Anchorage International', city: 'Anchorage', country: 'USA' },
  { code: 'MSY', name: 'Louis Armstrong New Orleans International', city: 'New Orleans', country: 'USA' },
  { code: 'SJU', name: 'Luis Muñoz Marín International', city: 'San Juan', country: 'Puerto Rico' },
  
  // Canada
  { code: 'YYZ', name: 'Toronto Pearson International', city: 'Toronto', country: 'Canada' },
  { code: 'YVR', name: 'Vancouver International', city: 'Vancouver', country: 'Canada' },
  { code: 'YUL', name: 'Montréal-Pierre Elliott Trudeau', city: 'Montreal', country: 'Canada' },
  { code: 'YYC', name: 'Calgary International', city: 'Calgary', country: 'Canada' },
  { code: 'YEG', name: 'Edmonton International', city: 'Edmonton', country: 'Canada' },
  { code: 'YOW', name: 'Ottawa Macdonald-Cartier International', city: 'Ottawa', country: 'Canada' },
  { code: 'YHZ', name: 'Halifax Stanfield International', city: 'Halifax', country: 'Canada' },
  { code: 'YWG', name: 'Winnipeg James Armstrong Richardson', city: 'Winnipeg', country: 'Canada' },
  { code: 'YQB', name: 'Québec City Jean Lesage International', city: 'Quebec City', country: 'Canada' },
  
  // Mexico
  { code: 'MEX', name: 'Mexico City International', city: 'Mexico City', country: 'Mexico' },
  { code: 'CUN', name: 'Cancún International', city: 'Cancún', country: 'Mexico' },
  { code: 'GDL', name: 'Guadalajara International', city: 'Guadalajara', country: 'Mexico' },
  { code: 'MTY', name: 'Monterrey International', city: 'Monterrey', country: 'Mexico' },
  { code: 'TIJ', name: 'Tijuana International', city: 'Tijuana', country: 'Mexico' },
  { code: 'PVR', name: 'Licenciado Gustavo Díaz Ordaz', city: 'Puerto Vallarta', country: 'Mexico' },
  { code: 'SJD', name: 'Los Cabos International', city: 'San José del Cabo', country: 'Mexico' },
  
  // Central America & Caribbean
  { code: 'PTY', name: 'Tocumen International', city: 'Panama City', country: 'Panama' },
  { code: 'SJO', name: 'Juan Santamaría International', city: 'San José', country: 'Costa Rica' },
  { code: 'GUA', name: 'La Aurora International', city: 'Guatemala City', country: 'Guatemala' },
  { code: 'SAL', name: 'El Salvador International', city: 'San Salvador', country: 'El Salvador' },
  { code: 'KIN', name: 'Norman Manley International', city: 'Kingston', country: 'Jamaica' },
  { code: 'MBJ', name: 'Sangster International', city: 'Montego Bay', country: 'Jamaica' },
  { code: 'NAS', name: 'Lynden Pindling International', city: 'Nassau', country: 'Bahamas' },
  { code: 'PUJ', name: 'Punta Cana International', city: 'Punta Cana', country: 'Dominican Republic' },
  { code: 'SDQ', name: 'Las Américas International', city: 'Santo Domingo', country: 'Dominican Republic' },

  // ============================================
  // EUROPE
  // ============================================
  
  // United Kingdom
  { code: 'LHR', name: 'London Heathrow', city: 'London', country: 'UK' },
  { code: 'LGW', name: 'London Gatwick', city: 'London', country: 'UK' },
  { code: 'MAN', name: 'Manchester International', city: 'Manchester', country: 'UK' },
  { code: 'STN', name: 'London Stansted', city: 'London', country: 'UK' },
  { code: 'LTN', name: 'London Luton', city: 'London', country: 'UK' },
  { code: 'EDI', name: 'Edinburgh International', city: 'Edinburgh', country: 'UK' },
  { code: 'GLA', name: 'Glasgow International', city: 'Glasgow', country: 'UK' },
  { code: 'BHX', name: 'Birmingham International', city: 'Birmingham', country: 'UK' },
  
  // France
  { code: 'CDG', name: 'Charles de Gaulle', city: 'Paris', country: 'France' },
  { code: 'ORY', name: 'Orly International', city: 'Paris', country: 'France' },
  { code: 'NCE', name: 'Nice Côte d\'Azur', city: 'Nice', country: 'France' },
  { code: 'MRS', name: 'Marseille Provence', city: 'Marseille', country: 'France' },
  { code: 'LYS', name: 'Lyon-Saint Exupéry', city: 'Lyon', country: 'France' },
  { code: 'TLS', name: 'Toulouse-Blagnac', city: 'Toulouse', country: 'France' },
  
  // Germany
  { code: 'FRA', name: 'Frankfurt International', city: 'Frankfurt', country: 'Germany' },
  { code: 'MUC', name: 'Munich International', city: 'Munich', country: 'Germany' },
  { code: 'BER', name: 'Berlin Brandenburg', city: 'Berlin', country: 'Germany' },
  { code: 'DUS', name: 'Düsseldorf International', city: 'Düsseldorf', country: 'Germany' },
  { code: 'HAM', name: 'Hamburg International', city: 'Hamburg', country: 'Germany' },
  { code: 'STR', name: 'Stuttgart International', city: 'Stuttgart', country: 'Germany' },
  { code: 'CGN', name: 'Cologne Bonn', city: 'Cologne', country: 'Germany' },
  
  // Italy
  { code: 'FCO', name: 'Leonardo da Vinci International', city: 'Rome', country: 'Italy' },
  { code: 'MXP', name: 'Milan Malpensa', city: 'Milan', country: 'Italy' },
  { code: 'VCE', name: 'Venice Marco Polo', city: 'Venice', country: 'Italy' },
  { code: 'NAP', name: 'Naples International', city: 'Naples', country: 'Italy' },
  { code: 'BLQ', name: 'Bologna Guglielmo Marconi', city: 'Bologna', country: 'Italy' },
  
  // Spain
  { code: 'MAD', name: 'Madrid Barajas', city: 'Madrid', country: 'Spain' },
  { code: 'BCN', name: 'Barcelona El Prat', city: 'Barcelona', country: 'Spain' },
  { code: 'PMI', name: 'Palma de Mallorca', city: 'Palma de Mallorca', country: 'Spain' },
  { code: 'AGP', name: 'Málaga-Costa del Sol', city: 'Málaga', country: 'Spain' },
  { code: 'ALC', name: 'Alicante-Elche', city: 'Alicante', country: 'Spain' },
  { code: 'LPA', name: 'Gran Canaria', city: 'Las Palmas', country: 'Spain' },
  { code: 'TFS', name: 'Tenerife South', city: 'Tenerife', country: 'Spain' },
  { code: 'SVQ', name: 'Seville International', city: 'Seville', country: 'Spain' },
  { code: 'VLC', name: 'Valencia International', city: 'Valencia', country: 'Spain' },
  
  // Netherlands
  { code: 'AMS', name: 'Amsterdam Schiphol', city: 'Amsterdam', country: 'Netherlands' },
  
  // Switzerland
  { code: 'ZRH', name: 'Zurich International', city: 'Zurich', country: 'Switzerland' },
  { code: 'GVA', name: 'Geneva International', city: 'Geneva', country: 'Switzerland' },
  
  // Austria
  { code: 'VIE', name: 'Vienna International', city: 'Vienna', country: 'Austria' },
  
  // Belgium
  { code: 'BRU', name: 'Brussels National', city: 'Brussels', country: 'Belgium' },
  
  // Denmark
  { code: 'CPH', name: 'Copenhagen Kastrup', city: 'Copenhagen', country: 'Denmark' },
  
  // Sweden
  { code: 'ARN', name: 'Stockholm Arlanda', city: 'Stockholm', country: 'Sweden' },
  { code: 'GOT', name: 'Gothenburg Landvetter', city: 'Gothenburg', country: 'Sweden' },
  
  // Norway
  { code: 'OSL', name: 'Oslo Gardermoen', city: 'Oslo', country: 'Norway' },
  
  // Finland
  { code: 'HEL', name: 'Helsinki Vantaa', city: 'Helsinki', country: 'Finland' },
  
  // Ireland
  { code: 'DUB', name: 'Dublin International', city: 'Dublin', country: 'Ireland' },
  
  // Portugal
  { code: 'LIS', name: 'Lisbon Humberto Delgado', city: 'Lisbon', country: 'Portugal' },
  { code: 'OPO', name: 'Porto International', city: 'Porto', country: 'Portugal' },
  
  // Greece
  { code: 'ATH', name: 'Athens International', city: 'Athens', country: 'Greece' },
  
  // Turkey
  { code: 'IST', name: 'Istanbul International', city: 'Istanbul', country: 'Turkey' },
  { code: 'SAW', name: 'Sabiha Gökçen International', city: 'Istanbul', country: 'Turkey' },
  { code: 'AYT', name: 'Antalya International', city: 'Antalya', country: 'Turkey' },
  
  // Russia
  { code: 'SVO', name: 'Sheremetyevo International', city: 'Moscow', country: 'Russia' },
  { code: 'DME', name: 'Domodedovo International', city: 'Moscow', country: 'Russia' },
  
  // Other European
  { code: 'PRG', name: 'Václav Havel International', city: 'Prague', country: 'Czech Republic' },
  { code: 'BUD', name: 'Budapest Ferenc Liszt', city: 'Budapest', country: 'Hungary' },
  { code: 'WAW', name: 'Warsaw Chopin', city: 'Warsaw', country: 'Poland' },
  { code: 'KRK', name: 'Kraków John Paul II', city: 'Kraków', country: 'Poland' },
  { code: 'ZAG', name: 'Zagreb International', city: 'Zagreb', country: 'Croatia' },
  { code: 'BEG', name: 'Belgrade Nikola Tesla', city: 'Belgrade', country: 'Serbia' },
  { code: 'SOF', name: 'Sofia International', city: 'Sofia', country: 'Bulgaria' },
  { code: 'OTP', name: 'Henri Coandă International', city: 'Bucharest', country: 'Romania' },

  // ============================================
  // ASIA
  // ============================================
  
  // China
  { code: 'PEK', name: 'Beijing Capital International', city: 'Beijing', country: 'China' },
  { code: 'PKX', name: 'Beijing Daxing International', city: 'Beijing', country: 'China' },
  { code: 'PVG', name: 'Shanghai Pudong International', city: 'Shanghai', country: 'China' },
  { code: 'SHA', name: 'Shanghai Hongqiao International', city: 'Shanghai', country: 'China' },
  { code: 'CAN', name: 'Guangzhou Baiyun International', city: 'Guangzhou', country: 'China' },
  { code: 'SZX', name: 'Shenzhen Bao\'an International', city: 'Shenzhen', country: 'China' },
  { code: 'CTU', name: 'Chengdu Shuangliu International', city: 'Chengdu', country: 'China' },
  { code: 'TFU', name: 'Chengdu Tianfu International', city: 'Chengdu', country: 'China' },
  { code: 'XMN', name: 'Xiamen Gaoqi International', city: 'Xiamen', country: 'China' },
  { code: 'HGH', name: 'Hangzhou Xiaoshan International', city: 'Hangzhou', country: 'China' },
  { code: 'XIY', name: 'Xi\'an Xianyang International', city: 'Xi\'an', country: 'China' },
  { code: 'NKG', name: 'Nanjing Lukou International', city: 'Nanjing', country: 'China' },
  { code: 'CKG', name: 'Chongqing Jiangbei International', city: 'Chongqing', country: 'China' },
  { code: 'KMG', name: 'Kunming Changshui International', city: 'Kunming', country: 'China' },
  { code: 'SHE', name: 'Shenyang Taoxian International', city: 'Shenyang', country: 'China' },
  { code: 'DLC', name: 'Dalian Zhoushuizi International', city: 'Dalian', country: 'China' },
  { code: 'WUH', name: 'Wuhan Tianhe International', city: 'Wuhan', country: 'China' },
  { code: 'CSX', name: 'Changsha Huanghua International', city: 'Changsha', country: 'China' },
  
  // Hong Kong
  { code: 'HKG', name: 'Hong Kong International', city: 'Hong Kong', country: 'Hong Kong' },
  
  // Taiwan
  { code: 'TPE', name: 'Taiwan Taoyuan International', city: 'Taipei', country: 'Taiwan' },
  { code: 'KHH', name: 'Kaohsiung International', city: 'Kaohsiung', country: 'Taiwan' },
  
  // Japan
  { code: 'HND', name: 'Tokyo Haneda', city: 'Tokyo', country: 'Japan' },
  { code: 'NRT', name: 'Narita International', city: 'Tokyo', country: 'Japan' },
  { code: 'KIX', name: 'Kansai International', city: 'Osaka', country: 'Japan' },
  { code: 'ITM', name: 'Osaka International', city: 'Osaka', country: 'Japan' },
  { code: 'NGO', name: 'Chubu Centrair International', city: 'Nagoya', country: 'Japan' },
  { code: 'CTS', name: 'New Chitose International', city: 'Sapporo', country: 'Japan' },
  { code: 'OKA', name: 'Naha International', city: 'Okinawa', country: 'Japan' },
  { code: 'FUK', name: 'Fukuoka International', city: 'Fukuoka', country: 'Japan' },
  
  // South Korea
  { code: 'ICN', name: 'Incheon International', city: 'Seoul', country: 'South Korea' },
  { code: 'GMP', name: 'Gimpo International', city: 'Seoul', country: 'South Korea' },
  { code: 'PUS', name: 'Gimhae International', city: 'Busan', country: 'South Korea' },
  { code: 'CJU', name: 'Jeju International', city: 'Jeju Island', country: 'South Korea' },
  
  // Singapore
  { code: 'SIN', name: 'Singapore Changi', city: 'Singapore', country: 'Singapore' },
  
  // Malaysia
  { code: 'KUL', name: 'Kuala Lumpur International', city: 'Kuala Lumpur', country: 'Malaysia' },
  { code: 'PEN', name: 'Penang International', city: 'Penang', country: 'Malaysia' },
  { code: 'BKI', name: 'Kota Kinabalu International', city: 'Kota Kinabalu', country: 'Malaysia' },
  
  // Thailand
  { code: 'BKK', name: 'Suvarnabhumi International', city: 'Bangkok', country: 'Thailand' },
  { code: 'DMK', name: 'Don Mueang International', city: 'Bangkok', country: 'Thailand' },
  { code: 'HKT', name: 'Phuket International', city: 'Phuket', country: 'Thailand' },
  { code: 'CNX', name: 'Chiang Mai International', city: 'Chiang Mai', country: 'Thailand' },
  
  // Indonesia
  { code: 'CGK', name: 'Soekarno-Hatta International', city: 'Jakarta', country: 'Indonesia' },
  { code: 'DPS', name: 'Ngurah Rai International', city: 'Bali', country: 'Indonesia' },
  { code: 'SUB', name: 'Juanda International', city: 'Surabaya', country: 'Indonesia' },
  
  // Philippines
  { code: 'MNL', name: 'Ninoy Aquino International', city: 'Manila', country: 'Philippines' },
  { code: 'CEB', name: 'Mactan-Cebu International', city: 'Cebu', country: 'Philippines' },
  { code: 'DVO', name: 'Francisco Bangoy International', city: 'Davao', country: 'Philippines' },
  
  // Vietnam
  { code: 'HAN', name: 'Noi Bai International', city: 'Hanoi', country: 'Vietnam' },
  { code: 'SGN', name: 'Tan Son Nhat International', city: 'Ho Chi Minh City', country: 'Vietnam' },
  { code: 'DAD', name: 'Da Nang International', city: 'Da Nang', country: 'Vietnam' },
  
  // India
  { code: 'DEL', name: 'Indira Gandhi International', city: 'Delhi', country: 'India' },
  { code: 'BOM', name: 'Chhatrapati Shivaji International', city: 'Mumbai', country: 'India' },
  { code: 'BLR', name: 'Kempegowda International', city: 'Bangalore', country: 'India' },
  { code: 'MAA', name: 'Chennai International', city: 'Chennai', country: 'India' },
  { code: 'HYD', name: 'Rajiv Gandhi International', city: 'Hyderabad', country: 'India' },
  { code: 'CCU', name: 'Netaji Subhas Chandra Bose', city: 'Kolkata', country: 'India' },
  { code: 'COK', name: 'Cochin International', city: 'Kochi', country: 'India' },
  { code: 'TRV', name: 'Trivandrum International', city: 'Thiruvananthapuram', country: 'India' },
  { code: 'AMD', name: 'Sardar Vallabhbhai Patel', city: 'Ahmedabad', country: 'India' },
  { code: 'PNQ', name: 'Pune International', city: 'Pune', country: 'India' },
  
  // Pakistan
  { code: 'KHI', name: 'Jinnah International', city: 'Karachi', country: 'Pakistan' },
  { code: 'LHE', name: 'Allama Iqbal International', city: 'Lahore', country: 'Pakistan' },
  { code: 'ISB', name: 'Islamabad International', city: 'Islamabad', country: 'Pakistan' },
  
  // Bangladesh
  { code: 'DAC', name: 'Hazrat Shahjalal International', city: 'Dhaka', country: 'Bangladesh' },
  
  // Sri Lanka
  { code: 'CMB', name: 'Bandaranaike International', city: 'Colombo', country: 'Sri Lanka' },
  
  // Nepal
  { code: 'KTM', name: 'Tribhuvan International', city: 'Kathmandu', country: 'Nepal' },
  
  // UAE
  { code: 'DXB', name: 'Dubai International', city: 'Dubai', country: 'UAE' },
  { code: 'AUH', name: 'Abu Dhabi International', city: 'Abu Dhabi', country: 'UAE' },
  { code: 'SHJ', name: 'Sharjah International', city: 'Sharjah', country: 'UAE' },
  
  // Qatar
  { code: 'DOH', name: 'Hamad International', city: 'Doha', country: 'Qatar' },
  
  // Saudi Arabia
  { code: 'RUH', name: 'King Khalid International', city: 'Riyadh', country: 'Saudi Arabia' },
  { code: 'JED', name: 'King Abdulaziz International', city: 'Jeddah', country: 'Saudi Arabia' },
  { code: 'DMM', name: 'King Fahd International', city: 'Dammam', country: 'Saudi Arabia' },
  { code: 'MED', name: 'Prince Mohammad bin Abdulaziz', city: 'Medina', country: 'Saudi Arabia' },
  
  // Kuwait
  { code: 'KWI', name: 'Kuwait International', city: 'Kuwait City', country: 'Kuwait' },
  
  // Bahrain
  { code: 'BAH', name: 'Bahrain International', city: 'Manama', country: 'Bahrain' },
  
  // Oman
  { code: 'MCT', name: 'Muscat International', city: 'Muscat', country: 'Oman' },

  // ============================================
  // AFRICA
  // ============================================
  
  // South Africa
  { code: 'JNB', name: 'O.R. Tambo International', city: 'Johannesburg', country: 'South Africa' },
  { code: 'CPT', name: 'Cape Town International', city: 'Cape Town', country: 'South Africa' },
  { code: 'DUR', name: 'King Shaka International', city: 'Durban', country: 'South Africa' },
  
  // Nigeria
  { code: 'LOS', name: 'Murtala Muhammed International', city: 'Lagos', country: 'Nigeria' },
  { code: 'ABV', name: 'Nnamdi Azikiwe International', city: 'Abuja', country: 'Nigeria' },
  { code: 'KAN', name: 'Mallam Aminu Kano International', city: 'Kano', country: 'Nigeria' },
  
  // Egypt
  { code: 'CAI', name: 'Cairo International', city: 'Cairo', country: 'Egypt' },
  { code: 'HBE', name: 'Borg El Arab International', city: 'Alexandria', country: 'Egypt' },
  { code: 'HRG', name: 'Hurghada International', city: 'Hurghada', country: 'Egypt' },
  { code: 'SSH', name: 'Sharm El Sheikh International', city: 'Sharm El Sheikh', country: 'Egypt' },
  { code: 'LXR', name: 'Luxor International', city: 'Luxor', country: 'Egypt' },
  
  // Kenya
  { code: 'NBO', name: 'Jomo Kenyatta International', city: 'Nairobi', country: 'Kenya' },
  { code: 'MBA', name: 'Moi International', city: 'Mombasa', country: 'Kenya' },
  
  // Ethiopia
  { code: 'ADD', name: 'Addis Ababa Bole International', city: 'Addis Ababa', country: 'Ethiopia' },
  
  // Ghana
  { code: 'ACC', name: 'Kotoka International', city: 'Accra', country: 'Ghana' },
  
  // Morocco
  { code: 'CMN', name: 'Mohammed V International', city: 'Casablanca', country: 'Morocco' },
  { code: 'RAK', name: 'Marrakech Menara', city: 'Marrakech', country: 'Morocco' },
  { code: 'TNG', name: 'Tangier Ibn Battuta', city: 'Tangier', country: 'Morocco' },
  
  // Tunisia
  { code: 'TUN', name: 'Tunis Carthage International', city: 'Tunis', country: 'Tunisia' },
  
  // Algeria
  { code: 'ALG', name: 'Houari Boumediene Airport', city: 'Algiers', country: 'Algeria' },
  
  // Senegal
  { code: 'DSS', name: 'Blaise Diagne International', city: 'Dakar', country: 'Senegal' },
  
  // Ivory Coast
  { code: 'ABJ', name: 'Félix Houphouët-Boigny International', city: 'Abidjan', country: 'Ivory Coast' },
  
  // Cameroon
  { code: 'DLA', name: 'Douala International', city: 'Douala', country: 'Cameroon' },
  
  // Angola
  { code: 'LAD', name: 'Quatro de Fevereiro International', city: 'Luanda', country: 'Angola' },
  
  // Zimbabwe
  { code: 'HRE', name: 'Robert Gabriel Mugabe International', city: 'Harare', country: 'Zimbabwe' },
  
  // Mauritius
  { code: 'MRU', name: 'Sir Seewoosagur Ramgoolam', city: 'Port Louis', country: 'Mauritius' },
  
  // Seychelles
  { code: 'SEZ', name: 'Seychelles International', city: 'Victoria', country: 'Seychelles' },
  
  // Tanzania
  { code: 'DAR', name: 'Julius Nyerere International', city: 'Dar es Salaam', country: 'Tanzania' },
  { code: 'JRO', name: 'Kilimanjaro International', city: 'Arusha', country: 'Tanzania' },
  { code: 'ZNZ', name: 'Abeid Amani Karume International', city: 'Zanzibar', country: 'Tanzania' },
  
  // Uganda
  { code: 'EBB', name: 'Entebbe International', city: 'Entebbe', country: 'Uganda' },
  
  // Rwanda
  { code: 'KGL', name: 'Kigali International', city: 'Kigali', country: 'Rwanda' },
  
  // Namibia
  { code: 'WDH', name: 'Hosea Kutako International', city: 'Windhoek', country: 'Namibia' },
  
  // Botswana
  { code: 'GBE', name: 'Sir Seretse Khama International', city: 'Gaborone', country: 'Botswana' },
  
  // Mozambique
  { code: 'MPM', name: 'Maputo International', city: 'Maputo', country: 'Mozambique' },
  
  // Madagascar
  { code: 'TNR', name: 'Ivato International', city: 'Antananarivo', country: 'Madagascar' },

  // ============================================
  // SOUTH AMERICA
  // ============================================
  
  // Brazil
  { code: 'GRU', name: 'São Paulo Guarulhos International', city: 'São Paulo', country: 'Brazil' },
  { code: 'GIG', name: 'Rio de Janeiro–Galeão International', city: 'Rio de Janeiro', country: 'Brazil' },
  { code: 'BSB', name: 'Brasília International', city: 'Brasília', country: 'Brazil' },
  { code: 'CNF', name: 'Belo Horizonte International', city: 'Belo Horizonte', country: 'Brazil' },
  { code: 'POA', name: 'Salgado Filho International', city: 'Porto Alegre', country: 'Brazil' },
  { code: 'REC', name: 'Recife International', city: 'Recife', country: 'Brazil' },
  { code: 'FOR', name: 'Fortaleza International', city: 'Fortaleza', country: 'Brazil' },
  { code: 'MAO', name: 'Eduardo Gomes International', city: 'Manaus', country: 'Brazil' },
  
  // Argentina
  { code: 'EZE', name: 'Ezeiza International', city: 'Buenos Aires', country: 'Argentina' },
  { code: 'AEP', name: 'Jorge Newbery Airpark', city: 'Buenos Aires', country: 'Argentina' },
  { code: 'COR', name: 'Ingeniero Aeronáutico Ambrosio Taravella', city: 'Córdoba', country: 'Argentina' },
  { code: 'MDZ', name: 'El Plumerillo International', city: 'Mendoza', country: 'Argentina' },
  
  // Colombia
  { code: 'BOG', name: 'El Dorado International', city: 'Bogotá', country: 'Colombia' },
  { code: 'MDE', name: 'José María Córdova International', city: 'Medellín', country: 'Colombia' },
  { code: 'CLO', name: 'Alfonso Bonilla Aragón International', city: 'Cali', country: 'Colombia' },
  { code: 'CTG', name: 'Rafael Núñez International', city: 'Cartagena', country: 'Colombia' },
  { code: 'BAQ', name: 'Ernesto Cortissoz International', city: 'Barranquilla', country: 'Colombia' },
  
  // Chile
  { code: 'SCL', name: 'Arturo Merino Benítez International', city: 'Santiago', country: 'Chile' },
  { code: 'PUQ', name: 'Presidente Carlos Ibáñez del Campo', city: 'Punta Arenas', country: 'Chile' },
  
  // Peru
  { code: 'LIM', name: 'Jorge Chávez International', city: 'Lima', country: 'Peru' },
  { code: 'CUZ', name: 'Alejandro Velasco Astete International', city: 'Cusco', country: 'Peru' },
  
  // Venezuela
  { code: 'CCS', name: 'Simón Bolívar International', city: 'Caracas', country: 'Venezuela' },
  
  // Ecuador
  { code: 'UIO', name: 'Mariscal Sucre International', city: 'Quito', country: 'Ecuador' },
  { code: 'GYE', name: 'José Joaquín de Olmedo International', city: 'Guayaquil', country: 'Ecuador' },
  
  // Bolivia
  { code: 'VVI', name: 'Viru Viru International', city: 'Santa Cruz', country: 'Bolivia' },
  
  // Paraguay
  { code: 'ASU', name: 'Silvio Pettirossi International', city: 'Asunción', country: 'Paraguay' },
  
  // Uruguay
  { code: 'MVD', name: 'Carrasco International', city: 'Montevideo', country: 'Uruguay' },

  // ============================================
  // OCEANIA
  // ============================================
  
  // Australia
  { code: 'SYD', name: 'Sydney Kingsford Smith', city: 'Sydney', country: 'Australia' },
  { code: 'MEL', name: 'Melbourne International', city: 'Melbourne', country: 'Australia' },
  { code: 'BNE', name: 'Brisbane International', city: 'Brisbane', country: 'Australia' },
  { code: 'PER', name: 'Perth International', city: 'Perth', country: 'Australia' },
  { code: 'ADL', name: 'Adelaide International', city: 'Adelaide', country: 'Australia' },
  { code: 'CBR', name: 'Canberra International', city: 'Canberra', country: 'Australia' },
  { code: 'DRW', name: 'Darwin International', city: 'Darwin', country: 'Australia' },
  { code: 'HBA', name: 'Hobart International', city: 'Hobart', country: 'Australia' },
  
  // New Zealand
  { code: 'AKL', name: 'Auckland International', city: 'Auckland', country: 'New Zealand' },
  { code: 'WLG', name: 'Wellington International', city: 'Wellington', country: 'New Zealand' },
  { code: 'CHC', name: 'Christchurch International', city: 'Christchurch', country: 'New Zealand' },
  { code: 'ZQN', name: 'Queenstown International', city: 'Queenstown', country: 'New Zealand' },
  
  // Fiji
  { code: 'NAN', name: 'Nadi International', city: 'Nadi', country: 'Fiji' },
  
  // Papua New Guinea
  { code: 'POM', name: 'Jacksons International', city: 'Port Moresby', country: 'Papua New Guinea' },
];

const popularAirports = [
  // North America
  'JFK', 'LAX', 'ORD', 'ATL', 'DFW', 'DEN', 'SFO', 'SEA', 'LAS', 'MIA',
  'YYZ', 'YVR', 'MEX',
  // Europe
  'LHR', 'CDG', 'FRA', 'AMS', 'MAD', 'BCN', 'FCO', 'MXP', 'ZRH', 'VIE',
  'CPH', 'ARN', 'DUB', 'LIS', 'ATH', 'IST',
  // Asia
  'DXB', 'DOH', 'SIN', 'HND', 'ICN', 'PEK', 'PVG', 'HKG', 'TPE', 'BKK',
  'KUL', 'DEL', 'BOM',
  // Africa
  'JNB', 'CAI', 'ADD', 'NBO', 'LOS', 'ACC', 'CMN',
  // South America
  'GRU', 'EZE', 'SCL', 'BOG', 'LIM',
  // Oceania
  'SYD', 'MEL', 'AKL'
];

const fuseOptions = {
  keys: [
    { name: 'code', weight: 2 },
    { name: 'name', weight: 1.5 },
    { name: 'city', weight: 1.5 },
    { name: 'country', weight: 1 }
  ],
  threshold: 0.3,
  includeScore: true,
  minMatchCharLength: 1
};

const fuse = new Fuse(airports, fuseOptions);

const AirportSearch = ({ 
  value = '', 
  onChange, 
  placeholder = 'Search for an airport...',
  label,
  required = false,
  className = '',
  disabled = false,
  onSelect = null,
  hasError = false
}) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [debouncedInput] = useDebounce(inputValue, 300);
  
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);
  const isSelectingRef = useRef(false);
  const isClearedRef = useRef(false);

  // Update input when value prop changes
  useEffect(() => {
    if (isClearedRef.current) {
      isClearedRef.current = false;
      return;
    }
    
    if (value) {
      const airport = airports.find(a => a.code === value);
      if (airport) {
        setInputValue(`${airport.code} - ${airport.city}, ${airport.country}`);
      } else {
        setInputValue(value);
      }
    } else {
      setInputValue('');
    }
  }, [value]);

  // Handle search with debounced input
  useEffect(() => {
    if (isSelectingRef.current) return;

    if (debouncedInput.length >= 1) {
      setIsSearching(true);
      
      if (debouncedInput.includes(' - ')) {
        setIsSearching(false);
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      
      const results = fuse.search(debouncedInput);
      setSuggestions(results.map(result => result.item));
      setShowSuggestions(true);
      setIsSearching(false);
    } else if (isFocused && debouncedInput.length === 0) {
      const popular = airports.filter(a => popularAirports.includes(a.code));
      setSuggestions(popular);
      setShowSuggestions(true);
      setIsSearching(false);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsSearching(false);
    }
    setSelectedIndex(-1);
  }, [debouncedInput, isFocused]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setIsFocused(false);
        setIsSearching(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showSuggestions || suggestions.length === 0) return;
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
      } else if (e.key === 'Enter' && selectedIndex >= 0) {
        e.preventDefault();
        handleSelectAirport(suggestions[selectedIndex]);
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showSuggestions, suggestions, selectedIndex]);

  const handleSelectAirport = useCallback((airport) => {
    if (airport) {
      isSelectingRef.current = true;
      const displayValue = `${airport.code} - ${airport.city}, ${airport.country}`;
      setInputValue(displayValue);
      onChange(airport.code);
      setSuggestions([]);
      setShowSuggestions(false);
      setSelectedIndex(-1);
      setIsFocused(false);
      setIsSearching(false);
      
      if (onSelect) {
        onSelect(airport);
      }
      
      setTimeout(() => {
        isSelectingRef.current = false;
      }, 100);
    }
  }, [onChange, onSelect]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsSearching(true);
    
    if (newValue === '') {
      isClearedRef.current = true;
      onChange('');
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    
    if (newValue.includes(' - ')) {
      const code = newValue.split(' - ')[0];
      if (airports.some(a => a.code === code)) {
        onChange(code);
        return;
      }
    }
    
    if (!newValue.includes(' - ')) {
      onChange(newValue);
    }
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    
    // Select all text when focusing on the input
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current.select();
      }, 0);
    }
    
    if (inputValue.length === 0) {
      const popular = airports.filter(a => popularAirports.includes(a.code));
      setSuggestions(popular);
      setShowSuggestions(true);
    } else if (!inputValue.includes(' - ')) {
      setShowSuggestions(true);
    }
  };

  // Handle click on input to select all text
  const handleInputClick = (e) => {
    e.target.select();
  };

  // Handle backspace/delete for selected airport
  const handleInputKeyDown = (e) => {
    // If backspace or delete is pressed and the input contains " - " (selected airport)
    if ((e.key === 'Backspace' || e.key === 'Delete') && inputValue.includes(' - ')) {
      // Clear the entire field on single backspace
      e.preventDefault();
      handleClear();
      return;
    }
    
    // If Ctrl+A or Cmd+A is pressed, select all
    if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
      e.preventDefault();
      if (inputRef.current) {
        inputRef.current.select();
      }
    }
  };

  const handleClear = () => {
    isClearedRef.current = true;
    setInputValue('');
    onChange('');
    setSuggestions([]);
    setShowSuggestions(false);
    setIsSearching(false);
    setSelectedIndex(-1);
    isSelectingRef.current = false;
    inputRef.current?.focus();
  };

  const renderSuggestions = () => {
    if (isSearching && debouncedInput.length >= 1) {
      return (
        <div className="airport-suggestions loading">
          <div className="loading-content">
            <Loader2 size={16} className="animate-spin" />
            <span>Searching airports...</span>
          </div>
        </div>
      );
    }

    if (suggestions.length === 0 && debouncedInput.length >= 1) {
      return (
        <div className="airport-suggestions no-results">
          <div className="no-results-content">
            <Search size={20} color="#8aa3b5" />
            <p>No airports found for "{debouncedInput}"</p>
            <small>Try searching by code, city, or country</small>
          </div>
        </div>
      );
    }

    if (suggestions.length > 0) {
      return (
        <div className="airport-suggestions" id="airport-suggestions" role="listbox">
          {suggestions.slice(0, 20).map((airport, index) => {
            const isSelected = index === selectedIndex;
            const isPopular = popularAirports.includes(airport.code);
            
            return (
              <div
                key={airport.code}
                className={`suggestion-item ${isSelected ? 'selected' : ''}`}
                onMouseEnter={() => setSelectedIndex(index)}
                onMouseDown={(e) => {
                  e.preventDefault();
                }}
                onClick={() => handleSelectAirport(airport)}
                role="option"
                aria-selected={isSelected}
              >
                <div className="suggestion-main">
                  <span className="airport-code">{airport.code}</span>
                  <span className="airport-name">{airport.name}</span>
                  {isPopular && (
                    <span className="popular-badge">
                      <Star size={12} fill="#f59e0b" color="#f59e0b" /> Popular
                    </span>
                  )}
                </div>
                <div className="suggestion-sub">
                  <span className="airport-city">
                    <MapPin size={13} /> {airport.city}
                  </span>
                  <span className="airport-country">
                    <Globe size={13} /> {airport.country}
                  </span>
                </div>
              </div>
            );
          })}
          
          {suggestions.length > 20 && (
            <div className="suggestion-more">
              <span>+ {suggestions.length - 20} more results</span>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  const isError = hasError || className.includes('has-error');

  return (
    <div className={`airport-search-wrapper ${className} ${isError ? 'has-error' : ''}`} ref={wrapperRef}>
      {label && (
        <label className="airport-search-label">
          <Plane size={15} /> {label}
          {required && <span className="required-star">*</span>}
        </label>
      )}
      
      <div className={`airport-input-container ${isError ? 'has-error' : ''}`}>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onClick={handleInputClick}
          onKeyDown={handleInputKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={`airport-input ${isError ? 'has-error' : ''}`}
          autoComplete="off"
          aria-label="Search airports"
          aria-expanded={showSuggestions}
          aria-controls="airport-suggestions"
          role="combobox"
          spellCheck={false}
        />
        {inputValue && !disabled && (
          <button
            type="button"
            className="clear-button"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <X size={15} />
          </button>
        )}
      </div>
      
      {showSuggestions && renderSuggestions()}
    </div>
  );
};

export default AirportSearch;