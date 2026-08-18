// src/components/booking/PaymentMethod.jsx
import React from "react";
import { CreditCard, Smartphone, ShieldCheck, Lock } from "lucide-react";

const PaymentMethod = ({ register, errors, watch, setValue }) => {
  const paymentMethod = watch("paymentMethod") || "selar";

  return (
    <div className="payment-section">
      <div className="section-title">
        <CreditCard size={18} /> <span>Secure Payment Method</span>
      </div>

      <div className="field-group radio-group payment-group">
        <label
          className={`radio-label ${paymentMethod === "selar" || paymentMethod === "card" ? "active" : ""}`}
        >
          <input type="radio" value="selar" {...register("paymentMethod")} defaultChecked />
          <CreditCard size={16} /> Selar Pay (Cards, MoMo & Bank)
        </label>
      </div>

      {errors.paymentMethod && (
        <span className="error-message">{errors.paymentMethod.message}</span>
      )}

      <div className="payment-info-box">
        <div className="payment-info-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <Lock size={14} color="#16a34a" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>
              Instant & Automated GDS Ticket Activation
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
            Payments are securely processed via <strong>Selar</strong>. Supports Visa, Mastercard, Verve, Mobile Money (MTN, Telecel, AirtelTigo), Bank Transfer, Apple Pay, and PayPal.
          </p>
          <div className="payment-icons" style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '10px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 6px', background: '#0b2b40', color: 'white', borderRadius: '4px' }}>VISA</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 6px', background: '#eb001b', color: 'white', borderRadius: '4px' }}>MASTERCARD</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 6px', background: '#eab308', color: 'black', borderRadius: '4px' }}>MOMO</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 6px', background: '#2563eb', color: 'white', borderRadius: '4px' }}>BANK</span>
            <ShieldCheck size={16} color="#16a34a" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;

