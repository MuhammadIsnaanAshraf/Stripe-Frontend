import axios from 'axios';

// Base API configuration
const API_BASE_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:3000/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const tokens = localStorage.getItem('tokens');
    const accessToken = tokens ? JSON.parse(tokens)?.access : null;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken?.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('tokens');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API calls
export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // Get current user profile
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (accessToken, newPassword) => {
    const response = await api.post('/auth/reset-password', { accessToken, newPassword });
    return response.data;
  },
};

// Products API calls
export const productAPI = {
  // Get all products
  getProducts: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  // Get product by ID
  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Search products
  searchProducts: async (query) => {
    const response = await api.get('/products/search', { params: { q: query } });
    return response.data;
  },

  // Get product categories
  getCategories: async () => {
    const response = await api.get('/products/categories');
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (category) => {
    const response = await api.get(`/products/category/${category}`);
    return response.data;
  },

  // Admin: Add new product
  addProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  // Admin: Update product
  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  // Admin: Delete product
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Admin: Bulk update products
  bulkUpdateProducts: async (products) => {
    const response = await api.patch('/products/bulk', { products });
    return response.data;
  },

  // Admin: Get product analytics
  getProductAnalytics: async (id) => {
    const response = await api.get(`/products/${id}/analytics`);
    return response.data;
  },

  // Admin: Update product inventory
  updateInventory: async (id, inventory) => {
    const response = await api.patch(`/products/${id}/inventory`, { inventory });
    return response.data;
  },
};

// Cart API calls
export const cartAPI = {
  // Get user's cart
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data;
  },

  // Add item to cart
  addToCart: async (productId, quantity = 1) => {
    const response = await api.post('/cart/add', { productId, quantity });
    return response.data;
  },

  // Update cart item quantity
  updateCartItem: async (itemId, quantity) => {
    const response = await api.put(`/cart/items/${itemId}`, { quantity });
    return response.data;
  },

  // Remove item from cart
  removeFromCart: async (itemId) => {
    const response = await api.delete(`/cart/items/${itemId}`);
    return response.data;
  },

  // Clear entire cart
  clearCart: async () => {
    const response = await api.delete('/cart');
    return response.data;
  },

  // Apply promo code
  applyPromoCode: async (code) => {
    const response = await api.post('/cart/promo', { code });
    return response.data;
  },
};

// Orders API calls
export const orderAPI = {
  // Create new order
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Get user's orders
  getOrders: async (params = {}) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  // Get order by ID
  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Update order status (admin)
  updateOrderStatus: async (id, status) => {
    const response = await api.put(`/orders/${id}/status`, { status });
    return response.data;
  },

  // Cancel order
  cancelOrder: async (id) => {
    const response = await api.put(`/orders/${id}/cancel`);
    return response.data;
  },

  // Get order tracking info
  getOrderTracking: async (id) => {
    const response = await api.get(`/orders/${id}/tracking`);
    return response.data;
  },
};

// Subscription API calls
export const subscriptionAPI = {
  // Get subscription plans
  getPlans: async () => {
    const response = await api.get('/subscriptions/plans');
    return response.data;
  },

  // Get user's current subscription
  getCurrentSubscription: async () => {
    const response = await api.get('/subscriptions/current');
    return response.data;
  },

  // Create new subscription
  createSubscription: async (planId, paymentMethodId) => {
    const response = await api.post('/subscriptions', { planId, paymentMethodId });
    return response.data;
  },

  // Update subscription
  updateSubscription: async (subscriptionId, planId) => {
    const response = await api.put(`/subscriptions/${subscriptionId}`, { planId });
    return response.data;
  },

  // Cancel subscription
  cancelSubscription: async (subscriptionId) => {
    const response = await api.delete(`/subscriptions/${subscriptionId}`);
    return response.data;
  },

  // Resume subscription
  resumeSubscription: async (subscriptionId) => {
    const response = await api.put(`/subscriptions/${subscriptionId}/resume`);
    return response.data;
  },

  // Get subscription history
  getSubscriptionHistory: async () => {
    const response = await api.get('/subscriptions/history');
    return response.data;
  },
};

// Payment API calls
export const paymentAPI = {
  // Create payment intent for Stripe
  createPaymentIntent: async (amount, currency = 'usd') => {
    const response = await api.post('/payments/create-intent', { amount, currency });
    return response.data;
  },

  // Confirm payment
  confirmPayment: async (paymentIntentId) => {
    const response = await api.post('/payments/confirm', { paymentIntentId });
    return response.data;
  },

  // Get payment methods
  getPaymentMethods: async () => {
    const response = await api.get('/payments/methods');
    return response.data;
  },

  // Add payment method
  addPaymentMethod: async (paymentMethodId) => {
    const response = await api.post('/payments/methods', { paymentMethodId });
    return response.data;
  },

  // Delete payment method
  deletePaymentMethod: async (paymentMethodId) => {
    const response = await api.delete(`/payments/methods/${paymentMethodId}`);
    return response.data;
  },

  // Get payment history
  getPaymentHistory: async () => {
    const response = await api.get('/payments/history');
    return response.data;
  },
};

// Stripe Checkout API calls
export const checkoutAPI = {
  // Create checkout session
  createCheckoutSession: async (items, mode = 'payment') => {
    const response = await api.post('/checkout/create-session', { items, mode });
    return response.data;
  },

  // Create subscription checkout session
  createSubscriptionCheckout: async (plan, useTrial) => {
    console.log("🚀 ~ useTrial:", useTrial)
    const response = await api.post('/subscription/checkout-embedded', { plan, useTrial });
    console.log("🚀 ~ response: for checkout", response)
    return response;
  },

  // Handle checkout success
  handleCheckoutSuccess: async (sessionId) => {
    const response = await api.post('/checkout/success', { sessionId });
    return response.data;
  },
};

// Webhook API calls (for admin/internal use)
export const webhookAPI = {
  // Handle Stripe webhooks
  handleStripeWebhook: async (eventData) => {
    const response = await api.post('/webhooks/stripe', eventData);
    return response.data;
  },
};

// Default export with all APIs
export default {
  auth: authAPI,
  products: productAPI,
  cart: cartAPI,
  orders: orderAPI,
  subscriptions: subscriptionAPI,
  payments: paymentAPI,
  checkout: checkoutAPI,
  webhooks: webhookAPI,
};
