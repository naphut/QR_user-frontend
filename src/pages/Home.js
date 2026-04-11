import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useWishlist } from '../context/WishlistContext';

const Home = () => {
  const { getNewArrivals, getBestSellers, getSaleProducts } = useProducts();
  const newArrivals = getNewArrivals();
  const bestSellers = getBestSellers();
  const saleProducts = getSaleProducts();

  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-gray-900 h-96">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200"
            alt="Hero"
            className="w-full h-full object-cover opacity-50"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">ROUTINE</h1>
            <p className="text-xl md:text-2xl mb-8">Discover the latest trends in fashion</p>
            <Link
              to="/products"
              className="inline-block bg-white text-gray-900 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">New Arrivals</h2>
        {newArrivals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500">No new arrivals available at the moment.</p>
            <Link to="/products" className="mt-4 inline-block text-gray-600 underline hover:text-gray-900">
              View all products
            </Link>
          </div>
        )}
      </section>

      {/* Categories Banner */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['T-Shirts', 'Jackets', 'Pants', 'Sweatshirts'].map(category => (
              <Link
                key={category}
                to={`/category/${category}`}
                className="relative group overflow-hidden rounded-lg"
              >
                <img
                  src={`https://via.placeholder.com/400x300?text=${category}`}
                  alt={category}
                  className="w-full h-64 object-cover group-hover:scale-110 transition duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">{category}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Best Sellers</h2>
        {bestSellers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500">No best sellers available at the moment.</p>
            <Link to="/products" className="mt-4 inline-block text-gray-600 underline hover:text-gray-900">
              View all products
            </Link>
          </div>
        )}
      </section>

      {/* Sale Banner */}
      {saleProducts.length > 0 && (
        <section className="bg-red-600 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">SALE</h2>
            <p className="text-xl text-white mb-8">Up to 50% off on selected items</p>
            <Link
              to="/sale"
              className="inline-block bg-white text-red-600 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition"
            >
              Shop Sale
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

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

export default Home;