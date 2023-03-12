import React, { useEffect, useState } from 'react';
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
import { getBlogReviews } from '../../../components/Blog/blogReviewSlice';
import { getUsers } from '../../../components/Profile/profileSlice';
import { getBlogs } from '../../../components/Blog/blogSlice';
import { Link, useParams } from 'react-router-dom';
import { Wrapper } from './styles';

const { Title } = Typography;
const { TextArea } = Input;

const BlogReviewInfo = () => {
  useEffect(() => {
    document.title = 'Thông tin nhận xét bài viết - Food App';
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
  const { id } = useParams();

  // states
  const [currentBlogReview, setCurrentBlogReview] = useState({});
  const [formFieldsValue, setFormFieldsValue] = useState([]);

  useEffect(() => {
    if (
      blogReviewLoading === 'success' &&
      userLoading === 'success' &&
      blogLoading === 'success' &&
      users.length > 0 &&
      blogs.length > 0 &&
      blogReviews.length > 0
    ) {
      setCurrentBlogReview(
        blogReviews
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
          ?.find((blogReview) => blogReview.id === id)
      );
    }
  }, [
    blogReviewLoading,
    userLoading,
    blogLoading,
    users,
    blogs,
    blogReviews,
    id,
  ]);

  useEffect(() => {
    if (
      blogReviewLoading === 'success' &&
      userLoading === 'success' &&
      blogLoading === 'success' &&
      users.length > 0 &&
      blogs.length > 0 &&
      blogReviews.length > 0
    ) {
      setFormFieldsValue([
        {
          name: ['username'],
          value: currentBlogReview?.username,
        },
        {
          name: ['blogTitle'],
          value: currentBlogReview?.blogTitle,
        },
        {
          name: ['comments'],
          value: currentBlogReview?.comments?.join('\n'),
        },
      ]);
    }
  }, [
    blogReviewLoading,
    userLoading,
    blogLoading,
    users,
    blogs,
    blogReviews,
    currentBlogReview,
  ]);

  return (
    <Wrapper>
      <Title className="title" level={4}>
        Thông tin nhận xét
      </Title>
      {userLoading === 'success' &&
      blogLoading === 'success' &&
      blogReviewLoading === 'success' ? (
          <Card>
            <Row gutter={[32, 32]}>
              <Col span={18}>
                <Form fields={formFieldsValue}>
                  <Form.Item label="Người đánh giá" name="username">
                    <Input readOnly />
                  </Form.Item>

                  <Form.Item label="Bài viết nhận xét" name="blogTitle">
                    <Input readOnly />
                  </Form.Item>

                  <Form.Item label="Nhận xét" name="comments">
                    <TextArea rows={4} readOnly />
                  </Form.Item>
                </Form>
              </Col>
              <Col span={6} className="user-avatar">
                <Avatar size={120} src={currentBlogReview?.avatar}>
                  {currentBlogReview?.avatar
                    ? ''
                    : currentBlogReview?.username?.charAt(0)?.toUpperCase()}
                </Avatar>
              </Col>
            </Row>

            <div className="back">
              <Link to={'/app/admin/blog-reviews'}>
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

export default BlogReviewInfo;
