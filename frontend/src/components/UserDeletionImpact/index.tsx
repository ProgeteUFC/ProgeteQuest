import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { adminErrorMessage, adminService, type ManagedUser, type UserDeletionImpact as Impact } from "../../services/adminService";
import { canProceed, impactItems, validImpact } from "./model";

interface Props {
  user: Pick<ManagedUser, "userId" | "type">;
  /** Integração futura: avança para a confirmação, sem executar a exclusão. */
  onContinue?: (impact: Impact) => void;
  /** Incremente após uma transferência concluída para invalidar a consulta. */
  refreshKey?: number;
}

export default function UserDeletionImpact({ user, onContinue, refreshKey = 0 }: Props) {
  const [revision, setRevision] = useState(0);
  const [result, setResult] = useState<{ query: object; impact?: Impact; error?: string } | null>(null);
  const request = useRef<AbortController | null>(null);
  const { userId, type } = user;

  const query = useMemo(() => ({}), [userId, type, revision, refreshKey]);

  useEffect(() => {
    const controller = new AbortController();
    request.current = controller;
    adminService.consultarImpacto(userId, controller.signal).then(impact => {
      if (controller.signal.aborted) return;
      if (!validImpact(impact, { userId, type })) throw new Error("Resposta de impacto inválida para o usuário selecionado.");
      setResult({ query, impact });
    }).catch(error => {
      if (!controller.signal.aborted) setResult({ query, error: adminErrorMessage(error) });
    });
    return () => controller.abort();
  }, [userId, type, revision, refreshKey, query]);

  const current = result?.query === query ? result : null;
  const loading = !current;
  const impact = current?.impact;
  const allowed = !loading && !current?.error && canProceed(impact, user);

  function reload() {
    request.current?.abort();
    setResult(null);
    setRevision(value => value + 1);
  }

  function advance() {
    if (!allowed || request.current?.signal.aborted || !canProceed(impact, user)) return;
    onContinue?.(impact);
  }

  return (
    <section aria-label="Dependências do usuário" aria-busy={loading}>
      <p>Resumo de vínculos existentes. Nenhum dado será excluído nesta consulta.</p>
      {loading && <p role="status">Consultando dependências...</p>}
      {current?.error && <p role="alert">{current.error}</p>}
      {impact && <>
        {!impact.hasDependencies && <p role="status">Nenhuma dependência encontrada.</p>}
        {(!impact.canDelete || impact.blockedReasons.length > 0) && <div role="alert">
          <p>Exclusão bloqueada.</p>
          <ul>{impact.blockedReasons.map((reason, index) => <li key={index}>{reason}</li>)}</ul>
        </div>}
        {impact.type === "teacher" && impact.classesAsTeacher > 0 && <p role="note">
          As turmas sob responsabilidade deste professor precisam ser transferidas para outro professor antes de prosseguir.
          Após a transferência, consulte o impacto novamente para verificar os impedimentos restantes.
        </p>}
        <dl className="deletion-impact-list">{impactItems(impact).map(([label, count]) => <Fragment key={label}><dt>{label}</dt><dd>{count}</dd></Fragment>)}</dl>
      </>}
      <div className="user-status-actions">
        <button type="button" onClick={reload}>{current?.error ? "Tentar novamente" : "Consultar novamente"}</button>
        {onContinue && <button type="button" disabled={!allowed} onClick={advance}>Avançar para confirmação</button>}
      </div>
    </section>
  );
}
