import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) {
      toast.error('Please enter an order ID');
      return;
    }
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      navigate(`/track-order/${orderId}`);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">Track Your Order</h1>
        <p className="text-gray-600 text-center mb-8">
          Enter your order number to check the status of your delivery
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order Number
            </label>
            <input
              type="text"
              placeholder="e.g., ORD_1234567890"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-3 rounded-md hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? 'Tracking...' : 'Track Order'}
          </button>
        </form>
        
        <p className="text-sm text-gray-500 text-center mt-6">
          Haven't placed an order yet?{' '}
          <a href="/" className="text-gray-900 hover:underline">
            Start shopping
          </a>
        </p>
      </div>
    </div>
  );
};

export default TrackOrder;