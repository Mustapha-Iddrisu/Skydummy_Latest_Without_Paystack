// src/pages/PrivacyPolicy.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="legal-page" style={{ 
      padding: '60px 20px',
      maxWidth: '900px',
      margin: '0 auto',
      minHeight: '70vh',
      background: '#ffffff',
      position: 'relative',
      zIndex: 10  // ← Add this
    }}>
      <div className="legal-container" style={{
        background: 'white',
        padding: '50px',
        borderRadius: '20px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        position: 'relative',
        zIndex: 10  // ← Add this
      }}>
        <h1 style={{ fontSize: '2.2rem', color: '#0b2b40', marginBottom: '8px' }}>Privacy Policy</h1>
        <p style={{ color: '#8aa3b5', fontSize: '0.9rem', marginBottom: '30px' }}>Last Updated: August 2026</p>
        
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.2rem', color: '#0b2b40', marginBottom: '10px', fontWeight: 600 }}>1. Introduction</h2>
          <p style={{ color: '#1f3a4b', lineHeight: '1.7', fontSize: '0.95rem' }}>
            SkyDummy ("we", "our", "us") respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our website and services.
          </p>
        </div>
        
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.2rem', color: '#0b2b40', marginBottom: '10px', fontWeight: 600 }}>2. Information We Collect</h2>
          <p style={{ color: '#1f3a4b', lineHeight: '1.7', fontSize: '0.95rem' }}>We collect the following types of information:</p>
          <ul style={{ paddingLeft: '24px', margin: '10px 0' }}>
            <li style={{ color: '#1f3a4b', lineHeight: '1.7', fontSize: '0.95rem', marginBottom: '6px' }}>
              <strong>Personal Identification Information:</strong> Name, email address, phone number, passport number, and travel details.
            </li>
            <li style={{ color: '#1f3a4b', lineHeight: '1.7', fontSize: '0.95rem', marginBottom: '6px' }}>
              <strong>Payment Information:</strong> Payment method details (processed securely through our payment partners).
            </li>
            <li style={{ color: '#1f3a4b', lineHeight: '1.7', fontSize: '0.95rem', marginBottom: '6px' }}>
              <strong>Usage Data:</strong> Information about how you interact with our website.
            </li>
            <li style={{ color: '#1f3a4b', lineHeight: '1.7', fontSize: '0.95rem', marginBottom: '6px' }}>
              <strong>Device Information:</strong> IP address, browser type, and device information.
            </li>
          </ul>
        </div>
        
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.2rem', color: '#0b2b40', marginBottom: '10px', fontWeight: 600 }}>3. Contact Us</h2>
          <p style={{ color: '#1f3a4b', lineHeight: '1.7', fontSize: '0.95rem' }}>
            If you have questions about this privacy policy, please contact us at:
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

export default PrivacyPolicy;