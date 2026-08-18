// src/components/common/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  PlaneTakeoff, 
  Home, 
  CheckCheck, 
  HelpCircle, 
  MessagesSquare, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  FileText, 
  RotateCcw,
  Globe
} from 'lucide-react';

const Footer = () => {
  const scrollToSection = (sectionId) => {
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

  return (
    <footer className="footer-dark">
      <div className="footer-container">
        {/* Column 1: Brand */}
        <div className="footer-column">
          <div className="footer-brand">
            <div className="footer-logo-icon">
              <PlaneTakeoff size={22} color="#ffffff" />
            </div>
            <div className="footer-logo-text">
              <span className="footer-logo-main">SkyDummy</span>
              <span className="footer-logo-sub">Visa-Ready Tickets</span>
            </div>
          </div>
          <p className="footer-description">
            Generate verified flight itineraries for your visa applications instantly. 
            Trusted by travelers worldwide.
          </p>
          <div className="footer-social">
            <a href="https://facebook.com/skydummy" className="social-link" aria-label="Facebook">
              <Globe size={18} />
            </a>
            <a href="https://twitter.com/skydummy" className="social-link" aria-label="Twitter">
              <Globe size={18} />
            </a>
            <a href="https://instagram.com/skydummy" className="social-link" aria-label="Instagram">
              <Globe size={18} />
            </a>
            <a href="https://linkedin.com/company/skydummy" className="social-link" aria-label="LinkedIn">
              <Globe size={18} />
            </a>
          </div>
        </div>

        {/* Column 2: Quick Navigation */}
        <div className="footer-column">
          <h3 className="footer-heading">Quick Navigation</h3>
          <ul className="footer-links">
            <li>
              <Link to="/" className="footer-link" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <Home size={16} /> <span>Home</span>
              </Link>
            </li>
            <li>
              <Link to="/verify" className="footer-link">
                <CheckCheck size={16} /> <span>Verify PNR</span>
              </Link>
            </li>
            <li>
              <button 
                className="footer-link-btn"
                onClick={() => scrollToSection('why-us')}
              >
                <HelpCircle size={16} /> <span>Why Us</span>
              </button>
            </li>
            <li>
              <button 
                className="footer-link-btn"
                onClick={() => scrollToSection('faqs')}
              >
                <MessagesSquare size={16} /> <span>FAQs</span>
              </button>
            </li>
            <li>
              <button 
                className="footer-link-btn"
                onClick={() => scrollToSection('contact')}
              >
                <Mail size={16} /> <span>Contact Us</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact Info */}
        <div className="footer-column">
          <h3 className="footer-heading">Contact Us</h3>
          <ul className="footer-contact">
            <li>
              <Mail size={16} color="#2a7de1" />
              <a href="mailto:support@skydummy.com">support@skydummy.com</a>
            </li>
            <li>
              <MapPin size={16} color="#2a7de1" />
              <span>California, United States</span>
            </li>
            <li>
              <Clock size={16} color="#2a7de1" />
              <span>24/7 Online Support</span>
            </li>
          </ul>
        </div>

        {/* Column 4: Legal Links */}
        <div className="footer-column">
          <h3 className="footer-heading">Legal</h3>
          <ul className="footer-links">
            <li>
              <Link to="/privacy-policy" className="footer-link">
                <ShieldCheck size={16} /> <span>Privacy Policy</span>
              </Link>
            </li>
            <li>
              <Link to="/terms-conditions" className="footer-link">
                <FileText size={16} /> <span>Terms & Conditions</span>
              </Link>
            </li>
            <li>
              <Link to="/refund-policy" className="footer-link">
                <RotateCcw size={16} /> <span>Refund Policy</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <span className="footer-copyright">
            © {new Date().getFullYear()} SkyDummy. All rights reserved.
          </span>
          <div className="footer-bottom-links">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-conditions">Terms of Service</Link>
            <Link to="/refund-policy">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;