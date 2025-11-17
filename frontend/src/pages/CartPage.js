import React from 'react';
import { useCart } from '../hooks/useCart';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const navigate = useNavigate();

  return (
    <div className="center-content" style={{ maxWidth: '900px', margin: '20px auto' }}>
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <div style={{ flex: 2 }}>
                <strong>{item.name}</strong>
                {item.requiresPrescription && <span className="prescription-badge">RX</span>}
              </div>
              <div style={{ flex: 1 }}>${parseFloat(item.price).toFixed(2)}</div>
              <div style={{ flex: 1 }}>
                Qty: 
                <input 
                  type="number" 
                  value={item.quantity} 
                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                  min="1"
                  max={item.requiresPrescription ? 10 : 100}
                  style={{width: '60px', marginLeft: '5px'}}
                />
              </div>
              <div style={{ flex: 1, textAlign: 'right' }}>
                <strong>${(item.price * item.quantity).toFixed(2)}</strong>
              </div>
              <button onClick={() => removeFromCart(item.id)} className="btn btn-danger" style={{marginLeft: '15px', padding: '5px 10px'}}>X</button>
            </div>
          ))}
          <div className="cart-total">
            Total: ${getCartTotal()}
          </div>
          <button onClick={() => navigate('/checkout')} className="btn btn-success" style={{width: '100%', marginTop: '20px'}}>
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
};

export default CartPage;