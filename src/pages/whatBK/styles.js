import styled from 'styled-components';
import AboutBG from '../../assets/images/about-bg.jpg';
import { Button } from 'antd';

export const BannerWrapper = styled.div`
  background: url(${AboutBG}) no-repeat center;
  background-size: cover;
  height: 100vh;
  position: relative;
  .banner {
    position: absolute;
    display: flex;
    justify-content: space-between;
    align-items: center;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    padding: 0 40px;
    background: rgba(0, 0, 0, 0.4);
    height: 100vh;
    .content-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      .navigate {
        a {
          color: white;
          font-size: 25px;
          &:hover {
            color: var(--primary-color);
          }
        }
        .ant-typography {
          color: white;
          font-size: 25px;
        }
      }
      .title {
        text-transform: uppercase;
        font-size: 68px;
        font-weight: bold;
        margin-bottom: 15px;
        color: var(--white-color);
        text-align: center;
      }
      .content {
        max-width: 800px;
        text-align: center;
        margin-bottom: 15px;
        font-size: 22px;
        color: var(--white-color);
      }
    }
  }
  @media screen and (max-width: 991.5px) {
    .banner .content-wrapper {
      .title {
        font-size: 58px;
      }
      .content {
        max-width: 600px;
        font-size: 18px;
      }
    }
  }
  @media screen and (max-width: 767.5px) {
    .banner .content-wrapper {
      .title {
        font-size: 48px;
      }
      .content {
        max-width: 500px;
        font-size: 18px;
      }
    }
  }
  @media screen and (max-width: 575.5px) {
    .banner {
      padding: 0 20px;
      .content-wrapper {
        .navigate {
          a {
            font-size: 18px;
          }
          .ant-typography {
            font-size: 18px;
          }
        }
        .title {
          font-size: 38px;
        }
        .content {
          max-width: 350px;
          font-size: 16px;
        }
      }
    }
  }
`;

export const ButtonStyled = styled(Button)`
  font-size: 20px;
  height: 60px;
  padding: 0 60px;
  line-height: 60px;
  font-weight: bold;
  background-color: var(--primary-color);
  color: var(--white-color);
  border: 1px solid var(--primary-color);
  border-radius: 0;
  &-sm {
    border-radius: 0;
  }
`;

export const SomethingAboutBKWrapper = styled.div`
  padding-top: 150px;
  .ant-row {
    .ant-col {
      .ant-image {
        .ant-image-img {
          height: 400px;
          object-fit: cover;
        }
      }
    }
    .ant-col.something-text {
      display: flex;
      flex-direction: column;
      align-items: center;
      h2.ant-typography {
        color: var(--text-primary);
        text-transform: uppercase;
        text-align: center;
        font-size: 48px;
      }
      span.ant-typography {
        color: var(--text-gray);
        text-align: justify;
        font-size: 24px;
        margin-bottom: 15px;
        display: inline-block;
      }
    }
  }
  @media screen and (max-width: 991.5px) {
    .ant-row {
      .ant-col {
        .ant-image {
          &-img {
            height: 500px;
          }
        }
      }
    }
  }
  @media screen and (max-width: 575.5px) {
    .ant-row {
      padding: 0 8px;
      .ant-col.something-text {
        h2.ant-typography {
          font-size: 32px;
        }
        span.ant-typography {
          font-size: 18px;
        }
      }
    }
  }
`;

export const PhotoGalleryWrapper = styled.div`
  .ant-col {
    .ant-image {
      &-img {
        object-fit: cover;
      }
    }
  }
  padding-top: 150px;
  h2.ant-typography {
    color: var(--text-primary);
    text-transform: uppercase;
    text-align: center;
    font-size: 48px;
  }
  @media screen and (max-width: 575.5px) {
    h2.ant-typography {
      font-size: 32px;
    }
    .container {
      padding: 0 8px;
    }
  }
`;
