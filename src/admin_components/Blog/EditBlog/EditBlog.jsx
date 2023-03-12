import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Spin,
  Typography,
  Upload,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getBlogs } from '../../../components/Blog/blogSlice';
import { Wrapper } from './styles';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { updateDocument, uploadImage } from '../../../firebase/services';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../../../firebase/config';
import { serverTimestamp } from 'firebase/firestore';

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

const EditBlog = () => {
  useEffect(() => {
    document.title = 'Sửa bài viết - Food App';
  }, []);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getBlogs());
  }, [dispatch]);

  const [form] = Form.useForm();
  const { id } = useParams();
  const { blogLoading, blogs } = useSelector((state) => state.blogs);

  // states
  const [currentBlog, setCurrentBlog] = useState({});
  const [previewVisible, setPreviewVisible] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [categorySelected, setCategorySelected] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [formFields, setFormFields] = useState([]);
  const [timeGroup, setTimeGroup] = useState('');
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (blogLoading === 'success' && blogs?.length > 0) {
      setCurrentBlog(blogs?.find((blog) => blog?.id === id));
      setCategorySelected(currentBlog?.category);
      setFileList(currentBlog?.images?.map((url) => ({ url })));
      setFormFields([
        {
          name: ['blogName'],
          value: currentBlog?.title,
        },
        {
          name: ['contents'],
          value: currentBlog?.contents?.join('\n'),
        },
      ]);
      setTimeGroup(currentBlog?.timeGroup);
    }
  }, [blogs, id, currentBlog, blogLoading]);

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

  // handle select blog category
  const handleChangeSelectCategory = (value) => {
    setCategorySelected(value);
  };

  // handle submit edit
  const handleEditBlogSubmit = () => {
    try {
      const { blogName, contents } = form.getFieldValue();
      if (photos.length > 0) {
        photos?.forEach((photo, index) => {
          uploadImage(photo, 'blogs', `${currentBlog?.blogId}-${index}`)
            .then(() => {
              return getDownloadURL(
                ref(
                  storage,
                  `blogs/${currentBlog?.blogId}-${index}.${
                    photo.type === 'image/png' ? 'png' : 'jpg'
                  }`
                )
              );
            })
            .then((photoURL) => {
              setImages(images?.push(photoURL));
            })
            .then(() => {
              if (index === photos.length - 1) {
                const payload = {
                  title: blogName?.trim(),
                  contents: contents?.trim().split('\n'),
                  images,
                  category: categorySelected,
                  timeGroup,
                };
                updateDocument('blogs', id, {
                  ...payload,
                  updatedAt: serverTimestamp(),
                })
                  .then(() => {
                    alert('Cập nhật thành công');
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
      } else {
        const payload = {
          title: blogName?.trim(),
          contents: contents?.trim().split('\n'),
          category: categorySelected,
          timeGroup,
        };
        updateDocument('blogs', id, {
          ...payload,
          updatedAt: serverTimestamp(),
        })
          .then(() => {
            alert('Cập nhật thành công');
            navigate('/app/admin/blogs');
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
          Sửa thông tin bài viết
        </Title>
        <Button type="primary" size="large" onClick={resetForm}>
          Xoá tất cả
        </Button>
      </div>
      <Card title="Thông tin cơ bản" className="card-content">
        {blogLoading === 'success' && timeGroup?.length > 0 ? (
          <Form
            form={form}
            name="basic-info"
            onFinish={handleEditBlogSubmit}
            fields={formFields}
            initialValues={{
              timeGroup: moment(timeGroup?.split('-')?.join('/'), 'YYYY/MM'),
            }}
          >
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
                format={'YYYY/MM'}
                defaultValue={moment(
                  timeGroup?.split('-')?.join('/'),
                  'YYYY/MM'
                )}
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
                fileList.length < 2 && {
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

export default EditBlog;
