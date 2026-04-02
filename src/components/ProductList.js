import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        color: product.color,
        size: 'M',
        quantity: 1,
        image: JSON.parse(product.images)[0]
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Added to cart!');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const images = JSON.parse(product.images);
          const sizes = JSON.parse(product.sizes);
          const discount = product.original_price 
            ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
            : 0;
          
          return (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              <Link to={`/product/${product.id}`}>
                <img 
                  src={images[0]} 
                  alt={product.name}
                  className="w-full h-64 object-cover"
                />
              </Link>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{product.color}</p>
                  </div>
                  {discount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                      -{discount}%
                    </span>
                  )}
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                  {product.original_price && (
                    <span className="text-sm text-gray-500 line-through ml-2">
                      ${product.original_price}
                    </span>
                  )}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex space-x-1">
                    {sizes.slice(0, 3).map(size => (
                      <span key={size} className="text-xs text-gray-600 border px-2 py-1 rounded">
                        {size}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductList;