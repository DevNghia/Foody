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

export const BlogsList = styled.div`
  padding-top: 120px;
  .container{
    max-width: 1200px;
    margin: 0 16px;

    .ant-row {
      width: 100%;
      position: relative;
      height: 100%;
      
      .ant-col {
        padding: 0 15px;
        .ant-image {
        .ant-image-img {
          height: 400px;
          object-fit: cover;
        }
        
      }
      }
      .left-side{
        padding-left: 36px;
        padding-right: 10px;

        .sidebar-title{
          
        }
        .sidebar-title h5{
          padding: 15px;
          font-weight: 700;
          border-left: 3px solid #fbb731;
          text-transform: uppercase;
          line-height: 18px;
          font-size: 15px;
          font-size: 15px;
        }
        .wiget{
          padding-left: 21px;
        }
        .wiget ul{
          padding: 0;
          line-height: 24px;
          list-style: none;
          font-size: 15px;
        }
        .wiget ul li{
          margin-bottom: 6px;
          /* font-family: "nunito sans"; */
          font-weight: 600;
          font-size: 14px;
          line-height: 18px;
          color: #1E2F40;
        }
        .wiget ul li a{
          color: #1E2F40;
        }
        .wiget ul li span{
          float: right;
          font-weight: 400;
          color: #979797;
        }
        .sidebar-post{
          
          
        }
        .sidebar-post .single-post{
          padding-left: 21px;
          padding-bottom: 12px!important;
          display: flex;
          -ms-flex-wrap: wrap;
          flex-wrap: wrap;
          margin-right: -15px;
          margin-left: -15px;
        }
        .sidebar-post .single-post img{
          max-width: 100%;
          flex: 0 0 auto;
          width: auto;
        }
        .sidebar-post .single-post .post-infor{
          padding-left: 0;
          flex-basis: 0;
          -ms-flex-positive: 1;
          flex-grow: 1;
          min-width: 0;
          max-width: 100%;

          position: relative;
          width: 100%;
          padding-right: 15px;
          padding-left: 15px;
          
        }
        .sidebar-post .single-post .post-infor h6{
          margin-bottom: 0;
          font-size: 14px;
          line-height: 18px;
          font-weight: 700;
        }
        .sidebar-post .single-post .post-infor h6 a{
          color: #1E2F40;
        }
        .sidebar-post .single-post .post-infor span{
          color: #979797;
          font-weight: 400;
          font-style: italic;
          font-size: 15px;
          line-height: 24px;
        }
      }
    }
    .blog-grid{
      margin-bottom: 50px;
          button{
            background: #fbb731;
            color: #1e2f40;
            text-transform: uppercase;
            border-radius: 5px;
          }
      .blog-infor ul{
        margin: 2px;
        padding: 0;
        
      }
      .blog-infor ul li{
        margin-right: 20px;
        display: inline-block;
        color: #443737;
      }
      .blog-infor ul li a{
        color: #443737;
      }
      .blog-title{
        padding: 10px 0;
        font-size: 30px;
        line-height: 38px;
        font-weight: 700;
        text-transform: uppercase;
      }
    }
  }

  
  @media screen and (max-width: 991.5px) {

  }
  @media screen and (max-width: 575.5px) {

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
