import React, { useState, FormEvent } from "react";
import "./LoginProfessor.css";

export default function LoginProfessor() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: integrar com a API de autenticação
    console.log("Login professor:", { email, senha });
  };

  const handleCriarConta = () => {
    // TODO: navegar para tela de cadastro
    console.log("Criar conta professor");
  };

  const handleEsqueciSenha = () => {
    // TODO: navegar para tela de recuperação de senha
    console.log("Esqueci minha senha");
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <img
          className="planeta"
          src="/planeta.png"
          alt=""
          aria-hidden="true"
        />

        <header className="login-header">
          <img
            className="logo-progete"
            src="/logo-progetequest.png"
            alt="ProgeteQuest"
          />
        </header>

        <section className="login-card">
          <h2 className="acessar-title">ACESSAR CONTA</h2>

          <form className="login-form" onSubmit={handleLogin} noValidate>
            <div className="input-group">
              <label htmlFor="email" className="input-label">
                E-mail:
              </label>
              <input
                id="email"
                type="email"
                className="login-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail:"
              />
            </div>

            <div className="input-group">
              <label htmlFor="senha" className="input-label">
                Senha:
              </label>
              <input
                id="senha"
                type="password"
                className="login-input"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Senha:"
              />  
            </div>

            <button
              type="button"
              className="esqueci-senha"
              onClick={handleEsqueciSenha}
            >
              Esqueci minha senha
            </button>

            <div className="login-actions">
              <button type="submit" className="btn-login">
                LOGIN
              </button>
              <button
                type="button"
                className="btn-criar-conta"
                onClick={handleCriarConta}
              >
                CRIAR CONTA
              </button>
            </div>
          </form>
        </section>

        {/* Descrição */}
        <p className="descricao">
          ProgeteQuest é o sistema de gamificação acadêmica desenvolvido por
          alunos da UFC Campus de Russas! Aqui, os professores lançam desafios e
          os alunos conquistam pontos extras nas disciplinas. Aprender nunca foi
          tão divertido!
        </p>

        {/* Astronauta decorativo */}
        <img
          className="astronauta"
          src="/astronauta.png"
          alt=""
          aria-hidden="true"
        />

        {/* Footer */}
        <footer className="login-footer">
          <img src="/logo-progete.png" alt="Progete!" className="footer-logo" />
          <span className="footer-copy">
            Copyright © 2025, ProgeteQuest® All Rights Reserved.
          </span>
        </footer>
      </div>
    </div>
  );
}
