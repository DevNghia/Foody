import { Col, Row, Typography } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { FooterWrapper } from './styles';

const { Title, Text } = Typography;

const Footer = () => {
  return (
    <FooterWrapper>
      <div className="top">
        <div className="container">
          <Row gutter={[16, 32]}>
            <Col xl={8} lg={8} md={12} sm={24} xs={24} className="quick-link">
              <Title level={4}>liên kết nhanh</Title>
              <Link to="/products">Thực đơn</Link>
              <Link to="">Đặt hàng nhanh</Link>
              <Link to="">Phương thức thanh toán</Link>
              <Link to="/contact">Liên hệ</Link>
            </Col>
            <Col xl={8} lg={8} md={12} sm={24} xs={24} className="contacts">
              <Title level={4}>những liên hệ</Title>
              <Text className="title">Thời gian làm việc</Text>
              <Text className="description">
                Từ thứ 2 đến chủ nhật 7:00 - 21:00
              </Text>
              <Text className="title">Địa chỉ</Text>
              <Text className="description">
                Ngõ 66 Hồ Tùng Mậu, Mai Dịch, Cầu Giấy, Hà Nội
              </Text>
            </Col>
            <Col xl={8} lg={8} md={12} sm={24} xs={24} className="phone">
              <Title level={4}>điện thoại</Title>
              <Text>+84361234567</Text>
              <Text>+84348735326</Text>
            </Col>
          </Row>
        </div>
      </div>
      <div className="license">
        © {new Date().getFullYear()} Burger King. Tất cả đã được đăng ký bản
        quyền
      </div>
    </FooterWrapper>
  );
};

export default Footer;
