import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    updateCartSummary();
    saveCart();
  }, [cart]);

  const loadCart = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  };

  const saveCart = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
  };

  const updateCartSummary = () => {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setCartCount(count);
    setCartTotal(total);
  };

  const addToCart = (product, quantity = 1, size = 'M', color = null) => {
    const existingItem = cart.find(item => 
      item.id === product.id && item.size === size
    );
    
    if (existingItem) {
      existingItem.quantity += quantity;
      setCart([...cart]);
      toast.success(`Updated ${product.name} quantity`);
    } else {
      setCart([...cart, {
        id: product.id,
        name: product.name,
        price: product.price,
        image: JSON.parse(product.images)[0],
        quantity,
        size,
        color: color || product.color
      }]);
      toast.success(`Added ${product.name} to cart`);
    }
  };

  const updateQuantity = (id, size, quantity) => {
    if (quantity < 1) {
      removeItem(id, size);
      return;
    }
    
    const updatedCart = cart.map(item => 
      item.id === id && item.size === size 
        ? { ...item, quantity }
        : item
    );
    setCart(updatedCart);
  };

  const removeItem = (id, size) => {
    const updatedCart = cart.filter(item => 
      !(item.id === id && item.size === size)
    );
    setCart(updatedCart);
    toast.success('Item removed from cart');
  };

  const clearCart = () => {
    setCart([]);
    toast.success('Cart cleared');
  };

  const value = {
    cart,
    cartCount,
    cartTotal,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};