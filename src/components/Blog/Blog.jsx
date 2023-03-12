import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  AddReviewWrapper,
  BannerWrapper,
  PostContentWrapper,
  ReviewWrapper,
} from './styles';
import {
  Avatar,
  Button,
  Form,
  Image,
  Input,
  Menu,
  Spin,
  Typography,
} from 'antd';
import { CalendarOutlined, FolderOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { getBlogs } from './blogSlice';
import { getBlogReviews } from './blogReviewSlice';
import { getUsers } from '../Profile/profileSlice';
import moment from 'moment';
import { auth } from '../../firebase/config';
import { addDocument } from '../../firebase/services';

const { Text, Title } = Typography;
const { TextArea } = Input;

const Blog = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getBlogs());
    dispatch(getBlogReviews());
    dispatch(getUsers());
  }, [dispatch]);

  const { isLogged } = useSelector((state) => state.login);
  const { blogReviewLoading, blogReviews } = useSelector(
    (state) => state.blogReviews
  );
  const { blogLoading, blogs } = useSelector((state) => state.blogs);
  const { userLoading, users } = useSelector((state) => state.users);
  const { id } = useParams();

  // states
  const [currentBlog, setCurrentBlog] = useState({});
  const [currentPreviews, setCurrentPreviews] = useState([]);

  useEffect(() => {
    if (
      blogLoading === 'success' &&
      blogReviewLoading === 'success' &&
      userLoading === 'success'
    ) {
      setCurrentPreviews(
        blogReviews
          ?.filter(
            (blogReview) =>
              blogReview.blogId === currentBlog?.blogId &&
              blogReview.removed === false
          )
          ?.map((blogReview) => ({
            ...blogReview,
            username: users?.find((user) => user.uid === blogReview.userId)
              ?.displayName,
            avatar: users?.find((user) => user.uid === blogReview.userId)
              ?.photoURL,
          }))
      );
    }
  }, [
    blogLoading,
    blogReviewLoading,
    userLoading,
    users,
    blogReviews,
    currentBlog,
  ]);

  useEffect(() => {
    if (blogLoading === 'success') {
      setCurrentBlog(
        blogs
          ?.filter((blog) => blog.removed === false)
          ?.find((blog) => blog.id === id)
      );
    }
  }, [blogLoading, blogs, id]);

  useEffect(() => {
    document.title = `${currentBlog?.title} - Burger King`;
    window.scrollTo(0, 0);
  }, [currentBlog]);

  const [form] = Form.useForm();

  const metaListItems = [
    {
      label: (
        <Link to={`/blogs/time/${currentBlog?.timeGroup}`}>
          {moment(currentBlog?.createdAt?.seconds * 1000).format('DD-MM-YYYY')}
        </Link>
      ),
      key: 'time',
      icon: <CalendarOutlined />,
    },
    {
      label: (
        <Link to={`/blogs/category/${currentBlog?.category}`}>
          Bộ sưu tập {currentBlog?.category}
        </Link>
      ),
      key: 'category',
      icon: <FolderOutlined />,
    },
  ];

  // handle add review
  const addReviewSubmit = () => {
    try {
      const { review } = form.getFieldValue();
      const payload = {
        userId: auth.currentUser?.uid,
        blogId: currentBlog?.blogId,
        comments: review?.split('\n'),
        removed: false,
      };
      addDocument('blogReviews', payload)
        .then(() => {
          setCurrentPreviews([
            ...currentPreviews,
            {
              ...payload,
              createdAt: { seconds: Date.now() },
              username: users?.find((user) => user.uid === payload.userId)
                ?.displayName,
              avatar: users?.find((user) => user.uid === payload.userId)
                ?.photoURL,
            },
          ]);
          form.resetFields();
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

  return (
    <>
      <BannerWrapper>
        <div className="banner">
          <div className="content-wrapper">
            <div className="navigate">
              <Link to="/">Trang chủ</Link>
              <Text> / </Text>
              <Link to="/blogs">Bài viết</Link>
              <Text> / Chi tiết bài viết</Text>
            </div>
            <Title level={1} className="title">
              {/* {currentBlog?.title?.length < 35
                ? currentBlog?.title
                : currentBlog?.title?.substring(0, 35) + '...'} */}
              {currentBlog?.title}
            </Title>
            <Menu items={metaListItems} />
          </div>
        </div>
      </BannerWrapper>

      {blogLoading === 'success' &&
      blogReviewLoading === 'success' &&
      userLoading === 'success' ? (
          <>
            <PostContentWrapper>
              <div className="container">
                {currentBlog?.contents?.length < 3
                  ? currentBlog?.contents?.map((paragraph, index) => (
                    <Text key={index}>{paragraph}</Text>
                  ))
                  : currentBlog?.contents
                    ?.slice(0, 2)
                    .map((paragraph, index) => (
                      <Text key={index}>{paragraph}</Text>
                    ))}
                <div className="images-wrapper">
                  {currentBlog?.images?.map((image, index) => (
                    <Image key={index} src={image} />
                  ))}
                </div>
                {currentBlog?.contents?.length > 0 &&
                currentBlog?.contents
                  ?.slice(2, currentBlog?.contents?.length)
                  .map((paragraph, index) => (
                    <Text key={index}>{paragraph}</Text>
                  ))}
              </div>
            </PostContentWrapper>

            <ReviewWrapper>
              <div className="container">
                <Title level={4}>Nhận xét ({currentPreviews?.length})</Title>
                {currentPreviews?.length > 0 ? (
                  currentPreviews?.map((preview) => (
                    <div className="review-wrapper" key={preview?.id}>
                      <Avatar size={60} src={preview?.avatar}>
                        {preview?.avatar
                          ? ''
                          : preview?.username?.charAt(0)?.toUpperCase()}
                      </Avatar>
                      <div className="review">
                        <div className="top">
                          <Text className="username">{preview?.username}</Text>
                          <Text className="time">
                            {moment(preview?.createdAt?.seconds * 1000).format(
                              'DD-MM-YYYY'
                            )}
                          </Text>
                        </div>
                        <div className="comments">
                          {preview?.comments?.map((review, index) => (
                            <Text key={index}>{review}</Text>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <Text className="no-preview">Chưa có đánh giá nào</Text>
                )}
              </div>
            </ReviewWrapper>

            <AddReviewWrapper>
              <div className="container">
                <Title level={4}>Thêm nhận xét</Title>
                {isLogged ? (
                  <Form
                    form={form}
                    onFinish={addReviewSubmit}
                    name="add-review"
                    className="add-review-form"
                  >
                    <Form.Item
                      name="review"
                      label="Nhận xét của bạn"
                      rules={[
                        {
                          required: true,
                          message: 'Vui lòng nhập trường này!',
                        },
                      ]}
                    >
                      <TextArea rows={4} placeholder="Nhận xét" />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        size="large"
                        type="primary"
                        htmlType="submit"
                        className="add-review-btn"
                      >
                      Nhận xét
                      </Button>
                    </Form.Item>
                  </Form>
                ) : (
                  <Text className="require-login">
                  Đăng nhập để thêm nhận xét của bạn
                  </Text>
                )}
              </div>
            </AddReviewWrapper>
          </>
        ) : (
          <Spin />
        )}
    </>
  );
};

export default Blog;
