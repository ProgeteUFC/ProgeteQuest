import { BadRequestException, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { AuditAction } from 'src/Enums/audit-action.enum';
import { AdminAuditLog } from './entities/admin-audit-log.entity';

export interface RecordAuditInput {
  adminId: string;
  targetUserId: string;
  action: AuditAction;
  reason?: string | null;
  changes?: Record<string, unknown> | null;
  resourceIds?: Record<string, unknown> | null;
}

const SENSITIVE_KEY = /pass(word)?|senha|hash|token|jwt|secret|authorization/i;
const JWT_VALUE = /^eyJ[\w-]+\.[\w-]+\.[\w-]*$/;
const BCRYPT_VALUE = /^\$2[aby]\$\d{2}\$/;

function assertNoSensitiveData(value: unknown, path = 'payload'): void {
  if (typeof value === 'string') {
    if (JWT_VALUE.test(value) || BCRYPT_VALUE.test(value)) {
      throw new BadRequestException(
        `A auditoria não pode armazenar senha, hash ou token (${path}).`,
      );
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, i) => assertNoSensitiveData(item, `${path}[${i}]`));
    return;
  }
  if (value && typeof value === 'object') {
    for (const [key, inner] of Object.entries(value)) {
      if (SENSITIVE_KEY.test(key)) {
        throw new BadRequestException(
          `A auditoria não pode armazenar senha, hash ou token (${path}.${key}).`,
        );
      }
      assertNoSensitiveData(inner, `${path}.${key}`);
    }
  }
}

@Injectable()
export class AuditService {
  async record(
    manager: EntityManager,
    input: RecordAuditInput,
  ): Promise<AdminAuditLog> {
    assertNoSensitiveData(input.changes ?? null, 'changes');
    assertNoSensitiveData(input.resourceIds ?? null, 'resourceIds');

    const entry = manager.create(AdminAuditLog, {
      auditId: uuidv4(),
      adminId: input.adminId,
      adminIdSnapshot: input.adminId,
      targetUserId: input.targetUserId,
      targetUserIdSnapshot: input.targetUserId,
      action: input.action,
      reason: input.reason ?? null,
      changes: input.changes ?? null,
      resourceIds: input.resourceIds ?? null,
    });

    return manager.save(entry);
  }
}
