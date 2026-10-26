import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { adminService, adminErrorMessage, type ManagedUser, type UserDeletionImpact, type ClassTransferResult } from "../../../services/adminService";
import { turmaService, type TurmaProfessor } from "../../../services/turmaService";
import { Panel } from "./styles";

async function activeTeachers(sourceId: string) {
  const teachers: ManagedUser[] = [];
  let page = 1;
  let totalPages = 1;
  do {
    const response = await adminService.listarUsuarios({ type: "teacher", status: "active", page, limit: 100 });
    teachers.push(...response.data.filter(user => user.userId !== sourceId && user.type === "teacher" && user.status === "active"));
    totalPages = response.meta.totalPages;
    page++;
  } while (page <= totalPages);
  return teachers;
}

export default function AdminTeacherClasses() {
  const { id } = useParams();
  const [source, setSource] = useState<ManagedUser | null>(null);
  const [classes, setClasses] = useState<TurmaProfessor[]>([]);
  const [teachers, setTeachers] = useState<ManagedUser[]>([]);
  const [impact, setImpact] = useState<UserDeletionImpact | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [destination, setDestination] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [result, setResult] = useState<ClassTransferResult | null>(null);
  const [destinationName, setDestinationName] = useState("");
  const [revision, setRevision] = useState(0);
  const busy = useRef(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError("");
    setImpact(null);
    async function load() {
      if (!id) throw new Error("Professor não informado.");
      const [user, allClasses, options, currentImpact] = await Promise.all([
        adminService.buscarUsuario(id),
        turmaService.listarTurmasProfessor(localStorage.getItem("token") || ""),
        activeTeachers(id),
        adminService.consultarImpacto(id),
      ]);
      if (user.type !== "teacher") throw new Error("O usuário selecionado não possui perfil de professor.");
      if (active) {
        setSource(user);
        setClasses(allClasses.data.filter(item => item.teacherId === id));
        setTeachers(options);
        setImpact(currentImpact);
        setSelected([]);
        setConfirmed(false);
        setDestination("");
      }
    }
    void load().catch(err => { if (active) setLoadError(adminErrorMessage(err)); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id, revision]);

  const valid = !loading && !loadError && !submitting && confirmed &&
    source?.userId === id && selected.length > 0 && selected.length <= 100 &&
    selected.every(classId => classes.some(item => item.classId === classId)) &&
    teachers.some(user => user.userId === destination);

  async function transfer(event: FormEvent) {
    event.preventDefault();
    if (!valid || !id || busy.current) return;
    busy.current = true;
    setSubmitting(true);
    setError("");
    setResult(null);
    try {
      const response = await adminService.transferirTurmas(id, destination, selected);
      setDestinationName(teachers.find(user => user.userId === destination)?.name || destination);
      setResult(response);
      setLoading(true);
      setImpact(null);
      setSelected([]);
      setConfirmed(false);
      setRevision(value => value + 1);
    } catch (err) {
      setError(`${adminErrorMessage(err)} A transferência não foi confirmada. Atualize os dados antes de tentar novamente.`);
      setLoadError("Atualize os dados para conferir o responsável atual pelas turmas.");
      setConfirmed(false);
    } finally {
      busy.current = false;
      setSubmitting(false);
    }
  }

  return <Panel>
    <Link to="/admin/users">Voltar para usuários</Link>
    <h1>Transferir turmas</h1>
    <p>Altere o professor responsável sem excluir matrículas, avaliações, atividades ou fóruns.</p>
    {result && <section className="notice success" role="status">
      <h2>Transferência concluída</h2>
      <p>{result.transferredClasses.length} turma(s) transferida(s) para {destinationName}.</p>
      <ul>{result.transferredClasses.map(item => <li key={item.classId}><Link to={`/admin/classes/${item.classId}`}>{item.name}</Link></li>)}</ul>
      <h3>Dados acadêmicos preservados</h3>
      <dl>
        <dt>Matrículas</dt><dd>{result.preservedRelations.enrollments}</dd>
        <dt>Avaliações</dt><dd>{result.preservedRelations.assessments}</dd>
        <dt>Atividades</dt><dd>{result.preservedRelations.activities}</dd>
        <dt>Fóruns</dt><dd>{result.preservedRelations.forums}</dd>
      </dl>
    </section>}
    {error && <p className="notice error" role="alert">{error}</p>}
    {loading && <p role="status">Atualizando professores, turmas e dependências...</p>}
    {loadError && <div className="notice error" role="alert">
      <p>{result ? "A transferência foi concluída, mas não foi possível atualizar os dados. " : ""}{loadError}</p>
      <button type="button" disabled={loading || submitting} onClick={() => { setError(""); setRevision(value => value + 1); }}>Atualizar dados</button>
    </div>}
    {!loading && !loadError && source && <>
      <h2>Professor de origem: {source.name}</h2>
      <p>{source.email} · {source.status === "active" ? "Ativo" : "Inativo"}</p>
      {classes.length === 0 ? <p>Nenhuma turma vinculada a este professor.</p> : <form onSubmit={transfer}>
        <fieldset disabled={submitting}>
          <legend>Selecione as turmas</legend>
          <p>Selecione até 100 turmas por transferência.</p>
          <div className="class-options">{classes.map(item => <label className="check" key={item.classId}>
            <input type="checkbox" checked={selected.includes(item.classId)} disabled={!selected.includes(item.classId) && selected.length >= 100}
              onChange={event => { setConfirmed(false); setSelected(values => event.target.checked ? [...values, item.classId] : values.filter(value => value !== item.classId)); }} />
            <span>{item.name}</span>
          </label>)}</div>
          <label className="destination">Professor de destino
            <select required value={destination} onChange={event => { setDestination(event.target.value); setConfirmed(false); }}>
              <option value="">Selecione um professor ativo</option>
              {teachers.map(user => <option key={user.userId} value={user.userId}>{user.name} — {user.email}</option>)}
            </select>
          </label>
          {teachers.length === 0 && <p role="note">Não há outro professor ativo disponível. Cadastre ou reative um professor para continuar.</p>}
          <label className="check"><input type="checkbox" checked={confirmed} onChange={event => setConfirmed(event.target.checked)} />
            <span>Confirmo a transferência de {selected.length} turma(s) para {teachers.find(user => user.userId === destination)?.name || "o professor selecionado"}. O professor de origem perderá o acesso a essas turmas.</span>
          </label>
          <button type="submit" disabled={!valid}>{submitting ? "Transferindo..." : "Confirmar transferência"}</button>
        </fieldset>
        {submitting && <p role="status">Transferindo turmas. Aguarde a confirmação.</p>}
      </form>}
      {impact && <section className="notice">
        <h2>{result ? "Impacto da exclusão após a transferência" : "Dependências para exclusão"}</h2>
        <p>{impact.classesAsTeacher} turma(s) ainda vinculada(s) ao professor.</p>
        {impact.classesAsTeacher > 0 && <p>Transfira as turmas restantes antes de tentar excluir o professor.</p>}
        {impact.canDelete ? <p>Nenhuma dependência impede a exclusão. A conta precisa estar inativa, e a exclusão definitiva continua sujeita à liberação do sistema.</p> : <>
          <p>A exclusão continua bloqueada:</p>
          <ul>{impact.blockedReasons.map(reason => <li key={reason}>{reason}</li>)}</ul>
          <p>Transferir turmas não elimina outros vínculos ou publicações do usuário.</p>
        </>}
        <Link to="/admin/users">Voltar aos usuários para revisar a exclusão</Link>
      </section>}
    </>}
  </Panel>;
}
