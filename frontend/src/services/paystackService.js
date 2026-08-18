// src/services/paystackService.js
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

export const verifyPaystackPayment = async (reference) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/payment/verify-paystack`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reference }),
    });
    
    return await response.json();
  } catch (error) {
    console.error('Payment verification error:', error);
    throw error;
  }
};