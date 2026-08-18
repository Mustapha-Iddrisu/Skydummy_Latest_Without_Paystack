// src/pages/TicketPage.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import useBookingStore from '../store/bookingStore';
import TicketPreview from '../components/ticket/TicketPreview';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const TicketPage = () => {
  const { ticketGenerated, ticketData, isLoading } = useBookingStore();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('TicketPage - ticketGenerated:', ticketGenerated);
    console.log('TicketPage - ticketData:', ticketData);
    
    if (!ticketGenerated && !isLoading && !ticketData) {
      navigate('/');
    }
  }, [ticketGenerated, isLoading, ticketData, navigate]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner">
            <Loader2 size={32} className="animate-spin" color="#2a7de1" />
            <p>Generating your ticket...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!ticketData) {
    return null;
  }

  return (
    <>
      <Navbar />
      <TicketPreview />
      <Footer />
    </>
  );
};

export default TicketPage;
