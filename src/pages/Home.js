import React from 'react';
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
      <div className="relative bg-gray-900 h-80 sm:h-96">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200"
            alt="Hero"
            className="w-full h-full object-cover opacity-50"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4">ROUTINE</h1>
            <p className="text-base sm:text-xl md:text-2xl mb-6 sm:mb-8">Discover the latest trends in fashion</p>
            <Link
              to="/products"
              className="inline-block bg-white text-gray-900 px-6 sm:px-8 py-2 sm:py-3 rounded-md font-semibold hover:bg-gray-100 transition text-sm sm:text-base"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">New Arrivals</h2>
        {/* 3 columns on phones (grid-cols-3), 2 on tablets, 4 on desktop */}
        <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
          {newArrivals.slice(0, 4).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Categories Banner */}
      <section className="bg-gray-100 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {[
              { name: 'T-Shirts', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop' },
              { name: 'Jackets', image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop' },
              { name: 'Pants', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop' },
              { name: 'Sweatshirts', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=300&fit=crop' }
            ].map(category => (
              <Link
                key={category.name}
                to={`/category/${category.name}`}
                className="relative group overflow-hidden rounded-lg"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-32 sm:h-48 md:h-64 object-cover group-hover:scale-110 transition duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <span className="text-white text-base sm:text-xl font-bold">{category.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Best Sellers</h2>
        <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
          {bestSellers.slice(0, 4).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Sale Banner */}
      {saleProducts.length > 0 && (
        <section className="bg-red-600 py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">SALE</h2>
            <p className="text-base sm:text-xl text-white mb-6 sm:mb-8">Up to 50% off on selected items</p>
            <Link
              to="/sale"
              className="inline-block bg-white text-red-600 px-6 sm:px-8 py-2 sm:py-3 rounded-md font-semibold hover:bg-gray-100 transition text-sm sm:text-base"
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
        className="absolute top-1 sm:top-2 right-1 sm:right-2 z-10 bg-white rounded-full p-1.5 sm:p-2 shadow-md hover:bg-gray-100 transition-colors"
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-3.5 w-3.5 sm:h-5 sm:w-5 transition-colors ${
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
        <img 
          src={images[0]} 
          alt={product.name} 
          className="w-full h-40 sm:h-56 md:h-64 object-cover" 
        />
      </Link>
      <div className="p-2 sm:p-3 md:p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-gray-800 line-clamp-1 text-xs sm:text-sm md:text-base">
              {product.name}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5 sm:mt-1">{product.color}</p>
          </div>
        </div>
        <div className="mt-1 sm:mt-2">
          <span className="text-sm sm:text-lg md:text-xl font-bold text-gray-900">${product.price}</span>
          {product.original_price && (
            <span className="text-xs text-gray-500 line-through ml-1 sm:ml-2">${product.original_price}</span>
          )}
          {discount > 0 && (
            <span className="ml-1 sm:ml-2 bg-red-500 text-white text-[10px] sm:text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded">
              -{discount}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;