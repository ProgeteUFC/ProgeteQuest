import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DataSource, EntityManager, Not } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { UserStatus, UserType } from 'src/Enums/user.enum';
import { PermanentlyDeleteUserDto } from './dtos/permanently-delete-user.dto';
import {
  DeletionImpact,
  PermanentDeletionClearanceResponseDto,
} from './dtos/responses/permanent-deletion-clearance.response.dto';

/**
 * Mesma chave de trava usada por `UserService.deactivate` e `UserService.remove`.
 * Desativar, excluir e checar regras de exclusão disputam o mesmo estado — a
 * contagem de administradores ativos — e por isso entram em fila na mesma
 * trava, em vez de cada um enxergar um retrato diferente do banco.
 */
const ADMIN_USER_STATE_LOCK = 'admin-user-state';

/**
 * Regras da exclusão definitiva de um usuário.
 *
 * Nesta sprint o serviço **apenas valida**: nada é apagado em lugar nenhum.
 * A exclusão transacional entra na próxima — e entra chamando
 * `assertDeletable` de dentro da sua própria transação, antes dos DELETEs.
 * Por isso todas as regras já recebem o `EntityManager` por parâmetro e já
 * tomam a trava e o lock de linha: quando os DELETEs forem escritos, as
 * checagens continuam valendo sob a mesma transação, sem reescrita e sem
 * janela entre "validei" e "apaguei".
 *
 * A checagem não grava auditoria, de propósito. O único valor de ação
 * disponível é `AuditAction.USER_PERMANENTLY_DELETED`, e registrá-lo aqui
 * afirmaria uma exclusão que não aconteceu — exatamente o tipo de registro
 * falso que torna uma trilha de auditoria inútil. Quem grava é a exclusão
 * real da próxima sprint, depois dos DELETEs e na mesma transação, via
 * `AuditService.record`.
 */
@Injectable()
export class PermanentUserDeletionService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly userService: UserService,
  ) {}

  /**
   * Roda a bateria de regras e devolve a liberação. Não executa exclusão.
   */
  async validate(
    targetUserId: string,
    adminId: string,
    dto: PermanentlyDeleteUserDto,
  ): Promise<PermanentDeletionClearanceResponseDto> {
    return this.dataSource.transaction(async (manager) => {
      const impact = await this.assertDeletable(
        manager,
        targetUserId,
        adminId,
        dto,
      );

      const validatedAt = new Date();
      const reason = dto.reason.trim();

      return {
        userId: targetUserId,
        executed: false,
        validatedAt,
        validatedBy: adminId,
        reason,
        impact,
        pendingStep:
          'Regras aprovadas. A exclusão transacional será executada quando for implementada.',
      };
    });
  }

  /**
   * As regras, na ordem em que precisam valer. Lança na primeira que falhar e
   * devolve o impacto recalculado quando todas passam.
   *
   * A ordem não é arbitrária: quem chama só recebe qualquer informação sobre o
   * usuário selecionado depois de provar que é administrador ativo e de
   * reconfirmar a própria senha. Sem isso, o endpoint viraria um jeito de
   * descobrir quais IDs existem no sistema.
   */
  async assertDeletable(
    manager: EntityManager,
    targetUserId: string,
    adminId: string,
    dto: PermanentlyDeleteUserDto,
  ): Promise<DeletionImpact> {
    await manager.query('SELECT pg_advisory_xact_lock(hashtext($1))', [
      ADMIN_USER_STATE_LOCK,
    ]);

    const admin = await this.loadActiveAdmin(manager, adminId);
    await this.assertPasswordMatches(dto.adminPassword, admin);

    if (targetUserId === adminId) {
      throw new BadRequestException(
        'Você não pode excluir a própria conta de administrador',
      );
    }

    const target = await manager.findOne(User, {
      where: { userId: targetUserId },
      lock: { mode: 'pessimistic_write' },
    });

    if (!target) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (target.status !== UserStatus.INACTIVE) {
      throw new ConflictException(
        'Só é possível excluir definitivamente um usuário já desativado. Desative-o antes.',
      );
    }

    const impact = await this.userService.getDeletionImpact(
      targetUserId,
      manager,
    );

    if (!impact.canDelete) {
      throw new ConflictException({
        message:
          'O usuário possui dependências que impedem a exclusão definitiva.',
        impact,
      });
    }

    await this.assertSystemKeepsAnAdmin(manager, target);

    return impact;
  }

  /**
   * O `RolesGuard` já barra quem não é administrador ativo, mas a regra é
   * relida aqui dentro da transação: o perfil pode ter sido rebaixado ou a
   * conta desativada entre a validação do token e este ponto, e a exclusão
   * definitiva é destrutiva demais para confiar num retrato antigo.
   */
  private async loadActiveAdmin(
    manager: EntityManager,
    adminId: string,
  ): Promise<User> {
    const admin = await manager.findOne(User, {
      where: { userId: adminId },
    });

    if (
      !admin ||
      admin.type !== UserType.ADMIN ||
      admin.status !== UserStatus.ACTIVE
    ) {
      throw new ForbiddenException(
        'Apenas um administrador ativo pode excluir usuários definitivamente',
      );
    }

    return admin;
  }

  /**
   * Reconfirma a senha do administrador autenticado. A mensagem é a mesma
   * para senha errada e para qualquer outro desencontro de credencial: não há
   * o que ganhar detalhando a quem errou a senha.
   */
  private async assertPasswordMatches(
    adminPassword: string,
    admin: User,
  ): Promise<void> {
    const matches = await bcrypt.compare(adminPassword, admin.password);

    if (!matches) {
      throw new UnauthorizedException('Senha do administrador incorreta');
    }
  }

  /**
   * Rede de segurança do "nunca fique sem administrador".
   *
   * Hoje a regra do usuário inativo já torna difícil chegar aqui com o último
   * administrador ativo na mira — mas essa proteção é consequência de outra
   * regra, não dela mesma. Esta checagem afirma o invariante diretamente:
   * depois da exclusão tem que sobrar pelo menos um administrador ativo,
   * mesmo que a regra do inativo seja afrouxada ou que o estado mude entre
   * duas operações concorrentes.
   */
  private async assertSystemKeepsAnAdmin(
    manager: EntityManager,
    target: User,
  ): Promise<void> {
    if (target.type !== UserType.ADMIN) {
      return;
    }

    const remainingActiveAdmins = await manager.count(User, {
      where: {
        type: UserType.ADMIN,
        status: UserStatus.ACTIVE,
        userId: Not(target.userId),
      },
    });

    if (remainingActiveAdmins === 0) {
      throw new ConflictException(
        'Não é possível excluir o último administrador ativo',
      );
    }
  }
}
