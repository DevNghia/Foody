import styled from 'styled-components';
import BlogBG from '../../assets/images/blog-bg.jpg';

export const BannerWrapper = styled.div`
  background: url(${BlogBG}) no-repeat center;
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

export const BlogListWrapper = styled.div`
  padding-top: 150px;
  .ant-row {
    .ant-col {
      margin-bottom: 100px;
      a {
        color: var(--text-primary);
        font-size: 20px;
        display: inline-block;
      }
      .ant-image {
        &-img {
          height: 600px;
          object-fit: cover;
        }
      }
      .category_time_wrapper {
        margin-top: 12px;
        .ant-typography {
          color: var(--text-primary);
          font-size: 20px;
        }
      }
      .title {
        margin-top: 8px;
        display: inline-block;
        font-weight: 600;
        text-transform: uppercase;
        color: var(--primary-color-dark);
      }
      .content_slice {
        display: inline-block;
        color: var(--text-gray);
        font-size: 18px;
        margin-top: 8px;
      }
      .read_more {
        color: var(--primary-color-dark);
        margin-top: 8px;
        display: block;
      }
    }
  }
  .pagination {
    display: flex;
    justify-content: center;
  }
  @media screen and (max-width: 575.5px) {
    .container {
      padding: 0 8px;
    }
  }
`;
