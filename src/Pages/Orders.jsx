import React, { useState } from 'react';
import { AiOutlineArrowLeft, AiOutlineEye, AiOutlineCalendar, AiOutlineShoppingCart, AiOutlineCheck, AiOutlineClockCircle } from 'react-icons/ai';
import { Link } from 'react-router-dom';

const Orders = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Mock order data
  const orders = [
    {
      id: 'ORD-2025-001',
      date: '2025-08-20',
      status: 'delivered',
      total: 859.97,
      items: [
        {
          id: 1,
          title: "Premium Wireless Headphones",
          price: 299.99,
          quantity: 2,
          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop"
        },
        {
          id: 2,
          title: "Smart Fitness Watch",
          price: 199.99,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop"
        },
        {
          id: 5,
          title: "Gaming Mechanical Keyboard",
          price: 159.99,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=100&h=100&fit=crop"
        }
      ],
      shippingAddress: {
        name: "John Doe",
        address: "123 Main St, New York, NY 10001"
      },
      trackingNumber: "TRK123456789"
    },
    {
      id: 'ORD-2025-002',
      date: '2025-08-18',
      status: 'shipped',
      total: 449.99,
      items: [
        {
          id: 4,
          title: "Ergonomic Office Chair",
          price: 449.99,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100&h=100&fit=crop"
        }
      ],
      shippingAddress: {
        name: "John Doe",
        address: "123 Main St, New York, NY 10001"
      },
      trackingNumber: "TRK987654321"
    },
    {
      id: 'ORD-2025-003',
      date: '2025-08-15',
      status: 'processing',
      total: 79.99,
      items: [
        {
          id: 6,
          title: "Portable Bluetooth Speaker",
          price: 79.99,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=100&h=100&fit=crop"
        }
      ],
      shippingAddress: {
        name: "John Doe",
        address: "123 Main St, New York, NY 10001"
      },
      trackingNumber: null
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <AiOutlineCheck className="w-4 h-4" />;
      case 'shipped':
        return <AiOutlineShoppingCart className="w-4 h-4" />;
      case 'processing':
        return <AiOutlineClockCircle className="w-4 h-4" />;
      default:
        return <AiOutlineClockCircle className="w-4 h-4" />;
    }
  };

  const filteredOrders = selectedFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedFilter);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTotalItems = (items) => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <AiOutlineArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
          <p className="text-gray-600 mt-2">Track and manage your order history</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="flex flex-wrap border-b border-gray-200">
            {[
              { key: 'all', label: 'All Orders', count: orders.length },
              { key: 'processing', label: 'Processing', count: orders.filter(o => o.status === 'processing').length },
              { key: 'shipped', label: 'Shipped', count: orders.filter(o => o.status === 'shipped').length },
              { key: 'delivered', label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setSelectedFilter(filter.key)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  selectedFilter === filter.key
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <AiOutlineShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-4">No orders found</h2>
            <p className="text-gray-500 mb-8">
              {selectedFilter === 'all' 
                ? "You haven't placed any orders yet." 
                : `No ${selectedFilter} orders found.`}
            </p>
            <Link
              to="/"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Order Header */}
                <div className="p-6 border-b border-gray-200 bg-gray-50">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center space-x-6">
                      <div>
                        <p className="text-sm text-gray-600">Order ID</p>
                        <p className="font-semibold text-gray-800">{order.id}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600">Date Placed</p>
                        <p className="font-semibold text-gray-800 flex items-center">
                          <AiOutlineCalendar className="w-4 h-4 mr-1" />
                          {formatDate(order.date)}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="font-bold text-blue-600">${order.total.toFixed(2)}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1">{order.status}</span>
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <AiOutlineEye className="w-4 h-4 mr-2" />
                        View Details
                      </button>
                      
                      {order.trackingNumber && (
                        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          Track Package
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Items ({getTotalItems(order.items)} {getTotalItems(order.items) === 1 ? 'item' : 'items'})
                    </h3>
                    
                    {order.status === 'delivered' && (
                      <button className="text-blue-600 hover:text-blue-800 font-medium">
                        Buy Again
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">{item.title}</h4>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          <p className="text-sm font-semibold text-blue-600">${item.price}</p>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-semibold text-gray-800">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Shipping Info */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Shipping Address</h4>
                        <p className="text-gray-600">{order.shippingAddress.name}</p>
                        <p className="text-gray-600">{order.shippingAddress.address}</p>
                      </div>
                      
                      {order.trackingNumber && (
                        <div>
                          <h4 className="font-medium text-gray-800 mb-2">Tracking Information</h4>
                          <p className="text-gray-600">Tracking Number: {order.trackingNumber}</p>
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-1">
                            Track Package →
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        {filteredOrders.length > 0 && (
          <div className="text-center mt-12">
            <Link
              to="/"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
