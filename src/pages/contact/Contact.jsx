import React from 'react';
import { Col, Row, Typography, Image } from 'antd';
import Burger from '../../assets/images/burger-salmon_new__1.jpg';
import { Link } from 'react-router-dom';
import {
  BannerWrapper,
  SomethingAboutBKWrapper,
  ButtonStyled,
  PhotoGalleryWrapper,
} from './styles';
const { Paragraph, Title, Text } = Typography;

const Contact = () => {
  return (
    <>
      <BannerWrapper>
        <div className="banner">
          <div className="content-wrapper">
            <div className="navigate">
              <Link to="/">Trang chủ</Link>
              <Text> / Về chúng tôi</Text>
            </div>
            <Title level={1} className="title">
              Về chúng tôi
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
        <SomethingAboutBKWrapper>
          <div className="container">
            <Row gutter={[32, 32]}>
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <Image src={Burger} width="100%" />
              </Col>
              <Col
                xl={12}
                lg={12}
                md={12}
                sm={24}
                xs={24}
                className="something-text"
              >
                <Title level={2}>đôi điều về chúng tôi</Title>
                <Text>
                  Bạn thích ăn đồ ăn ngon hay món tráng miệng. Bất cứ thứ gì
                  ngon miệng? Chúng tôi có đồ ăn nhanh rẻ và ngon. Chúng tôi có
                  những suất ăn lớn và sắp đồ rất đầy đủ, đặc biệt là phô mai.
                  Phô mai rất ngon. Chúng tôi có khoai tây chiên kiểu Pháp rất
                  ngon.
                </Text>
                <Link to="/products">
                  <ButtonStyled size="middle">Xem thực đơn</ButtonStyled>
                </Link>
              </Col>
            </Row>
          </div>
        </SomethingAboutBKWrapper>

        <PhotoGalleryWrapper>
          <Title level={2}>thư viện hình ảnh</Title>
          <div className="container">
            <Row gutter={[16, 32]}>
              <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                <Image src={Burger} width="100%" height="420px" />
              </Col>
              <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                <Image src={Burger} width="100%" height="420px" />
              </Col>
              <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                <Image src={Burger} width="100%" height="420px" />
              </Col>
              <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                <Image src={Burger} width="100%" height="420px" />
              </Col>
              <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                <Image src={Burger} width="100%" height="420px" />
              </Col>
              <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                <Image src={Burger} width="100%" height="420px" />
              </Col>
              <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                <Image src={Burger} width="100%" height="420px" />
              </Col>
              <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                <Image src={Burger} width="100%" height="420px" />
              </Col>
            </Row>
          </div>
        </PhotoGalleryWrapper>
      </>
    </>
  );
};

export default Contact;
