import React, { useEffect } from 'react';
import { Footer, Header, ProfileComponent } from '../../components';
import { Wrapper } from './styles';
import { Spin } from 'antd';
import useAuth from '../../hooks/useAuth';

const Profile = () => {
  const { isLoading, currentUser } = useAuth();

  useEffect(() => {
    document.title = currentUser?.displayName
      ? currentUser?.displayName
      : 'Hồ sơ';
    window.scrollTo(0, 0);
  }, [currentUser]);

  if (isLoading) {
    return <Spin />;
  }

  return (
    <Wrapper>
      <div className="header-bg">
        <Header />
      </div>
      <ProfileComponent />
      <Footer />
    </Wrapper>
  );
};

export default Profile;
