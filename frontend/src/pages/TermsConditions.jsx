// src/pages/TermsConditions.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const TermsConditions = () => {
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
        <h1 style={{ fontSize: '2.2rem', color: '#0b2b40', marginBottom: '8px' }}>Terms and Conditions</h1>
        <p style={{ color: '#8aa3b5', fontSize: '0.9rem', marginBottom: '30px' }}>Last Updated: August 2026</p>
        
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.2rem', color: '#0b2b40', marginBottom: '10px', fontWeight: 600 }}>1. Acceptance of Terms</h2>
          <p style={{ color: '#1f3a4b', lineHeight: '1.7', fontSize: '0.95rem' }}>
            By using SkyDummy, you agree to these Terms and Conditions. If you do not agree, please do not use our services.
          </p>
        </div>
        
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.2rem', color: '#0b2b40', marginBottom: '10px', fontWeight: 600 }}>2. Description of Service</h2>
          <p style={{ color: '#1f3a4b', lineHeight: '1.7', fontSize: '0.95rem' }}>
            SkyDummy provides dummy flight itineraries for visa application purposes only. These are NOT actual flight bookings and cannot be used for travel.
          </p>
        </div>
        
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.2rem', color: '#0b2b40', marginBottom: '10px', fontWeight: 600 }}>3. Contact Us</h2>
          <p style={{ color: '#1f3a4b', lineHeight: '1.7', fontSize: '0.95rem' }}>
            For questions about these terms, contact us at:
          </p>
          <p style={{ color: '#1f3a4b', lineHeight: '1.7', fontSize: '0.95rem' }}>
            <strong>Email:</strong> <a href="mailto:support@skydummy.com" style={{ color: '#2a7de1', textDecoration: 'none' }}>support@skydummy.com</a>
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

export default TermsConditions;