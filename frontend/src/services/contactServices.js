// src/services/contactService.js
import emailjs from '@emailjs/browser';

// ============================================
// EMAILJS CONFIGURATION
// ============================================

const EMAILJS_API_KEY = import.meta.env.VITE_EMAILJS_API_KEY || '';
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const EMAILJS_CONTACT_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE_ID || '';

const COMPANY_EMAIL = import.meta.env.VITE_RECIPIENT_EMAIL || 'support@skydummy.com';

// Initialize EmailJS
if (EMAILJS_API_KEY) {
  emailjs.init(EMAILJS_API_KEY);
  console.log('✅ EmailJS initialized with API key');
} else {
  console.warn('⚠️ EmailJS API Key not set');
}

/**
 * Send contact form message to admin
 */
export const sendContactMessage = async ({ name, email, subject, message }) => {
  console.log('📧 sendContactMessage called with:', { name, email, subject });

  try {
    // Validate inputs
    if (!name || !email || !message) {
      throw new Error('Please fill in all required fields');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Please enter a valid email address');
    }

    // Check if template ID is set
    if (!EMAILJS_CONTACT_TEMPLATE_ID || EMAILJS_CONTACT_TEMPLATE_ID === 'template_xxxxxxxxxxx') {
      console.warn('⚠️ Contact template not configured, skipping email send');
      // Return success to not break the UI
      return { success: true, message: 'Message received (email not configured)' };
    }

    console.log('📧 Sending contact form notification...');
    console.log('📝 Using Template ID:', EMAILJS_CONTACT_TEMPLATE_ID);

    const templateParams = {
      from_name: name,
      from_email: email,
      subject: subject || 'New Contact Form Message',
      message: message,
      to_email: COMPANY_EMAIL,
      sent_date: new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_CONTACT_TEMPLATE_ID,
      templateParams
    );
    
    console.log('✅ Contact email sent successfully!', response);
    return { success: true, response };
    
  } catch (error) {
    console.error('❌ Error sending contact email:', error);
    throw error;
  }
};