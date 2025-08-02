import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw; /* Adicionado para garantir largura total */
  background-color: ${({ theme }) => theme.colors.kingfisherDaisy || 'var(--kingfisherDaisy)'};

  padding: 2rem; /* Adicionado para espaçamento */
  box-sizing: border-box; /* Garante que o padding não afete a largura total
  

  `;

export const Login = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-right: 10rem;
  width: 100%;
  max-width: 500px; /* Adicionado para melhor responsividade */
  

  
`;

export const LoginCard = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.primary || 'var(--primary)'};
  padding: 3rem;
  border-radius: 1.5rem;
  width: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Adiciona sombra para profundidade */
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 1rem;

  input {
    padding: 0.8rem; /* Aumentado para melhor usabilidade */
    border: none;
    border-radius: 0.5rem;
    margin: 0.5rem 0; /* Ajustado margem */
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
  justify-content: flex-end;
  width: 100%;

  .logo-image {
    height: 30rem; /* Ajustado para melhor visibilidade */
    width: 50rem;
    margin-bottom: 3rem;
    object-fit: contain; /* Garante que a imagem não distorça */
  }
  .about-header{
    display: flex;
    flex:1;
    align-items: center;
    margin-bottom: 2rem;
    justify-content: space-between;
    width: 100%;
  }
  

  .planet-image  {
    width: 300px;
    height: auto;
    max-width: 100%;
  }

  .about-content {
    display: flex;
    flex-direction: column;
    
  }
  
`;