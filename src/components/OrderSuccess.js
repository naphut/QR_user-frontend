import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const transactionId = searchParams.get('transaction_id');
  
  useEffect(() => {
    if (transactionId) {
      verifyOrder();
    }
  }, [transactionId]);
  
  const verifyOrder = async () => {
    try {
      // Verify payment status
      const response = await axios.get(`${API_URL}/orders/payment/verify/${transactionId}`);
      
      if (response.data.status === 'paid') {
        setOrder(response.data.order);
        toast.success('Payment successful!');
      } else {
        toast.error('Payment verification pending');
      }
    } catch (error) {
      console.error('Error verifying order:', error);
      toast.error('Failed to verify payment status');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Verifying your payment...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Order Successful!
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Thank you for your purchase. Your order has been confirmed.
        </p>
        
        {order && (
          <div className="max-w-md mx-auto bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            <p className="text-gray-600">Order ID: {order.transaction_id}</p>
            <p className="text-gray-600">Total Amount: ${order.total_amount}</p>
            <p className="text-gray-600">Status: {order.status}</p>
            <p className="text-gray-600">Payment Status: {order.payment_status}</p>
          </div>
        )}
        
        <div className="space-x-4">
          <button
            onClick={() => navigate('/')}
            className="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800 transition"
          >
            Continue Shopping
          </button>
          
          <button
            onClick={() => navigate('/orders')}
            className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-50 transition"
          >
            View Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;