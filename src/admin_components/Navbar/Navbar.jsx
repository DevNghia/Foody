import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  AreaChartOutlined,
  CoffeeOutlined,
  FileDoneOutlined,
  FileTextOutlined,
  IdcardOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import { Wrapper } from './styles';
import { setSelected } from './navbarSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const { collapsed } = useSelector((state) => state.adminNavbar);

  const getItem = (label, key, icon, children, type) => {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  };

  const [pageCurrent, setPageCurrent] = useState('analytics');

  let location = useLocation();
  useEffect(() => {
    const params = location?.pathname?.split('/');
    params[3] ? setPageCurrent(params[3]) : setPageCurrent(params[2]);
    // setPageCurrent(params[3]);
    dispatch(setSelected(params[params.length - 1]));
  }, [location, dispatch]);

  const navItems = [
    getItem(
      <Link to="/app/admin">Thống kê</Link>,
      'admin',
      <AreaChartOutlined />
    ),
    getItem(
      <Link to="/app/admin/users">Người dùng</Link>,
      'users',
      <IdcardOutlined />
    ),
    getItem(
      <Link to="/app/admin/products">Món ăn</Link>,
      'products',
      <CoffeeOutlined />
    ),
    getItem(
      <Link to="/app/admin/product-reviews">Đánh giá món ăn</Link>,
      'product-reviews',
      <FileDoneOutlined />
    ),
    getItem(
      <Link to="/app/admin/blogs">Bài viết</Link>,
      'blogs',
      <FileTextOutlined />
    ),
    getItem(
      <Link to="/app/admin/blog-reviews">Đánh giá bài viết</Link>,
      'blog-reviews',
      <FileDoneOutlined />
    ),
    getItem(
      <Link to="/app/admin/carts">Đơn hàng</Link>,
      'carts',
      <ShoppingOutlined />
    ),
  ];
  const menuClick = (e) => {
    setPageCurrent(e.key);
  };

  return (
    <Wrapper collapsed={collapsed}>
      <Menu
        mode="inline"
        inlineCollapsed={collapsed}
        items={navItems}
        selectedKeys={[pageCurrent]}
        onClick={menuClick}
      />
    </Wrapper>
  );
};

export default Navbar;
