import styled from "styled-components";

export const Container = styled.div`
background-color: ${props => props.theme.COLORS.kingfisherDaisy};
display:flex;
flex-direction: column;
justify-content: space-between;
height: 100vh;
width: 100vw;
`;

export const Content = styled.div`
width: 100%;
padding:200px;
max-width: 1120px;
`;

export const Title = styled.h2`
color: ${props => props.theme.COLORS.white};
font-size: ${props => props.theme.FONT_SIZE.G34}px;
transform: translateY(-90px);
`

export const Image = styled.img`
position: fixed;
width: 700px;
z-index:0;
bottom: 0; 
right: 0;
transform: translate(20%, 20%);

@media (max-width: 1400px) {
    width: 500px;
    transform: translate(10%, 10%);
}

@media (max-width: 768px) {
    width: 400px;
    transform: translate(10%, 10%);
}
`