// src/components/booking/CouponInput.jsx
import React from 'react';

const CouponInput = ({ register, couponCode, isApplied, onApply, onRemove }) => {
  return (
    <div className="coupon-section">
      <div className="section-title">
        <i className="fas fa-gift"></i> Coupon Code
      </div>
      
      {!isApplied ? (
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
            onClick={onApply}
          >
            Apply
          </button>
        </div>
      ) : (
        <div className="coupon-applied">
          <div className="coupon-applied-info">
            <i className="fas fa-check-circle"></i>
            <span>Coupon applied successfully!</span>
          </div>
          <button 
            type="button" 
            className="coupon-remove-btn"
            onClick={onRemove}
          >
            <i className="fas fa-times"></i> Remove
          </button>
        </div>
      )}
      
      <div className="coupon-info">
        <i className="fas fa-info-circle"></i>
        <span>Have a coupon code? Enter it above for discounts.</span>
      </div>
    </div>
  );
};

export default CouponInput;