import React from 'react';
import { Wrapper } from './styles';
import { ProductAdmin } from '../../admin_components';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

const Products = () => {
  const { selected } = useSelector((state) => state.adminNavbar);

  return (
    <Wrapper>
      {selected === 'products' && <ProductAdmin />}
      {selected !== 'products' && <Outlet />}
    </Wrapper>
  );
};

export default Products;
