import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
// Düzeltilmiş import yolları: Artık doğrudan klasör adlarıyla başlıyor
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



import LiquidEther from './components/Common/LiquidEther'; 
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
      
      
      <div 
        className="liquid-ether-container" 
        style={{ 
          
          position: 'fixed', 
          top: 0, 
          left: 0, 
          zIndex: 0, 
          width: '100%', 
          height: '100%',
        }}
      >
        
        <LiquidEther
            colors={[ '#5227FF', '#FF9FFC', '#B19EEF' ]}
            mouseForce={20}
            cursorSize={100}
            isViscous={false}
            viscous={30}
            iterationsViscous={32}
            iterationsPoisson={32}
            resolution={0.5}
            isBounce={false}
            autoDemo={true}
            autoSpeed={0.5}
            autoIntensity={2.2}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
        />
      </div>

      
      <div style={{ position: 'relative', zIndex: 1, minHeight: '100%' , display:'flex', flexDirection: 'column', paddingBottom: '600px'}}>

        
        <SplashCursor />
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
      
    </div>
  );
}

export default App;