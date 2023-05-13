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
              <Link to="/">Home</Link>
              <Text> / Contacts</Text>
            </div>
            <Title level={1} className="title">
              CONTACTS
            </Title>
            <Paragraph className="content">
              Diam ut venenatis tellus in metus vulputate eu. Placerat in
              egestas erat imperdiet. Velit euismod in pellentesque massa
              placerat duis ultricies lacus sed.
            </Paragraph>
          </div>
        </div>
      </BannerWrapper>
      <>
        <SomethingAboutBKWrapper>
          <div className="container">
            <Row gutter={[32, 32]}>
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <iframe
                  src="https://bom.so/8zjrBG"
                  height="100%"
                  width="100%"
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                ></iframe>
              </Col>
              <Col
                xl={12}
                lg={12}
                md={12}
                sm={24}
                xs={24}
                className="something-text"
              >
                <div className="zone">
                  <h2>ZONE 1</h2>
                  <p>Nam ac felis id libero rutrum pharetra eu non lacus</p>
                  <p>
                    <span>Free Delivery</span>
                  </p>
                </div>
                <div className="zone">
                  <h2>ZONE 1</h2>
                  <p>Nam ac felis id libero rutrum pharetra eu non lacus</p>
                  <p>
                    <span>Free Delivery</span>
                  </p>
                </div>
                <div>
                  <h2>ZONE 1</h2>
                  <p>Nam ac felis id libero rutrum pharetra eu non lacus</p>
                  <p>
                    <span>Free Delivery</span>
                  </p>
                </div>
              </Col>
            </Row>
          </div>
        </SomethingAboutBKWrapper>
      </>
    </>
  );
};

export default Contact;
