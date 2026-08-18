// src/utils/validation.js
import * as yup from 'yup';

// Create a dynamic validation schema for passengers
const passengerSchema = yup.object().shape({
  firstName: yup.string().min(1, 'First name is required').required('First name is required'),
  lastName: yup.string().min(1, 'Last name is required').required('Last name is required'),
  passport: yup.string()
    .min(6, 'Passport number must be at least 6 characters')
    .max(20, 'Passport number must be at most 20 characters')
    .matches(/^[A-Z0-9]+$/, 'Passport number should be letters and numbers only')
    .required('Passport number is required')
});

export const bookingSchema = yup.object().shape({
  tripType: yup.string().oneOf(['oneway', 'round']).required(),
  passengers: yup.number().min(1).max(9).required(),
  departure: yup.string().min(2, 'Select departure airport').required('Departure airport is required'),
  destination: yup.string().min(2, 'Select destination airport').required('Destination airport is required')
    .notOneOf([yup.ref('departure')], 'Destination must be different from departure'),
  departDate: yup.string().required('Departure date is required'),
  returnDate: yup.string().when('tripType', {
    is: 'round',
    then: (schema) => schema.required('Return date is required for round trips'),
    otherwise: (schema) => schema.optional().nullable()
  }),
  // Passenger list validation
  passengerList: yup.array().of(passengerSchema).min(1, 'At least one passenger is required'),
  // Root level passenger fields (optional since passengerList contains them)
  firstName: yup.string().optional(),
  lastName: yup.string().optional(),
  passport: yup.string().optional(),
  email: yup.string().email('Invalid email format').required('Email is required'),
  paymentMethod: yup.string().oneOf(['card', 'mobile_money']).required(),
  couponCode: yup.string().optional()
});