// src/components/common/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaQuestionCircle, 
  FaStar, 
  FaComments, 
  FaEnvelope, 
  FaPlaneDeparture,
  FaBars,
  FaTimes,
  FaSearch,
  FaTicketAlt
} from 'react-icons/fa';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const scrollToSection = (sectionId) => {
    closeMenu();
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 70;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navbarHeight - 20;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    closeMenu();
  }, [location]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const navItems = [
    { id: 'home', label: 'Home', icon: FaHome, href: '/' },
    { id: 'why-us', label: 'Why Us', icon: FaQuestionCircle, isScroll: true },
    { id: 'testimonials', label: 'Testimonials', icon: FaStar, isScroll: true },
    { id: 'faqs', label: 'FAQs', icon: FaComments, isScroll: true },
    { id: 'contact', label: 'Contact Us', icon: FaEnvelope, isScroll: true },
  ];

  const isHomePage = location.pathname === '/';
  const isVerifyPage = location.pathname === '/verify';

  return (
    <>
      <nav 
        className="navbar" 
        id="navbar"
        style={{
          background: isScrolled ? '#ffffff' : 'rgba(255, 255, 255, 0.98)',
          boxShadow: isScrolled ? '0 2px 20px rgba(0,0,0,0.1)' : '0 1px 10px rgba(0,0,0,0.05)',
          padding: '0.75rem 1rem',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          borderBottom: '1px solid rgba(42, 125, 225, 0.08)',
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(10px)',
          height: '70px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          height: '100%',
        }}>
          {/* Logo */}
          <Link to="/" className="nav-brand" onClick={closeMenu} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            textDecoration: 'none',
            flexShrink: 0,
          }}>
            <div style={{
              background: '#2a7de1',
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '1.2rem',
            }}>
              <FaPlaneDeparture />
            </div>
            <div className="logo-text">
              <span style={{
                fontSize: '1.3rem',
                fontWeight: 700,
                color: '#0b2b40',
                letterSpacing: '-0.01em',
              }}>
                Sky<span style={{ color: '#2a7de1' }}>Dummy</span>
              </span>
              <span style={{
                fontSize: '0.55rem',
                color: '#6b7280',
                display: 'block',
                marginTop: '-2px',
                letterSpacing: '0.5px',
              }}>
                Visa-Ready Tickets
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <ul style={{
            display: 'flex',
            listStyle: 'none',
            gap: '0.5rem',
            margin: 0,
            padding: 0,
            alignItems: 'center',
          }}
          className="nav-desktop">
            {navItems.map((item) => (
              <li key={item.id}>
                {item.isScroll && isHomePage ? (
                  <button
                    onClick={() => scrollToSection(item.id)}
                    style={{
                      textDecoration: 'none',
                      color: '#2c4c61',
                      fontWeight: 500,
                      fontSize: '0.9rem',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '8px',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = '#2a7de1';
                      e.target.style.background = 'rgba(42, 125, 225, 0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = '#2c4c61';
                      e.target.style.background = 'transparent';
                    }}
                  >
                    <item.icon size={16} />
                    {item.label}
                  </button>
                ) : (
                  <Link
                    to={item.href || '/'}
                    style={{
                      textDecoration: 'none',
                      color: '#2c4c61',
                      fontWeight: 500,
                      fontSize: '0.9rem',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '8px',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = '#2a7de1';
                      e.target.style.background = 'rgba(42, 125, 225, 0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = '#2c4c61';
                      e.target.style.background = 'transparent';
                    }}
                  >
                    <item.icon size={16} />
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* Right side: Verify PNR + Mobile Toggle */}
          <div className="nav-actions" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}>
            {/* Verify PNR Button - Changed from Get Ticket */}
            <Link
              to="/verify"
              className="verify-button"
              style={{
                background: isVerifyPage ? '#1a5fb0' : '#2a7de1',
                color: '#fff',
                padding: '0.5rem 1.25rem',
                borderRadius: '30px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.85rem',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#1a5fb0';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 15px rgba(42, 125, 225, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = isVerifyPage ? '#1a5fb0' : '#2a7de1';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <FaSearch size={14} />
              <span className="verify-text">Verify PNR</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMenu}
              className="menu-toggle"
              aria-label="Toggle menu"
              style={{
                background: 'none',
                border: 'none',
                color: '#0b2b40',
                cursor: 'pointer',
                padding: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
              }}
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Overlay */}
      <div 
        className={`mobile-overlay ${isMenuOpen ? 'active' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 999,
          opacity: isMenuOpen ? 1 : 0,
          visibility: isMenuOpen ? 'visible' : 'hidden',
          transition: 'all 0.3s ease',
        }}
        onClick={closeMenu}
      />

      {/* Mobile Navigation Menu */}
      <div 
        className="mobile-menu"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '300px',
          maxWidth: '80%',
          height: '100vh',
          background: '#ffffff',
          zIndex: 1001,
          transform: isMenuOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
          boxShadow: '-4px 0 30px rgba(0,0,0,0.1)',
          padding: '1.5rem 1.5rem 2rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Mobile Menu Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid #e5e7eb',
        }}>
          <Link to="/" onClick={closeMenu} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            textDecoration: 'none',
          }}>
            <div style={{
              background: '#2a7de1',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '1rem',
            }}>
              <FaPlaneDeparture />
            </div>
            <span style={{
              fontSize: '1.2rem',
              fontWeight: 700,
              color: '#0b2b40',
            }}>
              Sky<span style={{ color: '#2a7de1' }}>Dummy</span>
            </span>
          </Link>
          <button
            onClick={closeMenu}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              color: '#0b2b40',
              cursor: 'pointer',
              padding: '0.25rem',
            }}
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Mobile Menu Links */}
        <ul style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem',
          flex: 1,
        }}>
          {navItems.map((item) => (
            <li key={item.id}>
              {item.isScroll && isHomePage ? (
                <button
                  onClick={() => scrollToSection(item.id)}
                  style={{
                    textDecoration: 'none',
                    color: '#2c4c61',
                    fontWeight: 500,
                    fontSize: '1.05rem',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#2a7de1';
                    e.target.style.background = 'rgba(42, 125, 225, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '#2c4c61';
                    e.target.style.background = 'transparent';
                  }}
                >
                  <item.icon size={20} style={{ color: '#2a7de1' }} />
                  {item.label}
                </button>
              ) : (
                <Link
                  to={item.href || '/'}
                  style={{
                    textDecoration: 'none',
                    color: '#2c4c61',
                    fontWeight: 500,
                    fontSize: '1.05rem',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    width: '100%',
                  }}
                  onClick={closeMenu}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#2a7de1';
                    e.target.style.background = 'rgba(42, 125, 225, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '#2c4c61';
                    e.target.style.background = 'transparent';
                  }}
                >
                  <item.icon size={20} style={{ color: '#2a7de1' }} />
                  {item.label}
                </Link>
              )}
            </li>
          ))}
          
          {/* Mobile Menu - Verify PNR Link (added to mobile menu) */}
          <li>
            <Link
              to="/verify"
              style={{
                textDecoration: 'none',
                color: '#2c4c61',
                fontWeight: 500,
                fontSize: '1.05rem',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                width: '100%',
              }}
              onClick={closeMenu}
              onMouseEnter={(e) => {
                e.target.style.color = '#2a7de1';
                e.target.style.background = 'rgba(42, 125, 225, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#2c4c61';
                e.target.style.background = 'transparent';
              }}
            >
              <FaSearch size={20} style={{ color: '#2a7de1' }} />
              Verify PNR
            </Link>
          </li>
        </ul>

        {/* Mobile Menu Footer CTA - Changed to Verify PNR */}
        <div style={{
          paddingTop: '1rem',
          borderTop: '1px solid #e5e7eb',
          marginTop: 'auto',
        }}>
          <Link
            to="/verify"
            style={{
              background: '#2a7de1',
              color: '#fff',
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              width: '100%',
            }}
            onClick={closeMenu}
          >
            <FaSearch size={18} />
            Verify Your PNR
          </Link>
          <p style={{
            textAlign: 'center',
            fontSize: '0.7rem',
            color: '#9ca3af',
            marginTop: '0.75rem',
          }}>
            Check your ticket status instantly
          </p>
        </div>
      </div>

      {/* CSS for Responsive Behavior */}
      <style>{`
        /* Desktop: Show nav links, hide menu toggle */
        @media (min-width: 769px) {
          .nav-desktop {
            display: flex !important;
          }
          .menu-toggle {
            display: none !important;
          }
          .mobile-overlay,
          .mobile-menu {
            display: none !important;
          }
        }

        /* Mobile: Hide nav links, show menu toggle */
        @media (max-width: 768px) {
          .nav-desktop {
            display: none !important;
          }
          .menu-toggle {
            display: flex !important;
          }
          .verify-text {
            display: none !important;
          }
          .verify-button {
            padding: 0.5rem 0.75rem !important;
          }
          .logo-text span:first-child {
            font-size: 1.1rem !important;
          }
          .logo-text span:last-child {
            display: none !important;
          }
          .nav-brand {
            gap: 0.35rem !important;
          }
        }

        /* Very small screens */
        @media (max-width: 400px) {
          .navbar {
            padding: 0.5rem 0.75rem !important;
          }
          .nav-brand div {
            width: 32px !important;
            height: 32px !important;
            font-size: 1rem !important;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;