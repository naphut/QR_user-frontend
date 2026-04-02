import React from 'react';

const Returns = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Returns Policy</h1>
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <p>We want you to be completely satisfied with your purchase. If you're not happy with your order, we offer a 30-day return policy.</p>
        <h2 className="text-xl font-semibold">Return Conditions</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Items must be unworn, unwashed, and in original condition with tags attached</li>
          <li>Returns must be initiated within 30 days of delivery</li>
          <li>Original shipping costs are non-refundable</li>
          <li>Sale items are final sale</li>
        </ul>
        <h2 className="text-xl font-semibold mt-4">How to Return</h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Contact our customer service team with your order number</li>
          <li>Pack the items securely in the original packaging</li>
          <li>Ship the package to our returns address</li>
          <li>Allow 5-7 business days for processing</li>
        </ol>
      </div>
    </div>
  );
};

export default Returns;