import React from 'react';

const AboutUs = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">About ROUTINE</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
          <p className="text-gray-700 leading-relaxed">
            Founded in 2024, ROUTINE was born from a simple idea: create high-quality, stylish clothing 
            that fits seamlessly into everyday life. We believe that great style shouldn't be complicated 
            or expensive. Our mission is to provide comfortable, durable, and fashionable clothing for everyone.
          </p>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Quality First: We use premium materials and craftsmanship</li>
            <li>Sustainable Practices: Committed to eco-friendly production</li>
            <li>Customer Focus: Your satisfaction is our priority</li>
            <li>Innovation: Always evolving with modern trends</li>
          </ul>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Promise</h2>
          <p className="text-gray-700 leading-relaxed">
            Every piece of clothing we create is designed with attention to detail and built to last. 
            We stand behind our products and offer a 30-day satisfaction guarantee. Join the ROUTINE 
            family and experience fashion that works for you.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;