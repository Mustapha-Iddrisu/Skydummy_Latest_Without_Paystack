// src/App.jsx
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AirplaneBackground from './components/common/AirplaneBackground';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css';

// Lazy load components
const HomePage = lazy(() => import('./pages/HomePage'));
const PassengerPage = lazy(() => import('./pages/PassengerPage'));
const TicketPage = lazy(() => import('./pages/TicketPage'));
const PnrVerificationPage = lazy(() => import('./pages/PnrVerificationPage'));
const PaymentCallbackPage = lazy(() => import('./pages/PaymentCallbackPage'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsConditions = lazy(() => import('./pages/TermsConditions'));
const RefundPolicy = lazy(() => import('./pages/RefundPolicy'));

// Loading fallback
const LoadingFallback = () => (
  <div className="loading-container">
    <div className="loading-spinner">
      <i className="fas fa-spinner fa-spin"></i>
      <p>Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <AirplaneBackground />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/passengers" element={<PassengerPage />} />
            <Route path="/ticket" element={<TicketPage />} />
            <Route path="/payment/callback" element={<PaymentCallbackPage />} />
            <Route path="/verify" element={<PnrVerificationPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-conditions" element={<TermsConditions />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;