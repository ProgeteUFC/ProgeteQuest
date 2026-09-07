import styled from "styled-components";

export const RankingItem = styled.div`
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 10px;
`;

export const Position = styled.span`
  display: grid;
  min-width: 54px;
  min-height: 48px;
  flex: 0 0 54px;
  place-items: center;
  padding: 4px 10px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.primaryDark};
  color: white;
  font-size: 22px;
  font-weight: 800;
`;

export const StudentData = styled.div`
  min-width: 0;
  flex: 1;
`;

export const StudentName = styled.p`
  margin: 0;
  overflow: hidden;
  color: ${({ theme }) => theme.colors.primaryDark};
  font-size: 17px;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const StudentPoints = styled.small`
  display: block;
  color: ${({ theme }) => theme.colors.indigo};
  font-size: 14px;
  font-weight: 700;
`;
