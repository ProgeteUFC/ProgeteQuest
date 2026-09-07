import styled from "styled-components";

export const Pagina = styled.main`
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  background: ${({ theme }) => theme.colors.primaryDark};
  color: white;
  font-family: "Baloo Paaji 2", sans-serif;
`;

export const TituloPagina = styled.h1`
  width: min(840px, calc(100% - 48px));
  margin: 0 0 0 180px;
  padding-top: 40px;
  font-family: "Baloo Paaji 2", sans-serif;
  font-size: 34px;
  font-weight: 800;
  line-height: 1.2;

  @media (max-width: 768px) {
    width: calc(100% - 32px);
    margin: 0 16px;
    padding-top: 52px;
  }
`;

export const SubTituloPagina = styled.p`
  width: min(840px, calc(100% - 48px));
  margin: 8px 0 0 180px;
  font-family: "Baloo Paaji 2", sans-serif;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.2;

  @media (max-width: 768px) {
    width: calc(100% - 32px);
    margin-left: 16px;

    br {
      display: none;
    }
  }
`;

export const PageContent = styled.section`
  position: relative;
  z-index: 2;
  display: grid;
  width: min(1180px, calc(100% - 228px));
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  margin: 30px 0 120px 180px;

  @media (max-width: 1200px) {
    width: calc(100% - 48px);
    grid-template-columns: repeat(2, minmax(0, 1fr));
    margin-left: 24px;
  }

  @media (max-width: 768px) {
    width: calc(100% - 32px);
    grid-template-columns: 1fr;
    margin: 36px 16px 110px;
  }
`;

export const ProfessorEturma = styled.div`
  display: grid;
  min-width: 0;
  height: 100%;
  grid-template-rows: repeat(2, minmax(0, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    display: flex;
    height: auto;
    flex-direction: column;
  }
`;

export const AcoesEturma = styled.div`
  display: grid;
  min-width: 0;
  height: 100%;
  grid-template-rows: repeat(2, minmax(0, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    display: flex;
    height: auto;
    flex-direction: column;
  }
`;

const InformationCard = styled.div`
  display: flex;
  width: 100%;
  min-height: 100px;
  align-items: center;
  gap: 14px;
  padding: 18px;
  border-radius: 24px;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.primaryDark};

  img {
    width: 52px;
    height: 52px;
    flex: 0 0 52px;
  }

  @media (max-width: 480px) {
    min-height: 88px;
    padding: 14px;

    img {
      width: 44px;
      height: 44px;
      flex-basis: 44px;
    }
  }
`;

export const InfosProfessor = styled(InformationCard)``;
export const QuantAlunos = styled(InformationCard)``;
export const ColocacaoAluno = styled(InformationCard)``;

export const NomeProfessor = styled.p`
  margin: 0 0 5px;
  overflow-wrap: anywhere;
  font: inherit;
  font-size: 16px;
  font-weight: 400;

  strong {
    font-weight: 800;
  }
`;

export const ContatoProfessor = styled.p`
  margin: 0;
  overflow-wrap: anywhere;
  font: inherit;
  font-size: 15px;
  font-weight: 400;

  strong {
    font-weight: 800;
  }
`;

export const QuantAlunosValor = styled.p`
  margin: 0;
  font: inherit;
  font-size: 16px;
  font-weight: 700;
`;

export const OpcoesTurma = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 14px;
  padding: 18px;
  border-radius: 24px;
  background: ${({ theme }) => theme.colors.white};
`;

export const VizualizarAtividades = styled.button`
  width: 100%;
  min-height: 44px;
  padding: 8px 18px;
  border: 0;
  border-radius: 22px;
  background: ${({ theme }) => theme.colors.indigo};
  color: white;
  font: inherit;
  font-size: 16px;
  font-weight: 700;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;

  &:hover,
  &:focus-visible {
    background: ${({ theme }) => theme.colors.challengeOrange};
    outline: none;
  }

  &:active {
    transform: scale(0.99);
  }
`;

export const VizualizarMembros = styled(VizualizarAtividades)``;

export const ColocacaoTexto = styled.p`
  margin: 0;
  font: inherit;
  font-size: 16px;
  font-weight: 700;
`;

export const RankingAlunos = styled.div`
  display: flex;
  width: 100%;
  min-width: 0;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  border-radius: 24px;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.primaryDark};

  > div {
    min-width: 0;
  }

  > div p:last-child {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  @media (min-width: 769px) and (max-width: 1200px) {
    grid-column: 1 / -1;
    width: calc(50% - 10px);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const Estrelas = styled.div`
  display: flex;
  min-height: 58px;
  align-items: flex-end;
  justify-content: center;
`;

export const PageState = styled.p<{ $error?: boolean }>`
  grid-column: 1 / -1;
  margin: 0;
  padding: 18px;
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ $error, theme }) =>
    $error ? theme.colors.challengeOrange : theme.colors.primaryDark};
  font-size: 17px;
  font-weight: 700;
  text-align: center;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  z-index: 20;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(20, 3, 65, 0.78);
  backdrop-filter: blur(4px);
`;

export const MembersModal = styled.section`
  width: min(520px, 100%);
  max-height: min(640px, calc(100vh - 40px));
  padding: 24px;
  overflow: hidden;
  border: 5px solid white;
  border-radius: 30px;
  background: ${({ theme }) => theme.colors.indigo};
  box-shadow: 0 20px 55px rgba(12, 2, 44, 0.38);

  @media (max-width: 480px) {
    padding: 18px;
    border-width: 4px;
    border-radius: 24px;
  }
`;

export const ModalHeader = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;

  h2,
  p {
    margin: 0;
  }

  h2 {
    font-size: 25px;
    line-height: 1.2;
  }

  p {
    margin-top: 3px;
    color: ${({ theme }) => theme.colors.muted};
    font-size: 15px;
    font-weight: 700;
  }
`;

export const CloseModalButton = styled.button`
  display: grid;
  width: 38px;
  height: 38px;
  flex: 0 0 38px;
  place-items: center;
  border: 0;
  border-radius: 50%;
  background: white;
  color: ${({ theme }) => theme.colors.primaryDark};
  font: inherit;
  font-size: 27px;
  font-weight: 800;
  line-height: 1;
  cursor: pointer;

  &:hover,
  &:focus-visible {
    background: ${({ theme }) => theme.colors.challengeOrange};
    color: white;
    outline: none;
  }
`;

export const MembersList = styled.div`
  display: flex;
  max-height: min(480px, calc(100vh - 175px));
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
  padding-right: 5px;
  overflow-y: auto;
  scrollbar-color: white transparent;
  scrollbar-width: thin;
`;

export const MemberItem = styled.article`
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 12px 15px;
  border-radius: 18px;
  background: white;
  color: ${({ theme }) => theme.colors.primaryDark};

  > span {
    display: grid;
    width: 42px;
    height: 42px;
    flex: 0 0 42px;
    place-items: center;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primaryDark};
    color: white;
    font-size: 19px;
    font-weight: 800;
  }

  div {
    min-width: 0;
  }

  strong,
  p {
    display: block;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  strong {
    font-size: 17px;
  }

  p {
    font-size: 14px;
    font-weight: 600;
  }
`;

export const EmptyMembers = styled.p`
  margin: 20px 0 0;
  padding: 20px;
  border-radius: 18px;
  background: white;
  color: ${({ theme }) => theme.colors.primaryDark};
  font-weight: 700;
  text-align: center;
`;

export const PlanetaAzulClaro = styled.img`
  position: fixed;
  z-index: 1;
  right: -100px;
  bottom: -150px;
  width: 1100px;
  max-width: 50vw;
  pointer-events: none;
  user-select: none;

  @media (max-width: 1439px) {
    display: none;
  }
`;

export const LogoProgete = styled.img`
  position: fixed;
  z-index: 3;
  bottom: 31px;
  left: 52px;
  height: 48px;

  @media (max-width: 1024px) {
    display: none;
  }

`;
