import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BannerWrapper, BlogListWrapper } from './styles';
import { Typography, Image, Row, Col, Pagination, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getBlogs } from '../../components/Blog/blogSlice';
import moment from 'moment';

const { Text, Title, Paragraph } = Typography;

const Blogs = () => {
  useEffect(() => {
    document.title = 'Bài viết - Burger King';
    window.scrollTo(0, 0);
  }, []);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getBlogs());
  }, [dispatch]);

  const { blogLoading, blogs } = useSelector((state) => state.blogs);
  const location = useLocation();

  // states
  const [blogsPreview, setBlogsPreview] = useState([]);
  const [selected, setSelected] = useState('blogs');

  useEffect(() => {
    if (blogLoading === 'success') {
      if (selected === 'blogs') {
        setBlogsPreview(blogs?.filter((blog) => blog.removed === false));
      } else if (selected === 'category') {
        setBlogsPreview(
          blogs?.filter(
            (blog) =>
              blog.removed === false &&
              blog.category === location.pathname.split('/')[3]
          )
        );
      } else if (selected === 'time') {
        setBlogsPreview(
          blogs?.filter(
            (blog) =>
              blog.removed === false &&
              blog.timeGroup === location.pathname.split('/')[3]
          )
        );
      }
    }
  }, [blogs, blogLoading, selected, location]);

  useEffect(() => {
    if (location.pathname.split('/').length === 4) {
      if (location.pathname.split('/')[2] === 'category') {
        setSelected('category');
      } else if (location.pathname.split('/')[2] === 'time') {
        setSelected('time');
      }
    } else if (location.pathname.split('/').length === 2) {
      setSelected('blogs');
    }
  }, [location]);

  // config blog pagination
  const numEachPage = 4;
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(numEachPage);
  const handlePaginationChange = (current) => {
    setMin((current - 1) * numEachPage);
    setMax(current * numEachPage);
  };

  // idea: check location -> set selected
  return (
    <>
      <BannerWrapper>
        <div className="banner">
          <div className="content-wrapper">
            {selected === 'blogs' && (
              <div className="navigate">
                <Link to="/">Trang chủ</Link>
                <Text> / Bài viết</Text>
              </div>
            )}
            {selected === 'category' && (
              <div className="navigate">
                <Link to="/">Trang chủ</Link>
                <Text> / </Text>
                <Link to="/blogs">Bài viết</Link>
                <Text> / Phân loại {location.pathname.split('/')[3]}</Text>
              </div>
            )}
            {selected === 'time' && (
              <div className="navigate">
                <Link to="/">Trang chủ</Link>
                <Text> / </Text>
                <Link to="/blogs">Bài viết</Link>
                <Text> / Nhóm thời gian {location.pathname.split('/')[3]}</Text>
              </div>
            )}
            <Title level={1} className="title">
              Bài viết
            </Title>
            <Paragraph className="content">
              Chia sẻ kiến thức về các món ngon của chúng tôi. Những bài viết sẽ
              giúp bạn hiểu rõ nhất các món chúng tôi gửi tới bạn.
            </Paragraph>
          </div>
        </div>
      </BannerWrapper>

      {blogLoading === 'success' ? (
        <BlogListWrapper>
          <div className="container">
            <Row>
              {blogsPreview?.length > 0 &&
                blogsPreview?.slice(min, max)?.map((blog) => (
                  <Col key={blog?.id} span={24}>
                    <Image src={blog?.images[0]} width={'100%'} />
                    <div className="category_time_wrapper">
                      <Link to={`category/${blog?.category}`}>
                        {blog?.category}
                      </Link>
                      <Text> / </Text>
                      <Link to={`time/${blog?.timeGroup}`}>
                        {moment(blog?.createdAt?.seconds * 1000).format(
                          'DD-MM-YYYY'
                        )}
                      </Link>
                    </div>
                    <Link to={`${blog?.id}`} className="title">
                      {blog?.title}
                    </Link>
                    <Text className="content_slice">
                      {blog?.contents?.join('\n')?.length < 200
                        ? blog?.contents?.join('\n')
                        : blog?.contents?.join('\n').substring(0, 200) + '...'}
                    </Text>
                    <Link to={`${blog?.id}`} className="read_more">
                      Xem thêm
                    </Link>
                  </Col>
                ))}
            </Row>
            <div className="pagination">
              <Pagination
                pageSize={numEachPage}
                defaultCurrent={1}
                total={blogsPreview.length}
                onChange={handlePaginationChange}
              />
            </div>
          </div>
        </BlogListWrapper>
      ) : (
        <Spin />
      )}
    </>
  );
};

export default Blogs;
