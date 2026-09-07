import React from "react";
import {
  ForumListContainer,
  ForumCard,
  ForumTitle,
  ForumMessage,
  ForumAuthor,
  NoForumText,
} from "./styles";

export interface Forum {
  id: string;
  title: string;
  message: string;
  author: string;
  authorId: string;
  status: "OPEN" | "CLOSED";
  postsCount: number;
}

interface ForumListProps {
  forums: Forum[];
  onClose: (topicId: string) => void;
  canClose: (forum: Forum) => boolean;
  onOpen: (forum: Forum) => void;
}

const ForumList: React.FC<ForumListProps> = ({ forums, onClose, canClose, onOpen }) => {
  if (forums.length === 0) {
    return <NoForumText>Nenhum fórum encontrado para esta turma.</NoForumText>;
  }
  return (
    <ForumListContainer>
      {forums.map((forum) => (
        <ForumCard key={forum.id}>
          <ForumTitle>{forum.title}</ForumTitle>
          <ForumMessage>{forum.message}</ForumMessage>
          <ForumAuthor>Por: {forum.author}</ForumAuthor>
          <ForumAuthor>Status: {forum.status === "OPEN" ? "Aberto" : "Fechado"}</ForumAuthor>
          <ForumAuthor>{forum.postsCount} resposta(s)</ForumAuthor>
          <button className="open-topic" type="button" onClick={() => onOpen(forum)}>Abrir conversa</button>
          {forum.status === "OPEN" && canClose(forum) && (
            <button type="button" onClick={() => onClose(forum.id)}>Fechar fórum</button>
          )}
        </ForumCard>
      ))}
    </ForumListContainer>
  );
};

export default ForumList;
