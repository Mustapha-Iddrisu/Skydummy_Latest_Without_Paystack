// src/pages/HomePage.jsx
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import BookingForm from '../components/booking/BookingForm';
import Footer from '../components/common/Footer';
import ContactForm from '../components/common/ContactForm';
import Testimonials from '../components/common/Testimonials';
import { 
  FaGlobe, 
  FaCheckCircle, 
  FaBolt, 
  FaShieldAlt, 
  FaDollarSign,
  FaComments,
  FaEnvelope,
  FaClock,
  FaPlane
} from 'react-icons/fa';
import { 
  MdVerified,
  MdDownload
} from 'react-icons/md';
import { ShieldCheck, Sparkles } from 'lucide-react';

const HomePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // If user lands on homepage from Selar callback with query params
    const email = searchParams.get('email');
    const fullname = searchParams.get('fullname') || searchParams.get('name');
    const pnr = searchParams.get('pnr') || searchParams.get('reference') || searchParams.get('custom_pnr') || searchParams.get('trxref');
    const status = searchParams.get('status');

    if (email || fullname || pnr || status) {
      console.log('⚡ Detected payment callback query parameters on Home page, routing to /payment/callback');
      navigate(`/payment/callback${window.location.search}`, { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <>
      <Navbar />
      
      {/* Spacer between Navbar and Hero */}
      <div style={{ height: '20px' }} />
      
      {/* Hero Section with Rounded Edges on All Sides */}
      <section id="home" className="pnr-hero-banner" style={{ 
        position: 'relative', 
        zIndex: 10,
        margin: '0 0.25rem',
        background: 'linear-gradient(135deg, #1a56db 0%, #3b82f6 35%, #93c5fd 65%, #bfdbfe 85%, #ffffff 100%)',
        minHeight: 'auto',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 10px 40px rgba(26, 86, 219, 0.15)',
      }}>
        
        {/* Decorative Top Waves/Squiggles */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '20px',
          overflow: 'hidden',
          zIndex: 5,
        }}>
          <svg viewBox="0 0 1200 20" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
            <path d="M0,10 Q150,0 300,10 T600,10 T900,10 T1200,10 L1200,20 L0,20 Z" fill="rgba(255,255,255,0.15)" />
            <path d="M0,15 Q150,5 300,15 T600,15 T900,15 T1200,15 L1200,20 L0,20 Z" fill="rgba(255,255,255,0.08)" />
          </svg>
        </div>

        {/* Decorative Floating Elements */}
        <div style={{
          position: 'absolute',
          top: '15%',
          left: '5%',
          opacity: 0.08,
          fontSize: '4rem',
          color: '#ffffff',
          transform: 'rotate(-15deg)',
          zIndex: 1,
        }}>
          <FaPlane />
        </div>
        <div style={{
          position: 'absolute',
          bottom: '20%',
          right: '8%',
          opacity: 0.06,
          fontSize: '5rem',
          color: '#ffffff',
          transform: 'rotate(25deg)',
          zIndex: 1,
        }}>
          <FaPlane />
        </div>

        {/* Decorative Dots Pattern */}
        <div style={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          opacity: 0.05,
          zIndex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 12px)',
          gap: '12px',
        }}>
          {[...Array(16)].map((_, i) => (
            <div key={i} style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#ffffff',
            }} />
          ))}
        </div>

        <div style={{
          position: 'absolute',
          bottom: '15%',
          left: '8%',
          opacity: 0.05,
          zIndex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 10px)',
          gap: '10px',
        }}>
          {[...Array(9)].map((_, i) => (
            <div key={i} style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#ffffff',
            }} />
          ))}
        </div>

        {/* Decorative Sparkle */}
        <div style={{
          position: 'absolute',
          top: '20%',
          right: '20%',
          opacity: 0.1,
          zIndex: 1,
          color: '#ffffff',
        }}>
          <Sparkles size={48} />
        </div>
        <div style={{
          position: 'absolute',
          bottom: '30%',
          left: '15%',
          opacity: 0.08,
          zIndex: 1,
          color: '#ffffff',
        }}>
          <Sparkles size={32} />
        </div>

        {/* Decorative Curved Border at Bottom */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '40px',
          overflow: 'hidden',
          zIndex: 2,
        }}>
          <svg viewBox="0 0 1200 40" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
            <path d="M0,20 Q150,0 300,20 T600,20 T900,20 T1200,20 L1200,40 L0,40 Z" fill="#ffffff" />
            <path d="M0,25 Q150,5 300,25 T600,25 T900,25 T1200,25 L1200,40 L0,40 Z" fill="rgba(255,255,255,0.5)" />
          </svg>
        </div>

        <div className="pnr-container" style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '1.75rem 0.5rem 2.5rem',
          position: 'relative',
          zIndex: 10,
        }}>
          <div className="pnr-hero-header" style={{
            textAlign: 'center',
            position: 'relative',
            zIndex: 10,
          }}>
            <span className="pnr-badge" style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              color: '#ffffff',
              padding: '0.35rem 0.85rem',
              borderRadius: '20px',
              fontSize: '0.82rem',
              fontWeight: 600,
              marginBottom: '0.75rem',
              border: '1px solid rgba(255, 255, 255, 0.3)',
            }}>
              <ShieldCheck size={15} /> Official GDS Validation Portal
            </span>
            <h1 style={{ 
              fontSize: '2.4rem', 
              fontWeight: 700, 
              color: '#ffffff',
              letterSpacing: '-0.01em',
              marginBottom: '0.4rem',
              position: 'relative',
              zIndex: 10,
              textShadow: '0 2px 10px rgba(0,0,0,0.1)',
            }}>
              <FaGlobe style={{ color: '#ffffff', marginRight: '0.5rem' }} /> 
              Visa-ready dummy tickets
            </h1>
            <p style={{ 
              fontSize: '1.05rem', 
              color: '#f0f9ff',
              marginBottom: '1.25rem',
              lineHeight: '1.5',
              position: 'relative',
              zIndex: 10,
              maxWidth: '700px',
              marginLeft: 'auto',
              marginRight: 'auto',
              textShadow: '0 1px 8px rgba(0,0,0,0.08)',
            }}>
              Generate a verified flight itinerary for your visa application in seconds.<br />
              Trusted by travelers worldwide. Instant download.
            </p>
            
            <div className="hero-features" style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '0.6rem', 
              flexWrap: 'wrap',
              position: 'relative',
              zIndex: 10,
              marginBottom: '1.5rem',
            }}>
              {/* ✅ 100% Visa Approved - Green */}
              <span style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.4rem',
                background: 'rgba(34, 197, 94, 0.2)',
                backdropFilter: 'blur(10px)',
                padding: '0.35rem 0.75rem',
                borderRadius: '30px',
                fontSize: '0.82rem',
                color: '#d1fae5',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                position: 'relative',
                zIndex: 10,
                fontWeight: 500,
              }}>
                <FaCheckCircle style={{ color: '#34d399' }} /> 100% Visa Approved
              </span>
              
              {/* 📥 Instant Download - Blue */}
              <span style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.4rem',
                background: 'rgba(96, 165, 250, 0.2)',
                backdropFilter: 'blur(10px)',
                padding: '0.35rem 0.75rem',
                borderRadius: '30px',
                fontSize: '0.82rem',
                color: '#bfdbfe',
                border: '1px solid rgba(96, 165, 250, 0.3)',
                position: 'relative',
                zIndex: 10,
                fontWeight: 500,
              }}>
                <MdDownload style={{ color: '#60a5fa' }} /> Instant Download
              </span>
              
              {/* 💰 $10 One-Way / $12 Round Trip - Gold/Yellow */}
              <span style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.4rem',
                background: 'rgba(251, 191, 36, 0.2)',
                backdropFilter: 'blur(10px)',
                padding: '0.35rem 0.75rem',
                borderRadius: '30px',
                fontSize: '0.82rem',
                color: '#fde68a',
                border: '1px solid rgba(251, 191, 36, 0.3)',
                position: 'relative',
                zIndex: 10,
                fontWeight: 500,
              }}>
                <FaDollarSign style={{ color: '#fbbf24' }} /> $10 One-Way / $12 Round Trip
              </span>
            </div>

            {/* Booking Form placed directly in hero */}
            <div style={{ 
              position: 'relative', 
              zIndex: 10,
              maxWidth: '1200px',
              width: '100%',
              margin: '0 auto',
            }}>
              <BookingForm />
            </div>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section id="why-us" className="section-why-us" style={{ 
        padding: '35px 8px', 
        maxWidth: '1200px', 
        margin: '0 auto',
        position: 'relative',
        zIndex: 10
      }}>
        <div className="section-container">
          <h2 style={{ 
            textAlign: 'center', 
            fontSize: '1.8rem', 
            color: '#0b2b40', 
            marginBottom: '24px',
            fontWeight: 700,
            position: 'relative',
            zIndex: 10
          }}>
            <FaCheckCircle style={{ color: '#2a7de1', marginRight: '10px' }} /> 
            Why Choose SkyDummy?
          </h2>
          <div className="features-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1rem',
            padding: '0 0.25rem'
          }}>
            <div className="feature-card" style={{
              background: '#ffffff',
              padding: '2rem',
              borderRadius: '12px',
              textAlign: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              transition: 'transform 0.2s'
            }}>
              <MdVerified style={{ fontSize: '2.5rem', color: '#2a7de1', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.2rem', color: '#0b2b40', marginBottom: '0.5rem' }}>100% Visa Approved</h3>
              <p style={{ color: '#2c4c61', fontSize: '0.95rem' }}>Our dummy tickets are accepted by embassies worldwide for visa applications.</p>
            </div>
            <div className="feature-card" style={{
              background: '#ffffff',
              padding: '2rem',
              borderRadius: '12px',
              textAlign: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              transition: 'transform 0.2s'
            }}>
              <FaBolt style={{ fontSize: '2.5rem', color: '#2a7de1', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.2rem', color: '#0b2b40', marginBottom: '0.5rem' }}>Instant Generation</h3>
              <p style={{ color: '#2c4c61', fontSize: '0.95rem' }}>Get your dummy ticket in seconds, not hours or days.</p>
            </div>
            <div className="feature-card" style={{
              background: '#ffffff',
              padding: '2rem',
              borderRadius: '12px',
              textAlign: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              transition: 'transform 0.2s'
            }}>
              <FaShieldAlt style={{ fontSize: '2.5rem', color: '#2a7de1', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.2rem', color: '#0b2b40', marginBottom: '0.5rem' }}>Secure & Private</h3>
              <p style={{ color: '#2c4c61', fontSize: '0.95rem' }}>Your data is encrypted and never shared with third parties.</p>
            </div>
            <div className="feature-card" style={{
              background: '#ffffff',
              padding: '2rem',
              borderRadius: '12px',
              textAlign: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              transition: 'transform 0.2s'
            }}>
              <FaDollarSign style={{ fontSize: '2.5rem', color: '#2a7de1', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.2rem', color: '#0b2b40', marginBottom: '0.5rem' }}>Affordable Pricing</h3>
              <p style={{ color: '#2c4c61', fontSize: '0.95rem' }}>Only $10 for one-way and $12 for round trip tickets.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* FAQs Section */}
      <section id="faqs" className="section-faqs" style={{ 
        padding: '60px 20px', 
        maxWidth: '1200px', 
        margin: '0 auto',
        position: 'relative',
        zIndex: 10
      }}>
        <div className="section-container">
          <h2 style={{ 
            textAlign: 'center', 
            fontSize: '2.2rem', 
            color: '#0b2b40', 
            marginBottom: '40px',
            fontWeight: 700,
            position: 'relative',
            zIndex: 10
          }}>
            <FaComments style={{ color: '#2a7de1', marginRight: '10px' }} /> 
            Frequently Asked Questions
          </h2>
          <div className="faq-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
            padding: '0 1rem'
          }}>
            <div className="faq-item" style={{
              background: '#ffffff',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
            }}>
              <h3 style={{ fontSize: '1.1rem', color: '#0b2b40', marginBottom: '0.5rem' }}>What is a dummy ticket?</h3>
              <p style={{ color: '#2c4c61', fontSize: '0.95rem' }}>A dummy ticket is a flight itinerary used for visa applications. It shows your travel plans without actual booking.</p>
            </div>
            <div className="faq-item" style={{
              background: '#ffffff',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
            }}>
              <h3 style={{ fontSize: '1.1rem', color: '#0b2b40', marginBottom: '0.5rem' }}>Is this ticket valid for visa applications?</h3>
              <p style={{ color: '#2c4c61', fontSize: '0.95rem' }}>Yes! Our tickets are formatted to meet embassy requirements and are accepted worldwide.</p>
            </div>
            <div className="faq-item" style={{
              background: '#ffffff',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
            }}>
              <h3 style={{ fontSize: '1.1rem', color: '#0b2b40', marginBottom: '0.5rem' }}>How fast do I get my ticket?</h3>
              <p style={{ color: '#2c4c61', fontSize: '0.95rem' }}>Instantly! Once you complete the form, your ticket is generated and ready for download immediately.</p>
            </div>
            <div className="faq-item" style={{
              background: '#ffffff',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
            }}>
              <h3 style={{ fontSize: '1.1rem', color: '#0b2b40', marginBottom: '0.5rem' }}>Can I use this for actual travel?</h3>
              <p style={{ color: '#2c4c61', fontSize: '0.95rem' }}>No, this is a dummy ticket for visa application purposes only. No actual flight is booked.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="section-contact" style={{ 
        padding: '60px 20px', 
        maxWidth: '1200px', 
        margin: '0 auto',
        position: 'relative',
        zIndex: 10
      }}>
        <div className="section-container">
          <h2 style={{ 
            textAlign: 'center', 
            fontSize: '2.2rem', 
            color: '#0b2b40', 
            marginBottom: '40px',
            fontWeight: 700,
            position: 'relative',
            zIndex: 10
          }}>
            <FaEnvelope style={{ color: '#2a7de1', marginRight: '10px' }} /> 
            Contact Us
          </h2>
          <div className="contact-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            padding: '0 1rem'
          }}>
            <div className="contact-info" style={{
              background: '#ffffff',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
            }}>
              <div className="contact-item" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <FaEnvelope style={{ fontSize: '1.5rem', color: '#2a7de1' }} />
                <div>
                  <h4 style={{ margin: 0, color: '#0b2b40' }}>Email</h4>
                  <a href="mailto:support@skydummy.com" style={{ color: '#2a7de1', textDecoration: 'none' }}>support@skydummy.com</a>
                </div>
              </div>
              <div className="contact-item" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <FaGlobe style={{ fontSize: '1.5rem', color: '#2a7de1' }} />
                <div>
                  <h4 style={{ margin: 0, color: '#0b2b40' }}>Website</h4>
                  <a href="https://www.skydummy.com" style={{ color: '#2a7de1', textDecoration: 'none' }}>www.skydummy.com</a>
                </div>
              </div>
              <div className="contact-item" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <FaClock style={{ fontSize: '1.5rem', color: '#2a7de1' }} />
                <div>
                  <h4 style={{ margin: 0, color: '#0b2b40' }}>Support Hours</h4>
                  <p style={{ margin: 0, color: '#2c4c61' }}>24/7 Online Support</p>
                </div>
              </div>
            </div>
            <div className="contact-form" style={{
              background: '#ffffff',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
            }}>
              <h3 style={{ color: '#0b2b40', marginBottom: '1rem' }}>Send us a message</h3>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
};

export default HomePage;