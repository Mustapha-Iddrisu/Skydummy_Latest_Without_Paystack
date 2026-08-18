// src/components/booking/QuickBookingWidget.jsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import AirportSearch from '../common/AirportSearch';
import useBookingStore from '../../store/bookingStore';

const quickSearchSchema = yup.object().shape({
  tripType: yup.string().oneOf(['oneway', 'round']).required(),
  passengers: yup.number().min(1).max(9).required(),
  departure: yup.string().min(2, 'Enter a valid airport').required('Departure airport is required'),
  destination: yup.string().min(2, 'Enter a valid airport').required('Destination airport is required')
    .notOneOf([yup.ref('departure')], 'Destination must be different from departure'),
  departDate: yup.string().required('Departure date is required'),
  returnDate: yup.string().when('tripType', {
    is: 'round',
    then: (schema) => schema.required('Return date is required for round trips'),
    otherwise: (schema) => schema.nullable()
  })
});

const QuickBookingWidget = ({ onSearch }) => {
  const { tripType: storeTripType, passengers: storePassengers } = useBookingStore();
  const [tripType, setTripType] = useState(storeTripType || 'round');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(quickSearchSchema),
    defaultValues: {
      tripType: storeTripType || 'round',
      passengers: storePassengers || 1,
      departure: '',
      destination: '',
      departDate: '',
      returnDate: ''
    }
  });

  const currentTripType = watch('tripType');
  const departDate = watch('departDate');

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'tripType') {
        setTripType(value.tripType);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    console.log('Quick search submitted:', data);
    
    try {
      const departDateObj = new Date(data.departDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (departDateObj < today) {
        alert('Departure date must be in the future');
        setIsSubmitting(false);
        return;
      }
      
      if (data.tripType === 'round' && data.returnDate) {
        const returnDateObj = new Date(data.returnDate);
        if (returnDateObj <= departDateObj) {
          alert('Return date must be after departure date');
          setIsSubmitting(false);
          return;
        }
      }
      
      if (onSearch) {
        onSearch(data);
      }
    } catch (error) {
      console.error('Error in quick search:', error);
      alert('Please check your input and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTripTypeChange = (type) => {
    setTripType(type);
    setValue('tripType', type);
    if (type === 'oneway') {
      setValue('returnDate', '');
    }
  };

  const handleAirportChange = (field, code) => {
    setValue(field, code);
    // Trigger validation
    setValue(field, code, { shouldValidate: true });
  };

  return (
    <div className="quick-booking-widget">
      <div className="widget-header">
        <i className="fas fa-search"></i>
        <span>Quick Search</span>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="quick-booking-form">
        <div className="quick-trip-type">
          <button
            type="button"
            className={`trip-btn ${currentTripType === 'oneway' ? 'active' : ''}`}
            onClick={() => handleTripTypeChange('oneway')}
          >
            <i className="fas fa-arrow-right"></i> One-way
            <span className="price-badge">$10</span>
          </button>
          <button
            type="button"
            className={`trip-btn ${currentTripType === 'round' ? 'active' : ''}`}
            onClick={() => handleTripTypeChange('round')}
          >
            <i className="fas fa-exchange-alt"></i> Round trip
            <span className="price-badge">$12</span>
          </button>
        </div>

        <div className="quick-airports">
          <div className="quick-field">
            <AirportSearch
              value={watch('departure')}
              onChange={(code) => handleAirportChange('departure', code)}
              placeholder="From: City or Airport"
              className={errors.departure ? 'has-error' : ''}
            />
            {errors.departure && (
              <span className="quick-error">{errors.departure.message}</span>
            )}
          </div>
          
          <div className="quick-swap">
            <button 
              type="button" 
              className="swap-btn" 
              onClick={() => {
                const dep = watch('departure');
                const dest = watch('destination');
                setValue('departure', dest);
                setValue('destination', dep);
              }}
            >
              <i className="fas fa-exchange-alt"></i>
            </button>
          </div>
          
          <div className="quick-field">
            <AirportSearch
              value={watch('destination')}
              onChange={(code) => handleAirportChange('destination', code)}
              placeholder="To: City or Airport"
              className={errors.destination ? 'has-error' : ''}
            />
            {errors.destination && (
              <span className="quick-error">{errors.destination.message}</span>
            )}
          </div>
        </div>

        <div className="quick-details">
          <div className="quick-field">
            <label><i className="fas fa-calendar-day"></i> Depart</label>
            <input 
              type="date" 
              {...register('departDate')}
              className={errors.departDate ? 'has-error' : ''}
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.departDate && (
              <span className="quick-error">{errors.departDate.message}</span>
            )}
          </div>

          {currentTripType === 'round' && (
            <div className="quick-field">
              <label><i className="fas fa-calendar-week"></i> Return</label>
              <input 
                type="date" 
                {...register('returnDate')}
                className={errors.returnDate ? 'has-error' : ''}
                min={departDate || new Date().toISOString().split('T')[0]}
              />
              {errors.returnDate && (
                <span className="quick-error">{errors.returnDate.message}</span>
              )}
            </div>
          )}

          <div className="quick-field passengers-field">
            <label><i className="fas fa-user-friends"></i> Passengers</label>
            <div className="passenger-selector small">
              <button 
                type="button" 
                onClick={() => {
                  const val = Math.max(1, (watch('passengers') || 1) - 1);
                  setValue('passengers', val);
                }}
              >
                −
              </button>
              <span>{watch('passengers') || 1}</span>
              <button 
                type="button" 
                onClick={() => {
                  const val = Math.min(9, (watch('passengers') || 1) + 1);
                  setValue('passengers', val);
                }}
              >
                +
              </button>
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          className="quick-search-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <i className="fas fa-spinner fa-spin"></i> Searching...
            </>
          ) : (
            <>
              <i className="fas fa-search"></i> Search & Continue
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default QuickBookingWidget;