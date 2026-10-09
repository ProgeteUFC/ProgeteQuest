import {
  Injectable,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  Repository,
  EntityManager,
  QueryFailedError,
} from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dtos/createUser.dto';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { UpdateUserByAdminDto } from './dtos/updateUserByAdmin.dto';
import { generateUuid } from '../utils/generateUuid';
import { Student } from 'src/student/entities/student.entity';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import { Admin } from 'src/admin/entities/admin.entity';
import { UserStatus, UserType } from 'src/Enums/user.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,

    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,

    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createUserDto: CreateUserDto) {
    // Verifica o tipo de usuário
    if (
      createUserDto.type !== 'student' &&
      createUserDto.type !== 'teacher' &&
      createUserDto.type !== 'admin'
    ) {
      throw new BadRequestException('Tipo de usuário inválido');
    }

    // Verifica se o email já está em uso
    const email = createUserDto.email.trim().toLowerCase();

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Esse registro já existe');
    }

    // Validação antecipada da matrícula com verificação cruzada
    if (createUserDto.type === 'student') {
      const reg = createUserDto.registrationStudent?.trim();

      if (!reg) {
        throw new BadRequestException('registrationStudent é obrigatório');
      }

      if (!/^\d{6}$/.test(reg)) {
        throw new BadRequestException(
          'registrationStudent deve conter exatamente 6 dígitos numéricos',
        );
      }

      const existingStudent = await this.studentRepository.findOne({
        where: { registrationStudent: reg },
      });

      const existingTeacher = await this.teacherRepository.findOne({
        where: { registrationTeacher: reg },
      });

      if (existingStudent || existingTeacher) {
        throw new ConflictException('Esse registro já existe');
      }
    } else if (createUserDto.type === 'teacher') {
      const reg = createUserDto.registrationTeacher?.trim();

      if (!reg) {
        throw new BadRequestException('registrationTeacher é obrigatório');
      }

      if (!/^\d{6}$/.test(reg)) {
        throw new BadRequestException(
          'registrationTeacher deve conter exatamente 6 dígitos numéricos',
        );
      }

      const existingTeacher = await this.teacherRepository.findOne({
        where: { registrationTeacher: reg },
      });

      const existingStudent = await this.studentRepository.findOne({
        where: { registrationStudent: reg },
      });

      if (existingTeacher || existingStudent) {
        throw new ConflictException('Esse registro já existe');
      }
    }

    // Criação e salvamento do usuário
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // O usuário e o seu perfil nascem juntos: se o perfil falhar, o usuário
    // não fica gravado pela metade (sem perfil ele nem conseguiria logar).
    const user = await this.dataSource.transaction(async (manager) => {
      const novoUsuario = manager.create(User, {
        userId: generateUuid(),
        name: createUserDto.name.trim(),
        email,
        password: hashedPassword,
        type: createUserDto.type,
      });

      await manager.save(novoUsuario);

      // Criação do vínculo com estudante, professor ou admin
      if (createUserDto.type === 'student') {
        await manager.save(Student, {
          userId: novoUsuario.userId,
          registrationStudent: createUserDto.registrationStudent?.trim(),
          user: novoUsuario,
        });
      } else if (createUserDto.type === 'teacher') {
        await manager.save(Teacher, {
          userId: novoUsuario.userId,
          registrationTeacher: createUserDto.registrationTeacher?.trim(),
          user: novoUsuario,
        });
      } else if (createUserDto.type === 'admin') {
        await manager.save(Admin, {
          userId: novoUsuario.userId,
          user: novoUsuario,
        });
      }

      return novoUsuario;
    });

    // Retorno dos dados públicos
    return {
      userId: user.userId,
      name: user.name,
      email: user.email,
    };
  }

  async findAll() {
    const users = await this.userRepository.find({
      select: ['userId', 'name', 'email', 'type', 'createdAt', 'updatedAt'],
      relations: ['students', 'teachers', 'admins'],
    });

    return users.map((user) => ({
      userId: user.userId,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      type: user.type,
    }));
  }

  async remove(userId: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { userId },
      relations: ['students', 'teachers', 'admins'],
    });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    // Valida senha
    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      throw new UnauthorizedException('Senha incorreta');
    }

    // Remove registros de administrador, se existirem
    if (user.admins && user.admins.length > 0) {
      await this.adminRepository.delete({ userId });
    }

    // Remove registros de estudante, se existirem
    if (user.students && user.students.length > 0) {
      await this.studentRepository.delete({ userId });
    }

    // Remove registros de professor, se existirem
    if (user.teachers && user.teachers.length > 0) {
      await this.teacherRepository.delete({ userId });
    }

    // Remove o usuário
    await this.userRepository.delete({ userId });

    return { message: 'Usuário removido com sucesso' };
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    const allowedFields = [
      'name',
      'email',
      'password',
      'registrationStudent',
      'registrationTeacher',
    ];

    const hasValidField = allowedFields.some((field) => {
      const value = updateUserDto[field as keyof UpdateUserDto];
      return typeof value === 'string' && value.trim() !== '';
    });

    if (!hasValidField) {
      throw new BadRequestException('Nenhum campo válido foi informado.');
    }

    const user = await this.userRepository.findOne({
      where: { userId },
      relations: ['students', 'teachers', 'admins'],
    });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    // Email
    if (typeof updateUserDto.email === 'string') {
      const email = updateUserDto.email.trim().toLowerCase();

      const existingUser = await this.userRepository.findOne({
        where: { email },
      });

      if (existingUser && existingUser.userId !== userId) {
        throw new ConflictException('Esse registro já existe');
      }

      user.email = email;
    }

    // Nome
    if (typeof updateUserDto.name === 'string') {
      user.name = updateUserDto.name.trim();
    }

    // Senha
    if (typeof updateUserDto.password === 'string') {
      user.password = await bcrypt.hash(updateUserDto.password.trim(), 10);
    }

    await this.userRepository.save(user);

    // Matrícula de estudante
    if (
      user.students &&
      user.students.length > 0 &&
      typeof updateUserDto.registrationStudent === 'string'
    ) {
      const registration = updateUserDto.registrationStudent.trim();

      const existingStudent = await this.studentRepository.findOne({
        where: { registrationStudent: registration },
        relations: ['user'],
      });

      if (
        existingStudent &&
        existingStudent.user &&
        existingStudent.user.userId !== userId
      ) {
        throw new ConflictException('Esse registro já existe');
      }

      const existingTeacher = await this.teacherRepository.findOne({
        where: { registrationTeacher: registration },
        relations: ['user'],
      });

      if (
        existingTeacher &&
        existingTeacher.user &&
        existingTeacher.user.userId !== userId
      ) {
        throw new ConflictException('Esse registro já existe');
      }

      const student = user.students[0];
      student.registrationStudent = registration;

      await this.studentRepository.save(student);
    }

    // Matrícula de professor
    if (
      user.teachers &&
      user.teachers.length > 0 &&
      typeof updateUserDto.registrationTeacher === 'string'
    ) {
      const registration = updateUserDto.registrationTeacher.trim();

      const existingTeacher = await this.teacherRepository.findOne({
        where: { registrationTeacher: registration },
        relations: ['user'],
      });

      if (
        existingTeacher &&
        existingTeacher.user &&
        existingTeacher.user.userId !== userId
      ) {
        throw new ConflictException('Esse registro já existe');
      }

      const existingStudent = await this.studentRepository.findOne({
        where: { registrationStudent: registration },
        relations: ['user'],
      });

      if (
        existingStudent &&
        existingStudent.user &&
        existingStudent.user.userId !== userId
      ) {
        throw new ConflictException('Esse registro já existe');
      }

      const teacher = user.teachers[0];
      teacher.registrationTeacher = registration;

      await this.teacherRepository.save(teacher);
    }

    return {
      userId: user.userId,
      name: user.name,
      email: user.email,
    } as const;
  }

  async updateByAdmin(userId: string, dto: UpdateUserByAdminDto) {
    const isProvided = (value: unknown) =>
      value !== undefined && value !== null;

    const hasAnyField = [
      dto.name,
      dto.email,
      dto.password,
      dto.registrationStudent,
      dto.registrationTeacher,
    ].some(isProvided);

    if (!hasAnyField) {
      throw new BadRequestException('Nenhum campo válido foi informado.');
    }

    const name = dto.name?.trim();
    const email = dto.email?.trim().toLowerCase();
    const registrationStudent = dto.registrationStudent?.trim();
    const registrationTeacher = dto.registrationTeacher?.trim();

    // O hash é calculado antes da transação: bcrypt é lento e não deve
    // manter a transação (e a trava da linha) aberta à toa.
    const hashedPassword =
      typeof dto.password === 'string'
        ? await bcrypt.hash(dto.password, 10)
        : undefined;

    try {
      return await this.dataSource.transaction(async (manager) => {
        // Sem `relations` junto com o lock: o Postgres não aceita FOR UPDATE
        // em consulta com LEFT JOIN (os perfis são carregados à parte).
        const user = await manager.findOne(User, {
          where: { userId },
          lock: { mode: 'pessimistic_write' },
        });

        if (!user) {
          throw new BadRequestException('Usuário não encontrado');
        }

        // A matrícula/SIAPE só pode ser editada conforme o perfil do usuário.
        if (
          registrationStudent !== undefined &&
          user.type !== UserType.STUDENT
        ) {
          throw new BadRequestException(
            'registrationStudent só pode ser informado para usuários do tipo student',
          );
        }

        if (
          registrationTeacher !== undefined &&
          user.type !== UserType.TEACHER
        ) {
          throw new BadRequestException(
            'registrationTeacher só pode ser informado para usuários do tipo teacher',
          );
        }

        if (email !== undefined && email !== user.email) {
          const emailOwner = await manager.findOne(User, { where: { email } });

          if (emailOwner && emailOwner.userId !== userId) {
            throw new ConflictException('Esse registro já existe');
          }

          user.email = email;
        }

        if (name !== undefined) {
          user.name = name;
        }

        if (hashedPassword !== undefined) {
          user.password = hashedPassword;
        }

        await manager.save(user);

        let currentStudentRegistration: string | undefined;
        let currentTeacherRegistration: string | undefined;

        if (user.type === UserType.STUDENT) {
          const student = await manager.findOne(Student, { where: { userId } });

          if (registrationStudent !== undefined) {
            if (!student) {
              throw new BadRequestException(
                'Perfil de aluno não encontrado para este usuário',
              );
            }

            if (registrationStudent !== student.registrationStudent) {
              await this.assertRegistrationAvailable(
                manager,
                registrationStudent,
                userId,
              );
              student.registrationStudent = registrationStudent;
              await manager.save(student);
            }
          }

          currentStudentRegistration = student?.registrationStudent;
        }

        if (user.type === UserType.TEACHER) {
          const teacher = await manager.findOne(Teacher, { where: { userId } });

          if (registrationTeacher !== undefined) {
            if (!teacher) {
              throw new BadRequestException(
                'Perfil de professor não encontrado para este usuário',
              );
            }

            if (registrationTeacher !== teacher.registrationTeacher) {
              await this.assertRegistrationAvailable(
                manager,
                registrationTeacher,
                userId,
              );
              teacher.registrationTeacher = registrationTeacher;
              await manager.save(teacher);
            }
          }

          currentTeacherRegistration = teacher?.registrationTeacher;
        }

        return {
          userId: user.userId,
          name: user.name,
          email: user.email,
          type: user.type,
          registrationStudent: currentStudentRegistration,
          registrationTeacher: currentTeacherRegistration,
        };
      });
    } catch (error) {
      // Rede de segurança: duas edições simultâneas com o mesmo e-mail ou
      // matrícula são barradas pelo UNIQUE do banco (código 23505).
      if (
        error instanceof QueryFailedError &&
        (error as QueryFailedError & { driverError?: { code?: string } })
          .driverError?.code === '23505'
      ) {
        throw new ConflictException('Esse registro já existe');
      }

      throw error;
    }
  }

  private async assertRegistrationAvailable(
    manager: EntityManager,
    registration: string,
    userId: string,
  ) {
    const student = await manager.findOne(Student, {
      where: { registrationStudent: registration },
    });

    if (student && student.userId !== userId) {
      throw new ConflictException('Esse registro já existe');
    }

    const teacher = await manager.findOne(Teacher, {
      where: { registrationTeacher: registration },
    });

    if (teacher && teacher.userId !== userId) {
      throw new ConflictException('Esse registro já existe');
    }
  }

  async findOne(userId: string) {
    const user = await this.userRepository.findOne({
      where: { userId },
      relations: ['students', 'teachers', 'admins'],
    });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    return {
      userId: user.userId,
      name: user.name,
      email: user.email,
      type: user.type,
      registrationStudent: user.students?.[0]?.registrationStudent,
      registrationTeacher: user.teachers?.[0]?.registrationTeacher,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async deactivate(userId: string, adminId: string, reason: string) {
    if (userId === adminId) {
      throw new BadRequestException('Você não pode desativar a própria conta');
    }

    return this.dataSource.transaction(async (manager) => {
      const activeAdmins = await manager
        .createQueryBuilder(User, 'user')
        .setLock('pessimistic_write')
        .where('user.type = :type', { type: UserType.ADMIN })
        .andWhere('user.status = :status', { status: UserStatus.ACTIVE })
        .orderBy('user.user_id', 'ASC')
        .getMany();

      const user = await manager.findOne(User, {
        where: { userId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!user) {
        throw new BadRequestException('Usuário não encontrado');
      }

      if (user.status === UserStatus.INACTIVE) {
        return {
          userId: user.userId,
          status: user.status,
          message: 'Usuário já estava inativo',
        };
      }

      if (user.type === UserType.ADMIN && activeAdmins.length <= 1) {
        throw new BadRequestException(
          'Não é possível desativar o último administrador ativo',
        );
      }

      user.status = UserStatus.INACTIVE;
      user.deactivatedAt = new Date();
      user.deactivatedBy = adminId;
      user.deactivationReason = reason;

      await manager.save(user);

      return {
        userId: user.userId,
        status: user.status,
        deactivatedAt: user.deactivatedAt,
        deactivatedBy: user.deactivatedBy,
        deactivationReason: user.deactivationReason,
      };
    });
  }

  async activate(userId: string) {
    const user = await this.userRepository.findOne({ where: { userId } });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    // Idempotente: se já está ativo, não faz nada e retorna sucesso
    if (user.status === UserStatus.ACTIVE) {
      return {
        userId: user.userId,
        status: user.status,
        message: 'Usuário já estava ativo',
      };
    }

    user.status = UserStatus.ACTIVE;
    user.deactivatedAt = null;
    user.deactivatedBy = null;
    user.deactivationReason = null;

    await this.userRepository.save(user);

    return { userId: user.userId, status: user.status };
  }
}
