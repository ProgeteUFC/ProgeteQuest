import { Routes, Route } from 'react-router-dom';
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from './pages/RegisterPage/RegisterPage';
import Button from './components/Button/Button';
import image from "./assets/logo.png";


function HomePage() {
  return (
    <main>
      <section className='hometop'>
        <h1>Bem vindo(a) ao:</h1>
        <img src={image} alt="" />
      </section>
      <section className='homedown'>
        <p>Desafie, Supere, Ganhe!</p>
        <p>Esse é o nosso sistema de Gamificação acadêmica! <br/>
         Aqui, os Professores lançam dsafios e os alunos conquistam pontos tras nas disciplinas. <br/>
        </p>
      </section>
      <Button />
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      {/* <Route path="/" element={<HomePage />} /> */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}