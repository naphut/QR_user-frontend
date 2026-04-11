import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

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
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      setProducts(response.data);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(response.data.map(p => p.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching products:', error);
      if (error.response?.status === 404) {
        console.error('Products endpoint not found');
      } else if (error.response?.status >= 500) {
        console.error('Server error occurred');
      } else {
        console.error('Network error occurred');
      }
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
    console.log('Products available:', products.length);
    const newArrivals = [...products].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 8);
    console.log('New arrivals:', newArrivals.length);
    return newArrivals;
  };

  const getBestSellers = () => {
    // For now, return all products as best sellers since we don't have order data
    const bestSellers = products.slice(0, 8);
    console.log('Best sellers:', bestSellers.length);
    return bestSellers;
  };

  const getSaleProducts = () => {
    return products.filter(p => p.original_price && p.original_price > p.price);
  };

  const value = {
    products,
    loading,
    categories,
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