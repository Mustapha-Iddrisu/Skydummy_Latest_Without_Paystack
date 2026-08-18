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
      paymentMethod: 'credit',
      
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
      
      generateTicket: (data) => {
        console.log('Generating ticket with data:', data);
        
        const ticketNumber = `SKY${Date.now().toString().slice(-8)}`;
        const bookingReference = `REF${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        const totalPrice = get().getTotal();
        const flightDetails = get().selectedRoute || get().flightDetails;
        
        const tripType = data.tripType || get().tripType || 'oneway';
        
        const now = new Date();
        const createdAt = now.toISOString();
        const issueDate = now.toISOString().split('T')[0];
        const VALIDITY_DAYS = 14;
        const expiresAtDate = new Date(now.getTime() + VALIDITY_DAYS * 24 * 60 * 60 * 1000);
        const expiresAt = expiresAtDate.toISOString();
        const expiryDate = expiresAtDate.toISOString().split('T')[0];

        const rawTicketData = {
          ...data,
          tripType: tripType,
          ticketNumber,
          bookingReference,
          createdAt,
          issueDate,
          expiryDate,
          expiresAt,
          validityDays: VALIDITY_DAYS,
          status: 'confirmed',
          totalPrice: `$${totalPrice.toFixed(2)} USD`,
          flightDetails: flightDetails || null,
          priceBreakdown: {
            basePrice: data.tripType === 'oneway' ? PRICES.oneWay : PRICES.roundTrip,
            passengers: data.passengers,
            total: totalPrice,
            currency: 'USD'
          }
        };

        const ticketData = deepCleanObject(rawTicketData) || rawTicketData;
        
        console.log('Ticket data generated:', ticketData);

        try {
          const existing = JSON.parse(localStorage.getItem('sky_verified_tickets') || '[]');
          existing.unshift(ticketData);
          localStorage.setItem('sky_verified_tickets', JSON.stringify(existing.slice(0, 50)));
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
        keepDataAfterSubmission: Boolean(state.keepDataAfterSubmission)
      })
    }
  )
);

export default useBookingStore;