import { Container, Image, Text } from './styles';
import image from '../../assets/image.png'

function Footer(){
    return(
        <Container>
            <Image src={image} />

            <Text> Copyright © 2025, ProgeteQuest! All Rights Reserved.</Text>
        </Container>
    );

};

export default Footer;