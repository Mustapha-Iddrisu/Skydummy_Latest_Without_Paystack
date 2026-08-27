// src/pages/PassengerPage.jsx
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import PassengerDetails from '../components/booking/PassengerDetails';
import PaymentMethod from '../components/booking/PaymentMethod';
import PaymentRedirectModal from '../components/booking/PaymentRedirectModal';
import useBookingStore from '../store/bookingStore';
import { passengerPageSchema } from '../utils/validation';
import { validateCoupon } from '../utils/coupons';
import { deepCleanObject } from '../services/firebaseService';
import { getSelarProductUrl } from '../utils/selarLinks';
import { 
  PlaneTakeoff, 
  ArrowLeft, 
  Ticket, 
  Gift, 
  Tag, 
  CheckCircle, 
  X, 
  Star, 
  AlertTriangle, 
  Loader2, 
  ShieldCheck, 
  Lock, 
  Calendar, 
  Users, 
  ArrowRight,
  Info
} from 'lucide-react';

const PassengerPage = () => {
  const navigate = useNavigate();
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('selar');
  const [validationAlert, setValidationAlert] = useState(null);

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
    tripType,
    passengers,
    departure,
    destination,
    departDate,
    returnDate,
    selectedRoute,
    flightDetails,
    updateField,
    generateTicket,
    setLoading,
    isLoading,
    fetchFlightDetails,
    ...formData
  } = useBookingStore();

  // Redirect to home if trip details are not filled
  useEffect(() => {
    // Only redirect if absolutely no route info and user is idle
    const timer = setTimeout(() => {
      const currentStore = useBookingStore.getState();
      if (!currentStore.departure && !currentStore.destination) {
        console.warn('Trip details not filled, redirecting to home...');
        navigate('/');
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [navigate]);

  const passengerCount = Math.min(Math.max(Number(passengers) || 1, 1), 9);
  const totalPriceUSD = useBookingStore.getState().getPrice();
  const USD_TO_GHS = 12.00;
  const totalPriceGHS = totalPriceUSD * USD_TO_GHS;

  // Initialize form with existing or empty passenger fields
  const initialPassengerList = [];
  for (let i = 0; i < passengerCount; i++) {
    if (formData.passengerList && formData.passengerList[i]) {
      initialPassengerList.push(formData.passengerList[i]);
    } else {
      initialPassengerList.push({
        firstName: i === 0 ? (formData.firstName || '') : '',
        lastName: i === 0 ? (formData.lastName || '') : '',
        passport: i === 0 ? (formData.passport || '') : '',
        type: 'adult',
        dob: ''
      });
    }
  }

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(passengerPageSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      passengerList: initialPassengerList,
      email: formData.email || '',
      paymentMethod: formData.paymentMethod || 'selar',
      couponCode: ''
    }
  });

  const watchCouponCode = watch('couponCode');
  const watchPaymentMethod = watch('paymentMethod');

  // Handle coupon logic
  const handleApplyCoupon = () => {
    const code = watchCouponCode?.trim();
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

  const handleRemoveCoupon = () => {
    setIsCouponApplied(false);
    setDiscountAmount(0);
    setCouponCode('');
    setValue('couponCode', '');
  };

  const getFinalPriceUSD = () => {
    if (isCouponApplied) {
      return Math.max(0, totalPriceUSD - discountAmount);
    }
    return totalPriceUSD;
  };

  const getFinalPriceGHS = () => {
    return getFinalPriceUSD() * USD_TO_GHS;
  };

  const isAdminCoupon = couponCode === 'SKYADMIN2024';

  // Format dates for trip summary banner
  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const onFormValid = async (submittedData) => {
    console.log('📝 Submitting passenger form:', submittedData);
    setValidationAlert(null);
    setIsSubmitting(true);
    setLoading(true);

    try {
      // Ensure flight details
      let finalFlightDetails = flightDetails || selectedRoute;
      if (!finalFlightDetails) {
        finalFlightDetails = await fetchFlightDetails(tripType || 'round');
      }

      const passengerList = submittedData.passengerList || [];
      const firstPassenger = passengerList[0] || {};
      const pnr = `REF${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const finalAmountUSD = getFinalPriceUSD();

      const ticketData = {
        tripType: tripType || 'round',
        passengers: passengerCount,
        departure,
        destination,
        departDate,
        returnDate: returnDate || '',
        bookingReference: pnr,
        isAdmin: isAdminCoupon,
        couponApplied: isCouponApplied,
        couponCode: couponCode,
        discountAmount: discountAmount,
        finalPrice: finalAmountUSD,
        originalPrice: totalPriceUSD,
        finalPriceGHS: getFinalPriceGHS(),
        flightDetails: finalFlightDetails,
        paymentMethod: submittedData.paymentMethod || 'selar',
        paymentStatus: isAdminCoupon ? 'free' : 'pending_payment',
        passengerList: passengerList,
        firstName: firstPassenger.firstName || '',
        lastName: firstPassenger.lastName || '',
        passport: firstPassenger.passport || '',
        email: submittedData.email || '',
        passengerCount: passengerCount
      };

      // Admin coupon bypasses payment directly
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

      // Generate the exact Selar hosted product URL based on tripType & passenger count with query parameters
      const customerFullName = `${firstPassenger.firstName || ''} ${firstPassenger.lastName || ''}`.trim() || 'Valued Customer';
      const selarResult = getSelarProductUrl({
        tripType: tripType || 'round',
        passengers: passengerCount,
        email: submittedData.email || '',
        name: customerFullName,
        pnr: pnr
      });

      console.log(`Resolved Selar product link for [${selarResult.tripType}] x ${selarResult.passengers} passenger(s):`, selarResult.url);

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

    } catch (err) {
      console.error('Error during checkout initiation:', err);
      alert('There was an issue initiating your payment. Generating your ticket preview.');
      navigate('/ticket');
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  const onFormInvalid = (formErrors) => {
    console.error('Passenger form validation errors:', formErrors);
    let missing = [];
    if (formErrors.email) missing.push('Contact Email');
    if (formErrors.passengerList) {
      missing.push('All Passenger First Name, Last Name & Passport numbers');
    }

    if (missing.length > 0) {
      setValidationAlert(`Please fill in: ${missing.join(', ')}`);
    } else {
      setValidationAlert('Please complete all passenger fields and email address.');
    }

    // Scroll to top of form
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  return (
    <div className="passenger-page-wrapper">
      <Navbar />

      <main className="passenger-main-container">
        {/* Step Indicator Header */}
        <div className="passenger-header-card">
          <div className="step-indicator-bar">
            <Link to="/" className="step-pill completed">
              <span className="step-num">✓</span>
              <span className="step-text">Trip: {departure} ➔ {destination}</span>
            </Link>
            <div className="step-connector active"></div>
            <div className="step-pill active">
              <span className="step-num">2</span>
              <span className="step-text">Passenger & Payment</span>
            </div>
          </div>

          {/* Trip Summary Pill */}
          <div className="trip-recap-banner">
            <div className="recap-route">
              <PlaneTakeoff size={20} color="#2563eb" />
              <div>
                <strong style={{ fontSize: '1.05rem', color: '#0b2b40' }}>
                  {departure} ➔ {destination}
                </strong>
                <span style={{ display: 'block', fontSize: '0.8rem', color: '#64748b' }}>
                  {tripType === 'oneway' ? 'One-way' : 'Round-trip'} • Depart: {formatDateDisplay(departDate)}
                  {returnDate ? ` • Return: ${formatDateDisplay(returnDate)}` : ''}
                </span>
              </div>
            </div>

            <div className="recap-meta">
              <div className="recap-badge">
                <Users size={14} />
                <span>{passengerCount} {passengerCount > 1 ? 'Passengers' : 'Passenger'}</span>
              </div>
              <Link to="/" className="btn-edit-trip">
                <ArrowLeft size={14} /> Change Trip
              </Link>
            </div>
          </div>
        </div>

        {/* Passenger & Payment Form */}
        <form onSubmit={handleSubmit(onFormValid, onFormInvalid)} className="passenger-form-content">
          {validationAlert && (
            <div className="validation-alert-banner">
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
              >
                <X size={16} />
              </button>
            </div>
          )}

          <div className="passenger-vertical-flow">
            {/* 1. Passenger Details */}
            <div className="passenger-details-section">
              <PassengerDetails 
                register={register} 
                errors={errors} 
                watch={watch}
                setValue={setValue}
                passengers={passengerCount}
              />
            </div>

            {/* 2. Coupon Section (Follows down) */}
            <div className="coupon-card-box">
              <div className="section-title">
                <Gift size={18} /> <span>Coupon Code</span>
              </div>
              
              {!isCouponApplied ? (
                <div className="coupon-input-group">
                  <input
                    type="text"
                    {...register('couponCode')}
                    placeholder="Enter promo coupon code (e.g. SKYADMIN2024)..."
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

            {/* 3. Secure Payment Method Selector (Follows down) */}
            <PaymentMethod register={register} errors={errors} watch={watch} />

            {/* 4. Price Summary Breakdown */}
            <div className="order-summary-card">
              <h4 className="summary-card-title">Order Summary</h4>
              
              <div className="summary-item-row">
                <span>Flight Ticket ({passengerCount} × {tripType === 'oneway' ? '$10.00' : '$12.00'}):</span>
                <span>${totalPriceUSD.toFixed(2)} USD</span>
              </div>

              {isCouponApplied && discountAmount > 0 && (
                <div className="summary-item-row discount">
                  <span>Coupon Discount:</span>
                  <span>-${discountAmount.toFixed(2)} USD</span>
                </div>
              )}

              <div className="summary-divider"></div>

              <div className="summary-total-row">
                <div>
                  <span className="total-label">Total to Pay</span>
                  <span className="total-subtext">Instant IATA Verified Ticket</span>
                </div>
                <div className="total-price-block">
                  <span className="total-usd-amount">
                    {isAdminCoupon ? 'FREE 🎉' : `$${getFinalPriceUSD().toFixed(2)} USD`}
                  </span>
                  {!isAdminCoupon && (
                    <span className="total-ghs-approx">
                      (~GHS {getFinalPriceGHS().toFixed(0)})
                    </span>
                  )}
                </div>
              </div>

              {isCouponApplied && !isAdminCoupon && (
                <div className="coupon-badge-strip">
                  <Tag size={13} /> <span>Coupon applied - {((discountAmount / totalPriceUSD) * 100).toFixed(0)}% off</span>
                </div>
              )}
              {isAdminCoupon && (
                <div className="coupon-badge-strip admin">
                  <Star size={13} fill="#16a34a" /> <span>Admin coupon - 100% discount applied</span>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Pay / Submit Bar */}
          <div className="passenger-pay-bottom-bar">
            <div className="bottom-disclaimer">
              <ShieldCheck size={18} color="#16a34a" />
              <span>Secured by Selar. Instant verification code & downloadable PDF issued upon payment.</span>
            </div>

            <div className="bottom-action-buttons">
              <Link to="/" className="btn-back-link">
                <ArrowLeft size={16} /> Back to Trip Details
              </Link>

              <button 
                type="submit" 
                className="btn-pay-now"
                disabled={isLoading || isSubmitting}
              >
                {isLoading || isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Connecting to Payment...</span>
                  </>
                ) : (
                  <>
                    <Ticket size={20} />
                    <span>
                      {isAdminCoupon ? 'Generate Free Ticket' : `Pay $${getFinalPriceUSD().toFixed(2)} USD & Get Ticket`}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </main>

      <Footer />

      {/* Selar Modal to redirect safely */}
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
    </div>
  );
};

export default PassengerPage;
