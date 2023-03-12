import styled from 'styled-components';

export const Wrapper = styled.div`
  flex: 1;
  padding: 25px;
  background-color: #fafafb;
  .ant-typography.title {
    color: var(--text-primary);
    text-transform: uppercase;
    margin-bottom: 16px;
    font-weight: 600;
  }
  .ant-card {
    border-radius: 10px;
    border: 1px solid #e6ebf1;
  }
`;
