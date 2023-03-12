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
    .ant-row {
      .ant-col.user-avatar {
        display: flex;
        justify-content: center;
      }
    }
    .ant-form {
      &-item {
        align-items: center;
        &-label {
          label {
            width: 220px;
            font-size: 18px;
            color: var(--text-primary);
            justify-content: flex-end;
          }
        }
        &-control {
          &-input {
            &-content {
              .ant-input {
                font-size: 18px;
                color: var(--text-primary);
                border-radius: 12px;
              }
            }
          }
        }
      }
    }
    .back {
      display: flex;
      justify-content: center;
      .ant-btn {
        border-radius: 15px;
      }
    }
  }
`;
