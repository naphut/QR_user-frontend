import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL || 'https://qr-backend-3ula.onrender.com/api';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [addingToCart, setAddingToCart] = useState(false);

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/products/${id}`);
      setProduct(response.data);
      const sizes = JSON.parse(response.data.sizes);
      setSelectedSize(sizes[0]);
      setSelectedColor(response.data.color);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product details');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  const fetchRelatedProducts = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/products/?category=${product.category}&limit=4`);
      // Filter out current product
      const related = response.data.filter(p => p.id !== product.id);
      setRelatedProducts(related.slice(0, 4));
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  }, [product]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  useEffect(() => {
    if (product) {
      fetchRelatedProducts();
    }
  }, [product, fetchRelatedProducts]);

  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    
    setAddingToCart(true);
    try {
      await addToCart(product, quantity, selectedSize, selectedColor);
      toast.success(`Added ${quantity} x ${product.name} to cart`);
      // Optional: Stay on page or navigate
      // navigate('/cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlistToggle = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist');
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist');
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    if (product && newQuantity > product.stock) {
      toast.error(`Only ${product.stock} items available`);
      return;
    }
    setQuantity(newQuantity);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    addToCart(product, quantity, selectedSize, selectedColor);
    navigate('/checkout');
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
  const isOutOfStock = product.stock === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex mb-8 text-sm">
        <a href="/" className="text-gray-500 hover:text-gray-700">Home</a>
        <span className="mx-2 text-gray-500">/</span>
        <a href="/products" className="text-gray-500 hover:text-gray-700">Products</a>
        <span className="mx-2 text-gray-500">/</span>
        <a href={`/category/${product.category}`} className="text-gray-500 hover:text-gray-700">
          {product.category}
        </a>
        <span className="mx-2 text-gray-500">/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative bg-gray-100 rounded-lg overflow-hidden">
            <img 
              src={images[selectedImage]} 
              alt={product.name}
              className="w-full h-auto object-cover"
            />
            {discount > 0 && (
              <span className="absolute top-4 left-4 bg-red-500 text-white text-sm px-3 py-1 rounded-full">
                -{discount}% OFF
              </span>
            )}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold">
                  Out of Stock
                </span>
              </div>
            )}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {images.map((img, idx) => (
              <img 
                key={idx}
                src={img}
                alt={`${product.name} ${idx + 1}`}
                className={`w-full rounded-md cursor-pointer transition ${
                  selectedImage === idx 
                    ? 'ring-2 ring-gray-900 shadow-lg' 
                    : 'hover:opacity-75'
                }`}
                onClick={() => setSelectedImage(idx)}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                <p className="text-sm text-gray-500 mt-1">SKU: {product.code}</p>
              </div>
              <button
                onClick={handleWishlistToggle}
                className="p-2 border rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Add to wishlist"
              >
                <svg className={`w-6 h-6 ${isInWishlist(product.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
            
            {/* Rating Placeholder */}
            <div className="flex items-center mt-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-500">(4.5 · 128 reviews)</span>
            </div>
          </div>
          
          {/* Price */}
          <div className="border-t border-b py-4">
            {discount > 0 ? (
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-red-600">${product.price}</span>
                <span className="text-lg text-gray-500 line-through">${product.original_price}</span>
                <span className="bg-red-100 text-red-700 text-sm px-2 py-1 rounded">Save ${(product.original_price - product.price).toFixed(2)}</span>
              </div>
            ) : (
              <span className="text-3xl font-bold text-gray-900">${product.price}</span>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          {/* Color */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Color</h3>
            <div className="flex items-center space-x-2">
              <span 
                className="inline-block w-8 h-8 rounded-full border-2 border-gray-300"
                style={{ backgroundColor: product.color.toLowerCase() }}
              />
              <span className="text-gray-700">{product.color}</span>
            </div>
          </div>

          {/* Size */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Size</h3>
              <a href="/size-guide" className="text-sm text-gray-500 hover:text-gray-700 underline">
                Size Guide
              </a>
            </div>
            <div className="flex flex-wrap gap-2">
              {sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border rounded-md transition ${
                    selectedSize === size
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Stock Status */}
          <div>
            <p className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `✓ In Stock (${product.stock} available)` : '✗ Out of Stock'}
            </p>
          </div>

          {/* Quantity */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quantity</h3>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className="w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                -
              </button>
              <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= product.stock}
                className="w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || addingToCart}
              className="w-full bg-gray-900 text-white py-3 rounded-md hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {addingToCart ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>Add to Cart</span>
                </>
              )}
            </button>
            
            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="w-full border-2 border-gray-900 text-gray-900 py-3 rounded-md hover:bg-gray-900 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Buy Now
            </button>
          </div>

          {/* Delivery Info */}
          <div className="bg-gray-50 p-4 rounded-md space-y-3">
            <div className="flex items-center space-x-3 text-sm">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Free delivery on orders over $50</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Delivery in 1-3 business days</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <svg className="w-5 h-5 text-purple-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span>30-day easy returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map(related => {
              const relatedImages = JSON.parse(related.images);
              return (
                <div
                  key={related.id}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/product/${related.id}`)}
                >
                  <div className="bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={relatedImages[0]}
                      alt={related.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <div className="mt-2">
                    <h3 className="text-sm font-medium text-gray-900">{related.name}</h3>
                    <p className="text-sm text-gray-500">${related.price}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;