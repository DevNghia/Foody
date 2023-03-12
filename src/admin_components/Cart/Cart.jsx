import React, { useEffect, useState } from 'react';
import { Avatar, Button, Card, Input, Table, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getCarts, setCartLoading } from '../../components/Cart/cartSlice';
import { getUsers } from '../../components/Profile/profileSlice';
import { getProducts } from '../../components/Product/productSlice';
import { Link } from 'react-router-dom';
import { EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { Wrapper } from './styles';

const { Title, Text } = Typography;

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

const Cart = () => {
  useEffect(() => {
    document.title = 'Đơn đặt hàng - Food App';
  }, []);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCarts());
    dispatch(getUsers());
    dispatch(getProducts());
  }, [dispatch]);

  const { cartLoading, carts } = useSelector((state) => state.carts);
  const { productLoading, products } = useSelector((state) => state.products);
  const { userLoading, users } = useSelector((state) => state.users);

  // states
  const [cartsPreview, setCartsPreview] = useState([]);

  useEffect(() => {
    if (
      cartLoading === 'success' &&
      userLoading === 'success' &&
      productLoading === 'success'
    ) {
      setCartsPreview(
        carts?.map((cart) => ({
          ...cart,
          username: users?.find((user) => user.uid === cart.userId)
            ?.displayName,
          avatar: users?.find((user) => user.uid === cart.userId)?.photoURL,
          productName: products?.find(
            (product) => product.productId === cart.productId
          )?.name,
          price: products?.find(
            (product) => product.productId === cart.productId
          )?.price,
          quantityRemaining: products?.find(
            (product) => product.productId === cart.productId
          )?.quantityRemaining,
        }))
      );
    }
  }, [cartLoading, carts, users, products, userLoading, productLoading]);

  // config table
  const columns = [
    {
      title: 'Người mua',
      dataIndex: 'username',
      key: 'username',
      render: (username, record) => (
        <div className="user_info">
          <Avatar size="large" src={record?.avatar}>
            {record?.avatar ? '' : record?.username?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Text className="user_title">
            {username?.length < 30
              ? username
              : username?.substring(0, 30) + '...'}
          </Text>
        </div>
      ),
      sorter: (a, b) => a.username.localeCompare(b.username),
    },
    {
      title: 'Sản phẩm được mua',
      dataIndex: 'productName',
      key: 'productName',
      sorter: (a, b) => a.productName.localeCompare(b.productName),
      render: (productName) =>
        productName?.length < 30
          ? productName
          : productName?.substring(0, 30) + '...',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: 'Tổng giá đơn hàng',
      dataIndex: 'price',
      key: 'price',
      sorter: (a, b) => a.quantity * a.price - b.quantity * b.price,
      render: (price, record) =>
        record?.quantity >= 3
          ? ((price * record.quantity * 90) / 100).toLocaleString('vi-vn', {
            style: 'currency',
            currency: 'VND',
          })
          : (price * record.quantity).toLocaleString('vi-vn', {
            style: 'currency',
            currency: 'VND',
          }),
    },
    {
      title: '',
      key: 'action',
      render: (record) => (
        <>
          <div className="btn_wrapper">
            <Link to={`info/${record.id}`}>
              <Button
                type="primary"
                icon={<EyeOutlined />}
                className="edit_btn"
              >
                Xem thông tin
              </Button>
            </Link>
          </div>
        </>
      ),
      width: '15%',
    },
  ];

  // handle search
  const handleSearch = (e) => {
    try {
      let result = [];
      dispatch(setCartLoading('pending'));
      const firstList = carts
        ?.map((cart) => ({
          ...cart,
          username: users?.find((user) => user.uid === cart.userId)
            ?.displayName,
          avatar: users?.find((user) => user.uid === cart.userId)?.photoURL,
          productName: products?.find(
            (product) => product.productId === cart.productId
          )?.name,
          price: products?.find(
            (product) => product.productId === cart.productId
          )?.price,
          quantityRemaining: products?.find(
            (product) => product.productId === cart.productId
          )?.quantityRemaining,
        }))
        ?.filter(
          (cart) =>
            cart?.username
              ?.toLowerCase()
              ?.includes(e.target.value?.toLowerCase()) ||
            cart?.productName
              ?.toLowerCase()
              ?.includes(e.target.value?.toLowerCase())
        );
      const secondList = carts
        ?.map((cart) => ({
          ...cart,
          username: users?.find((user) => user.uid === cart.userId)
            ?.displayName,
          avatar: users?.find((user) => user.uid === cart.userId)?.photoURL,
          productName: products?.find(
            (product) => product.productId === cart.productId
          )?.name,
          price: products?.find(
            (product) => product.productId === cart.productId
          )?.price,
          quantityRemaining: products?.find(
            (product) => product.productId === cart.productId
          )?.quantityRemaining,
        }))
        ?.filter(
          (cart) =>
            convertVietnamese(cart?.username)
              ?.toLowerCase()
              ?.includes(e.target.value?.toLowerCase()) ||
            convertVietnamese(cart?.productName)
              ?.toLowerCase()
              ?.includes(e.target.value?.toLowerCase())
        );
      result = [...firstList];
      secondList.forEach((cart) => {
        if (
          firstList.filter((cartFirstList) => cartFirstList.id === cart.id)
            ?.length === 0
        ) {
          result.push(cart);
        }
      });
      setCartsPreview(result);
      dispatch(setCartLoading('success'));
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  return (
    <Wrapper>
      <Title className="title" level={4}>
        Danh sách đơn hàng
      </Title>
      <Card>
        <div className="top">
          <div className="search-wrapper">
            <Input
              size="large"
              placeholder="Tìm kiếm đơn hàng"
              prefix={<SearchOutlined />}
              onChange={handleSearch}
            />
          </div>
        </div>
        <div className="blogs_list">
          <Table
            columns={columns}
            dataSource={cartsPreview}
            loading={
              userLoading === 'pending' ||
              productLoading === 'pending' ||
              cartLoading === 'pending'
            }
          />
        </div>
      </Card>
    </Wrapper>
  );
};

export default Cart;
