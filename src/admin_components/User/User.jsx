import React, { useEffect, useState } from 'react';
import { Avatar, Button, Card, Input, Table, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  getUsers,
  setLoadingProfile,
} from '../../components/Profile/profileSlice';
import { Wrapper } from './styles';
import { EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

function convertVietnamese(str) {
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|$|_/g,
    '-'
  );
  str = str.replace(/-+-/g, '-');
  str = str.replace(/^\-+|\-+$/g, '');

  return str;
}

const User = () => {
  useEffect(() => {
    document.title = 'Người dùng - Food App';
  }, []);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const { userLoading, users } = useSelector((state) => state.users);

  // states
  const [usersPreview, setUsersPreview] = useState([]);

  useEffect(() => {
    if (userLoading === 'success') {
      setUsersPreview(users?.filter((user) => user?.roles === 'customer'));
    }
  }, [userLoading, users]);

  // config table
  const columns = [
    {
      title: 'Người dùng',
      dataIndex: 'displayName',
      key: 'displayName',
      render: (displayName, record) => (
        <div className="user_info">
          <Avatar size="large" src={record?.photoURL}>
            {record?.photoURL
              ? ''
              : record?.displayName
                ? record?.displayName?.charAt(0)?.toUpperCase()
                : record?.email?.charAt(0).toUpperCase()}
          </Avatar>
          <Text className="user_title">
            {displayName?.length < 30
              ? displayName
              : displayName?.substring(0, 30) + '...'}
          </Text>
        </div>
      ),
      sorter: (a, b) => a.displayName.localeCompare(b.displayName),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: 'Loại tài khoản',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles) => (roles === 'customer' ? 'Khách hàng' : 'Nhân viên'),
    },
    {
      title: '',
      key: 'action',
      render: (record) => (
        <>
          <div className="btn_wrapper">
            <Link to={`info/${record.id}`}>
              <Button
                type="primary"
                icon={<EyeOutlined />}
                className="show_btn"
              >
                Xem thông tin
              </Button>
            </Link>
          </div>
        </>
      ),
      width: '15%',
    },
  ];

  // handle search
  const handleSearch = (e) => {
    try {
      let result = [];
      dispatch(setLoadingProfile('pending'));
      const firstList = users?.filter(
        (user) =>
          user?.roles === 'customer' &&
          user?.displayName
            ?.toLowerCase()
            ?.includes(e.target.value?.toLowerCase())
      );
      const secondList = users?.filter(
        (user) =>
          user?.roles === 'customer' &&
          convertVietnamese(user?.displayName)
            ?.toLowerCase()
            ?.includes(e.target.value?.toLowerCase())
      );
      result = [...firstList];
      secondList.forEach((user) => {
        if (
          firstList.filter((userFirstList) => userFirstList.id === user.id)
            ?.length === 0
        ) {
          result.push(user);
        }
      });
      setUsersPreview(result);
      dispatch(setLoadingProfile('success'));
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  return (
    <Wrapper>
      <Title className="title" level={4}>
        Danh sách người dùng
      </Title>
      <Card>
        <div className="top">
          <div className="search-wrapper">
            <Input
              size="large"
              placeholder="Tìm kiếm"
              prefix={<SearchOutlined />}
              onChange={handleSearch}
            />
          </div>
        </div>
        <div className="users_list">
          <Table
            columns={columns}
            dataSource={usersPreview}
            loading={userLoading === 'pending'}
          />
        </div>
      </Card>
    </Wrapper>
  );
};

export default User;
