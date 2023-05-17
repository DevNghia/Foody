import React, { useEffect, useState } from 'react';
import Logo from '../../assets/logo/BK_LOGO_ICON.png';
import { Link, useLocation } from 'react-router-dom';
import {
  BarsOutlined,
  CloseOutlined,
  SearchOutlined,
  ShoppingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Input, Menu, Spin, Table, Typography } from 'antd';
import { HeaderWrapper } from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { toggleHiddenLogin } from '../Login/loginSlice';
import useAuth from '../../hooks/useAuth';
import { getProducts, setProductLoading } from '../Product/productSlice';

const { Text } = Typography;

function convertVietnamese(str) {
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|$|_/g,
    '-'
  );
  str = str.replace(/-+-/g, '-');
  str = str.replace(/^\-+|\-+$/g, '');

  return str;
}

const Header = () => {
  const dispatch = useDispatch();
  const { currentUserAuth } = useAuth();

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const { userLoading } = useSelector((state) => state.users);
  const { isLogged } = useSelector((state) => state.login);
  const { productLoading, products } = useSelector((state) => state.products);
  const { cartsLocalStorage } = useSelector((state) => state.carts);

  // states
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [email, setEmail] = useState('');
  const [toggleMenu, setToggleMenu] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [productsPreview, setProductsPreview] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  let location = useLocation();
  const [quantityOrder, setQuantityOrder] = useState(0);

  useEffect(() => {
    if (isLogged) {
      const { photoURL, displayName, email } = currentUserAuth;
      setName(displayName);
      setAvatar(photoURL);
      setEmail(email);
    }
  }, [isLogged, userLoading, currentUserAuth]);

  useEffect(() => {
    setIsSearch(false);
    setIsSearching(false);
    setProductsPreview([]);
    setToggleMenu(false);
  }, [location]);

  useEffect(() => {
    if (isLogged) {
      setQuantityOrder(cartsLocalStorage?.length);
    }
  }, [cartsLocalStorage, isLogged]);

  // menu config
  const [pageCurrent, setPageCurrent] = useState('home');
  const navItems = [
    {
      label: <Link to="/">Trang Chủ</Link>,
      key: 'home',
    },
    {
      label: <Link to="/about">Về chúng tôi</Link>,
      key: 'whatBK',
    },
    {
      label: <Link to="/products">Thực đơn</Link>,
      key: 'menu',
    },
    {
      label: <Link to="/blogs">Bài viết </Link>,
      key: 'blog',
    },
    {
      label: <Link to="/contact">Liên hệ</Link>,
      key: 'contact',
    },
  ];
  const menuClick = (e) => {
    setPageCurrent(e.key);
  };

  // table config
  const columns = [
    {
      title: 'Kết quả tìm kiếm',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <Link to={`/products/${record?.id}`} className="product_info">
          <Avatar size="large" src={record?.photoURL}></Avatar>
          <Text className="product_name">{name}</Text>
        </Link>
      ),
    },
  ];

  // handle toggle search box
  const toggleHiddenSearchBox = () => {
    setIsSearch(!isSearch);
    setIsSearching(false);
  };

  // handle search
  const handleSearch = (e) => {
    try {
      if (e.target.value === '') {
        setIsSearching(false);
        setProductsPreview([]);
      } else {
        let result = [];
        dispatch(setProductLoading('searching'));
        const firstList = products
          ?.filter(
            (product) =>
              product.removed === false &&
              product?.name
                ?.toLowerCase()
                ?.includes(e.target.value?.toLowerCase())
          )
          ?.map((product) => ({ ...product, key: product.id }));
        const secondList = products
          ?.filter(
            (product) =>
              product.removed === false &&
              convertVietnamese(product?.name)
                ?.toLowerCase()
                ?.includes(e.target.value?.toLowerCase())
          )
          ?.map((product) => ({ ...product, key: product.id }));
        result = [...firstList];
        secondList.forEach((product) => {
          if (
            firstList.filter(
              (productFirstList) => productFirstList.id === product.id
            )?.length === 0
          ) {
            result.push(product);
          }
        });
        setProductsPreview(result);
        dispatch(setProductLoading('success'));
        setIsSearching(true);
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  return (
    <HeaderWrapper toggleMenu={toggleMenu} search={isSearch}>
      <Link to="/" className="logo-wrapper">
        <img src={Logo} alt="logo" />
      </Link>
      <div className="link-wrapper">
        <Menu
          items={navItems}
          selectedKeys={[pageCurrent]}
          onClick={menuClick}
        />
        <div className="icon-wrapper">
          <Link className="cart-wrapper icon" to="/cart">
            <ShoppingOutlined />
            <span className="quantity">{quantityOrder}</span>
          </Link>
          <div className="search-wrapper">
            <SearchOutlined className="icon" onClick={toggleHiddenSearchBox} />
            {isSearch ? (
              <div className="search-result">
                <Input placeholder="Nhập tên món ăn" onChange={handleSearch} />
                {isSearching && (
                  <Table
                    columns={columns}
                    dataSource={productsPreview}
                    loading={productLoading === 'searching'}
                  />
                )}
              </div>
            ) : null}
          </div>

          {isLogged ? (
            <Link to="/profile" className="user-avatar">
              {(userLoading === 'success' || userLoading === 'idle') && (
                <Avatar size="large" src={avatar}>
                  {avatar
                    ? ''
                    : name
                    ? name?.charAt(0)?.toUpperCase()
                    : email?.charAt(0).toUpperCase()}
                </Avatar>
              )}
              {(userLoading === 'pending' || userLoading === 'uploading') && (
                <Avatar size="large">
                  <Spin />
                </Avatar>
              )}
            </Link>
          ) : (
            <UserOutlined
              className="icon"
              onClick={() => dispatch(toggleHiddenLogin(false))}
            />
          )}

          {toggleMenu ? (
            <CloseOutlined
              className="icon"
              onClick={() => setToggleMenu(!toggleMenu)}
            />
          ) : (
            <BarsOutlined
              className="icon"
              onClick={() => setToggleMenu(!toggleMenu)}
            />
          )}
        </div>
      </div>
    </HeaderWrapper>
  );
};

export default Header;
