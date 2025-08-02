import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: ${({ theme }) => theme.colors.kingfisherDaisy || 'var(--kingfisherDaisy)'};
  padding: 2rem;
  box-sizing: border-box;
`;

export const Register = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-right: 10rem;
  width: 100%;
  max-width: 500px;
  padding: 2rem;
    border-radius: 1.5rem;
  background-color: ${({ theme }) => theme.colors.primary || '#fff'};
`;

export const RegisterCard = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.primary || 'var(--primary)'};
  padding: 3rem;
  border-radius: 1.5rem;
  width: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 1rem;

  input {
    padding: 0.8rem;
    border: none;
    border-radius: 0.5rem;
    margin: 0.5rem 0;
    width: 100%;
    font-size: 1rem;
    transition: all 0.3s ease;

    &:focus {
      outline: 2px solid ${({ theme }) => theme.colors.primary || 'var(--primary)'};
    }
  }
`;

export const SubmitButton = styled.button`
  padding: 0.8rem;
  background-color: ${({ theme }) => theme.colors.secondary || '#FFD700'};
  color: ${({ theme }) => theme.colors.white || '#fff'};
  font-weight: bold;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondaryHover || '#e6c200'};
  }
`;
