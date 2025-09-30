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

  @media (max-width: 1440px) {

    flex-direction: column;
    overflow-y: auto;
  
  }
  


  `;

export const Login = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin-right: 10rem;
  width: 100%;
  max-width: 500px; /* Adicionado para melhor responsividade */
  position: relative;
  
  .astronauta {
    position: fixed;
    width: 400px;
    height: auto;
    z-index:0;

    bottom: 0;
    left: -100;
    margin-left: -200px;



}

  @media (max-width: 1440px) {

    .astronauta{
      display:none;
    }
  }
  

  
`;

export const LoginCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: spcace-between;
  align-items: center;
  background: ${({ theme }) => theme.colors.indigo || 'var(--primary)'};
  padding: 3rem;
  border-radius: 1.5rem;
  width: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Adiciona sombra para profundidade */

  object-fit:cover;
  z-index: 1;


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
  

  @media (max-width: 1440px) {
    margin-top: 5rem;
    .about-content{

      height:10rem;

    }

    .planet-image{

      width:600px;

    }
  }
    @media (max-width: 768px) {
    
  

`;