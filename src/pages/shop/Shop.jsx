import React, { useEffect, useState } from 'react';
import {
  Col,
  Menu,
  Pagination,
  Row,
  Typography,
  Image,
  Select,
  Spin,
} from 'antd';
import { Link } from 'react-router-dom';
import { BannerWrapper, ContainerWrapper } from './styles';
import { EyeOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import ReactStars from 'react-rating-stars-component';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../../components/Product/productSlice';
import { getProductReviews } from '../../components/Product/productReviewSlice';
import { auth } from '../../firebase/config';
import { addOrder } from '../../components/Cart/cartSlice';
import { toggleHiddenLogin } from '../../components/Login/loginSlice';

const { Paragraph, Title, Text } = Typography;
const { Option } = Select;

const Shop = () => {
  useEffect(() => {
    document.title = 'Thực đơn - Burger King';
    window.scrollTo(0, 0);
  }, []);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProducts());
    dispatch(getProductReviews());
  }, [dispatch]);

  const { products, productLoading } = useSelector((state) => state.products);
  const { productReviewLoading, productReviews } = useSelector(
    (state) => state.productReviews
  );
  const { cartsLocalStorage } = useSelector((state) => state.carts);
  const { isLogged } = useSelector((state) => state.login);

  // states
  const [productsPreview, setProductsPreview] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortFilter, setSortFilter] = useState('default');

  useEffect(() => {
    if (productLoading === 'success' && productReviewLoading === 'success') {
      if (categoryFilter === 'all' && sortFilter !== 'default') {
        switch (sortFilter) {
          case 'price_desc':
            setProductsPreview(
              products
                ?.filter((product) => product?.removed === false)
                ?.map((product) => ({
                  ...product,
                  avgRating:
                    productReviews?.length > 0 &&
                    productReviews?.filter(
                      (productReview) =>
                        productReview.productId === product.productId
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
                ?.sort(
                  (productFirst, productSecond) =>
                    productSecond.price - productFirst.price
                )
                ?.map((product) => product)
            );
            break;

          case 'price_increase':
            setProductsPreview(
              products
                ?.filter((product) => product?.removed === false)
                ?.map((product) => ({
                  ...product,
                  avgRating:
                    productReviews?.length > 0 &&
                    productReviews?.filter(
                      (productReview) =>
                        productReview.productId === product.productId
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
                ?.sort(
                  (productFirst, productSecond) =>
                    productFirst.price - productSecond.price
                )
                ?.map((product) => product)
            );
            break;

          case 'rate_desc':
            setProductsPreview(
              products
                ?.filter((product) => product?.removed === false)
                ?.map((product) => ({
                  ...product,
                  avgRating:
                    productReviews?.length > 0 &&
                    productReviews?.filter(
                      (productReview) =>
                        productReview.productId === product.productId
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
                ?.sort(
                  (productFirst, productSecond) =>
                    productSecond.avgRating - productFirst.avgRating
                )
                ?.map((product) => product)
            );
            break;

          case 'rate_increase':
            setProductsPreview(
              products
                ?.filter((product) => product?.removed === false)
                ?.map((product) => ({
                  ...product,
                  avgRating:
                    productReviews?.length > 0 &&
                    productReviews?.filter(
                      (productReview) =>
                        productReview.productId === product.productId
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
                ?.sort(
                  (productFirst, productSecond) =>
                    productFirst.avgRating - productSecond.avgRating
                )
                ?.map((product) => product)
            );
            break;

          default:
            break;
        }
      } else if (categoryFilter !== 'all' && sortFilter === 'default') {
        setProductsPreview(
          products
            ?.filter(
              (product) =>
                product?.removed === false &&
                product.category === categoryFilter
            )
            ?.map((product) => ({
              ...product,
              avgRating:
                productReviews?.length > 0 &&
                productReviews?.filter(
                  (productReview) =>
                    productReview.productId === product.productId
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
      } else if (categoryFilter !== 'all' && sortFilter !== 'default') {
        switch (sortFilter) {
          case 'price_desc':
            setProductsPreview(
              products
                ?.filter(
                  (product) =>
                    product?.removed === false &&
                    product.category === categoryFilter
                )
                ?.map((product) => ({
                  ...product,
                  avgRating:
                    productReviews?.length > 0 &&
                    productReviews?.filter(
                      (productReview) =>
                        productReview.productId === product.productId
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
                ?.sort(
                  (productFirst, productSecond) =>
                    productSecond.price - productFirst.price
                )
                ?.map((product) => product)
            );
            break;

          case 'price_increase':
            setProductsPreview(
              products
                ?.filter(
                  (product) =>
                    product?.removed === false &&
                    product.category === categoryFilter
                )
                ?.map((product) => ({
                  ...product,
                  avgRating:
                    productReviews?.length > 0 &&
                    productReviews?.filter(
                      (productReview) =>
                        productReview.productId === product.productId
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
                ?.sort(
                  (productFirst, productSecond) =>
                    productFirst.price - productSecond.price
                )
                ?.map((product) => product)
            );
            break;

          case 'rate_desc':
            setProductsPreview(
              products
                ?.filter(
                  (product) =>
                    product?.removed === false &&
                    product.category === categoryFilter
                )
                ?.map((product) => ({
                  ...product,
                  avgRating:
                    productReviews?.length > 0 &&
                    productReviews?.filter(
                      (productReview) =>
                        productReview.productId === product.productId
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
                ?.sort(
                  (productFirst, productSecond) =>
                    productSecond.avgRating - productFirst.avgRating
                )
                ?.map((product) => product)
            );
            break;

          case 'rate_increase':
            setProductsPreview(
              products
                ?.filter(
                  (product) =>
                    product?.removed === false &&
                    product.category === categoryFilter
                )
                ?.map((product) => ({
                  ...product,
                  avgRating:
                    productReviews?.length > 0 &&
                    productReviews?.filter(
                      (productReview) =>
                        productReview.productId === product.productId
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
                ?.sort(
                  (productFirst, productSecond) =>
                    productFirst.avgRating - productSecond.avgRating
                )
                ?.map((product) => product)
            );
            break;

          default:
            break;
        }
      } else {
        setProductsPreview(
          products
            ?.filter((product) => product?.removed === false)
            ?.map((product) => ({
              ...product,
              avgRating:
                productReviews?.length > 0 &&
                productReviews?.filter(
                  (productReview) =>
                    productReview.productId === product.productId
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
      }
    }
  }, [
    products,
    productLoading,
    productReviewLoading,
    productReviews,
    categoryFilter,
    sortFilter,
  ]);

  // config menu filter
  const getMenuItem = (label, key, icon, children, type) => {
    return {
      label,
      key,
      icon,
      children,
      type,
    };
  };
  const categoryItems = [
    getMenuItem('Tất cả', 'all'),
    getMenuItem('Combo', 'Combo'),
    getMenuItem('Burger', 'Burger'),
    getMenuItem('Gà rán', 'Gà rán'),
    getMenuItem('Pizza', 'Pizza'),
    getMenuItem('Món phụ', 'Món phụ'),
  ];

  // config products pagination
  const numEachPage = 8;
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(numEachPage);
  const handlePaginationChange = (current) => {
    setMin((current - 1) * numEachPage);
    setMax(current * numEachPage);
  };

  // handle filter products menu click
  const handleFilterProductsMenuClick = (e) => {
    setCategoryFilter(e.key);
  };

  // handle filter products select click
  const handleFilterProductsSelectClick = (value) => {
    setSortFilter(value);
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
              <Text> / Thực đơn</Text>
            </div>
            <Title level={1} className="title">
              Thực đơn của chúng tôi
            </Title>
            <Paragraph className="content">
              Đồ ăn nhanh rẻ và ngon. Thực đơn đa dạng với những suất ăn lớn và
              sắp đồ rất đầy đủ, đặc biệt là phô mai.
            </Paragraph>
          </div>
        </div>
      </BannerWrapper>

      {productLoading === 'success' && productReviewLoading === 'success' ? (
        <>
          <ContainerWrapper>
            <div className="container">
              <div className="filter-wrapper">
                <Menu
                  mode="horizontal"
                  items={categoryItems}
                  defaultSelectedKeys={['all']}
                  className="category-menu"
                  onClick={handleFilterProductsMenuClick}
                />
                <Select
                  defaultValue="default"
                  size="large"
                  onChange={handleFilterProductsSelectClick}
                >
                  <Option value="default">Mặc định</Option>
                  <Option value="price_desc">Giá giảm dần</Option>
                  <Option value="price_increase">Giá tăng dần</Option>
                  <Option value="rate_desc">Đánh giá giảm dần</Option>
                  <Option value="rate_increase">Đánh giá tăng dần</Option>
                </Select>
              </div>

              <Row gutter={[16, 32]}>
                <Col
                  // key={product?.id}
                  xl={6}
                  lg={8}
                  md={12}
                  sm={24}
                  xs={24}
                >
                  <div className="product-wrapper">
                    <Image
                      src="https://firebasestorage.googleapis.com/v0/b/fast-food-303bb.appspot.com/o/products%2Fc503b184-28ee-483d-bc8b-0d721573596e.jpg?alt=media&token=586cd18d-929e-452c-b113-d7e48d3d1669"
                      width="100%"
                      height="300px"
                    />
                    <div className="info-wrapper">
                      <div className="info">
                        <Text>abc</Text>
                        <Text>200000 VND</Text>
                      </div>
                      <div className="footer">
                        <ReactStars
                          count={5}
                          size={25}
                          activeColor="#ffa27e"
                          // value={product?.avgRating}
                          edit={false}
                        />
                        <div className="icon-wrapper">
                          <div className="icon shopping-cart">
                            <ShoppingCartOutlined
                            // onClick={() =>
                            //   handleAddProductToCart(product?.productId)
                            // }
                            />
                          </div>
                          <Link to="/abc" className="icon eye">
                            <EyeOutlined />
                          </Link>
                          {/* <div className="icon heart">
                            <HeartOutlined />
                          </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col
                  // key={product?.id}
                  xl={6}
                  lg={8}
                  md={12}
                  sm={24}
                  xs={24}
                >
                  <div className="product-wrapper">
                    <Image
                      src="https://firebasestorage.googleapis.com/v0/b/fast-food-303bb.appspot.com/o/products%2Fc503b184-28ee-483d-bc8b-0d721573596e.jpg?alt=media&token=586cd18d-929e-452c-b113-d7e48d3d1669"
                      width="100%"
                      height="300px"
                    />
                    <div className="info-wrapper">
                      <div className="info">
                        <Text>abc</Text>
                        <Text>200000 VND</Text>
                      </div>
                      <div className="footer">
                        <ReactStars
                          count={5}
                          size={25}
                          activeColor="#ffa27e"
                          // value={product?.avgRating}
                          edit={false}
                        />
                        <div className="icon-wrapper">
                          <div className="icon shopping-cart">
                            <ShoppingCartOutlined
                            // onClick={() =>
                            //   handleAddProductToCart(product?.productId)
                            // }
                            />
                          </div>
                          <Link to="/abc" className="icon eye">
                            <EyeOutlined />
                          </Link>
                          {/* <div className="icon heart">
                            <HeartOutlined />
                          </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col
                  // key={product?.id}
                  xl={6}
                  lg={8}
                  md={12}
                  sm={24}
                  xs={24}
                >
                  <div className="product-wrapper">
                    <Image
                      src="https://firebasestorage.googleapis.com/v0/b/fast-food-303bb.appspot.com/o/products%2Fc503b184-28ee-483d-bc8b-0d721573596e.jpg?alt=media&token=586cd18d-929e-452c-b113-d7e48d3d1669"
                      width="100%"
                      height="300px"
                    />
                    <div className="info-wrapper">
                      <div className="info">
                        <Text>abc</Text>
                        <Text>200000 VND</Text>
                      </div>
                      <div className="footer">
                        <ReactStars
                          count={5}
                          size={25}
                          activeColor="#ffa27e"
                          // value={product?.avgRating}
                          edit={false}
                        />
                        <div className="icon-wrapper">
                          <div className="icon shopping-cart">
                            <ShoppingCartOutlined
                            // onClick={() =>
                            //   handleAddProductToCart(product?.productId)
                            // }
                            />
                          </div>
                          <Link to="/abc" className="icon eye">
                            <EyeOutlined />
                          </Link>
                          {/* <div className="icon heart">
                            <HeartOutlined />
                          </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col
                  // key={product?.id}
                  xl={6}
                  lg={8}
                  md={12}
                  sm={24}
                  xs={24}
                >
                  <div className="product-wrapper">
                    <Image
                      src="https://firebasestorage.googleapis.com/v0/b/fast-food-303bb.appspot.com/o/products%2Fc503b184-28ee-483d-bc8b-0d721573596e.jpg?alt=media&token=586cd18d-929e-452c-b113-d7e48d3d1669"
                      width="100%"
                      height="300px"
                    />
                    <div className="info-wrapper">
                      <div className="info">
                        <Text>abc</Text>
                        <Text>200000 VND</Text>
                      </div>
                      <div className="footer">
                        <ReactStars
                          count={5}
                          size={25}
                          activeColor="#ffa27e"
                          // value={product?.avgRating}
                          edit={false}
                        />
                        <div className="icon-wrapper">
                          <div className="icon shopping-cart">
                            <ShoppingCartOutlined
                            // onClick={() =>
                            //   handleAddProductToCart(product?.productId)
                            // }
                            />
                          </div>
                          <Link to="/abc" className="icon eye">
                            <EyeOutlined />
                          </Link>
                          {/* <div className="icon heart">
                            <HeartOutlined />
                          </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col
                  // key={product?.id}
                  xl={6}
                  lg={8}
                  md={12}
                  sm={24}
                  xs={24}
                >
                  <div className="product-wrapper">
                    <Image
                      src="https://firebasestorage.googleapis.com/v0/b/fast-food-303bb.appspot.com/o/products%2Fc503b184-28ee-483d-bc8b-0d721573596e.jpg?alt=media&token=586cd18d-929e-452c-b113-d7e48d3d1669"
                      width="100%"
                      height="300px"
                    />
                    <div className="info-wrapper">
                      <div className="info">
                        <Text>abc</Text>
                        <Text>200000 VND</Text>
                      </div>
                      <div className="footer">
                        <ReactStars
                          count={5}
                          size={25}
                          activeColor="#ffa27e"
                          // value={product?.avgRating}
                          edit={false}
                        />
                        <div className="icon-wrapper">
                          <div className="icon shopping-cart">
                            <ShoppingCartOutlined
                            // onClick={() =>
                            //   handleAddProductToCart(product?.productId)
                            // }
                            />
                          </div>
                          <Link to="/abc" className="icon eye">
                            <EyeOutlined />
                          </Link>
                          {/* <div className="icon heart">
                            <HeartOutlined />
                          </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col
                  // key={product?.id}
                  xl={6}
                  lg={8}
                  md={12}
                  sm={24}
                  xs={24}
                >
                  <div className="product-wrapper">
                    <Image
                      src="https://firebasestorage.googleapis.com/v0/b/fast-food-303bb.appspot.com/o/products%2Fc503b184-28ee-483d-bc8b-0d721573596e.jpg?alt=media&token=586cd18d-929e-452c-b113-d7e48d3d1669"
                      width="100%"
                      height="300px"
                    />
                    <div className="info-wrapper">
                      <div className="info">
                        <Text>abc</Text>
                        <Text>200000 VND</Text>
                      </div>
                      <div className="footer">
                        <ReactStars
                          count={5}
                          size={25}
                          activeColor="#ffa27e"
                          // value={product?.avgRating}
                          edit={false}
                        />
                        <div className="icon-wrapper">
                          <div className="icon shopping-cart">
                            <ShoppingCartOutlined
                            // onClick={() =>
                            //   handleAddProductToCart(product?.productId)
                            // }
                            />
                          </div>
                          <Link to="/abc" className="icon eye">
                            <EyeOutlined />
                          </Link>
                          {/* <div className="icon heart">
                            <HeartOutlined />
                          </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col
                  // key={product?.id}
                  xl={6}
                  lg={8}
                  md={12}
                  sm={24}
                  xs={24}
                >
                  <div className="product-wrapper">
                    <Image
                      src="https://firebasestorage.googleapis.com/v0/b/fast-food-303bb.appspot.com/o/products%2Fc503b184-28ee-483d-bc8b-0d721573596e.jpg?alt=media&token=586cd18d-929e-452c-b113-d7e48d3d1669"
                      width="100%"
                      height="300px"
                    />
                    <div className="info-wrapper">
                      <div className="info">
                        <Text>abc</Text>
                        <Text>200000 VND</Text>
                      </div>
                      <div className="footer">
                        <ReactStars
                          count={5}
                          size={25}
                          activeColor="#ffa27e"
                          // value={product?.avgRating}
                          edit={false}
                        />
                        <div className="icon-wrapper">
                          <div className="icon shopping-cart">
                            <ShoppingCartOutlined
                            // onClick={() =>
                            //   handleAddProductToCart(product?.productId)
                            // }
                            />
                          </div>
                          <Link to="/abc" className="icon eye">
                            <EyeOutlined />
                          </Link>
                          {/* <div className="icon heart">
                            <HeartOutlined />
                          </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col
                  // key={product?.id}
                  xl={6}
                  lg={8}
                  md={12}
                  sm={24}
                  xs={24}
                >
                  <div className="product-wrapper">
                    <Image
                      src="https://firebasestorage.googleapis.com/v0/b/fast-food-303bb.appspot.com/o/products%2Fc503b184-28ee-483d-bc8b-0d721573596e.jpg?alt=media&token=586cd18d-929e-452c-b113-d7e48d3d1669"
                      width="100%"
                      height="300px"
                    />
                    <div className="info-wrapper">
                      <div className="info">
                        <Text>abc</Text>
                        <Text>200000 VND</Text>
                      </div>
                      <div className="footer">
                        <ReactStars
                          count={5}
                          size={25}
                          activeColor="#ffa27e"
                          // value={product?.avgRating}
                          edit={false}
                        />
                        <div className="icon-wrapper">
                          <div className="icon shopping-cart">
                            <ShoppingCartOutlined
                            // onClick={() =>
                            //   handleAddProductToCart(product?.productId)
                            // }
                            />
                          </div>
                          <Link to="/abc" className="icon eye">
                            <EyeOutlined />
                          </Link>
                          {/* <div className="icon heart">
                            <HeartOutlined />
                          </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>

              <div className="pagination">
                <Pagination
                  pageSize={numEachPage}
                  defaultCurrent={1}
                  total={productsPreview.length}
                  onChange={handlePaginationChange}
                />
              </div>
            </div>
          </ContainerWrapper>
        </>
      ) : (
        <Spin />
      )}
    </>
  );
};

export default Shop;
