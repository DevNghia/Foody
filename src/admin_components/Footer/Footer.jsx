import React from 'react';
import { Wrapper } from './styles';

const Footer = () => {
  return (
    <Wrapper>
      © {new Date().getFullYear()} MyFood. Tất cả đã được đăng ký bản quyền
    </Wrapper>
  );
};

export default Footer;
