// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:6969';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_URL}/api/auth/login`,
  SIGNUP: `${API_URL}/api/auth/signup`,
  
  // Products
  PRODUCTS: `${API_URL}/api/products`,
  PRODUCT_BY_ID: (id) => `${API_URL}/api/products/${id}`,
  
  // Cart
  CART: `${API_URL}/api/cart`,
  CART_ADD: `${API_URL}/api/cart/add`,
  CART_UPDATE: `${API_URL}/api/cart/update`,
  CART_REMOVE: (id) => `${API_URL}/api/cart/remove/${id}`,
  CART_CLEAR: `${API_URL}/api/cart/clear`,
  
  // Orders
  ORDERS: `${API_URL}/api/orders`,
  ORDER_BY_ID: (id) => `${API_URL}/api/orders/${id}`,
  ORDER_CANCEL: (id) => `${API_URL}/api/orders/${id}/cancel`,
  
  // Reviews
  REVIEWS: `${API_URL}/api/reviews`,
  REVIEWS_BY_PRODUCT: (id) => `${API_URL}/api/reviews/${id}`,
};

export default API_URL;
