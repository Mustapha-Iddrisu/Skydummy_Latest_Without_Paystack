// src/store/bookingStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getFlightDetails, getMultipleRouteOptions } from '../data/routes';
import { saveTicketToFirestore, deepCleanObject } from '../services/firebaseService';

const PRICES = {
  oneWay: 10,
  roundTrip: 12
};

const useBookingStore = create(
  persist(
    (set, get) => ({
      // Form data
      tripType: 'round',
      passengers: 1,
      departure: '',
      destination: '',
      departDate: '',
      returnDate: '',
      firstName: '',
      lastName: '',
      passport: '',
      email: '',
      paymentMethod: 'selar',
      
      // Flight data & Route Selection
      availableRoutes: [],
      selectedRoute: null,
      isLoadingRoutes: false,
      flightDetails: null,
      isLoading: false,
      ticketGenerated: false,
      ticketData: null,
      keepDataAfterSubmission: false,
      error: null,
      
      // Computed values
      getPrice: () => {
        const { tripType, passengers } = get();
        const basePrice = tripType === 'oneway' ? PRICES.oneWay : PRICES.roundTrip;
        return basePrice * passengers;
      },
      
      getTotal: () => {
        const { tripType, passengers } = get();
        const basePrice = tripType === 'oneway' ? PRICES.oneWay : PRICES.roundTrip;
        return basePrice * passengers;
      },
      
      // Actions
      updateField: (field, value) => {
        let val = value;
        if (value && typeof value === 'object') {
          if (value.target !== undefined && value.target !== null && 'value' in value.target) {
            val = value.target.value;
          } else {
            val = deepCleanObject(value);
          }
        }
        if (typeof val === 'function' || val === undefined) {
          return;
        }
        set({ [field]: val, error: null });
      },

      selectRoute: (route) => {
        console.log('User selected route:', route);
        const cleanRoute = deepCleanObject(route);
        set({ selectedRoute: cleanRoute, flightDetails: cleanRoute, error: null });
      },

      fetchAvailableRoutes: async (overrideParams = {}) => {
        const {
          departure = get().departure,
          destination = get().destination,
          departDate = get().departDate,
          returnDate = get().returnDate,
          tripType = get().tripType || 'round',
          passengers = get().passengers || 1
        } = overrideParams;

        console.log('Fetching available routes for:', { departure, destination, departDate, returnDate, tripType });

        // Validate required fields: departure, destination, and departDate (plus returnDate for round trips)
        if (!departure || !destination || !departDate || (tripType === 'round' && !returnDate)) {
          console.log('Incomplete fields for routes fetch');
          set({ availableRoutes: [], selectedRoute: null, isLoadingRoutes: false });
          return [];
        }

        if (departure === destination) {
          set({ availableRoutes: [], selectedRoute: null, isLoadingRoutes: false });
          return [];
        }

        set({ isLoadingRoutes: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 350));
          
          const routes = getMultipleRouteOptions(
            departure,
            destination,
            departDate,
            returnDate,
            passengers,
            tripType,
            4
          );

          console.log('Fetched route options:', routes);
          set({ availableRoutes: routes, selectedRoute: null, flightDetails: null, isLoadingRoutes: false });
          return routes;
        } catch (err) {
          console.error('Error fetching available routes:', err);
          set({ availableRoutes: [], selectedRoute: null, isLoadingRoutes: false });
          return [];
        }
      },
      
      fetchFlightDetails: async (tripType) => {
        const { departure, destination, departDate, returnDate, passengers, selectedRoute } = get();
        
        if (selectedRoute) {
          set({ flightDetails: selectedRoute });
          return selectedRoute;
        }

        if (!departure || !destination || !departDate) {
          return null;
        }
        
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          
          const currentTripType = tripType || get().tripType || 'oneway';
          
          const flightDetails = getFlightDetails(
            departure, 
            destination, 
            departDate, 
            passengers,
            currentTripType
          );
          
          set({ flightDetails, isLoading: false });
          return flightDetails;
        } catch (error) {
          console.error('Error fetching flight details:', error);
          set({ 
            isLoading: false, 
            error: 'Failed to fetch flight details. Please try again.' 
          });
          return null;
        }
      },
      
      resetForm: () => set({
        tripType: 'round',
        passengers: 1,
        departure: '',
        destination: '',
        departDate: '',
        returnDate: '',
        firstName: '',
        lastName: '',
        passport: '',
        email: '',
        paymentMethod: 'credit',
        availableRoutes: [],
        selectedRoute: null,
        flightDetails: null,
        ticketGenerated: false,
        ticketData: null,
        error: null
      }),
      
      clearPassengerDetails: () => set({
        firstName: '',
        lastName: '',
        passport: '',
        email: ''
      }),
      
      setTicketData: (ticket) => {
        const cleanTicket = deepCleanObject(ticket);
        set({
          ticketData: cleanTicket,
          ticketGenerated: true,
          error: null
        });
      },

      generateTicket: (data) => {
        console.log('Generating ticket with data:', data);
        
        const fallbackTicketNum = `SKY${Date.now().toString().slice(-8)}`;
        const fallbackBookingRef = `REF${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        
        const ticketNumber = data.ticketNumber || fallbackTicketNum;
        const bookingReference = data.bookingReference || fallbackBookingRef;
        const flightDetails = data.flightDetails || get().selectedRoute || get().flightDetails;
        
        const tripType = data.tripType || get().tripType || 'round';
        const passengerCount = data.passengers || data.passengerCount || get().passengers || 1;
        const basePrice = tripType === 'oneway' ? PRICES.oneWay : PRICES.roundTrip;
        const calculatedTotal = basePrice * passengerCount;

        const formattedTotalPrice = data.totalPrice || (data.finalPrice !== undefined ? `$${Number(data.finalPrice).toFixed(2)} USD` : `$${calculatedTotal.toFixed(2)} USD`);
        
        const now = new Date();
        const createdAt = data.createdAt || now.toISOString();
        const issueDate = data.issueDate || now.toISOString().split('T')[0];
        const VALIDITY_DAYS = data.validityDays || 14;
        const expiresAtDate = data.expiresAt ? new Date(data.expiresAt) : new Date(now.getTime() + VALIDITY_DAYS * 24 * 60 * 60 * 1000);
        const expiresAt = expiresAtDate.toISOString();
        const expiryDate = data.expiryDate || expiresAtDate.toISOString().split('T')[0];

        const rawTicketData = {
          ...data,
          tripType: tripType,
          passengers: passengerCount,
          ticketNumber,
          bookingReference,
          createdAt,
          issueDate,
          expiryDate,
          expiresAt,
          validityDays: VALIDITY_DAYS,
          status: data.status || 'confirmed',
          paymentStatus: data.paymentStatus || 'paid',
          totalPrice: formattedTotalPrice,
          flightDetails: flightDetails || null,
          priceBreakdown: data.priceBreakdown || {
            basePrice: basePrice,
            passengers: passengerCount,
            total: data.finalPrice !== undefined ? data.finalPrice : calculatedTotal,
            currency: 'USD'
          }
        };

        const ticketData = deepCleanObject(rawTicketData) || rawTicketData;
        
        console.log('Ticket data generated and stored:', ticketData);

        try {
          const existing = JSON.parse(localStorage.getItem('sky_verified_tickets') || '[]');
          const filtered = existing.filter(t => t.bookingReference !== ticketData.bookingReference);
          filtered.unshift(ticketData);
          localStorage.setItem('sky_verified_tickets', JSON.stringify(filtered.slice(0, 50)));
        } catch (err) {
          console.error('Failed to save to sky_verified_tickets:', err);
        }

        // Save to Firebase Firestore cloud database for worldwide cross-device PNR verification
        saveTicketToFirestore(ticketData);

        // Synchronize with server backend for cross-device verification
        fetch('/api/tickets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ticketData)
        }).then(res => res.json())
          .then(data => console.log('Synced ticket to server store:', data))
          .catch(err => console.error('Failed to sync ticket to server:', err));
        
        set({
          ticketGenerated: true,
          ticketData: ticketData,
          selectedRoute: flightDetails || null,
          flightDetails: flightDetails || null,
          error: null
        });
      },
      
      setLoading: (isLoading) => set({ isLoading }),
      setKeepData: (keep) => set({ keepDataAfterSubmission: keep }),
      clearError: () => set({ error: null })
    }),
    {
      name: 'booking-storage',
      partialize: (state) => ({
        tripType: typeof state.tripType === 'string' ? state.tripType : 'round',
        passengers: typeof state.passengers === 'number' ? state.passengers : 1,
        departure: typeof state.departure === 'string' ? state.departure : '',
        destination: typeof state.destination === 'string' ? state.destination : '',
        departDate: typeof state.departDate === 'string' ? state.departDate : '',
        returnDate: typeof state.returnDate === 'string' ? state.returnDate : '',
        firstName: typeof state.firstName === 'string' ? state.firstName : '',
        lastName: typeof state.lastName === 'string' ? state.lastName : '',
        passport: typeof state.passport === 'string' ? state.passport : '',
        email: typeof state.email === 'string' ? state.email : '',
        paymentMethod: typeof state.paymentMethod === 'string' ? state.paymentMethod : 'credit',
        keepDataAfterSubmission: Boolean(state.keepDataAfterSubmission),
        ticketGenerated: Boolean(state.ticketGenerated),
        ticketData: state.ticketData ? deepCleanObject(state.ticketData) : null,
        selectedRoute: state.selectedRoute ? deepCleanObject(state.selectedRoute) : null,
        flightDetails: state.flightDetails ? deepCleanObject(state.flightDetails) : null
      })
    }
  )
);

export default useBookingStore;