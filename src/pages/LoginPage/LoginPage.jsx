import "./LoginPage.css"
import logo from "../../assets/image.png"
import progeteQuestImg from "../../assets/logo.png"
import planetOrange from "../../assets/planet_orange.png"

function LoginPage() {
 
  return (
    <main>
      <div className="login">
        <img src={logo} alt="" />
        <form className="login-card" action="/login" method="post">
        <div className="tipoUsuario">
          <button>Sou Aluno(a)</button>
          <button>Sou Professor(a)</button>
        </div>
        <div className="form-group">
            <input type="text" name="usuario" placeholder="Email" required/>
            <input type="password" name="senha" placeholder="Senha" required />
            <a href="">Esqueci minha senha</a>
            <button type="submit">Entrar</button>
        </div>
      </form>
      </div>


    <section className="about-us">
      <div>
        <img className="planet" src={planetOrange} alt="" />
        <h1>Bem-vindo(a) ao</h1>
        <img src={progeteQuestImg} alt="" />
        <h1>Desafie, Supere e Vença!</h1>
        <p>
          ProgeteQuest é o sistema de Gamificação acadêmica<br/> 
          desenvolvido por alunos da UFC Campus de Russas! <br/>
          Aqui, os professores lançam desafios e os alunos <br/>
          conquistam pontos extras nas disciplinas. <br/>
          Aprender nunca foi tão divertido!
        </p>
      </div>


    </section>

    </main>
  );
}

export default LoginPage;