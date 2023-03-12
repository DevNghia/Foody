import styled from 'styled-components';
import BlogSingleBG from '../../assets/images/blog-single.png';

export const BannerWrapper = styled.div`
  background: url(${BlogSingleBG}) no-repeat center;
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
    height: 100vh;
    padding: 0 40px;
    background: rgba(0, 0, 0, 0.4);
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
      .ant-menu {
        display: flex;
        background: transparent;
        border: none;
        &-item {
          .anticon {
            color: var(--white-color);
            font-size: 20px;
          }
          .ant-menu-title-content {
            a {
              font-size: 20px;
              color: var(--white-color);
            }
          }
        }
        .ant-menu-item.ant-menu-item-selected {
          background: transparent;
        }
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

export const PostContentWrapper = styled.div`
  padding-top: 100px;
  .container {
    .ant-typography {
      color: rgba(0, 0, 0, 0.85);
      overflow-wrap: break-word;
      color: var(--text-primary);
      font-size: 18px;
      text-align: justify;
      display: inline-block;
    }
    .ant-typography:not(:last-child) {
      margin-bottom: 15px;
    }
    .images-wrapper {
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin-bottom: 15px;
      flex-wrap: wrap;
      .ant-image {
        display: inline-block;
        width: 400px;
        &-img {
          height: 300px;
          object-fit: cover;
        }
      }
    }
  }
  @media screen and (max-width: 575.5px) {
    .container {
      padding: 0 8px;
    }
  }
`;

export const ReviewWrapper = styled.div`
  padding-top: 100px;
  padding-top: 100px;
  h4.ant-typography {
    text-transform: uppercase;
    color: var(--white-color);
    font-size: 24px;
    background: var(--primary-color-dark);
    padding: 8px 15px;
    max-width: 300px;
  }
  .review-wrapper {
    display: flex;
    margin-top: 15px;
    .review {
      margin-left: 40px;
      flex: 1;
      .ant-typography {
        font-size: 18px;
        color: var(--text-primary);
      }
      .top {
        align-items: center;
        display: flex;
        .username {
          margin-right: 15px;
          font-size: 20px;
        }
      }
      .comments {
        display: flex;
        margin-top: 10px;
        flex-direction: column;
      }
    }
  }
  .no-preview {
    font-size: 20px;
    color: var(--text-primary);
    font-weight: 600;
    text-transform: uppercase;
    display: block;
    text-align: center;
  }
  @media screen and (max-width: 575.5px) {
    .container {
      padding: 0 8px;
      .review-wrapper {
        .review {
          margin-left: 20px;
        }
      }
    }
  }
`;

export const AddReviewWrapper = styled.div`
  padding-top: 100px;
  h4.ant-typography {
    text-transform: uppercase;
    color: var(--white-color);
    font-size: 24px;
    background: var(--primary-color-dark);
    padding: 8px 15px;
    max-width: 300px;
  }
  .require-login {
    color: var(--text-primary);
    font-size: 20px;
  }
  .ant-form {
    background: var(--primary-color-light);
    padding: 20px 12px;
    &-item {
      align-items: center;
      &-label {
        label {
          color: var(--text-primary);
          font-size: 18px;
        }
      }
      &-control {
        &-input {
          &-content {
            .rate {
              display: flex;
              align-items: center;
              .anticon {
                color: var(--secondary-color);
                font-size: 20px;
                cursor: pointer;
              }
            }
            .ant-input {
              font-size: 16px;
              color: var(--text-primary);
            }
          }
        }
      }
    }
  }
  @media screen and (max-width: 575.5px) {
    .container {
      padding: 0 8px;
    }
  }
`;
