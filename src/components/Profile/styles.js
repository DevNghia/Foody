import styled from 'styled-components';

export const Wrapper = styled.div`
  margin: 40px 40px 0;
  .sidebar {
    min-width: 240px;
    padding: 8px 40px 8px 0;
    .top {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      .name-wrapper {
        flex: 1;
        margin-left: 15px;
        .ant-typography {
          font-size: 18px;
          color: var(--text-primary);
          font-weight: 600;
        }
        .edit-wrapper {
          font-size: 16px;
          color: var(--text-gray);
          cursor: pointer;
          .anticon-edit {
            margin-right: 4px;
          }
        }
      }
    }
    .profile {
      .title {
        font-size: 18px;
        font-weight: 600;
        display: flex;
        align-items: center;
        color: var(--text-primary);
        cursor: pointer;
        .ant-typography {
          margin-left: 4px;
        }
      }
      .ant-menu {
        border: none;
        &-item {
          &-selected {
            background-color: transparent;
          }
          .ant-typography {
            font-size: 18px;
            color: var(--text-gray);
          }
          .ant-typography.profile-info {
            color: ${({ selected }) =>
    selected === 'profile'
      ? 'var(--primary-color)'
      : 'var(--text-gray)'};
          }
          .ant-typography.change-password-title {
            color: ${({ selected }) =>
    selected === 'change-password'
      ? 'var(--primary-color)'
      : 'var(--text-gray)'};
          }
        }
      }
    }
    .shopping-history {
      font-size: 18px;
      font-weight: 600;
      display: flex;
      align-items: center;
      color: var(--text-primary);
      cursor: pointer;
      .ant-typography {
        margin-left: 4px;
      }
    }
    .logout {
      font-size: 18px;
      font-weight: 600;
      display: flex;
      align-items: center;
      color: var(--text-primary);
      cursor: pointer;
      .ant-typography {
        margin-left: 4px;
      }
    }
  }
  .content {
    flex: 1;
    background: var(--secondary-color-light);
    box-shadow: 1px 2px rgba(0, 0, 0, 0.2);
    padding: 12px 20px;
  }
`;
