import React, { useEffect, useState } from 'react';
import { Button, Col, Row, Typography, Image, Carousel, Spin } from 'antd';
import { EyeOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import {
  BannerWrapper,
  NewProductsWrapper,
  BlogsRecentlyWrapper,
  MenuListWrapper,
  FormContactWrapper,
  ButtonStyled,
} from './styles';
import ReactStars from 'react-rating-stars-component';
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
      <Carousel autoplay>
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
      </Carousel>

      <NewProductsWrapper className="container">
        <div className="title-wrapper">
          <Title level={4}>món mới</Title>
          <Text>Các món ăn mới đang được bán tại cửa hàng</Text>
        </div>
        <div className="container">
          <Row gutter={[16, 32]}>
            {productsPreview?.map((product) => (
              <Col key={product.id} xl={8} lg={8} md={12} sm={24} xs={24}>
                <div className="product-wrapper">
                  <Image src={product?.photoURL} width="100%" height="300px" />
                  <div className="info-wrapper">
                    <div className="info">
                      <Text>
                        {product?.name?.length < 16
                          ? product?.name
                          : product?.name?.substring(0, 16) + '...'}
                      </Text>
                      <Text>
                        {product?.price?.toLocaleString('vi-vn', {
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
        </div>
        <Link to="products">
          <ButtonStyled size="middle">Xem thêm</ButtonStyled>
        </Link>
      </NewProductsWrapper>

      <MenuListWrapper className="container">
        <div className="title-wrapper">
          <Title level={4}>danh mục thực đơn</Title>
          <Text>Phân loại món ăn giúp bạn dễ dàng tìm kiếm hơn</Text>
        </div>
        <div className="container">
          <Row gutter={[16, 32]}>
            {categoryOptions.map((category) => (
              <Col xl={8} lg={8} md={12} sm={24} xs={24} key={category}>
                <div className="product-wrapper">
                  <img
                    src={
                      products?.filter(
                        (product) => product.category === category
                      )[0]?.photoURL
                    }
                    alt={category}
                  />
                  <div className="middle">
                    <Text>{category}</Text>
                    <Link to={`/products/${category}`}>
                      <ButtonStyled size="middle">Xem thêm</ButtonStyled>
                    </Link>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </MenuListWrapper>

      <BlogsRecentlyWrapper className="container">
        <div className="title-wrapper">
          <Title level={4}>bài viết gần đây</Title>
          <Text>
            Những chia sẻ về các hoạt động của cửa hàng mới nhất cho bạn
          </Text>
        </div>
        <div className="container">
          <Row gutter={[16, 32]}>
            {blogsPreview?.map((blog) => (
              <Col xl={8} lg={8} md={12} sm={24} xs={24} key={blog?.id}>
                <Link to={`/blogs/${blog?.id}`}>
                  <div className="blog-image-wrapper">
                    <img src={blog?.images[0]} alt="blog" />
                  </div>
                  <div className="info-wrapper">
                    <Text className="title">
                      {blog?.title?.length < 16
                        ? blog?.title
                        : blog?.title?.substring(0, 16) + '...'}
                    </Text>
                    <Text className="description">
                      {blog?.contents?.join('\n')?.length < 50
                        ? blog?.contents?.join('\n')
                        : blog?.contents?.join('\n')?.substring(0, 50) + '...'}
                    </Text>
                  </div>
                </Link>
              </Col>
            ))}
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
