import { useParams } from "react-router-dom";

export default function AdminTeacherClasses() {
  const { id } = useParams();

  return (
    <div style={{ padding: 32 }}>
      <h1>Turmas do professor {id}</h1>
      <p>Lista de turmas em construção.</p>
    </div>
  );
}
