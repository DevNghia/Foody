import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { BlogAdmin } from '../../admin_components';
import { Wrapper } from './styles';

const Blogs = () => {
  const { selected } = useSelector((state) => state.adminNavbar);

  return (
    <Wrapper>
      {selected === 'blogs' && <BlogAdmin />}
      {selected !== 'blogs' && <Outlet />}
    </Wrapper>
  );
};

export default Blogs;
