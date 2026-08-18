// src/components/booking/PassengerDetails.jsx
import React from 'react';
import { 
  User, 
  Contact, 
  Info, 
  Mail, 
  Calendar, 
  AlertCircle 
} from 'lucide-react';

const PassengerDetails = ({ register, errors, watch, setValue, passengers = 1 }) => {
  // Get passenger list from form
  const passengerList = watch('passengerList') || [];

  // Generate passenger fields based on count
  const renderPassengerFields = () => {
    const fields = [];
    for (let i = 0; i < passengers; i++) {
      const passengerNumber = i + 1;
      fields.push(
        <div key={i} className="passenger-group" style={{
          border: '1px solid #e2eaf0',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '12px',
          background: i % 2 === 0 ? '#f9fcff' : 'white'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '10px'
          }}>
            <h4 style={{ 
              margin: 0, 
              color: '#0b2b40',
              fontSize: '0.95rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <User size={16} color="#2a7de1" />
              <span>Passenger {passengerNumber}</span>
            </h4>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {/* Age Category Selection */}
              <label style={{ 
                fontSize: '0.8rem', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px',
                cursor: 'pointer'
              }}>
                <input
                  type="radio"
                  {...register(`passengerList.${i}.type`)}
                  value="adult"
                  defaultChecked={!passengerList[i]?.type || passengerList[i]?.type === 'adult'}
                />
                Adult
              </label>
              <label style={{ 
                fontSize: '0.8rem', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px',
                cursor: 'pointer'
              }}>
                <input
                  type="radio"
                  {...register(`passengerList.${i}.type`)}
                  value="child"
                />
                Child
              </label>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="field-group">
              <label style={{ fontSize: '0.85rem', fontWeight: 500, color: '#1f3a4b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <User size={13} /> <span>First Name *</span>
              </label>
              <input
                id={`passenger-${i}-firstName`}
                type="text"
                {...register(`passengerList.${i}.firstName`)}
                placeholder="First name"
                className={errors?.passengerList?.[i]?.firstName ? 'has-error' : ''}
                style={{
                  width: '100%',
                  padding: '0.7rem 1rem',
                  border: errors?.passengerList?.[i]?.firstName ? '2px solid #e74c3c' : '2px solid rgba(0,0,0,0.08)',
                  borderRadius: '14px',
                  fontSize: '0.95rem',
                  background: errors?.passengerList?.[i]?.firstName ? '#fff5f5' : 'rgba(249,252,255,0.8)',
                  transition: '0.2s'
                }}
              />
              {errors?.passengerList?.[i]?.firstName && (
                <span className="error-message"><AlertCircle size={13} /> {errors.passengerList[i].firstName.message}</span>
              )}
            </div>
            
            <div className="field-group">
              <label style={{ fontSize: '0.85rem', fontWeight: 500, color: '#1f3a4b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <User size={13} /> <span>Last Name *</span>
              </label>
              <input
                id={`passenger-${i}-lastName`}
                type="text"
                {...register(`passengerList.${i}.lastName`)}
                placeholder="Last name"
                className={errors?.passengerList?.[i]?.lastName ? 'has-error' : ''}
                style={{
                  width: '100%',
                  padding: '0.7rem 1rem',
                  border: errors?.passengerList?.[i]?.lastName ? '2px solid #e74c3c' : '2px solid rgba(0,0,0,0.08)',
                  borderRadius: '14px',
                  fontSize: '0.95rem',
                  background: errors?.passengerList?.[i]?.lastName ? '#fff5f5' : 'rgba(249,252,255,0.8)',
                  transition: '0.2s'
                }}
              />
              {errors?.passengerList?.[i]?.lastName && (
                <span className="error-message"><AlertCircle size={13} /> {errors.passengerList[i].lastName.message}</span>
              )}
            </div>
          </div>

          {/* Passport Number */}
          <div className="field-group" style={{ marginTop: '10px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 500, color: '#1f3a4b', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Contact size={13} /> <span>Passport Number *</span>
            </label>
            <input
              id={`passenger-${i}-passport`}
              type="text"
              {...register(`passengerList.${i}.passport`)}
              placeholder="AB1234567"
              className={errors?.passengerList?.[i]?.passport ? 'has-error' : ''}
              style={{
                width: '100%',
                padding: '0.7rem 1rem',
                border: errors?.passengerList?.[i]?.passport ? '2px solid #e74c3c' : '2px solid rgba(0,0,0,0.08)',
                borderRadius: '14px',
                fontSize: '0.95rem',
                background: errors?.passengerList?.[i]?.passport ? '#fff5f5' : 'rgba(249,252,255,0.8)',
                transition: '0.2s'
              }}
            />
            {errors?.passengerList?.[i]?.passport && (
              <span className="error-message"><AlertCircle size={13} /> {errors.passengerList[i].passport.message}</span>
            )}
          </div>

          {/* Date of Birth (Optional for children) */}
          <div className="field-group" style={{ marginTop: '10px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 500, color: '#1f3a4b', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={13} /> <span>Date of Birth (Optional)</span>
            </label>
            <input
              type="date"
              {...register(`passengerList.${i}.dob`)}
              style={{
                width: '100%',
                padding: '0.7rem 1rem',
                border: '2px solid rgba(0,0,0,0.08)',
                borderRadius: '14px',
                fontSize: '0.95rem',
                background: 'rgba(249,252,255,0.8)',
                transition: '0.2s'
              }}
            />
          </div>
        </div>
      );
    }
    return fields;
  };

  return (
    <div className="col-right">
      <div className="section-title">
        <Contact size={18} /> <span>Passenger Details</span>
      </div>

      <div style={{
        background: '#f0f7ff',
        padding: '10px 15px',
        borderRadius: '8px',
        marginBottom: '15px',
        fontSize: '0.85rem',
        color: '#1f4a5e',
        borderLeft: '3px solid #2a7de1',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <Info size={16} color="#2a7de1" />
        <span>Select "Child" for passengers under 12 years old.</span>
      </div>

      {/* Dynamic passenger fields */}
      {renderPassengerFields()}

      {/* Email - Shared for all passengers */}
      <div className="field-group">
        <label style={{ fontSize: '0.9rem', fontWeight: 500, color: '#1f3a4b', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Mail size={14} /> <span>Email address *</span>
        </label>
        <input
          id="passenger-email"
          type="email"
          {...register('email')}
          placeholder="john.doe@example.com"
          className={errors.email ? 'has-error' : ''}
          style={{
            width: '100%',
            padding: '0.7rem 1rem',
            border: errors.email ? '2px solid #e74c3c' : '2px solid rgba(0,0,0,0.08)',
            borderRadius: '14px',
            fontSize: '0.95rem',
            background: errors.email ? '#fff5f5' : 'rgba(249,252,255,0.8)',
            transition: '0.2s'
          }}
        />
        {errors.email && (
          <span className="error-message"><AlertCircle size={13} /> {errors.email.message}</span>
        )}
      </div>
    </div>
  );
};

export default PassengerDetails;
