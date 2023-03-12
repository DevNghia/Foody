import styled from 'styled-components';

export const Wrapper = styled.div`
  flex: ${({ collapsed }) => (collapsed ? '0 0 80px' : '0 0 300px')};
  max-width: ${({ collapsed }) => (collapsed ? '80px' : '300px')};
  min-width: ${({ collapsed }) => (collapsed ? '80px' : '300px')};
  width: ${({ collapsed }) => (collapsed ? '80px' : '300px')};
  border-right: 1px solid #f0f0f0;
  .ant-menu {
    border: none;
    &-item {
      .anticon.ant-menu-item-icon,
      .ant-menu-title-content {
        font-size: 18px;
        /* color: var(--text-primary); */
      }
    }
    /* .ant-menu-item.ant-menu-item-selected {
      background-color: transparent;
      &::after {
        border: none;
      }
      a {
        color: var(--text-primary);
      }
    } */
  }
`;
