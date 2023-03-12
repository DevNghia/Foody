import styled from 'styled-components';
import CartBG from '../../assets/images/cart-bg.jpg';

export const BannerWrapper = styled.div`
  background: url(${CartBG}) no-repeat center;
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

export const CartWrapper = styled.div`
  padding-top: 150px;
  .empty {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    .ant-typography {
      font-size: 32px;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 12px px;
    }
  }
  .exist {
    .action {
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      .product_selected {
        color: var(--text-primary);
        font-size: 18px;
        display: block;
        margin-left: 12px;
      }
    }
    .ant-table-wrapper {
      overflow-x: auto;
      th.ant-table-cell {
        font-size: 20px;
        color: var(--text-primary);
      }
      td.ant-table-cell {
        .product_info {
          display: flex;
          align-items: center;
          .ant-typography {
            font-size: 16px;
            color: var(--text-primary);
            margin-left: 8px;
          }
          .product_name {
            flex: 1;
          }
        }
        .quantity_change {
          display: flex;
          align-items: center;
          .ant-btn {
            height: 34px;
          }
          .quantity {
            border: 1px solid #d9d9d9;
            background: var(--white-color);
            height: 34px;
            line-height: 34px;
            width: 34px;
            text-align: center;
            font-size: 16px;
            color: var(--text-primary);
          }
        }
        .promotion {
          color: red;
          font-size: 16px;
          margin-right: 4px;
        }
        .total_price {
          font-size: 16px;
          color: var(--text-primary);
        }
      }
    }
    .payment {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      margin-top: 20px;
      .ant-typography {
        margin-bottom: 8px;
        font-size: 18px;
        color: var(--text-primary);
      }
      .ant-typography.notes {
        font-size: 22px;
        color: red;
        line-height: 1;
        .contents {
          font-size: 18px;
          color: var(--text-primary);
        }
      }
      .ant-btn.payment-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 200px;
        height: 48px;
        span {
          font-size: 20px;
          text-transform: uppercase;
        }
      }
      .modal {
        display: ${({ isModalVisible }) => (isModalVisible ? 'block' : 'none')};
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1000;
        background-color: rgba(0, 0, 0, 0.4);
        .ant-card {
          width: 50vw;
          position: relative;
          top: 50%;
          left: 50%;
          margin: 0;
          transform: translate(-50%, -50%);
          .ant-card-head {
            .ant-card-head-title {
              font-size: 22px;
              color: var(--text-primary);
            }
          }
          .ant-card-body {
            .ant-form {
              &-item {
                &-label {
                  min-width: 130px;
                  text-align: left;
                  label {
                    font-size: 18px;
                    color: var(--text-primary);
                  }
                }
                &-control {
                  &-input {
                    &-content {
                      input {
                        font-size: 18px;
                        color: var(--text-primary);
                      }
                    }
                  }
                  .btn-wrapper {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    .ant-btn:not(:last-child) {
                      margin-right: 50px;
                    }
                  }
                }
              }
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
