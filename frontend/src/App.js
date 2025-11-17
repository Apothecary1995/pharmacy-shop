import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Header from './components/Layout/Header';
import AuthModal from './components/Auth/AuthModal';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import UploadPrescriptionPage from './pages/UploadPrescriptionPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import ProtectedRoute from './components/Common/ProtectedRoute';
import SplashCursor from './components/Common/FluidCursor';
import './App.css';

function App() {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem('seenLoginPopup');
    if (!isAuthenticated && !hasSeenPopup) {
      setShowLoginPopup(true);
      sessionStorage.setItem('seenLoginPopup', 'true');
    }
  }, [isAuthenticated]);

  return (
    <div className="app-container">
      <SplashCursor 
        SIM_RESOLUTION={64}
        DYE_RESOLUTION={512}
        SPLAT_RADIUS={0.5}
        SPLAT_FORCE={2000}
        TRANSPARENT={true}
      />
      
      <Header onLoginClick={() => setShowLoginPopup(true)} />
      {showLoginPopup && <AuthModal onClose={() => setShowLoginPopup(false)} />}
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="/upload-prescription" element={<ProtectedRoute><UploadPrescriptionPage /></ProtectedRoute>} />
        <Route path="/my-orders" element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminDashboardPage /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

export default App;