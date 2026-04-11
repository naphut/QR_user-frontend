import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useWishlist } from '../context/WishlistContext';

// Product Card Component with Wishlist
const ProductCard = ({ product }) => {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [isWishlisted, setIsWishlisted] = useState(isInWishlist(product.id));
  
  // Safe image parsing with fallback
  let images = [];
  try {
    images = JSON.parse(product.images);
    if (!Array.isArray(images) || images.length === 0) {
      throw new Error('Invalid images array');
    }
  } catch (error) {
    console.log('Image parsing error for product:', product.name, error);
    // Use fallback image
    images = ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'];
  }
  
  const discount = product.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const handleWishlistToggle = (e) => {
    e.preventDefault(); // Prevent navigation to product page
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition group relative">
      {/* Wishlist Button */}
      <button
        onClick={handleWishlistToggle}
        className="absolute top-3 right-3 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 transition-colors ${
            isWishlisted 
              ? 'fill-red-500 text-red-500' 
              : 'fill-none text-gray-600 hover:text-red-500'
          }`}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={isWishlisted ? 0 : 1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.312-2.733C5.099 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>
      </button>

      <Link to={`/product/${product.id}`}>
        <img src={images[0]} alt={product.name} className="w-full h-64 object-cover" />
      </Link>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-gray-800 line-clamp-1">{product.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{product.color}</p>
          </div>
        </div>
        <div className="mt-2">
          <span className="text-xl font-bold text-gray-900">${product.price}</span>
          {product.original_price && (
            <span className="text-sm text-gray-500 line-through ml-2">${product.original_price}</span>
          )}
          {discount > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded">-{discount}%</span>
          )}
        </div>
      </div>
    </div>
  );
};

const NewArrivals = () => {
  const { getNewArrivals, loading } = useProducts();
  const products = getNewArrivals();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">New Arrivals</h1>
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p className="text-gray-500">No new arrivals available at the moment.</p>
          <Link to="/products" className="mt-4 inline-block text-gray-600 underline hover:text-gray-900">
            View all products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">New Arrivals</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default NewArrivals;