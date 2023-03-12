import styled from 'styled-components';

export const Wrapper = styled.div`
  .title {
    font-size: 28px;
    color: var(--text-primary);
    font-weight: 600;
    border-bottom: 1px solid var(--text-gray);
  }
  .ant-form {
    .ant-row {
      .ant-form-item-label {
        label {
          min-width: 150px;
          font-size: 18px;
          color: var(--text-primary);
        }
      }
      .ant-form-item-control-input-content {
        .email-value {
          font-size: 16px;
          color: var(--text-primary);
        }
        .ant-input {
          color: var(--text-primary);
        }
      }
    }
    .ant-row:last-child {
      margin: 0;
      .ant-form-item-control-input-content {
        display: flex;
        justify-content: center;
        .save-button {
          min-width: 120px;
        }
      }
    }
    .avatar-edit {
      display: flex;
      margin-bottom: 20px;
      .upload-btn-wrapper {
        height: 100%;
        position: relative;
        top: 12px;
        left: 20px;
      }
    }
  }
`;
