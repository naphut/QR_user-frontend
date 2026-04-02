import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const Cart = () => {
  const { cart, cartTotal, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-white rounded-lg shadow-md p-8">
          <svg className="w-24 h-24 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mt-4">Your cart is empty</h2>
          <p className="text-gray-600 mt-2">Looks like you haven't added any items yet.</p>
          <Link to="/" className="inline-block mt-6 bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {cart.map((item) => (
            <div key={`${item.id}-${item.size}`} className="bg-white rounded-lg shadow-md p-4 mb-4">
              <div className="flex items-center space-x-4">
                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md" />
                <div className="flex-1">
                  <Link to={`/product/${item.id}`}>
                    <h3 className="text-lg font-semibold text-gray-800 hover:text-gray-600">{item.name}</h3>
                  </Link>
                  <p className="text-sm text-gray-500">Color: {item.color} | Size: {item.size}</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">${item.price}</p>
                  
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                        className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                        className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id, item.size)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
          
          <button
            onClick={clearCart}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            Clear Cart
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 h-fit">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span className="text-xl">${cartTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-gray-900 text-white py-3 rounded-md mt-6 hover:bg-gray-800 transition"
          >
            Proceed to Checkout
          </button>
          <Link to="/" className="block text-center text-gray-600 hover:text-gray-800 mt-4">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;