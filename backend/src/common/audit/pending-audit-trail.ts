import { Injectable, Logger } from '@nestjs/common';
import { AuditEvent, AuditTrail } from './audit-trail';

/**
 * Implementação provisória: enquanto o registro automático de auditoria não
 * está disponível, o evento vai para o log da aplicação em vez de uma tabela.
 *
 * Substituir pelo serviço definitivo é trocar o provider de `AUDIT_TRAIL` no
 * módulo — nenhuma regra de negócio precisa mudar, porque o evento já sai
 * completo daqui.
 */
@Injectable()
export class PendingAuditTrail implements AuditTrail {
  private readonly logger = new Logger('Auditoria');

  // O `manager` da transação é ignorado aqui: sem tabela de auditoria, não há
  // o que gravar junto com a operação.
  record(event: AuditEvent): Promise<void> {
    this.logger.log(
      `[auditoria pendente] ${event.action} por ${event.actorId} em ${event.entity}:${event.entityId} ${JSON.stringify(event.details)}`,
    );
    return Promise.resolve();
  }
}
