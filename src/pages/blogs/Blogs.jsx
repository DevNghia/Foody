import React from 'react';
import { Col, Row, Typography, Image, Button } from 'antd';
import Burger from '../../assets/images/burger-salmon_new__1.jpg';
import { Link } from 'react-router-dom';
import {
  CalendarOutlined, FolderOutlined, UserOutlined
} from '@ant-design/icons';
import {
  BannerWrapper,
  SomethingAboutBKWrapper,
  ButtonStyled,
  PhotoGalleryWrapper,
  BlogsList,
} from './styles';
const { Paragraph, Title, Text } = Typography;

const Blogs = () => {
  return (
    <>
      <BannerWrapper>
        <div className="banner">
          <div className="content-wrapper">
            <div className="navigate">
              <Link to="/">Trang chủ</Link>
              <Text> / Blogs</Text>
            </div>
            <Title level={1} className="title">
              Blogs
            </Title>
            <Paragraph className="content">
              Bạn có dùng thức ăn nhanh? Có nhiều người phàn nàn về nó nhưng
              thức ăn nhanh đúng là những món ăn ngon! Bởi chúng rất thuận tiện
              và đáp ứng được ở mọi nơi.
            </Paragraph>
          </div>
        </div>
      </BannerWrapper>
      <>
        
        <BlogsList>
          <div className="container">
            <Row >
              <Col span={18}>
                <div className="blog-grid">
                  <a href="#" className="blog-image"><Image width="100%" src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" /></a>
                  <div className="blog-infor">
                    <ul>
                      <li><CalendarOutlined /><i> 26.Sep 2020.</i></li>
                      <li><UserOutlined /><i> by </i> <a href="">merkulove</a></li>
                      <li><FolderOutlined /><i> in </i> <a href="">streetfood</a></li>
                    </ul>
                  </div>
                  <h1 className="blog-title">FOOD TRUCKS : WHERE TO STOCK UP ON INGREDIENTS</h1>
                  <Button type="primary" > Read post </Button>
                </div>   
                <div className="blog-grid">
                  <a href="#" className="blog-image"><Image width="100%" src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" /></a>
                  <div className="blog-infor">
                    <ul>
                      <li><CalendarOutlined /><i> 26.Sep 2020.</i></li>
                      <li><UserOutlined /><i> by </i> <a href="">merkulove</a></li>
                      <li><FolderOutlined /><i> in </i> <a href="">streetfood</a></li>
                    </ul>
                  </div>
                  <h1 className="blog-title">FOOD TRUCKS : WHERE TO STOCK UP ON INGREDIENTS</h1>
                  <Button type="primary" > Read post </Button>
                </div>
                <div className="blog-grid">
                  <a href="#" className="blog-image"><Image width="100%" src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" /></a>
                  <div className="blog-infor">
                    <ul>
                      <li><CalendarOutlined /><i> 26.Sep 2020.</i></li>
                      <li><UserOutlined /><i> by </i> <a href="">merkulove</a></li>
                      <li><FolderOutlined /><i> in </i> <a href="">streetfood</a></li>
                    </ul>
                  </div>
                  <h1 className="blog-title">FOOD TRUCKS : WHERE TO STOCK UP ON INGREDIENTS</h1>
                  <Button type="primary" > Read post </Button>
                </div>       
              </Col>              
              <Col className="left-side" span={6}>
                <div className="sidebar-title">
                  <h5>Categories</h5>
                </div>
                <div className="wiget">
                  <ul>
                    <li>
                      <a href="">Burgers</a>
                      <span>15</span></li>
                    <li>
                      <a href="">Buritos</a>
                      <span>15</span></li>
                    <li>
                      <a href="">Restaurant</a>
                      <span>34</span></li>
                    <li>
                      <a href="">Cafe</a>
                      <span>7</span></li>
                    <li>
                      <a href="">Cheafs</a>
                      <span>13</span></li>
                  </ul>
                </div>
                <div className="sidebar-title">
                  <h5>LATEST POSTS</h5>
                </div>
                <div className="sidebar-post">
                    <div className="single-post">
                        <img src="https://rayoflightthemes.com/htmltemplates/burgos_street_food_html5_template/burgos_html/images/sidebarpost1.png" alt="" />
                        <div className="post-infor">
                            <h6><a href="">Burgers Of Melbourne is Helping</a></h6>
                            <span>24 Sep 2020</span>
                        </div>
                    </div>
                </div>
                <div className="sidebar-post">
                    <div className="single-post">
                        <img src="https://rayoflightthemes.com/htmltemplates/burgos_street_food_html5_template/burgos_html/images/sidebarpost1.png" alt="" />
                        <div className="post-infor">
                            <h6><a href="">Savoir Faire is Everywhere</a></h6>
                            <span>24 Sep 2020</span>
                        </div>
                    </div>
                </div>
              </Col>
            </Row>
          </div>
        </BlogsList>
      </>
    </>
  );
};

export default Blogs;
