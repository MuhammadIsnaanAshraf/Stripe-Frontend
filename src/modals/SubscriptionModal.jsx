import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineClose, AiOutlineCheck, AiOutlineCrown, AiOutlineLoading3Quarters } from 'react-icons/ai';
import { loadStripe } from '@stripe/stripe-js';
import StripeCheckout from './StripeCheckout';
import {getStripe} from '../utils/getStripe';
import {checkoutAPI} from '../services/apiRequests'

// Initialize Stripe 

const SubscriptionModal = ({ isOpen, onClose, selectedPlan = null }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { loading } = useSelector(state => state.subscription);

  const [currentStep, setCurrentStep] = useState(1);
  const [plans, setPlans] = useState([]);
  const [selectedPlanData, setSelectedPlanData] = useState(selectedPlan);
  const [stripe, setStripe] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  console.log("🚀 ~ SubscriptionModal ~ clientSecret:", clientSecret)
  const [isProcessing, setIsProcessing] = useState(false);
  const [useTrial, setUseTrial] = useState(false);
  console.log('stripe', stripe);
  const stripePromise = getStripe();
  // Mock plans data - replace with actual API call
  const mockPlans = [
    {
      id: 1,
      name: 'Pro',
      price: 99.00,
      interval: 'month',
      features: [
        'Access to premium products',
        'Priority customer support',
        'Advanced analytics dashboard',
        'Export data functionality',
        'Mobile app access'
      ],
      popular: false,
      stripePriceId: 'price_pro_monthly'
    },
    {
      id: 2,
      name: 'Business',
      price: 199.00,
      interval: 'month',
      features: [
        'Everything in Pro',
        'Team collaboration tools',
        'API access',
        'Custom integrations',
        'Dedicated account manager',
        'Advanced reporting'
      ],
      popular: true,
      stripePriceId: 'price_business_monthly'
    },
    {
      id: 3,
      name: 'Enterprise',
      price: 9999.00,
      interval: 'month',
      features: [
        'Everything in Business',
        'Custom development',
        'White-label solution',
        'On-premise deployment',
        'SLA guarantee',
        '24/7 dedicated support',
        'Custom contract terms'
      ],
      popular: false,
      stripePriceId: 'price_enterprise_monthly'
    }
  ];

  useEffect(() => {
    setPlans(mockPlans);
    if (selectedPlan) {
      setSelectedPlanData(selectedPlan);
      setCurrentStep(2);
    }
  }, [selectedPlan]);

  useEffect(() => {
    const initializeStripe = async () => {
      const stripeInstance = await stripePromise;
      console.log("🚀 ~ initializeStripe ~ stripeInstance:", stripeInstance)
      setStripe(stripeInstance);
    };
    initializeStripe();
  }, []);

  const handlePlanSelect = (plan) => {
    // Prevent selection if this plan is already active
    if (plan?.name === user?.subscription?.plan) {
      return;
    }
    console.log("plan selected:");
    setSelectedPlanData(plan);
    setUseTrial(false);
    setCurrentStep(2);
  };

  const handleTrialSelect = (plan) => {
    console.log("trial plan selected:");
    // Prevent selection if this plan is already active
    if (plan?.name === user?.subscription?.plan) {
      return;
    }
    setSelectedPlanData(plan);
    setUseTrial(true);
    setCurrentStep(2);
  };

  const handleSubscribe = async () => {
    console.log("start")
    // if (!selectedPlanData || !stripe || !user) return;
    if (!selectedPlanData || !stripe || !user) return;
    console.log("end")
    setIsProcessing(true);
    console.log('selectedPlanData', selectedPlanData);
    console.log('stripe', stripe);
    try {
      // Create subscription on backend
      // const response = await fetch('/api/subscriptions', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${user.token}`
      //   },
      //   body: JSON.stringify({
      //     planId: selectedPlanData.id,
      //     stripePriceId: selectedPlanData.stripePriceId
      //   })
      // });
      console.log("🚀 ~ handleSubscribe ~ useTrial:", useTrial)
      const response = await checkoutAPI.createSubscriptionCheckout(
        selectedPlanData?.name,
        useTrial
      );
      console.log("🚀 ~ handleSubscribe ~ response:", response)

      const data = await response;
      console.log("🚀 ~ handleSubscribe ~ data:", data)
      
      if (data.status === 200) {
        console.log("Subscription created successfully");
        setClientSecret(data.data.clientSecret);
        setCurrentStep(3);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error creating subscription:', error);
      alert('Failed to initialize subscription. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = () => {
    console.log('Payment successful!');
    setCurrentStep(4);
    // Refresh user subscription data
    // dispatch(fetchUserSubscriptions());
  };

  const handleClose = () => {
    setCurrentStep(1);
    setSelectedPlanData(null);
    setClientSecret('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {currentStep === 1 && user?.subscription ? 'Manage Your Subscription' : 'Choose Your Plan'}
              {currentStep === 2 && 'Confirm Subscription'}
              {currentStep === 3 && 'Complete Payment'}
              {currentStep === 4 && 'Welcome to Premium!'}
            </h2>
            <p className="text-gray-600 mt-1">
              {currentStep === 1 && 'Select the perfect plan for your needs'}
              {currentStep === 2 && 'Review your subscription details'}
              {currentStep === 3 && 'Secure payment powered by Stripe'}
              {currentStep === 4 && 'Your subscription is now active'}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <AiOutlineClose className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step < currentStep ? <AiOutlineCheck className="w-4 h-4" /> : step}
                </div>
                {step < 4 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Plan Selection */}
        {currentStep === 1 && (
          <div className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              {plans?.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative bg-white border-2 rounded-xl p-6 transition-all ${
                    plan?.name === user?.subscription?.plan 
                      ? 'border-green-500 opacity-50 cursor-not-allowed' 
                      : `cursor-pointer hover:shadow-lg ${
                          plan.popular 
                            ? 'border-blue-500 shadow-lg transform scale-105' 
                            : 'border-gray-200 hover:border-blue-300'
                        }`
                  }`}
                  // onClick={() => handlePlanSelect(plan)}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                        <AiOutlineCrown className="w-4 h-4 mr-1" />
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                      <span className="text-gray-600">/{plan.interval}</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <AiOutlineCheck className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {plan?.name === user?.subscription?.plan ? (
                    <button 
                      className="w-full py-3 px-4 rounded-lg font-medium bg-green-100 text-green-800 cursor-not-allowed"
                      disabled={true}
                    >
                      Active Plan
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <button 
                        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                          plan.popular
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                        }`}
                        onClick={() => handlePlanSelect(plan)}
                      >
                        Select {plan.name}
                      </button>
                      <button 
                        className="w-full py-2 px-4 rounded-lg font-medium border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors"
                        onClick={() => handleTrialSelect(plan)}
                      >
                        Start 7-Day Free Trial
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Confirm Subscription */}
        {currentStep === 2 && selectedPlanData && (
          <div className="p-6">
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription Summary</h3>
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-medium text-gray-900">{selectedPlanData.name}</h4>
                  <p className="text-gray-600">
                    {useTrial ? '7-day free trial, then billed monthly' : 'Billed monthly'}
                  </p>
                </div>
                <div className="text-right">
                  {useTrial ? (
                    <div>
                      <span className="text-lg font-bold text-green-600">Free for 7 days</span>
                      <p className="text-sm text-gray-600">
                        Then ${selectedPlanData.price}/{selectedPlanData.interval}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <span className="text-2xl font-bold text-gray-900">
                        ${selectedPlanData.price}
                      </span>
                      <span className="text-gray-600">/{selectedPlanData.interval}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h5 className="font-medium text-gray-900 mb-2">Features included:</h5>
                <ul className="space-y-1">
                  {selectedPlanData.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-700">
                      <AiOutlineCheck className="w-4 h-4 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className={`border rounded-lg p-4 mb-6 ${
              useTrial 
                ? 'bg-green-50 border-green-200' 
                : 'bg-blue-50 border-blue-200'
            }`}>
              <p className={`text-sm ${
                useTrial ? 'text-green-800' : 'text-blue-800'
              }`}>
                <strong>Note:</strong> {useTrial 
                  ? 'Your 7-day free trial will start immediately. You can cancel anytime during the trial with no charges.' 
                  : 'You can cancel your subscription at any time. No hidden fees or long-term commitments.'
                }
              </p>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setCurrentStep(1)}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Back to Plans
              </button>
              <button
                onClick={handleSubscribe}
                disabled={isProcessing}
                className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isProcessing ? (
                  <>
                    <AiOutlineLoading3Quarters className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  useTrial ? 'Start Free Trial' : 'Continue to Payment'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Stripe Payment */}
        {currentStep === 3 && clientSecret && (
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Complete Your Payment
              </h3>
              <p className="text-gray-600 mb-4">
                Your payment is secured by Stripe. Enter your payment details below.
              </p>
              
              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">{selectedPlanData.name}</span>
                  <span className="font-bold text-gray-900">
                    ${selectedPlanData.price}/{selectedPlanData.interval}
                  </span>
                </div>
              </div>
              
              {/* Stripe Embedded Payment Form */}
              <StripeCheckout 
                clientSecret={clientSecret}
                onComplete={handlePaymentSuccess}
              />
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {currentStep === 4 && (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AiOutlineCheck className="w-8 h-8 text-green-600" />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to Premium!
            </h3>
            <p className="text-gray-600 mb-6">
              Your subscription has been activated successfully. You now have access to all premium features.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800 text-sm">
                A confirmation email has been sent to your registered email address.
              </p>
            </div>

            <button
              onClick={handleClose}
              className="py-3 px-6 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Start Exploring
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionModal;