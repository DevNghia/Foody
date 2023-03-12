import React, { useEffect, useState } from 'react';
import { Avatar, Button, Card, Input, Modal, Table, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteBlogReviewById,
  getBlogReviews,
  setBlogReviewLoading,
  setRemoveBlogReviewStatus,
} from '../../../components/Blog/blogReviewSlice';
import { getUsers } from '../../../components/Profile/profileSlice';
import { getBlogs } from '../../../components/Blog/blogSlice';
import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Wrapper } from './styles';
import { Link } from 'react-router-dom';
import { deleteDocument, updateDocument } from '../../../firebase/services';
import { serverTimestamp } from 'firebase/firestore';

const { Title, Text } = Typography;
const { confirm } = Modal;

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

const RemovedBlogReview = () => {
  useEffect(() => {
    document.title = 'Nhận xét bài viết đã xoá gần đây - Food App';
  }, []);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getBlogReviews());
    dispatch(getUsers());
    dispatch(getBlogs());
  }, [dispatch]);

  const { blogReviewLoading, blogReviews } = useSelector(
    (state) => state.blogReviews
  );
  const { blogLoading, blogs } = useSelector((state) => state.blogs);
  const { userLoading, users } = useSelector((state) => state.users);

  // states
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [blogReviewsPreview, setBlogReviewsPreview] = useState([]);

  useEffect(() => {
    if (
      blogReviewLoading === 'success' &&
      userLoading === 'success' &&
      blogLoading === 'success'
    ) {
      setBlogReviewsPreview(
        blogReviews
          ?.filter((blogReview) => blogReview.removed === true)
          ?.map((blogReview) => ({
            ...blogReview,
            key: blogReview.id,
            username: users?.find((user) => user.uid === blogReview.userId)
              ?.displayName,
            avatar: users?.find((user) => user.uid === blogReview.userId)
              ?.photoURL,
            blogTitle: blogs?.find((blog) => blog.blogId === blogReview.blogId)
              ?.title,
          }))
      );
    }
  }, [blogReviewLoading, blogReviews, users, blogs, userLoading, blogLoading]);

  // select row
  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys([...selectedRowKeys]);
  };

  // config table
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const columns = [
    {
      title: 'Người nhận xét',
      dataIndex: 'username',
      key: 'username',
      render: (username, record) => (
        <div className="user_info">
          <Avatar size="large" src={record?.avatar}>
            {record?.avatar ? '' : record?.username?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Text className="user_name">
            {username?.length < 30
              ? username
              : username?.substring(0, 30) + '...'}
          </Text>
        </div>
      ),
      sorter: (a, b) => a.username.localeCompare(b.username),
    },
    {
      title: 'Bài viết nhận xét',
      dataIndex: 'blogTitle',
      key: 'blogTitle',
      sorter: (a, b) => a.blogTitle.localeCompare(b.blogTitle),
      render: (blogTitle) =>
        blogTitle?.length < 30
          ? blogTitle
          : blogTitle?.substring(0, 30) + '...',
    },
    {
      title: 'Nhận xét',
      dataIndex: 'comments',
      key: 'comments',
      render: (comments) =>
        comments?.join('\n')?.length < 30
          ? comments?.join('\n')
          : comments?.join('\n')?.substring(0, 30) + '...',
      sorter: (a, b) =>
        a.comments?.join('\n').localeCompare(b.comments?.join('\n')),
    },
    {
      title: '',
      key: 'action',
      render: (record) => (
        <div className="btn_wrapper">
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            className="restore_btn"
            onClick={() => handleRestoreClick(record.id)}
          >
            Khôi phục
          </Button>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            className="remove_btn"
            onClick={() => handleDeleteClick(record.id)}
          >
            Xoá vĩnh viễn
          </Button>
        </div>
      ),
      width: '15%',
    },
  ];

  // handle restore one blog review
  const handleRestoreClick = (id) => {
    dispatch(setBlogReviewLoading('pending'));
    updateDocument('blogReviews', id, {
      removed: false,
      updatedAt: serverTimestamp(),
    })
      .then(() => {
        dispatch(setRemoveBlogReviewStatus({ id, status: false }));
        setSelectedRowKeys(
          selectedRowKeys.filter((selectedRowKey) => selectedRowKey !== id)
        );
        dispatch(setBlogReviewLoading('success'));
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

  // handle restore more blog review
  const handleRestoreMoreBlogReview = () => {
    try {
      dispatch(setBlogReviewLoading('pending'));
      selectedRowKeys?.forEach((id, index) => {
        updateDocument('blogReviews', id, {
          removed: false,
          updatedAt: serverTimestamp(),
        })
          .then(() => {
            dispatch(setRemoveBlogReviewStatus({ id, status: false }));
          })
          .then(() => {
            if (index === selectedRowKeys.length - 1) {
              setSelectedRowKeys([]);
              dispatch(setBlogReviewLoading('success'));
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

  // handle delete one blog review
  const handleDeleteClick = (id) => {
    confirm({
      title: 'Xác nhận xoá nhận xét',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn muốn thực hiện xoá?',
      onOk() {
        dispatch(setBlogReviewLoading('pending'));
        deleteDocument('blogReviews', id)
          .then(() => {
            dispatch(deleteBlogReviewById(id));
            setSelectedRowKeys(
              selectedRowKeys.filter((selectedRowKey) => selectedRowKey !== id)
            );
            dispatch(setBlogReviewLoading('success'));
            alert('Xoá thành công');
          })
          .catch((error) => {
            console.log(error);
            alert(error);
          });
      },
      onCancel() {},
    });
  };

  // handle delete more blog review
  const handleDeleteMoreBlogReview = () => {
    confirm({
      title: 'Xác nhận xoá nhận xét',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn muốn thực hiện xoá?',
      onOk() {
        dispatch(setBlogReviewLoading('pending'));
        selectedRowKeys.forEach((id, index) => {
          deleteDocument('blogReviews', id)
            .then(() => {
              dispatch(deleteBlogReviewById(id));
            })
            .then(() => {
              if (index === selectedRowKeys.length - 1) {
                setSelectedRowKeys([]);
                dispatch(setBlogReviewLoading('success'));
                alert('Xoá thành công');
              }
            })
            .catch((error) => {
              console.log(error);
              alert(error);
            });
        });
      },
      onCancel() {},
    });
  };

  // handle search
  const handleSearch = (e) => {
    try {
      let result = [];
      dispatch(setBlogReviewLoading('pending'));
      const firstList = blogReviews
        ?.filter((blogReview) => blogReview?.removed === true)
        ?.map((blogReview) => ({
          ...blogReview,
          key: blogReview.id,
          username: users?.find((user) => user.uid === blogReview.userId)
            ?.displayName,
          avatar: users?.find((user) => user.uid === blogReview.userId)
            ?.photoURL,
          blogTitle: blogs?.find((blog) => blog.blogId === blogReview.blogId)
            ?.title,
        }))
        ?.filter(
          (blogReview) =>
            blogReview?.username
              ?.toLowerCase()
              ?.includes(e.target.value?.toLowerCase()) ||
            blogReview?.blogTitle
              ?.toLowerCase()
              ?.includes(e.target.value?.toLowerCase())
        );
      const secondList = blogReviews
        ?.filter((blogReview) => blogReview.removed === true)
        ?.map((blogReview) => ({
          ...blogReview,
          key: blogReview.id,
          username: users?.find((user) => user.uid === blogReview.userId)
            ?.displayName,
          avatar: users?.find((user) => user.uid === blogReview.userId)
            ?.photoURL,
          blogTitle: blogs?.find((blog) => blog.blogId === blogReview.blogId)
            ?.title,
        }))
        ?.filter(
          (blogReview) =>
            convertVietnamese(blogReview?.username)
              ?.toLowerCase()
              ?.includes(e.target.value?.toLowerCase()) ||
            convertVietnamese(blogReview?.blogTitle)
              ?.toLowerCase()
              ?.includes(e.target.value?.toLowerCase())
        );
      result = [...firstList];
      secondList.forEach((blogReview) => {
        if (
          firstList.filter(
            (blogReviewFirstList) => blogReviewFirstList.id === blogReview.id
          )?.length === 0
        ) {
          result.push(blogReview);
        }
      });
      setBlogReviewsPreview(result);
      dispatch(setBlogReviewLoading('success'));
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  return (
    <Wrapper>
      <Title className="title" level={4}>
        Nhận xét bài viết đã xoá gần đây
      </Title>
      <Card>
        <div className="top">
          <div className="search-filter">
            <Input
              size="large"
              placeholder="Tìm kiếm nhận xét của khách hàng"
              prefix={<SearchOutlined />}
              onChange={handleSearch}
            />
          </div>
        </div>
        <div className="product-reviews_list">
          <div className="action">
            <Button
              type="primary"
              danger
              disabled={selectedRowKeys.length < 1}
              onClick={handleDeleteMoreBlogReview}
            >
              Xoá vĩnh viễn
            </Button>
            <Button
              type="primary"
              disabled={selectedRowKeys.length < 1}
              onClick={handleRestoreMoreBlogReview}
            >
              Khôi phục
            </Button>
            {selectedRowKeys.length > 0 && (
              <Text className="product-review_selected">{`Đã chọn ${selectedRowKeys.length} nhận xét bài viết`}</Text>
            )}
          </div>
          <Table
            columns={columns}
            dataSource={blogReviewsPreview}
            rowSelection={rowSelection}
            loading={
              userLoading === 'pending' ||
              blogLoading === 'pending' ||
              blogReviewLoading === 'pending'
            }
          />
        </div>
        <div className="back">
          <Link to={'/app/admin/blog-reviews'}>
            <Button type="primary" size="large">
              Quay lại
            </Button>
          </Link>
        </div>
      </Card>
    </Wrapper>
  );
};

export default RemovedBlogReview;
