import React, { createContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const localData = localStorage.getItem('cart');
    return localData ? JSON.parse(localData) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (drug, quantity) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === drug.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === drug.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevItems, { ...drug, quantity }];
    });
  };

  const removeFromCart = (drugId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== drugId));
  };

  const updateQuantity = (drugId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(drugId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === drugId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };
  
  const requiresPrescription = () => {
    return cartItems.some(item => item.requiresPrescription);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    requiresPrescription
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;