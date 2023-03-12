import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Form, Input, Typography } from 'antd';
import React, { useState } from 'react';
import { FormWrapper, Wrapper, Modal } from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { toggleHiddenLogin } from './loginSlice';
import { Link } from 'react-router-dom';
import {
  GoogleAuthProvider,
  signInWithPopup,
  getAdditionalUserInfo,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../../firebase/config';
import { addDocument } from '../../firebase/services';

const { Title, Text } = Typography;

export default function Login() {
  const dispatch = useDispatch();

  const [isSignIn, setIsSignIn] = useState(true);

  const [form] = Form.useForm();

  const { isHiddenLogin } = useSelector((state) => state.login);

  // handle hidden login form
  const handleHiddenLogin = () => {
    dispatch(toggleHiddenLogin(true));
  };

  // handle login with google
  const handleLoginWithGoogle = async () => {
    const googleProvider = new GoogleAuthProvider();
    await signInWithPopup(auth, googleProvider)
      .then((result) => {
        const { isNewUser, providerId } = getAdditionalUserInfo(result);
        const user = result.user;
        const payload = {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          address: '',
          uid: user.uid,
          accessToken: user.accessToken,
          providerId,
          phoneNumber: '',
          roles: 'customer',
        };

        // check is new user
        if (isNewUser) {
          addDocument('users', payload);
        }
        handleHiddenLogin();
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === 'auth/popup-closed-by-user') {
          alert('Đã huỷ đăng nhập bằng Google');
        }
        if (errorCode === 'auth/cancelled-popup-request') {
          alert('Lỗi kết nối mạng dữ liệu!');
        }
      });
  };

  // handle register with email and password
  const handleRegister = async () => {
    const { confirm, email, passwordRegister } = form.getFieldValue();
    if (confirm === passwordRegister && email && confirm && passwordRegister) {
      await createUserWithEmailAndPassword(auth, email, passwordRegister)
        .then((userCredential) => {
          const { isNewUser, providerId } =
            getAdditionalUserInfo(userCredential);
          const user = userCredential.user;
          const payload = {
            displayName: user.displayName
              ? user.displayName
              : user.email?.charAt(0)?.toUpperCase(),
            email: user.email,
            photoURL: user.photoURL,
            address: '',
            uid: user.uid,
            accessToken: user.accessToken,
            providerId,
            phoneNumber: '',
            roles: 'customer',
          };

          // check is new user
          if (isNewUser) {
            addDocument('users', payload);
          }
          alert('Đăng ký thành công. Hệ thống sẽ tự động đăng nhập!');
          form.resetFields();
          handleHiddenLogin();
        })
        .catch((error) => {
          const errorCode = error.code;
          if (errorCode === 'auth/email-already-in-use') {
            alert('Email đã được sử dụng!');
          }
        });
    } else {
      alert('Đăng ký không thành công!');
    }
  };

  // handle sign in with email
  const handleSignInWithEmail = async () => {
    const { username, password } = form.getFieldValue();
    if (username !== 'foodapp.admin.tt@admin.com') {
      await signInWithEmailAndPassword(auth, username, password)
        .then(() => {
          // Signed in
          handleHiddenLogin();
        })
        .catch((error) => {
          const errorCode = error.code;
          if (errorCode === 'auth/wrong-password') {
            alert('Sai mật khẩu!');
          } else if (errorCode === 'auth/user-not-found') {
            alert('Tài khoản không tồn tại!');
          }
        });
    } else {
      alert('Tài khoản không tồn tại!');
    }
  };

  return (
    <Wrapper isHidden={isHiddenLogin}>
      <Modal onClick={handleHiddenLogin} />
      <FormWrapper signIn={isSignIn}>
        <div className="title-wrapper">
          <Title
            className="sign-in-title"
            level={2}
            onClick={() => setIsSignIn(true)}
          >
            Đăng Nhập
          </Title>
          <Title
            className="sign-up-title"
            level={2}
            onClick={() => setIsSignIn(false)}
          >
            Đăng Ký
          </Title>
        </div>

        {isSignIn ? (
          <Form
            form={form}
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Vui lòng nhập trường này!' }]}
            >
              <Input
                prefix={<MailOutlined className="site-form-item-icon" />}
                placeholder="Email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập trường này!' }]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Mật khẩu"
              />
            </Form.Item>

            <Form.Item>
              <Link className="login-form-forgot" to="/forgot-password">
                Quên mật khẩu?
              </Link>
            </Form.Item>
            <Form.Item>
              <Button
                size="large"
                type="primary"
                htmlType="submit"
                className="login-form-button"
                onClick={handleSignInWithEmail}
              >
                Đăng Nhập
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <Form
            form={form}
            name="register"
            className="register-form"
            scrollToFirstError
          >
            <Form.Item
              name="email"
              label="E-mail"
              rules={[
                {
                  type: 'email',
                  message: 'Định dạng E-mail chưa đúng!',
                },
                {
                  required: true,
                  message: 'Vui lòng nhập trường này!',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="passwordRegister"
              label="Mật khẩu"
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
                    if (value.length < 6) {
                      return Promise.reject(
                        new Error('Mật khẩu phải có ít nhất 6 ký tự')
                      );
                    } else {
                      return Promise.resolve();
                    }
                  },
                }),
              ]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="confirm"
              label="Nhập lại mật khẩu"
              dependencies={['passwordRegister']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập trường này!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('passwordRegister') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error('Mật khẩu không trùng khớp')
                    );
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button
                size="large"
                type="primary"
                htmlType="submit"
                className="register-form-button"
                onClick={handleRegister}
              >
                Đăng Ký
              </Button>
            </Form.Item>
          </Form>
        )}

        <div className="other">
          <Text className="text-middle">Hoặc</Text>
          <Button size="large" type="primary" onClick={handleLoginWithGoogle}>
            Đăng nhập bằng Google
          </Button>
        </div>
      </FormWrapper>
    </Wrapper>
  );
}
