import React, { useEffect, useState } from 'react';
import { Avatar, Button, Card, Input, Table, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers } from '../../components/Profile/profileSlice';
import {
  getBlogReviews,
  setBlogReviewLoading,
  setRemoveBlogReviewStatus,
} from '../../components/Blog/blogReviewSlice';
import { getBlogs } from '../../components/Blog/blogSlice';
import { Link } from 'react-router-dom';
import { DeleteOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { Wrapper } from './styles';
import { updateDocument } from '../../firebase/services';
import { serverTimestamp } from 'firebase/firestore';

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

const BlogReview = () => {
  useEffect(() => {
    document.title = 'Nhận xét bài viết - Food App';
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
  const [blogReviewRemovedQuantity, setBlogReviewRemovedQuantity] = useState(0);
  const [blogReviewsPreview, setBlogReviewsPreview] = useState([]);

  useEffect(() => {
    if (
      blogReviewLoading === 'success' &&
      userLoading === 'success' &&
      blogLoading === 'success'
    ) {
      setBlogReviewRemovedQuantity(
        blogReviews?.filter((blogReview) => blogReview.removed === true)?.length
      );
      setBlogReviewsPreview(
        blogReviews
          ?.filter((blogReview) => blogReview.removed === false)
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
        <>
          <div className="btn_wrapper">
            <Link to={`info/${record.id}`}>
              <Button
                type="primary"
                icon={<EyeOutlined />}
                className="edit_btn"
              >
                Xem thông tin
              </Button>
            </Link>
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              className="remove_btn"
              onClick={() => handleRemoveBlogReview(record.id)}
            >
              Xoá
            </Button>
          </div>
        </>
      ),
      width: '15%',
    },
  ];

  // handle remove one blog review
  const handleRemoveBlogReview = (id) => {
    try {
      dispatch(setBlogReviewLoading('pending'));
      updateDocument('blogReviews', id, {
        removed: true,
        updatedAt: serverTimestamp(),
      })
        .then(() => {
          dispatch(setRemoveBlogReviewStatus({ id, status: true }));
          setBlogReviewRemovedQuantity(blogReviewRemovedQuantity + 1);
          setSelectedRowKeys(
            selectedRowKeys.filter((selectedRowKey) => selectedRowKey !== id)
          );
          dispatch(setBlogReviewLoading('success'));
        })
        .catch((error) => {
          console.log(error);
          alert(error);
        });
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  // handle remove more blog review
  const handleRemoveMoreBlogReview = () => {
    try {
      dispatch(setBlogReviewLoading('pending'));
      selectedRowKeys?.forEach((id, index) => {
        updateDocument('blogReviews', id, {
          removed: true,
          updatedAt: serverTimestamp(),
        })
          .then(() => {
            dispatch(setRemoveBlogReviewStatus({ id, status: true }));
            setBlogReviewRemovedQuantity(blogReviewRemovedQuantity + 1);
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

  // handle search
  const handleSearch = (e) => {
    try {
      let result = [];
      dispatch(setBlogReviewLoading('pending'));
      const firstList = blogReviews
        ?.filter((blogReview) => blogReview?.removed === false)
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
        ?.filter((blogReview) => blogReview.removed === false)
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
        Danh sách nhận xét bài viết
      </Title>
      <Card>
        <div className="top">
          <div className="search-wrapper">
            <Input
              size="large"
              placeholder="Tìm kiếm nhận xét của khách hàng"
              prefix={<SearchOutlined />}
              onChange={handleSearch}
            />
          </div>
        </div>
        <div className="blogs_list">
          <div className="action">
            <Link to={'removed'} className="removed">
              <DeleteOutlined />
              <Text>{blogReviewRemovedQuantity}</Text>
            </Link>
            <Button
              type="primary"
              danger
              disabled={selectedRowKeys.length < 1}
              onClick={handleRemoveMoreBlogReview}
            >
              Xoá
            </Button>
            {selectedRowKeys.length > 0 && (
              <Text className="blog-review_selected">{`Đã chọn ${selectedRowKeys.length} nhận xét bài viết`}</Text>
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
      </Card>
    </Wrapper>
  );
};

export default BlogReview;
