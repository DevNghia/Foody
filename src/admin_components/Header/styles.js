import styled from 'styled-components';

export const Wrapper = styled.div`
  height: 80px;
  padding: 0 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px rgba(0, 0, 0, 0.2);
  position: relative;
  .avatar-wrapper {
    position: relative;
    .ant-avatar {
      cursor: pointer;
    }
    .setting {
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: calc(100% + 21px);
      right: 0;
      min-width: 150px;
      box-shadow: 1px 2px rgba(0, 0, 0, 0.4);
      font-size: 18px;
      color: var(--text-primary);
      background: #ffff;
      border-radius: 10px;
      .anticon {
        margin-right: 8px;
      }
    }
  }
`;
