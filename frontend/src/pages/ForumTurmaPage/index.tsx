import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { Container, Content, PlanetImage, ForumTitle, ForumDescription, LogoProgete } from "../ForumPage/styles";
import planetOrange from "../../assets/planet_orange.png";
import progeteLogo from "../../assets/progete.png";
import ForumList, { Forum } from "../../components/ForumList";

import ForumCreateForm from "../../components/ForumCreateForm";
import { BackButton, BackButtonContainer, BackButtonNotFound, Conversation, ConversationHeader, Posts, PostItem, ReplyForm } from "./styles";
import { turmaService, TurmaProfessor } from "../../services/turmaService";
import { forumService, TopicApi, PostApi } from "../../services/forumService";

const ForumTurmaPage: React.FC = () => {
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
  const token = localStorage.getItem("token") || "";
  const userId = localStorage.getItem("userId") || "";
  const isTeacher = localStorage.getItem("userType") === "teacher";

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
            if (isTeacher && error?.response?.status === 404) {
              forumResponse = await forumService.habilitar(turmaId, token);
            } else {
              throw error;
            }
          }
          const topicsResponse = await forumService.listarTopicos(forumResponse.data.forumId, token);
          if (ativo) {
            setForumId(forumResponse.data.forumId);
            setForums(topicsResponse.data.data.map(mapTopic));
          }
        }
      } catch (error: any) {
        if (ativo) setErro(error?.response?.data?.message || "Não foi possível carregar o fórum.");
      } finally {
        if (ativo) setCarregandoTurma(false);
      }
    }
    carregarTurma();
    return () => { ativo = false; };
  }, [turmaId, token, isTeacher]);

  const handleCreateForum = async (title: string, message: string) => {
    if (!forumId) return;
    try {
      setSalvando(true);
      setErro("");
      const response = await forumService.criarTopico(forumId, title, message, token);
      setForums((prev) => [mapTopic(response.data), ...prev]);
    } catch (error: any) {
      setErro(error?.response?.data?.message || "Não foi possível salvar o fórum.");
      throw error;
    } finally {
      setSalvando(false);
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

  const handleOpenTopic = async (topico: Forum) => {
    try {
      setTopicoSelecionado(topico);
      setCarregandoPostagens(true);
      setErro("");
      const response = await forumService.listarPostagens(topico.id, token);
      setPostagens(response.data.data);
    } catch (error: any) {
      setErro(error?.response?.data?.message || "Não foi possível abrir a conversa.");
    } finally {
      setCarregandoPostagens(false);
    }
  };

  const handleReply = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!topicoSelecionado || !resposta.trim()) return;
    try {
      setEnviandoResposta(true);
      setErro("");
      const response = await forumService.responderTopico(topicoSelecionado.id, resposta.trim(), token);
      setPostagens((prev) => [...prev, response.data]);
      setForums((prev) => prev.map((item) => item.id === topicoSelecionado.id ? { ...item, postsCount: item.postsCount + 1 } : item));
      setTopicoSelecionado((atual) => atual ? { ...atual, postsCount: atual.postsCount + 1 } : atual);
      setResposta("");
    } catch (error: any) {
      setErro(error?.response?.data?.message || "Não foi possível enviar a resposta.");
    } finally {
      setEnviandoResposta(false);
    }
  };

  if (carregandoTurma) {
    return (
      <Container>
        <Header />
        <Content><ForumTitle>Carregando turma...</ForumTitle></Content>
        <LogoProgete src={progeteLogo} alt="Progete" />
      </Container>
    );
  }

  if (!course) {
    return (
      <Container>
        <Header />
        <Content>
          <ForumTitle>{erro || "Turma não encontrada"}</ForumTitle>
          <BackButtonContainer>
            <BackButtonNotFound onClick={() => navigate('/forum')}>Voltar</BackButtonNotFound>
          </BackButtonContainer>
        </Content>
        <LogoProgete src={progeteLogo} alt="Progete" />
        <PlanetImage src={planetOrange} alt="" />
      </Container>
    );
  }

  return (
    <Container>
      <Header />
      <Content>
        <ForumTitle>Fórum - {course.name}</ForumTitle>
        <ForumDescription>Escolha um tópico para participar da conversa ou crie um novo.</ForumDescription>
        {erro && <ForumDescription>{erro}</ForumDescription>}
        {forumId && <ForumCreateForm onCreate={handleCreateForum} disabled={salvando} />}
        <ForumList
          forums={forums}
          onClose={handleCloseForum}
          canClose={(forum) => forum.authorId === userId || isTeacher}
          onOpen={handleOpenTopic}
        />
        {topicoSelecionado && (
          <Conversation>
            <ConversationHeader>
              <div><h2>{topicoSelecionado.title}</h2><p>{topicoSelecionado.message}</p></div>
              <button type="button" onClick={() => setTopicoSelecionado(null)}>Fechar conversa</button>
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
            {topicoSelecionado.status === "OPEN" ? (
              <ReplyForm onSubmit={handleReply}>
                <textarea value={resposta} onChange={(event) => setResposta(event.target.value)} placeholder="Escreva sua resposta..." required />
                <button type="submit" disabled={enviandoResposta}>{enviandoResposta ? "Enviando..." : "Responder"}</button>
              </ReplyForm>
            ) : <p>Este tópico está fechado e não aceita novas respostas.</p>}
          </Conversation>
        )}
        <BackButtonContainer>
          <BackButton onClick={() => navigate('/forum')}>Voltar</BackButton>
        </BackButtonContainer>
      </Content>
      <LogoProgete src={progeteLogo} alt="Progete" />
      <PlanetImage src={planetOrange} alt="" />
    </Container>
  );
};

export default ForumTurmaPage;
