import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Form, Input, Typography } from 'antd';
import {
  browserSessionPersistence,
  setPersistence,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/config';
import { Wrapper } from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { setLogged } from './loginSlice';

const { Title } = Typography;

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const { isLogged } = useSelector((state) => state.adminLogin);

  useEffect(() => {
    if (isLogged) {
      navigate('/app/admin');
    }
  }, [isLogged, navigate]);

  const handleSignInWithEmail = async () => {
    const { email, password } = form.getFieldValue();
    if (email === 'foodapp.admin.tt@admin.com') {
      setPersistence(auth, browserSessionPersistence)
        .then(() => {
          return signInWithEmailAndPassword(auth, email, password);
        })
        .then(() => {
          dispatch(setLogged(true));
          alert('Đăng nhập thành công!');
          navigate('/app/admin');
        })
        .catch((error) => {
          console.log(error);
          const errorCode = error.code;
          if (errorCode === 'auth/wrong-password') {
            alert('Sai mật khẩu!');
          } else if (errorCode === 'auth/user-not-found') {
            alert('Tài khoản không tồn tại!');
          }
        });
    } else {
      dispatch(setLogged(false));
      alert('Tài khoản không tồn tại!');
    }
  };

  return (
    <Wrapper>
      <div className="container-wrapper">
        <Title level={1}>Đăng nhập quản trị</Title>

        <Form
          form={form}
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={handleSignInWithEmail}
        >
          <Form.Item
            name="email"
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
            <Button
              size="large"
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Đăng Nhập
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Wrapper>
  );
};

export default Login;
