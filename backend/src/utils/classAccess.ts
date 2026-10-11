import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Class } from '../class/entities/class.entity';
import { UserPayload } from '../decorators/user.decorator';

export const isAdmin = (user: UserPayload) =>
  user.isAdmin === true || user.type === 'admin';

export async function assertClassAccess(
  repository: Repository<Class>,
  classId: string,
  user: UserPayload,
) {
  const turma = await repository.findOne({ where: { classId } });
  if (!turma) throw new NotFoundException('Turma não encontrada');
  if (isAdmin(user)) return turma;
  if (user.type === 'teacher' && turma.teacherId === user.userId) return turma;
  if (
    user.type === 'student' &&
    (await repository.exists({
      where: { classId, studentClasses: { studentId: user.userId } },
    }))
  )
    return turma;
  throw new ForbiddenException('Você não tem acesso a esta turma.');
}
