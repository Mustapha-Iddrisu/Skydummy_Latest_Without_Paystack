// src/components/common/ContactForm.jsx
import React, { useState } from 'react';
import { CheckCircle, AlertCircle, Loader2, Send } from 'lucide-react';
import { sendContactMessage } from '../../services/contactServices';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (submitStatus) {
      setSubmitStatus(null);
      setErrorMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('📝 Contact form submitted');
    console.log('📋 Form data:', formData);
    
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus('error');
      setErrorMessage('Please fill in all required fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitStatus('error');
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage('');

    try {
      console.log('📧 Calling sendContactMessage...');
      const result = await sendContactMessage({
        name: formData.name,
        email: formData.email,
        subject: formData.subject || 'New Contact Form Message',
        message: formData.message
      });

      console.log('📧 Result:', result);

      if (result && result.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setSubmitStatus(null), 5000);
      } else {
        throw new Error('Failed to send message');
      }
      
    } catch (error) {
      console.error('❌ Error:', error);
      setSubmitStatus('error');
      setErrorMessage(error.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      {submitStatus === 'success' && (
        <div className="form-success" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle size={18} color="#16a34a" />
          <span>Message sent successfully! We'll get back to you soon.</span>
        </div>
      )}
      
      {submitStatus === 'error' && (
        <div className="form-error" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={18} color="#dc2626" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="name">Your Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="John Doe"
          value={formData.name}
          onChange={handleChange}
          disabled={isSubmitting}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Your Email *</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="john@example.com"
          value={formData.email}
          onChange={handleChange}
          disabled={isSubmitting}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="subject">Subject</label>
        <input
          type="text"
          id="subject"
          name="subject"
          placeholder="How can we help?"
          value={formData.subject}
          onChange={handleChange}
          disabled={isSubmitting}
        />
      </div>

      <div className="form-group">
        <label htmlFor="message">Message *</label>
        <textarea
          id="message"
          name="message"
          rows="4"
          placeholder="Tell us how we can help you..."
          value={formData.message}
          onChange={handleChange}
          disabled={isSubmitting}
          required
        />
      </div>

      <button 
        type="submit" 
        className="btn-primary"
        disabled={isSubmitting}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '0.8rem 2rem',
          background: isSubmitting ? '#6c757d' : 'linear-gradient(135deg, #0b2b40, #1a405a)'
        }}
      >
        {isSubmitting ? (
          <>
            <Loader2 size={16} className="animate-spin" /> <span>Sending...</span>
          </>
        ) : (
          <>
            <Send size={16} /> <span>Send Message</span>
          </>
        )}
      </button>
    </form>
  );
};

export default ContactForm;
