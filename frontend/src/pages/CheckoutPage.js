import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import orderService from '../services/order.service';
import AddressForm from '../components/Checkout/AddressForm';
import PaymentForm from '../components/Checkout/PaymentForm';

const CheckoutPage = () => {
  const [step, setStep] = useState(1); // 1: Address, 2: Payment
  const [shippingAddress, setShippingAddress] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { cartItems, getCartTotal, clearCart, requiresPrescription } = useCart();
  const navigate = useNavigate();

  const handleAddressSubmit = (addressData) => {
    setShippingAddress(addressData);
    setStep(2);
  };

  const handlePaymentSubmit = async (paymentMethod) => {
    setMessage('');
    setLoading(true);

    if (requiresPrescription()) {
      // Reçete gerekiyorsa, ödeme ve adres bilgilerini state'e kaydet
      // ve reçete yükleme sayfasına yönlendir.
      sessionStorage.setItem('checkoutData', JSON.stringify({
        shippingAddress,
        paymentMethod
      }));
      navigate('/upload-prescription');
      return;
    }

    // Reçete gerekmiyorsa, siparişi doğrudan oluştur
    try {
      const orderData = {
        items: cartItems.map(item => ({ id: item.id, quantity: item.quantity })),
        shippingAddress,
        paymentMethod,
        prescriptionId: null // Reçete gerekmiyor
      };
      
      const res = await orderService.createOrder(orderData);
      setMessage(`Order placed successfully! Order ID: ${res.data.orderId}`);
      clearCart();
      setTimeout(() => navigate('/my-orders'), 3000);
      
    } catch (error) {
      setMessage("Failed to place order: " + error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && !message) {
    return (
      <div className="center-content" style={{maxWidth: '600px', margin: '20px auto'}}>
        <p>Your cart is empty. <a href="/">Go shopping</a>.</p>
      </div>
    );
  }

  return (
    <div className="center-content" style={{maxWidth: '600px', margin: '20px auto'}}>
      <h2>Checkout</h2>
      <h4>Total: ${getCartTotal()}</h4>
      <hr style={{margin: '20px 0'}} />
      
      {message && <p style={{color: 'green', fontWeight: 'bold'}}>{message}</p>}
      {loading && <p>Placing your order...</p>}

      {!message && !loading && (
        <>
          {step === 1 && <AddressForm onNext={handleAddressSubmit} />}
          {step === 2 && (
            <PaymentForm 
              onBack={() => setStep(1)} 
              onSubmit={handlePaymentSubmit} 
            />
          )}
        </>
      )}
    </div>
  );
};

export default CheckoutPage;