import React from "react";

interface AlunoRankingProps {
  posicaoAluno: number;
  nomeAluno: string;
}

export function AlunoRanking({ posicaoAluno, nomeAluno }: AlunoRankingProps) {
  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
      <p
        style={{
          color: "white",
          fontSize: "24px",
          fontWeight: "bold",
          backgroundColor: "#2c0383",
          borderRadius: "10px",
          padding: "4px 14px",
        }}
      >
        {posicaoAluno}°
      </p>
      <p
        style={{
          color: "#2c0383",
          fontSize: "18px",
          fontWeight: "bold",
        }}
      >
        {nomeAluno}
      </p>
    </div>
  );
}
