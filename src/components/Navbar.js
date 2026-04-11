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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  
  const shopDropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

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
    const handleClickOutside = (event: MouseEvent) => {
      if (shopDropdownRef.current && !shopDropdownRef.current.contains(event.target as Node)) {
        setIsShopDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
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
          <Link to="/" className="text-2xl font-bold tracking-tight text-gray-900 hover:text-gray-600 transition-colors">
            ROUTINE
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">Home</Link>
            
            {/* Shop Dropdown */}
            <div className="relative" ref={shopDropdownRef}>
              <button
                onClick={() => setIsShopDropdownOpen(!isShopDropdownOpen)}
                className="text-gray-700 hover:text-gray-900 font-medium flex items-center transition-colors focus:outline-none"
              >
                Shop
                <svg className={`w-4 h-4 ml-1 transition-transform duration-200 ${isShopDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isShopDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20 animate-fadeInUp">
                  <Link to="/new-arrivals" className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors group">
                    <span className="text-xl mr-3">✨</span>
                    <span className="font-medium">New Arrivals</span>
                  </Link>
                  <Link to="/best-sellers" className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors group">
                    <span className="text-xl mr-3">🔥</span>
                    <span className="font-medium">Best Sellers</span>
                  </Link>
                  <Link to="/sale" className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors group">
                    <span className="text-xl mr-3">🏷️</span>
                    <span className="font-medium text-red-600">Sale</span>
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <div className="px-3 py-2">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Categories</p>
                    {displayCategories.map(cat => (
                      <Link 
                        key={cat} 
                        to={`/category/${cat}`} 
                        className="block px-2 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        {cat}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <Link to="/about" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">About</Link>
            <Link to="/contact" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">Contact</Link>
            <Link to="/help" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">Help</Link>
          </div>

          {/* Icons and Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-gray-600 hover:text-gray-900 p-1 transition-colors"
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Wishlist */}
            <Link to="/wishlist" className="relative text-gray-600 hover:text-gray-900 p-1 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-xs rounded-full h-4.5 w-4.5 flex items-center justify-center shadow-sm">
                  {wishlist.length}
                </span>
              )}
            </Link>
            
            {/* Cart */}
            <Link to="/cart" className="relative text-gray-600 hover:text-gray-900 p-1 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-xs rounded-full h-4.5 w-4.5 flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-1.5 focus:outline-none hover:opacity-80 transition-opacity"
                  aria-label="User menu"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-800 to-gray-700 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                    {user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
                  </div>
                  <svg className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-20 animate-fadeInUp">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{user?.email}</p>
                    </div>
                    <Link 
                      to="/profile" 
                      className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      My Profile
                    </Link>
                    <Link 
                      to="/orders" 
                      className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      My Orders
                    </Link>
                    <Link 
                      to="/wishlist" 
                      className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      Wishlist
                      {wishlist.length > 0 && (
                        <span className="ml-auto text-xs bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full">
                          {wishlist.length}
                        </span>
                      )}
                    </Link>
                    <Link 
                      to="/track-order" 
                      className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Track Order
                    </Link>
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                className="text-gray-600 hover:text-gray-900 transition-colors flex items-center space-x-1.5 px-2 py-1 rounded-lg hover:bg-gray-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span className="font-medium">Login</span>
              </Link>
            )}
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-600 hover:text-gray-900 p-1 transition-colors"
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
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
                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700"
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
          <div className="md:hidden py-4 border-t border-gray-100 animate-fadeInUp">
            <div className="space-y-1">
              <Link to="/" className="flex items-center py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="/new-arrivals" className="flex items-center py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
                <span className="text-xl mr-3">✨</span> New Arrivals
              </Link>
              <Link to="/best-sellers" className="flex items-center py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
                <span className="text-xl mr-3">🔥</span> Best Sellers
              </Link>
              <Link to="/sale" className="flex items-center py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
                <span className="text-xl mr-3">🏷️</span> <span className="text-red-600 font-medium">Sale</span>
              </Link>
              <div className="pl-6 border-l-2 border-gray-100 ml-3 my-2">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Categories</p>
                {displayCategories.map(cat => (
                  <Link 
                    key={cat} 
                    to={`/category/${cat}`} 
                    className="block py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-2 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {cat}
                  </Link>
                ))}
              </div>
              <Link to="/about" className="flex items-center py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>About</Link>
              <Link to="/contact" className="flex items-center py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>Contact</Link>
              <Link to="/help" className="flex items-center py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>Help</Link>
              <Link to="/size-guide" className="flex items-center py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>Size Guide</Link>
              <Link to="/returns" className="flex items-center py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>Returns</Link>
            </div>
          </div>
        )}
      </div>

      {/* Add CSS animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.2s ease-out;
        }
        .h-4\.5 {
          height: 1.125rem;
        }
        .w-4\.5 {
          width: 1.125rem;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;