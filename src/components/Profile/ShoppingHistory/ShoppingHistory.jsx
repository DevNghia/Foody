import React, { useEffect, useState } from 'react';
import { Avatar, Card, Table, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getCarts } from '../../Cart/cartSlice';
import { getProducts } from '../../Product/productSlice';
import moment from 'moment';
import { Wrapper } from './styles';

const { Text } = Typography;

const ShoppingHistory = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCarts());
    dispatch(getProducts());
  }, [dispatch]);

  const { cartLoading, carts } = useSelector((state) => state.carts);
  const { productLoading, products } = useSelector((state) => state.products);

  // states
  const [cartsPreview, setCartsPreview] = useState([]);

  useEffect(() => {
    if (cartLoading === 'success' && productLoading === 'success') {
      setCartsPreview(
        carts?.map((cart) => ({
          ...cart,
          productName: products?.find(
            (product) => product.productId === cart.productId
          )?.name,
          photoURL: products?.find(
            (product) => product.productId === cart.productId
          )?.photoURL,
          price: products?.find(
            (product) => product.productId === cart.productId
          )?.price,
        }))
      );
    }
  }, [cartLoading, carts, products, productLoading]);

  // config table
  const columns = [
    {
      title: 'Món ăn',
      dataIndex: 'productName',
      key: 'product',
      render: (productName, record) => (
        <div className="product_info">
          <Avatar size="large" src={record.photoURL}></Avatar>
          <Text className="product_name">
            {productName?.length < 30
              ? productName
              : productName?.substring(0, 30) + '...'}
          </Text>
        </div>
      ),
    },
    {
      title: 'Thời gian mua',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt, record) => (
        <>
          <Text className="time-order">
            {moment(createdAt?.seconds * 1000).format('DD-MM-YYYY')}
          </Text>
        </>
      ),
    },
    {
      title: 'Tổng giá đơn hàng',
      dataIndex: 'price',
      key: 'price',
      render: (price, record) => (
        <>
          <Text className="total_price">
            {record?.quantity >= 3
              ? ((price * record.quantity * 90) / 100).toLocaleString('vi-vn', {
                style: 'currency',
                currency: 'VND',
              })
              : (price * record.quantity).toLocaleString('vi-vn', {
                style: 'currency',
                currency: 'VND',
              })}
          </Text>
        </>
      ),
    },
  ];

  return (
    <Wrapper>
      {cartsPreview?.length > 0 ? (
        <Card title="Lịch sử mua hàng">
          <Table
            columns={columns}
            dataSource={cartsPreview}
            loading={productLoading === 'pending' || cartLoading === 'pending'}
          />
        </Card>
      ) : (
        <Text className="no-order">Bạn chưa mua hàng lần nào</Text>
      )}
    </Wrapper>
  );
};

export default ShoppingHistory;
