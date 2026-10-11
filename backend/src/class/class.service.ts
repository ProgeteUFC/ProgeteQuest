import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { CreateClassDto } from './dtos/createClass.dto';
import { generateUuid } from '../utils/generateUuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from './entities/class.entity';
import { Teacher } from '../teacher/entities/teacher.entity';
import { validate as isUuid } from 'uuid';
import { generateJoinCode } from '../utils/generateJoinCode';
import { UpdateClassDto } from './dtos/updateClass.dto';
import { Assessment } from '../assessment/entities/assessment.entity';
import { UserStatus } from '../Enums/user.enum';

const classSelection = {
  classId: true, teacherId: true, name: true, joinCode: true, createdAt: true, updatedAt: true,
  teacher: { userId: true, user: { userId: true, name: true, email: true } },
} as const;

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,

    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,

    @InjectRepository(Assessment)
    private readonly assessmentRepository: Repository<Assessment>,
  ) {}

  async getAllClasses(user: any): Promise<Class[]> {
    const whereCondition = user.isAdmin ? {} : user.type === 'student'
      ? { studentClasses: { studentId: user.userId } } : { teacherId: user.userId };
    return this.classRepository.find({
      where: whereCondition,
      relations: ['teacher', 'teacher.user'],
      select: classSelection,
    });
  }

  private async getUniqueJoinCode(): Promise<string> {
    let joinCode: string = '';
    let isUnique = false;

    while (!isUnique) {
      joinCode = generateJoinCode(10);
      const existingClass = await this.classRepository.findOne({
        where: { joinCode },
      });
      if (!existingClass) {
        isUnique = true;
      }
    }
    return joinCode;
  }

  async createClass(newClass: CreateClassDto, user: any): Promise<Class> {
    // valida o UUID
    const id = generateUuid();
    if (!isUuid(id)) {
      throw new BadRequestException('ID gerado inválido');
    }

    const targetTeacherId = user.isAdmin ? newClass.teacherId : user.userId;
    if (!targetTeacherId || !isUuid(targetTeacherId)) throw new BadRequestException('Informe explicitamente um professor responsável válido.');
    if (typeof newClass.name !== 'string' || !newClass.name.trim()) throw new BadRequestException('Informe o nome da turma.');

    // Garante que o código é único
    const joinCode = await this.getUniqueJoinCode();

    // verifica se teacher existe
    const teacherEntity = await this.teacherRepository.findOne({
      where: { userId: targetTeacherId, user: { status: UserStatus.ACTIVE } },
    });
    if (!teacherEntity) {
      throw new NotFoundException(
        `Professor com ID ${targetTeacherId} não encontrado`,
      );
    }

    // cria uma nova turma
    const classEntity = this.classRepository.create({
      classId: id,
      teacherId: targetTeacherId,
      name: newClass.name.trim(),
      joinCode,
    });

    return this.classRepository.save(classEntity);
  }

  async regenerateJoinCode(classId: string, user: any): Promise<Class> {
    const whereCondition = user.isAdmin
      ? { classId }
      : { classId, teacherId: user.userId };
    const classEntity = await this.classRepository.findOne({
      where: whereCondition,
    });
    if (!classEntity) throw new NotFoundException('Turma não encontrada');

    // Garante que o novo código também é único
    classEntity.joinCode = await this.getUniqueJoinCode();
    return this.classRepository.save(classEntity);
  }

  async updateClass(
    id: string,
    updateDto: UpdateClassDto,
    user: any,
  ): Promise<Class> {
    const whereCondition = user.isAdmin
      ? { classId: id }
      : { classId: id, teacherId: user.userId };
    const existing = await this.classRepository.findOne({
      where: whereCondition,
    });

    if (!existing) {
      throw new NotFoundException(`Turma com id ${id} não encontrada`);
    }

    if (updateDto.name !== undefined) {
      if (typeof updateDto.name !== 'string' || updateDto.name.trim() === '') {
        throw new BadRequestException('O campo "name" não pode ser vazio.');
      }
      existing.name = updateDto.name;
    }

    if (updateDto.classId !== undefined) {
      throw new BadRequestException('Não é permitido alterar o ID da turma.');
    }

    // Atualizar teacherId (se informado): valida existência do teacher
    if (updateDto.teacherId !== undefined) {
      if (!user.isAdmin) throw new ForbiddenException('Somente administradores podem alterar o professor responsável.');
      if (!isUuid(updateDto.teacherId)) throw new BadRequestException('Professor responsável inválido.');
      const teacherExists = await this.teacherRepository.findOne({
        where: { userId: updateDto.teacherId, user: { status: UserStatus.ACTIVE } },
      });
      if (!teacherExists) {
        throw new NotFoundException(
          `Professor com id ${updateDto.teacherId} não encontrado`,
        );
      }
      existing.teacherId = updateDto.teacherId;
    }

    // assessmentId não é campo de Class — sinalize erro se enviado
    if (updateDto.assessmentId !== undefined) {
      throw new BadRequestException(
        'O campo assessmentId não é aplicável a Class',
      );
    }

    return await this.classRepository.save(existing);
  }

  async deleteClass(id: string, user: any): Promise<void> {
    const whereCondition = user.isAdmin
      ? { classId: id }
      : { classId: id, teacherId: user.userId };
    const existing = await this.classRepository.findOne({
      where: whereCondition,
    });
    if (!existing) {
      throw new NotFoundException(
        `Turma com id ${id} não encontrada ou acesso negado.`,
      );
    }
    const [dependencies] = await this.classRepository.manager.query(`SELECT
      EXISTS(SELECT 1 FROM student_class WHERE class_id = $1)
      OR EXISTS(SELECT 1 FROM assessment WHERE class_id = $1)
      OR EXISTS(SELECT 1 FROM activity WHERE class_id = $1)
      OR EXISTS(SELECT 1 FROM forum WHERE turma_id = $1) AS blocked`, [id]);
    if (dependencies.blocked) throw new ConflictException('A turma possui dependências e histórico acadêmico e não pode ser excluída.');
    try { await this.classRepository.delete(id); }
    catch (error) {
      if ((error as { driverError?: { code?: string } }).driverError?.code === '23503') throw new ConflictException('A turma possui dependências e não pode ser excluída.');
      throw error;
    }
  }

  async searchClasses(query: { name?: string; joinCode?: string }, user: any) {
    const qb = this.classRepository.createQueryBuilder('class');

    if (!user.isAdmin) {
      if (user.type === 'student') {
        qb.innerJoin('class.studentClasses', 'membership', 'membership.studentId = :studentId', { studentId: user.userId });
      } else qb.andWhere('class.teacherId = :teacherId', { teacherId: user.userId });
    }
    if (query.name) {
      qb.andWhere('LOWER(class.name) LIKE :name', {
        name: `%${query.name.toLowerCase()}%`,
      });
    }
    if (query.joinCode) {
      qb.andWhere('class.joinCode = :joinCode', { joinCode: query.joinCode });
    }

    return qb.getMany();
  }

  async getClassById(id: string, user: any): Promise<Class> {
    const userType = String(user.type ?? '').toLowerCase();
    const whereCondition = user.isAdmin
      ? { classId: id }
      : userType === 'student'
        ? {
            classId: id,
            studentClasses: { studentId: user.userId },
          }
        : { classId: id, teacherId: user.userId };
    const turma = await this.classRepository.findOne({
      where: whereCondition,
      relations: ['teacher', 'teacher.user'],
      select: classSelection,
    });
    if (!turma) throw new NotFoundException('Turma não encontrada');
    return turma;
  }
}
