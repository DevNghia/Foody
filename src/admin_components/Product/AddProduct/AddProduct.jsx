import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Typography,
  Upload,
  Select,
} from 'antd';
import { Wrapper } from './styles';
import { Link, useNavigate } from 'react-router-dom';
import { addDocument, uploadImage } from '../../../firebase/services';
import { v4 as uuidv4 } from 'uuid';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../../../firebase/config';

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

const AddProduct = () => {
  useEffect(() => {
    document.title = 'Thêm món ăn - Food App';
  }, []);

  const [form] = Form.useForm();
  const navigate = useNavigate();

  // states
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [categorySelected, setCategorySelected] = useState('Combo');

  // handle upload product image
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

  // handle add product
  const handleAddProduct = () => {
    try {
      const { productName, description, price, quantityRemaining } =
        form.getFieldValue();
      const productId = uuidv4();
      uploadImage(photo, 'products', productId)
        .then(() => {
          return getDownloadURL(
            ref(
              storage,
              `products/${productId}.${
                photo.type === 'image/png' ? 'png' : 'jpg'
              }`
            )
          );
        })
        .then((photoURL) => {
          const payload = {
            productId,
            name: productName?.trim(),
            description: description?.trim().split('\n'),
            price: Number(price),
            photoURL,
            category: categorySelected,
            quantityRemaining: Number(quantityRemaining),
            removed: false,
          };
          addDocument('products', payload)
            .then(() => {
              alert('Thêm sản phẩm thành công');
              navigate('/app/admin/products');
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

  // reset button click
  const resetForm = () => {
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
          Thêm món ăn
        </Title>
        <Button type="primary" size="large" onClick={resetForm}>
          Xoá tất cả
        </Button>
      </div>
      <Card title="Thông tin cơ bản" className="card-content">
        <Form form={form} name="basic-info" onFinish={handleAddProduct}>
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

          <Form.Item
            label="Ảnh minh hoạ"
            name={'productImage'}
            rules={[
              {
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
                  Huỷ thêm
                </Button>
              </Link>
              <Button type="primary" size="large" htmlType="submit">
                Thêm món ăn
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </Wrapper>
  );
};

export default AddProduct;
