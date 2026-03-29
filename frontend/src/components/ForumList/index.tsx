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
}

interface ForumListProps {
  forums: Forum[];
}

const ForumList: React.FC<ForumListProps> = ({ forums }) => {
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
        </ForumCard>
      ))}
    </ForumListContainer>
  );
};

export default ForumList;
