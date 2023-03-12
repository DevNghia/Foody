import styled from 'styled-components';

export const Wrapper = styled.div`
  .title {
    font-size: 28px;
    color: var(--text-primary);
    font-weight: 600;
    border-bottom: 1px solid var(--text-gray);
  }
  .ant-form {
    &-item {
      &-label {
        min-width: 140px;
        font-size: 18px;
        color: var(--text-primary);
        text-align: left;
      }
    }

    &-item:last-child {
      margin-bottom: 0;
      .ant-form-item-control-input-content {
        display: flex;
        justify-content: center;
      }
    }
  }
`;
