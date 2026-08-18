// src/components/booking/PaymentMethod.jsx
import React from "react";
import { CreditCard, Smartphone, Phone, ShieldCheck } from "lucide-react";

const PaymentMethod = ({ register, errors, watch, setValue }) => {
  const paymentMethod = watch("paymentMethod");

  return (
    <div className="payment-section">
      <div className="section-title">
        <CreditCard size={18} /> <span>Payment method</span>
      </div>

      <div className="field-group radio-group payment-group">
        <label
          className={`radio-label ${paymentMethod === "card" ? "active" : ""}`}
        >
          <input type="radio" value="card" {...register("paymentMethod")} />
          <CreditCard size={16} /> Credit / Debit Card
        </label>
        <label
          className={`radio-label ${paymentMethod === "mobile_money" ? "active" : ""}`}
        >
          <input
            type="radio"
            value="mobile_money"
            {...register("paymentMethod")}
          />
          <Smartphone size={16} /> Mobile Money
        </label>
      </div>

      {errors.paymentMethod && (
        <span className="error-message">{errors.paymentMethod.message}</span>
      )}

      {/* Card Info - Just a note */}
      {paymentMethod === "card" && (
        <div className="payment-info-box">
          <div className="payment-info-content">
            <p>
              Your dummy visa reservation ticket will be generated instantly upon clicking Pay.
            </p>
            <div className="payment-icons" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 6px', background: '#0b2b40', color: 'white', borderRadius: '4px' }}>VISA</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 6px', background: '#eb001b', color: 'white', borderRadius: '4px' }}>MC</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 6px', background: '#006fcf', color: 'white', borderRadius: '4px' }}>AMEX</span>
              <ShieldCheck size={16} color="#16a34a" />
            </div>
          </div>
        </div>
      )}

      {/* Mobile Money - Needs provider and phone */}
      {paymentMethod === "mobile_money" && (
        <div className="payment-info-box">
          <div className="payment-info-content">
            <p>Pay with MTN MoMo, Vodafone Cash, or AirtelTigo Money.</p>

            <div className="mobile-money-providers">
              <label className="provider-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={14} /> <span>Mobile Money Provider</span>
              </label>
              <div className="provider-options">
                <label className="provider-option">
                  <input
                    type="radio"
                    value="mtn"
                    {...register("mobileMoneyProvider")}
                  />
                  <span className="provider-name">MTN MoMo</span>
                </label>
                <label className="provider-option">
                  <input
                    type="radio"
                    value="vodafone"
                    {...register("mobileMoneyProvider")}
                  />
                  <span className="provider-name">Vodafone Cash</span>
                </label>
                <label className="provider-option">
                  <input
                    type="radio"
                    value="airteltigo"
                    {...register("mobileMoneyProvider")}
                  />
                  <span className="provider-name">AirtelTigo Money</span>
                </label>
              </div>
            </div>

            <div className="mobile-money-phone">
              <label>Phone Number</label>
              <input
                type="tel"
                placeholder="024XXXXXXX"
                {...register("mobileMoneyPhone")}
                className={errors.mobileMoneyPhone ? "has-error" : ""}
              />
              {errors.mobileMoneyPhone && (
                <span className="error-message">
                  {errors.mobileMoneyPhone.message}
                </span>
              )}
              <small className="field-hint">
                Enter the phone number registered with your mobile money account
              </small>
            </div>
          </div>
        </div>
      )}

      {/* Bank Transfer - Just a note */}
      {paymentMethod === "bank_transfer" && (
        <div className="payment-info-box">
          <div className="payment-info-content">
            <p>
              Your dummy visa reservation ticket will be generated instantly upon clicking Pay.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethod;

