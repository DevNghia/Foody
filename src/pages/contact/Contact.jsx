import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BannerWrapper, ContactWrapper } from './styles';
import { Col, Row, Typography } from 'antd';
import {
  ClockCircleOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
} from '@ant-design/icons';

const { Text, Title, Paragraph } = Typography;

const Contact = () => {
  useEffect(() => {
    document.title = 'Liên hệ';
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <BannerWrapper>
        <div className="banner">
          <div className="content-wrapper">
            <div className="navigate">
              <Link to="/">Trang chủ</Link>
              <Text> / Liên hệ</Text>
            </div>
            <Title level={1} className="title">
              Liên hệ
            </Title>
            <Paragraph className="content">
              Kết nối với chúng tôi tại đây
            </Paragraph>
          </div>
        </div>
      </BannerWrapper>

      <ContactWrapper>
        <div className="container">
          <Row gutter={[32, 32]}>
            <Col xl={16} lg={16} md={16} sm={24} xs={24}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d930.8692850350706!2d105.74066866957295!3d21.05359699878765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313454fa1c174e41%3A0x33c4f06349940b91!2zTmfDtSAxMTIgTmd1ecOqbiBYw6EsIE1pbmggS2hhaSwgVOG7qyBMacOqbSwgSMOgIE7hu5lpLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1684237418376!5m2!1svi!2s"
                height={'450'}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                style={{ border: 0, width: '100%' }}
              ></iframe>
            </Col>
            <Col xl={8} lg={8} md={8} sm={24} xs={24}>
              <div className="info-wrapper">
                <div className="info">
                  <ClockCircleOutlined />
                  <div className="content">
                    <Text className="title">Giờ mở cửa</Text>
                    <Text className="description">
                      Từ thứ 2 đến chủ nhật 7:00 - 21:00
                    </Text>
                  </div>
                </div>
                <div className="info">
                  <PhoneOutlined />
                  <div className="content">
                    <Text className="title">Điện thoại</Text>
                    <Text className="description">+84361234567</Text>
                    <Text className="description">+84348735326</Text>
                  </div>
                </div>
                <div className="info">
                  <EnvironmentOutlined />
                  <div className="content">
                    <Text className="title">Địa chỉ</Text>
                    <Text className="description">
                      Ngõ 112 Minh Khai, Từ Liêm, Hà Nội
                    </Text>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </ContactWrapper>
    </>
  );
};

export default Contact;
