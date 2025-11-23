import React, { useState, useEffect } from 'react'; // 🛑 useEffect ve api için import eklendi
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import orderService from '../services/order.service';
import AddressForm from '../components/Checkout/AddressForm';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js'; 
import StripePaymentForm from '../components/Checkout/StripePaymentForm'; 
//import api from '../services/api'; 


// publish key 
const STRIPE_PUBLISHABLE_KEY = "pk_test_51SW3JEL1E21BtQcYxNA2c6Q1h3BZwZa1U0T7qML5nh2CCbfGuGRh7vJKvWBmLqsUnHMqzHIq8WZn3ox05g2cDUJT00dLLtExX5"; 
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);


const CheckoutPage = () => {
    const [step, setStep] = useState(1);
    const [shippingAddress, setShippingAddress] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    
    // added client secret
    const [clientSecret, setClientSecret] = useState(''); 
    
    const { cartItems, getCartTotal, clearCart, requiresPrescription } = useCart();
    const navigate = useNavigate();
    const cartTotal = getCartTotal(); 

  
    useEffect(() => {
        
        
        if (cartTotal <= 0) return;
        

        if (step === 2 && !clientSecret) {
            const fetchClientSecret = async () => {
                setLoading(true);
                setMessage(''); // 
                try {
                   
                    const fullUrl = `${BACKEND_URL}/api/payment/create-intent`;
                    
                    const response = await fetch(fullUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                           
                        },
                        body: JSON.stringify({
                            
                            amount: cartTotal, 
                            currency: 'usd', 
                        })
                    });
                    
                    
                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({}));
                       
                        throw new Error(errorData.error || `Server responded with status ${response.status}`);
                    }
                    
                    const data = await response.json();

                    if (data.clientSecret) {
                        setClientSecret(data.clientSecret);
                        setMessage("Payment details loading..."); 
                    } else {
                        
                        setMessage("Client secret could not be retrieved due to unexpected server response.");
                    }
                } catch (err) {
                    console.error("Payment initialization error:", err);
                   
                    setMessage(`payment initilazed error: ${err.message || "Server connection failed."}`);
                } finally {
                    setLoading(false);
                }
            };
            fetchClientSecret();
        }
        
        
        if (step === 1 && clientSecret) {
            setClientSecret('');
            setMessage('');
        }

    }, [step, cartTotal, clientSecret]); 

    const handleAddressSubmit = (addressData) => {
        setShippingAddress(addressData);
        setStep(2);
    };

    
    const handleStripeSuccess = async (paymentIntentId) => {
        setMessage('Payment successful, finalizing order...');
        setLoading(true);

        
        if (requiresPrescription()) {
            
            sessionStorage.setItem('checkoutData', JSON.stringify({
                shippingAddress,
                paymentIntentId
            }));
            navigate('/upload-prescription');
            return;
        }

        
        try {
            const orderData = {
                items: cartItems.map(item => ({ id: item.id, quantity: item.quantity })),
                shippingAddress,
                paymentIntentId: paymentIntentId, 
                paymentMethod: 'Stripe', 
                prescriptionId: null 
            };
            
            const res = await orderService.createOrder(orderData);
            setMessage(`Order placed successfully! Order ID: ${res.data.orderId}`);
            clearCart();
            setTimeout(() => navigate('/my-orders'), 3000);
            
        } catch (error) {
            setMessage("Failed to place order: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };
    
    // Client 
    const elementOptions = clientSecret ? { clientSecret, appearance: { theme: 'stripe' } } : {};

    if (cartItems.length === 0 && !message) {
        return (
            <div className="center-content" style={{maxWidth: '600px', margin: '20px auto'}}>
                <p>Your cart is empty <a href="/">do some shopping</a>.</p>
            </div>
        );
    }
    
    return (
        <div className="center-content" style={{maxWidth: '600px', margin: '20px auto'}}>
            <h2>Checkout</h2>
            <h4>Total: ${typeof cartTotal === 'number' ? cartTotal.toFixed(2) : '0.00'}</h4> 
            <hr style={{margin: '20px 0'}} />
            
            {message && <p style={{color: message.includes('error') ? 'red' : 'green', fontWeight: 'bold'}}>{message}</p>}
            {loading && <p>Please wait</p>}

            {!loading && (
                <>
                    {/* Adım 1: Adres */}
                    {step === 1 && <AddressForm onNext={handleAddressSubmit} />}
                    
                    {/* Adım 2: Ödeme */}
                    {step === 2 && (
                        <>
                            <p>Shipping to: **{shippingAddress?.street}, {shippingAddress?.city}**</p>
                            <div style={{marginBottom: '20px', border: '1px solid #eee', padding: '15px', borderRadius: '8px'}}>
                                
                                {clientSecret && stripePromise ? (
                                    
                                    <Elements stripe={stripePromise} options={elementOptions}> 
                                        <StripePaymentForm 
                                            onPaymentSuccess={handleStripeSuccess} 
                                        />
                                    </Elements>
                                ) : (
                                    
                                    <p>{loading ? "Payment method loading..." : "Waiting for payment details. Please go back to address step if the issue persists."}</p>
                                )}

                            </div>
                            
                            <button onClick={() => setStep(1)} className="btn-secondary" style={{display: 'block', width: '100%'}}>
                                ← go back to adress
                            </button>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default CheckoutPage;