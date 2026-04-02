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
  const { addToWishlist, isInWishlist } = useWishlist();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 200 });
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);

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

  const handleAddToWishlist = (product) => {
    addToWishlist(product);
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {category ? `${category}` : 'All Products'}
      </h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-lg shadow p-6 sticky top-24">
            <h3 className="font-semibold text-lg mb-4">Filters</h3>
            
            {/* Price Range */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">Price Range</h4>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) || 0 })}
                  className="w-1/2 px-2 py-1 border rounded"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) || 200 })}
                  className="w-1/2 px-2 py-1 border rounded"
                />
              </div>
            </div>
            
            {/* Sizes */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">Size</h4>
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
                    className={`px-3 py-1 border rounded ${
                      selectedSizes.includes(size)
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Colors */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">Color</h4>
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
                    className={`px-3 py-1 border rounded ${
                      selectedColors.includes(color)
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Clear Filters */}
            <button
              onClick={() => {
                setPriceRange({ min: 0, max: 200 });
                setSelectedSizes([]);
                setSelectedColors([]);
                setSortBy('newest');
              }}
              className="w-full bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200"
            >
              Clear All Filters
            </button>
          </div>
        </div>
        
        {/* Products Grid */}
        <div className="lg:w-3/4">
          {/* Sort Bar */}
          <div className="bg-white rounded-lg shadow p-4 mb-6 flex justify-between items-center">
            <p className="text-gray-600">{filteredProducts.length} products found</p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded px-3 py-1"
            >
              <option value="newest">Newest</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => {
              const images = JSON.parse(product.images);
              const discount = product.original_price 
                ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
                : 0;
              
              return (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition group">
                  <div className="relative">
                    <Link to={`/product/${product.id}`}>
                      <img src={images[0]} alt={product.name} className="w-full h-64 object-cover" />
                    </Link>
                    <button
                      onClick={() => handleAddToWishlist(product)}
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
                        onClick={() => handleAddToCart(product)}
                        className="bg-gray-900 text-white px-3 py-1 rounded hover:bg-gray-800 text-sm"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;