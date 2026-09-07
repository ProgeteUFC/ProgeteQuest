import { FormEvent, useState } from "react";
import { SlArrowRightCircle } from "react-icons/sl";
import Header from "../../components/Header";
import planetBlue from "../../assets/planet_blue_anel.png";
import progeteLogo from "../../assets/progete.png";
import { alunoService } from "../../services/alunoService";
import {
  Container,
  Content,
  Feedback,
  IconeBusca,
  Image,
  LogoProgete,
  Pesquisa,
  SearchContainer,
  Text,
  Title,
} from "./styles";

const EntraEmTurma = () => {
  const [codigo, setCodigo] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function handleEntrarTurma(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const codigoInformado = codigo.trim();

    if (!codigoInformado) {
      setSucesso("");
      setErro("Digite o código de entrada da turma.");
      return;
    }

    setErro("");
    setSucesso("");
    setEnviando(true);

    try {
      const token = localStorage.getItem("token") || "";
      const studentId = localStorage.getItem("userId") || "";
      await alunoService.entrarEmTurma(studentId, codigoInformado, token);
      setSucesso("Você entrou na turma com sucesso!");
      setCodigo("");
    } catch (error: any) {
      setErro(
        error?.response?.data?.message ||
          "Erro ao entrar na turma. Verifique o código."
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Container>
      <Header />
      <Content>
        <Title>Entrar em uma turma</Title>
        <Text>
          Para entrar em uma turma, digite o código fornecido pelo(a)
          professor(a)
        </Text>

        <SearchContainer onSubmit={handleEntrarTurma}>
          <Pesquisa
            aria-label="Código de entrada da turma"
            autoComplete="off"
            placeholder="Código de entrada"
            value={codigo}
            onChange={(event) => setCodigo(event.target.value)}
          />
          <IconeBusca
            type="submit"
            aria-label="Entrar na turma"
            disabled={enviando}
          >
            <SlArrowRightCircle />
          </IconeBusca>
        </SearchContainer>

        {erro && <Feedback role="alert">{erro}</Feedback>}
        {sucesso && <Feedback $success>{sucesso}</Feedback>}
      </Content>

      <LogoProgete src={progeteLogo} alt="Progete" />
      <Image src={planetBlue} alt="" aria-hidden="true" />
    </Container>
  );
};

export default EntraEmTurma;
