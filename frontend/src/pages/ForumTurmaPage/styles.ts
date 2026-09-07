import styled from "styled-components";

export const BackButtonContainer = styled.div`
  width: min(600px, 100%);
  margin-top: 18px;
  display: flex;
  justify-content: flex-end;
  position: relative;
  z-index: 3;
`;

export const BackButton = styled.button`
  min-width: 140px;
  padding: 7px 22px;
  border: 2px solid white;
  border-radius: 999px;
  color: white;
  background: transparent;
  font-family: "Baloo Paaji 2", sans-serif;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  &:hover { color: ${(props) => props.theme.colors.primaryDark}; background: white; }
`;

export const BackButtonNotFound = styled(BackButton)``;

export const Conversation = styled.section`
  width: min(600px, 100%);
  margin-top: 24px;
  padding: 18px;
  border-radius: 30px;
  color: ${(props) => props.theme.colors.primaryDark};
  background: white;
  box-shadow: 0 4px 16px rgba(0,0,0,.1);
  font-family: "Baloo Paaji 2", sans-serif;
  > p { margin-top: 12px; font-weight: 600; }
  @media (max-width: 768px) { padding: 14px; border-radius: 24px; }
`;

export const ConversationHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  h2 { font-size: 22px; line-height: 1.2; }
  p { margin-top: 4px; color: #555; line-height: 1.35; }
  button {
    flex: 0 0 auto; padding: 5px 12px; border: 0; border-radius: 16px; color: white;
    background: ${(props) => props.theme.colors.indigo}; font-family: inherit; font-weight: 700; cursor: pointer;
  }
  @media (max-width: 480px) { flex-direction: column; }
`;

export const Posts = styled.div`
  max-height: 280px;
  margin-top: 18px;
  padding-right: 5px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const PostItem = styled.article`
  padding: 10px 14px;
  border-radius: 18px;
  color: white;
  background: ${(props) => props.theme.colors.indigo};
  strong { font-size: 15px; }
  p { margin-top: 3px; line-height: 1.35; overflow-wrap: anywhere; }
  small { display: block; margin-top: 6px; color: ${(props) => props.theme.colors.muted}; }
`;

export const ReplyForm = styled.form`
  margin-top: 16px;
  display: flex;
  align-items: flex-end;
  gap: 10px;
  textarea {
    flex: 1; min-height: 70px; padding: 10px 14px; resize: vertical;
    border: 2px solid ${(props) => props.theme.colors.indigo}; border-radius: 18px;
    outline: 0; font-family: inherit; font-size: 15px;
  }
  textarea:focus { border-color: ${(props) => props.theme.colors.lightOrange}; }
  button {
    padding: 8px 18px; border: 0; border-radius: 20px; color: white;
    background: ${(props) => props.theme.colors.indigo}; font-family: inherit; font-weight: 700; cursor: pointer;
  }
  button:hover { background: ${(props) => props.theme.colors.challengeOrange}; }
  button:disabled { cursor: wait; opacity: .65; }
  @media (max-width: 480px) { flex-direction: column; align-items: stretch; }
`;
