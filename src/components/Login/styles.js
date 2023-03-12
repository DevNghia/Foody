import styled from 'styled-components';

export const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  position: fixed;
  display: ${({ isHidden }) => (isHidden ? 'none' : 'block')};
  z-index: 10;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const Modal = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background-color: #95c5f7;
  opacity: 0.5;
`;

export const FormWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  border-radius: 20px;
  background-color: var(--primary-color-dark);
  .title-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-around;
    h2.ant-typography {
      text-align: center;
      width: 50%;
      padding: 12px 8px;
      cursor: pointer;
      margin: 0;
      border-bottom: 1px solid var(--primary-color-light);
    }
    .sign-in-title {
      border-top-left-radius: 20px;
      background: ${({ signIn }) =>
    signIn ? 'var(--primary-color-dark)' : 'var(--primary-color)'};
      color: ${({ signIn }) =>
    signIn ? '#ffffff' : 'var(--primary-color-dark)'};
    }
    .sign-up-title {
      border-top-right-radius: 20px;
      background: ${({ signIn }) =>
    signIn ? 'var(--primary-color)' : 'var(--primary-color-dark)'};
      color: ${({ signIn }) =>
    signIn ? 'var(--primary-color-dark)' : '#ffffff'};
    }
  }
  .ant-form {
    padding: 20px 20px 0 20px;
    .login-form-button,
    .register-form-button {
      position: relative;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      min-width: 200px;
      background-color: var(--primary-color);
    }
    .ant-row {
      .ant-form-item-label {
        min-width: 150px;
        text-align: revert;
        label {
          color: var(--white-color);
        }
      }
    }
  }
  .other {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 16px;
    .text-middle {
      font-size: 18px;
      color: var(--white-color);
      margin-bottom: 12px;
    }
  }
  @media screen and (max-width: 575.5px) {
    width: 380px;
    .title-wrapper {
      h2.ant-typography {
        font-size: 20px;
      }
    }
    .ant-form {
      padding: 15px 15px 0 15px;
      .ant-row.ant-form-item {
        margin-bottom: 12px;
      }
    }
    .other {
      margin-bottom: 15px;
      .text-middle {
        margin-bottom: 8px;
      }
    }
  }
`;
