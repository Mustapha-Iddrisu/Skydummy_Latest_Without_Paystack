// src/utils/validation.js
import * as yup from 'yup';

// Validation schema for individual passenger
export const passengerSchema = yup.object().shape({
  firstName: yup.string().trim().min(1, 'First name is required').required('First name is required'),
  lastName: yup.string().trim().min(1, 'Last name is required').required('Last name is required'),
  passport: yup.string().trim()
    .min(6, 'Passport number must be at least 6 characters')
    .max(20, 'Passport number must be at most 20 characters')
    .matches(/^[A-Z0-9]+$/i, 'Passport number should be letters and numbers only')
    .required('Passport number is required')
});

// Validation schema for Step 1: Trip Details
export const tripDetailsSchema = yup.object().shape({
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
  })
});

// Validation schema for Step 2: Passenger Details & Checkout
export const passengerPageSchema = yup.object().shape({
  passengerList: yup.array().of(passengerSchema).min(1, 'At least one passenger is required'),
  email: yup.string().email('Please enter a valid email format').required('Contact email is required'),
  paymentMethod: yup.string().oneOf(['selar', 'card', 'mobile_money', 'bank_transfer']).default('selar'),
  couponCode: yup.string().optional()
});

// Combined schema for legacy/direct validations
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
  passengerList: yup.array().of(passengerSchema).min(1, 'At least one passenger is required'),
  firstName: yup.string().optional(),
  lastName: yup.string().optional(),
  passport: yup.string().optional(),
  email: yup.string().email('Invalid email format').required('Email is required'),
  paymentMethod: yup.string().oneOf(['selar', 'card', 'mobile_money', 'bank_transfer']).required(),
  couponCode: yup.string().optional()
});
