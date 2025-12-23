import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderAPI } from '../../services/apiRequests';

// Initial state
const initialState = {
  orders: [],
  currentOrder: null,
  orderTracking: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  filters: {
    status: 'all',
    dateRange: null,
  },
  loading: false,
  error: null,
  orderCreationLoading: false,
};

// Async thunks for API calls

// Create order
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await orderAPI.createOrder(orderData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create order');
    }
  }
);

// Fetch orders
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await orderAPI.getOrders(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

// Fetch order by ID
export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await orderAPI.getOrderById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order');
    }
  }
);

// Update order status
export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await orderAPI.updateOrderStatus(id, status);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update order status');
    }
  }
);

// Cancel order
export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (id, { rejectWithValue }) => {
    try {
      const response = await orderAPI.cancelOrder(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel order');
    }
  }
);

// Get order tracking
export const fetchOrderTracking = createAsyncThunk(
  'orders/fetchOrderTracking',
  async (id, { rejectWithValue }) => {
    try {
      const response = await orderAPI.getOrderTracking(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order tracking');
    }
  }
);

// Order slice
const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Clear current order
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    
    // Clear order tracking
    clearOrderTracking: (state) => {
      state.orderTracking = null;
    },
    
    // Update filters
    updateOrderFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    // Reset filters
    resetOrderFilters: (state) => {
      state.filters = {
        status: 'all',
        dateRange: null,
      };
    },
    
    // Update pagination
    updateOrderPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    
    // Update order status locally
    updateOrderStatusLocal: (state, action) => {
      const { orderId, status } = action.payload;
      const order = state.orders.find(order => order.id === orderId);
      if (order) {
        order.status = status;
        order.updatedAt = new Date().toISOString();
      }
      
      // Update current order if it matches
      if (state.currentOrder && state.currentOrder.id === orderId) {
        state.currentOrder.status = status;
        state.currentOrder.updatedAt = new Date().toISOString();
      }
    },
    
    // Filter orders locally
    filterOrdersLocal: (state, action) => {
      const { status, dateRange } = action.payload;
      
      let filteredOrders = [...state.orders];
      
      // Filter by status
      if (status && status !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.status === status);
      }
      
      // Filter by date range
      if (dateRange) {
        const { startDate, endDate } = dateRange;
        filteredOrders = filteredOrders.filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= new Date(startDate) && orderDate <= new Date(endDate);
        });
      }
      
      state.filteredOrders = filteredOrders;
      state.filters = { ...state.filters, status, dateRange };
    },
    
    // Sort orders locally
    sortOrdersLocal: (state, action) => {
      const { sortBy, sortOrder } = action.payload;
      
      state.orders.sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];
        
        // Handle date sorting
        if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }
        
        // Handle string sorting
        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        
        if (sortOrder === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.orderCreationLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderCreationLoading = false;
        state.currentOrder = action.payload.order || action.payload;
        // Add new order to the beginning of orders array
        state.orders.unshift(state.currentOrder);
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderCreationLoading = false;
        state.error = action.payload;
      })
      
      // Fetch orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders || action.payload;
        state.pagination = {
          ...state.pagination,
          ...action.payload.pagination,
        };
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch order by ID
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload.order || action.payload;
        state.error = null;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update order status
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedOrder = action.payload.order || action.payload;
        
        // Update order in orders array
        const index = state.orders.findIndex(order => order.id === updatedOrder.id);
        if (index !== -1) {
          state.orders[index] = updatedOrder;
        }
        
        // Update current order if it matches
        if (state.currentOrder && state.currentOrder.id === updatedOrder.id) {
          state.currentOrder = updatedOrder;
        }
        
        state.error = null;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Cancel order
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        const cancelledOrder = action.payload.order || action.payload;
        
        // Update order in orders array
        const index = state.orders.findIndex(order => order.id === cancelledOrder.id);
        if (index !== -1) {
          state.orders[index] = cancelledOrder;
        }
        
        // Update current order if it matches
        if (state.currentOrder && state.currentOrder.id === cancelledOrder.id) {
          state.currentOrder = cancelledOrder;
        }
        
        state.error = null;
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch order tracking
      .addCase(fetchOrderTracking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderTracking.fulfilled, (state, action) => {
        state.loading = false;
        state.orderTracking = action.payload.tracking || action.payload;
        state.error = null;
      })
      .addCase(fetchOrderTracking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const {
  clearError,
  clearCurrentOrder,
  clearOrderTracking,
  updateOrderFilters,
  resetOrderFilters,
  updateOrderPagination,
  updateOrderStatusLocal,
  filterOrdersLocal,
  sortOrdersLocal,
} = orderSlice.actions;

// Selectors
export const selectOrders = (state) => state.orders;
export const selectOrdersList = (state) => state.orders.orders;
export const selectCurrentOrder = (state) => state.orders.currentOrder;
export const selectOrderTracking = (state) => state.orders.orderTracking;
export const selectOrdersPagination = (state) => state.orders.pagination;
export const selectOrdersFilters = (state) => state.orders.filters;
export const selectOrdersLoading = (state) => state.orders.loading;
export const selectOrderCreationLoading = (state) => state.orders.orderCreationLoading;
export const selectOrdersError = (state) => state.orders.error;

// Export reducer
export default orderSlice.reducer;
