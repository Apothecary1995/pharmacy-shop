import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'; 



const StripePaymentForm = ({ onPaymentSuccess }) => {
    
    const stripe = useStripe();
    const elements = useElements();
    
    // removed useeffect
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    
    
    if (!stripe || !elements) {
        return (
            <div style={{padding: '20px', textAlign: 'center'}}>
                {message || "waiting for payment method"}
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!stripe || !elements) {
            setMessage("Stripe or Elements not initialized.");
            return;
        }

        setIsLoading(true);
        setMessage('');

        //payment confirmationms
        const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                 // return_url: `${window.location.origin}/order-history`, 
            },
            redirect: 'if_required' 
        });

        if (stripeError) {
            setMessage(stripeError.message);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            setMessage("payment successful your products on its way");
            onPaymentSuccess(paymentIntent.id); 
        } else {
            setMessage("unexpected error occured");
        }

        setIsLoading(false);
    };

    
    return (
        <form onSubmit={handleSubmit} className="stripe-payment-form"> 
            <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
                {/* element will nott get client */}
                <PaymentElement /> 
            </div>

            <button 
                disabled={isLoading || !stripe || !elements} 
                type="submit" 
                className="place-order-btn"
            >
                <span>{isLoading ? "processing" : "complete payment"}</span>
            </button>

            {message && <div className="payment-message">{message}</div>}
        </form>
    );
};

export default StripePaymentForm;