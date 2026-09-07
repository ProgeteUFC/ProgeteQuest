import {
  Position,
  RankingItem,
  StudentData,
  StudentName,
  StudentPoints,
} from "./styles";

interface AlunoRankingProps {
  posicaoAluno: number;
  nomeAluno: string;
  pontuacao: number;
}

export function AlunoRanking({
  posicaoAluno,
  nomeAluno,
  pontuacao,
}: AlunoRankingProps) {
  return (
    <RankingItem>
      <Position>{posicaoAluno}º</Position>
      <StudentData>
        <StudentName title={nomeAluno}>{nomeAluno}</StudentName>
        <StudentPoints>{pontuacao} pontos</StudentPoints>
      </StudentData>
    </RankingItem>
  );
}
