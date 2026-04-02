import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = () => {
    const saved = localStorage.getItem('wishlist');
    if (saved) {
      setWishlist(JSON.parse(saved));
    }
  };

  const saveWishlist = () => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  };

  const addToWishlist = (product) => {
    if (!wishlist.find(item => item.id === product.id)) {
      setWishlist([...wishlist, {
        id: product.id,
        name: product.name,
        price: product.price,
        image: JSON.parse(product.images)[0]
      }]);
      saveWishlist();
      toast.success('Added to wishlist');
    } else {
      toast.error('Item already in wishlist');
    }
  };

  const removeFromWishlist = (id) => {
    const updated = wishlist.filter(item => item.id !== id);
    setWishlist(updated);
    saveWishlist();
    toast.success('Removed from wishlist');
  };

  const isInWishlist = (id) => {
    return wishlist.some(item => item.id === id);
  };

  const value = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};