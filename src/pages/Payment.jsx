import React from 'react';
import { PaymentForm } from '../../src/components';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe(
  'pk_test_51N8iKqJdzJVPgoqvorzGmKANJ1PcAQYylBKVGX7RBlnuSwPdbrb06ueCsS7FSXA3JAXeOEZxlCBTwFBLPruoWVxX00qdyrvwCZ'
);
const Payment = () => {
  return (
    <>
      <Elements stripe={stripePromise}>
        <PaymentForm />
      </Elements>
    </>
  );
};

export default Payment;
