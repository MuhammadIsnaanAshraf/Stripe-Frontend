import React, { useEffect } from 'react';
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { getStripe } from '../utils/getStripe';

const stripeCheckout = ({ clientSecret, onComplete }) => {
  console.log("StripeCheckout clientSecret:", clientSecret);
  console.log("StripeCheckout clientSecret type:", typeof clientSecret);
  
  const stripePromise = getStripe();

  // Validate clientSecret format
  if (!clientSecret || typeof clientSecret !== 'string') {
    console.error('Invalid clientSecret:', clientSecret);
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>Invalid payment session. Please try again.</p>
          </div>
        </div>
      </div>
    );
  }

  const options = {
    clientSecret: clientSecret,
    onComplete: () => {
      console.log("Payment completed!");
      if (onComplete) onComplete();
    }
  };

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider> 
    </div>
  );
};

export default stripeCheckout;