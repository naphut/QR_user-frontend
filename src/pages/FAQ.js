import React, { useState } from 'react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'How do I track my order?',
      answer: 'You can track your order by visiting the Track Order page and entering your order number. You\'ll receive a tracking number via email once your order ships.'
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for unworn, unwashed items with original tags attached. Sale items are final sale.'
    },
    {
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 3-5 business days. Express shipping takes 1-2 business days. International shipping may take 7-14 business days.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and KHQR payment.'
    },
    {
      question: 'How do I find my size?',
      answer: 'Please refer to our Size Guide page for detailed measurements and fit recommendations.'
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h1>
      
      <div className="bg-white rounded-lg shadow-md divide-y">
        {faqs.map((faq, index) => (
          <div key={index} className="p-6">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full text-left flex justify-between items-center"
            >
              <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
              <svg
                className={`w-5 h-5 transform transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openIndex === index && (
              <div className="mt-4 text-gray-600 leading-relaxed">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;