import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

// Load Stripe with your publishable key
const stripePromise = loadStripe('your-publishable-key-here');

const StripeCheckout = ({ clientSecret }) => {
  const options = { clientSecret };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm />
    </Elements>
  );
};

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: 'https://your-site.com/payment-success',
      },
    });

    if (result.error) {
      console.error(result.error.message);
      // Optionally show error to user
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button disabled={!stripe || loading}>
        {loading ? 'Processing…' : 'Pay'}
      </button>
    </form>
  );
};

export default StripeCheckout;
