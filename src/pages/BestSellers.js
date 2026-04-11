import React, { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';

const BestSellers = () => {
  const { getBestSellers } = useProducts();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading and get products
    const loadProducts = () => {
      try {
        const bestSellers = getBestSellers();
        setProducts(bestSellers);
      } catch (error) {
        console.error('Error loading best sellers:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [getBestSellers]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Best Sellers</h1>
      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No best sellers available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BestSellers;