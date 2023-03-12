import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Spin,
  Typography,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getCarts } from '../../../components/Cart/cartSlice';
import { getUsers } from '../../../components/Profile/profileSlice';
import { getProducts } from '../../../components/Product/productSlice';
import { Link, useParams } from 'react-router-dom';
import { Wrapper } from './styles';

const { Title } = Typography;

const CartInfo = () => {
  useEffect(() => {
    document.title = 'Thông tin đơn hàng - Food App';
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
  const { id } = useParams();

  // states
  const [currentCart, setCurrentCart] = useState({});
  const [formFieldsValue, setFormFieldsValue] = useState([]);

  useEffect(() => {
    if (
      cartLoading === 'success' &&
      userLoading === 'success' &&
      productLoading === 'success' &&
      users.length > 0 &&
      products.length > 0 &&
      carts.length > 0
    ) {
      setCurrentCart(
        carts
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
          ?.find((cart) => cart.id === id)
      );
    }
  }, [cartLoading, userLoading, productLoading, users, products, carts, id]);

  useEffect(() => {
    if (
      cartLoading === 'success' &&
      userLoading === 'success' &&
      productLoading === 'success' &&
      users.length > 0 &&
      products.length > 0 &&
      carts.length > 0
    ) {
      setFormFieldsValue([
        {
          name: ['username'],
          value: currentCart?.username,
        },
        {
          name: ['productName'],
          value: currentCart?.productName,
        },
        {
          name: ['quantity'],
          value: currentCart?.quantity,
        },
        {
          name: ['total'],
          value:
            currentCart?.quantity >= 3
              ? (
                (currentCart?.price * currentCart?.quantity * 90) /
                  100
              ).toLocaleString('vi-vn', {
                style: 'currency',
                currency: 'VND',
              })
              : (currentCart?.price * currentCart?.quantity).toLocaleString(
                'vi-vn',
                {
                  style: 'currency',
                  currency: 'VND',
                }
              ),
        },
      ]);
    }
  }, [
    cartLoading,
    userLoading,
    productLoading,
    users,
    products,
    carts,
    currentCart,
  ]);

  return (
    <Wrapper>
      <Title className="title" level={4}>
        Thông tin đơn hàng
      </Title>
      {userLoading === 'success' &&
      productLoading === 'success' &&
      cartLoading === 'success' ? (
          <Card>
            <Row gutter={[32, 32]}>
              <Col span={18}>
                <Form fields={formFieldsValue}>
                  <Form.Item label="Người mua" name="username">
                    <Input readOnly />
                  </Form.Item>

                  <Form.Item label="Món ăn được mua" name="productName">
                    <Input readOnly />
                  </Form.Item>

                  <Form.Item label="Số lượng mua" name="quantity">
                    <Input readOnly />
                  </Form.Item>

                  <Form.Item label="Tổng giá đơn hàng" name="total">
                    <Input readOnly />
                  </Form.Item>
                </Form>
              </Col>
              <Col span={6} className="user-avatar">
                <Avatar size={120} src={currentCart?.avatar}>
                  {currentCart?.avatar
                    ? ''
                    : currentCart?.username?.charAt(0)?.toUpperCase()}
                </Avatar>
              </Col>
            </Row>

            <div className="back">
              <Link to={'/app/admin/carts'}>
                <Button type="primary" size="large">
                Quay lại
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <Spin />
        )}
    </Wrapper>
  );
};

export default CartInfo;
