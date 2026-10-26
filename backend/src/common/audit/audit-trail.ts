import { EntityManager } from 'typeorm';

/**
 * Contrato mínimo da trilha de auditoria.
 *
 * O registro automático de auditoria é uma funcionalidade à parte desta sprint.
 * Até ela existir, as operações administrativas que precisam ser auditadas já
 * montam o evento completo e o entregam por aqui — quem grava de fato é a
 * implementação registrada em `AUDIT_TRAIL`. Trocar o provider no módulo é o
 * único passo que falta para a trilha definitiva começar a persistir.
 */
export const AUDIT_TRAIL = Symbol('AUDIT_TRAIL');

export interface AuditEvent {
  /** Ação executada, em `dominio.acao` (ex.: `teacher.classes.transferred`). */
  action: string;
  /** Usuário autenticado que disparou a operação. */
  actorId: string;
  /** Entidade principal afetada (ex.: `teacher`). */
  entity: string;
  /** Identificador da entidade principal. */
  entityId: string;
  occurredAt: Date;
  /** Dados específicos da operação: antes, depois e o que foi tocado. */
  details: Record<string, unknown>;
}

export interface AuditTrail {
  /**
   * Grava o evento. O `manager` é o da transação que originou a operação: a
   * trilha nasce e morre junto com a mudança que ela descreve — se a operação
   * sofrer rollback, o registro de auditoria some com ela, e nunca sobra um
   * evento descrevendo algo que não aconteceu.
   */
  record(event: AuditEvent, manager: EntityManager): Promise<void>;
}
