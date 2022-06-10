import styled from 'styled-components';

export const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const Canvas = styled.canvas`
  outline: solid 0.5px var(--color-orange);
  margin-top: 10px;
  cursor: pointer;
`;

export const Button = styled.button`
  background: none;
  color: inherit;
  border: 1.5px solid var(--color-orange);
  border-radius: 5px;
  cursor: pointer;
  transition: 0.4s;

  &:hover {
    background: var(--color-orange);
  }
`;
