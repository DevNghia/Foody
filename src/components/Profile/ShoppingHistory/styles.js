import styled from 'styled-components';

export const Wrapper = styled.div`
  .ant-card {
    &-head {
      .ant-card-head-title {
        font-size: 22px;
        color: var(--text-primary);
      }
    }
    &-body {
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
          .ant-typography.time-order,
          .ant-typography.total_price {
            font-size: 16px;
            color: var(--text-primary);
          }
        }
      }
    }
  }
`;
