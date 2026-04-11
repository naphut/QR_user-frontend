import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { fallbackProducts, fallbackCategories } from '../data/fallbackData';

const ProductContext = createContext();
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      setUsingFallback(false);
      
      // Add timeout and better error handling
      const response = await axios.get(`${API_URL}/products`, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.data && Array.isArray(response.data)) {
        if (response.data.length === 0) {
          // Use fallback data if no products available
          console.log('No products found, using fallback data');
          setProducts(fallbackProducts);
          setCategories(fallbackCategories);
          setUsingFallback(true);
        } else {
          setProducts(response.data);
          
          // Extract unique categories
          const uniqueCategories = [...new Set(response.data.map(p => p.category).filter(Boolean))];
          setCategories(uniqueCategories);
        }
      } else {
        setProducts(fallbackProducts);
        setCategories(fallbackCategories);
        setUsingFallback(true);
      }
    } catch (error) {
      console.error('Error fetching products, using fallback data:', error);
      setError(error.response?.data?.detail || error.message || 'Failed to fetch products');
      // Use fallback data when API fails
      setProducts(fallbackProducts);
      setCategories(fallbackCategories);
      setUsingFallback(true);
    } finally {
      setLoading(false);
    }
  };

  const getProductById = (id) => {
    return products.find(p => p.id === parseInt(id));
  };

  const getProductsByCategory = (category) => {
    return products.filter(p => p.category === category);
  };

  const getNewArrivals = () => {
    return [...products]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 8);
  };

  const getBestSellers = () => {
    // Return first 8 products as best sellers for now
    return products.slice(0, 8);
  };

  const getSaleProducts = () => {
    return products.filter(p => p.original_price && p.original_price > p.price);
  };

  const value = {
    products,
    loading,
    error,
    categories,
    usingFallback,
    getProductById,
    getProductsByCategory,
    getNewArrivals,
    getBestSellers,
    getSaleProducts,
    fetchProducts
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};