import styled from 'styled-components';

export const Wrapper = styled.div`
  .ant-typography.title {
    color: var(--text-primary);
    text-transform: uppercase;
    margin-bottom: 16px;
    font-weight: 600;
  }
  .ant-card {
    border-radius: 10px;
    border: 1px solid #e6ebf1;
    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      .search-filter {
        display: flex;
        align-items: center;
        .ant-input-affix-wrapper {
          border-radius: 15px;
          margin-right: 12px;
        }
      }
    }
    .products_list {
      .action {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        .ant-btn {
          margin-right: 15px;
          border-radius: 15px;
        }
        .product_selected {
          font-size: 16px;
        }
      }
      .ant-table-wrapper {
        .ant-table-column-title {
          font-size: 18px;
          color: var(--text-primary);
        }
        .ant-table-cell {
          font-size: 16px;
          color: var(--text-primary);
        }
        .product_info {
          display: flex;
          align-items: center;
          .ant-avatar {
            margin-right: 8px;
          }
          .product_name {
            font-size: 16px;
            color: var(--text-primary);
          }
        }
        .btn_wrapper {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          .ant-btn {
            border-radius: 10px;
          }
          .restore_btn {
            margin-right: 4px;
          }
        }
      }
    }
    .back {
      display: flex;
      justify-content: center;
      margin-top: 15px;
      .ant-btn {
        border-radius: 15px;
      }
    }
  }
`;
