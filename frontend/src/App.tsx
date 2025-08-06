import { ThemeProvider } from 'styled-components';
import { defaultTheme } from './styles/themes/default';
import { SuasDiscplinas } from './pages/suasDisciplinas';
import { GlobalStyle } from './styles/global';

export function App() {  
  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <SuasDiscplinas />
        <GlobalStyle />
      </ThemeProvider>
    </>
  )
}

