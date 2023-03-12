import React from 'react';
import { Wrapper } from './styles';
import { ProductReviewAdmin } from '../../admin_components';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

const ProductReviews = () => {
  const { selected } = useSelector((state) => state.adminNavbar);

  return (
    <Wrapper>
      {selected === 'product-reviews' && <ProductReviewAdmin />}
      {selected !== 'product-reviews' && <Outlet />}
    </Wrapper>
  );
};

export default ProductReviews;
