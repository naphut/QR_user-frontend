import React from 'react';
import { useParams } from 'react-router-dom';
import Products from './Products';

const CategoryPage = () => {
  const { category } = useParams();
  return <Products />;
};

export default CategoryPage;