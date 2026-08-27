// src/components/booking/TripDetails.jsx
import React, { useEffect } from 'react';
import AirportSearch from '../common/AirportSearch';
import RouteSelection from './RouteSelection';
import useBookingStore from '../../store/bookingStore';
import { 
  CalendarDays, 
  ArrowRight, 
  ArrowRightLeft, 
  Users, 
  Calendar, 
  CalendarRange, 
  AlertCircle 
} from 'lucide-react';

const TripDetails = ({ register, errors, watch, setValue, routeError }) => {
  const { 
    updateField, 
    getPrice,
    availableRoutes,
    selectedRoute,
    isLoadingRoutes,
    fetchAvailableRoutes,
    selectRoute
  } = useBookingStore();

  const tripType = watch('tripType');
  const passengers = watch('passengers') || 1;
  const departure = watch('departure');
  const destination = watch('destination');
  const departDate = watch('departDate');
  const returnDate = watch('returnDate');
  const totalPrice = getPrice();

  // Exchange rate: 1 USD = 12 GHS
  const USD_TO_GHS = 12.00;

  // Fetch available route options when departure, destination, and date(s) are filled out
  useEffect(() => {
    if (departure && destination && departDate) {
      if (tripType === 'round' && !returnDate) {
        return;
      }
      fetchAvailableRoutes({
        departure,
        destination,
        departDate,
        returnDate,
        tripType,
        passengers
      });
    }
  }, [departure, destination, departDate, returnDate, tripType, passengers, fetchAvailableRoutes]);

  return (
    <div className="trip-details-expanded-view">
      {/* Top Header & Trip Type + Passenger Controls */}
      <div className="trip-top-bar">
        <div className="section-title" style={{ marginBottom: 0, borderBottom: 'none' }}>
          <CalendarDays size={19} /> <span>Trip Details</span>
        </div>

        <div className="trip-top-controls">
          <div className="field-group radio-group" style={{ marginBottom: 0 }}>
            <label className={`radio-label ${tripType === 'oneway' ? 'active' : ''}`}>
              <input type="radio" value="oneway" {...register('tripType')} />
              <ArrowRight size={15} /> One-way
              <span className="price-tag">$10</span>
            </label>
            <label className={`radio-label ${tripType === 'round' ? 'active' : ''}`}>
              <input type="radio" value="round" {...register('tripType')} />
              <ArrowRightLeft size={15} /> Round trip
              <span className="price-tag">$12</span>
            </label>
          </div>

          <div className="passenger-control-box">
            <label className="passenger-control-label">
              <Users size={15} /> <span>Passengers:</span>
            </label>
            <div className="passenger-selector">
              <button 
                type="button" 
                onClick={() => {
                  const val = Math.max(1, passengers - 1);
                  setValue('passengers', val);
                  updateField('passengers', val);
                }}
              >
                −
              </button>
              <span className="passenger-count-number">
                {passengers}
              </span>
              <button 
                type="button" 
                onClick={() => {
                  const val = Math.min(9, passengers + 1);
                  setValue('passengers', val);
                  updateField('passengers', val);
                }}
              >
                +
              </button>
            </div>
            {errors.passengers && (
              <span className="error-message">{errors.passengers.message}</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Flight Inputs Expanded Horizontally */}
      <div className="trip-fields-horizontal-grid">
        {/* Departure Airport */}
        <div className="field-group trip-input-col">
          <input type="hidden" {...register('departure')} />
          <AirportSearch
            label="Departure Airport"
            value={watch('departure')}
            onChange={(code) => {
              setValue('departure', code, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
              updateField('departure', code);
            }}
            placeholder="Type departure airport name or code (e.g. London Heathrow, JFK)..."
            required={true}
            hasError={!!errors.departure}
            className={errors.departure ? 'has-error' : ''}
          />
          {errors.departure && (
            <span className="error-message"><AlertCircle size={14} /> {errors.departure.message}</span>
          )}
        </div>

        {/* Destination Airport */}
        <div className="field-group trip-input-col">
          <input type="hidden" {...register('destination')} />
          <AirportSearch
            label="Destination Airport"
            value={watch('destination')}
            onChange={(code) => {
              setValue('destination', code, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
              updateField('destination', code);
            }}
            placeholder="Type destination airport name or code (e.g. Dubai, Paris CDG)..."
            required={true}
            hasError={!!errors.destination}
            className={errors.destination ? 'has-error' : ''}
          />
          {errors.destination && (
            <span className="error-message"><AlertCircle size={14} /> {errors.destination.message}</span>
          )}
        </div>

        {/* Departure Date */}
        <div className={`field-group trip-input-col ${tripType === 'oneway' ? 'span-dates-full' : ''}`}>
          <label><Calendar size={16} /> <span>Departure Date</span></label>
          <input 
            type="date" 
            {...register('departDate')}
            className={errors.departDate ? 'has-error' : ''}
            min={new Date().toISOString().split('T')[0]}
          />
          {errors.departDate && (
            <span className="error-message"><AlertCircle size={14} /> {errors.departDate.message}</span>
          )}
        </div>

        {/* Return Date (if round trip) */}
        {tripType === 'round' && (
          <div className="field-group trip-input-col">
            <label><CalendarRange size={16} /> <span>Return Date</span></label>
            <input 
              type="date" 
              {...register('returnDate')}
              className={errors.returnDate ? 'has-error' : ''}
              min={watch('departDate') || new Date().toISOString().split('T')[0]}
            />
            {errors.returnDate && (
              <span className="error-message"><AlertCircle size={14} /> {errors.returnDate.message}</span>
            )}
          </div>
        )}
      </div>

      {/* Available Routes Component - User picks one after selecting date(s) */}
      <RouteSelection
        availableRoutes={availableRoutes}
        selectedRoute={selectedRoute}
        onSelectRoute={selectRoute}
        isLoadingRoutes={isLoadingRoutes}
        departure={departure}
        destination={destination}
        departDate={departDate}
        returnDate={returnDate}
        tripType={tripType}
        hasError={routeError}
      />

      {/* Price Display */}
      <div className="price-display">
        <div className="price-item">
          <span>Base price (per passenger):</span>
          <span>{tripType === 'oneway' ? '$10.00 USD' : '$12.00 USD'}</span>
          <span style={{ color: '#8aa3b5', fontSize: '0.75rem' }}>
            (~GHS {(tripType === 'oneway' ? 10 : 12) * USD_TO_GHS})
          </span>
        </div>
        <div className="price-item">
          <span>Passengers:</span>
          <span>{passengers}</span>
        </div>
        <div className="price-total">
          <span>Total:</span>
          <span className="total-amount">${totalPrice.toFixed(2)} USD</span>
          <span style={{ color: '#8aa3b5', fontSize: '0.75rem' }}>
            (~GHS {(totalPrice * USD_TO_GHS).toFixed(0)})
          </span>
        </div>
      </div>
    </div>
  );
};

export default TripDetails;
