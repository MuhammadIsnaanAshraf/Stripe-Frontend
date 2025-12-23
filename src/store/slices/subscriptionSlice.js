import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// Initial state
const initialState = {
  plans: [],
  currentSubscription: null,
  subscriptionHistory: [],
  customerPortalUrl: null,
  loading: false,
  error: null,
  subscriptionCreationLoading: false,
};

// Async thunks for API calls

// Fetch subscription plans
export const fetchSubscriptionPlans = createAsyncThunk(
  'subscription/fetchPlans',
  async (_, { rejectWithValue }) => {
    try {
      const response = await subscriptionAPI.getPlans();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch subscription plans');
    }
  }
);

// Get current subscription
export const fetchCurrentSubscription = createAsyncThunk(
  'subscription/fetchCurrentSubscription',
  async (_, { rejectWithValue }) => {
    try {
      const response = await subscriptionAPI.getCurrentSubscription();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch current subscription');
    }
  }
);

// Create subscription
export const createSubscription = createAsyncThunk(
  'subscription/createSubscription',
  async ({ planId, paymentMethodId }, { rejectWithValue }) => {
    try {
      const response = await subscriptionAPI.createSubscription(planId, paymentMethodId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create subscription');
    }
  }
);

// Update subscription
export const updateSubscription = createAsyncThunk(
  'subscription/updateSubscription',
  async ({ subscriptionId, planId }, { rejectWithValue }) => {
    try {
      const response = await subscriptionAPI.updateSubscription(subscriptionId, planId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update subscription');
    }
  }
);

// Cancel subscription
export const cancelSubscription = createAsyncThunk(
  'subscription/cancelSubscription',
  async (subscriptionId, { rejectWithValue }) => {
    try {
      const response = await subscriptionAPI.cancelSubscription(subscriptionId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel subscription');
    }
  }
);

// Resume subscription
export const resumeSubscription = createAsyncThunk(
  'subscription/resumeSubscription',
  async (subscriptionId, { rejectWithValue }) => {
    try {
      const response = await subscriptionAPI.resumeSubscription(subscriptionId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to resume subscription');
    }
  }
);

// Fetch subscription history
export const fetchSubscriptionHistory = createAsyncThunk(
  'subscription/fetchSubscriptionHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await subscriptionAPI.getSubscriptionHistory();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch subscription history');
    }
  }
);

// Subscription slice
const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Clear current subscription
    clearCurrentSubscription: (state) => {
      state.currentSubscription = null;
    },
    
    // Clear subscription history
    clearSubscriptionHistory: (state) => {
      state.subscriptionHistory = [];
    },
    
    // Set customer portal URL
    setCustomerPortalUrl: (state, action) => {
      state.customerPortalUrl = action.payload;
    },
    
    // Update subscription status locally
    updateSubscriptionStatusLocal: (state, action) => {
      const { status } = action.payload;
      if (state.currentSubscription) {
        state.currentSubscription.status = status;
        state.currentSubscription.updatedAt = new Date().toISOString();
      }
    },
    
    // Update subscription plan locally
    updateSubscriptionPlanLocal: (state, action) => {
      const { planId, planName, price } = action.payload;
      if (state.currentSubscription) {
        state.currentSubscription.planId = planId;
        state.currentSubscription.planName = planName;
        state.currentSubscription.price = price;
        state.currentSubscription.updatedAt = new Date().toISOString();
      }
    },
    
    // Check subscription access
    checkSubscriptionAccess: (state) => {
      if (state.currentSubscription) {
        const now = new Date();
        const endDate = new Date(state.currentSubscription.currentPeriodEnd);
        
        // Check if subscription is still active
        if (now > endDate && state.currentSubscription.status !== 'active') {
          state.currentSubscription.hasAccess = false;
        } else {
          state.currentSubscription.hasAccess = true;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch subscription plans
      .addCase(fetchSubscriptionPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload.plans || action.payload;
        state.error = null;
      })
      .addCase(fetchSubscriptionPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch current subscription
      .addCase(fetchCurrentSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSubscription = action.payload.subscription || action.payload;
        state.error = null;
      })
      .addCase(fetchCurrentSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create subscription
      .addCase(createSubscription.pending, (state) => {
        state.subscriptionCreationLoading = true;
        state.error = null;
      })
      .addCase(createSubscription.fulfilled, (state, action) => {
        state.subscriptionCreationLoading = false;
        state.currentSubscription = action.payload.subscription || action.payload;
        state.error = null;
      })
      .addCase(createSubscription.rejected, (state, action) => {
        state.subscriptionCreationLoading = false;
        state.error = action.payload;
      })
      
      // Update subscription
      .addCase(updateSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSubscription = action.payload.subscription || action.payload;
        state.error = null;
      })
      .addCase(updateSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Cancel subscription
      .addCase(cancelSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSubscription = action.payload.subscription || action.payload;
        state.error = null;
      })
      .addCase(cancelSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Resume subscription
      .addCase(resumeSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resumeSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSubscription = action.payload.subscription || action.payload;
        state.error = null;
      })
      .addCase(resumeSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch subscription history
      .addCase(fetchSubscriptionHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptionHistory = action.payload.history || action.payload;
        state.error = null;
      })
      .addCase(fetchSubscriptionHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const {
  clearError,
  clearCurrentSubscription,
  clearSubscriptionHistory,
  setCustomerPortalUrl,
  updateSubscriptionStatusLocal,
  updateSubscriptionPlanLocal,
  checkSubscriptionAccess,
} = subscriptionSlice.actions;

// Selectors
export const selectSubscription = (state) => state.subscription;
export const selectSubscriptionPlans = (state) => state.subscription.plans;
export const selectCurrentSubscription = (state) => state.subscription.currentSubscription;
export const selectSubscriptionHistory = (state) => state.subscription.subscriptionHistory;
export const selectCustomerPortalUrl = (state) => state.subscription.customerPortalUrl;
export const selectSubscriptionLoading = (state) => state.subscription.loading;
export const selectSubscriptionCreationLoading = (state) => state.subscription.subscriptionCreationLoading;
export const selectSubscriptionError = (state) => state.subscription.error;

// Helper selectors
export const selectHasActiveSubscription = (state) => {
  const subscription = state.subscription.currentSubscription;
  return subscription && (subscription.status === 'active' || subscription.status === 'trialing');
};

export const selectSubscriptionAccess = (state) => {
  const subscription = state.subscription.currentSubscription;
  if (!subscription) return false;
  
  const now = new Date();
  const endDate = new Date(subscription.currentPeriodEnd);
  
  return subscription.status === 'active' || 
         subscription.status === 'trialing' || 
         (subscription.status === 'past_due' && now <= endDate);
};

export const selectDaysUntilRenewal = (state) => {
  const subscription = state.subscription.currentSubscription;
  if (!subscription || !subscription.currentPeriodEnd) return null;
  
  const now = new Date();
  const endDate = new Date(subscription.currentPeriodEnd);
  const diffTime = endDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays > 0 ? diffDays : 0;
};

// Export reducer
export default subscriptionSlice.reducer;
