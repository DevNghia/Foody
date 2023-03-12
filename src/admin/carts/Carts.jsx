import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { CartAdmin } from '../../admin_components';
import { Wrapper } from './styles';

const Carts = () => {
  const { selected } = useSelector((state) => state.adminNavbar);

  return (
    <Wrapper>
      {selected === 'carts' && <CartAdmin />}
      {selected !== 'carts' && <Outlet />}
    </Wrapper>
  );
};

export default Carts;
