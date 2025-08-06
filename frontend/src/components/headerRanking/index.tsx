import { Container, Image } from "./styles";
import logo from "../../assets/Logo.png";
import { IoExitOutline } from "react-icons/io5";
import { TiHome } from "react-icons/ti";
import { Icon } from "./styles";

export function HeaderRanking() {
  return (
    <Container>
      <Image src={logo} alt="logo" />
      <Icon>
        <TiHome size={30} />
        <IoExitOutline size={30} />
      </Icon>
    </Container>
  );
}
