import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Wrapper } from './styles';
import { Avatar, Button } from 'antd';
import { toggleCollapsed } from '../Navbar/navbarSlice';
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import useAuthAdmin from '../../hooks/useAuthAdmin';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { useNavigate } from 'react-router-dom';
import { setLogged } from '../Login/loginSlice';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { collapsed } = useSelector((state) => state.adminNavbar);

  const { currentUser } = useAuthAdmin();

  const [avatarClick, setAvatarClick] = useState(false);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        dispatch(setLogged(false));
        navigate('/app/admin/login');
      })
      .catch((error) => {
        console.log(error);
        alert(error.code);
      });
  };

  return (
    <Wrapper>
      <Button
        type="primary"
        onClick={() => dispatch(toggleCollapsed(!collapsed))}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
      <div className="avatar-wrapper">
        <Avatar
          size="large"
          src={currentUser?.photoURL}
          onClick={() => setAvatarClick(!avatarClick)}
        >
          {currentUser?.photoURL ? '' : 'A'}
        </Avatar>
        {avatarClick ? (
          <div className="setting" onClick={handleSignOut}>
            <LogoutOutlined />
            Đăng xuất
          </div>
        ) : null}
      </div>
    </Wrapper>
  );
};

export default Header;
