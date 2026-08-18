// src/utils/coupons.js

export const COUPONS = {
  // 20% discount coupon
  'SKY20': {
    code: 'SKY20',
    discount: 0.20,
    type: 'percentage',
    description: '20% off your ticket',
    expires: null,
    maxUses: 100,
    usedCount: 0
  },
  
  // $5 off coupon
  'SKY5': {
    code: 'SKY5',
    discount: 5.00,
    type: 'fixed',
    description: '$5 off your ticket',
    expires: null,
    maxUses: 50,
    usedCount: 0
  },
  
  // Admin coupon (100% discount)
  'SKYADMIN2024': {
    code: 'SKYADMIN2024',
    discount: 1.00,
    type: 'percentage',
    description: 'Admin free ticket',
    expires: null,
    maxUses: 999,
    usedCount: 0
  },
  
  // NEW: 10% off coupon (fixed, sent to all customers)
  'SKY10': {
    code: 'SKY10',
    discount: 0.10,  // 10% off
    type: 'percentage',
    description: '10% off your next ticket - Thank you!',
    expires: null,   // Never expires
    // maxUses: 1,      // One-time use per customer
    usedCount: 0
  },
  
  // 10% off welcome coupon (alias for SKY10)
  'WELCOME10': {
    code: 'WELCOME10',
    discount: 0.10,
    type: 'percentage',
    description: '10% off for new users',
    expires: null,
    maxUses: 1,
    usedCount: 0
  }
};

// Validate coupon - works with USD prices
export const validateCoupon = (code, ticketPriceUSD) => {
  const coupon = COUPONS[code.toUpperCase()];
  
  if (!coupon) {
    return { 
      valid: false, 
      message: 'Invalid coupon code. Please check and try again.' 
    };
  }
  
  if (coupon.expires) {
    const expiryDate = new Date(coupon.expires);
    const today = new Date();
    if (expiryDate < today) {
      return { 
        valid: false, 
        message: 'This coupon has expired.' 
      };
    }
  }
  
  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
    return { 
      valid: false, 
      message: 'This coupon has reached its maximum usage limit.' 
    };
  }
  
  let discountAmount = 0;
  if (coupon.type === 'percentage') {
    discountAmount = ticketPriceUSD * coupon.discount;
  } else if (coupon.type === 'fixed') {
    discountAmount = Math.min(coupon.discount, ticketPriceUSD);
  }
  
  discountAmount = Math.round(discountAmount * 100) / 100;
  
  return {
    valid: true,
    coupon: coupon,
    discountAmount: discountAmount,
    finalPrice: ticketPriceUSD - discountAmount,
    message: `Coupon applied! You saved $${discountAmount.toFixed(2)}`
  };
};

export const applyCoupon = (code) => {
  const coupon = COUPONS[code.toUpperCase()];
  if (coupon) {
    coupon.usedCount += 1;
    return true;
  }
  return false;
};

export const getCouponDetails = (code) => {
  const coupon = COUPONS[code.toUpperCase()];
  return coupon || null;
};

export const isValidCoupon = (code) => {
  const coupon = COUPONS[code.toUpperCase()];
  if (!coupon) return false;
  
  if (coupon.expires) {
    const expiryDate = new Date(coupon.expires);
    const today = new Date();
    if (expiryDate < today) return false;
  }
  
  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
    return false;
  }
  
  return true;
};

export const getAllCoupons = () => {
  return Object.keys(COUPONS).map(code => ({
    code,
    ...COUPONS[code]
  }));
};

export const getActiveCoupons = () => {
  return getAllCoupons().filter(coupon => {
    if (coupon.expires) {
      const expiryDate = new Date(coupon.expires);
      const today = new Date();
      if (expiryDate < today) return false;
    }
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return false;
    }
    return true;
  });
};

export const formatDiscount = (coupon) => {
  if (coupon.type === 'percentage') {
    return `${(coupon.discount * 100).toFixed(0)}%`;
  } else if (coupon.type === 'fixed') {
    return `$${coupon.discount.toFixed(2)}`;
  }
  return '';
};

export const getCouponUsage = (code) => {
  const coupon = COUPONS[code.toUpperCase()];
  if (!coupon) return null;
  
  return {
    usedCount: coupon.usedCount || 0,
    maxUses: coupon.maxUses || 'Unlimited',
    remaining: coupon.maxUses ? coupon.maxUses - (coupon.usedCount || 0) : 'Unlimited'
  };
};

export default {
  COUPONS,
  validateCoupon,
  applyCoupon,
  getCouponDetails,
  isValidCoupon,
  getAllCoupons,
  getActiveCoupons,
  formatDiscount,
  getCouponUsage
};