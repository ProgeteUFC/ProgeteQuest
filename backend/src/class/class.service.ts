import {
  Injectable,
  BadRequestException,
  NotFoundException,
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

  async getAllClasses(): Promise<Class[]> {
    return this.classRepository.find();
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

  async createClass(newClass: CreateClassDto): Promise<Class> {
    // valida o UUID
    const id = generateUuid();
    if (!isUuid(id)) {
      throw new BadRequestException('ID gerado inválido');
    }

    // Garante que o código é único
    const joinCode = await this.getUniqueJoinCode();

    // verifica se teacher existe
    const teacherEntity = await this.teacherRepository.findOneBy({
      userId: newClass.teacherId,
    });
    if (!teacherEntity) {
      throw new NotFoundException(
        `Professor com ID ${newClass.teacherId} não encontrado`,
      );
    }

    // cria uma nova turma
    const classEntity = this.classRepository.create({
      classId: id,
      teacherId: newClass.teacherId,
      name: newClass.name.trim(),
      joinCode,
    });

    return this.classRepository.save(classEntity);
  }

  async regenerateJoinCode(classId: string): Promise<Class> {
    const classEntity = await this.classRepository.findOne({
      where: { classId },
    });
    if (!classEntity) throw new NotFoundException('Turma não encontrada');

    // Garante que o novo código também é único
    classEntity.joinCode = await this.getUniqueJoinCode();
    return this.classRepository.save(classEntity);
  }

  async updateClass(id: string, updateDto: UpdateClassDto): Promise<Class> {
    const existing = await this.classRepository.findOne({
      where: { classId: id },
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
      // Atualização de classId: valida apenas o formato do UUID
      if (!isUuid(updateDto.classId)) {
        throw new BadRequestException('ID inválido fornecido');
      }
      existing.classId = updateDto.classId;
    }

    // Atualizar teacherId (se informado): valida existência do teacher
    if (updateDto.teacherId !== undefined) {
      const teacherExists = await this.teacherRepository.findOne({
        where: { userId: updateDto.teacherId },
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

  async deleteClass(id: string): Promise<void> {
    const result = await this.classRepository.delete(id);
    if (!result.affected || result.affected === 0) {
      throw new NotFoundException(`Turma com id ${id} não encontrada`);
    }
  }

  async searchClasses(query: { name?: string; joinCode?: string }) {
    const qb = this.classRepository.createQueryBuilder('class');

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
}
