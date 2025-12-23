import { loadStripe } from '@stripe/stripe-js';

let stripePromise

export const getStripe = () => {
  const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  console.log("🚀 ~ getStripe ~ publishableKey:", publishableKey)
  

  if (!publishableKey) {
    console.error('Stripe publishable key is not set.');
    return Promise.resolve(null);
  }

  // if (!stripePromise) {
    stripePromise = loadStripe(publishableKey);
  // }

      return stripePromise;
};