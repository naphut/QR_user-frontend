import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const images = JSON.parse(product.images);
  const discount = product.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, 1, 'M');
    toast.success(`Added ${product.name} to cart`);
  };

  const handleAddToWishlist = () => {
    addToWishlist(product);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition group">
      <div className="relative">
        <Link to={`/product/${product.id}`}>
          <img src={images[0]} alt={product.name} className="w-full h-64 object-cover" />
        </Link>
        <button
          onClick={handleAddToWishlist}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-gray-100"
        >
          <svg className={`w-5 h-5 ${isInWishlist(product.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            -{discount}%
          </span>
        )}
      </div>
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-800 hover:text-gray-600">{product.name}</h3>
        </Link>
        <p className="text-sm text-gray-500 mt-1">{product.color}</p>
        <div className="mt-2 flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-gray-900">${product.price}</span>
            {product.original_price && (
              <span className="text-sm text-gray-500 line-through ml-2">${product.original_price}</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="bg-gray-900 text-white px-3 py-1 rounded hover:bg-gray-800 text-sm"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;