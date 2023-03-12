import styled from 'styled-components';

export const Wrapper = styled.div`
  .title-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    .ant-typography.title {
      color: var(--text-primary);
      text-transform: uppercase;
      font-weight: 600;
      margin-bottom: 0;
    }
    .ant-btn {
      border-radius: 15px;
    }
  }
  .ant-card.card-content {
    border-radius: 10px;
    border: 1px solid #e6ebf1;
    .ant-card-head {
      &-wrapper {
        .ant-card-head-title {
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary);
        }
      }
    }
    .ant-card-body {
      .ant-form {
        &-item {
          &-label {
            width: 150px;
            text-align: left;
            label {
              font-size: 16px;
              color: var(--text-primary);
            }
          }
          &-control {
            &-input {
              &-content {
                .ant-input:not(#basic-info_productImage),
                .ant-input-affix-wrapper {
                  border-radius: 12px;
                  color: var(--text-primary);
                }
                #basic-info_productImage {
                  border: none;
                }
                .ant-select {
                  &-selector {
                    border-radius: 12px;
                  }
                }
                .ant-picker {
                  width: 100%;
                  border-radius: 12px;
                }
                #basic-info_contents {
                  font-size: 16px;
                  color: var(--text-primary);
                }
              }
            }
          }
          .btn-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            .cancel {
              margin-right: 40px;
            }
            .ant-btn {
              border-radius: 15px;
            }
          }
        }
        &-item:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
`;
