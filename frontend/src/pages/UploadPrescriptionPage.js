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
  
    setTimeout(() => navigate('/cart'), 0);
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
   
      const formData = new FormData();
    
      formData.append('prescription', file); 
      
      const uploadRes = await prescriptionService.uploadPrescription(formData);
      
    
      const prescriptionId = uploadRes.data.prescription ? uploadRes.data.prescription.id : uploadRes.data.id;
      
      if (!prescriptionId) throw new Error("Prescription ID not returned from server.");

      const orderData = {
        items: cartItems.map(item => ({ id: item.id, quantity: item.quantity })),
        shippingAddress: checkoutData.shippingAddress,
        paymentMethod: "Stripe", 
        paymentIntentId: checkoutData.paymentIntentId, 
        prescriptionId: prescriptionId
      };
      
      const orderRes = await orderService.createOrder(orderData);
      
      setMessage(`Order placed successfully! Order ID: ${orderRes.data.orderId}. Awaiting admin approval.`);
      
     
      clearCart();
      sessionStorage.removeItem('checkoutData');
      setTimeout(() => navigate('/my-orders'), 3000);

    } catch (error) {
      console.error(error);
      const resMsg = error.response?.data?.message || error.message;
      setMessage("Failed: " + resMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center-content" style={{maxWidth: '600px', margin: '40px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px'}}>
      <h2>Upload Prescription</h2>
      <p>Your order total is <strong>${getCartTotal()}</strong>.</p>
      
      <form onSubmit={handleSubmit}>
        <div style={{marginBottom: '15px'}}>
          <label style={{display:'block', marginBottom:'5px'}}>Prescription File (Image)</label>
          <input type="file" onChange={handleFileChange} accept="image/*" required className="form-control" />
        </div>
        
        {message && (
            <div style={{ 
                padding: '10px', 
                marginBottom: '15px', 
                borderRadius: '4px',
                backgroundColor: message.includes('Failed') ? '#f8d7da' : '#d4edda',
                color: message.includes('Failed') ? '#721c24' : '#155724'
            }}>
                {message}
            </div>
        )}
        
        <button type="submit" className="btn-primary" disabled={loading} style={{width: '100%', padding: '10px', cursor: loading ? 'not-allowed' : 'pointer'}}>
          {loading ? 'Processing' : 'Upload and Place Order'}
        </button>
      </form>
    </div>
  );
};

export default UploadPrescriptionPage;
