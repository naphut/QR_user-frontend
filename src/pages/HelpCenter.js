import React from 'react';
import { Link } from 'react-router-dom';

const HelpCenter = () => {
  const helpTopics = [
    { title: 'Order Status', description: 'Track your order and check delivery status', link: '/track-order' },
    { title: 'Returns & Exchanges', description: 'Learn about our return policy', link: '/returns' },
    { title: 'Size Guide', description: 'Find your perfect fit', link: '/size-guide' },
    { title: 'Payment Methods', description: 'Learn about payment options', link: '/faq' },
    { title: 'Shipping Information', description: 'Delivery times and costs', link: '/faq' },
    { title: 'Contact Us', description: 'Get in touch with our support team', link: '/contact' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Help Center</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {helpTopics.map((topic, index) => (
          <Link key={index} to={topic.link} className="block">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{topic.title}</h3>
              <p className="text-gray-600">{topic.description}</p>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-12 bg-gray-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Still Need Help?</h2>
        <p className="text-gray-600 mb-6">Our customer support team is available 24/7</p>
        <Link
          to="/contact"
          className="inline-block bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-gray-800"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
};

export default HelpCenter;