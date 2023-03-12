import React, { useEffect, useState } from 'react';
import { Wrapper } from './styles';
import {
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Spin,
  Typography,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers } from '../../../components/Profile/profileSlice';
import { Link, useParams } from 'react-router-dom';

const { Title } = Typography;

const UserInfo = () => {
  useEffect(() => {
    document.title = 'Thông tin người dùng - Food App';
  }, []);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const { userLoading, users } = useSelector((state) => state.users);
  const { id } = useParams();

  // states
  const [currentUser, setCurrentUser] = useState({});
  const [formFieldsValue, setFormFieldsValue] = useState([]);

  useEffect(() => {
    if (userLoading === 'success' && users.length > 0) {
      setCurrentUser(users?.find((user) => user.id === id));
    }
  }, [userLoading, users, id]);

  useEffect(() => {
    if (userLoading === 'success' && users.length > 0) {
      setFormFieldsValue([
        {
          name: ['displayName'],
          value: currentUser?.displayName,
        },
        {
          name: ['email'],
          value: currentUser?.email,
        },
        {
          name: ['address'],
          value: currentUser?.address ? currentUser?.address : 'Chưa cập nhật',
        },
        {
          name: ['phoneNumber'],
          value: currentUser?.phoneNumber
            ? currentUser?.phoneNumber
            : 'Chưa cập nhật',
        },
        {
          name: ['roles'],
          value: currentUser?.roles && 'Khách hàng',
        },
        {
          name: ['providerId'],
          value:
            currentUser?.providerId === 'password'
              ? 'Email và password'
              : 'Tài khoản Google',
        },
      ]);
    }
  }, [userLoading, users, currentUser]);

  return (
    <Wrapper>
      <Title className="title" level={4}>
        Thông tin tài khoản
      </Title>
      {userLoading === 'success' ? (
        <Card>
          <Row gutter={[32, 32]}>
            <Col span={18}>
              <Form fields={formFieldsValue}>
                <Form.Item label="Tên hiển thị" name="displayName">
                  <Input readOnly />
                </Form.Item>

                <Form.Item label="Email" name="email">
                  <Input readOnly />
                </Form.Item>

                <Form.Item label="Địa chỉ" name="address">
                  <Input readOnly />
                </Form.Item>

                <Form.Item label="Số điện thoại" name="phoneNumber">
                  <Input readOnly />
                </Form.Item>

                <Form.Item label="Vai trò" name="roles">
                  <Input readOnly />
                </Form.Item>

                <Form.Item label="Phương thức đăng nhập" name="providerId">
                  <Input readOnly />
                </Form.Item>
              </Form>
            </Col>
            <Col span={6} className="user-avatar">
              <Avatar size={120} src={currentUser?.photoURL}>
                {currentUser?.photoURL
                  ? ''
                  : currentUser?.displayName
                    ? currentUser?.displayName?.charAt(0)?.toUpperCase()
                    : currentUser?.email?.charAt(0).toUpperCase()}
              </Avatar>
            </Col>
          </Row>
          <div className="back">
            <Link to={'/app/admin/users'}>
              <Button type="primary" size="large">
                Quay lại
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <Spin />
      )}
    </Wrapper>
  );
};

export default UserInfo;
