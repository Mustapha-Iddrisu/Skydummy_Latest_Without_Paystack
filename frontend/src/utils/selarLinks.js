// src/utils/selarLinks.js

/**
 * Mapping of Selar Hosted Product Links for each ticket variation (tripType & passenger count)
 * 
 * Each key corresponds strictly to:
 * - tripType: 'oneway' or 'round'
 * - passengers: 1 to 9
 */
export const SELAR_PRODUCT_LINKS = {
  // One-way ticket links by passenger count (1 - 9)
  oneway: {
    1: import.meta.env.VITE_SELAR_ONEWAY_1 || '',
    2: import.meta.env.VITE_SELAR_ONEWAY_2 || '',
    3: import.meta.env.VITE_SELAR_ONEWAY_3 || '',
    4: import.meta.env.VITE_SELAR_ONEWAY_4 || '',
    5: import.meta.env.VITE_SELAR_ONEWAY_5 || '',
    6: import.meta.env.VITE_SELAR_ONEWAY_6 || '',
    7: import.meta.env.VITE_SELAR_ONEWAY_7 || '',
    8: import.meta.env.VITE_SELAR_ONEWAY_8 || '',
    9: import.meta.env.VITE_SELAR_ONEWAY_9 || '',
  },
  // Round-trip ticket links by passenger count (1 - 9)
  round: {
    1: import.meta.env.VITE_SELAR_ROUND_1 || '',
    2: import.meta.env.VITE_SELAR_ROUND_2 || '',
    3: import.meta.env.VITE_SELAR_ROUND_3 || '',
    4: import.meta.env.VITE_SELAR_ROUND_4 || '',
    5: import.meta.env.VITE_SELAR_ROUND_5 || '',
    6: import.meta.env.VITE_SELAR_ROUND_6 || '',
    7: import.meta.env.VITE_SELAR_ROUND_7 || '',
    8: import.meta.env.VITE_SELAR_ROUND_8 || '',
    9: import.meta.env.VITE_SELAR_ROUND_9 || '',
  }
};

/**
 * Resolves the EXACT Selar product link corresponding to the selected trip type & passenger number,
 * with customer information prefilled in query parameters.
 * 
 * @param {Object} options
 * @param {string} options.tripType - 'oneway' | 'round'
 * @param {number} options.passengers - 1 to 9
 * @param {string} options.email - Customer email
 * @param {string} options.name - Customer full name
 * @param {string} options.pnr - Booking reference code
 * @param {string} options.phone - Customer phone
 * @returns {{ url: string, isConfigured: boolean, tripType: string, passengers: number }}
 */
export const getSelarProductUrl = ({ tripType = 'round', passengers = 1, email = '', name = '', pnr = '', phone = '' }) => {
  const normalizedType = String(tripType).toLowerCase() === 'oneway' ? 'oneway' : 'round';
  const passengerCount = Math.min(Math.max(Number(passengers) || 1, 1), 9);

  // Retrieve the specific link for this exact combination
  const exactLink = SELAR_PRODUCT_LINKS[normalizedType]?.[passengerCount]?.trim() || '';

  if (!exactLink) {
    console.warn(`⚠️ No specific Selar product link configured for [${normalizedType.toUpperCase()}] with [${passengerCount}] passenger(s).`);
    return {
      url: '',
      isConfigured: false,
      tripType: normalizedType,
      passengers: passengerCount
    };
  }

  try {
    const parsedUrl = new URL(exactLink.startsWith('http') ? exactLink : `https://${exactLink}`);
    
    if (name) parsedUrl.searchParams.set('name', name);
    if (email) parsedUrl.searchParams.set('email', email);
    if (phone) parsedUrl.searchParams.set('phone', phone);
    if (pnr) {
      parsedUrl.searchParams.set('pnr', pnr);
      parsedUrl.searchParams.set('custom_pnr', pnr);
    }

    return {
      url: parsedUrl.toString(),
      isConfigured: true,
      tripType: normalizedType,
      passengers: passengerCount
    };
  } catch (err) {
    console.error('Invalid Selar product URL format:', exactLink, err);
    return {
      url: exactLink,
      isConfigured: true,
      tripType: normalizedType,
      passengers: passengerCount
    };
  }
};

