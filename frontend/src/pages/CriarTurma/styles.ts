import styled from "styled-components";

export const PageWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.primaryDark};
  min-height: 100%;
  min-height: 100vh;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding-left: 9rem;
  position: relative;

  padding-top: 2rem;

  // Mobile (402x874)
  @media (max-width: 768px) {
    align-items: center;
    padding-left: 1rem;
    padding-right: 1rem;
    padding-top: 1rem;
  }
`;

export const Planet = styled.img`
  position: fixed;
  width: 1300px;
  bottom: -100px;
  right: -130px;
  transform: translate(20%, 20%);

  // Mobile (402x874)
  @media (max-width: 768px) {
    width: 300px;
    bottom: -40px;
    right: -40px;
    transform: none;
    opacity: 0.8;
  }
`;

export const Astronaut = styled.img`
  display: none;

  // Mobile (402x874)
  @media (max-width: 768px) {
    display: block;
    position: fixed;
    width: 300px;
    bottom: 80px;
    left: -10px;
    margin-left: 0;
    z-index: 1;
  }
`;

export const Logo = styled.img`
  width: 120px;
  position: absolute;
  bottom: 130px;
  left: 2rem;

  // Mobile (402x874)
  @media (max-width: 768px) {
    width: 80px;
    position: fixed;
    bottom: 20px;
    left: 20px;
  }
`;

export const Container = styled.div`
  font-size: 18px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.white};
  font-family: "Baloo Paaji 2", sans-serif;

  margin: 0;
  padding-top: 2rem;

  // Mobile (402x874)
  @media (max-width: 768px) {
    font-size: 16px;
    width: 100%;
    max-width: 402px;
    padding-top: 1rem;

    h1 {
      font-size: 28px;
      margin-bottom: 0.5rem;
    }

    h2 {
      font-size: 16px;
      line-height: 1.4;
    }
  }
`;

export const FormCard = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  padding: 1rem;
  border-radius: 20px;
  font-family: "Baloo Paaji 2", sans-serif;

  width: 100%;
  max-width: 500px;

  margin-top: 2rem;

  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  input {
    border: none;
    border-radius: 999px;
    padding: 0.6rem 1rem;

    background-color: ${({ theme }) => theme.colors.indigo};
    color: white;

    font-size: 0.9rem;
  }

  textarea {
    border: none;
    border-radius: 16px;
    padding: 1rem;

    background-color: ${({ theme }) => theme.colors.indigo};
    color: white;

    min-height: 100px;
    resize: none;
  }

  input::placeholder,
  textarea::placeholder {
    color: white;
    opacity: 0.8;
  }

  // Mobile (402x874)
  @media (max-width: 768px) {
    max-width: 100%;
    margin-top: 1.5rem;
    gap: 0.75rem;

    input {
      padding: 0.75rem 1rem;
    }

    textarea {
      padding: 0.75rem 1rem;
    }
  }
`;

export const ButtonWrapper = styled.div`
  width: 100%;
  max-width: 500px;

  display: flex;
  justify-content: flex-end;

  margin-top: 1rem;

  // Mobile (402x874)
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

export const CreateButton = styled.button`
  margin-top: 1rem;
  font-family: "Baloo Paaji 2", sans-serif;
  width: 200px;
  font-size: 15px;
  height: 35px;
  margin-left: auto;

  align-self: flex-end;

  padding: 0.3rem 1.2rem;
  border-radius: 999px;

  border: none;
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.primaryDark};

  font-weight: bold;
  cursor: pointer;

  // Mobile (402x874)
  @media (max-width: 768px) {
    width: 150px;
    font-size: 14px;
    height: 40px;
  }
`;