import styled from "styled-components";

export const FormContainer = styled.form`
  margin-top: 24px;
  background: #fff;
  border-radius: 16px;
  padding: 22px 16px;
  margin-left: 180px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: stretch;

  & > button {
    align-self: flex-end;
  }
`;

export const FieldGroup = styled.div`
  margin-bottom: 12px;
`;

export const Label = styled.label`
  font-weight: 600;
  font-size: 1.1rem;
  font-family: 'Baloo Paaji 2', sans-serif;
  color: ${(props) => props.theme.colors.kingfisherDaisy}
  
`;

export const Input = styled.input`
  width: 100%;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #ccc;
  margin-top: 4px;
  font-family: 'Baloo Paaji 2', sans-serif;
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #ccc;
  margin-top: 4px;
  min-height: 80px;
  font-family: 'Baloo Paaji 2', sans-serif;
  
`;

export const SubmitButton = styled.button`
  background: #6C63FF;
  color: #fff;
  border: 0;
  border-radius: 8px;
  padding: 8px 24px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: ${(props) => props.theme.colors.challengeOrange};
  }
`;
