import { useSelector, useDispatch } from 'react-redux';

// Custom hooks for Redux
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

// Auth hooks
export const useAuth = () => {
  return useAppSelector((state) => state.auth);
};

export const useUser = () => {
  return useAppSelector((state) => state.auth.user);
};

export const useIsAuthenticated = () => {
  return useAppSelector((state) => state.auth.isAuthenticated);
};

// Cart hooks
export const useCart = () => {
  return useAppSelector((state) => state.cart);
};

export const useCartItems = () => {
  return useAppSelector((state) => state.cart.items);
};

export const useCartTotal = () => {
  return useAppSelector((state) => state.cart.totalPrice);
};

// Products hooks
export const useProducts = () => {
  return useAppSelector((state) => state.products);
};

export const useProductsList = () => {
  return useAppSelector((state) => state.products.products);
};

export const useCurrentProduct = () => {
  return useAppSelector((state) => state.products.currentProduct);
};

// Orders hooks
export const useOrders = () => {
  return useAppSelector((state) => state.orders);
};

export const useOrdersList = () => {
  return useAppSelector((state) => state.orders.orders);
};

export const useCurrentOrder = () => {
  return useAppSelector((state) => state.orders.currentOrder);
};

// Subscription hooks
export const useSubscription = () => {
  return useAppSelector((state) => state.subscription);
};

export const useCurrentSubscription = () => {
  return useAppSelector((state) => state.subscription.currentSubscription);
};

export const useSubscriptionPlans = () => {
  return useAppSelector((state) => state.subscription.plans);
};

export const useHasActiveSubscription = () => {
  return useAppSelector((state) => {
    const subscription = state.subscription.currentSubscription;
    return subscription && (subscription.status === 'active' || subscription.status === 'trialing');
  });
};
