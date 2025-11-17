import React, { useState } from 'react';

const PaymentForm = ({ onBack, onSubmit }) => {
  const [paymentMethod, setPaymentMethod] = useState('CreditCard');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(paymentMethod);
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form" style={{marginTop: 0}}>
      <h3>Payment Method</h3>
      <div className="form-group">
        <label>Select Method</label>
        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          <option value="CreditCard">Credit Card (Simulation)</option>
          <option value="PayPal">PayPal (Simulation)</option>
          <option value="CashOnDelivery">Cash on Delivery</option>
        </select>
      </div>
      {/* Burada gerçek bir ödeme formu olabilir */}
      <p>This is a simulation. No real payment will be processed.</p>
      
      <div style={{display: 'flex', gap: '10px'}}>
        <button type="button" onClick={onBack} className="btn btn-danger" style={{flex: 1}}>Back</button>
        <button type="submit" className="btn btn-success" style={{flex: 1}}>Place Order</button>
      </div>
    </form>
  );
};

export default PaymentForm;