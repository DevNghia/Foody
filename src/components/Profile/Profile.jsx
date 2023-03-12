import {
  EditOutlined,
  LogoutOutlined,
  ShoppingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Col, Menu, Row, Typography, Spin } from 'antd';
import React, { useState, useEffect } from 'react';
import { Wrapper } from './styles';
import { auth } from '../../firebase/config';
import { signOut } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { checkLogged, toggleHiddenLogin } from '../Login/loginSlice';
import { getUsers } from '../Profile/profileSlice';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import EditProfile from './EditProfile/EditProfile';
import ChangePassword from './ChangePassword/ChangePassword';
import ShoppingHistory from './ShoppingHistory/ShoppingHistory';

const { Text } = Typography;

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const { currentUserAuth } = useAuth();

  const { userLoading, users } = useSelector((state) => state.users);
  const { isLogged } = useSelector((state) => state.login);

  // states
  const [selected, setSelected] = useState('profile');
  const [providerId, setProviderId] = useState('');
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    if (userLoading === 'success' && users?.length > 0) {
      setCurrentUser(users?.find((user) => user?.uid === currentUserAuth?.uid));
      setProviderId(currentUser?.providerId);
    }
  }, [userLoading, users, currentUser, currentUserAuth]);

  useEffect(() => {
    if (!isLogged) {
      navigate('/');
      dispatch(toggleHiddenLogin(false));
    }
  }, [isLogged, navigate, dispatch]);

  // handle logout
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        dispatch(checkLogged(false));
        navigate('/');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // config navbar
  const navItems = [
    {
      label: <Text className="profile-info">Hồ sơ</Text>,
      key: 'profile',
    },
    providerId === 'password' && {
      label: <Text className="change-password-title">Đổi mật khẩu</Text>,
      key: 'change-password',
    },
  ];
  const handleNavbarClick = (e) => {
    setSelected(e.key);
  };

  if (userLoading === 'pending' || !isLogged) {
    return <Spin />;
  }

  return (
    <Wrapper selected={selected}>
      <Row>
        <Col className="sidebar">
          <div className="top">
            <Avatar size="large" src={currentUserAuth?.photoURL}>
              {currentUserAuth?.photoURL
                ? ''
                : currentUserAuth?.displayName
                  ? currentUserAuth?.displayName?.charAt(0)?.toUpperCase()
                  : currentUserAuth?.email?.charAt(0).toUpperCase()}
            </Avatar>
            <div className="name-wrapper">
              <Text>
                {currentUserAuth?.displayName
                  ? currentUserAuth?.displayName
                  : currentUserAuth?.email?.charAt(0).toUpperCase()}
              </Text>
              <div
                className="edit-wrapper"
                onClick={() => setSelected('profile')}
              >
                <EditOutlined />
                Sửa hồ sơ
              </div>
            </div>
          </div>

          <div className="profile">
            <div className="title" onClick={() => setSelected('profile')}>
              <UserOutlined />
              <Text>Tài khoản của tôi</Text>
            </div>
            <Menu
              items={navItems}
              defaultSelectedKeys={['profile']}
              onClick={handleNavbarClick}
            />
          </div>
          <div
            className="shopping-history"
            onClick={() => setSelected('shopping-history')}
          >
            <ShoppingOutlined />
            <Text>Đơn mua</Text>
          </div>
          <div className="logout" onClick={handleLogout}>
            <LogoutOutlined />
            <Text>Đăng xuất</Text>
          </div>
        </Col>

        <Col className="content">
          {(selected === 'profile' && <EditProfile />) ||
            (selected === 'change-password' && <ChangePassword />) ||
            (selected === 'shopping-history' && <ShoppingHistory />)}
        </Col>
      </Row>
    </Wrapper>
  );
};

export default Profile;
