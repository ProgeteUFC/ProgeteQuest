import styled from "styled-components";

export const FormContainer = styled.form`
  width: min(600px, 100%);
  margin-top: 30px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-radius: 30px;
  background: white;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  position: relative;
  z-index: 3;
  & > button { align-self: flex-end; }
  @media (max-width: 768px) { padding: 12px; border-radius: 24px; }
`;

export const FieldGroup = styled.div`
  padding: 9px 18px;
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  background: ${(props) => props.theme.colors.indigo};
`;

export const Label = styled.label`
  color: white;
  font-family: "Baloo Paaji 2", sans-serif;
  font-size: 16px;
  font-weight: 600;
`;

export const Input = styled.input`
  width: 100%;
  padding: 2px 0;
  border: 0;
  outline: 0;
  color: white;
  background: transparent;
  font-family: "Baloo Paaji 2", sans-serif;
  font-size: 16px;
  &::placeholder { color: ${(props) => props.theme.colors.muted}; }
`;

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 2px 0;
  resize: vertical;
  border: 0;
  outline: 0;
  color: white;
  background: transparent;
  font-family: "Baloo Paaji 2", sans-serif;
  font-size: 16px;
  &::placeholder { color: ${(props) => props.theme.colors.muted}; }
`;

export const SubmitButton = styled.button`
  min-width: 150px;
  padding: 7px 20px;
  border: 0;
  border-radius: 999px;
  color: white;
  background: ${(props) => props.theme.colors.indigo};
  font-family: "Baloo Paaji 2", sans-serif;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
  &:hover { background: ${(props) => props.theme.colors.challengeOrange}; }
`;
