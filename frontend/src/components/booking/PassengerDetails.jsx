// src/components/booking/PassengerDetails.jsx
import React from 'react';
import { 
  User, 
  Contact, 
  Mail, 
  AlertCircle,
  Users
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
        <div key={i} className="passenger-card-item">
          <div className="passenger-card-header">
            <h4 className="passenger-card-title">
              <User size={16} color="#2563eb" />
              <span>Passenger {passengerNumber} {passengerNumber === 1 ? '(Lead Passenger)' : ''}</span>
            </h4>
            <div className="passenger-type-selector">
              <label className="type-radio-label">
                <input
                  type="radio"
                  {...register(`passengerList.${i}.type`)}
                  value="adult"
                  defaultChecked={!passengerList[i]?.type || passengerList[i]?.type === 'adult'}
                />
                <span>Adult (12+ yrs)</span>
              </label>
              <label className="type-radio-label">
                <input
                  type="radio"
                  {...register(`passengerList.${i}.type`)}
                  value="child"
                />
                <span>Child (2-11 yrs)</span>
              </label>
            </div>
          </div>
          
          <div className="passenger-inputs-row">
            <div className="field-group">
              <label className="input-field-label">
                <User size={13} /> <span>First Name *</span>
              </label>
              <input
                id={`passenger-${i}-firstName`}
                type="text"
                {...register(`passengerList.${i}.firstName`)}
                placeholder="e.g. John"
                className={`text-input-field ${errors?.passengerList?.[i]?.firstName ? 'has-error' : ''}`}
                autoComplete="given-name"
              />
              {errors?.passengerList?.[i]?.firstName && (
                <span className="error-message"><AlertCircle size={13} /> {errors.passengerList[i].firstName.message}</span>
              )}
            </div>
            
            <div className="field-group">
              <label className="input-field-label">
                <User size={13} /> <span>Last Name *</span>
              </label>
              <input
                id={`passenger-${i}-lastName`}
                type="text"
                {...register(`passengerList.${i}.lastName`)}
                placeholder="e.g. Doe"
                className={`text-input-field ${errors?.passengerList?.[i]?.lastName ? 'has-error' : ''}`}
                autoComplete="family-name"
              />
              {errors?.passengerList?.[i]?.lastName && (
                <span className="error-message"><AlertCircle size={13} /> {errors.passengerList[i].lastName.message}</span>
              )}
            </div>
          </div>

          {/* Passport Number */}
          <div className="field-group passport-field-group">
            <label className="input-field-label">
              <Contact size={13} /> <span>Passport Number *</span>
            </label>
            <input
              id={`passenger-${i}-passport`}
              type="text"
              {...register(`passengerList.${i}.passport`)}
              placeholder="e.g. A12345678"
              className={`text-input-field ${errors?.passengerList?.[i]?.passport ? 'has-error' : ''}`}
              style={{ textTransform: 'uppercase' }}
              maxLength={20}
              autoComplete="off"
            />
            <small className="field-help-text">Letters and numbers only (minimum 6 characters)</small>
            {errors?.passengerList?.[i]?.passport && (
              <span className="error-message"><AlertCircle size={13} /> {errors.passengerList[i].passport.message}</span>
            )}
          </div>
        </div>
      );
    }
    return fields;
  };

  return (
    <div className="passenger-details-wrapper">
      <div className="section-title">
        <Users size={18} /> <span>Passenger Information</span>
      </div>

      {/* Main Passenger List */}
      <div className="passenger-list-container">
        {renderPassengerFields()}
      </div>

      {/* Email / Delivery Address */}
      <div className="contact-details-box">
        <div className="section-title">
          <Mail size={18} /> <span>Ticket Delivery Email</span>
        </div>

        <div className="field-group">
          <label className="input-field-label">
            <Mail size={13} /> <span>Email Address * (Your confirmed ticket PDF will be sent here)</span>
          </label>
          <input
            type="email"
            {...register('email')}
            placeholder="e.g. yourname@gmail.com"
            className={`text-input-field ${errors.email ? 'has-error' : ''}`}
            autoComplete="email"
          />
          {errors.email && (
            <span className="error-message"><AlertCircle size={13} /> {errors.email.message}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PassengerDetails;
