import { Fragment, type ReactNode } from "react";
import type { ManagedUser, UserDeletionImpact as Impact } from "../../services/adminService";
import { impactItems } from "./model";
import { useDeletionImpact, type DeletionImpactQuery } from "./useDeletionImpact";

interface Props {
  user: Pick<ManagedUser, "userId" | "type">;
  onContinue?: (impact: Impact) => void;
  refreshKey?: number;
  /** Compartilha a mesma consulta com as verificações do formulário de confirmação. */
  consultation?: DeletionImpactQuery;
  transferAction?: ReactNode;
}

export default function UserDeletionImpact(props: Props) {
  return props.consultation
    ? <ImpactContent {...props} consultation={props.consultation} />
    : <ImpactQuery {...props} />;
}

function ImpactQuery(props: Props) {
  const consultation = useDeletionImpact(props.user, props.refreshKey);
  return <ImpactContent {...props} consultation={consultation} />;
}

function ImpactContent({ consultation, onContinue, transferAction }: Props & { consultation: DeletionImpactQuery }) {
  const { loading, impact, error, allowed, reload, isAllowed } = consultation;

  function advance() {
    if (!isAllowed() || !impact) return;
    onContinue?.(impact);
  }

  return (
    <section aria-label="Dependências do usuário" aria-busy={loading}>
      <p>Resumo de vínculos existentes. Nenhum dado será excluído nesta consulta.</p>
      {loading && <p role="status">Consultando dependências...</p>}
      {error && <p role="alert">{error}</p>}
      {impact && <>
        {!impact.hasDependencies && <p role="status">Nenhuma dependência encontrada.</p>}
        {(!impact.canDelete || impact.blockedReasons.length > 0) && <div role="alert">
          <p>Exclusão bloqueada.</p>
          <ul>{impact.blockedReasons.map((reason, index) => <li key={index}>{reason}</li>)}</ul>
        </div>}
        {impact.type === "teacher" && impact.classesAsTeacher > 0 && <p role="note">
          As turmas sob responsabilidade deste professor precisam ser transferidas para outro professor antes de prosseguir.
          Após a transferência, consulte o impacto novamente para verificar os impedimentos restantes.
          {transferAction && <> {transferAction}</>}
        </p>}
        <dl className="deletion-impact-list">{impactItems(impact).map(([label, count]) => <Fragment key={label}><dt>{label}</dt><dd>{count}</dd></Fragment>)}</dl>
      </>}
      <div className="user-status-actions">
        <button type="button" onClick={reload}>{error ? "Tentar novamente" : "Consultar novamente"}</button>
        {onContinue && <button type="button" disabled={!allowed} onClick={advance}>Avançar para confirmação</button>}
      </div>
    </section>
  );
}
