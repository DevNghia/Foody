import React from 'react';
import './App.css';
import { Outlet } from 'react-router-dom';
import { Footer, Header, Login, PaymentForm } from './components';
import useAuth from './hooks/useAuth';
import { Spin } from 'antd';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(
  'pk_test_51N8iKqJdzJVPgoqvorzGmKANJ1PcAQYylBKVGX7RBlnuSwPdbrb06ueCsS7FSXA3JAXeOEZxlCBTwFBLPruoWVxX00qdyrvwCZ'
);
const App = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <Spin />;
  }

  return (
    <>
      <Header />
      <div>
        <Outlet />
        <Login />
        {/* <Elements stripe={stripePromise}>
          <PaymentForm />
        </Elements> */}
      </div>

      <Footer />
    </>
  );
};

export default App;
