// src/components/booking/BookingForm.jsx
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  ArrowRight, 
  X, 
  Loader2, 
  Ticket, 
  CalendarDays, 
  MapPin, 
  AlertCircle,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { tripDetailsSchema } from '../../utils/validation';
import useBookingStore from '../../store/bookingStore';
import TripDetails from './TripDetails';
import { deepCleanObject } from '../../services/firebaseService';

const BookingForm = () => {
  const navigate = useNavigate();
  const [routeError, setRouteError] = useState(false);
  const [validationAlert, setValidationAlert] = useState(null);
  
  const { 
    updateField, 
    fetchFlightDetails,
    isLoading,
    selectedRoute,
    availableRoutes,
    ...formData 
  } = useBookingStore();
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(tripDetailsSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      tripType: formData.tripType || 'round',
      passengers: formData.passengers || 1,
      departure: formData.departure || '',
      destination: formData.destination || '',
      departDate: formData.departDate || '',
      returnDate: formData.returnDate || ''
    }
  });

  const watchTripType = watch('tripType');
  const watchPassengers = watch('passengers') || 1;
  const watchDeparture = watch('departure');
  const watchDestination = watch('destination');
  const watchDepartDate = watch('departDate');
  const watchReturnDate = watch('returnDate');

  const totalPriceUSD = useBookingStore.getState().getPrice();
  const USD_TO_GHS = 12.00;

  // Sync state into store
  useEffect(() => {
    const subscription = watch((value) => {
      if (!value || typeof value !== 'object') return;
      Object.keys(value).forEach(key => {
        const val = value[key];
        if (val !== undefined && val !== null && typeof val !== 'function') {
          const cleaned = typeof val === 'object' ? deepCleanObject(val) : val;
          if (cleaned !== undefined) {
            updateField(key, cleaned);
          }
        }
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, updateField]);

  // When departure, destination, or dates change, trigger route fetching
  useEffect(() => {
    if (watchDeparture && watchDestination && watchDepartDate) {
      if (watchTripType === 'round' && !watchReturnDate) return;
      fetchFlightDetails(watchTripType);
    }
  }, [watchDeparture, watchDestination, watchDepartDate, watchReturnDate, watchTripType]);

  const onProceed = (data) => {
    // Check if available routes exist but none selected
    if (availableRoutes && availableRoutes.length > 0 && !selectedRoute) {
      setRouteError(true);
      setValidationAlert('Please choose one of the available flight route options before proceeding.');
      const routeSection = document.getElementById('route-selection-section');
      if (routeSection) {
        routeSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setRouteError(false);
    setValidationAlert(null);

    // Save trip details into store
    updateField('tripType', data.tripType);
    updateField('passengers', Number(data.passengers) || 1);
    updateField('departure', data.departure);
    updateField('destination', data.destination);
    updateField('departDate', data.departDate);
    updateField('returnDate', data.returnDate || '');

    // Navigate to dedicated Passenger Details page
    navigate('/passengers');
  };

  const onInvalid = (formErrors) => {
    console.warn('Trip validation errors:', formErrors);
    let missing = [];
    if (formErrors.departure) missing.push('Departure Airport');
    if (formErrors.destination) missing.push('Destination Airport');
    if (formErrors.departDate) missing.push('Departure Date');
    if (formErrors.returnDate) missing.push('Return Date');
    if (formErrors.passengers) missing.push('Passenger Count');

    if (missing.length > 0) {
      setValidationAlert(`Please fill in: ${missing.join(', ')}`);
    } else {
      setValidationAlert('Please fill in all required trip details to proceed.');
    }
  };

  return (
    <div className="trip-booking-card">
      <div className="booking-card-header">
        <div className="step-indicator-bar">
          <div className="step-pill active">
            <span className="step-num">1</span>
            <span className="step-text">Trip Details</span>
          </div>
          <div className="step-connector"></div>
          <div className="step-pill">
            <span className="step-num">2</span>
            <span className="step-text">Passenger & Payment</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onProceed, onInvalid)} className="trip-form-single">
        {validationAlert && (
          <div className="validation-alert-banner" style={{ marginBottom: '1.25rem' }}>
            <div className="validation-alert-icon">
              <AlertTriangle size={20} color="#dc2626" />
            </div>
            <div className="validation-alert-content">
              <span style={{ fontSize: '0.9rem', color: '#991b1b', fontWeight: 600 }}>
                {validationAlert}
              </span>
            </div>
            <button
              type="button"
              className="validation-alert-close"
              onClick={() => setValidationAlert(null)}
              aria-label="Close error message"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="trip-details-container">
          <TripDetails 
            register={register} 
            errors={errors} 
            watch={watch}
            setValue={setValue}
            routeError={routeError}
          />
        </div>

        <div className="trip-action-card">
          <div className="trip-action-summary">
            <div className="summary-col">
              <span className="summary-label">Trip Type</span>
              <span className="summary-val">{watchTripType === 'oneway' ? 'One-way Flight' : 'Round-trip Flight'}</span>
            </div>
            <div className="summary-col">
              <span className="summary-label">Passengers</span>
              <span className="summary-val" style={{ color: '#2563eb', fontWeight: 700 }}>
                {watchPassengers} {watchPassengers > 1 ? 'Passengers' : 'Passenger'}
              </span>
            </div>
            <div className="summary-col right">
              <span className="summary-label">Subtotal</span>
              <span className="summary-price">${totalPriceUSD.toFixed(2)} USD</span>
            </div>
          </div>

          <div className="action-button-row">
            <button 
              type="submit" 
              className="btn-proceed-step"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Loading flight options...</span>
                </>
              ) : (
                <>
                  <span>Proceed to Passenger Details</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>

          <div className="booking-trust-strip">
            <div className="trust-item">
              <CheckCircle2 size={15} color="#16a34a" />
              <span>Instant PNR Generation</span>
            </div>
            <div className="trust-item">
              <ShieldCheck size={15} color="#2563eb" />
              <span>100% Visa & Embassies Verified</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
