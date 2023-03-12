import React, { useState } from 'react';
import { Wrapper } from './styles';
import { Typography, Form, Input, Button } from 'antd';
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth';
import useAuth from '../../../hooks/useAuth';

const { Title } = Typography;

const ChangePassword = () => {
  const [form] = Form.useForm();

  const [reauthenticate, setReauthenticate] = useState(true);

  const { currentUserAuth } = useAuth();
  // handle confirm password
  const handleConfirmPassword = async () => {
    const { password } = form.getFieldValue();
    const credential = EmailAuthProvider.credential(
      currentUserAuth?.email,
      password
    );
    try {
      await reauthenticateWithCredential(currentUserAuth, credential)
        .then(() => {
          form.resetFields();
          setReauthenticate(false);
        })
        .catch((error) => {
          const errorCode = error.code;
          if (errorCode === 'auth/wrong-password') {
            alert('Sai mật khẩu!');
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  // handle submit change password
  const handleChangePassword = async () => {
    try {
      const { newPassword } = form.getFieldValue();
      await updatePassword(currentUserAuth, newPassword)
        .then(() => {
          alert('Đổi mật khẩu thành công!');
          form.resetFields();
          setReauthenticate(true);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  if (reauthenticate) {
    return (
      <Wrapper>
        <Title className="title" level={2}>
          Nhập lại mật khẩu
        </Title>

        <Form
          name="change_password_form"
          form={form}
          onFinish={handleConfirmPassword}
        >
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập trường này!',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button
              size="large"
              type="primary"
              htmlType="submit"
              className="confirm-password-btn"
            >
              Xác nhận
            </Button>
          </Form.Item>
        </Form>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Title className="title" level={2}>
        Đổi mật khẩu
      </Title>

      <Form
        name="change_password_form"
        form={form}
        onFinish={handleChangePassword}
      >
        <Form.Item
          label="Mật khẩu mới"
          name="newPassword"
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
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Nhập lại mật khẩu"
          name="confirmPassword"
          dependencies={['newPassword']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập trường này!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Mật khẩu không trùng khớp'));
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
            className="change-password-btn"
          >
            Xác nhận
          </Button>
        </Form.Item>
      </Form>
    </Wrapper>
  );
};

export default ChangePassword;
