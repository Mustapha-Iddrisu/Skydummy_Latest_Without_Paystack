// src/pages/RefundPolicy.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const RefundPolicy = () => {
  return (
    <div className="legal-page" style={{ 
      padding: '60px 20px',
      maxWidth: '900px',
      margin: '0 auto',
      minHeight: '70vh',
      background: '#ffffff',
      position: 'relative',
      zIndex: 10
    }}>
      <div className="legal-container" style={{
        background: 'white',
        padding: '50px',
        borderRadius: '20px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        position: 'relative',
        zIndex: 10
      }}>
        <h1 style={{ fontSize: '2.2rem', color: '#0b2b40', marginBottom: '8px' }}>Refund Policy</h1>
        <p style={{ color: '#8aa3b5', fontSize: '0.9rem', marginBottom: '30px' }}>Last Updated: August 2026</p>
        
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.2rem', color: '#0b2b40', marginBottom: '10px', fontWeight: 600 }}>1. General Policy</h2>
          <p style={{ color: '#1f3a4b', lineHeight: '1.7', fontSize: '0.95rem' }}>
            At SkyDummy, we strive to provide high-quality dummy tickets for visa applications. We understand that circumstances may change, and we have established the following refund policy.
          </p>
        </div>
        
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.2rem', color: '#0b2b40', marginBottom: '10px', fontWeight: 600 }}>2. No Refunds</h2>
          <p style={{ color: '#1f3a4b', lineHeight: '1.7', fontSize: '0.95rem' }}>
            <strong>Due to the nature of our service, we generally do not offer refunds.</strong> Once a dummy ticket is generated, it cannot be "canceled" as there is no actual flight booking to cancel.
          </p>
        </div>
        
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.2rem', color: '#0b2b40', marginBottom: '10px', fontWeight: 600 }}>3. Contact Us</h2>
          <p style={{ color: '#1f3a4b', lineHeight: '1.7', fontSize: '0.95rem' }}>
            If you have questions about our refund policy, please contact us:
          </p>
          <p style={{ color: '#1f3a4b', lineHeight: '1.7', fontSize: '0.95rem' }}>
            <strong>Email:</strong> <a href="mailto:support@skydummy.com" style={{ color: '#2a7de1', textDecoration: 'none' }}>support@skydummy.com</a>
          </p>
          <p style={{ color: '#1f3a4b', lineHeight: '1.7', fontSize: '0.95rem' }}>
            <strong>Response Time:</strong> 24-48 hours
          </p>
        </div>
        
        <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #eef4f8' }}>
          <Link to="/" style={{ color: '#2a7de1', textDecoration: 'none' }}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;