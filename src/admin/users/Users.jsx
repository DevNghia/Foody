import React from 'react';
import { Wrapper } from './styles';
import { UserAdmin } from '../../admin_components';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

const Users = () => {
  const { selected } = useSelector((state) => state.adminNavbar);

  return (
    <Wrapper>
      {selected === 'users' && <UserAdmin />}
      {selected !== 'users' && <Outlet />}
    </Wrapper>
  );
};

export default Users;
