import { ThemeProvider } from 'styled-components';
import { defaultTheme } from './styles/themes/default';
import { GlobalStyle } from './styles/global';
import { BrowserRouter } from 'react-router-dom';
import { Router } from './routes/Router';
import { Helmet } from 'react-helmet'; 

export function App() {
  return (
    <>
      <Helmet>
        <link 
          href="https://fonts.googleapis.com/css2?family=Baloo+Paaji+2:wght@400..800&display=swap" 
          rel="stylesheet" 
        />
      </Helmet>
      
      <BrowserRouter>
        <ThemeProvider theme={defaultTheme}>
          <Router />
          <GlobalStyle />
        </ThemeProvider>
      </BrowserRouter>
    </>
  )
}
