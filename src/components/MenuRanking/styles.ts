import styled from 'styled-components';

export const Content = styled.div`
    background-color: ${props => props.theme.COLORS.indigo};
    padding: 20px;
    border-radius: 30px;
    display: inline-block;
`;

export const Container = styled.div`    
    display: flex;
    width: 933px;
    height: 40px;
    background-color: ${props => props.theme.COLORS.white};
    justify-content: center;
    border: 0px;
    border-radius: 20px;
`
