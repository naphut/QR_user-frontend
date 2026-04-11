// Fallback data for when backend is not available or has no products
export const fallbackProducts = [
  {
    id: 1,
    code: "TSHIRT001",
    name: "Classic T-Shirt",
    description: "Comfortable cotton t-shirt perfect for everyday wear",
    price: 19.99,
    original_price: 29.99,
    category: "T-Shirts",
    color: "Black",
    sizes: ["S", "M", "L", "XL"],
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400"],
    stock: 100,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    code: "JEANS001",
    name: "Slim Fit Jeans",
    description: "Modern slim fit denim jeans with stretch comfort",
    price: 49.99,
    original_price: 69.99,
    category: "Pants",
    color: "Blue",
    sizes: ["30", "32", "34", "36"],
    images: ["https://images.unsplash.com/photo-1542272604-787c3835535d?w=400"],
    stock: 50,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    code: "HOODIE001",
    name: "Cozy Hoodie",
    description: "Warm and comfortable hoodie for casual days",
    price: 35.99,
    original_price: 49.99,
    category: "Sweatshirts",
    color: "Gray",
    sizes: ["S", "M", "L", "XL"],
    images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400"],
    stock: 30,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    code: "DRESS001",
    name: "Summer Dress",
    description: "Elegant summer dress perfect for special occasions",
    price: 59.99,
    original_price: 89.99,
    category: "Dresses",
    color: "Pink",
    sizes: ["XS", "S", "M", "L"],
    images: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400"],
    stock: 25,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 5,
    code: "JACKET001",
    name: "Denim Jacket",
    description: "Classic denim jacket with modern fit",
    price: 45.99,
    original_price: 65.99,
    category: "Jackets",
    color: "Blue",
    sizes: ["S", "M", "L", "XL"],
    images: ["https://images.unsplash.com/photo-1548126093-3b3a4f5c6f3f?w=400"],
    stock: 40,
    is_active: true,
    created_at: new Date().toISOString()
  }
];

export const fallbackCategories = ["T-Shirts", "Pants", "Sweatshirts", "Dresses", "Jackets"];
