import React, { useState } from 'react';
import { useCart } from '../../hooks/useCart';

const DrugItem = ({ drug, onDrugSelect }) => {
  const [quantity, setQuantity] = useState(1);
  const { cartItems, addToCart, updateQuantity } = useCart();
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8081";

  //Change every url in code base to reach render id this url .env might be the failde production issue
  const existingCartItem = cartItems.find(item => item.id === drug.id);
  const currentQuantityInCart = existingCartItem ? existingCartItem.quantity : 0;
  
  const maxQuantity = drug.requiresPrescription ? 10 : 100; // Max 10 if RX
  const remainingQuantityAllowed = maxQuantity - currentQuantityInCart;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    
    if (quantity > remainingQuantityAllowed) {
      alert(`Max ${maxQuantity} unit allowed. You have ${currentQuantityInCart} in cart.`);
      setQuantity(remainingQuantityAllowed > 0 ? remainingQuantityAllowed : 1);
      return;
    }
    
    if (existingCartItem) {
      updateQuantity(drug.id, currentQuantityInCart + quantity);
    } else {
      addToCart(drug, quantity);
    }
    
    alert(`${quantity} unit of ${drug.name} added to cart!`);
    setQuantity(1);
  };

  const increaseQuantity = (e) => {
    e.stopPropagation();
    setQuantity(q => Math.min(q + 1, remainingQuantityAllowed));
  };

  const decreaseQuantity = (e) => {
    e.stopPropagation();
    setQuantity(q => Math.max(1, q - 1));
  };

  return (
    <div className="drug-item" onClick={() => onDrugSelect(drug)}>
      <img src={`${API_URL}${drug.imageUrl}` || `${API_URL}/images/placeholder.jpg`} alt={drug.name} />
      <div className="drug-name">
        {drug.name}
        {drug.requiresPrescription && <span className="prescription-badge">RX</span>}
      </div>
      <div className="drug-description">{drug.description}</div>
      <div className="price">${parseFloat(drug.price).toFixed(2)}</div>
      
      <div className="quantity-controls">
        <button className="quantity-btn" onClick={decreaseQuantity} disabled={quantity === 1}>-</button>
        <span>{quantity}</span>
        <button className="quantity-btn" onClick={increaseQuantity} disabled={quantity === remainingQuantityAllowed || remainingQuantityAllowed <= 0}>+</button>
      </div>
      
      {remainingQuantityAllowed <= 0 ? (
         <p style={{color: 'red', fontSize: '0.9em', height: '45px'}}>Max {maxQuantity} in cart.</p>
      ) : (
         <button className="btn" onClick={handleAddToCart} style={{height: '45px'}}>Add to Cart</button>
      )}
    </div>
  );
};

export default DrugItem;