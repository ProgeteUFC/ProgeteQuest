export const NoForumText = styled.p`
  color: #fff;
  font-family: 'Baloo Paaji 2', sans-serif;
  font-size: 1.1rem;
  margin-top: 24px;
  margin-left: 180px;
  max-width: 900px;
`;
import styled from "styled-components";

export const ForumListContainer = styled.div`
  margin-top: 24px;
  position: relative;
  z-index: 10;
`;

export const ForumCard = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 22px 16px;
  margin-left: 180px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  font-family: 'Baloo Paaji 2', sans-serif;
  color: ${(props) => props.theme.colors.kingfisherDaisy}

`;

export const ForumTitle = styled.h3`
  margin: 0;
`;

export const ForumMessage = styled.p`
  margin: 8px 0 0 0;
  color: #000;
`;

export const ForumAuthor = styled.span`
  font-size: 12px;
  color: #888;
`;
