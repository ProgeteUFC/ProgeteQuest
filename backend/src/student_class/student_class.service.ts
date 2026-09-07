import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentClass } from './entities/studentClass.entity';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import { Class } from 'src/class/entities/class.entity';
import { Student } from 'src/student/entities/student.entity';
import { Checkin } from 'src/checkin/entities/checkin.entity';
import { generateUuid } from 'src/utils/generateUuid';
import {
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';

@Injectable()
export class StudentClassService {
  constructor(
    @InjectRepository(StudentClass)
    private readonly studentClassRepository: Repository<StudentClass>,

    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,

    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,

    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async enrollStudentByRegistration(
    registrationStudent: string,
    joinCode: string,
  ) {
    // Busca o aluno pela matrícula
    const student = await this.studentRepository.findOne({
      where: { registrationStudent },
    });
    if (!student) throw new NotFoundException('Aluno não encontrado');

    // Busca a turma pelo código
    const classEntity = await this.classRepository.findOne({
      where: { joinCode },
    });
    if (!classEntity) throw new NotFoundException('Código de turma inválido');

    // Verifica se já está vinculado
    const exists = await this.studentClassRepository.findOne({
      where: { studentId: student.userId, classId: classEntity.classId },
    });
    if (exists) throw new ConflictException('Esse registro já existe');

    const studentClass = this.studentClassRepository.create({
      studentClassId: generateUuid(),
      studentId: student.userId,
      classId: classEntity.classId,
    });
    return this.studentClassRepository.save(studentClass);
  }

  async joinClassByCode(studentId: string, joinCode: string) {
    // Busca a turma pelo código
    const classEntity = await this.classRepository.findOne({
      where: { joinCode },
    });
    if (!classEntity) throw new NotFoundException('Código de turma inválido');

    // Busca o estudante pelo userId
    const student = await this.studentRepository.findOne({
      where: { userId: studentId },
    });
    if (!student) throw new NotFoundException('Aluno não encontrado');

    // Verifica se já está vinculado
    const exists = await this.studentClassRepository.findOne({
      where: { studentId: studentId, classId: classEntity.classId },
    });

    if (exists) throw new ConflictException('Esse registro já existe');

    const studentClass = this.studentClassRepository.create({
      studentClassId: generateUuid(),
      studentId,
      // CORREÇÃO: "classCId" alterado para "classId"
      classId: classEntity.classId,
    });
    return this.studentClassRepository.save(studentClass);
  }

  async removeStudentByRegistration(
    registrationStudent: string,
    classId: string,
    teacherId: string, // id do professor logado
  ) {
    // 1 — busca o professor logado
    const teacher = await this.teacherRepository.findOne({
      where: { userId: teacherId },
    });
    if (!teacher) {
      throw new UnauthorizedException(
        'Você não tem permissão para realizar esta ação.',
      );
    }

    // 2 — valida se a turma existe
    const classEntity = await this.classRepository.findOne({
      where: { classId },
    });
    if (!classEntity) {
      throw new NotFoundException(`Turma com id ${classId} não encontrada`);
    }

    // 3 — valida se o professor é o dono da turma
    if (classEntity.teacherId !== teacherId) {
      throw new ForbiddenException(
        'Você não tem permissão para realizar esta ação.',
      );
    }

    // 4 — busca o aluno pela matrícula
    const student = await this.studentRepository.findOne({
      where: { registrationStudent },
    });
    if (!student) throw new NotFoundException('Aluno não encontrado');

    // 5 — verifica se vínculo existe
    const studentClass = await this.studentClassRepository.findOne({
      where: { studentId: student.userId, classId },
    });
    if (!studentClass) {
      throw new NotFoundException('O aluno não está matriculado nessa turma.');
    }

    // 6 — remove o vínculo
    await this.studentClassRepository.remove(studentClass);

    return { message: 'Aluno removido da turma com sucesso' };
  }

  async removeStudentByUserId(
    studentId: string,
    classId: string,
    teacherId: string, // id do professor logado
  ) {
    // 1 — valida professor logado
    const teacher = await this.teacherRepository.findOne({
      where: { userId: teacherId },
    });
    if (!teacher) {
      throw new UnauthorizedException(
        'Você não tem permissão para realizar esta ação.',
      );
    }

    // 2 — valida turma
    const classEntity = await this.classRepository.findOne({
      where: { classId },
    });
    if (!classEntity) {
      throw new NotFoundException(`Turma com id ${classId} não encontrada`);
    }

    // 3 — professor precisa ser o dono da turma
    if (classEntity.teacherId !== teacherId) {
      throw new ForbiddenException(
        'Você não tem permissão para realizar esta ação.',
      );
    }

    // 4 — valida se o aluno existe
    const student = await this.studentRepository.findOne({
      where: { userId: studentId },
    });
    if (!student) throw new NotFoundException('Aluno não encontrado');

    // 5 — verifica se vínculo existe
    const studentClass = await this.studentClassRepository.findOne({
      where: { studentId, classId },
    });

    if (!studentClass) {
      throw new NotFoundException('O aluno não está matriculado nessa turma.');
    }

    // 6 — remove o vínculo
    await this.studentClassRepository.remove(studentClass);

    return { message: 'Aluno removido da turma com sucesso' };
  }

  async getClassRanking(classId: string) {
    // verifica se a turma existe
    const classExists = await this.classRepository.findOne({
      where: { classId },
    });
    if (!classExists) {
      throw new NotFoundException(`Turma com id ${classId} não encontrada`);
    }

    // Busca todos os alunos matriculados na turma
    const students = await this.studentClassRepository
      .createQueryBuilder('student_class')
      .leftJoinAndSelect('student_class.student', 'student')
      .leftJoinAndSelect('student.user', 'user')
      .where('student_class.classId = :classId', { classId })
      .getMany();

    // Busca todos os check-ins dos alunos dessa turma
    const checkins = await this.studentClassRepository.manager
      .getRepository(Checkin)
      .createQueryBuilder('checkin')
      .leftJoin('checkin.student', 'student')
      .leftJoin('checkin.activity', 'activity')
      .where('activity.classId = :classId', { classId })
      .orderBy('checkin.createdAt', 'ASC')
      .getMany();

    // Cada check-in vale 100 pontos. A ordem de realização em cada atividade
    // concede um bônus para desempatar alunos com a mesma quantidade.
    const bonusPorCheckin = new Map<string, number>();
    const checkinsPorAtividade = new Map<string, Checkin[]>();

    for (const checkin of checkins) {
      const grupo = checkinsPorAtividade.get(checkin.activityId) ?? [];
      grupo.push(checkin);
      checkinsPorAtividade.set(checkin.activityId, grupo);
    }

    for (const grupo of checkinsPorAtividade.values()) {
      grupo
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        .forEach((checkin, index) => {
          const bonus = index === 0 ? 10 : index === 1 ? 7 : index === 2 ? 5 : 3;
          bonusPorCheckin.set(checkin.checkinId, bonus);
        });
    }

    const ranking = students.map((sc) => {
      const checkinsDoAluno = checkins.filter(
        (checkin) => checkin.studentId === sc.studentId,
      );
      const bonusVelocidade = checkinsDoAluno.reduce(
        (total, checkin) => total + (bonusPorCheckin.get(checkin.checkinId) ?? 0),
        0,
      );
      const ultimoCheckin =
        checkinsDoAluno[checkinsDoAluno.length - 1]?.createdAt ?? null;

      return {
        studentId: sc.studentId,
        registrationStudent: sc.student.registrationStudent,
        name: sc.student.user?.name,
        checkins: checkinsDoAluno.length,
        points: checkinsDoAluno.length * 100 + bonusVelocidade,
        lastCheckinAt: ultimoCheckin,
      };
    });

    ranking.sort((a, b) => {
      if (b.checkins !== a.checkins) return b.checkins - a.checkins;
      if (b.points !== a.points) return b.points - a.points;
      if (a.lastCheckinAt && b.lastCheckinAt) {
        return a.lastCheckinAt.getTime() - b.lastCheckinAt.getTime();
      }
      if (a.lastCheckinAt) return -1;
      if (b.lastCheckinAt) return 1;
      return (a.name ?? '').localeCompare(b.name ?? '');
    });

    if (ranking.length === 0) {
      throw new NotFoundException('Ainda não há participantes nessa turma');
    }

    return ranking;
  }

  async getClassParticipants(classId: string) {
    const studentClasses = await this.studentClassRepository.find({
      where: { classId },
      relations: ['student', 'student.user'],
    });

    if (!studentClasses || studentClasses.length === 0) {
      throw new NotFoundException('Ainda não há participantes nessa turma');
    }

    return studentClasses.map((sc) => ({
      studentId: sc.studentId,
      registrationStudent: sc.student.registrationStudent,
      name: sc.student.user?.name,
      email: sc.student.user?.email,
    }));
  }

  async getStudentClasses(studentId: string) {
    const studentClasses = await this.studentClassRepository.find({
      where: { studentId },
      relations: ['class'],
    });

    return studentClasses.map((sc) => ({
      classId: sc.class.classId,
      name: sc.class.name,
      joinCode: sc.class.joinCode,
      teacherId: sc.class.teacherId,
    }));
  }
}
