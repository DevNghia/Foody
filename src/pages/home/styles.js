import styled from 'styled-components';
import { Button } from 'antd';
import AboutBG from '../../assets/images/about-bg-2.png';

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
    .content-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      .title {
        text-transform: uppercase;
        font-size: 80px;
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
    .anticon {
      font-size: 30px;
      color: var(--white-color);
      cursor: pointer;
      &:hover {
        color: var(--primary-color);
      }
    }
  }
  @media screen and (max-width: 991.5px) {
    .banner .content-wrapper {
      .title {
        font-size: 60px;
      }
      .content {
        max-width: 600px;
        font-size: 18px;
      }
    }
  }
  @media screen and (max-width: 767.5px) {
    .banner .content-wrapper {
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
        .title {
          font-size: 40px;
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

export const NewProductsWrapper = styled.div`
  padding-top: 150px;
  .title-wrapper {
    text-align: center;
    margin-bottom: 40px;
    h4.ant-typography {
      font-size: 60px;
      color: var(--text-primary);
      margin: 0;
      text-transform: uppercase;
    }
    .ant-typography {
      font-size: 20px;
      color: var(--text-gray);
    }
  }
  .ant-col {
    .product-image-wrapper {
      height: 300px;
      width: 100%;
      img {
        width: 100%;
        height: 300px;
        object-fit: cover;
      }
    }
    .info-wrapper {
      background-color: var(--secondary-color-light);
      padding: 24px;
      .info {
        margin-top: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 24px;
        color: var(--text-primary);
      }
      .footer {
        margin-top: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .rate {
          display: flex;
          font-size: 22px;
        }
        .icon-wrapper {
          display: flex;
          .icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            color: var(--white-color);
            font-size: 18px;
            cursor: pointer;
          }
          .shopping-cart {
            background-color: var(--primary-color-dark);
            margin-right: 10px;
          }
          .eye {
            background-color: var(--primary-color);
            margin-right: 10px;
          }
          .heart {
            background-color: var(--secondary-color);
          }
        }
      }
    }
  }
  .ant-btn {
    margin-top: 32px;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
  }
  @media screen and (max-width: 991.5px) {
    .title-wrapper {
      h4.ant-typography {
        font-size: 52px;
      }
      .ant-typography {
        font-size: 18px;
      }
    }
  }
  @media screen and (max-width: 575.5px) {
    .title-wrapper {
      padding-left: 8px;
      padding-right: 8px;
      h4.ant-typography {
        font-size: 42px;
      }
    }
  }
`;

export const MenuListWrapper = styled.div`
  padding-top: 150px;
  .title-wrapper {
    text-align: center;
    margin-bottom: 40px;
    h4.ant-typography {
      font-size: 60px;
      color: var(--text-primary);
      margin: 0;
      text-transform: uppercase;
    }
    .ant-typography {
      font-size: 20px;
      color: var(--text-gray);
    }
  }
  .ant-col {
    position: relative;
    &:hover img {
      opacity: 0.3;
    }
    &:hover .middle {
      opacity: 1;
    }
    img {
      opacity: 1;
      display: block;
      width: 100%;
      height: auto;
      transition: 0.5s ease;
      backface-visibility: hidden;
    }
    .middle {
      transition: 0.5s ease;
      opacity: 0;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      .ant-typography {
        color: var(--text-primary);
        font-size: 30px;
        margin-bottom: 10px;
        font-weight: 600;
      }
    }
  }
  @media screen and (max-width: 991.5px) {
    .title-wrapper {
      h4.ant-typography {
        font-size: 52px;
      }
      .ant-typography {
        font-size: 18px;
      }
    }
  }
  @media screen and (max-width: 575.5px) {
    .title-wrapper {
      padding-left: 8px;
      padding-right: 8px;
      h4.ant-typography {
        font-size: 42px;
      }
    }
  }
`;

export const BlogsRecentlyWrapper = styled.div`
  padding-top: 150px;
  .title-wrapper {
    text-align: center;
    margin-bottom: 40px;
    h4.ant-typography {
      font-size: 60px;
      color: var(--text-primary);
      margin: 0;
      text-transform: uppercase;
    }
    .ant-typography {
      font-size: 20px;
      color: var(--text-gray);
    }
  }
  .ant-col {
    .blog-image-wrapper {
      height: 300px;
      width: 100%;
      img {
        width: 100%;
        height: 300px;
        object-fit: cover;
      }
      cursor: pointer;
    }
    .info-wrapper {
      background-color: var(--secondary-color-light);
      padding: 24px;
      .title {
        font-size: 24px;
        font-weight: 600;
        color: var(--text-primary);
        display: block;
      }
      .description {
        font-size: 16px;
        color: var(--text-gray);
      }
    }
  }
  .ant-btn {
    margin-top: 32px;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
  }
  @media screen and (max-width: 991.5px) {
    .title-wrapper {
      h4.ant-typography {
        font-size: 52px;
      }
      .ant-typography {
        font-size: 18px;
      }
    }
  }
  @media screen and (max-width: 575.5px) {
    .title-wrapper {
      padding-left: 8px;
      padding-right: 8px;
      h4.ant-typography {
        font-size: 42px;
      }
    }
  }
`;

export const FormContactWrapper = styled.div`
  padding-top: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .title {
    font-size: 40px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 10px;
    align-items: center;
  }
  .description {
    font-size: 20px;
    color: var(--text-gray);
    margin-bottom: 10px;
    align-items: center;
  }
  .input-wrapper {
    position: relative;
    input {
      width: 500px;
      height: 48px;
      border: 2px solid var(--primary-color);
      border-radius: 20px;
      padding: 8px 12px;
      font-size: 18px;
    }
    .ant-btn {
      position: absolute;
      top: 0;
      right: 0;
      background-color: var(--primary-color);
      font-size: 22px;
      font-weight: 600;
      height: 48px;
      color: var(--text-primary);
      text-align: center;
      line-height: 48px;
      padding: 0 20px;
      border-color: var(--primary-color);
      border-radius: 0;
    }
    .ant-btn-sm {
      border-radius: 0;
      border-top-right-radius: 20px;
      border-bottom-right-radius: 20px;
    }
  }
  @media screen and (max-width: 991.5px) {
    .title {
      font-size: 28px;
    }
    .description {
      font-size: 16px;
    }
    .input-wrapper {
      input {
        width: 400px;
      }
    }
  }
  @media screen and (max-width: 575.5px) {
    padding-left: 8px;
    padding-right: 8px;
    .title {
      font-size: 24px;
    }
    .description {
      font-size: 14px;
    }
    .input-wrapper {
      input {
        max-width: 350px;
      }
    }
  }
`;
