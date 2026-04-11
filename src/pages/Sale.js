import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useWishlist } from '../context/WishlistContext';

// Product Card Component with Wishlist
const ProductCard = ({ product }) => {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [isWishlisted, setIsWishlisted] = useState(isInWishlist(product.id));
  const images = JSON.parse(product.images);
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

const Sale = () => {
  const { getSaleProducts } = useProducts();
  const products = getSaleProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Sale</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Sale;