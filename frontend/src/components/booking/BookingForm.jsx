// src/components/booking/BookingForm.jsx
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  Info, 
  X, 
  Gift, 
  CheckCircle, 
  Tag, 
  Star, 
  Loader2, 
  Ticket, 
  Bell, 
  Edit3, 
  PlaneTakeoff, 
  Route as RouteIcon, 
  Users, 
  Mail 
} from 'lucide-react';
import { bookingSchema } from '../../utils/validation';
import useBookingStore from '../../store/bookingStore';
import TripDetails from './TripDetails';
import PassengerDetails from './PassengerDetails';
import PaymentMethod from './PaymentMethod';
import PaymentRedirectModal from './PaymentRedirectModal';
import { validateCoupon } from '../../utils/coupons';
import { deepCleanObject } from '../../services/firebaseService';
import { getSelarProductUrl } from '../../utils/selarLinks';


const BookingForm = () => {
  const navigate = useNavigate();
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('selar');
  
  const [routeError, setRouteError] = useState(false);
  const [validationPrompt, setValidationPrompt] = useState(null);
  const [alertModalData, setAlertModalData] = useState({ isOpen: false, sections: [], totalCount: 0 });
  const [selarRedirectModal, setSelarRedirectModal] = useState({
    isOpen: false,
    checkoutUrl: '',
    pnr: '',
    amount: 0,
    tripType: 'round',
    passengers: 1,
    isConfigured: true
  });
  
  const { 
    updateField, 
    generateTicket, 
    setLoading,
    fetchFlightDetails,
    isLoading,
    selectedRoute,
    availableRoutes,
    ...formData 
  } = useBookingStore();
  
  const { register, handleSubmit, watch, setValue, setError, reset, formState: { errors } } = useForm({
    resolver: yupResolver(bookingSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      tripType: formData.tripType || 'round',
      passengers: formData.passengers || 1,
      departure: formData.departure || '',
      destination: formData.destination || '',
      departDate: formData.departDate || '',
      returnDate: formData.returnDate || '',
      firstName: formData.firstName || '',
      lastName: formData.lastName || '',
      passport: formData.passport || '',
      email: formData.email || '',
      paymentMethod: formData.paymentMethod || 'selar',
      couponCode: '',
      passengerList: formData.passengerList || [{ firstName: '', lastName: '', passport: '' }]
    }
  });

  // Watch values
  const watchCouponCode = watch('couponCode');
  const watchPaymentMethod = watch('paymentMethod');
  const watchTripType = watch('tripType');
  const passengerCount = watch('passengers') || 1;
  const totalPriceUSD = useBookingStore.getState().getPrice();

  // Exchange rate: 1 USD = 12 GHS
  const USD_TO_GHS = 12.00;
  const totalPriceGHS = totalPriceUSD * USD_TO_GHS;

  // Set payment method for modal
  useEffect(() => {
    setPaymentMethod(watchPaymentMethod || 'card');
  }, [watchPaymentMethod]);

  // Generate passenger list based on count
  useEffect(() => {
    const currentPassengers = watch('passengerList') || [];
    const newCount = passengerCount;
    const newPassengers = [];
    
    for (let i = 0; i < newCount; i++) {
      if (currentPassengers[i]) {
        newPassengers.push(currentPassengers[i]);
      } else {
        newPassengers.push({ firstName: '', lastName: '', passport: '' });
      }
    }
    
    setValue('passengerList', newPassengers, { shouldValidate: false });
  }, [passengerCount, setValue, watch]);

  // Fetch flight details when departure, destination, or dates change
  useEffect(() => {
    const departure = watch('departure');
    const destination = watch('destination');
    const departDate = watch('departDate');
    const tripType = watch('tripType');
    
    if (departure && destination && departDate) {
      fetchFlightDetails(tripType);
    }
  }, [watch('departure'), watch('destination'), watch('departDate'), watch('tripType')]);

  // Handle coupon application
  const handleApplyCoupon = () => {
    const code = watchCouponCode;
    if (!code) {
      alert('Please enter a coupon code');
      return;
    }
    
    const result = validateCoupon(code, totalPriceUSD);
    
    if (result.valid) {
      setIsCouponApplied(true);
      setDiscountAmount(result.discountAmount);
      setCouponCode(code);
      alert(`✅ Coupon applied! You saved $${result.discountAmount.toFixed(2)} USD`);
    } else {
      alert(`❌ ${result.message}`);
      setIsCouponApplied(false);
      setDiscountAmount(0);
    }
  };

  // Handle coupon removal
  const handleRemoveCoupon = () => {
    setIsCouponApplied(false);
    setDiscountAmount(0);
    setCouponCode('');
    setValue('couponCode', '');
  };

  // Calculate final price
  const getFinalPriceUSD = () => {
    if (isCouponApplied) {
      return Math.max(0, totalPriceUSD - discountAmount);
    }
    return totalPriceUSD;
  };

  // Get GHS price for Paystack
  const getFinalPriceGHS = () => {
    const usdPrice = getFinalPriceUSD();
    return usdPrice * USD_TO_GHS;
  };

  // Check if admin coupon is applied
  const isAdminCoupon = couponCode === 'SKYADMIN2024';

  // Sync store with form values
  useEffect(() => {
    const subscription = watch((value) => {
      if (!value || typeof value !== 'object') return;
      Object.keys(value).forEach(key => {
        const val = value[key];
        if (
          val !== undefined && 
          val !== null && 
          typeof val !== 'function'
        ) {
          const cleaned = typeof val === 'object' ? deepCleanObject(val) : val;
          if (cleaned !== undefined) {
            updateField(key, cleaned);
          }
        }
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, updateField]);

  // PROCESS THE FORM - Selar Checkout Integration
  const processForm = async (rawInputData) => {
    console.log('📝 Processing form for Selar payment...');
    const data = deepCleanObject(rawInputData) || rawInputData || {};
    
    setIsSubmitting(true);
    setLoading(true);
    
    try {
      // Fetch flight details
      let flightDetails = formData.flightDetails || selectedRoute;
      if (!flightDetails) {
        const tripType = data.tripType || 'oneway';
        flightDetails = await fetchFlightDetails(tripType);
      }

      // Get passenger list with types
      const passengerList = Array.isArray(data.passengerList) && data.passengerList.length > 0
        ? data.passengerList
        : [{ 
            firstName: data.firstName || '', 
            lastName: data.lastName || '',
            passport: data.passport || '',
            type: 'adult',
            dob: ''
          }];
      
      // Build passenger details
      const passengerDetails = passengerList.map(p => {
        const fullName = `${p?.firstName || ''} ${p?.lastName || ''}`.trim();
        return {
          name: fullName || 'Passenger',
          passport: p?.passport || 'N/A',
          type: p?.type || 'adult',
          dob: p?.dob || ''
        };
      });

      const pnr = `REF${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const finalAmountUSD = getFinalPriceUSD();

      // Prepare ticket data
      const ticketData = {
        ...data,
        bookingReference: pnr,
        tripType: data.tripType || 'oneway',
        isAdmin: isAdminCoupon,
        couponApplied: isCouponApplied,
        couponCode: couponCode,
        discountAmount: discountAmount,
        finalPrice: finalAmountUSD,
        originalPrice: totalPriceUSD,
        finalPriceGHS: getFinalPriceGHS(),
        flightDetails: flightDetails,
        paymentMethod: 'selar',
        paymentStatus: isAdminCoupon ? 'free' : 'pending_payment',
        passengerList: passengerList,
        passengerDetails: passengerDetails,
        passengerCount: data.passengers || 1
      };

      // If admin free coupon is used, bypass payment gateway directly
      if (isAdminCoupon || finalAmountUSD === 0) {
        generateTicket(ticketData);
        navigate('/ticket');
        return;
      }

      // Save pending ticket state locally so callback can reliably retrieve it
      try {
        localStorage.setItem('sky_pending_payment_ticket', JSON.stringify(ticketData));
      } catch (e) {
        console.warn('Could not save pending ticket to localStorage', e);
      }

      // Generate the exact Selar hosted product URL based strictly on tripType & passenger count with query parameters
      const customerFullName = `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Valued Customer';
      const selarResult = getSelarProductUrl({
        tripType: data.tripType || 'round',
        passengers: data.passengers || 1,
        email: data.email || '',
        name: customerFullName,
        pnr: pnr
      });

      console.log(`Resolved Selar product for [${selarResult.tripType}] x ${selarResult.passengers} passenger(s):`, selarResult.url || 'Not configured');

      // Open the Selar redirect modal corresponding to this exact trip type and passenger selection
      setSelarRedirectModal({
        isOpen: true,
        checkoutUrl: selarResult.url,
        pnr,
        amount: finalAmountUSD,
        tripType: selarResult.tripType,
        passengers: selarResult.passengers,
        isConfigured: selarResult.isConfigured
      });
    
    } catch (error) {
      console.error('❌ Error processing payment checkout:', error);
      alert('There was an issue initiating your payment. Generating your ticket preview directly.');
      generateTicket(rawInputData);
      navigate('/ticket');
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  // Trigger the outright validation alert prompt and highlight errors
  const triggerValidationAlert = (customSections = [], additionalCount = 0) => {
    const currentValues = watch();
    const missingTrip = [];
    const missingPassengers = [];
    const missingContact = [];
    const missingRoute = [];

    // Check Departure & Destination
    if (!currentValues.departure || currentValues.departure.trim().length < 2) {
      missingTrip.push('Departure airport');
      setError('departure', { type: 'manual', message: 'Departure airport is required' });
    }
    if (!currentValues.destination || currentValues.destination.trim().length < 2) {
      missingTrip.push('Destination airport');
      setError('destination', { type: 'manual', message: 'Destination airport is required' });
    } else if (
      currentValues.departure && 
      currentValues.departure.trim().toUpperCase() === currentValues.destination.trim().toUpperCase()
    ) {
      missingTrip.push('Destination airport (must differ from departure)');
      setError('destination', { type: 'manual', message: 'Destination must differ from departure' });
    }

    // Check Departure Date
    if (!currentValues.departDate) {
      missingTrip.push('Departure date');
      setError('departDate', { type: 'manual', message: 'Departure date is required' });
    } else {
      const depDateObj = new Date(currentValues.departDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (depDateObj < today) {
        missingTrip.push('Departure date (must be today or a future date)');
        setError('departDate', { type: 'manual', message: 'Departure date cannot be in the past' });
      }
    }

    // Check Return Date for round trip
    if (currentValues.tripType === 'round') {
      if (!currentValues.returnDate) {
        missingTrip.push('Return date for round trip');
        setError('returnDate', { type: 'manual', message: 'Return date is required for round trips' });
      } else if (currentValues.departDate) {
        const depDateObj = new Date(currentValues.departDate);
        const retDateObj = new Date(currentValues.returnDate);
        if (retDateObj <= depDateObj) {
          missingTrip.push('Return date (must be after departure date)');
          setError('returnDate', { type: 'manual', message: 'Return date must be after departure date' });
        }
      }
    }

    // Check Route Selection
    if (!selectedRoute) {
      setRouteError(true);
      missingRoute.push('Please select a flight route from the available flight options');
    } else {
      setRouteError(false);
    }

    // Check Passengers
    const pCount = currentValues.passengers || 1;
    const pList = currentValues.passengerList || [];
    for (let i = 0; i < pCount; i++) {
      const p = pList[i] || {};
      const pMiss = [];
      if (!p.firstName || !p.firstName.trim()) {
        pMiss.push('First Name');
        setError(`passengerList.${i}.firstName`, { type: 'manual', message: 'First name is required' });
      }
      if (!p.lastName || !p.lastName.trim()) {
        pMiss.push('Last Name');
        setError(`passengerList.${i}.lastName`, { type: 'manual', message: 'Last name is required' });
      }
      if (!p.passport || !p.passport.trim()) {
        pMiss.push('Passport Number');
        setError(`passengerList.${i}.passport`, { type: 'manual', message: 'Passport number is required' });
      } else if (p.passport.trim().length < 6) {
        pMiss.push('Passport Number (min 6 characters)');
        setError(`passengerList.${i}.passport`, { type: 'manual', message: 'Must be at least 6 characters' });
      }
      if (pMiss.length > 0) {
        missingPassengers.push(`Passenger ${i + 1}: ${pMiss.join(', ')}`);
      }
    }

    // Check Contact Email
    if (!currentValues.email || !currentValues.email.trim()) {
      missingContact.push('Email address');
      setError('email', { type: 'manual', message: 'Email address is required' });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentValues.email.trim())) {
      missingContact.push('Valid email format (e.g., yourname@domain.com)');
      setError('email', { type: 'manual', message: 'Invalid email address' });
    }

    const sections = [];
    if (missingTrip.length > 0) {
      sections.push({
        title: 'Trip Details Missing',
        iconType: 'trip',
        items: missingTrip
      });
    }
    if (missingRoute.length > 0) {
      sections.push({
        title: 'Flight Route Required',
        iconType: 'route',
        items: missingRoute
      });
    }
    if (missingPassengers.length > 0) {
      sections.push({
        title: 'Passenger Details Incomplete',
        iconType: 'passengers',
        items: missingPassengers
      });
    }
    if (missingContact.length > 0) {
      sections.push({
        title: 'Contact Information Missing',
        iconType: 'contact',
        items: missingContact
      });
    }

    // Merge custom sections if provided
    if (customSections && customSections.length > 0) {
      customSections.forEach(cs => {
        if (!sections.some(s => s.title === cs.title)) {
          sections.push(cs);
        }
      });
    }

    const totalCount = missingTrip.length + missingRoute.length + missingPassengers.length + missingContact.length + additionalCount;

    if (sections.length > 0) {
      const promptData = {
        sections,
        totalCount: Math.max(totalCount, 1)
      };

      setValidationPrompt(promptData);
      setAlertModalData({
        isOpen: true,
        sections: promptData.sections,
        totalCount: promptData.totalCount
      });

      // Smooth scroll to the first missing field or banner
      setTimeout(() => {
        const firstErrorEl = document.querySelector('.has-error, .airport-input-container.has-error input, .error-message, #route-selection-section.route-selection-error');
        if (firstErrorEl) {
          firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          if (typeof firstErrorEl.focus === 'function') firstErrorEl.focus();
        }
      }, 100);

      return false;
    }

    return true;
  };

  // Handle form submission when valid
  const onFormValid = (data) => {
    console.log('🎯 Form submission triggered, validating completeness...', data);
    
    // Perform full required fields check
    const isValid = triggerValidationAlert();
    if (!isValid) {
      return;
    }
    
    // Extract first passenger details for root normalization
    const passengerList = data.passengerList || [];
    const firstP = passengerList[0] || {};
    const firstName = data.firstName || firstP.firstName || '';
    const lastName = data.lastName || firstP.lastName || '';
    const passport = data.passport || firstP.passport || '';
    
    const normalizedData = {
      ...data,
      firstName,
      lastName,
      passport,
      passengerList
    };

    setValidationPrompt(null);
    setAlertModalData({ isOpen: false, sections: [], totalCount: 0 });
    
    // Generate and proceed to ticket immediately (no Paystack gateway called)
    processForm(normalizedData);
  };

  // Handle form submission when invalid - Immediately alert the user outright
  const onFormInvalid = (formErrors) => {
    console.error('❌ Form validation failed upon Pay click:', formErrors);
    triggerValidationAlert();
  };

  const handleCloseAlertModal = () => {
    setAlertModalData(prev => ({ ...prev, isOpen: false }));
    // Focus first error element
    setTimeout(() => {
      const firstErrorEl = document.querySelector('.has-error, .airport-input-container.has-error input, .error-message, #route-selection-section.route-selection-error');
      if (firstErrorEl) {
        firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (typeof firstErrorEl.focus === 'function') firstErrorEl.focus();
      }
    }, 100);
  };

  const renderSectionIcon = (iconType) => {
    switch (iconType) {
      case 'trip':
        return <PlaneTakeoff size={16} />;
      case 'route':
        return <RouteIcon size={16} />;
      case 'passengers':
        return <Users size={16} />;
      case 'contact':
        return <Mail size={16} />;
      default:
        return <Info size={16} />;
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onFormValid, onFormInvalid)} className="booking-form">
        {/* Immediate Validation Prompt Banner */}
        {validationPrompt && (
          <div className="validation-alert-banner" id="validation-alert-banner">
            <div className="validation-alert-icon">
              <AlertTriangle size={22} color="#dc2626" />
            </div>
            <div className="validation-alert-content">
              <div className="validation-alert-header">
                <h4>Please fill in the required details</h4>
                <span className="validation-alert-badge">
                  {validationPrompt.totalCount} {validationPrompt.totalCount === 1 ? 'item' : 'items'} required
                </span>
              </div>
              <div className="validation-alert-sections">
                {validationPrompt.sections.map((section, idx) => (
                  <div key={idx} className="validation-alert-section">
                    <div className="validation-alert-section-title">
                      {renderSectionIcon(section.iconType)}
                      <span>{section.title}</span>
                    </div>
                    <ul className="validation-alert-list">
                      {section.items.map((item, itemIdx) => (
                        <li key={itemIdx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <button
              type="button"
              className="validation-alert-close"
              onClick={() => setValidationPrompt(null)}
              aria-label="Close error banner"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="form-grid">
          <TripDetails 
            register={register} 
            errors={errors} 
            watch={watch}
            setValue={setValue}
            routeError={routeError}
          />
          
          <div>
            <PassengerDetails 
              register={register} 
              errors={errors} 
              watch={watch}
              setValue={setValue}
              passengers={passengerCount}
            />
            
            {/* Coupon Section */}
            <div className="coupon-section">
              <div className="section-title">
                <Gift size={18} /> <span>Coupon Code</span>
              </div>
              
              {!isCouponApplied ? (
                <div className="coupon-input-group">
                  <input
                    type="text"
                    {...register('couponCode')}
                    placeholder="Enter coupon code..."
                    className="coupon-input"
                  />
                  <button 
                    type="button" 
                    className="coupon-apply-btn"
                    onClick={handleApplyCoupon}
                  >
                    Apply
                  </button>
                </div>
              ) : (
                <div className="coupon-applied">
                  <div className="coupon-applied-info">
                    <CheckCircle size={16} color="#16a34a" />
                    <span>Coupon applied successfully!</span>
                  </div>
                  <button 
                    type="button" 
                    className="coupon-remove-btn"
                    onClick={handleRemoveCoupon}
                  >
                    <X size={14} /> Remove
                  </button>
                </div>
              )}
            </div>
            
            <PaymentMethod register={register} errors={errors} watch={watch} />
            
            {/* Price Display - USD with GHS approx */}
            <div className="price-display">
              <div className="price-item">
                <span>Original Price:</span>
                <span>${totalPriceUSD.toFixed(2)} USD</span>
                <span style={{ color: '#8aa3b5', fontSize: '0.75rem' }}>
                  (~GHS {totalPriceGHS.toFixed(0)})
                </span>
              </div>
              {isCouponApplied && discountAmount > 0 && (
                <div className="price-item" style={{ color: '#28a745' }}>
                  <span>Discount:</span>
                  <span>-${discountAmount.toFixed(2)} USD</span>
                  <span style={{ color: '#8aa3b5', fontSize: '0.75rem' }}>
                    (~GHS {(discountAmount * USD_TO_GHS).toFixed(0)})
                  </span>
                </div>
              )}
              <div className="price-total">
                <span>Total:</span>
                <span className="total-amount">
                  {isAdminCoupon ? (
                    <span style={{ color: '#28a745' }}>FREE 🎉</span>
                  ) : (
                    `$${getFinalPriceUSD().toFixed(2)} USD`
                  )}
                </span>
                {!isAdminCoupon && (
                  <span style={{ color: '#8aa3b5', fontSize: '0.75rem' }}>
                    (~GHS {getFinalPriceGHS().toFixed(0)})
                  </span>
                )}
              </div>
              {isCouponApplied && !isAdminCoupon && (
                <div className="price-item" style={{ color: '#28a745', fontSize: '0.8rem', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag size={13} /> <span>Coupon applied - {((discountAmount / totalPriceUSD) * 100).toFixed(0)}% off</span>
                </div>
              )}
              {isAdminCoupon && (
                <div className="price-item" style={{ color: '#28a745', fontSize: '0.8rem', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Star size={13} fill="#28a745" /> <span>Admin coupon - 100% discount</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="action-row">
          <button 
            type="submit" 
            className="btn-primary"
            disabled={isLoading || isSubmitting}
            onClick={() => {
              triggerValidationAlert();
            }}
          >
            {isLoading || isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>{isSubmitting ? 'Generating Ticket...' : 'Processing...'}</span>
              </>
            ) : (
              <>
                <Ticket size={18} />
                <span>{isAdminCoupon ? 'Generate Free Ticket' : 
                 `Pay $${getFinalPriceUSD().toFixed(2)} USD`}</span>
              </>
            )}
          </button>
          <p className="disclaimer">
            <Info size={14} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }} />
            For visa application purposes only. No real flight reservation.
          </p>
        </div>
      </form>

      {/* Outright Validation Alert Modal */}
      {alertModalData.isOpen && (
        <div className="validation-alert-modal-overlay" onClick={handleCloseAlertModal}>
          <div className="validation-alert-modal" onClick={(e) => e.stopPropagation()}>
            <div className="validation-modal-header">
              <div className="validation-modal-header-icon">
                <AlertTriangle size={24} color="#dc2626" />
              </div>
              <div className="validation-modal-header-text">
                <h3>Required Information Missing</h3>
                <p>Please complete all required fields before proceeding to payment.</p>
              </div>
              <button 
                type="button" 
                className="validation-modal-close-btn"
                onClick={handleCloseAlertModal}
                aria-label="Close alert"
              >
                <X size={18} />
              </button>
            </div>

            <div className="validation-modal-body">
              <div className="validation-modal-count-badge">
                <Bell size={14} />
                <span>{alertModalData.totalCount} {alertModalData.totalCount === 1 ? 'item requires' : 'items require'} your attention</span>
              </div>

              <div className="validation-modal-sections">
                {alertModalData.sections.map((sec, sIdx) => (
                  <div key={sIdx} className="validation-modal-card">
                    <div className="validation-modal-card-title">
                      {renderSectionIcon(sec.iconType)}
                      <span>{sec.title}</span>
                    </div>
                    <ul className="validation-modal-list">
                      {sec.items.map((it, itIdx) => (
                        <li key={itIdx}>{it}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="validation-modal-footer">
              <button 
                type="button" 
                className="validation-modal-btn-action"
                onClick={handleCloseAlertModal}
              >
                <Edit3 size={16} /> <span>Complete Required Fields</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selar External Checkout Modal to bypass iframe embed blocks */}
      <PaymentRedirectModal
        isOpen={selarRedirectModal.isOpen}
        onClose={() => setSelarRedirectModal(prev => ({ ...prev, isOpen: false }))}
        checkoutUrl={selarRedirectModal.checkoutUrl}
        pnr={selarRedirectModal.pnr}
        amount={selarRedirectModal.amount}
        tripType={selarRedirectModal.tripType}
        passengers={selarRedirectModal.passengers}
        isConfigured={selarRedirectModal.isConfigured}
      />
    </>
  );
};

export default BookingForm;