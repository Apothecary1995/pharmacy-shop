import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import prescriptionService from '../services/prescription.service';
import orderService from '../services/order.service';

const UploadPrescriptionPage = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { cartItems, clearCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  const checkoutData = JSON.parse(sessionStorage.getItem('checkoutData'));

  if (!checkoutData || cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    setLoading(true);
    setMessage('');
    
    try {
      // 1. Reçeteyi yükle
      const formData = new FormData();
      formData.append('prescription', file);
      const uploadRes = await prescriptionService.uploadPrescription(formData);
      const prescriptionId = uploadRes.data.prescription.id;
      
      // 2. Siparişi oluştur (reçete ID'si ile)
      const orderData = {
        items: cartItems.map(item => ({ id: item.id, quantity: item.quantity })),
        shippingAddress: checkoutData.shippingAddress,
        paymentMethod: checkoutData.paymentMethod,
        prescriptionId: prescriptionId
      };
      
      const orderRes = await orderService.createOrder(orderData);
      
      setMessage(`Order placed successfully! Order ID: ${orderRes.data.orderId}. It is now pending admin approval.`);
      clearCart();
      sessionStorage.removeItem('checkoutData');
      setTimeout(() => navigate('/my-orders'), 4000);

    } catch (error) {
      setMessage("Failed to place order: " + error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form" style={{maxWidth: '600px'}}>
      <h2>Upload Prescription</h2>
      <p>Your order total is <strong>${getCartTotal()}</strong>. Please upload your prescription to complete the order.</p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Prescription File (Image)</label>
          <input type="file" onChange={handleFileChange} accept="image/*" required />
        </div>
        
        {message && <p style={{ color: loading ? 'blue' : 'red' }}>{message}</p>}
        
        <button type="submit" className="btn btn-success" disabled={loading} style={{width: '100%'}}>
          {loading ? 'Processing...' : 'Upload & Place Order'}
        </button>
      </form>
    </div>
  );
};

export default UploadPrescriptionPage;