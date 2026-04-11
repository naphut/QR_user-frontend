import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useProducts } from '../context/ProductContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const { categories } = useProducts();
  const navigate = useNavigate();
  
  // State management
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  
  // Refs for dropdowns
  const shopDropdownRef = useRef(null);
  const userMenuRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shopDropdownRef.current && !shopDropdownRef.current.contains(event.target)) {
        setIsShopDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate('/');
  };

  // Default categories if none from context
  const displayCategories = categories.length > 0 ? categories : ['T-Shirts', 'Jackets', 'Pants', 'Sweatshirts'];

  return (
    <nav className={`bg-white sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-md backdrop-blur-sm bg-white/95' : 'shadow-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-2xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent hover:from-gray-700 hover:to-gray-500 transition-all"
          >
            ROUTINE
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-gray-900 font-medium transition-colors relative group">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 transition-all group-hover:w-full"></span>
            </Link>
            
            {/* Shop Dropdown */}
            <div className="relative" ref={shopDropdownRef}>
              <button
                onClick={() => setIsShopDropdownOpen(!isShopDropdownOpen)}
                onMouseEnter={() => setIsShopDropdownOpen(true)}
                className="text-gray-700 hover:text-gray-900 font-medium flex items-center transition-colors group"
              >
                Shop
                <svg 
                  className={`w-4 h-4 ml-1 transition-transform duration-200 ${isShopDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isShopDropdownOpen && (
                <div 
                  onMouseLeave={() => setIsShopDropdownOpen(false)}
                  className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-fadeInUp"
                >
                  <div className="py-2">
                    <Link 
                      to="/new-arrivals" 
                      className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsShopDropdownOpen(false)}
                    >
                      <span className="text-xl">✨</span>
                      <span className="font-medium">New Arrivals</span>
                    </Link>
                    <Link 
                      to="/best-sellers" 
                      className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsShopDropdownOpen(false)}
                    >
                      <span className="text-xl">🔥</span>
                      <span className="font-medium">Best Sellers</span>
                    </Link>
                    <Link 
                      to="/sale" 
                      className="flex items-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
                      onClick={() => setIsShopDropdownOpen(false)}
                    >
                      <span className="text-xl">🏷️</span>
                      <span className="font-medium">Sale</span>
                    </Link>
                    <div className="border-t my-1"></div>
                    <p className="px-4 py-1 text-xs text-gray-400 uppercase tracking-wider">Categories</p>
                    {displayCategories.map(cat => (
                      <Link 
                        key={cat} 
                        to={`/category/${cat}`} 
                        className="block px-4 py-2 text-gray-600 hover:bg-gray-50 transition-colors pl-8"
                        onClick={() => setIsShopDropdownOpen(false)}
                      >
                        {cat}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <Link to="/about" className="text-gray-700 hover:text-gray-900 font-medium transition-colors relative group">
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 transition-all group-hover:w-full"></span>
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-gray-900 font-medium transition-colors relative group">
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 transition-all group-hover:w-full"></span>
            </Link>
            <Link to="/help" className="text-gray-700 hover:text-gray-900 font-medium transition-colors relative group">
              Help
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 transition-all group-hover:w-full"></span>
            </Link>
          </div>

          {/* Icons and Actions */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-gray-600 hover:text-gray-900 transition-colors p-1.5 rounded-full hover:bg-gray-100"
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Wishlist */}
            <Link to="/wishlist" className="relative text-gray-600 hover:text-gray-900 transition-colors p-1.5 rounded-full hover:bg-gray-100">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse shadow-md">
                  {wishlist.length > 9 ? '9+' : wishlist.length}
                </span>
              )}
            </Link>
            
            {/* Cart */}
            <Link to="/cart" className="relative text-gray-600 hover:text-gray-900 transition-colors p-1.5 rounded-full hover:bg-gray-100">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse shadow-md">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>
            
            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 focus:outline-none hover:opacity-80 transition-opacity p-0.5 rounded-full hover:bg-gray-100"
                  aria-label="User menu"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-800 to-gray-700 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                    {user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
                  </div>
                  <svg className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-fadeInUp">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                      <p className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <Link 
                        to="/profile" 
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        My Profile
                      </Link>
                      <Link 
                        to="/orders" 
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        My Orders
                      </Link>
                      <Link 
                        to="/wishlist" 
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        Wishlist
                        {wishlist.length > 0 && (
                          <span className="ml-auto text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                            {wishlist.length}
                          </span>
                        )}
                      </Link>
                      <Link 
                        to="/track-order" 
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Track Order
                      </Link>
                    </div>
                    <div className="border-t border-gray-100">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/login" 
                className="text-gray-600 hover:text-gray-900 transition-colors flex items-center space-x-1.5 px-3 py-1.5 rounded-full hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Login</span>
              </Link>
            )}
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-600 hover:text-gray-900 transition-colors p-1.5 rounded-full hover:bg-gray-100"
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {/* Search Bar */}
        {isSearchOpen && (
          <div className="py-4 border-t border-gray-100 animate-fadeInUp">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products by name, category, or color..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent bg-gray-50"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>
        )}
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-fadeInUp max-h-[calc(100vh-64px)] overflow-y-auto">
            <div className="space-y-1">
              <Link to="/" className="flex items-center gap-3 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
                <span>🏠</span>
                Home
              </Link>
              <Link to="/new-arrivals" className="flex items-center gap-3 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
                <span>✨</span>
                New Arrivals
              </Link>
              <Link to="/best-sellers" className="flex items-center gap-3 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
                <span>🔥</span>
                Best Sellers
              </Link>
              <Link to="/sale" className="flex items-center gap-3 py-3 text-red-600 hover:bg-red-50 px-3 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
                <span>🏷️</span>
                Sale
              </Link>
              
              <div className="mt-2 pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-400 uppercase tracking-wider px-3 mb-2">Categories</p>
                <div className="pl-4 space-y-1">
                  {displayCategories.map(cat => (
                    <Link 
                      key={cat} 
                      to={`/category/${cat}`} 
                      className="block py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>
              
              <div className="mt-2 pt-2 border-t border-gray-100">
                <Link to="/about" className="flex items-center gap-3 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
                  <span>📖</span>
                  About
                </Link>
                <Link to="/contact" className="flex items-center gap-3 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
                  <span>📧</span>
                  Contact
                </Link>
                <Link to="/help" className="flex items-center gap-3 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
                  <span>❓</span>
                  Help
                </Link>
                <Link to="/size-guide" className="flex items-center gap-3 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
                  <span>📏</span>
                  Size Guide
                </Link>
                <Link to="/returns" className="flex items-center gap-3 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
                  <span>🔄</span>
                  Returns
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.2s ease-out;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;