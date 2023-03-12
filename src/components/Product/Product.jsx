import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useParams } from 'react-router-dom';
import { getProductReviews } from './productReviewSlice';
import { getProducts } from './productSlice';
import {
  AddReviewWrapper,
  BannerWrapper,
  DescriptionWrapper,
  ProductInfo,
  RelatedProductsWrapper,
  ReviewWrapper,
} from './styles';
import {
  Avatar,
  Button,
  Col,
  Form,
  Image,
  Input,
  Pagination,
  Row,
  Spin,
  Typography,
} from 'antd';
import ReactStars from 'react-rating-stars-component';
import {
  EyeOutlined,
  MinusOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { getUsers } from '../Profile/profileSlice';
import moment from 'moment';
import { auth } from '../../firebase/config';
import { addDocument } from '../../firebase/services';
import { addOrder } from '../Cart/cartSlice';
import { toggleHiddenLogin } from '../Login/loginSlice';

const { Text, Title, Paragraph } = Typography;
const { TextArea } = Input;

const Product = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProducts());
    dispatch(getProductReviews());
    dispatch(getUsers());
  }, [dispatch]);

  const { products, productLoading } = useSelector((state) => state.products);
  const { productReviewLoading, productReviews } = useSelector(
    (state) => state.productReviews
  );
  const { userLoading, users } = useSelector((state) => state.users);
  const { isLogged } = useSelector((state) => state.login);
  const { id } = useParams();
  let location = useLocation();
  const { cartsLocalStorage } = useSelector((state) => state.carts);

  // states
  const [currentProduct, setCurrentProduct] = useState({});
  const [productsOther, setProductsOther] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [rateStars, setRateStars] = useState(0);
  const [currentPreviews, setCurrentPreviews] = useState([]);
  const [isReviewed, setIsReviewed] = useState(false);

  useEffect(() => {
    if (
      productLoading === 'success' &&
      productReviewLoading === 'success' &&
      products?.length > 0 &&
      productReviews?.length >= 0
    ) {
      setCurrentProduct(
        products
          ?.map((product) => ({
            ...product,
            avgRating:
              productReviews?.length > 0 &&
              productReviews?.filter(
                (productReview) =>
                  productReview.productId === product.productId &&
                  productReview.removed === false
              )?.length > 0
                ? Math.round(
                  productReviews
                    ?.filter(
                      (productReview) =>
                        productReview.productId === product.productId &&
                          productReview.removed === false
                    )
                    ?.reduce((pre, cur) => pre + cur.rating, 0) /
                      productReviews?.filter(
                        (productReview) =>
                          productReview.productId === product.productId &&
                          productReview.removed === false
                      )?.length
                )
                : 0,
          }))
          ?.find((product) => product.id === id)
      );
    }
  }, [
    productLoading,
    products,
    productReviewLoading,
    productReviews,
    id,
    location,
  ]);

  useEffect(() => {
    if (
      productLoading === 'success' &&
      productReviewLoading === 'success' &&
      products?.length > 0 &&
      productReviews?.length >= 0 &&
      userLoading === 'success' &&
      users.length > 0
    ) {
      setCurrentPreviews(
        productReviews
          ?.filter(
            (productReview) =>
              productReview.productId === currentProduct?.productId &&
              productReview.removed === false
          )
          ?.map((productReview) => ({
            ...productReview,
            username: users?.find((user) => user.uid === productReview.userId)
              ?.displayName,
            avatar: users?.find((user) => user.uid === productReview.userId)
              ?.photoURL,
          }))
      );
      setProductsOther(
        products
          ?.filter(
            (product) =>
              product?.removed === false &&
              product?.category === currentProduct?.category &&
              product?.id !== id
          )
          ?.map((product) => ({
            ...product,
            avgRating:
              productReviews?.length > 0 &&
              productReviews?.filter(
                (productReview) =>
                  productReview.productId === product.productId &&
                  productReview.removed === false
              )?.length > 0
                ? Math.round(
                  productReviews
                    ?.filter(
                      (productReview) =>
                        productReview.productId === product.productId &&
                          productReview.removed === false
                    )
                    ?.reduce((pre, cur) => pre + cur.rating, 0) /
                      productReviews?.filter(
                        (productReview) =>
                          productReview.productId === product.productId &&
                          productReview.removed === false
                      )?.length
                )
                : 0,
          }))
      );
      setIsReviewed(
        productReviews?.find(
          (productReview) =>
            productReview.productId === currentProduct?.productId &&
            productReview.removed === false &&
            productReview.userId === auth.currentUser?.uid
        )
          ? true
          : false
      );
    }
  }, [
    products,
    productLoading,
    productReviews,
    currentProduct,
    productReviewLoading,
    id,
    users,
    userLoading,
  ]);

  useEffect(() => {
    document.title = `${currentProduct?.name} - Burger King`;
    window.scrollTo(0, 0);
  }, [currentProduct]);

  const [form] = Form.useForm();

  // config pagination
  const numEachPage = 4;
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(numEachPage);
  const handlePaginationChange = (current) => {
    setMin((current - 1) * numEachPage);
    setMax(current * numEachPage);
  };

  // handle change rating
  const handleChangeRating = (newRating) => {
    setRateStars(newRating);
  };

  // handle add review
  const addReviewSubmit = () => {
    try {
      const { review } = form.getFieldValue();
      const payload = {
        userId: auth.currentUser?.uid,
        productId: currentProduct?.productId,
        contents: review?.split('\n'),
        rating: rateStars,
        removed: false,
      };
      addDocument('productReviews', payload)
        .then(() => {
          setCurrentPreviews([
            ...currentPreviews,
            {
              ...payload,
              createdAt: { seconds: Date.now() },
              username: users?.find((user) => user.uid === payload.userId)
                ?.displayName,
              avatar: users?.find((user) => user.uid === payload.userId)
                ?.photoURL,
            },
          ]);
          setRateStars(0);
          form.resetFields();
          setIsReviewed(true);
        })
        .catch((error) => {
          console.log(error);
          alert(error);
        });
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  // handle add current product to cart
  const handleAddCurrentProductToCart = () => {
    if (isLogged) {
      try {
        let carts = cartsLocalStorage;
        if (
          carts?.length > 0 &&
          carts?.find((cart) => cart.productId === currentProduct?.productId)
        ) {
          let currentCart = carts?.find(
            (cart) => cart.productId === currentProduct?.productId
          );
          if (
            currentCart?.quantity + quantity ===
            products?.find(
              (product) => product.productId === currentProduct?.productId
            )?.quantityRemaining
          ) {
            alert('Số lượng còn không đủ');
          } else {
            carts = carts?.map((cart) => {
              if (cart.productId === currentProduct?.productId) {
                return { ...cart, quantity: cart.quantity + quantity };
              }
              return cart;
            });
            localStorage.setItem('carts', JSON.stringify(carts));
          }
        } else {
          carts = [
            ...carts,
            {
              userId: auth.currentUser.uid,
              productId: currentProduct?.productId,
              quantity,
              paymentStatus: false,
            },
          ];
          localStorage.setItem('carts', JSON.stringify(carts));
        }
        setQuantity(1);
        alert('Đã thêm món ăn vào giỏ hàng');
        dispatch(addOrder(carts));
      } catch (error) {
        console.log(error);
        alert(error);
      }
    } else {
      dispatch(toggleHiddenLogin(false));
    }
  };

  // handle add product to cart
  const handleAddProductToCart = (productId) => {
    if (isLogged) {
      try {
        let carts = cartsLocalStorage;
        if (
          carts?.length > 0 &&
          carts?.find((cart) => cart.productId === productId)
        ) {
          let currentCart = carts?.find((cart) => cart.productId === productId);
          if (
            currentCart?.quantity ===
            products?.find((product) => product.productId === productId)
              ?.quantityRemaining
          ) {
            alert('Số lượng còn không đủ');
          } else {
            carts = carts?.map((cart) => {
              if (cart.productId === productId) {
                return { ...cart, quantity: cart.quantity + 1 };
              }
              return cart;
            });
            localStorage.setItem('carts', JSON.stringify(carts));
          }
        } else {
          carts = [
            ...carts,
            {
              userId: auth.currentUser.uid,
              productId,
              quantity: 1,
              paymentStatus: false,
            },
          ];
          localStorage.setItem('carts', JSON.stringify(carts));
        }
        alert('Đã thêm món ăn vào giỏ hàng');
        dispatch(addOrder(carts));
      } catch (error) {
        console.log(error);
        alert(error);
      }
    } else {
      dispatch(toggleHiddenLogin(false));
    }
  };

  return (
    <>
      <BannerWrapper>
        <div className="banner">
          <div className="content-wrapper">
            <div className="navigate">
              <Link to="/">Trang chủ</Link>
              <Text> / </Text>
              <Link to="/products">Thực đơn</Link>
              <Text> / Chi tiết sản phẩm</Text>
            </div>
            <Title level={1} className="title">
              {currentProduct?.name}
            </Title>
            <Paragraph className="content">
              Một bữa ăn đầy đủ chất dinh dưỡng cho bạn sức khỏe tốt, sự dẻo
              dai, và thân hình đúng chuẩn. Trong xã hội hiện đại, mọi thứ được
              tối giản đáng kể, và các món ăn cũng vậy.
            </Paragraph>
          </div>
        </div>
      </BannerWrapper>

      {productLoading === 'success' &&
      productReviewLoading === 'success' &&
      userLoading === 'success' ? (
          <>
            <ProductInfo>
              <div className="container">
                <div className="top-info">
                  <Row gutter={[32, 32]}>
                    <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                      <Image src={currentProduct?.photoURL} width="100%" />
                    </Col>
                    <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                      <Title level={2}>{currentProduct?.name}</Title>
                      <div className="rate-wrapper">
                        <ReactStars
                          count={5}
                          size={25}
                          activeColor="#ffa27e"
                          value={currentProduct?.avgRating}
                          edit={false}
                        />
                        <Text>({currentPreviews?.length} đánh giá)</Text>
                      </div>
                      <Text>
                        {currentProduct?.price?.toLocaleString('vi-vn', {
                          style: 'currency',
                          currency: 'VND',
                        })}
                      </Text>
                      <div className="quantity-change-wrapper">
                        <div className="quantity-change">
                          <Text className="quantity">{quantity}</Text>
                          <div className="btn-wrapper">
                            <Button
                              type="default"
                              onClick={() => setQuantity(quantity + 1)}
                              disabled={
                                cartsLocalStorage?.find(
                                  (cart) =>
                                    cart.productId === currentProduct?.productId
                                )?.quantity > 0
                                  ? cartsLocalStorage?.find(
                                    (cart) =>
                                      cart.productId ===
                                      currentProduct?.productId
                                  )?.quantity +
                                    quantity -
                                    1 ===
                                  currentProduct?.quantityRemaining
                                  : quantity === currentProduct?.quantityRemaining
                              }
                            >
                              <PlusOutlined />
                            </Button>
                            <Button
                              type="default"
                              disabled={quantity === 1}
                              onClick={() => setQuantity(quantity - 1)}
                            >
                              <MinusOutlined />
                            </Button>
                          </div>
                        </div>
                        <div className="btn-add">
                          <Button
                            type="primary"
                            onClick={handleAddCurrentProductToCart}
                            disabled={
                              cartsLocalStorage?.find(
                                (cart) =>
                                  cart.productId === currentProduct?.productId
                              )?.quantity === currentProduct?.quantityRemaining
                            }
                          >
                          Thêm vào giỏ hàng
                          </Button>
                        </div>
                      </div>
                      <Text>Phân loại: {currentProduct?.category}</Text>
                    </Col>
                  </Row>
                </div>
              </div>
            </ProductInfo>

            <DescriptionWrapper>
              <div className="container">
                <Title level={4}>Mô tả</Title>
                <Text>{currentProduct?.description?.join('\n')}</Text>
              </div>
            </DescriptionWrapper>

            <ReviewWrapper>
              <div className="container">
                <Title level={4}>Đánh giá ({currentPreviews?.length})</Title>
                {currentPreviews?.length > 0 ? (
                  currentPreviews?.map((preview) => (
                    <div className="review-wrapper" key={preview?.id}>
                      <Avatar size={60} src={preview?.avatar}>
                        {preview?.avatar
                          ? ''
                          : preview?.username?.charAt(0)?.toUpperCase()}
                      </Avatar>
                      <div className="review">
                        <div className="top">
                          <Text className="username">{preview?.username}</Text>
                          <Text className="time">
                            {moment(preview?.createdAt?.seconds * 1000).format(
                              'DD-MM-YYYY'
                            )}
                          </Text>
                        </div>
                        <ReactStars
                          count={5}
                          size={25}
                          color2={'#ffa27e'}
                          value={preview?.rating}
                          edit={false}
                        />
                        <div className="comments">
                          {preview?.contents?.map((review, index) => (
                            <Text key={index}>{review}</Text>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <Text className="no-preview">Chưa có đánh giá nào</Text>
                )}
              </div>
            </ReviewWrapper>

            <AddReviewWrapper>
              <div className="container">
                <Title level={4}>Thêm đánh giá</Title>
                {isLogged && !isReviewed ? (
                  <Form
                    form={form}
                    onFinish={addReviewSubmit}
                    name="add-review"
                    className="add-review-form"
                  >
                    <Form.Item label="Đánh giá của bạn">
                      <ReactStars
                        count={5}
                        size={25}
                        color2={'#ffa27e'}
                        value={rateStars}
                        onChange={handleChangeRating}
                      />
                    </Form.Item>
                    <Form.Item
                      name="review"
                      rules={[
                        {
                          required: true,
                          message: 'Vui lòng nhập trường này!',
                        },
                      ]}
                    >
                      <TextArea rows={4} placeholder="Đánh giá" />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        size="large"
                        type="primary"
                        htmlType="submit"
                        className="add-review-btn"
                      >
                      Đánh giá
                      </Button>
                    </Form.Item>
                  </Form>
                ) : (
                  <Text className="require-login">
                  Có vẻ như bạn chưa đăng nhập hoặc đã đánh giá món ăn này rồi
                  </Text>
                )}
              </div>
            </AddReviewWrapper>

            <RelatedProductsWrapper>
              <div className="container">
                <Title level={4}>Món ngon liên quan</Title>
                <Row gutter={[16, 32]}>
                  {productsOther?.length > 0 &&
                  productsOther?.slice(min, max)?.map((product) => (
                    <Col
                      key={product?.id}
                      xl={6}
                      lg={8}
                      md={12}
                      sm={24}
                      xs={24}
                    >
                      <div className="product-wrapper">
                        <Image
                          src={product?.photoURL}
                          width="100%"
                          height="300px"
                        />
                        <div className="info-wrapper">
                          <div className="info">
                            <Text>
                              {product?.name?.length < 14
                                ? product?.name
                                : product?.name?.substring(0, 14) + '...'}
                            </Text>
                            <Text>
                              {(product?.price).toLocaleString('vi-vn', {
                                style: 'currency',
                                currency: 'VND',
                              })}
                            </Text>
                          </div>
                          <div className="footer">
                            <ReactStars
                              count={5}
                              size={25}
                              activeColor="#ffa27e"
                              value={product?.avgRating}
                              edit={false}
                            />
                            <div className="icon-wrapper">
                              <div className="icon shopping-cart">
                                <ShoppingCartOutlined
                                  onClick={() =>
                                    handleAddProductToCart(product?.productId)
                                  }
                                />
                              </div>
                              <Link
                                to={`/products/${product?.id}`}
                                className="icon eye"
                              >
                                <EyeOutlined />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
                <div className="pagination">
                  {productsOther?.length > 0 ? (
                    <Pagination
                      pageSize={numEachPage}
                      defaultCurrent={1}
                      total={productsOther.length}
                      onChange={handlePaginationChange}
                    />
                  ) : (
                    <Text className="no-other-products">
                    Món ăn cùng loại tạm thời hết
                    </Text>
                  )}
                </div>
              </div>
            </RelatedProductsWrapper>
          </>
        ) : (
          <Spin />
        )}
    </>
  );
};

export default Product;
