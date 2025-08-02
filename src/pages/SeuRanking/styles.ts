import styled from "styled-components";

export const Container = styled.div`
background-color: ${props => props.theme.COLORS.kingfisherDaisy};
height: 100vh;
`;

export const Content = styled.div`
width: 100%;
max-width: 1120px;
`;

export const Title = styled.h2`
color: ${props => props.theme.COLORS.white};
font-size: ${props => props.theme.FONT_SIZE.G34}px;
margin: 40px 0;`