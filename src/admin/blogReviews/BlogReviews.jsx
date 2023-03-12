import React from 'react';
import { Wrapper } from './styles';
import { BlogReviewAdmin } from '../../admin_components';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

const BlogReviews = () => {
  const { selected } = useSelector((state) => state.adminNavbar);

  return (
    <Wrapper>
      {selected === 'blog-reviews' && <BlogReviewAdmin />}
      {selected !== 'blog-reviews' && <Outlet />}
    </Wrapper>
  );
};

export default BlogReviews;
