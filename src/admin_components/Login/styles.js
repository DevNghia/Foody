import styled from 'styled-components';

export const Wrapper = styled.div`
  background: linear-gradient(
    45deg,
    var(--primary-color),
    var(--primary-color-dark)
  );
  width: 100vw;
  height: 100vh;
  position: relative;
  .container-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    height: auto;
    padding: 20px 12px;
    background-color: var(--white-color);
    border-radius: 20px;
    box-shadow: 2px 5px rgba(0, 0, 0, 0.4);

    h1.ant-typography {
      text-transform: uppercase;
      color: var(--text-primary);
      font-size: 32px;
      text-align: center;
    }

    .ant-form {
      &-item:last-child {
        margin-bottom: 0;
        .ant-form-item-control {
          &-input {
            &-content {
              display: flex;
              justify-content: center;
            }
          }
        }
      }
    }
  }
`;
