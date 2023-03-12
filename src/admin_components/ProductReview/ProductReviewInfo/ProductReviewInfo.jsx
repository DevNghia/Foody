import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers } from '../../../components/Profile/profileSlice';
import { getProductReviews } from '../../../components/Product/productReviewSlice';
import { getProducts } from '../../../components/Product/productSlice';
import { Link, useParams } from 'react-router-dom';
import { Wrapper } from './styles';
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

const { Title } = Typography;
const { TextArea } = Input;

const ProductReviewInfo = () => {
  useEffect(() => {
    document.title = 'Thông tin đánh giá món ăn - Food App';
  }, []);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProductReviews());
    dispatch(getUsers());
    dispatch(getProducts());
  }, [dispatch]);

  const { productReviewLoading, productReviews } = useSelector(
    (state) => state.productReviews
  );
  const { productLoading, products } = useSelector((state) => state.products);
  const { userLoading, users } = useSelector((state) => state.users);
  const { id } = useParams();

  // states
  const [currentProductReview, setCurrentProductReview] = useState({});
  const [formFieldsValue, setFormFieldsValue] = useState([]);

  useEffect(() => {
    if (
      productReviewLoading === 'success' &&
      userLoading === 'success' &&
      productLoading === 'success' &&
      users.length > 0 &&
      products.length > 0 &&
      productReviews.length > 0
    ) {
      setCurrentProductReview(
        productReviews
          ?.map((productReview) => ({
            ...productReview,
            key: productReview.id,
            username: users?.find((user) => user.uid === productReview.userId)
              ?.displayName,
            avatar: users?.find((user) => user.uid === productReview.userId)
              ?.photoURL,
            productName: products?.find(
              (product) => product.productId === productReview.productId
            )?.name,
          }))
          ?.find((productReview) => productReview.id === id)
      );
    }
  }, [
    productReviewLoading,
    userLoading,
    productLoading,
    users,
    products,
    productReviews,
    id,
  ]);

  useEffect(() => {
    if (
      productReviewLoading === 'success' &&
      userLoading === 'success' &&
      productLoading === 'success' &&
      users.length > 0 &&
      products.length > 0 &&
      productReviews.length > 0
    ) {
      setFormFieldsValue([
        {
          name: ['username'],
          value: currentProductReview?.username,
        },
        {
          name: ['productName'],
          value: currentProductReview?.productName,
        },
        {
          name: ['contents'],
          value: currentProductReview?.contents?.join('\n'),
        },
        {
          name: ['rating'],
          value: currentProductReview?.rating,
        },
      ]);
    }
  }, [
    productReviewLoading,
    userLoading,
    productLoading,
    users,
    products,
    productReviews,
    currentProductReview,
  ]);

  return (
    <Wrapper>
      <Title className="title" level={4}>
        Thông tin đánh giá
      </Title>
      {userLoading === 'success' &&
      productLoading === 'success' &&
      productReviewLoading === 'success' ? (
          <Card>
            <Row gutter={[32, 32]}>
              <Col span={18}>
                <Form fields={formFieldsValue}>
                  <Form.Item label="Người đánh giá" name="username">
                    <Input readOnly />
                  </Form.Item>

                  <Form.Item label="Món ăn đánh giá" name="productName">
                    <Input readOnly />
                  </Form.Item>

                  <Form.Item label="Đánh giá" name="contents">
                    <TextArea rows={4} readOnly />
                  </Form.Item>

                  <Form.Item label="Điểm đánh giá" name="rating">
                    <Input readOnly />
                  </Form.Item>
                </Form>
              </Col>
              <Col span={6} className="user-avatar">
                <Avatar size={120} src={currentProductReview?.avatar}>
                  {currentProductReview?.avatar
                    ? ''
                    : currentProductReview?.username?.charAt(0)?.toUpperCase()}
                </Avatar>
              </Col>
            </Row>

            <div className="back">
              <Link to={'/app/admin/product-reviews'}>
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

export default ProductReviewInfo;
