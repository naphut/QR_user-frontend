import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.slice(0, 4).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.slice(0, 4).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
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

// Product Card Component
const ProductCard = ({ product }) => {
  const images = JSON.parse(product.images);
  const discount = product.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <Link to={`/product/${product.id}`}>
        <img src={images[0]} alt={product.name} className="w-full h-64 object-cover" />
      </Link>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800">{product.name}</h3>
        <p className="text-sm text-gray-500 mt-1">{product.color}</p>
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