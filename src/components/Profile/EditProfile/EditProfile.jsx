import React, { useEffect, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Avatar, Button, Form, Input, Spin, Typography, Upload } from 'antd';
import { updateDocument, uploadImage } from '../../../firebase/services';
import { serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import useAuth from '../../../hooks/useAuth';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from 'firebase/auth';
import { storage } from '../../../firebase/config';
import { Wrapper } from './styles';
import { getUsers, setLoadingProfile } from '../profileSlice';

const { Title, Text } = Typography;

function isVietnamesePhoneNumber(number) {
  return /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(number);
}

const EditProfile = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const { currentUserAuth } = useAuth();
  const { users, userLoading } = useSelector((state) => state.users);

  // states
  const [currentUser, setCurrentUser] = useState({});
  const [formFields, setFormFields] = useState([]);
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    if (userLoading === 'success' && users?.length > 0) {
      setCurrentUser(users?.find((user) => user?.uid === currentUserAuth?.uid));
    }
  }, [userLoading, users, currentUserAuth]);

  useEffect(() => {
    if (userLoading === 'success' && users?.length > 0) {
      setFormFields([
        {
          name: ['username'],
          value: currentUserAuth?.displayName
            ? currentUserAuth?.displayName
            : currentUserAuth?.email?.charAt(0).toUpperCase(),
        },
        {
          name: ['address'],
          value: currentUser?.address,
        },
        {
          name: ['phoneNumber'],
          value: currentUser?.phoneNumber,
        },
      ]);
    }
  }, [userLoading, users, currentUser, currentUserAuth]);

  const handleSaveEditProfile = () => {
    try {
      dispatch(setLoadingProfile('uploading'));
      const { username, address, phoneNumber } = form.getFieldValue();
      if (photo) {
        uploadImage(photo, 'user-avatars', currentUserAuth?.uid)
          .then(() => {
            return getDownloadURL(
              ref(
                storage,
                `user-avatars/${currentUserAuth?.uid}.${
                  photo.type === 'image/png' ? 'png' : 'jpg'
                }`
              )
            );
          })
          .then((photoURL) => {
            return updateProfile(currentUserAuth, {
              displayName: username?.trim(),
              photoURL,
            });
          })
          .then(() => {
            const payload = {
              displayName: username?.trim(),
              address: address?.trim(),
              photoURL: currentUserAuth.photoURL,
              phoneNumber,
              updatedAt: serverTimestamp(),
            };
            updateDocument('users', currentUser?.id, {
              ...payload,
              updatedAt: serverTimestamp(),
            })
              .then(() => {
                dispatch(getUsers());
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
        updateProfile(currentUserAuth, {
          displayName: username?.trim(),
        })
          .then(() => {
            const payload = {
              displayName: username?.trim(),
              address: address?.trim(),
              phoneNumber,
              updatedAt: serverTimestamp(),
            };
            updateDocument('users', currentUser?.id, {
              ...payload,
              updatedAt: serverTimestamp(),
            })
              .then(() => {
                dispatch(getUsers());
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
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const beforeUpload = () => {
    return false;
  };
  const uploadChange = ({ file, fileList }) => {
    if (file?.status && file?.status === 'removed') {
      setPhoto(null);
    } else {
      const isLt2M = file?.size / 1024 / 1024 < 2;
      if (file?.type !== 'image/png' && file?.type !== 'image/jpeg') {
        fileList?.pop();
        alert('File phải là hình ảnh .jpg hoặc .png');
      } else if (!isLt2M) {
        fileList?.pop();
        alert('Chỉ cho phép tải file nhỏ hơn 2MB');
      } else {
        setPhoto(file);
      }
    }
  };

  return (
    <Wrapper>
      <Title className="title" level={2}>
        Hồ Sơ Của Tôi
      </Title>
      {userLoading === 'uploading' && <Spin />}
      {userLoading === 'success' && (
        <div className="form-wrapper">
          <Form
            form={form}
            name="edit_profile_form"
            className="forgot-password-form"
            onFinish={handleSaveEditProfile}
            fields={formFields}
          >
            <Form.Item label="Email đăng nhập">
              <Text className="email-value">{currentUserAuth?.email}</Text>
            </Form.Item>

            <Form.Item
              name="username"
              label="Tên"
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
              name="address"
              label="Địa chỉ"
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

            <div className="avatar-edit">
              <Form.Item name="avatar" label="Ảnh đại diện">
                <Avatar size={60} src={currentUserAuth?.photoURL}>
                  {currentUserAuth?.photoURL
                    ? ''
                    : currentUserAuth?.displayName
                      ? currentUserAuth?.displayName?.charAt(0)?.toUpperCase()
                      : currentUserAuth?.email?.charAt(0).toUpperCase()}
                </Avatar>
              </Form.Item>

              <Upload
                className="upload-btn-wrapper"
                maxCount={1}
                beforeUpload={beforeUpload}
                onChange={uploadChange}
                listType="picture"
              >
                <Button icon={<UploadOutlined />}>Tải lên ảnh đại diện</Button>
              </Upload>
            </div>

            <Form.Item>
              <Button
                size="large"
                type="primary"
                htmlType="submit"
                className="save-button"
              >
                Lưu
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}
    </Wrapper>
  );
};

export default EditProfile;
