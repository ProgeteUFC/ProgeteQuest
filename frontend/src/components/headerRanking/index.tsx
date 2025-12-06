import { Container, Image } from "./styles";
import logo from "../../assets/Logo.png";
import { IoExitOutline } from "react-icons/io5";
import { TiHome } from "react-icons/ti";
import { IconHome, IconExite, Box } from "./styles";


export function HeaderRanking() {
  return (
    <Container>
      <Image src={logo} alt="logo" />
      <Box>
        <IconHome>
        <TiHome size={30} />        
      </IconHome>
      <IconExite>
        <IoExitOutline size={30} />
        <span>Sair</span>
      </IconExite>
      </Box>
    </Container>
  );
}
