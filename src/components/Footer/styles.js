import styled from 'styled-components';

export const FooterWrapper = styled.div`
  margin-top: 150px;
  .top {
    background-color: var(--primary-color-dark);
    padding: 32px 0;
    .ant-row {
      h4.ant-typography {
        font-size: 24px;
        color: var(--white-color);
        text-transform: uppercase;
      }
      .ant-col {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        & a {
          color: var(--white-color);
          font-size: 18px;
        }
      }
      .contacts {
        .title {
          font-size: 16px;
          color: var(--white-color);
        }
        .description {
          font-size: 18px;
          font-weight: 600;
          color: var(--white-color);
        }
      }
      .phone {
        .ant-typography:not(:first-child) {
          color: var(--secondary-color);
          font-size: 18px;
        }
      }
    }
  }
  .license {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 12px 0;
    background-color: var(--primary-color);
    font-size: 18px;
    color: var(--text-primary);
  }
  @media screen and (max-width: 767.5px) {
    .top {
      .ant-row {
        .ant-col {
          align-items: center;
        }
      }
    }
  }
  @media screen and (max-width: 575.5px) {
    .license {
      font-size: 14px;
    }
  }
`;
