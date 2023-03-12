import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Typography,
  Upload,
} from 'antd';
import { Wrapper } from './styles';
import { Link, useNavigate } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import { addDocument, uploadImage } from '../../../firebase/services';
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

const AddBlog = () => {
  useEffect(() => {
    document.title = 'Thêm bài viết - Food App';
  }, []);

  const [form] = Form.useForm();
  const navigate = useNavigate();

  // states
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [categorySelected, setCategorySelected] = useState('Combo');
  const [timeGroup, setTimeGroup] = useState('');
  // const [images, setImages] = useState([]);

  // handle select product category
  const handleChangeSelectCategory = (value) => {
    setCategorySelected(value);
  };

  // handle uploading image
  const handleBeforeUploadImage = () => {
    return false;
  };
  const handleChangeUploadImage = ({ file, fileList }) => {
    if (file?.status && file?.status === 'removed') {
      setPhotos(photos?.filter((item) => item?.uid !== file?.uid));
      setFileList(fileList?.filter((item) => item?.uid !== file?.uid));
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
        setPhotos([...photos, file]);
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

  // handle change date
  const handleChangeDate = (date, dateString) => {
    setTimeGroup(dateString);
  };

  // handle add blog
  const handleAddBlog = () => {
    try {
      const { blogName, contents } = form.getFieldValue();
      const blogId = uuidv4();
      let blogImages = [];
      photos?.forEach((photo, index) => {
        uploadImage(photo, 'blogs', `${blogId}-${index}`)
          .then(() => {
            return getDownloadURL(
              ref(
                storage,
                `blogs/${blogId}-${index}.${
                  photo.type === 'image/png' ? 'png' : 'jpg'
                }`
              )
            );
          })
          .then((photoURL) => {
            // setImages(images?.push(photoURL));
            blogImages = [...blogImages, photoURL];
          })
          .then(() => {
            if (index === photos.length - 1) {
              const payload = {
                blogId,
                title: blogName?.trim(),
                contents: contents?.trim().split('\n'),
                images: blogImages,
                category: categorySelected,
                timeGroup,
                removed: false,
              };
              addDocument('blogs', payload)
                .then(() => {
                  alert('Thêm bài viết thành công');
                  navigate('/app/admin/blogs');
                })
                .catch((error) => {
                  console.log(error);
                  alert(error);
                });
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

  // reset button click
  const resetForm = () => {
    form.resetFields();
    setFileList([]);
    setPhotos([]);
    setPreviewVisible(false);
    setCategorySelected('Combo');
  };

  return (
    <Wrapper>
      <div className="title-wrapper">
        <Title className="title" level={4}>
          Thêm bài viết
        </Title>
        <Button type="primary" size="large" onClick={resetForm}>
          Xoá tất cả
        </Button>
      </div>
      <Card title="Thông tin cơ bản" className="card-content">
        <Form form={form} name="basic-info" onFinish={handleAddBlog}>
          <Form.Item
            label="Tiêu đề bài viết"
            name="blogName"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập trường này',
              },
            ]}
          >
            <Input size="large" placeholder="Tiêu đề bài viết" />
          </Form.Item>

          <Form.Item
            label="Nội dung"
            name="contents"
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
            label="Nhóm thời gian"
            name="timeGroup"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập trường này',
              },
            ]}
          >
            <DatePicker
              onChange={handleChangeDate}
              picker="month"
              size="large"
              placeholder="Chọn thời gian"
            />
          </Form.Item>

          <Form.Item label="Bộ sưu tập">
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
            name={'blogImages'}
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
                {fileList.length >= 2 ? null : (
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
              <Link to={'/app/admin/blogs'} className="cancel">
                <Button type="primary" danger size="large">
                  Huỷ thêm
                </Button>
              </Link>
              <Button type="primary" size="large" htmlType="submit">
                Thêm bài viết
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </Wrapper>
  );
};

export default AddBlog;
