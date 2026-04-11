import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import toast from 'react-hot-toast';

const Products = () => {
  const { category } = useParams();
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 200 });
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
  const colors = ['Black', 'White', 'Blue', 'Green', 'Red', 'Gray', 'Khaki'];

  useEffect(() => {
    let filtered = [...products];
    
    // Filter by category
    if (category) {
      filtered = filtered.filter(p => p.category === category);
    }
    
    // Filter by price range
    filtered = filtered.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);
    
    // Filter by sizes
    if (selectedSizes.length > 0) {
      filtered = filtered.filter(p => {
        const productSizes = JSON.parse(p.sizes);
        return selectedSizes.some(size => productSizes.includes(size));
      });
    }
    
    // Filter by colors
    if (selectedColors.length > 0) {
      filtered = filtered.filter(p => selectedColors.includes(p.color));
    }
    
    // Sort
    switch(sortBy) {
      case 'price_low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      default:
        break;
    }
    
    setFilteredProducts(filtered);
  }, [products, category, sortBy, priceRange, selectedSizes, selectedColors]);

  const handleAddToCart = (product) => {
    addToCart(product, 1, 'M');
    toast.success(`Added ${product.name} to cart`);
  };

  const handleWishlistToggle = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.success(`Removed ${product.name} from wishlist`);
    } else {
      addToWishlist(product);
      toast.success(`Added ${product.name} to wishlist`);
    }
  };

  const clearAllFilters = () => {
    setPriceRange({ min: 0, max: 200 });
    setSelectedSizes([]);
    setSelectedColors([]);
    setSortBy('newest');
  };

  const hasActiveFilters = priceRange.min > 0 || priceRange.max < 200 || selectedSizes.length > 0 || selectedColors.length > 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {category ? `${category}` : 'All Products'}
        </h1>
        <p className="text-gray-500 mt-1">Discover our collection of premium fashion</p>
      </div>
      
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="w-full bg-gray-100 text-gray-800 py-2 rounded-lg flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Filters {hasActiveFilters && `(${selectedSizes.length + selectedColors.length + (priceRange.min > 0 || priceRange.max < 200 ? 1 : 0)})`}
        </button>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className={`lg:w-1/4 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-lg">Filters</h3>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-red-500 hover:text-red-600"
                >
                  Clear all
                </button>
              )}
            </div>
            
            {/* Price Range */}
            <div className="mb-6 pb-6 border-b border-gray-100">
              <h4 className="font-medium mb-3 text-gray-800">Price Range</h4>
              <div className="flex gap-3">
                <div>
                  <label className="text-xs text-gray-500">Min</label>
                  <input
                    type="number"
                    placeholder="$0"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Max</label>
                  <input
                    type="number"
                    placeholder="$200"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) || 200 })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
              </div>
            </div>
            
            {/* Sizes */}
            <div className="mb-6 pb-6 border-b border-gray-100">
              <h4 className="font-medium mb-3 text-gray-800">Size</h4>
              <div className="flex flex-wrap gap-2">
                {sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => {
                      if (selectedSizes.includes(size)) {
                        setSelectedSizes(selectedSizes.filter(s => s !== size));
                      } else {
                        setSelectedSizes([...selectedSizes, size]);
                      }
                    }}
                    className={`w-10 h-10 rounded-full text-sm font-medium transition ${
                      selectedSizes.includes(size)
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Colors */}
            <div className="mb-6">
              <h4 className="font-medium mb-3 text-gray-800">Color</h4>
              <div className="flex flex-wrap gap-2">
                {colors.map(color => (
                  <button
                    key={color}
                    onClick={() => {
                      if (selectedColors.includes(color)) {
                        setSelectedColors(selectedColors.filter(c => c !== color));
                      } else {
                        setSelectedColors([...selectedColors, color]);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm transition ${
                      selectedColors.includes(color)
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Products Grid */}
        <div className="lg:w-3/4">
          {/* Sort Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-gray-600 text-sm">
              Showing <span className="font-semibold text-gray-900">{filteredProducts.length}</span> products
            </p>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                <option value="newest">Newest</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
            </div>
          </div>
          
          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => {
              const images = JSON.parse(product.images);
              const discount = product.original_price 
                ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
                : 0;
              const isWishlisted = isInWishlist(product.id);
              
              return (
                <div key={product.id} className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="relative overflow-hidden bg-gray-50">
                    <Link to={`/product/${product.id}`}>
                      <img 
                        src={images[0]} 
                        alt={product.name} 
                        className="w-full h-72 object-cover group-hover:scale-105 transition duration-500"
                      />
                    </Link>
                    
                    {/* Wishlist Button */}
                    <button
                      onClick={() => handleWishlistToggle(product)}
                      className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition transform hover:scale-110"
                    >
                      <svg 
                        className={`w-5 h-5 transition ${isWishlisted ? 'text-red-500 fill-current' : 'text-gray-400'}`} 
                        fill={isWishlisted ? 'currentColor' : 'none'} 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                    
                    {/* Discount Badge */}
                    {discount > 0 && (
                      <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                        -{discount}%
                      </span>
                    )}
                    
                    {/* Quick Add Button (appears on hover) */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 text-white py-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 text-sm font-medium"
                    >
                      Add to Cart
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-semibold text-gray-800 hover:text-gray-600 line-clamp-1">{product.name}</h3>
                    </Link>
                    <p className="text-sm text-gray-400 mt-1">{product.color}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-gray-900">${product.price}</span>
                        {product.original_price && (
                          <span className="text-sm text-gray-400 line-through ml-2">${product.original_price}</span>
                        )}
                      </div>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="text-gray-400 hover:text-gray-900 transition"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
              <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-gray-500">No products found matching your criteria.</p>
              <button
                onClick={clearAllFilters}
                className="mt-4 text-gray-600 underline hover:text-gray-900"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;