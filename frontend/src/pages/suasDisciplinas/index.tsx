
import { ButtonDisciplinas } from "../../components/ButtonDisciplinas";
import Footer from "../../components/Footer";
import { Header } from "../../components/header";
import { TitleDescription } from "../../components/TitleDescription";
import { TitleName } from "../../components/TitleName";
import { Container, Content, Disciplinas} from "./styles";

export function SuasDiscplinas(){
    return(
        <Container>
            <Header/>
            <Content>
                <TitleName titleName="Suas Disciplinas" />
                <TitleDescription titleDescription =" Aqui você pode 
                consultar as disciplinas em que você está cadastrado(a)"/>
                <Disciplinas>
                    <ButtonDisciplinas title={'Cadastrar Disciplinas'} />
                    <ButtonDisciplinas title={'Disciplinas'} />
                    <ButtonDisciplinas title={'Meus Dados'} />
                    <ButtonDisciplinas title={'Suporte'} />
                    
                </Disciplinas>
            </Content>
            <Footer />   
        </Container>
    )
}