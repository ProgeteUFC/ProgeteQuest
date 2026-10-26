import { useEffect, useMemo, useRef, useState } from "react";
import { adminErrorMessage, adminService, type ManagedUser, type UserDeletionImpact } from "../../services/adminService";
import { canProceed, validImpact } from "./model";

export function useDeletionImpact(user: Pick<ManagedUser, "userId" | "type">, refreshKey = 0) {
  const [revision, setRevision] = useState(0);
  const [result, setResult] = useState<{
    query: object;
    controller: AbortController;
    impact?: UserDeletionImpact;
    error?: string;
  } | null>(null);
  const request = useRef<AbortController | null>(null);
  const { userId, type } = user;
  const query = useMemo(() => ({}), [userId, type, revision, refreshKey]);

  useEffect(() => {
    const controller = new AbortController();
    request.current = controller;
    adminService.consultarImpacto(userId, controller.signal).then(impact => {
      if (controller.signal.aborted) return;
      if (!validImpact(impact, { userId, type })) throw new Error("Resposta de impacto inválida para o usuário selecionado.");
      setResult({ query, controller, impact });
    }).catch(error => {
      if (!controller.signal.aborted) setResult({ query, controller, error: adminErrorMessage(error) });
    });
    return () => controller.abort();
  }, [userId, type, query]);

  const current = result?.query === query ? result : null;
  const loading = !current;
  const impact = current?.impact;
  const error = current?.error;
  const allowed = !loading && !error && canProceed(impact, user);

  function reload() {
    // Invalida também handlers capturados antes do próximo render do React.
    request.current?.abort();
    setResult(null);
    setRevision(value => value + 1);
  }

  function isAllowed() {
    return allowed && current?.controller === request.current &&
      !current.controller.signal.aborted && canProceed(impact, user);
  }

  return { query, loading, impact, error, allowed, reload, isAllowed };
}

export type DeletionImpactQuery = ReturnType<typeof useDeletionImpact>;
