import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API_URL}/products/${id}`);
      setProduct(response.data);
      const sizes = JSON.parse(response.data.sizes);
      setSelectedSize(sizes[0]);
      setSelectedColor(response.data.color);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        color: selectedColor,
        size: selectedSize,
        quantity: quantity,
        image: JSON.parse(product.images)[0]
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Added to cart!');
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!product) return null;

  const images = JSON.parse(product.images);
  const sizes = JSON.parse(product.sizes);
  const discount = product.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <img 
            src={images[0]} 
            alt={product.name}
            className="w-full rounded-lg shadow-md"
          />
          <div className="grid grid-cols-4 gap-2">
            {images.slice(0, 4).map((img, idx) => (
              <img 
                key={idx}
                src={img}
                alt={`${product.name} ${idx + 1}`}
                className="w-full rounded-md cursor-pointer hover:opacity-75"
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-sm text-gray-500 mt-1">Code: {product.code}</p>
          
          <div className="mt-4">
            {discount > 0 ? (
              <div>
                <span className="text-3xl font-bold text-gray-900">${product.price}</span>
                <span className="text-lg text-gray-500 line-through ml-2">${product.original_price}</span>
                <span className="ml-2 bg-red-500 text-white text-sm px-2 py-1 rounded">-{discount}%</span>
              </div>
            ) : (
              <span className="text-3xl font-bold text-gray-900">${product.price}</span>
            )}
          </div>

          <div className="mt-6">
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900">Color</h3>
            <div className="mt-2">
              <span className="inline-block px-4 py-2 bg-gray-100 rounded-md">
                {product.color}
              </span>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900">Size</h3>
            <div className="mt-2 flex space-x-2">
              {sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border rounded-md ${
                    selectedSize === size
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900">Quantity</h3>
            <div className="mt-2 flex items-center space-x-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-100"
              >
                -
              </button>
              <span className="text-xl font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <button
              onClick={addToCart}
              className="w-full bg-gray-900 text-white py-3 rounded-md hover:bg-gray-800 transition"
            >
              Add to Bag
            </button>
            
            <div className="bg-gray-50 p-4 rounded-md space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Fast Delivery: 1-3 days</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>Support: (+855) 085 330 330</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span>Easy payment: Many forms</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;