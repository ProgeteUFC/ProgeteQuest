import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
  background-color: ${({ theme }) => theme.colors.kingfisherDaisy || 'var(--kingfisherDaisy)'};
  padding: 2rem;
  box-sizing: border-box;


  @media (max-width: 1440px) {
    flex-direction: column;
    justify-content: flex-start;
    overflow-y: auto;
    
  }
`;


export const Login = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 40%;
  max-width: 500px;
  z-index: 1;
  

  .astronauta {
    position: static;
    width: 400px;
    height: auto;
    z-index: 0;
    bottom: 0;
    left: 200px;
    margin-left: -200px;
  }

  @media (max-width: 768px) {
  .astronauta {
  position: static;
  width: 100%;
  margin-left: 0;
  left: 0;
    }
  }

  @media (max-width: 1440px) {
    order: 2;
    width: 100%;
    margin: 2rem 0;
  }
`;

export const LoginCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background: ${({ theme }) => theme.colors.indigo || 'var(--primary)'};
  padding: 3rem;
  border-radius: 1.5rem;
  width: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  object-fit: cover;
  z-index: 1;
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

  a {
    color: aquamarine;
    text-align: right;
    margin-top: 0.5rem;
    text-decoration: none;
    font-size: 0.9rem;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const AboutUs = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width: 55%; 
  z-index: 1;

  .logo-image {
    height: 20rem;
    width: auto;
    margin-bottom: 3rem;
    object-fit: contain;
  }

  .about-header {
    position: relative
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    gap: 1rem;
    
  }

  @media (max-width: 768px) {
  .about-header {
    justify-content: center; 
    padding-right:0;
  }
}

  .planet-image {
    display: none;
  }

  .about-content {
    display: flex;
    flex-direction: column;
  }

  @media (max-width: 1440px) {
    order: 1;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 100%;

    .about-content {
      height: auto;
    }

    .planet-image {
      width: 70px;
    }
  }

  @media (max-width: 768px) {
    .logo-image {
      width: 100%;
      height: auto;
    }

    .planet-image {
      display:none;
    }
  }
`;
