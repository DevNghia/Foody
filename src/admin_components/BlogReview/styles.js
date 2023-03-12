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
      .search-wrapper {
        width: 400px;
        display: flex;
        align-items: center;
        .ant-input-affix-wrapper {
          border-radius: 15px;
          margin-right: 12px;
        }
      }
      .ant-btn {
        border-radius: 15px;
      }
    }
    .blogs_list {
      .action {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        .removed {
          position: relative;
          margin-right: 20px;
          cursor: pointer;
          .anticon {
            color: var(--secondary-color);
            font-size: 20px;
            display: block;
          }
          .ant-typography {
            display: inline-block;
            width: 20px;
            height: 20px;
            background: var(--secondary-color-light);
            text-align: center;
            line-height: 20px;
            border-radius: 50%;
            color: var(--secondary-color);
            position: absolute;
            top: -8px;
            right: -8px;
          }
        }
        .ant-btn {
          margin-right: 15px;
          border-radius: 15px;
        }
        .blog-review_selected {
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
        .user_info {
          display: flex;
          align-items: center;
          .ant-avatar {
            margin-right: 8px;
          }
          .user_name {
            font-size: 16px;
            color: var(--text-primary);
            flex: 1;
          }
        }
        .btn_wrapper {
          display: flex;
          align-items: center;
          .ant-btn {
            border-radius: 10px;
          }
          .edit_btn {
            margin-right: 4px;
          }
        }
      }
    }
  }
`;
