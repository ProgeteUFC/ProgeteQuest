import styled from 'styled-components';



export const ButtonContainer = styled.button`
    display: flex;
    width: 208px;
    height: 27px;
    color:white;
    border-radius: 20px;
    background-color: ${props => props.theme.COLORS.indigo};
    border: 0;
    color: ${props => props.theme.COLORS.white};
    align-items: center;
    justify-content: center;
    margin: 7px;
`

export const Title = styled.p`
    font-size: ${props => props.theme.FONT_SIZE.P12}px;
`