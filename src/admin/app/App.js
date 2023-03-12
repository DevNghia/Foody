import React from 'react';
import { Outlet } from 'react-router-dom';
import '../../App.css';
import { HeaderAdmin, FooterAdmin, NavbarAdmin } from '../../admin_components';
import useAuthAdmin from '../../hooks/useAuthAdmin';
import { Row, Spin } from 'antd';

const App = () => {
  const { loading } = useAuthAdmin();

  if (loading) {
    return <Spin />;
  }

  return (
    <>
      <HeaderAdmin />
      <Row style={{ minHeight: 'calc(100vh - 80px)' }}>
        <NavbarAdmin />
        <Outlet />
      </Row>
      <FooterAdmin />
    </>
  );
};

export default App;
