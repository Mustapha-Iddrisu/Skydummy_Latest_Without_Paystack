// src/components/booking/CreditCardInput.jsx
import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

const CreditCardInput = ({ register, errors, watch }) => {
  // Watch card fields for real-time preview
  const cardNumber = watch('cardNumber') || '';
  const cardName = watch('cardName') || '';
  const expiryDate = watch('expiryDate') || '';
  const cvv = watch('cvv') || '';
  
  // Detect card type
  const getCardType = (number) => {
    const clean = number.replace(/\s/g, '');
    if (clean.startsWith('4')) return { type: 'visa', icon: 'fab fa-cc-visa', color: '#1a1f71' };
    if (clean.startsWith('5')) return { type: 'mastercard', icon: 'fab fa-cc-mastercard', color: '#eb001b' };
    if (clean.startsWith('3')) return { type: 'amex', icon: 'fab fa-cc-amex', color: '#006fcf' };
    if (clean.startsWith('6')) return { type: 'discover', icon: 'fab fa-cc-discover', color: '#ff6000' };
    return { type: 'unknown', icon: 'fas fa-credit-card', color: '#333' };
  };

  const cardType = getCardType(cardNumber);
  const [isFocused, setIsFocused] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  // Auto-format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Format expiry date (MM/YY)
  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  // Handle input focus
  const handleFocus = (field) => {
    if (field === 'cvv') {
      setIsFlipped(true);
    } else {
      setIsFlipped(false);
    }
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setIsFlipped(false);
  };

  // Mask card number for display
  const getMaskedNumber = (number) => {
    const clean = number.replace(/\s/g, '');
    if (clean.length <= 4) return clean;
    const last4 = clean.slice(-4);
    const stars = '•'.repeat(Math.min(clean.length - 4, 12));
    return stars + last4;
  };

  return (
    <div className="credit-card-modern">
      <div className="section-title">
        <i className="fas fa-credit-card"></i> Payment Details
      </div>

      {/* 3D Card Preview */}
      <div className="card-3d-container">
        <div className={`card-3d ${isFlipped ? 'flipped' : ''} ${isFocused ? 'focused' : ''}`}>
          {/* Card Front */}
          <div className="card-front" style={{ background: `linear-gradient(135deg, ${cardType.color}, #000)` }}>
            <div className="card-header">
              <div className="card-chip">
                <svg width="40" height="30" viewBox="0 0 40 30">
                  <rect x="2" y="2" width="36" height="26" rx="4" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2"/>
                  <ellipse cx="20" cy="15" rx="8" ry="10" fill="rgba(255,255,255,0.1)"/>
                </svg>
              </div>
              <div className="card-type">
                <i className={cardType.icon} style={{ fontSize: '2rem', color: 'white' }}></i>
              </div>
            </div>
            
            <div className="card-number">
              {cardNumber || '•••• •••• •••• ••••'}
            </div>
            
            <div className="card-footer">
              <div className="card-holder">
                <div className="card-label">Cardholder Name</div>
                <div className="card-value">{cardName || 'YOUR NAME'}</div>
              </div>
              <div className="card-expiry">
                <div className="card-label">Expires</div>
                <div className="card-value">{expiryDate || 'MM/YY'}</div>
              </div>
            </div>
          </div>

          {/* Card Back */}
          <div className="card-back" style={{ background: `linear-gradient(135deg, ${cardType.color}, #000)` }}>
            <div className="card-stripe"></div>
            <div className="card-cvv-area">
              <div className="cvv-label">CVV</div>
              <div className="cvv-value">{cvv || '•••'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Input Fields */}
      <div className="card-inputs">
        <div className="card-input-group">
          <label>Card Number</label>
          <div className="input-wrapper">
            <i className="fas fa-credit-card input-icon"></i>
            {(() => {
              const cardNumberReg = register('cardNumber');
              return (
                <input
                  type="text"
                  {...cardNumberReg}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  className={errors.cardNumber ? 'has-error' : ''}
                  onFocus={() => handleFocus('number')}
                  onBlur={handleBlur}
                  onChange={(e) => {
                    e.target.value = formatCardNumber(e.target.value);
                    if (cardNumberReg.onChange) cardNumberReg.onChange(e);
                  }}
                />
              );
            })()}
          </div>
          {errors.cardNumber && (
            <span className="error-message">{errors.cardNumber.message}</span>
          )}
        </div>

        <div className="card-input-group">
          <label>Cardholder Name</label>
          <div className="input-wrapper">
            <i className="fas fa-user input-icon"></i>
            <input
              type="text"
              {...register('cardName')}
              placeholder="John Doe"
              className={errors.cardName ? 'has-error' : ''}
              onFocus={() => handleFocus('name')}
              onBlur={handleBlur}
            />
          </div>
          {errors.cardName && (
            <span className="error-message">{errors.cardName.message}</span>
          )}
        </div>

        <div className="card-input-row">
          <div className="card-input-group half">
            <label>Expiry Date</label>
            <div className="input-wrapper">
              <i className="fas fa-calendar input-icon"></i>
              {(() => {
                const expiryReg = register('expiryDate');
                return (
                  <input
                    type="text"
                    {...expiryReg}
                    placeholder="MM/YY"
                    maxLength="5"
                    className={errors.expiryDate ? 'has-error' : ''}
                    onFocus={() => handleFocus('expiry')}
                    onBlur={handleBlur}
                    onChange={(e) => {
                      e.target.value = formatExpiryDate(e.target.value);
                      if (expiryReg.onChange) expiryReg.onChange(e);
                    }}
                  />
                );
              })()}
            </div>
            {errors.expiryDate && (
              <span className="error-message">{errors.expiryDate.message}</span>
            )}
          </div>

          <div className="card-input-group half">
            <label>CVV</label>
            <div className="input-wrapper">
              <i className="fas fa-lock input-icon"></i>
              <input
                type="password"
                {...register('cvv')}
                placeholder="•••"
                maxLength="4"
                className={errors.cvv ? 'has-error' : ''}
                onFocus={() => handleFocus('cvv')}
                onBlur={handleBlur}
              />
            </div>
            {errors.cvv && (
              <span className="error-message">{errors.cvv.message}</span>
            )}
          </div>
        </div>
      </div>

      {/* Security Badge */}
      <div className="card-security-badge">
        <div className="security-item">
          <i className="fas fa-lock"></i>
          <span>256-bit encryption</span>
        </div>
        <div className="security-item">
          <i className="fas fa-shield-alt"></i>
          <span>PCI compliant</span>
        </div>
        <div className="security-item">
          <i className="fas fa-check-circle"></i>
          <span>Verified secure</span>
        </div>
      </div>
    </div>
  );
};

export default CreditCardInput;