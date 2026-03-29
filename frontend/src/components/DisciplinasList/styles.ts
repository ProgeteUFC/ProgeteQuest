import styled from "styled-components";

export const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const DisciplinaButton = styled.button<{ selected?: boolean }>`
  background: ${({ selected }) => (selected ? '#FF9800' : '#6C63FF')};
  color: #fff;
  border: 0;
  border-radius: 16px;
  padding: 10px 18px;
  font-weight: 600;
  cursor: pointer;
  outline: ${({ selected }) => (selected ? '2px solid #FF9800' : 'none')};
  transition: background 0.2s;
`;
