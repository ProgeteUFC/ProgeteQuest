import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  *{
  box-sizing: border-box;
  margin:0;
  padding: 0;
}

main {
  background-color: var(--primary-dark); 
  width: 100vw;
  height: 100vh;
  color : white;
  font-weight: 600;
  font-family: Roboto, sans-serif;
  display:flex;
  align-items: center;
  justify-content: center;
  
  
  
}

main p {
  margin-top:2rem;
}
`