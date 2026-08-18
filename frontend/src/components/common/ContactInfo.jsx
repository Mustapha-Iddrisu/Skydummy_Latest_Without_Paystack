// src/components/common/ContactInfo.jsx
import React from 'react';
import { Mail, Globe } from 'lucide-react';

const ContactInfo = () => {
  return (
    <div className="contact-info">
      <h3>Contact Us</h3>
      <div className="contact-details">
        <div className="contact-item" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Mail size={18} color="#2a7de1" />
          <a href="mailto:support@skydummy.com">support@skydummy.com</a>
        </div>
        <div className="contact-item" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Globe size={18} color="#2a7de1" />
          <a href="https://www.skydummy.com">www.skydummy.com</a>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
