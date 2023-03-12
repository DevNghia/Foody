import styled from 'styled-components';

export const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--primary-color-light);
  .ant-row {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    min-width: 90vw;
    .ant-col {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      h1.ant-typography {
        font-size: 32px;
        color: var(--text-primary);
        font-weight: 600;
      }
      span.ant-typography {
        font-size: 18px;
        text-align: center;
        color: var(--text-primary);
        margin-bottom: 12px;
      }
      .ant-btn {
        display: flex;
        font-size: 18px;
        align-items: center;
        justify-content: center;
        height: 48px;
      }
    }
  }
`;
