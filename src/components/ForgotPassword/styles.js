import styled from 'styled-components';

export const Wrapper = styled.div`
  background: var(--primary-color);
  width: 100%;
  height: 100vh;
  position: relative;
  .forgot-password-form {
    width: 500px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 20px 20px 0 20px;
    border-radius: 20px;
    background: var(--primary-color-dark);
    .button-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      .back-button {
        color: var(--white-color);
        margin-left: 10px;
      }
    }
    h2.ant-typography {
      text-align: center;
      color: var(--white-color);
    }
  }
`;
