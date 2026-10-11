import { useParams } from "react-router-dom";
import ViewClasses from "../../VisualizarTurmasProfessor";

export default function AdminTeacherClasses() {
  const { id } = useParams();

  return <ViewClasses embedded teacherId={id} />;
}
