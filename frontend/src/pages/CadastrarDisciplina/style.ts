import styled from 'styled-components';

export const Pagina = styled.h1`
    color: white;
    background-color: ${props => props.theme.colors.primaryDark};
    padding: 8% 15%;
    font-family: 'Baloo Paaji 2', sans-serif;
    height: 84.2vh;
    position: relative;
    overflow: hidden;
`

export const TituloPagina = styled.h1`
    font-size: 34px;
`

export const PageContent = styled.div`
    width: 60%;
`

export const SubTituloPagina = styled.h1`
    font-size: 24px;
    margin-top: 20px;
`

export const DivSenha = styled.div`
    position: relative;

`

export const InputSenha = styled.input`
    margin-top: 20px;
    height: 58px;
    width: 100%;
    border-radius: 50px;
    padding-left: 90px;
    font-size: 20px;
`

export const LabelSenha = styled.label`
    position: absolute;
    color: ${props => props.theme.colors.primaryDark};
    top: 37px;
    left: 20px;
    font-weight: normal;
    font-size: 20px;
`

export const IconEnviarSenha = styled.img`
    position: absolute;
    top: 32px;
    right: 15px;
    cursor: pointer;
`

export const LogoProgete = styled.img`
    position: absolute;
    bottom: 20px;
    left: 40px;
`

export const PlanetaCadastrar = styled.img`
    position: absolute;
    bottom: -200px;
    right: -110px;
`