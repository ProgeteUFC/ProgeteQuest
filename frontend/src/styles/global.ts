import { createGlobalStyle } from 'styled-components';


export const GlobalStyle = createGlobalStyle`
    *   {
        font-family: 'Baloo Paaji 2', sans-serif; 
        margin:0;
        padding:0;
        box-sizing:border-box;
    }
    body::-webkit-scrollbar {
    width: 0;
    height: 0;
    display: none;
    }

    body {
        background-image: #2c0383;
        color: #fff; 
    }
`;