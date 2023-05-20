import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BannerWrapper, CartWrapper } from './styles';
import { Button, Typography, Table, Avatar, Card, Form, Input } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { addOrder, getCarts } from './cartSlice';
import { getProducts } from '../Product/productSlice';
import { auth } from '../../firebase/config';
import { getUsers } from '../Profile/profileSlice';
import { addDocument, updateDocument } from '../../firebase/services';
import { serverTimestamp } from 'firebase/firestore';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
const { Title, Text, Paragraph } = Typography;
let stripePromise;
const stripe = require('stripe')(
  'sk_test_51N8iKqJdzJVPgoqvcZwUHBS3ZXLEb5GHtGcpxUxF24qmEkRYi5dneAiwUXUEW9m8WtSx0a97KGgLArHnPCvGc5Yo008BEK0oAg'
);
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      'pk_test_51N8iKqJdzJVPgoqvorzGmKANJ1PcAQYylBKVGX7RBlnuSwPdbrb06ueCsS7FSXA3JAXeOEZxlCBTwFBLPruoWVxX00qdyrvwCZ'
    );
  }

  return stripePromise;
};

function isVietnamesePhoneNumber(number) {
  return /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(number);
}

const Cart = () => {
  const [stripeError, setStripeError] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const cartItem = useSelector((state) => state.carts);
  const pro = useSelector((state) => state.products);
  const handleCheckout = async () => {
    setLoading(true);
    const cartItems = [];
    const abc = cartItem.cartsLocalStorage;
    const pros = pro.products;
    abc.forEach((item) => {
      const newItem = {
        name: pros?.find((product) => product.productId === item.productId)
          ?.name,
        images: [
          pros?.find((product) => product.productId === item.productId)
            ?.photoURL,
        ],

        description: pros?.find(
          (product) => product.productId === item.productId
        )?.name,
        price: pros?.find((product) => product.productId === item.productId)
          ?.price,
        quantity: item.quantity,
      };
      cartItems.push(newItem);
    });
    // const cartItems = [
    //   {
    //     name: 'Product 1',
    //     description: 'Description 1',
    //     price: 10.99,
    //     quantity: 2,
    //   },
    //   {
    //     name: 'Product 2',
    //     description: 'Description 2',
    //     price: 5.99,
    //     quantity: 1,
    //   },
    // ];
    // console.log(pros);
    try {
      const lineItems = await Promise.all(cartItems.map(createProductAndPrice));
      const stripe = await loadStripe(
        'pk_test_51N8iKqJdzJVPgoqvorzGmKANJ1PcAQYylBKVGX7RBlnuSwPdbrb06ueCsS7FSXA3JAXeOEZxlCBTwFBLPruoWVxX00qdyrvwCZ'
      );
      const { error } = await stripe.redirectToCheckout({
        lineItems: lineItems.map((item) => ({ price: item, quantity: 1 })),
        mode: 'payment',
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/cancel`,
      });

      if (error) {
        setStripeError(error.message);
      }
    } catch (error) {
      console.log('Checkout error', error);
    }

    setLoading(false);
  };
  const createProductAndPrice = async (item) => {
    const response = await axios.post(
      'https://api.stripe.com/v1/products',
      {
        name: item.name,
        images: item.images,
        description: item.description,
      },
      {
        headers: {
          Authorization:
            'Bearer sk_test_51N8iKqJdzJVPgoqvcZwUHBS3ZXLEb5GHtGcpxUxF24qmEkRYi5dneAiwUXUEW9m8WtSx0a97KGgLArHnPCvGc5Yo008BEK0oAg',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const product = response.data;

    const priceResponse = await axios.post(
      'https://api.stripe.com/v1/prices',
      {
        product: product.id,
        unit_amount: item.price * item.quantity,
        currency: 'vnd',
      },
      {
        headers: {
          Authorization:
            'Bearer sk_test_51N8iKqJdzJVPgoqvcZwUHBS3ZXLEb5GHtGcpxUxF24qmEkRYi5dneAiwUXUEW9m8WtSx0a97KGgLArHnPCvGc5Yo008BEK0oAg',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const price = priceResponse.data;

    return price.id;
  };

  if (stripeError) {
    alert(stripeError);
  }
  useEffect(() => {
    document.title = 'Giỏ hàng - Burger King';
    window.scrollTo(0, 0);
  }, []);

  const dispatch = useDispatch();
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(getCarts());
    dispatch(getProducts());
    dispatch(getUsers());
  }, [dispatch]);

  const { productLoading, products } = useSelector((state) => state.products);
  const { cartsLocalStorage } = useSelector((state) => state.carts);
  const { users, userLoading } = useSelector((state) => state.users);
  const { isLogged } = useSelector((state) => state.login);

  // states
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [cartsPreview, setCartsPreview] = useState([]);
  const [total, setTotal] = useState(0);
  const [promotion, setPromotion] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formFields, setFormFields] = useState([]);

  useEffect(() => {
    if (productLoading === 'success' && isLogged) {
      setCartsPreview(
        cartsLocalStorage
          ?.filter(
            (cart) =>
              cart.userId === auth.currentUser.uid && !cart.paymentStatus
          )
          ?.map((cart) => ({
            ...cart,
            key: cart.productId,
            productName: products?.find(
              (product) => product.productId === cart.productId
            )?.name,
            photoURL: products?.find(
              (product) => product.productId === cart.productId
            )?.photoURL,
            price: products?.find(
              (product) => product.productId === cart.productId
            )?.price,
            quantityRemaining: products?.find(
              (product) => product.productId === cart.productId
            )?.quantityRemaining,
          }))
      );
    }
  }, [products, productLoading, cartsLocalStorage, isLogged]);

  useEffect(() => {
    setTotal(
      cartsPreview?.reduce((pre, cur) => {
        if (cur.quantity >= 3) {
          return pre + (cur.price * cur.quantity * 90) / 100;
        }
        return pre + cur.price * cur.quantity;
      }, 0)
    );
    setPromotion(
      cartsPreview?.reduce((pre, cur) => pre + cur.price * cur.quantity, 0) -
        cartsPreview?.reduce((pre, cur) => {
          if (cur.quantity >= 3) {
            return pre + (cur.price * cur.quantity * 90) / 100;
          }
          return pre + cur.price * cur.quantity;
        }, 0)
    );
  }, [cartsPreview]);

  useEffect(() => {
    if (userLoading === 'success') {
      setFormFields([
        {
          name: ['address'],
          value: users?.find((user) => user?.uid === auth.currentUser?.uid)
            ?.address,
        },
        {
          name: ['phoneNumber'],
          value: users?.find((user) => user?.uid === auth.currentUser?.uid)
            ?.phoneNumber,
        },
      ]);
    }
  }, [users, userLoading]);

  // change select row
  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  // config table
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
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
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity, record) => (
        <div className="quantity_change">
          <Button
            type="default"
            onClick={() => handleDecreaseProduct(record.productId)}
          >
            <MinusOutlined />
          </Button>
          <Text className="quantity">{quantity}</Text>
          <Button
            type="default"
            disabled={quantity === record.quantityRemaining}
            onClick={() => handleIncreaseProduct(record.productId)}
          >
            <PlusOutlined />
          </Button>
        </div>
      ),
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price, record) => (
        <>
          {record?.quantity >= 3 && <Text className="promotion">*</Text>}
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
    {
      title: '',
      key: 'action',
      render: (record) => (
        <Button
          type="primary"
          danger
          onClick={() => handleRemoveClick(record.productId)}
        >
          Xoá
        </Button>
      ),
    },
  ];

  // handle decrease product
  const handleDecreaseProduct = (productId) => {
    try {
      let carts = cartsLocalStorage;
      if (
        cartsPreview?.find((cart) => cart.productId === productId)?.quantity ===
        1
      ) {
        setCartsPreview(
          cartsPreview?.filter((cart) => cart.productId !== productId)
        );
        carts = carts?.filter((cart) => cart.productId !== productId);
        localStorage.setItem('carts', JSON.stringify(carts));
      } else {
        setCartsPreview(
          cartsPreview?.map((cart) => {
            if (cart.productId === productId) {
              return { ...cart, quantity: cart.quantity - 1 };
            }
            return cart;
          })
        );
        carts = carts?.map((cart) => {
          if (cart.productId === productId) {
            return { ...cart, quantity: cart.quantity - 1 };
          }
          return cart;
        });
        localStorage.setItem('carts', JSON.stringify(carts));
      }
      dispatch(addOrder(carts));
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  // handle Increase product
  const handleIncreaseProduct = (productId) => {
    try {
      let carts = cartsLocalStorage;
      setCartsPreview(
        cartsPreview?.map((cart) => {
          if (cart.productId === productId) {
            return { ...cart, quantity: cart.quantity + 1 };
          }
          return cart;
        })
      );
      carts = carts?.map((cart) => {
        if (cart.productId === productId) {
          return { ...cart, quantity: cart.quantity + 1 };
        }
        return cart;
      });
      localStorage.setItem('carts', JSON.stringify(carts));
      dispatch(addOrder(carts));
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  // handle remove one order
  const handleRemoveClick = (productId) => {
    try {
      let carts = cartsLocalStorage;
      setCartsPreview(
        cartsPreview?.filter((cart) => cart.productId !== productId)
      );
      carts = carts?.filter((cart) => cart.productId !== productId);
      localStorage.setItem('carts', JSON.stringify(carts));
      dispatch(addOrder(carts));
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  // handle remove more order
  const handleRemoveMoreOrder = () => {
    try {
      let carts = cartsLocalStorage;
      selectedRowKeys?.forEach((productId) => {
        setCartsPreview(
          cartsPreview?.filter((cart) => cart.productId !== productId)
        );
        carts = carts?.filter((cart) => cart.productId !== productId);
      });
      localStorage.setItem('carts', JSON.stringify(carts));
      dispatch(addOrder(carts));
      setSelectedRowKeys([]);
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };
  const handleClick = () => {
    handleOk();
    handleCheckout();
  };
  // handle Ok
  const handleOk = () => {
    try {
      cartsLocalStorage?.forEach((order, index) => {
        const payload = {
          ...order,
          paymentStatus: true,
        };
        addDocument('carts', payload)
          .then(() => {
            const currentProduct = products?.find(
              (product) => product.productId === order.productId
            );
            const quantityRemaining =
              currentProduct?.quantityRemaining - order.quantity;
            return updateDocument('products', currentProduct?.id, {
              quantityRemaining,
              updatedAt: serverTimestamp(),
            });
          })
          .then(() => {
            if (index === cartsLocalStorage?.length - 1) {
              setCartsPreview([]);
              localStorage.setItem('carts', JSON.stringify([]));
              dispatch(addOrder([]));
              alert('Đặt hàng thành công vui lòng chờ nhận hàng');
              setIsModalVisible(false);
            }
          })
          .catch((error) => {
            console.log(error);
            alert(error);
          });
      });
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  // handle Cancel
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <BannerWrapper>
        <div className="banner">
          <div className="content-wrapper">
            <div className="navigate">
              <Link to="/">Trang chủ</Link>
              <Text> / Giỏ hàng</Text>
            </div>
            <Title level={1} className="title">
              Giỏ hàng
            </Title>
            <Paragraph className="content">
              Thanh toán và cảm nhận hương vị tuyệt vời ngay bây giờ
            </Paragraph>
          </div>
        </div>
      </BannerWrapper>

      <CartWrapper isModalVisible={isModalVisible}>
        <div className="container">
          {cartsPreview.length > 0 && isLogged ? (
            <div className="exist">
              <div className="action">
                <Button
                  type="primary"
                  danger
                  disabled={selectedRowKeys.length < 1}
                  onClick={handleRemoveMoreOrder}
                >
                  Xoá
                </Button>
                {selectedRowKeys.length > 0 && (
                  <Text className="product_selected">{`Đã chọn ${selectedRowKeys.length} món ăn`}</Text>
                )}
              </div>
              <Table
                columns={columns}
                dataSource={cartsPreview}
                rowSelection={rowSelection}
                loading={productLoading === 'pending'}
              />
              <div className="payment">
                <Text className="notes">
                  *
                  <Text className="contents">
                    : Đơn hàng được giảm 10% khi số lượng lớn hơn hoặc bằng 3
                  </Text>
                </Text>
                <Text>
                  Tổng tiền:{' '}
                  {total.toLocaleString('vi-vn', {
                    style: 'currency',
                    currency: 'VND',
                  })}
                </Text>
                <Text>
                  Đã giảm:{' '}
                  {promotion.toLocaleString('vi-vn', {
                    style: 'currency',
                    currency: 'VND',
                  })}
                </Text>
                <Button
                  type="primary"
                  onClick={handleClick}
                  disabled={isLoading}
                  className="payment-btn"
                >
                  Thanh toán
                </Button>
                <div className="modal">
                  <Card title="Xác nhận thanh toán">
                    <Form
                      name="confirm-payment"
                      form={form}
                      fields={formFields}
                    >
                      <Form.Item
                        label="Địa chỉ"
                        name={'address'}
                        rules={[
                          {
                            required: true,
                            message: 'Vui lòng nhập trường này!',
                          },
                        ]}
                      >
                        <Input size="large" />
                      </Form.Item>

                      <Form.Item
                        name="phoneNumber"
                        label="Số điện thoại"
                        rules={[
                          {
                            required: true,
                            message: 'Vui lòng nhập trường này!',
                          },
                          () => ({
                            validator(_, value) {
                              if (!value) {
                                return Promise.resolve();
                              }
                              if (!isVietnamesePhoneNumber(value)) {
                                return Promise.reject(
                                  new Error('Số điện thoại chưa đúng định dạng')
                                );
                              } else {
                                return Promise.resolve();
                              }
                            },
                          }),
                        ]}
                      >
                        <Input size="large" />
                      </Form.Item>

                      <Form.Item>
                        <div className="btn-wrapper">
                          <Button
                            size="large"
                            type="primary"
                            className="cancel-btn"
                            danger
                            onClick={handleCancel}
                          >
                            Huỷ
                          </Button>
                          <Button
                            size="large"
                            type="primary"
                            htmlType="submit"
                            className="confirm-btn"
                            onClick={handleOk}
                          >
                            Xác nhận
                          </Button>
                        </div>
                      </Form.Item>
                    </Form>
                  </Card>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty">
              <Text>Không có sản phẩm nào trong giỏ hàng</Text>
              <Link to={'/products'}>
                <Button type="primary" size="large">
                  Quay lại cửa hàng
                </Button>
              </Link>
            </div>
          )}
        </div>
      </CartWrapper>
    </>
  );
};

export default Cart;
