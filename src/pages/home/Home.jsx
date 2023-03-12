import React, { useEffect, useState } from 'react';
import { Button, Col, Row, Typography, Image, Carousel, Spin } from 'antd';
import Burger from '../../assets/images/burger-salmon_new__1.jpg';

import {
  EyeOutlined,
  HeartOutlined,
  LeftOutlined,
  RightOutlined,
  ShoppingCartOutlined,
  StarFilled,
  StarOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import {
  BannerWrapper,
  NewProductsWrapper,
  BlogsRecentlyWrapper,
  MenuListWrapper,
  FormContactWrapper,
  ButtonStyled,
} from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../../components/Product/productSlice';
import { getProductReviews } from '../../components/Product/productReviewSlice';
import { getBlogs } from '../../components/Blog/blogSlice';
import { auth } from '../../firebase/config';
import { addOrder } from '../../components/Cart/cartSlice';
import { toggleHiddenLogin } from '../../components/Login/loginSlice';

const { Paragraph, Title, Text } = Typography;

const categoryOptions = ['Combo', 'Burger', 'Pizza', 'Gà rán', 'Món phụ'];

const Home = () => {
  useEffect(() => {
    document.title = 'Trang chủ - Burger King';
    window.scrollTo(0, 0);
  }, []);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProducts());
    dispatch(getProductReviews());
    dispatch(getBlogs());
  }, [dispatch]);

  const { products, productLoading } = useSelector((state) => state.products);
  const { productReviewLoading, productReviews } = useSelector(
    (state) => state.productReviews
  );
  const { blogLoading, blogs } = useSelector((state) => state.blogs);
  const { isLogged } = useSelector((state) => state.login);
  const { cartsLocalStorage } = useSelector((state) => state.carts);

  // states
  const [productsPreview, setProductsPreview] = useState([]);
  const [blogsPreview, setBlogsPreview] = useState([]);

  useEffect(() => {
    if (
      productLoading === 'success' &&
      productReviewLoading === 'success' &&
      blogLoading === 'success' &&
      products?.length > 0 &&
      productReviews?.length >= 0 &&
      blogs?.length > 0
    ) {
      setProductsPreview(
        products
          ?.filter((product) => product?.removed === false)
          ?.slice(0, 6)
          ?.map((product) => ({
            ...product,
            avgRating:
              productReviews?.length > 0 &&
              productReviews?.filter(
                (productReview) => productReview.productId === product.productId
              )?.length > 0
                ? Math.round(
                    productReviews
                      ?.filter(
                        (productReview) =>
                          productReview.productId === product.productId
                      )
                      ?.reduce((pre, cur) => pre + cur.rating, 0) /
                      productReviews?.filter(
                        (productReview) =>
                          productReview.productId === product.productId
                      )?.length
                  )
                : 0,
          }))
      );
      setBlogsPreview(
        blogs?.filter((blog) => blog?.removed === false)?.slice(0, 3)
      );
    }
  }, [
    products,
    productLoading,
    productReviewLoading,
    productReviews,
    blogLoading,
    blogs,
  ]);

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

  if (
    productLoading === 'pending' ||
    productReviewLoading === 'pending' ||
    blogLoading === 'pending'
  ) {
    return <Spin />;
  }

  return (
    <>
      {/* <Carousel autoplay>
        {productsPreview?.slice(0, 3)?.map((product) => (
          <BannerWrapper key={product?.id} photoURL={product?.photoURL}>
            <div className="banner">
              <div className="content-wrapper">
                <Title level={1} className="title">
                  {product?.name?.length < 20
                    ? product?.name
                    : product?.name?.substring(0, 20) + '...'}
                </Title>
                <Paragraph className="content">
                  {product?.description?.join('\n')?.length < 100
                    ? product?.description?.join('\n')
                    : product?.description?.join('\n')?.substring(0, 100) +
                      '...'}
                </Paragraph>
                <Link to={`products/${product?.id}`} className="btn-view-more">
                  <ButtonStyled size="middle">Xem thêm</ButtonStyled>
                </Link>
              </div>
            </div>
          </BannerWrapper>
        ))}
      </Carousel> */}
      <BannerWrapper>
        <div className="banner">
          <LeftOutlined />
          <div className="content-wrapper">
            <Title level={1} className="title">
              BEST BURGERS
            </Title>
            <Paragraph className="content">
              Quisque nec libero ut sapien dictum commodo. Nam ac felis id
              libero rutrum pharetra eu non lacus. Etiam maximus euismod ex, ac
              suscipit lacus egestas in. Aenean ac tortor ut lacus ultrices
              mollis.
            </Paragraph>
            <ButtonStyled size="middle" className="btn-view-more">
              Xem thêm
            </ButtonStyled>
          </div>
          <RightOutlined />
        </div>
      </BannerWrapper>
      <NewProductsWrapper className="container">
        <div className="title-wrapper">
          <Title level={4}>món mới</Title>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore
          </Text>
        </div>
        <div className="container">
          <Row gutter={[16, 32]}>
            <Col xl={8} lg={8} md={12} sm={24} xs={24}>
              <div className="product-image-wrapper">
                <img src={Burger} alt="product" />
              </div>
              <div className="info-wrapper">
                <div className="info">
                  <Text>Gà rán</Text>
                  <Text>40.000đ</Text>
                </div>
                <div className="footer">
                  <div className="rate">
                    <StarFilled />
                    <StarFilled />
                    <StarFilled />
                    <StarFilled />
                    <StarOutlined />
                  </div>
                  <div className="icon-wrapper">
                    <div className="icon shopping-cart">
                      <ShoppingCartOutlined />
                    </div>
                    <Link to="products/id" className="icon eye">
                      <EyeOutlined />
                    </Link>
                    <div className="icon heart">
                      <HeartOutlined />
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <Col xl={8} lg={8} md={12} sm={24} xs={24}>
              <div className="product-image-wrapper">
                <img src={Burger} alt="product" />
              </div>
              <div className="info-wrapper">
                <div className="info">
                  <Text>Gà rán</Text>
                  <Text>40.000đ</Text>
                </div>
                <div className="footer">
                  <div className="rate">
                    <StarFilled />
                    <StarFilled />
                    <StarFilled />
                    <StarFilled />
                    <StarOutlined />
                  </div>
                  <div className="icon-wrapper">
                    <div className="icon shopping-cart">
                      <ShoppingCartOutlined />
                    </div>
                    <Link to="products/id" className="icon eye">
                      <EyeOutlined />
                    </Link>
                    <div className="icon heart">
                      <HeartOutlined />
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <Col xl={8} lg={8} md={12} sm={24} xs={24}>
              <div className="product-image-wrapper">
                <img src={Burger} alt="product" />
              </div>
              <div className="info-wrapper">
                <div className="info">
                  <Text>Gà rán</Text>
                  <Text>40.000đ</Text>
                </div>
                <div className="footer">
                  <div className="rate">
                    <StarFilled />
                    <StarFilled />
                    <StarFilled />
                    <StarFilled />
                    <StarOutlined />
                  </div>
                  <div className="icon-wrapper">
                    <div className="icon shopping-cart">
                      <ShoppingCartOutlined />
                    </div>
                    <Link to="products/id" className="icon eye">
                      <EyeOutlined />
                    </Link>
                    <div className="icon heart">
                      <HeartOutlined />
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <Col xl={8} lg={8} md={12} sm={24} xs={24}>
              <div className="product-image-wrapper">
                <img src={Burger} alt="product" />
              </div>
              <div className="info-wrapper">
                <div className="info">
                  <Text>Gà rán</Text>
                  <Text>40.000đ</Text>
                </div>
                <div className="footer">
                  <div className="rate">
                    <StarFilled />
                    <StarFilled />
                    <StarFilled />
                    <StarFilled />
                    <StarOutlined />
                  </div>
                  <div className="icon-wrapper">
                    <div className="icon shopping-cart">
                      <ShoppingCartOutlined />
                    </div>
                    <Link to="products/id" className="icon eye">
                      <EyeOutlined />
                    </Link>
                    <div className="icon heart">
                      <HeartOutlined />
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <Col xl={8} lg={8} md={12} sm={24} xs={24}>
              <div className="product-image-wrapper">
                <img src={Burger} alt="product" />
              </div>
              <div className="info-wrapper">
                <div className="info">
                  <Text>Gà rán</Text>
                  <Text>40.000đ</Text>
                </div>
                <div className="footer">
                  <div className="rate">
                    <StarFilled />
                    <StarFilled />
                    <StarFilled />
                    <StarFilled />
                    <StarOutlined />
                  </div>
                  <div className="icon-wrapper">
                    <div className="icon shopping-cart">
                      <ShoppingCartOutlined />
                    </div>
                    <Link to="products/id" className="icon eye">
                      <EyeOutlined />
                    </Link>
                    <div className="icon heart">
                      <HeartOutlined />
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <Col xl={8} lg={8} md={12} sm={24} xs={24}>
              <div className="product-image-wrapper">
                <img src={Burger} alt="product" />
              </div>
              <div className="info-wrapper">
                <div className="info">
                  <Text>Gà rán</Text>
                  <Text>40.000đ</Text>
                </div>
                <div className="footer">
                  <div className="rate">
                    <StarFilled />
                    <StarFilled />
                    <StarFilled />
                    <StarFilled />
                    <StarOutlined />
                  </div>
                  <div className="icon-wrapper">
                    <div className="icon shopping-cart">
                      <ShoppingCartOutlined />
                    </div>
                    <Link to="products/id" className="icon eye">
                      <EyeOutlined />
                    </Link>
                    <div className="icon heart">
                      <HeartOutlined />
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <Link to="products">
          <ButtonStyled size="middle">Xem thêm</ButtonStyled>
        </Link>
      </NewProductsWrapper>

      <MenuListWrapper className="container">
        <div className="title-wrapper">
          <Title level={4}>danh mục thực đơn</Title>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore
          </Text>
        </div>
        <div className="container">
          <Row gutter={[16, 32]}>
            <Col xl={8} lg={8} md={12} sm={24} xs={24}>
              <img src={Burger} alt="combo" />
              <div className="middle">
                <Text>Combo</Text>
                <Link to="products/category">
                  <ButtonStyled size="middle">Xem thêm</ButtonStyled>
                </Link>
              </div>
            </Col>
            <Col xl={8} lg={8} md={12} sm={24} xs={24}>
              <img src={Burger} alt="combo" />
              <div className="middle">
                <Text>Combo</Text>
                <Link to="products/category">
                  <ButtonStyled size="middle">Xem thêm</ButtonStyled>
                </Link>
              </div>
            </Col>
            <Col xl={8} lg={8} md={12} sm={24} xs={24}>
              <img src={Burger} alt="combo" />
              <div className="middle">
                <Text>Combo</Text>
                <Link to="products/category">
                  <ButtonStyled size="middle">Xem thêm</ButtonStyled>
                </Link>
              </div>
            </Col>
            <Col xl={8} lg={8} md={12} sm={24} xs={24}>
              <img src={Burger} alt="combo" />
              <div className="middle">
                <Text>Combo</Text>
                <Link to="products/category">
                  <ButtonStyled size="middle">Xem thêm</ButtonStyled>
                </Link>
              </div>
            </Col>
            <Col xl={8} lg={8} md={12} sm={24} xs={24}>
              <img src={Burger} alt="combo" />
              <div className="middle">
                <Text>Combo</Text>
                <Link to="products/category">
                  <ButtonStyled size="middle">Xem thêm</ButtonStyled>
                </Link>
              </div>
            </Col>
            <Col xl={8} lg={8} md={12} sm={24} xs={24}>
              <img src={Burger} alt="combo" />
              <div className="middle">
                <Text>Combo</Text>
                <Link to="products/category">
                  <ButtonStyled size="middle">Xem thêm</ButtonStyled>
                </Link>
              </div>
            </Col>
          </Row>
        </div>
      </MenuListWrapper>

      <BlogsRecentlyWrapper className="container">
        <div className="title-wrapper">
          <Title level={4}>bài viết gần đây</Title>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore
          </Text>
        </div>
        <div className="container">
          <Row gutter={[16, 32]}>
            <Col xl={8} lg={8} md={12} sm={24} xs={24}>
              <Link to="blogs/id">
                <div className="blog-image-wrapper">
                  <img src={Burger} alt="blog" />
                </div>
                <div className="info-wrapper">
                  <Text className="title">
                    Burger lớn phục vụ với rau cải xoăn
                  </Text>
                  <Text className="description">
                    Món ăn tuyệt vời là sự kết hợp hài hoà của burger với rau cả
                    xoăn. Hứa hẹn sẽ mang lại...
                  </Text>
                </div>
              </Link>
            </Col>
            <Col xl={8} lg={8} md={12} sm={24} xs={24}>
              <Link to="blogs/id">
                <div className="blog-image-wrapper">
                  <img src={Burger} alt="blog" />
                </div>
                <div className="info-wrapper">
                  <Text className="title">
                    Burger lớn phục vụ với rau cải xoăn
                  </Text>
                  <Text className="description">
                    Món ăn tuyệt vời là sự kết hợp hài hoà của burger với rau cả
                    xoăn. Hứa hẹn sẽ mang lại...
                  </Text>
                </div>
              </Link>
            </Col>
            <Col xl={8} lg={8} md={12} sm={24} xs={24}>
              <Link to="blogs/id">
                <div className="blog-image-wrapper">
                  <img src={Burger} alt="blog" />
                </div>
                <div className="info-wrapper">
                  <Text className="title">
                    Burger lớn phục vụ với rau cải xoăn
                  </Text>
                  <Text className="description">
                    Món ăn tuyệt vời là sự kết hợp hài hoà của burger với rau cả
                    xoăn. Hứa hẹn sẽ mang lại...
                  </Text>
                </div>
              </Link>
            </Col>
          </Row>
        </div>
        <Link to="blogs">
          <ButtonStyled size="middle">Xem thêm</ButtonStyled>
        </Link>
      </BlogsRecentlyWrapper>

      <FormContactWrapper className="container">
        <Title level={4} className="title">
          Nhận thông tin về sản phẩm mới nhất
        </Title>
        <Text className="description">
          Điền email của bạn tại đây, chúng tôi sẽ gửi thông tin và báo giá
          ngay!
        </Text>
        <div className="input-wrapper">
          <input type="text" placeholder="Nhập email" />
          <Button size="small">Gửi</Button>
        </div>
      </FormContactWrapper>
    </>
  );
};

export default Home;
