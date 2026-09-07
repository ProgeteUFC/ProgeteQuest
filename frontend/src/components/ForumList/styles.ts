import styled from "styled-components";

export const NoForumText = styled.p`
  width: min(600px, 100%);
  margin-top: 24px;
  color: white;
  font-family: "Baloo Paaji 2", sans-serif;
  font-size: 18px;
`;

export const ForumListContainer = styled.section`
  width: min(600px, 100%);
  max-height: 310px;
  margin-top: 24px;
  padding-right: 6px;
  overflow-y: auto;
  position: relative;
  z-index: 3;
  scrollbar-width: thin;
  scrollbar-color: ${(props) => props.theme.colors.indigo} transparent;
`;

export const ForumCard = styled.article`
  margin-bottom: 14px;
  padding: 16px 20px;
  border: 7px solid white;
  border-radius: 24px;
  color: white;
  background: ${(props) => props.theme.colors.indigo};
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  font-family: "Baloo Paaji 2", sans-serif;
  button {
    margin-top: 10px; padding: 5px 14px; border: 0; border-radius: 18px;
    color: white; background: #e74c3c; font-family: inherit; font-weight: 700; cursor: pointer;
  }
  button:hover { background: #c0392b; }
  .open-topic { margin-right: 8px; background: ${(props) => props.theme.colors.primaryDark}; }
  .open-topic:hover { background: ${(props) => props.theme.colors.challengeOrange}; }
  @media (max-width: 480px) { padding: 14px; border-width: 5px; }
`;

export const ForumTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
`;

export const ForumMessage = styled.p`
  margin: 6px 0 0;
  color: white;
  font-size: 16px;
  line-height: 1.35;
  overflow-wrap: anywhere;
`;

export const ForumAuthor = styled.span`
  display: block;
  margin-top: 8px;
  color: ${(props) => props.theme.colors.muted};
  font-size: 12px;
`;
