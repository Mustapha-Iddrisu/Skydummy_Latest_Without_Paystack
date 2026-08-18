// src/components/common/Testimonials.jsx
import React from 'react';
import { Star } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      country: "USA",
      flag: "🇺🇸",
      text: "SkyDummy helped me get my Schengen visa approved! The ticket looked professional and the embassy accepted it without any issues. Highly recommend!",
      rating: 5,
      date: "June 2026"
    },
    {
      id: 2,
      name: "Michael Osei",
      country: "Ghana",
      flag: "🇬🇭",
      text: "I've used SkyDummy twice now. Quick, reliable, and affordable. Got my UK visa approved both times. Best dummy ticket service out there!",
      rating: 5,
      date: "July 2026"
    },
    {
      id: 3,
      name: "Priya Patel",
      country: "India",
      flag: "🇮🇳",
      text: "The ticket was generated instantly and looked very professional. Got my Canadian visa approved without any problems. Thank you SkyDummy!",
      rating: 5,
      date: "August 2026"
    },
    {
      id: 4,
      name: "David Kim",
      country: "South Korea",
      flag: "🇰🇷",
      text: "I was nervous about my US visa interview, but the dummy ticket from SkyDummy looked so real. The visa officer didn't question it at all!",
      rating: 5,
      date: "July 2026"
    },
    {
      id: 5,
      name: "Aisha Mohammed",
      country: "Nigeria",
      flag: "🇳🇬",
      text: "Fast, reliable, and affordable. Got my ticket in seconds and my Schengen visa was approved. Will definitely use again!",
      rating: 5,
      date: "August 2026"
    },
    {
      id: 6,
      name: "John Anderson",
      country: "Australia",
      flag: "🇦🇺",
      text: "Excellent service! The ticket format was perfect for my visa application. The embassy staff accepted it without any questions.",
      rating: 5,
      date: "June 2026"
    }
  ];

  return (
    <section id="testimonials" className="section-testimonials" style={{
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
          marginBottom: '12px',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.6rem'
        }}>
          <Star size={30} color="#f59e0b" fill="#f59e0b" />
          <span>What Our Customers Say</span>
        </h2>
        <p style={{
          textAlign: 'center',
          color: '#4f6f82',
          fontSize: '1.05rem',
          marginBottom: '40px',
          maxWidth: '600px',
          margin: '0 auto 40px'
        }}>
          Trusted by travelers worldwide for successful visa applications
        </p>
        
        <div className="testimonials-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '24px'
        }}>
          {testimonials.map((t) => (
            <div key={t.id} className="testimonial-card" style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              padding: '24px',
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              position: 'relative',
              zIndex: 10
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div className="stars" style={{ color: '#f59e0b', display: 'flex', gap: '2px' }}>
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={15} color="#f59e0b" fill="#f59e0b" />
                  ))}
                </div>
                <span style={{ fontSize: '0.75rem', color: '#8aa3b5' }}>{t.date}</span>
              </div>
              
              <p style={{
                color: '#1f3a4b',
                fontSize: '0.95rem',
                lineHeight: '1.6',
                marginBottom: '16px',
                fontStyle: 'italic'
              }}>
                "{t.text}"
              </p>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                paddingTop: '12px',
                borderTop: '1px solid rgba(0, 0, 0, 0.05)'
              }}>
                <span style={{ fontSize: '1.5rem' }}>{t.flag}</span>
                <div>
                  <strong style={{ color: '#0b2b40', fontSize: '0.95rem' }}>{t.name}</strong>
                  <span style={{ display: 'block', color: '#4f6f82', fontSize: '0.85rem' }}>{t.country}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
