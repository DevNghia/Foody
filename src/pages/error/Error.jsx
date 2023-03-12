import React, { useEffect } from 'react';
import { Row, Col, Typography, Image, Button } from 'antd';
import { Wrapper } from './styles';
import Error404 from '../../assets/images/error404.png';
import { RollbackOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const Error = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Lỗi';
    window.scrollTo(0, 0);
  }, []);

  const handleBackHome = () => {
    navigate('/');
  };

  return (
    <Wrapper>
      <Row>
        <Col xl={12} lg={12} md={12} sm={24} xs={24}>
          <Title level={1}>Không tìm thấy trang</Title>
          <Text>
            Chúng tôi nhận thấy bạn bị lạc đường, đừng lo lắng, chúng tôi sẽ
            giúp bạn tìm ra con đường chính xác.
          </Text>
          <Button
            type="primary"
            size="large"
            shape="round"
            icon={<RollbackOutlined />}
            onClick={handleBackHome}
          >
            Trở về trang chủ
          </Button>
        </Col>
        <Col xl={12} lg={12} md={12} sm={24} xs={24}>
          <Image src={Error404} preview={false} />
        </Col>
      </Row>
    </Wrapper>
  );
};

export default Error;
