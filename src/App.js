import React from 'react';
import './App.css';
import { Outlet } from 'react-router-dom';
import { Footer, Header, Login } from './components';
import useAuth from './hooks/useAuth';
import { Spin } from 'antd';

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
      </div>
      <Footer />
    </>
  );
};

export default App;
