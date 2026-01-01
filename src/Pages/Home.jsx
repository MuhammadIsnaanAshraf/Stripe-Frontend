import React, { useState } from 'react';
import { AiOutlineSearch, AiOutlineShoppingCart, AiOutlineUser, AiOutlineBell, AiOutlineHeart, AiOutlineStar, AiOutlinePlus, AiOutlineDown } from 'react-icons/ai';
import { BiFilter } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { SubscriptionModal } from '../modals';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../store/slices/authSlice';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const {user} = useSelector((state) => state.auth);
  console.log("🚀 ~ Home ~ user:", user)
  const dispatch = useDispatch();
  // Mock user data - in real app, this would come from Redux auth state
  const currentUser = {
    name: "John Doe",
    email: "john@example.com",
    role: "admin", // Change to "user" to hide admin options
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
  };
  
  // Mock product data
  const products = [
    {
      id: 1,
      title: "Premium Wireless Headphones",
      description: "High-quality wireless headphones with noise cancellation and premium sound quality.",
      price: 299.99,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
      rating: 4.8,
      reviews: 324
    },
    {
      id: 2,
      title: "Smart Fitness Watch",
      description: "Advanced fitness tracking with heart rate monitor, GPS, and 7-day battery life.",
      price: 199.99,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
      rating: 4.6,
      reviews: 198
    },
    {
      id: 3,
      title: "Professional Camera Lens",
      description: "85mm f/1.4 prime lens perfect for portrait photography with beautiful bokeh.",
      price: 899.99,
      image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop",
      rating: 4.9,
      reviews: 89
    },
    {
      id: 4,
      title: "Ergonomic Office Chair",
      description: "Premium ergonomic office chair with lumbar support and adjustable height.",
      price: 449.99,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      rating: 4.7,
      reviews: 156
    },
    {
      id: 5,
      title: "Gaming Mechanical Keyboard",
      description: "RGB backlit mechanical keyboard with custom switches and programmable keys.",
      price: 159.99,
      image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop",
      rating: 4.5,
      reviews: 267
    },
    {
      id: 6,
      title: "Portable Bluetooth Speaker",
      description: "Waterproof portable speaker with 360-degree sound and 12-hour battery life.",
      price: 79.99,
      image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop",
      rating: 4.4,
      reviews: 445
    }
  ];

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const getTotalCartItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-blue-600">StripeShop</h1>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Right side icons */}
            <div className="flex items-center space-x-4">
              {/* Admin Options - Only show if user is admin */}
              {user?.role === 'admin' && (
                <div className="relative">
                  <button
                    onClick={() => setShowAdminDropdown(!showAdminDropdown)}
                    className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-blue-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <AiOutlinePlus className="w-4 h-4" />
                    <span className="text-sm font-medium">Admin</span>
                    <AiOutlineDown className="w-4 h-4" />
                  </button>
                  
                  {showAdminDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <div className="py-1">
                        <Link
                          to="/add-product"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setShowAdminDropdown(false)}
                        >
                          <AiOutlinePlus className="w-4 h-4 mr-2" />
                          Add Product
                        </Link>
                        <Link
                          to="/manage-products"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setShowAdminDropdown(false)}
                        >
                          <AiOutlineShoppingCart className="w-4 h-4 mr-2" />
                          Manage Products
                        </Link>
                        <Link
                          to="/orders-admin"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setShowAdminDropdown(false)}
                        >
                          <AiOutlineShoppingCart className="w-4 h-4 mr-2" />
                          Manage Orders
                        </Link>
                        <Link
                          to="/analytics"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setShowAdminDropdown(false)}
                        >
                          <AiOutlineStar className="w-4 h-4 mr-2" />
                          Analytics
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                <AiOutlineBell className="w-6 h-6" />
              </button>
              
              <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                <AiOutlineHeart className="w-6 h-6" />
              </button>
              
              <Link to="/my-cart" className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
                <AiOutlineShoppingCart className="w-6 h-6" />
                {getTotalCartItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getTotalCartItems()}
                  </span>
                )}
              </Link>
              
              {/* User Profile Dropdown */}
              <div className="relative">
                <button className="flex items-center space-x-2 p-2 text-gray-600 hover:text-blue-600 transition-colors">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <AiOutlineUser className="w-6 h-6" />
                  )}
                  <span className="text-sm font-medium hidden md:block">
                    {user?.name || 'User'}
                  </span>
                </button>
              </div>
              
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => dispatch(logoutUser())}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Premium Products Await
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Subscribe to unlock exclusive access to our premium product catalog
          </p>
          <button 
            onClick={() => setShowSubscriptionModal(true)}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            View Subscription Plans
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Featured Products ({filteredProducts?.length})
          </h2>
          <button className="flex items-center space-x-2 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            <BiFilter className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 ${(user?.subscription?.subscriptionStatus !== 'active' && user?.subscription?.subscriptionStatus !== 'trialing') && 'cursor-not-allowed opacity-20'}`} >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {/* Product Image */}
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-64 object-cover"
                />
                <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
                  <AiOutlineHeart className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {product.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {product.description}
                </p>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <AiOutlineStar
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>

                {/* Price and Add to Cart */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-blue-600">
                      ${product.price}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <AiOutlineShoppingCart className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No products found */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-2xl font-semibold text-gray-600 mb-4">
              No products found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search terms or browse our featured categories
            </p>
          </div>
        )}
      </div>

      {/* Newsletter Signup */}
      <div className="bg-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-xl mb-8 opacity-90">
            Get notified about new products and exclusive offers
          </p>
          <div className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-l-lg text-gray-800"
            />
            <button className="bg-blue-600 px-6 py-3 rounded-r-lg hover:bg-blue-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
      />
    </div>
  );
};

export default Home;
