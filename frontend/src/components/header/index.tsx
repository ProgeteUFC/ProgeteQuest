import { Container, Image } from "./styles";
import { Menu } from "../Menu/index";
import logo from "../../assets/Logo.png"

export function Header(){
    return (
        <Container>
            <Image src={logo} alt="logo"/>
            <Menu />
        </Container>
    )

}