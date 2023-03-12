import React, { useEffect, useState } from 'react';
import { Wrapper } from './styles';
import {
  Typography,
  Form,
  Card,
  Input,
  Upload,
  Button,
  Modal,
  Select,
  Spin,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../../../components/Product/productSlice';
import { updateDocument, uploadImage } from '../../../firebase/services';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../../../firebase/config';
import { serverTimestamp } from 'firebase/firestore';
import { getProductReviews } from '../../../components/Product/productReviewSlice';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const EditProduct = () => {
  useEffect(() => {
    document.title = 'Sửa món ăn - Food App';
  }, []);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getProductReviews());
    dispatch(getProducts());
  }, [dispatch]);

  const [form] = Form.useForm();

  const { id } = useParams();
  const { products, productLoading } = useSelector((state) => state.products);
  const { productReviewLoading, productReviews } = useSelector(
    (state) => state.productReviews
  );

  // states
  const [currentProduct, setCurrentProduct] = useState({});
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState([]);
  const [formFields, setFormFields] = useState([]);
  const [categorySelected, setCategorySelected] = useState('Combo');
  const [photo, setPhoto] = useState(null);

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
          ?.find((product) => product?.id === id)
      );
    }
  }, [products, id, productLoading, productReviewLoading, productReviews]);

  useEffect(() => {
    if (
      productLoading === 'success' &&
      productReviewLoading === 'success' &&
      products?.length > 0 &&
      productReviews?.length >= 0
    ) {
      setCategorySelected(currentProduct?.category);
      setFileList([{ url: currentProduct?.photoURL }]);
      setFormFields([
        {
          name: ['productName'],
          value: currentProduct?.name,
        },
        {
          name: ['description'],
          value: currentProduct?.description?.join('\n'),
        },
        {
          name: ['price'],
          value: currentProduct?.price,
        },
        {
          name: ['quantityRemaining'],
          value: currentProduct?.quantityRemaining,
        },
        {
          name: ['avgRating'],
          value: currentProduct?.avgRating,
        },
      ]);
    }
  }, [
    products,
    currentProduct,
    productLoading,
    productReviewLoading,
    productReviews,
  ]);

  // handle upload image
  const handleBeforeUploadImage = () => {
    return false;
  };
  const handleChangeUploadImage = ({ file, fileList }) => {
    if (file?.status && file?.status === 'removed') {
      setPhoto(null);
      setFileList([]);
      setPreviewVisible(false);
    } else {
      const isLt2M = file?.size / 1024 / 1024 < 2;
      if (file?.type !== 'image/png' && file?.type !== 'image/jpeg') {
        fileList?.pop();
        alert('File phải là hình ảnh .jpg hoặc .png');
      } else if (!isLt2M) {
        fileList?.pop();
        alert('Chỉ cho phép tải file nhỏ hơn 2MB');
      } else {
        setFileList(fileList);
        setPhoto(file);
      }
    }
  };
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
    );
  };

  // handle select product category
  const handleChangeSelectCategory = (value) => {
    setCategorySelected(value);
  };

  // handle submit edit
  const handleEditProductSubmit = () => {
    try {
      const { productName, description, price, quantityRemaining } =
        form.getFieldValue();
      let payload = {};
      if (photo) {
        uploadImage(photo, 'products', id)
          .then(() => {
            return getDownloadURL(
              ref(
                storage,
                `products/${currentProduct?.productId}.${
                  photo?.type === 'image/png' ? 'png' : 'jpg'
                }`
              )
            );
          })
          .then((photoURL) => {
            payload = {
              name: productName?.trim(),
              description: description?.trim().split('\n'),
              price: Number(price),
              photoURL,
              category: categorySelected,
              quantityRemaining,
            };
            updateDocument('products', id, {
              ...payload,
              updatedAt: serverTimestamp(),
            })
              .then(() => {
                alert('Cập nhật thành công');
                navigate('/app/admin/products');
              })
              .catch((error) => {
                console.log(error);
                alert(error);
              });
          })
          .catch((error) => {
            console.log(error);
            alert(error);
          });
      } else {
        payload = {
          name: productName?.trim(),
          description: description?.trim().split('\n'),
          price: Number(price),
          category: categorySelected,
          quantityRemaining,
        };
        updateDocument('products', id, {
          ...payload,
          updatedAt: serverTimestamp(),
        })
          .then(() => {
            alert('Cập nhật thành công');
            navigate('/app/admin/products');
          })
          .catch((error) => {
            console.log(error);
            alert(error);
          });
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  // reset button click
  const resetForm = () => {
    setFormFields([]);
    form.resetFields();
    setFileList([]);
    setPhoto(null);
    setPreviewVisible(false);
    setCategorySelected('Combo');
  };

  return (
    <Wrapper>
      <div className="title-wrapper">
        <Title className="title" level={4}>
          Sửa thông tin món ăn
        </Title>
        <Button type="primary" size="large" onClick={resetForm}>
          Xoá tất cả
        </Button>
      </div>
      <Card title="Thông tin cơ bản" className="card-content">
        {productLoading === 'success' && productReviewLoading === 'success' ? (
          <Form
            form={form}
            name="basic-info"
            onFinish={handleEditProductSubmit}
            fields={formFields}
          >
            <Form.Item
              label="Tên món ăn"
              name="productName"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập trường này',
                },
              ]}
            >
              <Input size="large" placeholder="Tên sản phẩm" />
            </Form.Item>

            <Form.Item
              label="Mô tả"
              name="description"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập trường này',
                },
              ]}
            >
              <TextArea rows={4} />
            </Form.Item>

            <Form.Item
              label="Giá"
              name="price"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập trường này',
                },
                () => ({
                  validator(_, value) {
                    if (!value) {
                      return Promise.resolve();
                    }
                    if (!Number(value)) {
                      return Promise.reject(new Error('Giá phải là số'));
                    } else if (Number(value) < 0) {
                      return Promise.reject(
                        new Error('Giá phải là số lớn hơn 0')
                      );
                    } else {
                      return Promise.resolve();
                    }
                  },
                }),
              ]}
            >
              <Input size="large" suffix="Đồng" />
            </Form.Item>

            <Form.Item
              label="Số lượng còn"
              name="quantityRemaining"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập trường này',
                },
                () => ({
                  validator(_, value) {
                    if (!value) {
                      return Promise.resolve();
                    }
                    if (!Number(value)) {
                      return Promise.reject(new Error('Số lượng phải là số'));
                    } else if (Number(value) < 0) {
                      return Promise.reject(
                        new Error('Số lượng phải là số lớn hơn 0')
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

            <Form.Item label="Phân loại">
              <Select
                value={categorySelected}
                onChange={handleChangeSelectCategory}
                size="large"
              >
                <Option value="Combo">Combo</Option>
                <Option value="Burger">Burger</Option>
                <Option value="Gà rán">Gà rán</Option>
                <Option value="Pizza">Pizza</Option>
                <Option value="Món phụ">Món phụ</Option>
              </Select>
            </Form.Item>

            <Form.Item label="Điểm đánh giá" name="avgRating">
              <Input size="large" readOnly />
            </Form.Item>

            <Form.Item
              label="Ảnh minh hoạ"
              name={'productImage'}
              rules={[
                fileList.length < 1 && {
                  required: true,
                  message: 'Vui lòng tải lên ảnh minh hoạ',
                },
              ]}
            >
              <div className="upload-wrapper">
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={handleChangeUploadImage}
                  beforeUpload={handleBeforeUploadImage}
                >
                  {fileList.length >= 1 ? null : (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Chọn hình ảnh</div>
                    </div>
                  )}
                </Upload>
                <Modal
                  visible={previewVisible}
                  title={previewTitle}
                  footer={null}
                  onCancel={() => setPreviewVisible(false)}
                >
                  <img
                    alt="example"
                    style={{ width: '100%' }}
                    src={previewImage}
                  />
                </Modal>
              </div>
            </Form.Item>

            <Form.Item>
              <div className="btn-wrapper">
                <Link to={'/app/admin/products'} className="cancel">
                  <Button type="primary" danger size="large">
                    Huỷ sửa
                  </Button>
                </Link>
                <Button type="primary" size="large" htmlType="submit">
                  Cập nhật
                </Button>
              </div>
            </Form.Item>
          </Form>
        ) : (
          <Spin />
        )}
      </Card>
    </Wrapper>
  );
};

export default EditProduct;
