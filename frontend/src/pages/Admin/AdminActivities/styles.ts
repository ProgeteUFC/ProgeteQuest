
import styled from "styled-components";

export const ActivitiesContainer = styled.section`
  width: 100%;
  min-width: 0;
  padding: 24px;
  box-sizing: border-box;
  color: white;

  h1 {
    margin: 0 0 8px;
    font-size: 28px;
  }

  > p {
    margin-bottom: 24px;
  }
`;

export const ActivitiesCard = styled.div`
  background: white;
  color: ${({ theme }) => theme.colors.kingfisherDaisy};
  padding: 24px;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  min-width: 0;
`;

export const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;

  label {
    font-weight: 700;
    color: ${({ theme }) => theme.colors.indigo};
  }

  select {
    width: 100%;
    max-width: 320px;
    padding: 12px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 12px;
    background: white;
    color: ${({ theme }) => theme.colors.indigo};
    font-size: 15px;
  }

  select:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.indigo};
    outline-offset: 2px;
  }
`;

export const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
`;

export const ActivitiesTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;

  th {
    background: ${({ theme }) => theme.colors.indigo};
    color: white;
    padding: 16px;
    text-align: left;
    font-size: 14px;
  }

  td {
    padding: 16px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.kingfisherDaisy};
    overflow-wrap: anywhere;
    word-break: break-word;
  }

  tbody tr:hover {
    background: rgba(0, 0, 0, 0.035);
  }

  th:last-child,
td:last-child {
  width: 140px;
  text-align: center;
}

td:last-child {
  white-space: nowrap;
}
`;

export const ManageButton = styled.button`
  background: ${({ theme }) => theme.colors.indigo};
  color: white;
  border: none;
  border-radius: 12px;
  padding: 10px 16px;
  font-family: "Baloo Paaji 2", sans-serif;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.challengeOrange};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.challengeOrange};
    outline-offset: 3px;
  }
`;

export const ActivitiesFeedback = styled.p`
  padding: 18px;
  margin: 0;
  text-align: center;
  color: ${({ theme }) => theme.colors.indigo};

  &[role="alert"] {
    color: ${({ theme }) => theme.colors.error};
    background: ${({ theme }) => theme.colors.errorBackground};
    border-radius: 12px;
  }
`;
