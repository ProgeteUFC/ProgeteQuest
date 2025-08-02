import styled from 'styled-components';

export const Container = styled.div`
    background-color: ${props => props.theme.COLORS.kingfisherDaisy};
`;

export const Content = styled.div`
    margin-left: 140px;
    margin-top: 60px;
    background-color: ${props => props.theme.COLORS.kingfisherDaisy};
`;

export const Disciplinas = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 430px;
    height: 267px;
    background-color: ${props => props.theme.COLORS.white};
    border-radius: 20px;
    border: 0;
    margin-top: 20px;
    padding:10px;
`