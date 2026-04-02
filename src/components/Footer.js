import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">ROUTINE</h3>
            <p className="text-gray-400">Your one-stop shop for quality clothing and accessories.</p>
            <div className="mt-4">
              <p className="text-gray-400">📍 Cambodia</p>
              <p className="text-gray-400">📞 (+855) 085 330 330</p>
              <p className="text-gray-400">✉️ support@routine.com</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/new-arrivals" className="hover:text-white">New Arrivals</Link></li>
              <li><Link to="/best-sellers" className="hover:text-white">Best Sellers</Link></li>
              <li><Link to="/sale" className="hover:text-white">Sale</Link></li>
              <li><Link to="/size-guide" className="hover:text-white">Size Guide</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/help" className="hover:text-white">Help Center</Link></li>
              <li><Link to="/returns" className="hover:text-white">Returns</Link></li>
              <li><Link to="/track-order" className="hover:text-white">Track Order</Link></li>
              <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/about" className="hover:text-white">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 ROUTINE. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;