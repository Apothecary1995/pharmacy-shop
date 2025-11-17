import React, { useState } from 'react';

const AddressForm = ({ onNext }) => {
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('Turkey');

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext({ address, city, zip, country });
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form" style={{marginTop: 0}}>
      <h3>Shipping Address</h3>
      <div className="form-group">
        <label>Address</label>
        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>City</label>
        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Zip Code</label>
        <input type="text" value={zip} onChange={(e) => setZip(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Country</label>
        <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} required />
      </div>
      <button type="submit" className="btn" style={{width: '100%'}}>Continue to Payment</button>
    </form>
  );
};

export default AddressForm;