import styled from "styled-components";

export const DataContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  cursor: pointer;
  margin-bottom: 15px;
  color: white;

  background: linear-gradient(135deg, #4f4192 0%, #4f4192 100%);
  padding: 10px 8px;
  border-radius: 50px;

  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 8px rgba(106, 13, 173, 0.2);
  border-radius: 25px;

  // transition: all 0.3s ease;

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    // transform: translateY(-2px);
    // box-shadow: 0 6px 12px rgba(106, 13, 173, 0.3);
  }
`;

export const Title = styled.span`
  font-family: "Codec pro", sans-serif;
  font-size: 14px;
  color: white;
  min-width: 100px;
  margin-right: 15px;
  flex-shrink: 0;
  text-align: left;
  padding: 6px 12px;

  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
`;
