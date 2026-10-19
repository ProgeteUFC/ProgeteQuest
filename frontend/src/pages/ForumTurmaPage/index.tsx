import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { Container, Content, PlanetImage, ForumTitle, ForumDescription, LogoProgete } from "../ForumPage/styles";
import planetOrange from "../../assets/planet_orange.png";
import progeteLogo from "../../assets/progete.png";
import ForumList, { Forum } from "../../components/ForumList";

import ForumCreateForm from "../../components/ForumCreateForm";
import { BackButton, BackButtonContainer, BackButtonNotFound, Conversation, ConversationHeader, Posts, PostItem, ReplyForm, Pagination } from "./styles";
import { turmaService, TurmaProfessor } from "../../services/turmaService";
import { forumService, TopicApi, PostApi } from "../../services/forumService";
import { canCloseForumTopic, isForumManager } from "../../utils/forumPermissions";

const ForumTurmaPage = ({ embedded = false }: { embedded?: boolean }) => {
  const { turmaId } = useParams<{ turmaId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<TurmaProfessor | null>(null);
  const [carregandoTurma, setCarregandoTurma] = useState(true);
  const [forums, setForums] = useState<Forum[]>([]);
  const [forumId, setForumId] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [topicoSelecionado, setTopicoSelecionado] = useState<Forum | null>(null);
  const [postagens, setPostagens] = useState<PostApi[]>([]);
  const [resposta, setResposta] = useState("");
  const [carregandoPostagens, setCarregandoPostagens] = useState(false);
  const [enviandoResposta, setEnviandoResposta] = useState(false);
  const [paginaTopicos, setPaginaTopicos] = useState(1);
  const [totalPaginasTopicos, setTotalPaginasTopicos] = useState(1);
  const [carregandoTopicos, setCarregandoTopicos] = useState(false);
  const [paginaPostagens, setPaginaPostagens] = useState(1);
  const [totalPaginasPostagens, setTotalPaginasPostagens] = useState(1);
  const conversaAtual = React.useRef<string | null>(null);
  const token = localStorage.getItem("token") || "";
  const userId = localStorage.getItem("userId") || "";
  const role = localStorage.getItem("userType");
  const isAdmin = localStorage.getItem("userType") === "admin";
  const isManager = isForumManager(role);

  const mapTopic = (topic: TopicApi): Forum => ({
    id: topic.topicId,
    title: topic.titulo,
    message: topic.descricao || "",
    author: topic.autor.name,
    authorId: topic.autor.userId,
    status: topic.status,
    postsCount: topic.postsCount,
  });

  useEffect(() => {
    let ativo = true;
    async function carregarTurma() {
      if (!turmaId) return setCarregandoTurma(false);
      try {
        const response = await turmaService.buscarTurma(turmaId, token);
        if (ativo) {
          setCourse(response.data);
          let forumResponse;
          try {
            forumResponse = await forumService.buscarPorTurma(turmaId, token);
          } catch (error: any) {
            if (isManager && error?.response?.status === 404) {
              forumResponse = await forumService.habilitar(turmaId, token);
            } else {
              throw error;
            }
          }
          const topicsResponse = await forumService.listarTopicos(forumResponse.data.forumId, token);
          if (ativo) {
            setForumId(forumResponse.data.forumId);
            setForums(topicsResponse.data.data.map(mapTopic));
            setPaginaTopicos(1);
            setTotalPaginasTopicos(topicsResponse.data.meta.totalPages);
          }
        }
      } catch (error: any) {
        if (ativo) setErro(error?.response?.data?.message || "Não foi possível carregar o fórum.");
      } finally {
        if (ativo) setCarregandoTurma(false);
      }
    }
    carregarTurma();
    return () => { ativo = false; conversaAtual.current = null; };
  }, [turmaId, token, isManager]);

  const handleCreateForum = async (title: string, message: string) => {
    if (!forumId) return;
    try {
      setSalvando(true);
      setErro("");
      await forumService.criarTopico(forumId, title, message, token);
      await carregarTopicos(1);
    } catch (error: any) {
      setErro(error?.response?.data?.message || "Não foi possível salvar o fórum.");
      throw error;
    } finally {
      setSalvando(false);
    }
  };

  const carregarTopicos = async (page: number) => {
    setCarregandoTopicos(true);
    try {
      const response = await forumService.listarTopicos(forumId, token, page);
      setForums(response.data.data.map(mapTopic));
      setPaginaTopicos(response.data.meta.page);
      setTotalPaginasTopicos(response.data.meta.totalPages);
    } catch (error: any) {
      setErro(error?.response?.data?.message || "Não foi possível carregar os tópicos.");
    } finally {
      setCarregandoTopicos(false);
    }
  };

  const handleCloseForum = async (topicId: string) => {
    try {
      setErro("");
      const response = await forumService.fecharTopico(topicId, token);
      const fechado = mapTopic(response.data);
      setForums((prev) => prev.map((item) => item.id === topicId ? fechado : item));
      setTopicoSelecionado((atual) => atual?.id === topicId ? fechado : atual);
    } catch (error: any) {
      setErro(error?.response?.data?.message || "Você não pode fechar este fórum.");
    }
  };

  const handleOpenTopic = async (topico: Forum, page = 1) => {
    conversaAtual.current = topico.id;
    try {
      setTopicoSelecionado(topico);
      setPostagens([]);
      setCarregandoPostagens(true);
      setErro("");
      const response = await forumService.listarPostagens(topico.id, token, page);
      if (conversaAtual.current !== topico.id) return;
      setPostagens(response.data.data);
      setPaginaPostagens(response.data.meta.page);
      setTotalPaginasPostagens(response.data.meta.totalPages);
    } catch (error: any) {
      if (conversaAtual.current !== topico.id) return;
      setErro(error?.response?.data?.message || "Não foi possível abrir a conversa.");
    } finally {
      if (conversaAtual.current === topico.id) setCarregandoPostagens(false);
    }
  };

  const handleReply = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!topicoSelecionado || !resposta.trim() || carregandoPostagens || enviandoResposta) return;
    try {
      setEnviandoResposta(true);
      setErro("");
      await forumService.responderTopico(topicoSelecionado.id, resposta.trim(), token);
      if (conversaAtual.current === topicoSelecionado.id) {
        const firstPage = await forumService.listarPostagens(topicoSelecionado.id, token);
        if (conversaAtual.current === topicoSelecionado.id) {
          await handleOpenTopic(topicoSelecionado, Math.max(1, firstPage.data.meta.totalPages));
        }
      }
      setForums((prev) => prev.map((item) => item.id === topicoSelecionado.id ? { ...item, postsCount: item.postsCount + 1 } : item));
      setTopicoSelecionado((atual) => atual?.id === topicoSelecionado.id ? { ...atual, postsCount: atual.postsCount + 1 } : atual);
      if (conversaAtual.current === topicoSelecionado.id) setResposta("");
    } catch (error: any) {
      setErro(error?.response?.data?.message || "Não foi possível enviar a resposta.");
    } finally {
      setEnviandoResposta(false);
    }
  };

  if (carregandoTurma) {
    return (
      <Container>
        {!embedded && <Header />}
        <Content><ForumTitle>Carregando turma...</ForumTitle></Content>
        {!embedded && <LogoProgete src={progeteLogo} alt="Progete" />}
      </Container>
    );
  }

  if (!course) {
    return (
      <Container>
        {!embedded && <Header />}
        <Content>
          <ForumTitle>{erro || "Turma não encontrada"}</ForumTitle>
          <BackButtonContainer>
            <BackButtonNotFound onClick={() => navigate(isAdmin ? '/admin/forums' : '/forum')}>Voltar</BackButtonNotFound>
          </BackButtonContainer>
        </Content>
        {!embedded && <LogoProgete src={progeteLogo} alt="Progete" />}
        <PlanetImage src={planetOrange} alt="" />
      </Container>
    );
  }

  return (
    <Container>
      {!embedded && <Header />}
      <Content>
        <ForumTitle>{isAdmin ? "Administrar fórum" : "Fórum"} - {course.name}</ForumTitle>
        <ForumDescription>
          {isAdmin
            ? "Como administrador(a), você pode acompanhar a conversa, participar e fechar qualquer tópico desta turma."
            : "Escolha um tópico para participar da conversa ou crie um novo."}
        </ForumDescription>
        {isAdmin && course.teacher?.user?.name && <ForumDescription>Professor(a) responsável: {course.teacher.user.name}</ForumDescription>}
        {erro && <ForumDescription>{erro}</ForumDescription>}
        {forumId && <ForumCreateForm onCreate={handleCreateForum} disabled={salvando} />}
        <ForumList
          forums={forums}
          onClose={handleCloseForum}
          canClose={(forum) => canCloseForumTopic(role, userId, forum.authorId)}
          onOpen={(topico) => { setResposta(""); handleOpenTopic(topico); }}
        />
        {totalPaginasTopicos > 1 && <Pagination aria-label="Páginas dos tópicos">
          <button type="button" disabled={carregandoTopicos || salvando || paginaTopicos <= 1} onClick={() => carregarTopicos(paginaTopicos - 1)}>Tópicos anteriores</button>
          <span aria-live="polite"> Página {paginaTopicos} de {totalPaginasTopicos} </span>
          <button type="button" disabled={carregandoTopicos || salvando || paginaTopicos >= totalPaginasTopicos} onClick={() => carregarTopicos(paginaTopicos + 1)}>Próximos tópicos</button>
        </Pagination>}
        {topicoSelecionado && (
          <Conversation>
            <ConversationHeader>
              <div><h2>{topicoSelecionado.title}</h2><p>{topicoSelecionado.message}</p></div>
              <button type="button" onClick={() => { conversaAtual.current = null; setTopicoSelecionado(null); }}>Fechar conversa</button>
            </ConversationHeader>
            <Posts>
              {carregandoPostagens ? <p>Carregando respostas...</p> : postagens.length ? postagens.map((post) => (
                <PostItem key={post.postId}>
                  <strong>{post.autor.name}</strong>
                  <p>{post.mensagem}</p>
                  <small>{new Date(post.criadoEm).toLocaleString("pt-BR")}</small>
                </PostItem>
              )) : <p>Ainda não existem respostas. Inicie a conversa!</p>}
            </Posts>
            {!carregandoPostagens && totalPaginasPostagens > 1 && <Pagination aria-label="Páginas das respostas">
              <button type="button" disabled={enviandoResposta || paginaPostagens <= 1} onClick={() => handleOpenTopic(topicoSelecionado, paginaPostagens - 1)}>Respostas anteriores</button>
              <span aria-live="polite"> Página {paginaPostagens} de {totalPaginasPostagens} </span>
              <button type="button" disabled={enviandoResposta || paginaPostagens >= totalPaginasPostagens} onClick={() => handleOpenTopic(topicoSelecionado, paginaPostagens + 1)}>Próximas respostas</button>
            </Pagination>}
            {topicoSelecionado.status === "OPEN" ? (
              <ReplyForm onSubmit={handleReply}>
                <textarea value={resposta} onChange={(event) => setResposta(event.target.value)} placeholder="Escreva sua resposta..." required />
                <button type="submit" disabled={enviandoResposta || carregandoPostagens}>{enviandoResposta ? "Enviando..." : "Responder"}</button>
              </ReplyForm>
            ) : <p>Este tópico está fechado e não aceita novas respostas.</p>}
          </Conversation>
        )}
        <BackButtonContainer>
          <BackButton onClick={() => navigate(isAdmin ? '/admin/forums' : '/forum')}>Voltar</BackButton>
        </BackButtonContainer>
      </Content>
      {!embedded && <LogoProgete src={progeteLogo} alt="Progete" />}
      <PlanetImage src={planetOrange} alt="" />
    </Container>
  );
};

export default ForumTurmaPage;
