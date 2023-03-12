import styled from 'styled-components';

export const HeaderWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  height: 110px;
  padding: 0 40px;
  justify-content: space-between;
  align-items: center;
  .logo-wrapper {
    display: block;
    width: 80px;
    img {
      max-width: 100%;
    }
  }
  .link-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--white-color);
    .ant-menu {
      border: none;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: transparent;
      &-item {
        margin: 0 16px;
        padding: 0;
      }
      .ant-menu-item.ant-menu-item-selected {
        background-color: transparent;
      }
      &-title-content a {
        font-size: 20px;
        font-weight: 600;
        text-transform: uppercase;
        text-align: center;
        color: var(--white-color);
        &:hover {
          color: var(--primary-color);
        }
      }
    }
    .icon-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .cart-wrapper {
        position: relative;
        color: var(--secondary-color);
        .quantity {
          position: absolute;
          width: 25px;
          height: 25px;
          border-radius: 50%;
          background-color: var(--secondary-color-light);
          font-size: 14px;
          top: -5px;
          right: -10px;
          text-align: center;
          line-height: 25px;
        }
      }
      .icon {
        margin-left: 32px;
      }
      .anticon {
        font-size: 30px;
        color: var(--white-color);
        &-shopping {
          color: var(--secondary-color);
        }
        &-bars {
          display: none;
          font-size: 36px;
        }
        &-close {
          font-size: 36px;
        }
        &-search {
          cursor: pointer;
        }
      }
      .search-wrapper {
        position: relative;
        .search-result {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 20px;
          min-width: 50vw;
          background-color: var(--white-color);
          box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.6);
          .ant-input {
            padding: 6px 12px;
            font-size: 16px;
          }
          .ant-table-wrapper {
            padding: 0 12px;
            th.ant-table-cell {
              text-align: center;
              font-size: 18px;
              color: var(--text-primary);
              background-color: transparent;
            }
            td.ant-table-cell {
              .product_info {
                display: flex;
                align-items: center;
                .ant-typography.product_name {
                  font-size: 16px;
                  color: var(--text-primary);
                  margin-left: 12px;
                }
              }
            }
            .ant-table-pagination {
              .ant-pagination-prev,
              .ant-pagination-next {
                .ant-pagination-item-link {
                  .anticon {
                    color: rgba(0, 0, 0, 0.25);
                    font-size: 12px;
                  }
                }
              }
            }
          }
        }
      }
      .user-avatar {
        margin-left: 32px;
      }
    }
  }
  @media screen and (max-width: 991.5px) {
    .link-wrapper {
      .ant-menu {
        /* display: flex; */
        display: ${({ toggleMenu }) => (toggleMenu ? 'flex' : 'none')};
        flex-direction: column;
        justify-content: flex-start;
        position: absolute;
        top: 110px;
        right: ${({ toggleMenu }) => (toggleMenu ? 0 : '-100%')};
        opacity: ${({ toggleMenu }) => (toggleMenu ? 1 : 0)};
        transition: all 0.5s ease;
        width: 100vw;
        height: auto;
        background-color: var(--primary-color-dark);
        z-index: 100;
        &-item {
          padding: 0;
          height: auto;
          width: 100%;
        }
        &-title-content a {
          font-size: 24px;
          display: block;
        }
      }
      .icon-wrapper {
        .anticon-bars {
          display: block;
        }
      }
    }
  }
  @media screen and (max-width: 575.5px) {
    padding: 0 20px;
    .link-wrapper {
      .icon-wrapper {
        .search-wrapper {
          .ant-input {
            right: -100%;
          }
        }
      }
    }
  }
`;
